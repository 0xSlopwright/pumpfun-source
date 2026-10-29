"""Signed finite negative-time incentive index domain comparison."""
from pathlib import Path
import argparse,hashlib,itertools,json
from admin_fixture import run,ORIGINAL

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();rows=[]
 for bounds,now,day in itertools.product([(-1,-1),(-3,-1),(-1,1),(0,0)],[-3,-2,-1,0],[0,30]):
  case={'instruction':'admin_update_token_incentives','new_start':0,'new_end':0,'new_period':1,'start':bounds[0],'end':bounds[1],'now':now,'day':day,'supply':1000}
  left,right=run(case),run(case,a.candidate)
  diff=[k for k in left if k!='logs'and left[k]!=right[k]]
  rows.append({'input':case,'original':left,'candidate':right,'diff':diff})
 sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
 result={'scope':__doc__,'original_sha256':sha(ORIGINAL),'candidate_sha256':sha(a.candidate),'script_sha256':sha(__file__),'case_count':len(rows),'mismatches':[i for i,row in enumerate(rows)if row['diff']],'cases':rows}
 a.output.write_text(json.dumps(result,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in result.items()if k!='cases'}))
if __name__=='__main__':main()
