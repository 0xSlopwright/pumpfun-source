"""Two exclusive fee-bucket comparisons and one real shared zero-payout exit."""
from pathlib import Path
import json,probe
R=Path(__file__).resolve().parent
baseline=json.loads((R/'baseline/inventory.json').read_text())
source=(R/'composition/source/src/sweep_fees.rs').read_text()
def change(_):
 start=source.index(' let amount=if creator{')
 end=source.index('  crate::buy_v2::admit_associated_token_account',start)
 count=source[start:end].count('\n')
 creator='amount=a.bonding_curve.creator_fee;a.bonding_curve.creator_fee=0;if amount==0{break \'payout;}native=a.bonding_curve.quote_mint==Pubkey::default();if native{let minimum=Rent::get()?.minimum_balance(0);if a.recipient.lamports()<minimum{crate::legacy_buy::native_payments::transfer(a.system_program.as_ref(),&a.payer,a.recipient.as_ref(),minimum)?;}}'
 protocol='amount=a.bonding_curve.protocol_fees;a.bonding_curve.protocol_fees=0;if amount==0{break \'payout;}native=a.bonding_curve.quote_mint==Pubkey::default();'
 middle=" 'payout: { let amount;let native;if creator{"+creator+'}else{'+protocol+'}\n'
 middle+='\n'*(count-2)+' if !native{\n'
 assert middle.count('\n')==count
 s=source[:start]+middle+source[end:]
 old='emit!(event.clone());emit_cpi!(event);Ok(())\n}'
 new='emit!(event.clone());emit_cpi!(event);return Ok(());}\n msg!("Nothing to sweep for fee bucket {}",if creator{1u8}else{0u8});Ok(())}'
 assert s.count(old)==1;s=s.replace(old,new);assert s.count('\n')==source.count('\n')
 return s
if __name__=='__main__':
 probe.run('sweep-shared-zero-exit','src/sweep_fees.rs',change,baseline)
