"""Counted Option/seed/path literal bytes, descriptors and immediate text sites on qualified437.

Only fixed pointer/length immediates, 16-byte counted descriptors and fixed
lddw/mov/stxdw text sites are read. NUL bytes, the following byte and adjacent
strings are not bounds. No relocation-table byte or text instruction is claimed
as payload. Only static bytes are inspected.
"""
from pathlib import Path
import gzip, hashlib, importlib.util, json, struct
if not __debug__:
    raise RuntimeError('Assertions are required')

P = Path(__file__).resolve().parent
PRIOR = 'research/mayhem-current437-rust-panic-messages-20261029'
COMPOSITION = 'mayhem-current437-composition-20261028'
RUST_PANIC_DELTA = 'research/mayhem-current437-rust-panic-messages-20261029/coverage-delta.json'
MAYHEMERROR_DELTA = 'research/mayhem-current437-mayhemerror-debug-names-20261029/coverage-delta.json'
PROGRAMERROR_DELTA = 'research/mayhem-current437-programerror-debug-copy-20261029/coverage-delta.json'
RUST_PANIC_SHA = '839174494ffefa29fab70b027aea1b2672777ea5efd69ad194cf9c7c8eaef5e4'
MAYHEMERROR_SHA = 'e36281cc8703789ef01fbdd127181d10075c1c2f786fedec3621dad3f4b3d77a'
PROGRAMERROR_SHA = '2922e4eb065a5db22ad5299ee34a192567e0a6205c4859c23905dfb2bae38cb2'
BOUNDED_ERROR_DELTA = 'research/mayhem-current437-bounded-error-strings-20261029/coverage-delta.json'
BOUNDED_ERROR_SHA = 'e7cae6dd26e406a43d34d428a5ea8ee87c8e2ec3d4fc852d183d06b98eaa722e'
MERGE = (
    (RUST_PANIC_DELTA, RUST_PANIC_SHA),
    (MAYHEMERROR_DELTA, MAYHEMERROR_SHA),
    (PROGRAMERROR_DELTA, PROGRAMERROR_SHA),
    (BOUNDED_ERROR_DELTA, BOUNDED_ERROR_SHA),
)
sha = lambda data: hashlib.sha256(data).hexdigest()

# (original_ptr, length, candidate_ptr, text) -- each counted once in .rodata.
STRINGS = (
    (709739, 31, 690124, b'Invalid Option representation: '),
    (709770, 31, 690155, b'. The first byte must be 0 or 1'),
    (709801, 9, 690327, b'sol-vault'),
    (709810, 17, 690336, b'__event_authority'),
    (709827, 1, 690353, bytes([0xfc])),
    (709828, 48, 690279, b'programs/mayhem-program/src/instructions/burn.rs'),
    (709876, 43, 690236, b'called `Result::unwrap()` on an `Err` value'),
    (709919, 30, 690653, b'Account already has more than '),
    (709949, 36, 690683, b'Account already has the correct size'),
    (709985, 58, 690595, b'programs/mayhem-program/src/instructions/extend_account.rs'),
    (710043, 58, 690466, b'programs/mayhem-program/src/instructions/fee_recipients.rs'),
    (710101, 13, 690524, b'fee-recipient'),
    (710114, 62, 690404, b'programs/mayhem-program/src/instructions/pump_amm_interface.rs'),
    (710176, 58, 690537, b'programs/mayhem-program/src/instructions/pump_interface.rs'),
    (710234, 61, 690719, b'programs/mayhem-program/src/instructions/pump_interface_v2.rs'),
    (710295, 36, 690200, b'programs/mayhem-program/src/state.rs'),
)

# (original_desc_off, original_ptr, length, candidate_desc_off, candidate_ptr)
DESCRIPTORS = (
    (725792, 709739, 31, 706232, 690124),
    (725808, 709770, 31, 706248, 690155),
    (727432, 709801, 9, 707936, 690327),
    (725904, 709810, 17, 706872, 690336),
    (727416, 709810, 17, 707976, 690336),
    (725920, 709827, 1, 706888, 690353),
    (726056, 709919, 30, 707760, 690653),
)

