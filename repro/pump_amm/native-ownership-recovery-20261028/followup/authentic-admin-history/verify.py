"""Verify retained public RPC messages and the bounded decoder replay; no RPC/VM."""
from pathlib import Path,PurePosixPath
import base64,gzip,hashlib,json
from solders.transaction import VersionedTransaction
W=Path(__file__).resolve().parent
ADMIN='8LWu7QM2dGR1G8nKDHthckea57bkCzXyBTAKPJUBDHo8'
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
SIG='2gNxbFQQmCsMaq7QYZkBxgeb2fcy5rsvQV9Mv9LzzoMtek9NbNWDzqqDcd4kfu8VeZFrf5FMqdeVw2YDpwJJYZTN'
def sha(b):return hashlib.sha256(b).hexdigest()
def js(p):return json.loads(Path(p).read_bytes())
def verify(root=None):
    w=Path(__file__).resolve().parent;m=js(w/'manifest.json')
    assert set(m['files'])|{'manifest.json'}=={p.relative_to(w).as_posix()for p in w.rglob('*')if p.is_file()and'__pycache__'not in p.parts}
    for n,h in m['files'].items():
        p=PurePosixPath(n);assert not p.is_absolute()and'..'not in p.parts
        assert sha((w/n).read_bytes())==h
    request=js(w/'rpc-request.json');assert request['endpoint']=='https://api.mainnet-beta.solana.com'
    first=js(w/'rpc-response.json')['result'];assert len(first)==100
    rows=list(first);previous=first[-1]['signature']
    pages=js(w/'older-status.json')['pages'];assert len(pages)<=3
    for page in pages:
        i=page['page'];q=js(w/f'older-{i}-request.json')['request'];r=js(w/f'older-{i}-response.json')['result']
        assert q['method']=='getSignaturesForAddress'and q['params'][0]==ADMIN and q['params'][1]['limit']==100
        assert q['params'][1]['before']==previous and len(r)<=100
        rows.extend(r);previous=r[-1]['signature']
    assert len(rows)==289 and len({r['signature']for r in rows})==289
    assert rows[-1]['blockTime']<1740787200
    successful={r['signature']for r in rows if r['err']is None}
    indices=js(w/'public-transaction-index.json')+js(w/'older-transaction-index.json')
    assert {r['signature']for r in indices}==successful and len(indices)==18
    signed_admin=0;amm_transactions=0
    for entry in indices:
        sig=entry['signature'];req=js(w/'transactions'/(sig+'.request.json'))
        assert req['method']=='getTransaction'and req['params'][0]==sig
        r=js(w/'transactions'/(sig+'.response.json'))['result'];raw=base64.b64decode(r['transaction'][0])
        tx=VersionedTransaction.from_bytes(raw);assert all(tx.verify_with_results())and str(tx.signatures[0])==sig
        keys=list(map(str,tx.message.account_keys));signers=keys[:tx.message.header.num_required_signatures]
        signed_admin+=ADMIN in signers
        loaded=r['meta'].get('loadedAddresses',{});keys+=loaded.get('writable',[])+loaded.get('readonly',[])
        amm_transactions+=any(keys[ix.program_id_index]==AMM for ix in tx.message.instructions)
        assert r['meta']['err']is None
    r=js(w/'transactions'/(SIG+'.response.json'))['result'];raw=base64.b64decode(r['transaction'][0]);tx=VersionedTransaction.from_bytes(raw)
    keys=list(map(str,tx.message.account_keys));assert ADMIN in keys[:tx.message.header.num_required_signatures]
    ix=tx.message.instructions[0];assert keys[ix.program_id_index]==AMM and len(ix.data)==280
    declaration=next(i for i in js(w/'inputs/pump_amm.json')['instructions']if i['name']=='create_config')
    assert bytes(ix.data)[:8]==bytes(declaration['discriminator'])
    assert [v['name']for v in declaration['args']]==['lp_fee_basis_points','protocol_fee_basis_points','protocol_fee_recipients','coin_creator_fee_basis_points','admin_set_coin_creator_authority']
    replay=js(w/'historical-replay.json');assert replay['transaction_sha256']==sha(raw)
    assert replay['all_original_signatures_verified']and replay['signature_verification_enabled']and not replay['message_changed']
    assert replay['blockhash_expiry_check_enabled']is False and replay['historical_full_prestate_available']is False
    hashes={'original':sha(gzip.decompress((w/'inputs/original.so.gz').read_bytes())),'h14':sha(gzip.decompress((w/'inputs/h14.so.gz').read_bytes()))}
    for run in replay['runs']:
        assert run['program_sha256']==hashes[run['label']]
        assert run['error']=='TransactionErrorInstructionError((0, Tagged(InstructionErrorCustom(102))))'
    assert replay['runs'][0]['logs']==replay['runs'][1]['logs']
    return {'passed':True,'signature_pages':len(pages)+1,'signatures_listed':len(rows),'successful_transactions_verified':18,
        'fixed_admin_signed_transactions':signed_admin,'amm_transactions':amm_transactions,
        'create_config_signature':SIG,'historical_payload_bytes':280,'current_payload_bytes':320,
        'current_successful_create_config_validated':False,'current_original_and_candidate_error':102,
        'full_historical_prestate_available':False,'network_or_vm_executed':False,'manifest_sha256':sha((w/'manifest.json').read_bytes())}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
