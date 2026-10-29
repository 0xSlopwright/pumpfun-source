from pathlib import Path
import difflib,hashlib,importlib.util,json,sys
sys.dont_write_bytecode=True
def h(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def j(p):return json.loads(Path(p).read_bytes())
def module(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def verify(root=None):
 w=Path(root or Path(__file__).resolve().parent);sys.path.insert(0,str(w));files=j(w/'manifest.json')['files'];assert files=={str(p.relative_to(w)):h(p)for p in w.rglob('*')if p.is_file()and p!=w/'manifest.json'}
 c=w/'build/artifacts/pump_amm_recovered.so';s=w/'build/artifacts/unstripped.so';assert h(c)=='7dae41eb0ea37feba498bc601c7e358b376fc523944b6dbaaf102309e97098cd'
 old=j(w/'base-build.json');record=j(w/'build/build-comparison.json');assert record['returncode']==0 and record['source_unchanged']and record['source_sha256']==record['source_after_sha256']
 assert record['dependency_cache_before']==record['dependency_cache_after']==old['dependency_cache_after']and len(record['dependency_cache_before'])==765
 module('base_dependency',w/'base-dependency/verify.py').verify(w/'base-canonical',w/'base-build.json',w/'base-dependency')
 source=module('gate_binding',w/'verify_source_binding.py').verify(w/'canonical-source',w/'source',w/'build/build-comparison.json',c,s,w/'base-dependency')
 assert source['total_compiled_inputs_verified']==232
 before={str(p.relative_to(w/'base-source')):h(p)for p in(w/'base-source').rglob('*')if p.is_file()};after={str(p.relative_to(w/'source')):h(p)for p in(w/'source').rglob('*')if p.is_file()};changed=[n for n in before if before[n]!=after[n]]
 assert changed==['programs/pump-amm/src/instructions/swap/multi_hop_swap.rs'];n=changed[0]
 assert ''.join(difflib.unified_diff((w/'base-source'/n).read_text().splitlines(True),(w/'source'/n).read_text().splitlines(True),fromfile='a/'+n,tofile='b/'+n))==(w/'recovery.patch').read_text()
 from elf_reader import Elf
 import measure
 o=Elf(w/'original.so');ce=Elf(c);se=Elf(s);be=Elf(w/'baseline-artifacts/pump_amm_recovered.so');bs=Elf(w/'baseline-artifacts/unstripped.so')
 metric,rows=measure.measured(o,ce,se,be,bs);assert metric==j(w/'measurement.json')and metric|{'rows':rows}==j(w/'measurement-full.json')
 assert(metric['normalized'],metric['raw'])==(660,159)and not metric['normalized_gains']and not metric['normalized_losses']and not metric['raw_losses']
 f=next(x for x in se.funcs if'14apply_hop_fees'in x['name']);assert f['size']==480 and ce.normalized[f['start']:f['start']+216]==o.normalized[0x44ab0:0x44ab0+216]
 model=module('mask_model',w/'verify_model.py').verify(c,s);assert model['success_cases']==2072 and model['error_cases']==8
 runtime=module('mask_runtime',w/'focused/verify.py').verify(w/'focused',c);assert runtime['cases']==582 and runtime['mismatches']==0
 context=module('mask_context',w/'context-proof/verify_parent.py');_,ctx=context.receipts(w/'context-proof','current',h(c),[]);assert ctx['cases']==72 and ctx['mismatch_indices']==[]
 return {'passed':True,'candidate_sha256':h(c),'normalized_windows':660,'raw_windows':159,'new_matches':0,'lost_matches':0,'helper_bytes':480,'original_helper_bytes':536,'source_inputs':232,'unchanged_dependencies':765,'interpreter_success_cases':2072,'interpreter_error_cases':8,'runtime_cases':654,'runtime_signatures':runtime['verified_signatures']+ctx['signatures'],'source_selected':False,'whole_elf_identity':False,'build_or_runtime_executed_by_verifier':False,'manifest_sha256':h(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
