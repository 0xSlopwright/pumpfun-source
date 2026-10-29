"""Stage bounded checked-arithmetic ownership recovery on frozen R47; no build or VM."""
from pathlib import Path
from collections import Counter
import difflib,gzip,hashlib,json,re,shutil,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
BASE=R/'work/parallel-main-integration/round47-source/programs/pump';S=W/'source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
read=lambda p:json.loads(p.read_text())
sys.path.insert(0,str(R/'scripts'))
from build_source_manifest import source_manifest
from pump_quote_control_function_match import sections
from pump_compare_function_bytes import body
def inv(p):return{str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
before=inv(BASE);assert len(before)==65 and not S.exists()
raw=(R/'evidence/original/pump/deployed.so').read_bytes();ss=sections(raw)
inventory=read(R/'work/parallel-main-integration/build-round47-identity/normalized-inventory.json')
windows={x['start']:x for x in inventory['windows']}
comparison=read(W/'SUB3-COMPARISON01.json');c=comparison['candidates'];assert len(c)==1 and c[0]['bytes']==576
assert c[0]['different_slots']==[{'offset':440,'original':'620a08ff26010000','candidate':'620a08ff43000000'}]
get=lambda at:struct.unpack('<BBhi',body(raw,ss,at,8))
checks={0x80490:(0xad,0x32,2,0),0x80498:(0x1f,0x32,0,0),0x804a0:(0x3d,0x42,64,0),0x80640:(0x62,0x0a,-248,294),0x806a8:(0x1f,0x42,0,0),0x82138:(0x3d,0x14,34,0),0x82260:(0x0f,0x70,0,0),0x82270:(0xad,0x20,1,0),0x82298:(0x55,0x02,1,0),0x822a8:(0xad,0x30,1,0),0x82608:(0x1f,0x30,0,0),0x82610:(0x1d,0x14,6,0),0x82618:(0x15,0,92,0),0x82620:(0x1f,0x14,0,0),0x828a8:(0x62,0x0a,-256,502)}
for at,wanted in checks.items():assert get(at)==wanted,(hex(at),get(at),wanted)
prior=read(R/'work/parallel-main-route-pool-balances/ORIGINAL01.json');targets=prior['preserved_mixed_sub_rows'];assert len(targets)==13
assert Counter(x['original'][1]for x in targets)==Counter({'502':11,'294':2})
logs_path=R/'work/parallel-main-integration/round46-ordinary-log-mismatches.jsonl.gz'
with gzip.open(logs_path,'rt')as f:logs=[json.loads(line)for line in f]
current={r['row']:r for r in logs if r['row']in{x['row']for x in targets}};assert len(current)==13
assert all(r['family']=='source_file_path_only'for r in current.values())
shutil.copytree(BASE,S)
p=S/'src/trade_v3.rs';text=p.read_text()
old='fn sub3(a:u64,b:u64,c:u64)->Result<u64>'
assert text.count(old)==1;text=text.replace(old,'pub(crate) '+old,1)
old_body='''    let pool_base = sub(base_vault_amount,base_amount)?;
    let pool_quote = sub(add(real_quote_reserves,quote_amount)?,if native{migration_fee}else{0})?;
'''
new_body='''    let pool_base = base_vault_amount.checked_sub(base_amount).ok_or_else(||error!(PumpError::Overflow))?;
    let pool_quote = real_quote_reserves.checked_add(quote_amount).ok_or_else(||error!(PumpError::Overflow))?;
    let pool_quote = if native {
        pool_quote.checked_sub(migration_fee).ok_or_else(||error!(PumpError::Overflow))?
    } else {pool_quote};
'''
assert text.count(old_body)==1;text=text.replace(old_body,new_body,1)
old_import='use crate::multi_hop_curve::{add,n,sub};';assert text.count(old_import)==1;text=text.replace(old_import,'use crate::multi_hop_curve::{n,sub};',1)
p.write_text(text)
p=S/'src/multi_hop_curve_swap.rs';text=p.read_text()
replacements={
 'let q = sub(sub(trade_amount,pf)?,cf)?;':'let q = crate::trade::sub3(trade_amount,pf,cf)?;',
 'let net = sub(sub(gross_sell,pf)?,cf)?;':'let net = crate::trade::sub3(gross_sell,pf,cf)?;',
}
for old,new in replacements.items():assert text.count(old)==1;text=text.replace(old,new,1)
p.write_text(text)
after=inv(S);changed={n:h for n,h in after.items()if before.get(n)!=h};assert set(changed)=={'src/trade_v3.rs','src/multi_hop_curve_swap.rs'}and len(after)==65 and inv(BASE)==before
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed));(W/'bounded-arithmetic01.patch').write_text(patch)
proof={'status':'source_only_static_proposal','original_sha256':sha(R/'evidence/original/pump/deployed.so'),'frozen_r47_source':str(BASE.relative_to(R)),'original_boundaries':{},'instruction_checks':{hex(at):list(v)for at,v in checks.items()},'sub3_difference':c[0]['different_slots'],'target_rows':targets,'current_r46_rows':list(current.values()),'ownership_inference':['0x82128 owns inline checked base subtraction, quote addition and native-only migration-fee subtraction; it contains five trade_v3 source locations and three original callers.','0x80488 owns two ordered checked subtractions and one shared error construction. Existing trade::sub3 has the same complete 576-byte normalized body except Source.line 294 versus 67.','The two route nested-sub sites represent the same three-operand checked subtraction. Only those sites are redirected; all generic multi_hop sub/add definitions and remaining callers are untouched.'],'limits':['Original source spelling and helper name are inferred.','No line padding or arbitrary Source.line manipulation is proposed; body identity remains subject to a future approved build.','Original 0x80488 has a fourth caller from 0x83088, whose broader source-body recovery remains outside this bounded patch.','No new transaction, VM, compiler, runtime result or case addition.']}
for at in[0x80488,0x82128]:
 win=windows[at];proof['original_boundaries'][hex(at)]={'bytes':win['bytes'],'body_sha256':hashlib.sha256(body(raw,ss,at,win['bytes'])).hexdigest(),'filename_references':[hex(at+o['offset'])for o in win['original_operands']if o['kind']=='elf-pointer'and o['value']==0x1b723b],'callers':[{'window':hex(r['start']),'site':hex(r['start']+o['offset'])}for r in inventory['windows']for o in r['original_operands']if o['kind']=='direct-call'and o['target']==at]}
(W/'EVIDENCE01.json').write_text(json.dumps(proof,indent=2)+'\n')
stage={'status':'source_only_review_ready_unbuilt','source':str(S.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'patch_sha256':sha(W/'bounded-arithmetic01.patch'),'evidence_sha256':sha(W/'EVIDENCE01.json'),'new_cases':0,'intended_origin_repairs':13,'preserved_generic_sub_definition':True,'preserved_generic_add_definition':True,'required_gate':'Independent source review before any mapped build; retain all prior 823 normalized/165 raw identities and runtime/log cohorts.'}
(W/'STAGED01.json').write_text(json.dumps(stage,indent=2)+'\n')
(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in['stage01.py','bounded-arithmetic01.patch','EVIDENCE01.json','STAGED01.json','SUB3-COMPARISON01.json']},indent=2)+'\n')
print({'stage_sha256':sha(W/'STAGED01.json'),'evidence_sha256':sha(W/'EVIDENCE01.json'),'patch_sha256':sha(W/'bounded-arithmetic01.patch'),'inputs':len(after),'changed':list(changed)})
