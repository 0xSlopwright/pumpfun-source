from pathlib import Path
import hashlib,json,struct,sys

def sections(path):
 b=path.read_bytes();off=struct.unpack_from('<Q',b,40)[0];size,count,ni=struct.unpack_from('<HHH',b,58);ss=[struct.unpack_from('<IIQQQQIIQQ',b,off+i*size)for i in range(count)];ns=ss[ni];names=b[ns[4]:ns[4]+ns[5]];out=[]
 for i,s in enumerate(ss):
  name=names[s[0]:].split(b'\0',1)[0].decode()
  if not name.startswith('.text.'):continue
  code=bytearray(b[s[4]:s[4]+s[5]]);rels=[]
  for r in ss:
   if r[1]!=9 or r[7]!=i:continue
   sym=ss[r[6]];ns=ss[sym[6]];strings=b[ns[4]:ns[4]+ns[5]]
   for at in range(r[4],r[4]+r[5],16):
    loc,info=struct.unpack_from('<QQ',b,at);kind=info&0xffffffff;k=info>>32;z=struct.unpack_from('<I',b,sym[4]+24*k)[0];symbol=strings[z:].split(b'\0',1)[0].decode();rels.append({'offset':loc,'type':kind,'symbol':symbol})
    if kind==1:code[loc+4:loc+8]=bytes(4);code[loc+12:loc+16]=bytes(4)
    elif kind==10:code[loc+4:loc+8]=bytes(4)
  out.append({'name':name,'size':s[5],'code':bytes(code),'relocations':rels})
 return out
