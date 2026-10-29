from pathlib import Path
import hashlib,json,os,shutil,subprocess,sys,tomllib
D=Path(__file__).resolve().parent;R=D.parent;F=R/'best-exact-quote/source';C=D/'cargo-home';N=Path('/Users/shawwalters/.cargo');names=['index.crates.io-1949cf8c6b5b557f','index.crates.io-6f17d22bba15001f'];H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def tree(p):
 return {str(f.relative_to(p)):({'link':os.readlink(f)}if f.is_symlink()else{'sha256':sha(f),'bytes':f.stat().st_size})for f in sorted(p.rglob('*'))if f.is_symlink()or f.is_file()}
locked=[p for p in tomllib.loads((F/'Cargo.lock').read_text())['package']if p.get('source','').startswith('registry+')];assert len(locked)==254
rows=[];cloned={}
for p in locked:
 stem=p['name']+'-'+p['version'];archives=[N/'registry/cache'/ns/(stem+'.crate')for ns in names];arc=next((a for a in archives if a.is_file()),None);assert arc is not None,stem;assert sha(arc)==p['checksum'],stem
 for ns in names:
  target=C/'registry/cache'/ns/arc.name;target.parent.mkdir(parents=True,exist_ok=True)
  if not target.exists():subprocess.run(['cp','-c',str(arc),str(target)],check=True)
 views=[]
 for ns in names:
  logical=N/'registry/src'/ns/stem
  if not logical.exists():logical=next(N/'registry/src'/a/stem for a in names if (N/'registry/src'/a/stem).exists())
  physical=logical.resolve();rel=physical.relative_to(N/'registry/src');dst=C/'registry/src'/rel;dst.parent.mkdir(parents=True,exist_ok=True)
  if physical not in cloned:
   if not dst.exists():subprocess.run(['cp','-cRp',str(physical),str(dst)],check=True)
   before=tree(physical);assert tree(dst)==before,stem;cloned[physical]={'native':str(physical),'prepared':str(dst),'files':before}
  view=C/'registry/src'/ns/stem;view.parent.mkdir(parents=True,exist_ok=True)
  if view!=dst and not view.exists():view.symlink_to(os.path.relpath(dst,view.parent),target_is_directory=True)
  assert tree(view.resolve())==cloned[physical]['files'];views.append({'namespace':ns,'native_logical':str(logical),'native_physical':str(physical),'prepared_physical_namespace':str(rel),'symlink':os.readlink(view)if view.is_symlink()else None})
 key=p['name'].lower();cachekey=key if len(key)==1 else '2/'+key if len(key)==2 else '3/'+key[0]+'/'+key if len(key)==3 else key[:2]+'/'+key[2:4]+'/'+key
 for ns in names:
  base=N/'registry/index'/ns;dst=C/'registry/index'/ns;dst.mkdir(parents=True,exist_ok=True)
  config=base/'config.json'
  if not config.exists():config=next(N/'registry/index'/a/'config.json'for a in names if (N/'registry/index'/a/'config.json').exists())
  if not (dst/'config.json').exists():shutil.copy2(config,dst/'config.json')
  index=base/'.cache'/cachekey
  if not index.exists():index=next(N/'registry/index'/a/'.cache'/cachekey for a in names if (N/'registry/index'/a/'.cache'/cachekey).exists())
  target=dst/'.cache'/cachekey;target.parent.mkdir(parents=True,exist_ok=True)
  if not target.exists():shutil.copy2(index,target)
 rows.append({'name':p['name'],'version':p['version'],'locked_archive_sha256':p['checksum'],'views':views})
root_source={str(p.relative_to(F)):sha(p)for p in sorted(F.rglob('*'))if p.is_file()};crate=fastbuild.stage(F,D/'ws');wrapper=D/'pump_physical_source_wrapper.py';shutil.copy2(H/'pump_physical_source_wrapper.py',wrapper);wrapper.chmod(0o755)
record={'scope':'Exact selected public lock archives plus copied native physical registry source views; no user Cargo credentials/config mounted. Source symlink views reproduce real native source location choices.','packages':rows,'source_trees':list(cloned.values()),'root_source_hashes':root_source,'staged_workspace':str(D/'ws'),'staged_workspace_files':tree(D/'ws'),'wrapper_sha256':sha(wrapper),'native_global_config_keys':[]}
for cfg in [N/'config',N/'config.toml']:
 if cfg.exists():record['native_global_config_keys'].append({'file':cfg.name,'sha256':sha(cfg),'top_level_keys':list(tomllib.loads(cfg.read_text()))})
(D/'input-provenance.json').write_text(json.dumps(record,indent=2)+'\n');print(json.dumps({'locked_public_packages':len(rows),'native_physical_trees':len(cloned),'source_bytes':sum(x.get('bytes',0)for v in cloned.values()for x in v['files'].values()),'native_global_config_keys':record['native_global_config_keys']}),flush=True)
