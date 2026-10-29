#!/usr/bin/env python3
from pathlib import Path,PurePosixPath
import collections,hashlib,importlib.util,json,subprocess,sys,tempfile,shutil,gzip
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W))
from elf_reader import Elf
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
J=lambda p:json.loads(Path(p).read_bytes())
CANDIDATE='da29e99d0dbb63b50bb59655f7788fad0a06b7aa75dfdcebcf043d0f7ea76a59'
BASE='58478a978292ea6bc4e6a9776a536f91a9384da7f1f82a2e1f9743659a34b58b'

def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m

def index(e,s):
 x=collections.defaultdict(list)
 for f in s.funcs:x[(f['size'],e.normalized[f['start']:f['start']+f['size']],json.dumps(e.pattern(f['start'],f['size']),sort_keys=True))].append(f)
 return x

def measure(o,c,s,b,bs):
 now,old=index(c,s),index(b,bs);rows=[];g=[];l=[];rg=[];rl=[]
 for a,z in zip(o.entries,o.entries[1:]+[o.hi]):
  k=(z-a,o.normalized[a:z],json.dumps(o.pattern(a,z-a),sort_keys=True));n,p=now[k],old[k];raw=any(o.b[a:z]==c.b[q['start']:q['start']+z-a]for q in n);prev=any(o.b[a:z]==b.b[q['start']:q['start']+z-a]for q in p);rows.append({'start':a,'end':z,'matches':n,'raw_match':raw})
  if n and not p:g.append(hex(a))
  if p and not n:l.append(hex(a))
  if raw and not prev:rg.append(hex(a))
  if prev and not raw:rl.append(hex(a))
 out={'windows':len(rows),'normalized':sum(bool(x['matches'])for x in rows),'raw':sum(x['raw_match']for x in rows),'normalized_text_bytes':sum(x['end']-x['start']for x in rows if x['matches']),'normalized_gains':g,'normalized_losses':l,'raw_gains':rg,'raw_losses':rl}
 assert(out['windows'],out['normalized'],out['raw'],out['normalized_text_bytes'])==(785,656,148,826112);assert not(g or l or rg or rl)
 return out,rows

def check_body(o,c,s,rows):
 bytarget={x['start']:{q['start']for q in x['matches']}for x in rows};out=[]
 for name,a,n,want_size in [('deposit',0x2fb38,7128,7128),('withdraw',0x32750,7200,7176)]:
  fs=[f for f in s.funcs if('9liquidity'+str(len(name))+name+str(len(name))+name+'17h')in f['name']];assert len(fs)==1;f=fs[0];b=f['start'];assert f['size']==want_size
  oc=o.callsites(a,n);cc=c.callsites(b,f['size']);assert len(oc)==len(cc)==(55 if name=='deposit'else 56)
  bound=[];unbound=[]
  # For paired identical offsets, retain actual callee identity where a complete
  # original-window/candidate body pair is already known. Unknown helpers stay open.
  cm={v['offset']:v['target']for v in cc}
  for x,y in zip(oc,cc):
   if x['offset']!=y['offset']:continue
   targets=bytarget.get(x['target'],set())
   if targets:
    assert cm[x['offset']]in targets,(name,'wrong actual callee',x);bound.append(x['offset'])
   else:unbound.append(x['offset'])
  info={'name':name,'original':a,'original_bytes':n,'candidate':f,'original_calls':len(oc),'candidate_calls':len(cc),'identical_call_offsets':sum(x['offset']in cm for x in oc),'fully_paired_actual_callee_offsets':bound,'unmatched_helper_offsets_not_claimed':unbound}
  if name=='deposit':
   assert o.pattern(a,n)==c.pattern(b,n)
   ds=[i for i in range(0,n,8)if o.normalized[a+i:a+i+8]!=c.normalized[b+i:b+i+8]];assert ds==[800,1536,1920,3968,4648,4656],ds
   for i in ds[:4]:assert o.normalized[a+i:a+i+4]==c.normalized[b+i:b+i+4]and o.b[a+i]==0x62
   assert o.normalized[a+4648:a+4656]==c.normalized[b+4656:b+4664]and o.normalized[a+4656:a+4664]==c.normalized[b+4648:b+4656]
   assert len(bound)+len(unbound)==55
   info['remaining_instruction_differences']=ds;info['full_body_equal']=False
   # Both provider-key comparisons retain the actual original three-instruction sequence.
   for i in(2808,3224):assert o.normalized[a+i:a+i+24]==c.normalized[b+i:b+i+24]
   info['provided_token_program_comparison_offsets']=[2808,3224]
  out.append(info)
 return out

