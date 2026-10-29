import sys,subprocess,json,hashlib,re
from pathlib import Path
sys.path.insert(0,"/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness")
import fastbuild
r=Path(__file__).resolve().parent
real_run=subprocess.run
def run(cmd,*args,**kw):
 if isinstance(cmd,list) and len(cmd)>1 and str(cmd[0]).endswith("/cargo") and cmd[1]=="build":
  cmd=cmd[:];cmd[1]="rustc";cmd += ["--lib","--","--emit=link,llvm-ir"]
 return real_run(cmd,*args,**kw)
subprocess.run=run
w=r.parent.parent/"work/goal-pump-recovery-20261028/sell-inline-quote-options-build"
o=r/"sell-passive-ir-out"
result=fastbuild.build(r/"sell-inline-quote-options",w,o)
ll=w/"target-identity/sbpf-solana-solana/release/deps/pump_recovered.ll"
if result["ok"]:
 text=ll.read_text();m=re.search(r"^define[^\n]*pump_recovered5trade4sell17[^\n]*\{\n.*?^\}",text,re.M|re.S);assert m
 (r/"current-sell.ll").write_text(m[0]+"\n")
 result["full_module_sha256"]=hashlib.sha256(ll.read_bytes()).hexdigest()
 result["source"]="sell-inline-quote-options"
 result["root_only_additional_flags"]=["--emit=link,llvm-ir"]
 result["stripped_equal_best"]=(o/"candidate.so").read_bytes()==(r/"sell-inline-quote-options-out/candidate.so").read_bytes()
(o/"result.json").write_text(json.dumps(result,indent=2)+"\n")
print(json.dumps(result,indent=2))
