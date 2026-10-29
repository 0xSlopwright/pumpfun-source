from pathlib import Path
import collections,gzip,hashlib,json,struct,subprocess,tempfile,types,shutil,sys
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W));sys.dont_write_bytecode=True
from elf_reader import Elf
import independent_event_provenance as events
import independent_callgap_proof as pda
import wrapper_census
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
J=lambda p:json.loads(Path(p).read_bytes())
CAND='9278a52ae4fd93bb6159a72fa625f121394902a93f701d86931a7ec3778055fb'
BASE='c20007e860f47db1cc443344605afafe505d61bb4de6d61306fa164db3482544'
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
 assert(m['windows'],m['normalized'],m['raw'],m['normalized_text_bytes'])==(785,656,148,826112)and not(g or l or rg or rl)
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
 assert sum(x['full_normalized_callee_pair']for x in out)==27
 # These exact body slices encode the recipient snapshot and later reuse, and
 # quote-mint loads from the same Pool field. Equality is not whole data closure.
 witnesses=[]
 for label,offset,size in [('recipient_capture',112,80),('pool_quote_mint_capture',2960,96),('recipient_event_reuse',3056,64)]:
  assert o.normalized[a+offset:a+offset+size]==c.normalized[b+offset:b+offset+size]
  witnesses.append({'role':label,'offset':offset,'bytes':size,'original_hex':o.normalized[a+offset:a+offset+size].hex(),'candidate_hex':c.normalized[b+offset:b+offset+size].hex()})
 return {'original':a,'candidate':b,'bytes':n,'differing_instruction_offsets':diffs,'source_fields':{'original':of,'candidate':cf},'calls':out,'full_callee_pairs':27,'unclosed_actual_calls':[x for x in out if not x['full_normalized_callee_pair']],'witnesses':witnesses,'whole_body_equal':False}

def sources(w):
 inv=lambda root:{str(p.relative_to(root)):H(p)for p in root.rglob('*')if p.is_file()};before,after=inv(w/'baseline-source'),inv(w/'source');comp=J(w/'composition.json');assert before==comp['base_sources']and after==comp['source_sha256'];assert comp['base_candidate_sha256']==BASE
 changes=[n for n in sorted(set(before)|set(after))if before.get(n)!=after.get(n)];assert changes==comp['changed_files']==['programs/pump-amm/src/cashback.rs','programs/pump-amm/src/creator_reassignment.rs','programs/pump-amm/src/instructions/sweep_fees.rs'];assert H(w/'combined.patch')==comp['aggregate_patch_sha256']
 with tempfile.TemporaryDirectory()as tmp:
  a=Path(tmp)/'a';b=Path(tmp)/'b';shutil.copytree(w/'baseline-source',a);shutil.copytree(w/'baseline-source',b)
  for row in comp['components']:
   patch=w/row['patch'];assert H(patch)==row['sha256'];r=subprocess.run(['patch','--batch','-p1','-i',str(patch)],cwd=a,capture_output=True,text=True);assert r.returncode==0,r.stderr
  r=subprocess.run(['patch','--batch','-p1','-i',str(w/'combined.patch')],cwd=b,capture_output=True,text=True);assert r.returncode==0,r.stderr;assert inv(a)==inv(b)==after
 binder=module('independent_binding',w/'verify_source_binding.py');bind=binder.verify(w/'canonical-source',w/'source',w/'build/build-comparison.json',w/'build/artifacts/pump_amm_recovered.so',w/'build/artifacts/unstripped.so',w/'dependency-proof')
 deps=module('independent_dependencies',w/'dependency-proof/verify.py').verify(w/'canonical-source',w/'build/build-comparison.json',w/'dependency-proof',H(w/'dependency-proof/manifest.json'))
 build=J(w/'build/build-attempt.json');assert build['source_unchanged']and build['returncode']==0 and build['dependency_cache_before']==build['dependency_cache_after']and len(build['dependency_cache_before'])==762;assert'Compiling pump-amm-recovered'in(w/'build/build.log').read_text()
 return {'changed_files':changes,'component_and_aggregate_patches_agree':True,'source_inputs':bind['total_compiled_inputs_verified'],'dependency_roots':deps['packages'],'dependency_artifacts_unchanged':762,'strict_repeat':False}

def static(w=W,write=False):
 O=w/'input-root/evidence/original/pump_amm/deployed.so';C=w/'build/artifacts/pump_amm_recovered.so';S=w/'build/artifacts/unstripped.so';B=w/'baseline-artifacts/pump_amm_recovered.so';BS=w/'baseline-artifacts/unstripped.so'
 assert H(C)==CAND and H(B)==BASE;o,c,s,b,bs=map(Elf,[O,C,S,B,BS]);assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]
 measured,rows=measure(o,c,s,b,bs);assert measured==J(w/'measurement.json');assert rows==J(w/'measurement-full.json')['rows']
 wrappers=wrapper_census.census(O,C,S);assert wrappers['normalized_and_relocation_matches']==38
 prov=events.scan(O,C,S,w/'pump_amm.json');assert all(x['original_same_source_stack']and x['candidate_same_source_stack']for x in prov['events']);assert prov==J(w/'event-provenance.json')
 pd=pda.selected(C,S);assert pd==J(w/'selected-callgap.json');body=sweep(o,c,s,rows)
 scope={'ROOT':w/'input-root'};direct=module('direct_audit',w/'closure-tools/audit.py',**scope).analyze(C,S,w/'measurement-full.json');desc=module('data_audit',w/'closure-tools/descriptors.py',**scope).analyze(C,S,direct);t=module('targets_audit',w/'closure-tools/targets.py',**scope);closed=t.analyze(C,S,direct,desc,False);origin=t.analyze(C,S,direct,desc,True)
 report={'candidate_sha256':CAND,'measurement':measured,'wrappers':38,'event_storage':prov,'set_error_pda':pd,'sweep':body,'direct_closure':direct['counts'],'bounded_static_closure':closed['counts'],'including_source_coordinates':origin['counts'],'source':sources(w),'whole_elf_equal':False}
 if write:
  for name,value in [('static-review.json',report),('direct-closure.json',direct),('descriptors.json',desc),('bounded-static.json',closed),('source-coordinate-closure.json',origin)]: (w/name).write_text(json.dumps(value,indent=2)+'\n')
 return report
if __name__=='__main__':
 result=static(write=True);print(json.dumps({k:v for k,v in result.items()if k not in ['event_storage','set_error_pda','sweep']},indent=2))
