"""Signed buyback setter checks including exact compared-key diagnostic order."""
from pathlib import Path
import argparse,hashlib,json,re,struct,sys
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file())
sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_buyback_differential as h
from solders.litesvm import LiteSVM
from solders.transaction_metadata import FailedTransactionMetadata
forward=LiteSVM.send_transaction
def capture(vm,tx):
 result=forward(vm,tx);meta=result.meta()if isinstance(result,FailedTransactionMetadata)else result
 vm._setter_logs=meta.logs();return result
LiteSVM.send_transaction=capture

def clean(logs):
 return [re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',x)for x in logs if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',x)]

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--expect-differences',action='store_true');a=p.parse_args();assert not a.output.exists()
 left,right=h.BuybackHarness(ROOT/'evidence/original/pump_amm/deployed.so'),h.BuybackHarness(a.candidate)
 keys=[h.Pubkey.from_bytes(bytes([i+30])*32)for i in range(8)]
 patterns=[('unique',keys),('reverse',keys[::-1]),('crossed', [keys[0],keys[1],keys[1],keys[0],*keys[4:]]),('crossed-late',[keys[0],keys[1],keys[2],keys[2],keys[1],*keys[5:]]),('zero-and-duplicate',[keys[0],keys[0],*keys[2:7],h.Pubkey.default()]),('first-zero',[h.Pubkey.default(),*keys[1:]]),('count-seven',keys[:7]),('count-nine',keys+[h.Pubkey.from_bytes(bytes([50])*32)])]
 rows=[]
 for bps in [None,10000,10001]:
  payload=b'\0'if bps is None else b'\1'+struct.pack('<Q',bps)
  for name,recipient_keys in patterns:
   x=left.run(payload,recipient_keys);x['logs']=clean(left.vm._setter_logs)
   y=right.run(payload,recipient_keys);y['logs']=clean(right.vm._setter_logs)
   rows.append({'case':name,'bps':bps,'original':x,'candidate':y,'differences':[k for k in x if x[k]!=y[k]]})
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
 r={'scope':__doc__,'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'candidate_sha256':sha(a.candidate),'probe_sha256':sha(Path(__file__)),'case_count':len(rows),'mismatch_count':sum(bool(x['differences'])for x in rows),'cases':rows}
 a.output.write_text(json.dumps(r,indent=2)+'\n');print(json.dumps({k:r[k]for k in['case_count','mismatch_count']}))
 for x in rows:
  if x['differences']:print(x['case'],x['bps'],x['differences'])
 if r['mismatch_count']and not a.expect_differences:raise SystemExit(1)
if __name__=='__main__':main()
