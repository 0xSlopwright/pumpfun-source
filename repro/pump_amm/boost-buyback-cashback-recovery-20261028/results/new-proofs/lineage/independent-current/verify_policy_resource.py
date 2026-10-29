from pathlib import Path
import base64,gzip,hashlib,importlib.util,json,re
from solders.transaction import Transaction
def H(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def J(p):
 p=Path(p);data=p.read_bytes();return json.loads(gzip.decompress(data)if data[:2]==b'\x1f\x8b'else data)
def verify(w):
 w=Path(w);d=w/'policy-cpi';p=d/'verify.py';s=importlib.util.spec_from_file_location('policy_resource_parent',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);parent=m.verify(d)
 current=H(w/'build/artifacts/pump_amm_recovered.so');baseline=H(w/'policy-reference-artifacts/pump_amm_recovered.so');original=H(w/'runtime-inputs/evidence/original/pump_amm/deployed.so')
 assert parent['candidate_sha256']==current
 dependency_files={'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'}
 hashes={pid:H(w/'runtime-inputs'/path)for pid,path in dependency_files.items()};hashes['6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P']=H(d/'caller.so')
 checked=0;resources=[]
 for name,report,sidecar in [('default','report.json','transactions.json.gz'),('high','highbudget-report.json','highbudget-transactions.json.gz'),('h16','h16-default200k-report.json','h16-default200k-transactions.json.gz')]:
  r=J(d/report);obs=J(d/sidecar);assert r['original_sha256']==original and r['candidate_sha256']==(baseline if name=='h16'else current)
  assert obs['observer_sha256']==H(w/'runtime-inputs/repro/pump_amm/owner6048-v144/runtime/observe_suite.py')
  for i,row in enumerate(r['cases']):
   for side,t in zip(['original','candidate'],obs['transactions'][2*i:2*i+2]):
    wanted=original if side=='original'else r['candidate_sha256']
    for pid,image in t['loaded_programs'].items():assert image['sha256']==(wanted if pid=='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'else hashes[pid])
    checked+=1
   if name=='default'and row['different_fields']:
    resources.append({'case':row['input'],'different_fields':row['different_fields'],'original_error':row['original']['error'],'candidate_error':row['candidate']['error']})
 assert checked==144 and len(resources)==4
 return parent|{'all_loaded_images_bound':checked,'preserved_default_resource_cases':resources,'network_reachability_proven':False,'scope':'Full saved outcome comparison and signed message/image bindings. Four 200k-CU resource divergences are retained and also present on H16; all24 pairs agree at1.4M. These are not normalized away or generalized beyond the recorded corpus.'}
if __name__=='__main__':print(json.dumps(verify(Path(__file__).parent),indent=2))
