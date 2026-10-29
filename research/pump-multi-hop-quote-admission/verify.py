"""Verify sealed partial reconstruction evidence; this neither builds nor executes a VM."""
from pathlib import Path
import ast,base64,difflib,gzip,hashlib,importlib.util,io,json,re,struct,sys,tarfile
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parent;R=P.parents[1];L=R/'research/pump-v3-buy-cost-overflow'
ORIGINAL='7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
CU=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
sha=lambda b:hashlib.sha256(b).hexdigest()
def require(ok,why):
 if not ok:raise ValueError(why)
def read(p):
 b=Path(p).read_bytes();return gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b
def doc(p):return json.loads(read(p))
def load(p):
 spec=importlib.util.spec_from_file_location(p.stem,p);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m

def check_focused(report):
 from solders.transaction import Transaction
 dependencies=doc(P/'dependencies.json')
 for value in dependencies.values():require(sha((R/value['path']).read_bytes())==value['sha256'],'captured dependency bytes differ')
 expected={'tokenkeg_sell_control':None,'tokenkeg_buy_control':None,'truncated_fee_config':6063,'short_tlv_header':2006,'no_extension_wrong_address':'InvalidAccountData','valid_zero_fee_wrong_address':2006,'valid_fee_wrong_address':2006,'native_quote_address_control':2006,'valid_fee_quote_owner_control':6010,'truncated_fee_before_quote_owner':6063,'token2022_zero_fee_sell':None,'token2022_capped_fee_sell':None,'token2022_capped_fee_buy':None}
 require(len(report['cases'])==13 and {x['case']['name']for x in report['cases']}==set(expected),'focused corpus incomplete')
 for row in report['cases']:
  runs,obs=row['runs'],row['observations'];name=row['case']['name'];require(set(runs)==set(obs)=={'original','parent','proposal'},'triple missing')
  require(len({x['transaction_base64']for x in runs.values()})==1,'transaction input differs')
  require(obs['original']['before']==obs['parent']['before']==obs['proposal']['before'],'before account observations differ')
  for label,run in runs.items():
   programs={pid:value['sha256']for pid,value in dependencies.items()};programs['6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P']=report['images_sha256'][label]
   require(run['program_sha256']==programs,'declared dependency image differs')
   actual=obs[label]['program_loads'];require(len(actual)==6 and {x['program']:x['sha256']for x in actual}==programs,'actual dependency load differs')
   raw=base64.b64decode(run['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);require(bytes(tx)==raw and all(tx.verify_with_results())and len(tx.signatures)==1,'invalid outer signature')
   require(obs[label]['transaction_base64']==run['transaction_base64']and obs[label]['signatures_verified'],'transaction observation binding')
   require(obs[label]['metadata']['logs']==run['logs']and obs[label]['metadata'].get('return_data')==run['return_data'],'raw metadata binding')
   loads=obs[label]['loads'];require(len(loads)==1 and loads[0]['elf_sha256']==report['images_sha256'][label]and loads[0]['elf_prefix_unchanged']and loads[0]['zero_allocation_tail'],'actual captured loader binding')
  for key in ['error','events','inner','return_data','before','after','transaction_base64','pump_calls','token_calls']:
   require(runs['original'][key]==runs['proposal'][key],name+': '+key+' differs')
  logs=lambda k:[s for s in runs[k]['logs']if not CU.fullmatch(s)]
  require(logs('original')==logs('proposal'),name+': ordered diagnostic differs')
  want=expected[name];error=runs['original']['error']
  actual=re.search(r'InstructionErrorCustom\((\d+)\)',str(error))
  require(error is None if want is None else ('Fieldless(InvalidAccountData)'in str(error)if isinstance(want,str)else actual is not None and int(actual.group(1))==want),name+': original outcome changed')
  if want==6063:
   require(any('programs/pump/src/util/transfer_fee.rs:31.'in s for s in runs['original']['logs']),'fee decoder Source31 not reached')
   require(('2006'in str(runs['parent']['error']))if name=='truncated_fee_config'else('6010'in str(runs['parent']['error'])),'parent priority counterexample absent')
  if name in ['short_tlv_header','valid_zero_fee_wrong_address','valid_fee_wrong_address']:
   require(any('programs/pump/src/buy_v2.rs:55.'in s for s in runs['original']['logs']),'shared admission Source55 not reached')
  if name=='valid_fee_quote_owner_control':require(any('programs/pump/src/buy_v2.rs:81.'in s for s in runs['original']['logs']),'shared admission Source81 not reached')
  if name=='native_quote_address_control':require(any('multi_hop_curve_swap.rs:369.'in s for s in runs['original']['logs']),'native quote address guard absent')
  if row['case'].get('token2022_flow'):
   amounts=[]
   for account in runs['original']['after'].values():
    if account and account['owner']=='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':
     b=bytes.fromhex(account['data_hex'])
     if len(b)==178:amounts.append(struct.unpack_from('<Q',b,170)[0])
   require(sorted(amounts)==([0,100]if row['case'].get('bps')else[0,0]),'actual Token-2022 withheld amount differs')
 return 39

def signature_audit(values):
 from solders.transaction import Transaction,VersionedTransaction
 cache={};fields=signatures=0
 def walk(value):
  nonlocal fields,signatures
  if isinstance(value,dict):
   for name,item in value.items():
    if name=='transaction_base64'and isinstance(item,str):
     raw=base64.b64decode(item,validate=True);h=sha(raw)
     if h not in cache:
      try:t=Transaction.from_bytes(raw)
      except ValueError:t=VersionedTransaction.from_bytes(raw)
      checks=t.verify_with_results();require(bytes(t)==raw and checks and all(checks),'invalid corpus signature');cache[h]=len(t.signatures)
     fields+=1;signatures+=cache[h]
    else:walk(item)
  elif isinstance(value,list):
   for item in value:walk(item)
 for value in values:walk(value)
 require((fields,signatures)==(18595,28127),'serialized corpus signature-field counts differ')
 return signatures

def verify(packet=P):
 require(__debug__,'Run without -O')
 seal=doc(packet/'MANIFEST.json');files={p.relative_to(packet).as_posix():p for p in packet.rglob('*')if p.is_file()}
 require(set(files)==set(seal)|{'MANIFEST.json'},'packet file inventory differs')
 require(all(not files[n].is_symlink()and sha(files[n].read_bytes())==h for n,h in seal.items()),'packet file hash differs')
 for n,h in doc(packet/'parent-tools-sha256.json').items():require(sha((L/n).read_bytes())==h,'frozen common tool differs: '+n)
 base=load(L/'verify.py');require(sha((R/'evidence/original/pump/deployed.so').read_bytes())==ORIGINAL,'original image differs')
 primary=doc(packet/'sources/primary-sha256.json')
 with tarfile.open(fileobj=io.BytesIO(read(packet/'sources/primary.tar.gz')))as archive:
  ms=archive.getmembers();require(len(ms)==65 and all(m.isfile()and not Path(m.name).is_absolute()and '..'not in Path(m.name).parts for m in ms),'source archive shape')
  source={m.name:archive.extractfile(m).read()for m in ms}
 require({n:sha(b)for n,b in source.items()}==primary,'source archive hashes')
 old=read(packet/'sources/parent-multi_hop_curve_swap.rs.gz');name='src/multi_hop_curve_swap.rs';require(len(old.splitlines())==len(source[name].splitlines())==931,'physical Source layout changed')
 patch=''.join(difflib.unified_diff(old.decode().splitlines(True),source[name].decode().splitlines(True),fromfile='a/'+name,tofile='b/'+name));require(patch==(packet/'source.patch').read_text(),'patch is not compiled source')
 staged={'programs/pump/'+n:b for n,b in source.items()};cargo=source['Cargo.toml'].decode();a,b=cargo.index('[profile.release]'),cargo.index('[workspace]')
 staged['programs/pump/Cargo.toml']=(cargo[:a].rstrip()+'\n').encode();staged['Cargo.toml']=('[workspace]\nmembers = ["programs/pump"]\nresolver = "2"\n\n'+cargo[a:b].strip()+'\n').encode();staged['Cargo.lock']=staged.pop('programs/pump/Cargo.lock');staged_pins={n:sha(b)for n,b in staged.items()}
 artifacts={}
 for label in ['parent','proposal','repeat']:
  result=doc(packet/f'builds/{label}-result.json.gz');launch=doc(packet/f'builds/{label}-launch.json.gz');base.check_toolchain(result,L)
  require(all(result[k]==v for k,v in launch.items())and result['exit_code']==0 and result['source_unchanged']and result['root_invocations']==1 and result['original_binary_build_input']is False,'actual successful source build required')
  log=read(packet/f'builds/{label}-build.log.gz');require(sha(log)==result['log_sha256']and log.count(b'--crate-name pump_recovered ')==1,'fresh root compiler command missing')
  expected=dict(primary);expected[name]=sha(old)if label=='parent'else primary[name];base.logical(result['primary_source_sha256'],expected)
  if label!='parent':base.logical(result['source_sha256'],staged_pins)
  artifacts[label]={}
  for filename,key in [('candidate.so','candidate_sha256'),('unstripped.so','unstripped_sha256')]:
   value=sha(read(packet/f'artifacts/{label}-{filename}.gz'));require(value==result[key],'ELF output hash differs');artifacts[label][filename]=value
 require(artifacts['parent']=={'candidate.so':'1d031f64b9656ba572817c20a46e0bcb3d43716fee4c857d9b59447724a28904','unstripped.so':'c1ae752d631721c468191a8f49df9fbbde292a0e36a914e2788c89a11ac8bf73'},'canonical parent not reproduced')
 require(artifacts['proposal']==artifacts['repeat'],'repeat ELF outputs differ')
 rebuilt=doc(packet/'builds/rebuild-build-comparison.json.gz');base.check_toolchain(rebuilt,L,repository_builder=True)
 require(rebuilt['returncode']==0 and rebuilt['source_unchanged']and rebuilt['comparison']['candidate_sha256']==artifacts['proposal']['candidate.so']and rebuilt['unstripped_sha256']==artifacts['proposal']['unstripped.so'],'archived-source replay differs')
 for field,expected in [('primary_source_sha256',primary),('source_sha256',staged_pins),('source_after_sha256',staged_pins)]:base.logical(rebuilt[field],expected)
 log=read(packet/'builds/rebuild-build.log.gz');require(sha(log)==rebuilt['build_log_sha256']and log.count(b'Compiling pump-recovered v0.1.0 ')==1,'rebuild compiler status differs')
 analysis=load(packet/'analyze.py').analyze(packet);require(json.loads(json.dumps(analysis))==doc(packet/'comparison.json.gz'),'full census/callee audit differs')
 focused=doc(packet/'runtime/focused.json.gz');require(focused['images_sha256']==dict(original=ORIGINAL,parent=artifacts['parent']['candidate.so'],proposal=artifacts['proposal']['candidate.so']),'focused image binding')
 require(focused['producer_sha256']==sha((packet/'tools/focused.py').read_bytes())and focused['fixture_sha256']==sha((packet/'runtime/inputs/pump_tokenkeg_two_curve_differential.py').read_bytes()),'focused producer/fixture binding');check_focused(focused)
 full=doc(packet/'runtime/full44.json.gz');ext=doc(packet/'runtime/extensions.json.gz')
 require(full['candidate_sha256']==ext['candidate_sha256']==artifacts['proposal']['candidate.so']and full['original_sha256']==ext['original_sha256']==ORIGINAL,'corpus binary bindings')
 require(full['case_count']==10468 and len(full['suites'])==44 and not full['mismatches']and full['loader_profile']=='captured-upgradeable','full corpus incomplete')
 base.logical(full['compiled_source_sha256'],staged_pins)
 binding=doc(packet/'builds/runtime-build-comparison.json.gz');require(binding['returncode']==0 and binding['source_unchanged']and binding['comparison']['candidate_sha256']==artifacts['proposal']['candidate.so'],'runtime/build view differs');base.logical(binding['source_sha256'],staged_pins);base.logical(binding['source_after_sha256'],staged_pins)
 semantic=['error','accounts','account','before','after','before_accounts','after_accounts','data_hex','lamports','payer_lamports','authority_lamports','user_lamports','creator','events','event_payloads','inner','inner_instructions','return','returns','return_data']
 count=0
 for name,suite in full['suites'].items():
  cases=suite.get('cases');cases=suite['results']if not isinstance(cases,list)else cases;require(len(cases)==suite['case_count'],'suite length differs');count+=len(cases)
  for c in cases:
   require(all(not c.get(k)for k in ['different_fields','differences','diff','mismatches','mismatched_fields'])and c.get('match',c.get('matches',True))is True,'saved case mismatch')
   for k in semantic:
    if k in c['original']or k in c['candidate']:require(c['original'].get(k)==c['candidate'].get(k),'semantic mismatch '+name+'/'+k)
  loads=doc(packet/f'runtime/loaders/{name}.loader.json.gz')['loads'];require({x['elf_sha256']for x in loads}=={ORIGINAL,artifacts['proposal']['candidate.so']},'corpus actual loader image differs');require(all(x['elf_prefix_unchanged']and x['zero_allocation_tail']and x['program_bytes']==36 and x['programdata_bytes']==10485760 for x in loads),'captured loader layout differs')
 require(count==10468,'case total differs');audit=load(L/'tools/pump_diagnostic_audit.py').audit(full['suites']);require(audit==full['diagnostics']and audit['log_bearing_cases']==10464 and not audit['mismatches'],'broad diagnostic audit differs')
 require(ext['case_count']==len(ext['cases'])==126 and not ext['mismatches'],'extension corpus incomplete')
 require(all(c['match']and all(c['original'][k]==c['candidate'][k]for k in ['error','accounts','inner_instructions','event_payloads','return_data'])for c in ext['cases']),'extension semantic mismatch')
 signature_audit([full,ext])
 rejected=doc(packet/'controls/native-omission.json.gz');bad=doc(packet/'controls/native-omission-result.json.gz');base.check_toolchain(bad,L)
 require(bad['exit_code']==0 and bad['source_unchanged']and bad['root_invocations']==1,'rejected image was not freshly built')
 bad_primary=dict(primary);bad_primary['src/multi_hop_curve_swap.rs']=sha(read(packet/'controls/native-omission-source.rs.gz'));base.logical(bad['primary_source_sha256'],bad_primary)
 require(rejected['producer_sha256']==sha((packet/'tools/focused.py').read_bytes())and len(rejected['cases'])==13,'rejected replay producer/corpus differs')
 for filename,key in [('candidate.so','candidate_sha256'),('unstripped.so','unstripped_sha256')]:require(sha(read(packet/('controls/native-omission-'+filename+'.gz')))==bad[key],'rejected ELF output differs')
 require(rejected['images_sha256']['proposal']==bad['candidate_sha256'],'rejected image binding differs')
 try:check_focused(rejected)
 except ValueError:pass
 else:raise ValueError('native omission was not rejected')
 failed=[c for c in rejected['cases']if c['proposal_differences']or not c['proposal_log_equal']];require([c['case']['name']for c in failed]==['native_quote_address_control'],'rejected control attribution differs')
 return dict(verified=True,partial_recovery=True,whole_function_equal=False,normalized=1019,raw=188,focused_triples=13,corpus_pairs=10468,extension_pairs=126,corpus_signature_fields=28127)
if __name__=='__main__':print(json.dumps(verify(),sort_keys=True))
