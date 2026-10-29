from pathlib import Path
import hashlib,json,os,runpy,sys
R=Path.cwd();W=Path(__file__).resolve().parent;opened=set()
def audit(event,args):
 if event!='open' or not isinstance(args[0],(str,bytes,os.PathLike)):return
 path=Path(os.fsdecode(args[0])).resolve()
 if path.is_relative_to(R) and not path.is_relative_to(W):opened.add(path)
sys.addaudithook(audit)
probe=W/'probe_optional_bool.py';obs=R/'repro/pump_amm/owner6048-v144/runtime/observe_suite.py'
sys.argv=[str(obs),str(W/'optional-transactions.json.gz'),str(probe),'--candidate',str(W/'diagnostic-artifacts/candidate.so'),'--output',str(W/'optional.json')]
try:runpy.run_path(str(obs),run_name='__main__')
finally:
 files={str(p.relative_to(R)):hashlib.sha256(p.read_bytes()).hexdigest() for p in list(opened) if p.is_file()}
 (W/'runtime-inputs.json').write_text(json.dumps(files,indent=2)+'\n')
