"""Read-only source/ABI and retained-original review; no compiler or VM."""
from pathlib import Path
import hashlib, json, re, struct, sys

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / 'scripts'))
from build_source_manifest import source_manifest
from pump_quote_control_function_match import sections
from pump_compare_function_bytes import body, normalize

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
stage = json.loads((HERE / 'STAGED01.json').read_text())
base, source = (ROOT / stage[k] for k in ('base_source', 'source'))
assert sha(HERE / 'STAGED01.json') == '84728c25e14c9851b6928da53667bd7beaa4033666b83d3b191eee47bc2a8f8b'
for path, digest in json.loads((HERE / 'MANIFEST01.json').read_text()).items():
    assert sha(HERE / path) == digest, path
def source_hashes(p):
    return {str((ROOT / n).relative_to(p)): h for n, h in source_manifest(p, p, ROOT).items()}
assert source_hashes(base) == stage['source_before']
assert source_hashes(source) == stage['source_after']
assert len(stage['source_after']) == 65
changed = [p for p, h in stage['source_after'].items() if stage['source_before'][p] != h]
assert set(changed) == {'src/migrate.rs', 'src/migrate_v2.rs'}

idl = json.loads((source / 'idls/pump_amm.json').read_text())
ix = next(i for i in idl['instructions'] if i['name'] == 'create_pool')
types = {t['name']: t['type'] for t in idl['types']}
assert ix['discriminator'] == [233, 146, 209, 142, 207, 104, 64, 188]
assert types['OptionBool'] == {'kind': 'struct', 'fields': ['bool']}
assert types['OptionU64'] == {'kind': 'struct', 'fields': ['u64']}
names = ['pool','global_config','creator','base_mint','quote_mint','lp_mint',
         'user_base_token_account','user_quote_token_account','user_pool_token_account',
         'pool_base_token_account','pool_quote_token_account','system_program',
         'token_2022_program','base_token_program','quote_token_program',
         'associated_token_program','event_authority','program']
assert [a['name'] for a in ix['accounts']] == names

def split_fields(s):
    out, start, depth = [], 0, 0
    for n, c in enumerate(s):
        depth += c in '({['
        depth -= c in ')}]'
        if c == ',' and depth == 0:
            out.append(s[start:n]); start = n + 1
    out.append(s[start:])
    return [x.strip() for x in out if x.strip()]

