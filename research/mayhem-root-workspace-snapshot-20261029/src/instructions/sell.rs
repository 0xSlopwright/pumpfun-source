//! Legacy sell recovered from the original dispatch, parsers and arithmetic.
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint,TokenAccount};
use anchor_spl::token_2022::Token2022;
use crate::{GlobalParams,MayhemError};
use crate::state::{MayhemState,MayhemStatus,PUMP_ID};
use crate::checked_program::{CheckedSystemProgram,CheckedSystemProgramBumps,__client_accounts_checked_system_program,__cpi_client_accounts_checked_system_program};

#[derive(Accounts)]
pub struct LegacySell<'info> {
 #[account(mut)]pub trader:Signer<'info>,
 #[account(mut,seeds=[b"global-params"],bump,has_one=trader)]pub global_params:Box<Account<'info,GlobalParams>>,
 #[account(mut,seeds=[b"mayhem-state",mint.key().as_ref()],bump)]pub mayhem_state:Box<Account<'info,MayhemState>>,
 /// CHECK: Original unchecked PDA and mutable constraints.
 #[account(mut,seeds=[b"sol-vault"],bump)]pub sol_vault:UncheckedAccount<'info>,
 pub mint:Box<InterfaceAccount<'info,Mint>>,
 #[account(mut,associated_token::mint=mint,associated_token::authority=sol_vault,associated_token::token_program=mint.to_account_info().owner)]pub mayhem_token_vault:Box<InterfaceAccount<'info,TokenAccount>>,
 pub token_program:Program<'info,Token2022>,
 pub system_program:Program<'info,System>,
 /// CHECK: Passed through to Pump; original unchecked account.
 pub global:UncheckedAccount<'info>,
 #[account(mut,seeds=[b"bonding-curve",mint.key().as_ref()],bump,seeds::program=PUMP_ID)]pub bonding_curve:Box<Account<'info,SellCurve>>,
 /// CHECK: Pump validates fee recipient.
 #[account(mut)]pub fee_recipient:UncheckedAccount<'info>,
 #[account(mut,associated_token::mint=mint,associated_token::authority=bonding_curve,associated_token::token_program=mint.to_account_info().owner)]pub associated_bonding_curve:Box<InterfaceAccount<'info,TokenAccount>>,
 /// CHECK: Pump validates creator vault.
 #[account(mut)]pub creator_vault:UncheckedAccount<'info>,
 /// CHECK: Pump event authority passed through.
 pub pump_event_authority:UncheckedAccount<'info>,
 /// CHECK: Original address constraint, without executable Program wrapper.
 #[account(address=PUMP_ID)]pub pump_program:UncheckedAccount<'info>,
 /// CHECK: Pump validates its fee config.
 pub fee_config:UncheckedAccount<'info>,
 /// CHECK: Pump validates its fee program.
 pub fee_program:UncheckedAccount<'info>,
 /// CHECK: Original runtime event PDA constraint.
 #[account(seeds=[b"__event_authority"],bump)]pub event_authority:UncheckedAccount<'info>,
 pub program:Program<'info,crate::program::MayhemRecovered>,
 /// CHECK: Original derives this under Mayhem, not the Pump program.
 #[account(seeds=[b"bonding-curve-v2",mint.key().as_ref()],bump)]pub bonding_curve_v2:UncheckedAccount<'info>,
 /// CHECK: Pump validates the recipient when used.
 #[account(mut)]pub buyback_recipient:UncheckedAccount<'info>,
}
/// The sell path uses the padded external-account decoder at 0xac0, reached
/// from 0x5258 -> 0xa248 -> 0x66a0 and by reload at 0x5fb0. It pads short
/// input to 141 zero bytes before the ordinary decoder at 0x84108. This is
/// intentionally separate from the older, strict 82-byte burn account codec.
#[derive(Clone)]
pub struct SellCurve(pub curve_accounts::BondingCurve);
impl std::ops::Deref for SellCurve {type Target=curve_accounts::BondingCurve;fn deref(&self)->&Self::Target{&self.0}}
impl std::ops::DerefMut for SellCurve {fn deref_mut(&mut self)->&mut Self::Target{&mut self.0}}
impl Owner for SellCurve {fn owner()->Pubkey {curve_accounts::PUMP_ID}}
impl AccountSerialize for SellCurve {fn try_serialize<W:std::io::Write>(&self,writer:&mut W)->Result<()>{self.0.try_serialize(writer)}}











