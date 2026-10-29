"""Verify saved recipient evidence and accept fresh45-case outputs from the same kit."""
from pathlib import Path
import argparse,gzip,hashlib,json,sys,tempfile,types
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
BASELINE='e97b3900800d4378486d9b1f7df040e6b7a57d34b31a9470a5f5eb3a9d2fb24b'
FIXED='ce08e4712bca5f49fd22e540dec7adac30022a7c7584c7c00a02271de3e49ec2'
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text())
def module(p):
 p=Path(p);m=types.ModuleType('checked_'+p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def check_inventory(d):
 files={str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'}
 assert files==load(d/'manifest.json')['files'];assert not any(p.is_symlink()for p in d.rglob('*'))

def verify_output(directory,candidate,output,expected_bad=0):
 d=Path(directory);candidate=Path(candidate);output=Path(output);check_inventory(d);m=module(d/'verify_expanded.py')
 result=m.verify(output/'report.json.gz',output/'transactions.json.gz',candidate,d/'probe.py',d/'observer.py',d/'cleaner.py',expected_bad)
 record=load(output/'run.json');spec=load(d/'runtime-inputs.json');inputs={**spec['repository_inputs'],**spec['runtime_binary_inputs']};assert record['inputs_before']==record['inputs_after']==inputs and record['candidate_sha256']==record['candidate_after_sha256']==sha(candidate);assert record['bytecode_cache_initially_absent_and_not_written'] is True
 if 'packet_manifest_sha256' in record:assert record['packet_manifest_sha256']==sha(d/'manifest.json')
 return result

def verify(directory,candidate=None):
 d=Path(directory);check_inventory(d);candidate=Path(candidate)if candidate else d/'build/candidate.so';assert sha(candidate)==FIXED and sha(d/'build/baseline.so')==BASELINE
 build=load(d/'build/build.json');assert build['source_unchanged']is True and build['source_sha256']==build['source_after_sha256'];assert build['dependency_cache_before']==build['dependency_cache_after'] and len(build['dependency_cache_before'])==732;assert build['comparison']['candidate_sha256']==FIXED and build['unstripped_sha256']==sha(d/'build/unstripped.so')
 local={k.split('/source/',1)[1]:v for k,v in build['source_sha256'].items()if '/source/'in k};assert len(local)==49;actual={str(p.relative_to(d/'source-behavior')):sha(p)for p in(d/'source-behavior').rglob('*')if p.is_file()};assert actual==local
 reader=module(d/'elf_reader.py');C=reader.Elf(candidate);S=reader.Elf(d/'build/unstripped.so');assert C.b[C.lo:C.hi]==S.b[S.lo:S.hi]and C.pattern(C.lo,C.hi-C.lo)==S.pattern(S.lo,S.hi-S.lo);f=[f for f in S.funcs if 'validate_protocol_fee_recipient' in f['name']];assert len(f)==1 and f[0]['size']==1376;f=f[0]
 raw=gzip.decompress((d/'original.so.gz').read_bytes());assert hashlib.sha256(raw).hexdigest()==ORIGINAL
 with tempfile.TemporaryDirectory()as temp:
  op=Path(temp)/'original.so';op.write_bytes(raw);O=reader.Elf(op);oc=O.callsites(0x58e08,1536);cc=C.callsites(f['start'],f['size']);assert len(oc)==len(cc)==13
  for old,new in zip(oc,cc):
   n=O.entries[O.entries.index(old['target'])+1]-old['target'];ff=[x for x in S.funcs if x['start']==new['target']and x['size']==n];assert ff;assert O.normalized[old['target']:old['target']+n]==C.normalized[new['target']:new['target']+n]and O.pattern(old['target'],n)==C.pattern(new['target'],n)
 a=verify_output(d,d/'build/baseline.so',d/'baseline',6);b=verify_output(d,candidate,d/'fixed',0);assert a['messages']==b['messages']and a['originals']==b['originals'];assert load(d/'measurement-delta.json')=={'normalized':{'gains':[],'losses':[]},'raw':{'gains':[],'losses':[]}}
 return {'verified':True,'behavior_candidate_sha256':FIXED,'behavior_helper_bytes':1376,'actual_direct_callees_verified':13,'source_inputs':len(build['source_sha256']),'immutable_dependencies':732,'cases_per_side':45,'signatures':a['verified_signatures']+b['verified_signatures'],'baseline_mismatches':6,'fixed_mismatches':0,'original_successes':30,'selected_native_patch_sha256':sha(d/'selected-native.patch'),'native_full_build_in_this_packet':False,'executes_runtime':False}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=HERE);p.add_argument('--candidate',type=Path);p.add_argument('--reports',type=Path);p.add_argument('--expected-bad',type=int,default=0);a=p.parse_args();r=verify_output(a.directory,a.candidate,a.reports,a.expected_bad)if a.reports else verify(a.directory,a.candidate);print(json.dumps({k:v for k,v in r.items()if k not in ['messages','originals']},indent=2))
