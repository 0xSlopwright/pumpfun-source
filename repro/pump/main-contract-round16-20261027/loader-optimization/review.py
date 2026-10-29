from pathlib import Path
import json,gzip,hashlib,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sys.path.insert(0,str(R/'scripts'))
from pump_diagnostic_audit import audit
read=lambda p:json.loads(gzip.decompress(p.read_bytes())if p.suffix=='.gz'else p.read_bytes())
base=read(R/'work/parallel-main-integration/round13-captured-full.json.gz');rows=[];new_suites={}
for name,suite,count in [('quote','quote_control',507),('sell','sell',301),('migrate','migration',228)]:
 new=read(W/(name+'.json.gz'));old=base['suites'][suite];field='results'if 'results'in old else'cases'
 assert new[field]==old[field],(suite,'case evidence differs')
 old_load=read(R/'work/parallel-main-integration/round13-captured-full.json.gz.suites'/(suite+'.loader.json'));new_load=read(W/(name+'.loader.json'))
 assert old_load['loads']==new_load['loads'],(suite,'loader evidence differs')
 assert len(new[field])==count
 new_suites[suite]=new;rows.append({'suite':suite,'cases':count,'complete_per_case_results_identical':True,'all_loader_records_identical':True,'loads':len(new_load['loads'])})
diag=audit(new_suites);assert not diag['mismatches'];b=read(W/'benchmark.json');out={'scope':'Optimized expected-image cache, while verifying actual full ProgramData bytes and owner on every load. No target/VM behavior changes.','suites':rows,'cases':sum(r['cases']for r in rows),'diagnostic_cases':diag['log_bearing_cases'],'baseline_candidate_sha256':base['candidate_sha256'],'controlled_load_speed_ratio':b['speed_ratio'],'negative_controls':len(b['negative_controls']),'inputs':{str(p.relative_to(R)):hashlib.sha256(p.read_bytes()).hexdigest()for p in [W/'pump_captured_loader.py',W/'pump_with_captured_loader.py',W/'benchmark.py',W/'review.py']}}
(W/'REVIEW.json').write_text(json.dumps(out,indent=2)+'\n');print(out)
