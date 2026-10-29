from pathlib import Path
import sys,subprocess,json,gzip,hashlib,difflib,re
sys.dont_write_bytecode=True
B=Path("/mnt/c/Users/ahi20/Documents/ChatGPT/pumpfun-contribution-review/pump-v3-execute-buy-20261029")
P=B.parent/"pump-legacy-exact-sol-20261029"
L=Path("/home/ahi200/pumpfun-work/20261029-pump-legacy-exact-sol")
R=B.parent.parent/"pumpfun-source"
sys.path.insert(0,str(P/"tools"))
import census
census.ROOT=R
O=L/"execute-key-slice"
sha=lambda b:hashlib.sha256(b).hexdigest()
parent=L/"costs-parent/symbols.so"
candidate=O/"symbols.so"
pc=json.loads(gzip.decompress((L/"costs-parent/costs-census.json.gz").read_bytes()))
onames={w["start"]:w["normalized_matches"][0]["symbol"] for w in pc["windows"] if w["normalized_matches"]}
rows={};norms={};raws={}
for label,path in [("original",R/"evidence/original/pump/deployed.so"),("parent",parent),("candidate",candidate)]:
 blob=path.read_bytes();sec=census.sections(blob)
 funcs=list(census.functions(blob))
 if label=="original":a,z,n=0x83c00,3440,"original 0x83c00";names=onames
 else:
  matches=[f for f in funcs if "5trade14v3_execute_buy17h" in f[2]]
  assert len(matches)==1
  a,z,n=matches[0];names={address:name for address,size,name in funcs}
 raw=census.body(blob,sec,a,z);norm,refs=census.normalize(raw,a,sec);norms[label]=norm;raws[label]=raw
 calls=[{**r,"symbol":names.get(r["target"])} for r in refs if r["kind"]=="direct-call"]
 rows[label]={"path":str(path),"image_sha256":sha(blob),"address":hex(a),"bytes":z,"symbol":n,"raw_sha256":sha(raw),"normalized_sha256":sha(norm),"calls":calls}
 if label=="candidate":
  dump=subprocess.check_output(["/home/ahi200/pumpfun-work/20261027-crank/sdk/llvm/bin/llvm-objdump","-d","--no-show-raw-insn","--start-address="+str(a),"--stop-address="+str(a+z),str(path)])
  (O/"target.asm").write_bytes(dump);(O/"target.normalized.bin").write_bytes(norm)
def compare(a,b):
 split=lambda x:[x[i:i+8] for i in range(0,len(x),8)]
 changes=[{"kind":t,"left":[i,j],"right":[k,l]} for t,i,j,k,l in difflib.SequenceMatcher(None,split(norms[a]),split(norms[b]),autojunk=False).get_opcodes() if t!="equal"]
 return {"normalized_equal":norms[a]==norms[b],"raw_equal":raws[a]==raws[b],"aligned_differing_slots":sum(max(x["left"][1]-x["left"][0],x["right"][1]-x["right"][0]) for x in changes),"changes":changes}
cc=census.census(candidate)
member=lambda c:{w["start"]:(bool(w["normalized_matches"]),w["raw_match"]) for w in c["windows"]}
pm,cm=member(pc),member(cc)
membership={hex(k):[pm[k],cm[k]] for k in pm if pm[k]!=cm[k]}
stable=lambda n:re.sub(r"17h[0-9a-f]{16}E$","17h<HASH>E",n) if n else None
callseq={k:[stable(c["symbol"]) for c in v["calls"]] for k,v in rows.items()}
report={"scope":"Single normal-source safe Rust probe; aligned slots are diagnostic only, official full normalized census is unchanged/match criterion.","images":rows,"comparisons":{a+"_vs_"+b:compare(a,b) for a,b in [("original","parent"),("original","candidate"),("parent","candidate")]},"counts":cc["counts"],"membership_changes":membership,"call_counts":{k:len(v) for k,v in callseq.items()},"call_symbol_sequence_equal_original_candidate":callseq["original"]==callseq["candidate"],"call_symbol_sequence_equal_parent_candidate":callseq["parent"]==callseq["candidate"],"measurement_script_sha256":sha(Path(__file__).read_bytes())}
assert not (O/"measurement.json").exists()
(O/"measurement.json").write_text(json.dumps(report,indent=2)+"\n")
(O/"census.json.gz").write_bytes(gzip.compress(json.dumps(cc).encode(),mtime=0))
print(json.dumps({"comparisons":{k:{p:v for p,v in x.items() if p!="changes"} for k,x in report["comparisons"].items()},"target_bytes":{k:x["bytes"] for k,x in rows.items()},"counts":report["counts"],"membership_changes":membership,"call_counts":report["call_counts"],"call_symbol_sequence_equal_original_candidate":report["call_symbol_sequence_equal_original_candidate"],"call_symbol_sequence_equal_parent_candidate":report["call_symbol_sequence_equal_parent_candidate"]},indent=2))

