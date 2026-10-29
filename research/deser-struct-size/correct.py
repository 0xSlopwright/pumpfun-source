"""Use every load offset when inferring a deserialization struct size.

The archived section analyzer keeps a 20-offset display list and then takes
that list's maximum as the struct size. Later offsets are dropped. Pump window
0xfbc0 is published as 215 bytes; the loads extend to 231.
"""
import hashlib
import sys
import types
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HELPER = ROOT / 'scripts/deep_section_analysis.py'
HELPER_SHA256 = {
    '805379ab5b529f77fd9207155f3bf0f19442a818749d3a55152f83007b861310',
    'a35097bc16fdc9a9f051b00671c523136d7d3a17467de33806f95cec707f54d4',
}
BEFORE = '"likely_struct_size": max(offsets[:20]) + 8 if offsets else 0,'
AFTER = '"likely_struct_size": max(offsets) + 8 if offsets else 0,'


def load_module(correct):
    raw = HELPER.read_bytes()
    text = raw.replace(b'\r\n', b'\n')
    forms = {
        hashlib.sha256(text).hexdigest(),
        hashlib.sha256(text.replace(b'\n', b'\r\n')).hexdigest(),
    }
    digest = hashlib.sha256(raw).hexdigest()
    if forms != HELPER_SHA256 or digest not in HELPER_SHA256:
        raise ValueError('The reviewed section analyzer has changed')
    source = text.decode()
    if source.count(BEFORE) != 1:
        raise ValueError('Struct-size adaptation is no longer unique')
    if correct:
        source = source.replace(BEFORE, AFTER)
    sys.path.insert(0, str(ROOT / 'scripts'))
    module = types.ModuleType('reviewed_struct_size' if correct else 'archived_struct_size')
    module.__file__ = str(HELPER)
    exec(compile(source, str(HELPER), 'exec'), module.__dict__)
    return module


def corrected_module():
    return load_module(True)


def archived_module():
    return load_module(False)
