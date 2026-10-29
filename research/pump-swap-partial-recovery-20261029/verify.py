#!/usr/bin/env python3
"""Verify published artifacts, complete Pump censuses and saved paired observations.

This is not a compiler or VM replay, execution attestation, or new recovery metric.
The recorded scorer's normalization is imported unchanged. ELF function symbols
are read directly so this verifier needs no platform-tools installation.
"""
import argparse,base64,gzip,hashlib,importlib.util,io,json,re,struct,subprocess,sys,tarfile,tempfile
from pathlib import Path
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parent
sha=lambda b:hashlib.sha256(b).hexdigest()
read=lambda p:json.loads((P/p).read_text())
def git_blob(path):
 return subprocess.check_output(['git','show',read('CATALOG.json')['base_revision']+':'+path],cwd=P)
def functions(blob):
 shoff=struct.unpack_from('<Q',blob,0x28)[0];size,count,names=struct.unpack_from('<HHH',blob,0x3a)
 headers=[struct.unpack_from('<IIQQQQIIQQ',blob,shoff+i*size)for i in range(count)]
 strings=headers[names];raw=blob[strings[4]:strings[4]+strings[5]]
 name=lambda h:raw[h[0]:raw.index(b'\0',h[0])].decode()
 for h in headers:
  if h[1]!=2:continue
  for at in range(h[4],h[4]+h[5],h[9]):
   _,info,_,section,start,length=struct.unpack_from('<IBBHQQ',blob,at)
   if info&15==2 and length and section<len(headers)and name(headers[section])=='.text':yield start,length
def source_files(path):
 result={}
 with tarfile.open(fileobj=io.BytesIO(gzip.decompress(path.read_bytes())))as t:
  for m in t.getmembers():
   assert m.isfile()and not Path(m.name).is_absolute()and'..'not in Path(m.name).parts
   assert m.name not in result
   result[m.name]=t.extractfile(m).read()
 return result
def main():
 a=argparse.ArgumentParser(description=__doc__);a.add_argument('--verify-signatures',action='store_true');args=a.parse_args()
 manifest=read('MANIFEST.json')['files'];actual={str(p.relative_to(P)):sha(p.read_bytes())for p in P.rglob('*')if p.is_file()and p.name!='MANIFEST.json'and'__pycache__'not in p.parts}
 assert actual==manifest,'Published artifact file set or digest changed'
 spec=importlib.util.spec_from_file_location('recorded_score',P/'recorded-tools/score.py');score=importlib.util.module_from_spec(spec);spec.loader.exec_module(score)
 assert sha((P/'recorded-tools/score.py').read_bytes())==read('recorded-tools/SHA256.json')['score.py']
 original=git_blob('evidence/original/pump/deployed.so');index=read('WINDOWS.json');assert sha(original)==index['original_sha256'];secs=score.sections(original)
 windows=[]
 for w in index['windows']:
  raw=score.body(original,secs,w['start'],w['bytes']);windows.append((w,raw,sha(score.normalize(raw,w['start'],secs))))
 assert len(windows)==1035
 baseline=read('baseline-membership.json')['windows']
 def census(blob):
  secs=score.sections(blob);by={}
  for start,n in functions(blob):
   raw=score.body(blob,secs,start,n);by.setdefault((n,sha(score.normalize(raw,start,secs))),[]).append(raw)
  out={}
  for w,raw,digest in windows:
   candidates=by.get((w['bytes'],digest),[]);out[str(w['start'])]={'normalized':bool(candidates),'raw':raw in candidates}
  return out
 rows=[];source_base=source_files(P/'snapshots/canonical-baseline/source.tar.gz')
 for label in read('CATALOG.json')['snapshots']:
  d=read('snapshots/'+label+'/snapshot.json');sdir=P/'snapshots'/label
  source=source_files(sdir/'source.tar.gz');assert {k:sha(v)for k,v in source.items()}==d['source_sha256']
  if label!='canonical-baseline':
   with tempfile.TemporaryDirectory(prefix='pump-partial-patch-')as tmp:
    tmp=Path(tmp)
    for name,raw in source_base.items():
     f=tmp/name;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(raw)
    subprocess.run(['git','-c','core.autocrlf=false','apply','--whitespace=nowarn','-'],input=(sdir/'source.patch').read_bytes(),cwd=tmp,check=True,capture_output=True)
    applied={str(p.relative_to(tmp)):p.read_bytes()for p in tmp.rglob('*')if p.is_file()}
    assert applied==source,('Patch/archive mismatch',label)
  for name,expected in d['images'].items():
   raw=gzip.decompress((sdir/(name+'.gz')).read_bytes());assert len(raw)==expected['bytes']and sha(raw)==expected['sha256']
  current=census(gzip.decompress((sdir/'unstripped.so.gz').read_bytes()))
  assert all(current[k][kind]==v[kind]for k,v in baseline.items()for kind in ['normalized','raw']),label
  rows.append({'snapshot':label,'normalized':sum(v['normalized']for v in current.values()),'raw':sum(v['raw']for v in current.values()),'gains':0,'losses':0})
 linux=census(gzip.decompress((P/'linux-host/unstripped.so.gz').read_bytes()))
 assert all(linux[k]['normalized']==v['normalized']for k,v in baseline.items())
 assert sum(v['raw']for v in linux.values())==183
 if args.verify_signatures:
  from solders.transaction import Transaction
 cu=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed \d+ of \d+ compute units$')
 pairs=outcomes=signatures=0
 for group in ['cto','v2','legacy','legacy-targeted']:
  d=json.loads(gzip.decompress((P/'runtime'/group/'observations.json.gz').read_bytes()));audit=read('runtime/'+group+'/audit.json')
  binding={'cto':'cto-account-copies','v2':'v2-runtime-qualified','legacy':'legacy-cashback','legacy-targeted':'legacy-cashback'}[group]
  assert d['candidate_sha256']==read('snapshots/'+binding+'/snapshot.json')['images']['candidate.so']['sha256']
  assert d['original_sha256']==index['original_sha256']
  assert len(d['cases'])==d['case_count']and not d['mismatches']
  assert not audit['structured_difference_cases']and not audit['strict_ordered_program_message_difference_cases']
  fields=['error','before','after','events','inner','return']if group=='cto'else['error','accounts','events','inner','return_data']
  for row in d['cases']:
   x,y=row['original'],row['candidate'];assert all(x[k]==y[k]for k in fields)
   assert x['transaction_base64']==y['transaction_base64']
   messages=lambda q:[s for s in q['logs']if not cu.fullmatch(s)]
   assert messages(x)==messages(y)
   for q in [x,y]:
    wire=base64.b64decode(q['transaction_base64'])
    if args.verify_signatures:
     tx=Transaction.from_bytes(wire);tx.verify();signatures+=len(tx.signatures)
   pairs+=1;outcomes+=2
 assert(pairs,outcomes)==(716,1432)
 if args.verify_signatures:assert signatures==2154
 print(json.dumps({'status':'PASS_artifact_and_recorded_observation_checks','new_windows':0,'pump_snapshots':rows,'true_linux_normalized':1019,'true_linux_raw':183,'saved_runtime_case_pairs':pairs,'saved_signed_outcomes':outcomes,'fresh_signature_fields_verified':signatures if args.verify_signatures else None,'compiler_executed':False,'VM_executed':False,'maintained_source_promoted':False},indent=2))
if __name__=='__main__':main()
