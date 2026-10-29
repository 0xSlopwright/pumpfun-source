#!/usr/bin/env python3
"""Promote only mapped ordinary Pump source; no Git or global-manifest mutation."""
from pathlib import Path
import gzip,hashlib,io,json,tarfile
P=Path(__file__).resolve().parent;R=P.parents[2];C=R/'programs/pump';S=P/'proposal/programs/pump';sha=lambda b:hashlib.sha256(b).hexdigest()
assert not(P/'promotion.json').exists()
import sys;sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest
before=source_manifest(C,C,R,cwd=C)
with tarfile.open(P/'previous-primary.tar.gz','w:gz')as t:
 for n in before:t.add(R/n,arcname=n,recursive=False)
files={str(q.relative_to(S)):q.read_bytes()for q in S.rglob('*')if q.is_file()};assert len(files)==65
profile=(P/'proposal/Cargo.toml').read_text().split('[profile.release]',1)[1]
files['Cargo.toml']=files['Cargo.toml'].rstrip()+b'\n[profile.release]'+profile.rstrip().encode()+b'\n\n[workspace]\n'
old={n.removeprefix('programs/pump/'):h for n,h in before.items()};deleted=sorted(set(old)-set(files));assert deleted==['src/distribution.rs','src/set_creator.rs']
for n in deleted:(C/n).unlink()
for n,b in files.items():q=C/n;q.parent.mkdir(parents=True,exist_ok=True);q.write_bytes(b)
after=source_manifest(C,C,R,cwd=C);assert set(after)=={'programs/pump/'+n for n in files};assert all(sha((C/n).read_bytes())==sha(b)for n,b in files.items())
report={'scope':__doc__,'source_composition_sha256':sha((P/'composition.json').read_bytes()),'before_source_sha256':before,'canonical_source_sha256':after,'deleted_obsolete_source_paths':['programs/pump/'+n for n in deleted],'new_source_paths':sorted(set(after)-set(before)),'modified_source_paths':[n for n in sorted(set(after)&set(before))if before[n]!=after[n]],'manifest_adaptation':'Move only release profile from proposal workspace to canonical standalone crate and restore empty workspace. Frozen identical lock remains canonical. Maintained --workspace-layout reverses this adaptation.','archive_sha256':sha((P/'previous-primary.tar.gz').read_bytes()),'whole_elf_equal':False,'goal_complete':False}
(P/'promotion.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'canonical_source_files':len(after),'modified':len(report['modified_source_paths']),'new':report['new_source_paths'],'deleted':report['deleted_obsolete_source_paths']},indent=2))
