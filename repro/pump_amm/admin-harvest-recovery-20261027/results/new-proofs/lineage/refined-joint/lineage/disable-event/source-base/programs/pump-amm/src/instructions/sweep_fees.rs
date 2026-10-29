use crate::*;
use anchor_spl::{
    associated_token::{self, AssociatedToken},
    token_interface::TokenInterface,
};
#[event_cpi]
#[derive(Accounts)]
pub struct SweepFees<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub global_config: Box<Account<'info, GlobalConfig>>,
    #[account(mut,has_one=quote_mint @ PumpAmmError::InvalidQuoteMint,has_one=pool_quote_token_account @ PumpAmmError::InvalidPoolQuoteTokenAccount)]
    pub pool: Box<Account<'info, Pool>>,
    pub quote_mint: Box<InterfaceAccount<'info, Mint>>,
    pub quote_token_program: Interface<'info, TokenInterface>,
    #[account(mut)]
    pub pool_quote_token_account: Box<InterfaceAccount<'info, TokenAccount>>,
    /// CHECK: validated against configured recipients or creator vault PDA in handler.
    pub recipient: UncheckedAccount<'info>,
    /// CHECK: associated-token address constrained; token CPI validates initialized data.
    #[account(mut,seeds=[recipient.key().as_ref(),quote_token_program.key().as_ref(),quote_mint.key().as_ref()],bump,seeds::program=associated_token::ID)]
    pub recipient_token_account: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
pub fn execute(ctx: Context<SweepFees>, creator: bool) -> Result<()> {
    let a = &mut *ctx.accounts;
    crate::instructions::swap::prepare_pool(
        &a.pool, a.system_program.as_ref(), a.payer.as_ref(),
    )?;
    require_keys_neq!(
        a.recipient.key(),
        Pubkey::default(),
        PumpAmmError::InvalidProtocolFeeRecipient
    );
    if creator {
        let expected = Pubkey::find_program_address(
            &[b"creator_vault", a.pool.coin_creator.as_ref()],
            &crate::ID,
        )
        .0;
        require_keys_eq!(
            a.recipient.key(),
            expected,
            anchor_lang::error::ErrorCode::ConstraintSeeds
        );
    } else {
        crate::instructions::swap::validate_protocol_fee_recipient(
            &a.global_config,
            &a.recipient,
            a.pool.is_mayhem_mode,
        )?;
    }
    a.pool.available_quote_reserves(a.pool_quote_token_account.amount)?;
    let amount = a.pool.take_accrued_fees(creator)?;
    if amount == 0 {
        msg!("Nothing to sweep for fee bucket {}", u8::from(creator));
        return Ok(());
    }
    crate::utils::token::create_ata_if_empty(
        a.quote_token_program.as_ref(), &a.quote_mint, a.recipient.as_ref(),
        a.recipient_token_account.as_ref(), a.payer.as_ref(),
        &a.system_program, &a.associated_token_program,
    )?;
    crate::utils::token::transfer_from_pool_to_raw(
        a.quote_token_program.as_ref(), &a.quote_mint, &a.pool_quote_token_account,
        &a.pool, a.recipient_token_account.as_ref(), amount,
    )?;
    let event = SweepPoolFeeEvent {
        timestamp: Clock::get()?.unix_timestamp,
        pool: a.pool.key(),
        base_mint: a.pool.base_mint,
        quote_mint: a.quote_mint.key(),
        recipient: a.recipient.key(),
        payer: a.payer.key(),
        amount,
        bucket: if creator { 1 } else { 0 },
    };
    emit!(event);
    emit_cpi!(event);
    Ok(())
}
#[event]
#[derive(Clone)]
pub struct SweepPoolFeeEvent {
    pub timestamp: i64,
    pub pool: Pubkey,
    pub base_mint: Pubkey,
    pub quote_mint: Pubkey,
    pub recipient: Pubkey,
    pub payer: Pubkey,
    pub amount: u64,
    pub bucket: u8,
}
