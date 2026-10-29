#!/usr/bin/env python3
"""Audit saved native fee compiler inputs, cache additions and selected code."""
from pathlib import Path
import hashlib, importlib.util, json, re, shlex, struct, sys, tomllib

def H(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def J(p): return json.loads(p.read_text())

def archive_objects(data):
    assert data.startswith(b'!<arch>\n'); pos=8; names=b''; result={}
    while pos < len(data):
        head=data[pos:pos+60]; assert len(head)==60 and head[58:60]==b'`\n'
        size=int(head[48:58]); name=head[:16].decode().strip(); payload=data[pos+60:pos+60+size]
        assert len(payload)==size
        if name=='//': names=payload
        elif name.startswith('/') and name[1:].isdigit():
            result[names[int(name[1:]):].split(b'/\n',1)[0].decode()]=payload
        elif name!='/': result[name.rstrip('/')]=payload
        pos += 60+size+(size%2)
    assert pos==len(data)
    return result

def object_method(b):
    offset=struct.unpack_from('<Q',b,40)[0]; size,count,ni=struct.unpack_from('<HHH',b,58)
    raw=[struct.unpack_from('<IIQQQQIIQQ',b,offset+i*size) for i in range(count)]
    s=raw[ni]; strings=b[s[4]:s[4]+s[5]]
    sections=[(strings[s[0]:].split(b'\0',1)[0].decode(),s) for s in raw]
    methods=[(n,s) for n,s in sections if n.startswith('.text.') and 'calculate_fee' in n]
    assert len(methods)==1
    name,s=methods[0]; idx=raw.index(s); body=bytearray(b[s[4]:s[4]+s[5]]); calls=[]
    for _,r in sections:
        if r[1] not in (4,9) or r[7]!=idx: continue
        st=raw[r[6]]; sr=raw[st[6]]; names=b[sr[4]:sr[4]+sr[5]]
        for p in range(r[4],r[4]+r[5],r[9]):
            at,info=struct.unpack_from('<QQ',b,p); sn=struct.unpack_from('<I',b,st[4]+(info>>32)*24)[0]
            sym=names[sn:].split(b'\0',1)[0].decode(); assert info&0xffffffff==10 and body[at]==0x85
            body[at+4:at+8]=bytes(4); calls.append((at,sym))
    return bytes(body),calls

def verify(root=None):
    root=Path(root or Path(__file__).parent).resolve()
    manifest=J(root/'manifest.json')['files']
    assert {str(p.relative_to(root)):H(p) for p in root.rglob('*') if p.is_file() and p.name!='manifest.json' and '__pycache__' not in p.parts}==manifest
    prime=J(root/'prime/native-prime.json'); build=J(root/'build/build-comparison.json'); base=J(root/'base-build-comparison.json')
    assert prime['returncode']==build['returncode']==0 and prime['priming'] and not build['priming']
    assert prime['source_unchanged'] and build['source_unchanged']
    assert prime['source_sha256']==prime['source_after_sha256']==build['source_sha256']==build['source_after_sha256']
    old=base['dependency_cache_after']; added=prime['native_dependency_additions']; assert len(old)==762 and len(added)==3
    assert prime['dependency_cache_before']==old
    assert prime['dependency_cache_after']==build['dependency_cache_before']==build['dependency_cache_after']==old|added
    assert not(set(old)&set(added)) and all(Path(k).name.startswith('libnative_transfer_fee') for k in added)
    for k,v in added.items(): assert H(root/'prime/native-artifacts'/k)==v
    for k,v in prime['native_generated_proof'].items(): assert H(root/'prime/native-artifact-proof'/k)==v
    assert prime['adapter_sha256']==build['adapter_sha256']==H(root/'build_entrypoint.py')
    assert H(root/'prime/build.log')==prime['build_log_sha256'] and H(root/'build/build.log')==build['build_log_sha256']
    assert prime['command'][-3:]==['--package','native-transfer-fee','--verbose']
    assert build['command'][-2:]==['--locked','--offline']
    for r in (prime,build):
        assert '--locked' in r['command'] and '--offline' in r['command']
        assert r['tool_sha256']==base['tool_sha256'] and r['target_rlib_sha256']==base['target_rlib_sha256']
    native=prime['native_package']; assert native==build['native_package']
    assert native['name']=='native-transfer-fee' and native['version']=='0.1.0' and native['source'] is None and native['dependencies']==[]
    suffix='programs/pump-amm/Cargo.toml'; prefix=next(k[:-len(suffix)] for k in build['source_sha256'] if k.endswith(suffix))
    local={k[len(prefix):]:v for k,v in build['source_sha256'].items() if k.startswith(prefix)}
    actual={str(p.relative_to(root/'source')):H(p) for p in (root/'source').rglob('*') if p.is_file()}
    assert local==actual and len(local)==57 and len(build['source_sha256'])==232
    registry=lambda record:{k.split('/registry/src/',1)[1].split('/',1)[1]:v for k,v in record['source_sha256'].items() if '/registry/src/'in k}
    assert registry(build)==registry(base) and len(registry(build))==175
    command=prime['command']; source_root=Path(command[command.index('--manifest-path')+1]).parent
    assert native['manifest_path']==str(source_root/'crates/native-transfer-fee/Cargo.toml')
    log=(root/'prime/build.log').read_text(); lines=[line for line in log.splitlines() if 'Running `' in line]
    assert len(lines)==1
    args=shlex.split(lines[0].split('`',1)[1].rsplit('`',1)[0])
    assert args[args.index('--crate-name')+1]=='native_transfer_fee' and 'crates/native-transfer-fee/src/lib.rs'in args
    assert args[args.index('--target')+1]=='sbpf-solana-solana' and '--extern'not in args
    for flag in ['opt-level=3','panic=abort','embed-bitcode=no','codegen-units=1','overflow-checks=on','metadata=0b711fd86d68d989','extra-filename=-0b711fd86d68d989']: assert flag in args
    assert 'lto=off'not in args  # Cargo release lto=false is represented by absence of -Clto.
    assert tomllib.loads((root/'source/Cargo.toml').read_text())['profile']['release']['lto'] is False
    owner=(root/'source/crates/native-transfer-fee/src/lib.rs').read_text(); assert 'inline'not in owner and '#![no_std]'in owner
    old_lock=tomllib.loads((root/'base-Cargo.lock').read_text())['package'];new_lock=tomllib.loads((root/'source/Cargo.lock').read_text())['package']
    expect=[]
    for item in old_lock:
        item=dict(item)
        if item['name']=='pump-amm-recovered': item['dependencies']=sorted(item['dependencies']+['native-transfer-fee'])
        expect.append(item)
    expect.append({'name':'native-transfer-fee','version':'0.1.0'})
    key=lambda p:(p['name'],p['version'],p.get('source',''))
    assert sorted(expect,key=key)==sorted(new_lock,key=key)
    fingerprints=list((root/'prime/native-artifact-proof').rglob('lib-native_transfer_fee.json')); assert len(fingerprints)==1
    fingerprint=J(fingerprints[0]); assert fingerprint['deps']==[] and fingerprint['rustflags']==['-Zremap-cwd-prefix=']
    depfiles=list((root/'prime/native-artifact-proof').rglob('*.d')); assert len(depfiles)==1
    assert depfiles[0].read_text().count(': crates/native-transfer-fee/src/lib.rs')==3
    rlibs=[root/'prime/native-artifacts'/k for k in added if k.endswith('.rlib')]
    assert len(rlibs)==2 and H(rlibs[0])==H(rlibs[1])
    objects={n:v for n,v in archive_objects(rlibs[0].read_bytes()).items() if n.endswith('.o')}; assert len(objects)==1
    object_code,relocs=object_method(next(iter(objects.values())))
    assert relocs==[(128,'__multi3'),(320,'__udivti3')]
    spec=importlib.util.spec_from_file_location('native_input_elf',root/'elf_reader.py');e=importlib.util.module_from_spec(spec);spec.loader.exec_module(e)
    original=e.Elf(root/'inputs/original.so'); candidate=e.Elf(root/'inputs/candidate.so');symbols=e.Elf(root/'inputs/symbols.so')
    function=next(f for f in symbols.funcs if 'native_transfer_fee' in f['name'] and 'calculate_fee' in f['name'])
    a,n=0xf2d60,368;b=function['start']; assert function['size']==n and object_code==original.normalized[a:a+n]==candidate.normalized[b:b+n]
    assert original.pattern(a,n)==candidate.pattern(b,n)==[]
    oc=original.callsites(a,n);cc=candidate.callsites(b,n);assert [x['offset'] for x in oc]==[x['offset'] for x in cc]==[128,320]
    for x,y in zip(oc,cc):
        f=next(f for f in symbols.funcs if f['start']==y['target']); length=f['size']
        assert original.b[x['target']:x['target']+length]==candidate.b[y['target']:y['target']+length]
    assert H(root/'inputs/candidate.so')==build['comparison']['candidate_sha256'] and H(root/'inputs/symbols.so')==build['unstripped_sha256']
    repeat_verified=False
    if (root/'repeat/build-comparison.json').exists():
        repeat=J(root/'repeat/build-comparison.json')
        assert repeat['returncode']==0 and not repeat['priming'] and repeat['source_unchanged']
        assert repeat['source_sha256']==repeat['source_after_sha256']==build['source_sha256']
        assert repeat['dependency_cache_before']==repeat['dependency_cache_after']==build['dependency_cache_after']
        assert repeat['comparison']['candidate_sha256']==build['comparison']['candidate_sha256'] and repeat['unstripped_sha256']==build['unstripped_sha256']
        assert repeat['adapter_sha256']==H(root/'build_entrypoint.py') and H(root/'repeat/build.log')==repeat['build_log_sha256']
        repeat_verified=True
    return {'passed':True,'candidate_sha256':build['comparison']['candidate_sha256'],'compiled_workspace_inputs':57,'compiled_registry_inputs':175,'compiled_total_inputs':232,'old_dependency_artifacts_unchanged':762,'new_native_artifacts':3,'native_artifacts_source_bound':True,'native_rlib_object_matches_selected_and_original':True,'native_body_bytes':368,'strict_repeat_verified':repeat_verified,'historical_native_crate_identity_authenticated':False,'executes_build_or_runtime':False,'manifest_sha256':H(root/'manifest.json')}

if __name__=='__main__':print(json.dumps(verify(Path(sys.argv[1])if len(sys.argv)>1 else None),indent=2))
