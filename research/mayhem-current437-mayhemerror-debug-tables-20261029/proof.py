"""Selected MayhemError Debug length-table and pointer-table entries.

The prior packet counted the twenty unit-variant Debug names but explicitly
left the parallel length table and relocated pointer table open. This packet
credits exactly those table entries for the same observed tags. It does not
re-credit the names, infer an allocation extent, or claim runtime behavior.
"""
from pathlib import Path
import gzip, hashlib, importlib.util, json, struct
if not __debug__:
    raise RuntimeError('Assertions are required')

P = Path(__file__).resolve().parent
REPO = next(
    parent for parent in P.parents
    if (parent / 'evidence/original/mayhem/deployed.so').is_file()
)
PRIOR = 'research/mayhem-current437-mayhemerror-debug-names-20261029'
ARCHIVE = 'research/mayhem-current437-composition-20261028/source.tar.gz'
BASELINE = 'baseline/qualified437-union.json'
# Exact historical source membership, independently tied to the declared commit.
BASELINE_DELTAS = {
    "research/mayhem-current437-bounded-encoding-20261029/coverage-delta.json": "461f1bed916351813d11793ce2544cd4c036499ea3669c8982813c9b6349705d",
    "research/mayhem-current437-bounded-error-strings-20261029/coverage-delta.json": "e7cae6dd26e406a43d34d428a5ea8ee87c8e2ec3d4fc852d183d06b98eaa722e",
    "research/mayhem-current437-bounded-index-tables-20261029/coverage-delta.json": "f6efa470f1d18bcec99cab2c95ecf1fc650fe5606bcdbc73956986779e7cb282",
    "research/mayhem-current437-capacity-display-bool-tokens-20261029/coverage-delta.json": "aabe208010ac3ff25a22a6d8286a5b20ea16deb9a1b653e785b93d00c2b723cf",
    "research/mayhem-current437-custom-error-prefix-20261029/coverage-delta.json": "67bddb7a81da4349c6d9b20fc6868c94fafdfe264f67840923a02f70a99645fd",
    "research/mayhem-current437-digit-table-ellipsis-20261029/coverage-delta.json": "d0dca98d2b6546efd596c22b8f1834fc5e546d32c7fe5d82b527f01bb724d601",
    "research/mayhem-current437-error-kind-tables-20261028/coverage-delta.json": "d32265c214ca03b380e8f7c3fdf8ceb11d81756a64d28b1b9b3d4f80e932b191",
    "research/mayhem-current437-error-messages-20261028/coverage-delta.json": "cd363dd8bf8400c3078bab8276b9602cf7ca321c4d14d8ee2a729e131dfd3b64",
    "research/mayhem-current437-format-crumbs-0x-20261029/coverage-delta.json": "56d518a709084a0fb39658e7ff8218233dc0ddac1015a07c77122bf1d934b732",
    "research/mayhem-current437-format-pieces-20261028/coverage-delta.json": "48b929ed8fa9d2fe19edd51c3fde705d42a6f29e05250f85c3d040f275201806",
    "research/mayhem-current437-format-record-fields-20261029/coverage-delta.json": "e645fb43d186f659a47cb44b5d258e6ed5d9fb8219f799771401ef39c2e446f9",
    "research/mayhem-current437-grapheme-ranges-20261029/coverage-delta.json": "158b8b09b90df561be5336ccee81a7f05117d11c83464449e6c7952f7af205eb",
    "research/mayhem-current437-instruction-display-alt-copy-20261029/coverage-delta.json": "8f656287d5b8d7667483c08e41f124829872454ce508b0136422cfe94e4f78cd",
    "research/mayhem-current437-mayhem-error-display-20261028/coverage-delta.json": "3105ad28fe58659a5c5aa666a947d9e3dba829594c832b983d44ac38047b8307",
    "research/mayhem-current437-mayhemerror-debug-names-20261029/coverage-delta.json": "e36281cc8703789ef01fbdd127181d10075c1c2f786fedec3621dad3f4b3d77a",
    "research/mayhem-current437-option-seeds-paths-20261029/coverage-delta.json": "e8f6c7f03f18b6e8ce94d778cc9c4aaa56de798ad5a634412e8cf79ce9dedf2d",
    "research/mayhem-current437-program-error-messages-20261028/coverage-delta.json": "096f9980252a6e69c3eec3bb6d58c6996dc7fc1250936a759fa68e514cfd1262",
    "research/mayhem-current437-programerror-debug-copy-20261029/coverage-delta.json": "2922e4eb065a5db22ad5299ee34a192567e0a6205c4859c23905dfb2bae38cb2",
    "research/mayhem-current437-programerror-debug-names-20261029/coverage-delta.json": "4963685017de2ef8a6b38afdbc1f3bc5e1bdc3682fbf8738cc6524cacd8d42fa",
    "research/mayhem-current437-rust-panic-messages-20261029/coverage-delta.json": "839174494ffefa29fab70b027aea1b2672777ea5efd69ad194cf9c7c8eaef5e4",
    "research/mayhem-current437-src-lib-rs-path-20261029/coverage-delta.json": "79fca9ed8579d7ee1a1755356f183bfb389f36697af04bd4ae8b7aff65d524fc",
    "research/mayhem-current437-unicode-tables-20261028/coverage-delta.json": "e3afb9e5c796f9d8b26ca01b755105f27332faf67be1d3484749b616e5661419",
    "research/mayhem-current437-utf8-debug-fields-20261029/coverage-delta.json": "bd6b7e21fb3118e7fa6de5f8f7eb83c29e79dd6da14ae7b8292549d4acf5f6de"
}
OWNER = 196888
OWNER_BYTES = 112
TAGS = tuple(range(20))
sha = lambda data: hashlib.sha256(data).hexdigest()

