#!/usr/bin/env python3
"""Load the inventoried fixture sources directly, bypassing Python bytecode caches."""
from pathlib import Path
import hashlib,json,sys,types

root=Path(sys.argv[1]).resolve();kit=Path(__file__).resolve().parent
candidate=Path(sys.argv[2]).resolve();out=Path(sys.argv[3]).resolve()
inventory=json.loads((kit/'input-inventory.json').read_bytes())
for name,digest in inventory.items():
    assert hashlib.sha256((root/name).read_bytes()).hexdigest()==digest,name
for name in ['pump_amm_admin_differential','pump_amm_reusable_harness','pump_amm_liquidity_differential']:
    rel='scripts/'+name+'.py';raw=(kit/'inputs'/rel).read_bytes()
    assert hashlib.sha256(raw).hexdigest()==inventory[rel]
    module=types.ModuleType(name);module.__file__=str(root/rel);sys.modules[name]=module
    exec(compile(raw,str(root/rel),'exec'),module.__dict__)
sys.argv=[str(kit/'observer.py'),str(out/'creator-transactions.json.gz'),str(kit/'probe.py'),'--candidate',str(candidate),'--output',str(out/'creator.json')]
raw=(kit/'observer.py').read_bytes()
exec(compile(raw,str(kit/'observer.py'),'exec'),{'__name__':'__main__','__file__':str(kit/'observer.py')})
