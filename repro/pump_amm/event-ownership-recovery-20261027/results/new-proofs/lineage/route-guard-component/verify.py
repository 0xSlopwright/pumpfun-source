"""Recheck saved route classifier source, instruction, call, data and signed-runtime evidence."""
from pathlib import Path
import argparse,collections,difflib,gzip,hashlib,json,struct,sys,tempfile,types
sys.dont_write_bytecode=True
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
HB=lambda b:hashlib.sha256(b).hexdigest()
def load(p):return json.loads(Path(p).read_bytes())
def module(path,name):
 p=Path(path);m=types.ModuleType(name);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m
def census(original,candidate,symbols):
 assert candidate.b[candidate.lo:candidate.hi]==symbols.b[symbols.lo:symbols.hi]
 assert candidate.pattern(candidate.lo,candidate.hi-candidate.lo)==symbols.pattern(symbols.lo,symbols.hi-symbols.lo)
 index=collections.defaultdict(list)
 for f in symbols.funcs:
  a,n=f['start'],f['size'];index[(n,HB(candidate.normalized[a:a+n]),json.dumps(candidate.pattern(a,n),sort_keys=True))].append({'start':a,'name':f['name'],'raw_sha256':HB(candidate.b[a:a+n])})
 entries=sorted(set(original.entries)|{original.lo});rows=[]
 for a,b in zip(entries,entries[1:]+[original.hi]):
  matches=index[(b-a,HB(original.normalized[a:b]),json.dumps(original.pattern(a,b-a),sort_keys=True))];rows.append({'start':a,'end':b,'matches':matches,'raw_match':any(x['raw_sha256']==HB(original.b[a:b])for x in matches)})
 return rows

