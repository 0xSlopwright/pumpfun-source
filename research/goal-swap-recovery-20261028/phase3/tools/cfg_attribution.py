"""Read-only AMM sell CFG attribution, never a recovery/acceptance normalizer.

The official 785-window body+relocation-pattern rule remains authoritative.
Unconditional-only forwarding and unique straight-line joins are removed only
for graph attribution. A separate diagnostic can invert a branch and swap its
edge roles; original normalized instruction values are always retained. Static
pointed-to data, indirect targets and exhaustive runtime semantics are not proved.
"""
from pathlib import Path
from collections import Counter
import difflib
import hashlib
import json
import struct
import sys

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS))
from elf_reader import Elf
from measure import measure

ORIGINAL_START = 0x4c750


def sha(value):
    return hashlib.sha256(value).hexdigest()


def stable(value):
    return sha(json.dumps(value, sort_keys=True, separators=(',', ':')).encode())


class Inventory:
    def __init__(self, path, original=False):
        self.path = path
        self.elf = Elf(path)
        self.original = original
        self.functions = {}
        if original:
            for a, z in zip(self.elf.entries, self.elf.entries[1:] + [self.elf.hi]):
                self.functions[a] = {'start': a, 'size': z-a, 'name': ''}
            assert len(self.functions) == 785
        else:
            for f in self.elf.funcs:
                if f['start'] not in self.functions or self.functions[f['start']]['size'] < f['size']:
                    self.functions[f['start']] = f
        self.cache = {}
        self.unresolved = set()

    def function(self, start):
        f = self.functions[start]
        end = start + f['size']
        return {
            'bytes': f['size'],
            'raw_sha256': sha(self.elf.b[start:end]),
            'normalized_sha256': sha(self.elf.normalized[start:end]),
            'relocations': self.elf.pattern(start, f['size']),
            'calls': self.elf.callsites(start, f['size']),
            'name': f['name'],
        }

    def tag(self, start, depth):
        key = (start, depth)
        if key not in self.cache:
            if start not in self.functions:
                self.unresolved.add(start)
                self.cache[key] = {'unresolved_actual_target': hex(start)}
            else:
                f = self.function(start)
                self.cache[key] = {
                    'bytes': f['bytes'],
                    'official_normalized_sha256': f['normalized_sha256'],
                    'relocation_pattern': f['relocations'],
                    'direct_calls': [
                        {'offset': c['offset'], 'callee': self.tag(c['target'], depth-1)}
                        for c in f['calls']
                    ] if depth else [],
                }
        return self.cache[key]

    def describe_callee(self, start, depth):
        f = self.function(start) if start in self.functions else None
        return {'actual_target': hex(start), 'symbol': f['name'] if f else None,
                'tag_depth': depth, 'identity': self.tag(start, depth),
                'identity_sha256': stable(self.tag(start, depth))}

    def graph(self, start, invert=False):
        f = self.function(start)
        raw = self.elf.normalized[start:start+f['bytes']]
        words = [struct.unpack_from('<BBhi', raw, i) for i in range(0, len(raw), 8)]
        n = len(words)
        starts = {0, n}
        continuations = {i+1 for i, w in enumerate(words) if w[0] == 0x18}
        calls = {c['offset']//8: c for c in f['calls']}
        relocations = {r['offset']//8: {k:v for k,v in r.items() if k != 'offset'}
                       for r in f['relocations']}

        def is_branch(op):
            return op & 7 in (5, 6) and op & 0xf0 not in (0x80, 0x90)

        for i, (op, regs, displacement, imm) in enumerate(words):
            if is_branch(op):
                target = i + 1 + displacement
                assert 0 <= target < n and target not in continuations
                starts.update((target, i+1))
            elif op == 0x95:
                starts.add(i+1)
        assert not (starts & continuations)
        ordered = sorted(starts)
        spans = list(zip(ordered[:-1], ordered[1:]))
        nodes = {}
        # Canonical positive operation and whether the machine branch is inverse.
        inverse_pairs = {0x50:0x10, 0xb0:0x20, 0xa0:0x30, 0xd0:0x60, 0xc0:0x70}
        for a, z in spans:
            code, edges = [], []
            term = {'kind':'next'}
            original_term = None
            for i in range(a, z):
                op, regs, displacement, imm = words[i]
                row = {'offset':hex(i*8), 'official_normalized_value':raw[i*8:i*8+8].hex(),
                       'relocation':relocations.get(i),
                       'actual_direct_callee':self.describe_callee(calls[i]['target'],2) if i in calls else None}
                if is_branch(op):
                    assert i == z-1
                    original_term = row
                    original_term['target_offset'] = hex((i+1+displacement)*8)
                    if op == 0x05:
                        edges = [('next', i+1+displacement)]
                    else:
                        canonical_op = op
                        yes, no = i+1+displacement, i+1
                        if invert and op & 0xf0 in inverse_pairs:
                            canonical_op = inverse_pairs[op & 0xf0] | (op & 0xf)
                            yes, no = no, yes
                        term = {'kind':'conditional','opcode':canonical_op,'registers':regs,'immediate':imm}
                        edges = [('true',yes),('false',no)]
                elif op == 0x95:
                    assert i == z-1
                    term = {'kind':'exit'}
                    original_term = row
                else:
                    code.append(row)
            if term['kind'] == 'next' and not edges and z < n:
                edges = [('next',z)]
            nodes[a] = {'code':code, 'term':term, 'edges':edges,
                        'source_blocks':[a], 'machine_terminators':[original_term] if original_term else []}

        reached, pending = set(), [0]
        while pending:
            a = pending.pop()
            if a in reached:
                continue
            assert a in nodes
            reached.add(a)
            pending.extend(v for _,v in nodes[a]['edges'])
        unreachable = sorted(set(nodes)-reached)
        nodes = {a:node for a,node in nodes.items() if a in reached}
        forwarded = []
        # Only blocks with no value operation are forwarded, retaining the original records.
        changed = True
        while changed:
            changed = False
            for a, node in list(nodes.items()):
                if a == 0 or node['code'] or node['term']['kind'] != 'next' or len(node['edges']) != 1:
                    continue
                target = node['edges'][0][1]
                if target == a:
                    continue
                forwarded.append({'offset':hex(a*8),'target':hex(target*8),
                                  'machine_terminators':node['machine_terminators']})
                for other in nodes.values():
                    other['edges'] = [(r,target if v == a else v) for r,v in other['edges']]
                del nodes[a]
                changed = True
                break
        changed = True
        while changed:
            changed = False
            indegree = Counter(v for node in nodes.values() for _,v in node['edges'])
            for a, node in list(nodes.items()):
                if node['term']['kind'] != 'next' or len(node['edges']) != 1:
                    continue
                target = node['edges'][0][1]
                if target == a or target == 0 or indegree[target] != 1:
                    continue
                nxt = nodes[target]
                node['code'] += nxt['code']
                node['term'], node['edges'] = nxt['term'], nxt['edges']
                node['source_blocks'] += nxt['source_blocks']
                node['machine_terminators'] += nxt['machine_terminators']
                del nodes[target]
                changed = True
                break
        result_nodes = []
        for a,node in sorted(nodes.items()):
            result_nodes.append({**node,'offset':hex(a*8),
                                 'source_blocks':[hex(i*8) for i in node['source_blocks']],
                                 'edges':[(r,hex(v*8)) for r,v in node['edges']]})
        return {'start':hex(start),'bytes':f['bytes'],'symbol':f['name'],
                'raw_sha256':f['raw_sha256'],'official_normalized_sha256':f['normalized_sha256'],
                'relocation_pattern':f['relocations'],'machine_blocks':len(spans),
                'canonical_reachable_blocks':len(nodes),'unconditional_jump_count':sum(w[0] == 5 for w in words),
                'unreachable_machine_block_offsets':[hex(i*8) for i in unreachable],
                'forwarded_empty_blocks':forwarded,'branch_inverse_edge_swap_enabled':invert,
                'nodes':result_nodes}


def value(row):
    return [row['official_normalized_value'], row['relocation'],
            row['actual_direct_callee']['identity_sha256'] if row['actual_direct_callee'] else None]


def bijection(original, candidate, topology_only=False):
    on = {n['offset']:n for n in original['nodes']}
    cn = {n['offset']:n for n in candidate['nodes']}
    mapping, reverse, pending = {}, {}, [('0x0','0x0')]
    def fail(reason,oa,ca,**details):
        return {'verified':False,'reason':reason,'at_original':oa,'at_candidate':ca,
                'mapped_blocks_before_failure':len(mapping),'partial_mapping':mapping,**details}
    while pending:
        oa,ca = pending.pop()
        if oa in mapping:
            if mapping[oa] != ca:
                return fail('one original block reaches two candidate blocks',oa,ca,previous=mapping[oa])
            continue
        if ca in reverse:
            return fail('two original blocks reach one candidate block',oa,ca,previous=reverse[ca])
        if oa not in on or ca not in cn:
            return fail('edge target absent',oa,ca)
        o,c = on[oa],cn[ca]
        ot,ct = dict(o['term']),dict(c['term'])
        if topology_only:
            ot.pop('registers',None)
            ct.pop('registers',None)
        if ot != ct:
            return fail('terminal operation differs',oa,ca,original=ot,candidate=ct)
        if not topology_only and [value(r) for r in o['code']] != [value(r) for r in c['code']]:
            return fail('normalized instruction values or actual callee identities differ',oa,ca)
        if [r for r,_ in o['edges']] != [r for r,_ in c['edges']]:
            return fail('edge roles differ',oa,ca)
        mapping[oa],reverse[ca] = ca,oa
        pending.extend((ov,cv) for (_,ov),(_,cv) in zip(o['edges'],c['edges']))
    if set(mapping) != set(on) or set(reverse) != set(cn):
        return fail('reachable graph not fully covered','0x0','0x0')
    return {'verified':True,'mapped_blocks':len(mapping),
            'mapping':dict(sorted(mapping.items(),key=lambda p:int(p[0],16)))}


def mapped_differences(original,candidate,mapping):
    on = {n['offset']:n for n in original['nodes']}
    cn = {n['offset']:n for n in candidate['nodes']}
    rows = []
    for oa,ca in mapping.items():
        o,c = on[oa],cn[ca]
        a,b = [value(r) for r in o['code']],[value(r) for r in c['code']]
        sm = difflib.SequenceMatcher(None,[stable(v) for v in a],[stable(v) for v in b],autojunk=False)
        diffs = []
        for kind,i,j,k,l in sm.get_opcodes():
            if kind != 'equal':
                diffs.append({'kind':kind,'original_instructions':o['code'][i:j],
                              'candidate_instructions':c['code'][k:l]})
        if diffs or o['term'] != c['term']:
            rows.append({'original_block':oa,'candidate_block':ca,
                         'original_value_operation_count':len(a),'candidate_value_operation_count':len(b),
                         'terminal_original':o['term'],'terminal_candidate':c['term'],
                         'differences':diffs})
    return rows


def main():
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--original', type=Path, required=True)
    parser.add_argument('--candidate', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    ORIGINAL, CANDIDATE = args.original.resolve(), args.candidate.resolve()
    OUT = args.output.resolve().parent
    OUT.mkdir(parents=True, exist_ok=True)
    original, candidate = Inventory(ORIGINAL,True),Inventory(CANDIDATE)
    assert sha(original.elf.b) == '6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
    chosen = next(f for f in candidate.functions.values() if '4sell8cashback' in f['name'] and f['size'] > 500)
    rows = measure(ORIGINAL,CANDIDATE)
    assert len(rows) == 785 and sum(r['match'] is not None for r in rows) == 784
    assert sum(r['raw'] for r in rows) == 267
    target_row = next(r for r in rows if int(r['original'],16) == ORIGINAL_START)
    assert target_row['match'] is None
    report = {'scope':__doc__,'original_sha256':sha(original.elf.b),'candidate_sha256':sha(candidate.elf.b),
              'official_inventory_windows':len(rows),'official_normalized_matches':784,'official_raw_matches':267,
              'official_sell_window':target_row,'official_sell_status':'UNEQUAL',
              'direct_callee_tag_depth':2,'tool_inputs':{p.name:sha(p.read_bytes()) for p in [Path(__file__),TOOLS/'elf_reader.py',TOOLS/'measure.py']}}
    for view,invert in [('literal_branch_polarity',False),('inverse_branch_with_edge_swap',True)]:
        og,cg = original.graph(ORIGINAL_START,invert),candidate.graph(chosen['start'],invert)
        strict = bijection(og,cg)
        topology = bijection(og,cg,topology_only=True)
        record = {'original':og,'candidate':cg,'strict_values_and_callee_bijection':strict,
                  'topology_only_ignoring_register_names_and_code':topology}
        if topology['verified']:
            record['mapped_original_normalized_value_differences'] = mapped_differences(og,cg,topology['mapping'])
        report[view] = record
    report['unresolved_actual_direct_callees'] = {'original':[hex(a) for a in sorted(original.unresolved)],
                                                'candidate':[hex(a) for a in sorted(candidate.unresolved)]}
    report['actual_outgoing_callees'] = {
        'original':[{'offset':hex(c['offset']),**original.describe_callee(c['target'],2)} for c in original.function(ORIGINAL_START)['calls']],
        'candidate':[{'offset':hex(c['offset']),**candidate.describe_callee(c['target'],2)} for c in candidate.function(chosen['start'])['calls']],
    }
    destination = args.output.resolve()
    destination.write_text(json.dumps(report,indent=2)+'\n')
    summary = {k:v for k,v in report.items() if k not in ('actual_outgoing_callees','literal_branch_polarity','inverse_branch_with_edge_swap','scope')}
    for view in ('literal_branch_polarity','inverse_branch_with_edge_swap'):
        r = report[view]
        summary[view] = {'original_blocks':r['original']['canonical_reachable_blocks'],
                         'candidate_blocks':r['candidate']['canonical_reachable_blocks'],
                         'strict':{k:v for k,v in r['strict_values_and_callee_bijection'].items() if k not in ('mapping','partial_mapping')},
                         'topology':{k:v for k,v in r['topology_only_ignoring_register_names_and_code'].items() if k not in ('mapping','partial_mapping')}}
        if 'mapped_original_normalized_value_differences' in r:
            summary[view]['blocks_with_value_differences'] = len(r['mapped_original_normalized_value_differences'])
    destination.with_name(destination.stem+'-summary.json').write_text(json.dumps(summary,indent=2)+'\n')
    print(json.dumps(summary,indent=2))


if __name__ == '__main__':
    main()
