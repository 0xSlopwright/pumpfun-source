"""验证两个映像中由指令限定的字符串；合并已发布覆盖。"""
from pathlib import Path
import gzip, hashlib, importlib.util, json, struct
if not __debug__: raise RuntimeError('必须启用断言')
P = Path(__file__).resolve().parent
COPY = 'research/mayhem-current437-programerror-debug-copy-20261029'
OTHERS = ('research/mayhem-current437-mayhemerror-debug-names-20261029', 'research/mayhem-current437-rust-panic-messages-20261029')
MERGED = ('research/mayhem-current437-bounded-error-strings-20261029', 'research/mayhem-current437-option-seeds-paths-20261029')
# 原始指令地址、原始指针、候选指针、长度及长度寄存器。
SITES = ((645800,720036,700476,43,2),(649104,720191,700631,22,3),(649200,720079,700519,2,3),(649296,720100,700540,19,3),(649392,720138,700578,18,3),(649448,720182,700622,9,3),(649520,720081,700521,19,3),(649576,720119,700559,19,3),(649648,720213,700653,6,3),(649712,720156,700596,26,3))
sha = lambda b: hashlib.sha256(b).hexdigest()
def module(root, path, name):
    spec = importlib.util.spec_from_file_location(name, root / path / 'proof.py')
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m

def old(root): return module(root, COPY, 'copy_prior')
def panic(root): return module(root, OTHERS[1], 'panic_prior')

def crumb_baseline(root, original, candidate):
    # Recheck the three already-merged #770 paths as historical proof sites.
    # Their payload intervals belong to the baseline, never this contribution.
    prev = old(root).prior(root); base = prev.inspect(root / old(root).PRIOR, original, candidate, root)
    pairs = {tuple(p) for p in base['active_pairs']}; bundle = prev.images(root, original, candidate)
    rows = []
    for owner, offset, expected in ((538896,8,b'Error'),(616776,8,b'Error'),(620336,216,b'failed to write whole buffer')):
        matches = sorted(b for a,b in pairs if a == owner)
        assert len(matches) == (1 if owner == 620336 else 4)
        found = []
        for cand in matches:
            results = []
            for side, start in (('original',owner),('candidate',cand)):
                elf = bundle[side+'_elf']; w = bundle[side+'_windows'][start]; pc = start + offset
                assert pc+40 <= w['end']
                op,reg,off,lo=struct.unpack_from('<BBhI',elf.b,pc); zero,hi=struct.unpack_from('<II',elf.b,pc+8)
                assert (op,reg,off,zero)==(0x18,2,0,0)
                assert elf.rel.get(pc,{}).get('type')==8 and elf.rel[pc]['symbol_index']==0
                assert not any(pc < x < pc+16 for x in elf.rel)
                assert struct.unpack_from('<BBhi',elf.b,pc+16)==(0xb7,3,0,len(expected))
                op,reg,off,imm=struct.unpack_from('<BBhi',elf.b,pc+24)
                assert (op,reg,off)==(0x85,0x10,0)
                assert struct.unpack_from('<BBhi',elf.b,pc+32)==(0x95,0,0,0)
                target=pc+32+imm*8
                assert any(d['offset']==offset+24 and d['target']==target for d in w['direct'])
                pointer=lo | hi<<32
                assert prev.counted(elf,pointer,len(expected))==expected
                results.append((pointer,target))
            assert (results[0][1],results[1][1]) in pairs
            if owner != 620336:
                for side, (_,target) in zip(('original','candidate'),results): prev.writer(bundle[side+'_elf'],bundle[side+'_windows'][target])
            else:
                assert 'std2io5error5Error3new' in ' '.join(bundle['symbols'][results[1][1]])
                for side,(_,target) in zip(('original','candidate'),results):
                    e=bundle[side+'_elf']; assert struct.unpack_from('<BBhi',e.b,target)==(0xbf,0x37,0,0); assert struct.unpack_from('<BBhi',e.b,target+8)==(0xbf,0x16,0,0)
            found.append(results[0][0])
        assert len(set(found))==1
        rows.append([found[0],found[0]+len(expected)])
    assert sorted(rows)==[[713383,713388],[713808,713813],[714313,714341]]
    return rows

