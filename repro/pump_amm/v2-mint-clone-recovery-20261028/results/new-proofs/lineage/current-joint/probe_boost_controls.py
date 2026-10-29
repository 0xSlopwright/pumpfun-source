from pathlib import Path
import sys,json,argparse,hashlib,struct,re
W=Path(__file__).parent;R=W.parents[1];I=R/'work/amm-create-pool-canonical-stores-next-20261028/runtime-inputs';sys.path.insert(0,str(I/'scripts'));import pump_amm_boost_burn_differential as b

def clean(x):
 x=dict(x);x['logs']=[re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',s)for s in x['logs']if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',s)];return x

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);args=p.parse_args();rows=[]
 def test(name,amount,override):
  a=b.run(amount=amount,overrides=override);c=b.run(amount=amount,candidate=args.candidate,overrides=override);x,y=clean(a),clean(c);rows.append({'case':name,'original':a,'candidate':c,'different_fields':[k for k in x if x[k]!=y[k]]})
 for hook in [False,True]:
  for amount in [1,1000,10**9,10**12]:
   def change(h,m,hook=hook):
    b.boost_transferfee(b.quote,0,0,0,True)(h,m)
    a=h.vm.get_account(b.quote);program=bytes(b.Pubkey.from_bytes(bytes([111])*32))if hook else bytes(32);data=a.data+struct.pack('<HH',14,64)+bytes(32)+program;h.vm.set_account(b.quote,b.Account(10**9,data,b.TOKEN22))
    for key in [m[8].pubkey,b.vaultquote]:
     a=h.vm.get_account(key);h.vm.set_account(key,b.Account(10**12,a.data+struct.pack('<HHB',15,1,0),a.owner))
   test(f'quote-transfer-hook:{hook}:{amount}',amount,change)
 for amount in [1,1000,10**9]:
  def alias(h,m):
   b.mutate(b.pool,171,bytes(b.BOOST_ATA))(h,m);m[6]=b.AccountMeta(b.BOOST_ATA,False,True)
  test(f'self-transfer:{amount}',amount,alias)
 for amount in [0,1,10**9]:
  def owner(h,m):b.mutate(b.BOOST_ATA,32,bytes(b.PAYER.pubkey()))(h,m)
  test(f'wrong-boost-owner:{amount}',amount,owner)
 H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r={'candidate_sha256':H(args.candidate),'original_sha256':H(I/'evidence/original/pump_amm/deployed.so'),'producer_sha256':H(Path(__file__)),'cases':rows,'case_count':len(rows),'mismatches':[i for i,r in enumerate(rows)if r['different_fields']],'scope':'Supplemental restored-helper controls: synthetic Token2022 transfer hook metadata, quote self-alias and invalid source-owner precedence. Exact states/events/inner instructions; only compute and Source log coordinates normalized.'};args.output.write_text(json.dumps(r,separators=(',',':'))+'\n');print('cases',len(rows),'mismatches',r['mismatches']);assert not r['mismatches']
if __name__=='__main__':main()
