#!/usr/bin/env python3
from pathlib import Path
import collections,difflib,gzip,hashlib,importlib.util,json,struct,subprocess,sys,tempfile,types
W=Path(__file__).resolve().parent
sys.dont_write_bytecode = True
sys.path.insert(0,str(W))
from elf_reader import Elf
SHA=lambda b:hashlib.sha256(b).hexdigest()
def load(p):return json.loads(Path(p).read_bytes())
def module(name,path,**values):
 m=types.ModuleType(name);m.__file__=str(path);m.__dict__.update(values);exec(compile(Path(path).read_bytes(),str(path),'exec'),m.__dict__);return m
def index(e,s):
 x=collections.defaultdict(list)
 for f in s.funcs:x[(f['size'],e.normalized[f['start']:f['start']+f['size']],json.dumps(e.pattern(f['start'],f['size']),sort_keys=True))].append(f)
 return x
def measured(o,c,s,b,bs):
 ix,old=index(c,s),index(b,bs);rows=[];gains=[];losses=[];rg=[];rl=[]
 for a,z in zip(o.entries,o.entries[1:]+[o.hi]):
  key=(z-a,o.normalized[a:z],json.dumps(o.pattern(a,z-a),sort_keys=True));now,prior=ix[key],old[key];raw=any(o.b[a:z]==c.b[f['start']:f['start']+z-a]for f in now);before=any(o.b[a:z]==b.b[f['start']:f['start']+z-a]for f in prior);rows.append({'start':a,'end':z,'matches':now,'raw_match':raw})
  if now and not prior:gains.append(hex(a))
  if prior and not now:losses.append(hex(a))
  if raw and not before:rg.append(hex(a))
  if before and not raw:rl.append(hex(a))
 return {'candidate_sha256':SHA(c.b),'symbols_sha256':SHA(s.b),'windows':len(rows),'normalized':sum(bool(r['matches'])for r in rows),'raw':sum(r['raw_match']for r in rows),'normalized_text_bytes':sum(r['end']-r['start']for r in rows if r['matches']),'normalized_gains':gains,'normalized_losses':losses,'raw_gains':rg,'raw_losses':rl},rows
GAINS=[(0x17960,3024,'Disable'),(0x74e30,1480,'harvest_wrapper'),(0xf6eb0,2664,'harvest_provider')]
def gains(o,c,s):
 ix=index(c,s);sz={a:z-a for a,z in zip(o.entries,o.entries[1:]+[o.hi])};by_start=collections.defaultdict(list)
 for f in s.funcs:by_start[f['start']].append(f)
 out=[]
 for a,n,name in GAINS:
  fs=ix[(n,o.normalized[a:a+n],json.dumps(o.pattern(a,n),sort_keys=True))];assert len(fs)==1,(name,'body mismatch');f=fs[0];b=f['start'];calls=[]
  for pc,target in o.calls.items():
   if a<=pc<a+n:
    cp=b+pc-a;assert cp in c.calls;ct=c.calls[cp];size=sz[target];match=next((q for q in by_start[ct]if q['size']==size),None);assert match,(name,'target extent',pc)
    assert o.normalized[target:target+size]==c.normalized[ct:ct+size],(name,'callee body',pc)
    assert o.pattern(target,size)==c.pattern(ct,size),(name,'callee relocation',pc)
    calls.append({'offset':pc-a,'original_target':hex(target),'candidate_target':hex(ct),'candidate_name':match['name'],'bytes':size,'full_normalized_body_and_relocations_equal':True})
  out.append({'name':name,'original':hex(a),'bytes':n,'candidate':f,'calls':calls,'external_calls':[x for x in o.pattern(a,n) if x['type']==10],'all_calls_verified':True})
 assert [len(x['calls'])for x in out]==[9,2,28]
 return out

