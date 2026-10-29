"""Compose the independently reviewed remaining guarded reload callers."""
from pathlib import Path
import difflib,hashlib,json,shutil,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
B=R/'work/parallel-main-integration/round46-source/programs/pump';S=W/'source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest
def inv(p):return{str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
lanes=[('parallel-main-v2-reload-sync','V2-RELOAD-SYNC-REVIEW01.json','de3339c7538dde0d0c0d4a73e0677dc35701e8eb7e27f2bda9344f12b64a03f8'),('parallel-main-legacy-reload-sync','LEGACY-RELOAD-SYNC-REVIEW01.json','9da622e62ec418b601ff056e976f6810bfbfe81f335cf41d28cca9f3f730b4b2')]
before=inv(B);assert len(before)==65 and not S.exists();shutil.copytree(B,S);owned=set();proof={}
for name,review,digest in lanes:
 w=R/'work'/name;r=R/'work/parallel-main-verification-resume'/review;assert sha(r)==digest
 p=w/'STAGED01.json';d=json.loads(p.read_text());source=R/d['source'];old=d.get('source_before',d.get('before'));new=d.get('source_after',d.get('after'));assert old and new
 for rel in d['changed']:
  assert rel not in owned and before[rel]==old[rel],(name,rel)
  assert sha(source/rel)==new[rel]
  (S/rel).write_bytes((source/rel).read_bytes());owned.add(rel)
 proof[str(p.relative_to(R))]=sha(p);proof[str(r.relative_to(R))]=sha(r)
after=inv(S);changed={n:h for n,h in after.items()if before.get(n)!=h};assert set(changed)==owned and len(after)==65
assert inv(B)==before
patch=''.join(''.join(difflib.unified_diff((B/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed));(W/'r47-combined.patch').write_text(patch)
out={'status':'composed source; unbuilt','source':str(S.relative_to(R)),'base_source':str(B.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'primary_input_count':65,'proof_sha256':proof,'patch_sha256':sha(W/'r47-combined.patch'),'case_additions_pending':'Positive sync fixture dedup and final CLI manifest; no invented count.','limits':['Full combination review and actual mapped build required.','Original branch and local fixture evidence are not whole-program equivalence.']};(W/'STAGED01.json').write_text(json.dumps(out,indent=2)+'\n');(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in ['compose01.py','r47-combined.patch','STAGED01.json']},indent=2)+'\n');print({'source':out['source'],'files':len(changed),'staged':sha(W/'STAGED01.json')})
