from pathlib import Path
import hashlib,importlib.util,json

def H(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def module(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m

def verify(root):
 w=Path(root);E=module('h18_components_elf',w/'elf_reader.py').Elf;c=E(w/'build/artifacts/pump_amm_recovered.so');s=E(w/'build/artifacts/unstripped.so');rows=[]
 names={'boost':'18pump_amm_recovered18pump_amm_recovered18boost_buy_and_burn17','buyback':'12instructions5admin21update_buyback_config21update_buyback_config17','cashback':'18pump_amm_recovered18pump_amm_recovered14claim_cashback17'}
 for kind,needle in names.items():
  p=w/'isolated-components'/kind/'artifacts';b=E(p/'pump_amm_recovered.so');bs=E(p/'unstripped.so');f=next(f for f in s.funcs if needle in f['name']);g=next(f for f in bs.funcs if needle in f['name']);assert f['size']==g['size']and c.normalized[f['start']:f['start']+f['size']]==b.normalized[g['start']:g['start']+g['size']]and c.pattern(f['start'],f['size'])==b.pattern(g['start'],g['size'])
  fc,gc=c.callsites(f['start'],f['size']),b.callsites(g['start'],g['size']);assert [x['offset']for x in fc]==[x['offset']for x in gc]
  for x,y in zip(fc,gc):
   cf=next(v for v in s.funcs if v['start']==x['target']);bf=next(v for v in bs.funcs if v['start']==y['target']);assert cf['size']==bf['size']and c.normalized[cf['start']:cf['start']+cf['size']]==b.normalized[bf['start']:bf['start']+bf['size']]and c.pattern(cf['start'],cf['size'])==b.pattern(bf['start'],bf['size'])
  rows.append({'component':kind,'bytes':f['size'],'internal_calls':len(fc),'full_normalized_body_equal_to_isolated':True,'ordered_callees_equal_to_isolated':True,'isolated_candidate_sha256':H(p/'pump_amm_recovered.so')})
 # H17 CreatePool/init witness remains historical; require the exact current logic and source to retain it.
 prior=w/'create-init-proof';v=module('h17_init_reference',prior/'verify.py').verify(prior);assert v['candidate_sha256']=='4fb73d3c0303e1f065e6356d32e86ba7341f75b27b861571cd8b8c586e46af98'
 b=E(prior/'candidate.so');bs=E(prior/'symbols.so')
 for filename in ['create_pool.rs','state.rs']:
  target='programs/pump-amm/src/instructions/create_pool.rs'if filename=='create_pool.rs'else'programs/pump-amm/src/state.rs';assert(prior/filename).read_bytes()==(w/'source'/target).read_bytes()
 needles=['11create_pool7execute17','CreatePool$u20$as$u20$anchor_lang..Accounts$LT','state..Pool$u20$as$u20$anchor_lang..AccountDeserialize']
 preserved=0
 for bf in bs.funcs:
  if any(n in bf['name']for n in needles):
   cf=next(f for f in s.funcs if f['name']==bf['name']);assert cf['size']==bf['size']and c.normalized[cf['start']:cf['start']+cf['size']]==b.normalized[bf['start']:bf['start']+bf['size']]and c.pattern(cf['start'],cf['size'])==b.pattern(bf['start'],bf['size']);preserved+=1
 assert preserved==9
 return {'passed':True,'candidate_sha256':H(w/'build/artifacts/pump_amm_recovered.so'),'isolated_body_pairs':rows,'h17_init_reference_candidate':v['candidate_sha256'],'h17_create_and_parser_bodies_preserved':preserved,'h17_init_receipts_are_not_current_receipts':True,'current_create_order_checked_separately':True}
