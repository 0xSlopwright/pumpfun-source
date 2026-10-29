"""Signed focused sell transfer/accrual/event ordering on synthetic local state."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,sys
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file());sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_trade_v2_differential as h
spec=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(spec);spec.loader.exec_module(direct)
MAX=(1<<64)-1
CASES=['normal','zero-buyback','full-buyback','valid-tf','invalid-tf-cap','invalid-tf-cap-frozen-buyback','invalid-tf-cap-frozen-base','invalid-tf-cap-frozen-user-quote','frozen-buyback','frozen-base','frozen-user-quote','nonzero-volume-user']
def override(case):
 def apply(vm,metas):
  if case=='zero-buyback':h.mutate(h.CONFIG_KEY,899,(0).to_bytes(8,'little'))(vm,metas)
  if case=='full-buyback':h.mutate(h.CONFIG_KEY,899,(10000).to_bytes(8,'little'))(vm,metas)
  if case=='valid-tf':h.trade_transferfee(h.quote,100,10000)(vm,metas)
  if 'invalid-tf-cap' in case:h.trade_transferfee(h.quote,65535,10000)(vm,metas)
  if 'frozen-buyback' in case:h.mutate(metas[14].pubkey,108,bytes([2]))(vm,metas)
  if 'frozen-base' in case:h.mutate(h.userbase,108,bytes([2]))(vm,metas)
  if 'frozen-user-quote' in case:h.mutate(h.userquote,108,bytes([2]))(vm,metas)
  if case=='nonzero-volume-user':
   raw=bytes(next(x for x in h.IDL['accounts']if x['name']=='UserVolumeAccumulator')['discriminator'])+bytes(h.OUTSIDER.pubkey())+bytes(97)
   vm.vm.set_account(h.volume,h.Account(10**9,raw,h.PROGRAM))
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for case in CASES:
  args=dict(name='sell_v2',amount=10**10,limit=1,overrides=override(case))
  x=h.trade(**args);y=h.trade(candidate=a.candidate,**args);cx,cy=direct.clean(x),direct.clean(y);diffs=[k for k in cx if cx[k]!=cy.get(k)]
  rows.append(dict(case=case,original=x,candidate=y,mismatched_fields=diffs))
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
 r=dict(scope=__doc__,original_sha256=sha(ROOT/'evidence/original/pump_amm/deployed.so'),candidate_sha256=sha(a.candidate),probe_sha256=sha(Path(__file__)),comparison_sha256=sha(ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'),cases=rows,case_count=len(rows),mismatch_count=sum(bool(r['mismatched_fields'])for r in rows));a.output.write_text(json.dumps(r,separators=(',',':'))+'\n')
 print(json.dumps({k:r[k]for k in ['case_count','mismatch_count']}))
 for r in rows:print(r['case'],r['original']['error'],r['candidate']['error'],r['mismatched_fields'])
if __name__=='__main__':main()
