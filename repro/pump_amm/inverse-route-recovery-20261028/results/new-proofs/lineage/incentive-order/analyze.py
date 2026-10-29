from pathlib import Path
import ast,base64,collections,gzip,hashlib,importlib.util,itertools,json,struct,subprocess,sys,tempfile
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W))
from elf_reader import Elf
from solders.transaction import Transaction
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(p):
 s=importlib.util.spec_from_file_location('independent_'+p.stem,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
clean=module(W/'cleaner.py').clean
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
FIXED='c7f71e05fa3477dd78273ae3e5a0669a145ba800cd3b8365111163edfd93330f'
JOINT='c20007e860f47db1cc443344605afafe505d61bb4de6d61306fa164db3482544'
BASE='58478a978292ea6bc4e6a9776a536f91a9384da7f1f82a2e1f9743659a34b58b'

def branch_review(path):
 o=Elf(path)
 assert H(path)==ORIGINAL
 def ins(p):return struct.unpack_from('<BBhi',o.b,p)
 assert ins(0x6db28)==(0xbf,0x28,0,0) # self -> callee-saved r8
 assert ins(0x6db90)==(0x79,0x57,-4064,0) # current timestamp from stack arg -> r7
 assert ins(0x6dbe0)==(0x79,0x81,512,0) # stored start -> r1
 op,r,off,imm=ins(0x6dbe8);assert(op,r,imm)==(0xcd,0x17,0) # signed current < start
 target=0x6dbe8+8+off*8;assert target==0x6ded8
 assert ins(target)==(0xbf,0x81,0,0)
 assert o.calls[target+8]==0x6f3c8
 assert ins(0x6dbf0)==(0x79,0x82,520,0) # stored end -> r2
 op,r,off,imm=ins(0x6dc00);assert(op,r,off,imm)==(0xcd,0x72,1,0) # signed end < current
 assert ins(0x6f3c8)==(0x79,0x10,520,0) # end_day reads end
 assert ins(0x6f428)==(0x79,0x12,512,0) # end_day reads start
 assert ins(0x6f448)==(0x79,0x11,528,0) # end_day reads period
 return {'function':'0x6db20','current_stack_arg_load':'0x6db90','stored_start_load':'0x6dbe0','signed_current_before_start_branch':'0x6dbe8','taken_target':hex(target),'taken_next_call':'0x6f3c8','fallthrough_stored_end_load':'0x6dbf0','fallthrough_finished_range_branch':'0x6dc00','scope':'A conditional path proof; not a claim that end_day dominates all errors.'}

def corpus(w=W):
 allowed={'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA':None,'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':H(w/'dependencies/spl_token/deployed.so'),'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':H(w/'dependencies/spl_token_2022/deployed.so'),'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':H(w/'dependencies/associated_token/deployed.so')}
 tree=ast.parse((w/'cases.py').read_text());fn=next(x for x in tree.body if isinstance(x,ast.FunctionDef)and x.name=='cases');ns={'itertools':itertools};exec(compile(ast.Module(body=[fn],type_ignores=[]),'<cases>','exec'),ns);domain=ns['cases']();assert len(domain)==1730
 groups=[];saved={}
 for entry in load(w/'case-index.json'):
  r=load(w/'cases'/entry['name']/'report.json.gz');obs=load(w/'cases'/entry['name']/'transactions.json.gz');rows=r['cases'];seq=obs['transactions'];assert len(rows)==entry['case_count'];assert len(seq)==2*len(rows)
  assert r['original_sha256']==ORIGINAL and r['candidate_sha256']==entry['candidate_sha256'];assert obs['script_sha256']==H(w/entry['producer'])==entry['producer_sha256'];assert obs['observer_sha256']==H(w/'observer.py')
  assert hashlib.sha256(gzip.decompress((w/'cases'/entry['name']/'report.json.gz').read_bytes())).hexdigest()==entry['report_sha256']
  mismatches=[];signatures=0;success=0
  for i,row in enumerate(rows):
   a,b=row['original'],row['candidate'];x,y=clean(a),clean(b);different=sorted(k for k in set(x)|set(y)if x.get(k)!=y.get(k));success+=a['error']is None
   if different:mismatches.append(i)
   if 'different_fields'in row:assert different==sorted(row['different_fields'])
   if entry['name'] in ['baseline1730','fixed1730','joint1730']:assert row['input']==domain[i]
   if'before'in a:assert a['before']==b['before']
   pair=seq[2*i:2*i+2];messages=[]
   for j,t in enumerate(pair):
    v=a if j==0 else b;raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);ok=tx.verify_with_results();assert ok and all(ok)and t['all_signatures_verified'];assert len(ok)==t['signature_count'];signatures+=len(ok);messages.append(bytes(tx.message))
    assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256'];assert hashlib.sha256(json.dumps(v['logs'],separators=(',',':')).encode()).hexdigest()==t['logs_sha256'];assert t['error']==v['error'];want=ORIGINAL if j==0 else entry['candidate_sha256'];assert t['amm_program_sha256']==want
    for pid,pr in t['loaded_programs'].items():assert pr['sha256']==(want if allowed[pid]is None else allowed[pid])
    if'transaction_base64'in v:assert v['transaction_base64']==t['transaction_base64']
   assert messages[0]==messages[1]
  assert len(mismatches)==entry['expected_mismatches'];saved[entry['name']]=(rows,mismatches)
  groups.append({'group':entry['name'],'cases':len(rows),'transactions':len(seq),'signature_fields':signatures,'mismatches':len(mismatches),'original_successes':success})
 old,bad=saved['baseline1730'];new,newbad=saved['joint1730'];assert not newbad and not saved['fixed1730'][1]
 assert [x['input']for x in old]==[x['input']for x in new]
 expected=[i for i,x in enumerate(domain)if x.get('new_start')==x.get('new_end')==0 and x.get('supply',0)>0 and x.get('end',49)<x.get('now',10)<x.get('start',20)]
 assert bad==expected and len(bad)==128
 panics=collections.Counter()
 for i in bad:
  a,b=old[i]['original'],old[i]['candidate'];c=new[i]['candidate'];assert a['after']==b['after']and clean(a)==clean(c)
  assert a['error']=='TransactionErrorInstructionError((0, Fieldless(ProgramFailedToComplete)))';assert b['error']=='TransactionErrorInstructionError((0, Tagged(InstructionErrorCustom(6035))))'
  p='negative_end_cast'if domain[i]['end']<0 else'end_before_start_subtraction';panics[p]+=1
  needle='SVM is 64-bit'if p=='negative_end_cast'else'end_time should be bigger than start_time';assert any(needle in l for l in a['logs'])
 assert dict(panics)=={'negative_end_cast':112,'end_before_start_subtraction':16}
 eq=[i for i,x in enumerate(domain)if x.get('new_start')==x.get('new_end')==0 and x.get('supply',0)>0 and x.get('now',10)==x.get('start',20)and x.get('end',49)<x.get('now',10)]
 assert len(eq)==88
 for i in eq:assert 'InstructionErrorCustom(6035)'in old[i]['original']['error']and clean(old[i]['original'])==clean(new[i]['candidate'])
 # A global end_day-first rewrite would wrongly panic here instead of 6035.
 global_counter=next(i for i,x in enumerate(domain)if x.get('new_start')==x.get('new_end')==0 and x.get('supply')==1 and(x.get('start'),x.get('end'),x.get('period'),x.get('now'))==(0,0,0,1))
 assert 'InstructionErrorCustom(6035)'in old[global_counter]['original']['error']
 assert sum(g['cases']for g in groups)==7727 and sum(g['transactions']for g in groups)==15454 and sum(g['signature_fields']for g in groups)==15468
 return {'groups':groups,'counterexamples':{'indices':bad,'count':128,'exact_condition':'range update disabled; supply > 0; stored end < now < stored start','panics':dict(panics),'states_differ':0},'guard_negative_controls':{'strict_greater_would_break_equality_cases':88,'global_end_day_first_counterexample_index':global_counter,'unconditional_finished_guard_reproduces_counterexamples':128,'requested_start_instead_of_stored_start_preserves_bad_cases':sum(domain[i]['now']>=domain[i]['new_start'] for i in bad)},'selected_case_counts_overlap':{'new_domain':1730,'retained_incentive':700,'retained_volume':1805},'all_records_including_historical_negatives':{'cases':7727,'transactions':15454,'signature_fields':15468}}

