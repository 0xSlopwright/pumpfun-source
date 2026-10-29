from pathlib import Path
import json,subprocess,shlex,hashlib,shutil,re,sys
B=Path(__file__).parent;L=Path('/home/ahi200/pumpfun-work/20261029-pump-legacy-exact-sol');base=L/'costs-sequential-mode';out=L/'costs-result-trace';out.mkdir()
launch=json.loads((base/'launch.json').read_text());cmd=launch['command'];i=next(i for i,x in enumerate(cmd) if x.endswith('/rust/bin/cargo'));prefix=cmd[:i]
prefix=[x.replace(str(base)+':',str(out)+':') for x in prefix];prefix=[x[:-3]+':ro' if (x.startswith(str(L/'target')+':') or x.startswith(str(L/'cargo-home')+':')) and x.endswith(':rw') else x for x in prefix]
line=next(x.strip() for x in (base/'build.log').read_text().splitlines() if x.strip().startswith('Running `') and '--crate-name pump_recovered ' in x);args=shlex.split(line[len('Running `'):-1]);args[args.index('--out-dir')+1]='/analysis';i=next(i for i,x in enumerate(args) if x.startswith('--emit='));args[i]+=',llvm-ir,mir';command=prefix+args
(out/'launch.json').write_text(json.dumps({'command':command,'source_inputs':launch['inputs'],'scope':'Same sequential-mode invocation with diagnostic IR/MIR emits only. No IR edits.'},indent=2))
with(out/'trace.log').open('wb') as f:r=subprocess.run(command,stdout=f,stderr=subprocess.STDOUT)
r.check_returncode();shutil.copy2(out/'pump_recovered.so',out/'symbols.so')
s=(out/'pump_recovered.ll').read_text();match=re.search(r'^define [^\n]*5trade12v3_buy_costs17h[^\n]*\{.*?^}',s,re.M|re.S);assert match;(out/'target.ll').write_text(match.group()+'\n')
sys.path.insert(0,str(B.parent/'pump-legacy-exact-sol-20261029/tools'));import census
bodies=[]
for p in [base/'symbols.so',out/'symbols.so']:
 blob=p.read_bytes();fs=[f for f in census.functions(blob) if '5trade12v3_buy_costs17h' in f[2]];assert len(fs)==1;addr,size,_=fs[0];body=census.body(blob,census.sections(blob),addr,size);bodies.append(body)
assert bodies[0]==bodies[1]
q={'scope':'Print-only optimized IR captured and target raw-equal to real normal Cargo candidate','normal_image_sha256':hashlib.sha256((base/'symbols.so').read_bytes()).hexdigest(),'trace_image_sha256':hashlib.sha256((out/'symbols.so').read_bytes()).hexdigest(),'target_raw_sha256':hashlib.sha256(bodies[0]).hexdigest(),'target_bytes':len(bodies[0]),'returncode':r.returncode};(out/'qualification.json').write_text(json.dumps(q,indent=2)+'\n');print(json.dumps(q))