"""Counted MayhemError Debug unit-variant names on qualified437 images.

The Debug body is thin and shared by every observed tag. It loads the u32 tag,
scales it by eight, indexes a relocated length table and a relocated pointer
table, loads the name pointer plus the u64 length, then calls the shared
Formatter::write_str helper. Length evidence is the u64 in the length table,
not a mov immediate and not a NUL terminator.
"""
from pathlib import Path
import gzip, hashlib, importlib.util, json, re, struct, tarfile
if not __debug__:
    raise RuntimeError('Assertions are required')

P = Path(__file__).resolve().parent
PRIOR = 'research/mayhem-current437-programerror-debug-names-20261029'
ARCHIVE = 'research/mayhem-current437-composition-20261028/source.tar.gz'
OWNER = 196888
OWNER_BYTES = 112
# Instruction starts in the shared body. lddw words 32 and 56 are continuations.
OFFSETS = (0, 8, 16, 24, 40, 48, 64, 72, 80, 88, 96, 104)
BODY = {
    0: (0xbf, 0x24, 0, 0),    # r4 = r2 (save formatter)
    8: (0x61, 0x11, 0, 0),    # r1 = u32 tag at self+0
    16: (0x67, 0x01, 0, 3),   # r1 = tag * 8
    24: (0x18, 0x03, 0, 0),   # lddw r3, length table base (continuation follows)
    40: (0x0f, 0x13, 0, 0),   # r3 += r1
    48: (0x18, 0x02, 0, 0),   # lddw r2, pointer table base (continuation follows)
    64: (0x0f, 0x12, 0, 0),   # r2 += r1
    72: (0x79, 0x22, 0, 0),   # r2 = u64 pointer table entry
    80: (0x79, 0x33, 0, 0),   # r3 = u64 length table entry
    88: (0xbf, 0x41, 0, 0),   # r1 = formatter
    96: (0x85, 0x10, 0, 0),   # call Formatter::write_str (immediate varies)
    104: (0x95, 0, 0, 0),     # exit
}
WRITER = [
    (0x79, 0x14, 0, 0),
    (0x79, 0x11, 8, 0),
    (0x79, 0x15, 24, 0),
    (0xbf, 0x41, 0, 0),
    (0x8d, 0, 0, 5),
    (0x95, 0, 0, 0),
]
sha = lambda data: hashlib.sha256(data).hexdigest()

def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    loaded = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(loaded)
    return loaded

def prior_proof(root):
    return module('mayhemerror_debug_prior', root / PRIOR / 'proof.py')

def format_proof(root):
    # ProgramError's prior is the Display packet, whose prior is the format chain.
    return prior_proof(root).prior_proof(root).format_proof(root)

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

def source_context(packet, root):
    """The sealed enum is the label source. Debug names are the variant identifiers."""
    with tarfile.open(root / ARCHIVE) as archive:
        lib = archive.extractfile('src/lib.rs').read().decode()
    marker = '#[error_code]\npub enum MayhemError {'
    start = lib.index(marker)
    end = lib.index('\n}\n', start)
    excerpt = lib[start:end + 3]
    assert excerpt.endswith('}\n')
    assert lib.count(marker) == 1
    assert (packet / 'source-context/mayhem-error.rs').read_text() == excerpt
    found = re.findall(r'#\[msg\("([^"]*)"\)\]\s*(\w+)\s*=\s*(\d+)', excerpt)
    assert [int(tag) for _msg, _name, tag in found] == list(range(20))
    variants = [
        dict(observed_tag=tag, name=name, message=msg)
        for tag, (msg, name, _raw) in enumerate(found)
    ]
    return dict(
        lib_rs_sha256=sha(lib.encode()),
        excerpt_sha256=sha(excerpt.encode()),
        variants=variants,
        tag_scope='Explicit discriminants 0..=19 from this enum. Debug names are the Rust variant identifiers; these tags describe the observed compiler layout, not a stable Rust enum ABI.',
    )

