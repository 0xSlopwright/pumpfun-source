from pathlib import Path
import collections,difflib,gzip,hashlib,importlib.util,json,struct,sys,tarfile,tomllib
sys.dont_write_bytecode=True
H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def J(p):
 p=Path(p)
 if not p.exists():p=p.with_suffix(p.suffix+'.gz')
 b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(name,p):
 sp=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m);return m
def verify(root=None):
 w=Path(root or Path(__file__).parent);sys.path.insert(0,str(w));inventory=J(w/'manifest.json')['files'];assert inventory=={str(p.relative_to(w)):H(p)for p in w.rglob('*')if p.is_file()and p!=w/'manifest.json'}
 for n,row in J(w/'compression-map.json').items():assert H(w/n)==row['stored_sha256']and hashlib.sha256(gzip.decompress((w/n).read_bytes())).hexdigest()==row['uncompressed_sha256']
 C=w/'build/artifacts/pump_amm_recovered.so';S=w/'build/artifacts/unstripped.so';assert H(C)=='dbb5dcfd1a1487e22d61ae68d22a9b74087b78a868a08ab974c7bdbb127f1500';assert H(S)=='5a88488575f04a7a6078fd2188a94be7f4664e228a7c482b26aec1f2d6fe784c'
 before=w/'baseline-source';after=w/'source';bi={str(p.relative_to(before)):H(p)for p in before.rglob('*')if p.is_file()};ai={str(p.relative_to(after)):H(p)for p in after.rglob('*')if p.is_file()};changed=[k for k in ai if ai[k]!=bi[k]];assert set(ai)==set(bi)and len(ai)==58 and changed==['programs/pump-amm/src/instructions/swap/trade_v2.rs']
 b=(w/'before.rs').read_text();a=(w/'after.rs').read_text();assert b==(before/changed[0]).read_text()and a==(after/changed[0]).read_text();assert b.count('from_mint(a.quote_mint.as_ref().as_ref())?')==3 and b.replace('from_mint(a.quote_mint.as_ref().as_ref())?','from_mint(&a.quote_mint.to_account_info())?')==a
 assert ''.join(difflib.unified_diff(b.splitlines(True),a.splitlines(True),fromfile='a/'+changed[0],tofile='b/'+changed[0]))==(w/'recovery.patch').read_text()
 r=J(w/'build/build-comparison.json');base=J(w/'baseline-build.json');assert r['source_count']==233 and r['source_unchanged']and r['returncode']==0 and not r['priming']and r['dependency_cache_before']==r['dependency_cache_after']==base['dependency_cache_after']and len(r['dependency_cache_after'])==765
 assert r['adapter_sha256']==base['adapter_sha256']==H(w/'build_entrypoint.py')
 for k in ['tool_sha256','target_rlib_sha256','environment','strip_tool_sha256']:assert r[k]==base[k]
 dep=module('v2baseline_deps',w/'baseline-dependency-proof/verify.py').verify(w/'baseline-canonical',w/'baseline-build.json',w/'baseline-dependency-proof')
 bound=module('v2current_source',w/'verify_source_binding.py').verify(w/'canonical-source',w/'source',w/'build/build-comparison.json',C,S,w/'baseline-dependency-proof');assert bound['total_compiled_inputs_verified']==233
 from elf_reader import Elf
 o,c,s,be,bs=map(Elf,[w/'original.so',C,S,w/'candidate.so',w/'symbols.so']);assert H(o.path)=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'and H(be.path)==base['comparison']['candidate_sha256']
 metric,rows=module('v2measure',w/'measure.py').measured(o,c,s,be,bs);assert metric==J(w/'measurement.json')and rows==J(w/'measurement-full.json')['rows'];assert(metric['normalized'],metric['raw'])==(660,159)and not any(metric[k]for k in['normalized_gains','normalized_losses','raw_gains','raw_losses'])
 wrappers=module('v2wrappers',w/'wrapper_census.py').census(o.path,C,S);assert wrappers['normalized_and_relocation_matches']==38
 own=module('v2ownership',w/'ownership_audit.py').RESULT;assert own==J(w/'ownership-review.json')
 ins=lambda e,p:struct.unpack_from('<BBhi',e.b,p)
 for row in J(w/'calls.json'):
  orig=row['original'];start=orig['start'];cl=start+orig['clone']['offset'];fm=start+orig['from_mint']['offset'];assert o.calls[cl]==0xe178 and o.calls[fm]==0x74128 and fm-cl==32
  assert ins(o,cl-40)==(0x79,0x71,32,0)and ins(o,cl-32)==(0x79,0x12,88,0)and ins(o,cl-24)==(0xbf,0xa8,0,0)and ins(o,cl-8)==(0xbf,0x81,0,0)and ins(o,cl+24)==(0xbf,0x82,0,0)
  slot=ins(o,cl-16)[3];loads={ins(o,p)[2]for p in range(fm,fm+384,8)if ins(o,p)[0]==0x79 and ins(o,p)[1]>>4==10 and ins(o,p)[2]in[slot+8,slot+16]};assert loads=={slot+8,slot+16}
 lock=tomllib.loads((w/'source/Cargo.lock').read_text());pkg=next(v for v in lock['package']if v['name']=='anchor-lang'and v['version']=='0.31.1');archive=w/'provider/anchor-lang-0.31.1.crate';assert H(archive)==pkg['checksum']
 with tarfile.open(archive)as t:
  for n in ['lib.rs','accounts/interface_account.rs']:assert t.extractfile('anchor-lang-0.31.1/src/'+n).read()==(w/'provider'/n).read_bytes()
 assert 'self.as_ref().clone()'in(w/'provider/lib.rs').read_text()and 'self.account.as_ref()'in(w/'provider/accounts/interface_account.rs').read_text()
 trade=module('v2trade',w/'verify_trade.py').verify(w);mints=module('v2mints',w/'verify_mints.py').verify(w);assert trade==J(w/'trade-verification.json')and mints==J(w/'mints-verification.json')
 report=J(w/'v2-mints.json');counts={}
 for name in ['buy_v2','buy_exact_quote_in_v2','sell_v2']:
  cases=[x for x in report['cases']if x['instruction']==name];good=sum(x['original']['error']is None for x in cases);local=sum(any('utils/transfer_fee.rs'in s and 'Error Number: 6007.'in s for s in x['original']['logs'])for x in cases);assert len(cases)==58 and good==12 and local==16;later=sum(any('utils/transfer_fee.rs'in v and 'Error Number: 6023.'in v for v in x['original']['logs'])for x in cases);assert later==2;counts[name]={'cases':58,'successes':good,'from_mint_6007_errors':local,'later_transfer_fee_6023_errors':later}
 assert all(v['returncode']==0 for v in J(w/'gates.json'))
 return {'passed':True,'candidate_sha256':H(C),'source_inputs':233,'cache_artifacts':765,'normalized_windows':660,'raw_windows':159,'wrappers':38,'handler_bytes':{x['name']:x['new_function']['size']for x in own['rows']},'restored_clone_decode_pairs':3,'unchanged_decoder_bytes':1312,'trade_cases':870,'mint_cases':174,'signatures':2088,'mint_by_mode':counts,'strict_repeat_performed':False,'full_core_performed':False,'whole_handler_equality':False,'manifest_sha256':H(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
