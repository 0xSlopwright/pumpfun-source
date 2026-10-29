"""Bind current734 and clock587 while retaining the historical SDK-cohort anchor."""
from pathlib import Path
from native_binding import bind as bind_anchor, authenticate, source_map, primary_map, sha

CONTROL_STRIP = 'c0e29e2d41c30e854f3548b37e87798d516e4e0e7769f40b7d8d16e31429795f'


def bind(control_directory, candidate_directory, kind, anchor_directory):
    assert kind == 'perhop-clock'
    parent_binding = bind_anchor(anchor_directory, control_directory, 'perhop')
    binding = bind_anchor(anchor_directory, candidate_directory, 'perhop-clock')
    parent, _, _ = authenticate(control_directory)
    after, _, _ = authenticate(candidate_directory)
    expected = source_map(parent)
    expected['programs/pump/src/multi_hop_curve_swap.rs'] = '5871a2cf35ebe0db502eb242db0f1652ef93e51e4971e56483016d900349ac2b'
    assert source_map(after) == expected
    standalone = primary_map(parent)
    standalone['src/multi_hop_curve_swap.rs'] = expected['programs/pump/src/multi_hop_curve_swap.rs']
    assert primary_map(after) == standalone
    assert parent_binding['candidate_sha256'] == CONTROL_STRIP
    binding['historical_anchor_sha256'] = '199fd7379b6881adefd9e54803f75902176c17bded1718bfc1c59b1cf5bc8473'
    binding['historical_anchor_build_receipt_sha256'] = binding['control_build_receipt_sha256']
    binding['historical_anchor_directory'] = str(Path(anchor_directory).resolve())
    binding['current_control_sha256'] = CONTROL_STRIP
    binding['control_build_receipt_sha256'] = parent_binding['candidate_build_receipt_sha256']
    binding['control_directory'] = str(Path(control_directory).resolve())
    return binding
