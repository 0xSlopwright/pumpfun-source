from pathlib import Path
import hashlib,types
W=Path(__file__).resolve().parent
def verify(root,candidate,symbols):
 p=W/'scan.py';m=types.ModuleType('scan');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__)
 groups=m.scan(root,candidate,symbols)
 specs=[('CreatePoolEvent',0x2ba60,'instructions11create_pool7execute'),('InitBoostEvent',0x1ef90,'instructions5boost7execute'),('AdminCtoPoolEvent',0x14920,'14admin_cto_pool'),('ExtendAccountEvent',0x2e720,'14extend_account'),('SellEvent',0x49b50,'4sell17h'),('BuyEvent',0x1fed8,'18boost_buy_and_burn'),('BoostBuyAndBurnEvent',0x1fed8,'18boost_buy_and_burn'),('SweepPoolFeeEvent',0x59408,'sweep_fees7execute')]
 rows=[]
 for event,a,name in specs:
  g=next(g for g in groups if '..'+event+'$u20$as$'in g['event_data_candidate']['name']);o=next(x for x in g['original_handlers']if x['function']['start']==a);c=next(x for x in g['candidate_handlers']if name in x['function']['name']);op=[x['self_stack_offset']for x in o['calls']];cp=[x['self_stack_offset']for x in c['calls']];assert len(op)==len(cp)==2 and None not in op+cp and op[0]==op[1]and cp[0]==cp[1]
  rows.append({'event':event,'original':o,'candidate':c,'exact_original_event_data_target':g['event_data_original'],'exact_candidate_event_data_target':g['event_data_candidate']})
 return{'passed':True,'event_sites':8,'exact_event_data_target_pairs':8,'events':rows,'scope':'Actual direct Event::data calls and full matching target bodies, with conservative CFG propagation of self-stack-address registers. Eight current pairs reuse one event each; no complete handler identity claim.'}
