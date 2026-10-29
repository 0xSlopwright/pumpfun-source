"""Portable read-only verification of full Error vtables and proven word reads."""
from pathlib import Path
import argparse,hashlib,json,sys,types
W=Path(__file__).resolve().parent
CANDIDATE='be10ca1a530ef9c62be5c94a5183f339e5d7661dce588a9458767e20a5e488f6'
SYMBOLS='39420099acbe3f90c1e62d449e8892775b751f8c84aa61ac78c8425fdf9c2af3'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(name,root):
 p=W/name;m=types.ModuleType('audit_'+p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);m.R=root;m.W=W;return m

def verify(root,candidate,symbols):
 root=Path(root).resolve();candidate=Path(candidate).resolve();symbols=Path(symbols).resolve();assert sha(candidate)==CANDIDATE and sha(symbols)==SYMBOLS
 manifest=json.loads((W/'manifest.json').read_bytes());assert manifest['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 original=root/'evidence/original/pump_amm/deployed.so';o=Elf(original);c=Elf(candidate);cl=json.loads((W/'inputs/call-closure.json').read_bytes());assert cl['candidate_sha256']==CANDIDATE and cl['symbols_sha256']==SYMBOLS
 for pair in cl['pairs']:
  a,b,n=pair['original'],pair['candidate'],pair['bytes'];assert o.normalized[a:a+n]==c.normalized[b:b+n]and o.pattern(a,n)==c.pattern(b,n)
 inv=module('inventory.py',root).run(original,candidate,W/'inputs');assert inv==json.loads((W/'inventory.json').read_bytes())
 words=module('word_ranges.py',root).analyze(original,candidate,symbols,W/'inventory.json');assert json.loads(json.dumps(words))==json.loads((W/'word-ranges.json').read_bytes())
 before=module('base_ranges.py',root).analyze(original,candidate,symbols,inv);old={(r['original'],r['candidate'],r['offset'],r['read_bytes'])for r in before['rows']};added=[r for r in words['rows']if(r['original'],r['candidate'],r['offset'],r['read_bytes'])not in old]
 assert len(added)==1;row=added[0];assert row['original']==0x6f608 and row['offset']==160 and row['read_bytes']==4 and row['original_bytes']==row['candidate_bytes']=='57000000'
 swapped=(88).to_bytes(4,'little');assert swapped!=bytes.fromhex(row['original_bytes'])
 vtables=module('vtables.py',root).analyze(root,original,candidate,symbols,W/'inputs/descriptors.json',W/'inputs/data-closure.json');assert vtables==json.loads((W/'error-vtables.json').read_bytes())
 assert vtables['unique_error_vtables']==4 and vtables['negative_controls']=={'late_type_id_target_substitution_rejected':4,'shifted_vtable_pointer_rejected':4}
 assert sum(r['valid_full_alias']for r in vtables['alias_matrix'])==10
 return{'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':CANDIDATE,'error_vtable_observations':vtables['observations'],'full_error_vtables':4,'full_error_vtable_bytes':352,'nested_display_vtables':4,'nested_display_vtable_bytes':128,'full_alias_pairs':10,'rejected_alias_pairs':6,'negative_controls':vtables['negative_controls'],'new_proved_word_read':{'original_function':'0x6f608','reference_offset':160,'read_bytes':4,'value':87},'all_fixed_read_observations':words['observations'],'all_fixed_reads_equal':words['equal']==words['observations'],'bounded_closure_windows_unchanged':586,'scope':'Strengthens concrete static bounds and late vtable targets without changing program counts or claiming full ELF identity.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--symbols',type=Path);a=p.parse_args();base=a.root/'repro/pump_amm/quote-guard-recovery-20261027/results/build';print(json.dumps(verify(a.root,a.candidate or base/'candidate.so',a.symbols or base/'unstripped.so'),indent=2))
