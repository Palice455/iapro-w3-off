// The seed for the program config PDA

export const PROGRAM_CONFIG_SEED = "Program Config"

// The seed for IBIA token mint account
export const AI_TOKEN_MINT_SEED = "mint"

// The seed of airdrop hot wallet IBIA token account
export const AIRDROP_HOT_WALLET_SEED = "Airdrop Hot Wallet"

export type GrantsAccountType =
  | "Foundation"
  | "DEX"
  | "IDO"
  | "Consulting"
  | "Airdrop"
  | "Others"

// The account type used in the program
export const GRANTS_TYPE: Map<GrantsAccountType, number> = new Map([
  ["Foundation", 0],
  ["DEX", 1],
  ["IDO", 2],
  ["Consulting", 3],
  ["Airdrop", 4],
  ["Others", 5],
])
