#!/usr/bin/env python3
"""Verify retained creator observations, input bindings and signed transactions."""
from pathlib import Path,PurePosixPath
import argparse,base64,gzip,hashlib,json,re
from solders.transaction import Transaction

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def clean(logs):
    return [re.sub(r'(?<=panicked at )[^\s:]+:[0-9]+(?::[0-9]+)?','<source>',re.sub(r'(?<=thrown in )[^\s:]+:[0-9]+','<source>',v))for v in logs if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',v)]
def verify(proof,candidate=None,root=None):
    proof=Path(proof).resolve();record=json.loads((proof/'run.json').read_bytes());assert record['returncode']==0
    assert {str(p.relative_to(proof))for p in proof.rglob('*')if p.is_file()}==set(record['files'])|{'run.json'}|({'verification.json'}if(proof/'verification.json').exists()else set())
    for name,digest in record['files'].items():
        p=PurePosixPath(name);assert not p.is_absolute()and '..'not in p.parts;assert sha(proof/name)==digest,name
    if candidate is not None:assert sha(candidate)==record['candidate_sha256']
    inventory=json.loads((proof/'kit/input-inventory.json').read_bytes());assert inventory==record['inputs']
    if root is not None:
        for name,digest in inventory.items():assert sha(Path(root)/name)==digest,name
    for name,digest in inventory.items():
        if name.endswith('.py'):assert sha(proof/'kit/inputs'/name)==digest
    r=json.loads((proof/'creator.json').read_bytes());obs=json.loads(gzip.decompress((proof/'creator-transactions.json.gz').read_bytes()));rows=obs['transactions']
    assert r['candidate_sha256']==record['candidate_sha256']and r['original_sha256']==record['original_sha256']
    assert len(r['cases'])==r['case_count']==327 and len(rows)==654 and not r['mismatches']
    assert r['script_sha256']==obs['script_sha256']==sha(proof/'kit/probe.py');assert obs['observer_sha256']==sha(proof/'kit/observer.py')
    names=set();signatures=0;entries=0
    for i,case in enumerate(r['cases']):
        name=case['case']['name'];assert name not in names;names.add(name)
        left,right=case['original'],case['candidate'];assert case['match']and not case['mismatched_fields']
        assert all(left[k]==right[k]for k in ['error','before','after','events','inner','return']);assert clean(left['logs'])==clean(right['logs'])
        entries+=any('Program log: Instruction: '+name in left['logs'] for name in ['MigratePoolCoinCreator','SetCoinCreator'])
        txs=[]
        for j,row in enumerate(rows[2*i:2*i+2]):
            side=left if j==0 else right;raw=base64.b64decode(row['transaction_base64'],validate=True);assert hashlib.sha256(raw).hexdigest()==row['transaction_sha256'];tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and len(checks)==row['signature_count'];signatures+=len(checks);txs.append(tx)
            assert row['amm_program_sha256']==(record['original_sha256']if j==0 else record['candidate_sha256']);assert row['error']==side['error'];assert row['logs_sha256']==hashlib.sha256(json.dumps(side['logs'],separators=(',',':')).encode()).hexdigest()
            assert set(row['loaded_programs'])=={'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'}
            assert next(iter(row['loaded_programs'].values()))['sha256']==row['amm_program_sha256']
        assert bytes(txs[0].message)==bytes(txs[1].message)
    assert obs['transaction_count']==654 and obs['signature_count']==signatures
    return {'passed':True,'candidate_sha256':record['candidate_sha256'],'cases':327,'signed_transactions_verified':654,'signatures_verified':signatures,'raw_log_hashes_verified':654,'normalized_log_cases':327,'cases_with_instruction_log':entries,'scope':'Synthetic local account fixtures with ordinary verified signatures; no substituted CPI dependency. Log normalization removes only compute-unit lines and source path/line labels. All error values, state, events, inner instructions and return data are compared.'}
if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--proof',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--root',type=Path);a=p.parse_args();print(json.dumps(verify(a.proof,a.candidate,a.root),indent=2))
