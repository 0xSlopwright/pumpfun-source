#!/usr/bin/env python3
"""Recheck source/build bindings, official census, actual data/call edges and cases."""
from pathlib import Path
import base64,collections,contextlib,csv,difflib,gzip,hashlib,io,json,re,runpy,sys,tempfile
P=Path(__file__).resolve().parent;ROOT=P.parents[1]
sha=lambda b:hashlib.sha256(b).hexdigest()
read=lambda p:json.loads(gzip.decompress(p.read_bytes()) if p.suffix=='.gz' else p.read_bytes())
r=read(P/'build-record.json');b=read(P/'control/build-record.json');result=read(P/'RESULT.json')
assert r['returncode']==b['returncode']==0 and r['source_unchanged'] and b['source_unchanged']
assert r['source_sha256']==r['source_after_sha256']==read(P/'source-sha256.json')
assert b['source_sha256']==b['source_after_sha256']
assert r['tool_sha256']==b['tool_sha256'] and r['target_libraries_sha256']==b['target_libraries_sha256']
assert set(r['source_sha256'])==set(b['source_sha256']) and len(r['source_sha256'])==67
changed=[];patch=[]
for name,h in r['source_sha256'].items():
 candidate=P/'source'/name;assert sha(candidate.read_bytes())==h,name
 control=P/'control/source-files'/Path(name).name if name in ('programs/pump/src/lib.rs','programs/pump/src/trade_v3.rs') else candidate
 assert sha(control.read_bytes())==b['source_sha256'][name],name
 if h!=b['source_sha256'][name]:
  changed.append(name);old=control.read_text().splitlines(keepends=True);new=candidate.read_text().splitlines(keepends=True)
  assert len(old)==len(new)
  patch.extend(difflib.unified_diff(old,new,fromfile='a/'+name,tofile='b/'+name))
assert changed==['programs/pump/src/lib.rs','programs/pump/src/trade_v3.rs']
assert ''.join(patch)==(P/'source.patch').read_text()
lib=(P/'source/programs/pump/src/lib.rs').read_text().splitlines()
assert lib[1935].index('.expect(')+2==45 and lib[1938].index('.expect(')+2==14
log=(P/'rebuild.log').read_text();assert 'Compiling pump-token-ext' in log and 'Compiling pump-recovered' in log
assert sha((P/'rebuild.log').read_bytes())==r['log_sha256'] and len(read(P/'compiler-commands.json'))==2
assert sha((P/'unstripped.so').read_bytes())==r['unstripped_sha256']==result['unstripped_sha256']
assert sha((P/'candidate.so').read_bytes())==r['candidate_sha256']==result['candidate_sha256']
assert sha((P/'control/unstripped.so').read_bytes())==b['unstripped_sha256']
sys.path.insert(0,str(ROOT/'scripts'))
from pump_compare_function_bytes import normalize,body
from pump_quote_control_function_match import sections
functions=runpy.run_path(str(ROOT/'research/claude-pump-integration-20261027/r37-layout-33/verify.py'))['elf_functions']
original=(ROOT/'evidence/original/pump/deployed.so').read_bytes();os=sections(original)
windows=[x for x in csv.DictReader(open(ROOT/'repro/reconstruction-status-2026-10-26/functions.tsv'),delimiter='\t') if x['program']=='pump' and x['variant']=='selected']
assert len(windows)==1035
members=[]
for folder in (P/'control',P):
 image=(folder/'unstripped.so').read_bytes();ss=sections(image);by=collections.defaultdict(list)
 for start,size,name in functions(image):
  raw=body(image,ss,start,size);by[size,sha(normalize(raw,start,ss)[0])].append(sha(raw))
 rows=[]
 for w in windows:
  start=int(w['original_start']);size=int(w['bytes']);raw=body(original,os,start,size);matches=by[size,sha(normalize(raw,start,os)[0])]
  rows.append((start,bool(matches),sha(raw) in matches))
 assert sum(n for _,n,_ in rows)==1019 and sum(raw for _,_,raw in rows)==183
 inventory=read(folder/'inventory.json.gz');assert inventory['candidate_sha256']==sha(image)
 assert all(bool(w['normalized_matches'])==n and w['raw_match']==raw for w,(_,n,raw) in zip(inventory['windows'],rows))
 members.append(rows)
