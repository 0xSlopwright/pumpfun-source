"""Portable saved-receipt audit for the inverse-fee and route composition."""
from pathlib import Path,PurePosixPath
import gzip,hashlib,json,types,sys
W=Path(__file__).resolve().parent
sys.dont_write_bytecode=True
sys.path.insert(0,str(W))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):
    p=Path(p)
    if not p.exists():p=p.with_suffix(p.suffix+'.gz')
    b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(name,p):
    m=types.ModuleType(name);m.__file__=str(p);exec(compile(Path(p).read_bytes(),str(p),'exec'),m.__dict__);return m
def verify(root=None):
    w=Path(__file__).resolve().parent;m=read(w/'manifest.json')
    actual={p.relative_to(w).as_posix()for p in w.rglob('*')if p.is_file()and'__pycache__'not in p.parts}
    assert actual==set(m['files'])|{'manifest.json'}
    for n,h in m['files'].items():
        p=PurePosixPath(n);assert not p.is_absolute()and'..'not in p.parts
        assert sha(w/n)==h,n
    h=sha(w/'build/artifacts/pump_amm_recovered.so');assert h=='98ed250d3999e79b55683daa574b984fb7f650dc9eef0e3256671d0612b49fc3'
    for name in ['pump_amm_recovered.so','unstripped.so']:
        assert (w/'build/artifacts'/name).read_bytes()==gzip.decompress((w/'build-repeat/artifacts'/(name+'.gz')).read_bytes())
    first=read(w/'build/build-comparison.json');repeat=read(w/'build-repeat/build-comparison.json');prime=read(w/'build-native-prime/native-prime.json')
    assert first['source_sha256']==repeat['source_sha256']
    assert first['dependency_cache_after']==repeat['dependency_cache_before']==repeat['dependency_cache_after']
    assert len(first['source_sha256'])==232 and len(first['dependency_cache_after'])==765
    assert len(prime['dependency_cache_before'])==762 and len(prime['native_dependency_additions'])==3
    assert all(prime['dependency_cache_after'][n]==v for n,v in prime['dependency_cache_before'].items())
    assert first['dependency_cache_before']==prime['dependency_cache_after']
    dependency=module('current_dependency',w/'dependency-proof/verify.py').verify(w/'canonical-source',w/'build/build-comparison.json',w/'dependency-proof')
    source=module('current_source',w/'verify_source_binding.py').verify(w/'canonical-source',w/'source',w/'build/build-comparison.json',w/'build/artifacts/pump_amm_recovered.so',w/'build/artifacts/unstripped.so',w/'dependency-proof')
    assert source['total_compiled_inputs_verified']==232 and dependency['unchanged_dependency_artifacts']==765
    for name,table in [('source','source-manifest.json'),('base-source','base-source-manifest.json')]:
        sources=read(w/table);assert len(sources)==57
        assert sources=={p.relative_to(w/name).as_posix():sha(p)for p in(w/name).rglob('*')if p.is_file()}
    sources=read(w/'source-manifest.json');base=read(w/'base-source-manifest.json');changed=[n for n in sources if sources[n]!=base[n]]
    assert set(changed)=={'crates/native-transfer-fee/src/lib.rs','programs/pump-amm/src/utils/transfer_fee.rs','programs/pump-amm/src/instructions/swap/multi_hop_swap.rs'}
    for n,v in sources.items():
        keys=[k for k in first['source_sha256']if k.endswith('/source/'+n)];assert len(keys)==1 and first['source_sha256'][keys[0]]==v
    metric=read(w/'measurement.json');assert(metric['normalized'],metric['raw'],metric['windows'])==(659,159,785)
    assert metric['normalized_gains']==['0xf2ed0']and not metric['normalized_losses']
    independent=read(w/'raw-independent-verification.json');assert independent['independent_upstream_counter_model']=={'signature':659,'raw_sha256':159}
    assert len(independent['raw_gains'])==11 and independent['raw_losses']==[]
    assert read(w/'wrappers.json')['normalized_and_relocation_matches']==38
    core=module('current_core',w/'verify_core.py')
    private=module('current_private',w/'verify_cases.py').verify(w)
    sweep=module('current_sweep',w/'verify_sweep.py').verify(w/'sweep-inputs',w/'build/artifacts/pump_amm_recovered.so',w/'sweep254',w/'observe_sweep.py')
    incentive=module('current_incentive',w/'counterexamples/verify.py').verify(w/'counterexamples')
    native=module('current_native',w/'native-focused/verify.py').verify({'original':'6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7','baseline':'ea14ee8e5ea9a9b6695110fa141af77f378a21dcd36e159ae92279c9c6d6b593','candidate':h})
    cto=module('current_cto',w/'cto-controls/verify.py').verify(w/'cto-controls',expected_bad=0)
    retained=module('current_retained_cto',w/'cto-controls/retained19/verify.py').verify(w/'cto-controls/retained19')
    extra=module('current_extras',w/'verify_extras.py').verify()
    assert extra['supplemental_cases']==2811
    status=read(w/'acceptance.json')
    assert len(status)==13 and all(x['returncode']==0 for x in status)
    assert {x.get('suite',x.get('name'))for x in status}=={'private1502','sweep254','current1730','fullcore17462','regression','refinements','liquidity-focused','expanded','recovery','extra-controls','retained-extras','targeted-admin','program-identity32'}
    assert incentive['cases']==1730 and incentive['mismatches']==0
    assert private['cases']==1502 and sweep['cases']==254 and native['cases']==216
    return {'passed':True,'candidate_sha256':h,'normalized_windows':659,'raw_windows':159,'remaining_windows':126,
        'exact_repeat':True,'source_inputs':232,'fixed_dependencies':765,
        'core_cases':17462,'incentive_cases':1730,'private_cases':1502,'sweep_cases':254,
        'native_cases':216,'cto_cases':41,'native_raw_source_differences':native['raw_source_coordinate_differences'],
        'supplemental_cases':2811,'successful_acceptance_groups':13,
        'whole_elf_identity':False,'runtime_reexecuted_by_verifier':False,'manifest_sha256':sha(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
