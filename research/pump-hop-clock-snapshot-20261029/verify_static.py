"""Read-only portable saved PR731 source/build/census/Clock-dataflow audit."""
if not __debug__:
    raise RuntimeError("PR731 saved evidence requires normal Python; optimized mode is rejected before validation")
import argparse, collections, csv, gzip, hashlib, importlib.util, json, struct, sys, tarfile
from pathlib import Path
sys.dont_write_bytecode = True
sha=lambda b:hashlib.sha256(b).hexdigest()
def need(x,m):
 if not x:raise ValueError(m)
def load(p):
 b=p.read_bytes();return json.loads(gzip.decompress(b) if b[:2]==b'\x1f\x8b' else b)
def module(path,name):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def archive(path):
 out={}
 with tarfile.open(path) as t:
  for f in t:
   n=Path(f.name);need(f.isfile() and not n.is_absolute() and '..' not in n.parts and f.name not in out,'unsafe archive member');out[f.name]=t.extractfile(f).read()
 return out

def graph(raw):
 ins={};i=0
 while i<len(raw):
  op,reg,off,imm=struct.unpack_from('<BBhi',raw,i);size=16 if op==0x18 else 8;ins[i]=(op,reg&15,reg>>4,off,imm,size);i+=size
 need(i==len(raw),'whole instruction stream');edges={}
 for at,(op,dst,src,off,imm,size) in ins.items():
  nxt=at+size
  if op==0x95:es=[]
  elif op&7 in (5,6) and op&0xf0 not in (0x80,0x90):es=[at+8+off*8]+([] if op==0x05 else [nxt])
  else:es=[nxt] if nxt<len(raw) else []
  need(all(e in ins for e in es),'instruction CFG target');edges[at]=es
 reached=set();todo=[0]
 while todo:
  n=todo.pop()
  if n in reached:continue
  reached.add(n);todo.extend(edges[n])
 return ins,edges,reached

def reaching(raw,reg,definition,uses,clock):
 ins,edges,reached=graph(raw);incoming={i:set() for i in reached};incoming[0]={'entry'};changed=True;iterations=0
 while changed:
  changed=False;iterations+=1
  for at in sorted(reached):
   op,dst,src,off,imm,size=ins[at]
   writes=(op&7 in (0,1,4,7) and dst==reg) or (op in (0x85,0x8d) and reg<=5)
   out={at} if writes else incoming[at]
   for succ in edges[at]:
    old=len(incoming[succ]);incoming[succ].update(out)
    changed|=old!=len(incoming[succ])
 need(all(incoming[u]=={definition} for u in uses),'single timestamp reaching definition')
 def without(blocked,target):
  seen=set();pending=[0]
  while pending:
   at=pending.pop()
   if at in seen or at==blocked:continue
   seen.add(at);pending.extend(edges[at])
  return target not in seen
 need(all(without(clock,u) and without(definition,u) for u in uses),'Clock and timestamp definition dominate uses')
 need(ins[definition][:4]==(0x79,reg,10,ins[definition][3]),'timestamp is frame load')
 for u in uses:need(ins[u][0]==0x7b and ins[u][1]==10 and ins[u][2]==reg,'timestamp consumed in field store')
 return {'reachable_instructions':len(reached),'iterations':iterations,'definition':hex(definition),'definition_instruction':ins[definition],'uses':[{'offset':hex(u),'frame':ins[u][3],'reaching':[hex(x) for x in incoming[u]],'clock_dominates':without(clock,u)} for u in uses]}

