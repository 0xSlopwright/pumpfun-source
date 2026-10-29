#!/usr/bin/env python3
"""Check exhaustive unmatched-window accounting against a selected measurement."""
import argparse, collections, gzip, hashlib, json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--measurement',type=Path,required=True);p.add_argument('--audit',type=Path,default=Path(__file__).with_name('remaining-audit.json'));a=p.parse_args()
b=a.measurement.read_bytes();b=gzip.decompress(b)if a.measurement.suffix=='.gz'else b;m=json.loads(b);d=json.loads(a.audit.read_bytes())
assert m['candidate_sha256']==d['candidate_sha256']
assert hashlib.sha256(b).hexdigest()==d['measurement_sha256']
rows=[x for x in m['rows']if not x['matches']];saved=d['rows'];assert len(rows)==len(saved)
assert {(x['start'],x['end'])for x in rows}=={(int(x['original_start'],16),int(x['original_end'],16))for x in saved}
assert len({x['original_start']for x in saved})==len(saved)
assert all(x['bytes']==int(x['original_end'],16)-int(x['original_start'],16)for x in saved)
domains=collections.defaultdict(lambda:{'windows':0,'bytes':0})
for x in saved:domains[x['domain']]['windows']+=1;domains[x['domain']]['bytes']+=x['bytes']
assert dict(domains)==d['domains']
mm=d['metrics'];assert mm['normalized_windows']==m['normalized_matches']==len(m['rows'])-len(rows)
assert mm['raw_equal_windows']==m['raw_matches']
assert mm['total_windows']==len(m['rows']);assert mm['unmatched_windows']==len(rows)
assert mm['unmatched_text_bytes']==sum(x['end']-x['start']for x in rows)
assert mm['original_text_bytes']==sum(x['end']-x['start']for x in m['rows'])
assert mm['matched_text_bytes']==mm['original_text_bytes']-mm['unmatched_text_bytes']
for actual,numerator,denominator in [('normalized_percent',mm['normalized_windows'],mm['total_windows']),('remaining_window_percent',len(rows),len(m['rows'])),('matched_text_percent',mm['matched_text_bytes'],mm['original_text_bytes']),('remaining_text_percent',mm['unmatched_text_bytes'],mm['original_text_bytes'])]:assert abs(mm[actual]-100*numerator/denominator)<1e-9
assert mm['whole_elf_equal']==m['complete_elf']['full_byte_equality']==False
print(json.dumps({'candidate_sha256':d['candidate_sha256'],'windows':len(saved),'unmatched_text_bytes':mm['unmatched_text_bytes'],'domains':dict(domains),'partition_verified':True,'normalized_percent':mm['normalized_percent'],'remaining_window_percent':mm['remaining_window_percent']}))
