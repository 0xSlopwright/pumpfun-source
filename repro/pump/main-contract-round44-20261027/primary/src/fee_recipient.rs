use anchor_lang::prelude::*;
use crate::{Global, PumpError};
use crate::trade_types::BondingCurve;

/// Validate the recipient against the curve's configured fee-recipient family.
pub fn validate_fee_recipient<'info>(
    fee_recipient: &UncheckedAccount<'info>,
    global: &Account<'info, Global>,
    bonding_curve: &Account<'info, BondingCurve>,
) -> Result<()> {
    let key = fee_recipient.key();
    if !bonding_curve.is_mayhem_mode {
        if key == global.fee_recipient || global.fee_recipients.binary_search(&key).is_ok() {
            Ok(())
        } else {
            err!(PumpError::NotAuthorized)
        }
    } else {
        if key == global.reserved_fee_recipient || global.reserved_fee_recipients.contains(&key) {
            Ok(())
        } else {
            err!(PumpError::NotAuthorized)
        }
    }
}

pub fn set_fee_recipients(ctx: &mut Context<crate::SetParams>) -> Result<[Pubkey; 8]> {
    require_gte!(ctx.remaining_accounts.len(),8,PumpError::NotEnoughRemainingAccounts);
    let recipients = core::array::from_fn(|index|ctx.remaining_accounts[index].key());
    require!(recipients.iter().all(|key|*key!=Pubkey::default()),PumpError::AllFeeRecipientsShouldBeNonZero);
    let rent = Rent::get()?;
    for (index,account) in ctx.remaining_accounts[..8].iter().enumerate() {
        if !rent.is_exempt(account.lamports(),account.try_data_len()?) {
            return Err(error!(anchor_lang::error::ErrorCode::ConstraintRentExempt).with_account_name(format!("fee_recipients[{}]",index)));
        }
    }
    require!(recipients.windows(2).all(|window|window[0]<window[1]),PumpError::UnsortedNotUniqueFeeRecipients);
    let global = &mut ctx.accounts.global;
    global.fee_recipient=recipients[0];global.fee_recipients.copy_from_slice(&recipients[1..]);
    Ok(recipients)
}
