from pathlib import Path
import struct
def sections(path):
 b=path.read_bytes();off=struct.unpack_from('<Q',b,40)[0];size,count,ni=struct.unpack_from('<HHH',b,58);ss=[struct.unpack_from('<IIQQQQIIQQ',b,off+i*size) for i in range(count)];ns=ss[ni];names=b[ns[4]:ns[4]+ns[5]];out=[]
 for i,s in enumerate(ss):
  name=names[s[0]:].split(b'\0',1)[0].decode()
  if not name.startswith('.text.'):continue
  code=bytearray(b[s[4]:s[4]+s[5]]);rels=[]
  for r in ss:
   if r[1]!=9 or r[7]!=i:continue
   sym=ss[r[6]];st=ss[sym[6]];strings=b[st[4]:st[4]+st[5]]
   for at in range(r[4],r[4]+r[5],16):
    loc,info=struct.unpack_from('<QQ',b,at);kind=info&0xffffffff;k=info>>32;n,_,_,shndx,value,length=struct.unpack_from('<IBBHQQ',b,sym[4]+24*k);symbol=strings[n:].split(b'\0',1)[0].decode();rel={'offset':loc,'type':kind,'symbol':symbol}
    if kind==1:
     addend=struct.unpack_from('<I',code,loc+4)[0]|struct.unpack_from('<I',code,loc+12)[0]<<32
     if shndx<len(ss) and shndx:
      target=ss[shndx][4]+value+addend;rel['resolved_first32']=b[target:target+32].hex()
     code[loc+4:loc+8]=bytes(4);code[loc+12:loc+16]=bytes(4)
    elif kind==10:code[loc+4:loc+8]=bytes(4)
    rels.append(rel)
  out.append({'name':name,'size':s[5],'code':bytes(code),'relocations':rels})
 return out
