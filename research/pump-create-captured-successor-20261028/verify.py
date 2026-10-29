#!/usr/bin/env python3
"""Authenticate the selected-image captured-loader create supplement; no VM execution."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json
from solders.transaction import VersionedTransaction
P=Path(__file__).resolve().parent;R=P.parents[1]
def require(ok,message):
 if not ok:raise ValueError(message)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def read(p):
 raw=p.read_bytes();return json.loads(gzip.decompress(raw)if raw.startswith(b'\x1f\x8b')else raw)
p=argparse.ArgumentParser();p.add_argument('--runtime-directory',type=Path,default=P/'runtime');p.add_argument('--candidate',type=Path);a=p.parse_args();m=read(P/'MANIFEST.json');files={str(f.relative_to(P)):sha(f)for f in P.rglob('*')if f.is_file()and f.name!='MANIFEST.json'};require(files==m['files'],'Packet membership or bytes differ');require(not any(f.is_symlink()for f in P.rglob('*')),'Packet symlink')
i=read(P/'inputs.json');candidate=(a.candidate or R/'research/pump-final-composition-673-20261028/artifacts/candidate.so').resolve();require(sha(candidate)==i['candidate_sha256'],'Selected candidate bytes differ')
for key in ['producer','wrapper','actual_build_receipt','source_frozen']:require(sha(R/i[key])==i[key+'_sha256'],'Executed input differs: '+key)
build=read(R/i['actual_build_receipt']);require(build['returncode']==0 and build['source_unchanged']and build['comparison']['candidate_sha256']==i['candidate_sha256'],'Actual successful source build differs')
O=a.runtime_directory.resolve();x=read(O/'cases.json.gz');e=read(O/'execution.json');require(e['returncode']==0 and e['controller_sha256']==sha(P/'replay.py')and e['candidate_sha256']==i['candidate_sha256'],'Actual replay execution differs');require(e['report_sha256']==sha(O/'cases.json.gz')and e['loader_sha256']==sha(O/'loader.json'),'Actual replay output differs');require(x['runner_sha256']==i['producer_sha256']and x['build_receipt_sha256']==i['actual_build_receipt_sha256']and x['source_coordinate_normalization']is None,'Producer/source receipt binding differs')
messages=lambda r:[v for v in r['logs']if v.startswith(('Program log: ','Program data: '))];txs=sigs=0;require(len(x['cases'])==14 and {q['family']for q in x['cases']}=={'616','651'},'Create case inventory differs')
for row in x['cases']:
 runs=row['results'];require(set(runs)=={'original','canonical','candidate'},'Three-image control absent');left,right=runs['original'],runs['candidate'];require(messages(left)==messages(right),'Strict ordered Source/logs differ')
 for k in ['before','after','error','events','inner','return']:require(left[k]==right[k],'Structured state differs: '+k)
 require(len({v['transaction_base64']for v in runs.values()})==1,'Signed input differs across images')
 for r in runs.values():
  raw=base64.b64decode(r['transaction_base64'],validate=True);t=VersionedTransaction.from_bytes(raw);require(bytes(t)==raw and all(t.verify_with_results()),'Invalid real transaction signature');txs+=1;sigs+=len(t.signatures)
require((txs,sigs)==(42,84),'Execution/signature fields differ');known={'original':'7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d','canonical':'1d031f64b9656ba572817c20a46e0bcb3d43716fee4c857d9b59447724a28904','candidate':i['candidate_sha256']}
for name,count in [('616',4),('651',10)]:
 q=x['families'][name];require(q['cases']==count and q['images_sha256']==known and not q['structured_mismatches']['candidate']and not q['strict_ordered_program_message_mismatches']['candidate'],'Family comparison differs')
loads=read(O/'loader.json')['loads'];require(len(loads)==42 and {q['elf_sha256']for q in loads}==set(known.values()),'Actual captured image loads differ')
for row in loads:require(row['program_owner']=='BPFLoaderUpgradeab1e11111111111111111111111'and row['program_bytes']==36 and row['programdata_bytes']==10485760 and row['elf_prefix_unchanged']and row['zero_allocation_tail']and row['slot']==458921441,'Genuine captured loader allocation differs')
print(json.dumps({'candidate_sha256':i['candidate_sha256'],'cases':14,'normally_signed_executions':txs,'signature_fields_verified':sigs,'captured_pump_loads':len(loads),'candidate_structured_or_strict_source_differences':0,'source_normalization':None,'compiler_or_vm_executed_by_verifier':False},indent=2))
