#!/usr/bin/env python3
"""Verify the narrow source change, ELF census, real signatures, and saved runtime."""
from pathlib import Path
import argparse,base64,csv,ctypes,ctypes.util,gzip,hashlib,io,json,struct,sys,tarfile,tempfile
from types import SimpleNamespace
if not __debug__:raise SystemExit('Optimized Python is unsupported: assertions are verification checks.')
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE/'tools'))
from pump_compare_function_bytes import body,normalize
from pump_quote_control_function_match import sections
PUMP='6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
def sha(b):return hashlib.sha256(b).hexdigest()
def read(path):return gzip.decompress((HERE/path).read_bytes())
def functions(blob):
 shoff=struct.unpack_from('<Q',blob,0x28)[0];esz,count,ni=struct.unpack_from('<HHH',blob,0x3a);hs=[struct.unpack_from('<IIQQQQIIQQ',blob,shoff+i*esz)for i in range(count)]
 def string(table,off):
  start=table[4]+off;return blob[start:blob.index(b'\0',start)].decode()
 text=next(i for i,h in enumerate(hs)if string(hs[ni],h[0])=='.text')
 for h in hs:
  if h[1]!=2:continue
  for k in range(h[5]//24):
   nm,info,_,sec,addr,size=struct.unpack_from('<IBBHQQ',blob,h[4]+24*k)
   if info&15==2 and sec==text and size:yield addr,size,string(hs[h[6]],nm)
def census(original,candidate):
 os=sections(original);cs=sections(candidate);index={}
 for start,size,name in functions(candidate):
  raw=body(candidate,cs,start,size);norm,_=normalize(raw,start,cs);index.setdefault((size,sha(norm)),[]).append(sha(raw))
 result={}
 for start,size in json.loads((HERE/'windows.json').read_text()):
  raw=body(original,os,start,size);norm,_=normalize(raw,start,os);matches=index.get((size,sha(norm)),[]);result[start]=(bool(matches),sha(raw)in matches)
 assert len(result)==1035
 return result

def verify_artifacts():
 manifest=json.loads((HERE/'MANIFEST.json').read_text())
 assert {str(p.relative_to(HERE))for p in HERE.rglob('*')if p.is_file()}==set(manifest['files'])|{'MANIFEST.json'}
 for name,digest in manifest['files'].items():assert sha((HERE/name).read_bytes())==digest,name
 original=read('runtime/images/pump-original.so.gz');assert sha(original)==manifest['original_pump_sha256']
 sources={};images={};inventories={};counts={}
 for label in ['control','fixed']:
  with tarfile.open(fileobj=io.BytesIO(read('builds/'+label+'/source.tar.gz')),mode='r:')as tar:sources[label]={m.name:tar.extractfile(m).read()for m in tar.getmembers()if m.isfile()}
  recorded=json.loads((HERE/'builds'/label/'source-sha256.json').read_text());assert {k:sha(v)for k,v in sources[label].items()}==recorded
  for kind in ['candidate','unstripped']:
   raw=read('builds/'+label+'/'+kind+'.so.gz');images[label+'-'+kind]=raw;assert sha(raw)==json.loads((HERE/'builds'/label/'elf-sha256.json').read_text())[kind+'.so']
  for section in ['.text','.rodata','.data.rel.ro']:
   one=sections(images[label+'-candidate']);two=sections(images[label+'-unstripped'])
   if section in one and section in two:
    a=one[section];b=two[section];assert a['addr']==b['addr'] and images[label+'-candidate'][a['offset']:a['offset']+a['size']]==images[label+'-unstripped'][b['offset']:b['offset']+b['size']]
  log=read('builds/'+label+'/build.log.gz').decode();assert 'Compiling pump-token-ext 'in log and 'Compiling pump-recovered 'in log
  inv=census(original,images[label+'-unstripped']);inventories[label]=inv
  counts[label]={'normalized':sum(v[0]for v in inv.values()),'raw':sum(v[1]for v in inv.values())};assert counts[label]=={'normalized':1019,'raw':183}
  saved=json.loads(read('builds/'+label+'/inventory.json.gz'));assert saved['candidate_sha256']==sha(images[label+'-unstripped'])
  assert {w['start']:(bool(w['normalized_matches']),w['raw_match'])for w in saved['windows']}==inv
 assert set(sources['control'])==set(sources['fixed'])
 changed=[k for k in sources['control']if sources['control'][k]!=sources['fixed'][k]];assert changed==['programs/pump/src/create_v2.rs']
 name=changed[0];before=sources['control'][name].decode();after=sources['fixed'][name].decode()
 import difflib
 actual=''.join(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile='a/'+name,tofile='b/'+name,n=2));assert actual==(HERE/'source.patch').read_text()
 assert 'require_gte!(remaining.len(),3usize,PumpError::NotEnoughRemainingAccounts);'in before.splitlines()[61]
 assert 'require_gte!(remaining.len(),3,PumpError::NotEnoughRemainingAccounts);'in after.splitlines()[61]
 assert inventories['control']==inventories['fixed'],'Original-window membership changed'
 bodies={}
 for label in ['control','fixed']:
  candidate=images[label+'-unstripped'];st,sz,n=next(f for f in functions(candidate)if '9create_v27execute'in f[2]);raw=body(candidate,sections(candidate),st,sz);norm,_=normalize(raw,st,sections(candidate));bodies[label]={'start':st,'bytes':sz,'sha256':sha(raw),'normalized_sha256':sha(norm),'symbol':n}
 assert bodies['control']['normalized_sha256']!=bodies['fixed']['normalized_sha256'],'Assertion did not change live constructor body'
 parent=json.loads((HERE/'parent.json').read_text())
 assert sha(images['control-candidate'])==parent['control_candidate_sha256']=='82f60200719314d63864b24397e4b7e0dc54589715609c9cdd338c6c9e6f6f36'
 assert sha(images['control-unstripped'])==parent['control_unstripped_sha256']=='b58f8f267a52c4f2a07272fae5d1a60f08bbfbddaba0ac56929785b9fccab851'
 assert sha(sources['control']['programs/pump/src/create_v2.rs'])==parent['source_file_sha256']=='ec8a4b452c3dd44bda80ee9bbd5b41c2512dbc9c5c7a7710ea6245d70c1eb5e5'
 assert len(sources['control'])==len(sources['fixed'])==67
 return manifest,images,counts,bodies

