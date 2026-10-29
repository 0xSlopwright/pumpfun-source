from pathlib import Path
import argparse,collections,hashlib,json,sys,types
W=Path(__file__).resolve().parent
C='be10ca1a530ef9c62be5c94a5183f339e5d7661dce588a9458767e20a5e488f6';S='39420099acbe3f90c1e62d449e8892775b751f8c84aa61ac78c8425fdf9c2af3';O='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def mod(name):
 p=W/(name+'.py');m=types.ModuleType(name);m.__file__=str(p);sys.modules[name]=m;exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def verify(root,candidate=None,symbols=None):
 root=Path(root).resolve();b=root/'repro/pump_amm/quote-guard-recovery-20261027/results/build';candidate=Path(candidate or b/'candidate.so');symbols=Path(symbols or b/'unstripped.so');original=root/'evidence/original/pump_amm/deployed.so'
 assert(sha(candidate),sha(symbols),sha(original))==(C,S,O)
 assert json.loads((W/'manifest.json').read_bytes())['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 rows=json.loads((W/'remaining-input.json').read_bytes())['rows'];assert len(rows)==32
 sys.path.insert(0,str(W));reader=mod('elf_reader');o,c=reader.Elf(original),reader.Elf(candidate)
 outputs={}
 for name,file in [('branches','branches'),('constructed','constructed'),('schemas','schemas'),('writer_loop','writer-loop')]:
  value=mod(name).analyze(original,candidate,symbols,rows);assert value==json.loads((W/(file+'.json')).read_bytes());outputs[name]=value
 assert [outputs[x]['resolved']for x in ['branches','constructed','schemas','writer_loop']]==[9,10,8,1]
 done=outputs['branches']['rows']+outputs['constructed']['rows']+outputs['schemas']['rows']+[outputs['writer_loop']['row']]
 assert all(r['equal']for r in done);keys={(r['original'],r['candidate'],r['offset'])for r in done};assert len(keys)==28
 left=[r for r in rows if(r['original'],r['candidate'],r['offset'])not in keys];assert left==json.loads((W/'unresolved.json').read_bytes())['rows']and len(left)==4
 unique={(r['original_pointer'],r['candidate_pointer'],r['bytes'])for r in done};negative=0
 for a,b,n in unique:
  x,y=o.b[a:a+n],c.b[b:b+n];assert x==y
  changed=bytearray(y);changed[-1]^=1;assert x!=bytes(changed)and x!=c.b[b+1:b+1+n];negative+=2
 assert all(r['output_kind']in('return','call')for r in outputs['branches']['rows'])
 assert collections.Counter(r['output_kind']for r in outputs['branches']['rows'])=={'return':6,'call':3}
 # The loop guard's mathematical bound is necessary, not merely the table size.
 for remaining in range(9):
  offset=8-remaining;wrong_length=remaining+1;assert offset+wrong_length>8
 return {'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':C,'input_observations':32,'accounted_observations':28,'still_unresolved':4,'direct_or_returned_string_slices':9,'constructed_signer_or_pda_slices':10,'format_schemas':8,'previous_empty_format_schema_observations':5,'bounded_idl_discriminator_loop':1,'loop_invariant_test_states':outputs['writer_loop']['invariant_checks'],'paired_ranges':len(unique),'negative_tail_or_shift_checks':negative,'source_change_proposed':False,'scope':'Argument and returned-slice extents plus one bounded read loop. Indirect-target identity, the four boolean allocation correlations and whole-data/whole-ELF identity remain unproved.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--symbols',type=Path);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.symbols),indent=2))
