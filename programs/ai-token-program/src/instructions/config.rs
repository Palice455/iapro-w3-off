use crate::ID;
use anchor_lang::context::Context;
use anchor_lang::prelude::*;
use anchor_lang::{account, Accounts};
use solana_program::pubkey::Pubkey;
use solana_program::rent::Rent;

use crate::consts::*;

#[derive(Accounts)]
pub struct InitializeProgramConfig<'info> {
    /// Account to store the program configuration
    #[account(
    init,
    seeds = [PROGRAM_CONFIG_SEED],
    bump,
    payer = payer,
    space = ProgramConfig::LEN,
    )]
    program_config: Box<Account<'info, ProgramConfig>>,

    /// Pay the rent for the initialized accounts
    #[account(mut)]
    payer: Signer<'info>,

    /// CHECK: Admin account. We don't need to access the data
    admin: UncheckedAccount<'info>,

    /// CHECK: Airdrop operator account. We don't need to access the data
    airdrop_op: UncheckedAccount<'info>,

    /// Only the program owner (which hold program private key) can init the program config
    #[account(address = ID)]
    program_owner: Signer<'info>,

    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
}

#[account]
pub struct ProgramConfig {
    /// Whether the accounts were initialized. The order is the same as the [AccountType] enum
    ///
    /// NOTE: Cannot use const value in array type declaration like: [bool; AccountType::LEN],
    /// because that will fail to generate idl for the program in anchor v0.29.0
    pub initialize_list: [bool; 6],
    /// The admin of the program
    /// Some operations can only be performed by the admin
    pub admin: Pubkey,
    /// The airdrop operator account
    /// Only the airdrop operator can perform airdrop operations
    pub airdrop_op: Pubkey,
}

impl ProgramConfig {
    pub const LEN: usize = 8 + 8 * 6 + 32 * 2;
}

#[derive(Accounts)]
pub struct ChangeAirdropOP<'info> {
    /// Account to store the program configuration
    #[account(
    mut,
    seeds = [PROGRAM_CONFIG_SEED],
    bump,
    )]
    program_config: Account<'info, ProgramConfig>,

    #[account(address = program_config.admin)]
    admin: Signer<'info>,

    /// CHECK: New airdrop operator account. We don't need to access the data
    airdrop_op: UncheckedAccount<'info>,
}

/// Initialize the program configuration
pub fn process_initialize_program_config(ctx: Context<InitializeProgramConfig>) -> Result<()> {
    ctx.accounts.program_config.admin = *ctx.accounts.admin.key;
    ctx.accounts.program_config.airdrop_op = *ctx.accounts.airdrop_op.key;
    Ok(())
}

/// Change airdrop operator. Only the admin can perform this operation
pub fn process_change_airdrop_op(ctx: Context<ChangeAirdropOP>) -> Result<()> {
    ctx.accounts.program_config.airdrop_op = *ctx.accounts.airdrop_op.key;
    Ok(())
}
