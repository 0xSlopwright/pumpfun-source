"""Frozen 6-case legacy_positive_sync driver for the unified local corpus."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,sys
W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
 assert sha(W/'definition.py')=='4d81f797ec9fa5a247d25696898e41b0602a9c3a247a2f1706c5566f87565668'
 spec=importlib.util.spec_from_file_location('legacy_positive_sync',W/'definition.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
 saved=sys.argv
 sys.argv=[str(W/'definition.py'),'--candidate',str(a.candidate),'--expected-candidate-sha256',sha(a.candidate),'--output',str(a.output)]
 try:h.main()
 finally:sys.argv=saved
 report=json.loads(gzip.decompress(a.output.read_bytes()))
 assert report['case_count']==6 and not report['mismatches']and not report['not_as_expected']
 assert all(x['original']['signature_verified']and x['candidate']['signature_verified']for x in report['cases'])
if __name__=='__main__':main()
