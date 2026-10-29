#!/usr/bin/env python3
from pathlib import Path
import hashlib, importlib.util, json, sys

def H(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def load(name,path):
    s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def verify(root=None):
    w=Path(root or Path(__file__).parent).resolve(); manifest=json.loads((w/'manifest.json').read_text())['files']
    assert {str(p.relative_to(w)):H(p)for p in w.rglob('*')if p.is_file()and p.name!='manifest.json'and '__pycache__'not in p.parts}==manifest
    p=json.loads((w/'proposal.json').read_text());assert p['selected']is False and p['contextual_build_performed']is False and H(w/'recovery.patch')==p['patch_sha256']
    for f in p['changed']:
        assert H(w/'base-fragments'/f['file'])==f['before'] and H(w/'source'/f['file'])==f['after']
    build=json.loads((w/'objects/build.json').read_text());assert build['returncode']==0 and H(w/'objects/owner.rs')==build['source_sha256']
    assert (w/'objects/owner.rs').read_bytes()==(w/'source/crates/native-transfer-fee/src/lib.rs').read_bytes()
    assert 'inline'not in (w/'objects/owner.rs').read_text() and 'no_mangle'not in (w/'objects/owner.rs').read_text()
    e=load('inverse_elf',w/'elf_reader.py');obj=load('inverse_object',w/'object_reader.py');o=e.Elf(w/'inputs/original.so');c=e.Elf(w/'inputs/candidate.so');u=e.Elf(w/'inputs/symbols.so')
    assert H(w/'inputs/candidate.so')==p['base_candidate']
    for method,start,size,offsets in [('calculate_fee',0xf2d60,368,[128,320]),('calculate_pre_fee_amount',0xf2ed0,776,[272,456])]:
        body,calls=obj.object_method((w/'objects/owner.o').read_bytes(),method)
        assert len(body)==size and body==o.normalized[start:start+size]
        assert calls==list(zip(offsets,['__multi3','__udivti3']))
        original=o.callsites(start,size);assert [x['offset']for x in original]==offsets
        for call,name in zip(original,['__multi3','__udivti3']):
            f=next(f for f in u.funcs if f['name']==name)
            assert o.b[call['target']:call['target']+f['size']]==c.b[f['start']:f['start']+f['size']]
    return {'passed':True,'base_candidate_sha256':p['base_candidate'],'patch_sha256':p['patch_sha256'],'native_fee_object_bytes':368,'native_inverse_object_bytes':776,'direct_callees_raw_equal':True,'forced_attributes':False,'contextual_build_verified':False,'signed_runtime_verified':False,'selected':False,'manifest_sha256':H(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(Path(sys.argv[1])if len(sys.argv)>1 else None),indent=2))
