"""Recognize signed less-than and less-or-equal branches in error patterns.

The archived detector lists equality, unsigned order, and signed greater-than
branches. It omits jslt (0xc5, 0xcd) and jsle (0xd5, 0xdd), so a conditional
move of an error immediate at those branches is dropped.
"""
import hashlib
import sys
import types
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HELPER = ROOT / 'scripts/bytecode_signatures.py'
HELPER_SHA256 = {
    '8200e01f582be1a267d187e6340ac2d403c22cad26bfd65e2613e19ea8a55f76',
    'c9aad66270f0fd36382fa4fd8dbea3eddf3f399b7d8bb2e4481e19f8850c6136',
}
BEFORE = '''        if opcode in (0x15, 0x1d, 0x25, 0x2d, 0x35, 0x3d,
                      0x55, 0x5d, 0x65, 0x6d, 0x75, 0x7d,
                      0xa5, 0xad, 0xb5, 0xbd):'''
AFTER = '''        if opcode in (0x15, 0x1d, 0x25, 0x2d, 0x35, 0x3d,
                      0x55, 0x5d, 0x65, 0x6d, 0x75, 0x7d,
                      0xa5, 0xad, 0xb5, 0xbd, 0xc5, 0xcd,
                      0xd5, 0xdd):'''


def load_module(correct):
    raw = HELPER.read_bytes()
    text = raw.replace(b'\r\n', b'\n')
    forms = {
        hashlib.sha256(text).hexdigest(),
        hashlib.sha256(text.replace(b'\n', b'\r\n')).hexdigest(),
    }
    digest = hashlib.sha256(raw).hexdigest()
    if forms != HELPER_SHA256 or digest not in HELPER_SHA256:
        raise ValueError('The reviewed bytecode-pattern helper has changed')
    source = text.decode()
    if source.count(BEFORE) != 1:
        raise ValueError('Signed-compare adaptation is no longer unique')
    if correct:
        source = source.replace(BEFORE, AFTER)
    sys.path.insert(0, str(ROOT / 'scripts'))
    module = types.ModuleType('reviewed_signed_compare' if correct else 'archived_signed_compare')
    module.__file__ = str(HELPER)
    exec(compile(source, str(HELPER), 'exec'), module.__dict__)
    return module


def corrected_module():
    return load_module(True)


def archived_module():
    return load_module(False)


def collect(module, elf):
    rows = []
    for start, end in zip(elf.entries, elf.entries[1:] + [elf.hi]):
        for pattern in module.detect_error_patterns(elf, start, end):
            rows.append({**pattern, 'address': start + pattern['offset']})
    return rows
