"""Repinned finite-proof negatives; no VM/compiler or original evidence changes."""
if not __debug__:
    raise SystemExit('Run without -O')
import argparse,base64,contextlib,copy,gzip,hashlib,importlib.util,io,json,shutil,tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
sha = lambda raw: hashlib.sha256(raw).hexdigest()


def run(packet, source=None, images=None):
    spec = importlib.util.spec_from_file_location('creator_binding_check', source or packet/'verify.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    module.ROOT = packet
    module.IMAGE_PATHS = images or {name: REPO/path for name,path in {
        'original':'evidence/original/pump_amm/deployed.so',
        'control':'research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz',
        'candidate':'research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz'}.items()}
    with contextlib.redirect_stdout(io.StringIO()):
        module.main()


def repin(packet, report, receipts):
    start = 0
    for part in report['parts']:
        rows = receipts[start:start+part['count']]
        start += len(rows)
        raw = gzip.compress(b'\n'.join(json.dumps(r).encode() for r in rows)+b'\n',mtime=0)
        (packet/part['file']).write_bytes(raw)
        part['sha256'],part['bytes'] = sha(raw),len(raw)
    (packet/'runtime/report.json.gz').write_bytes(gzip.compress(json.dumps(report).encode(),mtime=0))
    manifest={'files':{p.relative_to(packet).as_posix():sha(p.read_bytes()) for p in sorted(packet.rglob('*')) if p.is_file() and p.name!='MANIFEST.json'}}
    (packet/'MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')


def omit_case(report, receipts):
    source=next(c for c in report['cases'] if c['label']=='set-then-buy')
    target=next(i for i,c in enumerate(report['cases']) if c['label']=='set-then-sell')
    selected=[r for r in receipts if r['case']=='set-then-buy']
    positions=[i for i,r in enumerate(receipts) if r['case']=='set-then-sell']
    assert len(positions)==len(selected)==6
    report['cases'][target]=copy.deepcopy(source)
    for position,row in zip(positions,selected):receipts[position]=copy.deepcopy(row)


def token_delta(report, receipts):
    case=next(c for c in report['cases'] if c['label']=='set-then-buy')
    case['steps'][1]['deltas']['NEW_ATA']+=1


def unsupported_lamport(report, receipts):
    report['cases'][0]['steps'][0]['lamport_deltas']={'invented_account':123}


def disconnected(report, receipts):
    for r in receipts:
        if r['case']=='set-then-buy' and r['step']=='buy':
            key=next(k for k,e in r['before'].items() if e and len(bytes.fromhex(e['data_hex']))==300)
            for side in ('before','after'):
                raw=bytearray.fromhex(r[side][key]['data_hex']);raw[15]^=1;r[side][key]['data_hex']=raw.hex()


def off_wire_role(report, receipts):
    for r in receipts:
        if r['case']=='set-then-buy':
            key=next(k for k,e in r['before'].items() if e and len(bytes.fromhex(e['data_hex']))==300)
            for side in ('before','after'):r[side]['11111111111111111111111111111111']=r[side].pop(key)


def event_discriminator(report, receipts):
    for r in receipts:
        if r['case']=='set-then-buy' and r['step']=='buy':
            raw=bytearray(base64.b64decode(r['events'][0].split('Program data: ')[1]));raw[0]^=1
            new='Program data: '+base64.b64encode(raw).decode();old=r['events'][0]
            r['events']=[new];r['logs']=[new if line==old else line for line in r['logs']]


def unsupported_event(report, receipts):
    report['cases'][0]['steps'][0]['event']['unrecognized_field']=None


def valid_wrong_wire(report, receipts):
    source=next(r for r in receipts if r['case']=='buy-before-set')
    target=next(r for r in receipts if r['case']=='set-then-buy' and r['step']=='set')
    target['transaction_base64']=source['transaction_base64']


def omitted_token_obligation(report, receipts):
    case=next(c for c in report['cases'] if c['label']=='set-then-buy')
    case['steps'][1]['deltas'].pop('NEW_ATA')
    fixture=json.loads((HERE/'fixture-bindings.json').read_text())
    key=fixture['roles']['NEW_ATA']
    import struct
    for rec in receipts:
        if rec['case']=='set-then-buy' and rec['step']=='buy':
            entry=rec['after'][key]
            raw=bytearray.fromhex(entry['data_hex'])
            amount=struct.unpack_from('<Q',raw,64)[0]
            struct.pack_into('<Q',raw,64,amount+1)
            entry['data_hex']=raw.hex()
            entry['lamports']+=1


def omitted_event_obligation(report, receipts):
    case=next(c for c in report['cases'] if c['label']=='set-then-buy')
    case['steps'][1]['event'].pop('creator_fee')
    import struct
    for rec in receipts:
        if rec['case']=='set-then-buy' and rec['step']=='buy':
            old=rec['events'][0]
            raw=bytearray(base64.b64decode(old.split(': ',1)[1]))
            struct.pack_into('<Q',raw,352,5476)
            new='Program data: '+base64.b64encode(raw).decode()
            rec['events']=[new]
            rec['logs']=[new if line==old else line for line in rec['logs']]


CONTROLS=[('omitted family-S case with duplicate valid chain',omit_case,'exact 18-case family and step membership'),
          ('false expected token delta',token_delta,'expected token delta'),
          ('unsupported expected lamport claim',unsupported_lamport,'unsupported expected field'),
          ('coherent disconnected chain',disconnected,'chained account continuity'),
          ('off-wire pool snapshot role',off_wire_role,'fixed watched account roles'),
          ('coherent wrong event discriminator',event_discriminator,'event discriminator and layout'),
          ('different valid signed instruction',valid_wrong_wire,'reviewed signed instruction/account/privilege binding'),
          ('unsupported expected event field',unsupported_event,'unsupported expected event field'),
          ('omitted token obligation with changed native destination amount',omitted_token_obligation,'complete reviewed expected-step obligations'),
          ('omitted event obligation with changed creator fee',omitted_event_obligation,'complete reviewed expected-step obligations')]


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--report',type=Path);args=parser.parse_args()
    run(HERE)
    report=json.loads(gzip.decompress((HERE/'runtime/report.json.gz').read_bytes()));receipts=[]
    for part in report['parts']:receipts += [json.loads(row) for row in gzip.decompress((HERE/part['file']).read_bytes()).splitlines()]
    results=[]
    with tempfile.TemporaryDirectory(prefix='coin-creator-proof-controls-') as directory:
        for i,(name,mutate,expected) in enumerate(CONTROLS):
            packet=Path(directory)/str(i);shutil.copytree(HERE,packet);r,rs=copy.deepcopy(report),copy.deepcopy(receipts);mutate(r,rs);repin(packet,r,rs)
            try:run(packet)
            except SystemExit as error:
                assert expected in str(error),(name,str(error))
                results.append(dict(case=name,rejected=True,reason=str(error)))
            else:raise RuntimeError('Accepted altered proof: '+name)
    result=dict(status='PASS',clean_baseline='18cases117signedreceipts',controls=results,new_VM_or_compiler_executions=0)
    if args.report:
        assert not args.report.resolve().is_relative_to(HERE.resolve()),'external report only'
        args.report.write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result,indent=2))


if __name__=='__main__':main()
