"""Strict regression of fee-recipient guard order and actual Anchor source names."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,re
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('fee_guard_fixture',W/'probe_order.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
def logs(row):return[re.sub(r'(programs/pump/[^ :\s]+):\d+(?::\d+)?',r'\1:<source>',x)for x in row['logs']if not re.fullmatch(r'Program \S+ consumed \d+ of \d+ compute units',x)]
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--only-new',action='store_true');a=p.parse_args();rows=[]
 for c in h.cases():
  if a.only_new and c['name']!='zero-with-earlier-underfunded':continue
  o=h.run(c);n=h.run(c,a.candidate);assert o['full_before']==n['full_before']and o['transaction_base64']==n['transaction_base64']and o['clock']==n['clock']
  different=[k for k in['error','before','after','events','inner','returns']if o[k]!=n[k]]
  if logs(o)!=logs(n):different.append('ordered_logs_with_filename')
  rows.append({'case':c,'original':o,'candidate':n,'different_fields':different})
 out={'scope':__doc__,'case_count':len(rows),'mismatches':[i for i,r in enumerate(rows)if r['different_fields']],'cases':rows,'fixture_sha256':hashlib.sha256((W/'probe_order.py').read_bytes()).hexdigest()};a.output.write_bytes(gzip.compress(json.dumps(out,separators=(',',':')).encode(),mtime=0));print({'case_count':len(rows),'mismatches':out['mismatches']});assert not out['mismatches']
if __name__=='__main__':main()
