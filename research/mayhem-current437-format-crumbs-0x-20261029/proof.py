"""Counted format-crumb and `0x` prefix .rodata bytes on qualified437.

Only classic lddw/mov text-site immediates bound these crumbs. NUL bytes, the
following byte and adjacent strings are not bounds. Early undecoded crumbs in
`[723439,723447)`, the digit table and `[...]` placeholder in
`[723458,723663)` are left open. No descriptor or relocation-table credit.
Only static bytes are inspected.
"""
from pathlib import Path
import gzip, hashlib, importlib.util, json, struct
if not __debug__:
    raise RuntimeError('Assertions are required')

P = Path(__file__).resolve().parent
PRIOR = 'research/mayhem-current437-option-seeds-paths-20261029'
OPTION_SEEDS_DELTA = 'research/mayhem-current437-option-seeds-paths-20261029/coverage-delta.json'
OPTION_SEEDS_SHA = 'e8f6c7f03f18b6e8ce94d778cc9c4aaa56de798ad5a634412e8cf79ce9dedf2d'
MERGE = ((OPTION_SEEDS_DELTA, OPTION_SEEDS_SHA),)
sha = lambda data: hashlib.sha256(data).hexdigest()

# (original_ptr, length, text) -- each string is bounded by a classic text-site
# immediate length, never by a NUL byte or a neighbour.
STRINGS = (
    (723447, 2, ',\n'),
    (723449, 1, '}'),
    (723450, 2, ' }'),
    (723452, 1, '('),
    (723453, 2, '(\n'),
    (723455, 1, ','),
    (723456, 2, '0x'),
)

CANDIDATE_STRINGS = (
    703887, 703889, 703890, 703892, 703893, 703895, 703896,
)

# Assigned .rodata union (exclusive ends). Seven classic-bounded crumbs only.
RODATA_SPANS = (
    (723447, 723458),
)

DESCRIPTORS = ()

# (original_pc, candidate_pc, original_ptr, candidate_ptr, length, length_register)
TEXT_SITES = (
    (676792, 610472, 723447, 703887, 2, 3),
    (676960, 610640, 723450, 703890, 2, 3),
    (677016, 610696, 723449, 703889, 1, 3),
    (677640, 611320, 723447, 703887, 2, 3),
    (677864, 611544, 723455, 703895, 1, 3),
    (682592, 616272, 723450, 703890, 2, 3),
    (682648, 616328, 723449, 703889, 1, 3),
    (682952, 616632, 723452, 703892, 1, 3),
    (683064, 616744, 723453, 703893, 2, 3),
    (683312, 616992, 723447, 703887, 2, 3),
    (683424, 617104, 723455, 703895, 1, 3),
    (691352, 625032, 723456, 703896, 2, 4),
    (691632, 625312, 723456, 703896, 2, 4),
    (691920, 625600, 723456, 703896, 2, 4),
    (692208, 625888, 723456, 703896, 2, 4),
    (692472, 626152, 723456, 703896, 2, 4),
    (692736, 626416, 723456, 703896, 2, 4),
    (693296, 626976, 723456, 703896, 2, 4),
)



# Common reviewed merged #846 historical data baseline. No open-PR dependency.
REVIEW_BASELINE = 'research/mayhem-current437-bounded-index-tables-20261029/coverage-delta.json'
REVIEW_BASELINE_SHA256 = 'f6efa470f1d18bcec99cab2c95ecf1fc650fe5606bcdbc73956986779e7cb282'
REVIEW_ADDED_RAW = {'.rodata': [[723447, 723458]], '.data.rel.ro': []}
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
    observations = report['observations']
    raw = {'.rodata': _review_union([[s['original_ptr'],s['original_ptr']+s['length']] for s in observations['strings']]),
        '.data.rel.ro': _review_union([[d['original_offset']+8,d['original_offset']+16] for d in observations['descriptors']])}
    mapped = {'.rodata': [], '.data.rel.ro': _review_union([[d['original_offset'],d['original_offset']+8] for d in observations['descriptors']])}
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

def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    loaded = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(loaded)
    return loaded


def prior_proof(root):
    return module('format_crumbs_0x_prior', root / PRIOR / 'proof.py')


def readers(root):
    return prior_proof(root).readers(root)


def images(root, original, candidate):
    return prior_proof(root).images(root, original, candidate)


def candidate_bytes(root):
    return prior_proof(root).candidate_bytes(root)


