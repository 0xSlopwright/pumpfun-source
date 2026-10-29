"""Separate concatenated Anchor instruction-log names.

The archived extractor keeps every following letter and digit. Captured
strings such as ``Instruction: BuyCreateV2Disabled`` therefore publish
``BuyCreateV2Disabled`` instead of the IDL name ``Buy``. This module checks
the archived helper and reads the captured bytes directly. It does not
rewrite ``evidence/binary-analysis.json``.
"""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HELPER = ROOT / 'scripts/analyze.py'
HELPER_SHA256 = {
    'dd7fb38d795d4dd72a25aab0d65c2223d9f6f75d8b3ecb0de1d87d6e102910ac',
    '6edfba06846ff9d6ba930867078acbbe25c88f6dedf0b1c5ab57da01384de4e6',
}
ARCHIVED_PATTERN = re.compile(
    rb'Instruction: ([A-Z][A-Za-z0-9]*?)(?=Instruction:|[^A-Za-z0-9]|$)'
)
ANCHOR_IDL_NAMES = (
    'IdlCreateAccount',
    'IdlCreateBuffer',
    'IdlWrite',
    'IdlSetAuthority',
    'IdlSetBuffer',
    'IdlCloseAccount',
    'IdlResizeAccount',
)
PROGRAMS = ('pump', 'pump_amm', 'pump_fees')


def pascal_case(name):
    return ''.join(part[:1].upper() + part[1:] for part in name.split('_') if part)


def require_archived_helper():
    raw = HELPER.read_bytes()
    text = raw.replace(b'\r\n', b'\n')
    forms = {
        hashlib.sha256(text).hexdigest(),
        hashlib.sha256(text.replace(b'\n', b'\r\n')).hexdigest(),
    }
    digest = hashlib.sha256(raw).hexdigest()
    if forms != HELPER_SHA256 or digest not in HELPER_SHA256:
        raise ValueError('The reviewed analyzer source has changed')
    needle = "re.finditer(rb'Instruction: ([A-Z][A-Za-z0-9]*?)(?=Instruction:|[^A-Za-z0-9]|$)',b)"
    if text.decode().count(needle) != 1:
        raise ValueError('The archived instruction-name pattern is no longer unique')
    return digest


def allowed_names(program):
    idl = json.loads((ROOT / 'evidence/upstream' / f'{program}.json').read_text())
    names = {pascal_case(instruction['name']) for instruction in idl['instructions']}
    return names | set(ANCHOR_IDL_NAMES)


def archived_names(blob):
    return sorted({match.group(1).decode() for match in ARCHIVED_PATTERN.finditer(blob)})


def instruction_sites(blob, allowed):
    rows = []
    key = b'Instruction: '
    start = 0
    while True:
        offset = blob.find(key, start)
        if offset < 0:
            break
        rest = blob[offset + len(key):offset + len(key) + 400]
        match = None
        for name in allowed:
            if rest.startswith(name.encode()) and (match is None or len(name) > len(match)):
                match = name
        if match is None:
            raise ValueError(f'No IDL instruction name at file offset {offset}')
        rows.append({
            'offset': offset,
            'name': match,
            'prefix_hex': blob[offset:offset + len(key) + len(match)].hex(),
        })
        start = offset + len(key)
    return rows


def corrected_names(blob, allowed):
    return sorted({row['name'] for row in instruction_sites(blob, allowed)})


def program_blob(program):
    return (ROOT / 'evidence/original' / program / 'deployed.so').read_bytes()
