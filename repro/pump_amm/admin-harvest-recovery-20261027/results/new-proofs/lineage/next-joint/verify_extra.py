"""Offline verification of decoder bytes and creator rent/payout controls."""
from pathlib import Path
from functools import cache
import gzip,hashlib,importlib.util,json,runpy
W=Path(__file__).resolve().parent;I=W/'runtime-inputs';C=W/'build/artifacts/pump_amm_recovered.so'
@cache
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(name,p):
 spec=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
optional=module('optional_check',W/'optional/verify_optional.py').verify(W/'optional',C,I)
obs=load(W/'optional/optional-transactions.json.gz');assert obs['observer_sha256']==sha(I/'repro/pump_amm/owner6048-v144/runtime/observe_suite.py')
programs={'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA':None,'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'evidence/original/pump_fees/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'}
assert load(W/'optional/optional.json')['original_sha256']==sha(I/'evidence/original/pump_amm/deployed.so')
for t in obs['transactions']:
 assert set(t['loaded_programs'])==set(programs)
 for pid,p in programs.items():assert t['loaded_programs'][pid]['sha256']==(t['amm_program_sha256']if p is None else sha(I/p))
rent=module('rent_check',W/'creator-proof/rent-proof/verify.py').verify(W/'creator-proof/rent-proof',C)
creator=module('creator_check',W/'creator-proof/retained-proof/verify.py').verify(W/'creator-proof/retained-proof',C)
assert rent['cases']==108 and rent['signatures']==216 and rent['mismatches']==0
assert creator['cases']==267 and creator['signatures']==534 and creator['mismatches']==0
runpy.run_path(str(W/'legacy/verify_replay.py'),run_name='__main__')
legacy=load(W/'legacy/verification.json');assert legacy['cases']==1616 and legacy['verified_signatures']==3232
cto=module('cto_check',W/'creator-proof/cto-proof/verify.py').verify(W/'creator-proof/cto-proof',C);assert cto['cases']==19 and cto['signatures']==76 and cto['mismatches']==0
partial=module('partial_check',W/'verify_positive.py').verify(W/'partial-tail',W/'negative-baseline',C)
result={'verified':True,'candidate_sha256':sha(C),'optional':optional,'rent':rent,'creator':creator,'legacy':legacy,'cto':cto,'partial_tail':partial,'scope':__doc__,'vm_executed':False};(W/'extra-verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
