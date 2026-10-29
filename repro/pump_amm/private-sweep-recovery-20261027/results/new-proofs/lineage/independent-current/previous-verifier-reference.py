#!/usr/bin/env python3
from pathlib import Path,PurePosixPath
import collections,gzip,hashlib,importlib.util,json,shutil,subprocess,sys,tempfile
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W))
from elf_reader import Elf
import event_provenance,wrapper_census,verify_cases,callgap_proof
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
J=lambda p:json.loads(Path(p).read_bytes())
CANDIDATE='c9e863a6385d240048232602e3f8ff3b3196a4435b7b9bdc4dcc9501cf21464b'
BASE='c20007e860f47db1cc443344605afafe505d61bb4de6d61306fa164db3482544'
def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def index(e,s):
 r=collections.defaultdict(list)
 for f in s.funcs:r[(f['size'],e.normalized[f['start']:f['start']+f['size']],json.dumps(e.pattern(f['start'],f['size']),sort_keys=True))].append(f)
 return r
def measure(o,c,s,b,bs):
 now,old=index(c,s),index(b,bs);rows=[];g=[];l=[];rg=[];rl=[]
 for a,z in zip(o.entries,o.entries[1:]+[o.hi]):
  key=(z-a,o.normalized[a:z],json.dumps(o.pattern(a,z-a),sort_keys=True));n,p=now[key],old[key];raw=any(o.b[a:z]==c.b[q['start']:q['start']+z-a]for q in n);prev=any(o.b[a:z]==b.b[q['start']:q['start']+z-a]for q in p);rows.append({'start':a,'end':z,'matches':n,'raw_match':raw})
  if n and not p:g.append(hex(a))
  if p and not n:l.append(hex(a))
  if raw and not prev:rg.append(hex(a))
  if prev and not raw:rl.append(hex(a))
 r={'candidate_sha256':H(c.path),'symbols_sha256':H(s.path),'windows':len(rows),'normalized':sum(bool(x['matches'])for x in rows),'raw':sum(x['raw_match']for x in rows),'normalized_text_bytes':sum(x['end']-x['start']for x in rows if x['matches']),'normalized_gains':g,'normalized_losses':l,'raw_gains':rg,'raw_losses':rl}
 assert(r['windows'],r['normalized'],r['raw'],r['normalized_text_bytes'])==(785,656,148,826112);assert not(g or l or rg or rl)
 return r,rows

