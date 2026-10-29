use anchor_lang::{
    accounts::{
        account::Account,
        interface::Interface,
        interface_account::InterfaceAccount,
        program::Program,
        signer::Signer,
    },
    prelude::{borsh, AccountInfo, Clock, Context, Key, Pubkey, Rent, Result, SolanaSysvar, System, ToAccountInfo},
    Accounts, AnchorDeserialize, AnchorSerialize, Discriminator, emit, emit_cpi, error, event, event_cpi, require, require_eq, require_gt, require_keys_neq,
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::Token2022,
    token_interface::{Mint, TokenAccount, TokenInterface},
};
use crate::{state::{GlobalConfig, Pool}, PumpAmmError};
use crate::utils::math::U128;

#[event_cpi]
#[derive(Accounts)]
#[instruction(index:u16)]
pub struct CreatePool<'info> {
    #[account(init,payer=creator,space=287,seeds=[b"pool",index.to_le_bytes().as_ref(),creator.key().as_ref(),base_mint.key().as_ref(),quote_mint.key().as_ref()],bump)]
    pub pool: Box<Account<'info, Pool>>,
    pub global_config: Box<Account<'info, GlobalConfig>>,
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(mint::token_program = base_token_program)]
    pub base_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mint::token_program = quote_token_program)]
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(init,payer=creator,seeds=[b"pool_lp_mint",pool.key().as_ref()],bump,mint::decimals=9,mint::authority=pool,mint::token_program=token_2022_program)]
    pub lp_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(mut)]
    pub user_base_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut)]
    pub user_quote_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(init,payer=creator,associated_token::mint=lp_mint,associated_token::authority=creator,associated_token::token_program=token_2022_program)]
    pub user_pool_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(init_if_needed,payer=creator,associated_token::mint=base_mint,associated_token::authority=pool,associated_token::token_program=base_token_program)]
    pub pool_base_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(init_if_needed,payer=creator,associated_token::mint=quote_mint,associated_token::authority=pool,associated_token::token_program=quote_token_program)]
    pub pool_quote_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    pub system_program: Program<'info, System>,
    pub token_2022_program: Program<'info, Token2022>,
    pub base_token_program: Interface<'info, TokenInterface>,
    pub quote_token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
