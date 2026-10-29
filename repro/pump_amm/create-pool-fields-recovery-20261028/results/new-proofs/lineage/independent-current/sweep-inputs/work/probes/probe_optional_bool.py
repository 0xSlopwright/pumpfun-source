"""Signed optional-bool byte and truncation diagnostics for both legacy entry points."""
from pathlib import Path
import argparse,hashlib,json,sys
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'scripts'))
from pump_amm_legacy_buy_differential import *

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();candidate=a.candidate.resolve();rows=[]
 for name in ['buy','buy_exact_quote_in']:
  cases=[('absent',dict(track=b''))]
  cases += [('byte='+str(n),dict(track=bytes([n])))for n in range(256)]
  cases += [('trailing='+b.hex(),dict(track=b))for b in [b'\x00\xff',b'\x01\xff',b'\x02\x00']]
  cases += [('payload='+str(n),dict(payload_length=n))for n in range(26)]
  for label,params in cases:
   opts=dict(name=name,amount=1000 if name=='buy' else 10**7,limit=2**64-1 if name=='buy' else 1);opts.update(params)
   original=legacy_buy(**opts);fixed=legacy_buy(candidate=candidate,**opts);diff=[k for k in original if k!='logs'and original[k]!=fixed[k]]
   rows.append({'instruction':name,'case':label,'original':original,'candidate':fixed,'diff':diff})
 sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest();doc={'scope':__doc__,'candidate_sha256':sha(candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'script_sha256':sha(__file__),'case_count':len(rows),'mismatches':[i for i,r in enumerate(rows)if r['diff']],'cases':rows};assert len(rows)==572
 a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(doc,separators=(',',':'))+'\n');print(json.dumps({'case_count':len(rows),'mismatches':doc['mismatches']}));raise SystemExit(bool(doc['mismatches']))
if __name__=='__main__':main()
