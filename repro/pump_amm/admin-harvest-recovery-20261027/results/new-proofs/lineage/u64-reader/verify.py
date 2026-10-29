"""Verify independent saved reader-semantics review; no compiler or VM execution."""
from pathlib import Path
import argparse,ast,base64,collections,gzip,hashlib,json,struct,types
from solders.transaction import Transaction
HERE=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def model(tail,mode):
 pos=0
 def boolean():
  nonlocal pos
  if pos==len(tail):return False
  v=tail[pos];pos+=1
  if v>1:raise ValueError(v)
  return bool(v)
 try:
  cash=boolean();available=len(tail)-pos
  if available>=8:fee=int.from_bytes(tail[pos:pos+8],'little');pos+=8
  elif mode=='slice_exact':fee=0
  else:fee=int.from_bytes(tail[pos:].ljust(8,b'\0'),'little');pos=len(tail)
  edit=boolean();holder=boolean();return {'fee':fee,'can_edit':edit,'holder':holder,'cashback':cash,'remaining_hex':tail[pos:].hex(),'expected_error':6028 if fee or edit else None}
 except ValueError as e:return {'invalid_bool':e.args[0],'expected_error':102}
def verify(directory=HERE):
 d=Path(directory);m=load(d/'manifest.json');assert {str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'}==m['files'];p=load(d/'provenance.json');assert sha(d/'negative-manifest.json')==p['negative_manifest_sha256']
 for n,ref in p['files'].items():assert sha(d/'sources'/n)==ref['sha256']
 assert p['sdk_archive_sha256']=='6719b889d60677a8a2fcf4c82f68441a1afe0ab093edd2efe9f84a67a808b3e9'and p['rustc_sha256']=='c8807b7ebede8578ac5a257ea333780f9d89bd356064fd8184af7e996cb71a97';assert p['borsh_metadata']['features']==['default','std']
 r=load(d/'report.json.gz');t=load(d/'transactions.json.gz');n=load(d/'negative-manifest.json');assert hashlib.sha256(gzip.decompress((d/'report.json.gz').read_bytes())).hexdigest()==n['files']['report.json'];assert sha(d/'transactions.json.gz')==n['files']['transactions.json.gz'];assert r['original_sha256']==p['original_sha256']and r['candidate_sha256']==p['baseline_sha256'];assert r['producer_sha256']==t['script_sha256']==sha(d/'producer.py')
 clean=types.ModuleType('cleaner');clean.__file__=str(d/'cleaner.py');exec(compile((d/'cleaner.py').read_bytes(),clean.__file__,'exec'),clean.__dict__);tree=ast.parse((d/'producer.py').read_text());fn=next(x for x in tree.body if isinstance(x,ast.FunctionDef)and x.name=='cases');s={'struct':struct};exec(compile(ast.Module(body=[fn],type_ignores=[]),'<cases>','exec'),s);roster=s['cases']();assert len(roster)==len(r['cases'])==r['case_count']==264 and len(t['transactions'])==t['transaction_count']==528
 bad=[];signatures=0;model_rows=[];categories=collections.Counter()
 for i,c in enumerate(r['cases']):
  assert c['case']==roster[i];a,b=c['original'],c['candidate'];assert a['transaction_base64']==b['transaction_base64']and a['full_before']==b['full_before'];x,y=map(clean.clean,[a,b]);diff=[k for k in x if x[k]!=y.get(k)]
  if diff:bad.append(i);assert c['case']['bytes_available_to_u64']<8;categories[','.join(diff)]+=1
  tail=bytes.fromhex(c['case']['optional_hex']);ox=model(tail,'slice_exact');cy=model(tail,'loop');model_rows.append({'index':i,'original_parse':ox,'old_candidate_parse':cy,'mismatches':[]})
  for j,side in enumerate(['original','candidate']):
   v=c[side];expected=(ox if j==0 else cy)['expected_error'];assert(v['error']is None)if expected is None else(f'InstructionErrorCustom({expected})'in v['error']);receipt=t['transactions'][2*i+j];raw=base64.b64decode(receipt['transaction_base64']);tx=Transaction.from_bytes(raw);assert all(tx.verify_with_results())and len(tx.signatures)==receipt['signature_count']==1;signatures+=1;assert v['transaction_base64']==receipt['transaction_base64']and hashlib.sha256(raw).hexdigest()==receipt['transaction_sha256'];assert receipt['error']==v['error']and receipt['logs_sha256']==hashlib.sha256(json.dumps(v['logs'],separators=(',',':')).encode()).hexdigest();assert receipt['amm_program_sha256']==(r['original_sha256']if j==0 else r['candidate_sha256'])
   for key,state in v['states'].items():
    full=v['full_after'][key];assert (state is None and full is None)or(state['data']==full['data_hex']and state['lamports']==full['lamports']and state['owner']==full['owner'])
 assert signatures==t['signature_count']==528 and len(bad)==123 and bad==r['mismatches'];saved=load(d/'all-fields-review.json');assert saved['all_field_normalized_mismatches']==123 and saved['extra_log_only']==[]and dict(categories)==saved['field_combinations'];models=load(d/'model-review.json');assert models['rows']==model_rows and models['model_mismatches']==0 and models['differences_predicted']==123
 wrapper=load(d/'original-wrapper.json');b=bytes.fromhex(wrapper['raw_bytes']);assert hashlib.sha256(b).hexdigest()==wrapper['sha256']and wrapper['start']==0xe31a0
 assert struct.unpack_from('<BBhi',b,0x438)==(0xb7,2,0,0)and struct.unpack_from('<BBhi',b,0x440)==(0xa5,1,7,9);assert 0x440+8+7*8==0x480;assert struct.unpack_from('<BBhi',b,0x458)==(0x79,0x92,0x34,0);assert struct.unpack_from('<BBhi',b,0x460)==(0x7b,0x1a,-0x218,0)and struct.unpack_from('<BBhi',b,0x478)==(0x7b,0x1a,-0x220,0)
 assert wrapper['bool_helper']['size']==344 and wrapper['bool_helper']['relocation_pattern_equal']and hashlib.sha256(bytes.fromhex(wrapper['bool_helper']['normalized_bytes'])).hexdigest()==wrapper['bool_helper']['candidate_normalized_sha256']
 return {'verified':True,'patch_sha256':sha(d/'reviewed.patch'),'saved_cases':264,'signatures':528,'full_field_discrepancies':123,'model_discrepancies':0,'slice_nonconsumption_under_8_supported':True,'generic_Read_behavior_proved':False,'executes_runtime':False}
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('directory',type=Path,nargs='?',default=HERE);x=a.parse_args();print(json.dumps(verify(x.directory),indent=2))
