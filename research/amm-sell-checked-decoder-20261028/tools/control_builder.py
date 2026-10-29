#!/usr/bin/env python3
from pathlib import Path
import os,subprocess,sys,shutil,json,hashlib,tarfile
R=Path(__file__).resolve().parents[2];D=R/'work/amm-final-five';out=D/sys.argv[1];out.mkdir(parents=True,exist_ok=False);sdk=Path('/workspace/toolchains/v1.44');src=D/'source-union12';cargo=Path('/workspace/pumpfun-source-latest/work/amm-union3/native-baseline-retry/cargo-home');target=D/'target';sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
inputs={str(p.relative_to(src)):sha(p)for p in sorted(src.rglob('*'))if p.is_file()};tools={n:sha(sdk/p)for n,p in [('rustc','rust/bin/rustc'),('cargo','rust/bin/cargo'),('objcopy','llvm/bin/llvm-objcopy')]};libs={p.name:sha(p)for p in sorted((sdk/'rust/lib/rustlib/sbpf-solana-solana/lib').glob('*'))if p.is_file()}
assert not any('target/'in p for p in inputs)
with tarfile.open(out/'source.tar.gz','w:gz')as a:
 for p in sorted(src.rglob('*')):
  if p.is_file():a.add(p,arcname=p.relative_to(src))
env=os.environ.copy();env.update(CARGO_HOME=str(cargo),CARGO_TARGET_DIR=str(target),CARGO_BUILD_JOBS='2',RUSTC=str(sdk/'rust/bin/rustc'),RUSTC_WRAPPER='/workspace/pumpfun-source-latest/scripts/pump_physical_source_wrapper.py',PUMP_LOGICAL_REGISTRY_SRC=str(cargo/'registry/src'),PUMP_SOURCE_WRAPPER_LOG=str(out/'physical-source-calls.jsonl'),CC=str(sdk/'llvm/bin/clang'),AR=str(sdk/'llvm/bin/llvm-ar'),CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS='-Zremap-cwd-prefix=')
for name in ['native-transfer-fee','pump-amm-recovered']:
 for f in (src/('crates'if name=='native-transfer-fee'else'programs')/('native-transfer-fee'if name=='native-transfer-fee'else'pump-amm')).rglob('*.rs'):f.touch()
clean_cmd=[str(sdk/'rust/bin/cargo'),'clean','--manifest-path',str(src/'Cargo.toml'),'--release','--target','sbpf-solana-solana','-p','pump-amm-recovered','-p','native-transfer-fee','--offline']
with(out/'clean.log').open('w')as f:clean=subprocess.run(clean_cmd,cwd=src,env=env,stdout=f,stderr=subprocess.STDOUT)
clean.check_returncode()
cmd=[str(sdk/'rust/bin/cargo'),'build','--manifest-path',str(src/'Cargo.toml'),'--release','--target','sbpf-solana-solana','--locked','--offline','--verbose']
record=dict(clean_command=clean_cmd,clean_returncode=clean.returncode,source_sha256=inputs,tool_sha256=tools,target_libraries_sha256=libs,command=cmd,environment={k:env[k]for k in ['CARGO_HOME','CARGO_TARGET_DIR','RUSTC','RUSTC_WRAPPER','PUMP_LOGICAL_REGISTRY_SRC','CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS']},builder_sha256=sha(Path(__file__)))
with(out/'build.log').open('w')as f:p=subprocess.run(cmd,cwd=src,env=env,stdout=f,stderr=subprocess.STDOUT)
record.update(returncode=p.returncode,source_unchanged=inputs=={str(p.relative_to(src)):sha(p)for p in sorted(src.rglob('*'))if p.is_file()},target_libraries_unchanged=libs=={p.name:sha(p)for p in sorted((sdk/'rust/lib/rustlib/sbpf-solana-solana/lib').glob('*'))if p.is_file()});(out/'attempt.json').write_text(json.dumps(record,indent=2)+'\n');print('returncode',p.returncode,flush=True);p.check_returncode();assert record['source_unchanged'] and record['target_libraries_unchanged'];shutil.copy2(target/'sbpf-solana-solana/release/pump_amm_recovered.so',out/'unstripped.so');subprocess.run([str(sdk/'llvm/bin/llvm-objcopy'),'--strip-all',str(out/'unstripped.so'),str(out/'candidate.so')],check=True)
sys.path.insert(0,str(R/'research/claude-amm-union7-20261028/tools'));import measure
rows=measure.measure(R/'evidence/original/pump_amm/deployed.so',out/'unstripped.so');baseline=measure.measure(R/'evidence/original/pump_amm/deployed.so',D/'union12-symbols.so');old={r['original']for r in baseline if r['match']};now={r['original']for r in rows if r['match']};result=dict(normalized=sum(bool(x['match'])for x in rows),raw=sum(x['raw']for x in rows),gains=sorted(now-old),losses=sorted(old-now),candidate_sha256=sha(out/'candidate.so'),unstripped_sha256=sha(out/'unstripped.so'),rows=rows);(out/'score.json').write_text(json.dumps(result,indent=2)+'\n');print({k:v for k,v in result.items()if k!='rows'},flush=True)
