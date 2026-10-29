"""Verify the saved fee-context proof; this does not execute a runtime or rebuild."""
from pathlib import Path
import argparse,base64,collections,difflib,gzip,hashlib,importlib.util,json,sys,tempfile
from solders.transaction import Transaction
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
HB=lambda b:hashlib.sha256(b).hexdigest()
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
CANDIDATE='4b5cf3d08ae25fd82ac05e54200436c9adbff09471b6ad68b232977802912807'
BASELINE='a4b978ee1ab15dd822a31bc42e85d55e409f4e777f7af671a3197ea175891101'
DEPENDENCIES={'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'8190d3f7ceb6cb7a7a8d8924bff89f9f611e15ce1f806f2b6237f3311a98f697','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'15a2e615a42e20f31714bbaaee43002ae6f1cda2e8d7118243117ab3c1342e2d','pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'4f2955d0f6b40cc9ff7daa18ccad7d19119ba1249759f4e7e3bb691beee6b35e','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'6804554e69fd3a58caa191dc4a58f4c67223d30ca28ab8987f39fc18d2f7374d','6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P':'7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'}
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(path,name):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m

def receipts(d,stem,candidate_hash,bad):
 cleaner=module(d/'cleaner.py','fee_context_clean');r=load(d/'focused'/(stem+'.json.gz'));o=load(d/'focused'/(stem+'-transactions.json.gz'))
 assert r['candidate_sha256']==candidate_hash and r['original_sha256']==ORIGINAL
 assert r['producer_sha256']==o['script_sha256']==H(d/'probe.py')
 assert o['observer_sha256']==H(d/'observer.py') and len(r['cases'])==r['case_count']==72
 assert len(o['transactions'])==o['transaction_count']==144
 found=[];sigs=success=0
 for i,row in enumerate(r['cases']):
  a,b=row['original'],row['candidate'];assert a['transaction_base64']==b['transaction_base64']and a['before']==b['before'];x,y=map(cleaner.clean,[a,b]);diff=[k for k in x if x[k]!=y.get(k)];assert diff==row['mismatched_fields'];success+=a['error']is None
  if diff:found.append(i)
  for j,side in enumerate(['original','candidate']):
   q=row[side];t=o['transactions'][2*i+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);v=tx.verify_with_results();assert v and all(v)and t['all_signatures_verified'];assert len(v)==t['signature_count'];sigs+=len(v)
   assert HB(raw)==t['transaction_sha256'] and t['transaction_base64']==q['transaction_base64'];assert t['amm_program_sha256']==r[side+'_sha256'];assert t['logs_sha256']==HB(json.dumps(q['logs'],separators=(',',':')).encode())
   keys=set(map(str,tx.message.account_keys));assert set(q['before'])==set(q['after']) and not set(q['before'])-keys;assert keys-set(q['before'])<=set(t['loaded_programs'])|{'11111111111111111111111111111111'}
   for pid,h in DEPENDENCIES.items():assert t['loaded_programs'][pid]['sha256']==h
 assert found==bad and len(found)==r['mismatch_count'] and sigs==o['signature_count']==144
 return r,{'cases':72,'signatures':sigs,'mismatch_indices':found,'original_successes':success}

def normalized_rows(original,candidate,symbols):
 assert candidate.b[candidate.lo:candidate.hi]==symbols.b[symbols.lo:symbols.hi]
 assert candidate.pattern(candidate.lo,candidate.hi-candidate.lo)==symbols.pattern(symbols.lo,symbols.hi-symbols.lo)
 index=collections.defaultdict(list)
 for f in symbols.funcs:
  a,n=f['start'],f['size'];key=(n,HB(candidate.normalized[a:a+n]),json.dumps(candidate.pattern(a,n),sort_keys=True));index[key].append({'start':a,'name':f['name'],'raw_sha256':HB(candidate.b[a:a+n])})
 es=sorted(set(original.entries)|{original.lo});rows=[]
 for a,b in zip(es,es[1:]+[original.hi]):
  ms=index[(b-a,HB(original.normalized[a:b]),json.dumps(original.pattern(a,b-a),sort_keys=True))];rows.append({'start':a,'end':b,'matches':ms,'raw_match':any(m['raw_sha256']==HB(original.b[a:b])for m in ms)})
 return rows

