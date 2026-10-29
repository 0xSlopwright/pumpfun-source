from pathlib import Path
import sys,struct,json,hashlib
R=Path(__file__).resolve().parents[1];H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import score
old=H.parent/'base/original.so';new=R/'separate-crate/unstripped.so';ow={w['start']:w for w in score.original_windows()};rows=[]
def read(b,ss,a,n):
 s=next(s for s in ss.values()if s['addr']<=a and a+n<=s['addr']+s['size']);off=a-s['addr']+s['offset'];return b[off:off+n]
for role,p,base in [('original',old,0x13b9b8),('candidate',new,None)]:
 b=p.read_bytes();ss=score.sections(b);fs=score.candidate_functions(p)
 if base is None:base=next(a for a,n,nm in fs if '6buy_v211buy_handler17h' in nm)
 raw=read(b,ss,base+0x308,0x50);vals={};i=0
 while i<len(raw):
  op,reg,off,imm=struct.unpack_from('<BBhi',raw,i)
  if op==0x18:vals[reg&15]=struct.unpack_from('<I',raw,i+4)[0]|struct.unpack_from('<I',raw,i+12)[0]<<32;i+=16
  else:i+=8
 vt=vals[4];words=struct.unpack('<QQQQ',read(b,ss,vt,32));target=words[3]>>32
 if role=='original':f=ow[target];norm=f['norm'];size=f['bytes'];name=''
 else:
  f=next(f for f in fs if f[0]==target);size=f[1];name=f[2];norm=score.normalize(read(b,ss,target,size),target,ss)
 rows.append({'role':role,'vtable':hex(vt),'drop_raw':hex(words[0]),'size':words[1],'alignment':words[2],'fmt_entry':hex(target),'fmt_bytes':size,'fmt_symbol':name,'fmt_normalized_sha256':hashlib.sha256(norm).hexdigest()})
result={'entries':rows,'vtable_size_align_equal':[(r['size'],r['alignment'])for r in rows]==[(0,1),(0,1)],'fmt_body_equal':rows[0]['fmt_normalized_sha256']==rows[1]['fmt_normalized_sha256'],'limit':'Qualifies the actual unwrap_failed Debug payload ABI; does not prove the rest of the function semantically equivalent.'};(R/'structure/zero-payload-abi.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
