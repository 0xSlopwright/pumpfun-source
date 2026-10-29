from pathlib import Path
import difflib,hashlib,json,shutil,sys
from solders.pubkey import Pubkey
W=Path(__file__).resolve().parent;R=W.parents[1];J=W;B=W/'baseline';M=W/'isolated/amm-incentive-mint-snapshot-only-next-20261028';C=W/'isolated/amm-create-pool-arguments-next-20261028'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
inv=lambda d:{str(p.relative_to(d)):sha(p)for p in sorted(d.rglob('*'))if p.is_file()}
a,b=inv(B/'source'),inv(J/'source');assert len(a)==len(b)==57
manifest=json.loads((J/'composition.json').read_bytes());assert a==manifest['base_sources']and b==manifest['selected_sources']==manifest['source_sha256']
assert sha(B/'artifacts/pump_amm_recovered.so')==manifest['base_candidate_sha256']=='e33e6aace7d53008b3300364c07540f0cd7d1764196cd601554b08838b06e615'
changed=sorted(k for k in a if a[k]!=b[k]);assert changed==manifest['changed_files']==['programs/pump-amm/src/incentives.rs','programs/pump-amm/src/instructions/create_pool.rs']
assert (J/'source'/changed[0]).read_bytes()==(M/'source'/changed[0]).read_bytes()
assert (J/'source'/changed[1]).read_bytes()==(C/'source'/changed[1]).read_bytes()
assert (J/'source/programs/pump-amm/src/lib.rs').read_bytes()==(B/'source/programs/pump-amm/src/lib.rs').read_bytes()
assert (J/'source/crates/native-transfer-fee/src/lib.rs').read_bytes()==(B/'source/crates/native-transfer-fee/src/lib.rs').read_bytes()
assert sha(J/'components/incentive_mint_snapshot.patch')==sha(W/'components/incentive_mint_snapshot.patch')=='0462ef77fd42ff08fcf7ab4ea790d0fba61509a4e2dfac17ac801146c25f1cf9'
assert sha(J/'components/create_arguments.patch')==sha(W/'components/create_arguments.patch')=='20ff65af3564cb5189eceb0b729ed1de05a00f43db00d438acd84b9490172434'
patch=''.join(''.join(difflib.unified_diff((B/'source'/n).read_text().splitlines(True),(J/'source'/n).read_text().splitlines(True),fromfile='a/'+n,tofile='b/'+n))for n in changed)
assert patch==(J/'combined.patch').read_text()and sha(J/'combined.patch')==manifest['aggregate_patch_sha256']=='49e1a509fbfe5797e039d4668df5b107adef8d0dfd8c7c39aeb1f83297fdbea9'
assert str(Pubkey.from_bytes(bytes([1,86,224,246,147,102,90,207,68,219,21,104,191,23,91,170,81,137,203,151,245,210,255,59,101,93,43,182,253,109,24,176])))=='6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'
r={'passed':True,'aggregate_patch_sha256':sha(J/'combined.patch'),'base_candidate_sha256':manifest['base_candidate_sha256'],'workspace_files':57,'changed_files':changed,'source_sha256':b,'mint_only_component_exact':True,'create_arguments_component_exact':True,'context_borrow_change_absent':True,'lib_entrypoint_byte_unchanged':True,'native_crate_byte_unchanged':True,'scope':'Read-only review of frozen source composition; no compiler, VM, full-body match or semantic-bug claim.'}
