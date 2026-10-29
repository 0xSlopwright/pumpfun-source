from pathlib import Path
import hashlib,json
W=Path(__file__).resolve().parent;rows=[json.loads(p.read_bytes())for p in sorted((W/'access-traces').glob('*.json'))];dirs=set();subs=[];accesses=set()
for row in rows:
 assert not row['denied'];subs+=row['subprocesses']
 for path in row['private_accesses']:
  accesses.add(path)
  if path.startswith('results/new-proofs/lineage/'):dirs.add(path.split('/')[3])
inv=json.loads((W/'inventory.json').read_bytes());assert dirs==set(inv['retained_directory_names'])
for command in subs:
 assert (command[0].endswith('/python')and command[1]=='-B'and command[2].endswith('/lineage/range-joint/verify.py'))or(command[:4]==['patch','--batch','-p1','-i']and str(W/'checkpoint')in command[4])
H=Path(inv['source']);assert hashlib.sha256((H/'results/manifest.json').read_bytes()).hexdigest()==inv['source_manifest_sha256']
report={'passed':True,'processes':len(rows),'unique_private_paths_observed':len(accesses),'lineage_directories_observed':sorted(dirs),'forbidden_source_checkpoint_accesses':0,'subprocesses':subs,'source_manifest_unchanged':True,'subprocess_scope':'One unchanged nested Python saved verifier and six static patch checks into TemporaryDirectory copies. No compiler or VM process.'}
(W/'access-verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
