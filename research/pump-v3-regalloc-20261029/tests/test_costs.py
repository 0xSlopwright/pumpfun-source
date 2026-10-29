"""Reject cost and profile-input mutations beyond evidence seals."""
if not __debug__:raise SystemExit('Run without -O.')
from pathlib import Path
import importlib.util,unittest
P=Path(__file__).resolve().parents[1]
def load(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
v=load('costs_parent',P/'verify.py');c=load('costs_replay',P/'verify_costs.py');model=v.retained_module('costs/controllers/analyze_costs.py');machine=v.retained_module('controllers/analyze.py')
def text(key):return v.data('costs/'+key).decode().replace('\r\n','\n')
class CostControls(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.stock=text('stock01/stderr.log');cls.probe=text('probe01/stderr.log');cls.changed=text('ir01/frequency/stderr.log');cls.changed_probe=text('frequency-probe01/stderr.log')
        cls.before=v.data('costs/ir01/baseline/input.ll');cls.after=v.data('costs/ir01/frequency/input.ll')
    def test_stock_exact_costs(self):
        m=model.model(self.probe,self.stock,'r9');self.assertEqual(m['r3_minus_r9'],4831840080);self.assertEqual(m['collapsed_delta']['integer_flow_residual'],0)
    def test_profile_exact_costs_include_residual(self):
        m=model.model(self.changed_probe,self.changed,'r3');self.assertEqual(m['r3_minus_r9'],-1207958222);self.assertEqual(m['collapsed_delta']['integer_flow_residual'],-2)
    def test_reject_changed_cost_total(self):
        changed=self.probe.replace('total reg=$r3 value=36028765880488269','total reg=$r3 value=36028765880488268');self.assertNotEqual(changed,self.probe)
        with self.assertRaises(AssertionError):model.model(changed,self.stock,'r9')
    def test_reject_changed_logged_frequency(self):
        changed=self.probe.replace('freq=18014398509481984','freq=18014398509481983');self.assertNotEqual(changed,self.probe)
        with self.assertRaises(AssertionError):model.model(changed,self.stock,'r9')
    def test_only_one_input_annotation(self):c.input_delta(self.before,self.after,v.data('extracted/target.ll'))
    def test_reject_extra_semantic_input_change(self):
        changed=self.after.replace(b'184467440737095516159999',b'184467440737095516159998');self.assertNotEqual(changed,self.after)
        with self.assertRaises(AssertionError):c.input_delta(self.before,changed,v.data('extracted/target.ll'))
    def test_reject_wrong_synthetic_profile(self):
        with self.assertRaises(AssertionError):c.input_delta(self.before,self.after.replace(b'i32 16777215',b'i32 16777214'),v.data('extracted/target.ll'))
    def test_machine_instructions_are_preserved(self):
        before=machine.machine(text('ir01/baseline/stderr.log'),'Before');after=machine.machine(self.changed,'Before');c.before_greedy(before,after)
        changed=after.replace('5200B\t  %20:gpr = LDD_V1','5200B\t  %20:gpr = MOV_rr');self.assertNotEqual(changed,after)
        with self.assertRaises(AssertionError):c.before_greedy(before,changed)
if __name__=='__main__':unittest.main()
