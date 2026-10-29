#!/usr/bin/env python3
"""Build these archived main-Pump sources using the authentic workspace layout."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,sys
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parent;ROOT=next(p for p in P.parents if (p/'evidence/original/pump/deployed.so').is_file());sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--registry-home',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--dependency-cache',type=Path);a=p.parse_args();cp=json.loads((P/'CHECKPOINT.json').read_text())
 for name,digest in cp['primary_source_sha256'].items():assert sha(P/'primary'/name)==digest
 assert sha(ROOT/'scripts/pump_physical_source_wrapper.py')==cp['input_python_sha256']['scripts/pump_physical_source_wrapper.py']
 sys.path.insert(0,str(P/'inputs/scripts'));path=P/'inputs/scripts/pump_build_verified.py';spec=importlib.util.spec_from_file_location('archived_pump_builder',path);b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b);b.ROOT=ROOT
 sys.argv=[str(path),'--source-directory',str(P/'primary'),'--workspace-layout','--registry-home',str(a.registry_home.resolve()),'--output',str(a.output.resolve())]
 if a.dependency_cache:sys.argv+=['--dependency-cache',str(a.dependency_cache.resolve())]
 if cp.get('text_section_order'):
  order=P/cp['text_section_order'];assert sha(order)==cp['text_section_order_sha256'];sys.argv+=['--text-section-order',str(order)]
 b.main();report=json.loads((a.output/'build-comparison.json').read_text());assert report['comparison']['candidate_sha256']==cp['candidate_sha256'];assert report['unstripped_sha256']==cp['unstripped_sha256'];print('Archived primary source reproduced both ELF hashes.')
if __name__=='__main__':main()
