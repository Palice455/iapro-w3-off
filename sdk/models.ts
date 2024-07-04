import { PublicKey } from "@solana/web3.js"

export interface TransactionRef {
  signature?: string
  reference?: string
}

export interface Airdrop {
  // Computing provider account
  account: PublicKey
  // Computing provider's IBIA token account
  tokenAccount: PublicKey
  // Airdrop amount
  amount: number
}

export interface AirdropResult {
  // Transaction signatures and corresponding user addresses of
  // succeeded transaction
  success: { signature: string; addresses: string[] }[]
  // User's addresses of failed transaction
  failed: string[]
}
