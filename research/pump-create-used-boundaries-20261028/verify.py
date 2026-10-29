#!/usr/bin/env python3
"""Verify the sealed source, actual build inputs, unchanged inventory and strict receipts."""
from pathlib import Path
import base64,difflib,gzip,hashlib,io,json,re,sys,tarfile
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
manifest=read(P/'MANIFEST.json');actual={str(f.relative_to(P))for f in P.rglob('*')if f.is_file()};assert actual==set(manifest['files'])|{'MANIFEST.json'}
for name,digest in manifest['files'].items():assert not(P/name).is_symlink()and sha((P/name).read_bytes())==digest,name
c=read(P/'CHECKPOINT.json');source={str(f.relative_to(P/'source')):sha(f.read_bytes())for f in(P/'source').rglob('*')if f.is_file()};assert source==c['source_files_sha256']and len(source)==65
base=untar(P/'historical/baseline-primary-source.tar.gz');assert set(base)==set(source);changed=[k for k,v in base.items()if sha(v)!=source[k]];assert changed==['src/create_v2.rs']
old=base[changed[0]].decode();new=(P/'source'/changed[0]).read_text();patch=''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/programs/pump/src/create_v2.rs',tofile='b/programs/pump/src/create_v2.rs'));assert patch==(P/'source.patch').read_text();assert old==(P/'historical/baseline-create.rs').read_text()
expected={198:'NotEnoughRemainingAccounts',205:'require!(',210:'InvalidQuoteTokenProgram',220:'UnsupportedQuoteMint',243:'UnsupportedQuoteMint',258:'InvalidAssociatedQuoteBondingCurve',541:'require_gte!(',547:'require_gte!(',553:'require_gte!(',709:'MayhemModeDisabled',716:'CashbackDeprecated',719:'HolderRewardDisabled',732:'CreatorShouldNotBeZero',738:'CreateV2Disabled',758:'MayhemModeQuoteMintNotAllowed',774:'CreatorFeeNotConfigurable',778:'CreatorFeeBpsOutOfRange'}
for line,token in expected.items():assert token in new.splitlines()[line-1],line
candidate=(P/'artifacts/candidate.so').read_bytes();symbols=(P/'artifacts/unstripped.so').read_bytes();assert sha(candidate)==c['candidate_sha256']and sha(symbols)==c['unstripped_sha256'];original=gzip.decompress((P/'historical/original.so.gz').read_bytes());original_sha=sha(original)
for label in ['primary','repeat']:
 D=P/'builds'/label;b=read(D/'build-comparison.json');assert b['returncode']==0 and b['source_unchanged']and b['tools_unchanged']and b['target_libraries_unchanged']and b['reused_external_artifacts_unchanged']and all(b['fresh_local_compilations'].values());assert not b['external_dependency_rebuild']and not b['stack_warnings'];assert sha((D/'executed-builder.py').read_bytes())==b['builder_sha256'];assert b['comparison']['candidate_sha256']==sha(candidate)and b['unstripped_sha256']==sha(symbols);assert sha((D/'build.log').read_bytes())==b['build_log_sha256']
 staged=untar(D/'compiled-source.tar.gz');prefix=next(iter(b['source_sha256'])).split('/source/',1)[0]+'/source/';assert {prefix+n:sha(v)for n,v in staged.items()}==b['source_sha256'];assert {prefix+n:sha(v)for n,v in staged.items()}==b['source_after_sha256'];assert staged['programs/pump/src/create_v2.rs']==new.encode()
 assert b['recipe_reference_sha256']==sha((P/'historical/external-tool-locator.py').read_bytes());assert b['source_wrapper_sha256']==sha((P/'tools/pump_physical_source_wrapper.py').read_bytes())
 if label=='primary':
  assert b['executed_python_sources_unchanged']
  for n,row in b['executed_python_sources'].items():assert sha((D/'executed-tools'/n).read_bytes())==row['sha256']
# The selected ordinary symbol image is exact across both ordinary builds; IR-only metadata differs explicitly.
census.ROOT=R;inv=census.census(P/'artifacts/unstripped.so');saved=read(P/'analysis/inventory.json.gz');assert inv['candidate_sha256']==saved['candidate_sha256']and inv['windows']==saved['windows']and inv['counts']==saved['counts']
baseline=read(P/'historical/baseline-inventory.json.gz');membership=lambda x:{w['start']:(bool(w['normalized_matches']),bool(w['raw_match']))for w in x['windows']};assert membership(inv)==membership(baseline);assert inv['counts']=={'total':1035,'normalized':1019,'raw':188,'unmatched':16,'matched_text_bytes':1611088}
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
print(json.dumps({'candidate_sha256':sha(candidate),'normalized_windows':1019,'raw_windows':188,'normalized_gain':0,'source_files':65,'broad_case_pairs':pairs,'broad_signature_fields':sigfields,'strict_focused_cases':cases,'strict_focused_transactions':ftx,'strict_focused_signature_fields':fsig,'strict_create_message_gain':6,'source_normalization':None,'whole_elf_identical':False,'goal_complete':False},indent=2))
