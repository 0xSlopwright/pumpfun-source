"""Verify the actual checked UVA constructor edge without aliasing identical wrappers."""
from pathlib import Path
from cfg_attribution import Inventory, stable


def audit(original_path,control_path,candidate_path):
    original=Inventory(Path(original_path),True)
    control=Inventory(Path(control_path))
    candidate=Inventory(Path(candidate_path))
    start=0x4c750
    ref=original.function(start)
    functions={}
    for kind,image in [('control',control),('candidate',candidate)]:
        f=next(f for f in image.functions.values() if '4sell8cashback' in f['name'] and f['size']>500)
        functions[kind]=f
    calls={}
    ocall=next(c for c in ref['calls'] if c['offset']==0x17a0)
    assert ocall['target']==0x6528
    checked=original.tag(ocall['target'],2)
    for kind,image in [('original',original),('control',control),('candidate',candidate)]:
        f={'start':start,'size':9024} if kind=='original' else functions[kind]
        cf=image.function(f['start'])
        call=next(c for c in cf['calls'] if c['offset']==(0x17a0 if kind=='original' else 0x1798))
        constructor=image.function(call['target'])
        decode=next(c for c in constructor['calls'] if c['offset']==0x290)
        deserializer=image.function(decode['target'])
        calls[kind]={'parent_start':hex(f['start']),'call_offset':hex(call['offset']),
                     'constructor_target':hex(call['target']),'constructor_symbol':constructor['name'],
                     'constructor_bytes':constructor['bytes'],'constructor_normalized_sha256':constructor['normalized_sha256'],
                     'constructor_relocation_pattern':constructor['relocations'],
                     'actual_depth2_identity':image.tag(call['target'],2),
                     'depth2_matches_original':image.tag(call['target'],2)==checked,
                     'deserialize_call_offset':hex(decode['offset']),
                     'deserialize_target':hex(decode['target']),'deserialize_bytes':deserializer['bytes'],
                     'deserialize_symbol':deserializer['name'],'deserialize_normalized_sha256':deserializer['normalized_sha256']}
    assert calls['original']['deserialize_bytes']==calls['candidate']['deserialize_bytes']==728
    assert calls['control']['deserialize_bytes']==1504
    assert not calls['control']['depth2_matches_original'] and calls['candidate']['depth2_matches_original']
    assert all(x['constructor_bytes']==1024 for x in calls.values())
    assert len({x['constructor_normalized_sha256'] for x in calls.values()})==1
    assert calls['original']['constructor_relocation_pattern']==calls['control']['constructor_relocation_pattern']==calls['candidate']['constructor_relocation_pattern']
    cf,bf=[image.function(functions[k]['start']) for k,image in [('candidate',candidate),('control',control)]]
    assert cf['normalized_sha256']==bf['normalized_sha256']!=ref['normalized_sha256']
    assert cf['relocations']==bf['relocations']
    incoming=[]
    for image,kind in [(control,'control'),(candidate,'candidate')]:
        edges=[(a,t) for a,t in image.elf.calls.items() if t==functions[kind]['start']]
        assert len(edges)==1
        at,_=edges[0]
        f=next(f for f in image.functions.values() if f['start']<=at<f['start']+f['size'])
        actual=image.function(f['start']);expected=original.function(0x49b50)
        assert at-f['start']==0x13d0 and actual['bytes']==expected['bytes']==9184
        assert actual['normalized_sha256']==expected['normalized_sha256'] and actual['relocations']==expected['relocations']
        incoming.append({'image':kind,'actual_caller':hex(f['start']),'call_offset':'0x13d0','bytes':9184,'normalized_and_relocation_pattern_exact':True})
    return {'scope':__doc__,'official_sell_status':'UNEQUAL','normalized_parent_body_unchanged':True,
            'original_parent_normalized_sha256':ref['normalized_sha256'],
            'candidate_parent_normalized_sha256':cf['normalized_sha256'],
            'calls':calls,'actual_incoming_callers':incoming,
            'unresolved_actual_direct_callees':{k:[hex(a) for a in sorted(e.unresolved)] for k,e in [('original',original),('control',control),('candidate',candidate)]}}
