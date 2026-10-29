"""Share witnessed fee helpers without moving non-fee narrowing or parsers."""
from pathlib import Path
import difflib,hashlib,json,re,shutil
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
B=R/'work/parallel-main-integration/round41-source/programs/pump';D=W/'source01'
h=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
before={str(p.relative_to(B)):h(p)for p in sorted(B.rglob('*'))if p.is_file()}
assert len(before)==64 and not D.exists();shutil.copytree(B,D)
trade_path=D/'src/trade_v3.rs';route_path=D/'src/multi_hop_curve_swap.rs';util_path=D/'src/util/fee.rs'
trade=trade_path.read_text();route=route_path.read_text();util=util_path.read_text()

def function(text,name):
 match=re.search(r'(?m)^fn '+name+r'\b',text);assert match,name
 start=match.start();brace=text.index('{',start);depth=1;i=brace+1
 while depth:
  depth+=(text[i]=='{')-(text[i]=='}');i+=1
 return text[start:i+int(text[i:i+1]=='\n')]

selected=function(trade,'selected');tier=function(route,'tier')
original_fee=function(trade,'fee');route_fee=function(route,'fee')
read_config=function(trade,'read_config');narrow=function(trade,'narrow');route_n=function(route,'n')
assert trade.count(selected)==route.count(tier)==1
trade=trade.replace(original_fee,'').replace(selected,'')
route=route.replace(route_fee,'').replace(tier,'')
trade=trade.replace('use crate::{Global, PumpError};','use crate::{Global, PumpError};\nuse crate::legacy_sell::fee_math::{fee, selected, validate_config_length};',1)
route=route.replace('use crate::{Global,PumpError};','use crate::{Global,PumpError};\nuse crate::legacy_sell::fee_math::{fee, tier, validate_config_length};',1)
constants=[]
for name in ['QUOTE_2','USDC']:
 line=re.search(r'(?m)^const '+name+r':.*\n',trade);assert line
 constants.append(line.group());trade=trade.replace(line.group(),'')
guard='require!(config_data.len()>=2512,PumpError::FeeConfigTooShort);'
assert trade.count(guard)==1;trade=trade.replace(guard,'validate_config_length(config_data.len())?;')
guard='require!(data.len()>=2512,PumpError::FeeConfigTooShort);'
assert trade.count(guard)==1;trade=trade.replace(guard,'validate_config_length(data.len())?;')
guard='require!(len >= 2512, PumpError::FeeConfigTooShort);'
assert route.count(guard)==1;route=route.replace(guard,'validate_config_length(len)?;')
comment='// D02: First-threshold gate before reverse search matters for unsorted tables.\n'
assert route.count(comment)==1;route=route.replace(comment,'')

# Preserve the already-selected utility math body exactly; these two callers
# previously used its algebraic u64-input equivalent directly.
append='''
use crate::PumpError;
use crate::trade_types::{FeeConfig, FeeTier, Fees};
const WSOL: Pubkey = anchor_lang::solana_program::pubkey!("So11111111111111111111111111111111111111112");
'''+''.join(constants)+'''
pub(crate) fn validate_config_length(length: usize) -> Result<()> {
    require!(length >= 2512, PumpError::FeeConfigTooShort);
    Ok(())
}

'''+selected.replace('fn selected(', 'pub(crate) fn selected(',1)+'\n'+comment+tier.replace('fn tier(', 'pub(crate) fn tier(',1)
util_path.write_text(util+append);trade_path.write_text(trade);route_path.write_text(route)
assert function(trade,'narrow')==narrow and function(route,'n')==route_n
assert function(trade,'read_config')==read_config.replace('require!(data.len()>=2512,PumpError::FeeConfigTooShort);','validate_config_length(data.len())?;')
assert function(trade,'quote_fee_snapshot')==function((B/'src/trade_v3.rs').read_text(),'quote_fee_snapshot')
assert util_path.read_text().startswith(util)
after={str(p.relative_to(D)):h(p)for p in sorted(D.rglob('*'))if p.is_file()}
changed=[name for name in before if before[name]!=after[name]]
assert set(changed)=={'src/trade_v3.rs','src/multi_hop_curve_swap.rs','src/util/fee.rs'}
assert before.keys()==after.keys()
assert before=={str(p.relative_to(B)):h(p)for p in sorted(B.rglob('*'))if p.is_file()}
patch=''
for name in changed:
 patch+=''.join(difflib.unified_diff((B/name).read_text().splitlines(True),(D/name).read_text().splitlines(True),fromfile='a/'+name,tofile='b/'+name))
(W/'shared-fee-helpers01.patch').write_text(patch)
maximum=(2**64-1)**2
assert maximum+10000 <= 2**128-1
math={'domain':'All pairs of u64 quote_amount and basis_points','maximum_product':maximum,
      'maximum_checked_sum':maximum+10000,'u128_maximum':2**128-1,
      'identity':'(product + 10000 - 1) / 10000 == (product + 9999) / 10000',
      'checked_sum_always_fits':True,'subtraction_cannot_underflow':True,'denominator_nonzero':True,
      'result_narrowing':'Both paths use u64::try_from of the same quotient and return PumpError::Truncation on failure.'}
(W/'FEE-ARITHMETIC.json').write_text(json.dumps(math,indent=2)+'\n')
result={'status':'staged_unbuilt','baseline':str(B.relative_to(R)),'source':str(D.relative_to(R)),
        'baseline_sha256':before,'source_sha256':after,'changed_files':changed,
        'verbatim_moved_bodies':['trade_v3::selected','multi_hop::tier'],'utility_prefix_unchanged':True,
        'reused_existing_fee':'crate::legacy_sell::fee_math::fee','local_nonfee_narrowing_retained':True,
        'parser_kept_in_trade_v3':True,'length_check_order_unchanged':True,'quote_fee_snapshot_unchanged':True,
        'new_helper':'validate_config_length: same >=2512 condition and error at original caller positions',
        'patch_sha256':h(W/'shared-fee-helpers01.patch'),'arithmetic_proof_sha256':h(W/'FEE-ARITHMETIC.json'),
        'inputs':{str(p.relative_to(R)):h(p)for p in [Path(__file__),W/'ORIGINAL-FILENAME-OWNERS.json']},
        'next':'Independent source review, then one coordinated private build and existing fee/narrowing/error-order cases. No new behavior witness is claimed.'}
(W/'STAGED01.json').write_text(json.dumps(result,indent=2)+'\n')
print({'files':changed,'patch_sha256':h(W/'shared-fee-helpers01.patch'),'staged_sha256':h(W/'STAGED01.json')})
