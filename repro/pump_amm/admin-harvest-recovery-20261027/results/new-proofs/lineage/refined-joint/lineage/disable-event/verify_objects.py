from pathlib import Path
import argparse,hashlib,json,struct,types
W=Path(__file__).resolve().parent
def module(name):
 p=W/name;m=types.ModuleType(p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(root,candidate,symbols):
 E=module('elf_reader.py').Elf;ob=module('object_reader.py');o,c,s=E(Path(root)/'evidence/original/pump_amm/deployed.so'),E(Path(candidate)),E(Path(symbols));assert sha(o.path)=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'and sha(c.path)=='03b78a92cccf354e5a5f369d0d03d72c473fc6546e9373101ede0ffcf7857efb'
 field='18pump_amm_recovered7disable17h';f=next(f for f in s.funcs if field in f['name']);base=next(f for f in ob.sections(W/'full-base.o')if field in f['name']);borrow=next(f for f in ob.sections(W/'full-borrow.o')if field in f['name'])
 assert base['size']==f['size']==3088 and base['code']==c.normalized[f['start']:f['start']+f['size']]
 linked=[(r['offset'],1 if r['type']==8 else r['type'])for r in c.pattern(f['start'],f['size'])]+[(r['offset'],10)for r in c.callsites(f['start'],f['size'])]
 assert sorted(linked)==sorted((r['offset'],r['type'])for r in base['relocations'])
 orig=o.normalized[0x17960:0x17960+3024];diff=[{'offset':i,'original':orig[i:i+8].hex(),'object':borrow['code'][i:i+8].hex()}for i in range(0,min(len(orig),len(borrow['code'])),8)if orig[i:i+8]!=borrow['code'][i:i+8]]
 expected=[(r['offset'],1 if r['type']==8 else r['type'])for r in o.pattern(0x17960,3024)]+[(r['offset'],10)for r in o.callsites(0x17960,3024)]
 return{'passed':True,'baseline_calibrates_all_body_bytes':True,'baseline_calibrates_all_call_relocation_positions':True,'base_bytes':base['size'],'borrow_bytes':borrow['size'],'original_bytes':3024,'borrow_all_normalized_bytes_equal_original':borrow['size']==3024 and not diff,'borrow_call_relocation_positions_equal_original':sorted(expected)==sorted((r['offset'],r['type'])for r in borrow['relocations']),'differences':diff,'object_sha256':{k:sha(W/('full-'+k+'.o'))for k in ['base','borrow']},'patch_sha256':sha(W/'recovery.patch'),'scope':'Direct full-crate objects only; a linked contextual build and runtime qualification remain separate.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);a=p.parse_args();result=verify(a.root,a.candidate,a.symbols);(W/'full-object-verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
