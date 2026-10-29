"""Count three bounded error strings on previously matched paths."""
from pathlib import Path
import gzip, hashlib, importlib.util, json, struct
if not __debug__: raise RuntimeError('Assertions required')
P = Path(__file__).resolve().parent
PRIOR = 'research/mayhem-current437-programerror-debug-copy-20261029'
OTHERS = ('research/mayhem-current437-mayhemerror-debug-names-20261029', 'research/mayhem-current437-rust-panic-messages-20261029')
SITES = {538896:(8, b'Error'), 616776:(8, b'Error'), 620336:(216, b'failed to write whole buffer')}
sha = lambda b: hashlib.sha256(b).hexdigest()

def prior(root):
    spec = importlib.util.spec_from_file_location('prior_copy', root / PRIOR / 'proof.py')
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    return module

def trace(image, window, offset, expected):
    pc = window['start'] + offset
    assert pc + 40 <= window['end']
    op, reg, off, lo = struct.unpack_from('<BBhI', image.b, pc)
    zero, hi = struct.unpack_from('<II', image.b, pc + 8)
    assert (op, reg, off, zero) == (0x18, 2, 0, 0)
    assert image.rel.get(pc, {}).get('type') == 8 and image.rel[pc]['symbol_index'] == 0
    assert not any(pc < p < pc + 16 for p in image.rel)
    assert struct.unpack_from('<BBhi', image.b, pc + 16) == (0xb7, 3, 0, len(expected))
    op, reg, off, imm = struct.unpack_from('<BBhi', image.b, pc + 24)
    assert (op, reg, off) == (0x85, 0x10, 0)
    assert struct.unpack_from('<BBhi', image.b, pc + 32) == (0x95, 0, 0, 0)
    target = pc + 32 + imm * 8
    assert any(d['offset'] == offset + 24 and d['target'] == target for d in window['direct'])
    pointer = lo | (hi << 32)
    old = prior_for_counted
    assert old.counted(image, pointer, len(expected)) == expected
    return dict(pointer=pointer, length=len(expected), pointer_offset=offset, call_target=target, bytes_hex=expected.hex())

def inspect(root, original, candidate):
    global prior_for_counted
    old = prior(root); before = old.prior(root)
    prior_for_counted = before
    base = before.inspect(root / old.PRIOR, original, candidate, root)
    pairs = {tuple(p) for p in base['active_pairs']}
    bundle = before.images(root, original, candidate)
    rows = []
    for owner, (offset, expected) in SITES.items():
        matches = sorted(b for a,b in pairs if a == owner)
        assert matches and (len(matches) == 4 if owner != 620336 else len(matches) == 1)
        for candidate_owner in matches:
            a = trace(bundle['original_elf'], bundle['original_windows'][owner], offset, expected)
            b = trace(bundle['candidate_elf'], bundle['candidate_windows'][candidate_owner], offset, expected)
            assert (a['call_target'], b['call_target']) in pairs
            if owner != 620336:
                before.writer(bundle['original_elf'], bundle['original_windows'][a['call_target']])
                before.writer(bundle['candidate_elf'], bundle['candidate_windows'][b['call_target']])
            else:
                assert 'std2io5error5Error3new' in ' '.join(bundle['symbols'][b['call_target']])
                for side, item in [('original', a), ('candidate', b)]:
                    elf = bundle[side+'_elf']; pc = item['call_target']
                    assert struct.unpack_from('<BBhi', elf.b, pc) == (0xbf, 0x37, 0, 0)
                    assert struct.unpack_from('<BBhi', elf.b, pc+8) == (0xbf, 0x16, 0, 0)
            rows.append(dict(original_owner=owner, candidate_owner=candidate_owner, original=a, candidate=b))
    spans = sorted({(r['original']['pointer'], r['original']['pointer']+r['original']['length']) for r in rows})
    assert spans == [(713383,713388),(713808,713813),(714313,714341)]
    return dict(observations=rows, intervals=[list(s) for s in spans])

def delta(root, report):
    old = prior(root).prior(root); path = root / PRIOR / 'coverage-delta.json'
    baselines = [json.loads(path.read_bytes())] + [json.loads((root/p/'coverage-delta.json').read_bytes()) for p in OTHERS]
    result = []
    for i, section in enumerate(baselines[0]['sections']):
        raw_before = old.union([span for base in baselines for span in base['sections'][i]['raw_intervals']])
        mapped = old.union([span for base in baselines for span in base['sections'][i]['mapped_intervals']])
        before = old.measure(old.union(raw_before + mapped))
        raw = old.union(raw_before + (report['intervals'] if section['section']=='.rodata' else []))
        covered = old.union(raw + mapped); n = old.measure(covered)
        result.append(dict(section=section['section'], total_bytes=section['total_bytes'], raw_intervals=raw, mapped_intervals=mapped, covered_intervals=covered, raw_equal_bytes=old.measure(raw), pointer_only_bytes=n-old.measure(raw), covered_bytes=n, new_bytes=n-before))
    assert [s['new_bytes'] for s in result] == [38,0]
    assert [s['covered_bytes'] for s in result] == [14035,6712]
    return dict(scope='Only immediate-length error string arguments; no allocation or relocation credit.', baseline_delta_sha256={p:sha((root/p/'coverage-delta.json').read_bytes()) for p in (PRIOR, *OTHERS)}, baseline_payload_bytes=20709, baseline_rodata_bytes=13997, baseline_data_rel_ro_bytes=6712, sections=result, new_payload_bytes=38, payload_covered_bytes=20747, payload_total_bytes=26180)

def check(packet, root):
    paths = list(packet.rglob('*'))
    assert all(not p.is_symlink() and (p.is_file() or p.is_dir()) for p in paths)
    assert {str(p.relative_to(packet)):sha(p.read_bytes()) for p in paths if p.is_file() and p.name != 'manifest.json'} == json.loads((packet/'manifest.json').read_bytes())
    pins = json.loads((packet/'inputs.json').read_bytes())
    for path, digest in pins.items():
        q = Path(path); assert not q.is_absolute() and '..' not in q.parts
        assert sha((root/q).read_bytes()) == digest
    for name in (PRIOR, *OTHERS):
        for p in (root/name).rglob('*'):
            if p.is_file(): assert str(p.relative_to(root)) in pins
    old = prior(root); old.check(root/PRIOR, root)
    report = inspect(root, *old.images(root))
    assert report == json.loads(gzip.decompress((packet/'observations.json.gz').read_bytes()))
    assert delta(root, report) == json.loads((packet/'coverage-delta.json').read_bytes())
    return dict(new_bytes=38, payload_covered=20747, payload_total=26180)

def seal(root):
    report = inspect(root, *prior(root).images(root))
    (P/'observations.json.gz').write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0))
    (P/'coverage-delta.json').write_text(json.dumps(delta(root, report),indent=2)+'\n')
    (P/'manifest.json').write_text(json.dumps({str(p.relative_to(P)):sha(p.read_bytes()) for p in sorted(P.rglob('*')) if p.is_file() and p.name != 'manifest.json'},indent=2)+'\n')