def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    loaded = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(loaded)
    return loaded

def prior_proof(root=None):
    root = root or REPO
    return module('mayhemerror_tables_prior', root / PRIOR / 'proof.py')

def format_proof(root):
    return prior_proof(root).format_proof(root)

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
    """Reuse the prior sealed enum and pin the local provenance copy."""
    context = prior_proof(root).source_context(packet, root)
    provenance = json.loads((packet / 'source-context/provenance.json').read_bytes())
    assert provenance['source_archive'] == ARCHIVE
    assert provenance['source_archive_sha256'] == sha((root / ARCHIVE).read_bytes())
    assert provenance['member'] == 'src/lib.rs'
    assert provenance['lib_rs_sha256'] == context['lib_rs_sha256']
    assert provenance['excerpt_sha256'] == context['excerpt_sha256']
    assert provenance['variants'] == context['variants']
    assert provenance['scope'] == context['tag_scope']
    return context

def section_of(image, address, size, name):
    matches = [
        section for section in image.sections
        if section['name'] == name and section['type'] != 8 and section['flags'] & 2
        and section['address'] <= address
        and address + size <= section['address'] + section['size']
    ]
    assert len(matches) == 1, (name, address, size)
    return matches[0]

def file_offset(image, address):
    matches = [
        section for section in image.sections
        if section['type'] != 8
        and section['address'] <= address < section['address'] + section['size']
    ]
    assert len(matches) == 1, address
    section = matches[0]
    return section['offset'] + address - section['address']

def read_no_relocation(image, address, size, name):
    section = section_of(image, address, size, name)
    assert not any(address <= reloc < address + size for reloc in image.rel)
    at = section['offset'] + address - section['address']
    return image.b[at:at + size]

