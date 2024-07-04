import { Airdrop, AirdropResult } from "../models"
import { printError, TransactionHelper } from "../helper"
import BN from "bn.js"
import {
  Connection,
  PublicKey,
  Signer,
  TransactionInstruction,
} from "@solana/web3.js"
import { Program } from "@coral-xyz/anchor"

/**
 * Maximum number of airdrop instruction in a single transaction
 */
const TX_LIMIT = 8

/**
 * Rate limit for sending airdrop transactions
 */
const RATE_LIMIT = 5

/**
 * Send airdrop transaction
 *
 * @param program The IBIA token program
 * @param connection The connection to the Solana network
 * @param signer The airdrop operator's account, used to sign the airdrop transaction
 * @param airdropUsers airdrop data for computing providers
 */
export async function sendAirdrop(
  program: Program,
  connection: Connection,
  signer: Signer,
  airdropUsers: Airdrop[]
) {
  const txHelper = new TransactionHelper(connection, signer, program)

  // Construct airdrop instructions
  const buildAirdropIx = async (airdrop: Airdrop) => {
    const mintAddress = txHelper.getIBIAMintAddress()
    const airdropHotWalletAddress = txHelper.getAirdropHotWalletAddress()
    const programConfigAddress = txHelper.getProgramConfigAddress()
    return program.methods
      .airdrop(new BN(airdrop.amount))
      .accounts({
        programConfig: programConfigAddress,
        airdropHotWallet: airdropHotWalletAddress,
        userAccount: airdrop.account,
        userTokenAccount: airdrop.tokenAccount,
        mint: mintAddress,
        payer: signer.publicKey,
      })
      .instruction()
  }
  // If we need send multiple transactions
  const needBatch = airdropUsers.length > TX_LIMIT

  // Instructions for all airdrop users
  const pendingIxs: Promise<TransactionInstruction>[] = []
  // Build instructions
  for (const airdrop of airdropUsers) {
    const airdropIx = buildAirdropIx(airdrop)
    pendingIxs.push(airdropIx)
  }

  const sendAirdropTransaction = async (
    offset: number = 0
  ): Promise<AirdropResult> => {
    const end = offset + TX_LIMIT
    const curAirdrops = airdropUsers.slice(offset, end)
    const curPendingIxs = pendingIxs.slice(offset, end)
    const curRes: AirdropResult = { success: [], failed: [] }
    try {
      const instructions: TransactionInstruction[] = await Promise.all(
        curPendingIxs
      )
      const signature = await txHelper.sendV0Transaction(instructions)
      await txHelper.waitToConfirm(signature)
      curRes.success.push({
        signature,
        addresses: curAirdrops.map((i) => i.account.toBase58()),
      })
    } catch (e) {
      printError(e)
      curRes.failed = curAirdrops.map((i) => i.account.toBase58())
    }
    return curRes
  }

  // Send single transaction for all airdropUsers
  if (!needBatch) {
    return sendAirdropTransaction()
  }

  // Send multiple transactions for all airdropUsers
  let txCount = 0
  const res: AirdropResult = { success: [], failed: [] }
  const pendingTxs: Promise<void>[] = []
  let offset = 0
  while (offset < airdropUsers.length) {
    if (txCount >= RATE_LIMIT) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      txCount = 0
    }

    const pendingTx = sendAirdropTransaction(offset).then((curRes) => {
      if (curRes.success.length > 0) {
        res.success.push(...curRes.success)
      } else {
        res.failed.push(...curRes.failed)
      }
    })

    pendingTxs.push(pendingTx)
    offset += TX_LIMIT
    txCount++
  }
  await Promise.all(pendingTxs)

  return res
}

/**
 * Change airdrop operator
 *
 * @param program The IBIA token program
 * @param connection The connection to the Solana network
 * @param wallet The wallet of the airdrop operator
 * @param admin The admin of the program
 * @param newAirdropOP The new airdrop operator
 */
export async function changeAirdropOP(
  program: Program,
  connection: Connection,
  wallet: Signer,
  admin: Signer,
  newAirdropOP: PublicKey
) {
  const txHelper = new TransactionHelper(connection, wallet, program)
  const programConfigAddress = txHelper.getProgramConfigAddress()

  const signature = await program.methods
    .changeAirdropOp()
    .accounts({
      programConfig: programConfigAddress,
      admin: admin.publicKey,
      airdropOp: newAirdropOP,
    })
    .signers([admin])
    .rpc()

  await txHelper.waitToConfirm(signature)
}
