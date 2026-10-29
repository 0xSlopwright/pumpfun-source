"""Standalone audit of H14's full original-window ledger. No build or VM run."""
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
    assert computed['candidate_sha256']=='98ed250d3999e79b55683daa574b984fb7f650dc9eef0e3256671d0612b49fc3'
    assert computed['baseline_sha256']=='ea14ee8e5ea9a9b6695110fa141af77f378a21dcd36e159ae92279c9c6d6b593'
    metric=computed['metrics']
    assert metric['original_windows']==785 and metric['normalized_windows']==659
    assert metric['raw_windows']==159 and metric['remaining_windows']==126
    assert metric['matched_text_bytes']==830808 and metric['original_text_bytes']==1162040
    assert computed['losses']==[]
    assert [(r['original'],r['bytes'])for r in computed['gains']]==[('0xf2ed0',776)]
    assert computed['classifications']=={'other_instructions':7,'no_same_size_and_relocations':40,'typed_source_immediates_only':79}
    old=js(w/'canonical-measurement.json');assert old['candidate_sha256']==computed['candidate_sha256']
    assert old['normalized_matches']==659 and old['raw_matches']==159 and old['windows']==785
    for x,y in zip(old['rows'],computed['all_windows']):
        assert x['start']==int(y['original'],16)and x['end']-x['start']==y['bytes']
        assert x['raw_match']==y['raw_match']
        assert {f['start']for f in x['matches']}=={f['start']for f in y['matches']}
    build=js(w/'build-record.json');assert build['comparison']['candidate_sha256']==computed['candidate_sha256']
    assert build['returncode']==0 and build['source_unchanged']
    sources=js(w/'source-manifest.json')
    assert len(sources)==57
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
    # Validate actual edges for the two new matched roots, beyond matching CALL positions.
    closure_counts={}
    for row in computed['gains']:
        a=int(row['original'],16);f=row['matches'][0];n=row['bytes'];calls=o.callsites(a,n);other=c.callsites(f['start'],n)
        assert [x['offset']for x in calls]==[x['offset']for x in other]
        for x,y in zip(calls,other):
            i=o.entries.index(x['target']);size=(o.entries[i+1]if i+1<len(o.entries)else o.hi)-x['target']
            target=next(v for v in s.funcs if v['start']==y['target'])
            assert target['size']==size
            assert key(o,x['target'],size)==key(c,y['target'],size)
        closure_counts[row['original']]=len(calls)
    assert closure_counts=={'0xf2ed0':2}
    return {'passed':True,'candidate_sha256':computed['candidate_sha256'],
            'normalized_windows':659,'raw_windows':159,'remaining_windows':126,
            'typed_source_only_candidates':79,'other_code_or_shape_gaps':47,
            'matched_text_bytes':830808,'original_text_bytes':1162040,
            'gains':closure_counts,'losses':0,'copied_source_inputs':57,
            'external_input_bytes_independently_reaudited':False,
            'runtime_reexecuted':False,'whole_elf_identity':False,
            'manifest_sha256':sha(w/'manifest.json')}

if __name__=='__main__':print(json.dumps(verify(),indent=2))
