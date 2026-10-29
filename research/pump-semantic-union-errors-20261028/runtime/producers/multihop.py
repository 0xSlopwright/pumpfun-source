"""Replay the eight recorded signed AMM-to-Pump transactions on a composed image."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,sys

p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--repo',type=Path,required=True)
p.add_argument('--records',type=Path,required=True)
p.add_argument('--images',type=Path,required=True)
p.add_argument('--candidate',type=Path,required=True)
p.add_argument('--output',type=Path,required=True)
a=p.parse_args();root=a.repo.resolve()
sys.path.insert(0,str(root/'scripts'))
import pump_captured_loader as loader
loader.install()
from solders.account import Account
from solders.clock import Clock
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata
from solders.litesvm import LiteSVM

sha=lambda path:hashlib.sha256(path.read_bytes()).hexdigest()
read=lambda path:json.loads(gzip.decompress(path.read_bytes())if path.suffix=='.gz'else path.read_bytes())
records=read(a.records);pins=read(a.images)
for row in pins.values():
    if sha(root/row['source'])!=row['sha256']:raise ValueError('dependency hash mismatch')
before={str(path):sha(path)for path in [Path(__file__),a.records,a.images,a.candidate,Path(loader.__file__),*(root/row['source']for row in pins.values())]}
fields=['error','events','inner','return_data','after']
rows=[]
for case in records['cases']:
    expected=case['results']['original'];raw=base64.b64decode(expected['transaction_base64'])
    tx=Transaction.from_bytes(raw);tx.verify()
    if not all(tx.verify_with_results()):raise ValueError('signature failed')
    outcomes={}
    for label in ['original','candidate']:
        vm=LiteSVM().with_transaction_history(0)
        vm.set_clock(Clock(100,1234567890,0,0,1234567890))
        for name,pin in pins.items():
            image=a.candidate if name=='pump-original'and label=='candidate'else root/pin['source']
            vm.add_program_from_file(Pubkey.from_string(pin['program_id']),image)
        for address,account in expected['before'].items():
            if account is not None:
                vm.set_account(Pubkey.from_string(address),Account(account['lamports'],bytes.fromhex(account['data_hex']),Pubkey.from_string(account['owner'])))
        if tx.message.recent_blockhash!=vm.latest_blockhash():raise ValueError('fixture blockhash mismatch')
        sent=vm.send_transaction(tx);failed=isinstance(sent,FailedTransactionMetadata);meta=sent.meta()if failed else sent
        encoded=json.loads(meta.to_json());logs=meta.logs()
        got={'error':str(sent.err())if failed else None,'events':[line for line in logs if line.startswith('Program data: ')],
             'inner':encoded['inner_instructions'],'return_data':encoded.get('return_data'),'logs':logs,'after':{}}
        for address in expected['after']:
            account=vm.get_account(Pubkey.from_string(address))
            got['after'][address]=None if account is None else {'lamports':account.lamports,'owner':str(account.owner),'data_hex':bytes(account.data).hex()}
        got['transaction_base64']=expected['transaction_base64'];got['signature_verified']=True
        outcomes[label]=got
    differences=[key for key in fields if outcomes['original'][key]!=outcomes['candidate'][key]]
    saved_differences=[key for key in fields if outcomes['original'][key]!=expected[key]]
    rows.append({'whitelisted':case['whitelisted'],'real_tokens':case['real_tokens'],'amount':case['amount'],
                 'differences':differences,'saved_original_differences':saved_differences,'outcomes':outcomes})
    print(json.dumps({key:rows[-1][key]for key in ['whitelisted','real_tokens','amount','differences','saved_original_differences']}),flush=True)
after={path:sha(Path(path))for path in before}
if before!=after:raise ValueError('bound input changed during replay')
report={'scope':__doc__,'candidate_sha256':sha(a.candidate),'original_sha256':pins['pump-original']['sha256'],
        'case_count':len(rows),'verified_transactions':len(rows)*2,'inputs_sha256':before,'inputs_unchanged':True,
        'loader_loads':loader.LOADS,'compared_fields':fields,'cases':rows,
        'mismatches':[i for i,row in enumerate(rows)if row['differences']or row['saved_original_differences']]}
a.output.write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0))
if len(rows)!=8 or report['mismatches']:raise ValueError('multi-hop comparison failed')
