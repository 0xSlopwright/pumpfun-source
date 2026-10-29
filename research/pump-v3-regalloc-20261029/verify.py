"""Read saved evidence only; never execute LLVM, Rust, an ELF, or a controller."""
if not __debug__:
    raise SystemExit('Run without -O: retained readers use assertions.')
from pathlib import Path
from decimal import Decimal
import argparse,difflib,gzip,hashlib,importlib.util,json,re,struct,tempfile,types

P=Path(__file__).resolve().parent
SYMBOL='_ZN14pump_recovered5trade12v3_buy_costs17h280dba79c4dad174E'
LLC='aff85aa14d18e21b98f6e17f9e4b80c26c5ed0948b9641af46d73881a3c2ab6d'
DERIVATIVE='383d7c4988afada09928ac6efc381aa31ddb01809b520c580cd3da842692aca7'

def need(ok,message):
    if not ok:raise ValueError(message)
def sha(b):return hashlib.sha256(b).hexdigest()
def read(p):return json.loads(p.read_bytes())
def data(key):return gzip.decompress((P/'evidence'/(key+'.gz')).read_bytes())
def record(key):return json.loads(data(key))
def retained_module(key):
    module=types.ModuleType(key);module.__file__=str(P/key)
    exec(compile(data(key),module.__file__,'exec'),module.__dict__)
    return module

def symbol_object(e,name):
    found=[s for s in e.symbols if s['name']==name]
    need(len(found)==1,'unique object symbol');s=found[0]
    need(s['size']>0 and s['section']>0,'defined object extent')
    section=e.headers[s['section']];start=section[4]+s['address']-section[3]
    raw=e.data[start:start+s['size']];need(len(raw)==s['size'],'complete object extent');rows=[]
    for h in e.headers:
        if h[1] not in [4,9] or h[7]!=s['section']:continue
        table=e.headers[h[6]];need(table[1]==2,'relocation symbol table');strings=e.headers[table[6]]
        for offset in range(h[4],h[4]+h[5],h[9]):
            address,info=struct.unpack_from('<QQ',e.data,offset)
            if not s['address']<=address<s['address']+s['size']:continue
            sym=struct.unpack_from('<IBBHQQ',e.data,table[4]+24*(info>>32));p=strings[4]+sym[0]
            name=e.data[p:e.data.index(b'\0',p)].decode()
            rows.append(dict(offset=address-s['address'],type=info&0xffffffff,symbol=name,addend=struct.unpack_from('<q',e.data,offset+16)[0] if h[1]==4 else None))
    return raw,rows

def normalize_object(raw,rows):
    out=bytearray(raw);need(len({r['offset'] for r in rows})==len(rows),'unique relocation positions')
    for row in rows:
        i=row['offset'];need(row['addend'] is None,'REL relocation form')
        if row['type']==10:
            need(raw[i:i+2]==b'\x85\x10','relocated direct call opcode');out[i+4:i+8]=b'\0'*4
        else:
            need(row['type']==1 and raw[i]==0x18,'relocated data LDDW opcode');out[i+4:i+8]=out[i+12:i+16]=b'\0'*4
    need(sum(r['type']==10 for r in rows)==17 and sum(r['type']==1 for r in rows)==16,'17 call and 16 data operands')
    return bytes(out)

def bind_objects(left,right,left_rows,right_rows,aliases=False,same_offsets=True):
    """Bind constants recursively; external function references remain symbolic."""
    need(len(left_rows)==len(right_rows),'relocation cardinality');seen=set()
    def pair(a,b):
        need(a['type']==b['type'] and a['addend']==b['addend'],'relocation type/addend')
        x,y=a['symbol'],b['symbol']
        constant=x.startswith(('.Lalloc_','.Lvtable.','alloc_','vtable.'))
        need(x==y or (aliases and constant and x=='.L'+y),'ordered relocation target')
        if not constant or (x,y) in seen:return
        seen.add((x,y));xb,xr=symbol_object(left,x);yb,yr=symbol_object(right,y)
        need(xb==yb and len(xr)==len(yr),'complete constant object bytes')
        for u,v in zip(xr,yr):
            need(u['offset']==v['offset'],'constant relocation offset');pair(u,v)
    for a,b in zip(left_rows,right_rows):
        if same_offsets:need(a['offset']==b['offset'],'target relocation offset')
        pair(a,b)
    return len(seen)