def verify(root=None):
 w=Path(__file__).resolve().parent;m=J(w/'manifest.json');actual={str(p.relative_to(w))for p in w.rglob('*')if p.is_file()and '__pycache__'not in p.parts};assert actual==set(m['files'])|{'manifest.json'}
 for n,h in m['files'].items():
  p=PurePosixPath(n);assert not p.is_absolute()and '..'not in p.parts;assert H(w/n)==h,n
 for n,x in J(w/'compression-map.json').items():assert hashlib.sha256(gzip.decompress((w/n).read_bytes())).hexdigest()==x['uncompressed_sha256']
 o=Elf(w/'input-root/evidence/original/pump_amm/deployed.so');c=Elf(w/'build/artifacts/pump_amm_recovered.so');s=Elf(w/'build/artifacts/unstripped.so');b=Elf(w/'baseline/candidate.so');bs=Elf(w/'baseline/unstripped.so');assert H(c.path)==CANDIDATE and H(b.path)==BASE;assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]
 measured,rows=measure(o,c,s,b,bs);bodies=check_body(o,c,s,rows)
 expected=J(w/'measurement.json');assert all(x['body_equal']for x in expected['wrappers'])and len(expected['wrappers'])==38
 for x in expected['wrappers']:
  f=x['candidate'];a=x['original_start'];n=x['original_size'];assert any(q==f for q in s.funcs);assert o.normalized[a:a+n]==c.normalized[f['start']:f['start']+f['size']]and o.pattern(a,n)==c.pattern(f['start'],f['size'])
 # Bind exact canonical/source bytes and the unmodified nine authenticated roots.
 binder=module('liquidity_source_binding',w/'verify_source_binding.py');src=binder.verify(w/'canonical-source',w/'source',w/'build/build-comparison.json',c.path,s.path,w/'dependency-proof')
 deps=module('liquidity_dependency_binding',w/'dependency-proof/verify.py').verify(w/'canonical-source',w/'build/build-comparison.json',w/'dependency-proof',H(w/'dependency-proof/manifest.json'))
 a={str(p.relative_to(w/'baseline/source')):H(p)for p in(w/'baseline/source').rglob('*')if p.is_file()};z={str(p.relative_to(w/'source')):H(p)for p in(w/'source').rglob('*')if p.is_file()};changed=[n for n in sorted(set(a)|set(z))if a.get(n)!=z.get(n)];assert changed==['programs/pump-amm/src/instructions/liquidity/deposit.rs','programs/pump-amm/src/instructions/liquidity/withdraw.rs','programs/pump-amm/src/lib.rs']
 with tempfile.TemporaryDirectory()as td:
  q=Path(td)/'source';shutil.copytree(w/'baseline/source',q);p=subprocess.run(['patch','--batch','-p1','-i',str(w/'recovery.patch')],cwd=q,capture_output=True,text=True);assert p.returncode==0,p.stderr;assert{str(x.relative_to(q)):H(x)for x in q.rglob('*')if x.is_file()}==z
 case=module('liquidity_cases',w/'verify_cases.py').verify(w)
 return {'passed':True,'candidate_sha256':CANDIDATE,'baseline_candidate_sha256':BASE,**measured,'wrappers':38,'bodies':bodies,'source_inputs':src['total_compiled_inputs_verified'],'canonical_inputs':src['standalone_inputs'],'dependency_roots':deps['packages'],'cases':case['cases'],'verified_signatures':case['verified_signatures'],'new_compiler_executions':0,'new_vm_executions':0,'whole_elf_equal':False,'manifest_sha256':H(w/'manifest.json'),'scope':'Qualified source-structure proposal; no normalized-window gain, no strict repeat or full-core claim. Deposit differs by four source coordinates and one load-order swap; Withdraw remains24bytes short.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
