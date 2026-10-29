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
    integrated_root = lineage / 'current-joint'
    process = subprocess.run([sys.executable, '-B', str(integrated_root / 'verify.py')],
                             check=True, capture_output=True, text=True)
    assert hashlib.sha256((integrated_root / 'build/artifacts/pump_amm_recovered.so').read_bytes()).hexdigest() == hashlib.sha256(candidate.read_bytes()).hexdigest()
    independent = module('sixth_independent', lineage / 'independent-current/verify.py').verify(lineage / 'independent-current')
    assert independent['candidate_sha256'] == hashlib.sha256(candidate.read_bytes()).hexdigest()
    assert independent['wrappers'] == 38
    assert independent['volume_accumulator_identical_to_h11'] is True
    assert independent['current_incentive_boundary_cases'] == 1730
    assert independent['current_incentive_boundary_mismatches'] == 0 and independent['baseline_mismatches'] == 128
    assert independent['normalized_windows'] == 660 and independent['raw_windows'] == 159
    assert independent['bounded_static_closed_windows'] == 595
    worker_report = json.loads(process.stdout)
    assert worker_report['isolated_trade_cases'] == 870 and worker_report['isolated_mint_cases'] == 174
    assert worker_report['allocation_control_cases'] == 48 and worker_report['allocation_control_signatures'] == 96
    allocation = module('h19_current_allocation', integrated_root / 'allocation-proof/verify.py').verify(integrated_root / 'allocation-proof')
    assert allocation['candidate_sha256'] == independent['candidate_sha256']
    assert allocation['equal_allocation_control_cases'] == 48 and allocation['equal_allocation_control_mismatches'] == 0
    assert allocation['executable_account_charge_gap'] == 36764
    assert allocation['raw_default_resource_mismatches_preserved'] == 4
    extra = json.loads((integrated_root / 'extras-verification.json').read_bytes())
    assert extra['partial']['cases'] == 264 and extra['partial']['mismatches'] == 0
    assert extra['candidate_sha256'] == independent['candidate_sha256']
    assert extra['legacy']['cases'] == 1616 and extra['cto']['cases'] == 19
    for key in ['partial','legacy','cto']:assert extra[key]['candidate_sha256'] == independent['candidate_sha256']
    ata = module('sixth_ata', outputs / 'fresh-ata/verify.py').verify(outputs / 'fresh-ata', candidate)
    resize = module('sixth_resize', outputs / 'fresh-resize/verify.py').verify(outputs / 'fresh-resize', candidate)
    entry = module('sixth_entry', lineage / 'fourth/verify_runtime.py').verify(root, candidate, outputs / 'fresh-entry')
    controls = [module('sixth_control_' + name, outputs / 'fresh-controls' / name / 'kit/verify.py').verify_output(
        outputs / 'fresh-controls' / name / 'kit', candidate, outputs / 'fresh-controls' / name)
        for name in ['init', 'claim', 'reserved', 'boost']]
    assert ata['cases'] == 60 and resize['cases'] == 160 and entry['cases'] == 137
    assert sum(row['cases'] for row in controls) == 71
    cashback = module('current_optional_cashback', outputs / 'fresh-optional-cashback/verify.py').verify(outputs / 'fresh-optional-cashback', candidate)
    assert cashback['cases'] == 24 and cashback['mismatches'] == 0
    sidecar = json.loads(__import__('gzip').decompress((outputs / 'fresh-entry/entrypoint-transactions.json.gz').read_bytes()))
    assert sidecar['script_sha256'] == hashlib.sha256((outputs / 'fresh-entry/entrypoint-probe.py').read_bytes()).hexdigest()
    incentive = module('baseline_incentive_order', lineage / 'incentive-order/verify.py').verify(root)
    # This unchanged packet proves the H11 correction and is explicitly baseline.
    assert incentive['candidate_sha256'] == 'c20007e860f47db1cc443344605afafe505d61bb4de6d61306fa164db3482544'
    assert incentive['cases'] == 1730 and incentive['mismatches'] == 0 and incentive['baseline_mismatches'] == 128
    current_source = results / 'canonical-source/programs/pump-amm/src/state/volume_accumulator.rs'
    assert current_source.read_bytes() == (lineage / 'incentive-order/source/joint.rs').read_bytes()
    current_incentive = module('h12_current_incentive', integrated_root / 'counterexamples/verify.py').verify(integrated_root / 'counterexamples')
    assert current_incentive['candidate_sha256'] == independent['candidate_sha256']
    assert current_incentive['cases'] == 1730 and current_incentive['mismatches'] == 0
    return {
        'current_v2_trade_cases': worker_report['isolated_trade_cases'],
        'current_v2_mint_cases': worker_report['isolated_mint_cases'],
        'current_allocation_pairs': allocation['equal_allocation_control_cases'],
        'current_allocation_signatures': allocation['control_signature_fields'],
        'current_allocation_charge_gap': allocation['executable_account_charge_gap'],
        'current_incentive_boundary_cases': current_incentive['cases'],
        'prior_incentive_proof_candidate_sha256': incentive['candidate_sha256'],
        'incentive_source_identical_to_h11': True,
        'current_incentive_boundary_mismatches': 0,
        'prior_incentive_boundary_mismatches': 128,
        'current_additional_edge_cases': ata['cases'] + resize['cases'] + entry['cases'] + sum(row['cases'] for row in controls),
        'current_additional_edge_signatures': ata['verified_signatures'] + resize['verified_signatures'] + entry['signatures_verified'] + sum(row['signatures'] for row in controls),
        'current_bounded_static_windows': independent['bounded_static_closed_windows'],
        'current_optional_u64_cases': extra['partial']['cases'],
        'current_legacy_packet_cases': extra['legacy']['cases'],
        'current_native_quote_guard_cases': extra['cto']['cases'],
        'joint_protocol_recipient_cases': protocol['cases'],
        'joint_protocol_sweep_cases': sweep['cases'],
        'joint_event_cases': event['cases'],
        'joint_cpi_runtime': cpi,
        'joint_getter_body_and_descriptors_verified': True,
        'joint_buy_event_body_and_filename_verified': True,
        'buy_event_coordinates_equal': False,
    }
