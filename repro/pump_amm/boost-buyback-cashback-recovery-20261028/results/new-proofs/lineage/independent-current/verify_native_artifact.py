from pathlib import Path
import hashlib,importlib.util,json
def H(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def J(p):return json.loads(p.read_text())
def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def verify(root):
 w=Path(root);d=w/'dependency-proof/origin';p=J(d/'native-prime.json');build=J(w/'build/build-comparison.json')
 base=J(d/'reference/build-comparison.json')['dependency_cache_after'];assert len(base)==762
 assert p['dependency_cache_before']==base and p['dependency_cache_after']==base|p['native_dependency_additions']
 assert build['dependency_cache_before']==build['dependency_cache_after']==p['dependency_cache_after']
 artifacts=p['native_dependency_additions'];assert len(artifacts)==3
 for name,digest in artifacts.items():assert H(d/'native-artifacts'/name)==digest
 rlibs=[d/'native-artifacts'/k for k in artifacts if k.endswith('.rlib')];assert len(rlibs)==2 and H(rlibs[0])==H(rlibs[1])
 obj=module('h15_native_object',w/'native_object_reader.py');objects={k:v for k,v in obj.archive_objects(rlibs[0].read_bytes()).items()if k.endswith('.o')};assert len(objects)==1
 e=module('h15_native_elf',w/'elf_reader.py');o=e.Elf(w/'input-root/evidence/original/pump_amm/deployed.so');c=e.Elf(w/'build/artifacts/pump_amm_recovered.so');s=e.Elf(w/'build/artifacts/unstripped.so')
 for method,a,n,offsets in [('calculate_fee',0xf2d60,368,[128,320]),('calculate_pre_fee_amount',0xf2ed0,776,[272,456])]:
  body,calls=obj.object_method(next(iter(objects.values())),method);f=next(f for f in s.funcs if 'native_transfer_fee' in f['name']and method in f['name']);b=f['start']
  assert f['size']==n and body==o.normalized[a:a+n]==c.normalized[b:b+n] and calls==list(zip(offsets,['__multi3','__udivti3']))
  assert o.pattern(a,n)==c.pattern(b,n)==[]
  for x,y in zip(o.callsites(a,n),c.callsites(b,n)):
   target=next(f for f in s.funcs if f['start']==y['target']);assert o.b[x['target']:x['target']+target['size']]==c.b[y['target']:y['target']+target['size']]
 for method,n in [('supported_mint_data',1168),('decode_transfer_fees',656)]:
  body,calls=obj.object_method(next(iter(objects.values())),method);f=next(f for f in s.funcs if 'native_transfer_fee' in f['name']and method in f['name'])
  assert len(body)==f['size']==n and body==c.normalized[f['start']:f['start']+n]and not calls
 owner=w/'source/crates/native-transfer-fee/src/lib.rs';oldkeys=[k for k in p['source_sha256']if k.endswith('/source/crates/native-transfer-fee/src/lib.rs')];newkeys=[k for k in build['source_sha256']if k.endswith('/source/crates/native-transfer-fee/src/lib.rs')];assert len(oldkeys)==len(newkeys)==1 and p['source_sha256'][oldkeys[0]]==build['source_sha256'][newkeys[0]]==H(owner)
 assert 'inline'not in owner.read_text()and 'no_mangle'not in owner.read_text()
 return {'passed':True,'candidate_sha256':H(w/'build/artifacts/pump_amm_recovered.so'),'recompiled_native_artifacts':0,'reused_native_artifacts':3,'unchanged_framework_artifacts':762,'native_fee_object_bytes':368,'native_inverse_object_bytes':776,'native_scanner_object_bytes':1168,'native_decoder_object_bytes':656,'original_scanner_bytes':1192,'original_decoder_bytes':664,'historical_crate_identity_authenticated':False,'executes_build_or_runtime':False}
