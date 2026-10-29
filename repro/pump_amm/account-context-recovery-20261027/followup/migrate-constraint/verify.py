#!/usr/bin/env python3
"""Offline proof of the selected 623-candidate Migrate constraint divergence."""
from pathlib import Path,PurePosixPath
import argparse,base64,gzip,hashlib,json
from solders.transaction import Transaction

W=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(proof=W,candidate=None,expected_seal=None):
    proof=Path(proof).resolve();mp=proof/'manifest.json';seal=sha(mp)
    if expected_seal is not None:assert seal==expected_seal
    m=json.loads(mp.read_bytes());assert {str(p.relative_to(proof))for p in proof.rglob('*')if p.is_file()}==set(m['files'])|{'manifest.json'}
    for name,digest in m['files'].items():
        p=PurePosixPath(name);assert not p.is_absolute()and '..'not in p.parts;assert sha(proof/name)==digest,name
    r=json.loads((proof/'observations.json').read_bytes());obs=json.loads(gzip.decompress((proof/'transactions.json.gz').read_bytes()));rows=obs['transactions'];summary=json.loads((proof/'summary.json').read_bytes())
    assert r['candidate_sha256']==summary['candidate_sha256']=='badc94982f2ae20adc2a6be7fd22bba9d900c289de7c3b9e7475847af960ca7d'
    assert r['original_sha256']=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
    if candidate is not None:assert sha(candidate)==r['candidate_sha256']
    assert r['case_count']==len(r['cases'])==24 and len(rows)==obs['transaction_count']==48
    assert r['script_sha256']==obs['script_sha256']==sha(proof/'producer.py');assert obs['observer_sha256']==sha(proof/'observer.py')
    inventory=json.loads((proof/'input-inventory.json').read_bytes())
    for name,digest in inventory.items():
        if name!='evidence/original/pump_amm/deployed.so':assert sha(proof/'inputs'/name)==digest,name
    different=[];successes=errors=changed=signatures=0
    for i,case in enumerate(r['cases']):
        left,right=case['original'],case['candidate'];actual=[k for k in ['error','before','after','events','inner','return']if left[k]!=right[k]]
        assert actual==case['mismatched_fields']and case['match']==(not actual);assert case['case']['op']=='migrate_pool_coin_creator'
        if actual:
            different.append(case['case']['name']);assert left['error']=='TransactionErrorInstructionError((0, Tagged(InstructionErrorCustom(6028))))'
            if right['error']is None:
                successes+=1;assert any(v and right['after'][k]and v['data']!=right['after'][k]['data']for k,v in right['before'].items())
            else:errors+=1
            changed+=left['after']!=right['after']
        txs=[]
        for j,row in enumerate(rows[2*i:2*i+2]):
            side=left if j==0 else right;raw=base64.b64decode(row['transaction_base64'],validate=True);assert hashlib.sha256(raw).hexdigest()==row['transaction_sha256'];tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and len(checks)==row['signature_count'];signatures+=len(checks);txs.append(tx)
            assert row['amm_program_sha256']==r['original_sha256'if j==0 else'candidate_sha256'];assert row['error']==side['error'];assert row['logs_sha256']==hashlib.sha256(json.dumps(side['logs'],separators=(',',':')).encode()).hexdigest()
            assert list(row['loaded_programs'])==['pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'];assert next(iter(row['loaded_programs'].values()))['sha256']==row['amm_program_sha256']
        assert bytes(txs[0].message)==bytes(txs[1].message)
    assert different==r['mismatches']and len(different)==12 and successes==3 and errors==9 and changed==3 and signatures==48
    return {'passed':True,'seal':seal,'candidate_sha256':r['candidate_sha256'],'cases':24,'differences':12,'wrong_successes_with_changed_account_data':3,'wrong_errors':9,'different_after_states':3,'signed_transactions_verified':48,'signatures_verified':signatures,'raw_log_hashes_verified':48,'scope':'Negative evidence for selected 623 artifact. Synthetic local states use correctly derived AMM pool addresses and normal transaction signatures; no CPI dependency substitution. The corrected candidate is not included or selected by this packet.'}
if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--proof',type=Path,default=W);p.add_argument('--candidate',type=Path);p.add_argument('--expected-seal');a=p.parse_args();print(json.dumps(verify(a.proof,a.candidate,a.expected_seal),indent=2))
