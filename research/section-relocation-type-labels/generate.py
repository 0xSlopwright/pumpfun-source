"""Report SBPF relocation type names without rewriting historical reports."""
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
TYPE_NAMES = {0: 'R_BPF_NONE', 1: 'R_BPF_64_64', 8: 'R_BPF_64_RELATIVE', 10: 'R_BPF_64_32'}


def corrected_module():
    raw = SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in SOURCE_SHA256:
        raise ValueError('The reviewed section-analysis source has changed')
    source = raw.decode().replace('\r\n', '\n')
    before = '''    reloc_types = {
        0: "R_BPF_NONE", 1: "R_BPF_64_64", 2: "R_BPF_64_RELATIVE",
        8: "R_BPF_64_ABS64", 10: "R_BPF_64_ABS32",
    }'''
    if source.count(before) != 1:
        raise ValueError('Reviewed relocation-label patch no longer applies')
    source = source.replace(before, '    reloc_types = ' + repr(TYPE_NAMES), 1)
    sys.path.insert(0, str(ROOT / 'scripts'))
    module = types.ModuleType('reviewed_section_relocation_labels')
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
    sys.exit(corrected_module().main())
