from pathlib import Path
import collections,gzip,hashlib,json,struct,subprocess,tempfile,types,shutil,sys
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W));sys.dont_write_bytecode=True
from elf_reader import Elf
import independent_event_provenance as events
import independent_callgap_proof as pda
import wrapper_census
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
J=lambda p:json.loads(Path(p).read_bytes())
CAND='dbb5dcfd1a1487e22d61ae68d22a9b74087b78a868a08ab974c7bdbb127f1500'
BASE='01a038ead3614b09af8d9431d3253be2db9efc142ac17ced923d12ab6afe2609'
def module(name,path,**scope):
 m=types.ModuleType(name);m.__file__=str(path);m.__dict__.update(scope);exec(compile(Path(path).read_bytes(),str(path),'exec'),m.__dict__);return m

def index(e,s):
 ix=collections.defaultdict(list)
 for f in s.funcs:ix[(f['size'],e.normalized[f['start']:f['start']+f['size']],json.dumps(e.pattern(f['start'],f['size']),sort_keys=True))].append(f)
 return ix

def measure(o,c,s,b,bs):
 now,old=index(c,s),index(b,bs);rows=[];g=[];l=[];rg=[];rl=[]
 for a,z in zip(o.entries,o.entries[1:]+[o.hi]):
  k=(z-a,o.normalized[a:z],json.dumps(o.pattern(a,z-a),sort_keys=True));ns,os=now[k],old[k];raw=any(o.b[a:z]==c.b[f['start']:f['start']+z-a]for f in ns);prior=any(o.b[a:z]==b.b[f['start']:f['start']+z-a]for f in os);rows.append({'start':a,'end':z,'matches':ns,'raw_match':raw})
  if ns and not os:g.append(a)
  if os and not ns:l.append(a)
  if raw and not prior:rg.append(a)
  if prior and not raw:rl.append(a)
 m={'candidate_sha256':H(c.path),'symbols_sha256':H(s.path),'windows':len(rows),'normalized':sum(bool(x['matches'])for x in rows),'raw':sum(x['raw_match']for x in rows),'normalized_text_bytes':sum(x['end']-x['start']for x in rows if x['matches']),'normalized_gains':g,'normalized_losses':l,'raw_gains':rg,'raw_losses':rl}
 assert(m['windows'],m['normalized'],m['raw'],m['normalized_text_bytes'])==(785,660,159,831376)and g==[]and len(rg)==0 and not(l or rl)
 return m,rows

def sweep(o,c,s,rows):
 a,n=0x59408,4456;f=next(f for f in s.funcs if '10sweep_fees7execute17h'in f['name']);b=f['start'];assert f['size']==n and o.pattern(a,n)==c.pattern(b,n)
 diffs=[i for i in range(0,n,8)if o.normalized[a+i:a+i+8]!=c.normalized[b+i:b+i+8]];assert diffs==[1208,1688]
 sf=module('typed_fields',W/'source_fields.py');of,cf=sf.source_fields(o,a,n),sf.source_fields(c,b,n);assert[(x['line_store']-a,x['filename'],x['line'])for x in of]==[(1208,'programs/pump-amm/src/instructions/sweep_fees.rs',91),(1688,'programs/pump-amm/src/instructions/sweep_fees.rs',113)];assert[(x['line_store']-b,x['filename'],x['line'])for x in cf]==[(1208,'programs/pump-amm/src/instructions/sweep_fees.rs',32),(1688,'programs/pump-amm/src/instructions/sweep_fees.rs',43)]
 # Only diagnose differences after proving their typed source descriptor fields.
 for i in diffs:assert o.b[a+i]==c.b[b+i]==0x62 and o.normalized[a+i:a+i+4]==c.normalized[b+i:b+i+4]
 om,cm=o.callsites(a,n),c.callsites(b,n);assert len(om)==len(cm)==31 and [x['offset']for x in om]==[x['offset']for x in cm];matched={r['start']:{f['start']for f in r['matches']}for r in rows};out=[]
 for x,y in zip(om,cm):
  ftarget=next(f for f in s.funcs if f['start']==y['target']);closed=y['target']in matched.get(x['target'],set())
  if matched.get(x['target']):assert closed,(x,y)
  out.append({'offset':x['offset'],'original_target':x['target'],'candidate_target':y['target'],'candidate_name':ftarget['name'],'full_normalized_callee_pair':closed})
 assert sum(x['full_normalized_callee_pair']for x in out)==28
 # These exact body slices encode the recipient snapshot and later reuse, and
 # quote-mint loads from the same Pool field. Equality is not whole data closure.
 witnesses=[]
 for label,offset,size in [('recipient_capture',112,80),('pool_quote_mint_capture',2960,96),('recipient_event_reuse',3056,64)]:
  assert o.normalized[a+offset:a+offset+size]==c.normalized[b+offset:b+offset+size]
  witnesses.append({'role':label,'offset':offset,'bytes':size,'original_hex':o.normalized[a+offset:a+offset+size].hex(),'candidate_hex':c.normalized[b+offset:b+offset+size].hex()})
 return {'original':a,'candidate':b,'bytes':n,'differing_instruction_offsets':diffs,'source_fields':{'original':of,'candidate':cf},'calls':out,'full_callee_pairs':28,'unclosed_actual_calls':[x for x in out if not x['full_normalized_callee_pair']],'witnesses':witnesses,'whole_body_equal':False}