def verify(directory,candidate=None):
 d=Path(directory);candidate=Path(candidate)if candidate else d/'candidate.so';manifest=load(d/'manifest.json');assert set(manifest['files'])=={str(p.relative_to(d))for p in d.rglob('*')if p.is_file()and'__pycache__'not in p.parts and p.name!='manifest.json'}
 for rel,h in manifest['files'].items():assert H(d/rel)==h,rel
 assert H(candidate)==H(d/'candidate.so')==CANDIDATE and H(d/'baseline.so')==BASELINE
 record=load(d/'build.json');assert record['returncode']==0 and record['source_unchanged'];assert record['source_sha256']==record['source_after_sha256'];assert record['dependency_cache_before']==record['dependency_cache_after'] and len(record['dependency_cache_before'])==732;assert not record['priming'];assert record['comparison']['candidate_sha256']==CANDIDATE and record['archived_unstripped_sha256']==record['unstripped_sha256']==H(d/'unstripped.so')
 local=0
 for name,h in record['source_sha256'].items():
  if '/source-paired/'in name:assert H(d/'source'/name.split('/source-paired/',1)[1])==h;local+=1
 assert local==46 and len(record['source_sha256'])==215
 before=(d/'source-before.rs').read_text().splitlines(keepends=True);after=(d/'source/programs/pump-amm/src/multi_hop.rs').read_text().splitlines(keepends=True)
 assert ''.join(difflib.unified_diff(before,after,fromfile='a/programs/pump-amm/src/multi_hop.rs',tofile='b/programs/pump-amm/src/multi_hop.rs'))==(d/'recovery.patch').read_text()
 Elf=module(d/'elf_reader.py','fee_context_elf').Elf
 original=gzip.decompress((d/'original.so.gz').read_bytes());assert HB(original)==ORIGINAL
 with tempfile.TemporaryDirectory()as tmp:
  p=Path(tmp)/'original.so';p.write_bytes(original);O=Elf(p);C=Elf(candidate);S=Elf(d/'unstripped.so');B=Elf(d/'baseline.so');BS=Elf(d/'baseline-unstripped.so');rows=normalized_rows(O,C,S);base_rows=normalized_rows(O,B,BS)
  saved=load(d/'measurement.json');assert rows==saved['rows'];assert len(rows)==785 and sum(bool(x['matches'])for x in rows)==599 and sum(x['raw_match']for x in rows)==125
  bc={r['start']:r for r in base_rows};cc={r['start']:r for r in rows};delta={'gains':[hex(k)for k in bc if not bc[k]['matches']and cc[k]['matches']],'losses':[hex(k)for k in bc if bc[k]['matches']and not cc[k]['matches']],'raw_gains':[hex(k)for k in bc if not bc[k]['raw_match']and cc[k]['raw_match']],'raw_losses':[hex(k)for k in bc if bc[k]['raw_match']and not cc[k]['raw_match']]};assert delta==load(d/'measurement-delta.json')=={'gains':[],'losses':[],'raw_gains':[],'raw_losses':[]}
  f=next(x for x in S.funcs if 'apply_hop_fees17'in x['name']);selector=next(x for x in S.funcs if 'select_and_apply_v217'in x['name']);a=f['start'];assert f['size']==536;assert O.normalized[0x44ab0:0x44ab0+216]==C.normalized[a:a+216];assert O.pattern(0x44ab0,536)==C.pattern(a,536);assert O.calls[0x44ab0+208]==0x14088 and C.calls[a+208]==selector['start'];assert O.normalized[0x44ab0:0x44cc8]!=C.normalized[a:a+536]
  old=next(x for x in BS.funcs if 'select_and_apply_v217'in x['name']);assert B.normalized[old['start']:old['start']+old['size']]==C.normalized[selector['start']:selector['start']+selector['size']]
  assert [x for x,t in O.calls.items()if t==0x44ab0]==[0x42a70,0x42b98]
  assert O.b[34061*8:34062*8].hex()=='79a898f600000000' and O.b[34105*8:34106*8].hex()=='7b8a40f900000000'
 br,bv=receipts(d,'baseline',BASELINE,[18,54]);cr,cv=receipts(d,'paired',CANDIDATE,[])
 for a,b in zip(br['cases'],cr['cases']):assert a['case']==b['case'] and a['original']==b['original'];assert a['candidate']['transaction_base64']==b['candidate']['transaction_base64'] and a['candidate']['before']==b['candidate']['before']
 for i in [18,54]:
  x=br['cases'][i];assert x['case']['canonical']and x['case']['reserves']==[0,10**9]and x['case']['fee_config_len']==2511;assert '6025'in x['original']['error']and'6083'in x['candidate']['error']
 runtime=module(d/'runtime/verify.py','fee_context_runtime').verify(d/'runtime',candidate)
 return {'verified':True,'candidate_sha256':CANDIDATE,'normalized_matches':599,'raw_matches':125,'window_gains':[],'window_losses':[],'wrapper_prefix_bytes_exact':216,'full_wrapper_exact':False,'new_cases':72,'new_candidate_mismatches':0,'baseline_mismatches':2,'existing_cases':runtime['cases'],'candidate_signatures':runtime['verified_signatures']+cv['signatures'],'baseline_signatures':bv['signatures'],'source_inputs':215,'local_source_inputs':local,'dependency_artifacts_unchanged':732,'executes_runtime':False,'scope':'Verifies saved signatures, full logged results/accounts, source/build records, complete window census and actual wrapper-to-selector call pairing. Registry archives and SDK provenance remain in the inherited checkpoint proof.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);p.add_argument('--candidate',type=Path);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate),indent=2))
