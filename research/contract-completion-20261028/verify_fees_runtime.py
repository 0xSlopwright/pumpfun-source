#!/usr/bin/env python3
"""Independently verify the exact promoted Fees image's retained full replay."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,re
EXPECTED={'queries':10838,'administration':444,'initialization':180,'configuration':625,'extension':297,'deprecated':80,'upsert':578,'admin_transfer':56,'donation_create':356,'donation_crank':357,'social_create':588,'social_claim':347,'social_claim_v2':627,'withdrawal':113,'buyback':1249,'sharing_creation':116,'sharing_update':417,'sharing_admin_cto':63}
UNITS=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
def require(value,message):
 if not value:raise ValueError(message)
def check_report(report,candidate,original,signatures=True):
 require(report['candidate_sha256']==candidate and report['original_sha256']==original,'runtime image identity')
 require(report['case_count']==17331 and not report['mismatches'],'runtime total/mismatches')
 require(set(report['suites'])==set(EXPECTED),'runtime suite membership')
 log_pairs=signature_fields=0
 if signatures:from solders.transaction import VersionedTransaction
 for name,count in EXPECTED.items():
  suite=report['suites'][name];require(suite['candidate_sha256']==candidate and suite['original_sha256']==original,name+' image identity')
  require(suite['case_count']==len(suite['cases'])==count,name+' case count')
  require(not suite.get('mismatches',suite.get('failures',[])),name+' reported mismatch')
  for index,row in enumerate(suite['cases']):
   a,b=row['original'],row['candidate'];require(set(a)==set(b),name+' outcome keys')
   for field in a:
    if field in ['logs','relevant_logs']:
     left=[s for s in a[field]if not UNITS.fullmatch(s)];right=[s for s in b[field]if not UNITS.fullmatch(s)]
     require(left==right,name+' ordered logs');log_pairs+=1
    else:require(a[field]==b[field],name+' outcome '+field)
   if signatures:
    for outcome in [a,b]:
     if 'transaction_base64'in outcome:
      raw=base64.b64decode(outcome['transaction_base64'],validate=True);tx=VersionedTransaction.from_bytes(raw);checks=tx.verify_with_results();require(checks and all(checks),name+' signed transaction');signature_fields+=len(checks)
 require(log_pairs==6413,'paired log coverage')
 return {'passed':True,'suites':18,'cases':17331,'ordered_log_pairs':log_pairs,'structured_mismatches':0,'diagnostic_mismatches':0,'signature_fields_reverified':signature_fields,'candidate_sha256':candidate,'new_target_executions':0}
def verify(root,signatures=True):
 root=Path(root).resolve();status=json.loads((root/'repro/status.json').read_bytes())['pump_fees'];path=root/status['validation_report'];blob=path.read_bytes()
 require(hashlib.sha256(blob).hexdigest()==status['validation_report_sha256'],'runtime receipt binding')
 candidate=hashlib.sha256((root/status['candidate_artifact']).read_bytes()).hexdigest();original=hashlib.sha256((root/'evidence/original/pump_fees/deployed.so').read_bytes()).hexdigest()
 return check_report(json.loads(gzip.decompress(blob)),candidate,original,signatures)
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--repo',type=Path,default=Path(__file__).resolve().parents[2]);p.add_argument('--skip-signatures',action='store_true');a=p.parse_args();print(json.dumps(verify(a.repo,not a.skip_signatures),indent=2))
