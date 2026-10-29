#!/usr/bin/env python3
"""Prepare a distinct new cold proof using frozen final source and real warm images."""
import argparse, hashlib, json, shutil
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
def require(ok, message):
    if not ok:
        raise ValueError(message)
def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--source', type=Path, required=True)
    p.add_argument('--candidate', type=Path, required=True)
    p.add_argument('--symbols', type=Path, required=True)
    p.add_argument('--receipt', type=Path, required=True)
    p.add_argument('--parent-manifest', type=Path, required=True)
    p.add_argument('--name', default='pump-final-composition-cold-20261028')
    a = p.parse_args()
    parent = ROOT / 'research/pump-admin-wallet-guard-20261028'
    packet = ROOT / 'research' / a.name
    require(not packet.exists(), 'retain existing proof packet')
    source = a.source.resolve()
    inputs = {path.relative_to(source).as_posix(): sha(path) for path in source.rglob('*') if path.is_file()}
    require(len(inputs) == 65 and inputs['src/creator/admin_cto.rs'] == '6353b1f7b9e613bb8d819000c504d44410b04f7da7dfbdc7fb2e5132df100180', 'final source65 or corrected admin binding differs')
    warm = json.loads(a.receipt.read_text())
    require(warm['returncode'] == 0 and warm['source_unchanged'] and warm['comparison']['candidate_sha256'] == sha(a.candidate) and warm['unstripped_sha256'] == sha(a.symbols), 'actual final warm compiler binding failed')
    packet.mkdir()
    shutil.copytree(source, packet / 'source')
    shutil.copytree(parent / 'tools', packet / 'tools')
    # The already executed portable cold controller is byte-for-byte identical;
    # only its explicit source/image input JSON is newly derived.
    shutil.copy2(parent / 'build.py', packet / 'build.py')
    expected = json.loads((parent / 'build-inputs.json').read_text())
    expected.update(schema='PUMP_FINAL_COMPOSITION_COLD_INPUTS_V1', source_inputs=inputs,
        comparison={'candidate_sha256': sha(a.candidate)}, unstripped_sha256=sha(a.symbols))
    expected['qualified_parent'] = {'path': str(parent.relative_to(ROOT)), 'manifest_sha256': sha(parent / 'manifest.json'),
        'build_controller_sha256': sha(parent / 'build.py')}
    expected['actual_new_warm_build_receipt_sha256'] = sha(a.receipt)
    expected['final_source_parent_manifest'] = {'path': str(a.parent_manifest.resolve().relative_to(ROOT)), 'sha256': sha(a.parent_manifest)}
    (packet / 'build-inputs.json').write_text(json.dumps(expected, indent=2) + '\n')
    references = {'source': str(source.relative_to(ROOT)), 'source_inputs': inputs, 'warm_candidate': {'path': str(a.candidate.resolve().relative_to(ROOT)), 'sha256': sha(a.candidate)},
        'warm_symbols': {'path': str(a.symbols.resolve().relative_to(ROOT)), 'sha256': sha(a.symbols)},
        'actual_warm_receipt': {'path': str(a.receipt.resolve().relative_to(ROOT)), 'sha256': sha(a.receipt)},
        'source_parent_manifest': expected['final_source_parent_manifest'], 'cold_controller_sha256': sha(packet / 'build.py'),
        'cold_controller_changed': False, 'old_compiler_receipt_relabelled': False}
    (packet / 'warm-references.json').write_text(json.dumps(references, indent=2) + '\n')
    print(packet)
if __name__ == '__main__':
    main()