# (original_pc, candidate_pc, original_ptr, candidate_ptr, length, length_register)
TEXT_SITES = (
    (60864, 60864, 709876, 690236, 43, 2),
    (61912, 61912, 709949, 690683, 36, 2),
)

# (original_pc, candidate_pc, original_ptr, candidate_ptr, length)
PATH_SITES = (
    (56160, 56160, 709828, 690279, 48),
    (61760, 61760, 709985, 690595, 58),
    (65984, 65984, 710043, 690466, 58),
    (70752, 70752, 710101, 690524, 13),
    (95632, 94912, 710114, 690404, 62),
    (124536, 114592, 710176, 690537, 58),
    (155760, 152888, 710234, 690719, 61),
    (177736, 156792, 710295, 690200, 36),
)

def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    loaded = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(loaded)
    return loaded

def prior_proof(root):
    return module('option_seeds_prior', root / PRIOR / 'proof.py')

def readers(root):
    """Reuse the prior qualified437 reader chain without copying it."""
    return prior_proof(root).readers(root)

def images(root, original, candidate):
    """Reuse the prior qualified437 ELF pair without copying it."""
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

def descriptor(image, offset, pointer, length):
    sections = [
        section for section in image.sections
        if section['name'] == '.data.rel.ro' and section['type'] != 8
        and section['address'] <= offset and offset + 16 <= section['address'] + section['size']
    ]
    assert len(sections) == 1
    assert sorted(reloc for reloc in image.rel if offset <= reloc < offset + 16) == [offset]
    reloc = image.rel[offset]
    assert reloc['type'] == 8 and reloc['symbol_index'] == 0
    low, high, stored = struct.unpack('<IIQ', image.b[offset:offset + 16])
    assert low == 0 and high == pointer and stored == length
    return image.b[offset:offset + 16]

def text_site(image, pc, pointer, length, length_register):
    assert image.lo <= pc and pc + 24 <= image.hi
    assert sorted(reloc for reloc in image.rel if pc <= reloc < pc + 24) == [pc]
    reloc = image.rel[pc]
    assert reloc['type'] == 8 and reloc['symbol_index'] == 0
    opcode, register, branch, immediate = struct.unpack_from('<BBhi', image.b, pc)
    assert (opcode, register, branch) == (0x18, 1, 0), 'text pointer argument register'
    continuation, high = struct.unpack_from('<II', image.b, pc + 8)
    assert continuation == 0
    assert ((immediate & 0xffffffff) | (high << 32)) == pointer
    assert struct.unpack_from('<BBhi', image.b, pc + 16) == (0xb7, length_register, 0, length)
    return image.b[pc:pc + 24]

def path_site(image, pc, pointer, length):
    """A relocated pointer and its adjacent stack length field, before any branch."""
    end = pc + 16 + 12 * 8
    assert image.lo <= pc and end <= image.hi
    assert sorted(reloc for reloc in image.rel if pc <= reloc < end) == [pc]
    reloc = image.rel[pc]
    assert reloc['type'] == 8 and reloc['symbol_index'] == 0
    opcode, register, branch, immediate = struct.unpack_from('<BBhi', image.b, pc)
    assert opcode == 0x18 and branch == 0 and register < 11, 'path pointer register'
    continuation, high = struct.unpack_from('<II', image.b, pc + 8)
    assert continuation == 0
    assert ((immediate & 0xffffffff) | (high << 32)) == pointer
    pointer_opcode, pointer_registers, pointer_offset, pointer_immediate = struct.unpack_from('<BBhi', image.b, pc + 16)
    assert (pointer_opcode, pointer_registers, pointer_immediate) == (0x7b, (register << 4) | 10, 0), 'pointer stack store'
    stores = []
    for index in range(12):
        at = pc + 16 + index * 8
        stored_opcode, stored_registers, stored_offset, stored_length = struct.unpack_from('<BBhi', image.b, at)
        if stored_opcode == 0x7a and stored_length == length:
            stores.append(at)
    assert len(stores) == 1
    at = stores[0]
    assert struct.unpack_from('<BBhi', image.b, at) == (0x7a, 10, pointer_offset + 8, length), 'adjacent stack length'
    widths = {0: 4, 8: 2, 16: 1, 24: 8}
    for previous in range(pc + 24, at, 8):
        op, regs, offset, _ = struct.unpack_from('<BBhi', image.b, previous)
        assert op & 7 not in (5, 6), 'branch before pointer/length pair'
        if op & 7 in (2, 3) and regs & 15 == 10:
            width = widths[op & 24]
            assert offset + width <= pointer_offset or pointer_offset + 16 <= offset, 'overwritten pointer/length pair'
    return image.b[pc:pc + 24] + image.b[at:at + 8], at

