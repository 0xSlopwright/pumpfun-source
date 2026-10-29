from pathlib import Path
import argparse,difflib,hashlib,json,struct,types
W=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(name):
 p=W/name;m=types.ModuleType(p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m
def verify(root,candidate=None,symbols=None):
 root=Path(root);candidate=Path(candidate)if candidate else root/'repro/pump_amm/event-ownership-recovery-20261027/results/build/candidate.so';symbols=Path(symbols)if symbols else candidate.with_name('unstripped.so')
 assert json.loads((W/'manifest.json').read_bytes())['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 E=module('elf_reader.py').Elf;O,C,S=E(root/'evidence/original/pump_amm/deployed.so'),E(candidate),E(symbols);assert sha(O.path)=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'and sha(candidate)=='4e6a5617a7a8c3474ed7662f0188df4b1824c08253ebfb08212351ca5249da12';assert sha(symbols)=='98195c3cf2c125ce93ec615f840e42730d5abace8358c4b8545d937387cc7b30'and C.b[C.lo:C.hi]==S.b[S.lo:S.hi];f=next(f for f in S.funcs if'18pump_amm_recovered7disable17h'in f['name']);assert f['size']==3016
 def writes(code):return[i for i in range(0,len(code),8)if code[i]==0x73 and struct.unpack_from('<h',code,i+2)[0]==944]
 assert writes(O.b[0x17960:0x17960+3024])==[64,136,216,288,360]
 assert len(writes(C.b[f['start']:f['start']+f['size']]))==1
 ob=module('object_reader.py');base=next(f for f in ob.sections(W/'diagnostic/full_base.o')if'7disable'in f['name']);direct=next(f for f in ob.sections(W/'diagnostic/full_direct.o')if'7disable'in f['name']);assert(base['size'],direct['size'])==(2952,3104)
 assert writes(base['code'])==[240]and writes(direct['code'])==[64,136,216,296,368]
 assert not ob.sections(W/'diagnostic/flags.o')and not ob.sections(W/'diagnostic/concrete.o')
 a=(W/'baseline-lib.rs').read_text();b=(W/'source-lib.rs').read_text();start=a.index('    pub fn disable(');end=a.index('\n    pub fn update_admin',start);part=a[start:end];new=part.replace('        let flags = &mut ctx.accounts.global_config.disable_flags;\n','').replace('*flags = (*flags &','ctx.accounts.global_config.disable_flags = (ctx.accounts.global_config.disable_flags &');assert b==a[:start]+new+a[end:]
 assert(W/'recovery.patch').read_text()==''.join(difflib.unified_diff(a.splitlines(True),b.splitlines(True),fromfile='a/programs/pump-amm/src/lib.rs',tofile='b/programs/pump-amm/src/lib.rs'))
 for old in range(256):
  for bits in range(32):
   seq=old
   for i in range(5):seq=(seq&~(1<<i))|(bits&(1<<i))
   assert seq==(old&224)|bits
 return{'passed':True,'manifest_sha256':sha(W/'manifest.json'),'patch_sha256':sha(W/'recovery.patch'),'original_writes':5,'current_writes':1,'object_baseline_writes':1,'object_direct_writes':5,'value_domain_checks':8192,'object_full_body_calibration':False,'compiled_patch':False,'scope':'Source-backed field-write pattern control only; no linked improvement or runtime claim.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--symbols',type=Path);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.symbols),indent=2))
