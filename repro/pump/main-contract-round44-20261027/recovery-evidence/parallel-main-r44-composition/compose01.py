"""Compose disjoint route-budget and legacy-collection source repairs on frozen R43."""
from pathlib import Path
import difflib,hashlib,json,shutil,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;BASE=R/'work/parallel-main-integration/round43-source/programs/pump';S=W/'source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest
def inv(p):return{str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
base=inv(BASE);assert len(base)==65 and not S.exists();shutil.copytree(BASE,S)
lanes={
 'route_budget':('parallel-main-route-budget-placement',['src/trade_v3.rs','src/multi_hop_curve_swap.rs'],'e9bcd1e4546658c6df85f5e7e4e6816bf42c99d82b14a96837c99f610c44fa73'),
 'legacy_collection':('parallel-main-legacy-collection-origin',['src/lib.rs','src/creator/collect_creator_fee.rs'],'37012dec7ac3308d817cb472dfb66835ef21eb993d3d28e0b25582d1d5a3f60c'),
}
proofs={};provenance={};touched=set()
for lane,(folder,names,expected_sha)in lanes.items():
 root=R/'work'/folder;stage=root/'STAGED01.json';assert sha(stage)==expected_sha;source=root/'source01';mapping=inv(source)
 assert set(n for n,h in mapping.items()if base.get(n)!=h)==set(names)
 proofs[lane]={'path':str(stage.relative_to(R)),'sha256':sha(stage)}
 for name in names:
  assert name not in touched;touched.add(name);shutil.copyfile(source/name,S/name);provenance[name]={'path':str((source/name).relative_to(R)),'sha256':sha(source/name),'lane':lane}
after=inv(S);changed={n:h for n,h in after.items()if base.get(n)!=h};assert len(after)==65 and set(changed)==touched and len(touched)==4
assert inv(BASE)==base
for n,h in after.items():
 if n not in touched:assert h==base[n]
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed));(W/'r44-combined.patch').write_text(patch)
report={'status':'composed_awaiting_independent_review','source':str(S.relative_to(R)),'base_source':str(BASE.relative_to(R)),'source_before':base,'source_after':after,'changed':changed,'primary_input_count':65,'new_cases':0,'expected_origin_repairs':{'route_budget':96,'legacy_collection':8},'explicitly_unresolved_route_origin_rows':43,'source_provenance':provenance,'lane_proofs':proofs,'disjoint_changes':True,'R43_source_unchanged':True,'patch_sha256':sha(W/'r44-combined.patch'),'limits':['No R44 build or runtime has run.','Expect104 historical filename repairs; these are not additional corpus inputs.','All817 normalized and165 identity raw matches still require build verification.']}
(W/'STAGED01.json').write_text(json.dumps(report,indent=2)+'\n');(W/'MANIFEST01.json').write_text(json.dumps({p.name:sha(p)for p in[W/'compose01.py',W/'STAGED01.json',W/'r44-combined.patch']},indent=2)+'\n');print({'stage_sha256':sha(W/'STAGED01.json'),'manifest_sha256':sha(W/'MANIFEST01.json'),'patch_sha256':sha(W/'r44-combined.patch')})
