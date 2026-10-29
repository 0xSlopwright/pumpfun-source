"""Verify local field-layout evidence; the object is not executable program recovery."""
from pathlib import Path
import hashlib,json,struct,sys

def verify(root,directory):
 root=Path(root);d=Path(directory);p=json.loads((d/'provenance.json').read_bytes());sha=lambda x:hashlib.sha256(x.read_bytes()).hexdigest();assert sha(d/'reference.rlib')==p['reference_rlib_sha256']and sha(d/'fields-retained.o')==p['object_sha256']
 raw=(root/'evidence/original/pump_amm/deployed.so').read_bytes();assert raw[0x11e55e:0x11e55e+32].hex()==p['original_program_id_bytes']
 # Exact original loads: creator key, borrowed Pool base-mint, event virtual quote.
 assert raw[0x1ef90+24:0x1ef90+32].hex()=='7981100000000000'
 assert raw[0x1ef90+104:0x1ef90+112].hex()=='7981000000000000'
 assert raw[0x1ef90+112:0x1ef90+120].hex()=='0701000028000000'
 assert raw[0x1ef90+2648:0x1ef90+2656].hex()=='7913f00000000000'
 assert raw[0x1ef90+2656:0x1ef90+2664].hex()=='7911e80000000000'
 b=(d/'fields-retained.o').read_bytes();off=struct.unpack_from('<Q',b,40)[0];size,count,ni=struct.unpack_from('<HHH',b,58);ss=[struct.unpack_from('<IIQQQQIIQQ',b,off+i*size)for i in range(count)];ns=ss[ni];names=b[ns[4]:ns[4]+ns[5]];found={}
 for section in ss:
  name=names[section[0]:].split(b'\0',1)[0].decode()
  for key,part in [('base','4base17'),('creator','7creator17'),('virtual_quote','13virtual_quote17')]:
   if name.startswith('.text.')and part in name:found[key]=b[section[4]:section[4]+section[5]]
 assert set(found)=={'base','creator','virtual_quote'}
 assert found['base'][:8].hex()=='7922000000000000'and found['base'][56:64].hex()=='7922280000000000'
 assert found['creator'][:16].hex()=='79221000000000007922000000000000'
 assert found['virtual_quote'][:16].hex()=='79220000000000007923f00000000000'and found['virtual_quote'][24:32].hex()=='7922e80000000000'
 assert '-C link-dead-code'in(d/'build_layout.sh').read_text()
 return{'passed':True,'creator_account_offset':16,'pool_base_mint_offset':40,'pool_virtual_quote_offsets':[232,240],'original_program_id_equal':True,'scope':'Local Rust layout probe compiled with dead-code retention, used only to identify field accesses. No program-body equality claim.'}
if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);a=p.parse_args();print(json.dumps(verify(a.root,a.directory),indent=2))
