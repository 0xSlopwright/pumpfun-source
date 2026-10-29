from pathlib import Path
import argparse,hashlib,importlib.util,json,struct
W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def verify(directory):
 P=Path(directory);assert json.loads((P/'manifest.json').read_bytes())['files']=={str(p.relative_to(P)):sha(p)for p in P.rglob('*')if p.is_file()and p!=P/'manifest.json'}
 E=module('dayelf',P/'elf_reader.py').Elf;obj=module('dayobj',P/'object_reader.py');o=E(P/'original.so');c=E(P/'baseline-unstripped.so');f=next(f for f in c.funcs if'7end_day17h'in f['name']);assert f['size']==376
 explicit=next(x for x in obj.sections(P/'explicit.o')if'7end_day17h'in x['name']);assert explicit['size']==376 and explicit['code']==c.normalized[f['start']:f['start']+376]
 results=[]
 for name in ['closure','named','named_into','closure_locals','zero','guard','guard_option']:
  x=next(x for x in obj.sections(P/(name+'.o'))if'7end_day17h'in x['name']);assert x['size']==232 and x['code']!=o.normalized[0x6f3c8:0x6f4b0];results.append({'name':name,'bytes':232,'original_equal':False})
 for p in [0x6f3d0,0x6f430,0x6f458]:assert o.b[p]==0x65
 assert o.b[0x6f438]==o.b[0x6f460]==5
 for p in [0x6f410]:assert o.b[p]==0x18
 loc=0x122740;ptr,n,line,col=struct.unpack_from('<QQII',o.b,loc);assert o.b[ptr>>32:(ptr>>32)+n]==b'programs/pump-amm/src/state/volume_accumulator.rs'and(line,col)==(398,28)
 assert o.b[0x11d013:0x11d020]==b'SVM is 64-bit'
 return {'passed':True,'manifest_sha256':sha(P/'manifest.json'),'original_bytes':232,'baseline_bytes':376,'explicit_baseline_calibrated':True,'shared_conversion_variants':results,'original_common_panic_source':[398,28],'selected':False,'runtime_cases':0,'scope':'Calibrated small-object source-form controls only; no full-candidate or source-provenance recovery.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=W);a=p.parse_args();print(json.dumps(verify(a.directory),indent=2))
