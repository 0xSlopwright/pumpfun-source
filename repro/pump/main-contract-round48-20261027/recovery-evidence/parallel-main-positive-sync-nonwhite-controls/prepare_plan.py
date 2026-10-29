"""Prepare two ordinary false-whitelist controls without constructing a VM."""
from pathlib import Path
import copy, hashlib, json
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
source=R/'work/parallel-main-positive-sync-fixtures/PLAN01.json'
old=json.loads(source.read_text());cases=[]
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
for row in old['cases']:
 if row['name']not in['native-not_whitelisted','token-not_whitelisted']:continue
 c=copy.deepcopy(row);c['name']=row['name']+'-incremented';c['amount']=500000001
 c['expected_post_base_vault_amount']=c['base_vault_amount']+c['amount'];c['expected_post_base_user_amount']=c['base_user_amount']-c['amount']
 c['expected_gross_quote_floor']=c['amount']*c['virtual_quote_reserves']//(c['virtual_token_reserves']+c['amount'])
 c['expected_post_real_quote']=c['real_quote_reserves']-c['expected_gross_quote_floor'];c['expected_post_virtual_quote']=c['virtual_quote_reserves']-c['expected_gross_quote_floor']
 assert not c['whitelist_user']and c['is_mayhem_mode']and not c['expected_sync_update']and 0<c['amount']<c['base_user_amount']
 cases.append(c)
plan={'status':'two_approved_normal_control_definitions_not_executed','scope':'False-whitelist, mode-enabled SellV3 regression controls with one-unit changed sell input to distinguish signed transactions. Original runtime outcomes govern final qualification.','based_on':str(source.relative_to(R)),'based_on_sha256':sha(source),'candidate_sha256':'e7ee643acaa7039dc65fb7ee5dd93e121ec33b0ca4f34b0457a41fbb4a74b764','case_definitions':2,'new_distinct_case_count':None,'cases':cases,'source_inputs':{'work/parallel-main-positive-sync-fixtures/run_cases.py':sha(R/'work/parallel-main-positive-sync-fixtures/run_cases.py')},'constraints':['Preserve all reviewed normal account owners, executable flags, authorities, balances and mint supply; change only the sell amount from 500000000 to 500000001.','Retain the original non-whitelisted Global account unchanged; curve mode stays enabled.','Execute only after the V3 buy/exact eight-case dedup is sealed, against original and exact R47.','Capture exact paired transactions, full prestates, Clock, all outcome fields and logs.','Require no reserve sync and signed-input uniqueness against all prior cases; unresolved collisions remain uncounted.','No RPC, live network or source mutation.']}
(W/'PLAN01.json').write_text(json.dumps(plan,indent=2)+'\n');print(sha(W/'PLAN01.json'))
