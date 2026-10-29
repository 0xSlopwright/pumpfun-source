#!/usr/bin/env python3
"""Signed legacy exact-quote small-amount Token-2022 rounding cross-cases."""
from pathlib import Path
import argparse,gzip,hashlib,json
import probe_legacy_edges as core
core.PROFILES['high']=(500,500,500)

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for amount in [1,2,3,4,5,9,10,11,99,100,101,1000]:
  for bps in [1,100,5000,9999,10000]:
   for cap in [1,2,3,core.U64]:
    for profile in ['zero','ordinary','high']:
     params={'name':'buy_exact_quote_in','amount':amount,'limit':1,'overrides':core.setup('buy_exact_quote_in',10**9,profile,amount,tf=(bps,cap))}
     x=core.buy.legacy_buy(**params);y=core.buy.legacy_buy(candidate=a.candidate,**params);assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(core.direct.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)]
     rows.append({'case':{'amount':amount,'transfer_bps':bps,'max_fee':cap,'fees':profile,'synthetic':True},'original':x,'candidate':y,'mismatched_fields':diff})
 report={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'imported_core_sha256':hashlib.sha256(Path(core.__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((core.ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'cases':rows}
 with gzip.GzipFile(filename='',fileobj=a.output.open('wb'),mode='wb',mtime=0)as f:f.write((json.dumps(report,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':report['mismatch_count'],'differences':[{'case':r['case'],'fields':r['mismatched_fields'],'original_error':r['original']['error'],'candidate_error':r['candidate']['error']}for r in rows if r['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
