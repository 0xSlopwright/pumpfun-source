from pathlib import Path
import hashlib,importlib.util,json,shutil
W=Path(__file__).resolve().parent;R=W.parents[1];H=R/'repro/pump_amm/incentive-order-recovery-20261027';L=H/'results/new-proofs/lineage';C=W/'checkpoint/results/new-proofs/lineage'
s=importlib.util.spec_from_file_location('materialize_lineage',W/'proposed/materialize_lineage.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
record=m.omission_record(H,repository_root=R);(W/'lineage-omissions.json').write_text(json.dumps(record,indent=2)+'\n')
actual={str(p.relative_to(C))for p in C.rglob('*')if p.is_file()};checks=[]
for label,replaced in [('freeze',()),('finalize',('range-joint','independent-range','incentive-order'))]:
 planned=[];dst=W/('planned-'+label)
 def record_copy(a,b):planned.append(str(Path(a).relative_to(L)));return b
 shutil.copytree(L,dst,ignore=m.lineage_ignore(L,replaced),copy_function=record_copy)
 expected={name for name in actual if name.split('/')[0]not in replaced}
 assert set(planned)==expected
 shutil.rmtree(dst)
 checks.append({'phase':label,'planned_files':len(planned),'planned_file_list_sha256':hashlib.sha256(json.dumps(sorted(planned),separators=(',',':')).encode()).hexdigest(),'matches_verified_retained_tree':True,'replaced':list(replaced)})
assert sum(x['bytes']for x in record['omitted'])==2778726394 and len(record['omitted'])==21
out={'passed':True,'checks':checks,'omitted_directories':len(record['omitted']),'omitted_bytes':sum(x['bytes']for x in record['omitted']),'omitted_files':sum(x['files']for x in record['omitted'])};(W/'filter-verification.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
