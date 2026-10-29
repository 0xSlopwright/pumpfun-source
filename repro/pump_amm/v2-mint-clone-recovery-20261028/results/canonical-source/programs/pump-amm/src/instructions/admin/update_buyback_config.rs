use crate::*;

pub fn update_buyback_config(ctx: Context<AdminGlobal>, buyback_basis_points: Option<u64>) -> Result<()> {
    let accounts = &mut *ctx.accounts;
    if let Some(bps) = buyback_basis_points {
        accounts.global_config.set_buyback_basis_points(bps)?;
    }
    if !ctx.remaining_accounts.is_empty() {
        require!(ctx.remaining_accounts.len() == 8, PumpAmmError::WrongBuybackFeeRecipientsCount);
        let mut recipients = [Pubkey::default(); 8];
        for (i, account) in ctx.remaining_accounts.iter().enumerate() { recipients[i] = account.key(); }
        accounts.global_config.set_buyback_fee_recipients(recipients)?;
    }
    Ok(())
}
