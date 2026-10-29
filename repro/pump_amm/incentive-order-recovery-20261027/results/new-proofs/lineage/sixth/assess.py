from pathlib import Path
import difflib,hashlib,importlib.util,json
W=Path(__file__).resolve().parent;R=W.parents[1];s=importlib.util.spec_from_file_location('elf',R/'repro/pump_amm/claim-self-transfer-v144/static-tool/elf_reader.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);O=m.Elf(R/'evidence/original/pump_amm/deployed.so');C=m.Elf(W/'build/artifacts/unstripped.so');out=[]
for label,a,n,token,wrapper_a in [('buy',0x376b0,9936,'__global3buy17',0xe7648),('exact',0x3a5a0,12936,'__global18buy_exact_quote_in17',0xe7d88)]:
 wrapper=next(f for f in C.funcs if token in f['name']);targets=[]
 for call in C.callsites(wrapper['start'],wrapper['size']):
  f=next((f for f in C.funcs if f['start']==call['target']and (('pump_amm_recovered3buy17'in f['name'])if label=='buy'else('pump_amm_recovered18buy_exact_quote_in17'in f['name']))),None)
  if f:targets.append((call,f))
 assert len(targets)==1,(label,targets)
 call,f=targets[0];b=f['start'];x=[O.normalized[i:i+8]for i in range(a,a+n,8)];y=[C.normalized[i:i+8]for i in range(b,b+f['size'],8)];wn=O.entries[O.entries.index(wrapper_a)+1]-wrapper_a;wx=[O.normalized[i:i+8]for i in range(wrapper_a,wrapper_a+wn,8)];wy=[C.normalized[i:i+8]for i in range(wrapper['start'],wrapper['start']+wrapper['size'],8)]
 out.append({'label':label,'original_start':a,'original_bytes':n,'candidate':f,'normalized_equal':x==y,'relocation_equal':O.pattern(a,n)==C.pattern(b,f['size']),'original_call_count':len(O.callsites(a,n)),'candidate_calls':C.callsites(b,f['size']),'instruction_similarity':difflib.SequenceMatcher(None,x,y,autojunk=False).ratio(),'wrapper_original_start':wrapper_a,'wrapper_original_bytes':wn,'wrapper':wrapper,'wrapper_normalized_equal':wx==wy,'wrapper_relocation_equal':O.pattern(wrapper_a,wn)==C.pattern(wrapper['start'],wrapper['size']),'wrapper_diff_groups':[(t,i,j,k,l)for t,i,j,k,l in difflib.SequenceMatcher(None,wx,wy,autojunk=False).get_opcodes()if t!='equal'],'actual_call_to_handler':call})
(W/'handler-comparison.json').write_text(json.dumps({'candidate_sha256':hashlib.sha256((W/'build/artifacts/pump_amm_recovered.so').read_bytes()).hexdigest(),'handlers':out},indent=2)+'\n');print(json.dumps([{k:v for k,v in x.items()if k not in ['candidate_calls','wrapper_diff_groups']}for x in out],indent=2))
