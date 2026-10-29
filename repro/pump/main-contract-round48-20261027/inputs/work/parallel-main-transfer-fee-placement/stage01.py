"""Move the observed quote fee reader to its original physical source module."""
from pathlib import Path
import collections,difflib,hashlib,json,re,shutil,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
BASE=R/'work/parallel-main-integration/round41-source/programs/pump';S=W/'source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
sys.path.insert(0,str(R/'scripts'))
from build_source_manifest import source_manifest
from pump_quote_control_function_match import sections
from pump_compare_function_bytes import body
sys.path.insert(0,str(R/'work/parallel-main-r41-log-oracle'))
from paired_receipt_reader import records
def inv(p):return {str((R/n).relative_to(p)):v for n,v in source_manifest(p,p,R).items()}
before=inv(BASE);assert len(before)==64 and not S.exists()
rx=re.compile(r'AnchorError thrown in (programs/pump/[^:]+):(\d+)\. Error Code: ([^.]+)')
observations=[]
for file in ['round40-captured-full.json.gz','round40-captured-additional.json.gz']:
 for _,where,row in records(R/'work/parallel-main-integration'/file):
  old=[rx.search(x).groups()for x in row['original']['logs']if rx.search(x)]
  new=[rx.search(x).groups()for x in row['candidate']['logs']if rx.search(x)]
  for a,b in zip(old,new):
   if b[0]=='programs/pump/src/trade_v3.rs' and 435<=int(b[1])<473:
    assert a[0]=='programs/pump/src/util/transfer_fee.rs' and a[2]==b[2]=='UnsupportedQuoteMint'
    observations.append({'file':file,'row':where,'original':a,'candidate':b})
assert len(observations)==53
shutil.copytree(BASE,S)
p=S/'src/trade_v3.rs';text=p.read_text();start=text.index('fn quote_fee_snapshot(');end=text.index('\npub(crate) fn quote_transfer_fee(',start)
helper=text[start:end];assert helper.count('fn ')==1
original_file=S/'src/util/transfer_fee.rs';original_text=original_file.read_text()
original_file.write_text(original_text+'\n'+helper.replace('fn quote_fee_snapshot(', 'pub(crate) fn quote_fee_snapshot(',1)+'\n')
p.write_text(text[:start]+'use crate::transfer_fee_recovered::quote_fee_snapshot;\n'+text[end:])
after=inv(S);changed={p:h for p,h in after.items()if before.get(p)!=h}
assert set(changed)=={'src/trade_v3.rs','src/util/transfer_fee.rs'} and len(after)==64
assert original_file.read_text().startswith(original_text)
assert inv(BASE)==before
patch=''.join(''.join(difflib.unified_diff((BASE/p).read_text().splitlines(True),(S/p).read_text().splitlines(True),'a/programs/pump/'+p,'b/programs/pump/'+p))for p in sorted(changed))
(W/'transfer-fee-placement.patch').write_text(patch)
raw=(R/'evidence/original/pump/deployed.so').read_bytes();ss=sections(raw);needle=b'programs/pump/src/util/transfer_fee.rs';at=raw.index(needle)
addr=next(s['addr']+at-s['offset']for s in ss.values()if s['offset']<=at<s['offset']+s['size'])
inventory=json.loads((R/'work/parallel-main-integration/build-round41/normalized-inventory.json').read_text())
owners=[{'start':hex(row['start']),'bytes':row['bytes'],'raw_sha256':hashlib.sha256(body(raw,ss,row['start'],row['bytes'])).hexdigest(),'filename_references':[hex(row['start']+op['offset'])for op in row['original_operands']if op['kind']=='elf-pointer'and op['value']==addr]}for row in inventory['windows']if any(op['kind']=='elf-pointer'and op['value']==addr for op in row['original_operands'])]
assert len(owners)==4
evidence={'scope':'Main Pump quote fee reader physical source ownership','original_sha256':sha(R/'evidence/original/pump/deployed.so'),'original_filename':needle.decode(),'original_filename_address':hex(addr),'original_filename_owners':owners,'observed_reader_anchor_cases':observations,'observed_case_count':53,'reader_candidate_line_range':[435,472],'regression_scan':'All observed Anchor origins within this helper use the selected original filename; no currently equal alternative filename was observed.','inference':'Physical source placement follows observed diagnostics. This does not establish the original Rust source or exact helper ABI.'}
(W/'EVIDENCE01.json').write_text(json.dumps(evidence,indent=2)+'\n')
staged={'status':'staged_unbuilt','base_source':str(BASE.relative_to(R)),'source':str(S.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'patch_sha256':sha(W/'transfer-fee-placement.patch'),'evidence_sha256':sha(W/'EVIDENCE01.json'),'helper_body_preserved':helper.replace('fn quote_fee_snapshot(', 'pub(crate) fn quote_fee_snapshot(',1) in original_file.read_text(),'prior_utility_prefix_preserved':True,'expected_origin_repairs':53,'limits':['Requires combined build, no prior-window losses, and full ordered log and runtime checks.','No new test input or behavior claim; all53 observations are existing retained cases.']}
(W/'STAGED01.json').write_text(json.dumps(staged,indent=2)+'\n')
(W/'MANIFEST01.json').write_text(json.dumps({p:sha(W/p)for p in ['stage01.py','transfer-fee-placement.patch','EVIDENCE01.json','STAGED01.json']},indent=2)+'\n')
print({'status':staged['status'],'changed':changed,'staged_sha256':sha(W/'STAGED01.json'),'patch_sha256':sha(W/'transfer-fee-placement.patch')})