account_rows = []
callsite_review = []
for version, name in [(1, 'migrate.rs'), (2, 'migrate_v2.rs')]:
    old = (base / 'src' / name).read_text()
    new = (source / 'src' / name).read_text()
    old_begin = old.index(' let creator=a.bonding_curve.creator;')
    old_end = old.index(' if !mayhem &&', old_begin)
    new_begin = new.index(' create_pool(&ctx,base,')
    new_end = new.index(' if !mayhem &&', new_begin)
    append_at = new.index('\n// Original: standalone pool-creation helper')
    assert old[:old_begin] == new[:new_begin]
    assert old[old_end:] == new[new_end:append_at]
    assert new[new_begin:new_end] == ' create_pool(&ctx,base,\n  quote)?;\n'
    aliases = dict(re.findall(r'let (\w+)=(a\.\w+)\.to_account_info\(\);', old))
    aliases['base_tok'] = 'selected_base_token_program'
    new_struct = re.search(r'CreatePool\{(.*?)\},signer_seeds', new).group(1)
    current = dict(x.split(':', 1) for x in split_fields(new_struct))
    assert list(current) == names
    if version == 1:
        old_struct = re.search(r'CreatePool\{(.*?)\};', old).group(1)
        previous = {k: aliases[v.removesuffix('.clone()')] for k, v in (x.split(':',1) for x in split_fields(old_struct))}
        flags = [(a.get('signer', False), a.get('writable', False)) for a in ix['accounts']]
        assert 'pub token_program:Program<\'info,Token>' in old
        assert 'let base_tok=if mint.owner==tok.key{tok.clone()}else{t22.clone()};' in old
        assert 'if *mint.to_account_info().owner==anchor_spl::token::ID{token_program.to_account_info()}else{token_2022_program.to_account_info()}' in new
    else:
        old_call = re.search(r'call\(&am,&\[(.*?)\],data,&\[pas\]\)\?;', old).group(1)
        tuples = re.findall(r'\(&([a-z_0-9]+),(true|false),(true|false)\)', old_call)
        assert len(tuples) == 18
        previous = {n: aliases[v] for n,(v,_,_) in zip(names, tuples)}
        flags = [(s == 'true', w == 'true') for _,s,w in tuples]
    for position, account in enumerate(ix['accounts']):
        role = current[account['name']].removesuffix('.to_account_info()')
        if role.startswith('base_token_program('): role = 'selected_base_token_program'
        assert role == previous[account['name']], (version, account['name'], role)
        assert flags[position] == (account.get('signer',False), account.get('writable',False))
        account_rows.append({'version':version,'position':position,'name':account['name'],
          'resolved_role':role,'signer':flags[position][0],'writable':flags[position][1]})
    mint = 'mint' if version == 1 else 'base_mint'
    assert f'let mintkey=a.{mint}.key();let pab=[ctx.bumps.pool_authority];let pas:&[&[u8]]=&[b"pool-authority",mintkey.as_ref(),&pab];' in old
    assert f'create(&[&[b"pool-authority",a.{mint}.key().as_ref(),&[bump]]])' in new
    assert 'let bump=ctx.bumps.pool_authority;let a=&ctx.accounts;' in new
    assert 'CpiContext::new_with_signer(a.pump_amm.to_account_info(),' in new
    assert ',0,base,quote,a.bonding_curve.creator,a.bonding_curve.is_mayhem_mode,' in new
    assert not '.with_remaining_accounts' in new[new.index('// Original: standalone'):]
    for field, wrapper in [('is_cashback_coin','OptionBool'),('creator_fee_bps','OptionU64'),('can_edit_creator_fee','OptionBool'),('is_holder_reward','OptionBool')]:
        assert f'pump_amm::types::{wrapper}(a.bonding_curve.{field})' in new
    before_call = old[old.index('pub fn execute'):old_begin]
    assert '.reload()' not in before_call
    assert not re.search(r'bonding_curve\.\w+\s*=(?!=)', before_call)
    callsite_review.append({'version':version,'file':'src/'+name,
      'old_inline_lines':[old[:old_begin].count('\n')+1,old[:old_end].count('\n')],
      'new_call_lines':[new[:new_begin].count('\n')+1,new[:new_end].count('\n')],
      'prefix_and_continuation_identical':True,
      'same_signer_seed_bytes':True,'same_cached_curve_fields':True,
      'remaining_accounts_passed':0})

arg_types = ['u16','u64','u64','pubkey','bool',{'defined':{'name':'OptionBool'}},{'defined':{'name':'OptionU64'}},{'defined':{'name':'OptionBool'}},{'defined':{'name':'OptionBool'}}]
assert [a['type'] for a in ix['args']] == arg_types
widths = [2,8,8,32,1,1,8,1,1]
at, layout = 8, []
for arg, width in zip(ix['args'], widths):
    layout.append({'name':arg['name'],'offset':at,'bytes':width,'type':arg['type']})
    at += width
assert at == 70
old_v2 = (base / 'src/migrate_v2.rs').read_text()
serialization = 'let creator=a.bonding_curve.creator;let mut data=vec![233,146,209,142,207,104,64,188];data.extend_from_slice(&0u16.to_le_bytes());data.extend_from_slice(&base.to_le_bytes());data.extend_from_slice(&quote.to_le_bytes());data.extend_from_slice(creator.as_ref());data.push(mayhem as u8);data.push(a.bonding_curve.is_cashback_coin as u8);data.extend_from_slice(&a.bonding_curve.creator_fee_bps.to_le_bytes());data.push(a.bonding_curve.can_edit_creator_fee as u8);data.push(a.bonding_curve.is_holder_reward as u8);'
assert serialization in old_v2

