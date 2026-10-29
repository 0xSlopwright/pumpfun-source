"""Signed resize/guard interleavings across all nine original helper callers."""
from pathlib import Path
import sys,hashlib,json,os,gzip,base64,argparse,re,types
sys.dont_write_bytecode=True
R=Path(__file__).resolve().parents[2];reads={};busy=False

def audit(event,args):
 global busy
 if busy or event!='open':return
 name,mode,flags=args
 if not isinstance(name,(str,bytes,os.PathLike)):return
 p=Path(name).resolve()
 try:rel=p.relative_to(R)
 except ValueError:return
 if not rel.parts or rel.parts[0]not in ['scripts','evidence','research','repro']:return
 if mode and any(x in mode for x in 'wax+'):return
 if p.suffix not in ['.py','.json','.so']or not p.is_file():return
 busy=True
 try:reads[str(rel)]=hashlib.sha256(p.read_bytes()).hexdigest()
 finally:busy=False
sys.addaudithook(audit)
sys.path.insert(0,str(R/'scripts'))
import pump_amm_boost_burn_differential as h
p=R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';cleaner=types.ModuleType('cleaner');exec(compile(p.read_bytes(),str(p),'exec'),cleaner.__dict__)
def cases():
 return [{'authority':k,'enabled':e,'disabled_buy':d,'amount':10**6}for k in ['valid','zero','wrong']for e,d in [(True,False),(False,False),(True,True),(False,True)]]+[{'authority':k,'enabled':True,'disabled_buy':False,'amount':0}for k in ['valid','zero','wrong']]
def setup(c):
 def apply(vm,metas):
  a=vm.vm.get_account(h.CONFIG_KEY);d=bytearray(a.data);d[907:939]=bytes(h.PAYER.pubkey()if c['authority']=='valid'else h.Pubkey.default()if c['authority']=='zero'else h.OUTSIDER.pubkey());d[939]=int(c['enabled']);d[56]=8 if c['disabled_buy']else 0;vm.vm.set_account(h.CONFIG_KEY,h.Account(a.lamports,bytes(d),a.owner))
 return apply
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for c in cases():
  x=h.run(amount=c['amount'],limit=0,overrides=setup(c));y=h.run(amount=c['amount'],limit=0,overrides=setup(c),candidate=a.candidate);assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':c,'original':x,'candidate':y,'mismatched_fields':diff})
 before=dict(reads);after={k:hashlib.sha256((R/k).read_bytes()).hexdigest()for k in before};assert before==after;out={'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'runtime_reads_before':before,'runtime_reads_after':after,'cases':rows};a.output.write_bytes(gzip.compress((json.dumps(out,separators=(',',':'))+'\n').encode(),mtime=0));print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'original_successes':sum(r['original']['error']is None for r in rows)},indent=2))
if __name__=='__main__':main()
