"""Actual original ATA argument/copy order: shared mint/program infos, then owned authorities."""
from pathlib import Path
import json,probe
from sweep_shared_zero import change as shared_zero
R=Path(__file__).resolve().parent
baseline=json.loads((R/'baseline/inventory.json').read_text())
def change(s):
 s=shared_zero(s)
 first='crate::buy_v2::admit_associated_token_account(a.associated_quote_bonding_curve.as_ref(),&a.bonding_curve.to_account_info(),a.quote_mint.key(),a.quote_token_program.key(),&a.quote_mint.to_account_info(),a.quote_token_program.as_ref(),false,a.payer.as_ref(),a.system_program.as_ref())?;'
 second='crate::buy_v2::admit_associated_token_account(a.associated_quote_recipient.as_ref(),a.recipient.as_ref(),a.quote_mint.key(),a.quote_token_program.key(),&a.quote_mint.to_account_info(),a.quote_token_program.as_ref(),true,a.payer.as_ref(),a.system_program.as_ref())?;'
 assert s.count(first)==s.count(second)==1
 s=s.replace(first,'let mint_key=a.quote_mint.key();let program_key=a.quote_token_program.key();let mint_info=a.quote_mint.to_account_info();let program_info=a.quote_token_program.to_account_info();crate::buy_v2::admit_associated_token_account(a.associated_quote_bonding_curve.as_ref(),&a.bonding_curve.to_account_info(),mint_key,program_key,&mint_info,&program_info,false,a.payer.as_ref(),a.system_program.as_ref())?;')
 s=s.replace(second,'crate::buy_v2::admit_associated_token_account(a.associated_quote_recipient.as_ref(),&a.recipient.to_account_info(),mint_key,program_key,&mint_info,&program_info,true,a.payer.as_ref(),a.system_program.as_ref())?;')
 return s
if __name__=='__main__':
 probe.run('sweep-shared-admission-infos','src/sweep_fees.rs',change,baseline)
