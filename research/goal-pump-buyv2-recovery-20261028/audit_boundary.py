from pathlib import Path
import sys,struct,json,hashlib
H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import score,win
R=Path(__file__).resolve().parent;ow={w['start']:w for w in score.original_windows()};o=(H.parent/'base/original.so').read_bytes();os=score.sections(o)
def calls(b,s,a,n):
 raw=score.body(b,s,a,n);rs=[];i=0
 while i<n:
  op,reg,off,imm=struct.unpack_from('<BBhi',raw,i)
  if op==0x85 and reg>>4==1 and imm!=-1:rs.append((i,a+i+8+imm*8))
  i+=16 if op==0x18 else 8
 return rs
rows=[]
for name in ['port','separate-crate']:
 p=R/name/'unstripped.so';b=p.read_bytes();ss=score.sections(b);fs=score.candidate_functions(p);cf={a:(n,nm)for a,n,nm in fs};a,n,nm=next(f for f in fs if '6buy_v211buy_handler17h' in f[2]);cc=calls(b,ss,a,n);oc=calls(o,os,0x13b9b8,ow[0x13b9b8]['bytes']);equal=[]
 for k,(x,y)in enumerate(zip(oc,cc)):
  of=ow.get(x[1]);f=cf.get(y[1]);ok=of is not None and f is not None and score.normalize(score.body(b,ss,y[1],f[0]),y[1],ss)==of['norm'];equal.append(ok)
 candidates=[(ca,cn,cnm)for ca,cn,cnm in fs if cn==ow[0x3b598]['bytes']and score.normalize(score.body(b,ss,ca,cn),ca,ss)==ow[0x3b598]['norm']]
 cset={f[0]for f in candidates};sites=[]
 helper_calls=[]
 for ca,cn,cnm in candidates:
  hc=calls(b,ss,ca,cn);ho=calls(o,os,0x3b598,ow[0x3b598]['bytes'])
  for x,y in zip(ho,hc):
   of=ow.get(x[1]);f=cf.get(y[1]);ok=of is not None and f is not None and score.normalize(score.body(b,ss,y[1],f[0]),y[1],ss)==of['norm'];helper_calls.append({'offset':hex(x[0]),'same_offset':x[0]==y[0],'original_target':hex(x[1]),'candidate_target':hex(y[1]),'complete_normalized_body_equal':ok})

 for off,t in cc:
  if t in cset:
   dis=win.objdump_text(p,a+max(0,off-112),a+off+8);sites.append({'offset':hex(off),'target':hex(t),'prelude':[{hex(x-a):v}for x,v in dis.items()]})
 rows.append({'name':name,'normalized':sum(x['normalized']for x in score.score(p).values()),'handler_size':n,'original_calls':len(oc),'candidate_calls':len(cc),'equal_callees_by_ordinal':sum(equal),'ensure_body_matches':[{'address':hex(a),'bytes':n,'name':nm}for a,n,nm in candidates],'actual_ensure_call_sites':sites,'helper_actual_callees':helper_calls})
(R/'boundary-audit.json').write_text(json.dumps(rows,indent=2)+'\n');print(json.dumps(rows,indent=2))
