#!/usr/bin/env python3
"""Restore the original rent-versus-balance gate before saturating subtraction."""
import json
from pathlib import Path
import probe
import legacy_check_boundary

P=Path(__file__).resolve().parent
baseline=json.loads((P/'baseline/inventory.json').read_text())

def gate(source):
    old='        let required_lamports = lamports.saturating_sub(user_volume_accumulator.lamports());\n        if required_lamports > 0 {'
    new='        let current_lamports = user_volume_accumulator.lamports();\n        if lamports > current_lamports { let required_lamports = lamports.saturating_sub(current_lamports);'
    assert source.count(old)==1
    return source.replace(old,new)

if __name__=='__main__':
    for label,transform in [
        ('legacy-rent-before-subtraction',gate),
        ('legacy-direct-check-rent-gate',lambda s:gate(legacy_check_boundary.direct(s))),
        ('legacy-mir-check-rent-gate',lambda s:gate(legacy_check_boundary.mir_inline(s))),
    ]:probe.run(label,'src/sell.rs',transform,baseline)
