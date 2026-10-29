#!/usr/bin/env python3
"""Negative controls for the retained current Fees runtime gate."""
from pathlib import Path
import copy,gzip,importlib.util,json,unittest
P=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('fees_runtime_under_test',P/'verify_fees_runtime.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Controls(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.report=json.loads(gzip.decompress((P.parent/'all-contract-completion-20261028/fees-built/runtime-full.json.gz').read_bytes()));cls.candidate=cls.report['candidate_sha256'];cls.original=cls.report['original_sha256']
 def verify(self,value):return m.check_report(value,self.candidate,self.original,False)
 def test_valid(self):self.assertEqual(self.verify(self.report)['cases'],17331)
 def test_false_total(self):
  value=copy.deepcopy(self.report);value['case_count']+=1
  with self.assertRaises(ValueError):self.verify(value)
 def test_changed_outcome(self):
  value=copy.deepcopy(self.report);value['suites']['queries']['cases'][0]['candidate']['fees']={'forged':1}
  with self.assertRaises(ValueError):self.verify(value)
 def test_changed_log(self):
  value=copy.deepcopy(self.report);value['suites']['administration']['cases'][0]['candidate']['logs'].append('Program log: injected diagnostic')
  with self.assertRaises(ValueError):self.verify(value)
 def test_wrong_image(self):
  value=copy.deepcopy(self.report);value['candidate_sha256']='0'*64
  with self.assertRaises(ValueError):self.verify(value)
if __name__=='__main__':unittest.main()
