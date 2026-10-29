"""Place the observed recipient temporary at native rent transfer, not the second ATA."""
from pathlib import Path
import json,probe
from sweep_admission_locals import change as admission_locals
R=Path(__file__).resolve().parent
baseline=json.loads((R/'baseline/inventory.json').read_text())
def change(s):
 s=admission_locals(s)
 old='a.associated_quote_recipient.as_ref(),&a.recipient.to_account_info(),mint_key'
 assert s.count(old)==1;s=s.replace(old,'a.associated_quote_recipient.as_ref(),a.recipient.as_ref(),mint_key')
 old='native_payments::transfer(a.system_program.as_ref(),&a.payer,a.recipient.as_ref(),minimum)'
 assert s.count(old)==1;s=s.replace(old,'native_payments::transfer(a.system_program.as_ref(),&a.payer,&a.recipient.to_account_info(),minimum)')
 return s
if __name__=='__main__':
 probe.run('sweep-native-recipient-temporary','src/sweep_fees.rs',change,baseline)