def file_offset(image, address):
    sections = [
        section for section in image.sections
        if section['type'] != 8
        and section['address'] <= address < section['address'] + section['size']
    ]
    assert len(sections) == 1
    return sections[0]['offset'] + address - sections[0]['address']

def counted(image, pointer, length):
    """Only .rodata name bytes bounded by the length-table u64 are counted."""
    assert 0 < length <= 256
    sections = [
        section for section in image.sections
        if section['name'] == '.rodata' and section['type'] != 8 and section['flags'] & 2
        and section['address'] <= pointer and pointer + length <= section['address'] + section['size']
    ]
    assert len(sections) == 1
    assert not any(pointer <= reloc < pointer + length for reloc in image.rel)
    section = sections[0]
    at = section['offset'] + pointer - section['address']
    return image.b[at:at + length]

def instruction_starts(image, window):
    starts = []
    pc = window['start']
    while pc < window['end']:
        starts.append(pc - window['start'])
        op = image.b[pc]
        pc += 16 if op == 0x18 else 8
    return starts

def trace(image, window, tag):
    """Walk the shared body, then resolve the tag's table entries."""
    assert 0 <= tag <= 19, tag
    assert window['end'] - window['start'] == OWNER_BYTES
    length_base = None
    pointer_base = None
    for offset in OFFSETS:
        pc = window['start'] + offset
        expected = BODY[offset]
        op, reg, off, imm = struct.unpack_from('<BBhi', image.b, pc)
        if offset in (24, 48):
            assert (op, reg, off) == expected[:3]
            assert image.rel.get(pc, {}).get('type') == 8 and image.rel[pc]['symbol_index'] == 0
            assert not any(pc < reloc < pc + 16 for reloc in image.rel)
            continuation, high = struct.unpack_from('<II', image.b, pc + 8)
            assert continuation == 0
            base = (imm & 0xffffffff) | (high << 32)
            if offset == 24:
                length_base = base
            else:
                pointer_base = base
        elif offset == 96:
            assert (op, reg, off) == expected[:3]
        else:
            assert (op, reg, off, imm) == expected, (offset, op, reg, off, imm)
    assert length_base is not None and pointer_base is not None
    length_at = file_offset(image, length_base + tag * 8)
    pointer_at = file_offset(image, pointer_base + tag * 8)
    length = struct.unpack_from('<Q', image.b, length_at)[0]
    raw_pointer = struct.unpack_from('<Q', image.b, pointer_at)[0]
    assert 0 < length <= 256
    assert raw_pointer & 0xffffffff == 0, 'pointer entry is an in-place addend'
    pointer = raw_pointer >> 32
    assert pointer > 0
    call = window['start'] + 96
    call_imm = struct.unpack_from('<BBhi', image.b, call)[3]
    assert struct.unpack_from('<BBhi', image.b, window['start'] + 104) == BODY[104]
    return dict(
        pointer=pointer,
        length=length,
        bytes_hex=counted(image, pointer, length).hex(),
        length_table_base=length_base,
        pointer_table_base=pointer_base,
        length_table_offset=tag * 8,
        pointer_table_offset=tag * 8,
        path_offsets=list(OFFSETS),
        call_offset=96,
        call_target=call + 8 + call_imm * 8,
        formatter_argument_moved_to_r1=True,
        scope='Stops at call write_str. No callback target, output, or runtime claim.',
    )

def writer(image, window):
    assert window['end'] - window['start'] == 48
    for index, expected in enumerate(WRITER):
        pc = window['start'] + index * 8
        assert pc not in image.rel
        assert struct.unpack_from('<BBhi', image.b, pc) == expected, 'writer forwarding changed'
    return dict(
        start=window['start'],
        bytes=48,
        pointer_register_preserved=2,
        length_register_preserved=3,
        formatter_data_offset=0,
        formatter_table_offset=8,
        unresolved_writer_slot=24,
        unresolved_call_offset=32,
        scope='Stops before unresolved callback; no callback target or runtime effect claim',
    )

