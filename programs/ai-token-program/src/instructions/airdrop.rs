use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer};

use crate::consts::*;
use crate::error::CustomErr;
use crate::instructions::ProgramConfig;

#[derive(Accounts)]
pub struct Airdrop<'info> {
    /// Account to store the program configuration
    #[account(seeds = [PROGRAM_CONFIG_SEED], bump)]
    program_config: Account<'info, ProgramConfig>,

    /// Used to airdrop IBIA tokens. Controlled by the program and only hold a small amount of IBIA token
    #[account(
    mut,
    seeds = [AIRDROP_HOT_WALLET_SEED],
    bump,
    token::mint = mint,
    token::authority = airdrop_hot_wallet,
    )]
    airdrop_hot_wallet: Account<'info, TokenAccount>,

    /// CHECK: User account. This is safe because it's only used as authority of the
    /// user's associated token account, we don't need to access the data.
    user_account: UncheckedAccount<'info>,

    /// Computing provider's IBIA token account
    #[account(
    init_if_needed,
    payer = payer,
    associated_token::mint = mint,
    associated_token::authority = user_account,
    )]
    user_token_account: Account<'info, TokenAccount>,

    /// IBIA token mint account
    #[account(
    seeds = [MINT_SEED],
    bump,
    mint::authority = mint,
    )]
    mint: Account<'info, Mint>,

    /// The project admin account
    #[account(mut, address = program_config.airdrop_op)]
    payer: Signer<'info>,

    token_program: Program<'info, Token>,
    associated_token_program: Program<'info, AssociatedToken>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
}

/// Airdrop IBIA token to user
pub fn process_airdrop(ctx: Context<Airdrop>, amount: u64) -> Result<()> {
    // Check if there were enough IBIA token in the social hot wallet
    if ctx.accounts.airdrop_hot_wallet.amount < amount {
        return err!(CustomErr::AirdropInsufficientBalance);
    }

    let cpi_accounts = Transfer {
        from: ctx.accounts.airdrop_hot_wallet.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.airdrop_hot_wallet.to_account_info(),
    };
    let signer_seed: &[&[&[u8]]] = &[&[AIRDROP_HOT_WALLET_SEED, &[ctx.bumps.airdrop_hot_wallet]]];
    // Transfer IBIA token to user's token account
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seed,
        ),
        amount,
    )?;
    Ok(())
}
