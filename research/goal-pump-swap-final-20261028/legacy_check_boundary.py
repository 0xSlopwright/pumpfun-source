#!/usr/bin/env python3
"""Test the boundary responsible for the remaining inlined diagnostic formatter."""
import json
from pathlib import Path
import probe

P=Path(__file__).resolve().parent
baseline=json.loads((P/'baseline/inventory.json').read_text())

def direct(source):
    old='    } else { check_existing(user_volume_accumulator)?; }\n    fn check_existing(user_volume_accumulator: &AccountInfo) -> Result<()> {'
    assert source.count(old)==1
    source=source.replace(old,'    } else {\n')
    assert source.count('        Ok(()) }')==1
    source=source.replace('        Ok(()) }','    }')
    return source

def mir_inline(source):
    old='    fn check_existing(user_volume_accumulator: &AccountInfo) -> Result<()> {'
    assert source.count(old)==1
    return source.replace(old,'    #[inline(always)] fn check_existing(user_volume_accumulator: &AccountInfo) -> Result<()> {')

if __name__=='__main__':
    for label,change in [('legacy-check-existing-direct',direct),('legacy-check-existing-mir',mir_inline)]:
        probe.run(label,'src/sell.rs',change,baseline)
