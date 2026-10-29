"""Run six reviewed legacy sync inputs against the selected R47 candidate."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
PLAN_SHA='b2a8f0ab1e0a3084786035110e12a50ee8688ecc665b0aa6d43a50cb995c9538'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
read=lambda p:json.loads(p.read_text())
dump=lambda x:json.dumps(x,sort_keys=True,separators=(',',':')).encode()

def account_fingerprint(a):
 if a is None:return None
 data=a.get('data',a.get('data_base64'))
 fp={k:a[k]for k in['lamports','owner','executable']if k in a}
 if data is not None:
  choices=[]
  if isinstance(data,str):
   # Older corpus families retain either hex or base64 without an encoding tag.
   # Keep both valid interpretations when ambiguous; never invent a difference.
   try:choices.append(bytes.fromhex(data))
   except ValueError:pass
   try:choices.append(base64.b64decode(data,validate=True))
   except ValueError:pass
  else:
   try:choices.append(bytes(data))
   except(TypeError,ValueError):pass
  if choices:fp['data_sha256']=sorted({hashlib.sha256(x).hexdigest()for x in choices})
 return fp

def known_difference(a,b):
 if a is None or b is None:return a!=b
 for k in set(a)&set(b):
  if k=='data_sha256':
   if not set(a[k])&set(b[k]):return True
  elif a[k]!=b[k]:return True
 return False

def complete_fingerprints(values):
 return all(x is None or set(x)>={'lamports','owner','executable','data_sha256'}for x in values)

def retained_index(paths,global_key):
 """Index every retained signed receipt, avoiding executable byte-list traversal."""
 index={};counts=[]
 def pairs(x):
  if isinstance(x,dict):
   if isinstance(x.get('original'),dict)and isinstance(x.get('candidate'),dict):yield x
   for k,v in x.items():
    if k not in('original','candidate')and isinstance(v,(dict,list)):yield from pairs(v)
  elif isinstance(x,list)and x and isinstance(x[0],(dict,list)):
   for v in x:yield from pairs(v)
 for path in paths:
  obj=json.loads(gzip.decompress(path.read_bytes()));n=0
  for pair in pairs(obj.get('suites',obj.get('cases'))):
   for side in['original','candidate']:
    rec=pair[side];tx=rec['transaction_base64'];before=rec.get('full_before',rec.get('before'))
    fp={k:account_fingerprint(v)for k,v in before.items()}if isinstance(before,dict)else None
    acc=rec.get('accounts',{}).get(global_key)
    index.setdefault(tx,[]).append({'before':fp,'clock':rec.get('clock'),'readonly_global_after':account_fingerprint(acc)})
    n+=1
  counts.append({'path':str(path.relative_to(R)),'sha256':sha(path),'declared_cases':obj.get('case_count'),'retained_receipts':n})
 assert counts[0]['declared_cases']+counts[1]['declared_cases']==18111
 assert counts[0]['retained_receipts']+counts[1]['retained_receipts']==36222,counts
 assert counts[2]['declared_cases']==8 and counts[2]['retained_receipts']==16
 assert counts[3]['declared_cases']==12 and counts[3]['retained_receipts']==24
 return index,counts

def novelty(rec,index,global_key,program):
 candidates=index.get(rec['transaction_base64'],[])
 if not candidates:return{'status':'distinct','basis':'transaction bytes absent from all retained signed receipts','collisions':0}
 tx=program.Transaction.from_bytes(base64.b64decode(rec['transaction_base64']));keys=list(map(str,tx.message.account_keys));h=tx.message.header
 i=keys.index(global_key);readonly=i>=len(keys)-h.num_readonly_unsigned_accounts
 before={k:account_fingerprint(v)for k,v in rec['full_before'].items()};out=[]
 for prior in candidates:
  if prior['before']:
   common=set(before)&set(prior['before']);diff=[k for k in common if known_difference(before[k],prior['before'][k])]
   if diff:out.append('different_account_prestate');continue
   if rec['clock']!=prior['clock']and prior['clock']is not None:out.append('different_clock');continue
   if set(before)==set(prior['before'])and before==prior['before']and rec['clock']==prior['clock']and complete_fingerprints(before.values())and complete_fingerprints(prior['before'].values()):out.append('duplicate');continue
  # A readonly Global account cannot change within the colliding transaction.
  if readonly and prior['readonly_global_after']is not None and known_difference(before[global_key],prior['readonly_global_after']):
   out.append('different_readonly_global_prestate');continue
  out.append('unknown')
 return{'status':'duplicate'if'duplicate'in out else'unknown'if'unknown'in out else'distinct','basis_counts':{x:out.count(x)for x in sorted(set(out))},'collisions':len(candidates)}

def main():
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument('--candidate',type=Path,required=True)
 p.add_argument('--expected-candidate-sha256',required=True)
 p.add_argument('--output',type=Path,required=True)
 a=p.parse_args()
 assert sha(a.candidate)==a.expected_candidate_sha256
 assert sha(W/'PLAN01.json')==PLAN_SHA
 plan=read(W/'PLAN01.json');assert len(plan['cases'])==6
 for n,h in plan['source_inputs'].items():assert sha(R/n)==h,n
 # Imports are deliberately after the candidate/plan gate; fixture imports create VMs.
 sys.path.insert(0,str(R/'scripts'))
 import struct
 import pump_trade_fixture as f
 import pump_legacy_buy_differential as buy
 import pump_legacy_sell_differential as sell
 sys.path.insert(0,str(R/'work/parallel-main-r41-log-oracle'))
 import audit as log_oracle
 PROGRAM=f.Pubkey.from_string(f.x['program']);USER=buy.USER
 CURVE=buy.CURVE;GLOBAL=buy.GLOBAL;BASE_VAULT=f.ixs[-1].accounts[6].pubkey;BASE_USER=f.ixs[-1].accounts[9].pubkey;MINT=f.ixs[-1].accounts[1].pubkey
 assert str(USER.pubkey())==f.x['accounts']['user']
 initial=dict(buy.INITIAL);real_vm=f.LiteSVM
 def snapshot(vm,keys):return{str(k):json.loads(ac.to_json())if(ac:=vm.get_account(k))is not None else None for k in sorted(keys,key=str)if k!=PROGRAM}
 class CaptureVM:
  def __init__(self,*args,**kwargs):self.inner=real_vm(*args,**kwargs);self.keys=set(initial);self.capture=None
  def __getattr__(self,name):
   attr=getattr(self.inner,name)
   if not callable(attr):return attr
   def wrapped(*args,**kwargs):
    if name in['set_account','add_program_from_file','add_program']:self.keys.add(args[0])
    result=attr(*args,**kwargs)
    return self if result is self.inner else result
   return wrapped
  def send_transaction(self,tx):
   self.keys.update(tx.message.account_keys)
   for key in[BASE_VAULT,BASE_USER,MINT]:
    ac=self.inner.get_account(key);assert account_fingerprint(json.loads(ac.to_json()))==account_fingerprint(json.loads(initial[key].to_json()))
   before=snapshot(self.inner,self.keys);clock=json.loads(self.inner.get_clock().to_json())
   result=self.inner.send_transaction(tx)
   self.capture={'full_before':before,'clock':clock,'accounts':snapshot(self.inner,self.keys),'transaction_base64':base64.b64encode(bytes(tx)).decode(),'signatures':[str(x)for x in tx.signatures],'signature_verified':all(tx.verify_with_results()),'transaction_sha256':hashlib.sha256(bytes(tx)).hexdigest()}
   captures.append(self.capture);return result
 captures=[]
 def run(binary,c):
  module=sell if c['operation']=='sell'else buy
  module.INITIAL=dict(initial)
  def replace(key,data=None,lamports=None):
   old=initial[key];module.INITIAL[key]=f.Account(old.lamports if lamports is None else lamports,old.data if data is None else bytes(data),old.owner)
  data=bytearray(initial[CURVE].data);struct.pack_into('<5Q',data,8,c['virtual_token_reserves'],c['virtual_quote_reserves'],c['real_token_reserves'],c['real_quote_reserves'],c['token_total_supply'])
  data[48]=int(c['complete']);data[81]=int(c['is_mayhem_mode']);replace(CURVE,data,c['curve_lamports'])
  gd=bytearray(initial[GLOBAL].data);gd[451:483]=bytes(USER.pubkey());replace(GLOBAL,gd)
  replace(USER.pubkey(),lamports=c['user_lamports'])
  case={'name':c['name'],'kind':c['operation'],'amount':c['instruction_input'],'minimum':c['instruction_limit'],'token_quote':c['quote_kind']=='token','token22':False,'reserved':c['is_mayhem_mode']}
  if c['operation']!='sell':case['trailing']=[0,0]
  before_count=len(captures);f.LiteSVM=CaptureVM
  try:result=module.run(case,binary)
  finally:f.LiteSVM=real_vm
  assert len(captures)==before_count+1
  cap=captures[-1];assert result['transaction_base64']==cap['transaction_base64']and cap['signature_verified']
  result.update(cap);return result
 def expected(c,o):
  if o['error']is not None:return{'original_success':False,'original_error':o['error']}
  data=bytes(o['accounts'][str(CURVE)]['data']);vt,vq,rt,rq,tts=struct.unpack_from('<5Q',data,8)
  va=struct.unpack_from('<Q',bytes(o['accounts'][str(BASE_VAULT)]['data']),64)[0];ua=struct.unpack_from('<Q',bytes(o['accounts'][str(BASE_USER)]['data']),64)[0]
  den=2*tts-va-ua;native=data[83:115]==bytes(32);buying=c['operation']!='sell'
  quote=rq-c['real_quote_reserves']if buying else c['real_quote_reserves']-rq
  plain=c['virtual_quote_reserves']+quote if buying else c['virtual_quote_reserves']-quote
  eligible=bool(data[81])and not bool(data[48])and rq>=(10000000 if native else 1000000)and den>=10**12
  formula=min((den+vt)*rq//den,2000000000000 if native else 160000000000)if eligible else plain
  checks={'base_vault':va==c['expected_post_base_vault_amount'],'base_user':ua==c['expected_post_base_user_amount'],'virtual_token':vt==c['expected_post_virtual_token_reserves'],'real_token':rt==c['expected_post_real_token_reserves'],'quote':quote==c['expected_trade_quote'],'formula':vq==formula,'eligibility':eligible==c['expected_sync_update'],'positive_change':vq!=plain if eligible else vq==plain}
  return{'original_success':True,'checks':checks,'all_checks':all(checks.values()),'actual_quote':quote,'actual_virtual_quote':vq,'independent_formula_virtual_quote':formula,'no_sync_virtual_quote':plain,'denominator':den}
 baseline=[R/'work/parallel-main-integration/round45-captured-full.json.gz',R/'work/parallel-main-integration/round45-captured-additional.json.gz',R/'work/parallel-main-positive-sync-fixtures/RESULT01.json.gz',R/'work/parallel-main-v2-positive-sync-fixtures/RESULT01.json.gz']
 index,index_counts=retained_index(baseline,str(GLOBAL));rows=[]
 original=R/'evidence/original/pump/deployed.so'
 for c in plan['cases']:
  o=run(original,c);n=run(a.candidate,c)
  assert o['full_before']==n['full_before']and o['clock']==n['clock']and o['transaction_base64']==n['transaction_base64']
  dif=[k for k in['error','accounts','inner','events','return_data']if o[k]!=n[k]]
  if log_oracle.scope(log_oracle.norm(o['logs']))!=log_oracle.scope(log_oracle.norm(n['logs'])):dif.append('ordered_logs')
  e=expected(c,o);nov=novelty(o,index,str(GLOBAL),f)
  index.setdefault(o['transaction_base64'],[]).append({'before':{k:account_fingerprint(v)for k,v in o['full_before'].items()},'clock':o['clock'],'readonly_global_after':account_fingerprint(o['accounts'].get(str(GLOBAL)))})
  rows.append({'case':c,'original':o,'candidate':n,'different_fields':dif,'expected_from_original_state':e,'novelty':nov})
  print({'case':c['name'],'original_error':o['error'],'different_fields':dif,'expected':e,'novelty':nov},flush=True)
 distinct=sum(x['novelty']['status']=='distinct'for x in rows)
 report={'scope':__doc__,'case_count':len(rows),'cases':rows,'candidate_sha256':sha(a.candidate),'original_sha256':sha(original),'plan_sha256':PLAN_SHA,'script_sha256':sha(Path(__file__)),'dedup_baselines':index_counts,'new_distinct_case_count':distinct if all(x['novelty']['status']!='unknown'for x in rows)else None,'mismatches':[i for i,x in enumerate(rows)if x['different_fields']],'not_as_expected':[i for i,x in enumerate(rows)if not x['expected_from_original_state'].get('all_checks')],'constraints':['Six root-reviewed definitions; no owner, executable, authority, base-token-balance or mint-supply mutation.','Local captured programs and ordinary signatures; no network/RPC.','All original/candidate transaction, Clock and complete non-target prestates equal.','Readonly Global conservation is used only to distinguish colliding old transaction bytes when the retained prestate is absent.']}
 a.output.write_bytes(gzip.compress(dump(report),compresslevel=1,mtime=0));print({k:report[k]for k in['case_count','new_distinct_case_count','mismatches','not_as_expected']},flush=True)
if __name__=='__main__':main()
