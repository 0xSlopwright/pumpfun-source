"""Check the specific signed start-time branch, not global error dominance."""
from pathlib import Path
import struct,json
from elf_reader import Elf

def inspect(w):
 w=Path(w);o=Elf(w/'input-root/evidence/original/pump_amm/deployed.so');c=Elf(w/'artifacts/unstripped.so');f=next(f for f in c.funcs if '23update_token_incentives17h'in f['name']);a=f['start']
 def ins(e,p):return struct.unpack_from('<BBhi',e.b,p)
 # Original: r8=self, r7=current_timestamp, load self.start_time at+0xc0.
 assert ins(o,0x6db20+8)==(0xbf,0x28,0,0)
 assert ins(o,0x6db20+0x70)==(0x79,0x57,-4064,0)
 assert ins(o,0x6dbe0)==(0x79,0x81,512,0)
 assert ins(o,0x6dbe8)==(0xcd,0x17,93,0)
 assert ins(o,0x6dbf0)==(0x79,0x82,520,0)
 assert ins(o,0x6dc00)==(0xcd,0x72,1,0)
 # Joint: r2=self, r0=current_timestamp; signed current<start skips exactly
 # the immediate end_time load and signed end<current comparison.
 assert ins(c,a+0x70)==(0x79,0x50,-4064,0)
 assert ins(c,a+0xa8)==(0x79,0x21,512,0)
 assert ins(c,a+0xb0)==(0xcd,0x10,2,0)
 assert ins(c,a+0xb8)==(0x79,0x23,520,0)
 assert ins(c,a+0xc0)[0:2]==(0xcd,0x03)
 return {'original_function':'0x6db20','original_signed_branch':'0x6dbe8','original_taken_destination':hex(0x6dbe8+8+93*8),'joint_function':f,'joint_signed_branch_offset':0xb0,'joint_taken_destination_offset':0xc8,'self_start_time_offset':512,'self_end_time_offset':520,'current_timestamp_argument_stack_offset':-4064,'condition':'signed current_timestamp < stored start_time bypasses the immediate finished-range comparison','global_error_dominance_claim':False,'scope':__doc__}
if __name__=='__main__':print(json.dumps(inspect(Path(__file__).resolve().parent),indent=2))