def source_review(w=W):
 r=load(w/'source-records.json');assert r['changed']==['programs/pump-amm/src/state/volume_accumulator.rs'];assert r['source_unchanged']and r['returncode']==0;assert r['dependency_before']==r['dependency_after']and len(r['dependency_before'])==762
 assert r['baseline_candidate']==BASE and r['fixed_candidate']==FIXED;assert len(r['fixed_inputs'])==227
 key=r['changed'][0];assert H(w/'source/fixed.rs')==r['fixed_inputs'][key]and H(w/'source/baseline.rs')==r['baseline_inputs'][key]
 before=(w/'source/baseline.rs').read_text();after=(w/'source/fixed.rs').read_text();old='            require!(current_timestamp<=self.end_time,PumpAmmError::SupplyUpdateForFinishedRange);';new='            if current_timestamp>=self.start_time {\n                require!(current_timestamp<=self.end_time,PumpAmmError::SupplyUpdateForFinishedRange);\n            }';assert before.replace(old,new)==after
 with tempfile.TemporaryDirectory()as td:
  p=Path(td)/key;p.parent.mkdir(parents=True);p.write_text(before);run=subprocess.run(['patch','--batch','-p1','-i',str(w/'recovery.patch')],cwd=td,capture_output=True,text=True);assert run.returncode==0;assert p.read_text()==after
 assert H(w/'candidate.so')==FIXED and H(w/'baseline.so')==BASE
 joint=load(w/'records/joint-build.json');assert H(w/'joint-candidate.so')==JOINT==joint['comparison']['candidate_sha256'];assert (w/'source/joint.rs').read_bytes()==(w/'source/fixed.rs').read_bytes();matches=[v for k,v in joint['source_sha256'].items() if k.endswith('programs/pump-amm/src/state/volume_accumulator.rs')];assert matches==[H(w/'source/joint.rs')];assert joint['source_sha256']==joint['source_after_sha256'] and joint['source_unchanged'] and joint['returncode']==0
 return {'only_changed_file':key,'minimal_guard_verified':True,'compiled_source_inputs':227,'dependency_artifacts_unchanged':762,'candidate_sha256':FIXED,'normalized_windows':656,'raw_windows':148,'scope':'Build-input record and exact one-file patch; no fresh compiler executed here.'}

def run(w=W):
 w=Path(w);return {'original_branch':branch_review(w/'original.so'),'source':source_review(w),'corpus':corpus(w),'new_vm_executions':0,'whole_elf_equal':False}
if __name__=='__main__':print(json.dumps(run(),indent=2))
