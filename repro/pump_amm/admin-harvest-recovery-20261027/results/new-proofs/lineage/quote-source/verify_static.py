#!/usr/bin/env python3
"""Offline bounded object comparison. No target execution or compilation."""
import ast,collections,hashlib,json,struct,sys
from pathlib import Path
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent;R=W.parents[1]
sys.path.insert(0,str(R/'repro/pump_amm/claim-self-transfer-v144/static-tool'))
from elf_reader import Elf

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def sections(path):
 b=path.read_bytes();off=struct.unpack_from('<Q',b,40)[0];size,count,ni=struct.unpack_from('<HHH',b,58);ss=[struct.unpack_from('<IIQQQQIIQQ',b,off+i*size) for i in range(count)];ns=ss[ni];names=b[ns[4]:ns[4]+ns[5]];out=[]
 for i,s in enumerate(ss):
  name=names[s[0]:].split(b'\0',1)[0].decode()
  if not name.startswith('.text.'):continue
  code=bytearray(b[s[4]:s[4]+s[5]]);rels=[]
  for r in ss:
   if r[1]!=9 or r[7]!=i:continue
   sym=ss[r[6]];st=ss[sym[6]];strings=b[st[4]:st[4]+st[5]]
   for at in range(r[4],r[4]+r[5],16):
    loc,info=struct.unpack_from('<QQ',b,at);kind=info&0xffffffff;k=info>>32;n,_,_,shndx,value,length=struct.unpack_from('<IBBHQQ',b,sym[4]+24*k);symbol=strings[n:].split(b'\0',1)[0].decode();rel={'offset':loc,'type':kind,'symbol':symbol}
    if kind==1:
     addend=struct.unpack_from('<I',code,loc+4)[0]|struct.unpack_from('<I',code,loc+12)[0]<<32
     if shndx<len(ss) and shndx:
      target=ss[shndx][4]+value+addend;rel['resolved_first32']=b[target:target+32].hex()
     code[loc+4:loc+8]=bytes(4);code[loc+12:loc+16]=bytes(4)
    elif kind==10:code[loc+4:loc+8]=bytes(4)
    rels.append(rel)
  out.append({'name':name,'size':s[5],'code':bytes(code),'relocations':rels})
 return out

def selector(p):return next(x for x in sections(p) if 'select_and_apply_v2' in x['name'])
def role(s):
 if 'market_cap' in s:return 'market_cap'
 if 'find_program_address' in s:return 'find_program_address'
 if 'PumpAmmError4name' in s:return 'error_name'
 if 'PumpAmmError' in s and 'Display' in s:return 'error_display'
 if 'unwrap_failed' in s:return 'unwrap_failed'
 if 'Error' in s and 'AnchorError' in s:return 'error_convert'
 if '5apply' in s:return 'apply'
 if '4tier' in s:return 'tier'
 assert s=='memcmp',s
 return s

def verify():
 O=Elf(R/'evidence/original/pump_amm/deployed.so');C=Elf(R/'work/amm-u64-v2-creator-final-20261027/build/artifacts/unstripped.so');f=next(f for f in C.funcs if 'select_and_apply_v2' in f['name']);v={k:selector(W/(k+'.o')) for k in ('base','borrow','owned')}
 assert f['size']==1760 and v['base']['code']==C.normalized[f['start']:f['start']+f['size']]
 assert [v[k]['size'] for k in v]==[1760,1632,1616]
 linked_relocs=[(r['offset'],1 if r['type']==8 else r['type']) for r in C.pattern(f['start'],f['size'])]
 linked_relocs += [(r['offset'],10) for r in C.callsites(f['start'],f['size'])]
 assert sorted((r['offset'],r['type']) for r in v['base']['relocations'])==sorted(linked_relocs)
 for k in ('borrow','owned'):assert collections.Counter(role(r['symbol']) for r in v[k]['relocations'] if r['type']==10)==collections.Counter(role(r['symbol']) for r in v['base']['relocations'] if r['type']==10)
 # The candidate borrow's three literal quote keys are actual resolved rodata bytes;
 # compare with the corresponding original LDDWs immediately before each quote memcmp.
 # derive from known call sites, selecting the relocated LDDW in preceding32bytes.
 orig_memcmps=[a for a,t in O.calls.items() if 0x14088<=a<0x14700 and t==0x1198e0][1:]
 orig_keys=[]
 for pc in orig_memcmps:
  a=next(a for a in range(pc-32,pc,8) if O.relocations.get(a,{}).get('type')==8 and O.b[a]==0x18)
  ptr=struct.unpack_from('<I',O.b,a+4)[0]|struct.unpack_from('<I',O.b,a+12)[0]<<32;orig_keys.append(O.b[ptr:ptr+32].hex())
 borrowkeys=[]
 rel=v['borrow']['relocations']
 for x in rel:
  if x['type']==10 and x['symbol']=='memcmp' and x['offset']>1000:
   ref=next(r for r in rel if r['type']==1 and 0<x['offset']-r['offset']<=32);borrowkeys.append(ref['resolved_first32'])
 assert len(orig_keys)==len(borrowkeys)==3 and orig_keys==borrowkeys
 root='programs/pump-amm/src/curve/fees.rs'
 import difflib
 expected=''.join(difflib.unified_diff((W/'source-base'/root).read_text().splitlines(True),(W/'source-borrow'/root).read_text().splitlines(True),fromfile='a/'+root,tofile='b/'+root))
 assert (W/'recovery.patch').read_text()==expected
 changed=[str(p.relative_to(W/'source-base')) for p in (W/'source-base').rglob('*') if p.is_file() and p.read_bytes()!=(W/'source-borrow'/p.relative_to(W/'source-base')).read_bytes()]
 assert changed==[root]
 return {'passed':True,'candidate_sha256':sha(R/'work/amm-u64-v2-creator-final-20261027/build/artifacts/pump_amm_recovered.so'),'patch_sha256':sha(W/'recovery.patch'),'base_calibrates_full_normalized_selector':True,'original_start':'0x14088','original_bytes':1656,'base_bytes':1760,'borrow_bytes':1632,'owned_unselected_bytes':1616,'same_logical_call_multiset':True,'quote_pubkeys_match_original':orig_keys,'changed_source_files':changed,'object_sha256':{k:sha(W/(k+'.o')) for k in v},'scope':'Direct object and source evidence only. Full linked census, runtime and historical source identity are not established by this report.'}

if __name__=='__main__':print(json.dumps(verify(),indent=2))
