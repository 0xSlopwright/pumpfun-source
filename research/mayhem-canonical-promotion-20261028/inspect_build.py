"""Independently inspect this run's retained source/host/target receipts offline."""
import argparse,gzip,hashlib,importlib.util,io,json,re,sys,tarfile,tempfile
from pathlib import Path
sys.dont_write_bytecode=True
A=argparse.ArgumentParser();A.add_argument('artifact',type=Path);A.add_argument('--run-id',required=True);A.add_argument('--native-pin',required=True);A.add_argument('--repo',type=Path,default=Path.cwd());A.add_argument('--source-root',type=Path);a=A.parse_args();P=a.artifact;ROOT=a.repo.resolve();BASE=ROOT/'research/mayhem-fresh-host-20261028'
sha=lambda b:hashlib.sha256(b).hexdigest()
def require(ok,message):
 if not ok:raise ValueError(message)
def read(p):return json.loads(p.read_bytes())
def identity(b):return {'bytes':len(b),'sha256':sha(b)}
def unpack(p):
 result={}
 with tarfile.open(fileobj=io.BytesIO(p.read_bytes()),mode='r:gz') as t:
  for m in t:
   require(m.isfile() and not m.name.startswith('/') and '..' not in m.name.split('/') and m.name not in result,'unsafe source archive')
   result[m.name]=t.extractfile(m).read()
 return result
def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
manifest=read(P/'MANIFEST.json');actual={p.relative_to(P).as_posix():identity(p.read_bytes()) for p in P.rglob('*') if p.is_file() and p!=P/'MANIFEST.json'};require(actual==manifest,'artifact inventory changed')
q=read(P/'qualification.json');require(q['github_run_id']==a.run_id,'wrong run');require(q['status']=='SUCCEEDED' and q['compiler_executed'] is True and q['target_executions']==0,'fresh build failed/not compiled');require(q['native_inputs_sha256_requested']==a.native_pin,'wrong admitted native pin')
for name in ['inputs/native-inputs.json','native-postcheck/native-inputs.json']:
 n=read(P/name);h=sha(json.dumps(n['inputs'],sort_keys=True,separators=(',',':')).encode());require(h==n['native_manifest_sha256']==a.native_pin,'native inventory changed');require(n['kit_version']=='10.0.26100.0' and n['cl_link_match_qualified_hashes'],'native profile differs')
require(read(P/'inputs/native-inputs.json')['inputs']==read(P/'native-postcheck/native-inputs.json')['inputs'],'native inputs changed during compilation')
prepared=read(P/'inputs/prepared-inputs.json');require(prepared['status']=='READY' and (prepared['sdk_files'],prepared['target_files'],prepared['vendor_packages'])==(2639,27,215),'SDK/vendor preparation incomplete')
source=(a.source_root or ROOT/'research/all-contract-completion-20261028/mayhem-proposal/source').resolve()
if 'linker_locator_recipe' in q:
 builder=module('locator_current_source_builder',ROOT/'research/mayhem-linker-locators-20261028/build_exact.py')
 with tempfile.TemporaryDirectory(prefix='mayhem-current-inspect-') as temporary:_,expected_map=builder.stage(Path(temporary)/'stage',ROOT,source)
else:
 builder=module('windows_current_source_builder',source/'build_exact.py')
 with tempfile.TemporaryDirectory(prefix='mayhem-current-inspect-') as temporary:_,expected_map=builder.stage(Path(temporary)/'stage',ROOT)
mapping=read(P/'build/source-mapping.json')
require(mapping['source_entrypoint_sha256']=='cfc9688bfd993c7bef9eaa80738bde04599b529d25b7afbf61c9a5fba035a0d6','executed proposal entrypoint observation changed')
# The published run selected the new recipe builder explicitly. Its prototype
# source directory contained an unused older entrypoint. Promotion installs the
# actual executed new builder; only the 67 raw compiler inputs are projected.
require(mapping['source_entrypoint_sha256']==mapping['stager_script_sha256'],'prototype entrypoint differs from sealed source stager')
require(mapping['qualified_recipe'].replace('\\','/')==expected_map['qualified_recipe'].replace('\\','/'),'qualified recipe locator differs')
for key in ['source_files','mapping','canonical_inputs','wrapper_sha256']:
 require(mapping[key]==expected_map[key],'current source/recipe staging changed: '+key)
