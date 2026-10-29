"""Saved dual-image schedule controls (PR434 producer, re-run on this packet's images); --signatures uses solders, never a VM/compiler."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,struct,tarfile
CANDIDATES={'source-only':'a775c319eefbb30c3134b46f452dc9c0286bb45c0eb65e96d0f73bb0f524ac68','layout':'6c9ae72151b725c44caf7abb9985ae425726c6db00e2c6e0a045a768535b96d9'}
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
PROGRAM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
GLOBAL='C2aFPdENg4A2HQsmrd5rTw5TaYBX5Ku887cWjbFKtZpw'
sha=lambda b:hashlib.sha256(b).hexdigest()
def require(ok,msg):
 if not ok:raise ValueError(msg)
def preflight(p):
 paths=list(p.rglob('*'))
 require(not any(f.is_symlink()for f in paths),'negative packet symlink')
 require(all(f.is_file()or f.is_dir()for f in paths),'negative packet special file')
 manifest=json.loads((p/'MANIFEST.json').read_text())['files']
 require({f.relative_to(p).as_posix()for f in paths if f.is_file()}==set(manifest)|{'MANIFEST.json'},'negative packet membership')
 for name,h in manifest.items():require(sha((p/name).read_bytes())==h,'negative packet hash '+name)
def verify(packet=None,signatures=False,validate_packet=True):
 p=Path(packet)if packet is not None else Path(__file__).resolve().parent.parent
 if validate_packet:preflight(p)
 with tarfile.open(p/'sources/candidate.tar.gz')as t:source=t.extractfile('programs/pump-amm/src/state/volume_accumulator.rs').read()
 fn_start=source.find(b'    fn update_token_supply(\n');fn_end=source.find(b'    fn set_token_supply_before_start(',fn_start)
 gate=source.find(b'        if current_timestamp < self.start_time {\n            return self.set_token_supply_before_start(day_number, token_supply_per_day);\n        }\n',fn_start)
 guard=source.find(b'        if current_timestamp > self.end_time {\n            return err!(PumpAmmError::SupplyUpdateForFinishedRange);\n        }\n',fn_start)
 require(0<=fn_start<gate<guard<fn_end,'H11 start-gated guard witness (union11 dispatcher form: before-start return precedes the end_time error inside update_token_supply; error iff now>=start_time and now>end_time)')
 commands=json.loads((p/'negative/commands.json').read_bytes());require({c['label']for c in commands}==set(CANDIDATES),'command image inventory')
 complete='TransactionErrorInstructionError((0, Fieldless(ProgramFailedToComplete)))';e6035='TransactionErrorInstructionError((0, Tagged(InstructionErrorCustom(6035))))'
 results={}
 for label,expected in CANDIDATES.items():
  d=json.loads(gzip.decompress((p/'negative'/f'{label}.json.gz').read_bytes()))
  require(d['candidate_sha256']==expected and d['original_sha256']==ORIGINAL,'negative images')
  image=p/('builds/a/candidate.so.gz'if label=='source-only'else'layout/builds/a/candidate.so.gz')
  require(sha(gzip.decompress(image.read_bytes()))==expected,'candidate bytes')
  for key,name in [('producer_sha256','producer.py'),('fixture_sha256','fixture.py')]:require(d[key]==sha((p/'negative'/name).read_bytes()),'negative '+key)
  root=p.parents[1]
  for name,h in d['inputs'].items():require(sha((root/name).read_bytes())==h,'negative input '+name)
  command=next(c for c in commands if c['label']==label)
  require(command['candidate_sha256']==expected and command['environment']=={'PUMP_AMM_FRESH_VM':'1'},'fresh-VM command metadata')
  require(d['global_volume_account']==GLOBAL,'global volume PDA')
  rows=d['cases'];require([r['name']for r in rows]==['negative-end','end-before-start','active-control','equality-control','zero-supply'],'case inventory')
  sigs=0
  for i,(r,(end,now,supply))in enumerate(zip(rows,[(-1,0,1),(1,10,1),(49,10,1),(1,20,1),(1,10,0)])):
   require(r['input']==dict(instruction='admin_update_token_incentives',start=20,end=end,period=1,new_start=0,new_end=0,new_period=1,now=now,day=0,supply=supply),'fixture input')
   a,b=r['original'],r['candidate'];require(a['before']==b['before']and a['after']==b['after'],'paired state')
   state=bytes.fromhex(a['before'][GLOBAL]['data']);require(a['before'][GLOBAL]['owner']==PROGRAM,'schedule owner')
   require(state[:8]==hashlib.sha256(b'account:GlobalVolumeAccumulator').digest()[:8]and struct.unpack_from('<qqq',state,8)==(20,end,1),'stored schedule')
   require(a['transaction_base64']==b['transaction_base64'],'paired signed bytes')
   for role,x,h in [('original',a,ORIGINAL),('candidate',b,expected)]:
    require(x['executed_program_sha256']==h,'wrong executable account '+role)
    require(x['signature_verification']and x['sigverify_runtime_enabled'],'signature flags')
    raw=base64.b64decode(x['transaction_base64'],validate=True);require(bool(raw),'missing transaction')
    if signatures:
     from solders.transaction import Transaction
     tx=Transaction.from_bytes(raw);require(all(tx.verify_with_results()),'invalid signature');sigs+=len(tx.signatures)
     ix=tx.message.instructions[0];require(str(tx.message.account_keys[ix.program_id_index])==PROGRAM,'message program')
     require(bytes(ix.data[:8])==hashlib.sha256(b'global:admin_update_token_incentives').digest()[:8]and struct.unpack('<qqqQQ',bytes(ix.data[8:]))==(0,0,1,0,supply),'message arguments')
   require(r['error_equal']==(a['error']==b['error']),'error equality summary')
   if i<2:require(a['error']==b['error']==complete,'former counterexample changed')
   elif i==3:require(a['error']==b['error']==e6035,'equality control changed')
   else:require(a['error']is None and b['error']is None,'success control changed')
  results[label]=dict(candidate_sha256=expected,cases=5,executions=10,mismatches=sum(not r['error_equal']for r in rows),matching_controls=sum(r['error_equal']for r in rows),cryptographically_verified_signatures=sigs)
 return dict(images=results,cases=10,executions=20,mismatches=sum(r['mismatches']for r in results.values()),cryptographically_verified_signatures=sum(r['cryptographically_verified_signatures']for r in results.values()),scope='Fresh finite synthetic controls for both current images. No live reachability or full-corpus runtime claim.')
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('--signatures',action='store_true');args=a.parse_args();print(json.dumps(verify(signatures=args.signatures),sort_keys=True))
