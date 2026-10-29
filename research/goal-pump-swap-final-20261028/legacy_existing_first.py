"""Existing-first cashback CFG ordering, retaining all original source rows."""
from pathlib import Path
import json,probe
R=Path(__file__).resolve().parent
baseline=json.loads((R/'baseline/inventory.json').read_text())
def change(source,mir):
 old='if user_volume_accumulator.data_is_empty() {'
 assert source.count(old)==1
 source=source.replace(old,'if !user_volume_accumulator.data_is_empty() { check_existing(user_volume_accumulator)?; } else {')
 old='    } else { check_existing(user_volume_accumulator)?; }'
 assert source.count(old)==1;source=source.replace(old,'    }')
 if mir:
  old='    fn check_existing(user_volume_accumulator: &AccountInfo) -> Result<()> {'
  assert source.count(old)==1;source=source.replace(old,'    #[inline(always)] fn check_existing(user_volume_accumulator: &AccountInfo) -> Result<()> {')
 return source
for name,mir in [('legacy-existing-first-llvm',False),('legacy-existing-first-mir',True)]:
 probe.run(name,'src/sell.rs',lambda s:change(s,mir),baseline)
