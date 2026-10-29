"""Attribute a raw window match to a function that actually has identical bytes."""
import argparse
import hashlib
import json
from pathlib import Path
import types

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts/window_measure.py'
SOURCE_SHA256 = {'53444f621aee0f867ea69831ecd4ba1cc9c4a3eafe36db9c085bcc4c6cd9de1c',
                 '38ee923ca29b27322df9526b1a683c00d021f531dc519d12e2b1bdf01da25ab3'}


def corrected_module():
    raw = SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in SOURCE_SHA256:
        raise ValueError('The reviewed window-measurement source has changed')
    source = raw.decode().replace('\r\n', '\n')
    before = """        raw = any(o.b[a:z] == c.b[f['start']:f['start'] + z - a] for f in ms)
        rows.append({'original': hex(a), 'bytes': z - a, 'match': ms[0]['name'] if ms else None, 'raw': raw})"""
    after = """        raw_match = next((f for f in ms if o.b[a:z] == c.b[f['start']:f['start'] + z - a]), None)
        selected = raw_match if raw_match is not None else (ms[0] if ms else None)
        rows.append({'original': hex(a), 'bytes': z - a, 'match': selected['name'] if selected else None, 'raw': raw_match is not None})"""
    if source.count(before) != 1:
        raise ValueError('Reviewed raw-match attribution patch no longer applies')
    module = types.ModuleType('reviewed_raw_window_attribution')
    module.__file__ = str(SOURCE)
    exec(compile(source.replace(before, after, 1), str(SOURCE), 'exec'), module.__dict__)
    return module


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--original', required=True, type=Path)
    parser.add_argument('--candidate', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    rows = corrected_module().measure(args.original, args.candidate)
    with args.output.open('x', encoding='utf-8', newline='\n') as output:
        json.dump(rows, output, indent=2)
        output.write('\n')
