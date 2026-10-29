"""Verify actual callers and shared operation users against the bound control."""
from pathlib import Path
import hashlib,json,runpy,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
from pump_compare_function_bytes import normalize,body
from pump_quote_control_function_match import sections
verify=runpy.run_path(str(ROOT/'research/claude-pump-integration-20261027/r37-layout-33/verify.py'))
OUT=Path(__file__).resolve().parent
class Elf:
 def __init__(self,p):
  self.b=p.read_bytes();self.ss=sections(self.b);self.fs=verify['elf_functions'](self.b);self.by={n:(a,l) for a,l,n in self.fs}
 def function(self,n):
  a,l=self.by[n];return normalize(body(self.b,self.ss,a,l),a,self.ss)
c=Elf(OUT/'unstripped.so');o=Elf(OUT/'control/unstripped.so')
cost_name=next(n for n in c.by if '12v3_buy_costs17' in n);target=c.by[cost_name][0]
rows=[]
for a,l,n in c.fs:
 calls=[x for x in c.function(n)[1] if x['kind']=='direct-call' and x['target']==target]
 if not calls and '11accrue_fees17' not in n and '18split_protocol_fee17' not in n:continue
 same=n in o.by and c.function(n)[0]==o.function(n)[0]
 rows.append({'symbol':n,'start':hex(a),'bytes':l,'costs_call_offsets':[hex(x['offset']) for x in calls],'official_normalized_body_equal_control':same})
assert sum(len(r['costs_call_offsets']) for r in rows)==7
assert all(r['official_normalized_body_equal_control'] for r in rows)
assert any('17fit_post_complete17' in r['symbol'] for r in rows)
assert any('11accrue_fees17' in r['symbol'] for r in rows)
assert any('18split_protocol_fee17' in r['symbol'] for r in rows)
result={'scope':__doc__,'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'control_sha256':hashlib.sha256(o.b).hexdigest(),'costs_official_normalized_body_equal_control':c.function(cost_name)[0]==o.function(cost_name)[0],'actual_costs_call_count':7,'actual_callers_and_shared_users':rows}
(Path(sys.argv[1]) if len(sys.argv)>1 else OUT/'caller-audit.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
