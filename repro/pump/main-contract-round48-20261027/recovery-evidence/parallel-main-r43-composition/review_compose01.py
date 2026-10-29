"""Independently review shared fee helpers, then compose on frozen R42 without building."""
from pathlib import Path
import difflib,hashlib,json,shutil,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;BASE=R/'work/parallel-main-integration/round42-source/programs/pump';PRIOR=R/'work/parallel-main-integration/round41-source/programs/pump';LANE=R/'work/parallel-main-util-fee-origins';S=W/'source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest;from pump_quote_control_function_match import sections;from pump_compare_function_bytes import body
def inv(p):return{str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
def fun(t,name):
 a=t.index('fn '+name+'(');brace=t.index('{',a);b=brace+1;n=1
 while n:n+=(t[b]=='{')-(t[b]=='}');b+=1
 return t[a:b]
tok=lambda s:''.join(s.split())
assert sha(LANE/'STAGED01.json')=='b3fc697a920e29ee92de6cbd992b4019e2ea407d3b74fab1183e0dfbd29dfb29'
assert sha(LANE/'shared-fee-helpers01.patch')=='0928fdf2d0ee6259445b31b175624f745282a2a5dc1342aa452800a757079f1b'
baseline=inv(BASE);prior=inv(PRIOR);source=inv(LANE/'source01');changed=set(n for n,h in source.items()if prior.get(n)!=h)
assert changed=={'src/trade_v3.rs','src/multi_hop_curve_swap.rs','src/util/fee.rs'}
oldtrade=(PRIOR/'src/trade_v3.rs').read_text();newtrade=(LANE/'source01/src/trade_v3.rs').read_text();oldmulti=(PRIOR/'src/multi_hop_curve_swap.rs').read_text();newmulti=(LANE/'source01/src/multi_hop_curve_swap.rs').read_text();oldutil=(PRIOR/'src/util/fee.rs').read_text();newutil=(LANE/'source01/src/util/fee.rs').read_text()
assert newutil.startswith(oldutil)
assert tok(fun(oldtrade,'selected'))==tok(fun(newutil,'selected'))
assert tok(fun(oldmulti,'tier'))==tok(fun(newutil,'tier'))
assert fun(oldtrade,'narrow')==fun(newtrade,'narrow')and fun(oldmulti,'n')==fun(newmulti,'n')
assert fun(oldtrade,'quote_fee_snapshot')==fun(newtrade,'quote_fee_snapshot')
assert oldtrade.count('require!(config_data.len()>=2512,PumpError::FeeConfigTooShort);')==newtrade.count('validate_config_length(config_data.len())?;')==1
assert oldtrade.count('require!(data.len()>=2512,PumpError::FeeConfigTooShort);')==newtrade.count('validate_config_length(data.len())?;')==1
assert oldmulti.count('require!(len >= 2512, PumpError::FeeConfigTooShort);')==newmulti.count('validate_config_length(len)?;')==1
maxu=(1<<64)-1;product=maxu*maxu;assert product+10000<=(1<<128)-1
assert '(a as u128*b as u128+9999)/10000'in fun(oldtrade,'fee')and'(a as u128 * b as u128 + 9999) / 10000'in fun(oldmulti,'fee')
assert fun(oldutil,'fee')==fun(newutil,'fee')and fun(oldutil,'checked_ceil_div')==fun(newutil,'checked_ceil_div')
original=R/'evidence/original/pump/deployed.so';raw=original.read_bytes();ss=sections(raw);owners=read(LANE/'ORIGINAL-FILENAME-OWNERS.json')
for owner in owners['owners']:
 for ref in owner['filename_references']:
  ins=body(raw,ss,int(ref['pc'],16),16);assert ins[0]==0x18 and int.from_bytes(ins[4:8],'little')|int.from_bytes(ins[12:16],'little')<<32==int(ref['target'],16)
fnlen=owners['filename_bytes'];at=int(owners['filename_address'],16);section=next(v for v in ss.values()if v['addr']<=at and at+fnlen<=v['addr']+v['size']);offset=section['offset']+at-section['addr'];assert raw[offset:offset+fnlen]==b'programs/pump/src/util/fee.rs'
assert not S.exists();shutil.copytree(BASE,S)
for name in ['src/multi_hop_curve_swap.rs','src/util/fee.rs']:
 assert baseline[name]==prior[name];shutil.copyfile(LANE/'source01'/name,S/name)
# Retain the previously moved quote reader while importing all fee-only edits.
quote=fun(oldtrade,'quote_fee_snapshot');replacement='use crate::transfer_fee_recovered::quote_fee_snapshot;'
assert newtrade.count(quote)==1 and(BASE/'src/trade_v3.rs').read_text().count(replacement)==1
composed=newtrade.replace(quote,replacement,1);(S/'src/trade_v3.rs').write_text(composed)
assert fun((S/'src/util/transfer_fee.rs').read_text(),'quote_fee_snapshot')==fun((BASE/'src/util/transfer_fee.rs').read_text(),'quote_fee_snapshot')
assert composed.count(replacement)==1 and 'fn quote_fee_snapshot('not in composed
after=inv(S);delta={n:h for n,h in after.items()if baseline.get(n)!=h};assert len(after)==65 and set(delta)==changed
assert inv(BASE)==baseline
for n,h in baseline.items():
 if n not in delta:assert after[n]==h
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(delta));(W/'r43-util-fee.patch').write_text(patch)
report={'status':'passed_source_review_composed_unbuilt','scope':__doc__,'source':str(S.relative_to(R)),'base_R42_source':str(BASE.relative_to(R)),'source_before':baseline,'source_after':after,'changed':delta,'inputs':65,'R42_source_unchanged':True,'checks':{'selected_and_tier_bodies_verbatim':True,'existing_util_prefix_verbatim':True,'all_non_fee_narrowing_verbatim':True,'config_length_guard_positions_unchanged':True,'u64_product_plus_denominator_always_fits_u128':True,'fee_formulas_equivalent':'(a*b+10000)-1 equals a*b+9999 for every pair ofu64; denominator10000; identical u64 narrowing','quote_fee_snapshot_import_preserved':True,'moved_quote_fee_snapshot_utility_body_preserved':True,'all_other_R42_files_preserved':True,'original_filename_LDDW_sites_verified':True},'overlap_resolution':{'file':'src/trade_v3.rs','description':'Use fee-only stage, replace its old quote_fee_snapshot definition with the exact R42 utility import; keep actual reader body in util/transfer_fee.rs.'},'new_cases':0,'candidate_claim':'No runtime or binary qualification;96 historical origin rows targeted only.','input_sha256':{str(p.relative_to(R)):sha(p)for p in[LANE/'STAGED01.json',LANE/'shared-fee-helpers01.patch',LANE/'ORIGINAL-FILENAME-OWNERS.json',LANE/'FEE-ARITHMETIC.json',W/'r43-util-fee.patch']}}
(W/'REVIEW01.json').write_text(json.dumps(report,indent=2)+'\n');(W/'MANIFEST01.json').write_text(json.dumps({p.name:sha(p)for p in[W/'REVIEW01.json',W/'review_compose01.py',W/'r43-util-fee.patch']},indent=2)+'\n');print({'review':sha(W/'REVIEW01.json'),'manifest':sha(W/'MANIFEST01.json'),'patch':sha(W/'r43-util-fee.patch')})
