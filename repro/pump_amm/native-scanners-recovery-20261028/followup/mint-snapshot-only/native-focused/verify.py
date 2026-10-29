"""Independently check the fresh-VM full-message receipts and actual ELF loads."""
from pathlib import Path
from collections import Counter
import ast, base64, gzip, hashlib, json, re, struct
from solders.transaction import Transaction
HERE=Path(__file__).resolve().parent
ROOT=HERE.parent/'native-inputs'
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
def sha(b):return hashlib.sha256(b).hexdigest()
def raw_norm(logs):return [x for x in logs if not re.fullmatch(r'Program \S+ consumed \d+ of \d+ compute units',x)]
def norm(logs):return [re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',x) for x in raw_norm(logs)]
def comparable(r):
    meta=dict(r['metadata']);meta.pop('compute_units_consumed');meta['logs']=norm(meta['logs'])
    return {k:r[k] for k in ('before','after','transaction_sha256','clock','error')}|{'metadata':meta}
def verify(hashes):
    report=json.loads(gzip.decompress((HERE/'report.json.gz').read_bytes()))
    data=(HERE/'raw-transactions.jsonl.gz').read_bytes()
    receipts=[json.loads(line) for line in gzip.decompress(data).splitlines()]
    images=dict(original=hashes['original'],control=hashes['baseline'],candidate=hashes['candidate'])
    assert report['image_sha256']==images and report['fresh_vm_environment']=='1'
    assert report['transaction_receipts']['sha256']==sha(data)
    assert report['counts']==dict(vms=648,transactions=648,signature_fields=648)
    assert report['case_count']==len(report['cases'])==216 and len(receipts)==648 and report['mismatches']==[41,42,43,44,45,46,89,90,91,92,93,94,154,155]
    assert [r['vm'] for r in receipts]==list(range(648))
    for name,digest in report['input_sha256'].items():assert sha((ROOT/name).read_bytes())==digest,name
    tree=ast.parse((ROOT/'research/amm-native-transfer-fee-recovery/focused.py').read_text());scope={'struct':struct}
    definitions=[n for n in tree.body if isinstance(n,ast.FunctionDef)and n.name in ['config','extension','cases']]
    assert len(definitions)==3;exec(compile(ast.Module(body=definitions,type_ignores=[]),'<native-focused-cases>','exec'),scope);cases=scope['cases']()
    assert [{**v,**({'tlv':v['tlv'].hex()} if 'tlv' in v else {})} for v in cases]==[r['case'] for r in report['cases']]
    fixture=json.loads((ROOT/'research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json').read_text())
    failed=0;seen=Counter()
    for i,r in enumerate(receipts):
        index,which=divmod(i,3);image=('original','control','candidate')[which];case=report['cases'][index]['case']
        assert r['sequence']==i and r['context']==dict(index=index,image=image,instruction=case['instruction'],mint=case['mint'],label=case['label'])
        raw=base64.b64decode(r['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw)
        assert bytes(tx)==raw and all(tx.verify_with_results()) and len(tx.verify_with_results())==r['signature_fields']==1
        assert r['all_signatures_verified'] and sha(raw)==r['transaction_sha256']
        assert [str(x) for x in tx.signatures]==r['signatures']
        assert r['metadata']['signature']==r['signatures'][0]
        loaded=r['loaded_programs'];assert loaded[AMM]['sha256']==images[image]
        for key,program in loaded.items():
            if key!=AMM:
                assert '/evidence/' in program['path']
                name='evidence/'+program['path'].split('/evidence/',1)[1]
                assert sha((ROOT/name).read_bytes())==program['sha256']
        assert len(loaded)==3
        assert r['clock']['epoch']==case.get('epoch',0)
        key=fixture['keys'][case['mint']+'_mint'];mint=r['before'][key]
        assert mint['owner']=='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        expected=bytearray(base64.b64decode(fixture['accounts'][case['mint']+'_mint']['data_base64'])[:82])
        if 'size' in case:expected=(expected+bytes(max(0,case['size']-82)))[:case['size']]
        else:expected+=bytes(83)+bytes([case.get('account_type',1)])+bytes.fromhex(case['tlv'])
        if 'padding' in case:expected[82]=case['padding']
        assert mint['data_hex']==expected.hex()
        value=report['cases'][index][image]
        assert value['error']==r['error'] and value['logs']==r['metadata']['logs']
        assert value['inner_instructions']==r['metadata']['inner_instructions']
        for key,state in value['accounts'].items():
            assert state=={f:r['after'][key][f] for f in ('owner','lamports','data_hex')}
        if r['error'] is not None:
            failed+=1;payer=str(tx.message.account_keys[0])
            assert r['before'].keys()==r['after'].keys()
            assert all(r['before'][k]==r['after'][k] for k in r['before'] if k!=payer)
            a,b=dict(r['before'][payer]),dict(r['after'][payer])
            assert a.pop('lamports')-b.pop('lamports')==r['payer_fee_lamports']==5000
            assert a==b and r['rollback_except_payer_fee'] is True
        else:assert r['rollback_except_payer_fee'] is None
        seen[image]+=1
    raw_bad=[]
    for i,row in enumerate(report['cases']):
        a,b,c=receipts[i*3:i*3+3];assert comparable(a)==comparable(b)==comparable(c),i
        def raw_comparable(q):
            v=comparable(q);v['metadata']['logs']=raw_norm(q['metadata']['logs']);return v
        original_equal=raw_comparable(a)==raw_comparable(c);control_equal=raw_comparable(b)==raw_comparable(c)
        assert row['original_candidate_equal']==original_equal and row['control_candidate_equal']==control_equal
        if not original_equal or not control_equal:raw_bad.append(i)
    assert raw_bad==report['mismatches']
    assert seen==Counter({k:216 for k in images}) and failed==102
    counts=Counter(row['classification'] for row in report['cases'])
    assert dict(counts)==report['classifications']=={'success':182,'account-validation-before-helper':20,'target-UnsupportedQuoteMint-6007':12,'other-rejection-review-logs':2}
    assert all(row['original']['error'] is None for row in report['cases'] if row['classification']=='success')
    assert len(report['epoch_selection_evidence'])==6
    for v in report['epoch_selection_evidence']:
        assert v['older_user_quote']-v['newer_at_user_quote']==16 and v['newer_at_user_quote']==v['newer_after_user_quote']
    return {'passed':True,'cases':216,'signed_executions':648,'signature_fields':648,'failed_rollback_receipts':102,'normalized_mismatches':0,'raw_source_coordinate_differences':14,'candidate_sha256':hashes['candidate'],'scope':'96 decoder plus120 fee arithmetic controls over bounded valid bps and amounts. 14 raw source-coordinate log differences are preserved. Only compute and Source coordinates are normalized. No bps>10000 or near-u64max amount claim.','executes_vm':False}

if __name__=='__main__':
    print(json.dumps(verify({'original':sha((ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()),'baseline':'98ed250d3999e79b55683daa574b984fb7f650dc9eef0e3256671d0612b49fc3','candidate':sha((HERE.parent/'build/artifacts/pump_amm_recovered.so').read_bytes())}),indent=2))
