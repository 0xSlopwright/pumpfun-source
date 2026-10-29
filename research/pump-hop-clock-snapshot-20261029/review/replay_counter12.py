"""Replay exact saved counter12 prestates and signed wires against original/C0/clock.
No fixture producer, source, account field or instruction is changed. Local VM only.
"""
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

def replay(repo,packet,output):
 repo=repo.resolve();packet=packet.resolve();output=output.resolve();need(not output.exists(),'preserve previous output')
 saved=repo/'research/pump-multihop-accrual-qualification-20261028';need(sha((saved/'MANIFEST.json').read_bytes())=='d5a7e29ae52b385453e055cc619a1bee700f646123e86507daf35d9be5a2c9dd','maintained corpus seal');pins=load(saved/'MANIFEST.json')['files']
 fixture=module(repo/'research/pump-multi-hop-quote-admission/tools/focused.py','clock_counter_fixture');f,loader=fixture.f,fixture.loader
 proof=module(saved/'verify.py','clock_loader_proof')
 sources=[saved/'runtime/counter/counter-witness.json.gz',saved/'runtime/counter/counter-witness-protocol.json.gz']
 cases=[]
 for p in sources:
  need(sha(p.read_bytes())==pins[p.relative_to(saved).as_posix()],'exact maintained counter records');cases.extend(load(p)['cases'])
 need(len(cases)==12,'unchanged12 case count')
 images={'original':repo/'evidence/original/pump/deployed.so','current':saved/'artifacts/candidate.so','clock':packet/'native-build/candidate.so'}
 expected={'original':'7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d','current':'c0e29e2d41c30e854f3548b37e87798d516e4e0e7769f40b7d8d16e31429795f','clock':'0bc4a222f4040ad49b7228cd5ce7476ce8a3c96725a4634c476bc07fd5f83c89'}
 blobs={}
 for label,p in images.items():
  b=p.read_bytes();need(sha(b)==expected[label],'actual selected image');blobs[expected[label]]=b
 watched=[Path(__file__),*sources,*images.values(),repo/'research/pump-multi-hop-quote-admission/tools/focused.py',Path(f.__file__),repo/'research/pump-multi-hop-quote-admission/runtime/inputs/base-fixture.json',repo/'scripts/pump_captured_loader.py',packet/'native-build/build-comparison.json']
 inputs={str(p):sha(p.read_bytes()) for p in watched};units=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$');logs=lambda x:[s for s in x['logs'] if not units.fullmatch(s)]
 rows=[];execs=sigs=loads=0
 for case in cases:
  old=case['runs']['original'];wire=base64.b64decode(old['transaction_base64'],validate=True);tx=f.Transaction.from_bytes(wire)
  need(bytes(tx)==wire and all(tx.verify_with_results()) and len(tx.signatures)==1,'actual original signed wire')
  runs={};observations={}
  for label,path in images.items():
   fixture.SENDS.clear();loader.LOADS.clear();vm=fixture.ObservedVM().with_transaction_history(0);vm.set_clock(f.Clock(100,1234567890,0,0,1234567890));selected=[(pid,repo/p) for pid,p in f.PROGRAMS]+[(f.PUMP,path)]
   for pid,p in selected:vm.add_program_from_file(pid,p)
   for key,state in old['before'].items():
    if state is not None:vm.set_account(f.Pubkey.from_string(key),f.Account(state['lamports'],bytes.fromhex(state['data_hex']),f.Pubkey.from_string(state['owner'])))
   def snapshot():
    result={}
    for key in old['before']:
     a=vm.get_account(f.Pubkey.from_string(key));result[key]=None if a is None else {'lamports':a.lamports,'owner':str(a.owner),'data_hex':bytes(a.data).hex()}
    return result
   before=snapshot();need(before==old['before'],'literal original counter prestate');need(tx.message.recent_blockhash==vm.latest_blockhash(),'same signed blockhash')
   answer=vm.send_transaction(tx);failed=isinstance(answer,f.FailedTransactionMetadata);meta=answer.meta() if failed else answer;raw=json.loads(meta.to_json());inner=raw['inner_instructions'];keys=tx.message.account_keys;pump=[];tokens=[]
   for group in inner:
    for entry in group:
     ix=entry['instruction'];payload=bytes(ix['data'][1:]);accounts=[str(keys[i]) for i in ix['accounts'][1:]];pid=keys[ix['programIdIndex']]
     if pid==f.PUMP and payload.startswith(f.PUMP_DISC):
      import struct
      pump.append({'amount':struct.unpack_from('<Q',payload,8)[0],'flags':list(payload[20:]),'accounts':accounts})
     if pid==f.TOKEN:tokens.append({'data_hex':payload.hex(),'accounts':accounts})
   run={'error':str(answer.err()) if failed else None,'logs':meta.logs(),'events':[s for s in meta.logs() if s.startswith('Program data: ')],'inner':inner,'return_data':raw.get('return_data'),'before':before,'after':snapshot(),'transaction_base64':old['transaction_base64'],'transaction_sha256':sha(wire),'verified_signature_count':len(tx.signatures),'fresh_vm':True,'pump_calls':pump,'token_calls':tokens,'program_sha256':{str(pid):sha(p.read_bytes()) for pid,p in selected}}
   fields=['error','events','inner','return_data','before','after','transaction_base64','transaction_sha256','pump_calls','token_calls']
   need(all(run[k]==old[k] for k in fields),'unchanged corpus observation '+case['case']['name']+' '+label);need(logs(run)==logs(old),'complete ordered Source logs '+case['case']['name']+' '+label)
   need(len(fixture.SENDS)==len(loader.LOADS)==1,'actual send and captured load');obs=fixture.SENDS[0];proof.check_loader(loader.LOADS[0],blobs);need(obs['transaction_base64']==old['transaction_base64'] and obs['signatures_verified'],'actual observed wire');need(obs['metadata']['logs']==run['logs'] and obs['metadata']['inner_instructions']==run['inner'],'actual observed metadata')
   need({p['program']:p['sha256'] for p in obs['program_loads']}==run['program_sha256'],'six exact actual image loads')
   runs[label]=run;observations[label]=obs;execs+=1;sigs+=len(tx.signatures);loads+=len(loader.LOADS)
  rows.append({'case':case['case'],'runs':runs,'observations':observations,'original_exact_counter_mutations':case['exact_counter_mutations']['original'],'differences':[]})
  print(json.dumps({'case':case['case']['name'],'outcomes':3,'differences':[]}),flush=True)
 need(all(sha(Path(p).read_bytes())==d for p,d in inputs.items()),'unchanged inputs')
 result={'scope':__doc__,'cases':rows,'parameter_cases':12,'executed_outcomes':execs,'signature_occurrences_verified':sigs,'captured_loads':loads,'distinct_serialized_messages':len({x['runs']['original']['transaction_base64'] for x in rows}),'images_sha256':expected,'inputs_sha256':inputs,'inputs_unchanged':True,'source_normalization':None,'strict_log_exclusions':units.pattern,'candidate_build_receipt_sha256':sha((packet/'native-build/build-comparison.json').read_bytes()),'limits':'Existing synthetic corpus only. Exact12 prestates and wire bytes reused; no new fixture/admission/mainnet-domain, full checkpoint or behavior correction claim.'}
 output.write_bytes(gzip.compress(json.dumps(result,separators=(',',':')).encode(),mtime=0));return {k:v for k,v in result.items() if k not in ['cases','inputs_sha256']}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--repo',type=Path,required=True);p.add_argument('--packet',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();print(json.dumps(replay(a.repo,a.packet,a.output),indent=2))
