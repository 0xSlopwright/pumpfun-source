from pathlib import Path
import sys,re,struct,json,hashlib
H=Path("/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness");sys.path.insert(0,str(H));import win,score
R=Path(__file__).resolve().parent;base=score.score(R.parent/"goal-pump-recovery-20261028/current-parent/unstripped.so");onames={a:win.demangle(x['symbols'][0])if x['symbols']else hex(a)for a,x in base.items()}
paths={'original':H.parent/'base/original.so'}
for name in ['cpi-inline-account-copy','format-explicit-needed','format-explicit-original-set','format-original-set-cold-outline','entry-cached-state','validation-closure-boundary']:
 p=R/(name+'-out')/'unstripped.so'
 if p.exists():paths[name]=p
results={}
for label,path in paths.items():
 c=win.Cand(path);fmap={a:win.demangle(nm)for a,n,nm in c.funcs}
 if label=='original':a,n=0x22a10,27400;fmap=onames
 else:a,n,nm=next(f for f in c.funcs if'admin_cto::execute'in win.demangle(f[2]))
 regs={};rows=[];ds=win.objdump_text(path,a,a+n)
 for at,t in ds.items():
  m=re.match(r'lddw r(\d), (0x[0-9a-f]+)$',t)
  if m:regs[int(m[1])]=int(m[2],16);continue
  m=re.match(r'mov64 r(\d), r(\d)$',t)
  if m:regs[int(m[1])]=regs.get(int(m[2]));continue
  if t.startswith('call '):
   _,_,_,imm=struct.unpack_from('<BBhi',c.blob,at);target=at+8+imm*8;callee=fmap.get(target,'external')
   if'core::result::unwrap_failed'in callee:
    ptr=regs.get(5);row={'caller_offset':hex(at-a),'actual_target':hex(target),'Location_pointer':hex(ptr)if ptr is not None else None}
    if ptr is not None and 0<=ptr and ptr+24<=len(c.blob):
     raw=c.blob[ptr:ptr+24];fp,size,line,col=struct.unpack('<QQII',raw);fp=fp if 0<=fp<len(c.blob)else fp>>32
     if 0<=fp<len(c.blob)and size<4096:row.update({'file':c.blob[fp:fp+size].decode(errors='replace'),'line':line,'column':col,'raw_record':raw.hex()})
    rows.append(row)
   for k in range(6):regs[k]=None
   continue
  m=re.match(r'(?:ldx\w*|mov\w*|add\w*|sub\w*|and\w*|or\w*|xor\w*|lsh\w*|rsh\w*) r(\d),',t)
  if m:regs[int(m[1])]=None
 results[label]={'unstripped_sha256':hashlib.sha256(c.blob).hexdigest(),'actual_parent_unwrap_failed_calls':rows}
(R/'panic-Location-audit.json').write_text(json.dumps({'scope':'Actual caller-provided Location arguments, not caller-normalization credit. No runtime panic observed.','images':results},indent=2)+'\n');print(json.dumps(results,indent=2))
