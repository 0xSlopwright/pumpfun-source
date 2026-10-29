"""Count register-form discriminator compares in account-validation patterns.

The archived detector accepts an ldxdw from offset 0 only when the next
instruction is immediate jeq or jne (0x15, 0x55). Register jeq and jne
(0x1d, 0x5d) compare those loaded account bytes and are omitted.
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
BEFORE = '                if next_off < end and b[next_off] in (0x15, 0x55):'
AFTER = '                if next_off < end and b[next_off] in (0x15, 0x1d, 0x55, 0x5d):'


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
        raise ValueError('Discriminator-compare adaptation is no longer unique')
    if correct:
        source = source.replace(BEFORE, AFTER)
    sys.path.insert(0, str(ROOT / 'scripts'))
    name = 'reviewed_disc_compares' if correct else 'archived_disc_compares'
    module = types.ModuleType(name)
    module.__file__ = str(HELPER)
    exec(compile(source, str(HELPER), 'exec'), module.__dict__)
    return module


def corrected_module():
    return load_module(True)


def archived_module():
    return load_module(False)
