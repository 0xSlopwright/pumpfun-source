from pathlib import Path
import subprocess,os,json,hashlib,shutil,importlib.util
R=Path(__file__).resolve().parents[1]; L=R; p=L/'src/programs/pump-amm/src/instructions/swap/sell.rs'; lib=L/'src/programs/pump-amm/src/lib.rs'
before=p.read_bytes();lib_before=lib.read_text(); SDK=Path.home()/'.cache/solana/v1.44/platform-tools';cargo=SDK/'rust/bin/cargo'
ENV=dict(os.environ);ENV.pop('RUSTFLAGS',None);ENV.pop('CARGO_ENCODED_RUSTFLAGS',None);ENV.update(CARGO_HOME=str(Path.home()/'amm100-run/cargo-home'),CARGO_TARGET_DIR=str(L/'target'),RUSTC=str(SDK/'rust/bin/rustc'),CC=str(SDK/'llvm/bin/clang'),AR=str(SDK/'llvm/bin/llvm-ar'),CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS=' -Zremap-cwd-prefix=')
symbol='_ZN18pump_amm_recovered12instructions4swap4sell8cashback17h6f538836b47fbaaeE'
cmd=[str(cargo),'rustc','--release','--target','sbpf-solana-solana','--locked','--offline','--lib','-p','pump-amm-recovered','--verbose','--','-Cllvm-args=-print-before=block-placement','-Cllvm-args=-print-after=block-placement','-Cllvm-args=-filter-print-funcs='+symbol]
spec=importlib.util.spec_from_file_location('measure',R/'tools/measure.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
original=R.parents[1]/'evidence/original/pump_amm/deployed.so';baseline=m.measure(original,R/'baseline.so');pre={x['original'] for x in baseline if x['match']}
source=(R/'graph-partial-sell.rs').read_text();variants={}
for hint in ['unlikely','likely']:
 variants['ata_write_'+hint]=source.replace('if ata.is_writable == false {','if unsafe { core::intrinsics::'+hint+'(ata.is_writable == false) } {')
 old='let ata = InterfaceAccount::<TokenAccount>::try_from_unchecked(ata)?;'
 new='let result = InterfaceAccount::<TokenAccount>::try_from_unchecked(ata); let ata = if unsafe { core::intrinsics::'+hint+'(result.is_err()) } { match result { Err(e) => return Err(e), Ok(_) => unreachable!() } } else { match result { Ok(ata) => ata, Err(_) => unreachable!() } };'
 variants['ata_constructor_'+hint]=source.replace(old,new)
records=[]
try:
 lib.write_text('#![feature(core_intrinsics)] //'+lib_before.splitlines()[0][3:]+'\n'+'\n'.join(lib_before.splitlines()[1:])+'\n')
 for name,text in variants.items():
  out=R/'phase2'/name;out.mkdir(exist_ok=False);(out/'sell.rs').write_text(text);(out/'lib.rs').write_text(lib.read_text());p.write_text(text)
  (out/'launch.json').write_text(json.dumps({'command':cmd,'cwd':str(L/'src'),'source_sha256':hashlib.sha256(text.encode()).hexdigest(),'lib_sha256':hashlib.sha256(lib.read_bytes()).hexdigest()},indent=2))
  with (out/'compiler.log').open('wb') as log: run=subprocess.run(cmd,cwd=L/'src',env=ENV,stdout=log,stderr=subprocess.STDOUT)
  rec={'name':name,'returncode':run.returncode}
  if run.returncode==0:
   shutil.copyfile(L/'target/sbpf-solana-solana/release/pump_amm_recovered.so',out/'symbols.so');rows=m.measure(original,out/'symbols.so');now={x['original'] for x in rows if x['match']};(out/'rows.json').write_text(json.dumps(rows,indent=2));rec.update(sha256=hashlib.sha256((out/'symbols.so').read_bytes()).hexdigest(),normalized=len(now),raw=sum(x['raw'] for x in rows),gains=sorted(now-pre),losses=sorted(pre-now),sell_matched='0x4c750' in now)
  records.append(rec);(R/'phase2/intrinsic-results.json').write_text(json.dumps(records,indent=2));print(json.dumps(rec),flush=True)
finally:p.write_bytes(before);lib.write_text(lib_before)
