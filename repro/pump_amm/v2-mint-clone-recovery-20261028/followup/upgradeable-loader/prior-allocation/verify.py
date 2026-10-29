"""Read-only audit of synthetic CPI executable-account allocation costs."""
from pathlib import Path
import base64,gzip,hashlib,importlib.util,json,re,struct,tomllib
from solders.transaction import Transaction
from solders.pubkey import Pubkey
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';PUMP='6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';BAD=[19,20,22,23]
def H(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def J(p):
 p=Path(p);return json.loads(gzip.decompress(p.read_bytes())if p.suffix=='.gz'else p.read_bytes())
def clean(x):return dict(x,logs=[re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',s)for s in x['logs']if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',s)])
def extent(b):
 ph,sh=struct.unpack_from('<QQ',b,32);pes,pn,ses,sn=struct.unpack_from('<HHHH',b,54);ends=[64,ph+pes*pn,sh+ses*sn]
 for i in range(pn):
  a=struct.unpack_from('<IIQQQQQQ',b,ph+i*pes);ends.append(a[2]+a[5])
 for i in range(sn):
  a=struct.unpack_from('<IIQQQQIIQQ',b,sh+i*ses)
  if a[1]!=8:ends.append(a[4]+a[5])
 return max(ends)
def profile(row):
 r=[]
 for line in row['logs']:
  m=re.fullmatch(r'Program (\w+) consumed (\d+) of (\d+) compute units',line)
  if m:r.append((m[1],int(m[2]),int(m[3])))
 return r
