if not __debug__:
    raise SystemExit('Run without -O: inherited readers contain assertions.')
from pathlib import Path
import copy,importlib.util,re,shutil,struct,subprocess,sys,tempfile,unittest
P=Path(__file__).resolve().parents[1];R=P.parents[1]
spec=importlib.util.spec_from_file_location('v3_branch_verify',P/'verify.py');v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)

class SavedEvidenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.parent=v.unpack(P/'build/parent/symbols.so.gz')
        cls.candidate=v.unpack(P/'build/candidate/symbols.so.gz')
        cls.source=v.source_files()['programs/pump/src/trade_v3.rs']
        cls.stock=v.zipped_json(P/'origin/stock-root-root-command.json.gz')
        cls.origin=v.zipped_json(P/'origin/stock-root-launch.json.gz')
        cls.launch=v.zipped_json(P/'build/candidate/launch.json.gz')
        cls.trace=v.unpack(P/'passive/stderr.log.gz')
        cls.trace_index=v.trace_index(cls.trace)

    def test_complete_saved_replay(self):
        self.assertEqual(v.verify(R)['result'],'PASS')

    def test_source_propagation_change_rejected(self):
        candidate=v.unpack(P/'source/candidate-trade_v3.rs.gz')
        v.candidate_source(self.source,candidate)
        with self.assertRaisesRegex(ValueError,'exact one-line'):
            v.candidate_source(self.source,candidate.replace(v.NEW,v.NEW.replace(b')?;',b').unwrap();')))

    def test_source_line_shift_rejected(self):
        with self.assertRaisesRegex(ValueError,'physical line'):
            v.candidate_source(b'\n'+self.source,b'\n'+v.unpack(P/'source/candidate-trade_v3.rs.gz'))

    def test_missing_declared_remap_rejected(self):
        launch=copy.deepcopy(self.launch);launch['command'].remove(v.REMAP)
        with self.assertRaisesRegex(ValueError,'literal compiler'):
            v.command_check(self.stock,self.origin,launch)

    def test_root_path_spelling_rejected(self):
        launch=copy.deepcopy(self.launch);launch['command'][4]=launch['command'][4].replace('/','\\')
        with self.assertRaisesRegex(ValueError,'literal compiler'):
            v.command_check(self.stock,self.origin,launch)

    def test_valid_wrong_callee_past_image_hashes(self):
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/'candidate.so';path.write_bytes(self.candidate);api=v.elf_reader();e=api.Elf(path)
            f=next(f for f in e.functions if '5trade12v3_buy_costs17h' in f['name'])
            raw=e.body(f['address'],f['size']);_,refs=e.normalize(raw,f['address'])
            calls=[r for r in refs if r['kind']=='direct-call'];site=calls[6];wrong=calls[0]['target']
            modified=bytearray(self.candidate);offset=e.sections['.text']['offset']+f['address']-e.sections['.text']['addr']+site['offset']
            struct.pack_into('<i',modified,offset+4,(wrong-f['address']-site['offset']-8)//8)
            path.write_bytes(modified);changed=api.Elf(path)
            # The normalizer masks this immediate: the reference check must catch it.
            self.assertEqual(e.normalize(raw,f['address'])[0],changed.normalize(changed.body(f['address'],f['size']),f['address'])[0])
            with self.assertRaisesRegex(ValueError,'bounded call/data audit'):
                v.reference_audit(R,self.parent,bytes(modified))

    def test_changed_source_filename_past_image_hashes(self):
        before=b'programs/pump/src/trade_v3.rs';after=b'programs/pump/src\\trade_v3.rs'
        self.assertIn(before,self.candidate);changed=self.candidate.replace(before,after)
        with self.assertRaisesRegex(ValueError,'bounded call/data audit'):
            v.reference_audit(R,self.parent,changed)

    def changed_parent_operands(self,kind):
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/'parent.so';path.write_bytes(self.parent);api=v.elf_reader();e=api.Elf(path)
            f=next(f for f in e.functions if '5trade12v3_buy_costs17h' in f['name'])
            raw=e.body(f['address'],f['size']);normal,refs=e.normalize(raw,f['address'])
            modified=bytearray(self.parent);base=e.sections['.text']['offset']+f['address']-e.sections['.text']['addr']
            if kind=='call':
                a,b=[r for r in refs if r['kind']=='direct-call'][:2]
                self.assertNotEqual(a['target'],b['target'])
                for site,target in [(a,b['target']),(b,a['target'])]:
                    struct.pack_into('<i',modified,base+site['offset']+4,(target-f['address']-site['offset']-8)//8)
            else:
                a,b=[r for r in refs if r['kind']=='elf-pointer'][2:4]
                self.assertNotEqual(a['value'],b['value'])
                for site,target in [(a,b['value']),(b,a['value'])]:
                    struct.pack_into('<I',modified,base+site['offset']+4,target&0xffffffff)
                    struct.pack_into('<I',modified,base+site['offset']+12,target>>32)
            path.write_bytes(modified);changed=api.Elf(path)
            self.assertEqual(normal,changed.normalize(changed.body(f['address'],f['size']),f['address'])[0])
            return bytes(modified)

    def test_parent_valid_call_permutation_rejected(self):
        with self.assertRaisesRegex(ValueError,'original-parent direct-call order differs'):
            v.reference_audit(R,self.changed_parent_operands('call'),self.candidate)

    def test_parent_valid_data_permutation_rejected(self):
        with self.assertRaisesRegex(ValueError,'original-parent bounded-data order differs'):
            v.reference_audit(R,self.changed_parent_operands('data'),self.candidate)

    def test_changed_catalog_extent_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);original=root/'evidence/original/pump/deployed.so';original.parent.mkdir(parents=True);original.write_bytes((R/'evidence/original/pump/deployed.so').read_bytes())
            catalog=root/'repro/reconstruction-status-2026-10-26/functions.tsv';catalog.parent.mkdir(parents=True)
            content=(R/'repro/reconstruction-status-2026-10-26/functions.tsv').read_text();rows=content.splitlines();columns=rows[0].split('\t');end=columns.index('original_end')
            for i,line in enumerate(rows[1:],1):
                fields=line.split('\t')
                if fields[0]=='pump' and fields[1]=='selected':fields[end]=str(int(fields[end])+8);rows[i]='\t'.join(fields);break
            else:self.fail('No selected Pump window')
            catalog.write_text('\n'.join(rows)+'\n')
            with self.assertRaisesRegex(ValueError,'canonical window catalog'):v.verify(root)

    def test_both_entrypoints_refuse_optimized_python(self):
        for path in [P/'verify.py',Path(__file__)]:
            r=subprocess.run([sys.executable,'-I','-B','-O',str(path)],capture_output=True)
            self.assertNotEqual(r.returncode,0);self.assertIn(b'Run without -O',r.stderr)

    def test_prefixed_trace_headers_keep_literal_crlf_intervals(self):
        raw=b'warning: preamble\r\n; *** IR Dump Before IRPass ***\r\nIR\r\n*** IR Dump After IRPass ***\r\nIR2\r\n# *** IR Dump Before MachinePass ***:\r\n# Machine code for function test\r\n'
        rows=v.trace_index(raw)
        self.assertEqual(len(rows),3)
        self.assertEqual([r['machine'] for r in rows],[False,False,True])
        self.assertEqual(rows[0]['start'],len(b'warning: preamble\r\n'))
        for row in rows:
            part=raw[row['start']:row['end']]
            self.assertIn(b'\r\n',part);self.assertEqual(row['sha256'],v.sha(part))

    def test_old_incomplete_trace_index_rejected(self):
        bad=v.zipped_json(P/'passive/failures/parser-failed01-index.json.gz')
        with self.assertRaisesRegex(ValueError,'literal trace intervals'):
            v.trace_texts(self.trace,bad)

    def mutated_stage(self,index,transform):
        row=self.trace_index[index];before=self.trace[row['start']:row['end']]
        after=transform(before.decode().replace('\r\n','\n')).replace('\n','\r\n').encode()
        self.assertNotEqual(before,after)
        changed=self.trace[:row['start']]+after+self.trace[row['end']:]
        # Recompute interval lengths and hashes so this reaches semantic checks.
        return v.trace_texts(changed,v.trace_index(changed))

    def test_changed_initial_branch_polarity_past_trace_hashes(self):
        texts=self.mutated_stage(276,lambda s:s.replace('JNE_ri %15:gpr, 2, %bb.22','JEQ_ri %15:gpr, 2, %bb.22'))
        with self.assertRaisesRegex(ValueError,'initial JNE plus adjacent JMP'):
            v.trace_observations(texts)

    def test_premature_fallthrough_removal_past_trace_hashes(self):
        def change(text):
            block=v.machine_blocks(text,95)[0]
            return text.replace(block,block.replace('JMP %bb.21',''))
        with self.assertRaisesRegex(ValueError,'initial JNE plus adjacent JMP'):
            v.trace_observations(self.mutated_stage(276,change))

    def test_delayed_reload_past_trace_hashes(self):
        def change(text):
            block=next(b for b in v.machine_blocks(text,111) if '%149:gpr = LDD_V1 %stack.19, 0' in b)
            line=re.search(r'^\d+B[^\n]*%149:gpr = LDD_V1 %stack\.19, 0\n',block,re.M)[0]
            moved=block.replace(line,'');guard=re.search(r'^[^\n]*JNE_ri[^\n]*\n',moved,re.M)[0]
            return text.replace(block,moved.replace(guard,guard+line,1))
        with self.assertRaisesRegex(ValueError,'early net-guard reload'):
            v.trace_observations(self.mutated_stage(335,change))

if __name__=='__main__':unittest.main(verbosity=2)
