"""Portable evidence for the V2 Context control and unbuilt visibility refinement."""
from pathlib import Path
import argparse,hashlib,json,sys,types
W=Path(__file__).resolve().parent
SHA='3c263d0dbc5422c0c191842527df4da562a905511411b0b8c256316fee8600be'
PATCH='f7bbac60914fb1bfe34a58253e99d1d0be9ac8fa0cfda8be93f012326a5e3c5d'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(name):
 p=W/name;m=types.ModuleType('saved_'+p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m
def body(text,name):
 start=text.index('pub fn '+name+'(');op=text.index('{',start);depth=0
 for p in range(op,len(text)):
  if text[p]=='{':depth+=1
  elif text[p]=='}':
   depth-=1
   if not depth:return text[start:p+1]
 raise AssertionError(name)
def verify(root):
 root=Path(root);sys.path[:0]=[str(W),str(W/'reader')];assert json.loads((W/'manifest.json').read_bytes())['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 from elf_reader import Elf
 C=W/'build-fixed/artifacts/pump_amm_recovered.so';S=W/'build-fixed/artifacts/unstripped.so';assert sha(C)==SHA and sha(W/'recovery-refined.patch')==PATCH
 binding=module('verify_source_binding.py').verify(W/'canonical-source',W/'source',W/'build-fixed/build-comparison.json',C,S,W/'dependency-proof');assert(binding['standalone_inputs'],binding['workspace_inputs'],binding['external_inputs_verified'])==(51,52,175)
 dep=module('dependency-proof/verify.py').verify(W/'canonical-source',W/'build-fixed/build-comparison.json');assert dep['unchanged_dependency_artifacts']==762
 measure=module('verify_measurement.py').verify(root,C,S,W/'baseline/candidate.so',W/'baseline/unstripped.so');assert measure==json.loads((W/'measurement.json').read_bytes())
 old=(W/'baseline-source/programs/pump-amm/src/trade.rs').read_text();new=(W/'source/programs/pump-amm/src/instructions/swap/trade_v2.rs').read_text()
 for name in['execute_sell','execute_buy','execute_buy_exact_quote']:assert body(old,name)==body(new,name)
 expected='    pub fn total_user_quote(&self) -> Result<u64> {';replacement='    pub(crate) fn total_user_quote(&self) -> Result<u64> {'
 for p in(W/'source').rglob('*'):
  if not p.is_file():continue
  rel=p.relative_to(W/'source');other=W/'source-refined'/rel
  if str(rel)=='programs/pump-amm/src/instructions/swap/trade_v2.rs':assert other.read_text()==p.read_text().replace(expected,replacement)
  else:assert p.read_bytes()==other.read_bytes()
 for stem in['private','public']:
  ir=(W/'diagnostic'/f'{stem}.ll').read_text();line=next(x for x in ir.splitlines()if x.startswith('define')and'handler'in x)
  if stem=='private':assert'%ctx.8.val'in line and'%ctx.33.val'in line
  else:assert'dereferenceable(40) %ctx'in line
 obj=module('object_reader.py');method=[]
 for stem,size in[('method_private_multi',624),('method_public_multi',640)]:
  functions=[f for f in obj.sections(W/'diagnostic'/f'{stem}.o')if'total_user_quote'in f['name']];assert len(functions)==1 and functions[0]['size']==size
  ir=(W/'diagnostic'/f'{stem}.ll').read_text();line=next(x for x in ir.splitlines()if x.startswith('define')and'total_user_quote'in x)
  if stem=='method_private_multi':assert'%self.72.val'in line and'%self.80.val'in line
  else:assert'dereferenceable(96) %self'in line
  method.append(size)
 runtime=module('verify65.py').verify(W/'runtime-inputs',C,W/'runtime65');assert runtime==json.loads((W/'runtime65-verification.json').read_bytes())
 o,c,s=Elf(root/'evidence/original/pump_amm/deployed.so'),Elf(C),Elf(S);fs={f['start']:f for f in s.funcs};calls=json.loads((W/'wrapper-calls.json').read_bytes());exact=unequal=0
 for row in calls:
  a=row['original'];f=row['candidate'];b=f['start'];assert f['size']==1064 and o.normalized[a:a+1064]==c.normalized[b:b+1064]and o.pattern(a,1064)==c.pattern(b,1064)
  for q in row['calls']:
   ot,ct=o.calls[a+q['offset']],c.calls[b+q['offset']];g=fs[ct];n=q['original_bytes'];match=n==g['size']and o.normalized[ot:ot+n]==c.normalized[ct:ct+n]and o.pattern(ot,n)==c.pattern(ct,n);assert match==q['equal'];exact+=match;unequal+=not match
 return {'passed':True,'manifest_sha256':sha(W/'manifest.json'),'negative_control_candidate':SHA,'normalized':649,'raw':148,'gained_v2_wrappers':3,'known_preview_loss':'0x565e8','exact_wrapper_callees':exact,'unequal_handler_callees':unequal,'refined_source_built':False,'refined_patch_sha256':PATCH,'method_object_sizes':method,'focused_cases':65,'focused_signatures':130,'source_inputs':227,'dependency_artifacts':762,'scope':'One valid full module control plus preserved initial parse failure; pub(crate) method refinement has direct-object ABI support but awaits integrated full build.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
