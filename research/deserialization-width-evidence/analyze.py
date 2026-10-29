"""Preserve conflicting static load widths instead of selecting the first one."""
import argparse
from collections import defaultdict
import hashlib
import json
from pathlib import Path
import struct
import types

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / 'research/deser-struct-size/correct.py'
REVIEWED_BASE = {'852d430ad991788e8a1ddca4d1371c40a44b63fb37f27c1be949cf52f9abe966',
                 'f68475059f94a6b2f1672281fa7b84cc1504734b9b24e4d9b0bb722e6bd89a2b'}
WIDTH = {0x61:4, 0x69:2, 0x71:1, 0x79:8}


def baseline():
    raw = BASE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in REVIEWED_BASE:
        raise ValueError('Reviewed full-span adapter changed')
    module = types.ModuleType('reviewed_full_span')
    module.__file__ = str(BASE)
    exec(compile(raw.decode('utf-8'), str(BASE), 'exec'), module.__dict__)
    return module.corrected_module()


def analyze(elf):
    report = baseline().recover_anchor_idl(elf)
    ends = dict(zip(elf.entries, elf.entries[1:] + [elf.hi]))
    for row in report['deserialization_patterns']:
        start = int(row['window'],16)
        observed = defaultdict(list)
        at = start
        while at < ends[start]:
            opcode = elf.b[at]
            if opcode in WIDTH and elf.b[at+1] >> 4 == row['base_reg']:
                offset = struct.unpack_from('<h',elf.b,at+2)[0]
                observed[offset].append(dict(address=hex(at),width=WIDTH[opcode]))
            at += 16 if opcode == 0x18 else 8
        widths = [sorted({site['width'] for site in observed[offset]}) for offset in row['field_offsets']]
        row['field_sizes'] = [values[0] if len(values)==1 else None for values in widths]
        row['observed_load_widths'] = widths
        row['ambiguous_field_offsets'] = [offset for offset,values in zip(row['field_offsets'],widths) if len(values)>1]
        row['load_width_evidence'] = [observed[offset] for offset in row['field_offsets']]
    return report


if __name__ == '__main__':
    baseline()
    from window_elf_reader import Elf
    inputs = {p.parent.name:p for p in sorted((ROOT/'evidence').glob('**/deployed.so'))}
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--program',choices=sorted(inputs),required=True)
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    path=inputs[args.program];elf=Elf(path)
    payload=json.dumps(analyze(elf),indent=2).encode('utf-8')+b'\n'
    args.output.mkdir(parents=True,exist_ok=False)
    (args.output/'idl-patterns.json').write_bytes(payload)
    manifest=dict(input=path.relative_to(ROOT).as_posix(),input_sha256=hashlib.sha256(elf.b).hexdigest(),
                  base_sha256=hashlib.sha256(BASE.read_bytes()).hexdigest(),output_sha256=hashlib.sha256(payload).hexdigest(),
                  scope='Static load observations; field identity/layout and runtime sizes remain unresolved')
    (args.output/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(f'{args.program}: preserved static load-width evidence')
