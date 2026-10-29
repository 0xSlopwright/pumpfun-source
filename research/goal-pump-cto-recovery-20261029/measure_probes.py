import sys,re,json,hashlib,struct,collections,difflib,subprocess
from pathlib import Path
H=Path("/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness");sys.path.insert(0,str(H));import score,win
R=Path(__file__).resolve().parent;BASE=R.parent/"goal-pump-recovery-20261028/current-parent/unstripped.so";b=score.score(BASE);o=next(w for w in score.original_windows()if w["start"]==0x22a10);ot=[x[2]for x in win.insns(o["raw"],o["start"],win.ORIG_SECS)]
def measure(path):
 c=win.Cand(path);s=score.score(path);a,n,nm=next(f for f in c.funcs if re.search(r"admin_cto::execute$",win.demangle(f[2])));ct=[x[2]for x in win.insns(c.fn(a,n),a,c.secs)];fmap={a:(z,win.demangle(nm))for a,z,nm in c.funcs};cnt=collections.Counter();calls=[];raw=c.fn(a,n)
 for i in range(0,len(raw),8):
  op,regs,off,imm=struct.unpack_from("<BBhi",raw,i)
  if op!=0x85:continue
  target=a+i+8+imm*8;callee="EXTERNAL_RELOCATED"if imm==-1 else fmap.get(target,(0,hex(target)))[1];cnt[callee]+=1;calls.append({"offset":hex(i),"target":hex(target),"name":callee})
 return {"probe":path.parent.name,"unstripped_sha256":hashlib.sha256(c.blob).hexdigest(),"candidate_sha256":hashlib.sha256((path.parent/"candidate.so").read_bytes()).hexdigest(),"normalized":sum(x["normalized"]for x in s.values()),"raw":sum(x["raw"]for x in s.values()),"normalized_gains":[hex(k)for k,v in s.items()if v["normalized"]and not b[k]["normalized"]],"normalized_losses":[hex(k)for k,v in s.items()if not v["normalized"]and b[k]["normalized"]],"raw_gains":[hex(k)for k,v in s.items()if v["raw"]and not b[k]["raw"]],"raw_losses":[hex(k)for k,v in s.items()if not v["raw"]and b[k]["raw"]],"cto":{"start":hex(a),"original_bytes":o["bytes"],"candidate_bytes":n,"diagnostic_similarity":difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio(),"actual_defined_calls":sum(cnt.values())-cnt["EXTERNAL_RELOCATED"],"external_relocated_calls":cnt["EXTERNAL_RELOCATED"],"callee_counts":dict(cnt),"calls":calls}}
rows=[]
for d in sorted(R.glob("*-out")):
 p=d/"unstripped.so"
 if not p.exists():continue
 row=measure(p);source=R/d.name.removesuffix("-out")if d.name!="passive-ir-mir-out"else R/"cpi-derived-account-copy";row["source_files_sha256"]={str(p.relative_to(source)):hashlib.sha256(p.read_bytes()).hexdigest()for p in sorted(source.rglob("*"))if p.is_file()}
 log=d/"build.log";row["build_log_sha256"]=hashlib.sha256(log.read_bytes()).hexdigest()if log.exists()else None;row["stack_offset_warnings"]=[x.strip()for x in log.read_text().splitlines()if"exceeded max offset"in x]if log.exists()else None
 rows.append(row)
runtime=R.parent/"goal-pump-swap-final-20261028/runtime-cto-inline-copy";qualification=None
if(runtime/"execution.json").exists()and(runtime/"audit.json").exists():
 execution=json.loads((runtime/"execution.json").read_text());audit=json.loads((runtime/"audit.json").read_text());assert execution["candidate_sha256"]==audit["candidate_sha256"]
 qualification={"candidate_sha256":execution["candidate_sha256"],"execution_path":str((runtime/"execution.json").relative_to(R.parent)),"execution_sha256":hashlib.sha256((runtime/"execution.json").read_bytes()).hexdigest(),"audit_path":str((runtime/"audit.json").relative_to(R.parent)),"audit_sha256":hashlib.sha256((runtime/"audit.json").read_bytes()).hexdigest(),"case_pairs":audit["case_pairs"],"signed_outcomes":audit["signed_outcomes"],"signature_fields_verified":audit["signature_fields_verified"],"scope":"Independent parent-produced bounded signed runtime qualification. Applies only to this exact stripped image, not later source controls or whole-window identity."}
 for row in rows:row["qualified_runtime_image_equal"]=row["candidate_sha256"]==qualification["candidate_sha256"]
report={"status":"incomplete_no_new_window","scope":"Isolated current-source CTO controls. Producer performs no runtime execution or canonical promotion. Exact-image bounded runtime receipt is linked separately where available. Similarity is diagnostic only; strict full-window memberships govern.","baseline":{"unstripped_sha256":hashlib.sha256(BASE.read_bytes()).hexdigest(),"normalized":sum(x["normalized"]for x in b.values()),"raw":sum(x["raw"]for x in b.values())},"original_sha256":hashlib.sha256((score.BASE/"original.so").read_bytes()).hexdigest(),"exact_image_runtime_qualification":qualification,"probes":rows};(R/"PROBE-REPORT.json").write_text(json.dumps(report,indent=2)+"\n");summary=[{k:r[k]for k in ["probe","normalized","raw","normalized_gains","normalized_losses"]}|{"cto_bytes":r["cto"]["candidate_bytes"],"similarity":r["cto"]["diagnostic_similarity"],"defined_calls":r["cto"]["actual_defined_calls"]}for r in rows];(R/"measurement-summary.json").write_text(json.dumps(summary,indent=2)+"\n");print(json.dumps(summary,indent=2))
