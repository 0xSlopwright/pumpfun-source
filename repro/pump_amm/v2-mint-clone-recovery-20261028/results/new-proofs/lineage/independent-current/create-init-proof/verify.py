"""Focused immutable original/candidate store/init proof; no target execution."""
from pathlib import Path
import base64,gzip,hashlib,json,re,struct,sys
from solders.transaction import Transaction

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def norm(r):
 q=dict(r);q['logs']=[re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',v)for v in r['logs']if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',v)];return q

def verify(root=None):
 w=Path(root or Path(__file__).parent);manifest=load(w/'manifest.json')['files'];assert manifest=={str(p.relative_to(w)):sha(p)for p in w.rglob('*')if p.is_file()and p!=w/'manifest.json'}
 sys.path.insert(0,str(w));from elf_reader import Elf
 o,c,s=map(Elf,[w/'original.so',w/'candidate.so',w/'symbols.so']);assert sha(o.path)=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7';assert sha(c.path)=='4fb73d3c0303e1f065e6356d32e86ba7341f75b27b861571cd8b8c586e46af98'
 ins=lambda e,a:struct.unpack_from('<BBhi',e.b,a)
 fn=next(f for f in s.funcs if '11create_pool7execute17'in f['name']);assert fn['size']==10152
 # Literal original branch operands, not text-disassembler targets.
 branches=[(0x2cb18,0x15,6,0,0x2d858),(0x2cb30,0x55,2,0,0x2cb50),(0x2cb40,0x55,1,0,0x2cb50),(0x2cb48,0x05,0,0,0x2d8e0),(0x2d8f0,0x25,0,99,0x2d928)]
 for a,op,reg,imm,target in branches:
  x=ins(o,a);assert(x[0],x[1],x[3])==(op,reg,imm)and a+8+x[2]*8==target
 original_stores=[(0x2c0f8,0x72,0x11b),(0x2c330,0x72,0x11c),(0x2c910,0x73,0x11a),(0x2c928,0x6b,0x118),(0x2c940,0x7b,0x20),(0x2cb00,0x7b,0xf8),(0x2d870,0x7b,0xe0),(0x2d8a0,0x7b,0xc8),(0x2d8b8,0x7b,0x100),(0x2d8d0,0x73,0x11d),(0x2d8e8,0x73,0x11e)]
 for a,op,off in original_stores:assert ins(o,a)[0]==op and ins(o,a)[2]==off
 # Current corresponding direct stores remain separated around validation.
 current_stores=[(1640,0x72,0x11b),(2208,0x72,0x11c),(6152,0x73,0x11a),(6176,0x6b,0x118),(6200,0x7b,0x20),(6736,0x7b,0xf8),(7576,0x7b,0xe0),(7624,0x7b,0xc8),(7648,0x7b,0x100),(7664,0x73,0x11d),(7688,0x73,0x11e)]
 for a,op,off in current_stores:assert ins(c,fn['start']+a)[0]==op and ins(c,fn['start']+a)[2]==off
 x=ins(c,0x48cc8);assert x==(0x55,6,16,0)and 0x48cc8+8+x[2]*8==0x48d50
 assert 0x48cc8<0x48ce8<0x48d30<0x48d40<0x48d50<0x48d58
 source=(w/'create_pool.rs').read_text();state=(w/'state.rs').read_text();assert '#[account(init,payer=creator,space=287,'in source
 declaration=source[source.index('pub struct CreatePool'):source.index('pub global_config')];assert 'init_if_needed'not in declaration
 start=source.index('a.pool.pool_bump =');guard=source.index('(creator_fee == 0 && !can_edit) || canonical');coin=source.index('if canonical {\n        a.pool.coin_creator = coin_creator;');fee=source.index('a.pool.creator_fee_bps = creator_fee;');minimum=source.index('liquidity.checked_sub(100)');assert start<guard<coin<fee<minimum
 block=source[coin:source.index('a.pool.is_holder_reward')];assert 'a.pool.creator_fee_bps = creator_fee;'in block and 'a.pool.can_edit_creator_fee = can_edit;'in block and block.rstrip().endswith('}')
 assert 'if canonical {\n            crate::utils::token::supported_mint' in source
 assert 'try_deserialize_unchecked' in state and 'else { read_pool_279(buf) }' in state
 decoder=state[state.index('fn read_pool_279'):state.index('impl AccountSerialize for Pool')]
 expected=[('pool_bump',1),('index',2),('creator',32),('base_mint',32),('quote_mint',32),('lp_mint',32),('pool_base_token_account',32),('pool_quote_token_account',32),('lp_supply',8),('coin_creator',32),('is_mayhem_mode',1),('is_cashback_coin',1),('virtual_quote_reserves',16),('creator_fee_bps',8),('can_edit_creator_fee',1),('is_holder_reward',1),('protocol_fees',8),('creator_fees',8)]
 parsed=re.findall(r'^        (\w+): .*::deserialize\(buf\)\?,',decoder,re.M);assert parsed==[v[0]for v in expected]
 off=8;layout={}
 for name,n in expected:layout[name]=[off,off+n];off+=n
 assert off==287
 # These external macro sources support init/unchecked interpretation, not historical provenance.
 provider=(w/'provider/constraints.rs').read_text();account=(w/'provider/account.rs').read_text()
 assert 'if !#if_needed || actual_owner == &anchor_lang::solana_program::system_program::ID' in provider
 assert provider.index('#create_account\n\n                        // Convert')<provider.index('#from_account_info_unchecked\n                    } else')
 assert 'system_program::allocate(cpi_context.with_signer' in provider and 'system_program::create_account(cpi_context.with_signer' in provider
 assert 'Ok(Account::new(info, T::try_deserialize_unchecked(&mut data)?))'in account
 # All original/candidate init parser bodies match, not just source descriptions.
 parser_matches=[]
 for f in s.funcs:
  if ('CreatePool' in f['name']and'try_accounts'in f['name'])or('state..Pool'in f['name']and'try_deserialize'in f['name']):
   matches=[a for a,z in zip(o.entries,o.entries[1:]+[o.hi])if z-a==f['size']and o.normalized[a:z]==c.normalized[f['start']:f['start']+f['size']]and o.pattern(a,z-a)==c.pattern(f['start'],f['size'])];assert len(matches)==1
   parser_matches.append({'name':f['name'],'original':hex(matches[0]),'candidate':hex(f['start']),'bytes':f['size']})
 assert len(parser_matches)==8
 r=load(w/'order60.json');obs=load(w/'order60-transactions.json.gz');assert r['case_count']==len(r['cases'])==60 and not r['mismatches']and obs['transaction_count']==len(obs['transactions'])==120 and r['producer_sha256']==obs['script_sha256']==sha(w/'probe_order.py')
 assert obs['observer_sha256']==sha(w/'runtime-inputs/repro/pump_amm/owner6048-v144/runtime/observe_suite.py')
 signatures=0
 for i,row in enumerate(r['cases']):
  assert not row['different_fields']and norm(row['original'])==norm(row['candidate'])
  pair=obs['transactions'][2*i:2*i+2];assert pair[0]['transaction_base64']==pair[1]['transaction_base64']
  for side,t,image in zip(['original','candidate'],pair,[sha(o.path),sha(c.path)]):
   raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);sig=tx.verify_with_results();assert sig and all(sig)and t['all_signatures_verified'];signatures+=len(sig)
   assert t['signature_count']==len(sig)and t['transaction_sha256']==hashlib.sha256(raw).hexdigest()and t['amm_program_sha256']==image and t['error']==row[side]['error']and t['logs_sha256']==hashlib.sha256(json.dumps(row[side]['logs'],separators=(',',':')).encode()).hexdigest()
   for pid,program in t['loaded_programs'].items():
    if pid=='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA':assert program['sha256']==image
    else:assert '/evidence/'in program['path']and sha(w/'runtime-inputs'/'evidence'/program['path'].split('/evidence/',1)[1])==program['sha256']
 existing=r['cases'][48:];assert len(existing)==12 and all(x['case'].startswith('existing-pool:')for x in existing)
 successes=[x for x in existing if x['original']['error']is None];assert len(successes)==2 and all(x['case'].startswith('existing-pool:11111111111111111111111111111111:0:')for x in successes)
 # Original successes and current successes expose every omitted field as zero in serialized output.
 ordinary=load(w/'create246.json');zeros=[]
 names=['coin_creator','is_mayhem_mode','is_cashback_coin','virtual_quote_reserves','protocol_fees','creator_fees']
 for row in ordinary['cases']:
  if row['original']['error']is not None:continue
  assert row['candidate']['error']is None
  for key,a in row['original']['states'].items():
   if a and a['owner']=='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'and len(bytes.fromhex(a['data']))==287:
    b=bytes.fromhex(a['data']);assert row['candidate']['states'][key]==a
    for name in names:x,y=layout[name];assert b[x:y]==bytes(y-x)
    zeros.append({'case':row['case'],'pool_data_sha256':hashlib.sha256(b).hexdigest()})
 assert len(zeros)==67 and signatures==120
 return {'passed':True,'candidate_sha256':sha(c.path),'original_sha256':sha(o.path),'manifest_sha256':sha(w/'manifest.json'),'init_parser_bodies_matched':parser_matches,'pool_serialized_layout':layout,'recognized_original_stores':len(original_stores),'recognized_candidate_stores':len(current_stores),'branch_targets':[{ 'pc':hex(a),'target':hex(t)}for a,_,_,_,t in branches],'full_order_cases':60,'signed_order_transactions':120,'existing_account_cases':12,'existing_rejections':10,'prefunded_system_zero_length_successes':2,'ordinary_original_zero_initializations':67,'zero_field_source':'Borsh reads from a freshly allocated zero buffer, not Rust Default','canonical_store_skip_restored':True,'candidate_noncanonical_skip':{'branch':'0x48cc8','target':'0x48d50','skipped':['coin_creator','creator_fee_bps','can_edit_creator_fee']},'residual':'Canonical-only writes now match the original decision to preserve zero values for noncanonical pools. Full CFG/body still differs; both complete handlers remain unmatched.','executes_vm_or_build':False,'scope':'Recognized stores and parser bodies plus bounded saved observations. No full handler, general CFG, transitive data or historical provenance identity.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