def text_for():
    return {item[0]: (item[1], item[3]) for item in STRINGS}

def verify_strings(original_elf, candidate_elf):
    rows = []
    for index, (pointer, length, candidate_pointer, text) in enumerate(STRINGS):
        assert len(text) == length
        original = rodata_bytes(original_elf, pointer, length)
        candidate = rodata_bytes(candidate_elf, candidate_pointer, length)
        assert original == text and candidate == text
        assert original == candidate
        rows.append(dict(
            index=index,
            original_ptr=pointer,
            candidate_ptr=candidate_pointer,
            length=length,
            text=text.decode('latin-1'),
            text_hex=text.hex(),
            original_bytes_hex=original.hex(),
            candidate_bytes_hex=candidate.hex(),
        ))
    return rows

def verify_descriptors(original_elf, candidate_elf):
    rows = []
    for original_offset, original_ptr, length, candidate_offset, candidate_ptr in DESCRIPTORS:
        original = descriptor(original_elf, original_offset, original_ptr, length)
        candidate = descriptor(candidate_elf, candidate_offset, candidate_ptr, length)
        rows.append(dict(
            original_offset=original_offset,
            candidate_offset=candidate_offset,
            original_ptr=original_ptr,
            candidate_ptr=candidate_ptr,
            length=length,
            original_bytes_hex=original.hex(),
            candidate_bytes_hex=candidate.hex(),
        ))
    return rows

def verify_text_sites(original_elf, candidate_elf):
    by_pointer = text_for()
    by_pointer.update({item[2]: (item[1], item[3]) for item in STRINGS})
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

def verify_path_sites(original_elf, candidate_elf):
    by_pointer = text_for()
    by_pointer.update({item[2]: (item[1], item[3]) for item in STRINGS})
    rows = []
    for original_pc, candidate_pc, original_ptr, candidate_ptr, length in PATH_SITES:
        assert by_pointer[original_ptr] == by_pointer[candidate_ptr]
        assert by_pointer[original_ptr][0] == length
        original, original_length_pc = path_site(original_elf, original_pc, original_ptr, length)
        candidate, candidate_length_pc = path_site(candidate_elf, candidate_pc, candidate_ptr, length)
        assert rodata_bytes(original_elf, original_ptr, length) == rodata_bytes(
            candidate_elf, candidate_ptr, length
        )
        rows.append(dict(
            original_pc=original_pc,
            candidate_pc=candidate_pc,
            original_ptr=original_ptr,
            candidate_ptr=candidate_ptr,
            length=length,
            original_length_pc=original_length_pc,
            length_pc=candidate_length_pc,
            original_bytes_hex=original.hex(),
            candidate_bytes_hex=candidate.hex(),
        ))
    return rows

