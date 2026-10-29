#!/usr/bin/env python3
"""Recompute the complete official census and authenticate the actual call recovery."""
from pathlib import Path
import argparse
import gzip
import hashlib
import json
import runpy
import sys

HERE = Path(__file__).resolve().parent
PACKET = HERE.parent
sha = lambda raw: hashlib.sha256(raw).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', type=Path, required=True)
    args = parser.parse_args()
    root = args.repository.resolve()
    inputs = json.loads((HERE / 'CENSUS-INPUTS.json').read_bytes())
    for name, digest in inputs.items():
        path = PACKET / name if name.startswith('qualification/') else root / name
        assert sha(path.read_bytes()) == digest, name
    sys.path.insert(0, str(root / 'research/pump-final-composition-673-20261028/tools'))
    from pump_compare_function_bytes import body, normalize
    from pump_quote_control_function_match import sections
    # The retained census implementation is unchanged. Only its input root is
    # explicit here, rather than inferred from a historical work-directory path.
    namespace = runpy.run_path(str(HERE / 'tools/census.py'))
    census = namespace['census']
    census.__globals__['ROOT'] = root
    candidate = PACKET / 'native-builds/perhop-40792780769/unstripped.so'
    actual = census(candidate)
    saved = json.loads(gzip.decompress((HERE / 'inventory.json.gz').read_bytes()))
    assert actual == saved
    assert actual['counts']['total'] == 1035
    assert actual['counts']['normalized'] == 1019 and actual['counts']['raw'] == 188
    image = candidate.read_bytes()
    secs = sections(image)
    functions = list(namespace['functions'](image))
    start, length, symbol = next(row for row in functions if row[2].startswith('_ZN14pump_recovered15multi_hop_curve8swap_hop17h'))
    assert (start, length) == (0x67860, 18536)
    _, operands = normalize(body(image, secs, start, length), start, secs)
    calls = [row for row in operands if row['kind'] == 'direct-call']
    assert len(calls) == 98
    helper = next(row for row in functions if '11accrue_fees17h' in row[2])
    assert helper[:2] == (0xb35c8, 1456)
    normalized, _ = normalize(body(image, secs, *helper[:2]), helper[0], secs)
    assert sha(normalized) == 'cfd961a79086500af2d7580f5178f933132d5763a75078d3fdf569ce378650be'
    assert [row['offset'] for row in calls if row['target'] == helper[0]] == [0x30c0, 0x3150]
    print(json.dumps({'symbols_sha256': sha(image), 'full_1035_census': actual['counts'],
                      'original_body_bytes': 18584, 'candidate_body_bytes': length,
                      'original_actual_calls': 107, 'candidate_actual_calls': len(calls),
                      'restored_matched_helper_calls': 2,
                      'normalized_gains': [], 'raw_gains': [], 'losses': [],
                      'whole_elf_identity': False}, indent=2))


if __name__ == '__main__':
    main()
