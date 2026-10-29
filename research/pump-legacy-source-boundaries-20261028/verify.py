#!/usr/bin/env python3
"""Verify the sealed source, actual build inputs, unchanged inventory and strict receipts."""
from pathlib import Path
import argparse,base64,difflib,gzip,hashlib,io,json,re,subprocess,sys,tarfile
if not __debug__:raise SystemExit('Optimized Python is unsupported; run without -O.')
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parent;R=P.parents[1];sys.path.insert(0,str(P/'tools'))
import census
from solders.transaction import VersionedTransaction
sha=lambda b:hashlib.sha256(b).hexdigest();read=lambda p:json.loads(gzip.decompress(p.read_bytes()))if p.suffix=='.gz'else json.loads(p.read_text())
def untar(path):
 with tarfile.open(path,'r:gz')as t:
  out={}
  for m in t:
   assert m.isfile()and not Path(m.name).is_absolute()and'..'not in Path(m.name).parts;out[m.name]=t.extractfile(m).read()
  return out
parser=argparse.ArgumentParser();parser.add_argument('--source-directory',type=Path);parser.add_argument('--signatures',action='store_true');args=parser.parse_args()
manifest=read(P/'MANIFEST.json');actual={str(f.relative_to(P))for f in P.rglob('*')if f.is_file()};assert actual==set(manifest['files'])|{'MANIFEST.json'}
for name,digest in manifest['files'].items():assert not(P/name).is_symlink()and sha((P/name).read_bytes())==digest,name
c=read(P/'CHECKPOINT.json');source={str(f.relative_to(P/'source')):sha(f.read_bytes())for f in(P/'source').rglob('*')if f.is_file()};assert source==c['source_files_sha256']and len(source)==65
base=untar(P/'historical/base-acc5-source.tar.gz');assert set(base)==set(source);changed=[k for k,v in base.items()if sha(v)!=source[k]];assert changed==['src/buy.rs','src/creator/admin_cto.rs'];patch=''
for n in changed:patch+=''.join(difflib.unified_diff(base[n].decode().splitlines(True),(P/'source'/n).read_text().splitlines(True),fromfile='a/programs/pump/'+n,tofile='b/programs/pump/'+n))
assert patch==(P/'source.patch').read_text();assert source['src/creator/admin_cto.rs']=='6353b1f7b9e613bb8d819000c504d44410b04f7da7dfbdc7fb2e5132df100180'
if args.source_directory:
 selected=args.source_directory
 for path in [selected.absolute(),*selected.absolute().parents]:
  if path.is_symlink():raise ValueError('Source selector contains a symlink')
 selected=selected.resolve()
 if any(f.is_symlink()for f in selected.rglob('*')):raise ValueError('Source input contains a symlink')
 from build_source_manifest import source_manifest
 actual_source={str((R/name).relative_to(selected)):digest for name,digest in source_manifest(selected,selected,R,cwd=selected).items()};assert actual_source==source,'Current selected source differs from actual qualified source65'
candidate=(P/'artifacts/candidate.so').read_bytes();symbols=(P/'artifacts/unstripped.so').read_bytes();assert sha(candidate)==c['candidate_sha256']and sha(symbols)==c['unstripped_sha256'];original=gzip.decompress((P/'historical/original.so.gz').read_bytes());original_sha=sha(original)
for label in ['primary','repeat']:
 D=P/'builds'/label;b=read(D/'build-comparison.json');assert b['returncode']==0 and b['source_unchanged']and b['tools_unchanged']and b['target_libraries_unchanged']and b['reused_external_artifacts_unchanged']and all(b['fresh_local_compilations'].values());assert not b['external_dependency_rebuild']and not b['stack_warnings'];assert sha((D/'executed-builder.py').read_bytes())==b['builder_sha256'];assert b['comparison']['candidate_sha256']==sha(candidate)and b['unstripped_sha256']==sha(symbols);assert sha((D/'build.log').read_bytes())==b['build_log_sha256']
 staged=untar(D/'compiled-source.tar.gz');prefix=next(iter(b['source_sha256'])).split('/source/',1)[0]+'/source/';assert {prefix+n:sha(v)for n,v in staged.items()}==b['source_sha256'];assert {prefix+n:sha(v)for n,v in staged.items()}==b['source_after_sha256'];expected_stage={'programs/pump/'+n:(P/'source'/n).read_bytes()for n in source if n not in ['Cargo.toml','Cargo.lock']}
 text=(P/'source/Cargo.toml').read_text();ps=text.index('[profile.release]');ws=text.index('[workspace]');release=text[ps:ws].strip()+'\n';expected_stage['programs/pump/Cargo.toml']=(text[:ps].rstrip()+'\n').encode();expected_stage['Cargo.toml']=('[workspace]\nmembers = ["programs/pump"]\nresolver = "2"\n\n'+release).encode();expected_stage['Cargo.lock']=(P/'source/Cargo.lock').read_bytes();assert staged==expected_stage and len(staged)==66
 primary_prefix=str((P/'source').relative_to(R))+'/';expected_primary={primary_prefix+n:h for n,h in source.items()};assert b['primary_source_sha256']==b['primary_source_after_sha256']==expected_primary
 assert b['recipe_reference_sha256']==sha((P/'historical/external-tool-locator.py').read_bytes());assert b['source_wrapper_sha256']==sha((P/'tools/pump_physical_source_wrapper.py').read_bytes())
 if label=='primary':
  assert b['executed_python_sources_unchanged']
  for n,row in b['executed_python_sources'].items():assert sha((D/'executed-tools'/n).read_bytes())==row['sha256']
