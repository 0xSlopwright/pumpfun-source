"""Assemble already verified independent evidence with current-candidate receipts."""
from pathlib import Path
import hashlib
import importlib.util
import json
import shutil
from materialize_lineage import lineage_ignore, omission_record

R = Path.cwd()
W = Path(__file__).resolve().parent
H = R / 'repro/pump_amm/admin-harvest-recovery-20261027'
D = W / 'new-proofs'
C = W / 'build/artifacts/pump_amm_recovered.so'
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()


def save(path, value):
    path.write_text(json.dumps(value, indent=2) + '\n')


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    obj = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(obj)
    return obj


fresh_expanded = R / 'work/amm-incentive-liquidity-buy-combined-20261027/new-proofs'
shutil.copytree(fresh_expanded, D, dirs_exist_ok=True)

acceptance = json.loads((W / 'acceptance.json').read_text())
assert all(row['returncode'] == 0 for row in acceptance)
first = json.loads((W / 'build/build-comparison.json').read_text())
repeat = json.loads((W / 'build-repeat/build-comparison.json').read_text())
assert first['comparison']['candidate_sha256'] == repeat['comparison']['candidate_sha256'] == sha(C)
assert first['unstripped_sha256'] == repeat['unstripped_sha256']
assert first['source_sha256'] == repeat['source_sha256']
assert first['dependency_cache_after'] == repeat['dependency_cache_after']
packets = {'range-joint': R / 'work/amm-incentive-liquidity-buy-combined-20261027/packet-lean',
           'independent-range': R / 'work/amm-next-joint-independent-20261027',
           'incentive-order': R / 'work/amm-incentive-order-independent-20261027'}
shutil.copytree(H / 'results/new-proofs/static', D / 'static')
source_lineage = H / 'results/new-proofs/lineage'
shutil.copytree(source_lineage, D / 'lineage',
                ignore=lineage_ignore(source_lineage, replaced=packets))
save(D / 'lineage-omissions.json', omission_record(H, replaced=packets, repository_root=R))
records = []
for name, source in packets.items():
    manifest = json.loads((source / 'manifest.json').read_text())
    files = manifest.get('files', manifest)
    target = D / 'lineage' / name
    assert not target.exists()
    for rel, entry in files.items():
        digest = entry['sha256'] if isinstance(entry, dict) else entry
        path = Path(rel)
        assert not path.is_absolute() and '..' not in path.parts
        assert sha(source / path) == digest, (source, rel)
        dest = target / path
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source / path, dest)
    shutil.copy2(source / 'manifest.json', target / 'manifest.json')
    records.append({'name': name, 'manifest_sha256': sha(target / 'manifest.json'), 'files': len(files)})
save(D / 'lineage/new-components.json', records)
assert (W / 'recovery/fresh-optional-cashback').exists()
assert (W / 'recovery/fresh-ata').exists()
assert (W / 'recovery/fresh-entry').exists()
assert (W / 'recovery/fresh-controls').exists()
assert (W / 'recovery/fresh-resize').exists()
shutil.copytree(W / 'recovery', D / 'recovery')
deep = D / 'continuation/deep-routes'
shutil.copytree(W / 'recovery/deep-routes', deep)
prior = H / 'results/new-proofs/continuation/deep-routes'
shutil.copy2(prior / 'verify_completion.py', deep / 'verify_completion.py')
roster = json.loads((prior / 'completion-roster.json').read_text())
roster['candidate_sha256'] = sha(C)
save(deep / 'completion-roster.json', roster)
save(deep / 'manifest.json', {'schema': 1, 'files': {
    str(p.relative_to(deep)): sha(p) for p in sorted(deep.rglob('*'))
    if p.is_file() and p != deep / 'manifest.json'}})
completion = module('fresh_deep_completion', deep / 'verify_completion.py').verify(deep, C)
assert completion['original_successes'] == 42 and completion['original_budget_failures'] == 0
save(W / 'deep-completion-verification.json', completion)
save(W / 'proof-assembly.json', {'candidate_sha256': sha(C), 'components': records,
                                'repeat_equal': True, 'deep_completion_verified': True})
print(json.dumps({'candidate_sha256': sha(C), 'components': len(records), 'repeat_equal': True}))
