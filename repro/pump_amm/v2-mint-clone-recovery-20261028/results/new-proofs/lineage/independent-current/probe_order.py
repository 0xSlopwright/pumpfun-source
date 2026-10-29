from pathlib import Path
import sys,json,argparse,hashlib,re
W=Path(__file__).parent;R=W.parents[1];I=R/'work/amm-create-incentive-combined-20261028/runtime-inputs';sys.path.insert(0,str(I/'scripts'))
import pump_amm_create_differential as base
from solders.account import Account
from solders.pubkey import Pubkey

def clean(r):
 r=dict(r);r['logs']=[re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',x)for x in r['logs']if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',x)];return r

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);args=p.parse_args();rows=[]
 def run(name,**kw):
  a=base.create(**kw);b=base.create(candidate=args.candidate,**kw);ca,cb=clean(a),clean(b);diff=[k for k in ca if ca[k]!=cb[k]];rows.append({'case':name,'input':{k:(v.hex() if isinstance(v,bytes) else v) for k,v in kw.items()if k!='overrides'},'original':a,'candidate':b,'different_fields':diff})
 for amounts in [(0,0),(1,1),(99,99),(100,100),(101,101),(10**9,10**9)]:
  for fee,edit in [(0,False),(1,False),(0,True),(1,True)]:
   optional=b'\x00'+fee.to_bytes(8,'little')+bytes([edit])+b'\x00'
   for disabled in [False,True]:
    override=base.mutate(base.CONFIG_KEY,56,b'\x01')if disabled else None
    run(f'multi-invalid:{amounts}:fee={fee}:edit={edit}:disabled={disabled}',base_amount=amounts[0],quote_amount=amounts[1],optional=optional,overrides=override)
 # A pre-existing pool must be rejected by init, not provide prior nonzero field defaults.
 for owner in [Pubkey.default(),base.PROGRAM]:
  for length in [0,8,287]:
   for fill in [0,165]:
    def existing(h,m,owner=owner,length=length,fill=fill):h.vm.set_account(m[0].pubkey,Account(10_000_000,bytes([fill])*length,owner))
    run(f'existing-pool:{owner}:{length}:{fill}',overrides=existing)
 sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest();out={'candidate_sha256':sha(args.candidate),'original_sha256':sha(I/'evidence/original/pump_amm/deployed.so'),'producer_sha256':sha(__file__),'cases':rows,'case_count':len(rows),'mismatches':[i for i,r in enumerate(rows)if r['different_fields']],'scope':'Signed offline create_pool multi-invalid error precedence, exact result states and CPIs with compute/Source log coordinates normalized. Existing Pool data/owner inputs exercise init rejection or zero-data allocation.'};args.output.write_text(json.dumps(out,separators=(',',':'))+'\n');print('cases',len(rows),'mismatches',out['mismatches']);assert not out['mismatches']
if __name__=='__main__':main()
