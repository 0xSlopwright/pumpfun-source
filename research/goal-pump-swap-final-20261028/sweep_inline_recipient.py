"""Inline the actual recipient copy, preserving the original one outlined event-program clone."""
from pathlib import Path
import json,probe
from sweep_shared_zero import change as shared_zero
R=Path(__file__).resolve().parent
baseline=json.loads((R/'baseline/inventory.json').read_text())
def change(s):
 s=shared_zero(s)
 old='a.recipient.to_account_info(),amount,&a.quote_token_program,'
 assert s.count(old)==1;s=s.replace(old,'inline_recipient_copy(a.recipient.as_ref()),amount,&a.quote_token_program,')
 s+='\n#[inline(always)] fn inline_recipient_copy<\'info>(info:&AccountInfo<\'info>)->AccountInfo<\'info>{AccountInfo{key:info.key,lamports:std::rc::Rc::clone(&info.lamports),data:std::rc::Rc::clone(&info.data),owner:info.owner,rent_epoch:info.rent_epoch,is_signer:info.is_signer,is_writable:info.is_writable,executable:info.executable}}\n'
 return s
probe.run('sweep-shared-zero-inline-recipient','src/sweep_fees.rs',change,baseline)
