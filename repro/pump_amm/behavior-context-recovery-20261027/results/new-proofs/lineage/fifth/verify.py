"""Verify the fifth-wave source/build/static and focused-runtime packet offline."""
from pathlib import Path
import argparse,hashlib,json,sys,types
W=Path(__file__).resolve().parent
sys.dont_write_bytecode=True
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(p):
 p=Path(p);m=types.ModuleType('sealed_'+p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def verify(root):
 root=Path(root).resolve();manifest=json.loads((W/'manifest.json').read_bytes());files={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'};assert files==manifest['files']
 candidate=W/'build/artifacts/pump_amm_recovered.so';symbols=candidate.with_name('unstripped.so');assert sha(candidate)=='7f501a865b83cf1dfbc4072191967162c700d3e7e487d2f6400e8d230f15ca62'
 for n in ['pump_amm_recovered.so','unstripped.so']:assert(W/'build/artifacts'/n).read_bytes()==(W/'build-repeat/artifacts'/n).read_bytes()
 binding=module(W/'verify_binding.py').verify(W)
 composition=json.loads((W/'composition.json').read_bytes());source=W/'source';assert{str(p.relative_to(source)):sha(p)for p in source.rglob('*')if p.is_file()}==composition['after']
 for p in composition['patches']:assert sha(W/'patches'/(p['label']+'.patch'))==p['sha256']
 fields=module(W/'field-evidence/verify.py').verify(root,W/'field-evidence')
 init=module(W/'verify_init_static.py').verify(root,candidate,symbols,W/'baseline-measurement.json');assert init==json.loads((W/'init-static.json').read_bytes())
 claim=module(W/'claim-kit/verify_static.py').verify(root/'evidence/original/pump_amm/deployed.so',candidate,symbols);assert claim==json.loads((W/'claim-static.json').read_bytes())
 entry=module(W/'verify_entrypoint.py').verify(root,candidate,symbols);ata=module(W/'verify_helpers.py').verify(root,candidate,symbols);payout=module(W/'verify_payout.py').verify(root,candidate,symbols)
 i=module(W/'init-kit/verify.py').verify_output(W/'init-kit',candidate,W/'init-runtime');c=module(W/'claim-kit/verify.py').verify_output(W/'claim-kit',candidate,W/'claim-runtime');r=module(W/'reserved-kit/verify.py').verify_output(W/'reserved-kit',candidate,W/'reserved-runtime');baseline=module(W/'reserved-kit/verify.py').verify(W/'reserved-kit')
 assert i==json.loads((W/'init-runtime/verification.json').read_bytes())and c==json.loads((W/'claim-runtime/verification.json').read_bytes())and r==json.loads((W/'reserved-runtime/verification.json').read_bytes())
 assert i['cases']+c['cases']+r['cases']==56 and i['signatures']+c['signatures']+r['signatures']==112 and baseline['mismatches']==11
 a=module(W/'tools/audit.py');a.ROOT=root;a.ORIGINAL=root/'evidence/original/pump_amm/deployed.so';cl=a.analyze(candidate,symbols,W/'audit/measurement.json');assert cl==json.loads((W/'audit/call-closure.json').read_bytes())
 d=module(W/'tools/descriptors.py');d.ROOT=root;ds=d.analyze(candidate,symbols,cl);assert ds==json.loads((W/'audit/descriptors.json').read_bytes())
 t=module(W/'tools/targets.py');t.ROOT=root;closed=t.analyze(candidate,symbols,cl,ds);assert closed==json.loads((W/'audit/data-closure.json').read_bytes());assert closed['counts']['bounded_static_closed_windows']==585
 getter=module(W/'tools/getter.py').verify(root,candidate,symbols);event=module(W/'tools/event.py').verify(root,candidate,symbols)
 return{'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':sha(candidate),'strict_repeat_identical':True,'binding':binding,'normalized_windows':642,'raw_windows':129,'no_gains_or_losses':True,'bounded_static_closed_windows':585,'recognized_coordinate_differences':12,'additional_origin_gaps':{'boost_line_stores':len(payout['boost_guard_normalized_differences']),'init_boost_helper':init['helper_difference_offsets']},'init_boost_helper_bytes':init['arithmetic_helper']['size'],'init_boost_handler_bytes':init['handler']['size'],'claim_transfer_bytes':claim['helper']['size'],'entrypoint_equal_descriptors':entry['source_descriptors_equal'],'ata_helper_bytes':ata['exact_normalized_bytes'],'runtime':{'cases':56,'signatures':112,'init':i,'claim':c,'reserved':r,'reserved_642_baseline':baseline},'scope':'Unpromoted fifth-wave composition, exact-input repeat, bounded static and captured-runtime evidence. Full original ELF is unequal; root owns full-corpus acceptance.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
