#!/usr/bin/env python3
"""Signed configured-fee, whitelist, volume-event and error-precedence sell replay."""
from pathlib import Path
import argparse,gzip,hashlib,json,struct,sys
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump/deployed.so').is_file())
sys.path.insert(0,str(ROOT/'scripts'))
import pump_v3_configured_fee_differential as v
p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--baseline',type=Path);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
original=ROOT/'evidence/original/pump/deployed.so';keys=['error','accounts','inner_instructions','event_payloads','return_data']
volume=v.f.ixs[-1].accounts[11].pubkey;old_global=v.initial[v.global_key];old_volume=v.initial[volume]
cases=[{'family':'configured-fees','case':c}for c in v.cases() if c['operation']=='sell_v3']
base={'operation':'sell_v3','amount':500000000,'max_cost':0,'reserve_in':v.base_in,'reserve_out':v.base_out,'creator_override':500,'user_lamports':10**16,'replace':13}
for whitelist in [False,True]:
 for token in [False,True]:
  for flags in [[],[81]]:
   cases.append({'family':'whitelist-mayhem','whitelist':whitelist,'case':{**base,'token_quote':token,'quote2022':token,'flags':flags}})
for token in [False,True]:cases.append({'family':'nonzero-volume','baseline_witness':True,'volume_values':[123456,789012,345678,2468],'case':{**base,'token_quote':token,'quote2022':token}})
cases.append({'family':'error-precedence','baseline_witness':True,'case':{**base,'amount':2**63,'mutation':'wrong_buyback'}})
rows=[]
for i,row in enumerate(cases):
 v.initial[v.global_key]=old_global;v.initial[volume]=old_volume
 if row.get('whitelist'):
  data=bytearray(old_global.data);data[451:483]=bytes(v.user.pubkey());v.initial[v.global_key]=v.f.Account(old_global.lamports,bytes(data),old_global.owner)
 if 'volume_values' in row:
  data=bytearray(old_volume.data);struct.pack_into('<QQQq',data,41,*row['volume_values']);v.initial[volume]=v.f.Account(old_volume.lamports,bytes(data),old_volume.owner)
 outs={n:v.run(b,row['case'])for n,b in [('original',original),('candidate',a.candidate)]}
 if a.baseline and row.get('baseline_witness'):outs['baseline']=v.run(a.baseline,row['case'])
 equal={n:{k:o[k]==outs['original'][k]for k in keys}for n,o in outs.items() if n!='original'}
 assert all(o['signature_verified']for o in outs.values())
 rows.append({**row,'outcomes':outs,'equal':equal})
 if i%10==0 or not all(equal['candidate'].values()):print(i+1,len(cases),row['family'],equal['candidate'],flush=True)
bad=[i for i,r in enumerate(rows)if not all(r['equal']['candidate'].values())]
sha=lambda b:hashlib.sha256(b.read_bytes()).hexdigest()
out={'scope':__doc__,'original_sha256':sha(original),'candidate_sha256':sha(a.candidate),'baseline_sha256':sha(a.baseline)if a.baseline else None,'cases':rows,'mismatches':bad}
a.output.write_bytes(gzip.compress(json.dumps(out,separators=(',',':')).encode(),mtime=0));print(json.dumps({'cases':len(rows),'mismatches':bad}),flush=True)
assert not bad,bad
