"""Recover the actual bump/slice records seen at the allocation CPI boundary."""
from pathlib import Path
import json,probe
from legacy_check_boundary import direct
R=Path(__file__).resolve().parent
baseline=json.loads((R/'baseline/inventory.json').read_text())
def change(s,owned):
 before=s.count('\n');s=direct(s)
 old='require!(data.len() >= 8 && &data[..8] == crate::UserVolumeAccumulator::DISCRIMINATOR, PumpError::InvalidCashbackAccumulator);'
 assert s.count(old)==1;s=s.replace(old,'if data.len() < 8 || &data[..8] != crate::UserVolumeAccumulator::DISCRIMINATOR { return err!(PumpError::InvalidCashbackAccumulator); }')
 old='let seeds = &[b"user_volume_accumulator".as_ref(), user_key.as_ref(), &[bump]]; let signer_seeds = &[&seeds[..]];'
 assert s.count(old)==1
 new='let bump=[bump]; let seeds: &[&[u8]] = &[b"user_volume_accumulator",user_key.as_ref(),&bump]; let signer_seeds = &[seeds];'
 if owned:new='let bump=[bump]; let seeds: [&[u8];3] = [b"user_volume_accumulator",user_key.as_ref(),&bump]; let signer_seeds = &[seeds.as_slice()];'
 s=s.replace(old,new);assert s.count('\n')==before;return s
for name,owned in [('legacy-disc-named-bump-slice',False),('legacy-disc-named-bump-array',True)]:
 probe.run(name,'src/sell.rs',lambda s:change(s,owned),baseline)
