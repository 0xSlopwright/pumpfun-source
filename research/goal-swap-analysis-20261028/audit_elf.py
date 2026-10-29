#!/usr/bin/env python3
"""Report literal ELF equality and the explicitly unresolved sell boundary."""
import argparse
from collections import Counter
import hashlib
import importlib.util
import json
from pathlib import Path
import struct

SELL_START = 0x4c750
SELL_BYTES = 9024


def require(ok, message):
    if not ok:
        raise ValueError(message)


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def audit(repo, candidate, symbols):
    parent = repo/'repro/pump_amm/canonical-frontier-20261028'
    require(sha((parent/'MANIFEST.json').read_bytes()) == 'd05b92a344e1e095e6f68276eb50ddc64a36a0792ac20cb0e7c31c6f6f384489', 'Parent manifest changed')
    inventory = json.loads((parent/'MANIFEST.json').read_text())
    # The frozen parser's bytes are authenticated by the parent inventory before use.
    parser = parent/'tools/elf_reader.py'
    entry = inventory.get('files', inventory)['tools/elf_reader.py']
    expected = entry['sha256'] if isinstance(entry, dict) else entry
    require(sha(parser.read_bytes()) == expected, 'ELF parser changed')
    spec = importlib.util.spec_from_file_location('literal_amm_elf', parser)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    original = module.Elf(repo/'evidence/original/pump_amm/deployed.so')
    current = module.Elf(candidate)
    symbol_image = module.Elf(symbols)
    require(sha(original.b) == '6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7', 'Original image changed')
    shoff = struct.unpack_from('<Q', original.b, 40)[0]
    shsize, shcount = struct.unpack_from('<HH', original.b, 58)
    meaningful_bytes = max(shoff+shsize*shcount,
                           max(section[4]+section[5] for section in original.raw if section[1] != 8))
    require(meaningful_bytes == len(current.b) == 1268504, 'Meaningful ELF extent differs')
    require(not any(original.b[meaningful_bytes:]), 'Captured allocation suffix is not zero')
    require(original.entries == current.entries == symbol_image.entries and len(original.entries) == 785, 'Physical function boundaries differ')
    windows = [(a, z) for a, z in zip(original.entries, original.entries[1:]+[original.hi])]
    unequal = [(a, z) for a, z in windows if original.b[a:z] != current.b[a:z]]
    require(unequal == [(SELL_START, SELL_START+SELL_BYTES)], 'Another raw function boundary differs')
    require(all(original.b[a:z] == current.b[a:z] for a, z in windows if a != SELL_START), 'Raw body comparison failed')
    # The complete comparison below is literal. This classification only describes
    # where the unequal bytes are; it never turns those bytes into an equality claim.
    relocations = original.secs['.rel.dyn']
    require(relocations == current.secs['.rel.dyn'], 'Relocation table extent differs')
    changed_rows = []
    offset_fields = set()
    for at in range(relocations[4], relocations[4]+relocations[5], 16):
        before = struct.unpack_from('<QQ', original.b, at)
        after = struct.unpack_from('<QQ', current.b, at)
        if before == after:
            continue
        require(before[1] == after[1] and all(SELL_START <= x < SELL_START+SELL_BYTES for x in (before[0], after[0])), 'Unrelated relocation differs')
        changed_rows.append({'file_offset': at, 'original_offset': before[0], 'candidate_offset': after[0], 'info': before[1]})
        offset_fields.update(range(at, at+8))
    differences = [at for at, (x, y) in enumerate(zip(original.b, current.b)) if x != y]
    outside = [at for at in differences if not SELL_START <= at < SELL_START+SELL_BYTES and at not in offset_fields]
    require(not outside, 'Another meaningful ELF byte differs')
    exact_sections = {}
    for name in ('.rodata', '.data.rel.ro', '.dynamic', '.dynsym', '.dynstr', '.shstrtab'):
        before, after = original.secs[name], current.secs[name]
        require(before == after, name+' section header differs')
        require(original.b[before[4]:before[4]+before[5]] == current.b[after[4]:after[4]+after[5]], name+' payload differs')
        exact_sections[name] = before[5]
    original_calls = original.callsites(SELL_START, SELL_BYTES)
    current_calls = current.callsites(SELL_START, SELL_BYTES)
    require(len(original_calls) == len(current_calls) == 80, 'Sell direct call count differs')
    require(Counter(x['target'] for x in original_calls) == Counter(x['target'] for x in current_calls), 'Sell actual direct target multiset differs')
    ends = dict(windows)
    pending, reached, edges = [x['target'] for x in original_calls], set(), 0
    while pending:
        start = pending.pop()
        if start in reached:
            continue
        reached.add(start)
        end = ends[start]
        require(original.b[start:end] == current.b[start:end], 'Transitive callee differs')
        calls = original.callsites(start, end-start)
        edges += len(calls)
        pending.extend(x['target'] for x in calls)
    require(SELL_START not in reached, 'Transitive graph reaches the unequal boundary')
    return {'candidate_sha256': sha(current.b), 'symbols_sha256': sha(symbol_image.b),
            'meaningful_elf_bytes': meaningful_bytes, 'allocation_suffix_bytes': len(original.b)-meaningful_bytes,
            'allocation_suffix_zero': True, 'allocation_suffix_emitted': False,
            'physical_starts': 785, 'raw_windows': 784, 'raw_text_bytes': original.text[5]-SELL_BYTES,
            'unmatched_start': hex(SELL_START), 'unmatched_bytes': SELL_BYTES,
            'literal_equal_sections': exact_sections, 'meaningful_differing_bytes': len(differences),
            'changed_sell_relocation_rows': changed_rows, 'outside_sell_and_its_relocation_offset_differences': outside,
            'sell_actual_direct_calls': 80, 'same_actual_direct_target_multiset': True,
            'transitive_raw_identical_callees': len(reached), 'transitive_direct_edges': edges,
            'broad_indirect_call_closure_claimed': False,
            'whole_meaningful_elf_identical': original.b[:meaningful_bytes] == current.b,
            'goal_complete': False}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--candidate', type=Path, required=True)
    parser.add_argument('--symbols', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    report = audit(args.repo.resolve(), args.candidate.resolve(), args.symbols.resolve())
    args.output.write_text(json.dumps(report, indent=2)+'\n')
    print(json.dumps({key: value for key, value in report.items() if key != 'changed_sell_relocation_rows'}))
