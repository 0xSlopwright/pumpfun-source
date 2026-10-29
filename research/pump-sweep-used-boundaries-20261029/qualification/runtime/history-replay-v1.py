#!/usr/bin/env python3
"""Strict offline Sweep replay using unchanged maintained fixtures and synthetic signers.

Only complete compute-meter log lines and the metadata compute counter are excluded.
No source-coordinate, error, state, event, CPI, transaction or signature relaxation.
"""
import argparse,ast,base64,collections,gzip,hashlib,importlib.metadata,json,sys
from pathlib import Path
if not __debug__:raise SystemExit('Run without -O; fixture assertions are required.')
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parent
ORIGINAL='7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
CANONICAL='199fd7379b6881adefd9e54803f75902176c17bded1718bfc1c59b1cf5bc8473'
sha=lambda b:hashlib.sha256(b).hexdigest()
canon=lambda x:json.dumps(x,sort_keys=True,separators=(',',':')).encode()
def require(ok,msg):
 if not ok:raise ValueError(msg)
def init(repo):
 sys.path.insert(0,str(repo/'scripts'))
 import pump_captured_loader as loader
 loader.install()
 import pump_fee_sweep_differential as suite
 import pump_strict_ordered_logs as strict
 from solders.rent import Rent
 from solders.transaction import Transaction
 require(Rent.default().minimum_balance(0)==890880,'Unexpected Rent profile')
 return suite,loader,strict,Transaction

def definitions(suite):
 maintained=suite.cases();require(len(maintained)==504,'Maintained Sweep fixture extent')
 base={'op':'sweep_creator_fee','curve_quote':str(suite.Pubkey.default()),'quote':str(suite.WSOL)}
 rent=[{'name':'creator-rent-'+str(n),'case':dict(base,patch={'recipient':{'lamports':n}})}for n in [0,1,890879,890880,890881]]
 rent+=[{'name':'creator-zero-fee-below-rent','case':dict(base,creator_fee=0,patch={'recipient':{'lamports':1}})}, {'name':'protocol-below-rent','case':dict(base,op='sweep_protocol_fee',patch={'recipient':{'lamports':1}})}]
 return {'maintained':[{'name':'maintained-'+str(i),'case':c}for i,c in enumerate(maintained)],'rent-boundaries':rent}

def inputs(repo):
 queue=[repo/'scripts/pump_fee_sweep_differential.py',repo/'scripts/pump_captured_loader.py',repo/'scripts/pump_strict_ordered_logs.py'];seen=set()
 while queue:
  path=queue.pop()
  if path in seen:continue
  seen.add(path)
  for node in ast.walk(ast.parse(path.read_text())):
   names=[node.module]if isinstance(node,ast.ImportFrom)and node.module else([n.name for n in node.names]if isinstance(node,ast.Import)else[])
   for name in names:
    local=repo/'scripts'/(''.join(name.split('.')[:1])+'.py')
    if local.exists()and local not in seen:queue.append(local)
 for rel in ['evidence/upstream/pump.json','evidence/upstream/pump_fees.json','research/imported-lab/analysis/pump_fun/config-snapshot.json','evidence/original/pump/capture.json','evidence/original/pump/program-account.bin','evidence/original/pump/programdata-account.bin','evidence/original/pump/deployed.so','evidence/original/pump_fees/deployed.so','evidence/original/pump_amm/deployed.so']+[f'evidence/dependencies/{n}/deployed.so'for n in ['spl_token','spl_token_2022','associated_token']]:seen.add(repo/rel)
 return {str(p.relative_to(repo)):sha(p.read_bytes())for p in sorted(seen)}

def freeze(repo,suite,path):
 require(not path.exists(),'Refusing to overwrite frozen manifest')
 groups=definitions(suite)
 manifest={'scope':__doc__,'baseline_main':'1285b5e9e3a29c1e2cf32246d6046035e5d66fad','canonical_sha256':CANONICAL,'original_sha256':ORIGINAL,'controller_sha256':sha(Path(__file__).read_bytes()),'inputs':inputs(repo),'groups':{k:{'count':len(v),'definition_list_sha256':sha(canon(v)),'fixtures':[{'name':x['name'],'case':x['case'],'case_sha256':sha(canon(x['case']))}for x in v]}for k,v in groups.items()},'environment':{'python':sys.version,'solders':importlib.metadata.version('solders')},'limits':['Maintained504 fixtures contain no valid below-rent recipient success witness.','Seven separate rent-boundary fixtures use the existing unchanged run(c) patch.recipient.lamports parameter and already maintained synthetic signers; they are not historical504 cases.','No new wallet, network transaction, compiler variant, stopped handler or crossing fixture.','No runtime outcomes are asserted by the fixture manifest.']}
 path.write_text(json.dumps(manifest,indent=2)+'\n');print('Frozen',path,flush=True)

