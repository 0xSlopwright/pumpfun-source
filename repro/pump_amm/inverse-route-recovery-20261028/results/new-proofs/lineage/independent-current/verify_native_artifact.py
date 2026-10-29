from pathlib import Path
import hashlib,importlib.util,json
def H(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def J(p):return json.loads(p.read_text())
def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def verify(root):
 w=Path(root);d=w/'dependency-proof';p=J(d/'native-prime.json');build=J(w/'build/build-comparison.json');comp=J(w/'composition.json')
 previous_manifest=d/'previous-dependency-manifest.json'
 assert H(previous_manifest)=='5d02c129c025c6e5d7eb0a7bcdcd5f7f9bd670080a9006b1e1dfa27121d04f78'
 assert H(d/'previous-native-prime.json')==J(previous_manifest)['files']['native-prime.json']
 old=J(d/'previous-native-prime.json');removed={r['path']:r['sha256']for r in comp['removed_native']}
 assert removed==old['native_dependency_additions'] and len(removed)==3
 assert p['dependency_cache_before']==old['dependency_cache_before'] and len(p['dependency_cache_before'])==762
 for name,digest in removed.items():assert H(d/'removed-native'/name)==digest
 lineage=J(d/'removed-native-lineage.json');assert lineage['removed']==removed and lineage['new_native_artifacts']==p['native_dependency_additions']
 artifacts=p['native_dependency_additions'];assert len(artifacts)==3
 for name,digest in artifacts.items():assert H(d/'native-artifacts'/name)==digest
 rlibs=[d/'native-artifacts'/k for k in artifacts if k.endswith('.rlib')];assert len(rlibs)==2 and H(rlibs[0])==H(rlibs[1])
 obj=module('inverse_native_object',w/'native_object_reader.py');objects={k:v for k,v in obj.archive_objects(rlibs[0].read_bytes()).items()if k.endswith('.o')};assert len(objects)==1
 e=module('inverse_native_elf',w/'elf_reader.py');o=e.Elf(w/'input-root/evidence/original/pump_amm/deployed.so');c=e.Elf(w/'build/artifacts/pump_amm_recovered.so');s=e.Elf(w/'build/artifacts/unstripped.so')
 for method,a,n,offsets in [('calculate_fee',0xf2d60,368,[128,320]),('calculate_pre_fee_amount',0xf2ed0,776,[272,456])]:
  body,calls=obj.object_method(next(iter(objects.values())),method);f=next(f for f in s.funcs if 'native_transfer_fee' in f['name']and method in f['name']);b=f['start']
  assert f['size']==n and body==o.normalized[a:a+n]==c.normalized[b:b+n] and calls==list(zip(offsets,['__multi3','__udivti3']))
  assert o.pattern(a,n)==c.pattern(b,n)==[]
  for x,y in zip(o.callsites(a,n),c.callsites(b,n)):
   target=next(f for f in s.funcs if f['start']==y['target']);assert o.b[x['target']:x['target']+target['size']]==c.b[y['target']:y['target']+target['size']]
 owner=w/'source/crates/native-transfer-fee/src/lib.rs';keys=[k for k in p['source_sha256']if k.endswith('/source/crates/native-transfer-fee/src/lib.rs')];assert len(keys)==1 and p['source_sha256'][keys[0]]==build['source_sha256'][keys[0]]==H(owner)
 assert 'inline'not in owner.read_text()and 'no_mangle'not in owner.read_text()
 return {'passed':True,'candidate_sha256':H(w/'build/artifacts/pump_amm_recovered.so'),'removed_ea14_native_artifacts_verified':3,'recompiled_native_artifacts':3,'unchanged_framework_artifacts':762,'native_fee_object_bytes':368,'native_inverse_object_bytes':776,'selected_and_original_objects_equal':True,'historical_crate_identity_authenticated':False,'executes_build_or_runtime':False}
