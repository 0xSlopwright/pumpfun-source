from pathlib import Path
import argparse,hashlib,json,struct,sys
W=Path(__file__).resolve().parent
sys.path.insert(0,str(W));from elf_reader import Elf
C='be10ca1a530ef9c62be5c94a5183f339e5d7661dce588a9458767e20a5e488f6';S='39420099acbe3f90c1e62d449e8892775b751f8c84aa61ac78c8425fdf9c2af3';O='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(root,candidate=None,symbols=None):
 root=Path(root).resolve();base=root/'repro/pump_amm/quote-guard-recovery-20261027/results/build';candidate=Path(candidate or base/'candidate.so');symbols=Path(symbols or base/'unstripped.so');original=root/'evidence/original/pump_amm/deployed.so'
 assert(sha(candidate),sha(symbols),sha(original))==(C,S,O)
 manifest=json.loads((W/'manifest.json').read_bytes());assert manifest['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 o,c,s=Elf(original),Elf(candidate),Elf(symbols);fs={f['start']:f for f in s.funcs};rows=json.loads((W/'organization.json').read_bytes())['methods'];filename=b'programs/pump-amm/src/state/global_config.rs';calls=0;origin_count=0
 for row in rows:
  a=row['original'];f=row['candidate'];b=f['start'];n=f['size'];assert f==fs[b]and o.entries[o.entries.index(a)+1]-a==n
  differences=[i for i in range(0,n,8)if o.normalized[a+i:a+i+8]!=c.normalized[b+i:b+i+8]];assert differences==[r['offset']for r in row['delta_origins']]
  assert o.pattern(a,n)==c.pattern(b,n)
  for r in row['delta_origins']:
   d=r['offset'];old=o.b[a+d:a+d+8];new=c.b[b+d:b+d+8];assert old[:4]==new[:4]and new[0]==0x62
   op,reg,stack,line=struct.unpack('<BBhi',new);assert reg==10 and stack==r['stack_line_offset']and line==r['candidate_line']and struct.unpack_from('<I',old,4)[0]==r['original_line']
   for e,start in[(o,a),(c,b)]:
    p=start+d-40;assert e.relocations[p]['type']==8 and e.b[p]==0x18;fp=struct.unpack_from('<I',e.b,p+4)[0]|struct.unpack_from('<I',e.b,p+12)[0]<<32;assert e.b[fp:fp+len(filename)]==filename
    assert struct.unpack_from('<BBhi',e.b,start+d+8)==(0x7a,10,stack-8,len(filename))
   assert 'require' in(W/'inputs/state-global_config.rs').read_text().splitlines()[line-1];origin_count+=1
  for call in row['calls']:
   d=call['offset'];ot=o.calls[a+d];ct=c.calls[b+d];g=fs[ct];assert(ot,ct,g['size'])==(call['original_target'],call['candidate_target'],call['bytes'])
   assert o.normalized[ot:ot+g['size']]==c.normalized[ct:ct+g['size']]and o.pattern(ot,g['size'])==c.pattern(ct,g['size']);calls+=1
 decoders=[(0x5eaf8,'read_global_config_899'),(0x5f800,'read_global_config_932'),(0x60698,'read_global_config_941'),(0x5e978,'GlobalConfig$u20$as$u20$anchor_lang..AccountDeserialize$GT$25try_deserialize_unchecked'),(0x5e778,'GlobalConfig$u20$as$u20$anchor_lang..AccountDeserialize$GT$15try_deserialize')]
 for a,name in decoders:
  found=[f for f in s.funcs if name in f['name']];assert len(found)==1;f=found[0];b,n=f['start'],f['size'];assert o.normalized[a:a+n]==c.normalized[b:b+n]and o.pattern(a,n)==c.pattern(b,n)
 # Actual near-alias negative: changing the setter changes the destination field.
 lp,protocol=rows[0],rows[1];a=lp['original'];b=protocol['candidate']['start'];n=lp['candidate']['size'];allowed={r['offset']for r in lp['delta_origins']};extra=[d for d in range(0,n,8)if d not in allowed and o.normalized[a+d:a+d+8]!=c.normalized[b+d:b+d+8]];assert extra==[24]
 assert(origin_count,calls,len(rows))==(13,130,9)
 return {'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':C,'method_pairs':9,'same_instructions_except_line_fields':True,'line_fields':13,'immediate_calls_equal':130,'exact_global_config_decoder_bodies':5,'negative_wrong_setter_field_difference_offset':24,'declaration_move_supported':False,'source_change_proposed':False,'scope':'Read-only method/decoder structure audit. No source line fitting, no type-layout change, and no whole-ELF claim.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--symbols',type=Path);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.symbols),indent=2))
