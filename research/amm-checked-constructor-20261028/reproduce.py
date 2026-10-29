#!/usr/bin/env python3
"""Rebuild the source overlay through the exact published r31 controller."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,subprocess,sys,tarfile
P=Path(__file__).resolve().parent
ROOT=P.parents[1]
def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--output',type=Path,required=True);parser.add_argument('--sdk',type=Path,required=True);parser.add_argument('--cargo-home',type=Path,required=True);parser.add_argument('--target-dir',type=Path,required=True);args=parser.parse_args();out=args.output.absolute()
 if out.exists():raise RuntimeError('output must be new')
 spec=importlib.util.spec_from_file_location('checked_packet',P/'verify.py');v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v);v.manifest(P);base=ROOT/v.BASE;v.manifest(base,v.BASE_MANIFEST)
 source=out/'canonical';source.mkdir(parents=True)
 for name,raw in v.archive(P/'sources/canonical-source.tar.gz').items():
  target=source/name;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(raw)
 subprocess.run([sys.executable,'-I','-B',str(base/'build.py'),'--repo',str(source),'--output',str(out/'build'),'--sdk',str(args.sdk.resolve()),'--cargo-home',str(args.cargo_home.resolve()),'--target-dir',str(args.target_dir.resolve())],check=True)
 for name,digest in [('candidate.so',v.CANDIDATE),('symbols.so',v.SYMBOLS)]:
  if hashlib.sha256((out/'build'/name).read_bytes()).hexdigest()!=digest:raise RuntimeError('reproduced ELF differs: '+name)
 print(json.dumps({'source_forced_repeat_identical':True,'output':str(out)}))
if __name__=='__main__':main()
