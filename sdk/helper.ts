import {
  AddressLookupTableAccount,
  AddressLookupTableProgram,
  Connection,
  Keypair,
  PublicKey,
  Signer,
  TransactionInstruction,
  TransactionMessage,
  TransactionMessageArgs,
  TransactionSignature,
  VersionedTransaction,
  VersionedTransactionResponse,
} from "@solana/web3.js"
import {
  AI_TOKEN_MINT_SEED,
  PROGRAM_CONFIG_SEED,
  AIRDROP_HOT_WALLET_SEED,
} from "./config"
import { AnchorError, Program } from "@coral-xyz/anchor"
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { TransactionRef } from "./models"
import fs from "fs"
import * as spl from "@solana/spl-token"
import { getAssociatedTokenAddress } from "@solana/spl-token"

export class TransactionHelper {
  private readonly connection: Connection
  private readonly payer: Signer
  private readonly program: Program

  constructor(connection: Connection, payer: Signer, program: Program) {
    this.connection = connection
    this.payer = payer
    this.program = program
  }

  // Get IBIA token metadata account address
  getTokenMetadataAddress(mint: PublicKey): PublicKey {
    const [metadataAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
    return metadataAddress
  }

  // Get program config account address
  getProgramConfigAddress(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(PROGRAM_CONFIG_SEED)],
      this.program.programId
    )[0]
  }

  // Get IBIA token mint address
  getMintAddress(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(AI_TOKEN_MINT_SEED)],
      this.program.programId
    )[0]
  }

  // Get computer provider hot wallet address
  getAirdropHotWalletAddress(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(AIRDROP_HOT_WALLET_SEED)],
      this.program.programId
    )[0]
  }

  // Get IBIA token mint address
  getIBIAMintAddress(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(AI_TOKEN_MINT_SEED)],
      this.program.programId
    )[0]
  }

  /**
   * Send a versioned transaction
   *
   * @param instructions Transaction instructions
   * @param extraSigners Extra signers
   * @param lookupTables lookup table addresses
   */
  async sendV0Transaction(
    instructions: Array<TransactionInstruction>,
    extraSigners?: Signer[],
    lookupTables?: PublicKey[]
  ): Promise<TransactionSignature> {
    const { blockhash } = await this.connection.getLatestBlockhash()
    let lookupTableAccounts: AddressLookupTableAccount[] | undefined = undefined
    if (lookupTables) {
      lookupTableAccounts = await Promise.all(
        lookupTables.map((addr) => this.getAddressLookupTableAccount(addr))
      )
    }

    // Construct v0 message
    const txMessage = new TransactionMessage({
      payerKey: this.payer.publicKey,
      recentBlockhash: blockhash,
      instructions,
    } as TransactionMessageArgs).compileToV0Message(lookupTableAccounts)
    // Construct transaction
    const tx = new VersionedTransaction(txMessage)
    tx.sign([this.payer, ...(extraSigners ?? [])])
    return this.connection.sendTransaction(tx)
  }

  /**
   * Wait until block height grow larger than {growNum}
   *
   * @param growNum Waiting for the number of block height to grow
   */

  waitForNewBlock(growNum: number) {
    console.log(`Waiting for ${growNum} new block`)
    return new Promise(async (resolve: any) => {
      // Get the latest block hash before waiting
      const { lastValidBlockHeight } =
        await this.connection.getLatestBlockhash()
      // Wait for the block height to grow
      const intervalId = setInterval(async () => {
        const block = await this.connection.getLatestBlockhash()
        if (block.lastValidBlockHeight > lastValidBlockHeight + growNum) {
          clearInterval(intervalId)
          resolve()
        }
      }, 1000)
    })
  }

  /**
   * Wait for the transaction to be confirmed
   *
   * @param signature Transaction signature
   */

  async waitToConfirm(signature: TransactionSignature) {
    const { blockhash, lastValidBlockHeight } =
      await this.connection.getLatestBlockhash()
    await this.connection.confirmTransaction(
      {
        blockhash,
        lastValidBlockHeight,
        signature,
      },
      "confirmed"
    )
  }

  /**
   * Initialize an address lookup table with provided addresses
   *
   * @param addresses Addresses to be added to the lookup table
   * @returns Address of the lookup table
   */
  async createLookupTable(addresses: PublicKey[]): Promise<PublicKey> {
    // Recent slot, use to derive lookup table's address
    const slot = await this.connection.getSlot()
    // Create an instruction for creating a lookup table and retrieve the address of the lookup table
    const [lookupTableIx, lookupTableAddr] =
      AddressLookupTableProgram.createLookupTable({
        authority: this.payer.publicKey,
        payer: this.payer.publicKey,
        recentSlot: slot - 1,
      })
    // Create an instruction to extend a lookup table with provided addresses
    const extendIx = AddressLookupTableProgram.extendLookupTable({
      payer: this.payer.publicKey,
      authority: this.payer.publicKey,
      lookupTable: lookupTableAddr,
      // Addresses to be added to the lookup table, cannot add too many addresses at once
      addresses: addresses.splice(0, 30),
    })
    // Send the transaction to create and extend the lookup table
    const signature = await this.sendV0Transaction([lookupTableIx, extendIx])
    await this.waitToConfirm(signature)

    let waitBlocks = 1
    while (addresses.length > 0) {
      const toAdd = addresses.splice(0, 30)
      const extendIx = AddressLookupTableProgram.extendLookupTable({
        payer: this.payer.publicKey,
        authority: this.payer.publicKey,
        lookupTable: lookupTableAddr,
        addresses: toAdd,
      })
      await this.sendV0Transaction([extendIx])
      waitBlocks++
    }
    // Wait for address lookup table to be available
    await this.waitForNewBlock(waitBlocks)

    return lookupTableAddr
  }

  // Close the lookup table. This will deactivate the lookup table first, will spend quite a long time (approximately 513 blocks)
  async closeLookupTable(lookupTable: PublicKey) {
    // Deactivate the lookup table first. Cannot close an active lookup table
    const deactivateIx = AddressLookupTableProgram.deactivateLookupTable({
      lookupTable,
      authority: this.payer.publicKey,
    })
    await this.sendV0Transaction([deactivateIx])

    // Lookup table will be deactivated after 513 block
    await this.waitForNewBlock(513)

    // Close deactivated lookup table
    const closeIx = AddressLookupTableProgram.closeLookupTable({
      lookupTable,
      authority: this.payer.publicKey,
      // Who get the rent back
      recipient: this.payer.publicKey,
    })
    await this.sendV0Transaction([closeIx])
  }

  async getAddressLookupTableAccount(
    address: PublicKey
  ): Promise<AddressLookupTableAccount> {
    const lookupTable = await this.connection.getAddressLookupTable(address)
    if (!lookupTable.value) {
      throw new Error("Failed to get address lookup table account")
    }
    return lookupTable.value
  }

  async getTransactionInfo({
    signature,
    reference,
  }: TransactionRef): Promise<VersionedTransactionResponse | null> {
    if (!signature && !reference) {
      throw new Error("Must provide either signature or reference")
    }

    if (signature) {
      return this.getTransactionInfoBySignature(signature)
    }

    const signatures = await this.connection.getSignaturesForAddress(
      new PublicKey(reference),
      {},
      "confirmed"
    )
    if (signatures.length === 0) {
      return null
    }

    return this.getTransactionInfoBySignature(signatures[0].signature)
  }

  async getTransactionInfoBySignature(
    signature: string
  ): Promise<VersionedTransactionResponse | null> {
    const transaction = await this.connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    })
    if (transaction === null) {
      return null
    }
    return transaction
  }

  /// Transfer IBIA token from owner's account to hot wallet
  async transferToHotWallet(
    owner: Signer,
    to: PublicKey,
    amount: number
  ): Promise<string> {
    const mint = this.getMintAddress()
    const fromTokenAddress = await getAssociatedTokenAddress(
      mint,
      owner.publicKey
    )
    return spl.transfer(
      this.connection,
      this.payer,
      fromTokenAddress,
      to,
      owner,
      amount
    )
  }
}

export function printError(e: any) {
  if (e.logs) {
    console.error("Program executing error: ", e.message ?? "")
    console.error("logs: \n", JSON.stringify(e.logs, null, 2))
    return
  }
  console.error("Program executing error: ", e)
}

export function isCustomError(e: any, errCode: string): boolean {
  return e instanceof AnchorError && e.error.errorCode.code === errCode
}

// Get keypair from file
export function getKeyPairFromPath(path: string): Keypair | null {
  try {
    let data = fs.readFileSync(path, "utf-8")
    return Keypair.fromSecretKey(new Uint8Array(JSON.parse(data)))
  } catch (e) {
    return null
  }
}
