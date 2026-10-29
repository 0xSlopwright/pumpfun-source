from pathlib import Path
import sys,json,hashlib,gzip,re,base64,datetime
R=Path('/mnt/c/Users/ahi20/Documents/ChatGPT/pumpfun-source');L=Path('/home/ahi200/pumpfun-work/20261029-pump-legacy-exact-sol');O=L/'runtime-current';O.mkdir()
sys.path.insert(0,str(R/'scripts'));import pump_captured_loader as loader;loader.install();import pump_legacy_buy_differential as h
from solders.transaction import Transaction
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
images={'original':R/'evidence/original/pump/deployed.so','parent':L/'current-parent/candidate.so','candidate':L/'current-guard/candidate.so'};hashes={k:sha(p) for k,p in images.items()}
cases=h.cases();assert len(cases)==284
cases += [{'name':'corrected_quote_zero_spend2','kind':'buy_exact_sol_in','amount':2,'minimum':1},{'name':'corrected_quote_positive_spend3','kind':'buy_exact_sol_in','amount':3,'minimum':1}]
fields=['error','before','accounts','events','inner','return_data','transaction_base64']
compute=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
logs=lambda r:[s for s in r['logs'] if not compute.fullmatch(s)]
records=[];comparisons=[]
for i,c in enumerate(cases):
 row={'index':i,'case':c,'results':{},'loader':{}}
 for name,path in images.items():
  loader.LOADS.clear();r=h.run(c,path);loads=list(loader.LOADS);assert len(loads)==1 and loads[0]['elf_sha256']==hashes[name] and loads[0]['elf_prefix_unchanged'] and loads[0]['zero_allocation_tail'],loads
  tx=Transaction.from_bytes(base64.b64decode(r['transaction_base64']));tx.verify();r['verified_serialized_signatures']=len(tx.signatures)
  row['results'][name]=r;row['loader'][name]=loads[0]
 p=row['results']['parent'];q=row['results']['candidate'];o=row['results']['original']
 comp={'index':i,'parent_candidate_fields':[f for f in fields if p[f]!=q[f]],'original_parent_fields':[f for f in fields if o[f]!=p[f]],'original_candidate_fields':[f for f in fields if o[f]!=q[f]],'parent_candidate_logs_equal':logs(p)==logs(q),'original_parent_logs_equal':logs(o)==logs(p),'original_candidate_logs_equal':logs(o)==logs(q)}
 row['comparison']=comp;comparisons.append(comp);records.append(row)
 if i%25==0:print('cases',i+1,flush=True)
summary={'scope':'Fresh local signed legacy cases on exact current Linux images; only complete compute-meter log lines excluded; no Source substitution','started_images':hashes,'images_unchanged':hashes=={k:sha(p) for k,p in images.items()},'case_count':len(cases),'executions':len(records)*3,'signatures':sum(r['verified_serialized_signatures'] for row in records for r in row['results'].values()),'original_successes':sum(row['results']['original']['error'] is None for row in records),'mismatches':[c for c in comparisons if any(c[k] for k in ['parent_candidate_fields','original_parent_fields','original_candidate_fields']) or not all(c[k] for k in ['parent_candidate_logs_equal','original_parent_logs_equal','original_candidate_logs_equal'])],'boundary_logs':[{k:v for k,v in row.items() if k in ['index','case']}|{'original_logs':row['results']['original']['logs']} for row in records[-2:]],'controller_sha256':sha(Path(__file__)),'imported_scripts':{str(Path(m.__file__).resolve().relative_to(R)):sha(Path(m.__file__)) for m in list(sys.modules.values()) if getattr(m,'__file__',None) and Path(m.__file__).resolve().is_relative_to(R)},'at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
(O/'records.json.gz').write_bytes(gzip.compress(json.dumps(records).encode(),mtime=0));(O/'summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps({k:v for k,v in summary.items() if k not in ['boundary_logs','imported_scripts']}),flush=True);assert summary['images_unchanged'] and not summary['mismatches']