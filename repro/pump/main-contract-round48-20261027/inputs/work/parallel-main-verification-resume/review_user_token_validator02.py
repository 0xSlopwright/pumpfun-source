"""Independent source, typed ABI and complete CFG review; no build or VM."""
from pathlib import Path
import hashlib
import json
import struct
import sys

R = Path(__file__).resolve().parents[2]
W = R / 'work/parallel-main-user-token-validation'
O = Path(__file__).resolve().parent
sys.path.insert(0, str(R / 'scripts'))
from build_source_manifest import source_manifest
from pump_quote_control_function_match import sections
from pump_compare_function_bytes import body, normalize

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
read = lambda p: json.loads(p.read_text())
manifest = lambda p: {str((R/n).relative_to(p)):v for n,v in source_manifest(p,p,R).items()}
stage = read(W/'STAGED02.json')
assert sha(W/'STAGED02.json') == '759617710544ef66b7af5854eb6a8b5876f9e0f6ec41fb05d0d379e0758c2932'
proof = read(W/'EVIDENCE02.json')
assert sha(W/'EVIDENCE02.json') == stage['evidence_sha256']
assert sha(W/'user-token-validator02.patch') == stage['patch_sha256']
for p,v in read(W/'MANIFEST02.json').items(): assert sha(W/p) == v
for p,v in proof['input_sha256'].items(): assert sha(R/p) == v
B,S = R/stage['base_source'],R/stage['source']
before,after = manifest(B),manifest(S)
assert before == stage['source_before'] and after == stage['source_after']
assert len(before) == len(after) == stage['input_count'] == 65
assert {p:v for p,v in after.items() if before[p] != v} == stage['changed']
assert set(stage['changed']) == {'src/buy_v2.rs','src/sell_v2.rs','src/trade_v3.rs'}

helper = '''pub(crate) fn validate_user_token_account(
    info: &AccountInfo,
    user: &AccountInfo,
    mint: &Pubkey,
    token_program: &Pubkey,
) -> Result<()> {
    require_keys_eq!(*info.owner, *token_program, PumpError::AccountTypeNotSupported);
    let data = info.try_borrow_data()?;
    let token = TokenAccount::try_deserialize_unchecked(&mut &data[..])?;
    require_keys_eq!(token.mint, *mint, PumpError::MintDoesNotMatchBondingCurve);
    require_keys_eq!(token.owner, user.key(), PumpError::AccountTypeNotSupported);
    Ok(())
}'''
obsolete = 'fn check_token(info:&AccountInfo,mint:Pubkey,owner:Pubkey)->Result<()>{let d=info.try_borrow_data()?;let t=TokenAccount::try_deserialize(&mut &d[..])?;require_keys_eq!(t.mint,mint,PumpError::MintDoesNotMatchBondingCurve);let _=owner;Ok(())}'
old_pair = '  require_keys_eq!(*a.associated_quote_user.owner,a.quote_token_program.key(),PumpError::AccountTypeNotSupported);\n  check_token(&a.associated_quote_user,a.quote_mint.key(),a.user.key())?;{let d=a.associated_quote_user.try_borrow_data()?;let t=TokenAccount::try_deserialize(&mut &d[..])?;require_keys_eq!(t.owner,a.user.key(),PumpError::AccountTypeNotSupported);}'
for name,count in [('buy_v2.rs',2),('sell_v2.rs',1)]:
    text = (S/'src'/name).read_text()
    prefix = '' if name == 'buy_v2.rs' else 'crate::buy_v2::'
    new_call = '  '+prefix+'validate_user_token_account(a.associated_quote_user.as_ref(),a.user.as_ref(),&a.quote_mint.key(),&a.quote_token_program.key())?;'
    assert text.count(new_call) == count
    text = text.replace(new_call,old_pair)
    if name == 'buy_v2.rs':
        assert text.count(helper) == 1
        text = text.replace(helper,obsolete)
    else:
        assert text.count('\n\n\n#[path="v2_user_token_transfers.rs"]') == 1
        text = text.replace('\n\n\n#[path="v2_user_token_transfers.rs"]','\n'+obsolete+'\n\n#[path="v2_user_token_transfers.rs"]')
    assert text == (B/'src'/name).read_text(), name
text = (S/'src/trade_v3.rs').read_text()
new_gate = '''  if role==1 {
   crate::buy_v2::validate_user_token_account(&info,a.user.as_ref(),&a.quote_mint.key(),&a.quote_token_program.key())?;
   continue;
  }
'''
assert text.count(new_gate) == 1
text = text.replace(new_gate,'')
mint = '  require_keys_eq!(token.mint,a.quote_mint.key(),PumpError::MintDoesNotMatchBondingCurve);\n'
assert text.count(mint) == 1
text = text.replace(mint,mint+'  if role==1{require_keys_eq!(token.owner,a.user.key(),PumpError::AccountTypeNotSupported)}\n')
assert text == (B/'src/trade_v3.rs').read_text()

