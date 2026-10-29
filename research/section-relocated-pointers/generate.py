"""Resolve SBPF relative addends in the data-layout pointer scan.

R_BPF_64_RELATIVE stores the target in the high 32 bits of the qword.
The archived scan compares the whole qword with section bounds, so those
pointers do not match.
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
BEFORE = '''            val = struct.unpack_from("<Q", data, i)[0]
            if elf.lo <= val < elf.hi and val % 8 == 0:
                pointers.append({
                    "offset": i,
                    "address": hex(start + i),
                    "points_to": hex(val),
                    "in_text": True,
                })
            elif start <= val < start + size:
                pointers.append({
                    "offset": i,
                    "address": hex(start + i),
                    "points_to": hex(val),
                    "in_text": False,
                    "self_reference": True,
                })
'''
AFTER = '''            stored = struct.unpack_from("<Q", data, i)[0]
            slot = start + i
            reloc = elf.relocations.get(slot)
            # Type 8 outside an lddw keeps the address in the high half.
            if reloc and reloc.get("type") == 8 and not (
                elf.lo <= slot < elf.hi and data[i] == 0x18
            ):
                val = stored >> 32
            else:
                val = stored
            if elf.lo <= val < elf.hi and val % 8 == 0:
                pointers.append({
                    "offset": i,
                    "address": hex(slot),
                    "points_to": hex(val),
                    "in_text": True,
                })
            elif start <= val < start + size:
                pointers.append({
                    "offset": i,
                    "address": hex(slot),
                    "points_to": hex(val),
                    "in_text": False,
                    "self_reference": True,
                })
            elif reloc and reloc.get("type") == 8:
                for sec_name, sec_row in elf.secs.items():
                    if sec_row[1] != 8 and sec_row[5] and sec_row[3] <= val < sec_row[3] + sec_row[5]:
                        pointers.append({
                            "offset": i,
                            "address": hex(slot),
                            "points_to": hex(val),
                            "in_text": False,
                            "target_section": sec_name,
                        })
                        break
'''


def load_module(correct):
    raw = HELPER.read_bytes()
    text = raw.replace(b'\r\n', b'\n')
    forms = {
        hashlib.sha256(text).hexdigest(),
        hashlib.sha256(text.replace(b'\n', b'\r\n')).hexdigest(),
    }
    digest = hashlib.sha256(raw).hexdigest()
    if forms != HELPER_SHA256 or digest not in HELPER_SHA256:
        raise ValueError('The reviewed section-analysis helper has changed')
    source = text.decode()
    if source.count(BEFORE) != 1:
        raise ValueError('Relocated-pointer adaptation is no longer unique')
    if correct:
        source = source.replace(BEFORE, AFTER)
    sys.path.insert(0, str(ROOT / 'scripts'))
    name = 'reviewed_relocated_pointers' if correct else 'archived_relocated_pointers'
    module = types.ModuleType(name)
    module.__file__ = str(HELPER)
    exec(compile(source, str(HELPER), 'exec'), module.__dict__)
    return module


def corrected_module():
    return load_module(True)


def archived_module():
    return load_module(False)
