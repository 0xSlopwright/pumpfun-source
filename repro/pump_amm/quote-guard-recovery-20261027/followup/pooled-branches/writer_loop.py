"""Verify the bounded first-phase IDL discriminator copy loop."""
from pathlib import Path
import json,struct,sys
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W));from elf_reader import Elf

def analyze(original,candidate,symbols,rows):
 o,c,s=Elf(Path(original)),Elf(Path(candidate)),Elf(Path(symbols));row=next(r for r in rows if r['original']==0xf2040);f=next(f for f in s.funcs if f['start']==row['candidate']);a,b=row['original'],row['candidate'];assert 'IdlAccount' in f['name']and f['size']==944
 assert o.normalized[a:a+944]==c.normalized[b:b+944]and o.pattern(a,944)==c.pattern(b,944)
 # These checked operations establish p+remaining=8 and n=min(remaining,free),
 # so each copy's source interval [p,p+n) is contained in [0,8).
 ops={16:(0xb7,6,0,8),88:(0x05,0,14,0),112:(0xbf,0x92,0,0),120:(0xbf,0x73,0,0),176:(0x0f,0x79,0,0),184:(0x1f,0x76,0,0),192:(0xbf,0x85,0,0),200:(0x15,6,19,0),208:(0xbf,0x53,0,0),216:(0xad,0x45,1,0),224:(0xbf,0x43,0,0),240:(0xbf,0x41,0,0),248:(0x1f,0x31,0,0),256:(0xbf,0x67,0,0),264:(0xad,0x16,-22,0),272:(0xbf,0x17,0,0),280:(0x05,0,-24,0)}
 for e,start in[(o,a),(c,b)]:
  for offset,expected in ops.items():assert struct.unpack_from('<BBhi',e.b,start+offset)==expected,(offset,expected)
  assert e.b[start+24]==0x18 and e.b[start+25]==9
  assert e.b[start+128]==0x85
 ct,ot=c.calls[b+128],o.calls[a+128];g=next(f for f in s.funcs if f['start']==ct);assert g['name']=='memcpy'and g['size']==32
 assert o.normalized[ot:ot+32]==c.normalized[ct:ct+32]and o.pattern(ot,32)==c.pattern(ct,32)
 p,q=row['original_pointer'],row['candidate_pointer'];av,cv=o.b[p:p+8],c.b[q:q+8];assert av==cv
 # Executable integer check of all remaining states and capacities across a
 # representative range supplements the structural all-u64 inequality proof.
 checks=0
 for remaining in range(9):
  pos=8-remaining
  for capacity in range(17):
   for written in range(17):
    free=capacity-min(written,capacity);n=min(remaining,free)
    assert 0<=n<=remaining and 0<=pos<=pos+n<=8 and pos+n+(remaining-n)==8;checks+=1
 return {'resolved':1,'row':row|{'bytes':8,'original_hex':av.hex(),'candidate_hex':cv.hex(),'equal':True,'memcpy_offset':128,'memcpy_bytes':32},'verified_loop_operations':len(ops),'invariant_checks':checks,'invariant':'source_offset + remaining == 8; copy_length = min(remaining, capacity - min(written, capacity)); source range is contained in [0,8).','scope':'First IDL discriminator phase only. The second 32-byte account-authority phase uses a different pointer and is not attributed to this static object.'}
if __name__=='__main__':
 raise SystemExit('Use verify.py --root REPOSITORY.')