def verify_images(original_elf, candidate_elf):
    return dict(
        strings=verify_strings(original_elf, candidate_elf),
        descriptors=verify_descriptors(original_elf, candidate_elf),
        text_sites=verify_text_sites(original_elf, candidate_elf),
        path_sites=verify_path_sites(original_elf, candidate_elf),
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
    assert literal_intervals == [[709739, 710331]]
    assert len(descriptor_intervals) == 4 and measure(descriptor_intervals) == 112
    summary = dict(
        normalized_windows=before['summary']['normalized_windows'],
        raw_windows=before['summary']['raw_windows'],
        extended_windows=before['summary']['extended_windows'],
        extended_pairs=before['summary']['extended_pairs'],
        rejected_pairs=before['summary']['rejected_pairs'],
        string_count=len(observations['strings']),
        descriptor_count=len(observations['descriptors']),
        text_site_count=len(observations['text_sites']),
        path_site_count=len(observations['path_sites']),
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
    priors = merged_priors(root)
    added = {
        '.rodata': [
            (row['original_ptr'], row['original_ptr'] + row['length'])
            for row in report['observations']['strings']
        ],
        '.data.rel.ro': [
            (row['original_offset'] + 8, row['original_offset'] + 16)
            for row in report['observations']['descriptors']
        ],
    }
    added_mapped = {
        '.rodata': [],
        '.data.rel.ro': [(row['original_offset'], row['original_offset'] + 8) for row in report['observations']['descriptors']],
    }
    sections = []
    baseline = {}
    for name in ('.rodata', '.data.rel.ro'):
        rows = [next(item for item in prior['sections'] if item['section'] == name) for prior in priors]
        totals = {row['total_bytes'] for row in rows}
        assert len(totals) == 1
        total_bytes = totals.pop()
        raw = union(
            [interval for row in rows for interval in row['raw_intervals']] + added[name]
        )
        mapped = union([interval for row in rows for interval in row['mapped_intervals']] + added_mapped[name])
        covered = union(raw + mapped)
        previous = measure(union([interval for row in rows for interval in row['covered_intervals']]))
        baseline[name] = previous
        covered_bytes = measure(covered)
        sections.append(dict(
            section=name,
            total_bytes=total_bytes,
            raw_intervals=raw,
            mapped_intervals=mapped,
            covered_intervals=covered,
            raw_equal_bytes=measure(raw),
            pointer_only_bytes=covered_bytes - measure(raw),
            covered_bytes=covered_bytes,
            new_bytes=covered_bytes - previous,
        ))
    scope = (
        'Counted static .rodata string bytes and 16-byte .data.rel.ro descriptors only. '
        'Path/seed and mov text immediates are proof sites, not credited payload. '
        'No relocation-table credit; NUL and adjacency are not bounds.'
    )
    return dict(
        scope=scope,
        prior_rust_panic_delta_sha256=RUST_PANIC_SHA,
        prior_mayhemerror_debug_names_delta_sha256=MAYHEMERROR_SHA,
        prior_programerror_debug_copy_delta_sha256=PROGRAMERROR_SHA,
        prior_bounded_error_strings_delta_sha256=BOUNDED_ERROR_SHA,
        baseline_payload_bytes=sum(baseline.values()),
        baseline_rodata_bytes=baseline['.rodata'],
        baseline_data_rel_ro_bytes=baseline['.data.rel.ro'],
        sections=sections,
        new_payload_bytes=sum(section['new_bytes'] for section in sections),
        payload_covered_bytes=sum(section['covered_bytes'] for section in sections),
        payload_total_bytes=sum(section['total_bytes'] for section in sections),
    )

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
    assert inventory(packet) == json.loads((packet / 'manifest.json').read_bytes()), 'packet inventory differs'
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
    assert delta == json.loads((packet / 'coverage-delta.json').read_bytes()), 'coverage delta differs'
    summary = dict(report['summary'])
    summary['new_payload_bytes'] = delta['new_payload_bytes']
    assert (summary['normalized_windows'], summary['raw_windows'], summary['extended_windows'], summary['extended_pairs']) == (437, 141, 431, 581)
    assert (summary['string_count'], summary['descriptor_count'], summary['text_site_count'], summary['path_site_count']) == (16, 7, 2, 8)
    assert (summary['literal_bytes'], summary['descriptor_bytes'], summary['new_payload_bytes']) == (592, 112, 704)
    assert summary['rejected_pairs'] == 0
    assert (delta['baseline_payload_bytes'], delta['payload_covered_bytes'], delta['payload_total_bytes']) == (20747, 21451, 26180)
    assert (delta['baseline_rodata_bytes'], delta['baseline_data_rel_ro_bytes']) == (14035, 6712)
    by_section = {section['section']: section for section in delta['sections']}
    assert (by_section['.rodata']['new_bytes'], by_section['.rodata']['covered_bytes'], by_section['.rodata']['total_bytes']) == (592, 14627, 18396)
    assert (by_section['.data.rel.ro']['new_bytes'], by_section['.data.rel.ro']['covered_bytes'], by_section['.data.rel.ro']['total_bytes']) == (112, 6824, 7784)
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
