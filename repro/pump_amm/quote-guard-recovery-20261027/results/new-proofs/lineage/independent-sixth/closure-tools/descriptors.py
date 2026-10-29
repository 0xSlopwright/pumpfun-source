#!/usr/bin/env python3
"""Inventory relocated code references and recognizable static descriptors."""
from pathlib import Path
import argparse,collections,hashlib,json,struct,sys
ROOT=globals().get('ROOT') or next(p for p in Path(__file__).resolve().parents if(p/'evidence/original/pump_amm/deployed.so').is_file());sys.path.insert(0,str(ROOT/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf

def analyze(candidate,symbols,closure):
 o=Elf(ROOT/'evidence/original/pump_amm/deployed.so');c=Elf(candidate);s=Elf(symbols);assert hashlib.sha256(c.b).hexdigest()==closure['candidate_sha256'];pairs={(p['original'],p['candidate'])for p in closure['pairs']};names=collections.defaultdict(list)
 for f in s.funcs:names[f['start']].append(f['name'])
 def d(e,p,n=0):return any(z[4]<=p and p+n<=z[4]+z[5]for name,z in e.secs.items()if name in ['.rodata','.data.rel.ro'])
 def code(e,p):return e.lo<=p<e.hi
 def ptr(e,at):return struct.unpack_from('<I',e.b,at+4)[0]|struct.unpack_from('<I',e.b,at+12)[0]<<32
 def rp(e,at):return struct.unpack_from('<Q',e.b,at)[0]>>32 if e.relocations.get(at,{}).get('type')==8 else None
 def words(e,p,n):return list(struct.unpack_from('<'+'Q'*n,e.b,p))if d(e,p,8*n)else None
 out=[]
 for p in closure['pairs']:
  for off in p['relocated_data_offsets']:
   a,b=ptr(o,p['original']+off),ptr(c,p['candidate']+off);r={'original':p['original'],'candidate':p['candidate'],'offset':off,'candidate_names':p['candidate_names'],'original_pointer':a,'candidate_pointer':b}
   if code(o,a)and code(c,b):r.update(kind='code_pointer',body_pair=(a,b)in pairs,original_target=a,candidate_target=b,candidate_target_names=names[b]);out.append(r);continue
   x,y=words(o,a,2),words(c,b,2)
   if x is None or y is None:continue
   op,cp=rp(o,a),rp(c,b);of,cf=rp(o,a+24),rp(c,b+24);vx,vy=words(o,a,4),words(c,b,4)
   if vx is not None and vy is not None and op is not None and cp is not None and code(o,op)and code(c,cp)and 0<=x[1]<1000000 and 0<=y[1]<1000000 and vx[2]in [1,2,4,8,16]and vy[2]in [1,2,4,8,16]and of is not None and cf is not None and code(o,of)and code(c,cf):
    r.update(kind='vtable',original_size=x[1],candidate_size=y[1],original_alignment=vx[2],candidate_alignment=vy[2],metadata_equal=vx[1:3]==vy[1:3],original_drop=op,candidate_drop=cp,drop_body_pair=(op,cp)in pairs,original_method=of,candidate_method=cf,method_body_pair=(of,cf)in pairs,candidate_method_names=names[cf]);out.append(r)
   elif op is not None and cp is not None and 0<x[1]<=4096 and 0<y[1]<=4096 and d(o,op,x[1])and d(c,cp,y[1]):
    xx,yy=o.b[op:op+x[1]],c.b[cp:cp+y[1]]
    try:tx,ty=xx.decode(),yy.decode()
    except UnicodeDecodeError:continue
    if not all(q.isprintable()or q in '\n\r\t'for q in tx+ty):continue
    r.update(kind='text_descriptor',original_text=tx,candidate_text=ty,equal=xx==yy,original_length=x[1],candidate_length=y[1])
    ox,cy=words(o,a,3),words(c,b,3)
    if ox is not None and cy is not None and tx.endswith('.rs') and ty.endswith('.rs') and (ox[2]&0xffffffff)<1000000 and (ox[2]>>32)<100000 and (cy[2]&0xffffffff)<1000000 and (cy[2]>>32)<100000:
     r.update(original_line=ox[2]&0xffffffff,original_column=ox[2]>>32,candidate_line=cy[2]&0xffffffff,candidate_column=cy[2]>>32,origin_coordinates_equal=ox[2]==cy[2])
    out.append(r)
 return {'candidate_sha256':closure['candidate_sha256'],'counts':dict(collections.Counter(r['kind']for r in out)),'observations':out,'scope':'Recognizable descriptors only. Matching bodies can correspond to different generic instantiations; unequal descriptor values do not by themselves prove a wrong executed path.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);p.add_argument('--closure',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();r=analyze(a.candidate,a.symbols,json.loads(a.closure.read_bytes()));a.output.write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r['counts']))