raw = (R/'evidence/original/pump/deployed.so').read_bytes()
sec = sections(raw)
instruction = lambda pc: struct.unpack('<BBhi',body(raw,sec,pc,8))
iv = read(R/'work/parallel-main-integration/build-round47-identity/normalized-inventory.json')
windows = {w['start']:w for w in iv['windows']}
def graph(start):
    w = windows[start]
    assert hashlib.sha256(body(raw,sec,start,w['bytes'])).hexdigest() == w['raw_sha256']
    nodes = {};pc = start
    while pc < start+w['bytes']:
        nodes[pc] = instruction(pc)
        pc += 16 if nodes[pc][0] == 0x18 else 8
    assert pc == start+w['bytes']
    edges = {}
    for pc,(op,reg,off,imm) in nodes.items():
        nxt = pc+(16 if op == 0x18 else 8)
        if op == 0x95: edges[pc] = []
        elif op in (5,6): edges[pc] = [pc+8+off*8]
        elif op&7 in (5,6) and op != 0x85: edges[pc] = [nxt,pc+8+off*8]
        else: edges[pc] = [nxt]
        assert all(x in nodes for x in edges[pc])
    def reach(origin,block=None):
        if origin == block: return set()
        seen = {origin};q = [origin]
        for pc in q:
            for nxt in edges[pc]:
                if nxt != block and nxt not in seen: seen.add(nxt);q.append(nxt)
        return seen
    return nodes,edges,reach
def call(pc,target):
    op,reg,off,imm = instruction(pc)
    assert (op,reg,off) == (0x85,0x10,0) and pc+8+imm*8 == target,hex(pc)
def ld(pc,dst,src,off): assert instruction(pc) == (0x79,src*16+dst,off,0),hex(pc)
def st(pc,dst,src,off): assert instruction(pc) == (0x7b,src*16+dst,off,0),hex(pc)

nodes,edges,reach = graph(0x160d0)
assert len(nodes) == 333
for pc,target in [(0x16118,0x1b3678),(0x16160,0x1a2ca8),(0x161e8,0x185ed0),(0x162d0,0x1b3678),(0x16628,0x1b3678)]:call(pc,target)
for must,target in [(0x16130,0x16160),(0x16160,0x161e8),(0x161e8,0x162d0),(0x162e8,0x16628),(0x16640,0x16b88)]:
    assert target not in reach(0x160d0,must)
assert not {0x16160,0x161e8,0x162d0,0x16628,0x16b88}&reach(0x16710)
assert not {0x161e8,0x162d0,0x16628,0x16b88}&reach(0x163b8)
assert not {0x16628,0x16b88}&reach(0x162f0)
assert 0x16b88 not in reach(0x16648)
assert edges[0x16208] == [0x16210,0x16b48] and edges[0x162e8] == [0x162f0,0x165a8]
assert edges[0x16640] == [0x16648,0x16b88]
assert [pc for pc,es in edges.items() if 0x16b88 in es] == [0x16640]
ld(0x160f8,6,7,0x18)
st(0x16138,10,9,-0x270);ld(0x165a8,1,10,-0x270);ld(0x165b0,8,1,0)
st(0x161a0,10,4,-0x278)
for pc in [0x16b48,0x16b88]:
    ld(pc,2,10,-0x278);ld(pc+8,1,2,0)
    assert instruction(pc+16) == (7,1,0,-1)
    st(pc+24,2,1,0)

callers = []
for h,expected_nodes,branch in zip(proof['v2_callers'],[1896,2464,1714],[0x13c330,0x1403c0,0x144ef8]):
    ns,es,rs = graph(h['start']);assert len(ns) == expected_nodes
    for pc,target in [(h['previous'],0x14910),(h['site'],0x160d0),(h['next'],0x14910)]:call(pc,target)
    assert h['site'] not in rs(h['start'],h['previous'])
    assert h['next'] not in rs(h['start'],h['site'])
    ld(h['userload'],3,h['context'],0x158);ld(h['accountload'],2,h['context'],0x168)
    assert instruction(branch)[0] == 0x55 and instruction(branch)[3] == 2
    assert h['next'] not in rs(es[branch][1])
    callers.append({'name':h['name'],'nodes':len(ns),'full_cfg_and_error_paths_checked':True})
ns,es,rs = graph(0x7f010);assert len(ns) == 443
call(0x7f600,0x14910);call(0x7f868,0x160d0);call(0x7f908,0x7e490)
assert 0x7f868 not in rs(0x7f010,0x7f600) and 0x7f908 not in rs(0x7f880)
ld(0x7f558,8,1,0x40);assert instruction(0x7f620) == (0xbf,0x83,0,0)
ld(0x7f7b0,2,1,0x50)
callers.append({'name':'shared_v3_quote_preflight','nodes':len(ns),'full_cfg_and_error_paths_checked':True})

