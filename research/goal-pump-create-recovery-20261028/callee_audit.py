from pathlib import Path
import sys,struct,json,hashlib
H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import score
R=Path(__file__).resolve().parent
ob=(H.parent/'base/original.so').read_bytes();os=score.sections(ob);ow={x['start']:x for x in score.original_windows()}
def calls(b,s,a,n):
 raw=score.body(b,s,a,n);rows=[];i=0
 while i<n:
  op,reg,off,imm=struct.unpack_from('<BBhi',raw,i)
  if op==0x85 and reg>>4==1 and imm!=-1:rows.append((i,a+i+8+imm*8))
  i+=16 if op==0x18 else 8
 return rows
out=[]
for name in ['x27_current_roles','x27_option16','x27_option16_ref','x27_option16_fn']:
 p=R/'trials'/name/'unstripped.so'
 if not p.exists():continue
 cb=p.read_bytes();cs=score.sections(cb);fs={a:(n,nm)for a,n,nm in score.candidate_functions(p)};a,n,_=next((a,n,nm)for a,(n,nm)in fs.items()if '9create_v27execute' in nm);oc=calls(ob,os,0x1e7c0,ow[0x1e7c0]['bytes']);cc=calls(cb,cs,a,n);rows=[]
 for k,(o,c)in enumerate(zip(oc,cc)):
  of=ow.get(o[1]);cf=fs.get(c[1]);equal=False
  if of and cf:
   cn=score.normalize(score.body(cb,cs,c[1],cf[0]),c[1],cs);equal=cn==of['norm']
  rows.append({'ordinal':k,'original_offset':hex(o[0]),'candidate_offset':hex(c[0]),'original_target':hex(o[1]),'candidate_target':hex(c[1]),'candidate_name':cf[1]if cf else None,'original_size':of['bytes']if of else None,'candidate_size':cf[0]if cf else None,'complete_normalized_callee_equal':equal})
 out.append({'name':name,'original_calls':len(oc),'candidate_calls':len(cc),'equal':sum(r['complete_normalized_callee_equal']for r in rows),'differences':[r for r in rows if not r['complete_normalized_callee_equal']]})
(R/'callee-audit.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
