from pathlib import Path
import hashlib,importlib.util,json,sys
sys.dont_write_bytecode=True
def h(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def verify(root=None):
 w=Path(root or Path(__file__).resolve().parent);sys.path.insert(0,str(w));files=json.loads((w/'manifest.json').read_text())['files']
 assert files=={str(p.relative_to(w)):h(p)for p in w.rglob('*')if p.is_file()and p!=w/'manifest.json'}
 assert h(w/'candidate.so')=='e33e6aace7d53008b3300364c07540f0cd7d1764196cd601554b08838b06e615'
 e=module('cpi_elf',w/'elf_reader.py');o=e.Elf(w/'original.so');c=e.Elf(w/'candidate.so');s=e.Elf(w/'symbols.so');f=next(x for x in s.funcs if 'fees16select_and_apply' in x['name'])
 assert f['size']==2248 and len(o.callsites(0x13458,2264))==11 and len(c.callsites(f['start'],f['size']))==12
 for name,a,n in [('cpi24get_fees_with_quote_mint',0xdade8,3200),('drop_in_place$LT$anchor_lang..context..CpiContext$LT$pump_amm_recovered..pump_fees',0x98c0,600)]:
  q=next(x for x in s.funcs if name in x['name']);assert q['size']==n
  assert o.normalized[a:a+n]==c.normalized[q['start']:q['start']+n]
  assert o.pattern(a,n)==c.pattern(q['start'],n)
 trace=module('cpi_trace',w/'carrier_trace.py').analyze();assert json.loads(json.dumps(trace))==json.loads((w/'carrier-trace.json').read_text())
 assert trace['original']['context']==('add',('sp',),(1<<64)-288)
 assert trace['candidate']['context']==('add',('sp',),(1<<64)-184)
 assert trace['candidate']['copies']==[{'pc':1512,'bytes':184,'source':('add',('sp',),(1<<64)-400),'destination':('add',('sp',),(1<<64)-184)}]
 assert not trace['original']['copies']
 framework=(w/'framework-cpi.rs').read_text();assert "ctx: anchor_lang::context::CpiContext<'a, 'b, 'c, 'info"in framework and'ctx.to_account_metas(None)'in framework
 return {'passed':True,'candidate_sha256':h(w/'candidate.so'),'original_selector_bytes':2264,'candidate_selector_bytes':2248,'original_direct_calls':11,'candidate_direct_calls':12,'cpi_body_match':True,'destructor_body_match':True,'carrier_bytes':184,'equal_initialized_carrier_bytes':169,'padding_bytes_not_compared':15,'current_memcpy_offset':1512,'original_context_stack_offset':-288,'candidate_constructed_context_stack_offset':-400,'candidate_argument_context_stack_offset':-184,'new_source_patch':False,'build_or_vm_executed':False,'manifest_sha256':h(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
