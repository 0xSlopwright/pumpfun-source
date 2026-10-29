"""Compose three disjoint main-Pump R42 reconstructions on frozen R41."""
from pathlib import Path
import difflib,hashlib,json,shutil,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;S=W/'source01';BASE=R/'work/parallel-main-integration/round41-source/programs/pump'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest
def inv(p):return{str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
baseline=inv(BASE);assert len(baseline)==64 and not S.exists();shutil.copytree(BASE,S)
lanes={
 'fee_recipient':('parallel-main-fee-recipient-prefix',['src/lib.rs','src/fee_recipient.rs']),
 'pump_quote':('parallel-main-pump-quote-placement',['src/create_v2.rs','src/pump_quote.rs']),
 'transfer_fee':('parallel-main-transfer-fee-placement',['src/trade_v3.rs','src/util/transfer_fee.rs']),
}
provenance={n:{'kind':'R41 exact copy','path':str((BASE/n).relative_to(R)),'sha256':h}for n,h in baseline.items()};proofs={};selected=set()
for lane,(folder,files)in lanes.items():
 stage=R/'work'/folder/'STAGED01.json';proofs[lane]={'path':str(stage.relative_to(R)),'sha256':sha(stage)};src=R/'work'/folder/'source01';mapping=inv(src)
 for n in files:
  assert n not in selected;selected.add(n);assert mapping[n]!=baseline.get(n)
  dest=S/n;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src/n,dest);provenance[n]={'kind':'qualified lane copy','lane':lane,'path':str((src/n).relative_to(R)),'sha256':sha(dest)}
 for n,h in baseline.items():
  if n not in files:assert mapping[n]==h,(lane,n)
after=inv(S);changed={n:h for n,h in after.items()if baseline.get(n)!=h};assert set(changed)==selected and len(after)==65
assert inv(BASE)==baseline
for n,h in after.items():assert provenance[n]['sha256']==h
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True)if(BASE/n).exists()else[],(S/n).read_text().splitlines(True),'a/programs/pump/'+n if(BASE/n).exists()else'/dev/null','b/programs/pump/'+n))for n in sorted(changed));(W/'r42-combined.patch').write_text(patch)
for n in ['Cargo.toml','Cargo.lock','src/token_incentives/claim_token_incentives.rs','src/volume_sync.rs','src/set_reserved_fee_recipients.rs','src/creator/set_creator.rs','src/creator/set_metaplex_creator.rs','src/trade_types.rs']:
 assert baseline[n]==after[n],n
cli=R/'work/parallel-main-fee-recipient-prefix/CLI-MANIFEST02.json';report={'status':'staged_awaiting_independent_review','source':str(S.relative_to(R)),'base':str(BASE.relative_to(R)),'primary_input_count':65,'source_sha256':after,'changed_from_R41':changed,'new_inputs':sorted(set(after)-set(baseline)),'removed_inputs':sorted(set(baseline)-set(after)),'file_provenance':provenance,'disjoint_changes':True,'conflicts':[],'lane_proofs':proofs,'patch_sha256':sha(W/'r42-combined.patch'),'new_case_count':1,'new_case_manifest':{'path':str(cli.relative_to(R)),'sha256':sha(cli)},'R41_source_unchanged':True,'limits':['No combined compilation or runtime validation yet.','One new mixed zero/rent input; old source-filename cases add no new count.','Whole binary byte identity remains unproved.']};(W/'STAGED01.json').write_text(json.dumps(report,indent=2)+'\n');(W/'MANIFEST01.json').write_text(json.dumps({p.name:sha(p)for p in[W/'compose01.py',W/'STAGED01.json',W/'r42-combined.patch']},indent=2)+'\n');print({'inputs':len(after),'changed':sorted(changed),'stage_sha256':sha(W/'STAGED01.json'),'manifest_sha256':sha(W/'MANIFEST01.json'),'patch_sha256':report['patch_sha256']})
