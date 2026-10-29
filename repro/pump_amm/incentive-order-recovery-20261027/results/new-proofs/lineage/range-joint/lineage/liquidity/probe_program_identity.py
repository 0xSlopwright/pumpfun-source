from pathlib import Path
import argparse,hashlib,importlib.util,json,sys
ROOT=next(p for p in Path(__file__).resolve().parents if(p/'evidence/original/pump_amm/deployed.so').is_file());sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_liquidity_differential as h
from solders.account import Account
from solders.pubkey import Pubkey
from solders.instruction import AccountMeta
s=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(s);s.loader.exec_module(direct)

def mutation(kind):
 def f(harness,metas):
  if kind=='canonical':return
  if kind=='token2022_at_classic':metas[11]=AccountMeta(h.TOKEN22,False,False)
  elif kind=='system_account_at_classic':metas[11]=AccountMeta(h.PAYER.pubkey(),False,False)
  elif kind=='fake_executable_key':
   key=Pubkey.from_bytes(bytes([217])*32);harness.vm.set_account(key,harness.vm.get_account(h.TOKEN));metas[11]=AccountMeta(key,False,False)
  elif kind=='classic_nonexecutable':
   account=harness.vm.get_account(h.TOKEN);harness.vm.set_account(h.TOKEN,Account(account.lamports,bytes(account.data),account.owner,False,account.rent_epoch))
  elif kind=='classic_at_token2022':metas[12]=AccountMeta(h.TOKEN,False,False)
  elif kind=='token2022_wrong_key':
   key=Pubkey.from_bytes(bytes([218])*32);harness.vm.set_account(key,harness.vm.get_account(h.TOKEN22));metas[12]=AccountMeta(key,False,False)
  elif kind=='classic_writable':metas[11]=AccountMeta(h.TOKEN,False,True)
 return f

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();rows=[]
 for name in ['deposit','withdraw']:
  for amount in [0,1000]:
   for kind in ['canonical','token2022_at_classic','system_account_at_classic','fake_executable_key','classic_nonexecutable','classic_at_token2022','token2022_wrong_key','classic_writable']:
    args=dict(name=name,amount=amount,maxbase=(1<<64)-1 if name=='deposit'else 0,maxquote=(1<<64)-1 if name=='deposit'else 0,overrides=mutation(kind));x=h.run(**args);y=h.run(candidate=a.candidate,**args);cx,cy=direct.clean(x),direct.clean(y);diff=[k for k in cx if cx[k]!=cy.get(k)];rows.append(dict(instruction=name,amount=amount,case=kind,original=x,candidate=y,mismatched_fields=diff))
 report={'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'probe_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'case_count':len(rows),'mismatches':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows,'scope':'Offline signed supplied Token/Token2022 program identity and executable constraints; no live transaction.'};a.output.write_text(json.dumps(report,separators=(',',':'))+'\n');print(json.dumps({k:report[k]for k in ['candidate_sha256','case_count','mismatches']}));assert not report['mismatches']
if __name__=='__main__':main()