def signcheck(outcome,Transaction):
 require(outcome.get('signature_verification')is True,'Producer did not enable signature checks')
 raw=base64.b64decode(outcome['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);valid=tx.verify_with_results()
 require(bool(valid)and all(valid),'Actual serialized signature verification failed')
 return {'transaction_sha256':sha(raw),'signature_fields':len(valid),'signature_verified':list(valid),'signatures':[str(s)for s in tx.signatures],'signer_pubkeys':[str(k)for k in tx.message.account_keys[:tx.message.header.num_required_signatures]]}

def compare(left,right,strict):
 diff=[k for k in ['error','before','after','transaction_base64']if left[k]!=right[k]]
 lm,rm=left['metadata'],right['metadata']
 for k in sorted(set(lm)|set(rm)):
  if k not in ['logs','compute_units_consumed']and lm.get(k)!=rm.get(k):diff.append('metadata.'+k)
 if [s for s in left['logs']if not strict.UNITS.fullmatch(s)]!=[s for s in right['logs']if not strict.UNITS.fullmatch(s)]:diff.append('strict_ordered_logs')
 return diff

def run(repo,suite,loader,strict,Transaction,manifest,candidate,control,groups,output):
 require(not output.exists(),'Refusing to overwrite runtime output');output.mkdir(parents=True)
 frozen=json.loads(manifest.read_text());bound=inputs(repo)
 require(frozen['controller_sha256']==sha(Path(__file__).read_bytes()),'Controller changed after fixture freeze')
 require(bound==frozen['inputs'],'Fixture inputs changed after freeze')
 require(sha((repo/'evidence/original/pump/deployed.so').read_bytes())==ORIGINAL,'Original image binding')
 images={'candidate':candidate.resolve()}
 if control:images['control']=control.resolve();require(sha(control.read_bytes())==CANONICAL,'Control must be actual canonical199fd image')
 image_hash={k:sha(p.read_bytes())for k,p in images.items()}
 rows=[];signatures=[];loader.LOADS.clear()
 for group in groups:
  for fixture in frozen['groups'][group]['fixtures']:
   case=fixture['case'];require(sha(canon(case))==fixture['case_sha256'],'Case hash')
   original=suite.run(case);outcomes={'original':original}
   for name,path in images.items():outcomes[name]=suite.run(case,path)
   signed={name:signcheck(o,Transaction)for name,o in outcomes.items()}
   require(len({x['transaction_sha256']for x in signed.values()})==1,'Actual transaction differs across images')
   diffs={name:compare(original,outcomes[name],strict)for name in images}
   rows.append({'group':group,'name':fixture['name'],'case_sha256':fixture['case_sha256'],'case':case,**outcomes,'different_fields':diffs,'signed_executions':signed})
   signatures.extend(signed.values())
   print(group,fixture['name'],{n:d for n,d in diffs.items()if d},flush=True)
 require(inputs(repo)==bound and sha(Path(__file__).read_bytes())==frozen['controller_sha256'],'Fixture/controller input changed during execution')
 require({k:sha(p.read_bytes())for k,p in images.items()}==image_hash,'Image changed during execution')
 rawreport={'scope':__doc__,'original_sha256':ORIGINAL,'candidate_sha256':image_hash['candidate'],'control_sha256':image_hash.get('control'),'manifest_sha256':sha(manifest.read_bytes()),'controller_sha256':frozen['controller_sha256'],'input_sha256':bound,'candidate_path':str(candidate.resolve()),'control_path':str(control.resolve())if control else None,'case_count':len(rows),'suites':{'fee_sweeps':rows},'mismatches':{n:[r['name']for r in rows if r['different_fields'][n]]for n in images},'execution_count':len(signatures),'signature_fields':sum(x['signature_fields']for x in signatures),'captured_loads':loader.LOADS,'runtime_receipt_transfer':False}
 data=canon(rawreport);(output/'outcomes.json.gz').write_bytes(gzip.compress(data,mtime=0))
 strict_result=strict.audit(rawreport,image_hash['candidate'],len(rows))
 (output/'strict-logs.json').write_text(json.dumps(strict_result,indent=2)+'\n')
 summary={k:v for k,v in rawreport.items()if k not in ['suites','input_sha256','captured_loads']};summary['report_sha256']=sha((output/'outcomes.json.gz').read_bytes());summary['captured_load_count']=len(loader.LOADS);summary['strict_ordered_log_mismatch_cases']=strict_result['strict_ordered_log_mismatch_cases']
 (output/'SUMMARY.json').write_text(json.dumps(summary,indent=2)+'\n')
 print(json.dumps(summary,indent=2),flush=True)
 require(not any(rawreport['mismatches'].values())and strict_result['strict_ordered_log_mismatch_cases']==0,'Actual original/image differences remain; retained, not suppressed')

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--repo',type=Path,required=True);p.add_argument('--manifest',type=Path,default=P/'FIXTURES.json');p.add_argument('--freeze',action='store_true');p.add_argument('--candidate',type=Path);p.add_argument('--control',type=Path);p.add_argument('--groups',nargs='+',choices=['maintained','rent-boundaries'],default=['maintained','rent-boundaries']);p.add_argument('--output',type=Path);a=p.parse_args();repo=a.repo.resolve();suite,loader,strict,Transaction=init(repo)
 if a.freeze:freeze(repo,suite,a.manifest);return
 require(a.candidate is not None and a.output is not None,'--candidate/--output required for actual replay')
 run(repo,suite,loader,strict,Transaction,a.manifest,a.candidate,a.control,a.groups,a.output)
if __name__=='__main__':main()
