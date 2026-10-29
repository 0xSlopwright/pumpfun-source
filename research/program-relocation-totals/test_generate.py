import contextlib
import hashlib
import io
import json
from pathlib import Path
import shutil
import struct
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
import generate


class Tests(unittest.TestCase):
    def test_all_four_actual_packet_workflows(self):
        before,after=generate.reviewed_module(False),generate.reviewed_module()
        from window_elf_reader import Elf
        scratch=Path(tempfile.mkdtemp(prefix='relocation-total-',dir=generate.ROOT.parent)).resolve()
        try:
            for program in ('pump','pump_amm','pump_fees','mayhem'):
                path=generate.ROOT/f'evidence/original/{program}/deployed.so';elf=Elf(path)
                old_dir,new_dir=scratch/(program+'-old'),scratch/(program+'-new')
                with contextlib.redirect_stdout(io.StringIO()):
                    self.assertEqual(before.analyze_program(program,old_dir),0)
                    self.assertEqual(after.analyze_program(program,new_dir),0)
                old=json.loads((old_dir/'summary.json').read_text());new=json.loads((new_dir/'summary.json').read_text())
                table=elf.secs['.rel.dyn']
                records=[struct.unpack_from('<QQ',elf.b,at) for at in range(table[4],table[4]+table[5],16)]
                self.assertEqual(new['total_relocations'],len(records))
                self.assertEqual(new['text_window_relocations'],old['total_relocations'])
                self.assertGreater(new['total_relocations'],old['total_relocations'])
                old['total_relocations']=new['total_relocations'];old['text_window_relocations']=new['text_window_relocations']
                self.assertEqual(old,new)
                for name in ('window-inventory.json','call-graph.json','function-index.json','section-layout.json','verify.py'):
                    self.assertEqual((old_dir/name).read_bytes(),(new_dir/name).read_bytes())
                result=subprocess.run([sys.executable,str(new_dir/'verify.py')],capture_output=True,text=True)
                self.assertEqual(result.returncode,0,result.stderr)
        finally:
            assert scratch.parent==generate.ROOT.parent.resolve() and scratch.name.startswith('relocation-total-')
            shutil.rmtree(scratch)

    def test_source_drift(self):
        with patch.object(Path,'read_bytes',return_value=b'changed'):
            with self.assertRaisesRegex(ValueError,'analyzer changed'):generate.reviewed_module()


if __name__=='__main__':unittest.main()
