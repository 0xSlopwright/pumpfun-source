from pathlib import Path
import collections,hashlib,json,struct,sys
R=Path(__file__).resolve().parents[2];sys.path.insert(0,str(R/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
O=R/'evidence/original/pump_amm/deployed.so';C=R/'work/amm-fifth-wave-build-worker-20261027/build/artifacts/pump_amm_recovered.so'

def ptr(e,at):return struct.unpack_from('<I',e.b,at+4)[0]|struct.unpack_from('<I',e.b,at+12)[0]<<32
def region(e,p):
 return next((n for n,s in e.secs.items()if s[4]<=p<s[4]+s[5]),None)
def run(original=O,candidate=C,data_dir=None):
 o=Elf(Path(original));c=Elf(Path(candidate));d=Path(data_dir)if data_dir is not None else R/'work/amm-fifth-wave-build-worker-20261027/audit';cl=json.loads((d/'call-closure.json').read_bytes());ds=json.loads((d/'descriptors.json').read_bytes());seen={(x['original'],x['candidate'],x['offset'])for x in ds['observations']};rows=[];groups=collections.defaultdict(list)
 for p in cl['pairs']:
  for k in p['relocated_data_offsets']:
   if(p['original'],p['candidate'],k)in seen:continue
   a,b=ptr(o,p['original']+k),ptr(c,p['candidate']+k)
   row={'original':p['original'],'candidate':p['candidate'],'offset':k,'original_pointer':a,'candidate_pointer':b,'original_region':region(o,a),'candidate_region':region(c,b),'candidate_names':p['candidate_names'],'in_direct_closure':p['in_internal_direct_closure'],'original_prefix':o.b[a:a+64].hex(),'candidate_prefix':c.b[b:b+64].hex(),'equal_first64':o.b[a:a+64]==c.b[b:b+64]};rows.append(row);groups[a].append(row)
 out={'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'original_sha256':hashlib.sha256(o.b).hexdigest(),'all_relocated_observations':sum(len(p['relocated_data_offsets'])for p in cl['pairs']),'recognized_observations':len(seen),'unclassified_observations':len(rows),'original_pointer_count':len(groups),'rows':rows};return out
if __name__=='__main__':
 out=run();W=Path(__file__).resolve().parent;(W/'inventory.json').write_text(json.dumps(out,indent=2)+'\n');g=collections.defaultdict(list)
 for row in out['rows']:g[row['original_pointer']].append(row)
 print({k:v for k,v in out.items()if k!='rows'})
 for a,rs in sorted(g.items(),key=lambda p:(-len(p[1]),p[0])):
  r=rs[0];print(hex(a),len(rs),r['original_region'],r['candidate_region'],r['original_prefix'][:96],r['candidate_prefix'][:96],r['candidate_names'][0])
