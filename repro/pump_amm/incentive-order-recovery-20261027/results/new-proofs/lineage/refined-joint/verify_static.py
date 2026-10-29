from pathlib import Path
import argparse,bisect,hashlib,json,types
W=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(root,candidate,symbols):
 rp=Path(root)/"repro/pump_amm/claim-self-transfer-v144/static-tool/elf_reader.py"
 m=types.ModuleType("reader");m.__file__=str(rp);exec(compile(rp.read_bytes(),str(rp),"exec"),m.__dict__)
 original=m.Elf(Path(root)/"evidence/original/pump_amm/deployed.so");current=m.Elf(Path(candidate));syms=m.Elf(Path(symbols))
 by={f["start"]:f for f in syms.funcs};rows=[]
 targets=[("Disable",0x17960,"18pump_amm_recovered7disable17h"),("harvest_wrapper",0x74e30,"5utils5token31harvest_withheld_tokens_to_mint"),("harvest_provider",0xf6eb0,"10anchor_spl21token_2022_extensions12transfer_fee31harvest_withheld_tokens_to_mint")]
 for name,a,fragment in targets:
  found=[f for f in syms.funcs if fragment in f["name"]];assert len(found)==1,(name,found);f=found[0];size=original.entries[original.entries.index(a)+1]-a
  assert f["size"]==size,(name,size,f)
  assert original.normalized[a:a+size]==current.normalized[f["start"]:f["start"]+size],name
  assert original.pattern(a,size)==current.pattern(f["start"],size),name
  oldcalls={p-a:t for p,t in original.calls.items()if a<=p<a+size};newcalls={p-f["start"]:t for p,t in current.calls.items()if f["start"]<=p<f["start"]+size};assert oldcalls.keys()==newcalls.keys(),name
  calls=[]
  for offset,t in oldcalls.items():
   assert t in original.entries,(name,offset,t);ts=original.entries[original.entries.index(t)+1]-t;nf=by[newcalls[offset]]
   equal=ts==nf["size"] and original.normalized[t:t+ts]==current.normalized[nf["start"]:nf["start"]+ts] and original.pattern(t,ts)==current.pattern(nf["start"],ts)
   calls.append({"offset":offset,"original":hex(t),"candidate":nf,"complete_normalized_body_and_relocation_pattern_equal":equal})
  rows.append({"name":name,"original":hex(a),"candidate":f,"bytes":size,"all_normalized_instructions_equal":True,"relocation_pattern_equal":True,"actual_calls":calls})
 return {"passed":True,"candidate_sha256":sha(candidate),"symbols_sha256":sha(symbols),"bodies":rows,"scope":"Three entire normalized bodies and relocation patterns plus explicit actual first-level callees; ELF identity is not asserted."}
if __name__=="__main__":
 p=argparse.ArgumentParser();p.add_argument("--root",type=Path,required=True);p.add_argument("--candidate",type=Path,required=True);p.add_argument("--symbols",type=Path,required=True);a=p.parse_args();v=verify(a.root,a.candidate,a.symbols);(W/"static-verification.json").write_text(json.dumps(v,indent=2)+"\n");print(json.dumps({"passed":v["passed"],"bodies":[{"name":r["name"],"bytes":r["bytes"],"actual_calls":len(r["actual_calls"]),"first_level_equal":sum(c["complete_normalized_body_and_relocation_pattern_equal"]for c in r["actual_calls"])}for r in v["bodies"]]},indent=2))
