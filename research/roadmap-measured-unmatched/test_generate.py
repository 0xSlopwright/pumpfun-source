import contextlib
import io
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

import generate


class MeasuredRoadmapTests(unittest.TestCase):
    def test_complete_roadmap_prioritizes_exactly_the_actual_misses(self):
        module = generate.corrected_module()
        with tempfile.TemporaryDirectory(dir=generate.ROOT.parent) as directory:
            with contextlib.redirect_stdout(io.StringIO()):
                module.generate_roadmap(directory)
            output = Path(directory)
            summary = json.loads((output / 'summary.json').read_text())
            for program, expected in [('pump', 16), ('pump_amm', 1), ('mayhem', 0)]:
                with self.subTest(program=program):
                    detail = json.loads((output / f'{program}-details.json').read_text())
                    misses = [row for row in detail['window_details'] if row['address'] not in module.MEASURED_MATCHES[program]]
                    listed = detail['unmatched_windows_by_size']
                    self.assertEqual(len(listed), expected)
                    self.assertEqual({row['address'] for row in listed}, {row['address'] for row in misses})
                    self.assertEqual(summary['programs'][program]['unmatched_estimate'], expected)
                    self.assertEqual(summary['programs'][program]['unmatched_bytes_estimate'], sum(row['size'] for row in misses))
                    self.assertEqual(summary['programs'][program]['largest_unmatched'], listed[:5])
            plan = json.loads((output / 'reconstruction-plan.json').read_text())
            for phase in plan['phases']:
                for row in phase['windows']:
                    self.assertNotIn(row['address'], module.MEASURED_MATCHES[row['program']])
            self.assertEqual(plan['total_estimated_windows_to_close'], 17)
            bindings = json.loads((output / 'candidate-bindings.json').read_text())
            self.assertEqual(bindings, module.CANDIDATE_BINDINGS)
            check = subprocess.run([sys.executable, str(output / 'verify.py')], capture_output=True)
            self.assertEqual(check.returncode, 0, check.stderr)

    def test_changed_candidate_is_rejected_before_generation(self):
        candidates = json.loads(generate.DEFAULT_CANDIDATES.read_text())
        candidates['mayhem']['sha256'] = '0' * 64
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'candidates.json'
            path.write_text(json.dumps(candidates), encoding='utf-8')
            with self.assertRaisesRegex(ValueError, 'Candidate hash mismatch: mayhem'):
                generate.corrected_module(path)
            del candidates['mayhem']
            path.write_text(json.dumps(candidates), encoding='utf-8')
            with self.assertRaisesRegex(ValueError, 'exactly the three'):
                generate.corrected_module(path)


if __name__ == '__main__':
    unittest.main()
