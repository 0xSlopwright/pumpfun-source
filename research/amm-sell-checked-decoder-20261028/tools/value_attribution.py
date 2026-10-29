"""Attribute values under a verified diagnostic CFG mapping; no byte acceptance."""
import argparse
import collections
import difflib
import gzip
import hashlib
import json
from pathlib import Path
import struct


def fields(row):
    op,regs,offset,immediate = struct.unpack('<BBhi',bytes.fromhex(row['official_normalized_value']))
    callee = row['actual_direct_callee']
    return (op,offset,immediate,json.dumps(row['relocation'],sort_keys=True),callee['identity_sha256'] if callee else None)


def short(row):
    callee = row['actual_direct_callee']
    return {**row,'actual_direct_callee':{k:callee[k] for k in ['actual_target','symbol','tag_depth','identity_sha256']} if callee else None}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('graph',type=Path)
    p.add_argument('output',type=Path)
    a = p.parse_args()
    raw = a.graph.read_bytes()
    document = json.loads(gzip.decompress(raw) if a.graph.suffix == '.gz' else raw)
    v = document['inverse_branch_with_edge_swap']
    assert v['topology_only_ignoring_register_names_and_code']['verified']
    original = {n['offset']:n for n in v['original']['nodes']}
    candidate = {n['offset']:n for n in v['candidate']['nodes']}
    mapping = v['topology_only_ignoring_register_names_and_code']['mapping']
    rows,calls,terminals = [],[],[]
    same_values=same_count=register_differences=0
    for oa,ca in mapping.items():
        o,c = original[oa],candidate[ca]
        av,bv = list(map(fields,o['code'])),list(map(fields,c['code']))
        same_values += av == bv
        same_count += len(av) == len(bv)
        oc = [x for x in o['code'] if x['actual_direct_callee']]
        cc = [x for x in c['code'] if x['actual_direct_callee']]
        assert len(oc) == len(cc)
        for x,y in zip(oc,cc):
            calls.append({'original_block':oa,'candidate_block':ca,
                          'original':short(x),'candidate':short(y),
                          'exact_actual_depth2_identity':x['actual_direct_callee']['identity_sha256'] == y['actual_direct_callee']['identity_sha256']})
        if o['term'] != c['term']:
            terminals.append({'original_block':oa,'candidate_block':ca,'original':o['term'],'candidate':c['term']})
        if av == bv:
            register_differences += sum(x['official_normalized_value'] != y['official_normalized_value'] for x,y in zip(o['code'],c['code']))
        else:
            differences = []
            sm = difflib.SequenceMatcher(None,av,bv,autojunk=False)
            for kind,i,j,k,l in sm.get_opcodes():
                if kind != 'equal':
                    differences.append({'kind':kind,'original':[short(x) for x in o['code'][i:j]],'candidate':[short(x) for x in c['code'][k:l]]})
            rows.append({'original_block':oa,'candidate_block':ca,'original_value_operation_count':len(av),
                         'candidate_value_operation_count':len(bv),'differences':differences})
    result = {'scope':__doc__+' Register-byte differences are recorded, not proved equivalent or accepted. Comparison keys retain every opcode, displacement, immediate, relocation and actual depth-2 callee identity.',
              'graph_sha256':hashlib.sha256(raw).hexdigest(),'official_sell_status':document['official_sell_status'],
              'original_sha256':document['original_sha256'],'candidate_sha256':document['candidate_sha256'],
              'mapped_blocks':len(mapping),'same_value_operation_count_blocks':same_count,
              'identical_except_register_bytes_blocks':same_values,
              'register_different_instruction_rows_in_those_blocks':register_differences,
              'actual_direct_call_count':len(calls),'exact_actual_depth2_call_count':sum(x['exact_actual_depth2_identity'] for x in calls),
              'actual_direct_calls':calls,'branch_register_differences':terminals,
              'blocks_with_nonregister_value_differences':len(rows),'value_differences':rows}
    a.output.write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k not in ['scope','actual_direct_calls','branch_register_differences','value_differences']},indent=2))


if __name__ == '__main__':
    main()
