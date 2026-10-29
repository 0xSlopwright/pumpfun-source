"""Signed SetBoostAuthority account-list and raw-authority role boundaries."""
from pathlib import Path
import argparse,hashlib,json,re,sys
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file())
sys.path.insert(0,str(ROOT/'scripts'))
from pump_amm_admin_differential import *
DISC=bytes(next(x for x in IDL['instructions']if x['name']=='set_boost_authority')['discriminator'])
DUMMY=Pubkey.from_bytes(bytes([90])*32)

def clean_logs(logs):
 return [re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',s)for s in logs if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',s)]

def run(harness,case):
 vm=harness.vm;vm.set_account(CONFIG_KEY,Account(CONFIG['lamports'],bytes(RAW),PROGRAM));vm.set_account(DUMMY,Account(10**9,b'',Pubkey.default()))
 authority={'dummy':DUMMY,'admin':PAYER.pubkey(),'config':CONFIG_KEY,'event':EVENT,'system':Pubkey.default(),'program':PROGRAM}[case.get('alias','dummy')]
 accounts=[AccountMeta(PAYER.pubkey(),True,False),AccountMeta(CONFIG_KEY,False,True),AccountMeta(authority,False,case.get('authority_writable',False)),AccountMeta(Pubkey.default(),False,False),AccountMeta(EVENT,False,False),AccountMeta(PROGRAM,False,False)]
 accounts=accounts[:case.get('count',6)]
 tx=Transaction.new_signed_with_payer([Instruction(PROGRAM,DISC,accounts)],PAYER.pubkey(),[PAYER],vm.latest_blockhash())
 result=vm.send_transaction(tx);failed=isinstance(result,FailedTransactionMetadata);meta=result.meta()if failed else result
 return {'error':str(result.err())if failed else None,'state_hex':bytes(vm.get_account(CONFIG_KEY).data).hex(),'logs':clean_logs(meta.logs())}

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists()
 left,right=Harness(ROOT/'evidence/original/pump_amm/deployed.so'),Harness(a.candidate)
 cases=[{'count':i}for i in range(7)]+[{'alias':x}for x in ['admin','config','event','system','program']]+[{'authority_writable':True}]
 rows=[]
 for case in cases:
  x,y=run(left,case),run(right,case);rows.append({'case':case,'original':x,'candidate':y,'differences':[k for k in x if x[k]!=y[k]]})
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();out={'scope':__doc__,'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'candidate_sha256':sha(a.candidate),'probe_sha256':sha(Path(__file__)),'case_count':len(rows),'mismatch_count':sum(bool(x['differences'])for x in rows),'cases':rows};a.output.write_text(json.dumps(out,indent=2)+'\n');print(json.dumps({k:out[k]for k in ['case_count','mismatch_count']}));assert out['mismatch_count']==0
if __name__=='__main__':main()
