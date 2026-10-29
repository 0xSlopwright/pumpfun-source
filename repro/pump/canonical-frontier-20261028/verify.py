#!/usr/bin/env python3
"""Verify maintained Pump source/build binding, complete census and final-image cases."""
from pathlib import Path
import argparse,base64,gzip,hashlib,io,json,struct,sys,tarfile,tempfile
if not __debug__:raise SystemExit('Assertions are required; do not use -O.')
P=Path(__file__).resolve().parent
sha=lambda b:hashlib.sha256(b).hexdigest()
def read(path):
 b=Path(path).read_bytes();return json.loads(gzip.decompress(b)if b.startswith(b'\x1f\x8b')else b)
def untar(path):
 result={}
 with tarfile.open(fileobj=io.BytesIO(Path(path).read_bytes()),mode='r:gz')as t:
  for m in t:
   assert m.isfile()and not Path(m.name).is_absolute()and'..'not in Path(m.name).parts and m.name not in result
   result[m.name]=t.extractfile(m).read()
 return result
def verify(repo,runtime=None,signatures=False,current_source=True):
 repo=Path(repo).resolve();manifest=read(P/'MANIFEST.json');actual={str(q.relative_to(P))for q in P.rglob('*')if q.is_file()and q.name!='MANIFEST.json'}
 assert actual==set(manifest),(actual-set(manifest),set(manifest)-actual)
 assert not any(q.is_symlink()for q in P.rglob('*'))
 for n,h in manifest.items():assert sha((P/n).read_bytes())==h,n
 c=read(P/'CHECKPOINT.json');assert c['whole_elf_equal']is False and c['goal_complete']is False
 primary=untar(P/'primary-source.tar.gz');assert len(primary)==65
 assert {'programs/pump/'+n:sha(b)for n,b in primary.items()}==c['canonical_source_sha256']
 if current_source:
  source_root=repo/'programs/pump'
  if any(q.is_symlink()for q in [source_root,*source_root.parents])or any(q.is_symlink()for q in source_root.rglob('*')):raise ValueError('Maintained Pump source selector contains a symlink')
  for directory in [source_root,*source_root.parents]:
   for name in ['.cargo/config','.cargo/config.toml']:
    if(directory/name).exists():raise ValueError('Ambient Cargo configuration is unsupported: '+str(directory/name))
  sys.path.insert(0,str(repo/'scripts'));from build_source_manifest import source_manifest
  current=source_manifest(repo/'programs/pump',repo/'programs/pump',repo,cwd=repo/'programs/pump');assert current==c['canonical_source_sha256'],'maintained Pump source drift'
 candidate=(P/'candidate.so').read_bytes();symbols=(P/'unstripped.so').read_bytes();assert sha(candidate)==c['candidate_sha256'] and sha(symbols)==c['unstripped_sha256']
 records=[];compiled=[]
 for label in ['primary','repeat']:
  d=P/'builds'/label;r=read(d/'build-comparison.json');a=read(d/'build-attempt.json');assert r==a
  assert r['returncode']==r['clean_returncode']==0 and r['source_unchanged'] and r['tools_unchanged'] and r['target_libraries_unchanged'] and r['reused_external_artifacts_unchanged']
  assert not r['external_dependency_rebuild']and r['compiled_packages']==['pump-token-ext','pump-recovered']
  assert r['fresh_local_compilations']=={'pump-recovered':True,'pump-token-ext':True}and not r['stack_warnings']
  assert r['source_sha256']==r['source_after_sha256']and r['primary_source_sha256']==r['primary_source_after_sha256']==c['canonical_source_sha256']
  assert sha((d/'executed-builder.py').read_bytes())==r['builder_sha256']
  for n,h in [('candidate',c['candidate_sha256']),('unstripped',c['unstripped_sha256'])]:assert sha(gzip.decompress((d/(n+'.so.gz')).read_bytes()))==h
  log=gzip.decompress((d/'build.log.gz').read_bytes()).decode();assert sha(log.encode())==r['build_log_sha256']
  for n in ['pump-recovered','pump-token-ext']:assert 'Compiling '+n+' 'in log
  for flag in ['--manifest-path','--release','--target','sbpf-solana-solana','--offline','pump-recovered','pump-token-ext']:assert flag in r['clean_command']
  assert '--locked'in r['command']and'--offline'in r['command']
  files=untar(d/'compiled-source.tar.gz');prefix=Path(r['workspace_directory']).relative_to(Path(r['primary_source_directory']).parents[1]) if False else None
  # The receipt's paths remain original. Map only its explicitly recorded workspace prefix to archived logical inputs.
  marker='/source/';logical={n.split('/source/',1)[1]:h for n,h in r['source_sha256'].items()}
  assert len(logical)==len(r['source_sha256'])==66 and {n:sha(b)for n,b in files.items()}==logical
  assert files['Cargo.lock']==primary['Cargo.lock']
  for n,b in primary.items():
   if n not in ['Cargo.toml','Cargo.lock']:assert files['programs/pump/'+n]==b,n
  text=primary['Cargo.toml'].decode();ps=text.index('[profile.release]');ws=text.index('[workspace]');profile=text[ps:ws].strip()+'\n'
  assert files['programs/pump/Cargo.toml']==(text[:ps].rstrip()+'\n').encode()
  assert files['Cargo.toml']==('[workspace]\nmembers = ["programs/pump"]\nresolver = "2"\n\n'+profile).encode()
  records.append(r);compiled.append(files)
 assert compiled[0]==compiled[1]
 for key in ['tool_sha256','target_libraries_sha256','source_wrapper_sha256','reused_external_artifacts_sha256']:assert records[0][key]==records[1][key]
 cold=read(P/'portable-build/build-comparison.json');assert cold==read(P/'portable-build/build-attempt.json')
 assert cold['returncode']==0 and cold['cold_empty_target'] and not cold['target_existed_before'] and cold['qualified_image_hashes_equal']
 assert all(cold[k]for k in ['source_unchanged','tools_unchanged','sdk_rust_libraries_unchanged','registry_sources_unchanged','target_libraries_unchanged'])
 assert cold['primary_source_sha256']==cold['primary_source_after_sha256']==c['canonical_source_sha256']
 assert cold['source_sha256']==cold['source_after_sha256'];assert {n.split('/source/',1)[1]:h for n,h in cold['source_sha256'].items()}=={n:sha(b)for n,b in compiled[0].items()}
 assert cold['comparison']['candidate_sha256']==c['candidate_sha256']and cold['unstripped_sha256']==c['unstripped_sha256']
 assert sha((P/'portable-build/executed-builder.py').read_bytes())==cold['builder_sha256']==sha((P/'build.py').read_bytes())
 regraw=gzip.decompress((P/'portable-build/registry-authentication.json.gz').read_bytes());assert sha(regraw)==cold['registry_authentication_sha256'];reg=json.loads(regraw)
 lock=__import__('tomllib').loads(primary['Cargo.lock'].decode());locked={x['name']+'-'+x['version']:x['checksum']for x in lock['package']if x.get('source','').startswith('registry+')}
 assert len(locked)==254 and {n:x['sha256']for n,x in reg['locked_registry_archives'].items()}==locked
 assert reg['files_checked']==sum(len(x)for x in reg['actual_registry_source_files'].values())==4176
 assert cold['tool_sha256']==records[0]['tool_sha256']and cold['target_libraries_sha256']==records[0]['target_libraries_sha256']
 assert cold['target_library_profile']['status']=='verified'
 for n,h in [('candidate',c['candidate_sha256']),('unstripped',c['unstripped_sha256'])]:assert sha(gzip.decompress((P/'portable-build'/(n+'.so.gz')).read_bytes()))==h
 coldlog=gzip.decompress((P/'portable-build/build.log.gz').read_bytes());assert sha(coldlog)==cold['build_log_sha256']and b'exceeded max offset'not in coldlog
 sys.path.insert(0,str(P/'tools'));import census
 from pump_compare_function_bytes import body,normalize
 census.ROOT=repo
 with tempfile.TemporaryDirectory(prefix='pump-current-census-')as temp:
  f=Path(temp)/'symbols.so';f.write_bytes(symbols);inventory=census.census(f)
 assert inventory==read(P/'inventory.json.gz')and inventory['counts']==c['counts']=={'total':1035,'normalized':1019,'raw':188,'unmatched':16,'matched_text_bytes':1611088}
 baseline=read(P/'control/inventory.json.gz');membership=read(P/'membership.json')
 with tempfile.TemporaryDirectory(prefix='pump-control-census-')as temp:
  f=Path(temp)/'control.so';f.write_bytes(gzip.decompress((P/'control/unstripped.so.gz').read_bytes()));assert census.census(f)==baseline
 for key in ['normalized_matches','raw_match']:
  old={r['start']for r in baseline['windows']if r[key]};new={r['start']for r in inventory['windows']if r[key]};assert old==new and membership[key]=={'gains':[],'losses':[]}
 original=(repo/'evidence/original/pump/deployed.so').read_bytes();origsha=sha(original);assert origsha=='7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
 rows={r['start']:r for r in inventory['windows']};fs={st:(sz,n)for st,sz,n in census.functions(symbols)};os=census.sections(original);ss=census.sections(symbols)
 graph=read(P/'direct-fee-config-chain.json');assert graph['candidate_sha256']==sha(symbols) and len(graph['paths'])==2
 occurrences=0
 for path in graph['paths']:
  oldpath=path['original_direct_call_chain'];newpath=path['actual_direct_call_chain'];assert len(oldpath)==len(newpath)
  for one,two in zip(oldpath,newpath):
   ost=int(one['caller'],16);cst=int(two['caller']['start'],16);sz=rows[ost]['end']-ost;csz=fs[cst][0]
   ob=body(original,os,ost,sz);cb=body(symbols,ss,cst,csz);assert normalize(ob,ost,os)[0]==normalize(cb,cst,ss)[0]
   for edge in one['paired_caller_all_immediate_calls']:
    off=edge['offset'];aop,ar,_,aimm=struct.unpack_from('<BBhi',ob,off);bop,br,_,bimm=struct.unpack_from('<BBhi',cb,off)
    assert aop==bop==0x85 and ar>>4==br>>4==1
    at=ost+off+8+aimm*8;bt=cst+off+8+bimm*8;assert hex(at)==edge['original_target']and hex(bt)==edge['candidate_target']
    assert any(m['start']==bt for m in rows[at]['normalized_matches']);occurrences+=1
 assert occurrences==220
 sys.path.insert(0,str(repo/'scripts'));from pump_diagnostic_audit import audit,messages
 full=read(runtime or P/'runtime/full44.json.gz');assert full['candidate_sha256']==c['candidate_sha256']and full['original_sha256']==origsha
 assert full['compiled_source_sha256']==records[0]['source_sha256'] and full['loader_profile']=='captured-upgradeable'
 assert full['case_count']==10468 and len(full['suites'])==44 and not full['mismatches']
 assert audit(full['suites'])==full['diagnostics']and full['diagnostics']['log_bearing_cases']==10464 and not full['diagnostics']['mismatches']
 pair_count=tx_fields=sig_fields=0
 if signatures:from solders.transaction import VersionedTransaction
 def transaction(value):
  nonlocal tx_fields,sig_fields
  raw=base64.b64decode(value,validate=True);assert raw;tx_fields+=1
  if signatures:
   tx=VersionedTransaction.from_bytes(raw);assert all(tx.verify_with_results());sig_fields+=len(tx.signatures)
 def walk(value):
  nonlocal pair_count
  if isinstance(value,dict):
   if isinstance(value.get('original'),dict)and isinstance(value.get('candidate'),dict):
    a,b=value['original'],value['candidate'];pair_count+=1;assert a.keys()==b.keys()
    for k in a:
     if k=='logs':assert messages(a[k])==messages(b[k])
     elif k=='program_sha256':
      assert isinstance(a[k],dict)and a[k].keys()==b[k].keys();changed=[name for name in a[k]if a[k][name]!=b[k][name]];assert changed==['6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'];assert a[k][changed[0]]==origsha and b[k][changed[0]]==c['candidate_sha256']
     elif k=='metadata':
      assert a[k].keys()==b[k].keys()
      for field in a[k]:
       if field=='logs':assert messages(a[k][field])==messages(b[k][field])
       elif field=='compute_units_consumed':assert isinstance(a[k][field],int)and isinstance(b[k][field],int)
       else:assert a[k][field]==b[k][field],field
     else:assert a[k]==b[k],k
   if 'transaction_base64'in value:transaction(value['transaction_base64'])
   for item in value.values():walk(item)
  elif isinstance(value,list):
   for item in value:walk(item)
 walk(full['suites']);assert pair_count==10468
 loaders=untar(P/'runtime/full44-loader-receipts.tar.gz');assert len(loaders)==len(full['loader_receipts'])==44
 for name,row in full['loader_receipts'].items():
  raw=loaders[Path(row['path']).name];assert sha(raw)==row['sha256'];loads=json.loads(raw)['loads'];assert len(loads)==row['load_count']
  assert {x['elf_sha256']for x in loads}=={origsha,c['candidate_sha256']}
  assert all(x['elf_prefix_unchanged']and x['zero_allocation_tail']and x['program_bytes']==36 and x['programdata_bytes']==10485760 for x in loads)
 full_tx,full_sigs=tx_fields,sig_fields;focused_tx=focused_sigs=0;cases=0
 units=__import__('re').compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
 ordered=lambda r:[s for s in r['logs']if not units.fullmatch(s)]
 program=lambda r:[s for s in r['logs']if s.startswith(('Program log: ','Program data: '))]
 for name,count in c['focused_runtime']['reports'].items():
  report=read(P/'runtime'/(name+'.json.gz'));assert len(report['cases'])==count;cases+=count
  for row in report['cases']:
   if name=='shared-buyback':outcomes={k:row[k]for k in ['original','control','candidate']};left,right=outcomes['original'],outcomes['candidate'];fields=['error','accounts','inner_instructions','event_payloads','return_data'];assert ordered(left)==ordered(right)
   elif name=='cost-overflow':outcomes=row['runs'];left,right=outcomes['original'],outcomes['proposal'];fields=['error','accounts','inner_instructions','event_payloads','return_data'];assert ordered(left)==ordered(right)
   elif name=='create-quote-keys':
    outcomes=row['results'];left,right=outcomes['original'],outcomes['candidate'];fields=['before','after','error','events','inner','return']
    comparable=lambda r:[v.replace('create_v2.rs:220.','create_v2.rs:70.')for v in program(r)];assert comparable(left)==comparable(right)
    if row['rejected']:assert row['compared_payload_present']['original']and row['compared_payload_present']['candidate']and not row['compared_payload_present']['baseline']
   else:
    outcomes={k:row[k]for k in ['original','baseline','candidate']};left,right=outcomes['original'],outcomes['candidate'];fields=['error','accounts','events','inner','return_data']if name=='cashback'else['error','before','after','events','inner','return'];assert program(left)==program(right)
   for key in fields:assert left[key]==right[key],(name,key)
   for result in outcomes.values():
    oldtx,oldsigs=tx_fields,sig_fields;transaction(result['transaction_base64']);focused_tx+=tx_fields-oldtx;focused_sigs+=sig_fields-oldsigs
 assert cases==65 and focused_tx==195
 assert full_tx==c['full_runtime']['serialized_transaction_fields']
 if signatures:assert full_sigs==c['full_runtime']['signature_fields_verified']and focused_sigs==c['focused_runtime']['signature_fields_verified']
 result={'program':'pump','candidate_sha256':c['candidate_sha256'],'canonical_source_files':65,'workspace_source_files':66,'normalized_windows':1019,'raw_windows':188,'total_windows':1035,'runtime_suites':44,'runtime_cases':10468,'runtime_transactions':full_tx,'runtime_signature_fields':full_sigs if signatures else None,'focused_runtime_cases':65,'focused_transactions':focused_tx,'focused_signature_fields':focused_sigs if signatures else None,'portable_empty_target_build':True,'locked_registry_packages':254,'registry_source_files':4176,'paired_fee_config_immediate_calls':220,'remaining_windows':c['remaining_windows'],'whole_elf_identical':False,'meaningful_elf_identical':False}
 return result
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--repo',type=Path,default=P.parents[2]);p.add_argument('--runtime',type=Path);p.add_argument('--signatures',action='store_true');p.add_argument('--no-current-source',action='store_true');a=p.parse_args();print(json.dumps(verify(a.repo,a.runtime,a.signatures,not a.no_current_source),indent=2))