def verify(directory,candidate=None):
 d=Path(directory);candidate=Path(candidate)if candidate else d/'candidate.so';manifest=load(d/'manifest.json');files={str(p.relative_to(d)):H(p)for p in d.rglob('*')if p.is_file()and'__pycache__'not in p.parts and p!=d/'manifest.json'};assert files==manifest['files']
 s=load(d/'summary.json');assert H(candidate)==H(d/'candidate.so')==s['candidate_sha256'];assert H(d/'baseline.so')==s['baseline_sha256']
 record=load(d/'build.json');assert record['returncode']==0 and record['source_unchanged']and not record['priming'];assert record['source_sha256']==record['source_after_sha256'];assert record['dependency_cache_before']==record['dependency_cache_after']and len(record['dependency_cache_before'])==732;assert record['archived_unstripped_sha256']==record['unstripped_sha256']==H(d/'unstripped.so');assert record['comparison']['candidate_sha256']==s['candidate_sha256']
 local={key.split('/source/',1)[1]:value for key,value in record['source_sha256'].items()if '/source/'in key};actual={str(p.relative_to(d/'source')):H(p)for p in(d/'source').rglob('*')if p.is_file()};assert actual==local and len(local)==48 and len(record['source_sha256'])==217
 prior={str(p.relative_to(d/'base-source')):H(p)for p in(d/'base-source').rglob('*')if p.is_file()};assert actual.keys()==prior.keys();name='programs/pump-amm/src/multi_hop.rs';assert [p for p in prior if prior[p]!=actual[p]]==[name];patch=''.join(difflib.unified_diff((d/'base-source'/name).read_text().splitlines(keepends=True),(d/'source'/name).read_text().splitlines(keepends=True),fromfile='a/'+name,tofile='b/'+name));assert patch==(d/'recovery.patch').read_text()
 Elf=module(d/'elf_reader.py','selector_elf').Elf;original=gzip.decompress((d/'original.so.gz').read_bytes());assert HB(original)==s['original_sha256']
 with tempfile.TemporaryDirectory()as temporary:
  p=Path(temporary)/'original.so';p.write_bytes(original);O=Elf(p);C=Elf(candidate);S=Elf(d/'unstripped.so');B=Elf(d/'baseline.so');BS=Elf(d/'baseline-unstripped.so');rows=census(O,C,S);base=census(O,B,BS);assert rows==load(d/'measurement.json')['rows'];assert base==load(d/'baseline-measurement.json')['rows'];assert len(rows)==785 and sum(bool(x['matches'])for x in rows)==623 and sum(x['raw_match']for x in rows)==128
  assert all(bool(a['matches'])==bool(b['matches'])and a['raw_match']==b['raw_match']for a,b in zip(base,rows))
  wa=next(f for f in BS.funcs if '__global29admin_update_token_incentives'in f['name']);wb=next(f for f in S.funcs if '__global29admin_update_token_incentives'in f['name']);assert wa['size']==wb['size'] and B.normalized[wa['start']:wa['start']+wa['size']]==C.normalized[wb['start']:wb['start']+wb['size']] and B.pattern(wa['start'],wa['size'])==C.pattern(wb['start'],wb['size'])
  f=next(f for f in S.funcs if '12is_curve_hop17'in f['name']);a,n,b=0x3d8d0,752,f['start'];assert f['size']==n;x=bytearray(O.normalized[a:a+n]);y=bytearray(C.normalized[b:b+n]);assert [i for i in range(0,n,8)if x[i:i+8]!=y[i:i+8]]==[560,568];assert O.pattern(a,n)==C.pattern(b,n)
  for off,op in [(560,0x62),(568,0x7a)]:assert x[off]==y[off]==op and x[off:off+4]==y[off:off+4];x[off+4:off+8]=y[off+4:off+8]
  assert x==y
  lines=(d/'source'/name).read_text().splitlines();begin=next(i for i,v in enumerate(lines)if v.startswith('fn is_curve_hop'));line=next(i+1 for i in range(begin,len(lines))if 'err!(PumpAmmError::AccountTypeNotSupported)'in lines[i]);assert struct.unpack_from('<I',C.b,b+560+4)[0]==line
  assert struct.unpack_from('<I',O.b,a+560+4)[0]==239
  assessment=load(d/'assessment.json');assert all(x['exact']for x in assessment['calls'])
  for obj in assessment['constant_objects']:
   left=O.b[obj['original_address']:obj['original_address']+32];right=C.b[obj['candidate_address']:obj['candidate_address']+32];assert left==right and left.hex()==obj['original_hex']==obj['candidate_hex']
  for elf,start in [(O,a),(C,b)]:
   offset=520;pointer=struct.unpack_from('<I',elf.b,start+offset+4)[0];length=struct.unpack_from('<I',elf.b,start+568+4)[0];value=elf.b[pointer:pointer+length];assert value.decode()==('programs/pump-amm/src/instructions/swap/multi_hop_swap.rs'if elf is O else name)
  original_calls,candidate_calls=O.callsites(a,n),C.callsites(b,n);assert len(original_calls)==len(candidate_calls)==7
  for old,new in zip(original_calls,candidate_calls):
   assert old['offset']==new['offset'];idx=O.entries.index(old['target']);size=O.entries[idx+1]-O.entries[idx];cf=next(f for f in S.funcs if f['start']==new['target']);assert size==cf['size'];assert O.normalized[old['target']:old['target']+size]==C.normalized[new['target']:new['target']+size];assert O.pattern(old['target'],size)==C.pattern(new['target'],size)
 runtime=module(d/'runtime/verify.py','route_receipts').verify(d/'runtime',candidate)
 baseline=module(d/'baseline-runtime/verify.py','route_baseline').verify(d/'baseline-runtime',d/'baseline.so',True);assert baseline['mismatch_count']==12 and runtime['mismatch_count']==0
 old=json.loads(gzip.decompress((d/'baseline-runtime/reports/routes.json.gz').read_bytes()));new=json.loads(gzip.decompress((d/'runtime/reports/routes.json.gz').read_bytes()))
 for x,y in zip(old['cases'],new['cases']):assert x['case']==y['case']and x['original']==y['original']and x['candidate']['before']==y['candidate']['before']and x['candidate']['transaction_base64']==y['candidate']['transaction_base64']
 return {'verified':True,'candidate_sha256':s['candidate_sha256'],'normalized_matches':623,'raw_matches':128,'gains':[],'losses':[],'helper_bytes':752,'remaining_origin_offsets':[560,568],'actual_callees_verified':7,'owner_id_objects_verified':2,'cases':runtime['cases'],'signatures':runtime['verified_signatures'],'mismatches':0,'baseline_mismatches':12,'executes_runtime':False,'scope':'Rechecks saved Rust source and patch, build/dependency equality records, full window census, actual helper/callees/constants and signed full-state/log receipts. Historical source location remains unresolved; this is not a newly strict-matched window. Registry and SDK archive provenance are inherited, not reproduced here.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);p.add_argument('--candidate',type=Path);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate),indent=2))
