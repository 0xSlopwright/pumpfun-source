"""Port archived main-Pump pool-construction helpers without changing the ABI."""
from pathlib import Path
import difflib,hashlib,json,re,shutil,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
BASE=R/'work/parallel-main-integration/round44-source-retry/programs/pump';S=W/'source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest
def inv(p):return{str((R/n).relative_to(p)):v for n,v in source_manifest(p,p,R).items()}
up=R/'work/parallel-main-integration/pr410-pump-review/migration-pool-source.patch'
assert sha(up)=='40b6ad2c063386fee374ed311c071b94ffb53ea0071476be7116cac4ce1e0037'
before=inv(BASE);assert len(before)==65 and not S.exists();shutil.copytree(BASE,S)
chunks=up.read_text().split('--- a/')[1:]
for chunk in chunks:
 name=chunk.splitlines()[0];assert name in ['src/migrate.rs','src/migrate_v2.rs']
 p=S/name;t=p.read_text();original=t
 hunks=re.split(r'^@@[^\n]*\n',chunk,flags=re.M)[1:];assert len(hunks)==2
 old=''.join(line[1:]for line in hunks[0].splitlines(True)if line.startswith('-')and not line.startswith('---'))
 new=''.join(line[1:]for line in hunks[0].splitlines(True)if line.startswith('+')and not line.startswith('+++'))
 assert t.count(old)==1,(name,'old lines differ');t=t.replace(old,new,1)
 addition=''.join(line[1:]for line in hunks[1].splitlines(True)if line.startswith('+')and not line.startswith('+++'))
 assert 'fn create_pool' in addition and 'fn create_pool' not in original
 t=t.rstrip()+'\n'+addition
 assert len(original[:original.index(old)].splitlines())==len(t[:t.index(new)].splitlines())
 p.write_text(t)
after=inv(S);changed={n:h for n,h in after.items()if before.get(n)!=h};assert set(changed)=={'src/migrate.rs','src/migrate_v2.rs'} and inv(BASE)==before
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed));(W/'migration-pool-helpers01.patch').write_text(patch)
out={'status':'source-only unbuilt, requires independent ABI and call-order review','source':str(S.relative_to(R)),'base_source':str(BASE.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'upstream':{'pr':410,'head':'ab991fe40b79fdddd0ad61175cdc4c07996c1794','patch_sha256':sha(up),'candidate_windows':['0x43ea0','0x47e28','0x502f0']},'patch_sha256':sha(W/'migration-pool-helpers01.patch'),'new_cases':0,'review_requirements':['Compare original current raw/generated CPI instruction bytes, account order/signers/writable flags and seeds.','Verify new helper field reads preserve original call position and pure token program selection.','Measure all prior matches and complete runtime; archived claims are not current proof.'],'limits':['No changes to other program implementations; generated external interfaces are existing main compiler inputs.','No current binary or runtime equivalence claimed.']};(W/'STAGED01.json').write_text(json.dumps(out,indent=2)+'\n');(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in ['stage01.py','migration-pool-helpers01.patch','STAGED01.json']},indent=2)+'\n');print({'staged':sha(W/'STAGED01.json'),'patch':sha(W/'migration-pool-helpers01.patch')})
