from pathlib import Path
import gzip,hashlib,importlib.util,json,re
def verify(root):
 w=Path(root);p=w/'native-focused/verify.py';s=importlib.util.spec_from_file_location('native216_current',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
 H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
 hashes={'original':H(w/'native-inputs/evidence/original/pump_amm/deployed.so'),'baseline':H(w/'native-control-artifacts/pump_amm_recovered.so'),'candidate':H(w/'build/artifacts/pump_amm_recovered.so')}
 result=m.verify(hashes);report=json.loads(gzip.decompress((w/'native-focused/report.json.gz').read_bytes()))
 allowed=set()
 for code,label,lines in [(6007,'UnsupportedQuoteMint',(32,12,13)),(6023,'Overflow',(67,34,35))]:
  allowed.add(tuple(f'Program log: AnchorError thrown in programs/pump-amm/src/utils/transfer_fee.rs:{line}. Error Code: {label}. Error Number: {code}. Error Message: {label}.' for line in lines))
 seen=set()
 for row in report['cases']:
  logs=[row[key]['logs'] for key in ['original','control','candidate']];assert len(set(map(len,logs)))==1
  for triple in zip(*logs):
   if len(set(triple))==1 or all(re.fullmatch(r'Program \S+ consumed \d+ of \d+ compute units',line)for line in triple):continue
   assert triple in allowed;seen.add(triple)
 assert seen==allowed
 result['only_two_exact_source_coordinate_triples']=True
 return result
