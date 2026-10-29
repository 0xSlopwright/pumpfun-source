"""Bound direct static byte reads at straight-line memcmp/memcpy call sites."""
from pathlib import Path
import collections,hashlib,json,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;sys.path.insert(0,str(R/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf

def trace(e,start,reference):
 regs={};pc=reference;stop=min(start+8192,reference+512)
 while pc<stop:
  op,rr=struct.unpack_from('<BB',e.b,pc);dst,src=rr&15,rr>>4;imm=struct.unpack_from('<i',e.b,pc+4)[0]
  if op==0x18:
   value=struct.unpack_from('<I',e.b,pc+4)[0]|struct.unpack_from('<I',e.b,pc+12)[0]<<32
   regs[dst]=('static',value)if e.relocations.get(pc,{}).get('type')==8 else('int',value);pc+=16;continue
  if op==0xbf:regs[dst]=regs.get(src)
  elif op==0xb7:regs[dst]=('int',imm)
  elif op==0x07:
   if regs.get(dst)and regs[dst][0]in['int','static']:regs[dst]=(regs[dst][0],regs[dst][1]+imm)
   else:regs.pop(dst,None)
  elif op==0x85:return pc,regs,e.calls.get(pc)
  elif op&7==5:return None
  elif op&7 in[4,7,1]:regs.pop(dst,None)
  pc+=8
 return None

def analyze(original=None,candidate=None,symbols=None,inventory=None):
 o=Elf(Path(original)if original else R/'evidence/original/pump_amm/deployed.so');c=Elf(Path(candidate)if candidate else R/'work/amm-fifth-wave-build-worker-20261027/build/artifacts/pump_amm_recovered.so');s=Elf(Path(symbols)if symbols else R/'work/amm-fifth-wave-build-worker-20261027/build/artifacts/unstripped.so');by={p['start']:p for p in s.funcs};inv=json.loads((Path(inventory)if inventory else W/'inventory.json').read_bytes());out=[]
 for row in inv['rows']:
  a=trace(o,row['original'],row['original']+row['offset']);b=trace(c,row['candidate'],row['candidate']+row['offset'])
  if a is None or b is None:continue
  ap,ar,at=a;bp,br,bt=b;f=by.get(bt)
  if f is None:continue
  enum_word=('ErrorCode4name' in f['name']or'PumpAmmError4name' in f['name'])and c.b[bt:bt+8]==bytes.fromhex('6122000000000000')and o.b[at:at+8]==bytes.fromhex('6122000000000000')
  if enum_word:
   n=4;args=[2];primitive='enum-first-word'
  else:
   if f['name']not in['memcmp','memcpy','memmove']:continue
   if ar.get(3) is None or ar[3][0]!='int' or ar.get(3)!=br.get(3):continue
   n=ar[3][1]
   if not 0<n<=4096:continue
   args=[1,2]if f['name']=='memcmp'else[2];primitive=f['name']
  for arg in args:
   av,bv=ar.get(arg),br.get(arg)
   if av!=('static',row['original_pointer'])or bv!=('static',row['candidate_pointer']):continue
   orig,cand=av[1],bv[1];assert o.normalized[at:at+f['size']]==c.normalized[bt:bt+f['size']]and o.pattern(at,f['size'])==c.pattern(bt,f['size'])
   out.append({k:row[k]for k in ['original','candidate','offset','original_pointer','candidate_pointer','candidate_names','in_direct_closure']}|{'read_bytes':n,'primitive':primitive,'argument':arg,'original_call_offset':ap-row['original'],'candidate_call_offset':bp-row['candidate'],'callee_bytes':f['size'],'equal':o.b[orig:orig+n]==c.b[cand:cand+n],'original_bytes':o.b[orig:orig+n].hex(),'candidate_bytes':c.b[cand:cand+n].hex()})
 groups=collections.defaultdict(list)
 for row in out:groups[(row['original'],row['offset'],row['read_bytes'])].append(row)
 false=[r for r in out if not r['equal']and any(a['equal']for a in groups[(r['original'],r['offset'],r['read_bytes'])])];true=[r for r in out if not r['equal']and not any(a['equal']for a in groups[(r['original'],r['offset'],r['read_bytes'])])]
 result={'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'observations':len(out),'equal':sum(r['equal']for r in out),'false_cross_pairs':len(false),'without_equal_alternative':len(true),'primitive_counts':dict(collections.Counter(r['primitive']for r in out)),'read_lengths':dict(collections.Counter(r['read_bytes']for r in out)),'rows':out,'true_mismatch_rows':true,'scope':'Proves only actual fixed byte ranges consumed before the first straight-line primitive call; never infers allocation padding from adjacent bytes.'}
 return result
if __name__=='__main__':
 result=analyze();(W/'ranges.json').write_text(json.dumps(result,indent=2)+'\n')
