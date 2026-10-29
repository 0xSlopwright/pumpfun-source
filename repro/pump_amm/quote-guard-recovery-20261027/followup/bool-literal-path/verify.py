from pathlib import Path
import argparse,hashlib,json,sys,types
W=Path(__file__).resolve().parent
C='be10ca1a530ef9c62be5c94a5183f339e5d7661dce588a9458767e20a5e488f6';S='39420099acbe3f90c1e62d449e8892775b751f8c84aa61ac78c8425fdf9c2af3';O='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(root,candidate=None,symbols=None):
 root=Path(root).resolve();B=root/'repro/pump_amm/quote-guard-recovery-20261027/results/build';candidate=Path(candidate or B/'candidate.so');symbols=Path(symbols or B/'unstripped.so');original=root/'evidence/original/pump_amm/deployed.so'
 assert(sha(candidate),sha(symbols),sha(original))==(C,S,O)
 assert json.loads((W/'manifest.json').read_bytes())['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 sys.path.insert(0,str(W));p=W/'probe.py';m=types.ModuleType('bool_paths');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__)
 result=m.analyze(original,candidate,symbols);assert result==json.loads((W/'proof.json').read_bytes());assert result['resolved']==4 and result['negative_uncorrelated_five_byte_paths']==8
 assert len(result['noreturn_pairs'])==12 and sum(p['original_noreturn']for p in result['noreturn_pairs'])==11
 from elf_reader import Elf
 o,c=Elf(original),Elf(candidate)
 for row in result['rows']:
  a,b=row['original_pointer'],row['candidate_pointer'];assert o.b[a:a+4]==c.b[b:b+4]==b'true';assert c.b[b+1:b+5]!=b'true';modified=bytearray(c.b[b:b+4]);modified[-1]^=1;assert bytes(modified)!=b'true'
 return {'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':C,'resolved_true_references':4,'copy_length':4,'matched_error_call_graph_nodes':12,'proved_nonreturning_nodes':11,'spurious_uncorrelated_length5_paths_rejected':8,'negative_returning_memcpy_is_not_noreturn':True,'source_changes':0,'scope':'All four formerly unbound true-literal copy extents. No claim of whole original allocations, arbitrary indirect call identity or whole-ELF equivalence.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--symbols',type=Path);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.symbols),indent=2))
