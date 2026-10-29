"""Signed multi-hop fee-context probes: canonicality, zero reserves and fee-config tail bounds."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json,struct,sys
R=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(R/'scripts'));import pump_amm_multi_hop_differential as h
spec=importlib.util.spec_from_file_location('cleaner',R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');cleaner=importlib.util.module_from_spec(spec);spec.loader.exec_module(cleaner)
def setup(canonical,reserves,length):
 def apply(vm,metas):
  h.custom_fee_table([(0,(100,200,300))])(vm,metas)
  old=vm.vm.get_account(h.feeconfig);vm.vm.set_account(h.feeconfig,h.Account(old.lamports,bytes(old.data[:length]),old.owner))
  pk=metas[18].pubkey;a=vm.vm.get_account(pk);d=bytearray(a.data)
  creator=h.Pubkey.find_program_address([b'pool-authority',bytes(h.base)],h.PUMP)[0] if canonical else h.OUTSIDER.pubkey()
  new,bump=h.Pubkey.find_program_address([b'pool',bytes(d[9:11]),bytes(creator),bytes(h.base),bytes(h.quote)],h.PROGRAM)
  d[8]=bump;d[11:43]=bytes(creator);d[211:243]=bytes(h.OUTSIDER.pubkey());d[245:269]=bytes(24);d[271:287]=bytes(16)
  vm.vm.set_account(new,h.Account(a.lamports,bytes(d),a.owner));metas[18]=h.AccountMeta(new,False,True)
  for offset,amount in [(19,reserves[0]),(20,reserves[1])]:
   key=metas[offset].pubkey;a=vm.vm.get_account(key);d=bytearray(a.data);d[32:64]=bytes(new);d[64:72]=struct.pack('<Q',amount);vm.vm.set_account(key,h.Account(max(a.lamports,amount+2039280),bytes(d),a.owner))
  a=vm.vm.get_account(h.CONFIG_KEY);d=bytearray(a.data);d[899:907]=bytes(8);d[940]=0;vm.vm.set_account(h.CONFIG_KEY,h.Account(a.lamports,bytes(d),a.owner))
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for sell in [False,True]:
  for canonical in [False,True]:
   for reserves in [(0,10**9),(10**9,0),(10**9,10**9)]:
    for length in [2511,2512,4072,4073,4096,4097]:
     params={'sell':sell,'amount':10**6,'limit':1,'overrides':setup(canonical,reserves,length)}
     original=h.run(**params);candidate=h.run(candidate=a.candidate,**params);assert original['transaction_base64']==candidate['transaction_base64'] and original['before']==candidate['before'];x,y=map(cleaner.clean,[original,candidate]);diff=[k for k in x if x[k]!=y.get(k)]
     rows.append({'case':{'sell':sell,'canonical':canonical,'reserves':reserves,'fee_config_len':length},'original':original,'candidate':candidate,'mismatched_fields':diff})
 report={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with a.output.open('wb')as out:
  with gzip.GzipFile(fileobj=out,filename='',mtime=0,mode='wb')as f:f.write((json.dumps(report,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':report['mismatch_count'],'original_successes':sum(x['original']['error']is None for x in rows),'failures':[{'case':x['case'],'fields':x['mismatched_fields'],'original_error':x['original']['error'],'candidate_error':x['candidate']['error']}for x in rows if x['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
