"""Signed withdraw base-minimum precedence before quote math and transfer fees."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,sys
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file());sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_liquidity_differential as h
spec=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(spec);spec.loader.exec_module(direct)
MAX=(1<<64)-1
CASES=['ordinary','valid-fee','invalid-fee-10001','invalid-fee-65535','full-forward-fee','invalid-zero-cap','quote-truncation','frozen-quote','zero-quote']
def override(case):
 def apply(vm,metas):
  if case=='valid-fee':h.transferfee(h.quote,123,1)(vm,metas)
  if case=='invalid-fee-10001':h.transferfee(h.quote,10001,MAX)(vm,metas)
  if case=='invalid-fee-65535':h.transferfee(h.quote,65535,MAX)(vm,metas)
  if case=='full-forward-fee':h.transferfee(h.quote,10000,MAX)(vm,metas)
  if case=='invalid-zero-cap':h.transferfee(h.quote,65535,0)(vm,metas)
  if case=='quote-truncation':
   h.mutate(h.pool,203,(1).to_bytes(8,'little'))(vm,metas)
   h.mutate(h.lp,36,(1).to_bytes(8,'little'))(vm,metas)
   h.mutate(h.vaultbase,64,bytes(8))(vm,metas)
   h.mutate(h.vaultquote,64,MAX.to_bytes(8,'little'))(vm,metas)
  if case=='frozen-quote':h.mutate(h.userquote,108,bytes([2]))(vm,metas)
  if case=='zero-quote':h.mutate(h.vaultquote,64,bytes(8))(vm,metas)
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for case in CASES:
  for minimum in [0,MAX]:
   args=dict(name='withdraw',amount=2 if case=='quote-truncation'else 1000,maxbase=minimum,maxquote=0,overrides=override(case));x=h.run(**args);y=h.run(candidate=a.candidate,**args);cx,cy=direct.clean(x),direct.clean(y);diffs=[k for k in cx if cx[k]!=cy.get(k)];rows.append(dict(case=case,minimum_base=minimum,original=x,candidate=y,mismatched_fields=diffs))
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r=dict(scope=__doc__,original_sha256=sha(ROOT/'evidence/original/pump_amm/deployed.so'),candidate_sha256=sha(a.candidate),probe_sha256=sha(Path(__file__)),comparison_sha256=sha(ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'),cases=rows,case_count=len(rows),mismatch_count=sum(bool(x['mismatched_fields'])for x in rows));a.output.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:r[k]for k in ['case_count','mismatch_count']}))
 for r in rows:print(r['case'],r['minimum_base'],r['original']['error'],r['candidate']['error'],r['mismatched_fields'])
if __name__=='__main__':main()
