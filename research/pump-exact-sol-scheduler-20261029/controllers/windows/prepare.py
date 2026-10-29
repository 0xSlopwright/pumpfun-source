"""Prepare locked, checksum-verified inputs. Does not compile or execute a target."""
from pathlib import Path, PurePosixPath
import hashlib, importlib.util, json, shutil, tarfile, tomllib, urllib.request
D=Path(__file__).resolve().parent; W=D.parent; R=W/'pumpfun-source'
P=R/'research/pump-exact-sol-guard-20261029'
def sha(b): return hashlib.sha256(b).hexdigest()
def save(p,x): p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def safe(n):
 p=PurePosixPath(n); assert not p.is_absolute() and '..' not in p.parts and '\\' not in n; return p
def main():
 spec=importlib.util.spec_from_file_location('upstream_verifier',P/'verify.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
 seal=m.verify_manifest(P); inputs=m.verify_sources(P)
 assert not (D/'source-parent').exists()
 for kind in ['parent','candidate']:
  files=m.archive(P/f'source-{kind}.tar.gz')
  for n,b in files.items():
   p=D/f'source-{kind}'/safe(n);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b)
 lock=tomllib.loads((D/'source-parent/Cargo.lock').read_text());pk=[p for p in lock['package'] if p.get('source','').startswith('registry+')]
 (D/'archives').mkdir();(D/'vendor').mkdir();records=[]
 for p in pk:
  n=p['name']+'-'+p['version']; dest=D/'archives'/(n+'.crate');url=None
  possibilities=[W/'amm-fresh-v144/archives'/dest.name,W/'mayhem-historical-framework/locked-archives'/dest.name]
  prior=next((f for f in possibilities if f.exists()),None)
  if prior:shutil.copyfile(prior,dest)
  else:
   url=f'https://static.crates.io/crates/{p["name"]}/{n}.crate'
   with urllib.request.urlopen(url,timeout=60) as f:dest.write_bytes(f.read())
  assert sha(dest.read_bytes())==p['checksum'],n
  files={}
  with tarfile.open(dest,'r:gz') as t:
   for member in t:
    if member.isdir():continue
    assert member.isfile(); rel=safe(member.name).relative_to(n); assert rel.as_posix() not in files
    b=t.extractfile(member).read();f=D/'vendor'/n/rel;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(b);files[rel.as_posix()]=sha(b)
  save(D/'vendor'/n/'.cargo-checksum.json',{'files':files,'package':p['checksum']})
  records.append({'package':n,'archive_sha256':p['checksum'],'archive_bytes':dest.stat().st_size,'source':str(prior) if prior else url,'files':files})
 save(D/'source-binding.json',{'scope':'Independent Windows v1.44 host control, Linux target libraries. No claim to reproduce Linux/macOS complete ELF. No target execution.','upstream_reviewed':'20c2c8af7','source_packet':'research/pump-exact-sol-guard-20261029','source_packet_seal_files':seal,'source':inputs,'source_archives':{k:sha((P/f'source-{k}.tar.gz').read_bytes()) for k in ['parent','candidate']},'registry':records,'registry_packages':len(records),'archive_source_files':sum(len(p['files']) for p in records)})
 print(json.dumps({'sealed_files':seal,'workspace_inputs':{k:len(v) for k,v in inputs.items()},'registry_packages':len(records),'archive_source_files':sum(len(p['files']) for p in records),'downloaded':[p['package'] for p in records if p['source'].startswith('https:')]},indent=2))
if __name__=='__main__': main()
