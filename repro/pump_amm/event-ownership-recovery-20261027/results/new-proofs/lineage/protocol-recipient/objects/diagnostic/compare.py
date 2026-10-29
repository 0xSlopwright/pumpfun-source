from pathlib import Path
import difflib,hashlib,importlib.util,json,struct
W=Path(__file__).resolve().parent;R=W.parents[2];s=importlib.util.spec_from_file_location('elf',R/'repro/pump_amm/claim-self-transfer-v144/static-tool/elf_reader.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);O=m.Elf(R/'evidence/original/pump_amm/deployed.so');p=W/'variants.o';b=p.read_bytes();off=struct.unpack_from('<Q',b,40)[0];size,count,ni=struct.unpack_from('<HHH',b,58);ss=[struct.unpack_from('<IIQQQQIIQQ',b,off+i*size)for i in range(count)];ns=ss[ni];names=b[ns[4]:ns[4]+ns[5]];out=[]
for idx,section in enumerate(ss):
 name=names[section[0]:].split(b'\0',1)[0].decode()
 if not name.startswith('.text.'):continue
 match=next(((key,a,n)for key,a,n in [('validate_',0x58e08,1536)]if key in name),None)
 if match is None:continue
 _,a,n=match;data=bytearray(b[section[4]:section[4]+section[5]])
 for rel in ss:
  if rel[1]!=9 or rel[7]!=idx:continue
  for pos in range(rel[4],rel[4]+rel[5],16):
   at,info=struct.unpack_from('<QQ',b,pos);kind=info&0xffffffff
   if kind==1:data[at+4:at+8]=bytes(4);data[at+12:at+16]=bytes(4)
   elif kind==10:data[at+4:at+8]=bytes(4)
 original=O.normalized[a:a+n];x=[original[i:i+8].hex()for i in range(0,n,8)];y=[data[i:i+8].hex()for i in range(0,len(data),8)];out.append({'name':name,'original_start':hex(a),'size':len(data),'original_size':n,'normalized_equal':bytes(data)==original,'aligned_differences':[i for i in range(0,min(n,len(data)),8)if data[i:i+8]!=original[i:i+8]],'sequence_diff':[{'tag':t,'original':[i,j],'candidate':[k,l],'original_bytes':x[i:j],'candidate_bytes':y[k:l]}for t,i,j,k,l in difflib.SequenceMatcher(None,x,y,autojunk=False).get_opcodes()if t!='equal']})
(W/'comparison.json').write_text(json.dumps({'object_sha256':hashlib.sha256(b).hexdigest(),'functions':out},indent=2)+'\n');print(json.dumps([{k:v for k,v in x.items()if k!='sequence_diff'}for x in out],indent=2))
