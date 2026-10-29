"""Explicit failure edges at the two observed existing-account guards."""
from pathlib import Path
import json,probe
from legacy_check_boundary import direct,mir_inline
R=Path(__file__).resolve().parent
baseline=json.loads((R/'baseline/inventory.json').read_text())
def change(s,mode,mir=False):
 before=s.count('\n');s=mir_inline(s)if mir else direct(s)
 pairs={
  'owner':('require!(user_volume_accumulator.owner == &crate::ID, PumpError::InvalidCashbackAccumulator);','if user_volume_accumulator.owner != &crate::ID { return err!(PumpError::InvalidCashbackAccumulator); }'),
  'disc':('require!(data.len() >= 8 && &data[..8] == crate::UserVolumeAccumulator::DISCRIMINATOR, PumpError::InvalidCashbackAccumulator);','if data.len() < 8 || &data[..8] != crate::UserVolumeAccumulator::DISCRIMINATOR { return err!(PumpError::InvalidCashbackAccumulator); }'),
 }
 for name in (['owner','disc']if mode=='both'else[mode]):
  a,b=pairs[name];assert s.count(a)==1;s=s.replace(a,b)
 assert s.count('\n')==before
 return s
for name,mode,mir in [('legacy-direct-owner-failure','owner',False),('legacy-direct-disc-failure','disc',False),('legacy-direct-both-failure','both',False),('legacy-mir-both-failure','both',True)]:
 probe.run(name,'src/sell.rs',lambda s:change(s,mode,mir),baseline)
