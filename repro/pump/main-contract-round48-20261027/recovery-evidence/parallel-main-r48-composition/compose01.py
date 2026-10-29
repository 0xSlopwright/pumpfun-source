"""Compose independently reviewed quote-order and arithmetic recovery sources."""
from pathlib import Path
import difflib, hashlib, json, shutil, subprocess, sys
R=Path(__file__).resolve().parents[2]; W=Path(__file__).resolve().parent
B=R/'work/parallel-main-integration/round47-source/programs/pump'; S=W/'source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
sys.path.insert(0,str(R/'scripts')); from build_source_manifest import source_manifest
def inv(p): return {str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
lanes=[
 ('parallel-main-v3-quote-preflight','quote-preflight01.patch','e23b55c7447917144c314afd9bf14db87f6ab77a255edfd69ee9d47aad029b08','V3-QUOTE-PREFLIGHT-REVIEW01.json','ecf2bc5f9ae45fd225854cdab2461a66810bcfa8c7e3a31f43d006be4a81ebbf'),
 ('parallel-main-sub-origin-recovery','bounded-arithmetic01.patch','8126f3d777d7cb1b0b5ea6f2abef36261a19cd30d535a577a14353ff91716d89','SUB-ORIGINS-REVIEW01.json','b48e724567c3fffe640a969b565ec22a314c554adfd5871210d9cf0fef455e3c'),
]
before=inv(B); assert len(before)==65 and not S.exists(); shutil.copytree(B,S)
proof={}; owned=set()
for name,patch,stagehash,review,reviewhash in lanes:
 w=R/'work'/name; p=w/'STAGED01.json'; d=json.loads(p.read_text())
 v=R/'work/parallel-main-verification-resume'/review
 assert sha(p)==stagehash and sha(v)==reviewhash
 assert d['source_before']==before and sha(w/patch)==d['patch_sha256']
 assert inv(R/d['source'])==d['source_after']
 subprocess.run(['patch','--batch','--fuzz=0','-p3','-i',str(w/patch)],cwd=S,check=True)
 owned.update(d['changed']); proof.update({str(p.relative_to(R)):sha(p),str(v.relative_to(R)):sha(v),str((w/patch).relative_to(R)):sha(w/patch)})
after=inv(S); changed={n:h for n,h in after.items() if before.get(n)!=h}
assert len(after)==65 and set(changed)==owned and inv(B)==before
assert not list(S.rglob('*.rej'))
# Verify each source proposal can be independently reversed from the composition.
for name,patch,stagehash,review,reviewhash in lanes:
 other=next(x for x in lanes if x[0]!=name)
 temp=W/('reverse-'+name); shutil.copytree(S,temp)
 subprocess.run(['patch','--batch','--fuzz=0','-R','-p3','-i',str(R/'work'/name/patch)],cwd=temp,check=True)
 assert inv(temp)==json.loads((R/'work'/other[0]/'STAGED01.json').read_text())['source_after']
patch=''.join(''.join(difflib.unified_diff((B/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n)) for n in sorted(changed))
(W/'r48-combined.patch').write_text(patch)
out={'status':'composed source; unbuilt','source':str(S.relative_to(R)),'base_source':str(B.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'primary_input_count':65,'proof_sha256':proof,'patch_sha256':sha(W/'r48-combined.patch'),'case_additions_pending':'Four baseline controls require exact dedup; no invented new-case count.','limits':['Independent composition review and actual mapped build required.','Normal-account order mismatch is confirmed on the original and R47, not yet tested on this source.','Whole ELF identity remains unproved.']}
(W/'STAGED01.json').write_text(json.dumps(out,indent=2)+'\n')
(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n) for n in ['compose01.py','r48-combined.patch','STAGED01.json']},indent=2)+'\n')
print({'source':out['source'],'files':len(changed),'staged_sha256':sha(W/'STAGED01.json')})
