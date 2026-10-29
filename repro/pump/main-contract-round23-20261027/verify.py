#!/usr/bin/env python3
"""Verify the bounded main-Pump checkpoint and recompute its actual byte claims."""
from pathlib import Path
import base64,gzip,hashlib,json,sys
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parent;ROOT=next(p for p in P.parents if (p/'evidence/original/pump/deployed.so').is_file());sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def read(p):
 b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def main():
 manifest=read(P/'MANIFEST.json')
 actual={str(f.relative_to(P))for f in P.rglob('*')if f.is_file()}
 assert actual==set(manifest)|{'MANIFEST.json'}, 'Archive file inventory differs from manifest'
 for name,digest in manifest.items():
  assert not (P/name).is_symlink(),name
  assert sha(P/name)==digest,name
 cp=read(P/'CHECKPOINT.json');assert cp['goal_complete'] is False and cp['whole_elf_equal'] is False and cp['archived_recipe_reproduced'] is True
 original=ROOT/'evidence/original/pump/deployed.so';assert sha(original)==cp['original_sha256'];assert sha(P/'candidate.so')==cp['candidate_sha256'];assert sha(P/'unstripped.so')==cp['unstripped_sha256']
 for field,folder in [('source_sha256','source'),('primary_source_sha256','primary'),('input_python_sha256','inputs'),('supporting_python_sha256','inputs')]:
  for name,digest in cp.get(field,{}).items():assert sha(P/folder/name)==digest,(folder,name)
 for name in ['build.json','repeat-build.json','canonical-build.json','reproduced-build.json']:
  r=read(P/name);assert r['returncode']==0 and r['source_unchanged'];assert r['comparison']['candidate_sha256']==cp['candidate_sha256'];assert r['unstripped_sha256']==cp['unstripped_sha256'];assert r['comparison']['full_byte_equality'] is False
 sys.path.insert(0,str(P/'inputs/scripts'))
 from pump_diagnostic_audit import audit
 from pump_compare_function_bytes import normalize,body
 from pump_quote_control_function_match import sections
 full,extra=read(P/'full.json.gz'),read(P/'additional.json.gz');assert full['candidate_sha256']==extra['candidate_sha256']==cp['candidate_sha256']
 assert len(full['suites'])==cp['full_suites'] and full['case_count']==cp['full_cases'];assert extra['suite_count']==cp['additional_suites']==len(extra['suites']) and extra['case_count']==cp['additional_cases']
 for report,expected in [(full,cp['full_log_cases']),(extra,cp['additional_log_cases'])]:
  a=audit(report['suites']);assert not a['mismatches'] and a['log_bearing_cases']==expected
 for name in cp['loader_receipts']:
  r=read(P/name);assert r['loads']
  for x in r['loads']:
   assert x['elf_sha256'] in [cp['candidate_sha256'],cp['original_sha256']];assert x['program_owner']=='BPFLoaderUpgradeab1e11111111111111111111111' and x['program_bytes']==36 and x['programdata_bytes']==10485760 and x['elf_prefix_unchanged'] and x['zero_allocation_tail']
 ob=original.read_bytes();cb=(P/'unstripped.so').read_bytes();os,cs=sections(ob),sections(cb);iv=read(P/'inventory.json.gz');assert iv['original_sha256']==cp['original_sha256'] and iv['candidate_sha256']==cp['unstripped_sha256'];pairs={};matched=raw_count=text_count=0
 for window in iv['windows']:
  a,n=window['start'],window['bytes'];o=body(ob,os,a,n);on,oo=normalize(o,a,os);assert hashlib.sha256(o).hexdigest()==window['raw_sha256'];any_raw=False
  if window['normalized_matches']:matched+=1;text_count+=n
  for c in window['normalized_matches']:
   raw=body(cb,cs,c['start'],n);cn,co=normalize(raw,c['start'],cs);assert on==cn;pairs[(a,c['start'])]=(oo,co);any_raw|=o==raw
  assert any_raw==window['raw_match'];raw_count+=any_raw
 assert len(iv['windows'])==cp['original_windows'] and matched==cp['normalized_windows'] and raw_count==cp['raw_windows'] and text_count==cp['matched_text_bytes']
 closed=read(P/'closed-calls.json');closed_pairs={(x['original_start'],x['candidate_start'])for x in closed['pairs']};assert len({a for a,b in closed_pairs})==cp['closed_call_windows_without_data']
 for pair in closed_pairs:
  oo,co=pairs[pair];assert [(x['offset'],x['kind'])for x in oo]==[(x['offset'],x['kind'])for x in co];assert all(x['kind']=='direct-call'for x in oo);assert all((x['target'],y['target'])in closed_pairs for x,y in zip(oo,co))
 proof=read(P/'new-cache-provenance/DIRECT-TRAIT-PARITY.json')
 build_record=read(P/'build.json')
 assert proof['status']=='passed' and build_record['dependency_cache']['key']==proof['cache_key']
 assert sha(P/'dependency-cache-manifest.json')==proof['manifest_sha256']==build_record['dependency_cache']['manifest_sha256']
 for filename,values in proof['elf_hashes'].items():
  assert values['clean']==values['cached']
  for label in ['clean','cached']:assert sha(P/'new-cache-provenance'/label/filename)==values[label]
 for label in ['clean','cached']:
  record=read(P/'new-cache-provenance'/label/'build-comparison.json');assert record['returncode']==0 and record['source_unchanged']
 import importlib.util
 audit_path=P/'inputs/work/parallel-main-v3-buyback-assert/audit_invocations.py'
 audit_spec=importlib.util.spec_from_file_location('archived_invocation_audit',audit_path)
 audit_module=importlib.util.module_from_spec(audit_spec);audit_spec.loader.exec_module(audit_module)
 for report in [full,extra]:
  calls=audit_module.audit_invocations(report['suites']);assert not calls['mismatches'];assert calls['paired_cases']==report['case_count']
 from solders.transaction import VersionedTransaction
 signed=set()
 def walk(x):
  if isinstance(x,dict):
   for key,value in x.items():
    if key=='transaction_base64'and isinstance(value,str):signed.add(value)
    else:walk(value)
  elif isinstance(x,list):
   for v in x:walk(v)
 walk(full['suites']);walk(extra['suites'])
 for s in signed:assert all(VersionedTransaction.from_bytes(base64.b64decode(s)).verify_with_results())
 print(json.dumps({'verified':True,'files':len(manifest),'full_cases':cp['full_cases'],'additional_cases':cp['additional_cases'],'paired_log_cases':cp['full_log_cases']+cp['additional_log_cases'],'distinct_signed_transactions_reverified':len(signed),'normalized_windows':matched,'raw_windows':raw_count,'matched_text_bytes':text_count,'direct_call_closed_windows_without_data':cp['closed_call_windows_without_data'],'whole_elf_equal':False,'goal_complete':False}))
if __name__=='__main__':main()
