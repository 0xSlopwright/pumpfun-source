"""Finite source/fixture/wire custody adapted from merged PR896.
Adds the two V3 accumulator-copy states; imports no producer, compiler or VM.
"""
if not __debug__:
    raise SystemExit('Run without -O')
import base64,gzip,hashlib,json,struct
from solders.pubkey import Pubkey
from solders.transaction import Transaction
def need(ok,message):
    if not ok:raise AssertionError(message)
def sha(b):return hashlib.sha256(b).hexdigest()
def canonical(value):return json.dumps(value,sort_keys=True,separators=(',',':')).encode()

def source_parent(inputs):
    # Independently derived from all 66 files in D037's sealed, actual cold
    # compiled workspace (ef50bb52...); archive container bytes need not match.
    need(sha(canonical(inputs['parent']))=='ffec01de903f07b258b2f62263a0785ed3cd03bf329386d5a782ec0d58b9f8aa','selected D037 66-input source parent')

def definitions(fixture):
    initial=base64.b64decode(fixture['steps'][4]['before']['curve']['data_base64']);rin,rout=struct.unpack_from('<QQ',initial,8)
    half=2**63
    base=dict(operation='buy_v3',reserve_in=2,reserve_out=half-1,amount=2,max_cost=2**64-1,real_base=1,real_quote=0,base_vault_amount=3,token_quote=True,replace=13,quote_fees=[10000,0,10000],fees=[10000,0,10000],mutation='creator_zero',user_lamports=10**16)
    six=[dict(base,label='combined_buyback_overflow'),dict(base,label='combined_buyback_nearby',reserve_out=half-2),dict(base,label='first_cost_overflow',quote_fees=[10000,0,0],fees=[10000,0,0]),dict(base,label='cost_sum_overflow',quote_fees=[0,0,0],fees=[0,0,0]),dict(base,label='finite_cost',reserve_out=99,amount=2),dict(base,label='non_crossing',reserve_out=99,amount=1)]
    twenty=[]
    for op in ['buy_v3','buy_exact_quote_in_v3','sell_v3']:
        for bps in [0,5000,10000,10001,2**64-1]:
            twenty.append(dict(reserve_in=rin,reserve_out=rout,name=f'{op}-noncrossing-bps-{bps}',operation=op,fees=[95,30,bps],amount=10**11 if op=='buy_v3'else 10**9 if op=='buy_exact_quote_in_v3'else 500000000,max_cost=10**15 if op=='buy_v3'else 1 if op=='buy_exact_quote_in_v3'else 0,real_base=10**14,base_vault_amount=10**14,user_lamports=10**16))
    for op in ['buy_v3','buy_exact_quote_in_v3','sell_v3']:
        twenty.append(dict(reserve_in=rin,reserve_out=rout,name=f'{op}-mayhem-max-bps',operation=op,fees=[95,30,2**64-1],flags=[81],amount=10**11 if op=='buy_v3'else 10**9 if op=='buy_exact_quote_in_v3'else 500000000,max_cost=10**15 if op=='buy_v3'else 1 if op=='buy_exact_quote_in_v3'else 0,real_base=10**14,base_vault_amount=10**14,user_lamports=10**16))
    for bps in [0,5000]:
        twenty.append(dict(reserve_in=rin,reserve_out=rout,name=f'exact-quote-post-complete-control-bps-{bps}',operation='buy_exact_quote_in_v3',fees=[95,30,bps],amount=10**11,max_cost=1,real_base=1000000,base_vault_amount=10**12,user_lamports=10**16))
    base=dict(operation='buy_v3',reserve_in=rin,reserve_out=rout,fees=[95,30,0],amount=10**11,max_cost=10**15,real_base=10**14,base_vault_amount=10**14,user_lamports=10**16)
    copy=[dict(base,label='zero_user_initializes',initial_user='zero'),dict(base,label='existing_user_preserved',initial_user='signer')]
    return six,twenty,copy

def instruction(message,ix):
    h=message.header;keys=message.account_keys
    def privilege(i):
        sign=i<h.num_required_signatures
        writable=i<h.num_required_signatures-h.num_readonly_signed_accounts if sign else i<len(keys)-h.num_readonly_unsigned_accounts
        return sign,writable
    return keys[ix.program_id_index],bytes(ix.data),[(keys[i],*privilege(i))for i in ix.accounts]

