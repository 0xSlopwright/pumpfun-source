from pathlib import Path
import hashlib,importlib.util,json
def verify(root):
 w=Path(root);p=w/'elf_reader.py';s=importlib.util.spec_from_file_location('raw_gain_elf',p);e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
 o=e.Elf(w/'input-root/evidence/original/pump_amm/deployed.so');c=e.Elf(w/'build/artifacts/pump_amm_recovered.so');symbols=e.Elf(w/'build/artifacts/unstripped.so')
 report=json.loads((w/'raw-gain-review.json').read_text());measurement=json.loads((w/'measurement.json').read_text())
 assert report['candidate_sha256']==measurement['candidate_sha256']==hashlib.sha256(c.b).hexdigest()
 assert report['raw_losses']==measurement['raw_losses']==[] and len(report['gains'])==len(measurement['raw_gains'])==11
 assert [int(r['original'],16)for r in report['gains']]==measurement['raw_gains']
 calls=total=0
 for r in report['gains']:
  a=int(r['original'],16);size=r['bytes'];body=o.b[a:a+size];assert hashlib.sha256(body).hexdigest()==r['body_sha256'];total+=size
  assert o.pattern(a,size)==r['original_relocations']==[]
  for f in r['raw_equal_candidates']:assert f in symbols.funcs and f['size']==size and c.b[f['start']:f['start']+size]==body
  f=r['raw_equal_candidates'][0];oc=o.callsites(a,size);cc=c.callsites(f['start'],size);assert len(oc)==len(cc)==r['original_call_count']==len(r['actual_calls'])
  for x,y,saved in zip(oc,cc,r['actual_calls']):
   i=o.entries.index(x['target']);z=o.entries[i+1]if i+1<len(o.entries)else o.hi;target=next(t for t in symbols.funcs if t['start']==y['target']);n=z-x['target']
   assert x['offset']==y['offset']==saved['offset'] and x['target']==saved['original_target']and y['target']==saved['candidate_target']
   assert target['size']==n and target['name']==saved['callee'] and saved['full_body_and_relocations_match']
   assert o.normalized[x['target']:z]==c.normalized[y['target']:y['target']+n] and o.pattern(x['target'],n)==c.pattern(y['target'],n);calls+=1
 assert total==4384 and calls==27
 return {'passed':True,'raw_gained_windows':11,'raw_gained_bytes':total,'actual_matched_direct_calls':calls,'data_relocations':0,'raw_lost_windows':0,'scope':'Every new raw body equals captured original bytes. These bodies already matched under normalization in ea14; this is placement progress, not eleven new semantic recoveries.'}
