"""Reusable bounded static check for the recovered AMM route classifiers."""
from pathlib import Path
import argparse,gzip,hashlib,json,struct,sys,tempfile,types
sys.dont_write_bytecode=True
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(path):
 p=Path(path);m=types.ModuleType('route_static_elf');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def verify(candidate,symbols,directory=None):
 d=Path(directory)if directory else Path(__file__).resolve().parent
 inventory={str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and'__pycache__'not in p.parts and p!=d/'manifest.json'};assert inventory==json.loads((d/'manifest.json').read_text())['files']
 raw=gzip.decompress((d/'original.so.gz').read_bytes());assert hashlib.sha256(raw).hexdigest()==ORIGINAL
 Elf=module(d/'elf_reader.py').Elf;candidate,symbols=Path(candidate),Path(symbols);C,S=Elf(candidate),Elf(symbols)
 assert C.b[C.lo:C.hi]==S.b[S.lo:S.hi]and C.pattern(C.lo,C.hi-C.lo)==S.pattern(S.lo,S.hi-S.lo),'symbols do not bind to candidate text'
 results=[]
 with tempfile.TemporaryDirectory()as temp:
  op=Path(temp)/'original.so';op.write_bytes(raw);O=Elf(op)
  for token,a,size,fields,source_offset in [('12is_curve_hop17',0x3d8d0,752,[560,568],520),('11program_for17',0x40308,1416,[824,832],784)]:
   functions=[f for f in S.funcs if token in f['name']];assert len(functions)==1,(token,functions);f=functions[0];b=f['start'];assert f['size']==size,(token,f['size'],size)
   old,new=bytearray(O.normalized[a:a+size]),bytearray(C.normalized[b:b+size]);differences=[off for off in range(0,size,8)if old[off:off+8]!=new[off:off+8]];assert set(differences)<=set(fields),(token,differences)
   for off,opcode in zip(fields,[0x62,0x7a]):
    assert old[off]==new[off]==opcode and old[off:off+4]==new[off:off+4],(token,off,'non-origin instruction changed');old[off+4:off+8]=new[off+4:off+8]
   assert old==new and O.pattern(a,size)==C.pattern(b,size),(token,'body or relocation pattern')
   def pointer(elf,start,offset):
    assert elf.b[start+offset]==0x18
    return struct.unpack_from('<I',elf.b,start+offset+4)[0]|(struct.unpack_from('<I',elf.b,start+offset+12)[0]<<32)
   original_lddw=[off for off in range(0,size,8)if O.b[a+off]==0x18];constants=[]
   for off in original_lddw[:2]:
    x,y=pointer(O,a,off),pointer(C,b,off);xb,yb=O.b[x:x+32],C.b[y:y+32];assert len(xb)==len(yb)==32 and xb==yb,(token,off,'owner/token ID differs');constants.append({'offset':off,'bytes_hex':xb.hex()})
   oc,cc=O.callsites(a,size),C.callsites(b,size);assert len(oc)==len(cc)==(7 if size==752 else 6);callees=[]
   for x,y in zip(oc,cc):
    assert x['offset']==y['offset'];idx=O.entries.index(x['target']);n=O.entries[idx+1]-O.entries[idx];fs=[f for f in S.funcs if f['start']==y['target']and f['size']==n];assert fs,(token,x,y,n)
    assert O.normalized[x['target']:x['target']+n]==C.normalized[y['target']:y['target']+n]and O.pattern(x['target'],n)==C.pattern(y['target'],n),(token,x['offset'],'actual callee changed');callees.append({'offset':x['offset'],'original':x['target'],'candidate':y['target'],'bytes':n})
   origins={}
   for side,elf,start in [('original',O,a),('candidate',C,b)]:
    address=pointer(elf,start,source_offset);line=struct.unpack_from('<I',elf.b,start+fields[0]+4)[0];length=struct.unpack_from('<I',elf.b,start+fields[1]+4)[0];name=elf.b[address:address+length].decode();assert name.startswith('programs/pump-amm/src/')and name.endswith('.rs')and line>0,(token,side,name,line);origins[side]={'filename':name,'line':line,'filename_length':length}
   results.append({'original_start':a,'candidate_start':b,'name':f['name'],'bytes':size,'allowed_origin_offsets':fields,'actual_differing_offsets':differences,'source_origins':origins,'actual_constants':constants,'actual_callees':callees})
 return {'verified':True,'candidate_sha256':sha(candidate),'symbols_sha256':sha(symbols),'functions':results,'executes_runtime':False,'scope':'Only the two declared source-origin instruction immediates may differ. Actual token/owner Pubkey objects and complete bodies/relocations at every direct call target are equal. Other transitive data remains outside this bounded check.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);p.add_argument('--directory',type=Path);a=p.parse_args();print(json.dumps(verify(a.candidate,a.symbols,a.directory),indent=2))