def union(intervals):
    out = []
    for start, end in sorted(map(tuple, intervals)):
        if out and start <= out[-1][1]:
            out[-1][1] = max(end, out[-1][1])
        else:
            out.append([start, end])
    return out


def measure(intervals):
    return sum(end - start for start, end in intervals)


def rodata_bytes(image, address, length):
    assert 0 < length <= 256
    sections = [
        section for section in image.sections
        if section['name'] == '.rodata' and section['type'] != 8 and section['flags'] & 2
        and section['address'] <= address and address + length <= section['address'] + section['size']
    ]
    assert len(sections) == 1
    assert not any(address <= reloc < address + length for reloc in image.rel)
    section = sections[0]
    at = section['offset'] + address - section['address']
    return image.b[at:at + length]


def text_site(image, pc, pointer, length, length_register):
    assert image.lo <= pc and pc + 24 <= image.hi
    assert sorted(reloc for reloc in image.rel if pc <= reloc < pc + 24) == [pc]
    reloc = image.rel[pc]
    assert reloc['type'] == 8 and reloc['symbol_index'] == 0
    opcode, register, branch, immediate = struct.unpack_from('<BBhi', image.b, pc)
    assert opcode == 0x18 and branch == 0 and register == length_register - 1, 'pointer argument register'
    continuation, high = struct.unpack_from('<II', image.b, pc + 8)
    assert continuation == 0
    assert ((immediate & 0xffffffff) | (high << 32)) == pointer
    assert struct.unpack_from('<BBhi', image.b, pc + 16) == (0xb7, length_register, 0, length)
    return image.b[pc:pc + 24]


def verify_strings(original_elf, candidate_elf):
    rows = []
    for index, ((pointer, length, text), candidate_pointer) in enumerate(
        zip(STRINGS, CANDIDATE_STRINGS)
    ):
        expected = text.encode()
        assert len(expected) == length
        original = rodata_bytes(original_elf, pointer, length)
        candidate = rodata_bytes(candidate_elf, candidate_pointer, length)
        assert original == expected and candidate == expected
        assert original == candidate
        rows.append(dict(
            index=index,
            original_ptr=pointer,
            candidate_ptr=candidate_pointer,
            length=length,
            text=text,
            original_bytes_hex=original.hex(),
            candidate_bytes_hex=candidate.hex(),
        ))
    return rows


def verify_descriptors(original_elf, candidate_elf):
    del original_elf, candidate_elf
    assert DESCRIPTORS == ()
    return []


def verify_text_sites(original_elf, candidate_elf):
    by_pointer = {pointer: (length, text) for pointer, length, text in STRINGS}
    by_pointer.update({
        pointer: (length, text)
        for pointer, (__pointer, length, text) in zip(CANDIDATE_STRINGS, STRINGS)
    })
    rows = []
    for original_pc, candidate_pc, original_ptr, candidate_ptr, length, register in TEXT_SITES:
        assert by_pointer[original_ptr] == by_pointer[candidate_ptr]
        assert by_pointer[original_ptr][0] == length
        original = text_site(original_elf, original_pc, original_ptr, length, register)
        candidate = text_site(candidate_elf, candidate_pc, candidate_ptr, length, register)
        assert rodata_bytes(original_elf, original_ptr, length) == rodata_bytes(
            candidate_elf, candidate_ptr, length
        )
        rows.append(dict(
            original_pc=original_pc,
            candidate_pc=candidate_pc,
            original_ptr=original_ptr,
            candidate_ptr=candidate_ptr,
            length=length,
            length_register=register,
            original_bytes_hex=original.hex(),
            candidate_bytes_hex=candidate.hex(),
        ))
    return rows


def verify_images(original_elf, candidate_elf):
    return dict(
        strings=verify_strings(original_elf, candidate_elf),
        descriptors=verify_descriptors(original_elf, candidate_elf),
        text_sites=verify_text_sites(original_elf, candidate_elf),
    )


