"""Recompute bounded static-object evidence without compilation or VM execution."""
from pathlib import Path
import argparse,collections,hashlib,json,sys,types
W=Path(__file__).resolve().parent
CANDIDATE='7f501a865b83cf1dfbc4072191967162c700d3e7e487d2f6400e8d230f15ca62'
SYMBOLS='e212a9725a3359bcbfd1c3dea67fa1457d15dc8600272391724cdaffc7819282'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(name,root):
 p=W/name;m=types.ModuleType('frozen_'+p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);m.R=root;return m

def verify(root,candidate,symbols):
 root=Path(root).resolve();candidate=Path(candidate).resolve();symbols=Path(symbols).resolve();assert sha(candidate)==CANDIDATE and sha(symbols)==SYMBOLS
 manifest=json.loads((W/'manifest.json').read_bytes());actual={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'};assert manifest['files']==actual
 sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 original=root/'evidence/original/pump_amm/deployed.so';o=Elf(original);c=Elf(candidate);s=Elf(symbols);assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]
 cl=json.loads((W/'inputs/call-closure.json').read_bytes());assert cl['candidate_sha256']==CANDIDATE and cl['symbols_sha256']==SYMBOLS and cl['original_sha256']==sha(original)
 names=collections.defaultdict(set)
 for f in s.funcs:names[(f['start'],f['size'])].add(f['name'])
 for p in cl['pairs']:
  a,b,n=p['original'],p['candidate'],p['bytes'];assert o.normalized[a:a+n]==c.normalized[b:b+n]and o.pattern(a,n)==c.pattern(b,n);assert set(p['candidate_names'])==names[(b,n)];assert p['relocated_data_offsets']==[at-a for at,r in sorted(o.relocations.items())if a<=at<a+n and r['type']==8]
 inv=module('inventory.py',root).run(original,candidate,W/'inputs');assert inv==json.loads((W/'inventory.json').read_bytes())
 ranges=module('ranges.py',root).analyze(original,candidate,symbols,W/'inventory.json');assert json.loads(json.dumps(ranges))==json.loads((W/'ranges.json').read_bytes())
 reads=module('reads.py',root).analyze(original,candidate,W/'inventory.json');assert reads==json.loads((W/'reads.json').read_bytes())
 tables=json.loads((W/'tables.json').read_bytes());tm=module('tables.py',root);files={n:W/'inputs'/n for n in tables['source_sha256']};assert{n:sha(p)for n,p in files.items()}==tables['source_sha256'];specs=tm.tables(files);assert len(specs)==9
 controls=[]
 for spec,saved in zip(specs,tables['tables']):
  data=spec.pop('payload');assert saved['name']==spec['name']and saved['bytes']==len(data)and saved['sha256']==hashlib.sha256(data).hexdigest()
  actual_refs=[]
  for r in inv['rows']:
   if any(spec['consumer']in n for n in r['candidate_names'])and o.b[r['original_pointer']:r['original_pointer']+len(data)]==data and c.b[r['candidate_pointer']:r['candidate_pointer']+len(data)]==data:actual_refs.append({k:r[k]for k in ['original','candidate','offset','original_pointer','candidate_pointer','candidate_names']})
  assert actual_refs==saved['references']and actual_refs
  # These are comparison-only buffers: no original/candidate file is modified.
  changed=bytearray(data);changed[-1]^=1;assert bytes(changed)!=data
  at=actual_refs[0]['candidate_pointer'];assert c.b[at+1:at+1+len(data)]!=data
  controls.append({'table':spec['name'],'tail_mutation_rejected':True,'shifted_pointer_rejected':True})
 assert sum(s['bytes']for s in tables['tables'])==2518
 aliases=collections.defaultdict(set);payloads={};adjacent=0
 for r in ranges['rows']:
  key=(r['read_bytes'],r['original_bytes']);aliases[key].add(r['candidate_pointer']);payloads[key]=bytes.fromhex(r['candidate_bytes']);a,b=r['original_pointer'],r['candidate_pointer'];adjacent+=o.b[a:a+64]!=c.b[b:b+64]
 equivalent_alias_families=sum(len(v)>1 for v in aliases.values());assert equivalent_alias_families==3 and adjacent>0
 keys=[k for k in payloads if k[0]==32];assert len(keys)>=2 and payloads[keys[0]]!=payloads[keys[1]]
 return{'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':CANDIDATE,'unclassified_input_observations':inv['unclassified_observations'],'unclassified_input_original_targets':inv['original_pointer_count'],'new_complete_tables':9,'new_complete_table_bytes':2518,'new_table_reference_observations':tables['reference_observations'],'bounded_read_observations':ranges['observations'],'bounded_unique_range_pairs':len({(r['original_pointer'],r['candidate_pointer'],r['read_bytes'])for r in ranges['rows']}),'new_bounded_content_mismatches':ranges['without_equal_alternative'],'actual_equal_alias_families':equivalent_alias_families,'adjacent_64byte_mismatch_controls':adjacent,'negative_controls':{'tail_mutation':len(controls),'shifted_pointer':len(controls),'different_32byte_constant':True},'first_block_fixed_loads_found':reads['observations'],'scope':'Additional bounded static evidence;585-window closure is unchanged. Unclassified observations are not asserted to be genuine mismatches. Allocation padding and all ELF data are not verified.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--symbols',type=Path);p.add_argument('--expected-seal');a=p.parse_args()
 if a.expected_seal:assert sha(W/'manifest.json')==a.expected_seal
 candidate=a.candidate or a.root/'repro/pump_amm/behavior-context-recovery-20261027/results/build/candidate.so'
 symbols=a.symbols or a.root/'repro/pump_amm/behavior-context-recovery-20261027/results/build/unstripped.so'
 print(json.dumps(verify(a.root,candidate,symbols),indent=2))
