"""Signed CreatePool minimum-liquidity and creator-fee-order controls."""
from pathlib import Path
import argparse,hashlib,json,struct,sys,types
I=Path.cwd();sys.path.insert(0,str(I/'scripts'));import pump_amm_create_differential as h
p=I/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';clean=types.ModuleType('cleaner');clean.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),clean.__dict__)
def cases():
 pairs=[(0,0),(0,1),(1,0),(1,1),(1,99),(99,1),(1,10000),(10000,1),(99,99),(100,100),(101,101),(99,102),(100,99),(10**9,10**9)]
 rows=[{'name':'amounts-'+str((b,q)),'base_amount':b,'quote_amount':q,'optional_hex':''}for b,q in pairs]
 for n in[1,100]:
  for fee,edit in[(1,False),(0,True),(1,True)]:rows.append({'name':'minimum-vs-creator-'+str((n,fee,edit)),'base_amount':n,'quote_amount':n,'optional_hex':(b'\0'+struct.pack('<Q',fee)+bytes([edit,0])).hex()})
 return rows
def run(candidate,output):
 rows=[]
 for c in cases():
  args={'base_amount':c['base_amount'],'quote_amount':c['quote_amount'],'optional':bytes.fromhex(c['optional_hex'])};a=h.create(**args);b=h.create(candidate=candidate,**args);x,y=clean.clean(a),clean.clean(b);diff=[k for k in x if x[k]!=y[k]];rows.append({'case':c,'original':a,'candidate':b,'different_fields':diff})
 sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest();r={'candidate_sha256':sha(candidate),'original_sha256':sha(I/'evidence/original/pump_amm/deployed.so'),'producer_sha256':sha(__file__),'case_count':len(rows),'mismatch_count':sum(bool(x['different_fields'])for x in rows),'cases':rows};output.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in r.items()if k!='cases'}));assert not r['mismatch_count']
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();run(a.candidate,a.output)