ALPHABET='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
def b58(raw):
 n=int.from_bytes(raw,'big');out=''
 while n:n,r=divmod(n,58);out=ALPHABET[r]+out
 return '1'*(len(raw)-len(raw.lstrip(b'\0')))+out

def ed25519(public,signature,message):
 crypto=ctypes.CDLL(ctypes.util.find_library('crypto'))
 new=crypto.EVP_PKEY_new_raw_public_key;new.argtypes=[ctypes.c_int,ctypes.c_void_p,ctypes.c_void_p,ctypes.c_size_t];new.restype=ctypes.c_void_p
 ctx_new=crypto.EVP_MD_CTX_new;ctx_new.restype=ctypes.c_void_p
 init=crypto.EVP_DigestVerifyInit;init.argtypes=[ctypes.c_void_p,ctypes.c_void_p,ctypes.c_void_p,ctypes.c_void_p,ctypes.c_void_p];init.restype=ctypes.c_int
 verify=crypto.EVP_DigestVerify;verify.argtypes=[ctypes.c_void_p,ctypes.c_void_p,ctypes.c_size_t,ctypes.c_void_p,ctypes.c_size_t];verify.restype=ctypes.c_int
 crypto.EVP_MD_CTX_free.argtypes=[ctypes.c_void_p];crypto.EVP_PKEY_free.argtypes=[ctypes.c_void_p]
 key=new(1087,None,public,len(public));ctx=ctx_new();assert key and ctx
 try:assert init(ctx,None,None,None,key)==1;assert verify(ctx,signature,len(signature),message,len(message))==1
 finally:crypto.EVP_MD_CTX_free(ctx);crypto.EVP_PKEY_free(key)

def transaction(raw):
 at=0
 def short():
  nonlocal at
  value=0;shift=0
  while True:
   assert at<len(raw);v=raw[at];at+=1;value|=(v&127)<<shift
   if v<128:return value
   shift+=7;assert shift<=14
 def take(n):
  nonlocal at
  assert 0<=n<=len(raw)-at;out=raw[at:at+n];at+=n;return out
 signatures=[take(64)for _ in range(short())];message=raw[at:];header=take(3);assert not header[0]&128 and len(signatures)==header[0]
 public_keys=[take(32)for _ in range(short())];blockhash=take(32);instructions=[]
 for _ in range(short()):
  program=take(1)[0];accounts=list(take(short()));data=take(short());instructions.append(SimpleNamespace(program_id_index=program,accounts=accounts,data=data))
 assert at==len(raw)
 for public,signature in zip(public_keys,signatures):ed25519(public,signature,message)
 return SimpleNamespace(message=SimpleNamespace(account_keys=[b58(k)for k in public_keys],instructions=instructions,header=SimpleNamespace(num_required_signatures=header[0]),recent_blockhash=b58(blockhash)))