# The selected ordinary symbol image is exact across both ordinary builds; IR-only metadata differs explicitly.
census.ROOT=R;inv=census.census(P/'artifacts/unstripped.so');saved=read(P/'analysis/inventory.json.gz');assert inv['candidate_sha256']==saved['candidate_sha256']and inv['windows']==saved['windows']and inv['counts']==saved['counts']
baseline=read(P/'historical/base-inventory.json.gz');membership=lambda x:{w['start']:(bool(w['normalized_matches']),bool(w['raw_match']))for w in x['windows']};assert membership(inv)==membership(baseline);assert inv['counts']=={'total':1035,'normalized':1019,'raw':188,'unmatched':16,'matched_text_bytes':1611088}
# Strict replay receipts have no filename or coordinate substitution.
focused=read(P/'runtime/create-runtime.json.gz');assert focused['source_coordinate_normalization']is None;ftx=fsig=0;cases=0;messages=lambda q:[s for s in q['logs']if s.startswith(('Program log: ','Program data: '))]
for row in focused['cases']:
 outcomes=row['results'];a,b=outcomes['original'],outcomes['candidate'];assert messages(a)==messages(b)
 for k in ['before','after','error','events','inner','return']:assert a[k]==b[k]
 for outcome in outcomes.values():
  tx=VersionedTransaction.from_bytes(base64.b64decode(outcome['transaction_base64'],validate=True));assert all(tx.verify_with_results());ftx+=1;fsig+=len(tx.signatures)
 cases+=1
assert cases==14 and ftx==42 and fsig==84
for row in focused['families'].values():assert row['images_sha256']['candidate']==sha(candidate)and not row['structured_mismatches']['candidate']and not row['strict_ordered_program_message_mismatches']['candidate']
O=P/'runtime/sibling-focused';units=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$');ordered=lambda q:[s for s in q['logs']if not units.fullmatch(s)]
for name,count in [('shared-buyback',20),('cost-overflow',6),('cashback',18),('cto',5),('shared-holder',12)]:
 report=read(O/(name+'.json.gz'));assert len(report['cases'])==count
 for row in report['cases']:
  if name=='shared-buyback':outcomes={k:row[k]for k in ['original','control','candidate']};a,b=outcomes['original'],outcomes['candidate'];fields=['error','accounts','inner_instructions','event_payloads','return_data'];assert ordered(a)==ordered(b)
  elif name=='cost-overflow':outcomes=row['runs'];a,b=outcomes['original'],outcomes['proposal'];fields=['error','accounts','inner_instructions','event_payloads','return_data'];assert ordered(a)==ordered(b)
  else:outcomes={k:row[k]for k in ['original','baseline','candidate']};a,b=outcomes['original'],outcomes['candidate'];fields=['error','accounts','events','inner','return_data']if name=='cashback'else['error','before','after','events','inner','return'];assert messages(a)==messages(b)
  for k in fields:assert a[k]==b[k]
  for outcome in outcomes.values():
   tx=VersionedTransaction.from_bytes(base64.b64decode(outcome['transaction_base64'],validate=True));assert all(tx.verify_with_results());ftx+=1;fsig+=len(tx.signatures)
  cases+=1
