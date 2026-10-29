"""Portable independent V2 AccountInfo ownership and saved-case review. No VM/build."""
from pathlib import Path
import difflib,hashlib,importlib.util,json,sys,tarfile,tomllib
sys.dont_write_bytecode=True
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
J=lambda p:json.loads(Path(p).read_bytes())
def module(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def verify(root=None):
 w=Path(root or Path(__file__).parent);sys.path.insert(0,str(w));manifest=J(w/'manifest.json')['files'];assert manifest=={str(p.relative_to(w)):H(p)for p in w.rglob('*')if p.is_file()and p.name!='manifest.json'and '__pycache__'not in p.parts}
 from elf_reader import Elf
 o,c,s,b,bs=map(Elf,[w/'original.so',w/'candidate.so',w/'symbols.so',w/'baseline.so',w/'baseline-symbols.so']);assert H(w/'candidate.so')=='dbb5dcfd1a1487e22d61ae68d22a9b74087b78a868a08ab974c7bdbb127f1500'and H(w/'baseline.so')=='01a038ead3614b09af8d9431d3253be2db9efc142ac17ced923d12ab6afe2609'
 before=(w/'before.rs').read_text();after=(w/'after.rs').read_text();needle='transfer_fee::from_mint(a.quote_mint.as_ref().as_ref())?';assert before.count(needle)==3 and before.replace(needle,'transfer_fee::from_mint(&a.quote_mint.to_account_info())?')==after
 path='programs/pump-amm/src/instructions/swap/trade_v2.rs';patch=''.join(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile='a/'+path,tofile='b/'+path));assert patch==(w/'recovery.patch').read_text()and H(w/'recovery.patch')=='06b62c3f4a3d753c6199895a0baf4d22282259127f89d110ef85c0b2616d6d14'
 old,new=J(w/'baseline-build-record.json'),J(w/'build-record.json');norm=lambda x:{k.split('/source/',1)[1]if'/source/'in k else k:v for k,v in x['source_sha256'].items()};a,z=norm(old),norm(new);assert len(a)==len(z)==233 and set(a)==set(z)and[k for k in a if a[k]!=z[k]]==[path];assert a[path]==H(w/'before.rs')and z[path]==H(w/'after.rs')
 assert new['source_count']==233 and new['source_unchanged']and new['returncode']==0 and not new['priming']and new['comparison']['candidate_sha256']==H(w/'candidate.so')
 assert new['dependency_cache_before']==new['dependency_cache_after']==old['dependency_cache_after']and len(new['dependency_cache_after'])==765
 metric,rows=module('independent_measure',w/'measure.py').measured(o,c,s,b,bs);assert metric==J(w/'measurement.json')and rows==J(w/'measurement-full.json')['rows'];assert(metric['windows'],metric['normalized'],metric['raw'])==(785,660,159)and not any(metric[k]for k in['normalized_gains','normalized_losses','raw_gains','raw_losses'])
 own=module('independent_ownership',w/'check_ownership.py').verify();assert own==J(w/'ownership.json')
 typed=module('typed_source',w/'source_fields.py');f=next(f for f in s.funcs if'9from_mint17'in f['name']);n=1312;start=0x74128;assert f['size']==n and o.pattern(start,n)==c.pattern(f['start'],n)
 diffs=[p for p in range(0,n,8)if o.normalized[start+p:start+p+8]!=c.normalized[f['start']+p:f['start']+p+8]];assert diffs==[1032]
 of,cf=typed.source_fields(o,start,n),typed.source_fields(c,f['start'],n);assert len(of)==len(cf)==1 and of[0]['filename']==cf[0]['filename']=='programs/pump-amm/src/utils/transfer_fee.rs'and(of[0]['line'],cf[0]['line'])==(32,13);assert of[0]['line_store']-start==cf[0]['line_store']-f['start']==1032
 lock=tomllib.loads((w/'Cargo.lock').read_text());pkgs={p['name']:p for p in lock['package']if p['name']in['anchor-lang','solana-account-info']}
 for name,version in [('anchor-lang','0.31.1'),('solana-account-info','2.3.0')]:assert pkgs[name]['version']==version and H(w/'provider'/f'{name}-{version}.crate')==pkgs[name]['checksum']
 with tarfile.open(w/'provider/anchor-lang-0.31.1.crate')as t:
  lib=t.extractfile('anchor-lang-0.31.1/src/lib.rs').read().decode();interface=t.extractfile('anchor-lang-0.31.1/src/accounts/interface_account.rs').read().decode();assert 'self.as_ref().clone()'in lib and 'self.account.as_ref()'in interface
 with tarfile.open(w/'provider/solana-account-info-2.3.0.crate')as t:
  source=t.extractfile('solana-account-info-2.3.0/src/lib.rs').read().decode();assert '#[repr(C)]'in source and 'pub lamports: Rc<RefCell<&\'a mut u64>>'in source and 'pub data: Rc<RefCell<&\'a mut [u8]>>'in source
 saved=module('independent_saved',w/'verify_saved.py').verify();assert saved==J(w/'saved-review.json')
 return {'passed':True,'candidate_sha256':H(w/'candidate.so'),'normalized_windows':660,'raw_windows':159,'gains':0,'losses':0,'source_inputs':233,'dependency_artifacts':765,'restored_original_clone_sites':3,'clone_bytes':264,'decoder_bytes':1312,'decoder_original_delta':'Source line32/current13 only','handler_bytes':{r['mode']:r['current_bytes']for r in own['rows']},'trade_cases':870,'mint_cases':174,'signature_fields':2088,'mint_each_mode':{'success':12,'from_mint_6007':16,'later_fee_6023':2,'other_error':28},'whole_handler_identity':False,'broad_compute_or_runtime_equivalence':False,'compiler_or_vm_executed':False,'manifest_sha256':H(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
