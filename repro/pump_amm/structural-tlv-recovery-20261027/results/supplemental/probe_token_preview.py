#!/usr/bin/env python3
"""Signed exact-quote failure precedence for Token-2022 fee previews.

Synthetic local fixtures only. Invalid fee rates are installed directly in mint
bytes to exercise the original arithmetic's failure paths; large amounts need
not be funded, because the relevant preview or slippage failure precedes CPI.
All returned fields and all diagnostics are retained and compared. Only exact
source coordinates and compute-unit lines are excluded from log comparison.
"""
from pathlib import Path
import argparse,hashlib,importlib.util,itertools,json,struct,sys
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file())
sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_trade_v2_differential as h
spec=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py')
direct=importlib.util.module_from_spec(spec);spec.loader.exec_module(direct)
MAX=(1<<64)-1
FEES=[('zero',0,0),('valid-capped',100,1),('full-forward-fee',10000,MAX),('invalid-inverse-zero-cap',10001,0),('invalid-inverse-small-cap',65535,123),('invalid-forward-large-cap',10001,MAX)]

def main():
    p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
    for (label,bps,cap),amount,minimum in itertools.product(FEES,[10**7,MAX],[1,MAX]):
        def override(vm,metas):
            h.trade_transferfee(h.quote,bps,cap)(vm,metas)
            # Whitelisting removes AMM fee-rate selection from this arithmetic probe.
            h.mutate(h.CONFIG_KEY,353,bytes(h.PAYER.pubkey()))(vm,metas)
        params=dict(name='buy_exact_quote_in_v2',amount=amount,limit=minimum,overrides=override)
        x=h.trade(**params);y=h.trade(candidate=a.candidate,**params)
        cx,cy=direct.clean(x),direct.clean(y);differences=[k for k in cx if cx[k]!=cy.get(k)]
        rows.append({'case':label,'transfer_fee_bps':bps,'maximum_fee':cap,'spendable_quote_in':amount,'minimum_base_out':minimum,'whitelist_bypasses_amm_fees':True,'original':x,'candidate':y,'mismatched_fields':differences})
    sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
    report={'scope':__doc__,'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'candidate_sha256':sha(a.candidate),'probe_sha256':sha(Path(__file__)),'comparison_sha256':sha(ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'),'harness_sha256':sha(ROOT/'scripts/pump_amm_trade_v2_differential.py'),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'cases':rows}
    a.output.write_text(json.dumps(report,separators=(',',':'))+'\n')
    print(json.dumps({'cases':len(rows),'mismatches':report['mismatch_count'],'differences':[{'case':r['case'],'amount':r['spendable_quote_in'],'minimum':r['minimum_base_out'],'original_error':r['original']['error'],'candidate_error':r['candidate']['error'],'fields':r['mismatched_fields']}for r in rows if r['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
