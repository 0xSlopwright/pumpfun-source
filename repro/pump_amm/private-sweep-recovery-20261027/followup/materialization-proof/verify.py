"""Portable review of checkpoint materialization evidence; no compiler or VM."""
from pathlib import Path
import ast,gzip,hashlib,importlib.util,json,subprocess,tempfile

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def verify(directory=None):
 P=Path(directory)if directory is not None else Path(__file__).resolve().parent
 manifest=read(P/'manifest.json');assert manifest['files']=={str(p.relative_to(P)):sha(p)for p in P.rglob('*')if p.is_file()and p!=P/'manifest.json'}
 inv=read(P/'inventory.json');old=read(P/'source-manifest.json.gz');sizes=read(P/'file-sizes.json.gz');trimmed=read(P/'trimmed-manifest.json.gz');omissions=read(P/'lineage-omissions.json')
 raw=gzip.decompress((P/'source-manifest.json.gz').read_bytes());assert hashlib.sha256(raw).hexdigest()==inv['source_manifest_sha256']==omissions['archive_results_manifest_sha256']
 assert set(sizes)==set(old)|{'manifest.json'}and len(sizes)==inv['full_results']['files']==19466
 assert sum(sizes.values())==inv['full_results']['bytes']==4210952440
 spec=importlib.util.spec_from_file_location('lineage_policy',P/'proposed/materialize_lineage.py');policy=importlib.util.module_from_spec(spec);spec.loader.exec_module(policy)
 keep=set(policy.RETAINED_LINEAGE);assert keep==set(inv['retained_directory_names'])and len(keep)==9
 all_dirs={k.split('/')[2]for k in old if k.startswith('new-proofs/lineage/')and len(k.split('/'))>3}
 omitted=all_dirs-keep;assert omitted==set(inv['omittable_directories'])and len(omitted)==21
 prefixes=['new-proofs/lineage/'+n+'/'for n in omitted]
 removed={k for k in old if any(k.startswith(x)for x in prefixes)}
 assert len(removed)==inv['omittable_files']==12993 and sum(sizes[k]for k in removed)==inv['omittable_bytes']==2778726394
 assert trimmed=={k:v for k,v in old.items()if k not in removed}
 receipt=read(P/'inventory-verification.json');assert receipt['passed']and receipt['preserved_files']==len(trimmed)==6472
 assert receipt['preserved_payload_bytes']==sum(sizes[k]for k in trimmed)==1428638247
 assert receipt['manifest_sha256']==hashlib.sha256(gzip.decompress((P/'trimmed-manifest.json.gz').read_bytes())).hexdigest()
 checks=read(P/'filter-verification.json');assert checks['passed']and checks['omitted_directories']==21 and checks['omitted_bytes']==2778726394
 for row in checks['checks']:assert row['matches_verified_retained_tree']
 assert [(x['phase'],x['planned_files'])for x in checks['checks']]==[('freeze',4729),('finalize',1071)]
 ref=read(P/'reference-inputs.json');components=read(P/'component-verification.json')
 for name,file in [('expanded','verify_new_proofs.py'),('recovery','verify_recovery.py')]:
  assert sha(P/'root-verifiers'/file)==ref['root_verifier_sha256'][file]==components[name]['verifier_sha256']
  v=components[name]['result']
  assert old['build/candidate.so']=='c20007e860f47db1cc443344605afafe505d61bb4de6d61306fa164db3482544'
  if name=='expanded':assert v['candidate_sha256']==old['build/candidate.so']
  for k,x in v.items():
   if k not in components[name]['root_summary_override_fields']:assert ref['saved_verification'][k]==x
 assert components['expanded']['result']['new_runtime_executions']==0
 assert components['recovery']['result']['current_incentive_boundary_cases']==1730 and components['recovery']['result']['current_incentive_boundary_mismatches']==0
 traces=read(P/'access-traces.json.gz');seen=set();subcommands=[]
 for row in traces:
  assert not row['denied'];subcommands.extend(row['subprocesses'])
  for path in row['private_accesses']:
   if path.startswith('results/new-proofs/lineage/'):seen.add(path.split('/')[3])
 assert seen==keep and len(traces)==2 and len(subcommands)==7
 for command in subcommands:assert command[0].endswith('/python')and command[2].endswith('/lineage/range-joint/verify.py')or command[:4]==['patch','--batch','-p1','-i']
 controls=read(P/'negative-controls.json');assert controls['passed']and controls['private_packets_restored']
 assert controls['compiler_executions']==controls['vm_executions']==0
 assert {(x['component'],x['removed_packet'])for x in controls['controls']}=={('verify_recovery.py','protocol-recipient'),('verify_new_proofs.py','route-guard-component')}
 for row in controls['controls']:
  assert row['result']=='required_packet_rejected'and row['exception_type']=='FileNotFoundError'
  assert row['missing_path'].endswith('/lineage/'+row['removed_packet']+'/verify.py')
  assert row['verifier_sha256']==ref['root_verifier_sha256'][row['component']]
 for row in read(P/'negative-access-traces.json.gz'):assert not row['denied']
 # A future checkpoint may explicitly name its current packet differently.
 with tempfile.TemporaryDirectory()as td:
  q=Path(td);(q/'current-renamed').mkdir();(q/'old-history').mkdir()
  assert policy.lineage_ignore(q,retained_names={'current-renamed'})(q,['current-renamed','old-history'])==['old-history']
 # The proposed diff applies exactly to the archived coordinator scripts.
 with tempfile.TemporaryDirectory()as td:
  Q=Path(td)
  for n in ['freeze.py','finalize-proofs.py']:(Q/n).write_bytes((P/'original'/n).read_bytes())
  r=subprocess.run(['patch','--batch','-p1','-i',str((P/'materialization.patch').resolve())],cwd=Q,capture_output=True,text=True);assert r.returncode==0,r.stderr
  for n in ['freeze.py','finalize-proofs.py','materialize_lineage.py']:
   assert (Q/n).read_bytes()==(P/'proposed'/n).read_bytes();compile((Q/n).read_bytes(),n,'exec')
 return {'passed':True,'manifest_sha256':sha(P/'manifest.json'),'omitted_directories':21,'omitted_files':12993,'omitted_payload_bytes':2778726394,'source_results_bytes':4210952440,'retained_payload_bytes':1428638247,'retained_lineage_directories':9,'unchanged_saved_components_passed':2,'negative_required_packet_controls':2,'explicit_retained_names_supported':True,'source_checkpoint_fallback_reads':0,'new_compiler_executions':0,'new_vm_executions':0,'scope':'Saved component and file-identity proof for whole historical packet omission in future materialization. Source checkpoint remains unchanged; wall-clock and Git pack-transfer savings are not measured.'}
if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);a=p.parse_args();print(json.dumps(verify(a.directory),indent=2))
