"""Exactly two preserved signed AMM→Pump fixtures; only curve Mayhem bit changes."""
from pathlib import Path
import base64,copy,gzip,hashlib,json,struct,sys
ROOT=Path('/workspace/pumpfun-source-latest');OWN=Path(__file__).resolve().parent
RECORDS=OWN.parents[2]/'research/pump-multi-hop-crossing-guard-20261028/runtime/cases.json.gz'
IMAGES=RECORDS.with_name('images.json')
CANDIDATE=Path('/workspace/pump-binary-current-1285/pump/candidate.so')
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(CANDIDATE)=='199fd7379b6881adefd9e54803f75902176c17bded1718bfc1c59b1cf5bc8473'
sys.path.insert(0,str(ROOT/'scripts'))
import pump_captured_loader as loader
loader.install()
from solders.account import Account
from solders.clock import Clock
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata
from solders.litesvm import LiteSVM
pins=json.loads(IMAGES.read_bytes());records=json.loads(gzip.decompress(RECORDS.read_bytes()))
for pin in pins.values():assert sha(ROOT/pin['source'])==pin['sha256']
inputs=[Path(__file__),RECORDS,IMAGES,CANDIDATE,Path(loader.__file__),ROOT/'evidence/upstream/pump.json',*(ROOT/pin['source']for pin in pins.values())]
before_hashes={str(p):sha(p)for p in inputs}
idl=json.loads((ROOT/'evidence/upstream/pump.json').read_bytes());fields=next(t for t in idl['types']if t['name']=='BondingCurve')['type']['fields'];offsets={};at=8
sizes={'bool':1,'u8':1,'u16':2,'u32':4,'u64':8,'i64':8,'u128':16,'pubkey':32}
for f in fields:
 offsets[f['name']]=at;t=f['type'];at+=sizes[t]if isinstance(t,str)else sizes[t['array'][0]]*t['array'][1]
assert offsets['is_mayhem_mode']==81
curve_discriminator=bytes([23,183,248,55,96,216,172,96])
rows=[];selected=[c for c in records['cases']if c['whitelisted']is False and c['real_tokens']==10**15 and c['amount']in [10**8,10**9]]
assert len(selected)==2
for case in selected:
 saved=case['results']['original'];tx=Transaction.from_bytes(base64.b64decode(saved['transaction_base64']));tx.verify();assert all(tx.verify_with_results())
 prestates=copy.deepcopy(saved['before']);changes=[]
 for address,state in prestates.items():
  if state is None:continue
  raw=bytearray.fromhex(state['data_hex'])
  if raw[:8]!=curve_discriminator:continue
  assert raw[offsets['is_mayhem_mode']]==0
  changed=bytes(raw);raw[offsets['is_mayhem_mode']]=1
  assert [i for i,(a,b)in enumerate(zip(changed,raw))if a!=b]==[81]
  state['data_hex']=raw.hex();changes.append({'address':address,'byte_offset':81,'before':0,'after':1,'unchanged_length':len(raw),'original_data_sha256':hashlib.sha256(changed).hexdigest(),'mutated_data_sha256':hashlib.sha256(raw).hexdigest()})
 assert len(changes)==1
 outcomes={}
 for label in ['original','selected']:
  vm=LiteSVM().with_transaction_history(0);vm.set_clock(Clock(100,1234567890,0,0,1234567890))
  for name,pin in pins.items():vm.add_program_from_file(Pubkey.from_string(pin['program_id']),CANDIDATE if name=='pump-original'and label=='selected'else ROOT/pin['source'])
  for address,state in prestates.items():
   if state is not None:vm.set_account(Pubkey.from_string(address),Account(state['lamports'],bytes.fromhex(state['data_hex']),Pubkey.from_string(state['owner'])))
  assert tx.message.recent_blockhash==vm.latest_blockhash()
  sent=vm.send_transaction(tx);failed=isinstance(sent,FailedTransactionMetadata);meta=sent.meta()if failed else sent;encoded=json.loads(meta.to_json());logs=meta.logs();after={}
  for address in saved['after']:
   account=vm.get_account(Pubkey.from_string(address));after[address]=None if account is None else {'lamports':account.lamports,'owner':str(account.owner),'data_hex':bytes(account.data).hex()}
  curve=after[changes[0]['address']];curve_bytes=bytes.fromhex(curve['data_hex'])
  outcomes[label]={'error':str(sent.err())if failed else None,'events':[s for s in logs if s.startswith('Program data: ')],'inner':encoded['inner_instructions'],'return_data':encoded.get('return_data'),'logs':logs,'after':after,'curve_protocol_fees':struct.unpack_from('<Q',curve_bytes,offsets['protocol_fees'])[0]}
 diff=[field for field in ['error','events','inner','return_data','after']if outcomes['original'][field]!=outcomes['selected'][field]]
 row={'amount':case['amount'],'whitelisted':False,'real_tokens':10**15,'single_prestate_changes':changes,'transaction_base64':saved['transaction_base64'],'actual_signatures':[str(s)for s in tx.signatures],'signature_occurrences_per_execution':len(tx.signatures),'original_fixture_before':saved['before'],'mutated_before':prestates,'outcomes':outcomes,'different_fields':diff,'original_admitted':outcomes['original']['error']is None,'selected_admitted':outcomes['selected']['error']is None}
 rows.append(row)
 print(json.dumps({'amount':case['amount'],'changes':changes,'original_error':outcomes['original']['error'],'selected_error':outcomes['selected']['error'],'protocol_fees':{k:v['curve_protocol_fees']for k,v in outcomes.items()},'different_fields':diff}),flush=True)
assert before_hashes=={str(p):sha(p)for p in inputs}
report={'scope':__doc__,'revision':'1285b5e9e3a29c1e2cf32246d6046035e5d66fad','inputs_sha256':before_hashes,'inputs_unchanged':True,'case_count':2,'executed_transactions':4,'signature_occurrences':sum(2*len(r['actual_signatures'])for r in rows),'distinct_serialized_transactions':len(set(r['transaction_base64']for r in rows)),'captured_loader_loads':loader.LOADS,'cases':rows,'limits':'Only two existing fixtures and one Mayhem-bit prestate mutation. No source edit/build, initializer, signer/owner/domain bypass, live transaction, or claim for rejected original cases.'}
(OWN/'mayhem-existing-image-witness.json.gz').write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0))
