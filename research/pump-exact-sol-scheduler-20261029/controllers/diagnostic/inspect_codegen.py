"""Compare symbol-backed target code in ELF files without executing it."""
from pathlib import Path
import hashlib,importlib.util,json,struct,sys
D=Path(__file__).resolve().parent;W=D.parent
P=W/'pumpfun-source/research/pump-exact-sol-guard-20261029'
s=importlib.util.spec_from_file_location('upstream_audit',P/'audit_target.py');audit=importlib.util.module_from_spec(s);s.loader.exec_module(audit)
SYMBOL='_ZN14pump_recovered14pump_recovered16buy_exact_sol_in17h28eae2e2fdc8f8b2E'
def sha(b):return hashlib.sha256(b).hexdigest()
def target(path):
 e=audit.Elf(path);fs=[f for f in e.symbols if f['name']==SYMBOL and f['size'] and f['kind']==2];assert len(fs)==1,fs
 f=fs[0];sec=e.headers[f['section']];start=sec[4]+f['address']-sec[3];raw=e.data[start:start+f['size']];assert len(raw)==f['size'];relocs=[]
 for h in e.headers:
  if h[1] not in [4,9] or h[7]!=f['section']:continue
  sh=e.headers[h[6]];assert sh[1]==2
  strings=e.headers[sh[6]]
  for offset in range(h[4],h[4]+h[5],h[9]):
   addr,info=struct.unpack_from('<QQ',e.data,offset)
   if not f['address']<=addr<f['address']+f['size']:continue
   sym=struct.unpack_from('<IBBHQQ',e.data,sh[4]+24*(info>>32));p=strings[4]+sym[0];name=e.data[p:e.data.index(b'\0',p)].decode()
   relocs.append({'offset':addr-f['address'],'type':info&0xffffffff,'symbol':name,'addend':struct.unpack_from('<q',e.data,offset+16)[0] if h[1]==4 else None})
 return {'image_sha256':sha(e.data),'target_bytes':len(raw),'target_raw_sha256':sha(raw),'section':next(n for n,v in e.sections.items() if v['index']==f['section']),'symbol':f,'relocations':relocs},raw
def main():
 left,l=target(Path(sys.argv[1]));right,r=target(Path(sys.argv[2]));report={'left':left,'right':right,'target_raw_equal':l==r,'different_bytes':sum(i>=len(l) or i>=len(r) or l[i]!=r[i] for i in range(max(len(l),len(r)))),'relocations_equal':left['relocations']==right['relocations']}
 Path(sys.argv[3]).write_bytes((json.dumps(report,indent=2)+'\n').encode());print(json.dumps({k:v for k,v in report.items() if k not in ['left','right']},indent=2));print('bytes',len(l),len(r),'relocations',len(left['relocations']),len(right['relocations']))
if __name__=='__main__':main()