def distance(a,b):
    split=lambda b:[b[i:i+8] for i in range(0,len(b),8)]
    return sum(max(j-i,l-k) for t,i,j,k,l in difflib.SequenceMatcher(None,split(a),split(b),autojunk=False).get_opcodes() if t!='equal')

def control_check(stock,off):need(stock==off,'default-off whole object identity')

def counterfactual_check(api,original,raw,rows):
    ob=original.body(0x80df8,2120);on=original.normalize(ob,0x80df8)[0];norm=normalize_object(raw,rows)
    need(len(norm)==2120 and distance(on,norm)==2,'diagnostic target length/distance')
    changed=[dict(offset=i,original=on[i:i+8].hex(),counterfactual=norm[i:i+8].hex()) for i in range(0,len(norm),8) if on[i:i+8]!=norm[i:i+8]]
    expected=[dict(offset=1960,original='79a290fe00000000',counterfactual='79a188fe00000000'),dict(offset=1968,original='79a188fe00000000',counterfactual='79a290fe00000000')]
    need(changed==expected and sum(x!=y for x,y in zip(on,norm))==4,'only two reversed stack loads')
    tails={}
    for label,body in [('original',ob),('counterfactual',raw)]:
        calls=[i for i,b in api.instructions(body) if b[0]==0x85 and b[1]>>4==1];need(len(calls)==17,'tail call count')
        call=calls[7];branch=call+24;need(body[branch]==5,'pre-fee error branch')
        payload=branch+8+8*struct.unpack_from('<h',body,branch+2)[0];need(body[payload]==0x79 and body[payload+8]==5,'error payload tail')
        tail=payload+16+8*struct.unpack_from('<h',body,payload+10)[0]
        loads=[dict(offset=i,register=b[1]&15) for i,b in api.instructions(body) if b[0]==0x79 and b[1]>>4==10 and struct.unpack_from('<h',b,2)[0]==-400]
        tails[label]=dict(pre_fee_call=call,error_branch=branch,payload_load=payload,shared_tail=tail,sp400=loads)
    need(tails['original']==tails['counterfactual'],'literal tail placement and return-pointer loads')
    return changed,tails

def allocation_check(analyzer,text):
    selections=re.findall(r'^selectOrSplit GPR:%23 .*?(?=^selectOrSplit|\Z)',text,re.M|re.S)
    need(len(selections)==3,'return pointer allocation attempts');chosen=selections[2]
    need('RS_Split Cascade 3' in chosen and 'Split for $r9 in 7 bundles, intv 1.' in chosen,'observed chosen region')
    rows=re.findall(r'^\$(r\d+)\tstatic = ([^,\n]+), v=(\d+), total = ([^ ]+) with bundles ([^\n]+)\.',chosen,re.M)
    costs={r:dict(total=c,bundles=[int(x) for x in re.findall(r'EB#(\d+)',eb)]) for r,s,v,c,eb in rows}
    need(len(costs)==10 and min(costs,key=lambda r:Decimal(costs[r]['total']))=='r9','minimum printed region cost')
    need(costs['r3']['bundles']==[16] and costs['r9']['bundles']==[1,2,16,20,21,22,24],'evaluated region bundles')
    blocks,count=analyzer.edge_bundles(analyzer.machine(text,'Before'))
    need(count==26 and blocks[27]['incoming']==19 and blocks[27]['outgoing']==20,'rederived block27 edge bundles')
    need('%bb.27 [4896B;4992B) intf invalid-invalid, live-through 0 -> 1, reload on exit.' in chosen and '4952B:0\t%148:gpr = COPY %147:gpr' in chosen,'early split copy')
    need('4952r\t%149:gpr = LDD_V1 %stack.19, 0' in text and 'assigning %149 to $r6:' in text,'spill copy folding and final assignment')
    evict=re.search(r'^selectOrSplit GPR:%3 .*?(?=^selectOrSplit)',text,re.M|re.S)
    need(evict is not None and 'unassigning %23 from $r6' in evict[0],'observed return-pointer eviction')
    margin=str(Decimal(costs['r3']['total'])-Decimal(costs['r9']['total']))
    need(margin=='2.68E-7','printed cost margin');return margin