def static(w=W,write=False):
 O=w/'input-root/evidence/original/pump_amm/deployed.so';C=w/'build/artifacts/pump_amm_recovered.so';S=w/'build/artifacts/unstripped.so';B=w/'baseline-artifacts/pump_amm_recovered.so';BS=w/'baseline-artifacts/unstripped.so'
 assert H(C)==CAND and H(B)==BASE;o,c,s,b,bs=map(Elf,[O,C,S,B,BS]);assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]
 measured,rows=measure(o,c,s,b,bs)
 wrappers=wrapper_census.census(O,C,S);assert wrappers['normalized_and_relocation_matches']==38
 body=sweep(o,c,s,rows)
 full=dict(measured,rows=rows)
 if write:(w/'measurement-full.json').write_text(json.dumps(full,indent=2)+'\n')
 else:assert full==J(w/'measurement-full.json')
 scope={'ROOT':w/'input-root'};direct=module('direct_audit',w/'closure-tools/audit.py',**scope).analyze(C,S,w/'measurement-full.json');desc=module('data_audit',w/'closure-tools/descriptors.py',**scope).analyze(C,S,direct);t=module('targets_audit',w/'closure-tools/targets.py',**scope);closed=t.analyze(C,S,direct,desc,False);origin=t.analyze(C,S,direct,desc,True)
 assert closed['counts']['bounded_static_closed_windows']==595 and origin['counts']['bounded_static_closed_windows']==588
 binder=module('new_source_binding',w/'verify_source_binding.py');bind=binder.verify(w/'canonical-source',w/'source',w/'build/build-comparison.json',C,S,w/'dependency-proof')
 deps=module('new_dependency_proof',w/'dependency-proof/verify.py').verify(w/'canonical-source',w/'build/build-comparison.json',w/'dependency-proof',H(w/'dependency-proof/manifest.json'))
 assert bind['total_compiled_inputs_verified']==233 and deps['unchanged_original_dependency_artifacts']==762
 result={'candidate_sha256':CAND,'measurement':measured,'wrappers':38,'sweep':body,'direct_closure':direct['counts'],'bounded_static_closure':closed['counts'],'including_source_coordinates':origin['counts'],'source':bind,'dependencies':deps,'whole_elf_equal':False}
 if write:
  for name,value in [('static-review.json',result),('measurement.json',measured),('direct-closure.json',direct),('descriptors.json',desc),('bounded-static.json',closed),('source-coordinate-closure.json',origin),('wrappers.json',wrappers)]: (w/name).write_text(json.dumps(value,indent=2)+'\n')
 return result
if __name__=='__main__':print(json.dumps({k:v for k,v in static(write=True).items()if k not in ['sweep','source']},indent=2))
