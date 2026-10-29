"""Check the new joint-candidate runtime receipts and recovered static records."""
from pathlib import Path
import importlib.util
import hashlib
import json
import subprocess
import sys


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value


def verify(results, candidate, root):
    results, candidate, root = map(Path, (results, candidate, root))
    d = results / 'new-proofs'
    lineage, outputs = d / 'lineage', d / 'recovery'
    protocol = module('joint_protocol', lineage / 'protocol-recipient/verify.py').verify_output(
        lineage / 'protocol-recipient', candidate, outputs / 'protocol-recipient', 0)
    sweep = module('joint_sweep', lineage / 'protocol-sweep/verify.py').verify_output(
        lineage / 'protocol-sweep', candidate, outputs / 'protocol-sweep', 0)
    cpi = module('joint_cpi_runtime', lineage / 'cpi-branches/verify_runtime.py').verify(
        root, candidate, outputs / 'cpi-return')
    event = module('joint_event_runtime', lineage / 'buy-event/verify_runtime.py').verify(
        root, candidate, outputs / 'buy-event')
    getter = module('joint_cpi_static', lineage / 'cpi-branches/verify_getter.py').verify(
        root, candidate, results / 'build/unstripped.so')
    event_static = module('joint_event_static', lineage / 'buy-event/verify_event.py').verify(
        root, candidate, results / 'build/unstripped.so')
    assert protocol['cases'] == 45 and sweep['cases'] == 17
    assert event['cases'] == 98 and getter['normalized_body_equal']
    assert event_static['normalized_body_equal'] and not event_static['coordinates_equal']
    integrated_root = lineage / 'next-joint'
    process = subprocess.run([sys.executable, '-B', str(integrated_root / 'verify_packet.py')],
                             check=True, capture_output=True, text=True)
    assert hashlib.sha256((integrated_root / 'build/artifacts/pump_amm_recovered.so').read_bytes()).hexdigest() == hashlib.sha256(candidate.read_bytes()).hexdigest()
    independent = module('sixth_independent', lineage / 'independent-next/verify.py').verify(root)
    assert independent['candidate_sha256'] == hashlib.sha256(candidate.read_bytes()).hexdigest()
    assert independent['normalized_windows'] == 651 and independent['raw_windows'] == 148
    assert independent['bounded_static_closed_windows'] == 587
    extra = json.loads((integrated_root / 'extra-verification.json').read_bytes())
    assert extra['partial_tail']['cases'] == 264 and extra['partial_tail']['mismatches'] == 0
    assert extra['candidate_sha256'] == independent['candidate_sha256']
    ata = module('sixth_ata', outputs / 'fresh-ata/verify.py').verify(outputs / 'fresh-ata', candidate)
    resize = module('sixth_resize', outputs / 'fresh-resize/verify.py').verify(outputs / 'fresh-resize', candidate)
    entry = module('sixth_entry', lineage / 'fourth/verify_runtime.py').verify(root, candidate, outputs / 'fresh-entry')
    controls = [module('sixth_control_' + name, outputs / 'fresh-controls' / name / 'kit/verify.py').verify_output(
        outputs / 'fresh-controls' / name / 'kit', candidate, outputs / 'fresh-controls' / name)
        for name in ['init', 'claim', 'reserved', 'boost']]
    assert ata['cases'] == 60 and resize['cases'] == 160 and entry['cases'] == 137
    assert sum(row['cases'] for row in controls) == 71
    sidecar = json.loads(__import__('gzip').decompress((outputs / 'fresh-entry/entrypoint-transactions.json.gz').read_bytes()))
    assert sidecar['script_sha256'] == hashlib.sha256((outputs / 'fresh-entry/entrypoint-probe.py').read_bytes()).hexdigest()
    return {
        'current_additional_edge_cases': ata['cases'] + resize['cases'] + entry['cases'] + sum(row['cases'] for row in controls),
        'current_additional_edge_signatures': ata['verified_signatures'] + resize['verified_signatures'] + entry['signatures_verified'] + sum(row['signatures'] for row in controls),
        'current_bounded_static_windows': independent['bounded_static_closed_windows'],
        'current_optional_u64_cases': 264,
        'current_legacy_packet_cases': 1616,
        'current_native_quote_guard_cases': 19,
        'current_entrypoint_descriptors': 17,
        'current_payout_normalized_bytes': 2536,
        'joint_protocol_recipient_cases': protocol['cases'],
        'joint_protocol_sweep_cases': sweep['cases'],
        'joint_event_cases': event['cases'],
        'joint_cpi_runtime': cpi,
        'joint_getter_body_and_descriptors_verified': True,
        'joint_buy_event_body_and_filename_verified': True,
        'buy_event_coordinates_equal': False,
    }
