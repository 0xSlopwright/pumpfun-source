"""Port one independently archived main-Pump source-shape correction."""
from pathlib import Path
import difflib,hashlib,json,shutil,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
BASE=R/'work/parallel-main-integration/round44-source-retry/programs/pump';S=W/'source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest
def inv(p):return{str((R/n).relative_to(p)):v for n,v in source_manifest(p,p,R).items()}
before=inv(BASE);assert len(before)==65 and not S.exists()
upstream=R/'work/parallel-main-integration/pr410-pump-review/validate_new_mint.patch'
assert sha(upstream)=='15fa7cbb5ec00fbb0201cc27053cdfb91cafce94f9e443bfc3575d2c4584a62f'
shutil.copytree(BASE,S);p=S/'src/quote_control/state.rs';t=p.read_text()
method='    pub fn contains(&self, mint: &Pubkey) -> bool {\n        self.mints.iter().position(|entry| entry.mint == *mint).is_some()\n    }'
assert method in t
old='''        require_eq!(
            self.contains(mint),
            false,
            PumpError::QuoteMintAlreadyWhitelisted
        );'''
new=old.replace('self.contains(mint)','self.mints.iter().position(|entry| entry.mint == *mint).is_some()')
assert t.count(old)==1;p.write_text(t.replace(old,new))
after=inv(S);changed={n:h for n,h in after.items()if before.get(n)!=h};assert set(changed)=={'src/quote_control/state.rs'}
assert len(p.read_text().splitlines())==len(t.splitlines()) and method in p.read_text() and inv(BASE)==before
patch=''.join(difflib.unified_diff(t.splitlines(True),p.read_text().splitlines(True),'a/programs/pump/src/quote_control/state.rs','b/programs/pump/src/quote_control/state.rs'));(W/'quote-mint-inlining01.patch').write_text(patch)
result={'status':'source-only unbuilt','source':str(S.relative_to(R)),'base_source':str(BASE.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'upstream':{'pr':410,'head':'ab991fe40b79fdddd0ad61175cdc4c07996c1794','patch_sha256':sha(upstream),'origin':'Archived pump-big-mid gain01; actual one-line expression replaces the exact contains method body.'},'source_proof':['contains is pure and has exactly the inlined expression as its body.','Same immutable self/mint arguments, iterator ordering and bool result.','Every other byte and source line count preserved; no source metadata padding.'],'patch_sha256':sha(W/'quote-mint-inlining01.patch'),'new_cases':0,'limits':['Archived claim of0x68bd8 match must be measured on current combined source.','No build/runtime/whole-binary identity claim.']}
(W/'STAGED01.json').write_text(json.dumps(result,indent=2)+'\n');(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in ['stage01.py','quote-mint-inlining01.patch','STAGED01.json']},indent=2)+'\n');print({'staged':sha(W/'STAGED01.json'),'patch':sha(W/'quote-mint-inlining01.patch')})
