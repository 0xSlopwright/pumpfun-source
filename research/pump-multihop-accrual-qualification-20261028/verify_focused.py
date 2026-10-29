#!/usr/bin/env python3
"""Independently validate selected-image focused observations, real signatures and captured loaders."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,re,struct,sys
if not __debug__:raise SystemExit('Optimized Python is unsupported; run without -O.')
sys.dont_write_bytecode=True
from solders.transaction import VersionedTransaction
P=Path(__file__).resolve().parent;R=P.parents[1];sha=lambda b:hashlib.sha256(b).hexdigest()
def read(p):
 raw=p.read_bytes();return json.loads(gzip.decompress(raw)if raw.startswith(b'\x1f\x8b')else raw)
def doc(p):return read(p)
def require(ok,why):
 if not ok:raise ValueError(why)
a=argparse.ArgumentParser();a.add_argument('--reports',type=Path,default=P/'runtime/focused');a.add_argument('--candidate',type=Path,default=P/'artifacts/candidate.so');args=a.parse_args();O=args.reports.resolve();candidate=args.candidate.read_bytes();expected=read(P/'builds/primary/build-comparison.json')['comparison']['candidate_sha256'];assert sha(candidate)==expected
execution=read(O/'execution.json');assert len(execution['runs'])==6 and all(r['returncode']==0 and r['candidate_sha256']==expected and sha((R/r['producer']).read_bytes())==r['producer_sha256']for r in execution['runs'])
# Strict replay receipts have no filename or coordinate substitution.
focused=read(O/'create-runtime.json.gz');assert focused['source_coordinate_normalization']is None;ftx=fsig=0;cases=0;messages=lambda q:[s for s in q['logs']if s.startswith(('Program log: ','Program data: '))]
for row in focused['cases']:
 outcomes=row['results'];a,b=outcomes['original'],outcomes['candidate'];assert messages(a)==messages(b)
 for k in ['before','after','error','events','inner','return']:assert a[k]==b[k]
 for outcome in outcomes.values():
  tx=VersionedTransaction.from_bytes(base64.b64decode(outcome['transaction_base64'],validate=True));assert all(tx.verify_with_results());ftx+=1;fsig+=len(tx.signatures)
 cases+=1
assert cases==14 and ftx==42 and fsig==84
for row in focused['families'].values():assert row['images_sha256']['candidate']==sha(candidate)and not row['structured_mismatches']['candidate']and not row['strict_ordered_program_message_mismatches']['candidate']
S=O/'sibling-focused';units=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$');ordered=lambda q:[s for s in q['logs']if not units.fullmatch(s)]
for name,count in [('shared-buyback',20),('cost-overflow',6),('cashback',18),('cto',5),('shared-holder',12)]:
 report=read(S/(name+'.json.gz'));assert len(report['cases'])==count
 for row in report['cases']:
  if name=='shared-buyback':outcomes={k:row[k]for k in ['original','control','candidate']};a,b=outcomes['original'],outcomes['candidate'];fields=['error','accounts','inner_instructions','event_payloads','return_data'];assert ordered(a)==ordered(b)
  elif name=='cost-overflow':outcomes=row['runs'];a,b=outcomes['original'],outcomes['proposal'];fields=['error','accounts','inner_instructions','event_payloads','return_data'];assert ordered(a)==ordered(b)
  else:outcomes={k:row[k]for k in ['original','baseline','candidate']};a,b=outcomes['original'],outcomes['candidate'];fields=['error','accounts','events','inner','return_data']if name=='cashback'else['error','before','after','events','inner','return'];assert messages(a)==messages(b)
  for k in fields:assert a[k]==b[k]
  for outcome in outcomes.values():
   tx=VersionedTransaction.from_bytes(base64.b64decode(outcome['transaction_base64'],validate=True));assert all(tx.verify_with_results());ftx+=1;fsig+=len(tx.signatures)
  cases+=1
assert cases==75 and ftx==225 and fsig==318
admin=read(O/'admin-wallet.json.gz');assert len(admin['cases'])==18 and len(admin['baseline_mismatches'])==8 and not admin['candidate_mismatches']and expected in admin['inputs'].values()
for row in admin['cases']:
 left,right=row['original'],row['candidate'];assert messages(left)==messages(right)
 for k in ['error','before','after','events','inner','return']:assert left[k]==right[k]
 for result in [left,row['baseline'],right]:
  tx=VersionedTransaction.from_bytes(base64.b64decode(result['transaction_base64'],validate=True));assert all(tx.verify_with_results())and not result['pool_authority_top_level_signer'];ftx+=1;fsig+=len(tx.signatures)
 cases+=1
assert(cases,ftx,fsig)==(93,279,426)
legacy=read(O/'legacy284.json.gz');assert len(legacy['cases'])==284 and not legacy['mismatches']and legacy['candidate_sha256']==expected
legacy_txs=legacy_sigs=0
for row in legacy['cases']:
 left,right=row['original'],row['candidate'];assert messages(left)==messages(right)
 for k in ['error','accounts','before','events','return_data','inner']:assert left[k]==right[k]
 for result in [left,right]:
  tx=VersionedTransaction.from_bytes(base64.b64decode(result['transaction_base64'],validate=True));assert all(tx.verify_with_results());legacy_txs+=1;legacy_sigs+=len(tx.signatures)
assert legacy_txs==legacy_sigs==568
CU=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
def check_focused(report):
 from solders.transaction import Transaction
 dependencies=doc(P/'historical/multi-hop-dependencies.json')
 for value in dependencies.values():require(sha((R/value['path']).read_bytes())==value['sha256'],'captured dependency bytes differ')
 expected={'tokenkeg_sell_control':None,'tokenkeg_buy_control':None,'truncated_fee_config':6063,'short_tlv_header':2006,'no_extension_wrong_address':'InvalidAccountData','valid_zero_fee_wrong_address':2006,'valid_fee_wrong_address':2006,'native_quote_address_control':2006,'valid_fee_quote_owner_control':6010,'truncated_fee_before_quote_owner':6063,'token2022_zero_fee_sell':None,'token2022_capped_fee_sell':None,'token2022_capped_fee_buy':None}
 require(len(report['cases'])==13 and {x['case']['name']for x in report['cases']}==set(expected),'focused corpus incomplete')
 for row in report['cases']:
  runs,obs=row['runs'],row['observations'];name=row['case']['name'];require(set(runs)==set(obs)=={'original','parent','proposal'},'triple missing')
  require(len({x['transaction_base64']for x in runs.values()})==1,'transaction input differs')
  require(obs['original']['before']==obs['parent']['before']==obs['proposal']['before'],'before account observations differ')
  for label,run in runs.items():
   programs={pid:value['sha256']for pid,value in dependencies.items()};programs['6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P']=report['images_sha256'][label]
   require(run['program_sha256']==programs,'declared dependency image differs')
   actual=obs[label]['program_loads'];require(len(actual)==6 and {x['program']:x['sha256']for x in actual}==programs,'actual dependency load differs')
   raw=base64.b64decode(run['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);require(bytes(tx)==raw and all(tx.verify_with_results())and len(tx.signatures)==1,'invalid outer signature')
   require(obs[label]['transaction_base64']==run['transaction_base64']and obs[label]['signatures_verified'],'transaction observation binding')
   require(obs[label]['metadata']['logs']==run['logs']and obs[label]['metadata'].get('return_data')==run['return_data'],'raw metadata binding')
   loads=obs[label]['loads'];require(len(loads)==1 and loads[0]['elf_sha256']==report['images_sha256'][label]and loads[0]['elf_prefix_unchanged']and loads[0]['zero_allocation_tail'],'actual captured loader binding')
  for key in ['error','events','inner','return_data','before','after','transaction_base64','pump_calls','token_calls']:
   require(runs['original'][key]==runs['proposal'][key],name+': '+key+' differs')
  logs=lambda k:[s for s in runs[k]['logs']if not CU.fullmatch(s)]
  require(logs('original')==logs('proposal'),name+': ordered diagnostic differs')
  want=expected[name];error=runs['original']['error']
  actual=re.search(r'InstructionErrorCustom\((\d+)\)',str(error))
  require(error is None if want is None else ('Fieldless(InvalidAccountData)'in str(error)if isinstance(want,str)else actual is not None and int(actual.group(1))==want),name+': original outcome changed')
  if want==6063:
   require(any('programs/pump/src/util/transfer_fee.rs:31.'in s for s in runs['original']['logs']),'fee decoder Source31 not reached')
   require(('2006'in str(runs['parent']['error']))if name=='truncated_fee_config'else('6010'in str(runs['parent']['error'])),'parent priority counterexample absent')
  if name in ['short_tlv_header','valid_zero_fee_wrong_address','valid_fee_wrong_address']:
   require(any('programs/pump/src/buy_v2.rs:55.'in s for s in runs['original']['logs']),'shared admission Source55 not reached')
  if name=='valid_fee_quote_owner_control':require(any('programs/pump/src/buy_v2.rs:81.'in s for s in runs['original']['logs']),'shared admission Source81 not reached')
  if name=='native_quote_address_control':require(any('multi_hop_curve_swap.rs:369.'in s for s in runs['original']['logs']),'native quote address guard absent')
  if row['case'].get('token2022_flow'):
   amounts=[]
   for account in runs['original']['after'].values():
    if account and account['owner']=='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':
     b=bytes.fromhex(account['data_hex'])
     if len(b)==178:amounts.append(struct.unpack_from('<Q',b,170)[0])
   require(sorted(amounts)==([0,100]if row['case'].get('bps')else[0,0]),'actual Token-2022 withheld amount differs')
 return 39

multi=read(O/'multihop.json.gz');assert multi['images_sha256']['proposal']==expected;assert check_focused(multi)==39
for row in multi['cases']:
 for run in row['runs'].values():
  tx=VersionedTransaction.from_bytes(base64.b64decode(run['transaction_base64'],validate=True));assert all(tx.verify_with_results());ftx+=1;fsig+=len(tx.signatures)
 cases+=1
assert(cases,ftx,fsig)==(106,318,465)
ext=read(O/'extensions.json.gz');assert len(ext['cases'])==ext['case_count']==126 and not ext['mismatches']and ext['candidate_sha256']==expected
ext_tx=ext_sig=0
for row in ext['cases']:
 left,right=row['original'],row['candidate']
 for k in ['error','accounts','inner_instructions','event_payloads','return_data','transaction_base64']:assert left[k]==right[k]
 for result in [left,right]:
  tx=VersionedTransaction.from_bytes(base64.b64decode(result['transaction_base64'],validate=True));assert all(tx.verify_with_results());ext_tx+=1;ext_sig+=len(tx.signatures)
assert ext_tx==ext_sig==252
loads=0
for path in list((O/'sibling-focused').glob('*-loader.json'))+list(O.glob('*-loader.json')):
 items=read(path)['loads'];assert any(x['elf_sha256']==expected for x in items);assert all(x['elf_prefix_unchanged']and x['zero_allocation_tail']and x['program_bytes']==36 and x['programdata_bytes']==10485760 for x in items);loads+=len(items)
print(json.dumps({'candidate_sha256':expected,'strict_case_records':cases,'strict_outcome_executions':ftx,'strict_signature_fields_verified':fsig,'legacy_case_pairs':284,'legacy_signature_fields_verified':legacy_sigs,'extension_case_pairs':126,'extension_signature_fields_verified':ext_sig,'captured_loader_loads':loads,'multihop_strict_captured_executions':39,'source_normalization':None,'all_selected_observation_differences':0},indent=2))
