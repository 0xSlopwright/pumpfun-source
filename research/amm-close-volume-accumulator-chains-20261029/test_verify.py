"""Pure retained-data controls; no producer, compiler or VM execution."""
if not __debug__:
    raise SystemExit('Run without -O')
import argparse, base64, copy, gzip, hashlib, json, shutil, struct, subprocess, sys, tempfile, unittest
from pathlib import Path
sys.dont_write_bytecode = True
HERE=Path(__file__).resolve().parent
REPO=HERE.parents[1]
USER='5jotNjSnm9ZJRefVfqHato9FC4d9t6CHb2xS1726MTyY'
UVA='7SAc5aXoXiRQeoXMnhmw7ZhAh9oZFdH8LqjtAoJqHuQJ'
VAULT='7JNa83v1DoTyjp2ag1pfzjaNxX7Q2PtkwLrzC1dR6NUw'
def sha(raw):return hashlib.sha256(raw).hexdigest()
def duplicate(report,rows):report['cases'][1]=copy.deepcopy(report['cases'][0])
def wrong_wire(report,rows):
    wire=next(r['transaction_base64']for r in rows if r['case']=='c-close-then-claim'and r['step']=='claim')
    for row in rows:
        if row['case']=='c-close-then-sync'and row['step']=='sync':row['transaction_base64']=wire
def image(report,rows):report['input_sha256']['control']='0'*64
def chain(report,rows):
    for row in rows:
        if row['case']=='c-close-init-claim10'and row['step']=='claim':
            row['before'][USER]['lamports']+=1;row['after'][USER]['lamports']+=1
def token(report,rows):
    report['cases'][0]['steps'][0]['vault']+=1
    for row in rows:
        if row['case']=='c-close-seeded':
            for side in ['before','after']:
                entry=row[side][VAULT];raw=bytearray.fromhex(entry['data_hex']);struct.pack_into('<Q',raw,64,10**9+1);entry['data_hex']=raw.hex()
def event(report,rows):
    for row in rows:
        if row['case']=='c-close-seeded':row['events']=['Program data: ZGV0YWNoZWQ=']
def owner(report,rows):
    for row in rows:
        if row['case']=='c-close-then-init'and row['step']=='init':row['after'][UVA]['owner']='11111111111111111111111111111111'
def prestate(report,rows):
    for row in rows:
        if row['case']=='c-close-seeded':
            entry=row['before'][UVA];raw=bytearray.fromhex(entry['data_hex']);struct.pack_into('<Q',raw,41,501);entry['data_hex']=raw.hex()
def omitted_token_obligation(report,rows):
    token(report,rows);del report['cases'][0]['steps'][0]['vault']
def omitted_event_member(report,rows):
    del report['cases'][0]['steps'][0]['event']['unc']
    for row in rows:
        if row['case']=='c-close-seeded':
            for index,line in enumerate(row['logs']):
                if line.startswith('Program data: '):
                    raw=bytearray(base64.b64decode(line.split('Program data: ',1)[1]));struct.pack_into('<Q',raw,48,501);row['logs'][index]='Program data: '+base64.b64encode(raw).decode()
            row['events']=[line for line in row['logs']if line.startswith('Program data: ')]
CONTROLS=[('omitted case through duplicate expectation',duplicate,'exact source-owned case expectations'),('valid wrong signed operation',wrong_wire,'signed instruction/accounts/privileges'),('unbound image declaration',image,'authenticated historical image declarations'),('broken chain with preserved payer delta',chain,'chained before/after continuity'),('unsupported token delta and expectation',token,'exact source-owned case expectations'),('detached event field',event,'event/log payload join'),('wrong accumulator owner',owner,'source-owned full state/delta transition'),('wrong source-owned initial accumulator',prestate,'source-owned initial prestate'),('omitted token obligation with coherent state change',omitted_token_obligation,'exact source-owned case expectations'),('omitted event member with coherent encoded payload',omitted_event_member,'exact source-owned case expectations')]
def reseal(packet,mutate):
    report=json.loads(gzip.decompress((packet/'runtime/report.json.gz').read_bytes()))
    rows=[json.loads(line)for part in report['parts']for line in gzip.decompress((packet/part['file']).read_bytes()).splitlines()if line]
    mutate(report,rows);start=0
    for part in report['parts']:
        chunk=rows[start:start+part['count']];start+=part['count'];raw=gzip.compress((''.join(json.dumps(r)+'\n'for r in chunk)).encode(),mtime=0);(packet/part['file']).write_bytes(raw);part['sha256']=sha(raw);part['bytes']=len(raw)
    (packet/'runtime/report.json.gz').write_bytes(gzip.compress(json.dumps(report,indent=2).encode(),mtime=0))
    manifest={'files':[dict(path=f.relative_to(packet).as_posix(),sha256=sha(f.read_bytes()),bytes=f.stat().st_size)for f in sorted(packet.rglob('*'))if f.is_file()and f.relative_to(packet).as_posix()!='MANIFEST.json']}
    (packet/'MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
def run(packet):return subprocess.run([sys.executable,'-B',str(packet/'verify.py'),'--repo-root',str(REPO)],capture_output=True,text=True)
class SavedEvidenceTests(unittest.TestCase):
    def test_clean(self):
        result=run(HERE);self.assertEqual(result.returncode,0,result.stderr)
    def test_resealed_corruptions(self):
        for name,mutate,reason in CONTROLS:
            with self.subTest(control=name),tempfile.TemporaryDirectory()as temp:
                packet=Path(temp)/'packet';shutil.copytree(HERE,packet);reseal(packet,mutate);result=run(packet);self.assertNotEqual(result.returncode,0);self.assertIn(reason,result.stderr)
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--repo-root',type=Path,default=REPO);args,rest=parser.parse_known_args();REPO=args.repo_root.resolve();unittest.main(argv=[sys.argv[0],*rest])
