"""Signed focused buy executor order and zero effective reserve boundaries."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,sys
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file());sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_trade_v2_differential as h
spec=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(spec);spec.loader.exec_module(direct)
MAX=(1<<64)-1
CASES=['ordinary','zero-input','zero-limit','impossible-limit','buyback-panic-with-limit','frozen-base-with-limit','valid-transfer-fee','zero-effective-reserve-one','zero-effective-reserve-two']
def override(case):
 def apply(vm,metas):
  if case=='buyback-panic-with-limit':h.mutate(h.CONFIG_KEY,899,(10001).to_bytes(8,'little'))(vm,metas)
  if case=='frozen-base-with-limit':h.mutate(h.userbase,108,bytes([2]))(vm,metas)
  if case=='valid-transfer-fee':h.trade_transferfee(h.quote,100,10000)(vm,metas)
  if case.startswith('zero-effective-reserve'):
   raw=vm.vm.get_account(h.vaultquote).data;amount=int.from_bytes(raw[64:72],'little')
   h.mutate(h.pool,245,(-amount).to_bytes(16,'little',signed=True))(vm,metas)
   h.mutate(h.CONFIG_KEY,353,bytes(h.PAYER.pubkey()))(vm,metas)
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for name in ['buy_v2','buy_exact_quote_in_v2']:
  for case in CASES:
   amount=10**10 if name=='buy_v2'else 10**7;limit=10**12 if name=='buy_v2'else 1
   if case=='zero-input':amount=0
   if case=='zero-limit':limit=0
   if case in ['impossible-limit','buyback-panic-with-limit','frozen-base-with-limit']:limit=1 if name=='buy_v2'else MAX
   if case.startswith('zero-effective-reserve'):amount=1 if case.endswith('one')else 2
   args=dict(name=name,amount=amount,limit=limit,overrides=override(case));x=h.trade(**args);y=h.trade(candidate=a.candidate,**args);cx,cy=direct.clean(x),direct.clean(y);diffs=[k for k in cx if cx[k]!=cy.get(k)]
   rows.append(dict(instruction=name,case=case,original=x,candidate=y,mismatched_fields=diffs))
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r=dict(scope=__doc__,original_sha256=sha(ROOT/'evidence/original/pump_amm/deployed.so'),candidate_sha256=sha(a.candidate),probe_sha256=sha(Path(__file__)),comparison_sha256=sha(ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'),cases=rows,case_count=len(rows),mismatch_count=sum(bool(r['mismatched_fields'])for r in rows));a.output.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:r[k]for k in ['case_count','mismatch_count']}))
 for r in rows:print(r['instruction'],r['case'],r['original']['error'],r['candidate']['error'],r['mismatched_fields'])
if __name__=='__main__':main()
