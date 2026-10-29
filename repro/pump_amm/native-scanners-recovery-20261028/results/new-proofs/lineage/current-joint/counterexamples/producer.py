"""Synthetic signed negative/extreme i64 incentive cross-domain controls."""
from pathlib import Path
import argparse,hashlib,itertools,json,types
import admin_fixture as h
R=Path(__file__).resolve().parents[2]
p=R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';cleaner=types.ModuleType('clean');cleaner.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),cleaner.__dict__)
def cases():
 rows=[]
 for start,end,period,now,day in itertools.product([-2**63,-1,0,1,20,2**63-1],[-2**63,-1,0,1,49,2**63-1],[-1,0,1,2**63-1],[-1,0,1,2**63-1],[0,30]):
  rows.append({'instruction':'admin_update_token_incentives','start':start,'end':end,'period':period,'new_start':0,'new_end':0,'new_period':period,'now':now,'day':day,'supply':1})
 for start,end,period,now,supply in itertools.product([-2**63,-1,0,1,20,2**63-1],[0,1,49,2**63-1],[-1,0,1,2**63-1],[-1,0,1],[0,1]):
  rows.append({'instruction':'admin_update_token_incentives','start':20,'end':49,'period':1,'new_start':start,'new_end':end,'new_period':period,'now':now,'day':30,'supply':supply})
 for field in ['unsigned','readonly']:
  rows.append({'instruction':'admin_update_token_incentives',field:'admin'})
 return rows

def run(candidate,output):
 rows=[]
 for c in cases():
  a=h.run(c);b=h.run(c,candidate);x,y=cleaner.clean(a),cleaner.clean(b);bad=[k for k in set(x)|set(y)if x.get(k)!=y.get(k)];rows.append({'input':c,'original':a,'candidate':b,'different_fields':bad})
  if bad:print(json.dumps({'input':c,'different_fields':bad,'original_error':a['error'],'candidate_error':b['error']}),flush=True)
 sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest();out={'candidate_sha256':sha(candidate),'original_sha256':sha(h.ORIGINAL),'producer_sha256':sha(__file__),'fixture_sha256':sha(Path(__file__).with_name('admin_fixture.py')),'case_count':len(rows),'mismatch_count':sum(bool(r['different_fields'])for r in rows),'original_successes':sum(r['original']['error']is None for r in rows),'scope':__doc__,'cases':rows};output.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in out.items()if k!='cases'}))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();run(a.candidate.resolve(),a.output.resolve())