def images(root, original, candidate):
    prefix, records, data = format_proof(root).readers(root)
    del data
    original_elf, candidate_elf = prefix.elves(original, candidate)
    rows = json.loads((prefix.M / 'original-windows.json').read_bytes())
    row = next(item for item in rows if item['start'] == OWNER)
    assert row['id'] == 'O0098' and row['bytes'] == OWNER_BYTES
    original_windows = {
        item['start']: original_elf.window(item['start'], item['start'] + item['bytes'])
        for item in rows
    }
    candidate_windows, symbols = prefix.q.tables(candidate_elf)
    return dict(
        prefix=prefix,
        records=records,
        original_elf=original_elf,
        candidate_elf=candidate_elf,
        original_windows=original_windows,
        candidate_windows=candidate_windows,
        symbols=symbols,
    )

def inspect(packet, original, candidate, root):
    before = prior_proof(root).inspect(root / PRIOR, original, candidate, root)
    initial = {tuple(pair) for pair in before['active_pairs']}
    bundle = images(root, original, candidate)
    context = source_context(packet, root)
    prefix, records = bundle['prefix'], bundle['records']
    original_elf, candidate_elf = bundle['original_elf'], bundle['candidate_elf']
    original_windows, candidate_windows = bundle['original_windows'], bundle['candidate_windows']
    symbols = bundle['symbols']
    edges = {}
    for left_at, right_at in sorted(initial):
        left, right = original_windows[left_at], candidate_windows[right_at]
        edges[left_at, right_at] = [
            (item['target'], other['target'])
            for item, other in zip(left['direct'], right['direct'])
        ]
        by_offset = {item['offset']: item for item in right['data_references']}
        for item in left['data_references']:
            other = by_offset[item['offset']]
            if item['kind'] == 'code':
                edges[left_at, right_at].append((item['target'], other['target']))
            prefix_row = prefix.prefix(original_elf, original_windows, item['target'])
            if prefix_row:
                other_prefix = prefix.prefix(candidate_elf, candidate_windows, other['target'])
                assert other_prefix is not None
                edges[left_at, right_at].extend(
                    (src, dst)
                    for src, dst in zip(prefix_row['targets'], other_prefix['targets'])
                    if src is not None
                )
            extended = records.record48(prefix, original_elf, original_windows, item['target'])
            if extended:
                other_record = records.record48(prefix, candidate_elf, candidate_windows, other['target'])
                assert other_record is not None
                edges[left_at, right_at].extend(
                    (src, dst)
                    for src, dst in zip(extended['targets'], other_record['targets'])
                    if src is not None
                )
    owner_pairs = [pair for pair in sorted(initial) if pair[0] == OWNER]
    bad = set()
    observations = []
    writer_rows = []
    covered = []
    for left_at, right_at in owner_pairs:
        assert any(
            'mayhem_recovered..MayhemError' in name and 'Debug' in name
            for name in symbols[right_at]
        )
        left, right = original_windows[left_at], candidate_windows[right_at]
        visited = set()
        for variant in context['variants']:
            original_path = trace(original_elf, left, variant['observed_tag'])
            candidate_path = trace(candidate_elf, right, variant['observed_tag'])
            name = variant['name'].encode()
            same = (
                original_path['length'] == candidate_path['length'] == len(name)
                and original_path['bytes_hex'] == candidate_path['bytes_hex'] == name.hex()
                and original_path['path_offsets'] == candidate_path['path_offsets']
                and original_path['length_table_offset'] == candidate_path['length_table_offset']
                and original_path['pointer_table_offset'] == candidate_path['pointer_table_offset']
                and original_path['call_offset'] == candidate_path['call_offset']
                and (original_path['call_target'], candidate_path['call_target']) in initial
            )
            if not same:
                bad.add((left_at, right_at))
            observations.append(dict(
                observed_tag=variant['observed_tag'],
                name=variant['name'],
                original_owner=left_at,
                candidate_owner=right_at,
                original=original_path,
                candidate=candidate_path,
                bytes_and_count_equal=same,
            ))
            visited.update(original_path['path_offsets'])
        call_target_original = observations[-1]['original']['call_target']
        call_target_candidate = observations[-1]['candidate']['call_target']
        assert any('Formatter9write_str' in name for name in symbols[call_target_candidate])
        writer_rows.append(dict(
            original=writer(original_elf, original_windows[call_target_original]),
            candidate=writer(candidate_elf, candidate_windows[call_target_candidate]),
            candidate_names=sorted(symbols[call_target_candidate]),
        ))
        starts = instruction_starts(original_elf, left)
        assert starts == instruction_starts(candidate_elf, right)
        # Every tag takes the same path, so every instruction start is visited.
        assert set(starts) == visited
        covered.append(dict(
            original_owner=left_at,
            candidate_owner=right_at,
            instruction_starts=starts,
            visited_instruction_offsets=sorted(visited),
            untraced_instruction_offsets=[],
            length_table_offsets=sorted({row['original']['length_table_offset'] for row in observations}),
            pointer_table_offsets=sorted({row['original']['pointer_table_offset'] for row in observations}),
        ))
    active = initial - bad
    rounds = []
    while True:
        lost = {pair for pair in active if any(target not in active for target in edges[pair])}
        if not lost:
            break
        active -= lost
        rounds.append(len(lost))
    for row in observations:
        row['owner_closed'] = (row['original_owner'], row['candidate_owner']) in active
    spans = sorted({
        (row['original']['pointer'], row['original']['length'])
        for row in observations
    })
    for (start, length), (nxt, _nlen) in zip(spans, spans[1:]):
        assert start + length <= nxt
    merged = union((start, start + length) for start, length in spans) if spans else []
    if len(owner_pairs) == 1 and not bad and len(observations) == 20:
        assert merged == [[710331, 710438], [710488, 710504], [710712, 710924]]
        assert sum(length for _start, length in spans) == 335
    return dict(
        summary=dict(
            normalized_windows=before['summary']['normalized_windows'],
            raw_windows=before['summary']['raw_windows'],
            base_windows=before['summary']['extended_windows'],
            base_pairs=len(initial),
            extended_windows=len({start for start, _end in active}),
            extended_pairs=len(active),
            static_variants=len(context['variants']),
            excluded_variants=[],
            owner_pairs=len(owner_pairs),
            literal_spans=len(spans),
            literal_bytes=sum(length for _start, length in spans),
            rejected_pairs=len(initial - active),
            pruning_rounds=rounds,
        ),
        source_context=dict(
            lib_rs_sha256=context['lib_rs_sha256'],
            excerpt_sha256=context['excerpt_sha256'],
            tag_scope=context['tag_scope'],
        ),
        active_pairs=[list(pair) for pair in sorted(active)],
        observations=observations,
        writer_paths=writer_rows,
        path_coverage=covered,
    )

