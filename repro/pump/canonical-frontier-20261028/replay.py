#!/usr/bin/env python3
"""Replay the unchanged corpus against the exact image and authenticated source snapshot."""
from pathlib import Path
import argparse,gzip,hashlib,io,json,subprocess,sys,tarfile
if not __debug__:raise SystemExit('Optimized Python is unsupported; run without -O.')
P=Path(__file__).resolve().parent;R=P.parents[2]
p=argparse.ArgumentParser(description=__doc__);p.add_argument('--output',type=Path,required=True);p.add_argument('--workers',type=int,choices=range(1,5),default=4);p.add_argument('--focused',action='store_true');a=p.parse_args();out=a.output.resolve();out.relative_to(R);assert not out.exists();out.mkdir(parents=True)
record=json.loads((P/'builds/primary/build-comparison.json').read_text());keys=list(record['source_sha256']);prefix=keys[0].split('/source/',1)[0]+'/source';workspace=R/prefix
assert hashlib.sha256((P/'candidate.so').read_bytes()).hexdigest()==record['comparison']['candidate_sha256']
with tarfile.open(fileobj=io.BytesIO((P/'builds/primary/compiled-source.tar.gz').read_bytes()),mode='r:gz')as t:
 for m in t:
  assert m.isfile()and not Path(m.name).is_absolute()and'..'not in Path(m.name).parts;dst=workspace/m.name;data=t.extractfile(m).read();assert hashlib.sha256(data).hexdigest()==record['source_sha256'][str(dst.relative_to(R))]
  if dst.exists():assert dst.is_file()and not dst.is_symlink()and dst.read_bytes()==data,'existing stage differs: '+str(dst)
  else:dst.parent.mkdir(parents=True,exist_ok=True);dst.write_bytes(data)
command=[sys.executable,'-B',str(R/'scripts/pump_validate_parallel.py'),'--candidate',str(P/'candidate.so'),'--source-directory',str(workspace/'programs/pump'),'--build-comparison',str(P/'builds/primary/build-comparison.json'),'--output',str(out/'full44.json.gz'),'--workers',str(a.workers),'--captured-loader']
subprocess.run(command,cwd=R,check=True)
if a.focused:subprocess.run([sys.executable,'-B',str(P/'run_focused.py'),'--candidate',str(P/'candidate.so'),'--output',str(out/'focused')],cwd=R,check=True)
