"""Bound the grapheme lookup byte table using its actual index and sentinel."""
from pathlib import Path
import gzip, hashlib, importlib.util, json, struct

if not __debug__:
    raise RuntimeError('Assertions are required')
P = Path(__file__).resolve().parent
PRIOR = 'research/mayhem-current437-rust-panic-messages-20261029'
PRIOR_SHA = '839174494ffefa29fab70b027aea1b2672777ea5efd69ad194cf9c7c8eaef5e4'
sha = lambda data: hashlib.sha256(data).hexdigest()



# Common reviewed merged #846 historical data baseline. No open-PR dependency.
REVIEW_BASELINE = 'research/mayhem-current437-bounded-index-tables-20261029/coverage-delta.json'
REVIEW_BASELINE_SHA256 = 'f6efa470f1d18bcec99cab2c95ecf1fc650fe5606bcdbc73956986779e7cb282'
REVIEW_ADDED_RAW = {'.rodata': [[722528, 723279]], '.data.rel.ro': []}
REVIEW_ADDED_MAPPED = {'.rodata': [], '.data.rel.ro': []}

def _review_union(intervals):
    out = []
    for a,b in sorted(map(tuple, intervals)):
        assert 0 <= a < b
        if out and a <= out[-1][1]: out[-1][1] = max(out[-1][1], b)
        else: out.append([a,b])
    return out

def _review_measure(intervals):
    return sum(b-a for a,b in intervals)

def _review_coverage(root, report):
    table = report['tables'][0]
    raw = {'.rodata': [[table['table'], table['table'] + len(bytes.fromhex(table['bytes_hex']))]], '.data.rel.ro': []}
    mapped = {'.rodata': [], '.data.rel.ro': []}
    assert raw == REVIEW_ADDED_RAW and mapped == REVIEW_ADDED_MAPPED, 'actual attribution additions'
    raw = (root / REVIEW_BASELINE).read_bytes()
    assert sha(raw) == REVIEW_BASELINE_SHA256, 'reviewed merged baseline hash'
    base = json.loads(raw)
    assert (base['payload_covered_bytes'],base['payload_total_bytes']) == (21796,26180)
    sections = []
    for old in base['sections']:
        name = old['section']
        assert _review_union(old['raw_intervals'] + old['mapped_intervals']) == old['covered_intervals']
        raw_intervals = _review_union(old['raw_intervals'] + REVIEW_ADDED_RAW[name])
        mapped_intervals = _review_union(old['mapped_intervals'] + REVIEW_ADDED_MAPPED[name])
        covered = _review_union(raw_intervals + mapped_intervals)
        raw_count, total = _review_measure(raw_intervals), _review_measure(covered)
        sections.append(dict(section=name,total_bytes=old['total_bytes'],raw_intervals=raw_intervals,
            mapped_intervals=mapped_intervals,covered_intervals=covered,raw_equal_bytes=raw_count,
            pointer_only_bytes=total-raw_count,covered_bytes=total,new_bytes=total-old['covered_bytes']))
    return dict(scope='Finite historical data attribution against common reviewed merged #846; no current-native/window/source-footprint credit.',
        reviewed_baseline_path=REVIEW_BASELINE,reviewed_baseline_sha256=REVIEW_BASELINE_SHA256,
        baseline_payload_bytes=21796,baseline_rodata_bytes=14972,baseline_data_rel_ro_bytes=6824,
        sections=sections,new_payload_bytes=sum(s['new_bytes'] for s in sections),
        payload_covered_bytes=sum(s['covered_bytes'] for s in sections),payload_total_bytes=26180)

def prior(root):
    spec = importlib.util.spec_from_file_location('rust_panic_prior', root / PRIOR / 'proof.py')
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


def read_rodata(image, addr, size):
    matches = [s for s in image.sections if s['name'] == '.rodata' and s['type'] != 8
               and s['flags'] & 2 and s['address'] <= addr and addr + size <= s['address'] + s['size']]
    assert len(matches) == 1 and not any(addr <= r < addr + size for r in image.rel)
    s = matches[0]
    off = s['offset'] + addr - s['address']
    return image.b[off:off + size]


