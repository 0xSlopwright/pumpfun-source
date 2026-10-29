#!/usr/bin/env python3
"""Read-only census of the 38 IDL instruction dispatch wrappers."""
from pathlib import Path
import argparse
import hashlib
import json
import re
import struct
import types

W = Path(__file__).resolve().parent
ORIGINAL = '6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
CANDIDATE = '97bd5553c199cd24fb2d07034c365527bee5b138bf5dd7a0aa3099186aad2643'
SYMBOLS = '0142baeed4ee183435f763fb0d6124fa746196722700f3511c3d2b8375813dca'
DEFAULT = 'repro/pump_amm/optional-context-recovery-20261027/results/build'

def sha(data):
    return hashlib.sha256(data).hexdigest()

def load_reader():
    # Compile the manifest-authenticated source, without trusting a pyc cache.
    module = types.ModuleType('census_elf_reader')
    module.__file__ = str(W / 'elf_reader.py')
    exec(compile((W / 'elf_reader.py').read_bytes(), module.__file__, 'exec'), module.__dict__)
    return module.Elf

def first_log(elf, start):
    """Only decode the straight-line constant register prefix, through first call."""
    regs = {}
    p = start
    while p < min(start + 256, elf.hi):
        op, both, off, imm = struct.unpack_from('<BBhi', elf.b, p)
        dst, src = both & 15, both >> 4
        if op == 0x18:
            regs[dst] = struct.unpack_from('<I', elf.b, p + 4)[0] | struct.unpack_from('<I', elf.b, p + 12)[0] << 32
            p += 8
        elif op == 0xb7:
            regs[dst] = imm
        elif op == 0xbf:
            regs[dst] = regs.get(src)
        elif op == 0x85:
            rel = elf.relocations.get(p, {})
            if rel.get('symbol') == 'sol_log_' and isinstance(regs.get(1), int) and isinstance(regs.get(2), int):
                pointer, length = regs[1], regs[2]
                if 0 < length < 128 and 0 <= pointer <= len(elf.b) - length:
                    text = elf.b[pointer:pointer + length]
                    if text.startswith(b'Instruction: '):
                        return {'label': text.decode(), 'offset': p - start, 'pointer': pointer, 'length': length}
            return None
        elif op not in (0x7b, 0x63, 0x73, 0x62, 0x72, 0x7a):
            # Reject unsupported register writes/control flow in the prefix.
            return None
        p += 8
    return None

def compare(code_a, pattern_a, code_b, pattern_b):
    return code_a == code_b and pattern_a == pattern_b

def census(original, candidate, symbols):
    Elf = load_reader()
    o, c, s = Elf(original), Elf(candidate), Elf(symbols)
    assert c.b[c.lo:c.hi] == s.b[s.lo:s.hi], 'Symbols text differs from candidate'
    idl = json.loads((W / 'pump_amm.json').read_bytes())
    names = sorted(i['name'] for i in idl['instructions'])
    assert len(names) == len(set(names)) == 38
    labels = {'Instruction: ' + ''.join(part[0].upper() + part[1:] for part in name.split('_')): name for name in names}
    original_logs = {}
    for start in o.entries:
        log = first_log(o, start)
        if log:
            assert log['label'] not in original_logs
            original_logs[log['label']] = (start, log)
    assert set(labels) <= set(original_logs)
    excluded = sorted(set(original_logs) - set(labels))
    assert excluded == ['Instruction: IdlCloseAccount', 'Instruction: IdlCreateAccount', 'Instruction: IdlCreateBuffer', 'Instruction: IdlResizeAccount', 'Instruction: IdlSetAuthority', 'Instruction: IdlSetBuffer', 'Instruction: IdlWrite']
    rows = []
    for label, name in sorted(labels.items()):
        functions = [f for f in s.funcs if re.search(r'8__global' + str(len(name)) + re.escape(name) + r'17h[0-9a-f]+E$', f['name'])]
        assert len(functions) == 1, (name, functions)
        f = functions[0]
        a, log_a = original_logs[label]
        b, nb = f['start'], f['size']
        na = o.entries[o.entries.index(a) + 1] - a
        log_b = first_log(c, b)
        assert log_b and log_a['label'] == log_b['label'] == label
        ca, cb = o.normalized[a:a + na], c.normalized[b:b + nb]
        pa, pb = o.pattern(a, na), c.pattern(b, nb)
        rows.append({'instruction': name, 'label': label, 'original': {'start': a, 'size': na, 'first_log': log_a}, 'candidate': {**f, 'first_log': log_b}, 'normalized_equal': ca == cb, 'relocations_equal': pa == pb, 'body_and_relocations_equal': compare(ca, pa, cb, pb), 'raw_equal': o.b[a:a + na] == c.b[b:b + nb], 'original_normalized_sha256': sha(ca), 'candidate_normalized_sha256': sha(cb), 'original_relocations': pa, 'candidate_relocations': pb, 'original_calls': o.callsites(a, na), 'candidate_calls': c.callsites(b, nb)})
    assert sum(r['body_and_relocations_equal'] for r in rows) == 38
    assert all(r['body_and_relocations_equal'] for r in rows)
    # In-memory controls only; no original or candidate binary is changed.
    first = next(r for r in rows if r['body_and_relocations_equal'])
    a, b, size = first['original']['start'], first['candidate']['start'], first['original']['size']
    code, pattern = o.normalized[a:a + size], o.pattern(a, size)
    mutated = bytes([code[0] ^ 1]) + code[1:]
    wrong_relocation = [dict(x) for x in pattern]
    assert wrong_relocation
    wrong_relocation[0]['type'] ^= 1
    other = next(r for r in rows if r['instruction'] != first['instruction'] and r['body_and_relocations_equal'])
    other_start, other_size = other['candidate']['start'], other['candidate']['size']
    controls = {'changed_instruction_rejected': not compare(code, pattern, mutated, pattern), 'changed_relocation_rejected': not compare(code, pattern, code, wrong_relocation), 'wrong_wrapper_alias_rejected': not compare(code, pattern, c.normalized[other_start:other_start + other_size], c.pattern(other_start, other_size)), 'shifted_entry_rejected_by_boundary_inventory': a + 8 not in o.entries}
    assert all(controls.values()), controls
    return {'roster': names, 'instruction_wrappers': 38, 'normalized_and_relocation_matches': 38, 'raw_matches': sum(r['raw_equal'] for r in rows), 'excluded_idl_management_labels': excluded, 'negative_controls': controls, 'rows': rows, 'scope': 'Only the 38 IDL instruction dispatch wrapper windows and their relocation patterns. Direct call immediates and relocation addresses are normalized; callee bodies, target semantics, transitive closure, parser correctness, runtime behavior, the entrypoint dispatcher, generated IDL-management instructions, and whole-ELF identity are excluded.'}
