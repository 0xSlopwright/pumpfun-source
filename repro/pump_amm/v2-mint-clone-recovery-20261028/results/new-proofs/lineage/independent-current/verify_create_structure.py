from pathlib import Path
import hashlib,importlib.util,json,struct
def H(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def verify(root):
 w=Path(root);E=module('create_structure_elf',w/'elf_reader.py').Elf;o=E(w/'input-root/evidence/original/pump_amm/deployed.so');c=E(w/'build/artifacts/pump_amm_recovered.so');s=E(w/'build/artifacts/unstripped.so')
 original_callee=0x73ef0;f=next(f for f in s.funcs if'14supported_mint'in f['name']);handler=next(f for f in s.funcs if'11create_pool7execute'in f['name'])
 assert f['size']==568 and o.normalized[original_callee:original_callee+568]==c.normalized[f['start']:f['start']+568]
 oc=[a for a,t in o.calls.items()if t==original_callee and 0x2b000<a<0x2e000];cc=[a for a,t in c.calls.items()if t==f['start']and handler['start']<=a<handler['start']+handler['size']]
 assert oc==[0x2c3b8,0x2c408,0x2d570]and len(cc)==3
 def policy(e,call):
  for at in range(call-8,call-129,-8):
   op,reg,off,imm=struct.unpack_from('<BBhi',e.b,at)
   if reg&15==2 and op in[0xb7,0xbf,0x79]:
    assert op==0xb7 and imm in[0,1],(hex(call),hex(at),op,imm)
    return imm
  raise AssertionError('missing policy')
 assert [policy(o,a)for a in oc]==[0,1,0]
 assert [policy(c,a)for a in cc]==[0,0,1]
 def first_policy_call(e,at,calls):
  for _ in range(12):
   if at in calls:return at
   op,reg,off,imm=struct.unpack_from('<BBhi',e.b,at)
   assert op not in[0x15,0x55,0x85],hex(at)
   at+=8+off*8 if op==0x05 else 16 if op==0x18 else 8
  raise AssertionError('missing policy branch call')
 branches=[(o,oc,0x2c3f0),(c,cc,cc[1]-24)]
 role_map=[]
 for image,calls,at in branches:
  op,reg,off,imm=struct.unpack_from('<BBhi',image.b,at);assert(op,imm)==(0x55,0)
  mismatch=first_policy_call(image,at+8+off*8,calls);canonical=first_policy_call(image,at+8,calls)
  assert policy(image,mismatch)==0 and policy(image,canonical)==1
  role_map.append({'canonical_branch':hex(at),'base_call':hex(calls[0]),'noncanonical_quote_call':hex(mismatch),'canonical_quote_call':hex(canonical)})
 known=[(0x2c0f8,0x72,0x11b),(0x2c330,0x72,0x11c),(0x2c910,0x73,0x11a),(0x2c928,0x6b,0x118),(0x2c940,0x7b,0x20),(0x2cb00,0x7b,0xf8),(0x2d870,0x7b,0xe0),(0x2d8a0,0x7b,0xc8),(0x2d8b8,0x7b,0x100),(0x2d8d0,0x73,0x11d),(0x2d8e8,0x73,0x11e)]
 for a,op,off in known:
  got=struct.unpack_from('<BBhi',o.b,a);assert got[0]==op and got[2]==off
 assert struct.unpack_from('<BBhi',o.b,0x2cb18)[0:1]==(0x15,)
 assert struct.unpack_from('<BBhi',o.b,0x2d8f0)[3]==99
 source=(w/'source/programs/pump-amm/src/instructions/create_pool.rs').read_text()
 assert '#[account(init,payer=creator,space=287,'in source and'a.pool.set_inner'not in source
 assert source.count('supported_mint(')==3
 ordered=['a.pool.pool_bump =','a.pool.index =','a.pool.creator =','a.pool.base_mint =','a.pool.quote_mint =','a.pool.lp_mint =','a.pool.pool_base_token_account =','a.pool.pool_quote_token_account =','a.pool.lp_supply =','(creator_fee == 0 && !can_edit) || canonical','a.pool.coin_creator =','a.pool.creator_fee_bps =','a.pool.can_edit_creator_fee =','a.pool.is_holder_reward =','let output = liquidity.checked_sub(100)']
 positions=[source.index(v)for v in ordered];assert positions==sorted(positions)
 assert source.index('a.pool.is_mayhem_mode = true;')<source.index('PumpAmmError::DisabledCreatePool')and source.index('a.pool.is_cashback_coin = true;')<source.index('PumpAmmError::DisabledCreatePool')
 for field in['virtual_quote_reserves','protocol_fees','creator_fees']:assert 'a.pool.'+field+' ='not in source
 return {'passed':True,'candidate_sha256':H(w/'build/artifacts/pump_amm_recovered.so'),'create_handler_bytes':handler['size'],'original_supported_mint_calls':[hex(a)for a in oc],'candidate_supported_mint_calls':[hex(a)for a in cc],'physical_policy_arguments':{'original':[0,1,0],'candidate':[0,0,1]},'policy_role_map':role_map,'logical_policies':{'base':0,'canonical_quote':1,'noncanonical_quote':0},'same_supported_mint_body':True,'original_store_witnesses':[{'address':hex(a),'opcode':hex(op),'pool_offset':hex(off)}for a,op,off in known],'ordered_pool_field_assignments':ordered,'aggregate_pool_replacement_absent':True,'scope':'Exact original instruction witnesses and current source order; source-to-object binding checked separately. No inferred statement about arbitrary pre-existing account acceptance.'}
if __name__=='__main__':print(json.dumps(verify(Path(__file__).parent),indent=2))
