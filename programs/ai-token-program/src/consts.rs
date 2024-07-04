/// The seed for the program config PDA
pub const PROGRAM_CONFIG_SEED: &[u8] = b"Program Config";

/// The seed for IBIA token mint account
pub const MINT_SEED: &[u8] = b"mint";

/// The seed of Airdrop hot wallet
pub const AIRDROP_HOT_WALLET_SEED: &[u8] = b"Airdrop Hot Wallet";

/// IBIA token total supply
pub const MINT_TOTAL_SUPPLY: u64 = 1_000_000_000_000_000;

/// IBIA token decimals
pub const MINT_DECIMALS: u8 = 6;

/// Numbers of IBIA token mint to foundation
pub const FOUNDATION_AMOUNT: u64 = (MINT_TOTAL_SUPPLY as f64 * 0.8) as u64;

/// Numbers of IBIA token mint to DEX
pub const DEX_AMOUNT: u64 = (MINT_TOTAL_SUPPLY as f64 * 0.01) as u64;

/// Numbers of IBIA token mint to IDO
pub const IDO_AMOUNT: u64 = (MINT_TOTAL_SUPPLY as f64 * 0.07) as u64;

/// Numbers of IBIA token mint to Consulting
pub const CONSULTING_AMOUNT: u64 = (MINT_TOTAL_SUPPLY as f64 * 0.03) as u64;

/// Numbers of IBIA token mint to airdrop
pub const AIRDROP_AMOUNT: u64 = (MINT_TOTAL_SUPPLY as f64 * 0.02) as u64;

/// Numbers of IBIA token mint to other accounts
pub const OTHER_AMOUNT: u64 = (MINT_TOTAL_SUPPLY as f64 * 0.07) as u64;

pub const TOKEN_NAME: &str = "iApro";

pub const TOKEN_SYMBOL: &str = "IPO";

pub const TOKEN_URI: &str = "https://bronze-worried-ox-400.mypinata.cloud/ipfs/QmYwAK7nihahokcrutGRa859opgAjuA5ZtQ4TJ5ffAc44X";
