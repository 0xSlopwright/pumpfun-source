from pathlib import Path
import contextlib,gzip,hashlib,io,json,types
W=Path(__file__).resolve().parent;C=W/'build/artifacts/pump_amm_recovered.so';I=W/'runtime-inputs'
def module(p):
 p=Path(p);m=types.ModuleType('checked_'+p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m
def read(p):
 p=Path(p)
 if not p.exists():p=p.with_suffix(p.suffix+'.gz')
 b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify():
 optional=module(W/'optional/verify_optional.py').verify(W/'optional',C,I)
 partial=module(W/'verify_positive.py').verify(W/'partial-tail',W/'negative-baseline',C)
 with contextlib.redirect_stdout(io.StringIO()):module(W/'legacy/verify_replay.py')
 legacy=read(W/'legacy/verification.json')
 clean=module(I/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py').clean
 for name in['legacy-buy','reserves','arithmetic','creator-transfer']:
  for row in read(W/'legacy/standard'/(name+'.json'))['cases']:assert clean(row['original'])==clean(row['candidate'])
 cto=module(W/'cto-proof/verify.py').verify(W/'cto-proof',C)
 focused=module(W/'verify65.py').verify(I,C,W/'focused65')
 sweep=module(W/'verify_sweep.py').verify(W/'sweep-inputs',C,W/'sweep254',W/'observe_sweep.py')
 events=module(W/'verify_event_sites.py').verify(W/'event-sites',C,I,W/'probe_event_sites.py',W/'observe_sweep.py')
 amm='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';deps={'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'evidence/original/pump_fees/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'}
 for t in read(W/'optional/optional-transactions.json.gz')['transactions']:
  for pid,p in t['loaded_programs'].items():assert p['sha256']==(t['amm_program_sha256']if pid==amm else sha(I/deps[pid]))
 assert read(W/'optional/optional.json')['original_sha256']==sha(I/'evidence/original/pump_amm/deployed.so')
 result={'passed':True,'candidate_sha256':sha(C),'optional':optional,'partial':partial,'legacy':legacy,'cto':cto,'focused':focused,'sweep':sweep,'events':events,'supplemental_cases':2811,'supplemental_signatures':5666,'vm_executed_by_verifier':False}
 assert sum(x['cases']for x in[optional,partial,legacy,cto,focused,sweep,events])==2811
 assert sum(x.get('signatures',x.get('verified_signatures',0))for x in[optional,partial,legacy,cto,focused,sweep,events])==5666
 return result
if __name__=='__main__':print(json.dumps(verify(),indent=2))
