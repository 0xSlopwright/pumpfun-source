#!/usr/bin/env python3
"""Verify the second maintained Relay build and its actual signed executions."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,re
P=Path(__file__).resolve().parent
CANDIDATE='56d81ec64a0ba070d3d23f3c1547b31d659e85716dfa2198ec4b0ce6cd355333'
SYMBOLS='07ab4ac487727385a3b5ec0d4bc1139e10f701c3fac2f95b88d89701a38ab9e1'
PAYLOAD='367f07a62e3f74d358187d175cf3228848e81a56c781a9a75b9df7fed1268563'
METER=re.compile(r'^Program \S+ consumed \d+ of \d+ compute units$')
def require(value,message):
 if not value:raise ValueError(message)
def sha(data):return hashlib.sha256(data).hexdigest()
def raw(path):
 b=path.read_bytes();return gzip.decompress(b)if path.suffix=='.gz'else b
def load(path):return json.loads(raw(path))
def inventory(root):return {p.relative_to(root).as_posix():sha(p.read_bytes())for p in sorted(root.rglob('*'))if p.is_file()and'__pycache__'not in p.parts}
def verify(repo,packet=P,source=None,signatures=True):
 repo=Path(repo).resolve();packet=Path(packet);source=Path(source or repo/'programs/donation-relay');manifest=load(packet/'manifest.json');actual=inventory(packet);require(set(actual)==set(manifest)|{'manifest.json'},'packet membership')
 for n,h in manifest.items():require(actual[n]==h,'packet hash '+n)
 for n,h in load(packet/'parents.json').items():require(sha((repo/n).read_bytes())==h,'parent changed '+n)
 record=load(packet/'results/build/result.json.gz');require(record['returncode']==0 and record['target_initially_empty']is True and record['root_compilations']==1,'fresh build receipt')
 for f in ['source_unchanged','sdk_unchanged','config_unchanged','registry_unchanged','exact_outputs','network_disabled']:require(record[f]is True,'build check '+f)
 require(record['original_executable_is_build_input']is False and not record['stack_diagnostics'],'build isolation')
 require(record['controller_sha256']==sha((packet/'build.py').read_bytes()),'executed controller binding')
 require(inventory(source)==record['complete_current_tree'],'actual maintained source drift')
 old=load(repo/'repro/donation-relay/canonical-exact-selection/build/launch.json');require(record['source_inputs']==old['source_inputs']and len(record['source_inputs'])==60,'both canonical source maps')
 require(record['sdk_inputs']==load(repo/'repro/donation-relay/framework-sysroot-recovery/sdk/sdk-files.json'),'all 2873 SDK byte pins')
 require(record['config_inputs']==old['config_inputs'],'linker recipe unchanged')
 log=raw(packet/'results/build/build.log.gz');require(sha(log)==record['build_log_sha256']and log.count(b'--crate-name donation_relay_source_proposal ')==1,'fresh build log')
 require('--network'in record['command']and record['command'][record['command'].index('--network')+1]=='none'and '--locked'in record['command']and '--offline'in record['command'],'offline build command')
 registry=raw(packet/'results/build/registry-before.json.gz');require(sha(registry)==record['registry_before_sha256'],'registry receipt binding');packages=json.loads(registry);require(len(packages)==253 and sum(len(p['files'])for p in packages.values())==7968,'registry completeness')
 for name,expected in [('candidate.so',CANDIDATE),('symbols.so',SYMBOLS)]:
  data=raw(packet/'results/build'/(name+'.gz'));require(sha(data)==record['artifacts'][name]['sha256']==expected,'complete '+name)
 candidate=raw(packet/'results/build/candidate.so.gz');original=(repo/'evidence/dependencies/donation_relay/deployed.so').read_bytes();payload=raw(packet/'results/loader/payload.bin.gz');require(len(candidate)==818280 and len(payload)==len(original)==830448 and candidate==original[:818280]and not any(original[818280:])and payload==original,'literal ELF/payload identity')
 receipt=load(packet/'results/loader/receipt.json.gz');observe=load(packet/'results/loader/observation.json');txs=load(packet/'results/loader/transactions.json.gz');require(receipt['elf_sha256']==CANDIDATE and receipt['payload_sha256']==PAYLOAD and receipt['whole_original_payload_equal']and receipt['transactions']==len(txs)==912,'actual loader output');require(observe['existing_controller_sha256']==sha((repo/'repro/donation-relay/offline-loader-allocation/verify.py').read_bytes())and observe['observer_sha256']==sha((packet/'execute_loader.py').read_bytes()),'loader observer binding');require(observe['source_compiler_output_unmodified']and observe['loader_generated_payload']and observe['signature_fields']==914,'loader scope')
 if signatures:from solders.transaction import Transaction
 fields=0
 for tx in txs:
  b=base64.b64decode(tx['transaction_base64'],validate=True);require(sha(b)==tx['sha256'],'loader wire transaction')
  if signatures:
   checks=Transaction.from_bytes(b).verify_with_results();require(checks and all(checks)and len(checks)==tx['signatures'],'loader signature');fields+=len(checks)
 runtime=load(packet/'results/runtime-equal-allocation.json.gz');require(runtime['case_count']==len(runtime['cases'])==536 and not runtime['failures']and runtime['candidate_sha256']==runtime['original_sha256']==PAYLOAD,'equal-allocation replay binding')
 require(runtime['runner_sha256']==sha((repo/'repro/donation-relay/settlement-artifact-recovery/replay_saved.py').read_bytes())and runtime['harness_sha256']==sha((repo/'repro/donation-relay/local-validation-proposal/harness_proposal.py').read_bytes()),'unchanged runtime code')
 for n,h in runtime['input_reports'].items():require(sha((repo/n).read_bytes())==h,'runtime fixture '+n)
 for row in runtime['cases']:
  a,b=row['original'],row['candidate'];require(row['original_reproduced']and not row['differences']and a.keys()==b.keys(),'runtime case membership')
  for k in a:
   if k=='logs':require([l for l in a[k]if not METER.fullmatch(l)]==[l for l in b[k]if not METER.fullmatch(l)],'ordered runtime logs')
   else:require(a[k]==b[k],'runtime outcome '+k)
  if signatures:
   for outcome in [a,b]:
    checks=Transaction.from_bytes(base64.b64decode(outcome['transaction_base64'],validate=True)).verify_with_results();require(checks and all(checks),'runtime signature');fields+=len(checks)
 require(not signatures or fields==3006,'signature field coverage')
 return {'status':'PASS','program':'donation_relay','candidate_sha256':CANDIDATE,'symbols_sha256':SYMBOLS,'maintained_builds':2,'fresh_target':True,'canonical_inputs':60,'sdk_files':2873,'registry_packages':253,'registry_archive_files':7968,'meaningful_elf_equal':True,'meaningful_elf_bytes':818280,'genuine_loader_payload_equal':True,'loader_payload_bytes':830448,'loader_transactions':912,'fresh_replay_records':536,'ordered_log_mismatches':0,'signature_fields_reverified':fields,'compiler_or_target_executed_by_verifier':False,'historical_source_provenance_claimed':False}
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--repo',type=Path,default=P.parents[1]);a=p.parse_args();print(json.dumps(verify(a.repo),indent=2))
