from pathlib import Path
import collections,hashlib,json
from elf_reader import Elf
def verify(root,candidate,symbols,baseline,baseline_symbols):
 o,c,s,b,bs=map(Elf,[Path(root)/'evidence/original/pump_amm/deployed.so',Path(candidate),Path(symbols),Path(baseline),Path(baseline_symbols)])
 assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi] and b.b[b.lo:b.hi]==bs.b[bs.lo:bs.hi]
 def index(e,syms):
  d=collections.defaultdict(list)
  for f in syms.funcs:d[(f['size'],e.normalized[f['start']:f['start']+f['size']],json.dumps(e.pattern(f['start'],f['size']),sort_keys=True))].append(f)
  return d
 ix,old=index(c,s),index(b,bs);rows=[];gains=[];losses=[];rg=[];rl=[]
 for a,z in zip(o.entries,o.entries[1:]+[o.hi]):
  key=(z-a,o.normalized[a:z],json.dumps(o.pattern(a,z-a),sort_keys=True));now,prior=ix[key],old[key];raw=any(o.b[a:z]==c.b[f['start']:f['start']+z-a]for f in now);before=any(o.b[a:z]==b.b[f['start']:f['start']+z-a]for f in prior);rows.append({'start':a,'end':z,'matches':now,'raw_match':raw})
  if now and not prior:gains.append(hex(a))
  if prior and not now:losses.append(hex(a))
  if raw and not before:rg.append(hex(a))
  if before and not raw:rl.append(hex(a))
 result={'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'symbols_sha256':hashlib.sha256(s.b).hexdigest(),'windows':len(rows),'normalized':sum(bool(r['matches'])for r in rows),'raw':sum(r['raw_match']for r in rows),'normalized_text_bytes':sum(r['end']-r['start']for r in rows if r['matches']),'normalized_gains':gains,'normalized_losses':losses,'raw_gains':rg,'raw_losses':rl}
 assert(result['windows'],result['normalized'],result['raw'],result['normalized_text_bytes'])==(785,653,148,818944)
 assert gains==['0xe9b90','0xe9fc0']and not losses and not rg and not rl
 return result,{'candidate_sha256':result['candidate_sha256'],'rows':rows}
