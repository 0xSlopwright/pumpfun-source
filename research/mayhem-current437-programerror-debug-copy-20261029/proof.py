"""Bounded comparison of a second original ProgramError Debug owner."""
from pathlib import Path
import gzip, hashlib, importlib.util, json
if not __debug__: raise RuntimeError('Assertions required')
P = Path(__file__).resolve().parent
PRIOR = 'research/mayhem-current437-programerror-debug-names-20261029'
OWNER = 618552
sha = lambda b: hashlib.sha256(b).hexdigest()

def prior(root):
    spec = importlib.util.spec_from_file_location('prior_debug', root / PRIOR / 'proof.py')
    module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
    return module

def inspect(root, original, candidate):
    old = prior(root)
    baseline = old.inspect(root / PRIOR, original, candidate, root)
    pairs = {tuple(p) for p in baseline['active_pairs']}
    bundle = old.images(root, original, candidate)
    variants = old.source_context(root / PRIOR, root)['static_variants']
    owner_pairs = sorted(p for p in pairs if p[0] == OWNER)
    assert owner_pairs == [(OWNER, 38832), (OWNER, 552232)]
    rows = []
    for left, right in owner_pairs:
        assert any('solana_program_error..ProgramError' in n and 'Debug' in n for n in bundle['symbols'][right])
        for variant in variants:
            a = old.trace(bundle['original_elf'], bundle['original_windows'][left], variant['observed_tag'])
            b = old.trace(bundle['candidate_elf'], bundle['candidate_windows'][right], variant['observed_tag'])
            name = variant['name'].encode()
            assert a['bytes_hex'] == b['bytes_hex'] == name.hex()
            assert a['length'] == b['length'] == len(name)
            for key in ('pointer_offset', 'length_offset', 'call_offset', 'path_offsets'):
                assert a[key] == b[key]
            assert (a['call_target'], b['call_target']) in pairs
            old.writer(bundle['original_elf'], bundle['original_windows'][a['call_target']])
            old.writer(bundle['candidate_elf'], bundle['candidate_windows'][b['call_target']])
            rows.append(dict(tag=variant['observed_tag'], name=variant['name'], original_owner=left, candidate_owner=right, original=a, candidate=b))
    spans = sorted({(r['original']['pointer'], r['original']['pointer'] + r['original']['length']) for r in rows})
    assert len(spans) == 25 and old.union(spans) == [[713819, 714313]] and sum(b-a for a,b in spans) == 494
    return dict(owner_pairs=[list(p) for p in owner_pairs], observations=rows, intervals=[list(p) for p in spans])

def delta(root, report):
    old = prior(root)
    path = root / PRIOR / 'coverage-delta.json'
    baseline = json.loads(path.read_bytes())
    result = []
    for section in baseline['sections']:
        raw = old.union(section['raw_intervals'] + (report['intervals'] if section['section'] == '.rodata' else []))
        mapped = section['mapped_intervals']
        covered = old.union(raw + mapped)
        n = old.measure(covered)
        result.append(dict(section=section['section'], total_bytes=section['total_bytes'], raw_intervals=raw, mapped_intervals=mapped, covered_intervals=covered, raw_equal_bytes=old.measure(raw), pointer_only_bytes=n-old.measure(raw), covered_bytes=n, new_bytes=n-section['covered_bytes']))
    assert [s['new_bytes'] for s in result] == [494, 0]
    return dict(scope='Only immediate-length ProgramError Debug names; no allocation or relocation credit.', prior_delta_sha256=sha(path.read_bytes()), baseline_payload_bytes=19239, baseline_rodata_bytes=12783, baseline_data_rel_ro_bytes=6456, sections=result, new_payload_bytes=494, payload_covered_bytes=19733, payload_total_bytes=26180)

def images(root):
    return ((root/'evidence/original/mayhem/deployed.so').read_bytes(), gzip.decompress((root/'research/mayhem-current437-composition-20261028/builds/first/symbols.so.gz').read_bytes()))

def check(packet, root):
    paths = list(packet.rglob('*'))
    assert all(not p.is_symlink() and (p.is_file() or p.is_dir()) for p in paths)
    actual = {str(p.relative_to(packet)):sha(p.read_bytes()) for p in paths if p.is_file() and p.name != 'manifest.json'}
    assert actual == json.loads((packet/'manifest.json').read_bytes())
    pins = json.loads((packet/'inputs.json').read_bytes())
    for path, digest in pins.items():
        q = Path(path); assert not q.is_absolute() and '..' not in q.parts
        assert sha((root/q).read_bytes()) == digest
    for p in (root/PRIOR).rglob('*'):
        if p.is_file(): assert str(p.relative_to(root)) in pins
    prior(root).check(root/PRIOR, root)
    report = inspect(root, *images(root))
    assert report == json.loads(gzip.decompress((packet/'observations.json.gz').read_bytes()))
    assert delta(root, report) == json.loads((packet/'coverage-delta.json').read_bytes())
    return {'names':25, 'new_bytes':494, 'payload_covered':19733, 'payload_total':26180}

def seal(root):
    report = inspect(root, *images(root))
    (P/'observations.json.gz').write_bytes(gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0))
    (P/'coverage-delta.json').write_text(json.dumps(delta(root, report), indent=2)+'\n')
    (P/'manifest.json').write_text(json.dumps({str(p.relative_to(P)):sha(p.read_bytes()) for p in sorted(P.rglob('*')) if p.is_file() and p.name != 'manifest.json'}, indent=2)+'\n')
