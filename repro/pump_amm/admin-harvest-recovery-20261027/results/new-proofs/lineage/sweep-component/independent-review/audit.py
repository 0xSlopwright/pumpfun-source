from pathlib import Path
import collections
import hashlib
import json
import re
import struct
import types

W = Path(__file__).resolve().parent

def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def module(name):
    p = W / name
    m = types.ModuleType(p.stem)
    m.__file__ = str(p)
    exec(compile(p.read_bytes(), str(p), 'exec'), m.__dict__)
    return m

def context_reads(e, start, size):
    regs, slots, result = {2: 0}, {}, []
    p = start
    while p < start + size:
        op, both, off, imm = struct.unpack_from('<BBhi', e.b, p)
        d, s = both & 15, both >> 4
        if op == 0x7b and d == 10:
            slots.pop(off, None)
            if s in regs: slots[off] = regs[s]
        elif op == 0xbf:
            v = regs.get(s)
            regs.pop(d, None)
            if v is not None: regs[d] = v
        elif op == 0x07:
            if d in regs: regs[d] += imm
        elif op in (0x79, 0x71, 0x69, 0x61):
            if s in regs: result.append({'instruction_offset': p - start, 'field_offset': regs[s] + off, 'load_opcode': op})
            regs.pop(d, None)
            if s == 10 and off in slots and op == 0x79: regs[d] = slots[off]
        elif op == 0x85:
            for r in range(6): regs.pop(r, None)
        elif op & 7 in (1, 4, 7): regs.pop(d, None)
        p += 16 if op == 0x18 else 8
    return result

