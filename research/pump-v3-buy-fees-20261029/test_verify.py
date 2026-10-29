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
    seal_manifest(packet)
def seal_manifest(packet):
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
    for name in ['fees-eight.json.gz','costs20.json.gz']:
        path=packet/'runtime'/name;value=json.loads(gzip.decompress(path.read_bytes()));value['cases']=[copy.deepcopy(value['cases'][0])for _ in value['cases']];write(path,value)
def wire(packet):
    path=packet/'runtime/fees-eight.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));source=value['cases'][-1]
    for label in ['original','parent','proposal']:
        wire_=source['runs'][label]['transaction_base64'];value['cases'][0]['runs'][label]['transaction_base64']=wire_;value['cases'][0]['observations'][label]['transaction_base64']=wire_
    write(path,value)
def prestate(packet):
    path=packet/'runtime/fees-eight.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));curve='DVtP3csJxif14jEnZv82vcK3mevC4MNEApbksz5hNF4Q'
    for label in ['original','parent','proposal']:value['cases'][0]['observations'][label]['before'][curve]['data_sha256']=sha(b'wrong declared curve prestate')
    write(path,value)
def user_lamports(packet):
    path=packet/'runtime/fees-eight.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));user='DY7kCKMuBLWhgtTzqUatnURbGeNbNks2uumKf1cqCjrp'
    for label in ['original','parent','proposal']:
        row=value['cases'][0];row['observations'][label]['before'][user]['lamports']+=1;row['observations'][label]['after'][user]['lamports']+=1;row['runs'][label]['accounts'][user]['lamports']+=1
    write(path,value)
def base_vault_prestate(packet):
    path=packet/'runtime/fees-eight.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));key='65k831xRFLod6a7ZVio7GU7MPpAHAjRfXxrxuP5FdzD'
    for label in ['original','parent','proposal']:value['cases'][0]['observations'][label]['before'][key]['data_sha256']=sha(b'wrong declared source-owned base vault amount')
    write(path,value)
def fee_configuration(packet):
    path=packet/'runtime/fees-eight.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));value['cases'][0]['case']['fees']=[30,95,5000];write(path,value)

def accumulator_prestate(packet):
    path=packet/'runtime/fees-eight.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));key='2fQS9EcdPMTMSH53vbbPVZcHLR3oLgKCRqV7jnbNkGHq'
    for label in ['original','parent','proposal']:value['cases'][0]['observations'][label]['before'][key]['data_sha256']=sha(b'wrong complete accumulator prestate')
    write(path,value)

def quote_wire(packet):
    path=packet/'runtime/fees-eight.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));other=value['cases'][4]
    for label in ['original','parent','proposal']:
        wire_=other['runs'][label]['transaction_base64'];value['cases'][0]['runs'][label]['transaction_base64']=wire_;value['cases'][0]['observations'][label]['transaction_base64']=wire_
    write(path,value)

def quote_prestate(packet):
    from solders.pubkey import Pubkey
    path=packet/'runtime/fees-eight.json.gz';value=json.loads(gzip.decompress(path.read_bytes()))
    user=Pubkey.from_string('DY7kCKMuBLWhgtTzqUatnURbGeNbNks2uumKf1cqCjrp');token=Pubkey.from_string('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');quote=Pubkey.from_string('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');ata=Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');key=str(Pubkey.find_program_address([bytes(user),bytes(token),bytes(quote)],ata)[0])
    for label in ['original','parent','proposal']:value['cases'][4]['observations'][label]['before'][key]['data_sha256']=sha(b'wrong synthetic quote balance')
    write(path,value)

def raw_metadata(packet):
    path=packet/'runtime/fees-eight.json.gz';value=json.loads(gzip.decompress(path.read_bytes()))
    for observation in value['cases'][0]['observations'].values():
        observation['metadata']['return_data']={'program_id':[0]*32,'data':[99]}
    write(path,value)

def load(path):return json.loads(path.read_text())
def save(path,value):path.write_text(json.dumps(value,indent=2)+'\n')
def command_drift(packet):
    path=packet/'build/candidate/launch.json';value=load(path);value['command'].append('--unexpected-reviewed-flag');save(path,value)
def coherent_tools(packet):
    for name in ['parent','candidate','repeat']:
        path=packet/f'build/{name}/launch.json';value=load(path);value['tools']['rustc']='0'*64;save(path,value)
def result_name(packet):
    path=packet/'runtime/execution.json';value=load(path);value['results'][0]['name']='copy';save(path,value)
