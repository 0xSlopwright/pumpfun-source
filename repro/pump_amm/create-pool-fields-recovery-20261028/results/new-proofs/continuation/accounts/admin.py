"""Signed UpdateAdmin key, account-role, and truncated-account boundaries."""
from pathlib import Path
import argparse,hashlib,json,re,sys
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file())
sys.path.insert(0,str(ROOT/'scripts'))
from pump_amm_admin_differential import *
DISC=bytes(next(x for x in IDL['instructions']if x['name']=='update_admin')['discriminator'])
DUMMY=Pubkey.from_bytes(bytes([90])*32)
def clean(value):
 value=dict(value);value['logs']=[re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',x)for x in value['logs']if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',x)];return value

def truncated(h,count):
 vm=h.vm;vm.set_account(CONFIG_KEY,Account(CONFIG['lamports'],bytes(RAW),PROGRAM));vm.set_account(DUMMY,Account(10**9,b'',Pubkey.default()))
 metas=[AccountMeta(PAYER.pubkey(),True,False),AccountMeta(CONFIG_KEY,False,True),AccountMeta(DUMMY,False,False),AccountMeta(EVENT,False,False),AccountMeta(PROGRAM,False,False)][:count]
 tx=Transaction.new_signed_with_payer([Instruction(PROGRAM,DISC,metas)],PAYER.pubkey(),[PAYER],vm.latest_blockhash());r=vm.send_transaction(tx);bad=isinstance(r,FailedTransactionMetadata);m=r.meta()if bad else r
 return {'error':str(r.err())if bad else None,'state_hex':bytes(vm.get_account(CONFIG_KEY).data).hex(),'logs':m.logs()}

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists()
 left,right=Harness(ROOT/'evidence/original/pump_amm/deployed.so'),Harness(a.candidate);rows=[]
 cases=[{'label':'key-'+str(i),'new_admin':bytes([i])*32}for i in range(32)]
 cases += [{'label':'alias-'+str(k),'new_admin':bytes(k)}for k in [PAYER.pubkey(),OUTSIDER.pubkey(),PROGRAM,CONFIG_KEY,EVENT]]
 cases += [{'label':m,'new_admin':bytes([55])*32,'mutation':m}for m in ['outsider','unsigned','readonly','owner','discriminator','truncated','event','noncanonical_config','program']]
 cases += [{'label':'trailing','new_admin':bytes([55])*32,'arguments':b'ignored'}]
 for case in cases:
  kw={k:v for k,v in case.items()if k!='label'};kw.setdefault('arguments',b'');kw['instruction']='update_admin';x,y=clean(left.query(**kw)),clean(right.query(**kw));record={k:v.hex()if isinstance(v,bytes)else v for k,v in case.items()};rows.append({'case':record,'original':x,'candidate':y,'differences':[k for k in x if x[k]!=y[k]]})
 for count in range(6):
  x,y=clean(truncated(left,count)),clean(truncated(right,count));rows.append({'case':{'account_count':count},'original':x,'candidate':y,'differences':[k for k in x if x[k]!=y[k]]})
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r={'scope':__doc__,'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'candidate_sha256':sha(a.candidate),'probe_sha256':sha(Path(__file__)),'case_count':len(rows),'mismatch_count':sum(bool(x['differences'])for x in rows),'cases':rows};a.output.write_text(json.dumps(r,indent=2)+'\n');print(json.dumps({k:r[k]for k in ['case_count','mismatch_count']}));assert not r['mismatch_count']
if __name__=='__main__':main()