def inspect_images(original, candidate):
    rows = []
    for image, start, table, index, digest in (
        (original, 696640, 722528, 725292, '3b1b11b2f6dc697f2adac7bb13b5e56bc1804d7f38e05c889e85f7e0eb7352e6'),
        (candidate, 630320, 702968, 705732, '8065fb60993e3156b67c69c95abf3f58ce5a934fb37bf6b4fb3f1c389ba3f09a'),
    ):
        # Pin the complete 137-instruction function: guards, index selection,
        # sentinel, pointer arithmetic, byte load, and loop are all included.
        assert image.lo <= start and start + 1096 <= image.hi
        code = image.b[start:start + 1096]
        assert sha(code) == digest
        offsets = [80, 96, 232, 336, 440, 544, 632, 888]
        assert sorted(r - start for r in image.rel if start <= r < start + 1096) == offsets
        for off in offsets:
            rel = image.rel[start + off]
            assert rel['type'] == 8 and rel['symbol_index'] == 0
            op, reg, branch, low = struct.unpack_from('<BBhI', code, off)
            continuation, high = struct.unpack_from('<II', code, off + 8)
            assert op == 0x18 and branch == 0 and continuation == 0
            assert low | (high << 32) == (table if off == 888 else index)
        assert struct.unpack_from('<BBhi', code, 776) == (0xb7, 3, 0, 751)
        assert struct.unpack_from('<BBhi', code, 800) == (0x25, 5, 3, 32)
        assert struct.unpack_from('<BBhi', code, 808) == (0x61, 0x23, 4, 0)
        assert struct.unpack_from('<BBhi', code, 872) == (0x15, 3, 19, 0)
        assert struct.unpack_from('<BBhi', code, 960) == (0x71, 0x66, 0, 0)
        assert struct.unpack_from('<BBhi', code, 1016) == (0xad, 0x32, -10, 0)
        words = struct.unpack('<34I', read_rodata(image, index, 136))
        starts = [word >> 21 for word in words]
        keys = [word & 0x1fffff for word in words]
        assert starts[0] == 0 and starts[-1] == 747
        assert all(a < b for a, b in zip(starts, starts[1:]))
        assert all(a < b for a, b in zip(keys, keys[1:]))
        bounds = starts + [751]
        assert all(0 <= a < b <= 751 for a, b in zip(bounds, bounds[1:]))
        data = read_rodata(image, table, 751)
        rows.append(dict(function=start, table=table, index=index, starts=starts,
                         keys=keys, bytes_hex=data.hex(), code_sha256=sha(code)))
    assert rows[0]['starts'] == rows[1]['starts'] and rows[0]['keys'] == rows[1]['keys']
    assert rows[0]['bytes_hex'] == rows[1]['bytes_hex']
    return rows


def inspect(packet, root):
    old = prior(root)
    original = (root / 'evidence/original/mayhem/deployed.so').read_bytes()
    candidate = old.candidate_bytes(root)
    before = old.inspect(root / PRIOR, original, candidate, root)
    _, original_elf, candidate_elf = old.images(root, original, candidate)
    return dict(prior_summary=before['summary'], tables=inspect_images(original_elf, candidate_elf))


def coverage(root, report):
    return _review_coverage(root, report)



def inventory(packet):
    return {str(p.relative_to(packet)): sha(p.read_bytes()) for p in sorted(packet.rglob('*'))
            if p.is_file() and p.name != 'manifest.json' and '__pycache__' not in p.parts and p.suffix != '.pyc'}


def check(packet, root):
    paths = list(packet.rglob('*'))
    assert not any(p.is_symlink() for p in paths)
    assert all(p.is_file() or p.is_dir() for p in paths)
    assert inventory(packet) == json.loads((packet / 'manifest.json').read_bytes())
    pinned = json.loads((packet / 'inputs.json').read_bytes())
    for path, digest in pinned.items():
        rel = Path(path)
        assert not rel.is_absolute() and '..' not in rel.parts
        assert sha((root / rel).read_bytes()) == digest
    for path in (root / PRIOR).rglob('*'):
        if path.is_file() and '__pycache__' not in path.parts and path.suffix != '.pyc':
            assert str(path.relative_to(root)) in pinned
    prior(root).check(root / PRIOR, root)
    report = inspect(packet, root)
    assert report == json.loads(gzip.decompress((packet / 'observations.json.gz').read_bytes()))
    delta = coverage(root, report)
    assert delta == json.loads((packet / 'coverage-delta.json').read_bytes()), 'reviewed coverage delta differs'
    assert (report['prior_summary']['normalized_windows'], report['prior_summary']['raw_windows'],
            report['prior_summary']['extended_windows'], report['prior_summary']['extended_pairs'],
            report['prior_summary']['rejected_pairs']) == (437, 141, 431, 581, 0)
    return dict(new_rodata_bytes=751, interval=[722528, 723279], payload_covered=22547,
                payload_total=26180, slices=34, rejected_pairs=0)


def seal(root):
    report = inspect(P, root)
    (P / 'observations.json.gz').write_bytes(gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0))
    (P / 'coverage-delta.json').write_text(json.dumps(coverage(root, report), indent=2) + '\n')
    (P / 'manifest.json').write_text(json.dumps(inventory(P), indent=2) + '\n')


if __name__ == '__main__':
    seal(next(p for p in P.parents if (p / 'evidence/original/mayhem/deployed.so').is_file()))
