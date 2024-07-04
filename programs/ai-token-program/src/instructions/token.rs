use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::metadata::{
    create_metadata_accounts_v3,
    mpl_token_metadata::{accounts::Metadata as MetadataHelper, types::DataV2},
    CreateMetadataAccountsV3, Metadata,
};
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};

use crate::consts::*;
use crate::error::CustomErr;
use crate::instructions::config::ProgramConfig;
use crate::ID;

pub const ACCOUNT_GRANTS_AMOUNT: [u64; 6] = [
    FOUNDATION_AMOUNT,
    DEX_AMOUNT,
    IDO_AMOUNT,
    CONSULTING_AMOUNT,
    AIRDROP_AMOUNT,
    OTHER_AMOUNT,
];

#[derive(Accounts)]
pub struct InitializeToken<'info> {
    /// Pay the rent for the initialized accounts
    #[account(mut)]
    payer: Signer<'info>,

    /// IBIA token mint account
    #[account(
    init,
    seeds = [MINT_SEED],
    bump,
    payer = payer,
    mint::decimals = MINT_DECIMALS,
    mint::authority = mint,
    mint::freeze_authority = mint,
    )]
    mint: Box<Account<'info, Mint>>,

    /// CHECK: Validated address using constraint
    #[account(
    mut,
    address=MetadataHelper::find_pda(&mint.key()).0
    )]
    pub metadata_account: UncheckedAccount<'info>,

    /// Only the program owner (which hold program private key) can create token account
    #[account(address = ID)]
    program_owner: Signer<'info>,

    token_program: Program<'info, Token>,
    system_program: Program<'info, System>,
    token_metadata_program: Program<'info, Metadata>,
    rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct TokenGrants<'info> {
    /// Account to store the program configuration
    #[account(mut, seeds = [PROGRAM_CONFIG_SEED], bump)]
    program_config: Account<'info, ProgramConfig>,

    /// CHECK: we don't need to access the data
    user_account: UncheckedAccount<'info>,

    /// Associated IBIA token account for [user_account]
    #[account(
      init,
      payer = payer,
      associated_token::mint = mint,
      associated_token::authority = user_account,
    )]
    user_token_account: Account<'info, TokenAccount>,

    /// Pay the rent for the initialized accounts
    #[account(mut)]
    payer: Signer<'info>,

    /// Only the program owner (which hold program private key) can grant tokens
    #[account(address = ID)]
    program_owner: Signer<'info>,

    /// IBIA token mint account
    #[account(
      mut,
      seeds = [MINT_SEED],
      bump,
      mint::authority = mint,
    )]
    mint: Account<'info, Mint>,

    token_program: Program<'info, Token>,
    associated_token_program: Program<'info, AssociatedToken>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
}

/// Initialize the IBIA token mint account and create the metadata account for the token
pub fn process_initialize_token(ctx: Context<InitializeToken>) -> Result<()> {
    let signer_seed: &[&[&[u8]]] = &[&[MINT_SEED, &[ctx.bumps.mint]]];

    // Create Token metadata account
    let metadata_accounts = CreateMetadataAccountsV3 {
        metadata: ctx.accounts.metadata_account.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        mint_authority: ctx.accounts.mint.to_account_info(),
        update_authority: ctx.accounts.mint.to_account_info(),
        payer: ctx.accounts.payer.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        rent: ctx.accounts.rent.to_account_info(),
    };
    let metadata = DataV2 {
        name: String::from(TOKEN_NAME),
        symbol: TOKEN_SYMBOL.to_string(),
        uri: TOKEN_URI.to_string(),
        seller_fee_basis_points: 0,
        creators: None,
        collection: None,
        uses: None,
    };
    create_metadata_accounts_v3(
        CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            metadata_accounts,
            signer_seed,
        ),
        metadata,
        false, // Is mutable
        true,  // Update authority is signer
        None,  // Collection details
    )?;
    Ok(())
}

/// Grants token to some user like ICO, IDO, etc.
/// The user account must be one of the types defined in [AccountType]
///
/// [account_type]: The type of the account to initialize
pub fn process_token_grants(ctx: Context<TokenGrants>, account_type: u8) -> Result<()> {
    let type_index = account_type as usize;
    // Check if the account type is valid
    if type_index >= ACCOUNT_GRANTS_AMOUNT.len() {
        return err!(CustomErr::InitialInvalidAccountType);
    };
    
    // Check if the account is already initialized
    let is_initialized = ctx.accounts.program_config.initialize_list[type_index];
    if is_initialized {
        // Account already initialized
        return err!(CustomErr::AccountAlreadyInitialized);
    };

    // Mint IBIA token to the user
    let signer_seed: &[&[&[u8]]] = &[&[MINT_SEED, &[ctx.bumps.mint]]];
    let token_program = ctx.accounts.token_program.to_account_info();
    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.mint.to_account_info(),
    };
    mint_to(
        CpiContext::new_with_signer(token_program, cpi_accounts, signer_seed),
        ACCOUNT_GRANTS_AMOUNT[type_index],
    )?;

    // Mark the user account as initialized
    msg!("Account initialized set index {:?} to true", type_index);
    ctx.accounts.program_config.initialize_list[type_index] = true;

    return Ok(());
}
