"""Signed liquidity can-boost success, zero and overflow-result controls."""
from pathlib import Path
import argparse, hashlib, importlib.util, json, struct, sys
ROOT = next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file())
sys.path.insert(0, str(ROOT/'scripts'))
import pump_amm_liquidity_differential as h
s=importlib.util.spec_from_file_location('predicate_direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(s);s.loader.exec_module(direct)
p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);args=p.parse_args();assert not args.output.exists();rows=[]
for name in ['deposit','withdraw']:
    for virtual in [0,1,-1,(1<<127)-1,(1<<127)-2,-(1<<127)]:
        for fee in ([0,1,2] if virtual==(1<<127)-1 else [0]):
            kw=dict(name=name,amount=1000,virtual=virtual,maxbase=0 if name=='withdraw'else(1<<64)-1,maxquote=0 if name=='withdraw'else(1<<64)-1,overrides=h.mutate(h.pool,271,struct.pack('<Q',fee)))
            a=h.run(**kw);b=h.run(candidate=args.candidate,**kw);x,y=direct.clean(a),direct.clean(b)
            rows.append(dict(instruction=name,virtual=virtual,fee=fee,original=a,candidate=b,mismatched_fields=[k for k in x if x[k]!=y[k]]))
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
report=dict(scope=__doc__,candidate_sha256=sha(args.candidate),original_sha256=sha(ROOT/'evidence/original/pump_amm/deployed.so'),probe_sha256=sha(Path(__file__)),case_count=len(rows),cases=rows,mismatch_count=sum(bool(x['mismatched_fields'])for x in rows))
args.output.write_text(json.dumps(report,separators=(',',':'))+'\n');print(json.dumps({k:report[k]for k in ['case_count','mismatch_count']}))