def verify(repo,p):
 repo=repo.resolve();p=p.resolve();result={}
 for folder in [p,p/'native-build']:
  expected=load(folder/'MANIFEST.json');expected=expected.get('files',expected)
  actual={f.relative_to(folder).as_posix():sha(f.read_bytes()) for f in folder.rglob('*') if f.is_file() and f!=folder/'MANIFEST.json' and '__pycache__' not in f.parts}
  
  if folder==p and 'native-build/MANIFEST.json' not in expected:actual.pop('native-build/MANIFEST.json',None)
  need(actual==expected,'literal complete manifest '+str(folder));result[str(folder.relative_to(p)) or '.']={'members':len(actual),'sha256':sha((folder/'MANIFEST.json').read_bytes())}
 # Invoke the exact published native authentication logic with normal Python.
 native=module(p/'qualification/executed-tools/native_binding.py','clock_native')
 record,compiled,result_native=native.authenticate(p/'native-build')
 need(result_native['candidate_sha256']=='0bc4a222f4040ad49b7228cd5ce7476ce8a3c96725a4634c476bc07fd5f83c89','literal candidate')
 need(result_native['unstripped_sha256']=='4f8f22984af1a35d9c6b0978e4d33b9e9bfe13a80188c6aabc41eb85fe3a0b14','literal symbols')
 built=archive(p/'native-build/compiled-source.tar.gz');baseline=repo/'research/pump-multihop-accrual-qualification-20261028'
 source={f.relative_to(baseline/'source').as_posix():f.read_bytes() for f in (baseline/'source').rglob('*') if f.is_file()}
 need(sha((baseline/'MANIFEST.json').read_bytes())=='d5a7e29ae52b385453e055cc619a1bee700f646123e86507daf35d9be5a2c9dd','admitted source packet seal');need({n:sha(v) for n,v in source.items()}==load(baseline/'SOURCE65.json'),'admitted immutable source65');need(len(source)==65,'standalone65');need(source['src/multi_hop_curve_swap.rs']==(p/'source-before.rs').read_bytes(),'actual current734 source')
 proposed=(p.parents[1]/'programs/pump/src/multi_hop_curve_swap.rs')
 # Research-only projections retain the proposed source in native evidence.
 after=(p/'native-build/proposed-source.rs').read_bytes();need(sha(after)=='5871a2cf35ebe0db502eb242db0f1652ef93e51e4971e56483016d900349ac2b','587 source')
 # The source proposal is authenticated from actual compiler bytes; current canonical source may evolve independently.
 source['src/multi_hop_curve_swap.rs']=after
 stage={ 'programs/pump/'+n:b for n,b in source.items() if n not in ('Cargo.toml','Cargo.lock')};text=source['Cargo.toml'].decode();a=text.index('[profile.release]');b=text.index('[workspace]')
 stage['programs/pump/Cargo.toml']=(text[:a].rstrip()+'\n').encode();stage['Cargo.toml']=('[workspace]\nmembers = ["programs/pump"]\nresolver = "2"\n\n'+text[a:b].strip()+'\n').encode();stage['Cargo.lock']=source['Cargo.lock']
 need(built==stage,'actual compiled66 source delta')
 main=load(p/'MAIN-65-BOUND.json');need(len(main['files'])==65,'65 main blobs')
 for row in main['files']:
  raw=(baseline/'source'/row['path'].removeprefix('programs/pump/')).read_bytes();need(sha(raw)==row['main_sha256'],'frozen main source blob '+row['path']);need(hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()==row['main_git_oid'],'Git blob identity')
 # Exact native/tool cohort is a saved receipt control, not a fresh host attestation.
 parent=load(baseline/'builds/cold-01/build-comparison.json')
 for key in ['tool_sha256','sdk_rust_libraries_sha256','target_libraries_sha256','source_wrapper_sha256']:
  need(record[key]==parent[key],'current admitted compiler cohort '+key)
 need(native.registry_shape(load(p/'native-build/registry-authentication.json'))==native.registry_shape(load(baseline/'builds/cold-01/registry-authentication.json')),'admitted254 archives/4176 registry source files');
 log=gzip.decompress((p/'native-build/build.log.gz').read_bytes()).decode();need(log.count('--crate-name pump_recovered ')==1 and log.count('--crate-name pump_token_ext ')==1,'actual local compiler commands');need('Fresh ' not in log,'cold build log')
 result['native']={'host':load(p/'native-build/host.json')['system'],'actual_builds':1,'local_compilers':2,'rustc_commands':log.count(' --crate-name '),'cold':True,'portable_builder_qualified_image_equal_flag':record['qualified_image_hashes_equal'],'preserved_historical_comparison_not_relabelled':True}
 sys.path.insert(0,str(repo/'scripts'));census=module(repo/'research/pump-final-composition-673-20261028/tools/census.py','clock_census');census.ROOT=repo
 new=census.census(p/'native-build/unstripped.so');old=census.census(baseline/'artifacts/unstripped.so')
 need(new['counts']==old['counts'] and new['counts']['normalized']==1019 and new['counts']['raw']==188,'complete census')
 def memberships(x,k):return {r['start'] for r in x['windows'] if r[k]}
 need(memberships(new,'normalized_matches')==memberships(old,'normalized_matches') and memberships(new,'raw_match')==memberships(old,'raw_match'),'no full-window gains or losses')
 result['census']=new['counts']
 elfmod=module(repo/'research/pump-call-closure-673-20261029/verify.py','clock_calls');ELF=elfmod.ELF
 original=ELF((repo/'evidence/original/pump/deployed.so').read_bytes());candidate=ELF((p/'native-build/unstripped.so').read_bytes());control=ELF((baseline/'artifacts/unstripped.so').read_bytes())
 sizes={row['start']:row['bytes'] for row in new['windows']}
 def fn(e,start):
  fs=e.functions.get(start,[]);return max(fs,key=lambda f:f['bytes'])['bytes'] if fs else sizes[start]
 def counts(e,start,size):
  actual=[q for q in e.calls(start,size) if q['kind']=='internal_relative'];counter=collections.Counter()
  for q in actual:
   length=fn(e,q['target']);counter[(length,sha(e.normalize(e.body(q['target'],length))))]+=1
  return actual,counter
 oc,oi=counts(original,0x5b3b0,18584);pc,pi=counts(control,0x67860,18536);cc,ci=counts(candidate,0x67860,18056)
 expected=load(p/'actual-clock-proof.json');changes=[{'callee_bytes':k[0],'callee_normalized_sha256':k[1],'before_occurrences':pi[k],'after_occurrences':ci[k]} for k in pi.keys()|ci.keys() if pi[k]!=ci[k]]
 need(sorted(changes,key=str)==sorted([{k:v for k,v in x.items() if k!='symbols'} for x in expected['changed_callee_identities']],key=str),'actual complete callee identity delta')
 need((len(oc),len(pc),len(cc))==(107,98,94),'actual call counts')
 result['actual_calls']={'original':len(oc),'current':len(pc),'candidate':len(cc),'changed_complete_callees':changes}
 need(sha((p/'native-build/candidate.so').read_bytes())==result_native['candidate_sha256'] and sha((p/'native-build/unstripped.so').read_bytes())==result_native['unstripped_sha256'],'actual compiler output digest')
 result['clock_original']=reaching(original.body(0x5b3b0,18584),9,0x30e8,[0x32b0,0x3a18,0x3fd8],0x3018)
 result['clock_candidate']=reaching(candidate.body(0x67860,18056),7,0x3958,[0x3b00,0x3cb8,0x4008],0x3760)
 need(result['clock_original']['reachable_instructions']==2287 and result['clock_candidate']['reachable_instructions']==2233,'full conservative CFG census')
 for label,actual,reg,call in [('original',result['clock_original'],9,'0x3018'),('compiled_clock_candidate',result['clock_candidate'],7,'0x3760')]:
  saved=expected[label];need(saved['clock_call']==call and saved['timestamp_definition']==actual['definition'],'saved Clock acquisition/definition')
  need(saved['definition_instruction']==list(actual['definition_instruction']) and saved['reachable_instructions']==actual['reachable_instructions'],'saved full CFG/definition proof')
  need(len(saved['uses'])==len(actual['uses']),'saved timestamp uses')
  for a,b in zip(saved['uses'],actual['uses']):need(a['instruction_offset']==b['offset'] and a['register']=='r'+str(reg) and a['destination_frame']==b['frame'] and a['sole_reaching_definition']==actual['definition'] and a['Clock_dominates'] is True,'saved consumed timestamp dataflow')
 result.update(status='PASS',whole_window_gain=False,observed_behavior_correction=False,independent_new_build=False,limits='One saved native macOS cold build with Linux target libraries; no identical-source repeat or complete44-suite qualification for this image. Clock structure alignment is not a finite-corpus behavioral correction.')
 return result
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--repo',type=Path,required=True);p.add_argument('--packet',type=Path,required=True);p.add_argument('--report',type=Path);a=p.parse_args();r=verify(a.repo,a.packet)
 if a.report:a.report.write_text(json.dumps(r,indent=2)+'\n')
 print(json.dumps({k:r[k] for k in ['status','census','actual_calls','whole_window_gain','observed_behavior_correction']},indent=2))
