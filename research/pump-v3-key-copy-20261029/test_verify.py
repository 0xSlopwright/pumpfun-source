"""Resealed controls for confirmed source, fixture and signed-wire gaps."""
if not __debug__:
    raise SystemExit('Run without -O')
import argparse,copy,gzip,hashlib,io,json,shutil,subprocess,sys,tarfile,tempfile,unittest
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
sys.dont_write_bytecode=True
def sha(raw):return hashlib.sha256(raw).hexdigest()
def write(path,value):path.write_bytes(gzip.compress(json.dumps(value).encode(),mtime=0))
def repin(packet):
    execution=json.loads((packet/'runtime/execution.json').read_text())
    for name in execution['output_files']:
        raw=(packet/'runtime'/name).read_bytes();execution['output_files'][name]=dict(sha256=sha(raw),bytes=len(raw))
    (packet/'runtime/execution.json').write_text(json.dumps(execution,indent=2)+'\n')
    manifest={p.relative_to(packet).as_posix():sha(p.read_bytes())for p in packet.rglob('*')if p.is_file()and p.name!='MANIFEST.json'}
    (packet/'MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
def nonparent(packet):
    maps={}
    for label in ['parent','candidate']:
        name=packet/f'source-{label}.tar.gz'
        with tarfile.open(name,'r:gz')as tf:files={m.name:tf.extractfile(m).read()for m in tf if m.isfile()}
        files['programs/pump/src/buy.rs']+=b'\n// coherent unrelated source mutation\n';buffer=io.BytesIO()
        with tarfile.open(fileobj=buffer,mode='w')as tf:
            for name_,raw in files.items():member=tarfile.TarInfo(name_);member.size=len(raw);tf.addfile(member,io.BytesIO(raw))
        name.write_bytes(gzip.compress(buffer.getvalue(),mtime=0));maps[label]={n:sha(raw)for n,raw in files.items()};(packet/f'source-{label}.json').write_text(json.dumps(maps[label],indent=2)+'\n')
    for label in ['parent','candidate','repeat']:
        name=packet/f'build/{label}/launch.json';launch=json.loads(name.read_text());launch['inputs']=maps['parent'if label=='parent'else'candidate'];name.write_text(json.dumps(launch,indent=2)+'\n')
def duplicate(packet):
    for name in ['costs-six.json.gz','costs20.json.gz']:
        path=packet/'runtime'/name;value=json.loads(gzip.decompress(path.read_bytes()));value['cases']=[copy.deepcopy(value['cases'][0])for _ in value['cases']];write(path,value)
def wire(packet):
    path=packet/'runtime/costs-six.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));source=value['cases'][-1]
    for label in ['original','parent','proposal']:
        wire_=source['runs'][label]['transaction_base64'];value['cases'][0]['runs'][label]['transaction_base64']=wire_;value['cases'][0]['observations'][label]['transaction_base64']=wire_
    write(path,value)
def prestate(packet):
    path=packet/'runtime/costs-six.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));curve='DVtP3csJxif14jEnZv82vcK3mevC4MNEApbksz5hNF4Q'
    for label in ['original','parent','proposal']:value['cases'][0]['observations'][label]['before'][curve]['data_sha256']=sha(b'wrong declared curve prestate')
    write(path,value)
def user_lamports(packet):
    path=packet/'runtime/costs-six.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));user='DY7kCKMuBLWhgtTzqUatnURbGeNbNks2uumKf1cqCjrp'
    for label in ['original','parent','proposal']:
        row=value['cases'][0];row['observations'][label]['before'][user]['lamports']+=1;row['observations'][label]['after'][user]['lamports']+=1;row['runs'][label]['accounts'][user]['lamports']+=1
    write(path,value)
def base_vault_prestate(packet):
    path=packet/'runtime/costs-six.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));key='65k831xRFLod6a7ZVio7GU7MPpAHAjRfXxrxuP5FdzD'
    for label in ['original','parent','proposal']:value['cases'][0]['observations'][label]['before'][key]['data_sha256']=sha(b'wrong declared source-owned base vault amount')
    write(path,value)
def duplicate_copy(packet):
    path=packet/'runtime/copy-two.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));value['cases'][0]=copy.deepcopy(value['cases'][1]);write(path,value)

def copy_prestate(packet):
    path=packet/'runtime/copy-two.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));key='2fQS9EcdPMTMSH53vbbPVZcHLR3oLgKCRqV7jnbNkGHq'
    for label in ['original','parent','proposal']:value['cases'][0]['observations'][label]['before'][key]['data_sha256']=sha(b'wrong complete accumulator prestate')
    write(path,value)

def copy_wire(packet):
    path=packet/'runtime/copy-two.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));other=json.loads(gzip.decompress((packet/'runtime/costs-six.json.gz').read_bytes()))['cases'][-1]
    for label in ['original','parent','proposal']:
        wire_=other['runs'][label]['transaction_base64'];value['cases'][0]['runs'][label]['transaction_base64']=wire_;value['cases'][0]['observations'][label]['transaction_base64']=wire_
    write(path,value)

def doc(p):return json.loads(gzip.decompress(p.read_bytes())if p.suffix=='.gz'else p.read_bytes())
def put(p,v):
 b=(json.dumps(v,indent=2)+'\n').encode();p.write_bytes(gzip.compress(b,mtime=0)if p.suffix=='.gz'else b)
def peer_common(B):
 for name in ['parent','candidate']:
  f=B/f'source-{name}.tar.gz'
  with tarfile.open(f,'r:gz')as tf: vals=[(x,tf.extractfile(x).read())for x in tf if x.isfile()]
  target='programs/pump/src/lib.rs';out=io.BytesIO()
  with tarfile.open(fileobj=out,mode='w:gz')as tf:
   for info,raw in vals:
    if info.name==target:raw+=b'\n// unrelated common-source substitution\n'
    info.size=len(raw);tf.addfile(info,io.BytesIO(raw))
  f.write_bytes(out.getvalue());d={x.name:hashlib.sha256(raw+(b'\n// unrelated common-source substitution\n'if x.name==target else b'')).hexdigest()for x,raw in vals}
  put(B/f'source-{name}.json',d)
  for label in ([name]if name=='parent'else['candidate','repeat']):
   launch=B/f'build/{label}/launch.json';j=doc(launch);j['inputs']=d;put(launch,j)
def peer_duplicate(B):
 p=B/'runtime/costs-six.json.gz';j=doc(p);j['cases'][1]=j['cases'][0];put(p,j)
def peer_copy_duplicate(B):
 p=B/'runtime/copy-two.json.gz';j=doc(p);j['cases'][1]=j['cases'][0];put(p,j)
def peer_wire(B):
 p=B/'runtime/costs-six.json.gz';j=doc(p);other=j['cases'][-1]['runs']['original']['transaction_base64']
 for v in j['cases'][0]['runs'].values():v['transaction_base64']=other
 for v in j['cases'][0]['observations'].values():v['transaction_base64']=other
 put(p,j)
def peer_state(B):
 p=B/'runtime/costs-six.json.gz';j=doc(p)
 for o in j['cases'][0]['observations'].values():
  user=next(k for k,v in o['before'].items()if v and v.get('lamports')==10**16);o['before'][user]['lamports']+=1
 put(p,j)
def peer_curve_owner(B):
 p=B/'runtime/copy-two.json.gz';j=doc(p);curve=doc(B/'runtime/fixture-input.json.gz')['accounts']['curve']
 for o in j['cases'][0]['observations'].values():
  o['before'][curve]['owner']=o['after'][curve]['owner']='11111111111111111111111111111111'
 for r in j['cases'][0]['runs'].values():r['accounts'][curve]['owner']='11111111111111111111111111111111'
 put(p,j)
def peer_execution(B):
 p=B/'runtime/execution.json';j=doc(p);name=next(k for k in j['inputs']if k.endswith('/execute-key-slice/candidate.so'));j['inputs'][name]['sha256']='0'*64;put(p,j)

CONTROLS=[('coherent non-D037 source',nonparent,'selected D037 66-input source parent'),('duplicate26fixtures',duplicate,'exact source-owned six case definitions'),('valid signed wrong amount wire',wire,'fixture signed operation/amount'),('coherent wrong focused prestate',prestate,'focused actual fixture prestate'),('coherent wrong user lamports',user_lamports,'focused source-owned user account metadata'),('coherent wrong base vault amount',base_vault_prestate,'focused actual fixture prestate'),('duplicate copy states',duplicate_copy,'exact source-owned copy case definitions'),('wrong full accumulator prestate',copy_prestate,'focused actual fixture prestate'),('copy valid signed wrong operation wire',copy_wire,'fixture signed operation/amount')]
CONTROLS += [('root unrelated common lib source',peer_common,'selected D037 66-input source parent'),('root duplicated one six case',peer_duplicate,'exact source-owned six case definitions'),('root missing existing copy state',peer_copy_duplicate,'exact source-owned copy case definitions'),('root valid wrong amount wire',peer_wire,'fixture signed operation/amount'),('root user before-state only +1',peer_state,'focused source-owned user account metadata'),('root wrong actual image input',peer_execution,'actual runtime input bytes candidate.so'),('peer coherent curve owner',peer_curve_owner,'focused source-owned curve account metadata')]
def run(packet):return subprocess.run([sys.executable,'-I','-B',str(packet/'verify.py'),'--repo-root',str(ROOT)],capture_output=True,text=True)
class EvidenceTests(unittest.TestCase):
    def test_optimized_guards(self):
        for name in ['verify.py','audit_refs.py','correspondence.py']:
            with self.subTest(entrypoint=name):
                result=subprocess.run([sys.executable,'-I','-B','-O',str(HERE/name),'--repo-root','/nonexistent'],capture_output=True,text=True)
                self.assertNotEqual(result.returncode,0);self.assertIn('Run without -O',result.stdout+result.stderr);self.assertNotIn('Traceback',result.stderr)
    def test_clean_saved_packet(self):
        result=run(HERE);self.assertEqual(result.returncode,0,result.stderr)
    def test_resealed_correspondence_controls(self):
        for name,mutate,reason in CONTROLS:
            with self.subTest(control=name),tempfile.TemporaryDirectory()as tmp:
                packet=Path(tmp)/'packet';shutil.copytree(HERE,packet);mutate(packet);repin(packet);result=run(packet);self.assertNotEqual(result.returncode,0);self.assertIn(reason,result.stderr)
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--repo-root',type=Path,default=ROOT);args,remaining=parser.parse_known_args();ROOT=args.repo_root.resolve();unittest.main(argv=[sys.argv[0],*remaining])
