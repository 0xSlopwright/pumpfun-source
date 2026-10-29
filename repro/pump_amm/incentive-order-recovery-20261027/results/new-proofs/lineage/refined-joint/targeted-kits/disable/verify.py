from pathlib import Path
import argparse,ast,base64,gzip,hashlib,itertools,json,sys,types
from solders.transaction import Transaction
W=Path(__file__).resolve().parent
sys.dont_write_bytecode=True
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(p):
 m=types.ModuleType(p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m
def verify(candidate,reports):
 assert read(W/'manifest.json')['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 candidate=Path(candidate);reports=Path(reports);r=read(reports/'report.json.gz');o=read(reports/'transactions.json.gz');digest=sha(candidate);inputs=read(W/'runtime-inputs.json')
 assert r['candidate_sha256']==digest and r['original_sha256']==inputs['evidence/original/pump_amm/deployed.so']
 assert r['producer_sha256']==o['script_sha256']==sha(W/'probe.py')and o['observer_sha256']==sha(W/'observer.py')
 tree=ast.parse((W/'probe.py').read_text());f=next(x for x in tree.body if isinstance(x,ast.FunctionDef)and x.name=='cases');scope={'itertools':itertools};exec(compile(ast.fix_missing_locations(ast.Module(body=[f],type_ignores=[])),'<cases>','exec'),scope);cases=scope['cases']();assert len(cases)==len(r['cases'])==148 and len(o['transactions'])==296
 clean=module(W/'cleaner.py').clean;signatures=success=0;bad=[];cfg=read(W/'runtime-sources/research/imported-lab/analysis/pump_fun/config-snapshot.json');key=next(x['address']for x in cfg['accounts']if x['program_name']=='pump_amm');idl=read(W/'runtime-sources/evidence/upstream/pump_amm.json');disc=bytes(next(x['discriminator']for x in idl['instructions']if x['name']=='disable'))
 for i,row in enumerate(r['cases']):
  assert row['case']==cases[i];a,b=row['original'],row['candidate'];assert a['transaction_base64']==b['transaction_base64']and a['before']==b['before'];assert clean(row['query_original'])==clean(row['query_candidate'])
  if clean(a)!=clean(b):bad.append(row['case']['name'])
  success+=a['error']is None
  for j,side in enumerate(['original','candidate']):
   q=row[side];t=o['transactions'][2*i+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and t['all_signatures_verified'];signatures+=len(checks);assert t['signature_count']==len(checks)==1
   assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']and q['transaction_base64']==t['transaction_base64'];assert t['error']==q['error']and t['logs_sha256']==hashlib.sha256(json.dumps(q['logs'],separators=(',',':')).encode()).hexdigest();program='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';expected=r['original_sha256']if side=='original'else digest;assert t['amm_program_sha256']==t['loaded_programs'][program]['sha256']==expected and set(t['loaded_programs'])=={program}
   ix=tx.message.instructions[0];payload=bytes(ix.data);assert payload==disc+bytes.fromhex(row['case']['args']);assert str(tx.message.account_keys[ix.program_id_index])==program
   before,after=q['before'],q['after'];assert set(before)==set(after)
   for state in [before,after]:assert all(v is None or set(v)=={'lamports','data_hex','owner'}for v in state.values())
   if row['case']['mutation']not in ['noncanonical_config']and key in before and before[key]is not None and len(bytes.fromhex(before[key]['data_hex']))>56:assert bytes.fromhex(before[key]['data_hex'])[56]==row['case']['prior']
   if q['error']is None:
    config_key=str(tx.message.account_keys[ix.accounts[1]]);assert config_key in after;args=bytes.fromhex(row['case']['args'])[:5];value=(row['case']['prior']&224)|sum(v<<k for k,v in enumerate(args));assert bytes.fromhex(after[config_key]['data_hex'])[56]==value
 assert not bad and signatures==296 and success==130
 return{'passed':True,'candidate_sha256':digest,'cases':148,'signatures':296,'original_successes':130,'full_log_state_mismatches':bad,'scope':'Disable only:128 flag combinations and20 boundary controls, including accepted noncanonical config and trailing data, with unchanged signed message pairs and full nonexecutable-account snapshots.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--reports',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.candidate,a.reports),indent=2))
