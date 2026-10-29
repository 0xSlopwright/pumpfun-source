from pathlib import Path
import subprocess,json,os,shutil,time,hashlib,importlib.util
R=Path(__file__).resolve().parent;lane=R/'lane';out=R/'flag-trials3';out.mkdir(exist_ok=True)
pt=Path.home()/'.cache/solana/v1.44/platform-tools';env=dict(os.environ,CARGO_HOME=str(Path.home()/'amm100-run/cargo-home'),CARGO_TARGET_DIR=str(lane/'target'),RUSTC=str(pt/'rust/bin/rustc'),CC=str(pt/'llvm/bin/clang'),AR=str(pt/'llvm/bin/llvm-ar'),CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS=' -Zremap-cwd-prefix=')
base=R/'baseline.so'
measure=Path.home()/'amm100-run/shared/tools/measure.py'
spec=importlib.util.spec_from_file_location('measure',measure);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
_,br=m.measure(base);bm={r['original']for r in br if r['match']};runs=[]
trials=[('reorder-blocks',['-Zmir-enable-passes=+ReorderBasicBlocks']),('keep-final-cfg',['-Zmir-enable-passes=-SimplifyCfg-final']),('keep-dead-locals',['-Zmir-enable-passes=-SimplifyLocals-final']),('keep-storage',['-Zmir-enable-passes=-RemoveStorageMarkers'])]
for name,flags in trials:
 d=out/name;d.mkdir(exist_ok=True);cmd=[str(pt/'rust/bin/cargo'),'rustc','-p','pump-amm-recovered','--lib','--release','--target','sbpf-solana-solana','--locked','--offline','-j3','--',*flags];t=time.time()
 with (d/'build.log').open('w') as f:p=subprocess.run(cmd,cwd=lane/'src',env=env,stdout=f,stderr=subprocess.STDOUT)
 row={'name':name,'cmd':cmd,'exit':p.returncode,'seconds':time.time()-t}
 if p.returncode==0:
  so=d/'symbols.so';shutil.copy2(lane/'target/sbpf-solana-solana/release/pump_amm_recovered.so',so);c,rs=m.measure(so);now={r['original']for r in rs if r['match']};row.update(sha256=hashlib.sha256(so.read_bytes()).hexdigest(),normalized=len(now),raw=sum(r['raw']for r in rs),gains=sorted(now-bm),losses=sorted(bm-now),sell_matched='0x4c750'in now,baseline_equal=so.read_bytes()==base.read_bytes());(d/'rows.json').write_text(json.dumps(rs,indent=2))
 runs.append(row);(out/'runs.json').write_text(json.dumps(runs,indent=2));print(json.dumps(row),flush=True)