actual_copies=mapping['copied_recipe_inputs'];expected_copies=expected_map['copied_recipe_inputs'];require(set(actual_copies)==set(expected_copies),'staged controller inventory differs')
for name,expected in expected_copies.items():
 if name.startswith('controller/sources/'):
  require(bool(re.fullmatch('[0-9a-f]{64}',actual_copies[name])),'invalid source-container observation')
 else:require(actual_copies[name]==expected,'staged non-source controller changed: '+name)
# Source gzip encodings can differ across host Python/zlib versions; every raw
# source byte is checked through mapping and the actual target source archive.
driver=ROOT/'research/all-contract-completion-20261028/run_mayhem_windows.py'
if 'transport_successor' in q:
 pins=read(ROOT/'research/mayhem-offline-vendor-20261028/inputs.json');require(q['parent_driver_sha256']==sha(driver.read_bytes()),'transport parent driver changed');driver=ROOT/'research/mayhem-offline-vendor-20261028/run.py'
 adapter=module('offline_successor_check',ROOT/'research/mayhem-offline-vendor-20261028/verify.py');adapter.verify_driver(pins)
 cache=read(P/'inputs/offline-vendor.json');require(cache['bundle_sha256']==pins['bundle_sha256'] and cache['archives_seeded']==215 and cache['registry_network_fallback_allowed'] is False,'offline cache preparation incomplete')
 require(cache['archives']=={r['directory']+'.crate':r['archive_sha256'] for r in pins['packages']},'offline archive identity differs');require(cache['adapter_sha256']==sha((ROOT/'research/mayhem-offline-vendor-20261028/prepare.py').read_bytes()),'offline adapter code differs')
if 'linker_locator_recipe' in q:
 require(q['linker_driver_parent_sha256']==sha(driver.read_bytes()),'linker driver parent differs');driver=ROOT/'research/mayhem-linker-locators-20261028/run.py'
 require(mapping['linker_locator_transform']==expected_map['linker_locator_transform'] and mapping['stager_script_sha256']==expected_map['stager_script_sha256'],'linker/stager transformation differs')
