"""验证两个由机器指令限定索引范围的只读表。"""
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
BASELINE = 'research/mayhem-current437-bounded-encoding-20261029'
SITES = (
    (636184, 569864, 872, 2, bytes(104), 719932),
    (657952, 591632, 5840, 5, b'123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz', 720248),
)
sha = lambda b: hashlib.sha256(b).hexdigest()


def prior(root):
    spec = importlib.util.spec_from_file_location('prior_bounded', root / PRIOR / 'proof.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def trace(image, window, offset, reg, expected):
    pc = window['start'] + offset
    assert window['start'] <= pc - 56 and pc + 40 <= window['end']
    op, regs, off, lo = struct.unpack_from('<BBhI', image.b, pc)
    zero, hi = struct.unpack_from('<II', image.b, pc + 8)
    assert (op, regs, off, zero) == (0x18, reg, 0, 0)
    assert image.rel.get(pc, {}).get('type') == 8 and image.rel[pc]['symbol_index'] == 0
    assert not any(pc < x < pc + 16 for x in image.rel)
    assert sorted(x for x in image.rel if pc - 56 <= x < pc + 40) == [pc]
    # 索引越界时跳过读取；表一按四字节读取，表二按单字节读取。
    if reg == 2:
        checks = { -24:(0x35,0,9,26), -16:(0xbf,1,0,0), -8:(0x67,1,0,2),
                   16:(0x0f,0x12,0,0), 24:(0x61,0x21,0,0) }
    else:
        checks = { -56:(0x71,0x22,0,0), -48:(0x35,2,32,58),
                   -40:(0xbf,0x50,0,0), -32:(0x07,0,0,1),
                   -24:(0xbf,0xa6,0,0), -16:(0x07,6,0,-120), -8:(0x0f,0x56,0,0),
                   16:(0x0f,0x25,0,0), 24:(0x71,0x52,0,0), 32:(0x73,0x26,0,0) }
    for delta, instruction in checks.items():
        assert struct.unpack_from('<BBhi', image.b, pc + delta) == instruction
    pointer = lo | (hi << 32)
    section = next(s for s in image.sections if s['name'] == '.rodata')
    assert section['address'] <= pointer and pointer + len(expected) <= section['address'] + section['size']
    assert not any(pointer <= x < pointer + len(expected) for x in image.rel)
    at = section['offset'] + pointer - section['address']
    assert image.b[at:at + len(expected)] == expected
    return dict(pointer=pointer, length=len(expected), pointer_offset=offset, bytes_hex=expected.hex())


def inspect(root):
    prev = prior(root)
    copy = prev.prior(root)
    names = copy.prior(root)
    original, candidate = copy.images(root)
    base = names.inspect(root / copy.PRIOR, original, candidate, root)
    pairs = {tuple(pair) for pair in base['active_pairs']}
    bundle = names.images(root, original, candidate)
    rows = []
    for left, right, offset, reg, expected, address in SITES:
        assert (left, right) in pairs
        assert sorted(b for a,b in pairs if a == left) == [right]
        a = trace(bundle['original_elf'], bundle['original_windows'][left], offset, reg, expected)
        b = trace(bundle['candidate_elf'], bundle['candidate_windows'][right], offset, reg, expected)
        assert a['pointer'] == address
        rows.append(dict(original_owner=left, candidate_owner=right, original=a, candidate=b))
    return dict(observations=rows, intervals=[[s[5], s[5] + len(s[4])] for s in SITES])


def delta(root, report):
    old = prior(root).prior(root).prior(root)
    path = root / BASELINE / 'coverage-delta.json'
    baseline = json.loads(path.read_bytes())
    result = []
    for section in baseline['sections']:
        raw = old.union(section['raw_intervals'] + (report['intervals'] if section['section'] == '.rodata' else []))
        mapped = section['mapped_intervals']
        covered = old.union(raw + mapped)
        n = old.measure(covered)
        result.append(dict(section=section['section'], total_bytes=section['total_bytes'], raw_intervals=raw, mapped_intervals=mapped, covered_intervals=covered, raw_equal_bytes=old.measure(raw), pointer_only_bytes=n-old.measure(raw), covered_bytes=n, new_bytes=n-section['covered_bytes']))
    assert [s['new_bytes'] for s in result] == [162, 0]
    assert [s['covered_bytes'] for s in result] == [14972,6824]
    return dict(scope='Only bounded index table bytes; no allocation or relocation credit.', prior_delta_sha256=sha(path.read_bytes()), baseline_payload_bytes=21634, baseline_rodata_bytes=14810, baseline_data_rel_ro_bytes=6824, sections=result, new_payload_bytes=162, payload_covered_bytes=21796, payload_total_bytes=26180)


def check(packet, root):
    paths = list(packet.rglob('*'))
    assert all(not p.is_symlink() and (p.is_file() or p.is_dir()) for p in paths)
    assert {str(p.relative_to(packet)):sha(p.read_bytes()) for p in paths if p.is_file() and p.name != 'manifest.json'} == json.loads((packet/'manifest.json').read_bytes())
    pins = json.loads((packet/'inputs.json').read_bytes())
    for path, digest in pins.items():
        q = Path(path)
        assert not q.is_absolute() and '..' not in q.parts
        assert sha((root/q).read_bytes()) == digest
    for p in (root/PRIOR).rglob('*'):
        if p.is_file(): assert str(p.relative_to(root)) in pins
    prior(root).check(root/PRIOR, root)
    for p in (root/BASELINE).rglob('*'):
        if p.is_file(): assert str(p.relative_to(root)) in pins
    spec = importlib.util.spec_from_file_location('encoding_baseline', root / BASELINE / 'proof.py')
    baseline_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(baseline_module)
    baseline_module.check(root / BASELINE, root)
    report = inspect(root)
    assert report == json.loads(gzip.decompress((packet/'observations.json.gz').read_bytes()))
    assert delta(root, report) == json.loads((packet/'coverage-delta.json').read_bytes())
    return dict(new_bytes=162, intervals=report['intervals'], payload_covered=21796, payload_total=26180)


def seal(root):
    report = inspect(root)
    (P/'observations.json.gz').write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0))
    (P/'coverage-delta.json').write_text(json.dumps(delta(root, report),indent=2)+'\n')
    (P/'manifest.json').write_text(json.dumps({str(p.relative_to(P)):sha(p.read_bytes()) for p in sorted(P.rglob('*')) if p.is_file() and p.name != 'manifest.json'},indent=2)+'\n')
