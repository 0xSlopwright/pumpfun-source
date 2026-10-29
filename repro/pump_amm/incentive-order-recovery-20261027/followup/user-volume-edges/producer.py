"""Named synthetic claim crossproducts justified by original 0x6d408 and claim CPI order."""
from pathlib import Path
import argparse,hashlib,json,types
import admin_fixture as h
R=Path(__file__).resolve().parents[2]
p=R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'
cleaner=types.ModuleType('clean');cleaner.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),cleaner.__dict__)
def cases():
 m=2**64-1
 base={'instruction':'claim_token_incentives','now':21,'last':20,'start':20,'end':49,'period':1,'needs':0,'has_claimed':0,'unclaimed':0,'claimed':0,'volume':m,'supplies':[m]*30,'volumes':[m]*30,'vault_amount':m,'user_amount':0}
 variants=[
 ('max_reward_success',{}),
 ('claimed_overflow_after_transfer',{'claimed':1}),
 ('unclaimed_overflow_before_transfer',{'unclaimed':1}),
 ('reward_truncation_precedes_unclaimed_overflow',{'supplies':[2]*30,'volumes':[1]*30,'unclaimed':m}),
 ('zero_denominator_skips_truncation',{'supplies':[2]*30,'volumes':[0]*30,'unclaimed':m}),
 ('zero_supply_resets_volume',{'supplies':[0]*30,'unclaimed':m}),
 ('zero_volume_skips_reward',{'volume':0,'unclaimed':m}),
 ('destination_overflow_precedes_claimed_overflow',{'user_amount':1,'claimed':1}),
 ('period_zero_skips_negative_last',{'period':0,'last':-1,'unclaimed':m}),
 ('negative_period_panics_before_last',{'period':-1,'last':-1,'unclaimed':m}),
 ('before_start_skips_negative_period_and_resets_claimed',{'now':19,'period':-1,'last':-1,'unclaimed':m,'claimed':m}),
 ('last_before_start_skips_negative_end_conversion',{'last':19,'end':-1,'unclaimed':m}),
 ('after_end_pending_last_reward',{'now':50,'last':49}),
 ('after_end_skips_out_of_bounds_previous',{'now':51,'last':50,'unclaimed':m}),
 ('current_day_bounds_before_zero_claim',{'now':50,'end':50,'supplies':[0]*30}),
 ('zero_claim_does_not_add_to_max_claimed',{'claimed':m,'volume':0}),
 ]
 return [{'name':name,'input':{**base,**d}} for name,d in variants]
def run(candidate,output):
 rows=[]
 for c in cases():
  a=h.run(c['input']);b=h.run(c['input'],candidate);x,y=cleaner.clean(a),cleaner.clean(b);bad=sorted(k for k in set(x)|set(y)if x.get(k)!=y.get(k));rows.append({**c,'original':a,'candidate':b,'different_fields':bad})
  print(json.dumps({'name':c['name'],'different_fields':bad,'original_error':a['error'],'candidate_error':b['error']}),flush=True)
 sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
 out={'candidate_sha256':sha(candidate),'original_sha256':sha(h.ORIGINAL),'producer_sha256':sha(__file__),'fixture_sha256':sha(Path(__file__).with_name('admin_fixture.py')),'case_count':len(rows),'mismatch_count':sum(bool(r['different_fields'])for r in rows),'original_successes':sum(r['original']['error']is None for r in rows),'scope':__doc__,'cases':rows}
 output.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in out.items()if k!='cases'}))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();run(a.candidate.resolve(),a.output.resolve())
