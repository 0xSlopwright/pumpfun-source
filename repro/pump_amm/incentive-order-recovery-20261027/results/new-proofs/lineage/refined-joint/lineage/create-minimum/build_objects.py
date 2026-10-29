from pathlib import Path
import os,subprocess,json,time,hashlib
R=Path.cwd();W=R/'work/amm-liquidity-business-audit-next-20261027';T=R/'work/amm-creator-rent-order-next-20261027/target';S=R/'work/amm-linux-v144-20261027/sdk'
for variant in ['base','checked-minimum']:
 d=W/('source-'+variant);o=W/(variant+'.o');env={'LD_LIBRARY_PATH':'/sdk/rust/lib:/sdk/llvm/lib','CARGO_MANIFEST_DIR':'/source/programs/pump-amm','CARGO_PKG_NAME':'pump-amm-recovered','CARGO_PKG_VERSION':'0.1.0'}
 cmd=['podman','run','--rm','--pull=never','--platform=linux/amd64','--network=none','--cpus=2','--memory=2g','--entrypoint=/usr/bin/env','-v',str(d)+':/source:ro','-v',str(W)+':/out:rw','-v',str(T)+':/target:ro','-v',str(S)+':/sdk:ro','-w','/source']
 for k,v in env.items():cmd+=['-e',k+'='+v]
 cmd+=['docker.io/solanafoundation/solana-verifiable-build@sha256:6c73adc767ee7ff212f2532d4695472b12f3d4ac20aea3db22b89d8c614dac50','/sdk/rust/bin/rustc','--edition=2021','--crate-name','pump_amm_recovered','--crate-type','cdylib','--crate-type','lib','--target','sbpf-solana-solana','-Copt-level=3','-Coverflow-checks=on','-Cpanic=abort','-Ccodegen-units=1','-Zremap-cwd-prefix=','-Ldependency=/target/sbpf-solana-solana/release/deps','-Ldependency=/target/release/deps']
 for name,lib in [('anchor_lang','libanchor_lang-c26e3b3b316f08d7.rlib'),('anchor_spl','libanchor_spl-ada1e0c2ba94cd91.rlib'),('uint','libuint-c359e6ee87a71d8f.rlib')]:cmd+=['--extern',name+'=/target/sbpf-solana-solana/release/deps/'+lib]
 cmd+=['--cfg','feature="default"','--emit=obj,llvm-ir','programs/pump-amm/src/lib.rs','-o','/out/'+variant+'.o']
 t=time.time();p=subprocess.run(cmd,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True);(W/(variant+'-build.log')).write_text(p.stdout);record={'variant':variant,'command':cmd,'returncode':p.returncode,'elapsed':time.time()-t};(W/(variant+'-build.json')).write_text(json.dumps(record,indent=2)+'\n');print(json.dumps(record),flush=True)
 if p.returncode:print(p.stdout[-6000:],flush=True);break
