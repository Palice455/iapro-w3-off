import {
  Connection,
  PublicKey,
  Signer,
  TransactionInstruction,
} from "@solana/web3.js"
import { getAssociatedTokenAddress } from "@solana/spl-token"
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata/dist/src/generated"
import { TransactionHelper } from "../helper"
import { Program } from "@coral-xyz/anchor"
import { GRANTS_TYPE, GrantsAccountType } from "../config"

export class ProgramInitializer {
  readonly program: Program
  readonly payer: Signer
  readonly programOwner: Signer
  readonly txHelper: TransactionHelper
  readonly grants: Map<GrantsAccountType, PublicKey>
  private admin: PublicKey
  private airdropOP: PublicKey

  // Program config addresses
  private configAddress: PublicKey
  // Token mint address
  private readonly mintAddress: PublicKey
  // Token metadata address
  private tokenMetadataAddress: PublicKey
  // Airdrop hot wallet address
  private airdropHotWalletAddress: PublicKey

  constructor(
    program: Program,
    connection: Connection,
    payer: Signer,
    programOwner: Signer,
    grants: Map<GrantsAccountType, PublicKey>,
    admin: PublicKey,
    airdropOP: PublicKey
  ) {
    this.program = program
    this.programOwner = programOwner
    this.payer = payer
    this.txHelper = new TransactionHelper(connection, payer, program)
    this.grants = grants
    this.admin = admin
    this.airdropOP = airdropOP
    this.configAddress = this.txHelper.getProgramConfigAddress()
    this.mintAddress = this.txHelper.getMintAddress()
    // Token metadata address
    this.tokenMetadataAddress = this.txHelper.getTokenMetadataAddress(
      this.mintAddress
    )
    this.airdropHotWalletAddress = this.txHelper.getAirdropHotWalletAddress()
  }

  private async getTokenAddress(owner: PublicKey): Promise<PublicKey> {
    return getAssociatedTokenAddress(this.mintAddress, owner)
  }

  public async initProgram() {
    console.log("Executing initializeProgramConfig instruction")
    const initInstructions: TransactionInstruction[] = []
    const initProgramConfigIx = await this.program.methods
      .initializeProgramConfig()
      .accounts({
        programConfig: this.configAddress,
        admin: this.admin,
        airdropOp: this.airdropOP,
        payer: this.payer.publicKey,
        programOwner: this.programOwner.publicKey,
      })
      .instruction()

    const initTokenIx = await this.program.methods
      .initializeToken()
      .accounts({
        payer: this.payer.publicKey,
        programOwner: this.programOwner.publicKey,
        mint: this.mintAddress,
        metadataAccount: this.tokenMetadataAddress,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      })
      .instruction()

    const initHotWalletIx = await this.program.methods
      .initializeHotWallets()
      .accounts({
        airdropHotWallet: this.airdropHotWalletAddress,
        payer: this.payer.publicKey,
        mint: this.mintAddress,
      })
      .instruction()

    initInstructions.push(initProgramConfigIx, initTokenIx, initHotWalletIx)
    const initSignature = await this.txHelper.sendV0Transaction(
      initInstructions,
      [this.programOwner]
    )
    await this.txHelper.waitToConfirm(initSignature)

    // Grants tokens
    await this.grantsToken()
  }

  /// Grants tokens to the specified account
  async grantsToken() {
    console.log("Executing grant instructions")
    const instructions: TransactionInstruction[] = []
    for (let [accountType, userAddress] of this.grants) {
      const type = GRANTS_TYPE.get(accountType)
      const tokenAddress = await this.getTokenAddress(userAddress)
      const instruction = await this.program.methods
        .grantsToken(type)
        .accounts({
          programConfig: this.configAddress,
          userAccount: userAddress,
          userTokenAccount: tokenAddress,
          mint: this.mintAddress,
          payer: this.payer.publicKey,
          programOwner: this.programOwner.publicKey,
        })
        .instruction()
      instructions.push(instruction)
    }
    const signature = await this.txHelper.sendV0Transaction(instructions, [
      this.programOwner,
    ])
    await this.txHelper.waitToConfirm(signature)
  }
}
