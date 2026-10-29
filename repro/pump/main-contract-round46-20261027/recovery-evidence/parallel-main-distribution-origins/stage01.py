"""Restore native distribution helper/handler physical source ownership."""
from pathlib import Path
import difflib,hashlib,json,re,shutil,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
BASE=R/'work/parallel-main-integration/round42-source/programs/pump';S=W/'source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
sys.path.insert(0,str(R/'scripts'))
from build_source_manifest import source_manifest
from pump_quote_control_function_match import sections
from pump_compare_function_bytes import body
sys.path.insert(0,str(R/'work/parallel-main-r41-log-oracle'))
from paired_receipt_reader import records
def inv(p):return {str((R/n).relative_to(p)):v for n,v in source_manifest(p,p,R).items()}
before=inv(BASE);assert len(before)==65 and not S.exists()
rx=re.compile(r'AnchorError thrown in (programs/pump/[^:]+):(\d+)\. Error Code: ([^.]+)')
observed=[];target='programs/pump/src/creator/distribute_creator_fees.rs'
for file in ['round41-captured-full.json.gz','round41-captured-additional.json.gz']:
 for _,where,row in records(R/'work/parallel-main-integration'/file):
  old=[rx.search(x).groups()for x in row['original']['logs']if rx.search(x)]
  new=[rx.search(x).groups()for x in row['candidate']['logs']if rx.search(x)]
  for a,b in zip(old,new):
   if b[0]=='programs/pump/src/distribution.rs' and (30<=int(b[1])<=39 or 66<=int(b[1])<=85):
    assert a[0]==target,(file,where,a,b)
    observed.append({'file':file,'row':where,'original':a,'candidate':b})
assert len(observed)==94,len(observed)
shutil.copytree(BASE,S)
p=S/'src/distribution.rs';text=p.read_text();begin=text.index('pub fn execute<');end=text.index('\n#[derive(Accounts)]\npub struct DistributeCreatorFeesV2',begin);handler=text[begin:end]
text=text[:begin]+'pub use native_distribution::execute;\n'+text[end:]
begin=text.index('pub(crate) fn get_distribution_amounts<');end=text.index('#[path = "creator/distribute_creator_fee_v2.rs"]',begin);helper=text[begin:end]
text=text[:begin]+'pub(crate) use native_distribution::get_distribution_amounts;\n'+text[end:]
p.write_text(text)
q=S/'src/creator/distribute_creator_fees.rs';old=q.read_text();q.write_text(old+'\nuse super::{ConfigStatus, DistributeCreatorFees};\n\n'+handler+'\n'+helper)
after=inv(S);changed={k:v for k,v in after.items()if before.get(k)!=v}
assert len(after)==65 and set(changed)=={'src/distribution.rs','src/creator/distribute_creator_fees.rs'}
assert handler in q.read_text() and helper in q.read_text() and q.read_text().startswith(old)
assert inv(BASE)==before
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed))
(W/'distribution-origin01.patch').write_text(patch)
original=R/'evidence/original/pump/deployed.so';raw=original.read_bytes();ss=sections(raw);needle=target.encode();at=raw.index(needle);addr=next(s['addr']+at-s['offset']for s in ss.values()if s['offset']<=at<s['offset']+s['size'])
inventory=json.loads((R/'work/parallel-main-integration/build-round41/normalized-inventory.json').read_text())
owners=[{'start':hex(r['start']),'bytes':r['bytes'],'raw_sha256':hashlib.sha256(body(raw,ss,r['start'],r['bytes'])).hexdigest(),'filename_sites':[hex(r['start']+v['offset'])for v in r['original_operands']if v['kind']=='elf-pointer'and v['value']==addr]}for r in inventory['windows']if any(v['kind']=='elf-pointer'and v['value']==addr for v in r['original_operands'])]
assert owners
evidence={'scope':'Native creator distribution handler/helper origins; no validation or arithmetic change','original_sha256':sha(original),'filename':target,'filename_address':hex(addr),'original_filename_owners':owners,'observed_case_count':len(observed),'observations':observed,'guard_scan':'All recorded Anchor origins inside the two moved functions use the selected original filename; contexts and other helpers stay put.','inference':'Physical module ownership is reconstructed from logs and original filename references; original Rust syntax is not known.'}
(W/'EVIDENCE01.json').write_text(json.dumps(evidence,indent=2)+'\n')
staged={'status':'source-only; unbuilt','base_source':str(BASE.relative_to(R)),'source':str(S.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'handler_preserved_verbatim':True,'helper_preserved_verbatim':True,'existing_native_module_prefix_preserved':True,'patch_sha256':sha(W/'distribution-origin01.patch'),'evidence_sha256':sha(W/'EVIDENCE01.json'),'expected_origin_fixes':94,'limits':['Requires independent review and complete R43 runtime/build qualification.','No new input or behavior fix is claimed.','All R42 inputs other than the two declared files remain unchanged.']}
(W/'STAGED01.json').write_text(json.dumps(staged,indent=2)+'\n')
(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in ['stage01.py','distribution-origin01.patch','EVIDENCE01.json','STAGED01.json']},indent=2)+'\n')
print({'staged_sha256':sha(W/'STAGED01.json'),'patch_sha256':sha(W/'distribution-origin01.patch'),'cases':len(observed),'changed':changed})
