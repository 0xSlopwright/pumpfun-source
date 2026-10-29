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
    for name in ['costs-six.json.gz','costs20.json.gz','costs20-loader.json']:
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
CONTROLS=[('coherent non-D037 source',nonparent,'selected D037 66-input source parent'),('duplicate26fixtures',duplicate,'exact source-owned six case definitions'),('valid signed wrong amount wire',wire,'fixture signed operation/amount'),('coherent wrong focused prestate',prestate,'focused actual fixture prestate'),('coherent wrong user lamports',user_lamports,'focused source-owned user account metadata'),('coherent wrong base vault amount',base_vault_prestate,'focused actual fixture prestate')]
def run(packet):return subprocess.run([sys.executable,'-B',str(packet/'verify.py'),'--repo-root',str(ROOT)],capture_output=True,text=True)
class EvidenceTests(unittest.TestCase):
    def test_clean_saved_packet(self):
        result=run(HERE);self.assertEqual(result.returncode,0,result.stderr)
    def test_resealed_correspondence_controls(self):
        for name,mutate,reason in CONTROLS:
            with self.subTest(control=name),tempfile.TemporaryDirectory()as tmp:
                packet=Path(tmp)/'packet';shutil.copytree(HERE,packet);mutate(packet);repin(packet);result=run(packet);self.assertNotEqual(result.returncode,0);self.assertIn(reason,result.stderr)
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--repo-root',type=Path,default=ROOT);args,remaining=parser.parse_known_args();ROOT=args.repo_root.resolve();unittest.main(argv=[sys.argv[0],*remaining])
