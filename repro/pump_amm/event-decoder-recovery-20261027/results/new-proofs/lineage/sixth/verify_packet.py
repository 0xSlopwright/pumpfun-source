"""Offline verification of the sealed sixth-wave artifact and saved focused replays."""
from pathlib import Path
import collections,difflib,hashlib,json,re,runpy,subprocess,sys
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
files=lambda d:{str(p.relative_to(d)):sha(p)for p in sorted(d.rglob('*'))if p.is_file()}
m=json.loads((P/'manifest.json').read_text());assert {k:v for k,v in files(P).items()if k!='manifest.json'}==m['files']
c=json.loads((P/'composition.json').read_text());assert files(P/'source/base')==c['base_source'];assert files(P/'source/fixed')==c['source'];assert sha(P/'recovery.patch')==c['patch_sha256']
changed={p for p in c['source'].keys()|c['base_source'].keys()if c['source'].get(p)!=c['base_source'].get(p)}
assert changed=={'programs/pump-amm/src/legacy_buy.rs','programs/pump-amm/src/creator_reassignment.rs','programs/pump-amm/src/utils/mod.rs','programs/pump-amm/src/utils/quote.rs'}
patch=''
for name in sorted(changed):
 before=(P/'source/base'/name).read_text().splitlines(True)if(P/'source/base'/name).exists()else[]
 after=(P/'source/fixed'/name).read_text().splitlines(True)if(P/'source/fixed'/name).exists()else[]
 patch+=''.join(difflib.unified_diff(before,after,fromfile='a/'+name if before else '/dev/null',tofile='b/'+name if after else '/dev/null'))
assert patch==(P/'recovery.patch').read_text()
# Apply each literal unified patch in order, checking old lines and hunk counts.
state={p:(P/'source/base'/p).read_text()for p in c['base_source']}
for index,record in enumerate(c['patches']):
 path=P/'component-patches'/f'{index}.patch';assert sha(path)==record['sha256'];lines=path.read_text().splitlines(True);i=0
 while i<len(lines):
  assert lines[i].startswith('--- ');old=lines[i][4:].strip();i+=1;assert lines[i].startswith('+++ ');new=lines[i][4:].strip();i+=1
  name=(new if new!='/dev/null'else old)[2:];before=state.get(name,'').splitlines(True);out=[];pos=0
  if old=='/dev/null':assert name not in state
  while i<len(lines)and lines[i].startswith('@@ '):
   match=re.match(r'@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@',lines[i]);assert match;i+=1
   os,oc,ns,nc=map(int,(match[1],match[2]or'1',match[3],match[4]or'1'));at=os-1 if oc else os;assert at>=pos;out.extend(before[pos:at]);pos=at;oldcount=newcount=0
   while i<len(lines)and not lines[i].startswith(('@@ ','--- ')):
    line=lines[i];i+=1;assert line[0]in' +-'
    if line[0]in' -':assert before[pos]==line[1:];pos+=1;oldcount+=1
    if line[0]in' +':out.append(line[1:]);newcount+=1
   assert(oldcount,newcount)==(oc,nc)
  out.extend(before[pos:]);state[name]=''.join(out)
assert {k:hashlib.sha256(v.encode()).hexdigest()for k,v in state.items()}==c['source']
for label in ['build','build-repeat']:
 b=json.loads((P/label/'build-comparison.json').read_text());assert b['returncode']==0 and b['source_unchanged'];assert b['source_sha256']==b['source_after_sha256'];assert b['dependency_cache_before']==b['dependency_cache_after'];assert len(b['source_sha256'])==227 and len(b['dependency_cache_before'])==762
 for path,digest in b['source_sha256'].items():assert sha(P/'build-inputs'/path)==digest,path
 assert sha(P/label/'artifacts/unstripped.so')==b['unstripped_sha256']==b['archived_unstripped_sha256'];assert sha(P/label/'build.log')==b['build_log_sha256']
