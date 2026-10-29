"""Standalone audit of H18's full original-window ledger. No build or VM run."""
from pathlib import Path,PurePosixPath
import hashlib,json,sys
W=Path(__file__).resolve().parent
sys.path.insert(0,str(W))
from audit import analyze,key
from elf_reader import Elf

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def js(p):return json.loads(Path(p).read_text())

def verify(root=None):
    w=Path(__file__).resolve().parent;m=js(w/'manifest.json')
    actual={p.relative_to(w).as_posix()for p in w.rglob('*')if p.is_file()and'__pycache__'not in p.parts}
    assert actual==set(m['files'])|{'manifest.json'}
    for name,digest in m['files'].items():
        n=PurePosixPath(name);assert not n.is_absolute()and'..'not in n.parts
        assert sha(w/name)==digest,name
    computed=analyze();assert computed==js(w/'remaining-audit.json')
    assert computed['candidate_sha256']=='01a038ead3614b09af8d9431d3253be2db9efc142ac17ced923d12ab6afe2609'
    assert computed['baseline_sha256']=='4fb73d3c0303e1f065e6356d32e86ba7341f75b27b861571cd8b8c586e46af98'
    metric=computed['metrics']
    assert metric['original_windows']==785 and metric['normalized_windows']==660
    assert metric['raw_windows']==159 and metric['remaining_windows']==125
    assert metric['matched_text_bytes']==831376 and metric['original_text_bytes']==1162040
    assert computed['losses']==[]
    assert computed['gains']==[]
    assert computed['classifications']=={'other_instructions':7,'no_same_size_and_relocations':38,'typed_source_immediates_only':80}
    old=js(w/'canonical-measurement.json');assert old['candidate_sha256']==computed['candidate_sha256']
    assert old['normalized_matches']==660 and old['raw_matches']==159 and old['windows']==785
    for x,y in zip(old['rows'],computed['all_windows']):
        assert x['start']==int(y['original'],16)and x['end']-x['start']==y['bytes']
        assert x['raw_match']==y['raw_match']
        assert {f['start']for f in x['matches']}=={f['start']for f in y['matches']}
    build=js(w/'build-record.json');assert build['comparison']['candidate_sha256']==computed['candidate_sha256']
    assert build['returncode']==0 and build['source_unchanged']
    sources=js(w/'source-manifest.json')
    assert len(sources)==58
    for name,digest in sources.items():
        assert sha(w/'source'/name)==digest
        keys=[k for k in build['source_sha256']if k.endswith('/source/'+name)]
        assert len(keys)==1 and build['source_sha256'][keys[0]]==digest
    o,c,s=[Elf(w/n)for n in ['original.so','candidate.so','symbols.so']]
    assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]
    origin=js(w/'source-origins.json')
    for row in origin:
        assert sha(w/'source'/row['selected_source'])==row['selected_source_sha256']
        assert row['definition']in(w/'source'/row['selected_source']).read_text()
    # Verify real call positions/targets; the scanner target is explicitly open.
    gain=next(v for v in computed['all_windows']if v['original']=='0x73ef0');a=int(gain['original'],16);f=gain['matches'][0];n=gain['bytes']
    calls=o.callsites(a,n);other=c.callsites(f['start'],n)
    assert [x['offset']for x in calls]==[128,392,560]==[x['offset']for x in other]
    closure_counts={};open_targets=[]
    for x,y in zip(calls,other):
        i=o.entries.index(x['target']);size=(o.entries[i+1]if i+1<len(o.entries)else o.hi)-x['target']
        target=next(v for v in s.funcs if v['start']==y['target'])
        equal=target['size']==size and key(o,x['target'],size)==key(c,y['target'],size)
        if equal:closure_counts[str(x['offset'])]=size
        else:open_targets.append({'offset':x['offset'],'original':hex(x['target']),'original_bytes':size,'candidate_bytes':target['size']})
    assert closure_counts=={'128':64,'560':152}
    assert open_targets==[{'offset':392,'original':'0xf28b8','original_bytes':1192,'candidate_bytes':1168}]
    return {'passed':True,'candidate_sha256':computed['candidate_sha256'],
            'normalized_windows':660,'raw_windows':159,'remaining_windows':125,
            'typed_source_only_candidates':80,'other_code_or_shape_gaps':45,
            'matched_text_bytes':831376,'original_text_bytes':1162040,
            'gain_closed_callees':closure_counts,'gain_open_callees':open_targets,'losses':0,'copied_source_inputs':58,
            'external_input_bytes_independently_reaudited':False,
            'runtime_reexecuted':False,'whole_elf_identity':False,
            'manifest_sha256':sha(w/'manifest.json')}

if __name__=='__main__':print(json.dumps(verify(),indent=2))
