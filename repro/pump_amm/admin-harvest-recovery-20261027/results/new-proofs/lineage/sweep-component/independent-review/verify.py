"""Independent static/source audit; runtime/repeat/dependency gates are separate."""
from pathlib import Path
import argparse
import hashlib
import json
import types

W=Path(__file__).resolve().parent
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def inventory(p): return {str(f.relative_to(p)):sha(f) for f in p.rglob('*') if f.is_file()}
def module(p):
    m=types.ModuleType(p.stem);m.__file__=str(p)
    exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def verify(root):
    assert json.loads((W/'manifest.json').read_bytes())['files']=={k:v for k,v in inventory(W).items() if k!='manifest.json'}
    assert sha(W/'v2.patch')=='eada9167edc7a3cfcd4dc51e4cbbf0e81f6c16cea12c1926004d4012ae28f019'
    assert sha(W/'sweep.patch')=='f5664fc646c3637a0894ca836c7f5eea70e114fa39c6ccac7977202d138d6845'
    before,after=W/'baseline-source',W/'source'
    expected=inventory(before)
    changed=['programs/pump-amm/src/trade.rs','programs/pump-amm/src/instructions/swap/trade_v2.rs','programs/pump-amm/src/lib.rs','programs/pump-amm/src/instructions/mod.rs','programs/pump-amm/src/sweep.rs','programs/pump-amm/src/instructions/sweep_fees.rs']
    actual=inventory(after)
    assert len(expected)==len(actual)==52
    assert {k for k in expected.keys()|actual.keys() if expected.get(k)!=actual.get(k)}==set(changed)
    t='programs/pump-amm/src/trade.rs';old=(before/t).read_text();assert old.count('#[inline(never)]\npub(crate) fn prepare(')==1;assert(after/t).read_text()==old.replace('#[inline(never)]\npub(crate) fn prepare(','pub(crate) fn prepare(')
    t='programs/pump-amm/src/instructions/swap/trade_v2.rs';old=(before/t).read_text();assert old.count('emit!(event.clone())')==3;assert(after/t).read_text()==old.replace('emit!(event.clone())','emit!(event)')
    t='programs/pump-amm/src/lib.rs';old=(before/t).read_text();assert old.count('mod sweep;')==1;assert(after/t).read_text()==old.replace('mod sweep;','pub use instructions::sweep_fees as sweep;')
    t='programs/pump-amm/src/instructions/mod.rs';assert(after/t).read_text()==(before/t).read_text()+'\npub mod sweep_fees;\n'
    assert(before/'programs/pump-amm/src/sweep.rs').read_bytes()==(after/'programs/pump-amm/src/instructions/sweep_fees.rs').read_bytes()
    rec=json.loads((W/'build-comparison.json').read_bytes());suffix='programs/pump-amm/Cargo.toml';prefix=next(k[:-len(suffix)] for k in rec['source_sha256'] if k.endswith(suffix));local={k[len(prefix):]:v for k,v in rec['source_sha256'].items() if k.startswith(prefix)}
    assert local==actual and rec['source_sha256']==rec['source_after_sha256'] and rec['source_unchanged'] and rec['returncode']==0
    assert rec['unstripped_sha256']==sha(W/'candidate/unstripped.so')
    assert rec['comparison']['candidate_sha256']==sha(W/'candidate/pump_amm_recovered.so')
    oldrec=json.loads((W/'baseline-build-comparison.json').read_bytes());oldprefix=next(k[:-len(suffix)] for k in oldrec['source_sha256'] if k.endswith(suffix));assert {k[len(oldprefix):]:v for k,v in oldrec['source_sha256'].items() if k.startswith(oldprefix)}==expected
    assert oldrec['comparison']['candidate_sha256']==sha(W/'baseline/pump_amm_recovered.so') and oldrec['unstripped_sha256']==sha(W/'baseline/unstripped.so')
    result=module(W/'audit.py').run(Path(root))
    assert result==json.loads((W/'audit.json').read_bytes())
    return {'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':result['candidate_sha256'],**result['measurement'],'public_wrappers':38,'public_wrappers_matching':38,'shared_sweep_original_bytes':4456,'shared_sweep_candidate_bytes':4968,'shared_sweep_context_fields':[8,33],'exact_wrapper_callee_occurrences':6,'unequal_shared_handler_occurrences':2,'shared_handler_distinct_targets':26,'shared_handler_unequal_targets':4,'local_source_inputs':52,'runtime_executed':False,'new_compilations':0,'scope':'Complete wrapper byte/relocation comparisons, actual immediate call targets, concrete sweep selectors/Context/path/event operands, and local source/build-record binding. Shared sweep handler, four of its targets, dependency provenance, runtime and whole-ELF identity remain outside the equality claim.'}

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
