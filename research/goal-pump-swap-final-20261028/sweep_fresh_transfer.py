"""Restore the observed second quote-mint comparison after account-admission CPIs."""
from pathlib import Path
import json,probe
R=Path(__file__).resolve().parent
baseline=json.loads((R/'baseline/inventory.json').read_text())
source=(R/'composition/source/src/sweep_fees.rs').read_text()
assert source.count('native,a.base_mint.as_ref().as_ref(),a.bonding_curve.as_ref(),')==1
def change(_):
 return source.replace('native,a.base_mint.as_ref().as_ref(),a.bonding_curve.as_ref(),','a.bonding_curve.quote_mint==Pubkey::default(),a.base_mint.as_ref().as_ref(),a.bonding_curve.as_ref(),')
probe.run('sweep-fresh-quote-at-transfer','src/sweep_fees.rs',change,baseline)
