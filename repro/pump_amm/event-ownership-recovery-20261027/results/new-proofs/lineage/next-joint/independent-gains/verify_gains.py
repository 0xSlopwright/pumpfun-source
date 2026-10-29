from pathlib import Path
import json,struct,sys
W=Path(__file__).resolve().parent

def trace_context(e,start,size):
 reg={2:0};slots={};reads=[];p=start
 while p<start+size:
  op,rr,off,imm=struct.unpack_from('<BBhi',e.b,p);d,s=rr&15,rr>>4
  if op==0x7b and d==10:
   slots.pop(off,None)
   if s in reg:slots[off]=reg[s]
  elif op==0xbf:
   v=reg.get(s);reg.pop(d,None)
   if v is not None:reg[d]=v
  elif op==0x07:
   if d in reg:reg[d]+=imm
  elif op in(0x79,0x71,0x69,0x61):
   if s in reg:reads.append({'instruction_offset':p-start,'field_offset':reg[s]+off,'load_opcode':op})
   reg.pop(d,None)
   if s==10 and off in slots and op==0x79:reg[d]=slots[off]
  elif op==0x85:
   for r in range(6):reg.pop(r,None)
  elif op&7 in(1,4,7):reg.pop(d,None)
  p+=16 if op==0x18 else 8
 return reads

def verify(root,candidate,symbols):
 sys.path.insert(0,str(W/'reader'));from elf_reader import Elf
 o,c,s=Elf(Path(root)/'evidence/original/pump_amm/deployed.so'),Elf(Path(candidate)),Elf(Path(symbols));fs={f['start']:f for f in s.funcs};rows=json.loads((W/'new-body-audit.json').read_bytes());assert[(r['original'],r['candidate']['size'])for r in rows]==[(0xe31a0,3064),(0xe8ae8,1064),(0xe8f10,1064),(0xe9338,1064)]
 exact=0;unequal=[];logs=[]
 names={0xe31a0:'CreatePool',0xe8ae8:'BuyV2',0xe8f10:'BuyExactQuoteInV2',0xe9338:'SellV2'}
 for row in rows:
  a,b,n=row['original'],row['candidate']['start'],row['candidate']['size'];assert row['candidate']==fs[b]and o.normalized[a:a+n]==c.normalized[b:b+n]and o.pattern(a,n)==c.pattern(b,n)
  calls=[]
  for pc,ct in sorted(c.calls.items()):
   if not b<=pc<b+n:continue
   ot=o.calls[a+pc-b];g=fs[ct];on=o.entries[o.entries.index(ot)+1]-ot;eq=on==g['size']and o.normalized[ot:ot+on]==c.normalized[ct:ct+on]and o.pattern(ot,on)==c.pattern(ct,on);calls.append({'offset':pc-b,'original_target':ot,'original_bytes':on,'candidate':g,'equal':eq});exact+=eq
   if not eq:unequal.append((a,pc-b,ot,on,g['size']))
  assert calls==row['calls']
  def pointer(e,p):return struct.unpack_from('<I',e.b,p+4)[0]|struct.unpack_from('<I',e.b,p+12)[0]<<32
  for e,base in[(o,a),(c,b)]:assert e.b[base+40]==0x18 and e.b[base+41]==1 and e.relocations[base+64]=={'type':10,'symbol':'sol_log_'}
  length=struct.unpack_from('<i',o.b,a+60)[0];assert length==struct.unpack_from('<i',c.b,b+60)[0];ap,bp=pointer(o,a+40),pointer(c,b+40);expected=('Instruction: '+names[a]).encode();assert o.b[ap:ap+length]==c.b[bp:bp+length]==expected;assert c.b[bp+1:bp+1+length]!=expected;logs.append({'instruction':names[a],'bytes':length})
 assert exact==25 and unequal==[(0xe31a0,2456,0x2ba60,10240,11104),(0xe8ae8,528,0x53350,5840,5440),(0xe8f10,528,0x54a20,7112,6368),(0xe9338,528,0x56710,5904,6792)]
 desc=json.loads((W/'new-descriptors.json').read_bytes());assert len(desc)==8;text=code=0
 for r in desc:
  if r['kind']=='text_descriptor':
   a,b=r['original_pointer'],r['candidate_pointer'];ap=struct.unpack_from('<Q',o.b,a)[0]>>32;bp=struct.unpack_from('<Q',c.b,b)[0]>>32;ln=struct.unpack_from('<Q',o.b,a+8)[0];assert ln==struct.unpack_from('<Q',c.b,b+8)[0];x,y=o.b[ap:ap+ln],c.b[bp:bp+ln];assert x==y and x.decode()==r['original_text']==r['candidate_text'];assert x in[b'Invalid bool representation: ',b'failed to fill whole buffer'];mutated=bytearray(y);mutated[-1]^=1;assert bytes(mutated)!=x;text+=1
  else:
   assert r['kind']=='code_pointer'and r['body_pair'];a,b=r['original_target'],r['candidate_target'];f=fs[b];assert f['size']==40 and o.normalized[a:a+40]==c.normalized[b:b+40]and o.pattern(a,40)==c.pattern(b,40);code+=1
 assert(text,code)==(6,2)
 ctx=json.loads((W/'context-abi.json').read_bytes())
 for r in ctx['v2_contexts']:
  f=r['handler_candidate'];assert f==fs[f['start']];assert trace_context(o,r['handler_original'],o.entries[o.entries.index(r['handler_original'])+1]-r['handler_original'])==r['original_reads'];assert trace_context(c,f['start'],f['size'])==r['candidate_reads'];assert[r['field_offset']for r in r['original_reads']]==[8,33]and[r['field_offset']for r in r['candidate_reads']]==[8,33]
 preview=ctx['preview'];assert preview==fs[preview['start']]and preview['size']==296;assert o.normalized[0x565e8:0x56710]==c.normalized[preview['start']:preview['start']+296]and o.pattern(0x565e8,296)==c.pattern(preview['start'],296)
 method=ctx['scalar_total_user_quote_method'];assert method==fs[method['start']]and method['size']==600;assert o.normalized[0x50ca8:0x50ca8+32]==c.normalized[method['start']:method['start']+32]
 return {'passed':True,'new_normalized_wrappers':4,'exact_actual_direct_targets':25,'unequal_business_handler_calls':[{'wrapper':hex(a),'offset':off,'original_target':hex(t),'original_bytes':n,'candidate_bytes':cn}for a,off,t,n,cn in unequal],'instruction_logs':logs,'text_descriptors_equal':6,'formatter_code_pointers_equal':2,'full_v2_context_bytes':40,'used_context_fields':[8,33],'restored_preview_bytes':296,'restored_scalar_method_bytes':600,'scope':'Full new wrapper bodies plus actual immediate targets/operands. Four business handlers remain unequal; method600 is an ABI/shape check, not full source-origin identity.'}
