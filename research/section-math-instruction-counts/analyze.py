"""Correct signed-shift and instruction-density counts in archived math analysis."""
import argparse
import hashlib
import json
from pathlib import Path
import sys
import types

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts/deep_section_analysis.py'
REVIEWED = {'805379ab5b529f77fd9207155f3bf0f19442a818749d3a55152f83007b861310',
            'a35097bc16fdc9a9f051b00671c523136d7d3a17467de33806f95cec707f54d4'}


def archived():
    raw = SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in REVIEWED:
        raise ValueError('Reviewed section analyzer changed')
    sys.path.insert(0, str(ROOT / 'scripts'))
    module = types.ModuleType('reviewed_section_math')
    module.__file__ = str(SOURCE)
    exec(compile(raw.decode('utf-8'), str(SOURCE), 'exec'), module.__dict__)
    return module


def instructions(data, start, end):
    at = start
    while at < end:
        width = 16 if data[at] == 0x18 else 8
        if at + width > end:
            raise ValueError('Incomplete instruction in math window')
        yield at
        at += width


def analyze(elf):
    result = archived().analyze_math_patterns(elf)
    for row in result['math_intensive_windows']:
        start = int(row['address'], 16)
        sites = list(instructions(elf.b, start, start + row['size']))
        row['instruction_slots'] = row['size'] // 8
        row['instruction_count'] = len(sites)
        row['shifts'] = sum(elf.b[at] in (0x67, 0x6f, 0x77, 0x7f, 0xc7, 0xcf) for at in sites)
        arithmetic = sum(row[name] for name in ('multiplications', 'divisions', 'additions', 'subtractions'))
        row['arithmetic_density'] = round(arithmetic / max(len(sites), 1), 4)
    return result


def input_paths():
    return {p.parent.name: p for p in sorted((ROOT / 'evidence').glob('**/deployed.so'))}


if __name__ == '__main__':
    archived()
    from window_elf_reader import Elf
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--program', choices=sorted(input_paths()), required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    path = input_paths()[args.program]
    elf = Elf(path)
    report = analyze(elf)
    args.output.mkdir(parents=True, exist_ok=False)
    payload = json.dumps(report, indent=2).encode('utf-8') + b'\n'
    (args.output / 'math.json').write_bytes(payload)
    manifest = dict(input=path.relative_to(ROOT).as_posix(), input_sha256=hashlib.sha256(elf.b).hexdigest(),
                    source_sha256=hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
                    output_sha256=hashlib.sha256(payload).hexdigest(), scope='Static arithmetic inventory; candidate heuristics remain unqualified')
    (args.output / 'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf-8', newline='\n')
    print(f"{args.program}: {report['total_math_windows']} static math windows")