def run(root):
    wc = module('wrapper_census.py')
    Elf = wc.load_reader()
    original = Path(root) / 'evidence/original/pump_amm/deployed.so'
    cp, sp = W / 'candidate/pump_amm_recovered.so', W / 'candidate/unstripped.so'
    bp, bsp = W / 'baseline/pump_amm_recovered.so', W / 'baseline/unstripped.so'
    o, c, s, b, bs = map(Elf, (original, cp, sp, bp, bsp))
    assert sha(original) == wc.ORIGINAL and sha(bp) == wc.CANDIDATE and sha(bsp) == wc.SYMBOLS
    assert sha(cp) == '3f6190cae0e52a583dacddef9f55bc8f1b512489744242e05e0ea3ed8b5d26e4'
    assert c.b[c.lo:c.hi] == s.b[s.lo:s.hi]
    fs = {f['start']: f for f in s.funcs}
    indexes = []
    for e, syms in ((c, s), (b, bs)):
        idx = collections.defaultdict(list)
        for f in syms.funcs:
            idx[(f['size'], e.normalized[f['start']:f['start']+f['size']], json.dumps(e.pattern(f['start'], f['size']), sort_keys=True))].append(f)
        indexes.append(idx)
    def key(e, a, n): return (n, e.normalized[a:a+n], json.dumps(e.pattern(a, n), sort_keys=True))
    windows = []
    for a, z in zip(o.entries, o.entries[1:] + [o.hi]):
        matches, prev = (idx[key(o,a,z-a)] for idx in indexes)
        windows.append({'original': a, 'size': z-a, 'matched': bool(matches), 'previous_matched': bool(prev), 'raw': any(o.b[a:z] == c.b[f['start']:f['start']+z-a] for f in matches), 'previous_raw': any(o.b[a:z] == b.b[f['start']:f['start']+z-a] for f in prev)})
    measure = {'windows': len(windows), 'normalized': sum(r['matched'] for r in windows), 'raw': sum(r['raw'] for r in windows), 'normalized_text_bytes': sum(r['size'] for r in windows if r['matched']), 'gains': [hex(r['original']) for r in windows if r['matched'] and not r['previous_matched']], 'losses': [hex(r['original']) for r in windows if not r['matched'] and r['previous_matched']], 'raw_gains': [hex(r['original']) for r in windows if r['raw'] and not r['previous_raw']], 'raw_losses': [hex(r['original']) for r in windows if not r['raw'] and r['previous_raw']]}
    assert measure == {'windows':785,'normalized':653,'raw':148,'normalized_text_bytes':818944,'gains':['0xe9b90','0xe9fc0'],'losses':[],'raw_gains':[],'raw_losses':[]}
    census = wc.census(original, cp, sp)
    wrappers = []
    handler = None
    for name, a, flag in [('sweep_protocol_fee',0xe9b90,0),('sweep_creator_fee',0xe9fc0,1)]:
        r = next(r for r in census['rows'] if r['instruction'] == name)
        cf = r['candidate']; cs = cf['start']
        assert r['body_and_relocations_equal'] and cf['size'] == 1072
        assert struct.unpack_from('<BBhi',o.b,a+432) == struct.unpack_from('<BBhi',c.b,cs+432) == (0xb7,3,0,flag)
        oc, cc = o.calls[a+440], c.calls[cs+440]
        assert oc == 0x59408
        if handler is None: handler = fs[cc]
        assert fs[cc] == handler
        calls=[]
        for x in c.callsites(cs,1072):
            ot=o.calls[a+x['offset']]; f=fs[x['target']]; on=o.entries[o.entries.index(ot)+1]-ot
            eq=key(o,ot,on)==key(c,f['start'],f['size'])
            assert eq == (x['offset'] != 440)
            calls.append({'offset':x['offset'],'original':ot,'original_size':on,'candidate':f,'equal':eq})
        assert [(x['offset'],x['candidate']['size']) for x in calls] == [(160,7104),(240,32),(440,4968),(512,560)]
        wrappers.append({'instruction':name,'selector':flag,'original':a,'candidate':cf,'calls':calls})
    assert handler['size'] == 4968
    orr=context_reads(o,0x59408,4456);cr=context_reads(c,handler['start'],handler['size'])
    assert [r['field_offset'] for r in orr] == [8,33]
    assert [r['field_offset'] for r in cr] == [8,33]
    path=b'programs/pump-amm/src/instructions/sweep_fees.rs'
    paths={}; shifted_rejections=[]
    for name,e,a,n in [('original',o,0x59408,4456),('candidate',c,handler['start'],handler['size'])]:
        refs=[]
        for off in range(0,n,8):
            at=a+off
            if e.relocations.get(at,{}).get('type')==8 and e.b[at]==0x18:
                p=struct.unpack_from('<I',e.b,at+4)[0]|struct.unpack_from('<I',e.b,at+12)[0]<<32
                if e.b[p:p+len(path)]==path:
                    shifted_rejections.append(e.b[p+1:p+1+len(path)] != path)
                    assert shifted_rejections[-1]
                    refs.append({'instruction_offset':off,'pointer':p,'value':path.decode()})
        assert len(refs)==2
        paths[name]=refs
    # Follow the exact four MOV/ADD operand sequences before serialization.
    # Original retains r6 as the same self-pointer; candidate builds two pointers.
    a=0x59408;z=handler['start']
    assert [struct.unpack_from('<BBhi',o.b,a+i) for i in [3240,3248,3256]]==[(0xbf,0xa6,0,0),(0x07,6,0,-536),(0xbf,0x62,0,0)]
    assert struct.unpack_from('<BBhi',o.b,a+3416)==(0xbf,0x62,0,0)
    assert not any((struct.unpack_from('<BBhi',o.b,a+i)[1]&15)==6 and o.b[a+i] in (0xbf,0x07,0x79,0x71,0x18) for i in range(3264+8,3416,8))
    assert [struct.unpack_from('<BBhi',c.b,z+i) for i in [3752,3760,3920,3928]]==[(0xbf,0xa2,0,0),(0x07,2,0,-456),(0xbf,0xa2,0,0),(0x07,2,0,-640)]
    event = {'original_call_offsets':[3264,3424], 'original_self_stack_offsets':[-536,-536], 'candidate_call_offsets':[3768,3936], 'candidate_self_stack_offsets':[-456,-640], 'interpretation':'Original reuses one event; candidate serializes a clone for the first emit. This is follow-up source evidence, not a change in this candidate.'}
    for x in event['original_call_offsets']: assert o.calls[a+x]==0xc8320
    for x in event['candidate_call_offsets']:
        f=fs[c.calls[z+x]]; assert f['size']==616 and key(o,0xc8320,616)==key(c,f['start'],616)
    # Map actual shared-handler targets by complete body where possible.
    known={0x58028:'4swap12prepare_pool',0x58e08:'validate_protocol_fee_recipient',0x6bcd0:'available_quote_reserves',0x6d128:'take_accrued_fees'}
    body_targets=[]
    for t in sorted({x['target'] for x in o.callsites(a,4456)}):
        n=o.entries[o.entries.index(t)+1]-t
        matches=indexes[0][key(o,t,n)]
        if matches: f=next(f for f in matches if f['start'] in {x['target'] for x in c.callsites(z,handler['size'])})
        else:
            candidates=[fs[x['target']] for x in c.callsites(z,handler['size']) if known[t] in fs[x['target']]['name']]
            assert len(candidates)==1;f=candidates[0]
        body_targets.append({'original':t,'original_size':n,'candidate':f,'complete_body_equal':bool(matches),'original_call_offsets':[x['offset'] for x in o.callsites(a,4456) if x['target']==t],'candidate_call_offsets':[x['offset'] for x in c.callsites(z,handler['size']) if x['target']==f['start']]})
    assert sum(not r['complete_body_equal'] for r in body_targets)==4
    assert len(o.callsites(a,4456))==len(c.callsites(z,handler['size']))==31
    negatives={'wrong_selector_rejected':(0xb7,3,0,1)!=struct.unpack_from('<BBhi',c.b,wrappers[0]['candidate']['start']+432),'shifted_source_path_rejected':len(shifted_rejections)==4 and all(shifted_rejections),'wrong_event_pointer_alias_rejected':event['candidate_self_stack_offsets'][0]!=event['candidate_self_stack_offsets'][1]}
    assert all(negatives.values())
    return {'candidate_sha256':sha(cp),'symbols_sha256':sha(sp),'measurement':measure,'census':census,'sweep_wrappers':wrappers,'shared_handler':{'original':a,'original_size':4456,'candidate':handler,'original_context_reads':orr,'candidate_context_reads':cr,'source_path_references':paths,'actual_direct_targets':body_targets,'original_call_count':31,'candidate_call_count':31,'event_operand_evidence':event},'negative_controls':negatives}
