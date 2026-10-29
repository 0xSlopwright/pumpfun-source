"""Count one slice-index panic literal shared by two descriptors.

The 34-byte `.rodata` literal ` out of range for slice of length ` is the
immediate-length target of two distinct 16-byte `.data.rel.ro` descriptors
(`u32 low = 0`, `u32 pointer`, `u64 length`). The two descriptors are the second
and fourth entries of the six-entry slice-index panic table; the first and
fifth entries are already claimed by other packets and the third is a different
literal, so only these two records and the shared literal are counted. Only
static bytes are read. The merged baseline is recomputed as a union from path +
SHA-256 of the sealed deltas; it is never summed or frozen.
"""
from pathlib import Path
import gzip
import hashlib
import json
import os
import struct
import sys
import tempfile

if not __debug__:
    raise RuntimeError('Assertions are required')

P = Path(__file__).resolve().parent
REPO = next(
    parent for parent in P.parents
    if (parent / 'evidence/original/mayhem/deployed.so').is_file()
)
ORIGINAL = 'evidence/original/mayhem/deployed.so'
CANDIDATE = 'research/mayhem-current437-composition-20261028/builds/first/candidate.so.gz'
BASELINE = 'baseline/sources.json'
sha = lambda data: hashlib.sha256(data).hexdigest()

TEXT = b' out of range for slice of length '
LENGTH = 34
POINTER = 0xb10e6
POINTER_CANDIDATE = 0xac47e
DESCRIPTORS = (0xb2fd0, 0xb2ff0)
DESCRIPTORS_CANDIDATE = (0xae368, 0xae388)
NEIGHBOUR = dict(offset=0xb2fe0, pointer=0xad778, length=16, text=b'range end index ', candidate=0xae378, candidate_pointer=0xa8c20)

sys.path.insert(0, str(REPO / 'scripts'))
from window_elf_reader import Elf  # noqa: E402


def union(intervals):
    out = []
    for start, end in sorted(map(tuple, intervals)):
        assert 0 <= start < end
        if out and start <= out[-1][1]:
            out[-1][1] = max(out[-1][1], end)
        else:
            out.append([start, end])
    return out


def measure(intervals):
    return sum(end - start for start, end in intervals)


def section(image, name, address, size):
    item = image.secs[name]
    assert item[3] <= address and address + size <= item[3] + item[5]
    return item


def read(image, name, address, size):
    item = section(image, name, address, size)
    start = item[4] + address - item[3]
    return image.b[start:start + size]


def relocation(image, address):
    item = image.secs.get('.rel.dyn')
    assert item is not None
    for position in range(item[4], item[4] + item[5], 16):
        at, info = struct.unpack_from('<QQ', image.b, position)
        if at == address:
            return dict(type=info & 0xffffffff, symbol_index=info >> 32)
    return None


def descriptor(image, address, pointer, expected=LENGTH):
    raw = read(image, '.data.rel.ro', address, 16)
    low, high, length = struct.unpack('<IIQ', raw)
    assert low == 0, 'descriptor low word is not zero'
    assert high == pointer, (hex(high), hex(pointer))
    assert length == expected, length
    assert relocation(image, address) == dict(type=8, symbol_index=0)
    assert relocation(image, address + 8) is None, 'length half must be raw'
    return dict(
        offset=address,
        raw_hex=raw.hex(),
        low_word=low,
        pointer=high,
        length=length,
        relocation=relocation(image, address),
    )


def descriptors_for(image, pointer, length):
    found = []
    item = image.secs['.data.rel.ro']
    for address in range(item[3], item[3] + item[5] - 15, 8):
        low, high, at_length = struct.unpack(
            '<IIQ', read(image, '.data.rel.ro', address, 16)
        )
        if (low, high, at_length) == (0, pointer, length):
            found.append(address)
    return found


def elf_from_gzip(path):
    temporary = tempfile.NamedTemporaryFile(delete=False, suffix='.so')
    try:
        temporary.write(gzip.decompress(path.read_bytes()))
        temporary.close()
        return Elf(Path(temporary.name))
    finally:
        try:
            os.unlink(temporary.name)
        except FileNotFoundError:
            pass


