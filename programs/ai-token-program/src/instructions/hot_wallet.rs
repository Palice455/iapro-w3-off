use anchor_lang::prelude::*;
use anchor_lang::Accounts;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::consts::*;

#[derive(Accounts)]
pub struct InitializeHotWallets<'info> {
    /// Pay the rent for the initialized accounts
    #[account(mut)]
    payer: Signer<'info>,

    /// This account is controlled by the program and only hold a small amount of IBIA token
    #[account(
    init,
    seeds = [AIRDROP_HOT_WALLET_SEED],
    bump,
    payer = payer,
    token::mint = mint,
    token::authority = airdrop_hot_wallet,
    )]
    airdrop_hot_wallet: Box<Account<'info, TokenAccount>>,

    /// IBIA token mint account
    #[account(
    seeds = [MINT_SEED],
    bump,
    mint::authority = mint,
    )]
    mint: Account<'info, Mint>,

    token_program: Program<'info, Token>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
}

/// Initialize the hot wallets
pub fn process_initial_hot_wallets(_: Context<InitializeHotWallets>) -> Result<()> {
    Ok(())
}
