"""Reusable actual-body/callee check for the vault selector and Pubkey-vector growth."""
from pathlib import Path
import argparse,gzip,hashlib,json,struct,sys,tempfile,types
sys.dont_write_bytecode=True
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(path,name):
 p=Path(path);m=types.ModuleType(name);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def verify(candidate,symbols,directory=None):
 d=Path(directory)if directory else Path(__file__).resolve().parent;files={str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and'__pycache__'not in p.parts and p!=d/'manifest.json'};assert files==json.loads((d/'manifest.json').read_text())['files']
 original=gzip.decompress((d/'original.so.gz').read_bytes());assert hashlib.sha256(original).hexdigest()==ORIGINAL;Elf=module(d/'elf_reader.py','vault_elf').Elf;C,S=Elf(Path(candidate)),Elf(Path(symbols));assert C.b[C.lo:C.hi]==S.b[S.lo:S.hi]and C.pattern(C.lo,C.hi-C.lo)==S.pattern(S.lo,S.hi-S.lo)
 with tempfile.TemporaryDirectory()as temp:
  p=Path(temp)/'original.so';p.write_bytes(original);O=Elf(p)
  def calls(a,b,n):
   left,right=O.callsites(a,n),C.callsites(b,n);assert len(left)==len(right);out=[]
   for x,y in zip(left,right):
    assert x['offset']==y['offset'];idx=O.entries.index(x['target']);size=O.entries[idx+1]-O.entries[idx];f=next(f for f in S.funcs if f['start']==y['target']);assert f['size']==size and O.normalized[x['target']:x['target']+size]==C.normalized[y['target']:y['target']+size]and O.pattern(x['target'],size)==C.pattern(y['target'],size);out.append({'offset':x['offset'],'original':x['target'],'candidate':y['target'],'bytes':size})
   return out
  f=next(f for f in S.funcs if '14vault_for_mint17'in f['name']);a,n,b=0x452e0,1256,f['start'];assert f['size']==n;x,y=bytearray(O.normalized[a:a+n]),bytearray(C.normalized[b:b+n]);diff=[i for i in range(0,n,8)if x[i:i+8]!=y[i:i+8]];assert set(diff)<={720,728}
  for offset,op in [(720,0x62),(728,0x7a)]:assert x[offset]==y[offset]==op and x[offset:offset+4]==y[offset:offset+4];x[offset+4:offset+8]=y[offset+4:offset+8]
  assert x==y and O.pattern(a,n)==C.pattern(b,n);direct=calls(a,b,n);assert len(direct)==9;bounds=[]
  for side,E,start in [('original',O,a),('candidate',C,b)]:
   for offset in [856,1200,1232]:
    assert E.b[start+offset]==0x18;ptr=struct.unpack_from('<I',E.b,start+offset+4)[0]|struct.unpack_from('<I',E.b,start+offset+12)[0]<<32;raw,length,line,col=struct.unpack_from('<QQII',E.b,ptr);assert E.relocations[ptr]['type']==8;name=E.b[raw>>32:(raw>>32)+length].decode();assert name.startswith('programs/pump-amm/src/')and name.endswith('.rs')and line>0 and col>0;bounds.append({'side':side,'offset':offset,'filename':name,'line':line,'column':col})
  choices=[f for f in S.funcs if f['size']==352 and O.normalized[0xbb80:0xbce0]==C.normalized[f['start']:f['start']+352]and O.pattern(0xbb80,352)==C.pattern(f['start'],352)];assert choices
  growth=choices[0];growth_calls=calls(0xbb80,growth['start'],352);assert len(growth_calls)==2
  return {'verified':True,'candidate_sha256':sha(candidate),'symbols_sha256':sha(symbols),'vault_bytes':1256,'vault_origin_offsets':[720,728],'vault_actual_callees':direct,'bounds_source_locations':bounds,'pubkey_vector_growth':growth,'growth_actual_callees':growth_calls,'executes_runtime':False,'scope':'Exact normalized vault body except two source-origin immediates, all nine actual callees, exact352-byte growth body and both actual callees. Bounds descriptors are parsed as genuine source locations; their historical filename/line/column values remain different.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);p.add_argument('--directory',type=Path);a=p.parse_args();print(json.dumps(verify(a.candidate,a.symbols,a.directory),indent=2))
