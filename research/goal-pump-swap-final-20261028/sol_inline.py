#!/usr/bin/env python3
"""Isolate MIR/LLVM inlining at the existing exact-SOL helper boundary."""
import json
from pathlib import Path
import probe

P=Path(__file__).resolve().parent
baseline=json.loads((P/'baseline/inventory.json').read_text())

def source(parent,kind):
    s=probe.guard(parent)
    old='#[inline] pub fn buy_exact_sol_in'
    assert s.count(old)==1
    return s.replace(old,'#[inline('+kind+')] pub fn buy_exact_sol_in')

if __name__=='__main__':
    for kind in ['always','never']:
        probe.run('exact-sol-helper-inline-'+kind,'src/buy.rs',lambda s,k=kind:source(s,k),baseline)
