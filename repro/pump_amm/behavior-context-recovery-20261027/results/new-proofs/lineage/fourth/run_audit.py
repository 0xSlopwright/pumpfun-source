#!/usr/bin/env python3
"""Recompute the fixed785-window measurement and bounded call/data audit."""
from pathlib import Path
import argparse,collections,hashlib,json,sys
W=Path(__file__).resolve().parent

def load(name):
 p=W/'tools'/name;ns={'__name__':'audit_'+p.stem,'__file__':str(p)};exec(compile(p.read_bytes(),str(p),'exec'),ns);return ns

def run(root,candidate,symbols,template,out):
 root=Path(root).resolve();candidate=Path(candidate).resolve();symbols=Path(symbols).resolve();out=Path(out).resolve();out.mkdir(parents=True,exist_ok=False);sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 o=Elf(root/'evidence/original/pump_amm/deployed.so');c=Elf(candidate);s=Elf(symbols);t=json.loads(Path(template).read_bytes());assert len(t['rows'])==785;idx=collections.defaultdict(list)
 for f in s.funcs:idx[(f['size'],c.normalized[f['start']:f['start']+f['size']],json.dumps(c.pattern(f['start'],f['size']),sort_keys=True))].append(f)
 rows=[];raw=0
 for p in t['rows']:
  a,z=p['start'],p['end'];fs=idx[(z-a,o.normalized[a:z],json.dumps(o.pattern(a,z-a),sort_keys=True))];rows.append({'start':a,'end':z,'matches':fs});raw+=any(o.b[a:z]==c.b[f['start']:f['start']+z-a]for f in fs)
 m={'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'normalized_matches':sum(bool(p['matches'])for p in rows),'raw_matches':raw,'rows':rows};(out/'measurement.json').write_text(json.dumps(m,indent=2)+'\n')
 a=load('audit.py');a['ROOT']=root;a['ORIGINAL']=root/'evidence/original/pump_amm/deployed.so';cl=a['analyze'](candidate,symbols,out/'measurement.json');(out/'call-closure.json').write_text(json.dumps(cl,indent=2)+'\n')
 d=load('descriptors.py');d['ROOT']=root;ds=d['analyze'](candidate,symbols,cl);(out/'descriptors.json').write_text(json.dumps(ds,indent=2)+'\n')
 z=load('targets.py');z['ROOT']=root;closed=z['analyze'](candidate,symbols,cl,ds);(out/'data-closure.json').write_text(json.dumps(closed,indent=2)+'\n')
 getter=load('getter.py')['verify'](root,candidate,symbols);event=load('event.py')['verify'](root,candidate,symbols)
 (out/'getter.json').write_text(json.dumps(getter,indent=2)+'\n');(out/'event.json').write_text(json.dumps(event,indent=2)+'\n')
 origins=[p for p in ds['observations']if p.get('origin_coordinates_equal')is False];(out/'origins.json').write_text(json.dumps(origins,indent=2)+'\n')
 result={'candidate_sha256':m['candidate_sha256'],'normalized_windows':m['normalized_matches'],'raw_windows':raw,'call_closure':cl['counts'],'recognized_descriptors':ds['counts'],'data_closure':closed['counts'],'coordinate_observations_unequal':len(origins),'getter_verified':getter['passed'],'event_filename_verified':event['passed'],'scope':'Fixed785 windows; bounded known-reference constraints only, not complete data/indirect/ELF identity.'};(out/'summary.json').write_text(json.dumps(result,indent=2)+'\n');return result
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);p.add_argument('--template',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();print(json.dumps(run(a.root,a.candidate,a.symbols,a.template,a.output),indent=2))
