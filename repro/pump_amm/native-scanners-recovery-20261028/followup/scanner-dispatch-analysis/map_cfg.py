from pathlib import Path
from collections import Counter
import json
import struct
import sys

R = Path(__file__).resolve().parents[2]
W = Path(__file__).resolve().parent
V = Path(__file__).resolve().parent
sys.path.insert(0, str(W))
from object_sections import sections
from elf_reader import Elf

original = Elf(W / 'inputs/original.so')
base = original.b[0xf28b8:0xf2d60]
current = next(f['code'] for f in sections(W / 'inputs/outlined-bool.o') if 'supported_mint_data' in f['name'])
trial = next(f['code'] for f in sections(V / 'objects/native-dispatch/native_policy.o') if 'supported_mint_data' in f['name'])

def cfg(code):
    instr = {}
    at = 0
    while at < len(code):
        op, rs, off, imm = struct.unpack_from('<BBhi', code, at)
        step = 16 if op == 0x18 else 8
        instr[at] = (op, rs, off, imm, step)
        at += step
    successors = {}
    leaders = {0}
    for at, (op, rs, off, imm, step) in instr.items():
        branch = op == 5 or (op & 7 in (5, 6) and op not in (0x85, 0x8d, 0x95))
        if op == 0x95:
            edges = []
        elif op == 5:
            edges = [at + 8 + off * 8]
        elif branch:
            edges = [at + step, at + 8 + off * 8]
        else:
            edges = [at + step]
        successors[at] = [a for a in edges if a in instr]
        if branch:
            leaders.update(successors[at])
            leaders.add(at + step)
    reach = set()
    todo = [0]
    while todo:
        at = todo.pop()
        if at in reach:
            continue
        reach.add(at)
        todo.extend(successors[at])
    leaders = sorted(leaders & reach)
    blocks = []
    for i, at in enumerate(leaders):
        end = leaders[i + 1] if i + 1 < len(leaders) else len(code)
        body = [p for p in instr if at <= p < end and p in reach]
        blocks.append({'start': at, 'end': end, 'instructions': [
            {'at': p, 'op': hex(instr[p][0]), 'rs': hex(instr[p][1]), 'off': instr[p][2], 'imm': instr[p][3]}
            for p in body], 'successors': successors[body[-1]]})
    return {'bytes': len(code), 'instructions': len(instr), 'reachable': len(reach), 'blocks': blocks,
            'opcode_counts': dict(Counter(hex(x[0]) for x in instr.values()))}

if __name__ == '__main__':
    records = {name: cfg(code) for name, code in [('original', base), ('outlined_bool', current), ('dispatch_trial', trial)]}
    (V / 'cfg.json').write_text(json.dumps(records, indent=2) + '\n')
    print({name: {k: value[k] for k in ['bytes', 'instructions', 'reachable']} | {'blocks': len(value['blocks'])} for name, value in records.items()})
    keys = set(records['original']['opcode_counts']) | set(records['outlined_bool']['opcode_counts'])
    print('opcode_delta_original_vs_bool', {k: records['original']['opcode_counts'].get(k, 0) - records['outlined_bool']['opcode_counts'].get(k, 0) for k in keys if records['original']['opcode_counts'].get(k, 0) != records['outlined_bool']['opcode_counts'].get(k, 0)})
