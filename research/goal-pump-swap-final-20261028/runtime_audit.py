"""Verify bounded runtime observations and real signed wires, without source normalization."""
from pathlib import Path
import argparse,base64,collections,hashlib,json,re
from solders.transaction import Transaction
CU=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed \d+ of \d+ compute units$')
def audit(directory):
 d=json.loads((directory/'observations.json').read_text())
 execution=json.loads((directory/'execution.json').read_text())
 loader=json.loads((directory/'loader.json').read_text())
 root=Path(__file__).resolve().parents[2]
 for name,digest in execution['input_sha256'].items():
  assert hashlib.sha256((root/name).read_bytes()).hexdigest()==digest,name
 assert execution['returncode']==0 and execution['candidate_sha256']==d['candidate_sha256']
 assert d['case_count']==len(d['cases']) and not d['mismatches']
 signatures=0;program_diffs=[];full_log_diffs=[];field_diffs=[];wire_diffs=[];outcomes=collections.Counter()
 for i,row in enumerate(d['cases']):
  a,b=row['original'],row['candidate']
  for side in (a,b):
   tx=Transaction.from_bytes(base64.b64decode(side['transaction_base64']));tx.verify()
   assert side['signatures_verified'] is True
   signatures+=len(tx.signatures);outcomes['success'if side['error']is None else'failure']+=1
  if a['transaction_base64']!=b['transaction_base64']:wire_diffs.append(i)
  diff=[k for k in ('error','accounts','events','inner','return_data')if a[k]!=b[k]]
  if diff:field_diffs.append({'index':i,'fields':diff})
  messages=lambda v:[s for s in v['logs']if s.startswith(('Program log: ','Program data: '))]
  if messages(a)!=messages(b):program_diffs.append(i)
  logs=lambda v:[s for s in v['logs']if not CU.fullmatch(s)]
  if logs(a)!=logs(b):full_log_diffs.append(i)
 counts=collections.Counter(r['elf_sha256']for r in loader['loads'])
 assert counts[d['candidate_sha256']]==len(d['cases'])
 assert counts[d['original_sha256']]==len(d['cases'])+1
 assert all(x['elf_prefix_unchanged']and x['zero_allocation_tail']and x['program_bytes']==36 and x['programdata_bytes']==10485760 for x in loader['loads'])
 result={'scope':__doc__,'case_pairs':len(d['cases']),'signed_outcomes':2*len(d['cases']),'signature_fields_verified':signatures,'outcomes':dict(outcomes),'candidate_sha256':d['candidate_sha256'],'structured_difference_cases':field_diffs,'strict_ordered_program_message_difference_cases':program_diffs,'ordered_log_differences_excluding_only_compute_unit_usage':full_log_diffs,'different_signed_wire_pairs':wire_diffs,'captured_loader_loads':len(loader['loads']),'loader_prefix_and_allocation_checked':True,'source_coordinate_normalization':None,'whole_window_match_claimed':False,'audit_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
 (directory/'audit.json').write_text(json.dumps(result,indent=2)+'\n')
 print(json.dumps(result,indent=2))
 assert not field_diffs and not program_diffs and not full_log_diffs
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('directory',type=Path);audit(p.parse_args().directory)
