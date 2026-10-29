"""Actual callee, projected CFG, and constrained literal comparison for payout bodies."""
from pathlib import Path
import argparse,collections,difflib,hashlib,json,struct,types
HERE=Path(__file__).resolve().parent
p=HERE/'elf_reader.py';em=types.ModuleType('e');em.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),em.__dict__)
TARGETS={0x106f20:'rent_get',0x108f48:'data_len',0x106fe8:'rent_minimum_balance',0x108ed0:'lamports',0xf6190:'close_account',0xf42f0:'create_ata',0xf4a30:'token_transfer_checked',0x104f28:'system_transfer'}

def cfg(elf,start,size,labels):
 end=start+size;instructions={};leaders={start};at=start
 while at<end:
  op,regs,off,imm=struct.unpack_from('<BBhi',elf.b,at);step=16 if op==0x18 else 8;ins={'offset':at-start,'opcode':op,'registers':regs,'off':off,'immediate':imm};instructions[at]=ins
  if op&7 in (5,6)and op not in(0x85,0x95):
   target=at+8+off*8;assert start<=target<end;leaders.add(target)
   if at+8<end:leaders.add(at+8)
  elif op==0x95 and at+8<end:leaders.add(at+8)
  at+=step
 blocks=[];starts=sorted(leaders);index={x:i for i,x in enumerate(starts)}
 for i,a in enumerate(starts):
  stop=starts[i+1]if i+1<len(starts)else end;seq=[q for q in instructions if a<=q<stop];assert seq;last=seq[-1];op=instructions[last]['opcode'];edges=[]
  if op&7 in(5,6)and op not in(0x85,0x95):
   edges.append(index[last+8+instructions[last]['off']*8])
   if op not in(0x05,0x06)and stop<end:edges.append(index[stop])
  elif op!=0x95 and stop<end:edges.append(index[stop])
  events=[labels[elf.calls[q]]for q in seq if q in elf.calls and elf.calls[q]in labels]
  blocks.append({'index':i,'offset':a-start,'size':stop-a,'edges':edges,'events':events,'instructions':len(seq)})
 seen=set();todo=[(0,())];traces=set()
 while todo:
  node,trace=todo.pop();b=blocks[node];trace=trace+tuple(b['events']);assert len(trace)<=40
  key=node,trace
  if key in seen:continue
  seen.add(key);assert len(seen)<=20000
  if not b['edges']:traces.add(trace)
  else:todo.extend((j,trace)for j in b['edges'])
 return {'block_count':len(blocks),'edge_count':sum(len(b['edges'])for b in blocks),'projected_terminal_traces':[list(x)for x in sorted(traces)],'blocks':blocks}

def literals(elf,start,size):
 out=[]
 for at in range(start,start+size,8):
  if elf.b[at]!=0x18:continue
  ptr=struct.unpack_from('<I',elf.b,at+4)[0]|struct.unpack_from('<I',elf.b,at+12)[0]<<32
  if not 0<=ptr<len(elf.b):continue
  data=elf.b[ptr:]
  if data.startswith(b'creator_vault'):out.append({'offset':at-start,'address':hex(ptr),'kind':'seed','value_hex':data[:13].hex(),'length':13})
  elif data.startswith(b'programs/pump-amm/src/'):
   value=data.split(b'\0',1)[0];out.append({'offset':at-start,'address':hex(ptr),'kind':'source_path_prefix','value':value[:len(value.split(b'.rs',1)[0])+3].decode()})
 return out

def compare(candidate,symbols,original):
 O=em.Elf(Path(original));C=em.Elf(Path(candidate));S=em.Elf(Path(symbols));assert hashlib.sha256(O.b).hexdigest()=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7';assert C.b[C.lo:C.hi]==S.b[S.lo:S.hi];sizes={a:b-a for a,b in zip(O.entries,O.entries[1:])};cf={f['start']:f for f in S.funcs}
 mapping={};callees=[]
 for address,label in TARGETS.items():
  n=sizes[address];matches=[f for f in S.funcs if f['size']==n and O.normalized[address:address+n]==C.normalized[f['start']:f['start']+n]and O.pattern(address,n)==C.pattern(f['start'],n)]
  if label=='create_ata':
   # The create/idempotent928-byte wrappers normalize equally. Resolve their actual40-byte builders.
   original_builder=O.callsites(address,n)[0]['target'];assert sizes[original_builder]==40
   matches=[f for f in matches if O.normalized[original_builder:original_builder+40]==C.normalized[C.callsites(f['start'],n)[0]['target']:C.callsites(f['start'],n)[0]['target']+40]]
  assert matches,(label,n);mapping.update({f['start']:label for f in matches});callees.append({'label':label,'original_address':hex(address),'size':n,'candidates':matches})
 rows=[]
 for label,a,n,token in [('legacy',0x26da8,8232,'pump_amm_recovered29transfer_creator_fees_to_pump17'),('v2',0x28dd0,11024,'pump_amm_recovered32transfer_creator_fees_to_pump_v217')]:
  f=next(f for f in S.funcs if token in f['name']);b=f['start'];x=[O.normalized[z:z+8]for z in range(a,a+n,8)];y=[C.normalized[z:z+8]for z in range(b,b+f['size'],8)];g,h=cfg(O,a,n,TARGETS),cfg(C,b,f['size'],mapping)
  rows.append({'label':label,'original_start':hex(a),'original_size':n,'candidate':f,'normalized_equal':x==y,'relocation_equal':O.pattern(a,n)==C.pattern(b,f['size']),'sequence_matching_slots':sum(v.size for v in difflib.SequenceMatcher(None,x,y,autojunk=False).get_matching_blocks()),'original_cfg':g,'candidate_cfg':h,'projected_semantic_call_trace_equal':g['projected_terminal_traces']==h['projected_terminal_traces'],'original_literals':literals(O,a,n),'candidate_literals':literals(C,b,f['size'])})
 return {'candidate_sha256':hashlib.sha256(C.b).hexdigest(),'original_sha256':hashlib.sha256(O.b).hexdigest(),'callees':callees,'handlers':rows,'scope':'No broadened byte masks. CFG traces retain Rent, size/lamport reads and token/system CPI calls; equal projected traces do not prove branch predicates, complete data closure or whole-body identity. Known seed lengths only; no arbitrary pointer-span equality.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);p.add_argument('--original',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();r=compare(a.candidate,a.symbols,a.original);a.output.write_text(json.dumps(r,indent=2)+'\n');print(json.dumps({'candidate_sha256':r['candidate_sha256'],'handlers':[{'label':x['label'],'original_size':x['original_size'],'candidate_size':x['candidate']['size'],'normalized_equal':x['normalized_equal'],'original_blocks':x['original_cfg']['block_count'],'candidate_blocks':x['candidate_cfg']['block_count'],'projected_trace_equal':x['projected_semantic_call_trace_equal']}for x in r['handlers']]},indent=2))
