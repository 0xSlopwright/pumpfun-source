"""Verify the counted Custom ProgramError formatting prefix only."""
from pathlib import Path
import gzip, hashlib, importlib.util, json, struct
if not __debug__: raise RuntimeError('Assertions required')
P = Path(__file__).resolve().parent
PRIOR = 'research/mayhem-current437-bounded-error-strings-20261029'
HELPER = 'research/mayhem-current437-rust-panic-messages-20261029'
sha = lambda b: hashlib.sha256(b).hexdigest()


# Common reviewed merged #846 historical data baseline. No open-PR dependency.
REVIEW_BASELINE = 'research/mayhem-current437-bounded-index-tables-20261029/coverage-delta.json'
REVIEW_BASELINE_SHA256 = 'f6efa470f1d18bcec99cab2c95ecf1fc650fe5606bcdbc73956986779e7cb282'
REVIEW_ADDED_RAW = {'.rodata': [[720306, 720328]], '.data.rel.ro': []}
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
    spec = importlib.util.spec_from_file_location('prior_packet', root / path / 'proof.py')
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m

def inspect(root, original, candidate):
    prior = module(root, PRIOR)
    helper = module(root, HELPER)
    _, a, b = helper.images(root, original, candidate)
    expected = b'Custom program error: '
    assert len(expected) == 22
    rows = []
    for image, desc, pointer in ((a, 731784, 720306), (b, 712224, 700746)):
        descriptor = helper.descriptor(image, desc, pointer, len(expected))
        payload = helper.rodata_bytes(image, pointer, len(expected))
        assert payload == expected
        rows.append(dict(descriptor=desc, pointer=pointer, length=len(expected), descriptor_hex=descriptor.hex(), bytes_hex=payload.hex()))
    # The previously closed Display owner loads this descriptor for the Custom arm.
    before = prior.prior(root).prior(root)
    bundle = before.images(root, original, candidate)
    base = before.inspect(root / prior.prior(root).PRIOR, original, candidate, root)
    pairs = {tuple(p) for p in base['active_pairs']}
    assert (664640, 598320) in pairs
    for side, owner, target in (('original',664640,731784), ('candidate',598320,712224)):
        window = bundle[side+'_windows'][owner]
        refs = [r for r in window['data_references'] if r['target'] == target]
        assert len(refs) == 1 and refs[0]['offset'] == 664
    return dict(original=rows[0], candidate=rows[1], owner_pair=[664640,598320], descriptor_reference_offset=664, intervals=[[720306,720328]])

def delta(root, report):
    return _review_coverage(root, report)


def images(root):
    return module(root, PRIOR).prior(root).images(root)

def check(packet, root):
    paths = list(packet.rglob('*'))
    assert all(not p.is_symlink() and (p.is_file() or p.is_dir()) for p in paths)
    assert {str(p.relative_to(packet)):sha(p.read_bytes()) for p in paths if p.is_file() and p.name != 'manifest.json'} == json.loads((packet/'manifest.json').read_bytes())
    pins = json.loads((packet/'inputs.json').read_bytes())
    for path, digest in pins.items():
        q = Path(path); assert not q.is_absolute() and '..' not in q.parts
        assert sha((root/q).read_bytes()) == digest
    for p in (root/PRIOR).rglob('*'):
        if p.is_file(): assert str(p.relative_to(root)) in pins
    module(root, PRIOR).check(root/PRIOR, root)
    report = inspect(root, *images(root))
    assert report == json.loads(gzip.decompress((packet/'observations.json.gz').read_bytes()))
    assert delta(root, report) == json.loads((packet/'coverage-delta.json').read_bytes()), 'reviewed coverage delta differs'
    return dict(new_bytes=22, interval=[720306,720328], payload_covered=21818, payload_total=26180)

def seal(root):
    report = inspect(root, *images(root))
    (P/'observations.json.gz').write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0))
    (P/'coverage-delta.json').write_text(json.dumps(delta(root,report),indent=2)+'\n')
    (P/'manifest.json').write_text(json.dumps({str(p.relative_to(P)):sha(p.read_bytes()) for p in sorted(P.rglob('*')) if p.is_file() and p.name != 'manifest.json'},indent=2)+'\n')