for name in ['unstripped.so','pump_amm_recovered.so']:assert(P/'build/artifacts'/name).read_bytes()==(P/'build-repeat/artifacts'/name).read_bytes()
sys.path.insert(0,str(P/'static-tool'));from elf_reader import Elf
O=Elf(P/'base-packet/inputs/evidence/original/pump_amm/deployed.so');C=Elf(P/'build/artifacts/unstripped.so');A=Elf(P/'build/artifacts/pump_amm_recovered.so');assert C.b[C.lo:C.hi]==A.b[A.lo:A.hi]
d=json.loads((P/'measurement.json').read_text());old=json.loads((P/'base-measurement.json').read_text());assert d['candidate_sha256']==sha(P/'build/artifacts/pump_amm_recovered.so');assert d['symbols_sha256']==sha(P/'build/artifacts/unstripped.so');assert old['candidate_sha256']==c['base_candidate_sha256']==sha(P/'base-candidate.so');assert d['reader_sha256']==sha(P/'static-tool/elf_reader.py')
index=collections.defaultdict(list)
for f in C.funcs:
 a,n=f['start'],f['size'];index[n,C.normalized[a:a+n],json.dumps(C.pattern(a,n),sort_keys=True)].append(f)
assert[(r['start'],r['end'])for r in d['rows']]==list(zip(O.entries,O.entries[1:]+[O.hi]));norm=raw=text=0
for row in d['rows']:
 a,n=row['start'],row['end']-row['start'];found=index[n,O.normalized[a:a+n],json.dumps(O.pattern(a,n),sort_keys=True)];assert{(f['start'],f['name'])for f in found}=={(f['start'],f['name'])for f in row['matches']}
 direct=any(O.b[a:a+n]==C.b[f['start']:f['start']+n]for f in found);assert direct==row['raw_match'];norm+=bool(found);raw+=direct;text+=n*bool(found)
 for f in row['matches']:assert hashlib.sha256(C.b[f['start']:f['start']+n]).hexdigest()==f['raw_sha256']
base_elf=Elf(P/'base-candidate.so')
for r in old['rows']:
 a,n=r['start'],r['end']-r['start'];r['raw_match']=any(O.b[a:a+n]==base_elf.b[f['start']:f['start']+n]for f in r['matches'])
gains=[];raw_gains=[]
for a,z in zip(old['rows'],d['rows']):
 assert a['start']==z['start'];assert not a['matches']or z['matches'];assert not a['raw_match']or z['raw_match']
 if z['matches']and not a['matches']:gains.append(z['start'])
 if z['raw_match']and not a['raw_match']:raw_gains.append(z['start'])
assert(norm,raw,text)==(d['normalized_matches'],d['raw_matches'],804704)==(643,148,804704);assert gains==[0x118e0]and len(raw_gains)==19
runpy.run_path(str(P/'replay/verify_replay.py'),run_name='__main__')
subprocess.run([sys.executable,'-B',str(P/'cto-proof/verify.py')],check=True)
subprocess.run([sys.executable,'-B',str(P/'cto-static/verify_static.py'),'--candidate',str(P/'build/artifacts/pump_amm_recovered.so'),'--symbols',str(P/'build/artifacts/unstripped.so'),'--original',str(P/'base-packet/inputs/evidence/original/pump_amm/deployed.so')],check=True)
assert {k:v for k,v in files(P).items()if k!='manifest.json'}==m['files']
print(json.dumps({'portable_verified':True,'candidate_sha256':d['candidate_sha256'],'normalized':norm,'raw':raw,'matched_text_bytes':text,'normalized_gains':[hex(a)for a in gains],'source_inputs':227,'dependencies_unchanged':762,'repeat_artifacts_identical':True,'legacy_cases':1616,'cto_cases':19,'total_cases':1635,'transactions':3270,'signatures':3308,'vm_executed':False},indent=2))
