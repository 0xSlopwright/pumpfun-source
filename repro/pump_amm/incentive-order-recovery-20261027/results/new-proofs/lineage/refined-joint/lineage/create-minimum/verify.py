from pathlib import Path
import argparse,difflib,hashlib,json,struct,types
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def inv(p):return{str(f.relative_to(p)):sha(f)for f in p.rglob('*')if f.is_file()}
def module(p):
 m=types.ModuleType('proof');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m
def verify(directory):
 P=Path(directory);assert json.loads((P/'manifest.json').read_bytes())['files']=={k:v for k,v in inv(P).items()if k!='manifest.json'}
 assert sha(P/'checked-minimum.patch')=='03b32d55b30e9fe8de8d8def48bfa67e1e018f0649a9930a2adf421f3a0ac7bd'
 A,B=P/'source-base',P/'source-checked-minimum';changed=[n for n in inv(A)if inv(A)[n]!=inv(B)[n]];assert changed==['programs/pump-amm/src/instructions/create_pool.rs']
 n=changed[0];a,b=(A/n).read_text(),(B/n).read_text();assert ''.join(difflib.unified_diff(a.splitlines(True),b.splitlines(True),fromfile='a/'+n,tofile='b/'+n))==(P/'checked-minimum.patch').read_text()
 assert b.index('a.pool.set_inner')<b.index('let output = liquidity.checked_sub(100)')<b.index('crate::utils::token::mint_to_pool')
 record=json.loads((P/'baseline/build-comparison.json').read_bytes());prefix=next(k[:-len('programs/pump-amm/Cargo.toml')]for k in record['source_sha256']if k.endswith('programs/pump-amm/Cargo.toml'));assert inv(A)=={k[len(prefix):]:h for k,h in record['source_sha256'].items()if k.startswith(prefix)}
 assert sha(P/'baseline/pump_amm_recovered.so')==record['comparison']['candidate_sha256']=='4e6a5617a7a8c3474ed7662f0188df4b1824c08253ebfb08212351ca5249da12'
 assert sha(P/'baseline/unstripped.so')==record['unstripped_sha256']
 reader=module(P/'elf_reader.py');O=reader.Elf(P/'input-root/evidence/original/pump_amm/deployed.so');C=reader.Elf(P/'baseline/unstripped.so');sections=module(P/'object_reader.py').sections
 base,new=sections(P/'base.o'),sections(P/'checked-minimum.o');a=next(x for x in base if'instructions11create_pool7execute17h'in x['name']);z=next(x for x in new if'instructions11create_pool7execute17h'in x['name']);f=next(x for x in C.funcs if'instructions11create_pool7execute17h'in x['name']);assert a['size']==f['size']==10328 and a['code']==C.normalized[f['start']:f['start']+f['size']]
 wanted=sorted([(x['offset'],1 if x['type']==8 else x['type'])for x in C.pattern(f['start'],f['size'])]+[(x['offset'],10)for x in C.callsites(f['start'],f['size'])]);assert wanted==sorted((x['offset'],x['type'])for x in a['relocations'])
 err=next(x for x in new if'instructions11create_pool7execute28_'in x['name']and x['size']==520);old=O.normalized[0x2e260:0x2e468];different=[i for i in range(0,520,8)if old[i:i+8]!=err['code'][i:i+8]];assert different==[416]
 assert struct.unpack_from('<BBhi',old,416)==(0x62,0x0a,-248,290)
 line=next(i for i,line in enumerate(b.splitlines(),1)if'.ok_or_else(|| error!(PumpAmmError::TooLittlePoolTokenLiquidity))'in line);assert struct.unpack_from('<BBhi',err['code'],416)==(0x62,0x0a,-248,line)
 assert O.b[0x2d8f0:0x2d8f8]==bytes.fromhex('2500060063000000')and O.calls[0x2d908]==0x2e260 and O.calls[0x2d990]==0x73118
 assert (P/'original-create.window.bin').read_bytes()==O.b[0x2ba60:0x2e260]and(P/'original-minimum-error.window.bin').read_bytes()==O.b[0x2e260:0x2e468]
 calls=[x for x in z['relocations']if x['type']==10];call=next(x for x in calls if x['symbol']==err['name'].removeprefix('.text.'));mint=next(x for x in calls if'12mint_to_pool'in x['symbol']);assert call['offset']==7728<mint['offset']==7856 and z['size']==10136
 kit=P/'kit';assert json.loads((kit/'manifest.json').read_bytes())['files']=={k:v for k,v in inv(kit).items()if k!='manifest.json'}
 baseline=module(kit/'verify_minimum.py').verify(P/'baseline20',P/'baseline/pump_amm_recovered.so',P/'input-root',kit/'probe_minimum.py',kit/'observer.py')
 assert baseline['cases']==20 and baseline['signatures']==40 and baseline['success_cases']==6
 return{'passed':True,'manifest_sha256':sha(P/'manifest.json'),'patch_sha256':sha(P/'checked-minimum.patch'),'base_full_body_calibration':True,'base_bytes':10328,'changed_bytes':10136,'original_bytes':10240,'error_closure_bytes':520,'only_error_closure_difference':'authentic source line290 to'+str(line),'baseline':baseline,'full_candidate_runtime_executed':False,'scope':'Source and calibrated object qualification; original pool-store/minimum order. Full linked build, complete body identity and changed-candidate runtime remain separate gates.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);a=p.parse_args();print(json.dumps(verify(a.directory),indent=2))
