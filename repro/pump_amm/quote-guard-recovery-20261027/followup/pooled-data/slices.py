"""Bound pooled literals by concrete slice/byte consumer ABIs and direct jumps."""
from pathlib import Path
import collections,hashlib,json,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;sys.path.insert(0,str(R/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf

def trace(e,start,reference):
 end=e.entries[e.entries.index(start)+1]if start in e.entries and e.entries.index(start)+1<len(e.entries)else e.hi
 regs={};pc=reference;seen=set()
 while start<=pc<end and len(seen)<256:
  if pc in seen:return None
  seen.add(pc);op,rr,off,imm=struct.unpack_from('<BBhi',e.b,pc);dst,src=rr&15,rr>>4
  if op==0x18:
   value=struct.unpack_from('<I',e.b,pc+4)[0]|struct.unpack_from('<I',e.b,pc+12)[0]<<32;regs[dst]=('static',value)if e.relocations.get(pc,{}).get('type')==8 else('int',value);pc+=16;continue
  if op==0xbf:regs[dst]=regs.get(src)
  elif op==0xb7:regs[dst]=('int',imm)
  elif op==0x07:
   if regs.get(dst):regs[dst]=(regs[dst][0],regs[dst][1]+imm)
  elif op==0x05:pc+=8+off*8;continue
  elif op==0x85:return pc,regs,e.calls.get(pc)
  elif op&7==5:return None
  elif op&7 in[1,4,7]:regs.pop(dst,None)
  pc+=8
 return None

def abi(name,size):
 if name=='memcmp':return [(1,3,'compared bytes'),(2,3,'compared bytes')]
 if name in['memcpy','memmove']:return [(2,3,'copied bytes')]
 if '5error5Error17with_account_name17h'in name and size==656:return[(4,5,'account-name str')]
 if '8builders11DebugStruct5field17h'in name:return[(2,3,'DebugStruct field-name str')]
 if 'fmt..Write$GT$9write_str17h'in name:return[(2,3,'fmt write_str slice')]
 if 'Formatter25debug_tuple_field1_finish17h'in name:return[(2,3,'DebugTuple name str')]
 if '9Formatter11debug_tuple17h'in name:return[(3,4,'DebugTuple name str')]
 if '9Formatter3pad17h'in name:return[(2,3,'Formatter pad str')]
 if 'BpfWriter' in name and '$GT$9write_all17h'in name:return[(2,3,'BpfWriter input slice')]
 if 'Instruction16new_with_bincode17h'in name:return[(2,None,'program Pubkey')]
 if 'AccountInfo6assign17h'in name:return[(2,None,'owner Pubkey')]
 if 'ConvertVec$GT$6to_vec17hb49f5afaa6e10b06E'in name and size==192:return[(2,3,'slice-to-Vec byte input')]
 if 'std2io5error5Error3new17h301e2ac2735fb1baE'in name and size==304:return[(2,3,'I/O error message str')]
 return []

def sole_word_prefix(e,target,arg):
 # The pointer is neither copied nor stored before being replaced by its
 # first u32 read. This is a four-byte enum discriminant, not a 64-byte blob.
 pc=target
 while pc<target+80:
  op,rr,off,_=struct.unpack_from('<BBhi',e.b,pc);dst,src=rr&15,rr>>4
  if op==0x61 and dst==src==arg and off==0:return {'load_offset':pc-target,'bytes':4,'argument':arg}
  if op&7==5 or dst==arg or src==arg:return None
  pc+=16 if op==0x18 else 8
 return None

def analyze(root,original,candidate,symbols,observations):
 o=Elf(Path(original));c=Elf(Path(candidate));s=Elf(Path(symbols));names={p['start']:p for p in s.funcs};rows=json.loads(Path(observations).read_bytes());out=[];unresolved=[]
 for row in rows:
  ao=trace(o,row['original'],row['original']+row['offset']);ac=trace(c,row['candidate'],row['candidate']+row['offset']);found=False
  if ao and ac:
   at,ar,ot=ao;ct,cr,nt=ac;f=names.get(nt)
   if not f and o.relocations.get(at)==c.relocations.get(ct)=={'type':10,'symbol':'sol_log_'}and ar.get(1)==('static',row['original_pointer'])and cr.get(1)==('static',row['candidate_pointer'])and ar.get(2)==cr.get(2)and ar.get(2,('',0))[0]=='int':
    n=ar[2][1];assert 0<n<=4096 and at-row['original']==ct-row['candidate'];a,b=row['original_pointer'],row['candidate_pointer'];x,y=o.b[a:a+n],c.b[b:b+n];out.append({k:row[k]for k in ['original','candidate','offset','original_pointer','candidate_pointer']}|{'bytes':n,'meaning':'sol_log byte input','consumer':{'name':'sol_log_','kind':'external syscall'},'call_offset':at-row['original'],'original_hex':x.hex(),'candidate_hex':y.hex(),'equal':x==y});found=True
   if f:
    arg=2 if ('ErrorCode4name17h'in f['name']or'PumpAmmError4name17h'in f['name'])else 1 if ('ErrorCode$u20$as$u20$core..fmt..Display'in f['name']or'PumpAmmError$u20$as$u20$core..fmt..Display'in f['name'])else None
    if arg and sole_word_prefix(o,ot,arg)and sole_word_prefix(c,nt,arg)and ar.get(arg)==('static',row['original_pointer'])and cr.get(arg)==('static',row['candidate_pointer']):
     assert at-row['original']==ct-row['candidate'];assert o.normalized[ot:ot+f['size']]==c.normalized[nt:nt+f['size']]and o.pattern(ot,f['size'])==c.pattern(nt,f['size'])
     n=4;a,b=row['original_pointer'],row['candidate_pointer'];x,y=o.b[a:a+n],c.b[b:b+n];out.append({k:row[k]for k in ['original','candidate','offset','original_pointer','candidate_pointer']}|{'bytes':n,'meaning':'enum discriminant u32','consumer':f,'call_offset':at-row['original'],'original_hex':x.hex(),'candidate_hex':y.hex(),'equal':x==y});found=True
    for pa,la,meaning in abi(f['name'],f['size']):
     av,bv=ar.get(pa),cr.get(pa)
     if av!=('static',row['original_pointer'])or bv!=('static',row['candidate_pointer']):continue
     if la is None:n=32
     elif ar.get(la)and ar[la][0]=='int'and ar.get(la)==cr.get(la):n=ar[la][1]
     else:continue
     if not 0<n<=4096:continue
     assert at-row['original']==ct-row['candidate'];assert o.normalized[ot:ot+f['size']]==c.normalized[nt:nt+f['size']]and o.pattern(ot,f['size'])==c.pattern(nt,f['size'])
     a,b=row['original_pointer'],row['candidate_pointer'];x,y=o.b[a:a+n],c.b[b:b+n];out.append({k:row[k]for k in ['original','candidate','offset','original_pointer','candidate_pointer']}|{'bytes':n,'meaning':meaning,'consumer':f,'call_offset':at-row['original'],'original_hex':x.hex(),'candidate_hex':y.hex(),'equal':x==y});found=True
  if not found:unresolved.append(row)
 groups=collections.defaultdict(list)
 for row in out:groups[(row['original_pointer'],row['candidate_pointer'],row['bytes'])].append(row)
 return {'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'input_observations':len(rows),'bounded_observations':len(out),'unique_bounded_ranges':len(groups),'mismatches':sum(not row['equal']for row in out),'remaining_observations':len(unresolved),'rows':out,'remaining_rows':unresolved,'scope':'Exact paired consumer bodies plus observed scalar/fat-pointer ABI bounds; direct jumps only, no unknown conditional guesses or whole-allocation claims.'}
if __name__=='__main__':
 raise SystemExit('Use verify.py --root REPOSITORY to run the sealed audit.')
