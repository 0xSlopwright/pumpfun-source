"""Reconstruct the shared fee-recipient prefix with the observed guard order."""
from pathlib import Path
import difflib,gzip,hashlib,json,shutil,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;BASE=R/'work/parallel-main-r41-composition/source01';S=W/'source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest;from pump_quote_control_function_match import sections;from pump_compare_function_bytes import body
def inv(p):return{str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
before=inv(BASE);assert len(before)==64 and not S.exists();shutil.copytree(BASE,S)
p=S/'src/lib.rs';t=p.read_text();start=t.index('    pub fn set_params(');end=t.index('    pub fn set_mayhem_virtual_params(',start);f=t[start:end]
prefix='''     require_gte!(ctx.remaining_accounts.len(),8,PumpError::NotEnoughRemainingAccounts);
     let rent=Rent::get()?;let mut recipients=[Pubkey::default();8];
     for (i,a) in ctx.remaining_accounts[..8].iter().enumerate(){require!(a.key()!=Pubkey::default(),PumpError::AllFeeRecipientsShouldBeNonZero);if !rent.is_exempt(a.lamports(),a.data_len()){return Err(error!(anchor_lang::error::ErrorCode::ConstraintRentExempt).with_account_name(format!("fee_recipients[{}]",i)));}recipients[i]=a.key();}
     require!(recipients.windows(2).all(|w|w[0]<w[1]),PumpError::UnsortedNotUniqueFeeRecipients);
'''
assert f.count(prefix)==1 and f.count('ctx:Context<SetParams>')==1
replacement='     let recipients=fee_recipient::set_fee_recipients(&mut ctx)?;\n'
f=f.replace('ctx:Context<SetParams>','mut ctx:Context<SetParams>',1).replace(prefix,replacement,1)
assignment='     g.fee_recipient=recipients[0];g.fee_recipients.copy_from_slice(&recipients[1..]);\n';assert f.count(assignment)==1;f=f.replace(assignment,'',1)
p.write_text(t[:start]+f+t[end:])
module=S/'src/fee_recipient.rs';oldmodule=module.read_text();addition='''
pub fn set_fee_recipients(ctx: &mut Context<crate::SetParams>) -> Result<[Pubkey; 8]> {
    require_gte!(ctx.remaining_accounts.len(),8,PumpError::NotEnoughRemainingAccounts);
    let recipients = core::array::from_fn(|index|ctx.remaining_accounts[index].key());
    require!(recipients.iter().all(|key|*key!=Pubkey::default()),PumpError::AllFeeRecipientsShouldBeNonZero);
    let rent = Rent::get()?;
    for (index,account) in ctx.remaining_accounts[..8].iter().enumerate() {
        if !rent.is_exempt(account.lamports(),account.try_data_len()?) {
            return Err(error!(anchor_lang::error::ErrorCode::ConstraintRentExempt).with_account_name(format!("fee_recipients[{}]",index)));
        }
    }
    require!(recipients.windows(2).all(|window|window[0]<window[1]),PumpError::UnsortedNotUniqueFeeRecipients);
    let global = &mut ctx.accounts.global;
    global.fee_recipient=recipients[0];global.fee_recipients.copy_from_slice(&recipients[1..]);
    Ok(recipients)
}
''';module.write_text(oldmodule+addition)
after=inv(S);changed={n:h for n,h in after.items()if before.get(n)!=h};assert set(changed)=={'src/lib.rs','src/fee_recipient.rs'}and len(after)==64
assert module.read_text().startswith(oldmodule)
for n,h in before.items():
 if n not in changed:assert after[n]==h
assert inv(BASE)==before
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed));(W/'fee-recipient-helper.patch').write_text(patch)
original=R/'evidence/original/pump/deployed.so';raw=original.read_bytes();ss=sections(raw);i=read(R/'work/parallel-main-integration/build-round40-identity/normalized-inventory.json');owner=next(x for x in i['windows']if x['start']==0x3e550)
assert owner['bytes']==5664
assert[(hex(owner['start']+o['offset']),o['value'])for o in owner['original_operands']if o['kind']=='elf-pointer'and o['value']==0x1b6d97]==[('0x3ee70',0x1b6d97),('0x3ef88',0x1b6d97),('0x3f820',0x1b6d97)]
def instruction(at):return struct.unpack('<BBhi',body(raw,ss,at,8))
assert instruction(0x3e568)==(0xa5,7,0xf2,8)
calls={owner['start']+o['offset']:o['target']for o in owner['original_operands']if o['kind']=='direct-call'}
assert calls[0x3f030]==0x1a0a20 and calls[0x3e938]==0x1b3678
rent=next(x for x in i['windows']if x['start']==0x1a0a20);assert any('solana_sysvar4rent' in x['symbol']and '3get' in x['symbol']for x in rent['normalized_matches'])
logs=read(R/'work/parallel-main-anchor-source-placements/R40-ANCHOR-ORIGINS.json');rows=[r for r in logs['rows']if any(x['original']=='programs/pump/src/fee_recipient.rs'for x in r['pairs'])];assert len(rows)==14
evidence={'status':'original_instruction_evidence','original_sha256':sha(original),'helper':{'start':'0x3e550','bytes':5664,'raw_sha256':hashlib.sha256(body(raw,ss,0x3e550,5664)).hexdigest(),'caller':'0x1367f8','filename_address':'0x1b6d97','filename_bytes':34,'filename_sites':['0x3ee70','0x3ef88','0x3f820']},'order':['0x3e568: reject fewer than8 accounts','0x3e628..0x3e860: copy8 keys','0x3e938..0x3ec30:8 zero-key comparisons and earlyerror','0x3f030: Rent::get','0x3f0f8..0x3f5d0: each account lamports /try_data_len /Rent::is_exempt','0x3f600..0x3f7c8: ascending-key comparisons','0x3fac8..0x3fb28: global recipient writes','0x3fb30..0x3fb60: copy256-byte recipient result and success tag'],'matched_callees':{hex(at):{'target':hex(calls[at]),'symbols':[v['symbol']for x in i['windows']if x['start']==calls[at]for v in x['normalized_matches']]}for at in[0x3f030,0x3f0f8,0x3f120,0x3f170]},'original_origin_rows':rows,'inferences':['Observed Context-like input offsets+8 accounts,+16 remaining pointer,+24 remaining length motivate borrowing mutable Context.','Writes at accounts+0x190 and+0x1d0 are mapped to global recipient fields through the original set_params outcome and reconstructed Global layout. Historical helper name is not known.']}
(W/'ORIGINAL-ORDER01.json').write_text(json.dumps(evidence,indent=2)+'\n')
staged={'status':'staged_unbuilt_for_review','source':str(S.relative_to(R)),'base_source':str(BASE.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'primary_input_count':64,'patch_sha256':sha(W/'fee-recipient-helper.patch'),'original_order_sha256':sha(W/'ORIGINAL-ORDER01.json'),'behavior_changes':['All8 zero-key guards run before Rent::get and all rent checks, fixing witnessed6028-vs2005 mismatch.','Use original try_data_len Result API before each Rent::is_exempt.','Write global recipient fields inside the shared helper before later scalar set_params validation, matching observed original helper boundary; failed transactions still roll back.'],'preserved':['Existing fee_recipient::validate_fee_recipient source prefix byte-for-byte.','All R41 source files except lib.rs and fee_recipient.rs.','SetParams instruction arguments, account contexts, successful final fields, event construction and emission.','No hardcoded source-origin strings, inline-retention attributes, padding or other-contract changes.'],'limits':['No combined compile or runtime qualification yet.','Final witness corpus addition count awaits full-prestate dedup; no new-case claim from transaction count.','Strict14 origin cases and mixed-error precedence witness required before selection.']}
(W/'STAGED01.json').write_text(json.dumps(staged,indent=2)+'\n');(W/'STAGED-MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in['stage01.py','fee-recipient-helper.patch','ORIGINAL-ORDER01.json','STAGED01.json','probe_order.py','witness01.json.gz','witness01.loader.json']},indent=2)+'\n');print({'patch_sha256':staged['patch_sha256'],'staged_sha256':sha(W/'STAGED01.json'),'manifest_sha256':sha(W/'STAGED-MANIFEST01.json')})