def verify(root=None):
 w=Path(__file__).resolve().parent;m=J(w/'manifest.json');actual={str(p.relative_to(w))for p in w.rglob('*')if p.is_file()and '__pycache__'not in p.parts};assert actual==set(m['files'])|{'manifest.json'}
 for n,h in m['files'].items():
  p=PurePosixPath(n);assert not p.is_absolute()and '..'not in p.parts;assert H(w/n)==h,n
 for n,x in J(w/'compression-map.json').items():assert hashlib.sha256(gzip.decompress((w/n).read_bytes())).hexdigest()==x['uncompressed_sha256']
 O=w/'input-root/evidence/original/pump_amm/deployed.so';C=w/'build/artifacts/pump_amm_recovered.so';S=w/'build/artifacts/unstripped.so';B=w/'baseline/candidate.so';BS=w/'baseline/unstripped.so';I=w/'input-root/evidence/upstream/pump_amm.json'
 assert H(C)==CANDIDATE and H(B)==BASE
 o,c,s,b,bs=map(Elf,[O,C,S,B,BS]);assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]and b.b[b.lo:b.hi]==bs.b[bs.lo:bs.hi]
 measured,rows=measure(o,c,s,b,bs);frozen=J(w/'measurement-full.json');assert measured==frozen['summary']and rows==frozen['rows']
 wrappers=wrapper_census.census(O,C,S);assert wrappers==frozen['wrappers']and wrappers['normalized_and_relocation_matches']==38
 base=event_provenance.scan(O,B,BS,I);new=event_provenance.scan(O,C,S,I);assert base==J(w/'baseline-provenance.json')and new==J(w/'candidate-provenance.json')
 for before,after in zip(base['events'],new['events']):
  assert before['event']==after['event']and before['original']==after['original'];assert before['original_same_source_stack']and not before['candidate_same_source_stack'];assert after['candidate_same_source_stack']
  # These four handler bodies remain unmatched and are not promoted to exact equality.
  assert not any(r['matches']for r in rows if r['start']==after['original'][0]['handler']['start'])
 controls=event_provenance.negative_controls(O,I);assert controls==J(w/'negative-controls.json')
 inv=lambda root:{str(p.relative_to(root)):H(p)for p in root.rglob('*')if p.is_file()}
 before,after=inv(w/'baseline/source'),inv(w/'source');change=J(w/'source-change.json');assert before==change['base_source']and after==change['source'];changed=[n for n in sorted(set(before)|set(after))if before.get(n)!=after.get(n)];assert changed==['programs/pump-amm/src/cashback.rs','programs/pump-amm/src/creator_reassignment.rs']
 for n,count in change['replacement_counts'].items():
  text=(w/'baseline/source'/n).read_text();assert text.count('emit!(event.clone())')==count;assert text.replace('emit!(event.clone())','emit!(event)')==(w/'intermediate/source'/n).read_text()
 assert sum(change['replacement_counts'].values())==4 and H(w/'recovery.patch')==change['patch_sha256']
 with tempfile.TemporaryDirectory()as td:
  target=Path(td)/'source';shutil.copytree(w/'baseline/source',target);p=subprocess.run(['patch','--batch','-p1','-i',str(w/'recovery.patch')],cwd=target,capture_output=True,text=True);assert p.returncode==0,p.stderr;assert inv(target)==after
 binder=module('private_event_source_binding',w/'verify_source_binding.py');src=binder.verify(w/'canonical-source',w/'source',w/'build/build-comparison.json',C,S,w/'dependency-proof')
 deps=module('private_event_dependencies',w/'dependency-proof/verify.py').verify(w/'canonical-source',w/'build/build-comparison.json',w/'dependency-proof',H(w/'dependency-proof/manifest.json'))
 attempt=J(w/'build/build-attempt.json');assert attempt['returncode']==0 and attempt['source_unchanged']and attempt['dependency_cache_before']==attempt['dependency_cache_after']and len(attempt['dependency_cache_before'])==762;assert 'Compiling pump-amm-recovered'in(w/'build/build.log').read_text()
 gap=callgap_proof.analyze(O,w/'intermediate/candidate.so',w/'intermediate/unstripped.so');assert gap==J(w/'callgap-verification.json')
 selected=callgap_proof.selected(C,S);assert selected==J(w/'selected-callgap.json')
 with tempfile.TemporaryDirectory()as td:
  target=Path(td)/'source';shutil.copytree(w/'intermediate/source',target);p=subprocess.run(['patch','--batch','-p1','-i',str(w/'inline-PDA.patch')],cwd=target,capture_output=True,text=True);assert p.returncode==0,p.stderr;assert inv(target)==after
 macro=J(w/'macro-source.json');assert H(w/'anchor-lang-lib.rs')in macro['sources'].values();lines=(w/'anchor-lang-lib.rs').read_text().splitlines();assert '\n'.join(lines[614:626])==macro['excerpt'];assert '$value1 != $value2'in macro['excerpt']and '.with_pubkeys(($value1, $value2))'in macro['excerpt']
 cases=verify_cases.verify(w);assert cases==J(w/'cases-verification.json')
 return{'passed':True,'candidate_sha256':CANDIDATE,'baseline_sha256':BASE,**measured,'normalized_windows':656,'raw_windows':148,'remaining_unmatched_windows':129,'wrappers':38,'qualified_source_clone_removals':4,'first_pubkey_storage_reuse_verified_events':4,'source_inputs':src['total_compiled_inputs_verified'],'dependency_roots':deps['packages'],'cases':cases['cases'],'executions':cases['executions'],'verified_signatures':cases['verified_signatures'],'runtime_mismatches':0,'negative_controls':len(controls)+len(gap['negative_controls']),'set_coin_creator_calls':selected['call_count'],'error_pubkey_from_second_pda':True,'strict_repeat':False,'whole_elf_equal':False,'manifest_sha256':H(w/'manifest.json'),'scope':'Source-structure proposal with four local serializer-field witnesses and restored error-path PDA derivation; no normalized-window gain or exact private-handler claim. Fresh bounded runtime acceptance only; full-core replay and strict repeat not claimed.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
