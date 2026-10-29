from source_fields import source_fields
def sweep(o,c,s,rows):
 a,n=0x59408,4456;fs=[f for f in s.funcs if '10sweep_fees7execute17h'in f['name']];assert len(fs)==1
 f=fs[0];b=f['start'];assert f['size']==n
 assert o.pattern(a,n)==c.pattern(b,n)
 diffs=[i for i in range(0,n,8)if o.normalized[a+i:a+i+8]!=c.normalized[b+i:b+i+8]]
 assert diffs==[1208,1688],diffs
 of=source_fields(o,a,n);cf=source_fields(c,b,n)
 assert [(x['line_store']-a,x['line'])for x in of]==[(1208,91),(1688,113)]
 assert [(x['line_store']-b,x['line'])for x in cf]==[(1208,32),(1688,43)]
 assert all(x['filename']=='programs/pump-amm/src/instructions/sweep_fees.rs'for x in of+cf)
 left,right=bytearray(o.normalized[a:a+n]),bytearray(c.normalized[b:b+n])
 for off in diffs:
  assert left[off:off+4]==right[off:off+4]and left[off]==0x62
  left[off+4:off+8]=right[off+4:off+8]=bytes(4)
 assert left==right
 om=o.callsites(a,n);cm=c.callsites(b,n);assert len(om)==len(cm)==31 and [x['offset']for x in om]==[x['offset']for x in cm]
 targets={r['start']:{q['start']for q in r['matches']}for r in rows};calls=[]
 names={q['start']:q['name']for q in s.funcs}
 for x,y in zip(om,cm):
  if targets.get(x['target']):assert y['target']in targets[x['target']],('wrong actual callee',x,y)
  calls.append({'offset':x['offset'],'original_target':hex(x['target']),'candidate_target':hex(y['target']),'candidate_name':names.get(y['target']),'target_full_body_pair':y['target']in targets.get(x['target'],set())})
 return {'original_start':hex(a),'candidate_function':f,'bytes':n,'remaining_instruction_differences':diffs,'original_source_fields':of,'candidate_source_fields':cf,'typed_source_line_masked_body_equal':True,'normalization_unchanged':True,'direct_calls':calls,'direct_call_positions':31,'direct_callee_full_body_pairs':sum(x['target_full_body_pair']for x in calls),'all_direct_callees_closed':all(x['target_full_body_pair']for x in calls),'raw_or_normalized_window_match':False}