def forced_check(text):
    marker='V3_SPLIT_COUNTERFACTUAL original=%23 previous=$r9 forced=$r3'
    need(text.count(marker)==1,'single explicit counterfactual intervention')
    part=re.search(r'^selectOrSplit GPR:%23 .*?'+re.escape(marker)+r'.*?(?=^selectOrSplit)',text,re.M|re.S)
    need(part is not None and 'Split for $r3 in 1 bundles, intv 1.' in part[0],'forced evaluated region')

def verify(repo):
    actual={p.relative_to(P).as_posix():sha(p.read_bytes()) for p in P.rglob('*') if p.is_file() and p.name!='MANIFEST.json'}
    need(actual==read(P/'MANIFEST.json'),'packet seal')
    mapping=read(P/'EVIDENCE.json')
    for key,info in mapping.items():
        b=data(key);need(info['file']=='evidence/'+key+'.gz' and len(b)==info['bytes'] and sha(b)==info['sha256'],'retained evidence binding')
    base=repo/'research/pump-v3-branch-layout-20261029';provenance=read(P/'PROVENANCE.json')
    need(sha((base/'MANIFEST.json').read_bytes())==provenance['parent_manifest_sha256'],'qualified parent packet seal')
    spec=importlib.util.spec_from_file_location('qualified_v3_parent',base/'verify.py');v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
    parent_report=v.verify(repo);api=v.elf_reader();original=api.Elf(repo/'evidence/original/pump/deployed.so')
    normal_launch=v.zipped_json(base/'build/candidate/launch.json.gz');launch=record('root/launch.json');result=record('root/result.json')
    before=normal_launch['cwd'].removesuffix('\\source');after=launch['cwd'].removesuffix('\\source')
    expected=[x.replace(before,after) for x in normal_launch['command']];expected[expected.index('--emit=dep-info,link')]='--emit=dep-info,link,llvm-bc,obj'
    need(launch['command']==expected and launch['environment']=={k:x.replace(before,after) for k,x in normal_launch['environment'].items()},'literal extra-emit command/environment')
    need(all(launch[k]==normal_launch[k] for k in ['source_inputs','tools','dependency_files']),'unchanged root inputs')
    need(launch['controller_sha256']==sha(data('controllers/capture_candidate_bitcode.py')),'root controller binding')
    need(result['returncode']==0 and result['whole_output_equal'] is False and all(result[k] for k in ['source_unchanged','tools_unchanged','dependencies_unchanged']),'extra-emit qualified limits')
    for name,info in {**result['outputs'],**result['logs']}.items():need(sha(data('root/'+name))==info['sha256'] and len(data('root/'+name))==info['bytes'],'root receipt output/log')
    with tempfile.TemporaryDirectory(prefix='v3-regalloc-') as temp:
        temp=Path(temp)
        def elf(key):
            path=temp/(key.replace('/','_'));path.write_bytes(data(key));return api.Elf(path)
        normal_path=temp/'normal.so';normal_path.write_bytes(v.unpack(base/'build/candidate/symbols.so.gz'));normal=api.Elf(normal_path);captured=elf('root/symbols.so')
        need(normal.sections.keys()==captured.sections.keys(),'captured section inventory')
        changed_sections=[n for n in normal.sections if normal.section_bytes(n)!=captured.section_bytes(n)]
        need(set(changed_sections)=={'.symtab','.strtab'},'extra-emit section content differences')
        nr,nn,_,nd=v.metrics(normal,original);cr,cn,_,cd=v.metrics(captured,original)
        need(nr==cr and nn==cn and nd==cd==23,'raw linked target equality')
        root=elf('root/root.o');extracted=elf('extracted/target.o');forced=elf('counterfactual/on/target.o');mir=elf('mir/target.o')
        rb,rr=symbol_object(root,SYMBOL);eb,er=symbol_object(extracted,SYMBOL);fb,fr=symbol_object(forced,SYMBOL);mb,mr=symbol_object(mir,SYMBOL)
        need(rb==eb and normalize_object(eb,er)==cn,'raw extracted target and linked normalized binding')
        need(rr!=er,'retained literal relocation qualification failure')
        constants=bind_objects(root,extracted,rr,er,aliases=True)
        bind_objects(extracted,forced,er,fr,same_offsets=False)
        control_check(data('extracted/target.o'),data('counterfactual/off/target.o'))
        need(data('trace/target.o')==data('extracted/target.o'),'passive whole object identity')
        need(len(mb)==len(eb)==2136 and sum(x!=y for x,y in zip(mb,eb))==243,'MIR restart failed baseline')
        differences,tails=counterfactual_check(api,original,fb,fr)
    compile_launch=record('extracted/compile-launch.json');need(compile_launch['tool_sha256']==LLC,'stock llc pin')
    flags=['-O3','-filetype=obj','-mcpu=generic','-mattr=+store-imm,+jmp-ext','-relocation-model=pic','-function-sections','-data-sections']
    cmd=compile_launch['command'];need(cmd[1:8]==flags and cmd[-2]=='-o' and len(cmd)==11,'literal extracted compile flags')
    for label,inp,out,tool in [('extract','root/root.bc','target.bc','a0faf8ab2ee9df48db997a20d074a1b9a44cebea2bf1285139845403792ed750'),('compile','extracted/target.bc','target.o',LLC),('disassemble','extracted/target.bc','target.ll','0206043b1be0735ede51a36b3696401e093a3d11864044f1f0c6023039873cf8')]:
        l=record('extracted/'+label+'-launch.json');r=record('extracted/'+label+'-result.json')
        need(l['tool_sha256']==tool and l['input_sha256']==sha(data(inp)) and l['controller_sha256']==sha(data('controllers/qualify.py')),'extraction receipt input/tool/controller')
        need(r['returncode']==0 and r['tool_unchanged'] and r['input_unchanged'] and r['outputs'][out]==sha(data('extracted/'+out)),'extraction receipt output')
        need(all(h==sha(data('extracted/'+label+'.'+n)) for n,h in r['logs'].items()),'extraction logs')
    trace_flags=['-debug-only=regalloc','-print-before=greedy','-print-after=greedy','-filter-print-funcs='+SYMBOL]
    for name,tool,extra,controller in [('trace',LLC,trace_flags,'trace.py'),('counterfactual/off',DERIVATIVE,[],'run_counterfactual.py'),('counterfactual/on',DERIVATIVE,['-v3-diagnostic-force-r3']+trace_flags,'run_counterfactual.py')]:
        l=record(name+'/launch.json');r=record(name+'/result.json');expected=cmd.copy();expected[0]=l['command'][0];expected[-1]=l['command'][10];expected+=extra
        need(l['command']==expected and l['environment']==compile_launch['environment'],'diagnostic command/environment')
        need(l['tool_sha256']==tool and l['input_sha256']==sha(data('extracted/target.bc')) and l['controller_sha256']==sha(data('controllers/'+controller)),'diagnostic tool/input/controller')
        need(r['returncode']==0 and r['tool_unchanged'] and r['input_unchanged'] and r['object_sha256']==sha(data(name+'/target.o')),'diagnostic result')
        for n,h in r['logs'].items():need(sha(data(name+'/'+n))==(h['sha256'] if isinstance(h,dict) else h),'diagnostic log binding')
    analyzer=retained_module('controllers/analyze.py');text=data('trace/stderr.log').decode().replace('\r\n','\n')
    margin=allocation_check(analyzer,text);forced_check(data('counterfactual/on/stderr.log').decode().replace('\r\n','\n'))
    for label,inp,out,flag in [('capture','extracted/target.bc','before.mir','-stop-before=greedy'),('resume','mir/before.mir','target.o','-start-before=greedy')]:
        l=record('mir/'+label+'-launch.json');r=record('mir/'+label+'-result.json')
        need(l['command'][1:8]==flags and l['command'][9]==flag and len(l['command'])==12,'literal unchanged MIR restart command')
        need(l['input_sha256']==sha(data(inp)) and l['tool_sha256']==LLC and l['controller_sha256']==sha(data('controllers/qualify_mir_resume.py')),'MIR receipt input/tool/controller')
        need(r['returncode']==0 and r['input_unchanged'] and r['tool_unchanged'] and r['outputs'][out]==sha(data('mir/'+out)),'MIR receipt output')
        need(all(h==sha(data('mir/'+label+'.'+n)) for n,h in r['logs'].items()),'MIR logs')
    passive=v.trace_texts(v.unpack(base/'passive/stderr.log.gz'),v.zipped_json(base/'passive/snapshot-index.json.gz'))
    stages={}
    for name,n in [('Before',334),('After',335)]:
        observed,_=analyzer.view(analyzer.machine(text,name));expected,_=analyzer.view(analyzer.machine(passive[n],name))
        need(observed==expected,'structural Greedy stage equality');stages[name]=len(observed)
    inventory=record('compiler/source-inventory.json');sources=record('analysis.json')['compiler_sources']
    for rel,info in sources.items():
        b=data('compiler/'+rel);need(sha(b)==inventory[rel]==info['sha256'] and v.blob(b)==info['git_blob'],'pinned compiler source bytes')
    build=record('derivative/build-result.json');bl=record('derivative/build-launch.json')
    need(build['stock_build_unchanged'] and build['stock_source_unchanged'] and build['outputs']['llc.exe']==DERIVATIVE,'isolated compiler build result')
    need(bl['controller_sha256']==sha(data('controllers/build_counterfactual.py')) and bl['helper_sha256']==sha(data('controllers/build_scheduler_probe.py')),'compiler build controllers')
    need(bl['stock_source_sha256']==sha(data('compiler/llvm/lib/CodeGen/RegAllocGreedy.cpp')) and bl['derivative_source_sha256']==sha(data('derivative/RegAllocGreedy.cpp')) and bl['patch_sha256']==sha(data('derivative/counterfactual.patch')),'compiler patch provenance')
    rel='llvm/lib/CodeGen/RegAllocGreedy.cpp';stock=data('compiler/'+rel).decode().replace('\r\n','\n');modified=data('derivative/RegAllocGreedy.cpp').decode().replace('\r\n','\n')
    patch=''.join(difflib.unified_diff(stock.splitlines(True),modified.splitlines(True),fromfile=rel,tofile=rel))
    need(patch==data('derivative/counterfactual.patch').decode().replace('\r\n','\n'),'exact recorded compiler source patch')
    need('cl::init(false)' in patch and 'VirtReg.reg() == Register::index2VirtReg(23)' in patch and SYMBOL in patch,'disabled scoped counterfactual')
    need([r['stage'] for r in build['stages']]==['compile','archive','link'],'three compiler build stages')
    for r in build['stages']:
        need(r['returncode']==0 and all(h==sha(data('derivative/'+r['stage']+'.'+n)) for n,h in r['logs'].items()),'compiler build receipt/logs')
    saved=record('counterfactual-analysis.json');need(saved['aligned_differences']==differences and saved['tail']==tails,'recomputed diagnostic observations')
    return dict(result='PASS',parent_source_bytes=2136,parent_source_aligned_slots=23,extra_emit_section_content_changes=changed_sections,extracted_constant_objects_bound=constants,greedy_structural_rows=stages,printed_cost_margin_to_r3=margin,default_off_whole_object_equal=True,counterfactual_bytes=2120,counterfactual_aligned_slots=2,remaining_differences=differences,mir_restart_different_raw_bytes=243,additional_root_rustc_commands=1,llc_commands=6,other_llvm_commands=2,host_build_commands=3,target_executions=0,
        scope='Diagnostic only. Source candidate remains 2136 bytes/23 slots. No original raw-byte match, complete-window gain, original compiler recipe, linked derivative ELF, allocation image or behavioral qualification.')

if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--repo-root',type=Path,required=True);args=ap.parse_args()
    print(json.dumps(verify(args.repo_root.resolve()),indent=2))
