"""Original-backed proposal for a fallible route direction extraction.
No compilation or runtime claim. Packet paths derive from this script.
"""
from pathlib import Path,PurePosixPath
import difflib,hashlib,json,struct,sys
W=Path(__file__).resolve().parent
sys.path.insert(0,str(W))
from elf_reader import Elf
from source_fields import source_fields

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def js(p):return json.loads(Path(p).read_text())
def ins(e,p):return struct.unpack_from('<BBhi',e.b,p)

def dominators(e,start,size):
    nodes={};p=start
    while p<start+size:
        op,rr,off,imm=ins(e,p);step=16 if op==0x18 else 8
        nodes[p]=(op,rr,off,imm,step);p+=step
    succ={}
    for p,(op,rr,off,imm,step)in nodes.items():
        if op==0x95:edges=[]
        elif op==0x05:edges=[p+8+off*8]
        elif op&7 in(5,6)and op not in(0x85,0x8d):edges=[p+step,p+8+off*8]
        else:edges=[p+step]
        succ[p]={x for x in edges if x in nodes}
    reach=set();todo=[start]
    while todo:
        p=todo.pop()
        if p in reach:continue
        reach.add(p);todo.extend(succ[p])
    pred={p:set()for p in reach}
    for p in reach:
        for x in succ[p]&reach:pred[x].add(p)
    dom={p:({p}if p==start else set(reach))for p in reach}
    changed=True
    while changed:
        changed=False
        for p in sorted(reach-{start}):
            d=set.intersection(*(dom[x]for x in pred[p]))|{p}
            if d!=dom[p]:dom[p]=d;changed=True
    return dom

def verify(root=None):
    w=Path(__file__).resolve().parent;m=js(w/'manifest.json')
    names={p.relative_to(w).as_posix()for p in w.rglob('*')if p.is_file()and'__pycache__'not in p.parts}
    assert names==set(m['files'])|{'manifest.json'}
    for n,h in m['files'].items():
        p=PurePosixPath(n);assert not p.is_absolute()and'..'not in p.parts
        assert sha(w/n)==h
    o,b,s=[Elf(w/n)for n in ['original.so','baseline.so','baseline-symbols.so']]
    assert sha(o.path)=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
    assert sha(b.path)=='ea14ee8e5ea9a9b6695110fa141af77f378a21dcd36e159ae92279c9c6d6b593'
    path='programs/pump-amm/src/instructions/swap/multi_hop_swap.rs'
    before=(w/'baseline.rs').read_text();after=(w/'source'/path).read_text()
    needle='let sell = sell.unwrap();'
    assert before.count(needle)==1
    assert after==before.replace(needle,'let sell = sell.ok_or_else(|| error!(PumpAmmError::NotEnoughRemainingAccounts))?;')
    patch=''.join(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile='a/'+path,tofile='b/'+path))
    assert patch==(w/'recovery.patch').read_text()
    build=js(w/'build-record.json');keys=[k for k in build['source_sha256']if k.endswith('/source/'+path)]
    assert len(keys)==1 and build['source_sha256'][keys[0]]==sha(w/'baseline.rs')
    # Directly encoded states: None=2; then the two boolean values; restore across calls.
    assert ins(o,0x3ddf8)==(0xb7,6,0,2)
    assert ins(o,0x3df60)==(0x7b,0x6a,-944,0)
    assert ins(o,0x3e300)==(0x79,0xa6,-944,0)
    assert ins(o,0x3e338)==(0xb7,6,0,1)
    assert ins(o,0x3e350)==(0xb7,6,0,0)
    assert ins(o,0x3e7d8)==(0xbf,0x67,0,0)
    assert ins(o,0x3e840)==(0xbf,0x21,0,0)
    assert ins(o,0x3e848)==(0x57,1,0,255)
    assert ins(o,0x3e858)==(0x15,1,1,2)
    assert 0x3e858+8+ins(o,0x3e858)[2]*8==0x3e868
    assert o.calls[0x3e878]==0x40100
    assert [p for p,t in o.calls.items()if t==0x40100]==[0x3e878]
    assert ins(o,0x40100+400)==(0x62,0xa,-120,6044)
    sf=source_fields(o,0x40100,520)
    assert [(v['filename'],v['line'])for v in sf]==[(path,307)]
    dom=dominators(o,0x3dbc0,9536)
    assert 0x3ddf8 in dom[0x3e858] and 0x3e858 in dom[0x3e878]
    # The error closure has four known actual direct callees, each available exactly.
    call_rows=[]
    for call in o.callsites(0x40100,520):
        a=call['target'];i=o.entries.index(a);n=(o.entries[i+1]if i+1<len(o.entries)else o.hi)-a
        fs=[f for f in s.funcs if f['size']==n and o.normalized[a:a+n]==b.normalized[f['start']:f['start']+n]and o.pattern(a,n)==b.pattern(f['start'],n)]
        assert fs
        call_rows.append({'offset':call['offset'],'original_target':hex(a),'bytes':n,'candidate_names':[f['name']for f in fs]})
    assert len(call_rows)==4
    return {'passed':True,'baseline_sha256':sha(b.path),'patch_sha256':sha(w/'recovery.patch'),
        'original_handler':'0x3dbc0','original_option_check':'0x3e858',
        'original_error_closure':'0x40100','error_code':6044,'original_source_line':307,
        'actual_error_callee_pairs':4,'source_changes':1,'compiled':False,'runtime_executed':False,
        'valid_input_behavior_change_claimed':False,'historical_source_spelling_authenticated':False,
        'manifest_sha256':sha(w/'manifest.json')}

if __name__=='__main__':print(json.dumps(verify(),indent=2))
