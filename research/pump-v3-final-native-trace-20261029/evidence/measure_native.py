"""Literal complete census and original/Linux/native final-costs measurements."""
from pathlib import Path
import collections,difflib,gzip,hashlib,importlib.util,json,sys
R=Path.cwd();P=Path(__file__).resolve().parent;A=R/'work/pr831-review-20261028/projection/research/pump-v3-costs-source-20261029'
T=A/'tools';sys.path.insert(0,str(T));import census as c
c.ROOT=R
sha=lambda b:hashlib.sha256(b).hexdigest()
s=importlib.util.spec_from_file_location('native_literal_elf',R/'research/pump-call-closure-673-20261029/verify.py');v=importlib.util.module_from_spec(s);s.loader.exec_module(v)
raw=(P/'stock/unstripped.so').read_bytes();elf=v.ELF(raw);entries=[(st,x['bytes'],x['symbol'])for st,rows in elf.functions.items()for x in rows if'5trade12v3_buy_costs17h'in x['symbol']];assert len(entries)==1;st,size,symbol=entries[0];report=c.census(P/'stock/unstripped.so');(P/'stock/inventory.json.gz').write_bytes(gzip.compress(json.dumps(report,sort_keys=True).encode(),mtime=0))
base=json.loads(gzip.decompress((R/'research/pump-program-creator-notice-qualification-20261028/analysis/inventory.json.gz').read_bytes()));delta={k:{'gains':[],'losses':[]}for k in ['normalized','raw']}
for x,y in zip(base['windows'],report['windows']):
 assert(x['start'],x['bytes'],x['raw_sha256'])==(y['start'],y['bytes'],y['raw_sha256'])
 for name,key in [('normalized','normalized_matches'),('raw','raw_match')]:
  if bool(x[key])!=bool(y[key]):delta[name]['gains'if y[key]else'losses'].append(hex(x['start']))
orig=v.ELF((R/'evidence/original/pump/deployed.so').read_bytes());original=orig.body(0x80df8,2120);ob=orig.normalize(original);native=elf.body(st,size);nb=elf.normalize(native)
linuxraw=gzip.decompress((A/'build/candidate/symbols.so.gz').read_bytes());linux=v.ELF(linuxraw);lr=[(s,x['bytes'])for s,rr in linux.functions.items()for x in rr if'5trade12v3_buy_costs17h'in x['symbol']];assert len(lr)==1;lb=linux.body(*lr[0]);ln=linux.normalize(lb)
def compare(a,b):
 slots=lambda x:[x[i:i+8]for i in range(0,len(x),8)];changes=[(t,i,j,k,l)for t,i,j,k,l in difflib.SequenceMatcher(None,slots(a),slots(b),autojunk=False).get_opcodes()if t!='equal'];return dict(left_bytes=len(a),right_bytes=len(b),normalized_equal=a==b,aligned_changed_slots=sum(max(j-i,l-k)for t,i,j,k,l in changes),alignment_changes=[dict(kind=t,left_slots=[i,j],right_slots=[k,l])for t,i,j,k,l in changes])
out=dict(native_symbols_sha256=sha(raw),native_candidate_sha256=sha((P/'stock/candidate.so').read_bytes()),native_target=dict(start=st,bytes=size,symbol=symbol,raw_sha256=sha(native),normalized_sha256=sha(nb),calls=elf.calls(st,size)),official_counts=report['counts'],memberships_vs_D037=delta,original_native=compare(ob,nb),original_Linux=compare(ob,ln),Linux_native=compare(ln,nb),Linux_final_symbols_sha256=sha(linuxraw),normalizer_sha256=sha((T/'pump_compare_function_bytes.py').read_bytes()),original_comparison_only=True)
(P/'stock/measurement.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps({k:v for k,v in out.items()if k!='native_target'},indent=2));print('target',hex(st),size,symbol)
