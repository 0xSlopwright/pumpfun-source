"""Narrow original instruction, callee and Source witnesses for H18's three components."""
from pathlib import Path
from collections import Counter
import hashlib,struct
from elf_reader import Elf
from source_fields import source_fields

def verify(root):
 w=Path(root);o=Elf(w/'input-root/evidence/original/pump_amm/deployed.so');c=Elf(w/'build/artifacts/pump_amm_recovered.so');s=Elf(w/'build/artifacts/unstripped.so')
 ends=dict(zip(o.entries,o.entries[1:]+[o.hi]));sf={f['start']:f for f in s.funcs}
 def sig(e,p,n):return(n,hashlib.sha256(e.normalized[p:p+n]).hexdigest(),str(e.pattern(p,n)))
 boost=next(f for f in s.funcs if '18pump_amm_recovered18pump_amm_recovered18boost_buy_and_burn17'in f['name']);oc=o.callsites(0x1fed8,11688);cc=c.callsites(boost['start'],boost['size']);observed=[]
 for original_offset,candidate_offset,target,n in[(256,256,0x6c248,224),(3496,3800,0x12310,144),(4512,4800,0x727b8,2400),(6464,6760,0x6c248,224)]:
  x=next(v for v in oc if v['offset']==original_offset);y=next(v for v in cc if v['offset']==candidate_offset);f=sf[y['target']]
  assert x['target']==target and ends[target]-target==n and sig(o,target,n)==sig(c,f['start'],f['size'])
  observed.append({'original_offset':original_offset,'current_offset':candidate_offset,'original_target':hex(target),'current_target':hex(f['start']),'bytes':n,'full_normalized_body_and_relocations_equal':True})
 cashback=next(f for f in s.funcs if '18pump_amm_recovered18pump_amm_recovered14claim_cashback17'in f['name']);assert cashback['size']==4040
 ins=lambda e,p:struct.unpack_from('<BBhi',e.b,p);counts=lambda e,p,n:Counter(ins(e,i)[0]for i in range(p,p+n,8))
 assert counts(o,0x5b5b8,4056)-counts(c,cashback['start'],4040)=={5:2}and not(counts(c,cashback['start'],4040)-counts(o,0x5b5b8,4056))
 loads=[p-cashback['start']for p in range(cashback['start'],cashback['start']+4040,8)if ins(c,p)==(0x79,0x81,0x230,0)];assert len(loads)==2 and loads[0]<312<loads[1]
 oc=o.callsites(0x5b5b8,4056);cc=c.callsites(cashback['start'],4040);assert len(oc)==len(cc)==17
 assert Counter(sig(o,x['target'],ends[x['target']]-x['target'])for x in oc)==Counter(sig(c,x['target'],sf[x['target']]['size'])for x in cc)
 buyback=next(f for f in s.funcs if '12instructions5admin21update_buyback_config21update_buyback_config17'in f['name']);assert buyback['size']==1344
 assert[x['offset']for x in o.callsites(0x1c890,1344)]==[x['offset']for x in c.callsites(buyback['start'],1344)]==[72,768,864,1008,1096,1296]
 a=source_fields(o,0x1c890,1344);b=source_fields(c,buyback['start'],1344);assert len(a)==len(b)==1
 assert a[0]['filename']==b[0]['filename']=='programs/pump-amm/src/instructions/admin/update_buyback_config.rs'and(a[0]['line'],b[0]['line'])==(40,9)
 return {'passed':True,'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'boost_helper_witnesses':observed,'boost_current_bytes':boost['size'],'boost_original_bytes':11688,'boost_handler_equal':False,'cashback_original_bytes':4056,'cashback_current_bytes':4040,'cashback_key_load_offsets':loads,'cashback_actual_direct_callee_matches':17,'cashback_remaining_original_unconditional_branches':2,'buyback_current_bytes':1344,'buyback_original_bytes':1344,'buyback_call_offsets':[72,768,864,1008,1096,1296],'buyback_original_filename_recovered':True,'buyback_original_source_line':40,'buyback_current_source_line':9,'buyback_whole_body_equal':False,'scope':'Narrow original instruction and actual direct-target witnesses. Joint bodies and ordered callees are separately bound to isolated candidates. No complete handler, arbitrary indirect closure, or historical-source identity claim.'}