def verify_runtime(images,replay):
 if replay:
  from solders.account import Account
  from solders.clock import Clock
  from solders.pubkey import Pubkey
  from solders.transaction import Transaction
  from solders.transaction_metadata import FailedTransactionMetadata
  from solders.litesvm import LiteSVM
 records=json.loads(read('runtime/cases.json.gz'));cases=records['cases'];assert len(cases)==10
 ids=json.loads((HERE/'runtime/images.json').read_text());programs={}
 for name,row in ids.items():
  blob=read('runtime/images/'+name+'.so.gz');assert sha(blob)==row['sha256'];programs[row['program_id']]=blob
 for label,row in records['images'].items():assert row['sha256']==sha(programs[PUMP]if label=='original'else images[label+'-candidate'])
 executions=0;signature_occurrences=0;replayed=0;unique_transactions=set();unique_signatures=set();seen=set();count_failures=0
 with tempfile.TemporaryDirectory(prefix='pump-minimum-replay-')as tmp:
  tmp=Path(tmp)
  for case in cases:
   c=case['input'];key=(c['quote_token22'],c['quote_count'],'readonly'in c);assert key not in seen;seen.add(key)
   original=case['results']['original'];control=case['results']['control'];fixed=case['results']['fixed']
   fields=['before','after','error','events','inner','return'];assert all(original[k]==q[k]for k in fields for q in [control,fixed])
   assert original['transaction_base64']==control['transaction_base64']==fixed['transaction_base64']
   if c['quote_count']in [1,2]:
    count_failures+=1
    for label,result in case['results'].items():
     at=next(i for i,l in enumerate(result['logs'])if 'Error Code: NotEnoughRemainingAccounts.'in l)
     assert ('create_v2.rs:198.'if label=='original'else'create_v2.rs:62.')in result['logs'][at]
     assert result['logs'][at+1:at+3]==['Program log: Left: '+str(c['quote_count']),'Program log: Right: 3']
   elif 'readonly'in c:assert original['error']is not None and not original['events']
   else:assert original['error']is None and len(original['events'])==1
   for label,result in case['results'].items():
    raw_tx=base64.b64decode(result['transaction_base64']);tx=transaction(raw_tx);executions+=1;signature_occurrences+=tx.message.header.num_required_signatures;unique_transactions.add(raw_tx)
    # Legacy transactions here have a one-byte count prefix and exactly two64-byte signatures.
    assert raw_tx[0]==2;unique_signatures.update([raw_tx[1:65],raw_tx[65:129]])
    keys=tx.message.account_keys;assert len(tx.message.instructions)==2 and str(keys[tx.message.instructions[1].program_id_index])==PUMP
    assert tx.message.header.num_required_signatures==2 and len(tx.message.instructions[1].accounts)-records['fixed_idl_account_count']==c['quote_count']
    assert tx.message.instructions[1].data[:8]==bytes([214,144,76,236,95,139,49,180])
    selected=dict(programs);selected[PUMP]=programs[PUMP]if label=='original'else images[label+'-candidate']
    if not replay:continue
    vm=LiteSVM().with_transaction_history(0);vm.set_clock(Clock(100,1700000000,0,0,1700000000))
    for pid,blob in selected.items():
     path=tmp/(pid+'.so');path.write_bytes(blob);vm.add_program_from_file(Pubkey.from_string(pid),path)
    for address,a in result['before'].items():
     if a is not None:vm.set_account(Pubkey.from_string(address),Account(a['lamports'],bytes.fromhex(a['data']),Pubkey.from_string(a['owner'])))
    assert tx.message.recent_blockhash==str(vm.latest_blockhash())
    sent=vm.send_transaction(Transaction.from_bytes(raw_tx));failed=isinstance(sent,FailedTransactionMetadata);meta=sent.meta()if failed else sent;encoded=json.loads(meta.to_json())
    got={'error':str(sent.err())if failed else None,'logs':meta.logs(),'events':[l for l in meta.logs()if l.startswith('Program data:')],'inner':encoded['inner_instructions'],'return':encoded.get('return_data'),'after':{}}
    for address in result['after']:
     a=vm.get_account(Pubkey.from_string(address));got['after'][address]=None if a is None else{'lamports':a.lamports,'owner':str(a.owner),'data':bytes(a.data).hex()}
    for field in got:assert got[field]==result[field],(key,label,field)
    replayed+=1
 assert seen=={(token,n,False)for token in [False,True]for n in range(4)}|{(token,3,True)for token in [False,True]}
 assert count_failures==4 and executions==30 and signature_occurrences==60
 return{'cases':len(cases),'executed_transactions':executions,'stored_signature_occurrences':signature_occurrences,'distinct_transaction_serializations':len(unique_transactions),'distinct_signature_bytes':len(unique_signatures),'replayed_transactions':replayed,'source_lines':{'original':198,'control':62,'fixed':62},'observed_structured_behavior_change':False}

