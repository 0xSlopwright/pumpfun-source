"""Portable read-only replay of PR731 saved proof and exact counter12 replay.
Run normal Python with solders installed. No compiler/VM/network/target execution.
"""
if not __debug__:
    raise RuntimeError("PR731 saved evidence requires normal Python; optimized mode is rejected before validation")
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json,re,sys
sys.dont_write_bytecode=True
sha=lambda b:hashlib.sha256(b).hexdigest()
def need(x,m):
 if not x:raise ValueError(m)
def load(p):
 b=p.read_bytes();return json.loads(gzip.decompress(b) if b[:2]==b'\x1f\x8b' else b)
def module(p,n):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
CU=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
def logs(run):return [s for s in run['logs'] if not CU.fullmatch(s)]
def signed(run):
 from solders.transaction import VersionedTransaction
 b=base64.b64decode(run['transaction_base64'],validate=True);tx=VersionedTransaction.from_bytes(b);need(bytes(tx)==b and all(tx.verify_with_results()),'cryptographic signed wire')
 return b,len(tx.signatures)
def compare(runs,original,fields):
 a=runs[original];need(len({r['transaction_base64'] for r in runs.values()})==1,'one signed fixture wire')
 for label,row in runs.items():
  need(logs(row)==logs(a),'strict whole ordered Source/log lines '+label)
  for f in fields:need(row[f]==a[f],'actual observation '+f+' '+label)