#[inline(never)]
pub fn execute(
    ctx: Context<CreatePool>,
    index: u16,
    base_in: u64,
    quote_in: u64,
    coin_creator: Pubkey,
    mayhem: bool,
    cashback: bool,
    creator_fee: u64,
    can_edit: bool,
    holder: bool,
) -> Result<()> {
    let a = &mut *ctx.accounts;
    const PUMP: Pubkey = Pubkey::new_from_array([
        1, 86, 224, 246, 147, 102, 90, 207, 68, 219, 21, 104, 191, 23, 91, 170, 81, 137, 203, 151,
        245, 210, 255, 59, 101, 93, 43, 182, 253, 109, 24, 176,
    ]);
    let canonical = a.creator.key()
        == Pubkey::find_program_address(&[b"pool-authority", a.base_mint.key().as_ref()], &PUMP).0;

    if mayhem {
        require_eq!(a.global_config.mayhem_mode_enabled, true, PumpAmmError::MayhemModeDisabled);
        require_eq!(canonical, true, PumpAmmError::OnlyPumpPoolsMayhemMode);
    }
    if cashback {
        require_eq!(a.global_config.is_cashback_enabled, true, PumpAmmError::CashbackNotEnabled);
        require_eq!(canonical, true, PumpAmmError::OnlyPumpPoolsCashback);
    }

    require!(
        a.global_config.disable_flags & 1 == 0,
        PumpAmmError::DisabledCreatePool
    );
    require_gt!(base_in, 0, PumpAmmError::ZeroBaseAmount);
    require_gt!(quote_in, 0, PumpAmmError::ZeroQuoteAmount);
    require!(
        crate::utils::token::supported_mint(a.base_mint.as_ref().as_ref(), false),
        PumpAmmError::UnsupportedBaseMint
    );
    require!(
        crate::utils::token::supported_mint(a.quote_mint.as_ref().as_ref(), canonical),
        PumpAmmError::UnsupportedQuoteMint
    );
    require_keys_neq!(
        a.base_mint.key(),
        a.quote_mint.key(),
        PumpAmmError::SameMint
    );

    crate::utils::token::transfer_checked(
        a.base_token_program.as_ref(), &a.base_mint, &a.user_base_token_account,
        &a.pool_base_token_account, a.creator.as_ref(), base_in, &[],
    )?;
    crate::utils::token::transfer_checked(
        a.quote_token_program.as_ref(), &a.quote_mint, &a.user_quote_token_account,
        &a.pool_quote_token_account, a.creator.as_ref(), quote_in, &[],
    )?;
    a.pool_base_token_account.reload()?;
    a.pool_quote_token_account.reload()?;
    let pb = a.pool_base_token_account.amount;
    let pq = a.pool_quote_token_account.amount;
    let liquidity = initial_liquidity(pb, pq)?;
    require!(
        (creator_fee == 0 && !can_edit) || canonical,
        PumpAmmError::OnlyCanonicalPumpPoolsCanHaveCoinCreator
    );
    let creator = a.creator.key();
    let base = a.base_mint.key();
    let quote = a.quote_mint.key();
    let bump = [ctx.bumps.pool];
    a.pool.set_inner(Pool {
        pool_bump: bump[0],
        index,
        creator,
        base_mint: base,
        quote_mint: quote,
        lp_mint: a.lp_mint.key(),
        pool_base_token_account: a.pool_base_token_account.key(),
        pool_quote_token_account: a.pool_quote_token_account.key(),
        lp_supply: liquidity,
        coin_creator: if canonical {
            coin_creator
        } else {
            Pubkey::default()
        },
        is_mayhem_mode: mayhem,
        is_cashback_coin: cashback,
        virtual_quote_reserves: 0,
        creator_fee_bps: creator_fee,
        can_edit_creator_fee: can_edit,
        is_holder_reward: canonical && holder,
        protocol_fees: 0,
        creator_fees: 0,
    });
    let output = liquidity.checked_sub(100)
        .ok_or_else(|| error!(PumpAmmError::TooLittlePoolTokenLiquidity))?;
    crate::utils::token::mint_to_pool(
        &a.token_2022_program, &a.lp_mint, &a.user_pool_token_account, output, &a.pool,
    )?;
    let event = CreatePoolEvent {
        timestamp: Clock::get()?.unix_timestamp,
        index,
        creator,
        base_mint: base,
        quote_mint: quote,
        base_mint_decimals: a.base_mint.decimals,
        quote_mint_decimals: a.quote_mint.decimals,
        base_amount_in: base_in,
        quote_amount_in: quote_in,
        pool_base_amount: pb,
        pool_quote_amount: pq,
        minimum_liquidity: 100,
        initial_liquidity: liquidity,
        lp_token_amount_out: output,
        pool_bump: bump[0],
        pool: a.pool.key(),
        lp_mint: a.lp_mint.key(),
        user_base_token_account: a.user_base_token_account.key(),
        user_quote_token_account: a.user_quote_token_account.key(),
        coin_creator,
        is_mayhem_mode: mayhem,
        creator_fee_bps: creator_fee,
        can_edit_creator_fee: can_edit,
        is_holder_reward: a.pool.is_holder_reward,
    };
    emit!(event);
    emit_cpi!(event);
    Ok(())
}

#[event]
#[derive(Clone)]
pub struct CreatePoolEvent {
    pub timestamp: i64,
    pub index: u16,
    pub creator: Pubkey,
    pub base_mint: Pubkey,
    pub quote_mint: Pubkey,
    pub base_mint_decimals: u8,
    pub quote_mint_decimals: u8,
    pub base_amount_in: u64,
    pub quote_amount_in: u64,
    pub pool_base_amount: u64,
    pub pool_quote_amount: u64,
    pub minimum_liquidity: u64,
    pub initial_liquidity: u64,
    pub lp_token_amount_out: u64,
    pub pool_bump: u8,
    pub pool: Pubkey,
    pub lp_mint: Pubkey,
    pub user_base_token_account: Pubkey,
    pub user_quote_token_account: Pubkey,
    pub coin_creator: Pubkey,
    pub is_mayhem_mode: bool,
    pub creator_fee_bps: u64,
    pub can_edit_creator_fee: bool,
    pub is_holder_reward: bool,
}

fn initial_liquidity(base: u64, quote: u64) -> Result<u64> {
    let product = (base as u128) * (quote as u128);
    u64::try_from(U128::from(product).integer_sqrt())
        .map_err(|_| error!(PumpAmmError::Truncation))
}
