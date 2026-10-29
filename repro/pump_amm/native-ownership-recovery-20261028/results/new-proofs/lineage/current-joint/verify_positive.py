"""Verify the OptionalU64 fix against the sealed264-case negative, including logs."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,sys
sys.dont_write_bytecode=True

def module(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m

def verify(directory,negative,candidate=None):
 d,n=Path(directory),Path(negative);checker=module('partial_tail',d/'verify.py');result=checker.verify(d,candidate,0)
 manifest=json.loads((n/'manifest.json').read_text())['files'];assert hashlib.sha256((n/'manifest.json').read_bytes()).hexdigest()=='530b1d54f70c1e233529f17ca052f9ed126d204f2aa73efa6852fa3b90c089d5'
 assert hashlib.sha256((n/'report.json').read_bytes()).hexdigest()==manifest['report.json']
 old=json.loads((n/'report.json').read_text());new=json.loads((d/'report.json').read_text());p=d/'input-root/repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';cleaner=module('cleaner',p)
 for a,b in zip(old['cases'],new['cases']):
  assert a['case']==b['case']and a['original']==b['original'];assert cleaner.clean(b['original'])==cleaner.clean(b['candidate'])
 assert len(old['mismatches'])==123 and len(old['cases'])==len(new['cases'])==264
 return {**result,'normalized_full_logs_and_fields_equal':True,'originals_equal_sealed_negative':True,'fixed_prior_mismatches':123,'cleaner_sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,required=True);p.add_argument('--negative',type=Path,required=True);p.add_argument('--candidate',type=Path);a=p.parse_args();print(json.dumps(verify(a.directory,a.negative,a.candidate),indent=2))
