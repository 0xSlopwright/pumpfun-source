"""Signed v2 cashback guard and amount-precedence checks."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json
W=Path(__file__).resolve().parent;R=W.parents[1];spec=importlib.util.spec_from_file_location('recipient_probe',W/'probe.py');q=importlib.util.module_from_spec(spec);spec.loader.exec_module(q);h=q.h

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for family in ['buy_v2','buy_exact_quote_in_v2','sell_v2']:
  for flag in [0,1,2,255]:
   for amount in [0,10**6]:
    def run(candidate=None):
     r=h.trade(family,amount=amount,limit=10**12 if family=='buy_v2'else 1,overrides=h.mutate(h.pool,244,bytes([flag])),candidate=candidate);r.update(q.captured[-1]);r['events']=[x for x in r['logs']if x.startswith('Program data: ')];return r
    x,y=run(),run(a.candidate);assert x['before']==y['before'] and x['transaction_base64']==y['transaction_base64'];xx,yy=map(q.cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':{'family':family,'cashback_byte':flag,'amount':amount},'original':x,'candidate':y,'mismatched_fields':diff})
 out={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'base_producer_sha256':hashlib.sha256((W/'probe.py').read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with a.output.open('wb')as file:
  with gzip.GzipFile(fileobj=file,filename='',mode='wb',mtime=0)as z:z.write((json.dumps(out,separators=(',',':'))+'\n').encode())
 print(json.dumps({'case_count':len(rows),'mismatch_count':out['mismatch_count'],'original_successes':sum(x['original']['error']is None for x in rows),'failures':[{'case':x['case'],'fields':x['mismatched_fields']}for x in rows if x['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
