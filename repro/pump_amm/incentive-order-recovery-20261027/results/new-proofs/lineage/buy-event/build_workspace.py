#!/usr/bin/env python3
"""Compile frozen AMM source for SBPF using authenticated Linux v1.44. Priming only permits new dependency files; strict rebuild permits no dependency changes."""
import argparse,hashlib,json,os,subprocess,sys,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
from build_source_manifest import source_manifest
from compare import compare
IMAGE='docker.io/solanafoundation/solana-verifiable-build@sha256:6c73adc767ee7ff212f2532d4695472b12f3d4ac20aea3db22b89d8c614dac50'
EXPECTED={'rust/bin/rustc':'c8807b7ebede8578ac5a257ea333780f9d89bd356064fd8184af7e996cb71a97','rust/bin/cargo':'d28444578306fe5a4f40524331411340123004e9e6556322fcabdbe351fe265d'}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 p=argparse.ArgumentParser()
 for name in ['source','cargo-home','sdk','output','target-cache']:p.add_argument('--'+name,type=Path,required=True)
 p.add_argument('--prime',action='store_true');a=p.parse_args();source=a.source.resolve();cache=a.cargo_home.resolve();sdk=a.sdk.resolve();out=a.output.resolve();out.mkdir(parents=True,exist_ok=False);crate=source/'programs/pump-amm';target_cache=a.target_cache.resolve()
 for path,digest in EXPECTED.items():assert sha(sdk/path)==digest
 image=json.loads(subprocess.check_output(['podman','image','inspect',IMAGE],text=True))[0];assert image['Architecture']=='amd64' and image['Os']=='linux'
 metadata=json.loads((Path(__file__).parent/'coherent-locked.json').read_text())
 dependency_roots=[Path(p['manifest_path']).parent for p in metadata['packages']if p['name']in {'solana-instruction','solana-loader-v3-interface','solana-program','solana-pubkey','solana-signature','solana-sysvar','solana-vote-interface','solana-zk-sdk'}]
 snapshot=lambda:source_manifest(crate,source,ROOT,[crate/'vendor/solana-pubkey',*dependency_roots],cwd=source)
 archive=json.loads((sdk.parent/'archive.json').read_text());assert sha(Path(archive['archive']))==archive['sha256']=='6719b889d60677a8a2fcf4c82f68441a1afe0ab093edd2efe9f84a67a808b3e9'
 target_proof=json.loads((Path(__file__).parent/'target-provenance.json').read_text());assert not target_proof['target_spec_differences']
 archive_proof_path=ROOT/'work/amm-create-config-audit-20261027/sbpf-archive-provenance.json';archive_proof=json.loads(archive_proof_path.read_text());assert len(archive_proof['members'])==3
 for member in archive_proof['members']:assert sha(Path(member['local_path']))==member['sha256']
 before=snapshot();strip=Path.home()/'.cache/solana/v1.52/platform-tools/llvm/bin/llvm-objcopy'
 env={'CARGO_HOME':str(cache),'CARGO_TARGET_DIR':str(target_cache),'RUSTC':str(sdk/'rust/bin/rustc'),'RUSTDOC':str(sdk/'rust/bin/rustdoc'),'CC':str(sdk/'llvm/bin/clang'),'AR':str(sdk/'llvm/bin/llvm-ar'),'LD_LIBRARY_PATH':str(sdk/'rust/lib')+':'+str(sdk/'llvm/lib'),'CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS':' -Zremap-cwd-prefix=','CARGO_BUILD_JOBS':'6'if a.prime else'2'}
 prefix=['podman','run','--rm','--pull=never','--platform=linux/amd64','--cpus=6'if a.prime else'--cpus=2','--memory=12g'if a.prime else'--memory=4g','--network=none','--name','codex-amm-linux-'+hashlib.sha256(str(out).encode()).hexdigest()[:10],'--entrypoint=/usr/bin/env']
 for host,mode in [(source,'ro'),(cache,'rw'),(sdk,'ro'),(out,'rw'),(target_cache,'rw')]:prefix+=['-v',f'{host}:{host}:{mode}']
 prefix+=['-w',str(source)]
 for name,value in env.items():prefix+=['-e',name+'='+value]
 prefix+=[IMAGE,'-u','RUSTFLAGS','-u','CARGO_ENCODED_RUSTFLAGS']
 command=prefix+[str(sdk/'rust/bin/cargo'),'build','--release','--target','sbpf-solana-solana','--manifest-path',str(source/'Cargo.toml'),'--locked','--offline']
 version=subprocess.run(prefix+[str(sdk/'rust/bin/rustc'),'--version','--verbose'],text=True,capture_output=True)
 dependency_snapshot=lambda:{str(f.relative_to(target_cache)):sha(f)for f in sorted(target_cache.rglob('*'))if f.is_file()and f.suffix in ('.rlib','.rmeta','.so')and not f.name.startswith(('libpump_amm_recovered','pump_amm_recovered'))}
 cache_before=dependency_snapshot()
 record={'priming':a.prime,'adapter_sha256':sha(Path(__file__)),'base_builder_sha256':sha(ROOT/'repro/pump_amm/linux-v144-current-20261027/build_cached.py'),'target_provenance_sha256':sha(Path(__file__).parent/'target-provenance.json'),'sbpf_archive_provenance_sha256':sha(archive_proof_path),'dependency_cache_before':cache_before,'archive_provenance':archive,'scope':__doc__,'source_sha256':before,'command':command,'container_image':{k:image[k]for k in ('Id','Architecture','Os','RepoDigests')},'environment':env,'rustc_version_command':prefix+[str(sdk/'rust/bin/rustc'),'--version','--verbose'],'rustc_version':version.stdout,'rustc_version_returncode':version.returncode,'rustc_version_stderr':version.stderr,'tool_sha256':{str(sdk/p):sha(sdk/p)for p in EXPECTED},'target_rlib_sha256':{str(p.relative_to(sdk)):sha(p)for p in sorted((sdk/'rust/lib/rustlib/sbpf-solana-solana/lib').glob('*.rlib'))},'strip_tool_sha256':sha(strip)}
 def save():(out/'build-attempt.json').write_text(json.dumps(record,indent=2)+'\n')
 save();version.check_returncode()
 start=time.monotonic()
 with (out/'build.log').open('w')as log:result=subprocess.run(command,stdout=log,stderr=subprocess.STDOUT)
 record.update(dependency_cache_after=dependency_snapshot(),returncode=result.returncode,seconds=time.monotonic()-start,source_after_sha256=snapshot(),build_log_sha256=sha(out/'build.log'));record['source_unchanged']=before==record['source_after_sha256'];save();result.check_returncode();assert record['source_unchanged']
 assert all(record['dependency_cache_after'].get(k)==v for k,v in cache_before.items()),'Existing dependency artifact content changed'
 if not a.prime:assert record['dependency_cache_after']==cache_before,'Dependency artifact content changed during strict rebuild'
 assert 'Compiling pump-amm-recovered' in (out/'build.log').read_text(),'Root crate did not rebuild'
 unstripped=target_cache/'sbpf-solana-solana/release/pump_amm_recovered.so';artifacts=out/'artifacts';artifacts.mkdir();import shutil;shutil.copy2(unstripped,artifacts/'unstripped.so');assert sha(unstripped)==sha(artifacts/'unstripped.so');candidate=artifacts/'pump_amm_recovered.so';strip_command=[str(strip),'--strip-all',str(unstripped),str(candidate)];subprocess.run(strip_command,check=True)
 record.update(unstripped_sha256=sha(unstripped),archived_unstripped_sha256=sha(artifacts/'unstripped.so'),strip_command=strip_command,comparison=compare((ROOT/'evidence/original/pump_amm/deployed.so').read_bytes(),candidate.read_bytes()));save();(out/'build-comparison.json').write_text(json.dumps(record,indent=2)+'\n');print(json.dumps(record['comparison']))
if __name__=='__main__':main()
