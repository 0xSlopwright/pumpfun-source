"""Count every static data reference before applying the archived display cap."""
import argparse
import hashlib
from pathlib import Path
import sys
import types

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts/deep_section_analysis.py'
SOURCE_SHA256 = {
    'a35097bc16fdc9a9f051b00671c523136d7d3a17467de33806f95cec707f54d4',
    '805379ab5b529f77fd9207155f3bf0f19442a818749d3a55152f83007b861310',
}


def corrected_module():
    raw = SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in SOURCE_SHA256:
        raise ValueError('The reviewed section-analysis source has changed')
    source = raw.decode().replace('\r\n', '\n')
    replacements = [
        ('    window_data_refs = []\n',
         '    window_data_refs = []\n    all_rodata_refs = collections.Counter()\n    all_data_refs = collections.Counter()\n'),
        ('        window_data_refs.append({\n',
         '        all_rodata_refs.update(refs["rodata"])\n        all_data_refs.update(refs["data_rel_ro"])\n        window_data_refs.append({\n'),
        ('    all_rodata_refs = collections.Counter()\n    all_data_refs = collections.Counter()\n    for w in window_data_refs:\n        for addr in w["rodata_addresses"]:\n            all_rodata_refs[addr] += 1\n        for addr in w["data_rel_ro_addresses"]:\n            all_data_refs[addr] += 1\n', ''),
    ]
    for before, after in replacements:
        if source.count(before) != 1:
            raise ValueError('Reviewed reference-frequency patch no longer applies')
        source = source.replace(before, after, 1)
    sys.path.insert(0, str(ROOT / 'scripts'))
    module = types.ModuleType('reviewed_section_reference_frequency')
    module.__file__ = str(SOURCE)
    exec(compile(source, str(SOURCE), 'exec'), module.__dict__)
    return module


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--program', required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if args.output.exists():
        parser.error('output already exists; preserve prior evidence')
    # The archived main parses the same arguments from sys.argv.
    sys.exit(corrected_module().main())
