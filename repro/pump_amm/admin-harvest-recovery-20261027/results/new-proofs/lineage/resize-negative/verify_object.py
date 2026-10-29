#!/usr/bin/env python3
"""Calibrate resize lifetime diagnostics against retained instruction extracts."""
from pathlib import Path
import difflib,hashlib,json,struct
W=Path(__file__).resolve().parent
def verify():
 b=(W/'variants.o').read_bytes();pos=struct.unpack_from('<Q',b,40)[0];size,n,ni=struct.unpack_from('<HHH',b,58);ss=[struct.unpack_from('<IIQQQQIIQQ',b,pos+i*size)for i in range(n)];ns=ss[ni];names=b[ns[4]:ns[4]+ns[5]];original=(W/'original.normalized.bin').read_bytes();control=(W/'control.normalized.bin').read_bytes();out=[]
 for i,s in enumerate(ss):
  name=names[s[0]:].split(b'\0',1)[0].decode()
  if not name.startswith('.text.')or not any(v in name for v in ['8baseline17h','13direct_nested17h','15length_bindings17h']):continue
  data=bytearray(b[s[4]:s[4]+s[5]]);rel=[]
  for r in ss:
   if r[1]!=9 or r[7]!=i:continue
   for p in range(r[4],r[4]+r[5],16):
    a,info=struct.unpack_from('<QQ',b,p);kind=info&0xffffffff;rel.append({'offset':a,'type':kind})
    if kind==1:assert data[a]==0x18;data[a+4:a+8]=bytes(4);data[a+12:a+16]=bytes(4)
    elif kind==10:assert data[a]==0x85;data[a+4:a+8]=bytes(4)
    else:raise AssertionError(kind)
  matcher=difflib.SequenceMatcher(None,[original[j:j+8]for j in range(0,len(original),8)],[bytes(data[j:j+8])for j in range(0,len(data),8)],autojunk=False)
  out.append({'name':name,'bytes':len(data),'equals_full_3392_control':bytes(data)==control,'equals_original_3552':bytes(data)==original,'aligned_original_slots':sum(v.size for v in matcher.get_matching_blocks()),'object_relocations':rel})
 assert len(out)==3
 assert next(v for v in out if '8baseline17h'in v['name'])['equals_full_3392_control']
 assert all(not v['equals_original_3552']for v in out)
 assert all(v['bytes']==3384 for v in out if '8baseline17h'not in v['name'])
 p=json.loads((W/'provenance.json').read_bytes());assert hashlib.sha256(b).hexdigest()==p['object_sha256'];assert hashlib.sha256((W/'variants.rs').read_bytes()).hexdigest()==p['source_sha256'];assert len(p['nine_original_callers'])==9
 return {'passed':True,'scope':'Negative direct-object controls only; no recovered source patch or runtime claim.','variants':out}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
