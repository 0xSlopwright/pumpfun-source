#!/usr/bin/env python3
"""Portable saved-evidence review. Accept repo root for checkpoint-loader compatibility."""
from pathlib import Path,PurePosixPath
import collections,hashlib,importlib.util,json,sys
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent

def _load(p):return json.loads(p.read_bytes())
def check_remaining(w):
 d=_load(w/'remaining-audit.json');m=_load(w/'worker-records/measurement-full.json');rows=[x for x in m['rows']if not x['matches']]
 assert d['candidate_sha256']==m['candidate_sha256'];assert len(rows)==129
 assert len(d['rows'])==129 and len({x['original_start']for x in d['rows']})==129
 assert {(x['start'],x['end'])for x in rows}=={(int(x['original_start'],16),int(x['original_end'],16))for x in d['rows']}
 domains=collections.defaultdict(lambda:{'windows':0,'bytes':0})
 for x in d['rows']:
  assert x['bytes']==int(x['original_end'],16)-int(x['original_start'],16);domains[x['domain']]['windows']+=1;domains[x['domain']]['bytes']+=x['bytes']
 assert dict(domains)==d['domains'];m=d['metrics']
 assert(m['normalized_windows'],m['total_windows'],m['unmatched_windows'],m['raw_equal_windows'],m['normalized_only_windows'],m['matched_text_bytes'],m['original_text_bytes'],m['unmatched_text_bytes'])==(656,785,129,148,508,826112,1162040,335928)
 assert abs(m['normalized_percent']-656/785*100)<1e-10;assert abs(m['remaining_window_percent']-129/785*100)<1e-10;assert abs(m['matched_text_percent']-826112/1162040*100)<1e-10;assert abs(m['remaining_text_percent']-335928/1162040*100)<1e-10
 identities=[x['current_identity']for x in d['rows']if x.get('current_identity')]
 assert len(identities)==21 and sum(x['bytes']for x in identities)==20512
 error=next(x for x in identities if x['original_start']=='0x2288')
 assert error['best_source_entity']=='anchor_lang::error::Error::with_account_name<String>'
 return m

def verify(root=None):
 """All packet paths are relative to this file; root is accepted by callers."""
 w=Path(__file__).resolve().parent;manifest=_load(w/'manifest.json')
 actual={str(p.relative_to(w))for p in w.rglob('*')if p.is_file()and '__pycache__'not in p.parts}
 assert actual==set(manifest['files'])|{'manifest.json'},('inventory',actual-set(manifest['files'])-{'manifest.json'},set(manifest['files'])-actual)
 for name,expected in manifest['files'].items():
  n=PurePosixPath(name);assert not n.is_absolute()and '..'not in n.parts and str(n)==name
  p=w/name;assert not any(q.is_symlink()for q in(p,*p.parents)if q!=w.parent);assert hashlib.sha256(p.read_bytes()).hexdigest()==expected,name
 sys.path.insert(0,str(w));s=importlib.util.spec_from_file_location('independent_joint_analyze',w/'analyze.py');a=importlib.util.module_from_spec(s);s.loader.exec_module(a)
 report=a.run(w);assert report==_load(w/'review.json'),'Regenerated review differs'
 metrics=check_remaining(w);neg=_load(w/'negative-controls.json');assert neg['all_rejected']and len(neg['controls'])>=5
 return {'passed':True,'candidate_sha256':report['candidate_sha256'],'normalized_windows':656,'raw_windows':148,'bounded_static_closed_windows':report['bounded_static_closure']['bounded_static_closed_windows'],'source_coordinate_closed_windows':report['including_source_coordinates']['bounded_static_closed_windows'],'direct_closed_windows':report['direct_closure']['internal_direct_closure_windows'],'original_text_bytes':1162040,'matched_text_bytes':826112,'remaining_windows':129,'remaining_text_bytes':335928,'normalized_percent':metrics['normalized_percent'],'remaining_percent':metrics['remaining_window_percent'],'gained_windows':[],'lost_windows':[],'instruction_wrappers':38,'signed_counterexamples':report['signed_counterexamples'],'conditional_incentive_guard':report['conditional_incentive_guard']['condition'],'new_runtime_executions':0,'new_compiler_executions':0,'manifest_sha256':hashlib.sha256((w/'manifest.json').read_bytes()).hexdigest(),'scope':'Independent saved evidence review; whole ELF identity and complete source provenance remain unproved.'}

if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path);args=p.parse_args();print(json.dumps(verify(args.root),indent=2))
