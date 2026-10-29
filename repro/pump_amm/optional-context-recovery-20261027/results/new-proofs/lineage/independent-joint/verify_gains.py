from pathlib import Path
import json,struct,sys
W=Path(__file__).resolve().parent

def verify(root,candidate,symbols):
 sys.path.insert(0,str(W/'reader'));from elf_reader import Elf
 o,c,s=Elf(Path(root)/'evidence/original/pump_amm/deployed.so'),Elf(Path(candidate)),Elf(Path(symbols));fs={f['start']:f for f in s.funcs};rs=json.loads((W/'new-body-audit.json').read_bytes());assert[(r['original'],r['candidate']['size'])for r in rs]==[(0x52c58,1784),(0x6f4b0,344),(0xe7648,1856),(0xe7d88,1856)]
 exact=0;open_calls=[];data=[]
 for r in rs:
  a,b,n=r['original'],r['candidate']['start'],r['candidate']['size'];assert r['candidate']==fs[b];assert o.normalized[a:a+n]==c.normalized[b:b+n]and o.pattern(a,n)==c.pattern(b,n)
  observed=[]
  for pc,ct in sorted(c.calls.items()):
   if not b<=pc<b+n:continue
   ot=o.calls[a+pc-b];on=o.entries[o.entries.index(ot)+1]-ot;g=fs[ct];eq=on==g['size']and o.normalized[ot:ot+on]==c.normalized[ct:ct+on]and o.pattern(ot,on)==c.pattern(ct,on)
   observed.append({'offset':pc-b,'original_target':ot,'original_bytes':on,'candidate':g,'equal_body_and_relocations':eq})
   if eq:exact+=1
   else:open_calls.append({'wrapper':a,'offset':pc-b,'original_target':ot,'original_bytes':on,'candidate_bytes':g['size']})
  assert observed==r['direct_calls']
  if a in(0xe7648,0xe7d88):
   for e,base in[(o,a),(c,b)]:
    assert e.b[base+40]==0x18 and struct.unpack_from('<BBhi',e.b,base+56)[:3]==(0xb7,2,0)and e.relocations[base+64]=={'type':10,'symbol':'sol_log_'}
   length=struct.unpack_from('<i',o.b,a+60)[0];assert length==struct.unpack_from('<i',c.b,b+60)[0]
   def ptr(e,p):return struct.unpack_from('<I',e.b,p+4)[0]|struct.unpack_from('<I',e.b,p+12)[0]<<32
   x,y=ptr(o,a+40),ptr(c,b+40);expected=b'Instruction: Buy'if a==0xe7648 else b'Instruction: BuyExactQuoteIn';assert o.b[x:x+length]==c.b[y:y+length]==expected
   assert o.b[x:x+length]!=c.b[y+1:y+1+length];data.append({'wrapper':a,'instruction_log':expected.decode(),'bytes':length})
 desc=json.loads((W/'new-descriptors.json').read_bytes());assert len(desc)==8
 text=code=0
 for r in desc:
  if r['kind']=='text_descriptor':
   a,b=r['original_pointer'],r['candidate_pointer'];assert o.relocations[a]['type']==c.relocations[b]['type']==8
   op=struct.unpack_from('<Q',o.b,a)[0]>>32;cp=struct.unpack_from('<Q',c.b,b)[0]>>32;ln=struct.unpack_from('<Q',o.b,a+8)[0];assert ln==struct.unpack_from('<Q',c.b,b+8)[0];x,y=o.b[op:op+ln],c.b[cp:cp+ln];assert x==y and x.decode()==r['original_text']==r['candidate_text'];assert x in[b'Invalid bool representation: ',b'failed to fill whole buffer']
   changed=bytearray(y);changed[-1]^=1;assert bytes(changed)!=x and c.b[cp+1:cp+1+ln]!=x;text+=1
  else:
   assert r['kind']=='code_pointer'and r['body_pair'];a,b=r['original_target'],r['candidate_target'];f=fs[b];n=f['size'];assert n==40 and o.normalized[a:a+n]==c.normalized[b:b+n]and o.pattern(a,n)==c.pattern(b,n);code+=1
 assert exact==19 and len(open_calls)==2 and all(c['offset']==600 for c in open_calls)and(text,code)==(5,3)
 assert[(r['offset'],r['original_bytes'])for r in rs[0]['direct_calls']]==[(96,232),(816,224),(1728,160)]
 assert[(r['offset'],r['original_bytes'])for r in rs[1]['direct_calls']]==[(256,576),(280,288)]
 return {'passed':True,'new_normalized_body_windows':4,'exact_actual_direct_targets':19,'unmatched_business_handler_calls':open_calls,'instruction_logs':data,'equal_text_descriptors':text,'exact_formatter_code_pointers':code,'negative_pointer_and_tail_tests':True,'scope':'Four new full normalized bodies and their actual referenced operands; two business-handler callees remain unequal. This is not four new recursively closed functions.'}
