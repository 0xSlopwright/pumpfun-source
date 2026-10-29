"""Signed creator-transfer alias/owner/order cases with native and Token2022 quotes."""
from pathlib import Path
import argparse,hashlib,json,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
from pump_amm_legacy_buy_differential import *

def mutation(profile,kind):
 def run(h,m):
  custom_fee_table([(0,(0,0,30))])(h,m)
  mutate(CONFIG_KEY,40,struct.pack('<QQ',0,0))(h,m);mutate(CONFIG_KEY,313,struct.pack('<Q',30))(h,m)
  if profile is not None:adapt_sell_helper(legacy_transferfee(quote,*profile))(h,m)
  if kind=='dest_user_alias':m[17]=AccountMeta(m[6].pubkey,False,True)
  if kind=='dest_pool_alias':m[17]=AccountMeta(m[8].pubkey,False,True)
  if kind=='dest_owner_payer':mutate(m[17].pubkey,32,bytes(PAYER.pubkey()))(h,m)
  if kind=='dest_owner_other':mutate(m[17].pubkey,32,bytes(OUTSIDER.pubkey()))(h,m)
  if kind=='source_owner_other':mutate(m[6].pubkey,32,bytes(OUTSIDER.pubkey()))(h,m)
  if kind=='dest_readonly':m[17]=AccountMeta(m[17].pubkey,False,False)
  if kind=='source_readonly':m[6]=AccountMeta(m[6].pubkey,False,False)
 return run

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();candidate=a.candidate.resolve();rows=[]
 for name in ['buy','buy_exact_quote_in']:
  for profile in [None,(100,123),(10000,123)]:
   for kind in ['valid','dest_user_alias','dest_pool_alias','dest_owner_payer','dest_owner_other','source_owner_other','dest_readonly','source_readonly']:
    opts=dict(name=name,amount=1000 if name=='buy'else 10**7,limit=2**64-1 if name=='buy'else 1,overrides=mutation(profile,kind));x=legacy_buy(**opts);y=legacy_buy(candidate=candidate,**opts);rows.append({'instruction':name,'profile':profile,'case':kind,'original':x,'candidate':y,'diff':[k for k in x if k!='logs'and x[k]!=y[k]]})
 assert len(rows)==48
 sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest();d={'scope':__doc__,'candidate_sha256':sha(candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'script_sha256':sha(__file__),'case_count':len(rows),'mismatches':[i for i,r in enumerate(rows)if r['diff']],'cases':rows};a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(d,separators=(',',':'))+'\n');print(json.dumps({'cases':len(rows),'mismatches':d['mismatches']}));raise SystemExit(bool(d['mismatches']))
if __name__=='__main__':main()
