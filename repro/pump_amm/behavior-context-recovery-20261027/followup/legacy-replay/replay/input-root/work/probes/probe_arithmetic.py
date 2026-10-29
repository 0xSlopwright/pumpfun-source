"""Signed zero-fee, absent-creator, whitelist and arithmetic-overflow collisions."""
from pathlib import Path
import argparse,hashlib,json,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
from pump_amm_legacy_buy_differential import *

def setup(fees,absent,whitelist,quote_reserves=None):
 def apply(h,m):
  custom_fee_table([(0,fees)])(h,m)
  mutate(CONFIG_KEY,40,struct.pack('<QQ',fees[0],fees[1]))(h,m)
  mutate(CONFIG_KEY,313,struct.pack('<Q',fees[2]))(h,m)
  if whitelist:mutate(CONFIG_KEY,353,bytes(PAYER.pubkey()))(h,m)
  if absent:
   value=Pubkey.default();mutate(pool,211,bytes(value))(h,m)
   vault=Pubkey.find_program_address([b'creator_vault',bytes(value)],PROGRAM)[0]
   ata=Pubkey.find_program_address([bytes(vault),bytes(TOKEN),bytes(quote)],ATA)[0]
   h.vm.set_account(vault,Account(10**9,b'',Pubkey.default()));h.vm.set_account(ata,Account(2039280,token(quote,vault,0,True),TOKEN));m[17]=AccountMeta(ata,False,True);m[18]=AccountMeta(vault,False,False);del m[23]
  if quote_reserves is not None:
   mutate(pool,245,bytes(16))(h,m);mutate(pool,271,bytes(16))(h,m)
   a=h.vm.get_account(vaultquote);data=bytearray(a.data);data[64:72]=struct.pack('<Q',quote_reserves)
   h.vm.set_account(vaultquote,Account(quote_reserves+2039280,bytes(data),a.owner))
 return apply

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();candidate=a.candidate.resolve();rows=[]
 def run(name,label,amount,fees,absent,whitelist,q=None):
  opts=dict(name=name,amount=amount,limit=2**64-1 if name=='buy'else 1,overrides=setup(fees,absent,whitelist,q))
  x=legacy_buy(**opts);y=legacy_buy(candidate=candidate,**opts);diff=[k for k in x if k!='logs'and x[k]!=y[k]];rows.append({'instruction':name,'case':label,'fees':fees,'absent_creator':absent,'whitelist':whitelist,'amount':amount,'quote_reserves':q,'original':x,'candidate':y,'diff':diff})
 for name in ['buy','buy_exact_quote_in']:
  for fees in [(0,0,0),(0,0,30),(10,20,30)]:
   for absent in [False,True]:
    for whitelist in [False,True]:
     for amount in [1,10**7]:run(name,'zero/creator/whitelist',amount,fees,absent,whitelist)
 for q in [(2**64-1)//3-100,(2**64-1)//2-100,(2**64-1)*3//4]:
  for absent in [False,True]:run('buy','addition-overflow',int(f['pool_base_vault_amount_raw'])//2,(10000,10000,10000),absent,False,q)
 assert len(rows)==54
 sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest();d={'scope':__doc__,'candidate_sha256':sha(candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'script_sha256':sha(__file__),'case_count':len(rows),'mismatches':[i for i,r in enumerate(rows)if r['diff']],'cases':rows}
 a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(d,separators=(',',':'))+'\n');print(json.dumps({'case_count':len(rows),'mismatches':d['mismatches']}));raise SystemExit(bool(d['mismatches']))
if __name__=='__main__':main()
