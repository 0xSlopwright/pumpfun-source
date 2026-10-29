"""Verify the frozen fourth-wave source, builds, helpers, closure and372 cases offline."""
from pathlib import Path
import argparse,collections,hashlib,json,sys,types
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent
CANDIDATE='3fcae02128464717b29a0b3842fbba993d5d0befb4362c4094c8af8e32a8589d'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(p):
 p=Path(p);m=types.ModuleType('frozen_'+p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def verify(root):
 root=Path(root).resolve();manifest=json.loads((W/'manifest.json').read_bytes());files={str(p.relative_to(W))for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'};assert files==set(manifest['files'])
 for name,h in manifest['files'].items():assert sha(W/name)==h,name
 candidate=W/'build/artifacts/pump_amm_recovered.so';symbols=candidate.with_name('unstripped.so');assert sha(candidate)==CANDIDATE
 for name in ['pump_amm_recovered.so','unstripped.so']:assert (W/'build/artifacts'/name).read_bytes()==(W/'build-repeat/artifacts'/name).read_bytes()
 binding=module(W/'verify_binding.py').verify(W)
 ep=module(W/'verify_entrypoint.py').verify(root,candidate,symbols);helpers=module(W/'verify_helpers.py').verify(root,candidate,symbols);payout=module(W/'verify_payout.py').verify(root,candidate,symbols)
 assert payout==json.loads((W/'payout-verification.json').read_bytes());assert payout['boost_guard']['size']==1464 and payout['boost_guard_relocation_pattern_equal']and [x['offset']for x in payout['boost_guard_normalized_differences']]==[528,1208]
 ata=module(W/'ata-runtime/verify.py').verify(W/'ata-runtime',candidate);resize=module(W/'resize-runtime/verify.py').verify(W/'resize-runtime',candidate);entry=module(W/'verify_runtime.py').verify(root,candidate,W/'entrypoint-runtime');boost=module(W/'boost-kit/verify.py').verify_output(W/'boost-kit',candidate,W/'boost-runtime')
 sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 o=Elf(root/'evidence/original/pump_amm/deployed.so');c=Elf(candidate);s=Elf(symbols);rows=json.loads((W/'audit/measurement.json').read_bytes())['rows'];index=collections.defaultdict(list)
 for f in s.funcs:index[(f['size'],c.normalized[f['start']:f['start']+f['size']],json.dumps(c.pattern(f['start'],f['size']),sort_keys=True))].append(f)
 count=raw=0
 for row in rows:
  a,z=row['start'],row['end'];matches=index[(z-a,o.normalized[a:z],json.dumps(o.pattern(a,z-a),sort_keys=True))];assert matches==row['matches'];count+=bool(matches);raw+=any(o.b[a:z]==c.b[f['start']:f['start']+z-a]for f in matches)
 assert len(rows)==785 and count==642 and raw==129
 a=module(W/'tools/audit.py');a.ROOT=root;a.ORIGINAL=root/'evidence/original/pump_amm/deployed.so';cl=a.analyze(candidate,symbols,W/'audit/measurement.json');assert cl==json.loads((W/'audit/call-closure.json').read_bytes())
 d=module(W/'tools/descriptors.py');d.ROOT=root;ds=d.analyze(candidate,symbols,cl);assert ds==json.loads((W/'audit/descriptors.json').read_bytes())
 t=module(W/'tools/targets.py');t.ROOT=root;closed=t.analyze(candidate,symbols,cl,ds);assert closed==json.loads((W/'audit/data-closure.json').read_bytes());assert closed['counts']['bounded_static_closed_windows']==585
 getter=module(W/'tools/getter.py').verify(root,candidate,symbols);event=module(W/'tools/event.py').verify(root,candidate,symbols)
 assert getter==json.loads((W/'audit/getter.json').read_bytes())and event==json.loads((W/'audit/event.json').read_bytes())
 calls=json.loads((W/'callee-closure.json').read_bytes());guard=payout['boost_guard'];oc=o.callsites(0x62688,1464);cc=c.callsites(guard['start'],guard['size']);assert len(oc)==len(cc)==len(calls['boost_callees'])==11
 for x,y,saved in zip(oc,cc,calls['boost_callees']):
  n=saved['candidate']['size'];assert x['offset']==y['offset']==saved['offset']and x['target']==saved['original_target']and y['target']==saved['candidate_target'];assert o.normalized[x['target']:x['target']+n]==c.normalized[y['target']:y['target']+n]and o.pattern(x['target'],n)==c.pattern(y['target'],n)
 cases=ata['cases']+resize['cases']+entry['cases']+boost['cases'];signatures=ata['verified_signatures']+resize['verified_signatures']+entry['signatures_verified']+boost['signatures'];assert(cases,signatures)==(372,768)
 return {'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':CANDIDATE,'strict_repeat_identical':True,'binding':binding,'normalized_windows':642,'raw_windows':129,'bounded_static_closed_windows':585,'source_coordinate_descriptor_differences':12,'additional_boost_line_differences':2,'payout_exact_normalized_bytes':2536,'entrypoint_equal_descriptors':ep['source_descriptors_equal'],'ata_exact_normalized_bytes':helpers['exact_normalized_bytes'],'runtime':{'cases':cases,'signatures':signatures,'ata':{k:v for k,v in ata.items()if k not in ['messages','originals']},'resize':{k:v for k,v in resize.items()if k not in ['messages','originals']},'entrypoint':entry,'boost':boost},'scope':'Unpromoted fourth-wave packet; bounded static/captured-runtime proof, no full ELF identity or live-chain claim.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
