from pathlib import Path
import sys,struct,re,json,hashlib,collections,functools
H=Path("/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness");sys.path.insert(0,str(H));import win,score
R=Path(__file__).resolve().parent;ss=score.score(R.parent/"goal-pump-recovery-20261028/current-parent/unstripped.so");on={a:win.demangle(v['symbols'][0])if v['symbols']else hex(a)for a,v in ss.items()};out={}
for label,path,start in [('original',H.parent/'base/original.so',0x22a10),('frozen-copy',R/'cpi-inline-account-copy-out/unstripped.so',None),('validation-closure',R/'validation-closure-boundary-out/unstripped.so',None)]+[(label,R/(label+'-out/unstripped.so'),None)for label in ['validation-owned-new','validation-wallet-check','validation-borrowed-new']]:
 c=win.Cand(path);fn={a:win.demangle(nm)for a,n,nm in c.funcs}
 if start is not None:a,n=start,27400;fn=on
 else:a,n,nm=next(f for f in c.funcs if'admin_cto::execute'in win.demangle(f[2]))
 b=c.fn(a,n);ins=[];i=0
 while i<len(b):
  op,rs,off,imm=struct.unpack_from('<BBhi',b,i);v=imm
  if op==0x18:v=struct.unpack_from('<I',b,i+4)[0]|struct.unpack_from('<I',b,i+12)[0]<<32
  ins.append((i,op,rs&15,rs>>4,off,v));i+=16 if op==0x18 else 8
 @functools.lru_cache(None)
 def reg_before(k,reg):
  if reg==10:return('stack',0)
  for j in range(k-1,max(-1,k-150),-1):
   _,op,d,s,off,v=ins[j]
   if op==0x85 and reg<6:return None
   if op in [0x7b,0x63,0x73,0x6b,0x7a,0x62,0x72,0x6a]or op&7 in [5,6]:continue
   if d!=reg:continue
   if op==0xbf:return reg_before(j,s)
   if op in [0x18,0xb7]:return('const',v)
   if op in [0x07,0x17]:
    x=reg_before(j,d)
    return(x[0],x[1]+(v if op==0x07 else-v))if x else None
   return None
  return None
 def slot_before(k,offset):
  for j in range(k-1,max(-1,k-150),-1):
   _,op,d,s,off,v=ins[j]
   if d!=10 or off!=offset:continue
   if op in [0x7a,0x62]:return('const',v&0xffffffff if op==0x62 else v)
   if op in [0x7b,0x63]:return reg_before(j,s)
  return None
 rows=[]
 for k,(pos,op,d,s,off,v)in enumerate(ins):
  if op!=0x85:continue
  target=a+pos+8+v*8;name=fn.get(target,'')
  if not('From' in name and'AnchorError' in name):continue
  arg=reg_before(k,2);row={'call_offset':hex(pos),'actual_callee':hex(target),'AnchorError_argument':arg}
  if arg and arg[0]=='stack':
   z=arg[1];vals={name:slot_before(k,z+off)for name,off in [('origin',0),('file',8),('file_len',16),('line',24),('error_code_number',152)]};row['observed_fields']=vals
   if all(vals.get(x)and vals[x][0]=='const'for x in ['file','file_len','line','error_code_number']):
    fp=vals['file'][1];length=vals['file_len'][1];blob=None
    for sec in c.secs.values():
     if sec['addr']<=fp<sec['addr']+sec['size']:o=fp-sec['addr']+sec['offset'];blob=c.blob[o:o+length];break
    row.update({'file':blob.decode(errors='replace')if blob else None,'line':vals['line'][1],'code':vals['error_code_number'][1]})
  rows.append(row)
 out[label]={'unstripped_sha256':hashlib.sha256(c.blob).hexdigest(),'sites':rows}
keys=lambda label:collections.Counter((x.get('file'),x.get('line'),x.get('code'))for x in out[label]['sites'])
result={'scope':'Backward call-argument/stack-field audit for actual From<AnchorError> callees. AnchorError field offsets0/8/16/24/152 are bound to the captured current LLVM construction and the same original/candidate callee ABI. This is bounded static argument evidence, not arbitrary pointee/type/runtime proof.','images':out,'complete_sites':all(all(x.get('file')and x.get('line')and x.get('code')for x in v['sites'])for v in out.values()),'original_vs_frozen_equal':keys('original')==keys('frozen-copy'),'original_vs_closure_equal':keys('original')==keys('validation-closure'),'original_source_argument_multiset_equal':{label:keys('original')==keys(label)for label in out if label!='original'}};(R/'SOURCE-ARGUMENTS-AUDIT.json').write_text(json.dumps(result,indent=2)+'\n');print({k:v for k,v in result.items()if k!='images'});print({k:[(x.get('line'),x.get('code'))for x in v['sites']]for k,v in out.items()})
