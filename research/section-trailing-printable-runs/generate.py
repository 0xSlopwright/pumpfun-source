"""Retain a printable run that reaches a captured section's final byte."""
import argparse
import hashlib
import json
from pathlib import Path
import sys
import types

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts/deep_section_analysis.py'
SOURCE_SHA256 = {'a35097bc16fdc9a9f051b00671c523136d7d3a17467de33806f95cec707f54d4',
                 '805379ab5b529f77fd9207155f3bf0f19442a818749d3a55152f83007b861310'}
CAPTURES = {name: ROOT / f'evidence/original/{name}/deployed.so' for name in ('pump', 'pump_amm', 'pump_fees', 'mayhem')}
CAPTURES.update({name: ROOT / f'evidence/dependencies/{name}/deployed.so' for name in ('spl_token', 'spl_token_2022', 'associated_token', 'token_metadata', 'donation_relay')})


def corrected_module():
    raw = SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in SOURCE_SHA256:
        raise ValueError('The reviewed section-analysis source has changed')
    source = raw.decode().replace('\r\n', '\n')
    marker = '        # Zero padding analysis\n'
    flush = '''        if len(current) >= 4:
            strings.append({
                "offset": current_start,
                "address": hex(start + current_start),
                "length": len(current),
                "value": "".join(current)[:200],
            })

'''
    if source.count(marker) != 1:
        raise ValueError('Reviewed trailing-run patch no longer applies')
    source = source.replace(marker, flush + marker, 1)
    sys.path.insert(0, str(ROOT / 'scripts'))
    module = types.ModuleType('reviewed_trailing_printable_runs')
    module.__file__ = str(SOURCE)
    exec(compile(source, str(SOURCE), 'exec'), module.__dict__)
    return module


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--capture', choices=sorted(CAPTURES), required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    path = CAPTURES[args.capture]
    module = corrected_module()
    record = {'capture': path.relative_to(ROOT).as_posix(),
              'deployed_sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
              'reviewed_source_sha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
              'data_layout': module.analyze_data_layout(module.Elf(path))}
    with args.output.open('x', encoding='utf-8', newline='\n') as output:
        json.dump(record, output, indent=2)
        output.write('\n')