def inspect(packet, original, candidate, root):
    before = prior_proof(root).inspect(root / PRIOR, original, candidate, root)
    prefix, original_elf, candidate_elf = images(root, original, candidate)
    del prefix
    observations = verify_images(original_elf, candidate_elf)
    literal_intervals = union(
        (row['original_ptr'], row['original_ptr'] + row['length'])
        for row in observations['strings']
    )
    descriptor_intervals = union(
        (row['original_offset'], row['original_offset'] + 16)
        for row in observations['descriptors']
    )
    assert literal_intervals == [list(span) for span in RODATA_SPANS]
    assert measure(literal_intervals) == 11
    assert descriptor_intervals == []
    summary = dict(
        normalized_windows=before['summary']['normalized_windows'],
        raw_windows=before['summary']['raw_windows'],
        extended_windows=before['summary']['extended_windows'],
        extended_pairs=before['summary']['extended_pairs'],
        rejected_pairs=before['summary']['rejected_pairs'],
        string_count=len(observations['strings']),
        descriptor_count=len(observations['descriptors']),
        text_site_count=len(observations['text_sites']),
        literal_bytes=measure(literal_intervals),
        descriptor_bytes=measure(descriptor_intervals),
    )
    return dict(summary=summary, observations=observations)


def merged_priors(root):
    out = []
    for path, digest in MERGE:
        data = (root / path).read_bytes()
        assert sha(data) == digest
        out.append(json.loads(data))
    return out


def coverage_delta(root, report):
    return _review_coverage(root, report)



def inventory(packet):
    return {
        str(path.relative_to(packet)): sha(path.read_bytes())
        for path in sorted(packet.rglob('*'))
        if path.is_file()
        and path.name != 'manifest.json'
        and '__pycache__' not in path.parts
        and path.suffix != '.pyc'
    }


def check(packet, root):
    paths = list(packet.rglob('*'))
    assert not any(path.is_symlink() for path in paths), 'packet symlink'
    assert all(path.is_file() or path.is_dir() for path in paths), 'packet special file'
    assert inventory(packet) == json.loads((packet / 'manifest.json').read_bytes()), (
        'packet inventory differs'
    )
    pinned = json.loads((packet / 'inputs.json').read_bytes())
    for path, digest in pinned.items():
        relative = Path(path)
        assert not relative.is_absolute() and '..' not in relative.parts
        assert sha((root / relative).read_bytes()) == digest, path
    for path in (root / PRIOR).rglob('*'):
        if path.is_file() and '__pycache__' not in path.parts and path.suffix != '.pyc':
            assert str(path.relative_to(root)) in pinned, path
    prior_proof(root).check(root / PRIOR, root)
    original = (root / 'evidence/original/mayhem/deployed.so').read_bytes()
    candidate = candidate_bytes(root)
    report = inspect(packet, original, candidate, root)
    assert report == json.loads(
        gzip.decompress((packet / 'observations.json.gz').read_bytes())
    ), 'fresh observations differ'
    delta = coverage_delta(root, report)
    assert delta == json.loads((packet / 'coverage-delta.json').read_bytes()), (
        'coverage delta differs'
    )
    summary = dict(report['summary'])
    summary['new_payload_bytes'] = delta['new_payload_bytes']
    assert (
        summary['normalized_windows'],
        summary['raw_windows'],
        summary['extended_windows'],
        summary['extended_pairs'],
    ) == (437, 141, 431, 581)
    assert (
        summary['string_count'],
        summary['descriptor_count'],
        summary['text_site_count'],
    ) == (7, 0, 18)
    assert (summary['literal_bytes'], summary['descriptor_bytes'], summary['new_payload_bytes']) == (
        11, 0, 11
    )
    assert summary['rejected_pairs'] == 0
    assert (
        delta['baseline_payload_bytes'],
        delta['payload_covered_bytes'],
        delta['payload_total_bytes'],
    ) == (21796, 21807, 26180)
    assert (delta['baseline_rodata_bytes'], delta['baseline_data_rel_ro_bytes']) == (14972, 6824)
    assert all(
        row['original_bytes_hex'] == row['candidate_bytes_hex']
        for row in report['observations']['strings']
    )
    return summary


def seal(packet=None, root=None):
    packet = packet or P
    root = root or next(
        parent for parent in packet.parents
        if (parent / 'evidence/original/mayhem/deployed.so').is_file()
    )
    original = (root / 'evidence/original/mayhem/deployed.so').read_bytes()
    report = inspect(packet, original, candidate_bytes(root), root)
    (packet / 'observations.json.gz').write_bytes(
        gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0)
    )
    delta = coverage_delta(root, report)
    (packet / 'coverage-delta.json').write_text(json.dumps(delta, indent=2) + '\n')
    (packet / 'manifest.json').write_text(json.dumps(inventory(packet), indent=2) + '\n')
    summary = dict(report['summary'])
    summary['new_payload_bytes'] = delta['new_payload_bytes']
    return summary


if __name__ == '__main__':
    print(json.dumps(seal(), indent=2))
