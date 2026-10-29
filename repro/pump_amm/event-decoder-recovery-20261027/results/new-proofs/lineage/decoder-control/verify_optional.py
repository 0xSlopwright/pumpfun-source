from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json,sys
from solders.transaction import Transaction
W=Path(__file__).resolve().parent

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(directory,candidate,root):
 d=Path(directory);candidate=Path(candidate);root=Path(root)
 r=json.loads((d/'optional.json').read_bytes());txs=json.loads(gzip.decompress((d/'optional-transactions.json.gz').read_bytes()))
 assert r['case_count']==len(r['cases'])==572 and not r['mismatches']
 assert r['candidate_sha256']==sha(candidate)
 assert r['script_sha256']==txs['script_sha256']==sha(d/'probe_optional_bool.py')
 clean_path=(d/'cleaner.py') if(d/'cleaner.py').exists()else root/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'
 spec=importlib.util.spec_from_file_location('decoder_cleaner',clean_path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
 assert len(txs['transactions'])==txs['transaction_count']==1144
 allowed={r['original_sha256'],r['candidate_sha256']}|{sha(root/'evidence/dependencies'/n/'deployed.so')for n in ['spl_token','spl_token_2022','associated_token']}|{sha(root/'evidence/original/pump_fees/deployed.so')}
 signatures=0
 for i,row in enumerate(r['cases']):
  assert m.clean(row['original'])==m.clean(row['candidate']),i
  messages=[]
  for j,side in enumerate(['original','candidate']):
   t=txs['transactions'][2*i+j];s=row[side];raw=base64.b64decode(t['transaction_base64'],validate=True);assert sha_bytes(raw)==t['transaction_sha256'];assert s['transaction_base64']==t['transaction_base64']
   tx=Transaction.from_bytes(raw);assert all(tx.verify_with_results())and t['all_signatures_verified'];assert len(tx.signatures)==t['signature_count'];signatures+=len(tx.signatures);messages.append(bytes(tx.message))
   assert t['error']==s['error'];assert t['logs_sha256']==sha_bytes(json.dumps(s['logs'],separators=(',',':')).encode());assert t['amm_program_sha256']==r[side+'_sha256'];assert all(v['sha256']in allowed for v in t['loaded_programs'].values())
  assert messages[0]==messages[1]
 assert signatures==1144
 return {'passed':True,'candidate_sha256':r['candidate_sha256'],'cases':572,'transactions':1144,'signatures':signatures,'mismatches':0,'fields':'all result fields, exact inner instructions, return data and recorded account snapshots','normalization':'compute log lines and source coordinates only','scope':'256 optional-byte values, absent byte, trailing-byte and truncated instruction controls for each legacy buy entry point; synthetic fixtures, no whole-program equivalence claim.'}
def sha_bytes(b):return hashlib.sha256(b).hexdigest()
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--directory',type=Path,default=W);p.add_argument('--candidate',type=Path);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate or a.directory/'diagnostic-artifacts/candidate.so',a.root),indent=2))
