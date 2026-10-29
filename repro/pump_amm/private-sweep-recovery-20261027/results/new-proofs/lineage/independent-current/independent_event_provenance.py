"""Bounded inlined serializer provenance; no global alias or whole-body claim."""
from pathlib import Path
import bisect,copy,hashlib,json,struct
from elf_reader import Elf
from cfg_pointer import pointer_states
EVENTS={'ClaimCashbackEvent':('user',8),'MigratePoolCoinCreatorEvent':('base_mint',16),'SetMetaplexCoinCreatorEvent':('base_mint',16),'SetBondingCurveCoinCreatorEvent':('base_mint',16)}
H=lambda b:hashlib.sha256(b).hexdigest()
def schemas(idl):
 rows=[]
 for name,(field,offset)in EVENTS.items():
  event=next(x for x in idl['events']if x['name']==name);fields=next(x['type']['fields']for x in idl['types']if x['name']==name);position=8
  for f in fields:
   if f['name']==field:break
   assert f['type']in('pubkey','u64','i64');position+=32 if f['type']=='pubkey'else 8
  assert f['type']=='pubkey'and position==offset
  rows.append({'event':name,'field':field,'serialized_offset':offset,'bytes':32,'discriminator':event['discriminator'],'serialized_fields':fields})
 return rows

def sites(e,schema,symbols=None):
 value=int.from_bytes(bytes(schema['discriminator']),'little');out=[]
 for pc in range(e.lo,e.hi-8,8):
  if e.b[pc]==0x18 and(struct.unpack_from('<I',e.b,pc+4)[0]|struct.unpack_from('<I',e.b,pc+12)[0]<<32)==value:
   if symbols is None:
    ix=bisect.bisect_right(e.entries,pc)-1;a=e.entries[ix];z=e.entries[ix+1]if ix+1<len(e.entries)else e.hi;f={'start':a,'size':z-a}
   else:
    owners=[f for f in symbols.funcs if f['start']<=pc<f['start']+f['size']];assert len(owners)==1;f=owners[0]
   out.append({'pc':pc,'offset':pc-f['start'],'owner':f})
 assert len(out)==2,(schema['event'],'expected two discriminator sites',out)
 assert out[0]['owner']['start']==out[1]['owner']['start']
 return out

def field(e,site,schema,states_fn=pointer_states):
 f=site['owner'];pc=site['pc'];state=states_fn(e,f['start'],f['size']).get(pc);assert state is not None
 pointers={i:('stack',x)for i,x in enumerate(state)if x is not None};known={};op,rr,off,imm=struct.unpack_from('<BBhi',e.b,pc);disc_reg=rr&15;known[disc_reg]=('discriminator',schema['discriminator'])
 store_pc=pc+16;op,rr,off,imm=struct.unpack_from('<BBhi',e.b,store_pc);dst,src=rr&15,rr>>4;assert op==0x7b and src==disc_reg and off==0
 pointers[dst]=('output',0);maps={};instructions=[];p=store_pc+8;offset=schema['serialized_offset']
 while p<pc+512 and len(maps)<4:
  op,rr,off,imm=struct.unpack_from('<BBhi',e.b,p);dst,src=rr&15,rr>>4;step=16 if op==0x18 else 8;instructions.append({'offset':p-f['start'],'bytes':e.b[p:p+step].hex()})
  if op==0x79:
   v=pointers.get(src);known[dst]=(v[0],v[1]+off,8)if v else('unknown_load',src,off);pointers.pop(dst,None)
  elif op==0xbf:
   if src in pointers:pointers[dst]=pointers[src]
   else:pointers.pop(dst,None)
   known[dst]=known.get(src,('unknown_register',src))
  elif op in(0x07,0x17):
   if dst in pointers:pointers[dst]=(pointers[dst][0],pointers[dst][1]+(imm if op==7 else-imm))
   else:known.pop(dst,None)
  elif op==0x7b:
   base=pointers.get(dst)
   if base and base[0]=='output'and base[1]+off in range(offset,offset+32,8):maps[base[1]+off]=known.get(src,('unknown_register',src))
  elif op==0x18:known[dst]=('constant',struct.unpack_from('<I',e.b,p+4)[0]|struct.unpack_from('<I',e.b,p+12)[0]<<32);pointers.pop(dst,None)
  elif op in(0x85,0x8d)or op&7 in(5,6):break
  elif op&7 in(1,4,7):known.pop(dst,None);pointers.pop(dst,None)
  p+=step
 assert len(maps)==4,(schema['event'],'inexact fields',pc,maps)
 ordered=[maps[k]for k in sorted(maps)];assert all(x[0]=='stack'and x[2]==8 for x in ordered),(schema['event'],'unknown field source',ordered)
 base=ordered[0][1];assert[x[1]for x in ordered]==list(range(base,base+32,8)),(schema['event'],'noncontiguous field',ordered)
 return {'site':pc,'handler':f,'field_stack_base':base,'field_values':[list(v) for v in ordered],'instructions':instructions}

def scan(original,candidate,symbols,idl):
 o,c,s=Elf(original),Elf(candidate),Elf(symbols);assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi];out=[]
 for schema in schemas(json.loads(Path(idl).read_bytes())):
  row=dict(schema)
  for label,e,sy in[('original',o,None),('candidate',c,s)]:
   row[label]=[field(e,site,schema)for site in sites(e,schema,sy)];row[label+'_same_source_stack']=row[label][0]['field_stack_base']==row[label][1]['field_stack_base']
  out.append(row)
 return {'original_sha256':H(o.b),'candidate_sha256':H(c.b),'symbols_sha256':H(s.b),'events':out,'scope':'Only first Pubkey source storage in two inlined serializers per event. Same stack offset is not a full-event alias, intervening-write, or whole-function equivalence proof.'}

def negative_controls(original,idl):
 e=Elf(original);schema=schemas(json.loads(Path(idl).read_bytes()))[0];site=sites(e,schema)[0];out=[]
 def fails(name,fn):
  try:fn()
  except AssertionError:out.append({'control':name,'rejected':True})
  else:raise AssertionError(('negative accepted',name))
 wrong=copy.deepcopy(schema);wrong['discriminator'][0]^=1;fails('unknown discriminator',lambda:sites(e,wrong))
 wrong=copy.deepcopy(schema);wrong['serialized_offset']=4096;fails('inexact output field offset',lambda:field(e,site,wrong))
 fails('unknown incoming pointer state',lambda:field(e,site,schema,lambda *args:{site['pc']:tuple([None]*11)}))
 broken=copy.copy(e);broken.b=bytearray(e.b);info=field(e,site,schema);ld=next(x for x in info['instructions']if bytes.fromhex(x['bytes'])[0]==0x79);p=site['owner']['start']+ld['offset'];struct.pack_into('<h',broken.b,p+2,struct.unpack_from('<h',broken.b,p+2)[0]+8)
 fails('one noncontiguous source word',lambda:field(broken,site,schema))
 return out
