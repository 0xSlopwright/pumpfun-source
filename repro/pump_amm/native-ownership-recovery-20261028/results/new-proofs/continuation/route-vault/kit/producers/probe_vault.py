"""Signed curve destination selection through two- and three-hop routes."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,struct,sys
R=Path(__file__).resolve().parents[2];sys.path.insert(0,str(R/'scripts'));import pump_amm_multi_hop_differential as h
s=importlib.util.spec_from_file_location('cleaner',R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');cleaner=importlib.util.module_from_spec(s);s.loader.exec_module(cleaner)
def triple(vm,m,sell):
 h.two_curves(sell)(vm,m)
 vm.vm.set_account(h.BASE2,vm.vm.get_account(h.base))
 bm,qm=(h.quote,h.BASE2)if sell else(h.BASE2,h.CM2)
 creator=h.Pubkey.find_program_address([b'pool-authority',bytes(bm)],h.PUMP)[0]
 pool,bump=h.Pubkey.find_program_address([b'pool',struct.pack('<H',7),bytes(creator),bytes(bm),bytes(qm)],h.PROGRAM)
 programs=[vm.vm.get_account(k).owner for k in [bm,qm]]
 vb,vq=[h.Pubkey.find_program_address([bytes(pool),bytes(program),bytes(mint)],h.ATA)[0]for program,mint in zip(programs,[bm,qm])]
 data=bytearray(h.poolraw);data[8]=bump;data[9:11]=struct.pack('<H',7);data[11:43]=bytes(creator);data[43:75]=bytes(bm);data[75:107]=bytes(qm);data[139:171]=bytes(vb);data[171:203]=bytes(vq);data[211:243]=bytes(h.OUTSIDER.pubkey());data[243:]=bytes(len(data)-243);vm.vm.set_account(pool,h.Account(10**9,bytes(data),h.PROGRAM))
 for key,mint,program in [(vb,bm,programs[0]),(vq,qm,programs[1])]:
  if program==h.TOKEN22:
   raw=bytearray(vm.vm.get_account(h.CB).data);raw[:32]=bytes(mint);raw[32:64]=bytes(pool);raw[64:72]=struct.pack('<Q',10**15)
  else:raw=h.token(mint,pool,10**15,mint==h.quote)
  vm.vm.set_account(key,h.Account(10**15+2039280,bytes(raw),program))
 vm.vm.set_account(h.USER2,h.Account(10**9,h.token(h.BASE2,h.PAYER.pubkey(),10**15),h.TOKEN));m[2]=h.AccountMeta(h.USER2,False,True)
 m.extend([h.AccountMeta(bm,False,False),h.AccountMeta(qm,False,False),h.AccountMeta(pool,False,True),h.AccountMeta(vb,False,True),h.AccountMeta(vq,False,True)])
def setup(sell,depth,mutation):
 def apply(vm,m):
  if depth==3:triple(vm,m,sell)
  else:(h.amm_then_curve(sell)if sell else h.curve_then_amm(sell))(vm,m)
  index=16+5*(depth-1)+(3 if sell else 4);key=m[index].pubkey;account=vm.vm.get_account(key)
  if mutation=='readonly':m[index]=h.AccountMeta(key,False,False)
  elif mutation=='empty':vm.vm.set_account(key,h.Account(account.lamports,b'',account.owner))
  elif mutation=='wrong-mint':
   raw=bytearray(account.data);raw[:32]=bytes(h.OUTSIDER.pubkey());vm.vm.set_account(key,h.Account(account.lamports,bytes(raw),account.owner))
  elif mutation=='wrong-authority':
   raw=bytearray(account.data);raw[32:64]=bytes(h.OUTSIDER.pubkey());vm.vm.set_account(key,h.Account(account.lamports,bytes(raw),account.owner))
  elif mutation=='alias-final':m[index]=h.AccountMeta(m[2].pubkey,False,True)
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for sell in [False,True]:
  for depth in [2,3]:
   for mutation in ['valid','readonly','empty','wrong-mint','wrong-authority','alias-final']:
    params={'sell':sell,'amount':10**6,'limit':1,'overrides':setup(sell,depth,mutation)};x=h.run(**params);y=h.run(candidate=a.candidate,**params);assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':{'sell':sell,'depth':depth,'mutation':mutation},'original':x,'candidate':y,'mismatched_fields':diff})
 out={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with a.output.open('wb')as f:
  with gzip.GzipFile(fileobj=f,filename='',mode='wb',mtime=0)as z:z.write((json.dumps(out,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'original_successes':sum(x['original']['error']is None for x in rows),'valid':[{'case':r['case'],'error':r['original']['error'],'pump_cpis':sum('Program '+str(h.PUMP)+' invoke'in s for s in r['original']['logs'])}for r in rows if r['case']['mutation']=='valid']},indent=2))
if __name__=='__main__':main()
