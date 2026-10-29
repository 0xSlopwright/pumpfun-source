"""Explicit struct/trait slice schemas for the remaining format operands."""
from pathlib import Path
import json,struct,sys
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W));from elf_reader import Elf
from constructed import trace

def analyze(original,candidate,symbols,rows):
 o,c,s=Elf(Path(original)),Elf(Path(candidate)),Elf(Path(symbols));fs={f['start']:f for f in s.funcs};out=[]
 for r in rows:
  a,b=r['original'],r['candidate'];off=r['offset'];f=fs[b];n=f['size'];meaning=None;size=None;extra={}
  assert o.normalized[a:a+n]==c.normalized[b:b+n]and o.pattern(a,n)==c.pattern(b,n)
  if r['original_pointer']==0x11ca88:
   x=trace(o,a,n,a+off);y=trace(c,b,n,b+off)
   assert x and y and x['pairs']==y['pairs']and len(x['pairs'])==1 and x['pairs'][0]['length']==1
   g=fs[y['target']];assert any(z in g['name']for z in['fmt6format12format_inner','4core3fmt5write','panicking9panic_fmt'])
   assert o.normalized[x['target']:x['target']+g['size']]==c.normalized[y['target']:y['target']+g['size']]and o.pattern(x['target'],g['size'])==c.pattern(y['target'],g['size'])
   assert struct.unpack_from('<QQ',o.b,r['original_pointer'])==struct.unpack_from('<QQ',c.b,r['candidate_pointer'])==(1,0)
   meaning='one-element fmt pieces array: empty str pair, existing schema';size=16;extra={'array_elements':1,'element_bytes':16,'callee':g,'call_offset':x['call_offset']}
  elif r['original_pointer']==0x11bfd0:
   assert off==232 and 'repr_bitpacked..Repr' in f['name'];cp=b+off;op=a+off
   for e,p in[(o,op),(c,cp)]:
    assert struct.unpack_from('<BBhi',e.b,p-48)==(0x7a,10,-4096,4)
    assert struct.unpack_from('<BBhi',e.b,p-40)==(0xbf,0xa5,0,0)
    assert e.b[p]==0x18 and e.b[p+16]==0x85
   ot,ct=o.calls[op+16],c.calls[cp+16];g=fs[ct];assert 'debug_struct_field2_finish' in g['name']
   assert o.normalized[ot:ot+g['size']]==c.normalized[ct:ct+g['size']]and o.pattern(ot,g['size'])==c.pattern(ct,g['size'])
   assert struct.unpack_from('<BBhi',c.b,ct)==(0xbf,0x56,0,0)
   loads=[i for i in range(0,g['size'],8)if c.b[ct+i]==0x79 and c.b[ct+i+1]>>4==6 and struct.unpack_from('<h',c.b,ct+i+2)[0]==-4096];assert loads
   meaning='debug_struct_field2_finish first field-name str';size=4;extra={'callee':g,'stack_length_offset':-4096,'callee_length_load_offsets':loads}
  elif r['original_pointer']==0x11c0a8:
   assert 'PadAdapter' in f['name']
   for e,p in[(o,a+off),(c,b+off)]:
    assert e.b[p]==0x18 and e.b[p+1]==2
    assert struct.unpack_from('<BBhi',e.b,p+16)==(0xb7,3,0,4)
    assert struct.unpack_from('<BBhi',e.b,p+24)==(0x8d,0,0,4)
   meaning='fmt::Write::write_str indirect argument';size=4;extra={'indirect_register':4,'call_offset':off+24,'indirect_target_identity_claimed':False}
  if size:
   x=o.b[r['original_pointer']:r['original_pointer']+size];y=c.b[r['candidate_pointer']:r['candidate_pointer']+size];out.append(r|{'bytes':size,'meaning':meaning,'original_hex':x.hex(),'candidate_hex':y.hex(),'equal':x==y,**extra})
 return {'resolved':len(out),'rows':out,'scope':'Five observations reuse the already-known empty fmt piece schema. Indirect indentation claims only argument bytes, not the target identity or full indirect closure.'}
if __name__=='__main__':
 raise SystemExit('Use verify.py --root REPOSITORY.')