assert cases==75 and ftx==225 and fsig==318
from pump_diagnostic_audit import audit,messages as diagnostic_messages
full=read(P/'runtime/full44.json.gz');assert full['candidate_sha256']==sha(candidate)and full['original_sha256']==original_sha;assert full['case_count']==10468 and len(full['suites'])==44 and not full['mismatches'];assert audit(full['suites'])==full['diagnostics']and full['diagnostics']['log_bearing_cases']==10464 and not full['diagnostics']['mismatches']
pairs=txfields=sigfields=0

def walk(v):
 global pairs,txfields,sigfields
 if isinstance(v,dict):
  if isinstance(v.get('original'),dict)and isinstance(v.get('candidate'),dict):
   a,b=v['original'],v['candidate'];assert a.keys()==b.keys();pairs+=1
   for k in a:
    if k=='logs':assert diagnostic_messages(a[k])==diagnostic_messages(b[k])
    elif k=='program_sha256':assert a[k].keys()==b[k].keys()and[n for n in a[k]if a[k][n]!=b[k][n]]==['6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P']
    elif k=='metadata':
     assert a[k].keys()==b[k].keys()
     for field in a[k]:
      if field=='logs':assert diagnostic_messages(a[k][field])==diagnostic_messages(b[k][field])
      elif field=='compute_units_consumed':assert isinstance(a[k][field],int)and isinstance(b[k][field],int)
      else:assert a[k][field]==b[k][field]
    else:assert a[k]==b[k]
  if 'transaction_base64'in v:
   tx=VersionedTransaction.from_bytes(base64.b64decode(v['transaction_base64'],validate=True));assert all(tx.verify_with_results());txfields+=1;sigfields+=len(tx.signatures)
  for q in v.values():walk(q)
 elif isinstance(v,list):
  for q in v:walk(q)
walk(full['suites']);assert(pairs,txfields,sigfields)==(10468,18343,27875)
for row in full['loader_receipts'].values():
 raw=(P/'runtime/loaders'/Path(row['path']).name).read_bytes();assert sha(raw)==row['sha256'];items=json.loads(raw)['loads'];assert len(items)==row['load_count']and{q['elf_sha256']for q in items}=={sha(candidate),original_sha};assert all(q['elf_prefix_unchanged']and q['zero_allocation_tail']and q['program_bytes']==36 and q['programdata_bytes']==10485760 for q in items)
admin=json.loads(subprocess.check_output([sys.executable,'-B',str(P/'verify_admin_wallet.py'),'--no-write'],text=True));assert admin==read(P/'ADMIN-WALLET-VERIFIED.json')and admin['cases']==18 and admin['candidate_structured_or_strict_message_mismatches']==0
legacy_raw=(P/'runtime/legacy284.json.gz').read_bytes();legacy=json.loads(gzip.decompress(legacy_raw)if legacy_raw.startswith(b'\x1f\x8b')else legacy_raw);assert legacy['candidate_sha256']==sha(candidate)and len(legacy['cases'])==284 and not legacy['mismatches'];legacy_txs=legacy_sigs=0
for row in legacy['cases']:
 a,b=row['original'],row['candidate'];assert messages(a)==messages(b)
 for k in ['error','accounts','before','events','return_data','inner']:assert a[k]==b[k]
 for outcome in [a,b]:
  tx=VersionedTransaction.from_bytes(base64.b64decode(outcome['transaction_base64'],validate=True));assert all(tx.verify_with_results());legacy_txs+=1;legacy_sigs+=len(tx.signatures)
assert legacy_txs==legacy_sigs==568
cfg=read(P/'analysis/legacy-cfg.json');assert cfg['injective_mapping']and cfg['original_blocks']==cfg['candidate_blocks']==cfg['mapped_blocks']==162 and len(cfg['differences'])==1 and not cfg['direct_callee_body_mismatches']
# No helper or runtime verification may mutate a sealed input.
for name,digest in manifest['files'].items():assert sha((P/name).read_bytes())==digest,name
print(json.dumps({'candidate_sha256':sha(candidate),'unstripped_sha256':sha(symbols),'normalized_windows':1019,'raw_windows':188,'normalized_gain':0,'source_files':65,'broad_case_pairs':pairs,'broad_signature_fields':sigfields,'strict_focused_cases':cases+18,'strict_focused_transactions':ftx+54,'strict_focused_signature_fields':fsig+108,'legacy_cases':284,'legacy_signature_fields':legacy_sigs,'cfg_blocks':162,'diagnostic_normalized_differing_blocks':1,'source_normalization':None,'whole_elf_identical':False,'goal_complete':False},indent=2))
