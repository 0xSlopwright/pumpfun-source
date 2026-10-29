#!/usr/bin/env python3
"""Bounded function-optimization controls for the two-load exact-SOL residual."""
import json
from pathlib import Path
import probe

P=Path(__file__).resolve().parent
baseline=json.loads((P/'baseline/inventory.json').read_text())
buy=(P/'source/src/buy.rs').read_text()
guard=probe.guard(buy)
needle="    pub fn buy_exact_sol_in<'info>"

def variant(source,mode):
    assert source.count(needle)==1
    return '#![feature(optimize_attribute)] '+source.replace(needle,'    #[optimize('+mode+')] '+needle.lstrip())

if __name__=='__main__':
    for mode in ['speed','size']:
        probe.run('exact-sol-optimize-'+mode,'src/lib.rs',lambda s,m=mode:variant(s,m),baseline,overlays={'src/buy.rs':guard})
