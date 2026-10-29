from pathlib import Path
import hashlib,json,types
W=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(name):
 p=W/name;m=types.ModuleType(p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m
def qualify(root):
 scan=module('scan.py');E=scan.reader();o=E(Path(root)/'evidence/original/pump_amm/deployed.so');c=E(W/'baseline/pump_amm_recovered.so');s=E(W/'baseline/unstripped.so');fs={f['start']:f for f in s.funcs}
 assert sha(o.path)=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
 assert sha(c.path)=='3f6190cae0e52a583dacddef9f55bc8f1b512489744242e05e0ea3ed8b5d26e4'
 data=scan.scan(root,c.path,s.path)
 specs=[('CreatePoolEvent',0x2ba60,'instructions11create_pool7execute','instructions/create_pool.rs'),('InitBoostEvent',0x1ef90,'instructions5boost7execute','instructions/boost.rs'),('AdminCtoPoolEvent',0x14920,'14admin_cto_pool','creator_reassignment.rs'),('ExtendAccountEvent',0x2e720,'14extend_account','extend.rs'),('SellEvent',0x49b50,'4sell17h','legacy_sell.rs'),('BuyEvent',0x1fed8,'18boost_buy_and_burn','boost_burn.rs'),('BoostBuyAndBurnEvent',0x1fed8,'18boost_buy_and_burn','boost_burn.rs')]
 def row(event,origin,name):
  g=next(g for g in data if ('..'+event+'$u20$as$') in g['event_data_candidate']['name']);oh=next(r for r in g['original_handlers'] if r['function']['start']==origin);ch=next(r for r in g['candidate_handlers'] if name in r['function']['name']);a=oh['function']['start'];b=ch['function']['start'];n=oh['function']['size'];cn=ch['function']['size'];equal=n==cn and o.normalized[a:a+n]==c.normalized[b:b+cn] and o.pattern(a,n)==c.pattern(b,cn)
  def between(e,start,calls):return [{'offset':p-start,'target':t,**({'candidate_name':fs[t]['name']} if e is c else {})}for p,t in e.calls.items() if start+calls[0]['offset']<p<start+calls[1]['offset']]
  return {'event':event,'original':oh,'candidate':ch,'handler_body_equal':equal,'event_data_original':g['event_data_original'],'event_data_candidate':g['event_data_candidate'],'original_calls_between_serializations':between(o,a,oh['calls']),'candidate_calls_between_serializations':between(c,b,ch['calls'])}
 def eligible(r):
  a=[x['self_stack_offset']for x in r['original']['calls']];b=[x['self_stack_offset']for x in r['candidate']['calls']]
  return len(a)==len(b)==2 and None not in a+b and a[0]==a[1] and b[0]!=b[1] and not r['handler_body_equal']
 selected=[]
 for event,origin,name,path in specs:
  r=row(event,origin,name);r['source_path']='programs/pump-amm/src/'+path;assert eligible(r);selected.append(r)
 controls=[]
 for event,origin,name in [('CreateConfigEvent',0x16d88,'13create_config'),('UpdateFeeConfigEvent',0x1d8a0,'17update_fee_config'),('DepositEvent',0x2fb38,'7deposit'),('WithdrawEvent',0x32750,'8withdraw'),('BuyEvent',0x376b0,'3buy17h'),('SellEvent',0x56710,'12execute_sell'),('BuyEvent',0x53350,'11execute_buy17h'),('BuyEvent',0x54a20,'23execute_buy_exact_quote')]:
  r=row(event,origin,name);assert not eligible(r);controls.append(r)
 assert controls[0]['handler_body_equal'] and controls[1]['handler_body_equal']
 unknown=next(g for g in data if '..BuyEvent$' in g['event_data_candidate']['name']);mh=next(r for r in unknown['candidate_handlers'] if 'emit_event' in r['function']['name']);assert [x['self_stack_offset']for x in mh['calls']]==[None,None]
 # ABI caller-saved registers and LDDW writes must never retain a stack pointer.
 import struct
 def ins(op,rr=0,off=0,imm=0):return struct.pack('<BBhi',op,rr,off,imm)
 fixture=types.SimpleNamespace(b=ins(0xbf,0xa2)+ins(0x18,2)+bytes(8)+ins(0x85,0x10)+ins(0x95))
 st=scan.pointer_states(fixture,0,len(fixture.b));assert st[24][2] is None
 return {'selected':selected,'controls':controls,'unknown_pointer_control':mh,'negative_controls':{'already_matching_body_excluded':True,'already_shared_pointer_excluded':True,'unknown_pointer_excluded':True,'lddw_clobber_excluded':True},'all_event_data_groups':data,'scope':'Only seven sites with unique exact Event::data targets, conservative CFG-derived known self pointers, and unequal caller bodies. Unknown/inlined serialization sites and already matching bodies are not changed.'}
