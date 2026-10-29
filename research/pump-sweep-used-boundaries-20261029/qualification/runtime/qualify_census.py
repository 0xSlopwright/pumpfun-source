"""Use the unchanged public composition673 census with explicit safe output."""
import argparse
import gzip
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

if not __debug__:
    raise SystemExit('Run without -O; census assertions are required.')
P = Path(__file__).resolve().parent
BASELINE = 'c66bb5ece1676933838403fa99c120b636eba9c3db4e543bb32d614bcac6451d'
CENSUS = '804b88102b69c7bf41f7a3f751454bf9d4d1c89cc36fb7e7f52bdc89f28b9d5c'
sha = lambda data: hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--symbols', type=Path, required=True)
    parser.add_argument('--baseline', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    assert not args.output.exists()
    source = P / 'inputs/census-673.py'
    assert sha(source.read_bytes()) == CENSUS
    assert sha(args.baseline.read_bytes()) == BASELINE
    sys.path.insert(0, str(args.repo.resolve() / 'scripts'))
    spec = importlib.util.spec_from_file_location('canonical_census', source)
    census = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(census)
    census.ROOT = args.repo.resolve()
    pinned = json.loads((P / 'CENSUS-INPUTS.json').read_text())
    assert all(sha((args.repo / name).read_bytes()) == digest for name, digest in pinned.items())
    before = args.symbols.read_bytes()
    actual = census.census(args.symbols)
    baseline = json.loads(gzip.decompress(args.baseline.read_bytes()))
    assert len(actual['windows']) == len(baseline['windows']) == 1035
    old = {row['start']: row for row in baseline['windows']}
    for label, predicate in [('normalized', lambda row: bool(row['normalized_matches'])), ('raw', lambda row: row['raw_match'])]:
        actual[label + '_gains'] = [hex(row['start']) for row in actual['windows'] if predicate(row) and not predicate(old[row['start']])]
        actual[label + '_losses'] = [hex(row['start']) for row in actual['windows'] if not predicate(row) and predicate(old[row['start']])]
    assert args.symbols.read_bytes() == before
    assert all(sha((args.repo / name).read_bytes()) == digest for name, digest in pinned.items())
    args.output.write_bytes(gzip.compress(json.dumps(actual, sort_keys=True).encode(), mtime=0))
    print(json.dumps({k: v for k, v in actual.items() if k != 'windows'}, indent=2))
    assert not actual['normalized_losses'], 'Official matched membership loss; reject candidate'


if __name__ == '__main__':
    main()
