"""Frozen 12-case v2_positive_sync driver for the unified local corpus."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,sys
W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
 assert sha(W/'definition.py')=='47816fc3b5e65bf02d4d42a79d76a6717a061a17e92b8572aa72e9b2e9cacaf1'
 spec=importlib.util.spec_from_file_location('v2_positive_sync',W/'definition.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
 saved=sys.argv
 sys.argv=[str(W/'definition.py'),'--candidate',str(a.candidate),'--expected-candidate-sha256',sha(a.candidate),'--output',str(a.output)]
 try:h.main()
 finally:sys.argv=saved
 report=json.loads(gzip.decompress(a.output.read_bytes()))
 assert report['case_count']==12 and not report['mismatches']and not report['not_as_expected']
 assert all(x['original']['signature_verified']and x['candidate']['signature_verified']for x in report['cases'])
if __name__=='__main__':main()
