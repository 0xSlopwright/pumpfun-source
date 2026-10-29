import argparse,gzip,hashlib,importlib.util,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
A=argparse.ArgumentParser();A.add_argument('artifact',type=Path);A.add_argument('--run-id',required=True);a=A.parse_args();p=a.artifact
sha=lambda b:hashlib.sha256(b).hexdigest()
m=json.loads((p/'MANIFEST.json').read_text());actual={q.name:{'bytes':q.stat().st_size,'sha256':sha(q.read_bytes())} for q in p.iterdir() if q.is_file() and q.name!='MANIFEST.json'}
if m!=actual:raise ValueError('installer artifact manifest differs')
r=json.loads((p/'result.json').read_text())
if r['github_run_id']!=a.run_id or r['compiler_executed'] is not False or r['target_executions']!=0:raise ValueError('installer execution scope differs')
if r['status']!='SUCCEEDED':
 print(json.dumps({'status':r['status'],'result':r,'evidence_files':list(m)},indent=2));raise SystemExit(2)
source=Path('research/mayhem-pinned-windows-toolchain-20261028');pins=json.loads((source/'inputs.json').read_text())
if sha((source/'inputs.json').read_bytes())!=r['input_pins_sha256'] or sha((source/'install.py').read_bytes())!=r['controller_sha256']:raise ValueError('installer source differs from this checkout')
for n in ['payload-members.json','installed-members.json']:
 if json.loads((p/n).read_text())!=pins['tools_payload_files']:raise ValueError(n+' differs')
if r['compiler_payload_files_verified']!=53 or r['installer_returncode'] not in [0,3010] or not r['exact_cl_link_verified']:raise ValueError('native installation not qualified')
channel=gzip.decompress((p/'channel.json.gz').read_bytes());catalog=gzip.decompress((p/'VisualStudio.vsman.gz').read_bytes())
if sha(channel)!=r['downloads']['channel_sha256'] or sha(catalog)!=r['downloads']['catalog_sha256']:raise ValueError('metadata bytes differ')
spec=importlib.util.spec_from_file_location('pinned_install',source/'install.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);module.validate_catalog(channel,catalog,pins)
launch=json.loads((p/'launch.json').read_text());cmd=launch['command']
for flag,expected in [('--installChannelUri',pins['channel']['url']),('--channelUri',pins['channel']['url']),('--installCatalogUri',pins['catalog']['url'])]:
 if cmd[cmd.index(flag)+1]!=expected:raise ValueError('product locator not fixed')
if '--noUpdateInstaller' not in cmd:raise ValueError('installer update not disabled')
print(json.dumps({'status':'PASS_ACTUAL_PINNED_MSVC_INSTALL','run_id':a.run_id,'github_sha':r['github_sha'],'compiler_member_files':53,'exact_cl_link_verified':True,'installed_msvc':r['msvc'],'catalog_declared_sha256_matched':r['downloads']['catalog_declared_sha256_matched'],'evidence_files':len(m),'new_source_compiler_executions':0},indent=2))
