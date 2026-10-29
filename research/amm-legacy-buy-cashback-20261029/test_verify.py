"""Finite resealed correspondence controls; never run producer, build or VM."""
if not __debug__:
    raise SystemExit('Run without -O')
import argparse,base64,contextlib,copy,gzip,hashlib,importlib.util,io,json,shutil,sys,tempfile,unittest
from pathlib import Path
from solders.pubkey import Pubkey
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
def sha(b):return hashlib.sha256(b).hexdigest()
def run(packet):
 spec=importlib.util.spec_from_file_location('legacy_buy_saved_control',packet/'verify.py');v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v);v.HERE,v.ROOT=packet,ROOT
 with contextlib.redirect_stdout(io.StringIO()):v.main()
def repin(packet,report,rows):
 start=0
 for part in report['transaction_receipts']['parts']:
  chunk=rows[start:start+part['receipts']];start+=len(chunk);raw=gzip.compress(b'\n'.join(json.dumps(r).encode()for r in chunk)+b'\n',mtime=0);(packet/part['path']).write_bytes(raw);part['sha256']=sha(raw)
 (packet/'runtime/report.json.gz').write_bytes(gzip.compress(json.dumps(report).encode(),mtime=0));manifest=json.loads((packet/'MANIFEST.json').read_text());manifest['files']={p.relative_to(packet).as_posix():sha(p.read_bytes())for p in packet.rglob('*')if p.is_file()and p.name!='MANIFEST.json'};(packet/'MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
def selected(rows):return[r for r in rows if r['context']['label']=='cb-fresh-buy']
def image(report,rows):report['image_sha256']['candidate']='0'*64
def wrong_wire(report,rows):
 for label in ['original','control','candidate']:
  source=next(r for r in rows if r['context']['label']=='cb-fresh-buy-1m'and r['context']['image']==label);target=next(r for r in selected(rows)if r['context']['image']==label)
  for key in ['transaction_base64','transaction_sha256','signatures']:target[key]=copy.deepcopy(source[key])
  target['metadata']['signature']=source['metadata']['signature']
def detached_pool(report,rows):
 key=str(Pubkey.from_bytes(hashlib.sha256(b'PR796 detached pool role').digest()))
 for r in selected(rows):
  old=r['roles']['pool'];r['roles']['pool']=key
  for side in ['before','after']:r[side][key]=r[side].pop(old)
def missing_cases(report,rows):report['cases']=[copy.deepcopy(report['cases'][0])for _ in range(42)]
def changed_payer(report,rows):
 for r in selected(rows):r['after'][r['roles']['fee_payer']]['lamports']+=1;r['payer_delta_lamports']-=1;r['observed']['payer_paid']-=1
def wrong_event(report,rows):
 for r in selected(rows):
  logs=r['metadata']['logs'];at=next(i for i,s in enumerate(logs)if s.startswith('Program data: '));raw=base64.b64decode(logs[at].split(': ',1)[1]);logs[at]='Program data: '+base64.b64encode(bytes(8)+raw[8:]).decode()
def wrong_pool_flag(report,rows):
 for r in selected(rows):
  for side in ['before','after']:
   key=r['roles']['pool'];data=bytearray.fromhex(r[side][key]['data_hex']);data[244]=0;r[side][key]['data_hex']=data.hex()
def invalid_signature(report,rows):
 for r in rows[:3]:
  raw=bytearray(base64.b64decode(r['transaction_base64']));raw[1]^=1;r['transaction_base64']=base64.b64encode(raw).decode();r['transaction_sha256']=sha(raw)
def wrong_privilege(report,rows):
 for label in ['original','control','candidate']:
  source=next(r for r in rows if r['context']['label']=='cb-readonly-uvata'and r['context']['image']==label);target=next(r for r in selected(rows)if r['context']['image']==label)
  for key in ['transaction_base64','transaction_sha256','signatures']:target[key]=copy.deepcopy(source[key])
  target['metadata']['signature']=source['metadata']['signature']
def wrong_feeconfig(report,rows):
 for r in selected(rows):
  key=next(k for k,v in r['before'].items()if v and len(bytes.fromhex(v['data_hex']))==4097)
  for side in ['before','after']:
   data=bytearray.fromhex(r[side][key]['data_hex']);data[41]^=1;r[side][key]['data_hex']=data.hex()
CONTROLS=[('repinned image declaration',image,'historical image declarations'),('valid signed wrong amount',wrong_wire,'signed case amount'),('off-wire watched pool',detached_pool,'fixture/signed watched roles'),('42entries1case',missing_cases,'exact42case definitions'),('coherent wrong payer amount',changed_payer,'declared payer debit'),('wrong BuyEvent discriminator',wrong_event,'BuyEvent discriminator/fields'),('cashback flag cleared',wrong_pool_flag,'actual pool prestate'),('invalid signature',invalid_signature,'signed transaction validity'),('valid signed wrong privilege',wrong_privilege,'signed effective privileges'),('coherent wrong feeconfig',wrong_feeconfig,'actual feeconfig fixture')]
class EvidenceTests(unittest.TestCase):
 def test_clean_saved_packet(self):run(HERE)
 def test_resealed_correspondence_controls(self):
  report=json.loads(gzip.decompress((HERE/'runtime/report.json.gz').read_bytes()));rows=[]
  for part in report['transaction_receipts']['parts']:rows.extend(json.loads(l)for l in gzip.decompress((HERE/part['path']).read_bytes()).splitlines())
  for name,mutate,reason in CONTROLS:
   with self.subTest(control=name),tempfile.TemporaryDirectory()as tmp:
    packet=Path(tmp)/'packet';shutil.copytree(HERE,packet);r,rr=copy.deepcopy(report),copy.deepcopy(rows);mutate(r,rr);repin(packet,r,rr)
    with self.assertRaisesRegex(AssertionError,reason):run(packet)
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--repo-root',type=Path,default=ROOT);args,remaining=parser.parse_known_args();ROOT=args.repo_root.resolve();unittest.main(argv=[sys.argv[0],*remaining])
