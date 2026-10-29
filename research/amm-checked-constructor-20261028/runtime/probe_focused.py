"""Actual sell cashback triples; two-byte source-built CALL-target control."""
from pathlib import Path
import argparse,base64,hashlib,importlib.util,json,re,sys
W=Path(__file__).resolve().parent;ROOT=W.parents[2]
p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--control',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--runtime-root',type=Path,required=True);args=p.parse_args();candidate=args.candidate.resolve();control=args.control.resolve();output=args.output.resolve()
FROZEN=args.runtime_root.resolve();sys.path.insert(0,str(FROZEN/'scripts'));import pump_amm_legacy_sell_differential as b
from solders.transaction import Transaction
original=FROZEN/'evidence/original/pump_amm/deployed.so';H=lambda path:hashlib.sha256(Path(path).read_bytes()).hexdigest()
programs={'original':original,'r31_control':control,'checked_candidate':candidate};before_hashes={name:H(path)for name,path in programs.items()};raw_control=control.read_bytes();raw_candidate=candidate.read_bytes();different=[i for i,(x,y)in enumerate(zip(raw_control,raw_candidate))if x!=y]
if len(raw_control)!=len(raw_candidate)or different!=[0x4dc84,0x4dc85]:raise RuntimeError('Expected sole two-byte CALL-target control does not hold')
def clean(value):
 if isinstance(value,dict):return {k:clean(v)for k,v in value.items()}
 if isinstance(value,list):return [clean(v)for v in value if not isinstance(v,str)or not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',v)]
 return value
def units(row):
 values=[int(match.group(1))for line in row['logs']if(match:=re.fullmatch(r'Program '+str(b.PROGRAM)+r' consumed (\d+) of \d+ compute units',line))]
 if not values:raise RuntimeError('AMM meter observation absent')
 return values[-1]
scenarios=[('valid-existing',b.cash(True)),('valid-new',b.cash(False)),('bad-discriminator-early',b.cash(True,b.mutate(b.volume,0,bytes(8))))]
for size in [7,8,9,39,40,41,72,73,74,81,82,89,90,91,136,137]:scenarios.append(('correct-header-length-'+str(size),b.cash(True,b.mutate(b.volume,0,b'',size))))
for offset in [40,73]:scenarios.append(('correct-header-invalid-bool-'+str(offset),b.cash(True,b.mutate(b.volume,offset,b'\2'))))
rows=[];signature_fields=0;failures=[];disc=bytes(next(v for v in b.IDL['accounts']if v['name']=='UserVolumeAccumulator')['discriminator'])
for label,override in scenarios:
 result={name:b.legacy(candidate=path,overrides=override)for name,path in programs.items()}
 for image,row in result.items():
  checks=Transaction.from_bytes(base64.b64decode(row['transaction_base64'])).verify_with_results()
  if not checks or not all(checks):raise RuntimeError('invalid signed transaction')
  signature_fields+=len(checks)
 if len({row['transaction_base64']for row in result.values()})!=1:raise RuntimeError('triple signed inputs differ')
 if not all(clean(row)==clean(result['original'])for row in result.values()):failures.append(label)
 state=result['original']['before'][str(b.volume)];data=bytes.fromhex(state['data_hex'])if state else b'';owner=state['owner']if state else None;meter={name:units(row)for name,row in result.items()};delta=meter['checked_candidate']-meter['r31_control']
 rows.append({'case':label,'results':result,'initial_accumulator':{'bytes':len(data),'program_owned':owner==str(b.PROGRAM),'has_expected_discriminator':data[:8]==disc,'first_bool':data[40]if len(data)>40 else None,'second_bool':data[73]if len(data)>73 else None},'amm_compute_units':meter,'checked_minus_control_units':delta,'constructor_call_execution_witness':delta!=0,'witness_scope':'The source-built images differ only in the constructor CALL immediate and have equal allocation lengths; a changed deterministic AMM compute count witnesses execution of that call. This is not a PC trace.','strict_observations_equal':label not in failures})
if before_hashes!={name:H(path)for name,path in programs.items()}:raise RuntimeError('program input changed')
report={'candidate_sha256':before_hashes['checked_candidate'],'control_sha256':before_hashes['r31_control'],'original_sha256':before_hashes['original'],'script_sha256':H(__file__),'frozen_legacy_harness_sha256':H(FROZEN/'scripts/pump_amm_legacy_sell_differential.py'),'case_count':len(rows),'signature_fields':signature_fields,'mismatches':failures,'sole_source_built_binary_difference':{'bytes':len(different),'offsets':[hex(v)for v in different],'instruction_kind':'CALL target immediate','allocation_bytes':len(raw_control)},'cases':rows};output.parent.mkdir(exist_ok=True,parents=True);output.write_text(json.dumps(report,separators=(',',':'))+'\n');print(json.dumps({'cases':len(rows),'signatures':signature_fields,'mismatches':failures,'witnesses':[(r['case'],r['checked_minus_control_units'],r['results']['original']['error'])for r in rows]},indent=2));raise SystemExit(bool(failures))
