from pathlib import Path
import argparse,collections,hashlib,json,struct,sys,types
W=Path(__file__).resolve().parent
CANDIDATE='be10ca1a530ef9c62be5c94a5183f339e5d7661dce588a9458767e20a5e488f6';SYMBOLS='39420099acbe3f90c1e62d449e8892775b751f8c84aa61ac78c8425fdf9c2af3'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def coordinate_only(old,new):return old[0]==new[0] and old[1:]!=new[1:]
def module(name,root):
 p=W/'tools'/name;m=types.ModuleType('static_'+p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);m.R=root;return m

def verify(root,candidate,symbols):
 root=Path(root).resolve();candidate=Path(candidate);symbols=Path(symbols);assert sha(candidate)==CANDIDATE and sha(symbols)==SYMBOLS
 manifest=json.loads((W/'manifest.json').read_bytes());assert manifest['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 original=root/'evidence/original/pump_amm/deployed.so';o=Elf(original);c=Elf(candidate);s=Elf(symbols);fns={f['start']:f for f in s.funcs};rows=json.loads((W/'coordinates.json').read_bytes())['rows'];assert len(rows)==12 and len({r['original_pointer']for r in rows})==6
 for row in rows:
  a,b=row['original'],row['candidate'];f=fns[b];n=f['size'];assert o.entries[o.entries.index(a)+1]-a==n and o.normalized[a:a+n]==c.normalized[b:b+n]and o.pattern(a,n)==c.pattern(b,n)
  def location(e,p):
   assert e.relocations[p]['type']==8;fp=struct.unpack_from('<Q',e.b,p)[0]>>32;ln=struct.unpack_from('<Q',e.b,p+8)[0];line,col=struct.unpack_from('<II',e.b,p+16);return(e.b[fp:fp+ln].decode(),line,col)
  old=location(o,row['original_pointer']);new=location(c,row['candidate_pointer']);assert old==(row['original_text'],row['original_line'],row['original_column'])and new==(row['original_text'],row['candidate_line'],row['candidate_column']);assert coordinate_only(old,new)
  assert not coordinate_only(old,(new[0]+'.wrong',new[1],new[2])) # wrong filename is a different obligation
 inv=module('inventory.py',root).run(original,candidate,W/'inputs');assert inv==json.loads((W/'inputs/inventory.json').read_bytes())
 ext=module('objects.py',root).analyze(original,candidate,symbols,W/'inputs/inventory.json');assert ext==json.loads((W/'object-extents.json').read_bytes());flat=[r for r in ext['rows']if r['flat']];assert len(flat)==1320 and all(r['raw_span_equal']for r in flat)
 # Actual byte-range negatives; no executable file is changed.
 chosen=next(r for r in flat if r['candidate_printable']and r['candidate_object_bytes']>16);a,b,n=chosen['original_pointer'],chosen['candidate_pointer'],chosen['candidate_object_bytes'];expected=o.b[a:a+n];changed=bytearray(c.b[b:b+n]);changed[-1]^=1;assert bytes(changed)!=expected and c.b[b+1:b+1+n]!=expected
 groups=collections.defaultdict(list)
 for r in ext['rows']:groups[(r['original'],r['offset'])].append(r)
 alias_families=sum(len({r['candidate_pointer']for r in rs})>1 and all(r['raw_span_equal']for r in rs)for rs in groups.values())
 return{'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':CANDIDATE,'coordinate_references':12,'distinct_source_records':6,'coordinate_body_mismatches':0,'filenames_equal':True,'flat_candidate_object_spans':1320,'flat_span_mismatches':0,'unmapped_candidate_object_starts':ext['unmapped_candidate_object_starts'],'equal_alias_families':alias_families,'negative_controls':['wrong filename rejected as coordinate-only','tail byte change rejected','shifted object pointer rejected'],'source_change_proposed':False,'scope':'Candidate-symbol-bounded spans and actual location metadata only; original allocation boundaries and all remaining data are not claimed equal.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--symbols',type=Path);a=p.parse_args();base=a.root/'repro/pump_amm/quote-guard-recovery-20261027/results/build';print(json.dumps(verify(a.root,a.candidate or base/'candidate.so',a.symbols or base/'unstripped.so'),indent=2))