original_path = ROOT / 'evidence/original/pump/deployed.so'
inventory_path = ROOT / 'work/parallel-main-integration/build-round43/normalized-inventory.json'
candidate_path = ROOT / 'work/parallel-main-integration/build-round43/unstripped.so'
raw = original_path.read_bytes(); sec = sections(raw)
inventory = json.loads(inventory_path.read_text()); windows = {w['start']:w for w in inventory['windows']}
assert sha(original_path) == inventory['original_sha256']
window_review = []
for start in [0x43ea0,0x47e28,0x502f0,0x10c0b8]:
    w = windows[start]; code = body(raw,sec,start,w['bytes'])
    assert hashlib.sha256(code).hexdigest() == w['raw_sha256']
    calls = [{'pc':hex(start+x['offset']),'target':hex(x['target'])} for x in w['original_operands'] if x['kind']=='direct-call']
    window_review.append({'start':hex(start),'bytes':w['bytes'],'raw_sha256':w['raw_sha256'],'calls':calls})
def ins(pc): return struct.unpack('<BBhi', body(raw,sec,pc,8))
call_checks = {0x405a0:0x43ea0,0x4aa78:0x502f0,0x44eb8:0x47e28,0x45f68:0x10c0b8,0x524b8:0x10c0b8,0x47ef0:0x1b3678}
for pc, target in call_checks.items():
    op,reg,off,imm = ins(pc)
    assert (op,reg,off) == (0x85,0x10,0) and pc+8+8*imm == target
call_slices = [{'start':hex(start),'end':hex(end),'bytes':body(raw,sec,start,end-start).hex()} for start,end in [(0x40568,0x405a8),(0x4aa48,0x4aa80),(0x43ea0,0x43eb8),(0x502f0,0x50300),(0x45ed0,0x45f70),(0x52420,0x524c0),(0x47ed0,0x47ef8)]]
def raw_at(address, length):
    s = next(s for s in sec.values() if s['addr'] <= address and address+length <= s['addr']+s['size'])
    return raw[s['offset']+address-s['addr']:s['offset']+address-s['addr']+length]
def b58decode(s):
    n = 0
    for ch in s:n=n*58+'123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'.index(ch)
    return n.to_bytes(32,'big')