def coverage_delta(root, report):
    previous_path = root / PRIOR / 'coverage-delta.json'
    before = json.loads(previous_path.read_bytes())
    # All observations target the single candidate owner.
    added = [
        (row['original']['pointer'], row['original']['pointer'] + row['original']['length'])
        for row in report['observations']
    ]

    def finish(section, raw, mapped, previous):
        raw_intervals = union(raw)
        mapped_intervals = union(mapped)
        covered = union(raw_intervals + mapped_intervals)
        covered_bytes = measure(covered)
        raw_bytes = measure(raw_intervals)
        return dict(
            section=section['section'],
            total_bytes=section['total_bytes'],
            raw_intervals=raw_intervals,
            mapped_intervals=mapped_intervals,
            covered_intervals=covered,
            raw_equal_bytes=raw_bytes,
            pointer_only_bytes=covered_bytes - raw_bytes,
            covered_bytes=covered_bytes,
            new_bytes=covered_bytes - previous,
        )

    sections = []
    for section in before['sections']:
        raw = list(section['raw_intervals'])
        mapped = list(section['mapped_intervals'])
        baseline_covered = section['covered_bytes']
        if section['section'] == '.rodata':
            raw = raw + added
        sections.append(finish(section, raw, mapped, baseline_covered))
    return dict(
        scope='Counted MayhemError Debug unit-variant name bytes only. Length-table, pointer-table, and relocation-table bytes are not credited.',
        prior_programerror_debug_delta_sha256=sha(previous_path.read_bytes()),
        baseline_payload_bytes=before['payload_covered_bytes'],
        baseline_rodata_bytes=next(s['covered_bytes'] for s in before['sections'] if s['section'] == '.rodata'),
        baseline_data_rel_ro_bytes=next(s['covered_bytes'] for s in before['sections'] if s['section'] == '.data.rel.ro'),
        sections=sections,
        new_payload_bytes=sum(section['new_bytes'] for section in sections),
        payload_covered_bytes=sum(section['covered_bytes'] for section in sections),
        payload_total_bytes=before['payload_total_bytes'],
    )

