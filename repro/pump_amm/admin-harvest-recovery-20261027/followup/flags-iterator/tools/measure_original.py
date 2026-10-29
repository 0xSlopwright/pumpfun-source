from pathlib import Path
import argparse,collections,hashlib,json,sys,types
W=Path(__file__).resolve().parent
def load_reader(root):
 p=Path(root)/'repro/pump_amm/claim-self-transfer-v144/static-tool/elf_reader.py';m=types.ModuleType('elf');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m.Elf
def measure(root,candidate,symbols,baseline,baseline_symbols):
 E=load_reader(root);o,c,s,b,bs=map(E,[Path(root)/'evidence/original/pump_amm/deployed.so',Path(candidate),Path(symbols),Path(baseline),Path(baseline_symbols)]);indexes=[]
 for e,sy in [(c,s),(b,bs)]:
  ix=collections.defaultdict(list)
  for f in sy.funcs:ix[(f['size'],e.normalized[f['start']:f['start']+f['size']],json.dumps(e.pattern(f['start'],f['size']),sort_keys=True))].append(f)
  indexes.append(ix)
 rows=[]
 for a,z in zip(o.entries,o.entries[1:]+[o.hi]):
  key=(z-a,o.normalized[a:z],json.dumps(o.pattern(a,z-a),sort_keys=True));now,prior=[ix[key]for ix in indexes];rows.append({'original':a,'bytes':z-a,'matches':now,'previous_matches':prior,'raw_match':any(o.b[a:z]==c.b[f['start']:f['start']+z-a]for f in now),'previous_raw':any(o.b[a:z]==b.b[f['start']:f['start']+z-a]for f in prior)})
 result={'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'symbols_sha256':hashlib.sha256(s.b).hexdigest(),'windows':len(rows),'normalized':sum(bool(r['matches'])for r in rows),'raw':sum(r['raw_match']for r in rows),'normalized_text_bytes':sum(r['bytes']for r in rows if r['matches']),'normalized_gains':[{'original':hex(r['original']),'bytes':r['bytes'],'matches':r['matches']}for r in rows if r['matches']and not r['previous_matches']],'normalized_losses':[hex(r['original'])for r in rows if not r['matches']and r['previous_matches']],'raw_gains':[hex(r['original'])for r in rows if r['raw_match']and not r['previous_raw']],'raw_losses':[hex(r['original'])for r in rows if not r['raw_match']and r['previous_raw']]}
 fs={f['start']:f for f in s.funcs};bodies=[]
 for name,a,pattern in [('InitBoost',0x1ef90,'instructions5boost7execute'),('Disable',0x17960,'18pump_amm_recovered7disable17h'),('CreatePool',0x2ba60,'instructions11create_pool7execute')]:
  f=next(f for f in s.funcs if pattern in f['name']);n=o.entries[o.entries.index(a)+1]-a;bodies.append({'name':name,'original':a,'original_bytes':n,'candidate':f,'original_calls':o.callsites(a,n),'candidate_calls':[{'offset':p-f['start'],'function':fs[t]}for p,t in c.calls.items()if f['start']<=p<f['start']+f['size']]})
 return result,bodies
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);p.add_argument('--baseline',type=Path,required=True);p.add_argument('--baseline-symbols',type=Path,required=True);a=p.parse_args();r,b=measure(a.root,a.candidate,a.symbols,a.baseline,a.baseline_symbols);(W/'measurement.json').write_text(json.dumps(r,indent=2)+'\n');(W/'bodies.json').write_text(json.dumps(b,indent=2)+'\n');print(json.dumps(r,indent=2))
