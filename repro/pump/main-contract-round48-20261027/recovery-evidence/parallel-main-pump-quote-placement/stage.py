"""Selective physical quote-helper extraction from immutable R41 source."""
from pathlib import Path
import difflib,hashlib,json,re,shutil
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
B=R/'work/parallel-main-integration/round41-source/programs/pump';D=W/'source01'
h=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
before={str(p.relative_to(B)):h(p)for p in sorted(B.rglob('*'))if p.is_file()}
assert len(before)==64 and not D.exists()
shutil.copytree(B,D)
path=D/'src/create_v2.rs';original=path.read_text()
mark='mod nested_create {\n';assert original.count(mark)==1
outer,inner=original.split(mark);assert inner.endswith('}\n')
body=inner[:-2]

def extract_function(text,name):
 match=re.search(r'(?m)^fn '+name+r'\b',text);assert match,name
 start=match.start();brace=text.index('{',start);depth=1;i=brace+1
 while depth:
  depth+=(text[i]=='{')-(text[i]=='}');i+=1
 end=i+int(text[i:i+1]=='\n')
 return text[start:end]

names=['overflow','u64_at','key_at','root_seed','vault_amount','pool_record','constant_product','convert','price']
functions={name:extract_function(body,name)for name in names}
record_start=body.index('#[derive(Clone, Copy)]\nenum Record ')
record_end=body.index('\n}\n',record_start)+3
record=body[record_start:record_end]
constants=[]
for prefix in ['const POOL_DISC:', 'const AMM:']:
 match=re.search(r'(?m)^'+re.escape(prefix)+r'.*\n',body);assert match
 constants.append(match.group())
retained=body
for segment in [record,*constants,*functions.values()]:
 assert retained.count(segment)==1
 retained=retained.replace(segment,'',1)

depth_statements='''    let depth = curve.depth.checked_add(1).ok_or_else(overflow)?;
    require_gte!(g.max_curve_depth.min(5), depth, PumpError::CurveDepthExceeded);
'''
assert retained.count(depth_statements)==1
retained=retained.replace(depth_statements,'    let depth = next_depth(&curve, g)?;\n')
imports='use super::pump_quote::{Record, overflow, root_seed, pool_record, price, next_depth};\n'
assert retained.count('use crate::{Global, PumpError};\n')==1
retained=retained.replace('use crate::{Global, PumpError};\n','use crate::{Global, PumpError};\n'+imports,1)

# Existing helper signatures and bodies change only their minimum sibling-module
# visibility. The new depth helper contains the exact two original statements.
exposed={'overflow','root_seed','pool_record','price'}
moved=[]
for name in names:
 text=functions[name]
 if name in exposed:text='pub(super) '+text
 assert text.removeprefix('pub(super) ')==functions[name]
 moved.append(text)
next_depth='pub(super) fn next_depth(curve: &BondingCurve, g: &Global) -> Result<u8> {\n'+depth_statements+'    Ok(depth)\n}\n'
newfile='''use crate::{Global, PumpError};
use crate::trade_types::BondingCurve;
use crate::quote_control::state::control_entry;
use anchor_lang::prelude::*;

'''+''.join(constants)+'\n'+record.replace('enum Record ','pub(super) enum Record ',1)+'\n'+next_depth+'\n'+'\n'.join(moved)
declaration='#[path = "pump_quote.rs"]\nmod pump_quote;\n\n'
changed=outer+declaration+mark+retained+'}\n'
path.write_text(changed);(D/'src/pump_quote.rs').write_text(newfile)
after={str(p.relative_to(D)):h(p)for p in sorted(D.rglob('*'))if p.is_file()}
assert len(after)==65 and set(after)-set(before)=={'src/pump_quote.rs'}
assert [name for name in before if before[name]!=after[name]]==['src/create_v2.rs']
assert before=={str(p.relative_to(B)):h(p)for p in sorted(B.rglob('*'))if p.is_file()}
# All code outside the old nested_create module is exact, apart from its real
# sibling-module declaration. Existing public calls into nested_create survive.
assert changed.split(declaration)[0]==outer
assert original.count('nested_create::')==changed.count('nested_create::')==2
for name in ['decode_curve','ancestor','control_account']:
 old=extract_function(body,name)if name!='control_account'else None
 if old:assert old in retained
assert 'pub(super) fn control_account' in retained
assert 'pub(super) fn walk' in retained
patch=''
for name in ['src/create_v2.rs','src/pump_quote.rs']:
 old=(B/name).read_text()if(B/name).exists()else'';new=(D/name).read_text()
 patch+=''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+name if old else'/dev/null',tofile='b/'+name))
(W/'pump-quote-helpers01.patch').write_text(patch)
result={'status':'staged_unbuilt','baseline':str(B.relative_to(R)),'source':str(D.relative_to(R)),
 'baseline_sha256':before,'source_sha256':after,'changes':{name:{'before':before.get(name),'after':after[name]}for name in after if before.get(name)!=after[name]},
 'moved_helper_bodies_verbatim':names,'minimum_visibility_additions':sorted(exposed)+['Record'],
 'new_natural_helper':{'name':'next_depth','original_window':'0x60a80/1120B','statements_verbatim':True,'caller_change':'two depth statements replaced by next_depth(&curve, g)?'},
 'retained_in_create_v2':['ancestor','decode_curve','control_account','walk and its remaining admission/iteration checks'],
 'public_caller_abi_unchanged':True,'outside_nested_module_unchanged':True,
 'original_source_baseline_candidate':'f169345d952b0e2a8ba6cbd400ab2decca0bee97bdc6645240466d901e4f1bc0',
 'no_padding_no_line_directives_no_elf_edit':True,'patch_sha256':h(W/'pump-quote-helpers01.patch'),
 'inputs':{str(p.relative_to(R)):h(p)for p in [Path(__file__),W/'ORIGINAL-FILENAME-OWNERS.json',W/'ORIGINAL-CALLGRAPH.json']},
 'next':'Independent source review before any compiler. Require all prior normalized/raw sets and full Rust Location fields retained; check all92 desired Anchor origins plus every protected create_v2 origin in existing runtime suites.'}
(W/'STAGED01.json').write_text(json.dumps(result,indent=2)+'\n')
print({'source_files':65,'moved_functions':len(names),'staged_sha256':h(W/'STAGED01.json'),'patch_sha256':h(W/'pump-quote-helpers01.patch')})
