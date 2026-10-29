"""Read-only bounded first-block loads from unclassified relocated data."""
from pathlib import Path
import collections,hashlib,json,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;sys.path.insert(0,str(R/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf

def loads(e,reference):
 root=struct.unpack_from('<I',e.b,reference+4)[0]|struct.unpack_from('<I',e.b,reference+12)[0]<<32;regs={e.b[reference+1]&15:('root',0)};pc=reference+16;out=[]
 while pc<reference+512:
  op,rr,off,imm=struct.unpack_from('<BBhi',e.b,pc);dst,src=rr&15,rr>>4
  if op&7==5:break
  if op==0x18:regs.pop(dst,None);pc+=16;continue
  if op==0xbf:regs[dst]=regs.get(src)
  elif op==0xb7:regs[dst]=('int',imm)
  elif op==0x07:
   if regs.get(dst):regs[dst]=(regs[dst][0],regs[dst][1]+imm)
  elif op&7==1:
   base=regs.get(src);size={0x61:4,0x69:2,0x71:1,0x79:8}.get(op)
   if size and base and base[0]=='root':out.append({'instruction_offset':pc-reference,'offset':base[1]+off,'size':size})
   regs.pop(dst,None)
  elif op&7 in[4,7]:regs.pop(dst,None)
  pc+=8
 return root,out

def analyze(original=None,candidate=None,inventory=None):
 o=Elf(Path(original)if original else R/'evidence/original/pump_amm/deployed.so');c=Elf(Path(candidate)if candidate else R/'work/amm-fifth-wave-build-worker-20261027/build/artifacts/pump_amm_recovered.so');inv=json.loads((Path(inventory)if inventory else W/'inventory.json').read_bytes());out=[]
 for row in inv['rows']:
  ap,a=loads(o,row['original']+row['offset']);bp,b=loads(c,row['candidate']+row['offset']);assert a==b
  for read in a:
   x,y=ap+read['offset'],bp+read['offset'];n=read['size']
   if any(x<=p<x+n for p in o.relocations)or any(y<=p<y+n for p in c.relocations):continue
   out.append({k:row[k]for k in ['original','candidate','offset','original_pointer','candidate_pointer','candidate_names']}|read|{'reference_offset':row['offset'],'original_read_address':x,'candidate_read_address':y,'original_bytes':o.b[x:x+n].hex(),'candidate_bytes':c.b[y:y+n].hex(),'equal':o.b[x:x+n]==c.b[y:y+n]})
 groups=collections.defaultdict(list)
 for row in out:groups[(row['original'],row['reference_offset'],row['instruction_offset'],row['size'])].append(row)
 true=[r for r in out if not r['equal']and not any(x['equal']for x in groups[(r['original'],r['reference_offset'],r['instruction_offset'],r['size'])])];false=[r for r in out if not r['equal']and r not in true]
 d={'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'observations':len(out),'equal':sum(r['equal']for r in out),'false_cross_pairs':len(false),'without_equal_alternative':len(true),'read_sizes':dict(collections.Counter(r['size']for r in out)),'rows':out,'true_mismatch_rows':true,'scope':'First basic block fixed-address loads only. Relocated pointer words are excluded. This does not bound whole allocations.'}
 return d
if __name__=='__main__':
 d=analyze();(W/'reads.json').write_text(json.dumps(d,indent=2)+'\n')
