import {
  Connection,
  PublicKey,
  Signer,
  TransactionSignature,
} from "@solana/web3.js"
import { getAssociatedTokenAddress } from "@solana/spl-token"
import BN from "bn.js"
import { Program } from "@coral-xyz/anchor"
import { TransactionHelper } from "../helper"

/**
 * Deposit USDC
 *
 * @param program The IBIA token program
 * @param connection The connection to the Solana network
 * @param user The deposit user account, need to sign the transaction
 * @param reference The reference account address, used to trace transaction
 * @param amount The amount of USDC to deposit
 * @param usdcMint The USDC mint address
 */
export async function deposit(
  program: Program,
  connection: Connection,
  user: Signer,
  reference: string,
  amount: bigint,
  usdcMint: PublicKey
): Promise<TransactionSignature> {
  const txHelper = new TransactionHelper(connection, user, program)
  const configAddress = txHelper.getProgramConfigAddress()
  // @ts-ignore
  const config: ProgramConfig = await program.account.programConfig.fetch(
    configAddress
  )
  const walletUSDCAddress = await getAssociatedTokenAddress(
    usdcMint,
    user.publicKey
  )

  const signature = await program.methods
    .deposit(new BN(Number(amount), "le"))
    .accounts({
      programConfig: configAddress,
      user: user.publicKey,
      userUsdcAccount: walletUSDCAddress,
      usdcMint: usdcMint,
      socialUsdcAccount: config.socialUsdcAccount,
    })
    .remainingAccounts([
      {
        pubkey: new PublicKey(reference),
        isSigner: false,
        isWritable: false,
      },
    ])
    .signers([user])
    .rpc()
  await txHelper.waitToConfirm(signature)
  return signature
}
