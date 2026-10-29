"""Recheck the injective physical-body/direct-call witness and raw rodata gaps."""
from pathlib import Path
import collections
import hashlib
import importlib.util
import json


def verify(original, candidate_symbols, body_report, data_report):
    def require(ok, message):
        if not ok:
            raise RuntimeError(message)
    spec = importlib.util.spec_from_file_location('physical_elf', Path(__file__).with_name('tools')/'elf_reader.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    left, right = module.Elf(Path(original)), module.Elf(Path(candidate_symbols))

    def bodies(elf):
        result = {}
        for start, end in zip(elf.entries, elf.entries[1:]+[elf.hi]):
            signature = (end-start, hashlib.sha256(elf.normalized[start:end]).hexdigest(),
                         json.dumps(elf.pattern(start,end-start),sort_keys=True))
            result[start] = {'signature': signature, 'size': end-start,
                             'raw': hashlib.sha256(elf.b[start:end]).hexdigest(),
                             'calls': {at-start: target for at,target in elf.calls.items() if start <= at < end}}
        return result
    a, b = bodies(left), bodies(right)
    report = json.loads(Path(body_report).read_bytes())
    data = json.loads(Path(data_report).read_bytes())

    def summary(elf, values):
        groups = collections.Counter(value['signature'] for value in values.values())
        return {'physical_starts':len(values),'text_bytes':elf.text[5],
                'unique_normalized_bodies':len(groups),'distinct_normalized_body_bytes':sum(signature[0] for signature in groups),
                'unique_raw_bodies':len({(value['size'],value['raw']) for value in values.values()}),
                'symbols':len(elf.funcs),'duplicate_normalized_signature_groups':sum(count>1 for count in groups.values())}
    require(summary(left,a) == report['original'] and summary(right,b) == report['candidate'], 'physical body summary differs')
    require(not report['candidate_symbol_extent_anomalies'] and not report['signature_group_cardinality_deficits'], 'unqualified body extent/cardinality claim')
    require(all(any(function['start'] == at and function['size'] == value['size'] for function in right.funcs)
                for at,value in b.items()), 'symbol/physical extent mismatch')
    assignment = {int(key,16):int(value,16) for key,value in report['assignment'].items()}
    require(len(assignment) == len(set(assignment.values())) == 784, 'physical assignment is not injective')
    sell = next(function['start'] for function in right.funcs if '4sell8cashback' in function['name'])
    require(set(a)-set(assignment) == {0x4c750} and set(b)-set(assignment.values()) == {sell}, 'unmatched physical body inventory differs')
    auxiliary = {0x4c750:sell}
    require(report['explicit_unmatched_sell_pair'] == {hex(key):hex(value) for key,value in auxiliary.items()}, 'unmatched sell boundary differs')
    edges = 0
    for at, target in assignment.items():
        require(at in a and target in b and a[at]['signature'] == b[target]['signature'], 'assigned physical bodies differ')
        require(set(a[at]['calls']) == set(b[target]['calls']), 'assigned direct-call offsets differ')
        for offset, original_target in a[at]['calls'].items():
            expected = assignment.get(original_target, auxiliary.get(original_target, original_target))
            require(b[target]['calls'][offset] == expected, 'assigned actual direct-call target differs')
            edges += 1
    require(report['one_to_one_direct_call_consistent_assignment_exists'] is True and edges == report['actual_direct_edges_verified'] == 7143, 'direct-call witness totals differ')
    sa,sb = left.secs['.rodata'],right.secs['.rodata']
    x,y = left.b[sa[4]:sa[4]+sa[5]],right.b[sb[4]:sb[4]+sb[5]]
    require(len(x) == len(y) == data['section_bytes'] == data['candidate_bytes'] == 25715, 'rodata sizes differ')
    indices = [index for index,(first,second) in enumerate(zip(x,y)) if first != second]
    runs = []
    for index in indices:
        if runs and runs[-1]['offset']+runs[-1]['bytes'] == index:
            runs[-1]['bytes'] += 1
        else:
            runs.append({'offset':index,'bytes':1})
    require([{**run,'offset':hex(run['offset'])} for run in runs] == data['differing_runs'], 'raw rodata difference ranges differ')
    require(len(indices) == data['same_offset_differing_bytes'] == 1414 and len(x)-len(indices) == data['same_offset_equal_bytes'], 'raw rodata difference counts differ')
    require(len(data['edit_regions']) == 7 and sum(max(region['original_bytes'],region['candidate_bytes']) for region in data['edit_regions']) == 208, 'rodata edit region totals differ')
    for region in data['edit_regions']:
        first,second = int(region['original_offset'],16),int(region['candidate_offset'],16)
        require(x[first:first+region['original_bytes']].hex() == region['original_hex'] and y[second:second+region['candidate_bytes']].hex() == region['candidate_hex'], 'rodata edit region bytes differ')
    indirect = [sum(elf.b[at] == 0x8d for at in range(elf.lo,elf.hi,8)) for elf in [left,right]]
    require(indirect == [data['original_indirect_callx_instructions'],data['candidate_indirect_callx_instructions']] == [123,123], 'indirect call inventory differs')
    return {'physical_starts':785,'unique_normalized_bodies':653,'distinct_normalized_body_bytes':1134592,
            'one_to_one_direct_call_consistent_windows':784,'actual_direct_edges_verified':7143,
            'unmatched_original_start':'0x4c750','raw_rodata_differing_bytes':1414,'raw_rodata_differing_runs':68,
            'callx_instructions_per_image':123,'indirect_call_and_data_pointer_closure_verified':False}
