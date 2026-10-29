#!/usr/bin/env python3
"""Rebuild the current canonical Relay from an empty, offline Linux target."""
from pathlib import Path
import argparse,hashlib,json,subprocess,sys,tarfile,tomllib,time,shutil
ROOT=Path(__file__).resolve().parents[2]
IMAGE='c9bcc62ac79b4618beaffc81c2a6ba4ac741fd27d910de47af20ceecbf53f39c'
EXPECTED={'candidate.so':'56d81ec64a0ba070d3d23f3c1547b31d659e85716dfa2198ec4b0ce6cd355333','symbols.so':'07ab4ac487727385a3b5ec0d4bc1139e10f701c3fac2f95b88d89701a38ab9e1'}
def require(v,m):
 if not v:raise ValueError(m)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def inventory(p):return {x.relative_to(p).as_posix():sha(x)for x in sorted(p.rglob('*'))if x.is_file()}
def registry_check(registry,lock):
 result={};index='index.crates.io-6f17d22bba15001f'
 for package in lock['package']:
  if not package.get('source','').startswith('registry+'):continue
  n=package['name']+'-'+package['version'];a=registry/'cache'/index/(n+'.crate');s=registry/'src'/index/n
  require(sha(a)==package['checksum'],'archive checksum '+n);files={}
  with tarfile.open(a,'r:gz')as tar:
   for member in tar:
    if member.isdir():continue
    path=Path(member.name);require(member.isfile()and path.parts[0]==n and'..'not in path.parts,'archive member '+n)
    rel=Path(*path.parts[1:]);data=tar.extractfile(member).read();require((s/rel).is_file()and not(s/rel).is_symlink()and(s/rel).read_bytes()==data,'registry source '+n+'/'+str(rel));files[rel.as_posix()]=hashlib.sha256(data).hexdigest()
  result[n]={'archive_sha256':package['checksum'],'files':files,'complete_tree':inventory(s)}
 require(len(result)==253 and sum(len(x['files'])for x in result.values())==7968,'registry cohort count')
 return result
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--sdk',type=Path,required=True);p.add_argument('--registry',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();sdk=a.sdk.resolve();reg=a.registry.resolve();out=a.output.resolve();out.mkdir(parents=True,exist_ok=False)
 source=ROOT/'programs/donation-relay';config=ROOT/'repro/donation-relay/canonical-exact-selection/layout';selected=json.loads((source/'source-selected.json').read_text());inputs=selected['source_inputs'];require(len(inputs)==60,'canonical source count')
 for n,h in inputs.items():require((source/n).is_file()and not(source/n).is_symlink()and sha(source/n)==h,'canonical source '+n)
 source_before=inventory(source);sdk_before=inventory(sdk);config_before=inventory(config);require(sha(sdk/'rust/bin/rustc')=='89fd4ccdd6e678a24c2cda074b498b46a352fcfce21018119c9526751afc678d','SDK rustc pin');lock=tomllib.loads((source/'Cargo.lock').read_text());registry=registry_check(reg,lock)
 (out/'target').mkdir();(out/'cargo-home').mkdir();(out/'output').mkdir();(out/'registry-before.json').write_text(json.dumps(registry,sort_keys=True)+'\n')
 env={'PATH':'/sdk/rust/bin:/sdk/llvm/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin','CARGO_HOME':'/cargo','CARGO_TARGET_DIR':'/target','CARGO_NET_OFFLINE':'true','CARGO_TERM_COLOR':'never','CARGO_BUILD_JOBS':'3','CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS':'-Zremap-cwd-prefix=','RUSTC':'/sdk/rust/bin/rustc','RUSTDOC':'/sdk/rust/bin/rustdoc','CC':'/sdk/llvm/bin/clang','AR':'/sdk/llvm/bin/llvm-ar','OBJDUMP':'/sdk/llvm/bin/llvm-objdump','OBJCOPY':'/sdk/llvm/bin/llvm-objcopy','LANG':'C.UTF-8','LC_ALL':'C.UTF-8'}
 base=['podman','run','--rm','--pull=never','--platform','linux/amd64','--network','none','--cpus','3','--memory','5g','--entrypoint=/usr/bin/env','-v',str(source)+':/source:ro','-v',str(config)+':/config:ro','-v',str(out/'output')+':/output:rw','-v',str(out/'target')+':/target:rw','-v',str(out/'cargo-home')+':/cargo:rw','-v',str(reg)+':/cargo/registry:ro','-v',str(sdk)+':/sdk:ro','-w','/source',IMAGE,'-i']+[k+'='+v for k,v in env.items()]
 cmd=base+['/sdk/rust/bin/cargo','rustc','--release','--target','sbpf-solana-solana','--locked','--offline','--verbose','--manifest-path','/source/Cargo.toml','--lib','--','--remap-path-prefix=src/=programs/contracts/src/','-C','link-arg=-Map=/output/link.map','-C','linker=/config/linker-wrapper.sh']
 record={'command':cmd,'controller_sha256':sha(Path(__file__)),'source_inputs':inputs,'complete_current_tree':source_before,'sdk_inputs':sdk_before,'config_inputs':config_before,'target_initially_empty':not any((out/'target').iterdir()),'network_disabled':True,'original_executable_is_build_input':False,'registry_before_sha256':sha(out/'registry-before.json')};(out/'launch.json').write_text(json.dumps(record,indent=2)+'\n');started=time.monotonic()
 with(out/'build.log').open('wb')as log:r=subprocess.run(cmd,stdout=log,stderr=subprocess.STDOUT)
 record.update(returncode=r.returncode,seconds=time.monotonic()-started,source_unchanged=inventory(source)==source_before,sdk_unchanged=inventory(sdk)==sdk_before,config_unchanged=inventory(config)==config_before,registry_unchanged=registry_check(reg,lock)==registry,build_log_sha256=sha(out/'build.log'))
 if r.returncode==0:
  shutil.copy2(out/'target/sbpf-solana-solana/release/donation_relay_source_proposal.so',out/'output/symbols.so');subprocess.run(base+['/sdk/llvm/bin/llvm-objcopy','--strip-all','/output/symbols.so','/output/candidate.so'],check=True);record['artifacts']={n:{'sha256':sha(out/'output'/n),'bytes':(out/'output'/n).stat().st_size}for n in EXPECTED};record['exact_outputs']=all(record['artifacts'][n]['sha256']==h for n,h in EXPECTED.items());record['root_compilations']=(out/'build.log').read_text().count('--crate-name donation_relay_source_proposal ');record['stack_diagnostics']=[l for l in(out/'build.log').read_text().splitlines()if'Stack offset'in l or'exceeded max offset'in l]
 (out/'result.json').write_text(json.dumps(record,indent=2)+'\n');print(json.dumps({k:record.get(k)for k in['returncode','seconds','source_unchanged','sdk_unchanged','config_unchanged','registry_unchanged','exact_outputs','root_compilations','stack_diagnostics','artifacts']},indent=2),flush=True);require(r.returncode==0 and record['exact_outputs']and record['root_compilations']==1 and not record['stack_diagnostics'],'build exactness');require(all(record[k]for k in['source_unchanged','sdk_unchanged','config_unchanged','registry_unchanged']),'build inputs changed')
if __name__=='__main__':main()
