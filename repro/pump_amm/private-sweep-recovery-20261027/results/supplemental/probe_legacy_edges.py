#!/usr/bin/env python3
"""Signed synthetic legacy AMM reserve/rate/policy/balance cross-edge audit."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[3];sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_legacy_buy_differential as buy
import pump_amm_legacy_sell_differential as sell
spec=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(spec);spec.loader.exec_module(direct)
U64=(1<<64)-1
PROFILES={'zero':(0,0,0),'ordinary':(10,20,30),'max-protocol':(0,U64,0),'max-creator':(0,0,U64),'max-all':(U64,U64,U64)}

def setup(kind,q,profile,amount,creatorless=False,whitelist=False,bps=0,balance=None,tf=None):
 def apply(h,m):
  rates=PROFILES[profile];buy.custom_fee_table([(0,rates)])(h,m)
  a=h.vm.get_account(buy.pool);d=bytearray(a.data);d[245:261]=(q-10**9).to_bytes(16,'little',signed=True);d[261:269]=bytes(8);d[271:287]=bytes(16)
  if creatorless:d[211:243]=bytes(32)
  h.vm.set_account(buy.pool,buy.Account(a.lamports,bytes(d),a.owner))
  for key in [buy.vaultbase,buy.vaultquote]:
   a=h.vm.get_account(key);d=bytearray(a.data);d[64:72]=struct.pack('<Q',10**9);h.vm.set_account(key,buy.Account(10**9+2039280 if key==buy.vaultquote else a.lamports,bytes(d),a.owner))
  a=h.vm.get_account(buy.CONFIG_KEY);d=bytearray(a.data);d[899:907]=struct.pack('<Q',bps);d[940]=0
  if whitelist:d[353:385]=bytes(buy.PAYER.pubkey())
  h.vm.set_account(buy.CONFIG_KEY,buy.Account(a.lamports,bytes(d),a.owner))
  if creatorless:
   vault=buy.Pubkey.find_program_address([b'creator_vault',bytes(32)],buy.PROGRAM)[0];ata=buy.Pubkey.find_program_address([bytes(vault),bytes(buy.TOKEN),bytes(buy.quote)],buy.ATA)[0]
   h.vm.set_account(vault,buy.Account(10**9,b'',buy.Pubkey.default()));h.vm.set_account(ata,buy.Account(2039280,buy.token(buy.quote,vault,0,True),buy.TOKEN));m[17]=buy.AccountMeta(ata,False,True);m[18]=buy.AccountMeta(vault,False,False)
  if tf is not None:
   fn=sell.legacy_transferfee(buy.quote,*tf)
   (buy.adapt_sell_helper(fn)if kind!='sell'else fn)(h,m)
  if balance is not None:
   key=buy.userbase if kind=='sell'else buy.userquote;a=h.vm.get_account(key);d=bytearray(a.data);d[64:72]=struct.pack('<Q',balance);h.vm.set_account(key,buy.Account(balance+2039280 if kind!='sell'else a.lamports,bytes(d),a.owner))
  active_creator=0 if creatorless or whitelist else rates[2]
  if kind=='buy':curve=(q*amount+(10**9-amount)-1)//(10**9-amount)if amount<10**9 else 0
  elif kind=='sell':curve=q*amount//(10**9+amount)
  else:
   available=amount if tf is None else max(0,amount-min(tf[1],(amount*tf[0]+9999)//10000))
   curve=available*10000//(10000+min(U64,sum(rates)))
  if active_creator==0 or curve==0:del m[21 if kind=='sell'else 23]
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',required=True,type=Path);p.add_argument('--output',required=True,type=Path);args=p.parse_args();assert not args.output.exists();rows=[]
 def run(case,**opts):
  kind=case['kind'];amount=case['amount'];limit=opts.pop('limit',0 if kind=='sell'else 10**12 if kind=='buy'else 1)
  params={'amount':amount,'limit':limit,'overrides':setup(kind,case.get('effective_quote',10**9),case['fees'],amount,**opts)}
  call=sell.legacy if kind=='sell'else buy.legacy_buy
  if kind!='sell':params['name']=kind
  a=call(**params);b=call(candidate=args.candidate,**params);assert a['transaction_base64']==b['transaction_base64']and a['before']==b['before'];aa,bb=map(direct.clean,[a,b]);diff=[k for k in aa if aa[k]!=bb.get(k)]
  rows.append({'case':dict(case,synthetic=True),'original':a,'candidate':b,'mismatched_fields':diff})
 for kind in ['buy','buy_exact_quote_in','sell']:
  for q in [0,1,2,10,10**9]:
   for amount in [1,2,1000]:
    for profile in PROFILES:run({'group':'reserve-fee-cross','kind':kind,'effective_quote':q,'amount':amount,'fees':profile})
  for setting in ['creatorless','whitelist']:
   for q in [0,10**9]:
    for amount in [1,1000]:
     for profile in ['zero','ordinary','max-creator']:
      run({'group':'policy-cross','kind':kind,'setting':setting,'effective_quote':q,'amount':amount,'fees':profile},**{setting:True})
  for profile in ['zero','ordinary']:
   for balance in [0,999,1000,2000]:
    for impossible in [False,True]:
     limit=U64 if impossible else 0 if kind=='sell'else 10000 if kind=='buy'else 1
     run({'group':'balance-limit','kind':kind,'amount':1000,'fees':profile,'balance':balance,'impossible_limit':impossible},balance=balance,limit=limit)
  for q in [0,10**9]:
   for amount in [1,1000]:run({'group':'buyback-100pct','kind':kind,'effective_quote':q,'amount':amount,'fees':'ordinary'},bps=10000)
 for tf in [(10000,U64),(10001,0),(10001,U64),(65535,123)]:
  for impossible in [False,True]:run({'group':'transferfee-limit','kind':'buy_exact_quote_in','amount':1000,'fees':'zero','transfer_fee':tf,'impossible_limit':impossible},tf=tf,limit=U64 if impossible else 1)
 report={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(args.candidate.read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with gzip.GzipFile(filename='',mode='wb',fileobj=args.output.open('wb'),mtime=0)as f:f.write((json.dumps(report,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':report['mismatch_count'],'differences':[{'case':r['case'],'fields':r['mismatched_fields'],'original_error':r['original']['error'],'candidate_error':r['candidate']['error']}for r in rows if r['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