def table_entry(image, path, tag):
    """Read one selected length slot and one selected relocated pointer slot."""
    assert 0 <= tag < 20
    length_slot = path['length_table_base'] + tag * 8
    pointer_slot = path['pointer_table_base'] + tag * 8
    length_bytes = read_no_relocation(image, length_slot, 8, '.rodata')
    length = struct.unpack('<Q', length_bytes)[0]
    assert 0 < length <= 256, length
    pointer_section = section_of(image, pointer_slot, 8, '.data.rel.ro')
    pointer_at = pointer_section['offset'] + pointer_slot - pointer_section['address']
    pointer_bytes = image.b[pointer_at:pointer_at + 8]
    low, high = struct.unpack('<II', pointer_bytes)
    assert low == 0, 'pointer entry is an in-place addend'
    relocation = image.rel.get(pointer_slot)
    assert relocation is not None
    assert relocation['type'] == 8 and relocation['symbol_index'] == 0, relocation
    assert not any(pointer_slot < reloc < pointer_slot + 8 for reloc in image.rel)
    pointer = high
    assert pointer > 0
    name_bytes = read_no_relocation(image, pointer, length, '.rodata')
    return dict(
        length_slot=length_slot,
        length_slot_bytes_hex=length_bytes.hex(),
        length=length,
        length_relocation=None,
        pointer_slot=pointer_slot,
        pointer_raw_hex=pointer_bytes.hex(),
        pointer_low_word=low,
        pointer_high_word=high,
        pointer=pointer,
        pointer_relocation=relocation,
        name_interval=[pointer, pointer + length],
        bytes_hex=name_bytes.hex(),
    )

def trace(image, window, tag, prior=None):
    """Reuse the prior body trace, then add the selected table-entry checks."""
    prior = prior or prior_proof()
    base = prior.trace(image, window, tag)
    entry = table_entry(image, base, tag)
    assert entry['pointer'] == base['pointer']
    assert entry['length'] == base['length']
    assert entry['bytes_hex'] == base['bytes_hex']
    return dict(base, **entry)

def images(root, original, candidate):
    return prior_proof(root).images(root, original, candidate)

def inspect(packet, original, candidate, root):
    prior = prior_proof(root)
    before = prior.inspect(root / PRIOR, original, candidate, root)
    bundle = images(root, original, candidate)
    context = source_context(packet, root)
    names = {row['observed_tag']: row['name'] for row in context['variants']}
    initial = {tuple(pair) for pair in before['active_pairs']}
    owner_pairs = sorted(pair for pair in initial if pair[0] == OWNER)
    bad = set()
    observations = []
    for row in before['observations']:
        tag = row['observed_tag']
        assert tag in names and row['name'] == names[tag]
        original_window = bundle['original_windows'][row['original_owner']]
        candidate_window = bundle['candidate_windows'][row['candidate_owner']]
        left = trace(bundle['original_elf'], original_window, tag, prior)
        right = trace(bundle['candidate_elf'], candidate_window, tag, prior)
        name = names[tag]
        same = (
            left['length'] == right['length'] == len(name)
            and left['bytes_hex'] == right['bytes_hex'] == name.encode().hex()
            and left['pointer_low_word'] == right['pointer_low_word'] == 0
            and left['pointer_relocation']['type'] == 8
            and right['pointer_relocation']['type'] == 8
            and left['pointer_relocation']['symbol_index'] == 0
            and right['pointer_relocation']['symbol_index'] == 0
            and left['length_table_offset'] == right['length_table_offset'] == tag * 8
            and left['pointer_table_offset'] == right['pointer_table_offset'] == tag * 8
            and left['length_slot'] == row['original']['length_table_base'] + tag * 8
            and right['length_slot'] == row['candidate']['length_table_base'] + tag * 8
            and left['pointer_slot'] == row['original']['pointer_table_base'] + tag * 8
            and right['pointer_slot'] == row['candidate']['pointer_table_base'] + tag * 8
            and left['pointer'] == row['original']['pointer']
            and right['pointer'] == row['candidate']['pointer']
        )
        if not same:
            bad.add((row['original_owner'], row['candidate_owner']))
        observations.append(dict(
            observed_tag=tag,
            name=name,
            original_owner=row['original_owner'],
            candidate_owner=row['candidate_owner'],
            original=left,
            candidate=right,
            bytes_and_count_equal=same,
        ))
    active = initial - bad
    for row in observations:
        row['owner_closed'] = (
            (row['original_owner'], row['candidate_owner']) in active
            and row['bytes_and_count_equal']
        )
    rejected = len(initial - active)
    if bad:
        rejected = max(rejected, len(bad))
    length_slots = sorted({row['original']['length_slot'] for row in observations})
    pointer_slots = sorted({row['original']['pointer_slot'] for row in observations})
    candidate_length_slots = sorted({row['candidate']['length_slot'] for row in observations})
    candidate_pointer_slots = sorted({row['candidate']['pointer_slot'] for row in observations})
    assert len(length_slots) == len(pointer_slots) == 20
    assert length_slots == list(range(713112, 713112 + 20 * 8, 8))
    assert pointer_slots == list(range(727696, 727696 + 20 * 8, 8))
    assert candidate_length_slots == list(range(693552, 693552 + 20 * 8, 8))
    assert candidate_pointer_slots == list(range(708136, 708136 + 20 * 8, 8))
    tables = dict(
        original_length_table=[713112, 713272],
        original_pointer_table=[727696, 727856],
        candidate_length_table=[693552, 693712],
        candidate_pointer_table=[708136, 708296],
        length_table_entries=20,
        pointer_table_entries=20,
        length_table_bytes=160,
        pointer_table_raw_bytes=80,
        pointer_table_mapped_bytes=80,
        new_payload_bytes=320,
    )
    return dict(
        summary=dict(
            normalized_windows=before['summary']['normalized_windows'],
            raw_windows=before['summary']['raw_windows'],
            base_windows=before['summary']['extended_windows'],
            base_pairs=len(initial),
            extended_windows=len({start for start, _end in active}),
            extended_pairs=len(active),
            owner_pairs=len(owner_pairs),
            selected_tags=len(observations),
            length_table_entries=len(length_slots),
            length_table_bytes=160,
            pointer_table_entries=len(pointer_slots),
            pointer_table_raw_bytes=80,
            pointer_table_mapped_bytes=80,
            new_payload_bytes=320,
            prior_name_bytes=before['summary']['literal_bytes'],
            new_name_bytes=0,
            rejected_pairs=rejected,
        ),
        source_context=dict(
            lib_rs_sha256=context['lib_rs_sha256'],
            excerpt_sha256=context['excerpt_sha256'],
            tag_scope=context['tag_scope'],
        ),
        tables=tables,
        active_pairs=[list(pair) for pair in sorted(active)],
        observations=observations,
    )