def check_wire(result,case,fixture):
    original=Transaction.from_bytes(base64.b64decode(fixture['steps'][4]['transaction_base64']))
    seed=[instruction(original.message,ix)for ix in original.message.instructions]
    program=Pubkey.from_string(fixture['program']);metas=list(seed[-1][2]);expected_seed_keys=set(map(str,original.message.account_keys))
    curve=Pubkey.from_string(fixture['accounts']['curve'])
    if case.get('token_quote'):
        quote=Pubkey.from_string('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');token=Pubkey.from_string('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');ata=Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')
        address=lambda owner:Pubkey.find_program_address([bytes(owner),bytes(token),bytes(quote)],ata)[0]
        user=Pubkey.from_string(fixture['accounts']['user']);ba=address(metas[13][0]);metas[2]=(quote,False,False);metas[4]=(token,False,False);metas[7]=(address(curve),False,True);metas[10]=(address(user),False,True);metas[case['replace']]=(ba,False,True)
    trailing=bytes(case.get('trailing',[0]if case['operation']=='buy_v3'else[]))
    payload=hashlib.sha256(('global:'+case['operation']).encode()).digest()[:8]+struct.pack('<QQ',case['amount'],case['max_cost'])+trailing
    wire=base64.b64decode(result['transaction_base64'],validate=True);tx=Transaction.from_bytes(wire);need(bytes(tx)==wire,'canonical signed wire')
    msg=tx.message;need(len(msg.instructions)==len(seed),'fixture instruction count')
    actual=[instruction(msg,ix)for ix in msg.instructions]
    need([(p,d,[(k)for k,s,w in mm])for p,d,mm in actual[:-1]]==[(p,d,[k for k,s,w in mm])for p,d,mm in seed[:-1]],'fixture leading instructions')
    p,data,accounts=actual[-1];need(p==program and data==payload,'fixture signed operation/amount/limit/trailing')
    need([k for k,s,w in accounts]==[k for k,s,w in metas],'fixture signed account roles/order')
    payer=Pubkey.from_string(fixture['accounts']['user']);need(msg.account_keys[0]==payer,'fixture signed payer')
    expected={str(payer):(True,True)}
    for p,d,mm in [*seed[:-1],(program,payload,metas)]:
        expected.setdefault(str(p),(False,False))
        for k,s,w in mm:
            a,b=expected.get(str(k),(False,False));expected[str(k)]=(a or s,b or w)
    need(len(set(msg.account_keys))==len(msg.account_keys)and set(map(str,msg.account_keys))==set(expected),'fixture exact signed key membership')
    h=msg.header
    for i,key in enumerate(msg.account_keys):
        sign=i<h.num_required_signatures;writable=i<h.num_required_signatures-h.num_readonly_signed_accounts if sign else i<len(msg.account_keys)-h.num_readonly_unsigned_accounts
        need((sign,writable)==expected[str(key)],'fixture signed effective privileges')
    expected_state=(expected_seed_keys|{str(k)for k,s,w in metas})-{str(program)}
    need(set(result['accounts'])==expected_state,'fixture watched state membership')
    return set(map(str,msg.account_keys))

def state_inputs(case,fixture):
    before=fixture['steps'][4]['before'];accounts=fixture['accounts'];curve=bytearray(base64.b64decode(before['curve']['data_base64']));struct.pack_into('<QQ',curve,8,case['reserve_in'],case['reserve_out']);struct.pack_into('<Q',curve,115,case.get('creator_override',0));struct.pack_into('<Q',curve,24,case['real_base'])
    if 'real_quote'in case:struct.pack_into('<Q',curve,32,case['real_quote'])
    for off in case.get('flags',[]):curve[off]=1
    if case.get('mutation')=='creator_zero':curve[49:81]=bytes(32)
    g=bytearray(base64.b64decode(before['global']['data_base64']));fee=base64.b64decode(before['fee_config']['data_base64']);pb,cb,bb=case['fees'];fees=struct.pack('<QQQ',0,pb,cb);encoded=fee[:41]+fees+struct.pack('<I',1)+bytes(16)+fees+struct.pack('<I',0)+fees;struct.pack_into('<Q',g,997,bb)
    if case.get('token_quote'):
        quote=Pubkey.from_string('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');curve[83:115]=bytes(quote);pb,cb,bb=case['quote_fees'];normal=struct.pack('<QQQ',0,95,30);stable=struct.pack('<QQQ',0,pb,cb);encoded=fee[:41]+normal+struct.pack('<I',1)+bytes(16)+normal+struct.pack('<I',1)+bytes(16)+stable+normal;struct.pack_into('<Q',g,997,bb)
    base_vault=bytearray(base64.b64decode(before['curve_base']['data_base64']));struct.pack_into('<Q',base_vault,64,case['base_vault_amount'])
    state={accounts['curve']:bytes(curve),accounts['global']:bytes(g),accounts['fee_config']:encoded.ljust(len(fee),b'\0'),accounts['curve_base']:bytes(base_vault)}
    if 'initial_user' in case:
        volume=bytearray(base64.b64decode(before['volume']['data_base64']))
        volume[8:40]=bytes(32) if case['initial_user']=='zero' else bytes(Pubkey.from_string(accounts['user']))
        state[accounts['volume']]=bytes(volume)
    return state

