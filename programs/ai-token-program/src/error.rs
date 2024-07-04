use anchor_lang::error_code;

#[error_code]
pub enum CustomErr {
    #[msg("Invalid account type to mint IBIA token")]
    InitialInvalidAccountType,
    #[msg("Account already initialized")]
    AccountAlreadyInitialized,
    #[msg("Deposit fail, insufficient USDC")]
    DepositInsufficientUSDC,
    #[msg("Social account not initialized")]
    SocialAccountNotInitialized,
    #[msg("Social USDC account is not equal to the expected account")]
    InvalidSocialUSDCAccount,
    #[msg("Not enough IBIA token balance available for hot wallet deposit")]
    HotWalletDepositInsufficientToken,
    #[msg("Invalid hot wallet account")]
    InvalidHotWallet,
    #[msg("Airdrop not enough IBIA token balance available")]
    AirdropInsufficientBalance,
}