def verify_operations(images):
 original=read('runtime/images/pump-original.so.gz');windows=dict(json.loads((HERE/'windows.json').read_text()));result={};keys={'usize/u64_fmt':'0bc29a5620636f211122c2b214ab51de8d5d0604a466642871b0825cbd5ae782','i32_fmt':'a27ea148dbd3959218493d97c3e990af0360f858b79d646df1d8d27fef8bc737','with_values':'cf9c6809b850fd9c8fa5d6045c6b3ea08bac338aa4fcc3de71c4baa272048a8f','memcpy':'1ebd76b602440a25fe65d4cc6eb847d2471b589ada5c8816107c32ddfc964dc0'}
 for label in ['original','control','fixed']:
  blob=original if label=='original'else images[label+'-unstripped'];ss=sections(blob);fs=windows if label=='original'else{s:z for s,z,n in functions(blob)}
  st=0x1e7c0 if label=='original'else next(s for s,z,n in functions(blob)if '9create_v27execute'in n);raw=body(blob,ss,st,fs[st]);_,ops=normalize(raw,st,ss);calls=[]
  for q in ops:
   if q['kind']!='direct-call':continue
   target=q['target'];size=fs[target];norm,_=normalize(body(blob,ss,target,size),target,ss);calls.append({'offset':q['offset'],'target':target,'bytes':size,'hash':sha(norm)})
  if label!='original':
   saved=json.loads((HERE/'calls'/(label+'.json')).read_text());assert saved['candidate_sha256']==sha(blob)
   assert [(q['offset'],q['target'],q['bytes'],q['hash'])for q in calls]==[(q['offset'],q['target'],q['callee']['bytes'],q['callee']['normalized_sha256'])for q in saved['calls']['candidate']]
  counts={name:sum(q['hash']==digest for q in calls)for name,digest in keys.items()};result[label]={'body_bytes':len(raw),'calls':len(calls),'counts':counts}
  if label=='original':assert struct.unpack_from('<BBhi',raw,0x1488)==(0x62,10,-0x88,3)
  if label=='fixed':assert struct.unpack_from('<BBhi',raw,0x11a8)==(0x62,10,-0x28,3)
 assert [result[k]['calls']for k in ['original','control','fixed']]==[125,109,115]
 assert [result[k]['body_bytes']for k in ['original','control','fixed']]==[15576,12608,13728]
 assert result['original']['counts']=={'usize/u64_fmt':2,'i32_fmt':2,'with_values':3,'memcpy':10}
 assert result['control']['counts']=={'usize/u64_fmt':0,'i32_fmt':0,'with_values':4,'memcpy':3}
 assert result['fixed']['counts']=={'usize/u64_fmt':2,'i32_fmt':2,'with_values':3,'memcpy':6}
 return result

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--replay',action='store_true',help='Re-execute all frozen signed transactions with captured AMM and dependencies.');a=ap.parse_args()
 _,images,counts,bodies=verify_artifacts();operations=verify_operations(images);runtime=verify_runtime(images,a.replay)
 print(json.dumps({'counts':counts,'live_constructor_bodies':bodies,'actual_used_operations':operations,'runtime':runtime,'normalized_window_gain':0,'whole_elf_equal':False},indent=2))
if __name__=='__main__':main()
