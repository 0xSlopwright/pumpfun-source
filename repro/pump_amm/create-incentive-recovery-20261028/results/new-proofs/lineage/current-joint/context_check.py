from pathlib import Path
import hashlib,json,struct,sys
W=Path(__file__).parent;sys.path.insert(0,str(W));from elf_reader import Elf

def verify(w=W):
 o=Elf(w/'runtime-inputs/evidence/original/pump_amm/deployed.so');c=Elf(w/'build/artifacts/pump_amm_recovered.so');s=Elf(w/'build/artifacts/unstripped.so');a=0x2ba60;f=next(f for f in s.funcs if '11create_pool7execute17'in f['name']);b=f['start'];assert f['size']==10048
 ins=lambda e,p:struct.unpack_from('<BBhi',e.b,p)
 def ptr(e,p):assert ins(e,p)[0]==0x18 and e.relocations[p]['type']==8;return struct.unpack_from('<I',e.b,p+4)[0]|struct.unpack_from('<I',e.b,p+12)[0]<<32
 # Same creator AccountInfo chain andfour copied words, preserving source identity.
 source=[(0x79,0x71,16,0),(0x79,0x11,0,0)];assert [ins(o,a+x)for x in [48,56]]==[ins(c,b+x)for x in [48,56]]==source
 for i,(offset,word)in enumerate([(64,24),(80,16),(96,8),(112,0)]):
  assert ins(o,a+offset)==ins(c,b+offset)==(0x79,0x12 if word else 0x11,word,0)
  origdest=-0x340-i*8;newdest=-0x10-i*8
  assert ins(o,a+offset+8)==(0x7b,0x2a if word else 0x1a,origdest,0)
  assert ins(c,b+offset+8)==(0x7b,0x2a if word else 0x1a,newdest,0)
 op,np=ptr(o,a+320),ptr(c,b+328);assert o.b[op:op+32]==c.b[np:np+32]
 oc,cc=o.callsites(a,10240),c.callsites(b,f['size']);assert len(oc)==len(cc)==66 and [x['offset']for x in oc[:2]]==[336,448] and [x['offset']for x in cc[:2]]==[344,384]
 for x,y in zip(oc[:2],cc[:2]):
  i=o.entries.index(x['target']);n=o.entries[i+1]-x['target'];t=next(t for t in s.funcs if t['start']==y['target']);assert n==t['size']and o.normalized[x['target']:x['target']+n]==c.normalized[y['target']:y['target']+n]and o.pattern(x['target'],n)==c.pattern(y['target'],n)
 assert ins(c,b+360)==(0x07,0x01,0,-0x28) and ins(c,b+368)==(0xbf,0x62,0,0)
 j=json.loads((w/'canonical-measurement.json').read_text());baseline=json.loads((w/'baseline-measurement.json').read_text());prior={x['start']:x for x in baseline['rows']};gains=[hex(x['start'])for x in j['rows']if x['matches']and not prior[x['start']]['matches']];losses=[hex(x['start'])for x in j['rows']if not x['matches']and prior[x['start']]['matches']];assert j['normalized_matches']==660 and j['raw_matches']==159 and gains==losses==[]
 return {'passed':True,'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'original_readonly_pump_id':hex(op),'candidate_readonly_pump_id':hex(np),'pump_id_bytes':o.b[op:op+32].hex(),'creator_snapshot_before_pda':True,'actual_pda_and_memcmp_callees_match':True,'memcmp_arg1_creator_snapshot':True,'memcmp_arg2_pda_output':True,'original_body_bytes':10240,'baseline_body_bytes':10136,'candidate_body_bytes':10048,'remaining_body_bytes_difference':-192,'normalized':660,'raw':159,'gains':gains,'losses':losses,'residual':'Original copies returned PDA32bytes to another local before memcmp; selected trial directly points to PDA return storage. Stack placement and other cold blocks remain different; whole body is not matched.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
