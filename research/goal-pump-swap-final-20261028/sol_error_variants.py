"""Test enum passthrough source lowering at the independently located two-extract residual."""
from pathlib import Path
import json,probe
R=Path(__file__).resolve().parent
baseline=json.loads((R/'baseline/inventory.json').read_text())
def change(s,program_first):
 s=probe.guard(s)
 macro='require_gte!(spendable_sol_in,total,PumpError::TooMuchSolRequired);'
 assert s.count(macro)==1
 arms=['Error::AnchorError(value)=>Err(Error::AnchorError(value))','Error::ProgramError(value)=>Err(Error::ProgramError(value))']
 if program_first:arms.reverse()
 source='if spendable_sol_in<total{return match error!(PumpError::TooMuchSolRequired).with_values((spendable_sol_in,total)){'+','.join(arms)+'};}'
 return s.replace(macro,source)
for name,program_first in [('exact-sol-error-enum-anchor-first',False),('exact-sol-error-enum-program-first',True)]:
 probe.run(name,'src/buy.rs',lambda s:change(s,program_first),baseline)