def check(packet, root):
    paths = list(packet.rglob('*'))
    assert not any(path.is_symlink() for path in paths), 'packet symlink'
    assert all(path.is_file() or path.is_dir() for path in paths), 'packet special file'
    found = {
        str(path.relative_to(packet)): sha(path.read_bytes())
        for path in paths
        if path.is_file() and path.name != 'manifest.json' and path.name != 'SPEC.md'
        and '__pycache__' not in path.parts and path.suffix != '.pyc'
    }
    assert found == json.loads((packet / 'manifest.json').read_bytes()), 'packet inventory differs'
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
    candidate = format_proof(root).readers(root)[2].inputs(
        root, 'mayhem-current437-composition-20261028'
    )
    report = inspect(packet, original, candidate, root)
    assert report == json.loads(gzip.decompress((packet / 'observations.json.gz').read_bytes())), 'fresh observations differ'
    delta = coverage_delta(root, report)
    assert delta == json.loads((packet / 'coverage-delta.json').read_bytes()), 'coverage delta differs'
    summary = report['summary']
    assert (summary['normalized_windows'], summary['raw_windows'], summary['extended_windows'], summary['extended_pairs']) == (437, 141, 431, 581)
    assert (summary['static_variants'], summary['owner_pairs'], summary['literal_spans'], summary['literal_bytes'], summary['rejected_pairs']) == (20, 1, 20, 335, 0)
    assert (delta['baseline_payload_bytes'], delta['new_payload_bytes'], delta['payload_covered_bytes'], delta['payload_total_bytes']) == (19239, 335, 19574, 26180)
    by_section = {section['section']: section for section in delta['sections']}
    assert (by_section['.rodata']['new_bytes'], by_section['.rodata']['covered_bytes'], by_section['.rodata']['total_bytes']) == (335, 13118, 18396)
    assert (by_section['.data.rel.ro']['new_bytes'], by_section['.data.rel.ro']['covered_bytes'], by_section['.data.rel.ro']['total_bytes']) == (0, 6456, 7784)
    assert all(row['owner_closed'] and row['bytes_and_count_equal'] for row in report['observations'])
    assert {row['candidate_owner'] for row in report['observations']} == {173568}
    return summary

def seal(packet=None, root=None):
    packet = packet or P
    root = root or next(
        parent for parent in packet.parents
        if (parent / 'evidence/original/mayhem/deployed.so').is_file()
    )
    original = (root / 'evidence/original/mayhem/deployed.so').read_bytes()
    candidate = format_proof(root).readers(root)[2].inputs(
        root, 'mayhem-current437-composition-20261028'
    )
    report = inspect(packet, original, candidate, root)
    (packet / 'observations.json.gz').write_bytes(
        gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0)
    )
    delta = coverage_delta(root, report)
    (packet / 'coverage-delta.json').write_text(json.dumps(delta, indent=2) + '\n')
    inventory = {
        str(path.relative_to(packet)): sha(path.read_bytes())
        for path in sorted(packet.rglob('*'))
        if path.is_file()
        and path.name != 'manifest.json'
        and path.name != 'SPEC.md'
        and '__pycache__' not in path.parts
        and path.suffix != '.pyc'
    }
    (packet / 'manifest.json').write_text(json.dumps(inventory, indent=2) + '\n')
    return report['summary']

if __name__ == '__main__':
    print(json.dumps(seal(), indent=2))
