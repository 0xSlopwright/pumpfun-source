from pathlib import Path
import json,hashlib,struct,difflib,sys
W=Path(__file__).parent;sys.path.insert(0,str(W));from elf_reader import Elf
H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def verify(root=None):
 w=Path(root or W);m=json.loads((w/'manifest.json').read_text())['files'];assert m=={str(p.relative_to(w)):H(p)for p in w.rglob('*')if p.is_file()and p!=w/'manifest.json'and'__pycache__'not in p.parts}
 o,c,s=[Elf(w/n)for n in ['original.so','candidate.so','symbols.so']];a=0x2ba60;f=next(f for f in s.funcs if '11create_pool7execute17' in f['name']);b=f['start'];assert f['size']==10136
 def ins(e,p):return struct.unpack_from('<BBhi',e.b,p)
 def ptr(e,p):assert ins(e,p)[0]==0x18 and e.relocations[p]['type']==8;return struct.unpack_from('<I',e.b,p+4)[0]|struct.unpack_from('<I',e.b,p+12)[0]<<32
 # Exact creator pointer-chain and32byte snapshot precede PDA evaluation.
 expected=[(0x79,0x71,16,0),(0x79,0x11,0,0),(0x79,0x12,24,0),(0x7b,0x2a,-0x340,0),(0x79,0x12,16,0),(0x7b,0x2a,-0x348,0),(0x79,0x12,8,0),(0x7b,0x2a,-0x350,0),(0x79,0x11,0,0),(0x7b,0x1a,-0x358,0)]
 assert [ins(o,a+off)for off in range(48,128,8)]==expected
 op=ptr(o,a+320);fixed=bytes([1,86,224,246,147,102,90,207,68,219,21,104,191,23,91,170,81,137,203,151,245,210,255,59,101,93,43,182,253,109,24,176]);assert o.b[op:op+32]==fixed
 assert ins(o,a+416)==(0x07,0x01,0,-0x358)and ins(o,a+432)==(0x07,0x02,0,-0x28)
 oc=o.callsites(a,10240);cc=c.callsites(b,f['size']);assert len(oc)==len(cc)==66 and [x['offset']for x in oc[:2]]==[336,448]and[x['offset']for x in cc[:2]]==[360,480]
 for x,y in zip(oc[:2],cc[:2]):
  i=o.entries.index(x['target']);n=o.entries[i+1]-x['target'];t=next(t for t in s.funcs if t['start']==y['target']);assert n==t['size']and o.normalized[x['target']:x['target']+n]==c.normalized[y['target']:y['target']+n]and o.pattern(x['target'],n)==c.pattern(y['target'],n)
 # Current fixed ID is encoded by four LDDW constants stored to a stack local.
 got=[]
 for offset in [48,72,96,120]:
  assert ins(c,b+offset)[0]==0x18
  got.append(struct.unpack_from('<I',c.b,b+offset+4)[0]|struct.unpack_from('<I',c.b,b+offset+12)[0]<<32)
 assert b''.join(v.to_bytes(8,'little')for v in reversed(got))==fixed
 old=(w/'source-original.rs').read_text();new=(w/'source-proposed.rs').read_text();expectednew=old.replace('let pump = Pubkey::new_from_array([','const PUMP: Pubkey = Pubkey::new_from_array([').replace('    let canonical =\n        Pubkey::find_program_address(&[b"pool-authority", a.base_mint.key().as_ref()], &pump).0\n            == a.creator.key();','    let canonical = a.creator.key()\n        == Pubkey::find_program_address(&[b"pool-authority", a.base_mint.key().as_ref()], &PUMP).0;');assert new==expectednew
 path='programs/pump-amm/src/instructions/create_pool.rs';assert(w/'recovery.patch').read_text()==''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+path,tofile='b/'+path))
 return {'passed':True,'baseline_sha256':H(w/'candidate.so'),'original_creator_snapshot_before_pda':True,'original_pump_id_readonly_pointer':hex(op),'pda_then_memcmp_offsets':[336,448],'candidate_pda_then_memcmp_offsets':[360,480],'proposal_tested':False,'manifest_sha256':H(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
