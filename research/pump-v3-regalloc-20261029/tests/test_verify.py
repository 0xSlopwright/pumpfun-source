"""Semantic negative controls; no compiler or target is executed."""
if not __debug__:
    raise SystemExit('Run without -O.')
from pathlib import Path
import copy,importlib.util,tempfile,unittest
P=Path(__file__).resolve().parents[1]
s=importlib.util.spec_from_file_location('v3_regalloc_verify',P/'verify.py');v=importlib.util.module_from_spec(s);s.loader.exec_module(v)
base=P.parent/'pump-v3-branch-layout-20261029';s=importlib.util.spec_from_file_location('v3_source_verify',base/'verify.py');parent=importlib.util.module_from_spec(s);s.loader.exec_module(parent)

class EvidenceControls(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp=tempfile.TemporaryDirectory(prefix='v3-regalloc-tests-');cls.root=Path(cls.temp.name);cls.api=parent.elf_reader()
        def elf(key):
            p=cls.root/key.replace('/','_');p.write_bytes(v.data(key));return cls.api.Elf(p)
        cls.stock=elf('extracted/target.o');cls.forced=elf('counterfactual/on/target.o')
        cls.original=cls.api.Elf(P.parents[1]/'evidence/original/pump/deployed.so')
        cls.raw,cls.rows=v.symbol_object(cls.stock,v.SYMBOL);cls.forced_raw,cls.forced_rows=v.symbol_object(cls.forced,v.SYMBOL)
        cls.analyzer=v.retained_module('controllers/analyze.py');cls.trace=v.data('trace/stderr.log').decode().replace('\r\n','\n')
        cls.forced_trace=v.data('counterfactual/on/stderr.log').decode().replace('\r\n','\n')
    @classmethod
    def tearDownClass(cls):cls.temp.cleanup()
    def test_default_off_is_complete_object_identity(self):
        v.control_check(v.data('extracted/target.o'),v.data('counterfactual/off/target.o'))
    def test_reject_default_off_non_code_mutation(self):
        raw=bytearray(v.data('counterfactual/off/target.o'));raw[-1]^=1
        with self.assertRaisesRegex(ValueError,'default-off whole object'):v.control_check(v.data('extracted/target.o'),bytes(raw))
    def test_ordered_targets_and_constants_bind(self):
        self.assertGreater(v.bind_objects(self.stock,self.forced,self.rows,self.forced_rows,same_offsets=False),0)
    def test_reject_call_swap_even_with_identical_normalization(self):
        rows=copy.deepcopy(self.forced_rows);calls=[r for r in rows if r['type']==10]
        calls[0]['symbol'],calls[1]['symbol']=calls[1]['symbol'],calls[0]['symbol']
        self.assertEqual(v.normalize_object(self.forced_raw,rows),v.normalize_object(self.forced_raw,self.forced_rows))
        with self.assertRaisesRegex(ValueError,'ordered relocation target'):v.bind_objects(self.stock,self.forced,self.rows,rows,same_offsets=False)
    def test_reject_data_swap_even_with_identical_normalization(self):
        rows=copy.deepcopy(self.forced_rows);constants=[r for r in rows if r['type']==1]
        self.assertNotEqual(constants[0]['symbol'],constants[1]['symbol']);constants[0]['symbol'],constants[1]['symbol']=constants[1]['symbol'],constants[0]['symbol']
        self.assertEqual(v.normalize_object(self.forced_raw,rows),v.normalize_object(self.forced_raw,self.forced_rows))
        with self.assertRaisesRegex(ValueError,'ordered relocation target'):v.bind_objects(self.stock,self.forced,self.rows,rows,same_offsets=False)
    def test_reject_changed_constant_bytes_with_same_symbol(self):
        symbol=next(r['symbol'] for r in self.forced_rows if r['type']==1)
        s=next(s for s in self.forced.symbols if s['name']==symbol);h=self.forced.headers[s['section']];offset=h[4]+s['address']-h[3]
        raw=bytearray(self.forced.data);raw[offset]^=1;p=self.root/'changed-constant.o';p.write_bytes(raw);changed=self.api.Elf(p)
        with self.assertRaisesRegex(ValueError,'complete constant object bytes'):v.bind_objects(self.stock,changed,self.rows,self.forced_rows,same_offsets=False)
    def test_observed_cost_choice_and_bundles(self):
        self.assertEqual(v.allocation_check(self.analyzer,self.trace),'2.68E-7')
    def test_reject_false_minimum_despite_retained_choice(self):
        changed=self.trace.replace('total = 1.999998003 with bundles','total = 2.999998003 with bundles')
        self.assertNotEqual(changed,self.trace)
        with self.assertRaisesRegex(ValueError,'minimum printed region cost'):v.allocation_check(self.analyzer,changed)
    def test_reject_missing_early_reload(self):
        changed=self.trace.replace('4952r\t%149:gpr = LDD_V1 %stack.19, 0','4952r\t%149:gpr = LDD_V1 %stack.18, 0')
        self.assertNotEqual(changed,self.trace)
        with self.assertRaisesRegex(ValueError,'spill copy folding'):v.allocation_check(self.analyzer,changed)
    def test_forced_choice_once(self):v.forced_check(self.forced_trace)
    def test_reject_two_interventions(self):
        changed=self.forced_trace+'\nV3_SPLIT_COUNTERFACTUAL original=%23 previous=$r9 forced=$r3\n'
        with self.assertRaisesRegex(ValueError,'single explicit'):v.forced_check(changed)
    def test_normalization_preserves_remaining_loads(self):
        norm=v.normalize_object(self.forced_raw,self.forced_rows)
        self.assertEqual(norm[1960:1976],bytes.fromhex('79a188fe0000000079a290fe00000000'))
        changed=bytearray(self.forced_raw);changed[1961]^=1
        self.assertNotEqual(v.normalize_object(bytes(changed),self.forced_rows),norm)
    def test_actual_original_tail_and_two_remaining_slots(self):
        differences,tails=v.counterfactual_check(self.api,self.original,self.forced_raw,self.forced_rows)
        self.assertEqual([r['offset'] for r in differences],[1960,1968]);self.assertEqual(tails['original'],tails['counterfactual'])
    def test_reject_wrong_load_despite_same_size_and_slot_count(self):
        raw=bytearray(self.forced_raw);raw[1961]=0xa4
        original=self.original.normalize(self.original.body(0x80df8,2120),0x80df8)[0]
        self.assertEqual(v.distance(original,v.normalize_object(raw,self.forced_rows)),2)
        with self.assertRaisesRegex(ValueError,'only two reversed stack loads'):v.counterfactual_check(self.api,self.original,bytes(raw),self.forced_rows)

if __name__=='__main__':unittest.main()
