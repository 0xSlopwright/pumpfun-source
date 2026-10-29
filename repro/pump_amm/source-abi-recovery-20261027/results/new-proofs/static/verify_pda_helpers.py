"""Verify recovered PDA bodies, their real constants and their call destinations."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,struct
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(candidate,symbols,measurement,root):
 root=Path(root);candidate=Path(candidate);symbols=Path(symbols);measurement=Path(measurement)
 raw=measurement.read_bytes();m=json.loads(gzip.decompress(raw)if raw[:2]==b'\x1f\x8b'else raw);reader=root/'repro/pump_amm/claim-self-transfer-v144/static-tool/elf_reader.py'
 assert sha(reader)==m['reader_sha256'] and sha(candidate)==m['candidate_sha256'] and sha(symbols)==m['symbols_sha256']
 spec=importlib.util.spec_from_file_location('pda_exact_reader',reader);mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
 o=mod.Elf(root/'evidence/original/pump_amm/deployed.so');c=mod.Elf(symbols);b=mod.Elf(candidate)
 assert sha(o.path)==ORIGINAL and c.b[c.lo:c.hi]==b.b[b.lo:b.hi] and c.pattern(c.lo,c.hi-c.lo)==b.pattern(b.lo,b.hi-b.lo)
 rows={v['start']:v for v in m['rows']};out=[]
 def wide(e,p):
  assert e.b[p]==0x18
  return struct.unpack_from('<I',e.b,p+4)[0]|struct.unpack_from('<I',e.b,p+12)[0]<<32
 for start,seed in [(0x2b8e0,b'pool-authority'),(0x2b9a0,b'bonding-curve')]:
  row=rows[start];assert row['end']-start==192 and row['matches']
  accepted=[]
  for item in row['matches']:
   at=item['start'];assert o.normalized[start:start+192]==c.normalized[at:at+192] and o.pattern(start,192)==c.pattern(at,192)
   assert o.b[wide(o,start+16):wide(o,start+16)+len(seed)]==c.b[wide(c,at+16):wide(c,at+16)+len(seed)]==seed
   assert o.b[wide(o,start+96):wide(o,start+96)+32]==c.b[wide(c,at+96):wide(c,at+96)+32]
   ocalls=o.callsites(start,192);ccalls=c.callsites(at,192);assert len(ocalls)==len(ccalls)==1
   assert ocalls[0]['offset']==ccalls[0]['offset']==112
   target=ocalls[0]['target'];matched={v['start']for v in rows[target]['matches']};assert ccalls[0]['target']in matched
   accepted.append({'candidate_start':at,'callee_start':ccalls[0]['target'],'seed':seed.decode(),'code_data_and_callee_equal':True})
  out.append({'original_start':start,'bytes':192,'candidates':accepted})
 return {'verified':True,'candidate_sha256':sha(candidate),'original_sha256':ORIGINAL,'recovered_helpers':out,'scope':'Complete normalized192-byte helpers, relocation pattern, actual seed/program bytes and call destination bodies; not whole ELF identity.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);p.add_argument('--measurement',type=Path,required=True);p.add_argument('--root',type=Path,default=Path.cwd());a=p.parse_args();print(json.dumps(verify(a.candidate,a.symbols,a.measurement,a.root),indent=2))