assert raw_at(0x1b5b28,32) == b58decode('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
assert raw_at(0x1b68a2,14) == b'pool-authority'
callee = windows[0x10c0b8]; matches = [m for m in callee['normalized_matches'] if 'pump_amm3cpi11create_pool' in m['symbol']]
assert len(matches) == 1
cb = body(candidate_path.read_bytes(), sections(candidate_path.read_bytes()), matches[0]['start'], callee['bytes'])
assert normalize(cb,matches[0]['start'],sections(candidate_path.read_bytes()))[0] == normalize(body(raw,sec,0x10c0b8,callee['bytes']),0x10c0b8,sec)[0]

registry = ROOT / 'work/parallel-main-r40-sbpf/cold-producer01/cargo-home/registry/src/index.crates.io-1949cf8c6b5b557f'
dependency_files = [registry / p for p in [
 'anchor-attribute-program-0.31.1/src/declare_program/mods/cpi.rs',
 'anchor-attribute-program-0.31.1/src/declare_program/mods/internal.rs',
 'anchor-attribute-program-0.31.1/src/declare_program/common.rs',
 'anchor-syn-0.31.1/src/codegen/accounts/__cpi_client_accounts.rs',
 'anchor-lang-0.31.1/src/context.rs','borsh-0.10.4/src/ser/mod.rs']]
inputs = [HERE/'STAGED01.json',HERE/'MANIFEST01.json',HERE/'migration-pool-helpers01.patch',
 original_path,inventory_path,candidate_path,
 ROOT/'work/parallel-main-integration/pr410-pump-review/pump-hi-20261027-latest-PROGRESS.md',*dependency_files]
report = {
 'status':'PASS bounded source and CPI ABI review; not built or run',
 'source':stage['source'],'reviewed_stage_sha256':sha(HERE/'STAGED01.json'),
 'reviewer':'main_frontier independent of stage author',
 'scope':'Main Pump migrate/migrate_v2 call construction only. Existing generated external IDL inspected as CPI ABI; no AMM implementation reviewed or changed.',
 'source_hashes':{'before_count':65,'after_count':65,'all_match_staged':True,'changed':changed},
 'accounts':account_rows,'callsites':callsite_review,
 'serialization':{'discriminator':ix['discriminator'],'total_bytes':70,'layout':layout,
   'tuple_wrappers_have_no_option_tag':True,
   'proof':'Anchor IDL generator emits argument fields in IDL order and derives AnchorSerialize. OptionBool and OptionU64 are tuple structs; Borsh 0.10.4 writes u16/u64 little endian and bool as one u8. The removed V2 encoder has the same order and widths.'},
 'cpi_context':{'program':'a.pump_amm','instruction_metas':18,'account_infos':19,
   'duplicate_program_info':True,'signer_only':'creator/pool_authority','remaining_accounts':0,
   'proof':'Both old call and CpiContext append program after the 18 account infos. Generated account metas use only IDL signer/writable flags with None override.'},
 'state_and_order':[
   'Replacing the two inline call-construction lines leaves all preceding and following execute source byte-identical. It does not move any validation, balance read, transfer, reserve reset, boost call or event.',
   'The old mayhem local and new field read both read the cached typed BondingCurve. No mutation or reload of that cached struct precedes the replaced call; CPI raw account changes cannot update this cached Rust value.',
   'Other curve argument fields were already read immediately at the call. The closure uses the same references and synchronous signer seed lifetime.',
   'For V1, Program<Token> validates token_program against Tokenkeg, so comparing mint.owner with its key is equivalent to the new Tokenkeg constant check. Mint AccountInfo is readonly and owner is unchanged at the call.',
   'Generated serialization may allocate a different Vec capacity and increases code/stack and compute usage; source/ABI equivalence does not qualify those resource differences.'
 ],
 'original_evidence':{'sha256':sha(original_path),'windows':window_review,
   'checked_direct_calls':[{ 'pc':hex(k),'target':hex(v)} for k,v in call_checks.items()],
   'instruction_slices':call_slices,
   'generated_callee_normalized_candidate':{'start':hex(matches[0]['start']),'symbol':matches[0]['symbol'],'equality_rechecked':True,'raw_equality_claimed':False},
   'selector_constant':{'address':'0x1b5b28','value':'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA','comparison_length':32},
   'seed_literal':{'address':'0x1b68a2','value':'pool-authority','bytes':14},
   'context_form':'Both original helper entries load accounts through r2+8 and bump through r2+0x23 (V1) or r2+0x24 (V2). Callers pass return storage in r1, context in r2, two amounts in r3/r4. Both helpers call the same generated create_pool body with index r3=0.',
   'limit':'This checks original call graph, argument form, literals and generated-callee identity. Fresh matching of the entire helper bodies, any unrelated original handler gaps and runtime outcomes remain for the coordinated candidate.'},
 'stack_risk':{
   'historical_warning':'Prior inline generated migrate_v2 CPI build reported Stack offset of 4104 exceeded max offset of 4096 by 8, with 482/827 migrate_v2 failures. This is retained history, not a measurement of source01.',
   'review_effect':'Helpers are now standalone source and the original has standalone windows; optimization decisions can still change after composition. Existing V1 init_boost is unchanged and still must be checked.',
   'selection_gates':['Fresh candidate build must have no stack-offset/exceeded warning.','Recompute normalized/raw identity and require no prior normalized losses.','Run retained full corpus including both migration suites and compare errors/diagnostics/state.','Do not inherit any historical L06 match counts or runtime acceptance.']},
 'no_build_or_transactions':True,'input_sha256':{str(p.relative_to(ROOT)):sha(p) for p in inputs}}
(HERE/'INDEPENDENT-REVIEW01.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'report_sha256':sha(HERE/'INDEPENDENT-REVIEW01.json'),'source_hashes':report['source_hashes'],'account_rows':len(account_rows),'original_calls_checked':len(call_checks)}))
