"""Signed sell event fields across holder, mayhem, fee, and reserve modes."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,struct,sys
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file());sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_trade_v2_differential as h
spec=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(spec);spec.loader.exec_module(direct)
CASES=['ordinary','mayhem','holder-reward','existing-volume','transfer-fee-capped','zero-creator','zero-buyback','full-buyback','positive-virtual','negative-virtual']
def override(case):
 def apply(vm,metas):
  if case=='mayhem':h.mutate(h.pool,243,bytes([1]))(vm,metas)
  if case in ['positive-virtual','negative-virtual']:h.mutate(h.pool,245,((10**6) if case=='positive-virtual' else (-10**6)).to_bytes(16,'little',signed=True))(vm,metas)
  if case=='holder-reward':h.mutate(h.pool,270,bytes([1]))(vm,metas)
  if case=='transfer-fee-capped':h.trade_transferfee(h.quote,123,9)(vm,metas)
  if case=='zero-creator':h.mutate(h.pool,211,bytes(32))(vm,metas)
  if case in ['zero-buyback','full-buyback','positive-virtual','negative-virtual']:h.mutate(h.CONFIG_KEY,899,(0 if case=='zero-buyback'else 10000).to_bytes(8,'little'))(vm,metas)
  if case=='existing-volume':
   raw=bytearray(137);raw[:8]=bytes(next(x for x in h.IDL['accounts']if x['name']=='UserVolumeAccumulator')['discriminator']);raw[8:40]=bytes(h.PAYER.pubkey());raw[40]=1
   raw[41:73]=struct.pack('<QQQq',123,456,789,-11);raw[73]=1
   vm.vm.set_account(h.volume,h.Account(10**9,bytes(raw),h.PROGRAM))
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for name in ['sell_v2']:
  for case in CASES:
   args=dict(name=name,amount=10**10,limit=1,overrides=override(case));x=h.trade(**args);y=h.trade(candidate=a.candidate,**args);cx,cy=direct.clean(x),direct.clean(y);diffs=[k for k in cx if cx[k]!=cy.get(k)];rows.append(dict(instruction=name,case=case,original=x,candidate=y,mismatched_fields=diffs))
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r=dict(scope=__doc__,original_sha256=sha(ROOT/'evidence/original/pump_amm/deployed.so'),candidate_sha256=sha(a.candidate),probe_sha256=sha(Path(__file__)),comparison_sha256=sha(ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'),cases=rows,case_count=len(rows),mismatch_count=sum(bool(r['mismatched_fields'])for r in rows));a.output.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:r[k]for k in ['case_count','mismatch_count']}))
 for r in rows:print(r['instruction'],r['case'],r['original']['error'],r['candidate']['error'],r['mismatched_fields'])
if __name__=='__main__':main()