def baseline_union(packet, root):
    """Verify the sealed baseline and recompute its interval union."""
    baseline = json.loads((packet / BASELINE).read_bytes())
    assert baseline['deltas'] == BASELINE_DELTAS, 'baseline historical source membership differs'
    assert baseline['baseline_commit'] == 'cf445540829a83fdfc9b1a759c3c325e2c30094f'
    assert baseline['payload_total_bytes'] == 26180
    assert baseline['payload_covered_bytes'] == 23514
    for section_name in ('.rodata', '.data.rel.ro'):
        raw = []
        mapped = []
        covered = []
        for path, digest in baseline['deltas'].items():
            delta = json.loads((root / path).read_bytes())
            assert sha((root / path).read_bytes()) == digest, path
            assert delta['payload_total_bytes'] == 26180, path
            section = next(item for item in delta['sections'] if item['section'] == section_name)
            raw.extend(section['raw_intervals'])
            mapped.extend(section['mapped_intervals'])
            covered.extend(section['covered_intervals'])
        raw = union(raw)
        mapped = union(mapped)
        covered = union(covered)
        assert union(raw + mapped) == covered, section_name
        expected = next(item for item in baseline['sections'] if item['section'] == section_name)
        assert expected['raw_intervals'] == raw
        assert expected['mapped_intervals'] == mapped
        assert expected['covered_intervals'] == covered
        assert expected['raw_equal_bytes'] == measure(raw)
        assert expected['pointer_only_bytes'] == measure(covered) - measure(raw)
        assert expected['covered_bytes'] == measure(covered)
        assert expected['total_bytes'] == (18396 if section_name == '.rodata' else 7784)
    assert sum(item['covered_bytes'] for item in baseline['sections']) == 23514
    return baseline

