#!/usr/bin/env python3
"""Restore the original separate quote comparisons after the fee-bucket exits."""
import hashlib
import json
from pathlib import Path
import subprocess
import probe

P=Path(__file__).resolve().parent
R=P.parents[1]
baseline=json.loads((P/'baseline/inventory.json').read_text())
source=subprocess.check_output(['git','show','e38a8b97a:research/pump-sweep-quote-read-timing-20261029/source/programs/pump/src/sweep_fees.rs'],cwd=R).decode()
assert hashlib.sha256(source.encode()).hexdigest()=='3d3363ddd7713999363bf950fb404fa4e35e42731d43806cb6ceeccda94985e9'

def split_bucket(parent, protocol_first=False):
    start=source.index(' let amount=if creator{')
    end=source.index('  crate::buy_v2::admit_associated_token_account',start)
    count=source[start:end].count('\n')
    creator='let amount=a.bonding_curve.creator_fee;a.bonding_curve.creator_fee=0;if amount==0{msg!("Nothing to sweep for fee bucket {}",1u8);return Ok(());}let native=a.bonding_curve.quote_mint==Pubkey::default();if native{let minimum=Rent::get()?.minimum_balance(0);if a.recipient.lamports()<minimum{crate::legacy_buy::native_payments::transfer(a.system_program.as_ref(),&a.payer,a.recipient.as_ref(),minimum)?;}}(amount,native)'
    protocol='let amount=a.bonding_curve.protocol_fees;a.bonding_curve.protocol_fees=0;if amount==0{msg!("Nothing to sweep for fee bucket {}",0u8);return Ok(());}let native=a.bonding_curve.quote_mint==Pubkey::default();(amount,native)'
    middle=' let(amount,native)=if '+('!creator'if protocol_first else'creator')+'{'+(protocol if protocol_first else creator)+'}else{'+(creator if protocol_first else protocol)+'};\n'
    middle+='\n'*(count-2)+' if !native{\n'
    assert middle.count('\n')==count
    return source[:start]+middle+source[end:]

if __name__=='__main__':
    probe.run('sweep-read-timing-current','src/sweep_fees.rs',lambda _:source,baseline)
    probe.run('sweep-separate-creator-native','src/sweep_fees.rs',split_bucket,baseline)
    probe.run('sweep-separate-protocol-native','src/sweep_fees.rs',lambda s:split_bucket(s,True),baseline)
