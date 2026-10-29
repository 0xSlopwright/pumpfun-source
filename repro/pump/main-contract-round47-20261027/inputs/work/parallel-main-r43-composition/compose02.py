"""Review native distribution placement and add it to the private R43 fee source."""
from pathlib import Path
import difflib,hashlib,json,shutil,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;BASE=R/'work/parallel-main-integration/round42-source/programs/pump';OLD=W/'source01';S=W/'source02';LANE=R/'work/parallel-main-distribution-origins'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest;from pump_quote_control_function_match import sections;from pump_compare_function_bytes import body
def inv(p):return{str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
assert sha(LANE/'STAGED01.json')=='79fe7d359e3e822f5f55e45abadc1b958db1ebc631f53d2cd9d9dd2f12373ce0'
assert sha(LANE/'distribution-origin01.patch')=='54dde24278f8d48ff94753b0e574ebe53e05d159e549002a5a36137c0ac70728'
base=inv(BASE);old=inv(OLD);lane=inv(LANE/'source01');files={'src/distribution.rs','src/creator/distribute_creator_fees.rs'}
assert set(n for n,h in lane.items()if base.get(n)!=h)==files
parent=(BASE/'src/distribution.rs').read_text();child=(BASE/'src/creator/distribute_creator_fees.rs').read_text();np=(LANE/'source01/src/distribution.rs').read_text();nc=(LANE/'source01/src/creator/distribute_creator_fees.rs').read_text()
a=parent.index('pub fn execute<');b=parent.index('\n#[derive(Accounts)]\npub struct DistributeCreatorFeesV2',a);handler=parent[a:b]
temp=parent[:a]+'pub use native_distribution::execute;\n'+parent[b:];a=temp.index('pub(crate) fn get_distribution_amounts<');b=temp.index('#[path = "creator/distribute_creator_fee_v2.rs"]',a);helper=temp[a:b];expected=temp[:a]+'pub(crate) use native_distribution::get_distribution_amounts;\n'+temp[b:]
assert np==expected and nc==child+'\nuse super::{ConfigStatus, DistributeCreatorFees};\n\n'+handler+'\n'+helper
assert 'crate::distribution::execute_native_distribution' in handler
assert 'pub(crate) use native_distribution::execute_native_distribution;'in np
assert 'pub use native_distribution::DistributeCreatorFeesEvent;'in np
assert 'pub use self::v2::{execute_v2, get_token_distribution_amounts};'in np
evidence=read(LANE/'EVIDENCE01.json');assert evidence['observed_case_count']==94 and len(evidence['observations'])==94
for x in evidence['observations']:assert x['original'][0]==evidence['filename']and x['candidate'][0]=='programs/pump/src/distribution.rs'
blob=(R/'evidence/original/pump/deployed.so').read_bytes();ss=sections(blob)
for row in evidence['original_filename_owners']:
 assert hashlib.sha256(body(blob,ss,int(row['start'],16),row['bytes'])).hexdigest()==row['raw_sha256']
 for at in row['filename_sites']:
  ins=body(blob,ss,int(at,16),16);assert ins[0]==0x18 and(int.from_bytes(ins[4:8],'little')|int.from_bytes(ins[12:16],'little')<<32)==int(evidence['filename_address'],16)
assert not S.exists();shutil.copytree(OLD,S)
for n in files:assert old[n]==base[n];shutil.copyfile(LANE/'source01'/n,S/n)
after=inv(S);assert len(after)==65 and set(n for n,h in after.items()if old.get(n)!=h)==files
assert inv(BASE)==base and inv(OLD)==old
delta={n:h for n,h in after.items()if base.get(n)!=h};assert len(delta)==5
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(delta));(W/'r43-combined.patch').write_text(patch)
report={'status':'independently_reviewed_composition_unbuilt','scope':__doc__,'source':str(S.relative_to(R)),'base_R42_source':str(BASE.relative_to(R)),'source_before':base,'source_after':after,'changed':delta,'primary_input_count':65,'new_cases':0,'expected_origin_repairs':{'util_fee':96,'native_distribution':94},'review':{'native_handler_verbatim':True,'distribution_amounts_helper_verbatim':True,'previous_native_module_prefix_verbatim':True,'parent_reconstructed_exactly_from_two_reexports':True,'account_structs_event_type_and_other_facades_untouched':True,'native_transfer_call_preserved':True,'original_window_hashes_and_filename_references_checked':True,'all_prior_util_fee_changes_retained':True,'R42_quote_fee_reader_and_import_retained':True,'frozen_R42_and_source01_unchanged':True},'inputs':{str(p.relative_to(R)):sha(p)for p in[W/'REVIEW01.json',LANE/'STAGED01.json',LANE/'EVIDENCE01.json',LANE/'distribution-origin01.patch',W/'r43-combined.patch']},'limits':['Only source and original-byte review; no R43 compilation or runtime qualification.','Historical190 error-filename rows are intended repairs, not new behavioral cases.']}
(W/'REVIEW02.json').write_text(json.dumps(report,indent=2)+'\n');(W/'MANIFEST02.json').write_text(json.dumps({p.name:sha(p)for p in[W/'REVIEW02.json',W/'compose02.py',W/'r43-combined.patch']},indent=2)+'\n');print({'review02_sha256':sha(W/'REVIEW02.json'),'manifest02_sha256':sha(W/'MANIFEST02.json'),'patch_sha256':sha(W/'r43-combined.patch')})
