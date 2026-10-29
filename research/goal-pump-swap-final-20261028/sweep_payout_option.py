"""Represent the real no-payout case explicitly, leaving successful event emission at function tail."""
from pathlib import Path
import json,probe
from sweep_shared_zero import source
R=Path(__file__).resolve().parent
baseline=json.loads((R/'baseline/inventory.json').read_text())
def change(_):
 start=source.index(' let amount=if creator{');end=source.index('  crate::buy_v2::admit_associated_token_account',start);count=source[start:end].count('\n')
 creator='let amount=a.bonding_curve.creator_fee;a.bonding_curve.creator_fee=0;if amount==0{None}else{let native=a.bonding_curve.quote_mint==Pubkey::default();if native{let minimum=Rent::get()?.minimum_balance(0);if a.recipient.lamports()<minimum{crate::legacy_buy::native_payments::transfer(a.system_program.as_ref(),&a.payer,&a.recipient.to_account_info(),minimum)?;}}Some((amount,native))}'
 protocol='let amount=a.bonding_curve.protocol_fees;a.bonding_curve.protocol_fees=0;if amount==0{None}else{Some((amount,a.bonding_curve.quote_mint==Pubkey::default()))}'
 middle=' let payout=if creator{'+creator+'}else{'+protocol+'};\n let Some((amount,native))=payout else{msg!("Nothing to sweep for fee bucket {}",if creator{1u8}else{0u8});return Ok(());};\n'
 middle+='\n'*(count-3)+' if !native{\n';assert middle.count('\n')==count
 s=source[:start]+middle+source[end:]
 first='crate::buy_v2::admit_associated_token_account(a.associated_quote_bonding_curve.as_ref(),&a.bonding_curve.to_account_info(),a.quote_mint.key(),a.quote_token_program.key(),&a.quote_mint.to_account_info(),a.quote_token_program.as_ref(),false,a.payer.as_ref(),a.system_program.as_ref())?;'
 second='crate::buy_v2::admit_associated_token_account(a.associated_quote_recipient.as_ref(),a.recipient.as_ref(),a.quote_mint.key(),a.quote_token_program.key(),&a.quote_mint.to_account_info(),a.quote_token_program.as_ref(),true,a.payer.as_ref(),a.system_program.as_ref())?;'
 assert s.count(first)==s.count(second)==1
 s=s.replace(first,'let mint_key=a.quote_mint.key();let program_key=a.quote_token_program.key();let mint_info=a.quote_mint.to_account_info();let program_info=a.quote_token_program.to_account_info();crate::buy_v2::admit_associated_token_account(a.associated_quote_bonding_curve.as_ref(),&a.bonding_curve.to_account_info(),mint_key,program_key,&mint_info,&program_info,false,a.payer.as_ref(),a.system_program.as_ref())?;')
 s=s.replace(second,'crate::buy_v2::admit_associated_token_account(a.associated_quote_recipient.as_ref(),a.recipient.as_ref(),mint_key,program_key,&mint_info,&program_info,true,a.payer.as_ref(),a.system_program.as_ref())?;')
 assert s.count('\n')==source.count('\n');return s
if __name__=='__main__':
 probe.run('sweep-optional-payout','src/sweep_fees.rs',change,baseline)