require(q['controller_sha256']==sha(driver.read_bytes()),'driver differs from this checkout')
HOST=P/'build/build/host';TARGET=P/'build/build/target';hr=read(HOST/'result.json');tr=read(TARGET/'result.json');hl=read(HOST/'launch.json');tl=read(TARGET/'launch.json');binding=read(HOST/'macro-binding.json')
require(hr['status']=='SUCCEEDED' and hr['returncode']==0 and hr['source_unchanged'] and hr['supplements_unchanged'] and hr['vendor_rechecked'],'host receipt failure');require((hr['compilations'],hr['host_dependency_files'],hr['target_executions'])==(42,61,0),'host compile inventory differs')
require(tr['status']=='SUCCEEDED' and tr['returncode']==0 and tr['source_unchanged'] and tr['root_invocations']==1 and tr['historical_macro_dependencies_unchanged'] and tr['target_executions']==0,'target receipt failure')
require(hl['target_directory_initially_absent'] is True and tl['target_directory_initially_absent'] is True,'target cache reused')
macro=gzip.decompress((HOST/'anchor_attribute_program.dll.gz').read_bytes());require(identity(macro)==hr['macro'] and sha(macro)==binding['macro']['sha256'],'fresh DLL binding differs');require(read(P/'build/build/controller/historical-macro.json')==binding,'target macro binding is not this fresh host output')
verify=module('old_fresh_host_helpers',BASE/'verify.py');verify.bind(BASE);_,_,helpers=verify.helpers(BASE);host_source,supplements=verify.host_source(BASE,helpers)
require(unpack(HOST/'source.tar.gz')==host_source,'actual host source archive differs');require(hl['source_inputs']=={n:identity(b) for n,b in host_source.items()} and hl['supplement_inputs']==supplements,'host source or optional archive mapping differs');require(hl['controller_sha256']==sha((BASE/'host_build.py').read_bytes()),'host controller changed')
require(hl['command'][1:4]==['build','--locked','--offline'] and hl['command'][-4:]==['--release','-p','anchor-attribute-program','--verbose'],'host recipe differs')
require(hl['environment']['CARGO_NET_OFFLINE']=='true' and 'RUSTFLAGS' not in hl['environment'] and 'RUSTC_WRAPPER' not in hl['environment'],'host environment differs')
target_source={n:(source/n).read_bytes() for n in mapping['canonical_inputs']};require(unpack(TARGET/'source.tar.gz')==target_source,'actual target source archive differs');require(tl['source_inputs']==mapping['canonical_inputs'],'actual target source pins differ')
for root,receipt,count in [(HOST,hr,42),(TARGET,tr,163)]:
 for logname,expected in receipt['logs'].items():require(identity((root/logname).read_bytes())==expected,'compiler log binding differs')
 text=(root/'stderr.log').read_text(errors='replace');lines=[line for line in text.splitlines() if 'Running `' in line and '--crate-name ' in line];require(len(lines)==count,'fresh compiler command count differs')
 require('Stack offset' not in text and 'exceeded max offset' not in text,'stack diagnostic')
 if root==HOST:require(lines==read(HOST/'compile-commands.json'),'host compiler commands differ')
norm=lambda value:re.sub('/+','/',value.replace('\\','/'))
require(norm(tl['environment_overrides']['MAYHEM_HISTORICAL_MACRO'])==norm(hl['environment']['CARGO_TARGET_DIR'])+'/release/anchor_attribute_program.dll','target did not select this fresh DLL')
require(norm(tl['environment_overrides']['MAYHEM_HISTORICAL_DEPS'])==norm(hl['environment']['CARGO_TARGET_DIR'])+'/release/deps','target did not select fresh dependencies')
original=gzip.decompress((BASE/'reference/original-allocation.so.gz').read_bytes());candidate=(TARGET/'candidate-v154-strip.so').read_bytes();symbols=(TARGET/'symbols.so').read_bytes();require(len(original)==777408 and len(candidate)==775416 and candidate==original[:775416] and not any(original[775416:]),'complete meaningful original differs');require(sha(symbols)=='7b15bb1e5c7c9c53041322fa64d4a420906fffd96ff97a55d70d627bcb854960' and len(symbols)==907776,'compiler ELF differs')
for name,data in [('symbols.so',symbols),('candidate-v154-strip.so',candidate)]:require(tr['outputs'][name]==identity(data) and q['outputs'][name]==sha(data),'ELF receipt binding differs')
require(tr['strip']['returncode']==0 and tr['strip']['command'][1]=='--strip-all','ordinary stripping recipe differs')
print(json.dumps({'status':'PASS_ACTUAL_CURRENT_SOURCE_WINDOWS_BUILD','run_id':a.run_id,'github_sha':q['github_sha'],'native_manifest_sha256':a.native_pin,'current_source_inputs':67,'host_source_files':len(host_source),'host_compilations':42,'target_cargo_compilations':163,'fresh_host_macro_bytes':len(macro),'meaningful_original_elf_bytes':775416,'allocation_zero_tail_bytes_not_emitted':1992,'candidate_sha256':sha(candidate),'symbols_sha256':sha(symbols),'target_executions':0,'canonical_source_promoted':False,'artifact_files':len(manifest),'historical_source_provenance_claimed':False},indent=2))
