import sys,subprocess,json,hashlib,re
from pathlib import Path
H=Path("/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness");sys.path.insert(0,str(H));import fastbuild
R=Path(__file__).resolve().parent;real_run=subprocess.run
def run(cmd,*args,**kw):
 if isinstance(cmd,list)and len(cmd)>1 and str(cmd[0]).endswith("/cargo")and cmd[1]=="build":
  cmd=cmd[:];cmd[1]="rustc";cmd += ["--lib","--","--emit=link,llvm-ir,mir"]
 return real_run(cmd,*args,**kw)
subprocess.run=run
W=R.parent.parent/"work/goal-pump-cto-recovery-20261029/native";O=R/"passive-ir-mir-out"
res=fastbuild.build(R/"cpi-derived-account-copy",W,O)
if res["ok"]:
 res["stripped_equal_frozen"]=(O/"candidate.so").read_bytes()==(R/"cpi-inline-account-copy-out/candidate.so").read_bytes()
 root=W/"target-identity/sbpf-solana-solana/release/deps"
 ll=root/"pump_recovered.ll";mir=root/"pump_recovered.mir"
 res["full_llvm_ir_sha256"]=hashlib.sha256(ll.read_bytes()).hexdigest();res["full_mir_sha256"]=hashlib.sha256(mir.read_bytes()).hexdigest()
 t=ll.read_text();m=re.search(r"^define[^\n]*9admin_cto7execute17[^\n]*\{\n.*?^\}",t,re.M|re.S);assert m;(R/"current-cto.ll").write_text(m[0]+"\n")
 t=mir.read_text();m=re.search(r"^fn (?:admin_cto::execute|creator::admin_cto::execute)\([^\n]*.*?^\}",t,re.M|re.S);assert m;(R/"current-cto.mir").write_text(m[0]+"\n")
res["source"]="cpi-derived-account-copy";res["root_only_additional_flags"]=["--emit=link,llvm-ir,mir"];(O/"RESULT.json").write_text(json.dumps(res,indent=2)+"\n");print(json.dumps(res,indent=2))
