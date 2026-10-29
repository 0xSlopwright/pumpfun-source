from pathlib import Path
import collections,copy,hashlib,json,struct
from elf_reader import Elf
def control(e,a,n):
 pcs=[];p=a
 while p<a+n:pcs.append(p);p+=16 if e.b[p]==0x18 else 8
 valid=set(pcs);edges={}
 for p in pcs:
  op,rs,off,im=struct.unpack_from('<BBhi',e.b,p);size=16 if op==0x18 else 8
  if op==0x95:ns=[]
  elif op in(0x05,0x06):ns=[p+8+off*8]
  elif op&7 in(5,6)and op not in(0x85,0x8d):ns=[p+size,p+8+off*8]
  else:ns=[p+size]
  edges[p]=[x for x in ns if x in valid]
 return edges

def reaches(edges,a,z,without=None):
 seen=set();todo=[a]
 while todo:
  p=todo.pop()
  if p==without or p in seen:continue
  if p==z:return True
  seen.add(p);todo.extend(edges.get(p,()))
 return False

def plus(v,x):
 if v is None:return None
 if isinstance(v,int):return v+x
 if v[0]in('stack','accounts','context','result'):return(v[0],v[1]+x)
 return('add',v,x)
def eval_path(e,start,targets,pda,memcmp,withpubkeys,branch_choices):
 r={1:('result',0),2:('context',0),10:('stack',0)};mem={};calls=[];visited=[];p=start
 def read(ptr,off=0,width=8):
  ptr=plus(ptr,off)
  if ptr in mem:return mem[ptr]
  if ptr==('context',8):return('accounts',0)
  if isinstance(ptr,int):return('bytes',e.b[ptr:ptr+width].hex())
  return('read',ptr,width)
 def write(ptr,off,val):mem[plus(ptr,off)]=val
 while p<=max(targets):
  assert len(visited)<1000;p0=p;visited.append(p);op,rs,off,imm=struct.unpack_from('<BBhi',e.b,p);d,s=rs&15,rs>>4;step=16 if op==0x18 else 8
  if op==0x18:r[d]=struct.unpack_from('<I',e.b,p+4)[0]|struct.unpack_from('<I',e.b,p+12)[0]<<32
  elif op==0xbf:r[d]=r.get(s)
  elif op in(0x07,0x17):r[d]=plus(r.get(d),imm if op==7 else-imm)
  elif op in(0x79,0x71,0x69,0x61):r[d]=read(r.get(s),off,{0x79:8,0x71:1,0x69:2,0x61:4}[op])
  elif op in(0x7b,0x73,0x6b,0x63):write(r.get(d),off,r.get(s))
  elif op in(0x7a,0x72,0x6a,0x62):write(r.get(d),off,imm)
  elif op==0xb7:r[d]=imm
  elif op==0x85:
   target=e.calls.get(p)
   if target==pda:
    output=r[1];array=r[2];count=r[3];program=r[4];seeds=[]
    for i in range(count):
     ptr,size=read(array,16*i),read(array,16*i+8)
     if isinstance(ptr,int):value=('literal',e.b[ptr:ptr+size].hex())
     else:value=('words',[read(ptr,j)for j in range(0,size,8)])
     seeds.append({'length':size,'value':value})
    args={'kind':'pda','pc':p,'target':target,'output':output,'seed_array':array,'seed_source_pointers':[read(array,16*i) for i in range(count)],'seeds':seeds,'program_hex':e.b[program:program+32].hex()};calls.append(args)
    for j in range(0,32,8):write(output,j,('pda_word',len(calls)-1,j))
   elif target==memcmp:calls.append({'kind':'memcmp','pc':p,'target':target,'lhs':[read(r[1],j)for j in range(0,r[3],8)],'rhs':[read(r[2],j)for j in range(0,r[3],8)]})
   elif target==withpubkeys:calls.append({'kind':'with_pubkeys','pc':p,'target':target,'pubkeys':[read(r[4],j)for j in range(0,64,8)]})
   for j in range(6):r.pop(j,None)
  elif op in(0x05,0x06):p=p+8+off*8;continue
  elif op&7 in(5,6)and op not in(0x85,0x8d):
   assert p in branch_choices,(hex(p),branch_choices);p=branch_choices[p];continue
  elif op&7 in(4,7):r.pop(d,None)
  elif op==0x95:break
  p+=step
 return calls,visited

