from pathlib import Path
from collections import Counter
import base64,gzip,hashlib,importlib.util,json,sys
from solders.transaction import Transaction
W=Path(__file__).resolve().parent
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def J(p):
 p=Path(p);b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def verify():
 i=W/'inputs';p=i/'compare_direct.py';s=importlib.util.spec_from_file_location('independent_clean',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
 amm='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';cand=H(W/'candidate.so');orig=H(W/'original.so')
 ids={'6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P':'pump.so','pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'pump_fees.so','TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'token.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'token2022.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'ata.so'};deps={k:H(i/v)for k,v in ids.items()};out={}
 for name,expected in [('trade870',870),('v2-mints',174)]:
  r=J(W/(name+'.json'));obs=J(W/(name+'-transactions.json.gz'));assert r['candidate_sha256']==cand and r['original_sha256']==orig and r['case_count']==len(r['cases'])==expected
  assert obs['observer_sha256']==H(i/'observe_suite.py')
  producer=H(W/'probe_v2_mints.py')if name=='v2-mints'else H(i/'pump_amm_trade_v2_differential.py')
  assert obs['script_sha256']==producer and (r['producer_sha256']if name=='v2-mints'else r['script_sha256'])==producer
  if name=='v2-mints':assert r['comparator_sha256']==H(p)
  else:assert r['harness_sha256']==H(i/'pump_amm_reusable_harness.py')
  bymode=Counter();categories={};sigs=0;rawlogdiff=0
  for idx,row in enumerate(r['cases']):
   mode=row['instruction'];bymode[mode]+=1;assert not row['mismatched_fields']and m.clean(row['original'])==m.clean(row['candidate'])
   pair=obs['transactions'][2*idx:2*idx+2];assert pair[0]['transaction_base64']==pair[1]['transaction_base64'];rawlogdiff+=row['original']['logs']!=row['candidate']['logs']
   for side,t,desired in zip(['original','candidate'],pair,[orig,cand]):
    raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);vv=tx.verify_with_results();assert vv and all(vv)and t['all_signatures_verified']and t['signature_count']==len(vv);sigs+=len(vv)
    assert Hbytes(raw)==t['transaction_sha256']and t['amm_program_sha256']==desired and t['error']==row[side]['error']
    assert t['logs_sha256']==Hbytes(json.dumps(row[side]['logs'],separators=(',',':')).encode())
    for pid,data in t['loaded_programs'].items():assert data['sha256']==(desired if pid==amm else deps[pid])
    selected=[x for x in tx.message.instructions if str(tx.message.account_keys[x.program_id_index])==amm];assert len(selected)==1;payload=bytes(selected[0].data);discriminator=hashlib.sha256(('global:'+mode).encode()).digest()[:8]
    if name=='trade870'and row['case'].startswith('payload-length='):
     length=int(row['case'].split('=')[1]);assert len(payload)==length and payload[:min(8,length)]==discriminator[:min(8,length)]
    else:assert payload[:8]==discriminator
   if name=='v2-mints':
    counter=categories.setdefault(mode,Counter());logs=row['original']['logs'];error=row['original']['error']
    if error is None:counter['success']+=1
    elif any('utils/transfer_fee.rs'in z and 'Error Number: 6007.'in z for z in logs):counter['from_mint_6007']+=1
    elif any('utils/transfer_fee.rs'in z and 'Error Number: 6023.'in z for z in logs):counter['later_fee_6023']+=1
    else:counter['other_error']+=1
  assert set(bymode)=={'buy_v2','buy_exact_quote_in_v2','sell_v2'}and set(bymode.values())=={expected//3};assert sigs==obs['signature_count']==2*expected
  if name=='v2-mints':assert all(dict(v)=={'other_error':28,'success':12,'from_mint_6007':16,'later_fee_6023':2}for v in categories.values())
  out[name]={'cases':expected,'signature_fields':sigs,'by_mode':dict(bymode),'categories':{k:dict(v)for k,v in categories.items()},'raw_log_different_pairs':rawlogdiff,'normalized_mismatches':0}
 return {'passed':True,'candidate_sha256':cand,'suites':out,'scope':'Every saved signature, AMM instruction discriminator, image, complete available outcome and normalized diagnostic comparison checked; raw logs are not asserted equal. No VM execution.'}
def Hbytes(b):return hashlib.sha256(b).hexdigest()
if __name__=='__main__':print(json.dumps(verify(),indent=2))
