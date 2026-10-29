"""Signed focused sell arithmetic/error precedence probes on synthetic local state."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,sys
ROOT=Path(__file__).resolve().parents[3];sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_trade_v2_differential as h
spec=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(spec);spec.loader.exec_module(direct)
MAX=(1<<64)-1

def override(case):
 def apply(vm,metas):
  if case.startswith('boost'):
   h.mutate(h.pool,245,(10**15).to_bytes(16,'little',signed=True))(vm,metas)
   h.mutate(h.vaultquote,64,(100).to_bytes(8,'little'))(vm,metas)
   h.mutate(h.pool,271,bytes(16))(vm,metas)
   if 'creator-underflow' in case: h.custom_fee_table([(0,(0,0,20000))])(vm,metas)
   if 'lp-underflow' in case: h.custom_fee_table([(0,(20000,0,0))])(vm,metas)
  elif case.startswith('lp-underflow'):
   h.custom_fee_table([(0,(20000,5,10))])(vm,metas)
  elif case.startswith('creator-underflow'):
   h.custom_fee_table([(0,(0,0,20000))])(vm,metas)
  elif case.startswith('protocol-underflow'):
   h.custom_fee_table([(0,(0,20000,0))])(vm,metas)
  if case.endswith('invalid-tf'):
   h.trade_transferfee(h.quote,65535,MAX)(vm,metas)
  elif case.endswith('bad-tlv'):
   h.trade_transferfee(h.quote,100,MAX)(vm,metas)
   h.mutate(h.quote,165,bytes([2]))(vm,metas)
  elif case.endswith('frozen-source'):
   h.mutate(h.userbase,108,bytes([2]))(vm,metas)
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists()
 cases=['normal','boost','boost-invalid-tf','boost-frozen-source','boost-lp-underflow','boost-creator-underflow','lp-underflow','creator-underflow']
 rows=[]
 for case in cases:
  args=dict(name='sell_v2',amount=10**10,limit=1,overrides=override(case))
  x=h.trade(**args);y=h.trade(candidate=a.candidate,**args)
  cx,cy=direct.clean(x),direct.clean(y);diffs=[k for k in cx if cx[k]!=cy.get(k)]
  rows.append(dict(case=case,original=x,candidate=y,mismatched_fields=diffs))
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
 r=dict(scope=__doc__,original_sha256=sha(ROOT/'evidence/original/pump_amm/deployed.so'),candidate_sha256=sha(a.candidate),probe_sha256=sha(Path(__file__)),comparison_sha256=sha(ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'),cases=rows,case_count=len(rows),mismatch_count=sum(bool(r['mismatched_fields']) for r in rows))
 a.output.write_text(json.dumps(r,separators=(',',':'))+'\n')
 print(json.dumps({k:r[k]for k in ['case_count','mismatch_count']}))
 for r in rows:print(r['case'],r['original']['error'],r['candidate']['error'],r['mismatched_fields'])
if __name__=='__main__':main()
