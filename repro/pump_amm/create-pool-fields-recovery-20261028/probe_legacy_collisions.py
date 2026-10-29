#!/usr/bin/env python3
"""Synthetic legacy exact-quote collisions: zero effective reserve versus invalid inverse fee."""
from pathlib import Path
import argparse,gzip,hashlib,json
import probe_legacy_edges as core

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for q in [0,1]:
  for tf in [(10001,0),(10001,1),(65535,0)]:
   for amount in [1,2,1000]:
    for limit in [1,core.U64]:
     params={'name':'buy_exact_quote_in','amount':amount,'limit':limit,'overrides':core.setup('buy_exact_quote_in',q,'zero',amount,tf=tf)}
     x=core.buy.legacy_buy(**params);y=core.buy.legacy_buy(candidate=a.candidate,**params);assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(core.direct.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)]
     rows.append({'case':{'effective_quote':q,'transfer_bps':tf[0],'max_fee':tf[1],'amount':amount,'min_base':limit,'synthetic':True},'original':x,'candidate':y,'mismatched_fields':diff})
 report={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'imported_core_sha256':hashlib.sha256(Path(core.__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((core.ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'cases':rows}
 with gzip.GzipFile(filename='',fileobj=a.output.open('wb'),mode='wb',mtime=0)as f:f.write((json.dumps(report,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':report['mismatch_count'],'differences':[{'case':r['case'],'fields':r['mismatched_fields'],'original_error':r['original']['error'],'candidate_error':r['candidate']['error']}for r in rows if r['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