def coverage_delta(packet, report, root):
    baseline = baseline_union(packet, root)
    sections = []
    for section in baseline['sections']:
        raw = list(section['raw_intervals'])
        mapped = list(section['mapped_intervals'])
        if section['section'] == '.rodata':
            raw.extend(
                (row['original']['length_slot'], row['original']['length_slot'] + 8)
                for row in report['observations']
            )
        elif section['section'] == '.data.rel.ro':
            raw.extend(
                (row['original']['pointer_slot'], row['original']['pointer_slot'] + 4)
                for row in report['observations']
            )
            mapped.extend(
                (row['original']['pointer_slot'] + 4, row['original']['pointer_slot'] + 8)
                for row in report['observations']
            )
        else:
            raise AssertionError(section['section'])
        raw = union(raw)
        mapped = union(mapped)
        covered = union(raw + mapped)
        sections.append(dict(
            section=section['section'],
            total_bytes=section['total_bytes'],
            raw_intervals=raw,
            mapped_intervals=mapped,
            covered_intervals=covered,
            raw_equal_bytes=measure(raw),
            pointer_only_bytes=measure(covered) - measure(raw),
            covered_bytes=measure(covered),
            new_bytes=measure(covered) - section['covered_bytes'],
        ))
    by_section = {section['section']: section for section in sections}
    assert by_section['.rodata']['new_bytes'] == 160
    assert by_section['.data.rel.ro']['new_bytes'] == 160
    covered = sum(section['covered_bytes'] for section in sections)
    assert covered == 23834
    return dict(
        scope='20 selected MayhemError Debug length-table u64s and relocated pointer-table slots. Names are not re-credited; no allocation extent or relocation-table byte is claimed.',
        baseline_commit=baseline['baseline_commit'],
        baseline_delta_sha256=baseline['deltas'],
        baseline_payload_bytes=baseline['payload_covered_bytes'],
        baseline_rodata_bytes=next(item['covered_bytes'] for item in baseline['sections'] if item['section'] == '.rodata'),
        baseline_data_rel_ro_bytes=next(item['covered_bytes'] for item in baseline['sections'] if item['section'] == '.data.rel.ro'),
        sections=sections,
        new_payload_bytes=sum(section['new_bytes'] for section in sections),
        new_rodata_bytes=by_section['.rodata']['new_bytes'],
        new_data_rel_ro_bytes=by_section['.data.rel.ro']['new_bytes'],
        payload_covered_bytes=covered,
        payload_total_bytes=baseline['payload_total_bytes'],
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
    delta = coverage_delta(packet, report, root)
    assert delta == json.loads((packet / 'coverage-delta.json').read_bytes()), 'coverage delta differs'
    summary = report['summary']
    assert (
        summary['normalized_windows'], summary['raw_windows'],
        summary['base_windows'], summary['base_pairs'],
    ) == (437, 141, 431, 581)
    assert (
        summary['owner_pairs'], summary['selected_tags'],
        summary['length_table_bytes'], summary['pointer_table_raw_bytes'],
        summary['pointer_table_mapped_bytes'], summary['new_payload_bytes'],
        summary['prior_name_bytes'], summary['new_name_bytes'],
        summary['rejected_pairs'],
    ) == (1, 20, 160, 80, 80, 320, 335, 0, 0)
    assert (
        delta['baseline_payload_bytes'], delta['new_payload_bytes'],
        delta['payload_covered_bytes'], delta['payload_total_bytes'],
    ) == (23514, 320, 23834, 26180)
    by_section = {section['section']: section for section in delta['sections']}
    assert (
        by_section['.rodata']['new_bytes'],
        by_section['.rodata']['covered_bytes'],
        by_section['.rodata']['total_bytes'],
    ) == (160, 16722, 18396)
    assert (
        by_section['.data.rel.ro']['new_bytes'],
        by_section['.data.rel.ro']['covered_bytes'],
        by_section['.data.rel.ro']['total_bytes'],
    ) == (160, 7112, 7784)
    assert report['tables'] == dict(
        original_length_table=[713112, 713272],
        original_pointer_table=[727696, 727856],
        candidate_length_table=[693552, 693712],
        candidate_pointer_table=[708136, 708296],
        length_table_entries=20,
        pointer_table_entries=20,
        length_table_bytes=160,
        pointer_table_raw_bytes=80,
        pointer_table_mapped_bytes=80,
        new_payload_bytes=320,
    )
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
    delta = coverage_delta(packet, report, root)
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
