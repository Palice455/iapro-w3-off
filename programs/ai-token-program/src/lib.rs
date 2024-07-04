use anchor_lang::prelude::*;

use instructions::*;

mod consts;
mod error;
mod instructions;

declare_id!("9E5KGHPmNMf3RTEuRD19xV3oXzkZZJirCukD5GuXoVn");

#[program]
pub mod ai_token_program {
    use super::*;

    /// Initialize the program configuration
    pub fn initialize_program_config(ctx: Context<InitializeProgramConfig>) -> Result<()> {
        process_initialize_program_config(ctx)
    }

    /// Initialize IBIA token. Create token mint account and metadata account
    pub fn initialize_token(ctx: Context<InitializeToken>) -> Result<()> {
        process_initialize_token(ctx)
    }

    /// Initialize the hot wallets
    pub fn initialize_hot_wallets(ctx: Context<InitializeHotWallets>) -> Result<()> {
        process_initial_hot_wallets(ctx)
    }

    /// Grants IBIA token to ICO, IDO, Social, etc.
    /// This is a one-time operation during the initial setup.
    ///
    /// #[account_type] specifies the type of account to grants IBIA token to
    pub fn grants_token(ctx: Context<TokenGrants>, account_type: u8) -> Result<()> {
        process_token_grants(ctx, account_type)
    }

    /// Airdrop IBIA token to user
    pub fn airdrop(ctx: Context<Airdrop>, amount: u64) -> Result<()> {
        process_airdrop(ctx, amount)
    }

    /// Change the airdrop operator account
    pub fn change_airdrop_op(ctx: Context<ChangeAirdropOP>) -> Result<()> {
        process_change_airdrop_op(ctx)
    }
}
