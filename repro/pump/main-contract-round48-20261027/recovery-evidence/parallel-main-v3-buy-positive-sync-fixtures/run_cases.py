"""Run eight root-approved normal V3-buy fixtures against original and exact R47 identity."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
read=lambda p:json.loads(p.read_text())
PLAN_SHA='ba87b5d5f49580fb266ba9698ddf7afadcbab149be216dd88a68465f0e1c4554'
CANDIDATE_SHA='e7ee643acaa7039dc65fb7ee5dd93e121ec33b0ca4f34b0457a41fbb4a74b764'

def snap(vm,keys):return{str(k):json.loads(a.to_json())if(a:=vm.get_account(k))is not None else None for k in sorted(set(keys),key=str)if k!=PROGRAM}

def run(binary,c):
 vm=f.LiteSVM().with_transaction_history(0)
 dependencies={}
 for family,names in [('original',['pump_fees']),('dependencies',['spl_token','spl_token_2022','associated_token'])]:
  for name in names:
   directory=R/f'evidence/{family}/{name}';capture=read(directory/'capture.json');vm.add_program_from_file(f.Pubkey.from_string(capture['program']),directory/'deployed.so');dependencies[str(directory.relative_to(R))+'/deployed.so']=sha(directory/'deployed.so')
 for key,account in INITIAL.items():
  if account is not None:vm.set_account(key,account)
 vm.add_program_from_file(PROGRAM,binary)
 def replace(key,data=None,lamports=None):
  before=vm.get_account(key);assert before is not None;vm.set_account(key,f.Account(before.lamports if lamports is None else lamports,before.data if data is None else bytes(data),before.owner));after=vm.get_account(key);assert after.owner==before.owner and after.executable==before.executable
 data=bytearray(INITIAL[CURVE].data);struct.pack_into('<5Q',data,8,c['virtual_token_reserves'],c['virtual_quote_reserves'],c['real_token_reserves'],c['real_quote_reserves'],c['token_total_supply']);data[48]=0;data[81]=int(c['is_mayhem_mode']);data[83:115]=bytes(32);replace(CURVE,data,c['curve_lamports'])
 gd=bytearray(INITIAL[GLOBAL].data)
 if c['whitelist_user']:gd[451:483]=bytes(USER.pubkey())
 else:assert gd[451:483]!=bytes(USER.pubkey())
 replace(GLOBAL,gd);replace(USER.pubkey(),lamports=c['user_lamports'])
 metas=list(f.ixs[-1].accounts);quote_account=metas[2].pubkey
 if c['quote_kind']=='native':
  assert quote_account==f.Pubkey.from_string('So11111111111111111111111111111111111111112') and data[83:115]==bytes(32)
 else:
  quote_account=f.Pubkey.from_string(c['quote_mint']);token=f.Pubkey.from_string('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');ata=f.Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
  mint=bytearray(82);struct.pack_into('<Q',mint,36,10**15);mint[44]=6;mint[45]=1;vm.set_account(quote_account,f.Account(10**9,bytes(mint),token))
  def token_account(authority,amount):
   address=f.Pubkey.find_program_address([bytes(authority),bytes(token),bytes(quote_account)],ata)[0];td=bytearray(165);td[:32]=bytes(quote_account);td[32:64]=bytes(authority);struct.pack_into('<Q',td,64,amount);td[108]=1;vm.set_account(address,f.Account(10**9,bytes(td),token));return address
  ca=token_account(CURVE,10**12);ua=token_account(USER.pubkey(),10**12);ba=token_account(metas[13].pubkey,0)
  current=bytearray(vm.get_account(CURVE).data);current[83:115]=bytes(quote_account);replace(CURVE,current)
  metas[2]=f.AccountMeta(quote_account,False,False);metas[4]=f.AccountMeta(token,False,False);metas[7]=f.AccountMeta(ca,False,True);metas[10]=f.AccountMeta(ua,False,True);metas[13]=f.AccountMeta(ba,False,True)
 for key in [BASE_VAULT,BASE_USER]:
  assert vm.get_account(key).data==INITIAL[key].data and vm.get_account(key).owner==INITIAL[key].owner and vm.get_account(key).executable==INITIAL[key].executable
 trade=f.Instruction(PROGRAM,hashlib.sha256(('global:'+c['operation']).encode()).digest()[:8]+struct.pack('<QQ',c['instruction_input'],c['instruction_limit'])+bytes(c['instruction_trailing_bytes']),metas)
 tx=f.Transaction.new_signed_with_payer([*f.ixs[:-1],trade],USER.pubkey(),[USER],vm.latest_blockhash());assert all(tx.verify_with_results())
 keys=set(f.msg.account_keys)|{m.pubkey for m in metas};before=snap(vm,keys);clock=json.loads(vm.get_clock().to_json());result=vm.send_transaction(tx);failed=isinstance(result,f.FailedTransactionMetadata);meta=result.meta()if failed else result;meta_json=json.loads(meta.to_json());after=snap(vm,keys)
 return {'error':str(result.err())if failed else None,'accounts':after,'before':before,'full_before':before,'clock':clock,'inner_instructions':meta_json['inner_instructions'],'event_payloads':[x[14:]for x in meta.logs()if x.startswith('Program data: ')],'logs':meta.logs(),'return_data':meta_json.get('return_data'),'transaction_base64':base64.b64encode(bytes(tx)).decode(),'transaction_sha256':hashlib.sha256(bytes(tx)).hexdigest(),'signature_verified':all(tx.verify_with_results()),'quote_mint_account':str(quote_account),'dependency_sha256':dependencies}

def decode_event(encoded,idl):
 data=base64.b64decode(encoded);disc=hashlib.sha256(b'event:TradeEvent').digest()[:8]
 if not data.startswith(disc):return None
 types={x['name']:x['type'] for x in idl['types']};at=8
 def take(n):
  nonlocal at
  value=data[at:at+n];assert len(value)==n;at+=n;return value
 def field(t):
  if isinstance(t,str):
   if t=='pubkey':return str(f.Pubkey.from_bytes(take(32)))
   if t=='bool':
    v=take(1)[0];assert v in [0,1];return bool(v)
   if t=='string':return take(int.from_bytes(take(4),'little')).decode()
   return int.from_bytes(take(int(t[1:])//8),'little',signed=t.startswith('i'))
  if 'vec' in t:return[field(t['vec'])for _ in range(int.from_bytes(take(4),'little'))]
  if 'defined' in t:return{x['name']:field(x['type'])for x in types[t['defined']['name']]['fields']}
  if 'array' in t:return[field(t['array'][0])for _ in range(t['array'][1])]
  raise ValueError(t)
 result={x['name']:field(x['type'])for x in types['TradeEvent']['fields']}
 result['_suffix_hex']=data[at:].hex();return result

def expected(c,o,idl):
 if o['error']is not None:return{'original_success':False,'original_error':o['error']}
 data=bytes(o['accounts'][str(CURVE)]['data']);vt,vq,rt,rq,supply=struct.unpack_from('<5Q',data,8)
 va=struct.unpack_from('<Q',bytes(o['accounts'][str(BASE_VAULT)]['data']),64)[0]
 ua=struct.unpack_from('<Q',bytes(o['accounts'][str(BASE_USER)]['data']),64)[0]
 denominator=2*supply-va-ua;native=data[83:115]==bytes(32);quote=rq-c['real_quote_reserves'];plain=c['virtual_quote_reserves']+quote
 whitelist=bytes(o['full_before'][str(GLOBAL)]['data'])[451:483]==bytes(USER.pubkey())
 eligible=whitelist and bool(data[81])and not bool(data[48])and rq>=(10000000 if native else 1000000)and denominator>=10**12
 formula=min((denominator+vt)*rq//denominator,2000000000000 if native else 160000000000)if eligible else plain
 events=[v for encoded in o['event_payloads']if(v:=decode_event(encoded,idl))is not None]
 ev=events[0]if len(events)==1 else{}
 checks={'base_vault':va==c['expected_post_base_vault_amount'],'base_user':ua==c['expected_post_base_user_amount'],'virtual_token':vt==c['expected_post_virtual_token_reserves'],'real_token':rt==c['expected_post_real_token_reserves'],'quote':quote==c['expected_trade_quote'],'real_quote':rq==c['expected_post_real_quote'],'denominator':denominator==c['expected_sync_denominator'],'eligibility':eligible==c['expected_sync_update'],'formula':vq==formula,'planned_virtual_quote':vq==c['expected_post_virtual_quote'],'positive_change':vq!=plain if eligible else vq==plain,'one_trade_event':len(events)==1,'event_virtual_quote':ev.get('virtual_quote_reserves')==vq,'event_virtual_sol':ev.get('virtual_sol_reserves')==(vq if native else 0),'event_real_quote':ev.get('real_quote_reserves')==rq,'event_base_out':ev.get('token_amount')==c['expected_token_amount'],'event_quote_in':ev.get('quote_amount')==quote,'event_is_buy':ev.get('is_buy')is True,'event_protocol_fee':ev.get('fee')==0,'event_creator_fee':ev.get('creator_fee')==0,'event_buyback_fee':ev.get('buyback_fee')==0,'event_transfer_fee':ev.get('_suffix_hex')=='0000000000000000'}
 return{'original_success':True,'checks':checks,'all_checks':all(checks.values()),'actual_quote':quote,'actual_virtual_quote':vq,'no_sync_virtual_quote':plain,'independent_formula_virtual_quote':formula,'denominator':denominator,'post_base_vault':va,'post_base_user':ua,'decoded_trade_event':ev}

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
 assert sha(a.candidate)==CANDIDATE_SHA and sha(W/'PLAN01.json')==PLAN_SHA
 plan=read(W/'PLAN01.json');assert len(plan['cases'])==8
 for name,digest in plan['source_inputs'].items():assert sha(R/name)==digest,name
 assert not a.output.exists(),'Preserve the previous run; do not overwrite actual evidence.'
 # Gate imports that initialize local fixture state behind the reviewed hashes.
 sys.path.insert(0,str(R/'scripts'));global f,log_oracle,PROGRAM,USER,CURVE,GLOBAL,INITIAL,BASE_VAULT,BASE_USER
 import pump_trade_fixture as f
 sys.path.insert(0,str(R/'work/parallel-main-r41-log-oracle'));import audit as log_oracle
 PROGRAM=f.Pubkey.from_string(f.x['program']);USER=f.Keypair.from_seed(bytes([231])*32);CURVE=f.Pubkey.from_string(f.x['accounts']['curve']);GLOBAL=f.Pubkey.from_string(f.x['accounts']['global'])
 INITIAL={key:f.vm.get_account(key)for key in f.msg.account_keys};BASE_VAULT=f.ixs[-1].accounts[6].pubkey;BASE_USER=f.ixs[-1].accounts[9].pubkey
 assert str(USER.pubkey())==f.x['accounts']['user']and f.ixs[-1].accounts[8].pubkey==USER.pubkey()
 assert struct.unpack_from('<Q',INITIAL[BASE_VAULT].data,64)[0]+struct.unpack_from('<Q',INITIAL[BASE_USER].data,64)[0]==10**15
 idl=read(R/'evidence/upstream/pump.json');original=R/'evidence/original/pump/deployed.so';assert sha(original)==plan['original_sha256'];rows=[]
 for c in plan['cases']:
  o=run(original,c);n=run(a.candidate,c)
  assert o['full_before']==n['full_before']and o['clock']==n['clock']and o['transaction_base64']==n['transaction_base64']
  different=[k for k in['error','accounts','inner_instructions','event_payloads','return_data']if o[k]!=n[k]]
  if log_oracle.scope(log_oracle.norm(o['logs']))!=log_oracle.scope(log_oracle.norm(n['logs'])):different.append('ordered_logs')
  e=expected(c,o,idl);rows.append({'case':c,'original':o,'candidate':n,'different_fields':different,'expected_from_original_state':e})
  print({'case':c['name'],'original_error':o['error'],'different_fields':different,'expected_checks':e.get('checks'),'actual_virtual_quote':e.get('actual_virtual_quote'),'no_sync_virtual_quote':e.get('no_sync_virtual_quote')},flush=True)
 report={'scope':__doc__,'case_count':len(rows),'candidate_sha256':sha(a.candidate),'original_sha256':sha(original),'plan_sha256':PLAN_SHA,'script_sha256':sha(Path(__file__)),'idl_sha256':sha(R/'evidence/upstream/pump.json'),'cases':rows,'mismatches':[i for i,row in enumerate(rows)if row['different_fields']],'not_as_expected':[i for i,row in enumerate(rows)if not row['expected_from_original_state'].get('all_checks')],'new_distinct_case_count':None,'constraints':['Eight root-approved normal-value cases; original and exact R47 only.','No owner, executable, authority, mint-supply or base-account prebalance mutation.','No RPC or network; local captured dependency programs.','Complete paired signed transactions, prestate, Clock and non-target poststate retained.']}
 a.output.write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0));print({k:report[k]for k in['case_count','mismatches','not_as_expected']},flush=True)
if __name__=='__main__':main()
