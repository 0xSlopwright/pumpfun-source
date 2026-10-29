from pathlib import Path
import sys,json,struct,hashlib
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W));from elf_reader import Elf
C=Elf(W/'build/artifacts/pump_amm_recovered.so');S=Elf(W/'build/artifacts/unstripped.so');O=Elf(W/'original.so');B=Elf(W/'candidate.so');BS=Elf(W/'symbols.so')
clone=next(f for f in S.funcs if 'clone..Clone$GT$5clone17'in f['name']and 'AccountInfo'in f['name']);decode=next(f for f in S.funcs if '9from_mint17'in f['name']);assert clone['size']==264 and O.normalized[0xe178:0xe178+264]==C.normalized[clone['start']:clone['start']+264]
olddecode=next(f for f in BS.funcs if '9from_mint17'in f['name']);assert decode['size']==olddecode['size']and C.normalized[decode['start']:decode['start']+decode['size']]==B.normalized[olddecode['start']:olddecode['start']+olddecode['size']]
ins=lambda e,p:struct.unpack_from('<BBhi',e.b,p)
rows=[]
for name,frag,a,n in [('buy','11execute_buy17',0x53350,5840),('exact','23execute_buy_exact_quote17',0x54a20,7112),('sell','12execute_sell17',0x56710,5904)]:
 f=next(f for f in S.funcs if frag in f['name']);calls=C.callsites(f['start'],f['size']);ix=next(i for i,r in enumerate(calls)if r['target']==decode['start']);cl=calls[ix-1];fm=calls[ix];assert cl['target']==clone['start']and fm['offset']-cl['offset']==32
 # Clone ABI: r1=stack temporary and r2=the mint AccountInfo pointer. Consecutive call gap retains r8 and passes it as r2.
 p=f['start']+cl['offset'];pre=[ins(C,k)for k in range(p-40,p,8)];tempreg=pre[2][1]&15;assert pre[0]==(0x79,0x71,0x20,0)and pre[1]==(0x79,0x12,0x58,0)and pre[2]==(0xbf,0xa0|tempreg,0,0)and pre[3][0:2]==(0x07,tempreg)and pre[4]==(0xbf,(tempreg<<4)|1,0,0);tmp=pre[3][3]
 assert ins(C,p+24)==(0xbf,(tempreg<<4)|2,0,0)
 # Both captured Rc handles are read after decoding; retain actual release-chain windows.
 loads=[];decrements=[]
 for k in range(p+32,min(f['start']+f['size'],p+32+512),8):
  x=ins(C,k)
  if x[0]==0x79 and x[1]>>4==10 and x[2]in[tmp+8,tmp+16]:loads.append({'pc':hex(k),'slot':x[2],'reg':x[1]&15})
  if k+24<f['start']+f['size']:
   y,z=ins(C,k+8),ins(C,k+16)
   if x[0]==0x79 and x[2]==0 and y==(7,x[1]&15,0,-1)and z==(0x7b,((x[1]&15)<<4)|(x[1]>>4),0,0):decrements.append(hex(k))
 assert {x['slot']for x in loads}=={tmp+8,tmp+16}and len(decrements)>=2
 rows.append({'name':name,'original_bytes':n,'new_function':f,'clone_call':cl,'from_mint_call':fm,'temporary_stack_offset':tmp,'post_decode_rc_loads':loads,'post_decode_strong_decrements':decrements,'unchanged_decoder_body_bytes':decode['size']})

r={'candidate_sha256':hashlib.sha256(C.b).hexdigest(),'clone_full_normalized_equal':True,'decoder_body_unchanged':True,'rows':rows}
RESULT=r
