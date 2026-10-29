"""Bounded scalar-type hypothesis for the private 0/1 fee-bucket argument."""
from pathlib import Path
import json,probe
from sweep_native_recipient import change as native_temporary
R=Path(__file__).resolve().parent
baseline=json.loads((R/'baseline/inventory.json').read_text())
lib=(R/'source/src/lib.rs').read_text()
assert lib.count('sweep::execute(ctx,false)')==lib.count('sweep::execute(ctx,true)')==1
overlay=lib.replace('sweep::execute(ctx,false)','sweep::execute(ctx,0u8)').replace('sweep::execute(ctx,true)','sweep::execute(ctx,1u8)')
def change(s):
 s=native_temporary(s)
 old='pub fn execute(ctx:Context<SweepFees>,creator:bool)->Result<()>{'
 assert s.count(old)==1
 return s.replace(old,'pub fn execute(ctx:Context<SweepFees>,bucket:u8)->Result<()>{let creator=bucket!=0;')
probe.run('sweep-u8-bucket-argument','src/sweep_fees.rs',change,baseline,overlays={'src/lib.rs':overlay})