def verify(root=None):
 w=Path(root or Path(__file__).resolve().parent);files=J(w/'manifest.json')['files'];assert files=={str(p.relative_to(w)):H(p)for p in w.rglob('*')if p.is_file()and p!=w/'manifest.json'}
 d=w/'baseline-policy';spec=importlib.util.spec_from_file_location('baseline_policy',d/'verify.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);baseline=module.verify(d)
 assert baseline['default_budget_real_resource_mismatches']==4 and baseline['high_budget_mismatches']==0
 c=H(w/'candidate.so');assert c==baseline['candidate_sha256']=='dbb5dcfd1a1487e22d61ae68d22a9b74087b78a868a08ab974c7bdbb127f1500'
 raw=J(d/'report.json');high=J(d/'highbudget-report.json');original=raw['original_sha256'];b=(d/'programs'/f'{original}.so').read_bytes();candidate=(w/'candidate.so').read_bytes();assert len(b)==10485715 and len(candidate)==1294536
 cap=J(w/'capture/capture.json');pa=(w/'capture/program-account.bin').read_bytes();pd=(w/'capture/programdata-account.bin').read_bytes();assert H(w/'capture/program-account.bin')==cap['program_sha256']and H(w/'capture/programdata-account.bin')==cap['programdata_sha256'];assert cap['owner']=='BPFLoaderUpgradeab1e11111111111111111111111'and len(pa)==36 and struct.unpack_from('<I',pa)[0]==2 and str(Pubkey.from_bytes(pa[4:]))==cap['programdata'];assert len(pd)==10485760 and struct.unpack_from('<I',pd)[0]==3 and struct.unpack_from('<Q',pd,4)[0]==cap['last_deploy_slot']and pd[45:]==b
 assert extent(b)==1268504 and not any(b[extent(b):]);assert extent(candidate)==len(candidate)
 observed=J(w/'account-data-cost.json');assert observed['solders_version']=='0.27.1'and observed['cpi_bytes_per_unit']==250
 assert [x['account_data_bytes']for x in observed['accounts']]==[len(b),len(candidate)]and all(x['executable']and x['owner']=='BPFLoader2111111111111111111111111111111111'for x in observed['accounts'])
 lock=tomllib.loads((w/'versioned-runtime/solders-Cargo.lock').read_text());versions={p['name']:p['version']for p in lock['package']};assert versions['agave-syscalls']==versions['solana-program-runtime']=='3.0.4'and versions['litesvm']=='0.8.0';native=(w/'versioned-runtime/solders.abi3.so').read_bytes();assert b'agave-syscalls-3.0.4/src/cpi.rs'in native and b'litesvm-0.8.0/src/lib.rs'in native
 code=(w/'versioned-runtime/agave-cpi.rs').read_text();a=code.index('if callee_account.is_executable()');fragment=code[a:a+600];assert 'callee_account.get_data().len()'in fragment and '.checked_div(invoke_context.get_execution_cost().cpi_bytes_per_unit)'in fragment
 assert re.search(r'cpi_bytes_per_unit:\s*250', (w/'versioned-runtime/agave-execution-budget.rs').read_text())
 sources=J(w/'versioned-runtime/sources.json');assert all(H(w/'versioned-runtime'/name)==v['sha256']for name,v in sources.items())
 cost=len(b)//250-len(candidate)//250;assert cost==36764
 table=[]
 for i in BAD:
  o,p=profile(high['cases'][i]['original']),profile(high['cases'][i]['candidate']);om=next(x for x in reversed(o)if x[0]==AMM);pm=next(x for x in reversed(p)if x[0]==AMM);op=next(x for x in reversed(o)if x[0]==PUMP);pp=next(x for x in reversed(p)if x[0]==PUMP)
  assert om[1]-pm[1]==14 and pm[2]-om[2]==cost and op[1]-pp[1]==cost+14
  table.append({'case':i,'original_amm_units':om[1],'candidate_amm_units':pm[1],'entry_budget_gap':cost,'outer_total_gap':op[1]-pp[1]})
 signatures=0;results={};index=J(d/'program-index.json');program_bytes={original:b,c:candidate}
 for mode,length in [('small',len(candidate)),('large',len(b))]:
  r=J(w/'control'/f'{mode}-report.json');obs=J(w/'control'/f'{mode}-transactions.json.gz');assert r['candidate_sha256']==c and r['original_sha256']==original and r['allocation_bytes']==length and r['case_count']==24 and r['mismatch_count']==0
  assert r['producer_sha256']==obs['script_sha256']==H(w/'control/probe.py');assert obs['transaction_count']==48 and len(r['account_allocation_evidence'])==48
  for i,row in enumerate(r['cases']):
   assert row['input']==raw['cases'][i]['input']and clean(row['original'])==clean(row['candidate'])and not row['different_fields']
   pair=obs['transactions'][2*i:2*i+2];assert pair[0]['transaction_base64']==pair[1]['transaction_base64']==row['original']['transaction_base64']==row['candidate']['transaction_base64']
   for side,t,e in zip(['original','candidate'],pair,r['account_allocation_evidence'][2*i:2*i+2]):
    tx=Transaction.from_bytes(base64.b64decode(t['transaction_base64']));checks=tx.verify_with_results();assert checks and all(checks)and t['all_signatures_verified']and len(checks)==t['signature_count'];signatures+=len(checks)
    assert hashlib.sha256(bytes(tx)).hexdigest()==t['transaction_sha256']and t['amm_program_sha256']==r[side+'_sha256']and t['error']==row[side]['error'];assert t['logs_sha256']==hashlib.sha256(json.dumps(row[side]['logs'],separators=(',',':')).encode()).hexdigest()
    for pid,loaded in t['loaded_programs'].items():assert loaded['sha256']in index and index[loaded['sha256']]['program_id']==pid
    binary=program_bytes[r[side+'_sha256']];allocation=binary[:length]+bytes(max(0,length-len(binary)));assert e['file_sha256']==r[side+'_sha256']and e['allocated_bytes']==length and e['input_data_bytes']==len(binary)and e['executable']and e['owner']=='BPFLoader2111111111111111111111111111111111';assert e['truncated_suffix_all_zero']and not any(binary[length:])and e['allocated_sha256']==hashlib.sha256(allocation).hexdigest();assert allocation[:extent(binary)]==binary[:extent(binary)]
   if i in BAD:
    assert (row['original']['error']is None)==(mode=='small')
  results[mode]={'cases':24,'mismatches':0,'allocation_bytes':length,'former_four_errors':[r['cases'][i]['original']['error']for i in BAD]}
 assert signatures==96
 return {'passed':True,'candidate_sha256':c,'original_sha256':original,'raw_default_resource_mismatches_preserved':4,'equal_allocation_control_cases':48,'equal_allocation_control_mismatches':0,'control_signature_fields':96,'retained_baseline_signature_fields':144,'executable_account_charge_gap':cost,'actual_amm_execution_gap':14,'source_patch_proposed':False,'captured_loader':'upgradeable','captured_program_account_bytes':36,'fixture_loader':'legacy BPFLoader2','original_meaningful_elf_extent':extent(b),'original_fixture_account_bytes':len(b),'candidate_fixture_account_bytes':len(candidate),'results':results,'four_case_cost_table':table,'live_reachability_proven':False,'broad_compute_parity_proven':False,'manifest_sha256':H(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
