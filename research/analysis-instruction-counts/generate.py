"""Count decoded instructions separately from eight-byte instruction slots."""
import argparse
import hashlib
from pathlib import Path
import sys
import types

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts/analyze_program.py'
SOURCE_SHA256 = {'149d5d3dd0a9765f0da71abcdda42169d4e06ee0ed1bd64e355b8d3978aa8969',
                 'b6e945c08aac13ebd5c4411b9f7ce21fecd8daf6753eb432769189b96a820e5a'}


def count_instructions(data, start, end):
    if start < 0 or end > len(data) or start > end or start % 8 or end % 8:
        raise ValueError('Invalid instruction window')
    count, at = 0, start
    while at < end:
        size = 16 if data[at] == 0x18 else 8
        if at + size > end:
            raise ValueError('Truncated wide instruction')
        count += 1
        at += size
    return count


def corrected_module():
    raw = SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in SOURCE_SHA256:
        raise ValueError('The reviewed program-analysis source has changed')
    source = raw.decode().replace('\r\n', '\n')
    replacements = [
        ('            "size": size,\n            "name": name,', '            "size": size,\n            "instruction_count": COUNT_INSTRUCTIONS(elf.b, start, end),\n            "name": name,'),
        ('    total_text = elf.hi - elf.lo\n', '    total_text = elf.hi - elf.lo\n    total_instructions = sum(w["instruction_count"] for w in windows)\n'),
        ('            "size": total_text,', '            "size": total_text,\n            "instruction_count": total_instructions,\n            "instruction_slots": total_text // 8,'),
        ('{total_text // 8:,} BPF instructions', '{total_instructions:,} BPF instructions; {total_text // 8:,} eight-byte slots'),
        ('{w["size"]//8:,}', '{w["instruction_count"]:,}'),
    ]
    for before, after in replacements:
        if source.count(before) != 1:
            raise ValueError('Reviewed instruction-count patch no longer applies')
        source = source.replace(before, after, 1)
    sys.path.insert(0, str(ROOT / 'scripts'))
    module = types.ModuleType('reviewed_program_instruction_counts')
    module.__file__ = str(SOURCE)
    module.COUNT_INSTRUCTIONS = count_instructions
    exec(compile(source, str(SOURCE), 'exec'), module.__dict__)
    return module


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--program', required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if args.output.exists():
        parser.error('output already exists; preserve prior evidence')
    sys.exit(corrected_module().analyze_program(args.program, args.output))
