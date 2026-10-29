from pathlib import Path
import collections,hashlib,json,sys

def verify(root,candidate,symbols,baseline,baseline_symbols):
 sys.path.insert(0,str(Path(root)/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 o=Elf(Path(root)/'evidence/original/pump_amm/deployed.so');c=Elf(Path(candidate));s=Elf(Path(symbols));b=Elf(Path(baseline));bs=Elf(Path(baseline_symbols));idx=collections.defaultdict(list);bi=collections.defaultdict(list)
 for e,syms,index in [(c,s,idx),(b,bs,bi)]:
  for f in syms.funcs:index[(f['size'],e.normalized[f['start']:f['start']+f['size']],json.dumps(e.pattern(f['start'],f['size']),sort_keys=True))].append(f)
 rows=[]
 for a,z in zip(o.entries,o.entries[1:]+[o.hi]):
  n=z-a;k=(n,o.normalized[a:z],json.dumps(o.pattern(a,n),sort_keys=True));fs=idx[k];previous=bi[k];rows.append({'start':a,'end':z,'matches':fs,'raw_match':any(o.b[a:z]==c.b[f['start']:f['start']+n]for f in fs),'previous_normalized':bool(previous),'previous_raw':any(o.b[a:z]==b.b[f['start']:f['start']+n]for f in previous)})
 out={'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'symbols_sha256':hashlib.sha256(s.b).hexdigest(),'windows':len(rows),'normalized':sum(bool(r['matches'])for r in rows),'raw':sum(r['raw_match']for r in rows),'previous_normalized':sum(r['previous_normalized']for r in rows),'previous_raw':sum(r['previous_raw']for r in rows),'normalized_gains':[{'start':hex(r['start']),'bytes':r['end']-r['start'],'matches':r['matches']}for r in rows if r['matches']and not r['previous_normalized']],'normalized_losses':[hex(r['start'])for r in rows if not r['matches']and r['previous_normalized']],'raw_gains':[{'start':hex(r['start']),'bytes':r['end']-r['start']}for r in rows if r['raw_match']and not r['previous_raw']],'raw_losses':[hex(r['start'])for r in rows if not r['raw_match']and r['previous_raw']]}
 assert(out['windows'],out['normalized'],out['raw'])==(785,649,148)and out['normalized_losses']==['0x565e8'] and not out['raw_losses'] and len(out['raw_gains'])==0 and len(out['normalized_gains'])==3
 return out