def missing_result(packet):
    path=packet/'runtime/execution.json';value=load(path);value['results']=value['results'][1:];save(path,value)
def missing_output(packet):
    path=packet/'runtime/execution.json';value=load(path);del value['output_files']['fees.stderr.log'];save(path,value)
def extra_output(packet):
    path=packet/'runtime/execution.json';value=load(path);raw=b'extra output';(packet/'runtime/extra.log').write_bytes(raw);value['output_files']['extra.log']=dict(sha256=sha(raw),bytes=len(raw));save(path,value)
def stream_drift(packet):
    path=packet/'runtime/fees.stdout.log';path.write_bytes(path.read_bytes()+b'\nchanged retained stream\n')

CONTROLS=[('coherent non-D037 source',nonparent,'selected D037 66-input source parent'),('duplicate fixtures',duplicate,'exact source-owned fees case definitions'),('valid signed wrong amount wire',wire,'fixture signed operation/amount'),('coherent wrong focused prestate',prestate,'focused actual fixture prestate'),('coherent wrong user lamports',user_lamports,'focused source-owned user account metadata'),('coherent wrong base vault amount',base_vault_prestate,'focused actual fixture prestate'),('wrong fee case configuration',fee_configuration,'exact source-owned fees case definitions'),('wrong full accumulator prestate',accumulator_prestate,'focused actual fixture prestate'),('valid signed wrong quote-account wire',quote_wire,'fixture signed account roles/order'),('coherent wrong synthetic quote prestate',quote_prestate,'focused synthetic quote account prestate')]

CONTROLS += [('coherent raw focused return metadata',raw_metadata,'focused raw metadata signed result join')]

CONTROLS += [('changed literal build command',command_drift,'reviewed literal Cargo command differs'),('coherent unqualified compiler hashes',coherent_tools,'qualified v1.44 tool hashes differ'),('wrong runtime result name',result_name,'actual runtime launch success/input custody'),('missing runtime result',missing_result,'actual runtime launch success/input custody'),('missing output receipt',missing_output,'runtime output membership'),('extra output receipt',extra_output,'runtime output membership'),('resealed changed output stream',stream_drift,'runtime result stream receipt join')]

def run(packet,repo=None):return subprocess.run([sys.executable,'-I','-B',str(packet/'verify.py'),'--repo-root',str(ROOT if repo is None else repo)],capture_output=True,text=True)
class EvidenceTests(unittest.TestCase):
    def test_optimized_guards(self):
        for name in ['verify.py','audit_refs.py','correspondence.py','test_verify.py']:
            with self.subTest(entrypoint=name):
                result=subprocess.run([sys.executable,'-I','-B','-O',str(HERE/name),'--repo-root','/nonexistent'],capture_output=True,text=True)
                self.assertNotEqual(result.returncode,0);self.assertIn('Run without -O',result.stdout+result.stderr);self.assertNotIn('Traceback',result.stderr)
    def test_repository_fixture_must_match(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo=Path(tmp);fixture=repo/'research/imported-lab/analysis/pump_fun/curve-fresh-trades-v3-signed-surfpool.json';fixture.parent.mkdir(parents=True);fixture.write_bytes(gzip.decompress((HERE/'runtime/fixture-input.json.gz').read_bytes())+b'\n')
            result=run(HERE,repo);self.assertNotEqual(result.returncode,0);self.assertIn('repository fixture agrees',result.stderr)
    def test_resealed_wrong_output_receipt(self):
        with tempfile.TemporaryDirectory() as tmp:
            packet=Path(tmp)/'packet';shutil.copytree(HERE,packet);path=packet/'runtime/execution.json';value=load(path);value['output_files']['fees.stdout.log']['sha256']='0'*64;save(path,value);seal_manifest(packet)
            result=run(packet);self.assertNotEqual(result.returncode,0);self.assertIn('actual runtime output receipt join',result.stderr)

    def test_clean_saved_packet(self):
        result=run(HERE);self.assertEqual(result.returncode,0,result.stderr)
    def test_resealed_correspondence_controls(self):
        for name,mutate,reason in CONTROLS:
            with self.subTest(control=name),tempfile.TemporaryDirectory()as tmp:
                packet=Path(tmp)/'packet';shutil.copytree(HERE,packet);mutate(packet);repin(packet);result=run(packet);self.assertNotEqual(result.returncode,0);self.assertIn(reason,result.stderr)
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--repo-root',type=Path,default=ROOT);args,remaining=parser.parse_known_args();ROOT=args.repo_root.resolve();unittest.main(argv=[sys.argv[0],*remaining])
