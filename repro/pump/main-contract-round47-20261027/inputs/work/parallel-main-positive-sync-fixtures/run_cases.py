"""Execute the reviewed eight normal-account sync fixtures on local captured programs only."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;sys.path.insert(0,str(R/'scripts'))
import pump_trade_fixture as f
sys.path.insert(0,str(R/'work/parallel-main-r41-log-oracle'));import audit as log_oracle
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
PLAN=read(W/'PLAN01.json');assert sha(W/'PLAN01.json')=='45107ecd5efbaa46aabae8985ff604937da9bdcc5380fde251fdd9bb3eae2794'
PROGRAM=f.Pubkey.from_string(f.x['program']);USER=f.Keypair.from_seed(bytes([231])*32);CURVE=f.Pubkey.from_string(f.x['accounts']['curve']);GLOBAL=f.Pubkey.from_string(f.x['accounts']['global'])
INITIAL={key:f.vm.get_account(key)for key in f.msg.account_keys};BASE_VAULT=f.ixs[-1].accounts[6].pubkey;BASE_USER=f.ixs[-1].accounts[9].pubkey
assert str(USER.pubkey())==f.x['accounts']['user'] and f.ixs[-1].accounts[8].pubkey==USER.pubkey()
assert struct.unpack_from('<Q',INITIAL[BASE_VAULT].data,64)[0]+struct.unpack_from('<Q',INITIAL[BASE_USER].data,64)[0]==1000000000000000

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
 trade=f.Instruction(PROGRAM,hashlib.sha256(b'global:sell_v3').digest()[:8]+struct.pack('<QQ',c['amount'],c['minimum_output']),metas)
 tx=f.Transaction.new_signed_with_payer([*f.ixs[:-1],trade],USER.pubkey(),[USER],vm.latest_blockhash());assert all(tx.verify_with_results())
 keys=set(f.msg.account_keys)|{m.pubkey for m in metas};before=snap(vm,keys);clock=json.loads(vm.get_clock().to_json());result=vm.send_transaction(tx);failed=isinstance(result,f.FailedTransactionMetadata);meta=result.meta()if failed else result;meta_json=json.loads(meta.to_json());after=snap(vm,keys)
 return {'error':str(result.err())if failed else None,'accounts':after,'before':before,'full_before':before,'clock':clock,'inner_instructions':meta_json['inner_instructions'],'event_payloads':[x[14:]for x in meta.logs()if x.startswith('Program data: ')],'logs':meta.logs(),'return_data':meta_json.get('return_data'),'transaction_base64':base64.b64encode(bytes(tx)).decode(),'transaction_sha256':hashlib.sha256(bytes(tx)).hexdigest(),'signature_verified':all(tx.verify_with_results()),'quote_mint_account':str(quote_account),'dependency_sha256':dependencies}

def account_data(row,key):return bytes(row['accounts'][str(key)]['data'])
def expected(c,o):
 if o['error']is not None:return{'original_success':False,'original_error':o['error']}
 data=account_data(o,CURVE);vt,vq,rt,rq,supply=struct.unpack_from('<5Q',data,8);va=struct.unpack_from('<Q',account_data(o,BASE_VAULT),64)[0];ua=struct.unpack_from('<Q',account_data(o,BASE_USER),64)[0];denom=2*supply-va-ua;native=data[83:115]==bytes(32)
 eligible=c['whitelist_user']and bool(data[81])and not bool(data[48])and rq>=(10000000 if native else 1000000)and denom>=1000000000000
 plain=c['virtual_quote_reserves']-(c['real_quote_reserves']-rq);formula=min((denom+vt)*rq//denom,2000000000000 if native else 160000000000)if eligible else plain
 return {'original_success':True,'native_quote_default':native,'post_base_vault':va,'post_base_user':ua,'post_base_balances_expected':va==c['expected_post_base_vault_amount']and ua==c['expected_post_base_user_amount'],'post_virtual_base':vt,'post_real_quote':rq,'denominator':denom,'eligible':eligible,'expected_eligible':c['expected_sync_update'],'virtual_quote':vq,'no_sync_virtual_quote':plain,'formula_virtual_quote':formula,'matches_formula':vq==formula,'positive_change_observed':vq!=plain if eligible else None}

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert sha(a.candidate)=='405d76aeb4ddea32d3c65391cb8b6dad84aa6732f38f771f1c4bc20e39159e26','This approved run is pinned to finalR45'
 original=R/'evidence/original/pump/deployed.so';rows=[]
 for c in PLAN['cases']:
  o=run(original,c);n=run(a.candidate,c);different=[k for k in ['error','accounts','inner_instructions','event_payloads','return_data']if o[k]!=n[k]]
  assert o['full_before']==n['full_before']and o['clock']==n['clock']and o['transaction_base64']==n['transaction_base64']
  ol=log_oracle.scope(log_oracle.norm(o['logs']));nl=log_oracle.scope(log_oracle.norm(n['logs']))
  if ol!=nl:different.append('ordered_logs')
  e=expected(c,o);out={'case':c,'original':o,'candidate':n,'different_fields':different,'expected_from_original_state':e};rows.append(out);print({'case':c['name'],'original_error':o['error'],'different_fields':different,'expected':e},flush=True)
 report={'scope':__doc__,'case_count':len(rows),'cases':rows,'candidate_sha256':sha(a.candidate),'original_sha256':sha(original),'plan_sha256':sha(W/'PLAN01.json'),'script_sha256':sha(Path(__file__)),'mismatches':[i for i,r in enumerate(rows)if r['different_fields']],'not_as_expected':[i for i,r in enumerate(rows)if not(r['expected_from_original_state'].get('original_success')and r['expected_from_original_state'].get('post_base_balances_expected')and r['expected_from_original_state'].get('eligible')==r['case']['expected_sync_update']and r['expected_from_original_state'].get('matches_formula')and(r['expected_from_original_state'].get('positive_change_observed')if r['case']['expected_sync_update']else True))],'new_distinct_case_count':None,'constraints':['Local captured dependencies; no network or RPC.','All captured account owners/executable flags/authorities preserved.','Eight root-reviewed ordinary-balance cases; no extreme balances.']}
 a.output.write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0));print({'case_count':len(rows),'mismatches':report['mismatches'],'not_as_expected':report['not_as_expected']},flush=True)
if __name__=='__main__':main()