def verify(packet,repo,images,read,doc):
    fixed_inputs={'runtime/inputs/focused_costs_portable.py': 'd8caef66f92d827f424b91e69dde31af2b6a05ad2126955f90539fd0a83d649b', 'runtime/inputs/research/pump-shared-buyback-panic-20261028/runtime/producer.py': '5b906b4049deab0bd786bb17f5d0bc9ec0b64885b7d17590300bff1adc1cb695', 'runtime/executed-scripts/pump_trade_fixture.py': '9ee647c928070734fe700929b87d4016f76ec244c873e6f484318b5212aea1e1', 'runtime/executed-scripts/pump_v3_configured_fee_differential.py': '1c8af93c3d24d0c497b551391b0144f043d604766d9b12810f7c0b4a229c3b22', 'runtime/executed-scripts/pump_captured_loader.py': '8d51ba5feab9e74f67fb80f5827222308d45a36022151bc77ad076c401f65067', 'runtime/executed-scripts/pump_with_captured_loader.py': '4eb9d65c8e54b39b2e991f1cff6068a28bd2d5c1a33601225d3608eb5e82863e', 'controllers/local_build.py': '771d9295ee6e8997546b2f0cde677213f23d9d31528a6df33293b9a284911eea', 'controllers/pump_physical_source_wrapper.py': 'd959fe0074fafe7f310a8f40051ce87f795b1e81b104a38dfe57086efa6bae1b'}
    fixed_inputs.update({'runtime/inputs/focused_execute_key.py':'db22c99a7908138a2dd7e4c1424e7bb3067ebd56801cbe4d5bfe05eaedc34e74','controllers/run_runtime_verified.py':'7fcf1c9bb271108bdea9d9039c02bdae6edbc2c4a1254ca58220f734181638f0'})
    for name,digest in fixed_inputs.items():need(sha((packet/name).read_bytes())==digest,"authenticated source-owned input "+name)
    fixture_raw=read(packet/'runtime/fixture-input.json.gz');need(sha(fixture_raw)=='54d69dd4f11a61cc6cea3076e3e89fd4aa31ea6ff835f8ea316646a7b1642920','source-owned fixture input');fixture=json.loads(fixture_raw);need((repo/'research/imported-lab/analysis/pump_fun/curve-fresh-trades-v3-signed-surfpool.json').read_bytes()==fixture_raw,'repository fixture agrees')
    six=doc(packet/'runtime/costs-six.json.gz');twenty=doc(packet/'runtime/costs20.json.gz');expected=definitions(fixture)
    copy=doc(packet/'runtime/copy-two.json.gz')
    for family,value,cases in [('copy',copy,expected[2]),('six',six,expected[0]),('twenty',twenty,expected[1])]:
        need([r['case']for r in value['cases']]==cases,'exact source-owned '+family+' case definitions')
        for row,case in zip(value['cases'],cases):
            runs=row['runs']if family in ('six','copy')else{k:row[k]for k in ['original','control','candidate']}
            for name,result in runs.items():
                keys=check_wire(result,case,fixture)
                if family in ('six','copy'):
                    observation=row['observations'][name];need(set(observation['before'])==set(observation['after'])==keys,'focused snapshot signed-key membership')
                    for key,data in state_inputs(case,fixture).items():need(observation['before'][key]['data_sha256']==sha(data),'focused actual fixture prestate')
                    roles=[('user',case['user_lamports']),*[(role,fixture['steps'][4]['before'][role]['lamports'])for role in ['curve','global','fee_config','curve_base']]]
                    if family=='copy':roles.append(('volume',fixture['steps'][4]['before']['volume']['lamports']))
                    for role,lamports in roles:
                        declared=observation['before'][fixture['accounts'][role]];owned=fixture['steps'][4]['before'][role]
                        need(declared['lamports']==lamports and declared['owner']==owned['owner'] and declared['executable']is False and declared['rent_epoch']==0,'focused source-owned '+role+' account metadata')
                    need(observation['before'][fixture['accounts']['user']]['data_sha256']==sha(base64.b64decode(fixture['steps'][4]['before']['user']['data_base64'])),'focused source-owned user data')
                    for key,after in observation['after'].items():
                        if after is not None and key in result['accounts']:
                            actual=result['accounts'][key];need(all(actual[k]==after[k]for k in ['lamports','owner','data_sha256']),'focused observation/result state join')
                elif result['error']is not None:
                    for key,data in state_inputs(case,fixture).items():need(result['accounts'][key]['data_hex']==data.hex(),'failed fixture rollback/source prestate')
    execution=doc(packet/'runtime/execution.json');need(execution['pinned_input_commit']=='49d07973846893ac42df69ef9008a54b17f5b5bd'and all(execution['inputs_unchanged'].values())and [r['name']for r in execution['results']]==['copy','six','twenty']and all(r['returncode']==0 for r in execution['results']),'actual runtime launch success/input custody')
    local={
        'run_runtime_verified.py':'controllers/run_runtime_verified.py','focused_execute_key.py':'runtime/inputs/focused_execute_key.py','focused_costs_portable.py':'runtime/inputs/focused_costs_portable.py','producer.py':'runtime/inputs/research/pump-shared-buyback-panic-20261028/runtime/producer.py','pump_v3_configured_fee_differential.py':'runtime/executed-scripts/pump_v3_configured_fee_differential.py','pump_trade_fixture.py':'runtime/executed-scripts/pump_trade_fixture.py','pump_captured_loader.py':'runtime/executed-scripts/pump_captured_loader.py','pump_with_captured_loader.py':'runtime/executed-scripts/pump_with_captured_loader.py','curve-fresh-trades-v3-signed-surfpool.json':'runtime/fixture-input.json.gz','UPSTREAM-INPUTS.json':'runtime/inputs/UPSTREAM-INPUTS.json','PATH-ADAPTER.json':'runtime/inputs/PATH-ADAPTER.json','PREPARATION.json':'runtime/inputs/PREPARATION.json'}
    checked=0
    for name,pin in execution['inputs'].items():
        if '/evidence/'in name:raw=(repo/'evidence'/name.split('/evidence/',1)[1]).read_bytes()
        elif name.endswith('/costs-parent/candidate.so'):raw=images['parent']['candidate']
        elif name.endswith('/execute-key-slice/candidate.so'):raw=images['candidate']['candidate']
        else:need(name.rsplit('/',1)[-1]in local,'unmapped runtime input');raw=read(packet/local[name.rsplit('/',1)[-1]])
        need(sha(raw)==pin['sha256']and len(raw)==pin['bytes'],'actual runtime input bytes '+name.rsplit('/',1)[-1]);checked+=1
    need(checked==26 and set(execution['inputs_unchanged'])==set(execution['inputs']),'exact runtime input consumption')
    expected_outputs={'costs20.json.gz','copy-two.json.gz','costs20-loader.json','costs-six.json.gz'}|{f'{n}.{k}.log'for n in ['copy','six','twenty']for k in ['stdout','stderr']}
    need(set(execution['output_files'])==expected_outputs,'runtime output membership')
    for name in expected_outputs:
        raw=(packet/'runtime'/name).read_bytes();need(execution['output_files'][name]==dict(sha256=sha(raw),bytes=len(raw)),'actual runtime output receipt join')
    return dict(source_owned_fixture_cases=28,signed_layouts_checked=84,actual_runtime_inputs_checked=checked,output_files_checked=10,new_VM_or_compiler_runs=0)