def analyze(original,baseline,symbols):
 O,C,S=Elf(original),Elf(baseline),Elf(symbols)
 OP=0x24fd8;CP=next(f['start']for f in S.funcs if f['name'].startswith('_ZN18pump_amm_recovered18pump_amm_recovered16set_coin_creator17h'));N=7632
 PDA=0x10e068;CMP=0x1198e0;WITH=0x1031d0
 F=next(f for f in S.funcs if 'Pubkey20find_program_address17h'in f['name']);M=next(f for f in S.funcs if f['name']=='memcmp');T=next(f for f in S.funcs if 'Error12with_pubkeys17h'in f['name'])
 old_calls,old_path=eval_path(O,OP,[OP+1312],PDA,CMP,WITH,{OP+352:OP+520,OP+704:OP+792})
 new_calls,new_path=eval_path(C,CP,[CP+1112],F['start'],M['start'],T['start'],{CP+288:CP+464,CP+648:CP+736})
 
 assert len([x for x in old_calls if x['kind']=='pda'])==2 and len([x for x in new_calls if x['kind']=='pda'])==1
 pdas=[x for x in old_calls if x['kind']=='pda'];assert pdas[0]['seeds']==pdas[1]['seeds']and pdas[0]['program_hex']==pdas[1]['program_hex']
 assert pdas[0]['seed_source_pointers'][1]==pdas[1]['seed_source_pointers'][1]==('stack',-520)
 assert pdas[0]['seeds'][0]['value']==('literal',b'pool-authority'.hex())and pdas[0]['seeds'][0]['length']==14 and pdas[0]['seeds'][1]['length']==32
 pda_words=[x for x in old_calls[-1]['pubkeys']if x and x[0]=='pda_word'];assert len(pda_words)==4 and all(x[1]==2 for x in pda_words),pda_words
 # Serialized PDA-word identifiers use call-list ordinal; first PDA=0, memcmp=1, second PDA=2.
 
 edges=control(O,OP,N);branch=OP+352;failure=OP+520;success=branch+8;second=OP+1192;with_call=OP+1312
 assert reaches(edges,failure,second)
 assert not reaches(edges,success,second)
 assert not reaches(edges,OP,second,without=failure)
 assert reaches(edges,second,with_call) and not reaches(edges,failure,with_call,without=second)
 for target,match in[(PDA,F),(CMP,M),(WITH,T)]:
  i=O.entries.index(target);n=(O.entries[i+1]if i+1<len(O.entries)else O.hi)-target;assert n==match['size'];assert O.normalized[target:target+n]==C.normalized[match['start']:match['start']+n]and O.pattern(target,n)==C.pattern(match['start'],n)
 from solders.pubkey import Pubkey
 assert pdas[0]['program_hex']==bytes(Pubkey.from_string('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P')).hex()
 expected_words=[('read',('accounts',i),8)for i in range(512,544,8)];assert pdas[0]['seeds'][1]['value']==('words',expected_words)
 assert old_calls[-1]['pubkeys'][:4]==[('read',('accounts',i),8)for i in range(480,512,8)]
 assert new_calls[0]['seeds']==pdas[0]['seeds'] and new_calls[0]['program_hex']==pdas[0]['program_hex']
 assert [v[1]for v in new_calls[-1]['pubkeys'][4:]]==[0,0,0,0]
 report={'original_sha256':hashlib.sha256(O.b).hexdigest(),'baseline_sha256':hashlib.sha256(C.b).hexdigest(),'original_function':{'start':OP,'size':N},'baseline_function':{'start':CP,'size':7584},'old_calls':old_calls,'baseline_calls':new_calls,'original_path':old_path,'baseline_path':new_path,'control':{'comparison_branch':branch,'failure_successor':failure,'success_successor':success,'second_pda':second,'with_pubkeys':with_call,'success_cannot_reach_second_pda':True,'failure_successor_dominates_second_pda':True,'second_pda_dominates_with_pubkeys_on_failure':True},'callees_exact_normalized_and_relocations':3,'scope':'Bounded call/CFG and explicit path symbolic provenance. Syscall outcome is not simulated; only helper result flow is labelled.'}
 
 
 def rejected(fn):
  try:fn()
  except AssertionError:return True
  return False
 
 def check_seed(e,mutated_instruction,imm):
  x=copy.copy(e);x.b=bytearray(e.b);struct.pack_into('<i',x.b,mutated_instruction+4,imm)
  xs,_=eval_path(x,OP,[OP+1312],PDA,CMP,WITH,{OP+352:OP+520,OP+704:OP+792});p=[v for v in xs if v['kind']=='pda'];assert p[0]['seeds']==p[1]['seeds']and p[0]['seeds']==pdas[0]['seeds']
 controls={'wrong_seed_length_rejected':rejected(lambda:check_seed(O,0x25068,13)),'shifted_second_seed_source_rejected':rejected(lambda:check_seed(O,0x25410,-512)),'success_path_does_not_reach_second_call':not reaches(edges,success,second),'cached_first_result_rejected_as_second':new_calls[-1]['pubkeys'][4:]!=old_calls[-1]['pubkeys'][4:]}
 assert all(controls.values())
 return json.loads(json.dumps({'evidence':report,'negative_controls':controls}))

def selected(candidate,symbols):
 e,s=Elf(candidate),Elf(symbols);f=next(f for f in s.funcs if f['name'].startswith('_ZN18pump_amm_recovered18pump_amm_recovered16set_coin_creator17h'));a=f['start']
 assert f['size']==7688
 pda=next(f['start']for f in s.funcs if 'Pubkey20find_program_address17h'in f['name']);cmp=next(f['start']for f in s.funcs if f['name']=='memcmp');withp=next(f['start']for f in s.funcs if 'Error12with_pubkeys17h'in f['name'])
 calls=e.callsites(a,f['size']);assert len(calls)==25;assert[x['offset']for x in calls if x['target']==pda]==[160,1064]
 trace,path=eval_path(e,a,[a+1184],pda,cmp,withp,{a+232:a+408,a+592:a+680});p=[x for x in trace if x['kind']=='pda'];assert len(p)==2 and p[0]['seeds']==p[1]['seeds']and p[0]['program_hex']==p[1]['program_hex'];assert trace[-1]['kind']=='with_pubkeys'and trace[-1]['pubkeys'][4:]==[('pda_word',2,j)for j in range(0,32,8)]
 edges=control(e,a,f['size']);assert not reaches(edges,a+240,a+1064);assert not reaches(edges,a+408,a+1184,without=a+1064)
 return json.loads(json.dumps({'candidate_sha256':hashlib.sha256(e.b).hexdigest(),'function':f,'calls':calls,'trace':trace,'path':path,'call_count':25,'pda_call_offsets':[160,1064],'error_pubkey_from_second_derivation':True,'success_cannot_reach_second_derivation':True,'full_body_equal':False}))
