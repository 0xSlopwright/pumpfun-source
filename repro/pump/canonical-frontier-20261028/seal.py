#!/usr/bin/env python3
"""Retain the actual maintained build/repeat and final-image runtime evidence."""
from pathlib import Path
import gzip,hashlib,io,json,shutil,tarfile
P=Path(__file__).resolve().parent;R=P.parents[2];W=R/'work/pump-canonical-frontier-20261028';sha=lambda b:hashlib.sha256(b).hexdigest()
def archive(path,files):
 raw=io.BytesIO()
 with tarfile.open(fileobj=raw,mode='w')as t:
  for n,b in sorted(files.items()):
   i=tarfile.TarInfo(n);i.size=len(b);i.mode=0o644;i.mtime=0;t.addfile(i,io.BytesIO(b))
 path.write_bytes(gzip.compress(raw.getvalue(),mtime=0))
records=[]
for stage,source in [('primary','maintained04-with616'),('repeat','maintained05-with616-repeat')]:
 src=W/source;out=P/'builds'/stage;out.mkdir(parents=True,exist_ok=True)
 for name in ['build-attempt.json','build-comparison.json','executed-builder.py','clean.log']:shutil.copy2(src/name,out/name)
 for name in ['build.log','candidate.so','unstripped.so']:(out/(name+'.gz')).write_bytes(gzip.compress((src/name).read_bytes(),mtime=0))
 record=json.loads((src/'build-comparison.json').read_text());records.append(record)
 staged={str((R/n).relative_to(Path(record['workspace_directory']))):(R/n).read_bytes()for n in record['source_sha256']}
 assert all(sha(b)==record['source_sha256'][str((Path(record['workspace_directory'])/n).relative_to(R))]for n,b in staged.items())
 archive(out/'compiled-source.tar.gz',staged)
a,b=records
assert a['comparison']['candidate_sha256']==b['comparison']['candidate_sha256'] and a['unstripped_sha256']==b['unstripped_sha256']
assert a['primary_source_sha256']==b['primary_source_sha256']
primary={n.removeprefix('programs/pump/'):(R/n).read_bytes()for n in a['primary_source_sha256']}
assert len(primary)==65 and all(sha(data)==a['primary_source_sha256']['programs/pump/'+n]for n,data in primary.items());archive(P/'primary-source.tar.gz',primary)
for name in ['inventory.json.gz','membership.json']:shutil.copy2(W/'maintained04-with616'/name,P/name)
shutil.copy2(W/'repeat.json',P/'repeat.json')
runtime=P/'runtime';runtime.mkdir(exist_ok=True)
shutil.copy2(W/'full44-with616.json.gz',runtime/'full44.json.gz');shutil.copy2(W/'full44-with616.log',runtime/'full44.log')
loader={f.name:f.read_bytes()for f in(W/'full44-with616.json.gz.suites').glob('*.loader.json')};assert len(loader)==44;archive(runtime/'full44-loader-receipts.tar.gz',loader)
for name in ['shared-buyback','cost-overflow','cashback','cto','shared-holder','create-quote-keys']:
 for suffix in ['.json.gz','-loader.json','.log']:shutil.copy2(W/'focused-with616'/(name+suffix),runtime/(name+suffix))
shutil.copy2(W/'focused-with616/runs.json',runtime/'focused-runs.json')
for name in ['cashback-focused-path-adapted.py','cto-focused-path-adapted.py','path-adaptations.json']:shutil.copy2(W/'focused-with616'/name,runtime/name)
shutil.copy2(P/'run_focused.py',runtime/'executed-focused-controller.py')
# Snapshot every directly selected runtime producer and the common diagnostic/loader code.
report=json.loads(gzip.decompress((runtime/'full44.json.gz').read_bytes()));names=set(report['script_sha256'])|{'scripts/pump_validate_parallel.py','scripts/pump_validate_all.py','scripts/pump_diagnostic_audit.py','scripts/pump_with_captured_loader.py','scripts/pump_captured_loader.py','scripts/build_source_manifest.py'}
for x in json.loads((runtime/'focused-runs.json').read_text()):
 args=x['command'];names.add(str(Path(args[args.index('--receipt')+2]).relative_to(R)))
archive(runtime/'executed-harnesses.tar.gz',{n:(R/n).read_bytes()for n in names})
inv=json.loads(gzip.decompress((P/'inventory.json.gz').read_bytes()));remaining=[hex(r['start'])for r in inv['windows']if not r['normalized_matches']]
checkpoint={'scope':'Maintained ordinary Pump source frontier with explicit source composition, two fresh same-image builds, exact membership retention and final-image bounded runtime','canonical_source_sha256':a['primary_source_sha256'],'canonical_source_files':len(primary),'primary_source_archive_sha256':sha((P/'primary-source.tar.gz').read_bytes()),'composition':'composition-final.json','composition_sha256':sha((P/'composition-final.json').read_bytes()),'candidate_sha256':a['comparison']['candidate_sha256'],'unstripped_sha256':a['unstripped_sha256'],'build_profile':'Native Darwin v1.44 compiler, official Linux-v1.44 sbpf-solana-solana libraries; opt3/panic abort/overflow checks/LTO false/codegen-units1','fresh_local_crates':['pump-recovered','pump-token-ext'],'external_dependencies_rebuilt':False,'repeat_complete_elfs_equal':True,'counts':inv['counts'],'remaining_windows':remaining,'new_normalized_windows_vs_569':0,'full_runtime':{'suites':44,'cases':10468,'diagnostic_log_cases':10464,'structured_mismatches':0,'diagnostic_mismatches':0,'source_coordinates_excluded_from_broad_diagnostic_audit':True,'loader_profile':'captured-upgradeable'},'focused_runtime':{'cases':65,'executed_transactions':195,'reports':{'shared-buyback':20,'cost-overflow':6,'cashback':18,'cto':5,'shared-holder':12,'create-quote-keys':4},'structured_mismatches':0,'ordered_focused_message_mismatches':0,'declared_create_source_residue':{'original':220,'candidate':70}},'direct_generated_fee_config':{'actual_context_roots':2,'paired_immediate_call_occurrences_checked':220,'constructor_original_start':'0x92d0','checked_decoder_original_start':'0x1156f0','payload_decoder_original_start':'0x1159d8'},'whole_elf_equal':False,'goal_complete':False,'limits':['Same16 function windows remain unmatched; .text/data/relocation/file identity remains incomplete.','Runtime is finite local synthetic/captured-dependency evidence, with no deployment or all-state equivalence claim.','Broad diagnostics exclude Source coordinates; newer Source/panic priorities have separate focused checks; create616 retains declared Source70 versus220.','Build repeat reuses authenticated external dependency artifacts, not a cold dependency rebuild or a native Linux-host repeat.']}
(P/'CHECKPOINT.json').write_text(json.dumps(checkpoint,indent=2)+'\n')
checkpoint['portable_empty_target_build']={'directory':'portable-build','cold_empty_target':True,'qualified_image_hashes_equal':True,'locked_registry_packages':254,'actual_registry_source_files':4176};(P/'CHECKPOINT.json').write_text(json.dumps(checkpoint,indent=2)+'\n')
print(json.dumps({k:checkpoint[k]for k in ['candidate_sha256','counts','focused_runtime','whole_elf_equal','goal_complete']},indent=2))