fn math()->Error {MayhemError::MathOverflow.into()}
pub fn handler(ctx:Context<LegacySell>,reference:u128,tolerance_bps:u16,retained_reserve_bps:u16)->Result<()> {
 let a=&mut *ctx.accounts;
 a.mayhem_state.validate_trade(&a.global_params)?;
 a.mayhem_state.validate_quote(a.bonding_curve.real_sol_reserves, &a.global_params, &Pubkey::default())?;




 let c=&a.bonding_curve;
 let vt=c.virtual_token_reserves as u128;let vs=c.virtual_sol_reserves as u128;
 if vt==0{return Err(math());}
 let scaled=reference.checked_mul(tolerance_bps as u128).ok_or_else(math)?;
 let price=vs*1_000_000_000_000_000u128/vt;let delta=scaled/10_000;
 let low=reference.checked_sub(delta).ok_or_else(math)?;let high=reference.checked_add(delta).ok_or_else(math)?;
 if price<low||price>high{return Err(SellError::PumpCpiSlippage.into());}
 let (input, minimum) = crate::state::sell_amounts(c.virtual_token_reserves,c.virtual_sol_reserves,c.real_sol_reserves,a.mayhem_token_vault.amount,a.global_params.field_2,retained_reserve_bps);







 let before_sol=a.sol_vault.lamports();let before_tokens=a.mayhem_token_vault.amount;
 let cpi_program=a.pump_program.key();
 let cpi_accounts=crate::pump::cpi::accounts::Sell {
  global:a.global.to_account_info(),
  fee_recipient:a.fee_recipient.to_account_info(),
  mint:a.mint.to_account_info(),
  bonding_curve:a.bonding_curve.to_account_info(),
  associated_bonding_curve:a.associated_bonding_curve.to_account_info(),
  associated_user:a.mayhem_token_vault.to_account_info(),
  user:a.sol_vault.to_account_info(),
  system_program:a.system_program.to_account_info(),
  creator_vault:a.creator_vault.to_account_info(),
  token_program:a.token_program.to_account_info(),
  event_authority:a.pump_event_authority.to_account_info(),
  program:a.pump_program.to_account_info(),
  fee_config:a.fee_config.to_account_info(),
  fee_program:a.fee_program.to_account_info(),
 };
 let bump=[ctx.bumps.sol_vault];let seeds:&[&[u8]]=&[b"sol-vault",&bump];
 crate::pump::cpi::sell(CpiContext::new_with_signer(cpi_program,cpi_accounts,&[seeds])
  .with_remaining_accounts(vec![a.bonding_curve_v2.to_account_info(),a.buyback_recipient.to_account_info()]),input,minimum)?;
 a.mayhem_token_vault.reload()?;a.bonding_curve.reload()?;
 let sol=a.sol_vault.lamports()-before_sol;let tokens=before_tokens-a.mayhem_token_vault.amount;
 crate::state::record_sell(&mut a.global_params,&mut a.mayhem_state,sol,tokens,&Pubkey::default())?;


 let event=SellEvent{side:1,sol_vault:a.sol_vault.key(),mint:a.mint.key(),sol_amount:sol,token_amount:tokens,sol_vault_balance:a.sol_vault.lamports(),token_vault_balance:a.mayhem_token_vault.amount,state_sol_deployed:a.mayhem_state.field_56,state_token_net:a.mayhem_state.field_72,virtual_sol:a.bonding_curve.virtual_sol_reserves,virtual_tokens:a.bonding_curve.virtual_token_reserves,global_sol_deployed:a.global_params.sol_deployed,timestamp:Clock::get()?.unix_timestamp,end_timestamp:a.mayhem_state.end_timestamp,real_sol:a.bonding_curve.real_sol_reserves,real_tokens:a.bonding_curve.real_token_reserves,version:a.global_params.version,retained_reserve_bps,quote_amount:sol,quote_vault_balance:a.sol_vault.lamports(),state_quote_deployed:a.mayhem_state.field_56,virtual_quote:a.bonding_curve.virtual_sol_reserves,global_quote_deployed:a.global_params.sol_deployed,real_quote:a.bonding_curve.real_sol_reserves,quote_mint:Pubkey::default()};
 emit!(event);emit_cpi!(event);Ok(())
}
pub use super::pump_interface::SellEvent;








// Keep the published module path while using the shared error namespace.
pub use crate::MayhemError as SellError;

