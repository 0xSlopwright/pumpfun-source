#!/usr/bin/env python3
"""Offline legacy sell recovery: normally signed synthetic transactions, captured dependencies."""
import argparse,base64,hashlib,json,struct,gzip
import sys
sys.path.insert(0,'/workspace/pumpfun-source-latest/scripts')
import pump_trade_fixture as f
R=f.R;P=f.Pubkey.from_string(f.x['program']);USER=f.Keypair.from_seed(bytes([231])*32)
INITIAL={k:f.vm.get_account(k) for k in f.msg.account_keys}
CURVE=f.Pubkey.from_string(f.x['accounts']['curve']);GLOBAL=f.Pubkey.from_string(f.x['accounts']['global']);FEE=f.Pubkey.from_string(f.x['accounts']['fee_config'])
IDL=json.loads((R/'evidence/upstream/pump.json').read_text());IX=next(i for i in IDL['instructions'] if i['name']=='sell')
def run(c,binary=None):
 vm=f.LiteSVM().with_transaction_history(0)
 for name in ['pump','pump_fees']:
  cap=json.loads((R/f'evidence/original/{name}/capture.json').read_text());vm.add_program_from_file(f.Pubkey.from_string(cap['program']),binary if name=='pump' and binary else R/f'evidence/original/{name}/deployed.so')
 for name in ['spl_token','spl_token_2022','associated_token']:
  cap=json.loads((R/f'evidence/dependencies/{name}/capture.json').read_text());vm.add_program_from_file(f.Pubkey.from_string(cap['program']),R/f'evidence/dependencies/{name}/deployed.so')
 for k,a in INITIAL.items():
  if a is not None and not a.executable:vm.set_account(k,a)
 data=bytearray(INITIAL[CURVE].data)
 for off,val in c.get('curve_bytes',[]):data[off]=val
 for off,val in c.get('curve_u64',[]):struct.pack_into('<Q',data,off,val)
 vm.set_account(CURVE,f.Account(INITIAL[CURVE].lamports,bytes(data),P))
 creator=f.Pubkey(data[49:81]);vault=f.Pubkey.find_program_address([b'creator-vault',bytes(creator)],P)[0]
 recipient=f.Pubkey(INITIAL[GLOBAL].data[(483 if c.get('reserved') else 41):(515 if c.get('reserved') else 73)]);v3=f.ixs[-1].accounts
 keys={'user_volume_accumulator':v3[11].pubkey,'global':GLOBAL,'fee_recipient':recipient,'mint':v3[1].pubkey,'bonding_curve':CURVE,'associated_bonding_curve':v3[6].pubkey,'associated_user':v3[9].pubkey,'user':USER.pubkey(),'system_program':f.Pubkey.default(),'creator_vault':vault,'token_program':v3[3].pubkey,'event_authority':f.Pubkey.find_program_address([b'__event_authority'],P)[0],'program':P,'fee_config':FEE,'fee_program':f.Pubkey.from_string('pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ')}
 if c.get('legacy_token'):
  token=f.Pubkey.from_string('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');keys['token_program']=token
  for name in ['mint','associated_bonding_curve','associated_user']:
   key=keys[name];ac=vm.get_account(key);d=ac.data[:82 if name=='mint' else 165]
   if name=='associated_bonding_curve':keys[name]=f.Pubkey.find_program_address([bytes(CURVE),bytes(token),bytes(keys['mint'])],f.Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'))[0]
   vm.set_account(keys[name],f.Account(ac.lamports,d,token))
 for name,spec in c.get('account_mutations',{}).items():
  key=keys[name];a=vm.get_account(key);d=bytearray(a.data)
  for off,val in spec.get('bytes',[]):d[off]=val
  for off,val in spec.get('u64',[]):struct.pack_into('<Q',d,off,val)
  d=d[:spec.get('length',len(d))]
  vm.set_account(key,f.Account(spec.get('lamports',a.lamports),bytes(d),f.Pubkey.default() if spec.get('system_owner') else a.owner))
 if 'recipient_slot' in c:
  gd=vm.get_account(GLOBAL).data;off=162+c['recipient_slot']*32;recipient=f.Pubkey(gd[off:off+32]);keys['fee_recipient']=recipient
 for k in [recipient,vault]:
  if vm.get_account(k) is None:vm.set_account(k,f.Account(10**7,b'',f.Pubkey.default()))
 metas=[f.AccountMeta(keys[a['name']],a.get('signer',False),a.get('writable',False)) for a in IX['accounts']]
 if c.get('cashback_account'):
  metas.append(f.AccountMeta(v3[11].pubkey,False,True))
 if c.get('remaining',True):
  v2=f.Pubkey.find_program_address([b'bonding-curve-v2',bytes(keys['mint'])],P)[0]
  vm.set_account(v2,f.Account(10**7,bytes(data)[:c.get('v2_len',len(data))],f.Pubkey.default() if c.get('v2_system') else P))
  metas.append(f.AccountMeta(v2,False,False))
  if not c.get('omit_buyback'):metas.append(f.AccountMeta(v3[13].pubkey,False,True))
 for name in c.get('wrong_keys',[]):
  idx=next(i for i,a in enumerate(IX['accounts']) if a['name']==name);old=metas[idx];key=f.Pubkey(bytes([77+idx])*32);ac=vm.get_account(old.pubkey)
  if ac is not None:vm.set_account(key,f.Account(10**7,ac.data,ac.owner,ac.executable) if ac.executable else ac)
  metas[idx]=f.AccountMeta(key,old.is_signer,old.is_writable)
 for name in c.get('readonly',[]):
  i=next(i for i,a in enumerate(IX['accounts']) if a['name']==name);metas[i]=f.AccountMeta(metas[i].pubkey,metas[i].is_signer,False)
 trade=f.Instruction(P,bytes(IX['discriminator'])+struct.pack('<QQ',c.get('amount',500000000),c.get('minimum',0)),metas)
 tx=f.Transaction.new_signed_with_payer([*f.ixs[:-1],trade],USER.pubkey(),[USER],vm.latest_blockhash());tx.verify()
 before={str(k):vm.get_account(k) for k in tx.message.account_keys if k!=P};res=vm.send_transaction(tx);failed=isinstance(res,f.FailedTransactionMetadata);meta=res.meta() if failed else res
 def snap(a):return None if a is None else {'lamports':a.lamports,'owner':str(a.owner),'data':None if a.executable else base64.b64encode(a.data).decode(),'executable':a.executable}
 return {'error':str(res.err()) if failed else None,'accounts':{str(k):snap(vm.get_account(k)) for k in tx.message.account_keys if k!=P},'before':{k:snap(v) for k,v in before.items()},'events':[l[14:] for l in meta.logs() if l.startswith('Program data: ')],'return_data':json.loads(meta.to_json()).get('return_data'),'inner':json.loads(meta.to_json())['inner_instructions'],'logs':meta.logs(),'transaction_base64':base64.b64encode(bytes(tx)).decode(),'signatures_verified':True}
def cases():
 base={'curve_bytes':[[82,1]],'cashback_account':True}
 out=[{**base,'name':'cashback-valid'}, {**base,'name':'cashback-legacy-token','legacy_token':True}]
 for length in [0,1,7,8,39,40,41,73,74,81,82,89,105,121,129,137]:
  out.append({**base,'name':f'cashback-length-{length}','account_mutations':{'user_volume_accumulator':{'length':length}}})
 for name,mutation in [('system-owner',{'system_owner':True}),('bad-discriminator',{'bytes':[[0,0]]}),('bad-needs-claim',{'bytes':[[40,2]]}),('bad-has-claimed',{'bytes':[[73,2]]}),('zero-user',{'bytes':[[i,0] for i in range(8,40)]}),('cashback-overflow',{'u64':[[74,2**64-1]]}),('lamport-overflow',{'lamports':2**64-1})]:
  out.append({**base,'name':'cashback-'+name,'account_mutations':{'user_volume_accumulator':mutation}})
 return out

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--candidate',type=f.pathlib.Path);ap.add_argument('--output',type=f.pathlib.Path,required=True);args=ap.parse_args();rows=[]
 for c in cases():
  o=run(c);r={'case':c,'original':o}
  if args.candidate:
   b=run(c,args.candidate);diff=[k for k in ['error','accounts','events','inner','return_data'] if o[k]!=b[k]];r.update(candidate=b,different_fields=diff,match=not diff)
  rows.append(r)
 d={'scope':'Normally signed synthetic legacy sell cashback accumulator constructor and payment boundaries; original fixture dependencies retained; full binary identity unproven.','original_sha256':hashlib.sha256((R/'evidence/original/pump/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(args.candidate.read_bytes()).hexdigest() if args.candidate else None,'harness_sha256':hashlib.sha256(f.pathlib.Path(__file__).read_bytes()).hexdigest(),'cases':rows,'case_count':len(rows),'mismatches':[i for i,r in enumerate(rows) if r.get('match') is False]};args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(d,indent=2)+'\n');print([(r['case']['name'],r['original']['error'],r.get('different_fields')) for r in rows])
 if d['mismatches']:raise SystemExit(1)
if __name__=='__main__':main()