def verify_images(original, candidate):
    assert len(TEXT) == LENGTH
    assert read(original, '.rodata', POINTER, LENGTH) == TEXT
    assert read(candidate, '.rodata', POINTER_CANDIDATE, LENGTH) == TEXT
    assert descriptors_for(original, POINTER, LENGTH) == list(DESCRIPTORS)
    assert descriptors_for(candidate, POINTER_CANDIDATE, LENGTH) == list(DESCRIPTORS_CANDIDATE)
    rows = []
    for old_at, new_at in zip(DESCRIPTORS, DESCRIPTORS_CANDIDATE):
        old = descriptor(original, old_at, POINTER)
        new = descriptor(candidate, new_at, POINTER_CANDIDATE)
        rows.append(dict(original=old, candidate=new))
    neighbour = descriptor(original, NEIGHBOUR['offset'], NEIGHBOUR['pointer'], NEIGHBOUR['length'])
    assert read(original, '.rodata', NEIGHBOUR['pointer'], NEIGHBOUR['length']) == NEIGHBOUR['text']
    assert neighbour['offset'] not in DESCRIPTORS
    neighbour_candidate = descriptor(candidate, NEIGHBOUR['candidate'], NEIGHBOUR['candidate_pointer'], NEIGHBOUR['length'])
    assert read(candidate, '.rodata', NEIGHBOUR['candidate_pointer'], NEIGHBOUR['length']) == NEIGHBOUR['text']
    return dict(
        summary=dict(
            string_bytes=LENGTH,
            descriptors=len(DESCRIPTORS),
            descriptor_bytes=16 * len(DESCRIPTORS),
            descriptor_raw_bytes=8 * len(DESCRIPTORS),
            descriptor_mapped_bytes=8 * len(DESCRIPTORS),
            new_payload_bytes=LENGTH + 16 * len(DESCRIPTORS),
        ),
        string=dict(
            original_ptr=POINTER,
            candidate_ptr=POINTER_CANDIDATE,
            length=LENGTH,
            text=TEXT.decode(),
            original_hex=read(original, '.rodata', POINTER, LENGTH).hex(),
            candidate_hex=read(candidate, '.rodata', POINTER_CANDIDATE, LENGTH).hex(),
        ),
        descriptors=rows,
        unclaimed_neighbour=dict(
            offset=NEIGHBOUR['offset'],
            candidate_offset=NEIGHBOUR['candidate'],
            pointer=NEIGHBOUR['pointer'],
            candidate_pointer=NEIGHBOUR['candidate_pointer'],
            length=NEIGHBOUR['length'],
            text=NEIGHBOUR['text'].decode(),
            counted=False,
        ),
    )


def inspect():
    original = Elf(REPO / ORIGINAL)
    candidate = elf_from_gzip(REPO / CANDIDATE)
    return verify_images(original, candidate)


def baseline_union(packet=P):
    sources = json.loads((packet / BASELINE).read_bytes())
    sections = {}
    for section_name, total in (('.rodata', 18396), ('.data.rel.ro', 7784)):
        raw = []
        mapped = []
        covered = []
        for path, digest in sources['deltas'].items():
            data = (REPO / path).read_bytes()
            assert sha(data) == digest, path
            delta = json.loads(data)
            item = next(row for row in delta['sections'] if row['section'] == section_name)
            raw.extend(item['raw_intervals'])
            mapped.extend(item['mapped_intervals'])
            covered.extend(item['covered_intervals'])
        raw = union(raw)
        mapped = union(mapped)
        covered = union(covered)
        assert union(raw + mapped) == covered, section_name
        assert all(0 <= start < end for start, end in covered)
        sections[section_name] = dict(
            section=section_name,
            total_bytes=total,
            raw_intervals=raw,
            mapped_intervals=mapped,
            covered_intervals=covered,
            raw_equal_bytes=measure(raw),
            pointer_only_bytes=measure(covered) - measure(raw),
            covered_bytes=measure(covered),
        )
    assert sum(item['covered_bytes'] for item in sections.values()) == sources['payload_covered_bytes']
    assert sum(item['total_bytes'] for item in sections.values()) == sources['payload_total_bytes']
    return sections


