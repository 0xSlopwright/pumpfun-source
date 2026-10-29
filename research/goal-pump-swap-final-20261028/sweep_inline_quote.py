"""Restore the extra outlined quote-mint AccountInfo copy at the second ATA admission."""
from pathlib import Path
import json,probe
from sweep_shared_zero import change as shared_zero
R=Path(__file__).resolve().parent
baseline=json.loads((R/'baseline/inventory.json').read_text())
def change(s):
 s=shared_zero(s)
 old='&a.quote_mint.to_account_info(),a.quote_token_program.as_ref(),'
 assert s.count(old)==2
 s=s.replace(old,'&inline_quote_info(a.quote_mint.as_ref().as_ref()),a.quote_token_program.as_ref(),')
 s+='\n#[inline(always)] fn inline_quote_info<\'info>(info:&AccountInfo<\'info>)->AccountInfo<\'info>{AccountInfo{key:info.key,lamports:std::rc::Rc::clone(&info.lamports),data:std::rc::Rc::clone(&info.data),owner:info.owner,rent_epoch:info.rent_epoch,is_signer:info.is_signer,is_writable:info.is_writable,executable:info.executable}}\n'
 return s
probe.run('sweep-shared-zero-inline-quote','src/sweep_fees.rs',change,baseline)
