#!/usr/bin/env python3
from pathlib import Path
import argparse, hashlib, json, struct, sys
W=Path(__file__).resolve().parent

def verify(root):
 root=Path(root).resolve();sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 e=Elf(root/'evidence/original/pump_amm/deployed.so');assert hashlib.sha256(e.b).hexdigest()=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
 for at,target in [(0x3ee18,0x45940),(0x482f8,0xd7930),(0x48330,0xd84b0),(0x48e08,0xd7930),(0x48e40,0xd84b0)]:assert e.calls[at]==target,(hex(at),e.calls.get(at))
 for instruction,count in [(36952,1),(37306,2)]:
  at=instruction*8;assert e.b[at:at+4]==bytes.fromhex('7a0aa0ff')and struct.unpack_from('<i',e.b,at+4)[0]==count
 at=36647*8;opcode,regs,off,imm=struct.unpack_from('<BBhi',e.b,at);assert (opcode,regs,imm)==(0x55,0x01,0);target=at+8+off*8;assert target==36970*8
 assert e.b[35710*8:35710*8+4]==bytes.fromhex('71610000')
 for index,tag,dest in [(35711,0,35805),(35712,1,35781)]:
  op,regs,off,imm=struct.unpack_from('<BBhi',e.b,index*8);assert(op,regs,imm)==(0x15,0x01,tag)and index+1+off==dest
 return {'passed':True,'original_sha256':hashlib.sha256(e.b).hexdigest(),'curve_helper':{'start':'0x45940','size':16912},'source_descriptor':{'tag_offset':0,'user_tag':0,'pool_tag':1,'pool_pointer_branch':hex(at)},'cpi_calls':['0x482f8','0x48e08'],'getter_calls':['0x48330','0x48e40'],'signer_group_counts':[1,2],'scope':'Confirms calls and branch encoding. Rust source descriptor type/name is inferred only; not authenticated.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
