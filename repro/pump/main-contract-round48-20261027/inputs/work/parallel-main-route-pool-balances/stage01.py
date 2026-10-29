"""Stage the existing completion pool-balance sequence at its original physical source."""
from pathlib import Path
from collections import Counter
import difflib,hashlib,json,shutil,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
BASE=R/'work/parallel-main-integration/round44-source-retry/programs/pump';S=W/'source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest;from pump_quote_control_function_match import sections;from pump_compare_function_bytes import body

def inv(p):return{str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
before=inv(BASE);assert len(before)==65 and not S.exists()
prior=read(R/'work/parallel-main-route-budget-placement/STAGED01.json')
rows=prior['runtime_original_source_cohort']['unfixed_trade_v3_origin_rows_outside_helper']
guards=[r for r in rows if r['original'][1] in ['506','507']];mixed=[r for r in rows if r not in guards]
assert len(guards)==30 and len(mixed)==13
assert Counter(r['original'][2]for r in guards)==Counter(Overflow=28,NotEnoughTokensToBuy=2)
assert all(r['candidate'][0]=='programs/pump/src/multi_hop_curve_swap.rs'for r in rows)
shutil.copytree(BASE,S)
p=S/'src/multi_hop_curve_swap.rs';text=p.read_text();old='''                let pool_base = sub(h.associated_base_bonding_curve.amount,capped)?;
                let pool_quote = sub(add(c.real_quote_reserves,first_quote)?,if native{a.global.pool_migration_fee}else{0})?;
                require_gt!(pool_base,0,PumpError::NotEnoughTokensToBuy);
                require_gt!(pool_quote,0,PumpError::Overflow);
''';assert text.count(old)==1
new='''                let (pool_base,pool_quote) = crate::trade::route_buy_budget::completion_pool_balances(
                    c.real_quote_reserves,a.global.pool_migration_fee,
                    h.associated_base_bonding_curve.amount,native,capped,first_quote)?;
''';text=text.replace(old,new)
add_sig='fn add(a: u64, b: u64) -> Result<u64>'
assert text.count(add_sig)==1;text=text.replace(add_sig,'pub(crate) '+add_sig,1);p.write_text(text)
p=S/'src/trade_v3.rs';text=p.read_text();imports='use crate::multi_hop_curve::{n,sub};';assert text.count(imports)==1;text=text.replace(imports,'use crate::multi_hop_curve::{add,n,sub};',1)
assert text.endswith('}\n');helper='''
// Reconstruct the shared completed-curve pool-balance boundary; the original name is unknown.
pub(crate) fn completion_pool_balances(
    real_quote_reserves:u64,migration_fee:u64,base_vault_amount:u64,
    native:bool,base_amount:u64,quote_amount:u64,
)->Result<(u64,u64)>{
    let pool_base = sub(base_vault_amount,base_amount)?;
    let pool_quote = sub(add(real_quote_reserves,quote_amount)?,if native{migration_fee}else{0})?;
    require_gt!(pool_base,0,PumpError::NotEnoughTokensToBuy);
    require_gt!(pool_quote,0,PumpError::Overflow);
    Ok((pool_base,pool_quote))
}
''';text=text[:-2]+helper+'}\n';p.write_text(text)
after=inv(S);changed={n:h for n,h in after.items()if before.get(n)!=h};assert set(changed)=={'src/multi_hop_curve_swap.rs','src/trade_v3.rs'}and len(after)==65 and inv(BASE)==before
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed));(W/'pool-balances01.patch').write_text(patch)
raw=(R/'evidence/original/pump/deployed.so').read_bytes();ss=sections(raw);j=read(R/'work/parallel-main-integration/build-round43/normalized-inventory.json');window=next(r for r in j['windows']if r['start']==0x82128);assert window['bytes']==2512
get=lambda at:struct.unpack('<BBhi',body(raw,ss,at,8))
checks={0x82130:(0x79,0x51,-0xff8,0),0x82138:(0x3d,0x14,0x22,0),0x82250:(0x79,0x57,-0xff0,0),0x82258:(0xbf,0x20,0,0),0x82260:(0x0f,0x70,0,0),0x82290:(0x79,0x52,-0x1000,0),0x82298:(0x55,0x02,1,0),0x822a8:(0xad,0x30,1,0),0x82608:(0x1f,0x30,0,0),0x82610:(0x1d,0x14,6,0),0x82618:(0x15,0,0x5c,0),0x82620:(0x1f,0x14,0,0),0x82628:(0x7b,0x06,0x10,0),0x82630:(0x7b,0x46,8,0)}
for at,expected in checks.items():assert get(at)==expected,(hex(at),get(at),expected)
refs=[hex(window['start']+o['offset'])for o in window['original_operands']if o['kind']=='elf-pointer'and o['value']==0x1b723b];assert len(refs)==5
source_lines={hex(at):get(at)[3]for at in[0x82408,0x825b0,0x82798,0x828a8,0x82a50]};assert sorted(source_lines.values())==[494,498,502,506,507]
callers=[{'window':hex(r['start']),'call_site':hex(r['start']+o['offset'])}for r in j['windows']for o in r['original_operands']if o['kind']=='direct-call'and o['target']==window['start']];assert len(callers)==3
artifact={'status':'original_static_evidence','original_sha256':sha(R/'evidence/original/pump/deployed.so'),'window':'0x82128','window_bytes':2512,'window_sha256':hashlib.sha256(body(raw,ss,window['start'],window['bytes'])).hexdigest(),'filename':'programs/pump/src/trade_v3.rs','filename_address':'0x1b723b','filename_sites':refs,'source_line_stores':source_lines,'callers':callers,'fast_path_instructions':{hex(at):list(v)for at,v in checks.items()},'inferred_abi':['r1=Result<(base,quote)> output','r2=real quote reserves','r3=migration fee','r4=base vault amount','r5[-4096]=native flag','r5[-4088]=base amount','r5[-4080]=quote amount'],'selected_scope':'Only relocate the four existing route calculation/guard statements, preserving current arithmetic helpers and their original physical definitions.','guard_rows':guards,'preserved_mixed_sub_rows':mixed,'limits':['The original ABI names and types are inferred; no source syntax or body identity claim.','The original inlined checked arithmetic has different code shape from helper calls; no existing arithmetic implementation is replaced.','Native false still invokes the same existing sub(...,0) in the source candidate; this is preserved current behavior, not proof of original call structure.']}
(W/'ORIGINAL01.json').write_text(json.dumps(artifact,indent=2)+'\n')
staged={'status':'source_only_waiting_independent_review','base_source':str(BASE.relative_to(R)),'source':str(S.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'patch_sha256':sha(W/'pool-balances01.patch'),'original_evidence_sha256':sha(W/'ORIGINAL01.json'),'new_cases':0,'expected_origin_repairs':30,'preserved_mixed_sub_origins':13,'source_contract':['Same base sub, quote add, quote sub ordering; same helper definitions and operands.','Only add visibility widened; existing n/sub visibility and body retained.','Same positive-base then positive-quote guards, return tuple and subsequent statements.','No other caller or input definition changed.'],'limits':['Unbuilt and not promoted.','Requires all prior matched body sets and full retained runtime/log corpus before selection.']}
(W/'STAGED01.json').write_text(json.dumps(staged,indent=2)+'\n');(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in['stage01.py','pool-balances01.patch','ORIGINAL01.json','STAGED01.json']},indent=2)+'\n');print({'stage_sha256':sha(W/'STAGED01.json'),'patch_sha256':sha(W/'pool-balances01.patch')})