def coverage(report, packet=P):
    sources = json.loads((packet / BASELINE).read_bytes())
    sections = []
    for name, old in baseline_union(packet).items():
        raw = list(old['raw_intervals'])
        mapped = list(old['mapped_intervals'])
        if name == '.rodata':
            raw.append([POINTER, POINTER + LENGTH])
        elif name == '.data.rel.ro':
            for offset in DESCRIPTORS:
                raw.append([offset + 8, offset + 16])
                mapped.append([offset, offset + 8])
        else:
            raise AssertionError(name)
        raw = union(raw)
        mapped = union(mapped)
        covered = union(raw + mapped)
        sections.append(dict(
            section=name,
            total_bytes=old['total_bytes'],
            raw_intervals=raw,
            mapped_intervals=mapped,
            covered_intervals=covered,
            raw_equal_bytes=measure(raw),
            pointer_only_bytes=measure(covered) - measure(raw),
            covered_bytes=measure(covered),
            new_bytes=measure(covered) - old['covered_bytes'],
        ))
    by_name = {item['section']: item for item in sections}
    assert by_name['.rodata']['new_bytes'] == LENGTH
    assert by_name['.data.rel.ro']['new_bytes'] == 16 * len(DESCRIPTORS)
    total = sum(item['covered_bytes'] for item in sections)
    assert total == sources['payload_covered_bytes'] + LENGTH + 16 * len(DESCRIPTORS)
    return dict(
        scope='One observed 34-byte slice-index panic literal and the two unclaimed 16-byte descriptors that both resolve to it; the third entry of the same table and all code sites are excluded.',
        baseline_commit=sources['baseline_commit'],
        baseline_deltas=sources['deltas'],
        baseline_payload_bytes=sources['payload_covered_bytes'],
        baseline_rodata_bytes=by_name['.rodata']['covered_bytes'] - LENGTH,
        baseline_data_rel_ro_bytes=by_name['.data.rel.ro']['covered_bytes'] - 16 * len(DESCRIPTORS),
        sections=sections,
        new_payload_bytes=sum(item['new_bytes'] for item in sections),
        new_rodata_bytes=by_name['.rodata']['new_bytes'],
        new_data_rel_ro_bytes=by_name['.data.rel.ro']['new_bytes'],
        payload_covered_bytes=total,
        payload_total_bytes=sum(item['total_bytes'] for item in sections),
    )


def check(packet=P, root=REPO):
    paths = list(packet.rglob('*'))
    assert not any(path.is_symlink() for path in paths), 'packet symlink'
    assert all(path.is_file() or path.is_dir() for path in paths), 'packet special file'
    found = {
        str(path.relative_to(packet)): sha(path.read_bytes())
        for path in paths
        if path.is_file()
        and path.name != 'manifest.json'
        and '__pycache__' not in path.parts
        and path.suffix != '.pyc'
    }
    assert found == json.loads((packet / 'manifest.json').read_bytes()), 'packet inventory differs'
    pins = json.loads((packet / 'inputs.json').read_bytes())
    for path, digest in pins.items():
        relative = Path(path)
        assert not relative.is_absolute() and '..' not in relative.parts
        assert sha((root / relative).read_bytes()) == digest, path
    report = inspect()
    assert report == json.loads(gzip.decompress((packet / 'observations.json.gz').read_bytes())), 'fresh observations differ'
    delta = coverage(report, packet)
    assert delta == json.loads((packet / 'coverage-delta.json').read_bytes()), 'coverage delta differs'
    summary = report['summary']
    assert (
        summary['string_bytes'], summary['descriptors'], summary['descriptor_bytes'],
        summary['descriptor_raw_bytes'], summary['descriptor_mapped_bytes'],
        summary['new_payload_bytes'],
    ) == (34, 2, 32, 16, 16, 66)
    assert delta['new_payload_bytes'] == 66
    assert delta['new_rodata_bytes'] == 34
    assert delta['new_data_rel_ro_bytes'] == 32
    assert delta['baseline_payload_bytes'] + 66 == delta['payload_covered_bytes']
    by_name = {item['section']: item for item in delta['sections']}
    assert by_name['.rodata']['new_bytes'] == 34
    assert by_name['.data.rel.ro']['new_bytes'] == 32
    assert report['string']['text'] == TEXT.decode()
    assert report['string']['original_hex'] == TEXT.hex()
    assert report['string']['candidate_hex'] == TEXT.hex()
    for row in report['descriptors']:
        assert row['original']['pointer'] == POINTER
        assert row['candidate']['pointer'] == POINTER_CANDIDATE
        assert row['original']['length'] == 34
        assert row['candidate']['length'] == 34
        assert row['original']['relocation'] == dict(type=8, symbol_index=0)
        assert row['candidate']['relocation'] == dict(type=8, symbol_index=0)
    neighbour = report['unclaimed_neighbour']
    assert neighbour['counted'] is False
    for row in report['descriptors']:
        assert neighbour['offset'] not in (row['original']['offset'], row['candidate']['offset'])
    return summary


def seal(packet=P, root=REPO):
    packet = Path(packet)
    report = inspect()
    (packet / 'observations.json.gz').write_bytes(
        gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0)
    )
    (packet / 'coverage-delta.json').write_text(
        json.dumps(coverage(report), indent=2) + '\n'
    )
    inventory = {
        str(path.relative_to(packet)): sha(path.read_bytes())
        for path in sorted(packet.rglob('*'))
        if path.is_file()
        and path.name != 'manifest.json'
        and '__pycache__' not in path.parts
        and path.suffix != '.pyc'
    }
    (packet / 'manifest.json').write_text(json.dumps(inventory, indent=2) + '\n')
    return report['summary']


if __name__ == '__main__':
    print(json.dumps(seal(), indent=2))