def source_check(w):
 a,b=w/'baseline-source',w/'source'; inventories=[]
 for root in [a,b]:inventories.append({str(p.relative_to(root)):SHA(p.read_bytes())for p in root.rglob('*')if p.is_file()})
 changed=[n for n in sorted(set(inventories[0])|set(inventories[1]))if inventories[0].get(n)!=inventories[1].get(n)]
 assert changed==['programs/pump-amm/src/boost_burn.rs','programs/pump-amm/src/instructions/boost.rs','programs/pump-amm/src/instructions/create_pool.rs','programs/pump-amm/src/lib.rs','programs/pump-amm/src/utils/token.rs']
 comp=load(w/'worker-records/composition-final.json');assert inventories==[comp['base_source_sha256'],comp['final_source_sha256']]
 with tempfile.TemporaryDirectory()as td:
  import shutil
  target=Path(td)/'source';shutil.copytree(a,target)
  p=subprocess.run(['patch','--batch','-p1','-i',str(w/'worker-records/aggregate-653.patch')],cwd=target,capture_output=True,text=True);assert p.returncode==0,p.stderr
  actual={str(p.relative_to(target)):SHA(p.read_bytes())for p in target.rglob('*')if p.is_file()};assert actual==inventories[1]
 # Every source file and every source compiler record is verified through the same
 # canonical-to-workspace transform; this does not execute a new compiler.
 import verify_source_binding as bind
 dep=module('independent_dependencies',w/'dependency-proof/verify.py')
 record=w/'worker-records/build/build-comparison.json'
 deps=dep.verify(w/'canonical-source',record,w/'dependency-proof',SHA((w/'dependency-proof/manifest.json').read_bytes()))
 source=bind.verify(w/'canonical-source',w/'source',record,w/'artifacts/candidate.so',w/'artifacts/unstripped.so',w/'dependency-proof')
 rep=bind.verify(w/'canonical-source',w/'source',w/'worker-records/build-repeat/build-comparison.json',w/'artifacts/repeat.so',w/'artifacts/repeat-unstripped.so',w/'dependency-proof')
 assert (w/'artifacts/candidate.so').read_bytes()==(w/'artifacts/repeat.so').read_bytes();assert(w/'artifacts/unstripped.so').read_bytes()==(w/'artifacts/repeat-unstripped.so').read_bytes()
 for root in ['build','build-repeat']:
  r=load(w/'worker-records'/root/'build-attempt.json');assert r['returncode']==0 and r['source_unchanged'];assert r['dependency_cache_before']==r['dependency_cache_after'];assert len(r['dependency_cache_before'])==762
  assert 'Compiling pump-amm-recovered 'in(w/'worker-records'/root/'build.log').read_text()
 return {'changed_files':changed,'patch_applies_exactly':True,'source_binding':source,'repeat_binding':rep,'dependencies':deps,'cached_dependencies_unchanged':762,'fresh_compilation_recorded_twice':True}

def run(w=W,write=False):
 w=Path(w);o=Elf(w/'input-root/evidence/original/pump_amm/deployed.so');c=Elf(w/'artifacts/candidate.so');s=Elf(w/'artifacts/unstripped.so');b=Elf(w/'artifacts/baseline.so');bs=Elf(w/'artifacts/baseline-unstripped.so')
 assert SHA(c.b)=='58478a978292ea6bc4e6a9776a536f91a9384da7f1f82a2e1f9743659a34b58b';assert SHA(b.b)=='4e6a5617a7a8c3474ed7662f0188df4b1824c08253ebfb08212351ca5249da12'
 assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi] and b.b[b.lo:b.hi]==bs.b[bs.lo:bs.hi]
 m,rows=measured(o,c,s,b,bs);assert(m['windows'],m['normalized'],m['raw'],m['normalized_text_bytes'])==(785,656,148,826112);assert m['normalized_gains']==['0x17960','0x74e30','0xf6eb0'];assert not(m['normalized_losses']or m['raw_gains']or m['raw_losses'])
 worker=load(w/'worker-records/measurement-full.json');assert len(worker['rows'])==len(rows)
 for x,y in zip(rows,worker['rows']):
  assert(x['start'],x['end'],x['raw_match'])==(y['start'],y['end'],y['raw_match'])
  assert{(q['start'],q['name'])for q in x['matches']}=={(q['start'],q['name'])for q in y['matches']}
 spec={'ROOT':w/'input-root'};audit=module('direct',w/'closure-tools/audit.py',**spec);des=module('desc',w/'closure-tools/descriptors.py',**spec);targ=module('targ',w/'closure-tools/targets.py',**spec)
 clo=audit.analyze(w/'artifacts/candidate.so',w/'artifacts/unstripped.so',w/'worker-records/measurement-full.json');ds=des.analyze(w/'artifacts/candidate.so',w/'artifacts/unstripped.so',clo);static=targ.analyze(w/'artifacts/candidate.so',w/'artifacts/unstripped.so',clo,ds,False);origins=targ.analyze(w/'artifacts/candidate.so',w/'artifacts/unstripped.so',clo,ds,True)
 src=source_check(w)
 report={'candidate_sha256':SHA(c.b),'measurement':m,'gains':gains(o,c,s),'direct_closure':clo['counts'],'bounded_static_closure':static['counts'],'including_source_coordinates':origins['counts'],'source':src,'new_runtime_executions':0,'whole_elf_equal':False,'scope':'Independent complete window recount, actual first-level callees for all three gains, bounded call/data closure, source/recipe/archive binding. Existing runtime receipts remain a separate worker gate; this audit performs no new build or VM execution.'}
 if write:
  for p,v in [('review.json',report),('call-closure.json',clo),('descriptors.json',ds),('bounded-static.json',static),('origins.json',origins),('measurement.json',{'candidate_sha256':SHA(c.b),'rows':rows})]:(w/p).write_text(json.dumps(v,indent=2)+'\n')
 return report
if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--write',action='store_true');p.add_argument('--root',type=Path,default=W);a=p.parse_args();print(json.dumps(run(a.root,a.write),indent=2))
