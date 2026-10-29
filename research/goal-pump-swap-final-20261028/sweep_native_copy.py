"""Inline the genuine native-rent recipient copy established by the actual call arguments."""
from pathlib import Path
import json,probe
from sweep_native_recipient import change as native_temporary
R=Path(__file__).resolve().parent
baseline=json.loads((R/'baseline/inventory.json').read_text())
def change(s):
 s=native_temporary(s)
 old='&a.recipient.to_account_info(),minimum)'
 assert s.count(old)==1;s=s.replace(old,'&inline_native_recipient(a.recipient.as_ref()),minimum)')
 s+='\n#[inline(always)] fn inline_native_recipient<\'info>(info:&AccountInfo<\'info>)->AccountInfo<\'info>{AccountInfo{key:info.key,lamports:std::rc::Rc::clone(&info.lamports),data:std::rc::Rc::clone(&info.data),owner:info.owner,rent_epoch:info.rent_epoch,is_signer:info.is_signer,is_writable:info.is_writable,executable:info.executable}}\n'
 return s
if __name__=='__main__':
 probe.run('sweep-native-recipient-inline','src/sweep_fees.rs',change,baseline)
