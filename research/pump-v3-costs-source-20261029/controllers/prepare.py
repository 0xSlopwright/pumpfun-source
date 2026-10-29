from pathlib import Path
import tarfile,shutil,json,hashlib
B=Path('/mnt/c/Users/ahi20/Documents/ChatGPT/pumpfun-contribution-review/pump-v3-costs-20261029');L=Path('/home/ahi200/pumpfun-work/20261029-pump-legacy-exact-sol');p=B/'workspace.tar.gz';assert hashlib.sha256(p.read_bytes()).hexdigest()=='04e476628bd521dde0dc4eadc8c5692c380b9ea60ce417c9525e3f2fd3b7739e'
u=L/'costs-latest-unpack';u.mkdir()
with tarfile.open(p) as t:
 for m in t.getmembers():assert not Path(m.name).is_absolute() and '..' not in Path(m.name).parts and (m.isfile() or m.isdir()),m.name
 t.extractall(u,filter='data')
f=list(u.rglob('programs/pump/src/trade_v3.rs'));assert len(f)==1
src=L/'source-costs-parent';shutil.copytree(f[0].parents[3],src)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();a={p.relative_to(L/'source-current-parent').as_posix():sha(p) for p in (L/'source-current-parent').rglob('*') if p.is_file()};z={p.relative_to(src).as_posix():sha(p) for p in src.rglob('*') if p.is_file()};assert set(a)==set(z);changes=[k for k in a if a[k]!=z[k]];assert changes==['programs/pump/src/creator/admin_cto.rs'],changes
(B/'preparation.json').write_text(json.dumps({'source_pin':'49d07973846893ac42df69ef9008a54b17f5b5bd','source':str(src),'changed_since_previous_parent':changes,'inputs':z,'work':str(L),'shared_target_note':'Reuse prior task private dependencytarget; force actualrootcompile andverifyallsourcehashes. Prioroutputsreadonly.'},indent=2)+'\n');print('Prepared latest maintained66inputs; changedonly',changes)