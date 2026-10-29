"""Restore the observed physical source file for legacy creator collection."""
from pathlib import Path
import difflib,hashlib,json,re,shutil,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
BASE=R/'work/parallel-main-integration/round43-source/programs/pump';S=W/'source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
sys.path.insert(0,str(R/'scripts'))
from build_source_manifest import source_manifest
from pump_quote_control_function_match import sections
from pump_compare_function_bytes import body
sys.path.insert(0,str(R/'work/parallel-main-r41-log-oracle'))
from paired_receipt_reader import records
def inv(p):return{str((R/n).relative_to(p)):v for n,v in source_manifest(p,p,R).items()}
before=inv(BASE);assert len(before)==65 and not S.exists()
rx=re.compile(r'AnchorError thrown in (programs/pump/[^:]+):(\d+)\. Error Code: ([^.]+)')
observed=[];target='programs/pump/src/creator/collect_creator_fee.rs'
for file in ['round42-captured-full.json.gz','round42-captured-additional.json.gz']:
 for _,where,row in records(R/'work/parallel-main-integration'/file):
  old=[rx.search(x).groups()for x in row['original']['logs']if rx.search(x)]
  new=[rx.search(x).groups()for x in row['candidate']['logs']if rx.search(x)]
  for a,b in zip(old,new):
   # The entire legacy function is lines246..256 in frozen R42/R43.
   if b[0]=='programs/pump/src/lib.rs'and 246<=int(b[1])<=256:
    assert a[0]==target,(file,where,a,b)
    observed.append({'file':file,'row':where,'original':a,'candidate':b})
assert len(observed)==8,len(observed)
shutil.copytree(BASE,S)
p=S/'src/lib.rs';text=p.read_text();begin=text.index('    pub fn collect_creator_fee(');end=text.index('    pub fn collect_creator_fee_v2(',begin);original=text[begin:end]
header='    pub fn collect_creator_fee(ctx:Context<CollectCreatorFee>)->Result<()>{'
assert original.startswith(header)
assert len(re.findall(r'pub fn ',original))==1
relocated=original.replace(header,'pub fn execute_legacy(ctx:Context<crate::CollectCreatorFee>)->Result<()>{',1)
q=S/'src/creator/collect_creator_fee.rs';old=q.read_text();q.write_text(old+'\nuse crate::PumpError;\n\n'+relocated)
p.write_text(text[:begin]+'    pub fn collect_creator_fee(ctx:Context<CollectCreatorFee>)->Result<()>{collect_v2::execute_legacy(ctx)}\n'+text[end:])
after=inv(S);changed={n:h for n,h in after.items()if before.get(n)!=h}
assert len(after)==65 and set(changed)=={'src/lib.rs','src/creator/collect_creator_fee.rs'}
assert q.read_text().startswith(old) and relocated in q.read_text() and inv(BASE)==before
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed));(W/'legacy-collection-origin01.patch').write_text(patch)
original_file=R/'evidence/original/pump/deployed.so';raw=original_file.read_bytes();ss=sections(raw);needle=target.encode();at=raw.index(needle);addr=next(v['addr']+at-v['offset']for v in ss.values()if v['offset']<=at<v['offset']+v['size'])
iv=json.loads((R/'work/parallel-main-integration/build-round42/normalized-inventory.json').read_text());owners=[{'start':hex(r['start']),'bytes':r['bytes'],'raw_sha256':hashlib.sha256(body(raw,ss,r['start'],r['bytes'])).hexdigest(),'filename_sites':[hex(r['start']+v['offset'])for v in r['original_operands']if v['kind']=='elf-pointer'and v['value']==addr]}for r in iv['windows']if any(v['kind']=='elf-pointer'and v['value']==addr for v in r['original_operands'])];assert owners
e={'original_sha256':sha(original_file),'filename':target,'filename_address':hex(addr),'original_filename_owners':owners,'observations':observed,'observed_case_count':8,'scope':'Physical file ownership only; no changed transaction input or payout behavior.'};(W/'EVIDENCE01.json').write_text(json.dumps(e,indent=2)+'\n')
s={'status':'source-only; unbuilt','base_source':str(BASE.relative_to(R)),'source':str(S.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'body_verbatim_except_function_header':True,'existing_V2_module_unchanged_prefix':True,'expected_origin_fixes':8,'patch_sha256':sha(W/'legacy-collection-origin01.patch'),'evidence_sha256':sha(W/'EVIDENCE01.json'),'limits':['Requires independent source review and full compiler/runtime qualification.','Original helper name/ABI remain inferred; source origin does not prove byte identity.']};(W/'STAGED01.json').write_text(json.dumps(s,indent=2)+'\n');(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in ['stage01.py','legacy-collection-origin01.patch','EVIDENCE01.json','STAGED01.json']},indent=2)+'\n');print({'staged':sha(W/'STAGED01.json'),'patch':sha(W/'legacy-collection-origin01.patch'),'cases':8})