assert members[0]==members[1]
candidate=(P/'unstripped.so').read_bytes();cs=sections(candidate)
fit=next(t for t in functions(candidate) if '17fit_post_complete17' in t[2]);assert fit[1]==1112
assert normalize(body(candidate,cs,fit[0],fit[1]),fit[0],cs)[0]==normalize(body(original,os,0x837a8,1112),0x837a8,os)[0]
costs=next(t for t in functions(candidate) if '12v3_buy_costs17' in t[2]);assert costs[1]==1648 and costs[1]!=2120
with tempfile.TemporaryDirectory(prefix='pump-buyback-proof-') as temp:
 temp=Path(temp);saved=list(sys.argv)
 try:
  sys.argv=[str(P/'audit_callers.py'),str(temp/'callers.json')]
  with contextlib.redirect_stdout(io.StringIO()):runpy.run_path(str(P/'audit_callers.py'),run_name='__main__')
  assert read(temp/'callers.json')==read(P/'caller-audit.json')
  sys.argv=[str(P/'audit_panic_locations.py'),str(P/'control/unstripped.so'),str(P/'unstripped.so'),str(temp/'panic.json')]
  with contextlib.redirect_stdout(io.StringIO()):runpy.run_path(str(P/'audit_panic_locations.py'),run_name='__main__')
  audit=read(temp/'panic.json');assert not audit['candidates'][0]['all_buyback_panic_file_line_column_equal_original']
  assert audit['candidates'][1]['all_buyback_panic_file_line_column_equal_original']
 finally:sys.argv=saved
runtime=read(P/'runtime/costs.json.gz');assert runtime['candidate_sha256']==r['candidate_sha256'] and runtime['control_sha256']==b['unstripped_sha256']
assert runtime['case_count']==20 and not runtime['candidate_semantic_mismatches'] and not runtime['candidate_log_mismatches']
assert sha((P/'runtime/producer.py').read_bytes())==runtime['producer_sha256']
assert sha((ROOT/'scripts/pump_v3_configured_fee_differential.py').read_bytes())==runtime['fixture_sha256']
assert sha((ROOT/'scripts/pump_trade_fixture.py').read_bytes())==runtime['fixture_state_sha256']
loader=read(P/'runtime/loader-receipt.json')
loader_sha=next(h for name,h in loader['input_sha256'].items() if name.endswith('/pump_captured_loader.py'))
assert loader_sha==sha((P/'runtime/captured-loader-snapshot.py').read_bytes())
assert loader['loads'] and all(x['elf_prefix_unchanged'] and x['zero_allocation_tail'] for x in loader['loads'])
assert {x['elf_sha256'] for x in loader['loads']}=={runtime['original_sha256'],runtime['candidate_sha256'],runtime['control_sha256']}
from solders.transaction import Transaction
compute=re.compile(r'^Program .* consumed \d+ of \d+ compute units$')
logs=lambda r:[x for x in r['logs'] if not compute.fullmatch(x)]
semantic=['error','accounts','inner_instructions','event_payloads','return_data']
bad_control=[];successes=panics=0
for i,row in enumerate(runtime['cases']):
 for label in ('original','candidate','control'):
  state=row[label];assert state['signature_verified']
  assert all(Transaction.from_bytes(base64.b64decode(state['transaction_base64'])).verify_with_results())
 assert all(row['original'][k]==row['candidate'][k]==row['control'][k] for k in semantic)
 assert logs(row['original'])==logs(row['candidate'])
 if logs(row['original'])!=logs(row['control']):bad_control.append(i)
 successes+=row['original']['error'] is None
 panics+=any('panicked at programs/pump/src/lib.rs:193' in x for x in row['original']['logs'])
 if row['case']['operation']=='buy_v3':assert row['case']['amount']<row['case']['real_base']
assert bad_control==[3,4,8,9] and successes==13 and panics==5
print('Verified: shared original panic records, four recovered diagnostic logs, 20 signed local cases; native cohort1019/183 unchanged, all7actual callers retained. Costs0x80df8 remains unmatched.')
