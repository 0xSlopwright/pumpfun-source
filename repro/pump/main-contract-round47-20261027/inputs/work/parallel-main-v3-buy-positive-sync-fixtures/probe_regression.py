"""Eight distinct ordinary-account V3 buy/exact reserve-sync regression inputs."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
 proof=json.loads((W/'DEDUP01.json').read_text());assert proof['new_distinct_cases']==8 and all(t['admit_as_new']for t in proof['targets'])
 plan=json.loads((W/'PLAN01.json').read_text());assert sha(W/'PLAN01.json')=='ba87b5d5f49580fb266ba9698ddf7afadcbab149be216dd88a68465f0e1c4554'
 spec=importlib.util.spec_from_file_location('v3_buy_sync_fixture',W/'run_cases.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
 sys.path.insert(0,str(R/'scripts'));import pump_trade_fixture as f
 sys.path.insert(0,str(R/'work/parallel-main-r41-log-oracle'));import audit as log_oracle
 h.f=f;h.log_oracle=log_oracle;h.PROGRAM=f.Pubkey.from_string(f.x['program']);h.USER=f.Keypair.from_seed(bytes([231])*32);h.CURVE=f.Pubkey.from_string(f.x['accounts']['curve']);h.GLOBAL=f.Pubkey.from_string(f.x['accounts']['global'])
 h.INITIAL={key:f.vm.get_account(key)for key in f.msg.account_keys};h.BASE_VAULT=f.ixs[-1].accounts[6].pubkey;h.BASE_USER=f.ixs[-1].accounts[9].pubkey
 assert str(h.USER.pubkey())==f.x['accounts']['user']
 assert struct.unpack_from('<Q',h.INITIAL[h.BASE_VAULT].data,64)[0]+struct.unpack_from('<Q',h.INITIAL[h.BASE_USER].data,64)[0]==10**15
 idl=json.loads((R/'evidence/upstream/pump.json').read_text());original=R/'evidence/original/pump/deployed.so';rows=[]
 for c in plan['cases']:
  o=h.run(original,c);n=h.run(a.candidate,c)
  assert o['full_before']==n['full_before']and o['clock']==n['clock']and o['transaction_base64']==n['transaction_base64']and o['signature_verified']and n['signature_verified']
  diff=[k for k in['error','accounts','inner_instructions','event_payloads','return_data']if o[k]!=n[k]]
  if log_oracle.scope(log_oracle.norm(o['logs']))!=log_oracle.scope(log_oracle.norm(n['logs'])):diff.append('ordered_logs')
  e=h.expected(c,o,idl)
  if not e.get('all_checks'):diff.append('original_sync_conditions')
  rows.append({'case':c,'original':o,'candidate':n,'different_fields':diff,'sync_conditions':e})
 assert len(rows)==8
 report={'scope':__doc__,'case_count':8,'cases':rows,'mismatches':[i for i,r in enumerate(rows)if r['different_fields']],'candidate_sha256':sha(a.candidate),'original_sha256':sha(original),'plan_sha256':sha(W/'PLAN01.json'),'fixture_sha256':sha(W/'run_cases.py'),'dedup_sha256':sha(W/'DEDUP01.json')}
 a.output.write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0));print({'case_count':8,'mismatches':report['mismatches']});assert not report['mismatches']
if __name__=='__main__':main()
