"""Move only the existing route buy-budget helper to its observed physical source."""
from pathlib import Path
from collections import Counter
import difflib,hashlib,json,re,shutil,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;BASE=R/'work/parallel-main-integration/round43-source/programs/pump';S=W/'source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest;from pump_quote_control_function_match import sections;from pump_compare_function_bytes import body
sys.path.insert(0,str(R/'work/parallel-main-r41-log-oracle'));from paired_receipt_reader import records
def inv(p):return{str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
def function(t,name):
 a=t.index('fn '+name+'(');brace=t.index('{',a);b=brace+1;n=1
 while n:n+=(t[b]=='{')-(t[b]=='}');b+=1
 return a,b,t[a:b]
base=inv(BASE);multi=(BASE/'src/multi_hop_curve_swap.rs').read_text();start,end,helper=function(multi,'buy_budget');original_helper=helper
# R42 used the same helper statements before the independent util-fee import changes.
prior=R/'work/parallel-main-integration/round42-source/programs/pump/src/multi_hop_curve_swap.rs';prior_text=prior.read_text();a,b,prior_helper=function(prior_text,'buy_budget');assert prior_helper==helper
first_line=prior_text[:a].count('\n')+1;last_line=prior_text[:b].count('\n')+1
rx=re.compile(r'AnchorError thrown in (programs/pump/[^ :]+):(\d+)\. Error Code: (\w+)')
target=[];protected=[];remaining=[];counts={}
paths=[R/'work/parallel-main-integration'/('round42-captured-'+g+'.json.gz')for g in['full','additional']]
for path,g,expected in zip(paths,['full','additional'],[10468,7643]):
 count=0
 for _,where,row in records(path):
  count+=1;left=[m.groups()for x in row['original']['logs']if(m:=rx.search(x))];right=[m.groups()for x in row['candidate']['logs']if(m:=rx.search(x))];assert len(left)==len(right)
  for old,new in zip(left,right):
   if new[0]!='programs/pump/src/multi_hop_curve_swap.rs':continue
   ref={'group':g,'row':where,'original':old,'candidate':new}
   if first_line<=int(new[1])<=last_line:
    if old[0]=='programs/pump/src/trade_v3.rs':target.append(ref)
    else:protected.append(ref)
   elif old[0]=='programs/pump/src/trade_v3.rs':remaining.append(ref)
 assert count==expected;counts[g]=count
assert len(target)==96 and not protected and len(remaining)==43
assert Counter(x['original'][2]for x in target)==Counter(BuyNotEnoughSolToCoverFees=95,BuySlippageBelowMinTokensOut=1)
raw=(R/'evidence/original/pump/deployed.so').read_bytes();ss=sections(raw);inventory=read(R/'work/parallel-main-integration/build-round43-identity/normalized-inventory.json');orig=next(x for x in inventory['windows']if x['start']==0x806c8);assert orig['bytes']==1840
callers=[{'function':hex(x['start']),'site':hex(x['start']+o['offset'])}for x in inventory['windows']for o in x['original_operands']if o['kind']=='direct-call'and o['target']==0x806c8]
refs=[hex(orig['start']+o['offset'])for o in orig['original_operands']if o['kind']=='elf-pointer'and o['value']==0x1b723b];assert refs==['0x80bc8','0x80d00']
assert sum(o['kind']=='direct-call'and o['target']==0x88f90 for o in orig['original_operands'])==2
assert not S.exists();shutil.copytree(BASE,S)
comment='// A01: The corrected estimate is checked but not used as the route\'s net quote.\n';assert multi[:start].endswith(comment)
multi=multi[:start-len(comment)]+multi[end:]
marker='use crate::{Global,PumpError};';assert multi.count(marker)==1;multi=multi.replace(marker,marker+'\nuse crate::trade::route_buy_budget::buy_budget;',1)
for name in ['n','sub']:
 old='fn '+name+'(';assert multi.count(old)==1;multi=multi.replace(old,'pub(crate) '+old,1)
(S/'src/multi_hop_curve_swap.rs').write_text(multi)
trade=(BASE/'src/trade_v3.rs').read_text();addition='\npub(crate) mod route_buy_budget {\n    use anchor_lang::prelude::*;\n    use crate::PumpError;\n    use crate::legacy_sell::fee_math::fee;\n    use crate::multi_hop_curve_swap::{n,sub};\n\n'+comment+helper.replace('fn buy_budget(','pub(crate) fn buy_budget(',1)+'\n}\n';(S/'src/trade_v3.rs').write_text(trade+addition)
assert function(multi,'n')[2]==function((BASE/'src/multi_hop_curve_swap.rs').read_text(),'n')[2]
assert function(multi,'sub')[2]==function((BASE/'src/multi_hop_curve_swap.rs').read_text(),'sub')[2]
assert function(trade+addition,'buy_budget')[2]==original_helper
after=inv(S);delta={n:h for n,h in after.items()if base.get(n)!=h};assert set(delta)=={'src/trade_v3.rs','src/multi_hop_curve_swap.rs'}and len(after)==65 and inv(BASE)==base
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(delta));(W/'buy-budget-placement.patch').write_text(patch)
evidence={'status':'source_review_ready_unbuilt','scope':__doc__,'source':str(S.relative_to(R)),'source_before':base,'source_after':after,'changed':delta,'original_helper':{'start':'0x806c8','bytes':1840,'raw_sha256':hashlib.sha256(body(raw,ss,0x806c8,1840)).hexdigest(),'filename_pointer':'0x1b723b','filename_sites':refs,'shared_fee_calls':2,'callers':callers},'runtime_original_source_cohort':{'scanned':counts,'candidate_helper_line_range':[first_line,last_line],'fix_rows':target,'fix_count':96,'already_correct_origins_inside_helper':protected,'unfixed_trade_v3_origin_rows_outside_helper':remaining,'unfixed_count':43},'source_contract':{'helper_body_verbatim':True,'existing_call_site_statement_unchanged':True,'same_fee_helper':True,'same_n_and_sub_functions':True,'n_sub_only_visibility_widened_to_crate':True,'unrelated_R43_source_preserved':True},'new_inputs':0,'patch_sha256':sha(W/'buy-budget-placement.patch'),'limits':['Only96 of139 original trade_v3-to-multi_hop origin rows are in the existing buy_budget helper. The43 remaining rows stay explicitly unresolved.','Historical helper name/module nesting is inferred; original shared function and error filenames are observed.','No build or runtime execution for this source variant.']}
(W/'STAGED01.json').write_text(json.dumps(evidence,indent=2)+'\n');(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in['stage01.py','STAGED01.json','buy-budget-placement.patch']},indent=2)+'\n');print({'fix_count':96,'remaining_count':43,'stage_sha256':sha(W/'STAGED01.json'),'patch_sha256':sha(W/'buy-budget-placement.patch')})
