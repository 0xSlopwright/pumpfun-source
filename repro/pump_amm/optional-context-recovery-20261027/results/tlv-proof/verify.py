#!/usr/bin/env python3
"""Re-decode the signed TLV corpus receipts and compare all captured result/state fields."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json
from solders.transaction import Transaction
W=Path(__file__).resolve().parent;R=next((p for p in W.parents if(p/'evidence/original/pump_amm/deployed.so').is_file()),W)
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def input_file(name):
 p=W/'inputs'/name
 return p if p.is_file()else R/name
def load(p):
 p=Path(p);b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def verify(report,transactions,candidate,expected_bad=None):
 report,transactions,candidate=map(Path,[report,transactions,candidate]);r=load(report);obs=load(transactions);roster=load(W/'roster.json');spec=importlib.util.spec_from_file_location('tlv_clean',input_file('repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'));direct=importlib.util.module_from_spec(spec);spec.loader.exec_module(direct)
 assert r['candidate_sha256']==H(candidate)and r['original_sha256']=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7';assert r['roster_sha256']==H(W/'roster.json')and r['producer_sha256']==H(W/'probe.py');assert obs['script_sha256']==r['producer_sha256']and obs['observer_sha256']==H(input_file('repro/pump_amm/diagnostic-parity-20261027/results/harness/observe_suite.py'));assert r['comparator_sha256']==H(input_file('repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'))
 for p,digest in r['harness_sha256'].items():assert H(input_file(p))==digest
 assert H(input_file(roster['fixture_path']))==roster['fixture_sha256'];fixture=load(input_file(roster['fixture_path']));mint=fixture['keys']['quote_mint'];rows=r['cases'];txs=obs['transactions'];assert len(rows)==r['case_count']==roster['case_count']==876 and len(txs)==1752
 bad=[];signatures=0;groups={}
 for i,(row,case)in enumerate(zip(rows,roster['cases'])):
  for field in ['case','group','instruction','epoch','amount','limit']:assert row[field]==case[field]
  rawmint=bytes.fromhex(case['mint_data_hex']);assert row['mint_bytes']==len(rawmint)and row['mint_sha256']==hashlib.sha256(rawmint).hexdigest();x,y=map(direct.clean,[row['original'],row['candidate']]);diff=[k for k in x if x[k]!=y.get(k)];assert diff==row['mismatched_fields'];assert row['original']['account_snapshots']['before']==row['candidate']['account_snapshots']['before']
  pair=txs[2*i:2*i+2];assert pair[0]['transaction_base64']==pair[1]['transaction_base64']
  for t,side,expected in zip(pair,['original','candidate'],[r['original_sha256'],r['candidate_sha256']]):
   raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and t['all_signatures_verified'];assert len(checks)==t['signature_count'];signatures+=len(checks);assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']and t['amm_program_sha256']==expected
   snap=row[side]['account_snapshots'];assert snap['transaction_sha256']==t['transaction_sha256'];keys=set(map(str,tx.message.account_keys));assert set(snap['message_keys'])==keys and keys==set(snap['before'])|set(row['executable_metadata_'+side]);assert set(snap['before'])==set(snap['after']);assert bytes(snap['before'][mint]['data'])==rawmint
   assert t['logs_sha256']==hashlib.sha256(json.dumps(row[side]['logs'],separators=(',',':')).encode()).hexdigest()
  group=groups.setdefault(row['group'],{'cases':0,'mismatches':0,'original_successes':0});group['cases']+=1;group['mismatches']+=bool(diff);group['original_successes']+=row['original']['error']is None
  if diff:bad.append({'index':i,'case':case['case'],'fields':diff,'original_error':row['original']['error'],'candidate_error':row['candidate']['error']})
 dependencies={'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'evidence/original/pump_fees/deployed.so'}
 expected_dependencies={'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': '8190d3f7ceb6cb7a7a8d8924bff89f9f611e15ce1f806f2b6237f3311a98f697', 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb': '15a2e615a42e20f31714bbaaee43002ae6f1cda2e8d7118243117ab3c1342e2d', 'pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ': '4f2955d0f6b40cc9ff7daa18ccad7d19119ba1249759f4e7e3bb691beee6b35e'}
 for t in txs:
  for pid,digest in expected_dependencies.items():assert t['loaded_programs'][pid]['sha256']==digest
 assert len(bad)==r['mismatch_count']and signatures==obs['signature_count']==1752
 if expected_bad is not None:assert len(bad)==expected_bad
 return {'verified':True,'case_count':len(rows),'candidate_sha256':r['candidate_sha256'],'mismatch_count':len(bad),'signed_transactions':len(txs),'verified_signatures':signatures,'identical_signed_message_pairs':876,'groups':groups,'mismatches':bad,'executes_runtime':False,'snapshot_scope':r['snapshot_scope']}
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--report',type=Path,required=True);p.add_argument('--transactions',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--expected-bad',type=int);p.add_argument('--output',type=Path);a=p.parse_args();v=verify(a.report,a.transactions,a.candidate,a.expected_bad)
 if a.output:a.output.write_text(json.dumps(v,indent=2)+'\n')
 print(json.dumps({k:v for k,v in v.items()if k!='mismatches'},indent=2))
