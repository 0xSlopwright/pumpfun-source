from pathlib import Path
import collections,hashlib,json,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;sys.path.insert(0,str(R/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf

def objects(path):
 b=path.read_bytes();off=struct.unpack_from('<Q',b,40)[0];size,count,ni=struct.unpack_from('<HHH',b,58);ss=[struct.unpack_from('<IIQQQQIIQQ',b,off+i*size)for i in range(count)];out=collections.defaultdict(list)
 for s in ss:
  if s[1]!=2:continue
  ns=ss[s[6]];names=b[ns[4]:ns[4]+ns[5]]
  for p in range(s[4],s[4]+s[5],24):
   name,info,_,idx,value,length=struct.unpack_from('<IBBHQQ',b,p)
   if info&15==1 and length:out[value].append({'name':names[name:].split(b'\0',1)[0].decode(),'bytes':length})
 return out

def analyze(original=None,candidate=None,symbols=None,inventory=None):
 o=Elf(Path(original)if original else R/'evidence/original/pump_amm/deployed.so');c=Elf(Path(candidate)if candidate else R/'work/amm-fifth-wave-build-worker-20261027/build/artifacts/pump_amm_recovered.so');syms=objects(Path(symbols)if symbols else R/'work/amm-fifth-wave-build-worker-20261027/build/artifacts/unstripped.so');inv=json.loads((Path(inventory)if inventory else R/'work/amm-fifth-static-objects-next-20261027/inventory.json').read_bytes());out=[];unmapped=[]
 for r in inv['rows']:
  a,b=r['original_pointer'],r['candidate_pointer'];defs=syms.get(b,[])
  if not defs:unmapped.append(r);continue
  sizes={d['bytes']for d in defs};assert len(sizes)==1;n=next(iter(sizes));orels=[at-a for at in o.relocations if a<=at<a+n];crels=[at-b for at in c.relocations if b<=at<b+n]
  x,y=o.b[a:a+n],c.b[b:b+n];plain=not(orels or crels);text=all(32<=q<127 or q in[9,10,13]for q in y)
  out.append(r|{'candidate_object_symbols':defs,'candidate_object_bytes':n,'original_relocations':orels,'candidate_relocations':crels,'flat':plain,'candidate_printable':text,'raw_span_equal':x==y,'original_span_sha256':hashlib.sha256(x).hexdigest(),'candidate_span_sha256':hashlib.sha256(y).hexdigest()})
 groups=collections.defaultdict(list)
 for r in out:groups[(r['original'],r['offset'],r['candidate_object_bytes'])].append(r)
 flat=[r for r in out if r['flat']and not r['candidate_printable']];unequal=[r for r in flat if not r['raw_span_equal']];true=[r for r in unequal if not any(x['raw_span_equal']for x in groups[(r['original'],r['offset'],r['candidate_object_bytes'])])]
 result={'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'input_observations':len(inv['rows']),'exact_candidate_object_start_observations':len(out),'unmapped_candidate_object_starts':len(unmapped),'flat_nonprintable_observations':len(flat),'flat_nonprintable_equal':sum(r['raw_span_equal']for r in flat),'flat_nonprintable_unequal':len(unequal),'unequal_without_same_length_equal_alternative':len(true),'rows':out,'unmapped_rows':unmapped,'true_mismatch_rows':true,'scope':'Candidate STT_OBJECT lengths define compared byte spans only; original allocation extents are not inferred from the symbol table alone.'};return result
if __name__=='__main__':
 out=analyze();(W/'extents.json').write_text(json.dumps(out,indent=2)+'\n');print({k:v for k,v in out.items()if k not in['rows','unmapped_rows','true_mismatch_rows']})
 for r in out['true_mismatch_rows'][:25]:print('unpaired',hex(r['original']),r['offset'],hex(r['original_pointer']),r['candidate_object_bytes'],r['candidate_object_symbols'],r['candidate_names'][0])
