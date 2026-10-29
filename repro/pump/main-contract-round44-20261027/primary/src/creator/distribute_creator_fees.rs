use anchor_lang::prelude::*;
use crate::{distribution::SharingConfig, PumpError};

pub(crate) fn execute_native_distribution<'info>(
    sharing_config: &Account<'info, SharingConfig>,
    creator_vault: &AccountInfo<'info>,
    system_program: &Program<'info, System>,
    remaining_accounts: &[AccountInfo<'info>],
    transfers: &[(u64, u64)],
    bump: u8,
) -> Result<u64> {
    let sharing_config_key = sharing_config.key();
    let creator_vault = creator_vault.to_account_info();
    let mut distributed = 0u64;
    for (index, _) in sharing_config.shareholders.iter().enumerate() {
        let recipient = remaining_accounts
            .get(index)
            .ok_or_else(|| error!(PumpError::NotEnoughRemainingAccounts))?;
        let amount = transfers[index].0;
        let bump = [bump];
        let seeds: &[&[u8]] = &[b"creator-vault", sharing_config_key.as_ref(), &bump];
        crate::collect_v2::transfer_native(
            system_program.as_ref(),
            &creator_vault,
            recipient,
            amount,
            &[seeds],
        )?;
        distributed = distributed
            .checked_add(amount)
            .ok_or_else(|| error!(PumpError::Overflow))?;
    }
    Ok(distributed)
}

use crate::trade_types::Shareholder;

#[event]
#[derive(Clone)]pub struct DistributeCreatorFeesEvent{pub timestamp:i64,pub mint:Pubkey,pub bonding_curve:Pubkey,pub sharing_config:Pubkey,pub admin:Pubkey,pub shareholders:Vec<Shareholder>,pub distributed:u64,pub quote_mint:Pubkey}

use super::{ConfigStatus, DistributeCreatorFees};

pub fn execute<'info>(ctx:Context<'_, '_, '_, 'info,DistributeCreatorFees<'info>>)->Result<DistributeCreatorFeesEvent>{
 let a=&ctx.accounts;
 require!(matches!(a.sharing_config.status, ConfigStatus::Active),PumpError::SharingConfigNotActive);
 require!(a.bonding_curve.creator_fee==0,PumpError::CreatorFeesNotSwept);
 let rent=Rent::get()?;
 let (transfers,minimum_distributable,minimum_vault_balance,available)=get_distribution_amounts(&rent,&a.sharing_config.shareholders,ctx.remaining_accounts,&a.creator_vault)?;
 let eligible=available>=minimum_distributable;let mut distributed=0u64;
 if eligible{distributed=crate::distribution::execute_native_distribution(&a.sharing_config,&a.creator_vault,&a.system_program,ctx.remaining_accounts,&transfers,ctx.bumps.creator_vault)?;}else{msg!("Insufficient fees for distribution. Minimum vault balance needed: {} lamports. Use get_minimum_distributable_fee instruction to check the minimum distributable amount.",minimum_vault_balance);}
 let event=DistributeCreatorFeesEvent{timestamp:Clock::get()?.unix_timestamp,mint:a.mint.key(),bonding_curve:a.bonding_curve.key(),sharing_config:a.sharing_config.key(),admin:a.sharing_config.admin,shareholders:a.sharing_config.shareholders.clone(),distributed,quote_mint:Pubkey::default()};if eligible{emit!(event.clone());emit_cpi!(event.clone());}Ok(event)
}

pub(crate) fn get_distribution_amounts<'info>(rent:&Rent,shares:&[Shareholder],recipients:&[AccountInfo<'info>],creator_vault:&AccountInfo<'info>)->Result<(Vec<(u64,u64)>,u64,u64,u64)>{
 let reserve=rent.minimum_balance(0);
 let available=creator_vault.lamports().saturating_sub(reserve);
 let mut transfers=Vec::with_capacity(shares.len());let mut minimum=0u64;
 for (i,share) in shares.iter().enumerate(){
  let recipient=recipients.get(i).ok_or_else(||error!(PumpError::NotEnoughRemainingAccounts))?;
  require!(share.address==recipient.key(),PumpError::ShareholdersAndRemainingAccountsMismatch);
  if recipient.executable{
   msg!("Unable to distribute to {}. Shareholder is a program account, use pump_fees::update_fee_shares to remove the shareholder from the team",recipient.key().to_string());
   return err!(PumpError::UnableToDistributeCreatorFeesToExecutableRecipient);
  }
  require!(share.share_bps>0,PumpError::InvalidShareBps);
  let share_bps=u64::from(share.share_bps);
  let deficit=rent.minimum_balance(recipient.data_len()).saturating_sub(recipient.lamports());
  let threshold=deficit.checked_mul(10000).ok_or_else(||error!(PumpError::Overflow))?.checked_add(share_bps.saturating_sub(1)).ok_or_else(||error!(PumpError::Overflow))?/share_bps;
  minimum=minimum.max(threshold);
  let amount=available.checked_mul(share_bps).ok_or_else(||error!(PumpError::Overflow))?/10000;
  transfers.push((amount,deficit));
 }
 Ok((transfers,minimum,reserve.saturating_add(minimum),available))
}