def inspect(root, original, candidate):
    helper=panic(root); _,a,b=helper.images(root,original,candidate)
    rows=[]
    for pc,ap,bp,n,reg in SITES:
        cp=pc-66320
        for image,site,ptr in ((a,pc,ap),(b,cp,bp)):
            helper.text_site(image,site,ptr,n,reg)
            assert struct.unpack_from('<BBhi',image.b,site)[:3] == (0x18,1 if pc == 645800 else 2,0)
        left=helper.rodata_bytes(a,ap,n); right=helper.rodata_bytes(b,bp,n)
        assert left==right and all(32 <= c < 127 for c in left)
        rows.append(dict(original_pc=pc,candidate_pc=cp,original_ptr=ap,candidate_ptr=bp,length=n,length_register=reg,text=left.decode()))
    return dict(sites=rows, baseline_770=crumb_baseline(root,original,candidate))

def delta(root, report):
    prev=old(root).prior(root); paths=(COPY,*OTHERS,*MERGED)
    bases=[json.loads((root/p/'coverage-delta.json').read_bytes()) for p in paths]; result=[]
    for i,section in enumerate(bases[0]['sections']):
        raw=prev.union([x for b in bases for x in b['sections'][i]['raw_intervals']]+(report['baseline_770'] if section['section']=='.rodata' else []))
        mapped=prev.union([x for b in bases for x in b['sections'][i]['mapped_intervals']]); before=prev.measure(prev.union(raw+mapped))
        added=[[r['original_ptr'],r['original_ptr']+r['length']] for r in report['sites']] if section['section']=='.rodata' else []
        assert all(not (a<d and c<b) for a,b in added for c,d in prev.union(raw+mapped))
        raw=prev.union(raw+added); covered=prev.union(raw+mapped); n=prev.measure(covered)
        result.append(dict(section=section['section'],total_bytes=section['total_bytes'],raw_intervals=raw,mapped_intervals=mapped,covered_intervals=covered,raw_equal_bytes=prev.measure(raw),pointer_only_bytes=n-prev.measure(raw),covered_bytes=n,new_bytes=n-before))
    assert [x['covered_bytes']-x['new_bytes'] for x in result]==[14627,6824]
    assert [x['new_bytes'] for x in result]==[183,0]
    return dict(scope='仅指令直接限定长度的字符串；不计 NUL、邻接、分配范围或重定位表。', baseline_delta_sha256={p:sha((root/p/'coverage-delta.json').read_bytes()) for p in paths}, baseline_770_commit='57fa31774027c426a0a68c18344d523f1e85ff98',baseline_payload_bytes=21451,sections=result,new_payload_bytes=sum(x['new_bytes'] for x in result),payload_covered_bytes=sum(x['covered_bytes'] for x in result),payload_total_bytes=26180)

def images(root): return old(root).images(root)
def inventory(packet): return {str(p.relative_to(packet)):sha(p.read_bytes()) for p in sorted(packet.rglob('*')) if p.is_file() and p.name!='manifest.json'}
def check(packet,root):
    paths=list(packet.rglob('*')); assert all(not p.is_symlink() and (p.is_file() or p.is_dir()) for p in paths)
    assert inventory(packet)==json.loads((packet/'manifest.json').read_bytes())
    pins=json.loads((packet/'inputs.json').read_bytes())
    for path,digest in pins.items():
        q=Path(path); assert not q.is_absolute() and '..' not in q.parts and sha((root/q).read_bytes())==digest
    for name in (COPY,*OTHERS,*MERGED):
        for p in (root/name).rglob('*'):
            if p.is_file(): assert str(p.relative_to(root)) in pins
    old(root).check(root/COPY,root)
    for name in OTHERS: module(root,name,'other_prior').check(root/name,root)
    for name in MERGED: module(root,name,'merged_prior').check(root/name,root)
    report=inspect(root,*images(root)); assert report==json.loads(gzip.decompress((packet/'observations.json.gz').read_bytes()))
    d=delta(root,report); assert d==json.loads((packet/'coverage-delta.json').read_bytes())
    return {'sites':len(report['sites']),'new_bytes':d['new_payload_bytes'],'payload_covered':d['payload_covered_bytes'],'payload_total':d['payload_total_bytes']}

def seal(root):
    report=inspect(root,*images(root)); (P/'observations.json.gz').write_bytes(gzip.compress(json.dumps(report,ensure_ascii=False,separators=(',',':')).encode(),mtime=0))
    (P/'coverage-delta.json').write_text(json.dumps(delta(root,report),ensure_ascii=False,indent=2)+'\n')
    (P/'manifest.json').write_text(json.dumps(inventory(P),indent=2)+'\n')
