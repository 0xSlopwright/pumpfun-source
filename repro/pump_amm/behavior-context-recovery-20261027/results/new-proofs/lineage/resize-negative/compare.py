import importlib.util,json,struct
from pathlib import Path
r=Path.cwd();w=r/'work/amm-pool-resize-lifetimes-20261027'
s=importlib.util.spec_from_file_location('er',r/'repro/pump_amm/claim-self-transfer-v144/static-tool/elf_reader.py');e=importlib.util.module_from_spec(s);s.loader.exec_module(e)
o=e.Elf(r/'evidence/original/pump_amm/deployed.so');c=e.Elf(r/'work/amm-pool-prepare-refined-20261027/build/artifacts/unstripped.so')
f=next(f for f in c.funcs if '12prepare_pool17' in f['name']);control=c.normalized[f['start']:f['start']+f['size']];original=o.normalized[0x58028:0x58028+3552]
p=w/'variants.o';b=p.read_bytes();off=struct.unpack_from('<Q',b,40)[0];size,count,ni=struct.unpack_from('<HHH',b,58);ss=[struct.unpack_from('<IIQQQQIIQQ',b,off+i*size)for i in range(count)];ns=ss[ni];names=b[ns[4]:ns[4]+ns[5]];out=[]
for idx,sec in enumerate(ss):
 name=names[sec[0]:].split(b'\0',1)[0].decode()
 if not name.startswith('.text.') or not any(n in name for n in ['baseline','direct_nested','length_bindings']):continue
 data=bytearray(b[sec[4]:sec[4]+sec[5]])
 for rel in ss:
  if rel[1]!=9 or rel[7]!=idx:continue
  for pos in range(rel[4],rel[4]+rel[5],16):
   at,info=struct.unpack_from('<QQ',b,pos);typ=info&0xffffffff
   if typ==1:
    data[at+4:at+8]=bytes(4);data[at+12:at+16]=bytes(4)
   elif typ==10:data[at+4:at+8]=bytes(4)
 out.append(dict(name=name,bytes=len(data),equals_full_control=bytes(data)==control,equals_original=bytes(data)==original,aligned_original_slots=sum(data[i:i+8]==original[i:i+8]for i in range(0,min(len(data),len(original)),8))))
(w/'comparison.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
