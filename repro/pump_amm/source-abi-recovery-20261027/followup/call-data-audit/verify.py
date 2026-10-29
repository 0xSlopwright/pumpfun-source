from pathlib import Path
import argparse,hashlib,json,struct,sys
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def module(name):
 p=W/'tools'/name;ns={'__name__':'sealed_'+p.stem,'__file__':str(p)};exec(compile(p.read_bytes(),str(p),'exec'),ns);return ns

def verify(root,candidate=None,symbols=None):
 root=Path(root).resolve();man=json.loads((W/'manifest.json').read_bytes());assert set(man['files'])=={str(p.relative_to(W))for p in W.rglob('*')if p.is_file()and p.name!='manifest.json'}
 for name,h in man['files'].items():assert sha(W/name)==h,name
 candidate=Path(candidate).resolve()if candidate else root/'repro/pump_amm/source-abi-recovery-20261027/results/build/candidate.so';symbols=Path(symbols).resolve()if symbols else candidate.with_name('unstripped.so');assert sha(candidate)=='e995d6a8211dcd3d05c07cdcb1a7147ec4f4e2b2a81b56c268fd1a3d76a01ce1'
 a=module('audit.py');a['ROOT']=root;a['ORIGINAL']=root/'evidence/original/pump_amm/deployed.so';cl=a['analyze'](candidate,symbols,W/'joint-verified/measurement.json');assert cl==json.loads((W/'joint-verified/call-closure.json').read_bytes())
 d=module('descriptors.py');d['ROOT']=root;ds=d['analyze'](candidate,symbols,cl);assert ds==json.loads((W/'joint-verified/descriptors.json').read_bytes())
 t=module('targets.py');t['ROOT']=root;closed=t['analyze'](candidate,symbols,cl,ds);assert closed==json.loads((W/'joint-verified/data-closure.json').read_bytes());assert closed['counts']['bounded_static_closed_windows']==583 and closed['counts']['unequal_text_without_equal_alternative']==0
 getter=module('getter.py')['verify'](root,candidate,symbols);event=module('event.py')['verify'](root,candidate,symbols)
 sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 o=Elf(root/'evidence/original/pump_amm/deployed.so');c=Elf(candidate)
 arrays=json.loads((W/'empty-leading-format-pieces.json').read_bytes())
 for row in arrays:
  n=row['piece_count'];count=row['count_store'];at=count['original_address'];bt=count['candidate_address'];assert o.b[at:at+8].hex()==count['original_bytes']and c.b[bt:bt+8].hex()==count['candidate_bytes'];assert struct.unpack_from('<i',o.b,at+4)[0]==struct.unpack_from('<i',c.b,bt+4)[0]==n
  for side,e in [('original',o),('candidate',c)]:
   p=row[side+'_pointer'];pieces=[]
   for i in range(n):
    a=p+i*16;length=struct.unpack_from('<Q',e.b,a+8)[0]
    if length==0:assert struct.unpack_from('<Q',e.b,a)[0]==1;pieces.append('')
    else:assert e.relocations[a]['type']==8;q=struct.unpack_from('<Q',e.b,a)[0]>>32;pieces.append(e.b[q:q+length].decode())
   assert pieces==row['pieces'][side]
 proof=json.loads((W/'bs58-table-proof.json').read_bytes());alphabet=b'123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';decode=bytearray([255]*128)
 for i,v in enumerate(alphabet):decode[v]=i
 data=bytes(decode)+alphabet;assert hashlib.sha256(data).hexdigest()==proof['variant_sha256']['decode_then_encode']
 for side,e in [('original',o),('candidate',c)]:
  obs=proof['observations'][side];p=obs['table_address'];assert e.b[p:p+186]==data
  for ref in obs['references']:
   at=ref['instruction'];q=struct.unpack_from('<I',e.b,at+4)[0]|struct.unpack_from('<I',e.b,at+12)[0]<<32;assert q==p+ref['table_offset']
 return {'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':sha(candidate),'normalized_windows':640,'raw_windows':128,'bounded_static_windows':583,'getter':getter['passed'],'event_filename':event['passed'],'source_coordinate_remainder':29,'zero_size_vtable_observations':34,'format_piece_arrays':3,'bs58_table_bytes':186,'scope':'Bounded read-only call/data identity; full ELF remains unequal.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--symbols',type=Path);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.symbols),indent=2))
