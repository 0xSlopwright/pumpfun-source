#!/usr/bin/env python3
"""Test a true error-only residual type at the exact-SOL aggregate boundary."""
import json
from pathlib import Path
import probe

P=Path(__file__).resolve().parent
baseline=json.loads((P/'baseline/inventory.json').read_text())
old='require_gte!(spendable_sol_in,total,PumpError::TooMuchSolRequired);'
e='error!(PumpError::TooMuchSolRequired).with_values((spendable_sol_in,total))'
variants={
 'map':'return Err::<core::convert::Infallible,Error>('+e+').map(|never|match never{});',
 'match':'match Err::<core::convert::Infallible,Error>('+e+'){Err(error)=>return Err(error),Ok(never)=>match never{}}',
 'try':'let failure:Result<core::convert::Infallible>=try{Err::<core::convert::Infallible,Error>('+e+')?};return failure.map(|never|match never{});',
}

def source(parent,kind):
    s=probe.guard(parent)
    assert s.count(old)==1
    return s.replace(old,'if spendable_sol_in < total {'+variants[kind]+'}')

if __name__=='__main__':
    for kind in ['map','match','try']:
        overlays={'src/lib.rs':'#![feature(try_blocks)] '+(P/'source/src/lib.rs').read_text()}if kind=='try'else None
        probe.run('exact-sol-infallible-'+kind,'src/buy.rs',lambda s,k=kind:source(s,k),baseline,overlays=overlays)