def verify(repo,p,counter,static_path):
 repo=repo.resolve();p=p.resolve();static=module(static_path,'clock_static_final').verify(repo,p)
 proof=module(repo/'research/pump-multihop-accrual-qualification-20261028/verify.py','clock_literal_loader')
 c0=(repo/'research/pump-multihop-accrual-qualification-20261028/artifacts/candidate.so').read_bytes();new=(p/'native-build/candidate.so').read_bytes();old=(repo/'research/pump-final-composition-673-20261028/artifacts/candidate.so').read_bytes();original=(repo/'evidence/original/pump/deployed.so').read_bytes();blobs={sha(x):x for x in [original,c0,new,old]}
 need(sha(c0)=='c0e29e2d41c30e854f3548b37e87798d516e4e0e7769f40b7d8d16e31429795f' and sha(new)=='0bc4a222f4040ad49b7228cd5ce7476ce8a3c96725a4634c476bc07fd5f83c89','C0/new identity')
 create=load(p/'qualification/reports/current-clock-create14.json.gz');need(len(create['cases'])==14 and create['source_coordinate_normalization'] is None,'creation corpus')
 wires=set();sigs=execs=0
 for row in create['cases']:
  runs=row['results'];need(set(runs)=={'original','control','candidate'},'creation labels');compare(runs,'original',['before','after','error','events','inner','return'])
  for run in runs.values():
   raw,n=signed(run);wires.add(raw);sigs+=n;execs+=1
 binding=create['native_cold_binding'];need(binding['candidate_sha256']==sha(new) and binding['current_control_sha256']==sha(c0) and binding['unstripped_sha256']==sha((p/'native-build/unstripped.so').read_bytes()),'creation literal image binding')
 need(binding['candidate_build_receipt_sha256']==sha((p/'native-build/build-comparison.json').read_bytes()) and binding['source_files_verified']==66 and binding['standalone_source_files_verified']==65,'creation actual source/build receipt')
 need({row['family'] for row in create['cases']}=={'616','651'},'creation admitted families')
 loads=create['captured_loader_loads'];need([x['elf_sha256'] for x in loads]==[sha(original),sha(c0),sha(new)]*len(create['cases']),'creation per-case original/current/candidate loader association')
 for x in loads:proof.check_loader(x,blobs)
 need((execs,sigs,len(wires))==(42,84,10),'creation actual scope')
 result={'creation':{'cases':14,'outcomes':execs,'signatures':sigs,'distinct_wires':len(wires),'literal_captured_loads':len(loads)}}
 hop=load(p/'qualification/reports/current-clock-hop13.json.gz');frozen=load(repo/'research/pump-final-composition-673-20261028/runtime/focused/multihop.json.gz');need(len(hop['cases'])==len(frozen['cases'])==13,'hop corpus')
 need(hop['images_sha256']=={'original':sha(original),'parent':sha(c0),'proposal':sha(new)},'hop exact current images');wires=set();sigs=execs=loads=0
 fields=['error','events','inner','return_data','before','after','transaction_base64','pump_calls','token_calls']
 for row,prior in zip(hop['cases'],frozen['cases']):
  need(row['case']==prior['case'],'same hop parameter');runs=row['runs'];need(set(runs)=={'original','parent','proposal'},'hop labels');compare(runs,'original',fields)
  for k in fields:need(runs['original'][k]==prior['runs']['original'][k],'frozen hop original '+k)
  need(logs(runs['original'])==logs(prior['runs']['original']),'frozen hop logs')
  for label,run in runs.items():
   raw,n=signed(run);wires.add(raw);sigs+=n;execs+=1;obs=row['observations'][label];need(obs['transaction_base64']==run['transaction_base64'],'observed signed wire');need(obs['metadata']['logs']==run['logs'] and obs['metadata']['inner_instructions']==run['inner'],'raw hop metadata');need(len(obs['program_loads'])==6 and {x['program']:x['sha256'] for x in obs['program_loads']}==run['program_sha256'],'actual six program loads')
   captured,=obs['loads'];proof.check_loader(captured,blobs);need(captured['elf_sha256']==hop['images_sha256'][label],'hop selected image');loads+=1
 need((execs,sigs,loads,len(wires))==(39,39,39,6),'hop scope');result['hop']={'cases':13,'outcomes':execs,'signatures':sigs,'distinct_wires':len(wires),'literal_captured_loads':loads}
 cross=load(p/'qualification/reports/guard8-four-images.json.gz');savedcross=load(repo/'research/pump-multi-hop-crossing-guard-20261028/runtime/cases.json.gz');need(len(cross['cases'])==len(savedcross['cases'])==8,'crossing8');wires=set();execs=sigs=loads=0
 labels={'original':sha(original),'control':sha(old),'perhop':sha(c0),'clock':sha(new)}
 for row,prior in zip(cross['cases'],savedcross['cases']):
  runs=row['outcomes'];need(set(runs)==set(labels),'crossing labels');compare(runs,'original',['error','before','after','events','inner','return_data']);a=runs['original'];oldrun=prior['results']['original']
  for k in ['before','after','error','events','inner','return_data','transaction_base64']:need(a[k]==oldrun[k],'unchanged crossing original '+k)
  need(logs(a)==logs(oldrun),'unchanged crossing original logs')
  for label,run in runs.items():
   raw,n=signed(run);wires.add(raw);execs+=1;sigs+=n;proof.check_loader(run['captured_loader_load'],blobs);need(run['captured_loader_load']['elf_sha256']==labels[label],'crossing selected image');loads+=1
 need((execs,sigs,loads,len(wires))==(32,32,32,2),'crossing actual scope');need(cross['three_event_success_cases']==2 and cross['prestate_mutations']==0,'two admitted three-event crossings without mutation');result['crossing']={'cases':8,'outcomes':execs,'signatures':sigs,'distinct_wires':len(wires),'literal_captured_loads':loads}
 fresh=load(counter)
 input_map=p/'review/counter12-input-map.json'
 if input_map.is_file():
  bindings=load(input_map);need(set(bindings)==set(fresh['inputs_sha256']),'complete counter portable input map')
  for original_name,row in bindings.items():
   base=p if row['kind']=='packet' else repo;target=(base/row['path']).resolve();need(target.is_relative_to(base) and not (base/row['path']).is_symlink(),'safe portable retained input')
   need(sha(target.read_bytes())==row['sha256']==fresh['inputs_sha256'][original_name],'actual retained counter input bytes')
 saved=repo/'research/pump-multihop-accrual-qualification-20261028/runtime/counter';prior=load(saved/'counter-witness.json.gz')['cases']+load(saved/'counter-witness-protocol.json.gz')['cases'];need(len(fresh['cases'])==len(prior)==12,'counter12 corpus');wires=set();execs=sigs=loads=0
 need(fresh['images_sha256']=={'original':sha(original),'current':sha(c0),'clock':sha(new)},'counter actual images');need(fresh['candidate_build_receipt_sha256']==sha((p/'native-build/build-comparison.json').read_bytes()),'counter actual native build binding')
 for row,oldrow in zip(fresh['cases'],prior):
  need(row['case']==oldrow['case'] and row['original_exact_counter_mutations']==oldrow['exact_counter_mutations']['original'],'unchanged counter parameter/mutations');runs=row['runs'];need(set(runs)=={'original','current','clock'},'counter labels');compare(runs,'original',fields)
  for k in fields:need(runs['original'][k]==oldrow['runs']['original'][k],'counter saved original '+k)
  need(logs(runs['original'])==logs(oldrow['runs']['original']),'counter unchanged original Source')
  for label,run in runs.items():
   raw,n=signed(run);wires.add(raw);execs+=1;sigs+=n;obs=row['observations'][label];need(obs['transaction_base64']==run['transaction_base64'] and obs['metadata']['logs']==run['logs'] and obs['metadata']['inner_instructions']==run['inner'],'counter actual metadata');need(len(obs['program_loads'])==6 and {x['program']:x['sha256'] for x in obs['program_loads']}==run['program_sha256'],'counter six installed images');captured,=obs['loads'];proof.check_loader(captured,blobs);need(captured['elf_sha256']==fresh['images_sha256'][label],'counter actual selected image');loads+=1
 need((execs,sigs,loads,len(wires))==(36,36,36,2),'counter scope');result['counter']={'cases':12,'outcomes':execs,'signatures':sigs,'distinct_wires':len(wires),'literal_captured_loads':loads}
 if (p/'qualification/reports/clock-counter12.json.gz').is_file():
  authored=load(p/'qualification/reports/clock-counter12.json.gz');frozen_rows=prior
  need(len(authored['cases'])==12 and authored['preflight']['new_prestate_mutations']==0,'author unchanged counter12')
  need(authored['preflight']['native_binding']['candidate_build_receipt_sha256']==sha((p/'native-build/build-comparison.json').read_bytes()),'author counter actual native receipt')
  labels={'original':sha(original),'current':sha(c0),'candidate':sha(new)};global_loads=authored['captured_loader_loads']
  need([x['elf_sha256'] for x in global_loads]==[sha(original),sha(c0),sha(new)]*12,'author counter per-case loader association')
  count=sig_count=0;unique=set()
  for case_index,(row,savedrow) in enumerate(zip(authored['cases'],frozen_rows)):
   need(row['case']==savedrow['case'] and row['frozen_counter_mutations']==savedrow['exact_counter_mutations']['original'],'author exact counter parameter/mutations')
   runs=row['outcomes'];need(set(runs)==set(labels),'author counter image labels');compare(runs,'original',fields)
   for key in fields:need(runs['original'][key]==savedrow['runs']['original'][key],'author saved original counter '+key)
   need(logs(runs['original'])==logs(savedrow['runs']['original']),'author original counter Source')
   for image_index,label in enumerate(['original','current','candidate']):
    run=runs[label];wire,number=signed(run);need(number==1,'author counter signature count');unique.add(wire);sig_count+=number;count+=1
    captured=run['captured_loader_load'];need(captured==global_loads[case_index*3+image_index] and captured['elf_sha256']==labels[label],'author counter actual load association');proof.check_loader(captured,blobs)
    expected_programs=dict(savedrow['runs']['original']['program_sha256']);expected_programs['6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P']=labels[label];need(run['program_sha256']==expected_programs,'author actual six program image map')
  need((count,sig_count,len(unique))==(36,36,2),'author counter actual scope')
  result['author_counter']={'cases':12,'outcomes':count,'signatures':sig_count,'distinct_wires':len(unique),'literal_captured_loads':len(global_loads),'overlap':'Same twelve parameter cases and two wires as reviewer counter; separate saved execution, no new unique coverage'}
 result.update(status='PASS',static=static,observed_behavior_correction=False,whole_window_gain=False,source_normalization=None,strict_log_exclusions=CU.pattern,limits='Original saved finite corpora plus one unchanged counter12 replay. No independent new compiler repeat or complete44-suite qualification; no maintained source/image promotion.')
 return result
if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--repo',type=Path,required=True);ap.add_argument('--packet',type=Path,default=Path(__file__).resolve().parent);ap.add_argument('--counter-report',type=Path,default=Path(__file__).resolve().parent/'review/counter12-replay.json.gz');ap.add_argument('--static-verifier',type=Path,default=Path(__file__).with_name('verify_static.py'));ap.add_argument('--report',type=Path);a=ap.parse_args();r=verify(a.repo,a.packet,a.counter_report,a.static_verifier)
 if a.report:need(not a.report.resolve().is_relative_to(a.packet.resolve()),'external report only');a.report.write_text(json.dumps(r,indent=2)+'\n')
 print(json.dumps({k:v for k,v in r.items() if k!='static'},indent=2))