candidate_path = R/'work/parallel-main-integration/build-round47-identity/unstripped.so'
candidate = candidate_path.read_bytes();candidate_sections = sections(candidate)
bindings = []
for start,needle in [(0xa4378,'BuyV2'),(0xe62a8,'SellV2'),(0x102578,'SellV3'),(0x1a2ca8,'try_borrow_data'),(0x185ed0,'try_deserialize_unchecked'),(0x97930,'18transfer_from_user'),(0x96d48,'21transfer_to_recipient')]:
    w = windows[start];m = next(m for m in w['normalized_matches'] if needle in m['symbol'])
    assert normalize(body(raw,sec,start,w['bytes']),start,sec)[0] == normalize(body(candidate,candidate_sections,m['start'],w['bytes']),m['start'],candidate_sections)[0]
    bindings.append({'original':hex(start),'candidate':hex(m['start']),'bytes':w['bytes'],'symbol':m['symbol']})

# Typed quote-payment parameters establish field roles independently of declarations.
for pc,target in [(0x13d888,0x97930),(0x142438,0x97930),(0x1463a0,0x96d48),(0x14b4f8,0x96d48)]:call(pc,target)
ld(0x13d7b0,4,9,0x168);st(0x13d828,10,4,-0xfd8)
ld(0x142360,4,8,0x168);st(0x1423d8,10,4,-0xfd8)
ld(0x1462b8,5,1,0x168);st(0x146340,10,5,-0xfd0)
ld(0x14b450,5,8,0x50);st(0x14b488,10,5,-0xfd0)
# The Signer wrapper's address is passed to the typed payment helper, while
# validation loads its AccountInfo reference before passing r3.
assert instruction(0x13d680) == (0xbf,0x91,0,0) and instruction(0x13d688) == (7,1,0,0x158)
st(0x13d690,10,1,-0x778);ld(0x13d880,4,10,-0x778)
assert instruction(0x142230) == (0xbf,0x81,0,0) and instruction(0x142238) == (7,1,0,0x158)
st(0x142240,10,1,-0x850);ld(0x142430,4,10,-0x850)
assert instruction(0x84638) == (0xbf,0x84,0,0) and instruction(0x84640) == (7,4,0,0x40)

deps = R/'work/parallel-main-r40-sbpf/cold-producer01/cargo-home/registry/src/index.crates.io-1949cf8c6b5b557f'
signer = deps/'anchor-lang-0.31.1/src/accounts/signer.rs'
account_info = deps/'anchor-lang-0.31.1/src/accounts/account_info.rs'
assert "info: &'info AccountInfo<'info>" in signer.read_text()
assert 'self.info' in signer.read_text() and '*self.key' in account_info.read_text()
assert 'Self::try_deserialize_unchecked(buf)' in (deps/'anchor-lang-0.31.1/src/lib.rs').read_text()
assert 'fn try_deserialize_unchecked' in (deps/'anchor-spl-0.31.1/src/token_interface.rs').read_text()
lib = (B/'src/lib.rs').read_text();pay = (B/'src/curve_quote_payments.rs').read_text()
assert 'quote_source: Option<&AccountInfo' in lib and 'quote_destination:Option<&AccountInfo' in pay
assert 'let from = quote_source.unwrap();' in lib and 'let to=quote_destination.unwrap();' in pay
assert 'payer: &Signer' in lib

out = O/'USER-TOKEN-VALIDATOR-REVIEW02.json'
result = {'status':'passed_source_review_only','selected_stage':'STAGED02.json','selected_stage_sha256':sha(W/'STAGED02.json'),'source_inputs':65,'source_changes':stage['changed'],'cfg_helper_nodes':333,'callers':callers,'typed_bindings':bindings,'abi':'r2 is token AccountInfo; r3 is user AccountInfo; r4/r5 are mint/program Pubkey references. Signer::as_ref supplies the observed inner reference.','roles':'V2 +0x168 is quote source on buy/exact and quote destination on sell. V3 +0x50 is quote destination on sell. Typed payment ABIs and raw outgoing stack stores prove these roles independently of source declaration order.','source_scope':'Reverse transformation recovers all three R48 files byte-for-byte. Other quote roles, native branch, R48 balance ordering, payments, reserves and events remain unchanged.','limits':['No compiler, VM, transaction or live RPC executed.','Source01 is preserved unselected because its Signer wrapper spelling differed from observed nominal ABI.','Source02 is approved for one bounded mapped identity build; body identity, regression outcomes and final promotion remain unproved.','Normalized dependency/constructor binding is not whole-program or data identity.'],'input_sha256':{str(p.relative_to(R)):sha(p) for p in [Path(__file__),W/'STAGED02.json',W/'EVIDENCE02.json',W/'MANIFEST02.json',W/'user-token-validator02.patch',candidate_path,signer,account_info,B/'src/lib.rs',B/'src/curve_quote_payments.rs']}}
out.write_text(json.dumps(result,indent=2)+'\n')
print({'status':result['status'],'sha256':sha(out),'source_changes':len(stage['changed'])})
