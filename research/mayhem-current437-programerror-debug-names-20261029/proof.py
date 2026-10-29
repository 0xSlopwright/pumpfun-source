"""Counted ProgramError Debug unit-variant names on qualified437 images.

Custom(tag0) formatting is excluded. Each selected path stops at the shared
Formatter::write_str call after checking pointer/length immediates.
"""
from pathlib import Path
import gzip, hashlib, importlib.util, json, re, struct, tarfile, tomllib
if not __debug__:
    raise RuntimeError('Assertions are required')

P = Path(__file__).resolve().parent
PRIOR = 'research/mayhem-current437-mayhem-error-display-20261028'
ARCHIVE = 'research/mayhem-current437-composition-20261028/source.tar.gz'
OWNER = 38832
OWNER_BYTES = 1120
JUMPS = {
    0x15: lambda tag, imm: tag == imm,
    0x55: lambda tag, imm: tag != imm,
    0x65: lambda tag, imm: tag > imm,
    0xd5: lambda tag, imm: tag <= imm,
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
    return module('programerror_debug_prior', root / PRIOR / 'proof.py')

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
    with tarfile.open(root / ARCHIVE) as archive:
        lock = tomllib.loads(archive.extractfile('Cargo.lock').read().decode())
    packages = [pkg for pkg in lock['package'] if pkg['name'] == 'solana-program-error']
    assert len(packages) == 1
    package = packages[0]
    assert package['version'] == '3.0.1'
    path = packet / 'source-context/solana-program-error-3.0.1.crate'
    assert sha(path.read_bytes()) == package['checksum']
    with tarfile.open(path) as archive:
        source = archive.extractfile('solana-program-error-3.0.1/src/lib.rs').read().decode()
    marker = 'pub enum ProgramError {'
    assert source.count(marker) == 1
    assert '#[derive(Clone, Debug, Eq, PartialEq)]\npub enum ProgramError {' in source or re.search(
        r'#\[derive\([^\]]*Debug[^\]]*\)\]\s*pub enum ProgramError \{', source
    )
    start = source.index(marker) + len(marker)
    end = source.index('\n}', start)
    body = re.sub(r'//[^\n]*', '', source[start:end])
    variants = []
    for part in body.split(','):
        part = part.strip()
        if not part:
            continue
        match = re.fullmatch(r'([A-Z][A-Za-z0-9_]*)(\([^)]*\))?', part)
        assert match, part
        variants.append(match[1])
    assert len(variants) == 26 and variants[0] == 'Custom'
    assert 'impl fmt::Debug for ProgramError' not in source
    static = [dict(observed_tag=index, name=name) for index, name in enumerate(variants[1:], start=1)]
    assert [row['name'] for row in static] == variants[1:]
    return dict(
        crate_sha256=package['checksum'],
        source_sha256=sha(source.encode()),
        static_variants=static,
        excluded_variant='Custom',
        tag_scope='Observed compiler tags for #[derive(Debug)] unit variants on these images, not a stable Rust enum ABI',
    )

def counted(image, pointer, length):
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
    """Walk one unit-variant Debug arm. Tag 0 (Custom) is rejected."""
    assert 1 <= tag <= 25, tag
    assert window['end'] - window['start'] == OWNER_BYTES
    visited = []
    pc = window['start']
    pointer = None
    length = None
    pointer_offset = None
    length_offset = None
    for _ in range(OWNER_BYTES // 8):
        relative = pc - window['start']
        assert window['start'] <= pc < window['end'] and pc % 8 == 0 and relative not in visited
        visited.append(relative)
        op, reg, off, imm = struct.unpack_from('<BBhi', image.b, pc)
        nxt = pc + 8
        if op == 0x61:
            assert (reg, off, imm) == (0x13, 0, 0) and pointer is None
        elif op in JUMPS:
            assert reg == 3 and pointer is None
            if JUMPS[op](tag, imm):
                nxt = pc + 8 + off * 8
        elif op == 0xbf:
            assert (reg, off, imm) == (0x21, 0, 0)
        elif op == 0x18:
            assert (reg, off) == (2, 0) and pointer is None
            assert image.rel.get(pc, {}).get('type') == 8 and image.rel[pc]['symbol_index'] == 0
            assert not any(pc < reloc < pc + 16 for reloc in image.rel)
            continuation, high = struct.unpack_from('<II', image.b, pc + 8)
            assert continuation == 0
            pointer = (imm & 0xffffffff) | (high << 32)
            pointer_offset = relative
            nxt = pc + 16
        elif op == 0xb7:
            assert (reg, off) == (3, 0) and pointer is not None and 0 < imm <= 256
            length = imm
            length_offset = relative
        elif op == 0x05:
            assert (reg, imm) == (0, 0)
            nxt = pc + 8 + off * 8
        elif op == 0x85:
            assert (reg, off) == (0x10, 0) and pointer is not None and length is not None
            assert struct.unpack_from('<BBhi', image.b, pc + 8) == (0x95, 0, 0, 0)
            return dict(
                pointer=pointer,
                length=length,
                bytes_hex=counted(image, pointer, length).hex(),
                pointer_offset=pointer_offset,
                length_offset=length_offset,
                call_offset=relative,
                call_target=pc + 8 + imm * 8,
                path_offsets=visited,
                formatter_argument_moved_to_r1=True,
                scope='Stops at call write_str. No callback target, output, or runtime claim.',
            )
        else:
            raise AssertionError(f'outside Debug unit-variant grammar at {relative}: {op:#x}')
        pc = nxt
    raise AssertionError('no counted writer call')

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
    prefix, records, data = prior_proof(root).format_proof(root).readers(root)
    del data
    original_elf, candidate_elf = prefix.elves(original, candidate)
    rows = json.loads((prefix.M / 'original-windows.json').read_bytes())
    row = next(item for item in rows if item['start'] == OWNER)
    assert row['id'] == 'O0052' and row['bytes'] == OWNER_BYTES
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
    # Healthy qualified437 keeps both Debug candidates. Length mutations can drop them.
    bad = set()
    observations = []
    writer_rows = []
    covered = []
    for left_at, right_at in owner_pairs:
        assert any(
            'solana_program_error..ProgramError' in name and 'Debug' in name
            for name in symbols[right_at]
        )
        left, right = original_windows[left_at], candidate_windows[right_at]
        visited = set()
        for variant in context['static_variants']:
            original_path = trace(original_elf, left, variant['observed_tag'])
            candidate_path = trace(candidate_elf, right, variant['observed_tag'])
            name = variant['name'].encode()
            same = (
                original_path['length'] == candidate_path['length'] == len(name)
                and original_path['bytes_hex'] == candidate_path['bytes_hex'] == name.hex()
                and original_path['path_offsets'] == candidate_path['path_offsets']
                and original_path['pointer_offset'] == candidate_path['pointer_offset']
                and original_path['length_offset'] == candidate_path['length_offset']
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
        literal_offsets = {
            row['original']['pointer_offset']
            for row in observations
            if row['candidate_owner'] == right_at
        }
        length_offsets = {
            row['original']['length_offset']
            for row in observations
            if row['candidate_owner'] == right_at
        }
        assert len(literal_offsets) == 25
        # Four unit arms share the length-18 mov at offset 968.
        assert 968 in length_offsets and len(length_offsets) == 22
        untraced = sorted(set(starts) - visited)
        assert untraced == [616, 624, 632, 640, 648, 656, 672, 680, 696, 704, 984]
        covered.append(dict(
            original_owner=left_at,
            candidate_owner=right_at,
            instruction_starts=starts,
            visited_instruction_offsets=sorted(visited),
            untraced_instruction_offsets=untraced,
            excluded_source_variant='Custom',
            shared_length_offsets=[968],
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
    if len(owner_pairs) == 2 and not bad and len(observations) == 50:
        assert merged == [[709245, 709739]]
        assert sum(length for _start, length in spans) == 494
    return dict(
        summary=dict(
            normalized_windows=before['summary']['normalized_windows'],
            raw_windows=before['summary']['raw_windows'],
            base_windows=before['summary']['extended_windows'],
            base_pairs=len(initial),
            extended_windows=len({start for start, _end in active}),
            extended_pairs=len(active),
            static_variants=25,
            excluded_variants=['Custom'],
            owner_pairs=len(owner_pairs),
            literal_spans=len(spans),
            literal_bytes=sum(length for _start, length in spans),
            rejected_pairs=len(initial - active),
            pruning_rounds=rounds,
        ),
        source_context=dict(
            crate_sha256=context['crate_sha256'],
            source_sha256=context['source_sha256'],
            tag_scope=context['tag_scope'],
            excluded_variant=context['excluded_variant'],
        ),
        active_pairs=[list(pair) for pair in sorted(active)],
        observations=observations,
        writer_paths=writer_rows,
        path_coverage=covered,
    )

def coverage_delta(root, report):
    previous_path = root / PRIOR / 'coverage-delta.json'
    before = json.loads(previous_path.read_bytes())
    added = [
        (row['original']['pointer'], row['original']['pointer'] + row['original']['length'])
        for row in report['observations']
        if row['candidate_owner'] == 38832
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
        scope='Counted ProgramError Debug unit-variant name bytes only. No Custom formatting, no TryFromIntError name, no allocation extents, and no relocation-table credit.',
        prior_mayhem_error_display_delta_sha256=sha(previous_path.read_bytes()),
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
        if path.is_file() and path.name != 'manifest.json' and path.name != 'SPEC.md' and path.name != '__pycache__' and path.suffix != '.pyc'
    }
    # Drop pycache dirs from inventory expectation
    found = {
        key: digest for key, digest in found.items()
        if '__pycache__' not in key.split('/') and not key.endswith('.pyc') and key != 'SPEC.md'
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
    candidate = prior_proof(root).format_proof(root).readers(root)[2].inputs(
        root, 'mayhem-current437-composition-20261028'
    )
    report = inspect(packet, original, candidate, root)
    assert report == json.loads(gzip.decompress((packet / 'observations.json.gz').read_bytes())), 'fresh observations differ'
    delta = coverage_delta(root, report)
    assert delta == json.loads((packet / 'coverage-delta.json').read_bytes()), 'coverage delta differs'
    summary = report['summary']
    assert (summary['normalized_windows'], summary['raw_windows'], summary['extended_windows'], summary['extended_pairs']) == (437, 141, 431, 581)
    assert (summary['static_variants'], summary['owner_pairs'], summary['literal_spans'], summary['literal_bytes'], summary['rejected_pairs']) == (25, 2, 25, 494, 0)
    assert (delta['baseline_payload_bytes'], delta['new_payload_bytes'], delta['payload_covered_bytes'], delta['payload_total_bytes']) == (18745, 494, 19239, 26180)
    by_section = {section['section']: section for section in delta['sections']}
    assert (by_section['.rodata']['new_bytes'], by_section['.rodata']['covered_bytes'], by_section['.rodata']['total_bytes']) == (494, 12783, 18396)
    assert (by_section['.data.rel.ro']['new_bytes'], by_section['.data.rel.ro']['covered_bytes'], by_section['.data.rel.ro']['total_bytes']) == (0, 6456, 7784)
    assert all(row['owner_closed'] and row['bytes_and_count_equal'] for row in report['observations'])
    assert {row['candidate_owner'] for row in report['observations']} == {38832, 552232}
    return summary

def seal(packet=None, root=None):
    packet = packet or P
    root = root or next(
        parent for parent in packet.parents
        if (parent / 'evidence/original/mayhem/deployed.so').is_file()
    )
    original = (root / 'evidence/original/mayhem/deployed.so').read_bytes()
    candidate = prior_proof(root).format_proof(root).readers(root)[2].inputs(
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
