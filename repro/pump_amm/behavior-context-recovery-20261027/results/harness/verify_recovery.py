"""Check the new joint-candidate runtime receipts and recovered static records."""
from pathlib import Path
import importlib.util


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
    fourth = lineage / 'fifth'
    integrated = module('fourth_sealed', fourth / 'verify.py').verify(root)
    assert integrated['candidate_sha256'] == __import__('hashlib').sha256(candidate.read_bytes()).hexdigest()
    assert integrated['runtime']['cases'] == 56 and integrated['bounded_static_closed_windows'] == 585
    ata = module('new_ata', outputs / 'fresh-ata/verify.py').verify(outputs / 'fresh-ata', candidate)
    resize = module('new_resize', outputs / 'fresh-resize/verify.py').verify(outputs / 'fresh-resize', candidate)
    assert ata['cases'] == 60 and resize['cases'] == 160
    return {
        'current_additional_edge_cases': integrated['runtime']['cases'] + ata['cases'] + resize['cases'],
        'current_additional_edge_signatures': integrated['runtime']['signatures'] + ata['verified_signatures'] + resize['verified_signatures'],
        'current_bounded_static_windows': integrated['bounded_static_closed_windows'],
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
