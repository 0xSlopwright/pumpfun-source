"""Saved ELF comparison only. Never executes compiler output or edits images."""
from pathlib import Path
import gzip,hashlib,importlib.util,json,sys
D=Path(__file__).resolve().parent;W=D.parent;R=W/'pumpfun-source';P=R/'research/pump-exact-sol-guard-20261029'
def load(n,p):
 spec=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def main(label):
 out=D/label;sys.path.insert(0,str(P/'tools'));c=load('upstream_census',P/'tools/census.py');c.ROOT=R
 a=load('upstream_audit',P/'audit_target.py');result=c.census(out/'symbols.so');save(out/'census.json',result)
 original=a.Elf(R/'evidence/original/pump/deployed.so');current=a.Elf(out/'symbols.so');report={'image_sha256':hashlib.sha256(current.data).hexdigest(),'counts':result['counts'],'original_vs_local':a.comparison(original.target(True),current.target())}
 for kind in ['parent','candidate']:
  dst=D/('published-'+kind+'-symbols.so')
  if not dst.exists():dst.write_bytes(gzip.decompress((P/kind/'symbols.so.gz').read_bytes()))
  e=a.Elf(dst);report['published_'+kind+'_vs_local']=a.comparison(e.target(),current.target())
 target=current.target();report['target']={k:v for k,v in target.items() if k not in ['raw','norm','refs']};report['target']['raw_sha256']=hashlib.sha256(target['raw']).hexdigest();report['target']['normalized_sha256']=hashlib.sha256(target['norm']).hexdigest()
 save(out/'measurement.json',report);print(json.dumps(report,indent=2))
if __name__=='__main__':main(sys.argv[1])
