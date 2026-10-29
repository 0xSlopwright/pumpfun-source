"""Signed negative audit of burn failures, zero burns and post-burn virtual arithmetic."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,sys
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file());sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_liquidity_differential as h
spec=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(spec);spec.loader.exec_module(direct)
MAX=(1<<64)-1
CASES=[('ordinary',0,1000),('positive',10**9,1000),('negative',-1,1000),('product-overflow',(1<<127)-1,1000),('narrowing-overflow',1<<120,1000),('predicate-overflow',(1<<127)-1,1000),('burn-frozen-negative',-1,1000),('burn-empty-negative',-1,1000),('base-frozen-negative',-1,1000),('quote-frozen-negative',-1,1000),('zero-burn-negative',-1,0),('zero-burn-positive',10**9,0),('fee-failure-burn-frozen',-1,1000),('burn-frozen-product-overflow',(1<<127)-1,1000),('base-frozen-product-overflow',(1<<127)-1,1000),('quote-frozen-product-overflow',(1<<127)-1,1000),('full-burn',10**9,h.supply),('full-burn-negative',-1,h.supply)]
def override(case):
 def apply(vm,metas):
  if case=='predicate-overflow':h.mutate(h.pool,271,(1).to_bytes(8,'little'))(vm,metas)
  if case.startswith('burn-frozen') or case=='fee-failure-burn-frozen':h.mutate(h.userlp,108,bytes([2]))(vm,metas)
  if case.startswith('base-frozen'):h.mutate(h.userbase,108,bytes([2]))(vm,metas)
  if case.startswith('quote-frozen'):h.mutate(h.userquote,108,bytes([2]))(vm,metas)
  if case=='burn-empty-negative':h.mutate(h.userlp,64,bytes(8))(vm,metas)
  if case.startswith('full-burn'):h.mutate(h.userlp,64,h.supply.to_bytes(8,'little'))(vm,metas)
  if case=='fee-failure-burn-frozen':h.transferfee(h.quote,65535,MAX)(vm,metas)
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for name,virtual,amount in CASES:
  args=dict(name='withdraw',amount=amount,virtual=virtual,maxbase=0,maxquote=0,overrides=override(name));x=h.run(**args);y=h.run(candidate=a.candidate,**args);cx,cy=direct.clean(x),direct.clean(y);diffs=[k for k in cx if cx[k]!=cy.get(k)];rows.append(dict(case=name,virtual=virtual,amount=amount,original=x,candidate=y,mismatched_fields=diffs))
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r=dict(scope=__doc__,original_sha256=sha(ROOT/'evidence/original/pump_amm/deployed.so'),candidate_sha256=sha(a.candidate),probe_sha256=sha(Path(__file__)),comparison_sha256=sha(ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'),cases=rows,case_count=len(rows),mismatch_count=sum(bool(x['mismatched_fields'])for x in rows));a.output.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:r[k]for k in ['case_count','mismatch_count']}))
 for r in rows:print(r['case'],r['original']['error'],r['candidate']['error'],r['mismatched_fields'])
if __name__=='__main__':main()
