"""Audit the full R43 report for all three repaired source-origin cohorts."""
from pathlib import Path
from collections import Counter
import argparse,hashlib,importlib.util,json,re,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sys.path.insert(0,str(R/'work/parallel-main-r41-log-oracle'));from paired_receipt_reader import records
spec=importlib.util.spec_from_file_location('ordinary_oracle',R/'work/parallel-main-r41-log-oracle/audit.py');oracle=importlib.util.module_from_spec(spec);spec.loader.exec_module(oracle)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
rx=re.compile(r'AnchorError thrown in (programs/pump/[^ :\s]+):\d+(?::\d+)?\. Error Code: ([^.]+)\.')
def anchor(lines):return[m.groups()for line in lines if(m:=rx.search(line))]
def group(file):return'additional'if'additional'in file else'full'
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--full',type=Path,required=True);ap.add_argument('--additional',type=Path,required=True);ap.add_argument('--output',type=Path,required=True);a=ap.parse_args()
 fee=read(R/'work/parallel-main-fee-recipient-prefix/ORIGINAL-ORDER01.json')['original_origin_rows'];quote=read(R/'work/parallel-main-pump-quote-placement/ORIGIN-COHORTS.json');transfer=read(R/'work/parallel-main-transfer-fee-placement/EVIDENCE01.json')['observed_reader_anchor_cases']
 targets={}
 def add(g,row,kind,wanted):
  key=(g,row);assert key not in targets;targets[key]={'kind':kind,'wanted':wanted}
 for x in fee:add(group(x['file']),x['row'],'fee_recipient','programs/pump/src/fee_recipient.rs')
 for x in quote['desired_filename_fixes']:add(group(x['file']),x['row'],'pump_quote','programs/pump/src/pump_quote.rs')
 for x in quote['protected_already_correct']:add(x['group'],x['row'],'retained_create_v2','programs/pump/src/create_v2.rs')
 for x in transfer:add(group(x['file']),x['row'],'transfer_fee','programs/pump/src/util/transfer_fee.rs')
 for x in read(R/'work/parallel-main-util-fee-origins/ORIGIN-COHORTS.json')['target']:add(x['group'],x['row'],'util_fee','programs/pump/src/util/fee.rs')
 for x in read(R/'work/parallel-main-distribution-origins/EVIDENCE01.json')['observations']:add(group(x['file']),x['row'],'native_distribution','programs/pump/src/creator/distribute_creator_fees.rs')
 assert Counter(x['kind']for x in targets.values())==Counter(fee_recipient=14,pump_quote=92,retained_create_v2=25,transfer_fee=53,util_fee=96,native_distribution=94)
 seen={};new=[];counts=Counter();all_families=Counter()
 for path,g,expected in[(a.full,'full',10468),(a.additional,'additional',7643)]:
  total=0
  for _,where,row in records(path):
   total+=1;o,c=row['original'],row['candidate'];l=oracle.scope(oracle.norm(o['logs']));r=oracle.scope(oracle.norm(c['logs']))
   if l!=r:
    kind='main_invocation_disagreement'if l is None or r is None else oracle.classify(l,r)[0];all_families[kind]+=1
   key=(g,where)
   if key in targets:
    wanted=targets[key];left,right=anchor(o['logs']),anchor(c['logs']);present=any(x[0]==wanted['wanted']for x in left)
    seen[key]={'group':g,'row':where,**wanted,'original':left,'candidate':right,'correct_original_cohort':present,'filename_sequence_equal':left==right,'ordered_logs_equal':l is not None and l==r}
    counts[wanted['kind']]+=1
   if isinstance(row.get('case'),dict)and row['case'].get('name')=='zero-with-earlier-underfunded':
    new.append({'group':g,'row':where,'original_error':o['error'],'candidate_error':c['error'],'same_error':o['error']==c['error'],'same_prestate':isinstance(o.get('full_before'),dict) and o['full_before']==c.get('full_before'),'same_signed_transaction':o['transaction_base64']==c['transaction_base64'],'ordered_logs_equal':l is not None and l==r})
  assert total==expected,(g,total,expected)
 failures=[x for x in seen.values()if not all(x[k]for k in['correct_original_cohort','filename_sequence_equal','ordered_logs_equal'])]
 missing=[{'group':g,'row':row}for g,row in targets if(g,row)not in seen]
 accepted=not failures and not missing and len(new)==1 and all(new[0][k]for k in['same_error','same_prestate','same_signed_transaction','ordered_logs_equal'])and'6028'in new[0]['original_error']
 report={'status':'passed'if accepted else'failed','scope':__doc__,'scanned_cases':18111,'cohort_counts':dict(counts),'cohort_rows':list(seen.values()),'cohort_failures':failures,'missing_cohort_rows':missing,'new_guard_witness':new,'all_report_log_difference_families':dict(all_families),'normalization':'Only compute-unit lines and numeric source coordinates removed; actual file names, order, business messages and nested Pump calls retained.','inputs':{str(p.resolve().relative_to(R)):sha(p)for p in[a.full,a.additional,Path(__file__),R/'work/parallel-main-r41-log-oracle/audit.py']}}
 a.output.write_text(json.dumps(report,indent=2)+'\n');print({k:report[k]for k in['status','scanned_cases','cohort_counts','all_report_log_difference_families']});assert accepted
if __name__=='__main__':main()
