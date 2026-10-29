"""Recognize relocated references inside an existing printable rodata run."""
import argparse
from bisect import bisect_right
import hashlib
from pathlib import Path
import sys
import types

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts/deep_disassembly.py'
SOURCE_SHA256 = {'bcc2c08b7f6e800ea484b81fc188324c89ca5f197d55815e98efa89beaca6c8e',
                 'e0241c00f43218f15a127ded6c6e5398811faa38d7b6fcd8f875029135db0ceb'}


def string_at(elf, strings, starts, address, site):
    if address in strings:
        return strings[address]
    if elf.relocations.get(site, {}).get('type') != 8:
        return None
    index = bisect_right(starts, address) - 1
    if index < 0:
        return None
    first = starts[index]
    offset = address - first
    value = strings[first]
    return value[offset:] if 0 < offset <= len(value) - 4 else None


def corrected_module():
    raw = SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in SOURCE_SHA256:
        raise ValueError('The reviewed disassembler source has changed')
    source = raw.decode().replace('\r\n', '\n')
    replacements = [
        # Retain the accepted PR #933 relative-call correction.
        ('if src_reg == 0x10:', 'if src_reg == 1 and elf.relocations.get(offset, {}).get("type") != 10:'),
        ('    rodata_strings = extract_rodata_strings(elf)\n', '    rodata_strings = extract_rodata_strings(elf)\n    rodata_starts = sorted(rodata_strings)\n'),
        ('                if val in rodata_strings:', '                if (reference := STRING_AT(elf, rodata_strings, rodata_starts, val, insn["offset"])) is not None:'),
        ('rodata_strings[val][:120]', 'reference[:120]'),
    ]
    for before, after in replacements:
        if source.count(before) != 1:
            raise ValueError('Reviewed string-reference patch no longer applies')
        source = source.replace(before, after, 1)
    sys.path.insert(0, str(ROOT / 'scripts'))
    module = types.ModuleType('reviewed_interior_string_references')
    module.__file__ = str(SOURCE)
    module.STRING_AT = string_at
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
