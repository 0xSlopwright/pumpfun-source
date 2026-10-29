#!/usr/bin/env python3
"""Synthetic signed SBF failure-order probes for the fee-accrual helper.

The synthetic quote-token amount is U64_MAX but the native lamports are not
matched to that fabricated balance. These cases establish failure precedence,
not economically valid pool operation or a complete trade equivalence claim.
"""
from pathlib import Path
import argparse, hashlib, json, re, sys, struct
ROOT=Path.cwd()
sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_trade_v2_differential as t
D=ROOT/'work/amm-amount-helper-worker-20261027'
U64=(1<<64)-1

def normalize_logs(logs):
    return [re.sub(r'AnchorError thrown in .*?:\d+\.', 'AnchorError thrown in <source>.', log)
            for log in logs if not re.match(r'^Program .* consumed \d+ of \d+ compute units$',log)]

def mutate(h,key,offset,value):
    a=h.vm.get_account(key);d=bytearray(a.data);d[offset:offset+len(value)]=value
    h.vm.set_account(key,t.Account(a.lamports,bytes(d),a.owner))

def collide(h,m,quote_empty=False,base_frozen=False):
    for key,offset,value in [(t.pool,271,struct.pack('<Q',U64)),(t.pool,279,bytes(8)),(t.pool,245,(-(U64-10**13)).to_bytes(16,'little',signed=True)),(t.vaultquote,64,struct.pack('<Q',U64))]:
        mutate(h,key,offset,value)
    if quote_empty:mutate(h,t.userquote,64,bytes(8))
    if base_frozen:mutate(h,t.vaultbase,108,b'\x02')
    t.custom_fee_table([(0,(25,5,0))])(h,m)

def main():
    p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);args=p.parse_args()
    rows=[]
    for name in ['buy_v2','buy_exact_quote_in_v2']:
        for quote_empty,base_frozen in [(False,False),(True,False),(False,True),(True,True)]:
            label='protocol-overflow'+('-insufficient-user-quote' if quote_empty else '')+('-frozen-base-vault' if base_frozen else '')
            def ov(h,m):collide(h,m,quote_empty,base_frozen)
            params=dict(amount=10**7 if name=='buy_exact_quote_in_v2' else 10**10,limit=10**12 if name=='buy_v2' else 1,overrides=ov)
            a=t.trade(name,**params);b=t.trade(name,candidate=args.candidate,**params)
            fields=[key for key in ['error','inner','states'] if a[key]!=b[key]]
            if normalize_logs(a['logs'])!=normalize_logs(b['logs']):fields.append('logs_except_source_coordinates_and_compute')
            rows.append({'instruction':name,'case':label,'original':a,'candidate':b,'mismatched_fields':fields})
    report={'scope':__doc__,'original_sha256':hashlib.sha256((ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(args.candidate.read_bytes()).hexdigest(),'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields']) for x in rows),'cases':rows}
    args.output.write_text(json.dumps(report,indent=2)+'\n')
    for r in rows:print(r['instruction'],r['case'],r['original']['error'],r['candidate']['error'],r['mismatched_fields'])
if __name__=='__main__':main()
