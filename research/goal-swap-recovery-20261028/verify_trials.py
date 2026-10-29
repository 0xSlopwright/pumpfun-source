#!/usr/bin/env python3
"""Recount retained native source-screen artifacts; not a promotion verifier."""
from pathlib import Path
import hashlib,importlib.util,json
R=Path(__file__).resolve().parent
REPO=R.parents[1]
spec=importlib.util.spec_from_file_location('measure', R/'tools/measure.py')
measurement=importlib.util.module_from_spec(spec);spec.loader.exec_module(measurement)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 original=REPO/'evidence/original/pump_amm/deployed.so'
 assert sha(original)=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
 # Cache only the immutable original parser; retain the unchanged measurement rule.
 Elf=measurement._elf_class(); original_elf=Elf(original)
 measurement._elf_class=lambda:lambda p:original_elf if p.resolve()==original.resolve() else Elf(p)
 baseline=measurement.measure(original,R/'baseline.so')
 before={r['original'] for r in baseline if r['match']}
 assert len(baseline)==785 and len(before)==779
 results=[]
 for path in sorted([*R.glob('trials/*/symbols.so'),*R.glob('trylane/trials/*/symbols.so')]):
  rows=measurement.measure(original,path); after={r['original'] for r in rows if r['match']}
  assert rows==json.loads(path.with_name('rows.json').read_text()),path
  results.append({'path':str(path.relative_to(R)),'sha256':sha(path),'normalized':len(after),'raw':sum(r['raw'] for r in rows),'gains':sorted(after-before),'losses':sorted(before-after),'sell_matched':'0x4c750' in after})
 assert len(results)==json.loads((R/'source-screen.json').read_text())['successful_root_compiles']
 print(json.dumps({'retained_builds':len(results),'native_baseline_normalized':779,'native_baseline_raw':sum(r['raw'] for r in baseline),'new_sell_matches':sum(r['sell_matched'] for r in results),'official_maintained_selection_changed':False,'results':results},indent=2))
if __name__=='__main__':main()
