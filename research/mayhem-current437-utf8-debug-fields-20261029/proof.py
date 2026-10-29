"""Check three bounded Utf8Error debug strings at one matched call site."""
from pathlib import Path
import gzip
import hashlib
import importlib.util
import json
import struct

if not __debug__:
    raise RuntimeError('Assertions required')
P = Path(__file__).resolve().parent
PRIOR = 'research/mayhem-current437-bounded-error-strings-20261029'
COPY = 'research/mayhem-current437-programerror-debug-copy-20261029'
SITES = ((80, 3, b'error_len'), (168, 2, b'Utf8Error'), (192, 4, b'valid_up_to'))
SPANS = [[720219, 720228], [720228, 720239], [720239, 720248]]
sha = lambda b: hashlib.sha256(b).hexdigest()



# Common reviewed merged #846 historical data baseline. No open-PR dependency.
REVIEW_BASELINE = 'research/mayhem-current437-bounded-index-tables-20261029/coverage-delta.json'
REVIEW_BASELINE_SHA256 = 'f6efa470f1d18bcec99cab2c95ecf1fc650fe5606bcdbc73956986779e7cb282'
REVIEW_ADDED_RAW = {'.rodata': [[720219, 720248]], '.data.rel.ro': []}
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
    raw = {'.rodata': _review_union(report['intervals']), '.data.rel.ro': []}
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

def module(root, path):
    spec = importlib.util.spec_from_file_location('utf8_previous_' + Path(path).name, root / path / 'proof.py')
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


def trace(image, window, counted):
    start = window['start']
    expected = [(0, 0x79, 0x11, 0, 0), (8, 0xbf, 0x13, 0, 0),
                (16, 0x07, 3, 0, 8), (24, 0x7b, 0x3a, -8, 0),
                (96, 0x7b, 0x3a, -4072, 0), (128, 0x7b, 0x1a, -4088, 0),
                (136, 0x7a, 0x0a, -4064, 9), (144, 0x7a, 0x0a, -4096, 11),
                (152, 0xbf, 0xa5, 0, 0), (160, 0xbf, 0x21, 0, 0),
                (184, 0xb7, 3, 0, 9), (216, 0x95, 0, 0, 0)]
    assert window['end'] - start == 224
    for offset, op, reg, off, imm in expected:
        assert struct.unpack_from('<BBhi', image.b, start + offset) == (op, reg, off, imm)
        assert start + offset not in image.rel
    out = []
    for offset, register, value in SITES:
        pc = start + offset
        op, reg, off, lo = struct.unpack_from('<BBhI', image.b, pc)
        zero, hi = struct.unpack_from('<II', image.b, pc + 8)
        assert (op, reg, off, zero) == (0x18, register, 0, 0)
        assert image.rel.get(pc, {}).get('type') == 8 and image.rel[pc]['symbol_index'] == 0
        assert pc + 8 not in image.rel
        pointer = lo | hi << 32
        assert counted(image, pointer, len(value)) == value
        out.append(dict(offset=offset, pointer=pointer, length=len(value), text=value.decode()))
    op, reg, off, imm = struct.unpack_from('<BBhi', image.b, start + 208)
    assert (op, reg, off) == (0x85, 0x10, 0) and start + 208 not in image.rel
    target = start + 216 + imm * 8
    assert any(d['offset'] == 208 and d['target'] == target for d in window['direct'])
    return dict(owner=start, strings=out, call_target=target)


def inspect(root, original, candidate):
    copy = module(root, COPY)
    old = copy.prior(root)
    baseline = old.inspect(root / copy.PRIOR, original, candidate, root)
    pairs = {tuple(p) for p in baseline['active_pairs']}
    assert (646872, 580552) in pairs
    bundle = old.images(root, original, candidate)
    assert any('Formatter26debug_struct_field2_finish' in s for s in bundle['symbols'][615968])
    left = trace(bundle['original_elf'], bundle['original_windows'][646872], old.counted)
    right = trace(bundle['candidate_elf'], bundle['candidate_windows'][580552], old.counted)
    assert (left['call_target'], right['call_target']) == (682288, 615968)
    assert (left['call_target'], right['call_target']) in pairs
    spans = sorted([[s['pointer'], s['pointer'] + s['length']] for s in left['strings']])
    assert spans == SPANS
    return dict(original=left, candidate=right, intervals=spans)


def delta(root, report):
    return _review_coverage(root, report)



def check(packet, root):
    paths = list(packet.rglob('*'))
    assert all(not p.is_symlink() and (p.is_file() or p.is_dir()) for p in paths)
    assert {str(p.relative_to(packet)): sha(p.read_bytes()) for p in paths if p.is_file() and p.name != 'manifest.json'} == json.loads((packet / 'manifest.json').read_bytes())
    pins = json.loads((packet / 'inputs.json').read_bytes())
    for path, digest in pins.items():
        q = Path(path)
        assert not q.is_absolute() and '..' not in q.parts and sha((root / q).read_bytes()) == digest
    for p in (root / PRIOR).rglob('*'):
        if p.is_file():
            assert str(p.relative_to(root)) in pins
    previous = module(root, PRIOR)
    previous.check(root / PRIOR, root)
    report = inspect(root, *module(root, COPY).images(root))
    assert report == json.loads(gzip.decompress((packet / 'observations.json.gz').read_bytes()))
    assert delta(root, report) == json.loads((packet / 'coverage-delta.json').read_bytes()), 'reviewed coverage delta differs'
    return dict(new_bytes=29, payload_covered=21825, payload_total=26180)


def seal(root):
    report = inspect(root, *module(root, COPY).images(root))
    (P / 'observations.json.gz').write_bytes(gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0))
    (P / 'coverage-delta.json').write_text(json.dumps(delta(root, report), indent=2) + '\n')
    (P / 'manifest.json').write_text(json.dumps({str(p.relative_to(P)): sha(p.read_bytes()) for p in sorted(P.rglob('*')) if p.is_file() and p.name != 'manifest.json'}, indent=2) + '\n')
