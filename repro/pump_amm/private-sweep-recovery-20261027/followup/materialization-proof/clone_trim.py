from pathlib import Path
import hashlib,json,os,shutil,subprocess,time
W=Path(__file__).resolve().parent;R=W.parents[1];H=R/'repro/pump_amm/incentive-order-recovery-20261027';C=W/'checkpoint';inv=json.loads((W/'inventory.json').read_bytes())
assert not C.exists();start=time.monotonic();p=subprocess.run(['/bin/cp','-cR',str(H),str(C)],capture_output=True,text=True);assert p.returncode==0,p.stderr
clone_seconds=time.monotonic()-start
removed=[]
for name in inv['omittable_directories']:
 a=H/'results/new-proofs/lineage'/name;b=C/'results/new-proofs/lineage'/name
 assert a.is_dir()and b.is_dir()and not b.is_symlink();assert W in b.resolve().parents
 sample=next(p for p in a.rglob('*')if p.is_file());copy=b/sample.relative_to(a)
 assert sample.stat().st_ino!=copy.stat().st_ino,'Hardlink detected'
 shutil.rmtree(b);removed.append(name)
assert hashlib.sha256((H/'results/manifest.json').read_bytes()).hexdigest()==inv['source_manifest_sha256']
summary={'clone_command':['/bin/cp','-cR',str(H),str(C)],'clone_seconds':clone_seconds,'method':'APFS copy-on-write clone; sampled inode inequalities, no symlinks in source results','removed_directories':removed,'source_manifest_unchanged':True}
(W/'clone-trim.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary))
