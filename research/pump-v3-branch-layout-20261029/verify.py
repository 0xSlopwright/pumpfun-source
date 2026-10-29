"""Replay saved compiler evidence only. Never executes a compiler or SBF image."""
if not __debug__:
    raise SystemExit('Run without -O: inherited readers contain assertions.')
from pathlib import Path
import argparse,collections,csv,difflib,gzip,io,json,hashlib,re,struct,subprocess,sys,tarfile,tempfile,types

P=Path(__file__).resolve().parent
SOURCE='178f60de87b1b739f2431181dafab55fbbf71750336949813eda105e78a7083c'
CATALOG='fb2c0a47514567d65eb45c1e268dacd5291e4659bb7dceb575a767dc20bcaff8'
ORIGINAL='7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
AUDIT='227e5f4f29151de461f79d49994d3544ce17951a242aa5581fc96a2593819cab'
ELF='93c046dbecfcdf2863d0988cafc9411e8eb61c6fbdfe58aa046d2c53e0cc06c9'
REMAP='--remap-path-prefix=programs/pump/src\\trade_v3.rs=programs/pump/src/trade_v3.rs'
OLD=b'    let second=match post{Some(p)=>add3(p.quote_in,p.fees.protocol_fee,p.fees.creator_fee)?,None=>0};'
NEW=b'    let second; if let Some(p)=post { second=add3(p.quote_in,p.fees.protocol_fee,p.fees.creator_fee)?; } else { second=0; }'
def need(ok,message):
    if not ok:raise ValueError(message)
def sha(b):return hashlib.sha256(b).hexdigest()
def blob(b):return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
def read(path):return json.loads(Path(path).read_bytes())
def unpack(path):return gzip.decompress(Path(path).read_bytes())
def zipped_json(path):return json.loads(unpack(path))
def source_files():
    archive=(P/'origin/source-parent.tar.gz').read_bytes();need(sha(archive)==SOURCE,'source archive pin')
    with tarfile.open(fileobj=io.BytesIO(archive),mode='r:gz') as t:
        need(all(m.isfile() or m.isdir() for m in t.getmembers()),'source archive members')
        files={m.name:t.extractfile(m).read() for m in t.getmembers() if m.isfile()}
    need(len(files)==66 and {p:sha(b) for p,b in files.items()}==read(P/'origin/source-parent.json'),'66 source inputs')
    return files
def candidate_source(parent,candidate):
    need(parent.splitlines()[372]==OLD and parent.count(OLD)==1,'parent physical line373')
    need(candidate==parent.replace(OLD,NEW),'exact one-line statement-form source')
def expected_command(stock,stock_cwd,launch):
    before=stock_cwd.removesuffix('\\source');after=launch['cwd'].removesuffix('\\source')
    need(before!=stock_cwd and after!=launch['cwd'],'historical source roots')
    cmd=[x.replace(before,after) for x in stock];cmd[4]=cmd[4].replace('\\','/');cmd.append(REMAP)
    return cmd,before,after
def command_check(stock,origin,launch):
    expected,before,after=expected_command(stock,origin['cwd'],launch)
    need(launch['command']==expected,'literal compiler flags and source-path spelling')
    env={k:v.replace(before,after) for k,v in origin['environment'].items()}
    env.update(CARGO_MANIFEST_DIR=after+'\\source/programs/pump',CARGO_PKG_NAME='pump-recovered',CARGO_PKG_VERSION='0.1.0',CARGO_CRATE_NAME='pump_recovered')
    # pathlib on the actual Windows producer uses backslashes throughout.
    env['CARGO_MANIFEST_DIR']=after+'\\source\\programs\\pump'
    need(launch['environment']==env and launch['tools']==origin['tools'],'literal environment and tool inventories')
def elf_reader():
    code=unpack(P/'readers/elf.py.gz');need(sha(code)==ELF,'ELF reader pin')
    m=types.ModuleType('retained_elf');m.__file__=str(P/'readers/elf.py');exec(compile(code,m.__file__,'exec'),m.__dict__);return m
def membership(e,original,windows):
    raw=set();norm=set()
    for f in e.functions:
        b=e.body(f['address'],f['size']);raw.add((len(b),sha(b)));norm.add((len(b),sha(e.normalize(b,f['address'])[0])))
    result={'raw_match':set(),'normalized_matches':set()}
    for addr,size in windows.items():
        b=original.body(addr,size)
        if (size,sha(b)) in raw:result['raw_match'].add(addr)
        if (size,sha(original.normalize(b,addr)[0])) in norm:result['normalized_matches'].add(addr)
    return result
def metrics(e,original):
    fs=[f for f in e.functions if '5trade12v3_buy_costs17h' in f['name']];need(len(fs)==1,'target function extent')
    f=fs[0];raw=e.body(f['address'],f['size']);norm,refs=e.normalize(raw,f['address'])
    on=original.normalize(original.body(0x80df8,2120),0x80df8)[0]
    split=lambda b:[b[i:i+8] for i in range(0,len(b),8)]
    sm=difflib.SequenceMatcher(None,split(on),split(norm),autojunk=False)
    distance=sum(max(j-i,l-k) for t,i,j,k,l in sm.get_opcodes() if t!='equal')
    return raw,norm,refs,distance
def reference_audit(repo,parent,candidate):
    code=unpack(P/'readers/audit_refs.py.gz');need(sha(code)==AUDIT,'bounded audit reader pin')
    with tempfile.TemporaryDirectory(prefix='v3-reference-') as tmp:
        root=Path(tmp);script=root/'audit_refs.py';script.write_bytes(code)
        for kind,b in [('parent',parent),('candidate',candidate)]:
            target=root/'build'/kind;target.mkdir(parents=True);(target/'symbols.so.gz').write_bytes(gzip.compress(b,mtime=0))
        r=subprocess.run([sys.executable,'-I','-B',str(script),'--repo-root',str(repo)],capture_output=True)
        need(r.returncode==0,'bounded call/data audit: '+r.stderr.decode(errors='replace')[-500:])
        return json.loads(r.stdout)
def branch_evidence():
    observations=zipped_json(P/'branch/analysis.json.gz')
    for path,info in observations['inputs'].items():
        if path=='MANIFEST.json':continue
        b=unpack(P/'branch'/(Path(path).name+'.gz'))
        need(sha(b)==info['sha256'] and blob(b)==info['git_blob'],'retained trace/compiler source pin')
    cpp=unpack(P/'branch/SBFInstrInfo.cpp.gz').decode();header=unpack(P/'branch/SBFInstrInfo.h.gz').decode()
    need(blob(cpp.encode())=='7c70e6680d2cc0cb27de1bb49e6f57d72ff81946','SBF implementation')
    need('Cannot handle conditional branches\n    return true;' in cpp and 'reverseBranchCondition' not in cpp+header,'SBF branch-analysis boundary')
    need('if (MBB.isLayoutSuccessor(I->getOperand(0).getMBB()))' in cpp and 'I->eraseFromParent();' in cpp,'SBF unconditional fallthrough deletion')
    builder=unpack(P/'branch/SelectionDAGBuilder.cpp.gz').decode()
    need(blob(builder.encode())=='7406a8ac1611de0fab36cd87e11063eacc660062' and blob(header.encode())=='76163e7e828a267a16cf85b44b3d9bbf6b359b67','builder and target header pins')
    need('if (CB.TrueBB == NextBlock(SwitchBB))' in builder and 'std::swap(CB.TrueBB, CB.FalseBB);' in builder,'initial inversion condition')
    mbp=unpack(P/'branch/MachineBlockPlacement.cpp.gz')
    need(blob(mbp)=='a7a839688ddfd88402e969b37a609be0c1c2f385','placement source pin')
    need(b'if (!TII->analyzeBranch(*PrevBB, TBB, FBB, Cond))' in mbp and b'PrevBB->updateTerminator(OriginalLayoutSuccessors' in mbp,'placement analysis gate')
    ir=unpack(P/'branch/snapshot-275.txt.gz').decode();labels=re.findall(r'^([0-9]+):',ir,re.M)
    need(labels[labels.index('95')+1]=='103','initial IR order')
    need('br i1 %102, label %110, label %113' in re.search(r'^95:.*?(?=^103:)',ir,re.M|re.S).group(),'second-add IR branch')
    for n in [276,371,391]:
        text=unpack(P/f'branch/snapshot-{n}.txt.gz').decode();blocks=re.split(r'(?=^bb\.\d+)',text,flags=re.M)
        b=next(x for x in blocks if re.match(r'bb\.\d+ \(%ir-block\.95\):',x));m=re.search(r'JEQ_ri.*?%bb\.(\d+)\n\s*JMP %bb\.(\d+)',b)
        need(m is not None,'saved two-branch sequence')
        following=blocks[blocks.index(b)+1].splitlines()[0]
        need('%ir-block.103' in following if n==276 else '%ir-block.110' in following,'saved placement transition')
    for n,h in {275:'de21aaba7dda671b94790167969934cedfa2811f056416cfaa064c244b48acde',276:'1afb2b2e55386e68b3330b23a0545dba2d974086a44e501b5486ac5fc08fe38b',371:'0385384ad1a82599c4737bf306e2a5ba649afa803c5415544e5e701c60922c5b',391:'f2a026d5f69b21f86fe2845914ca58bd46c69462a63ca3affb8e8d698ec66fe8'}.items():
        need(sha(unpack(P/f'branch/snapshot-{n}.txt.gz'))==h,'published native snapshot pin')
def trace_index(raw):
    # LLVM prefixes IR and machine headers differently. Keep original CRLF bytes.
    heads=list(re.finditer(rb'^[^\n]*IR Dump (?:Before|After)[^\n]*\n',raw,re.M));rows=[]
    for i,h in enumerate(heads):
        end=heads[i+1].start() if i+1<len(heads) else len(raw);data=raw[h.start():end]
        rows.append(dict(index=i,header=h[0].decode().strip(),start=h.start(),end=end,sha256=sha(data),bytes=len(data),machine=b'# Machine code for function' in data))
    return rows

def trace_texts(raw,index):
    need(index==trace_index(raw),'literal trace intervals')
    need(len(index)==392 and next(r['index'] for r in index if r['machine'])==276,'complete trace header coverage')
    # Only the analysis view normalizes CRLF. Interval hashes always use raw bytes.
    return {r['index']:raw[r['start']:r['end']].decode().replace('\r\n','\n') for r in index}

def machine_blocks(text,ir):
    parts=re.split(r'(?=^(?:\d+B\s*)?bb\.\d+ \(%ir-block\.)',text,flags=re.M)
    return [b for b in parts if re.match(r'(?:\d+B\s*)?bb\.\d+ \(%ir-block\.'+str(ir)+r'\):',b)]

def trace_observations(texts):
    for i,label in {275:'After Module Verifier',276:'Before Finalize ISel',334:'Before Greedy Register Allocator',335:'After Greedy Register Allocator',337:'After Virtual Register Rewriter',355:'After Prologue/Epilogue Insertion',358:'Before Control Flow Optimizer',359:'After Control Flow Optimizer'}.items():
        need(label in texts[i].splitlines()[0],'trace stage identity')
    ir=texts[275];labels=re.findall(r'^(\d+):',ir,re.M)
    need(labels[labels.index('95')+1]=='103','candidate IR layout successor')
    b=re.search(r'^95:.*?(?=^103:)',ir,re.M|re.S)
    need(b is not None and 'br i1 %102, label %103, label %106' in b[0],'candidate second-add IR edges')
    isel=machine_blocks(texts[276],95)
    need(len(isel)==1 and 'JNE_ri %15:gpr, 2, %bb.22' in isel[0] and 'JMP %bb.21' in isel[0],'initial JNE plus adjacent JMP')
    need(re.search(r'JMP %bb\.21\s*\n\s*bb\.21 \(%ir-block\.103\):',texts[276]) is not None,'initial adjacent success block')
    no_jump=[i for i in range(276,392) if machine_blocks(texts[i],95) and 'JMP' not in machine_blocks(texts[i],95)[0]]
    need(no_jump and no_jump[0]==359 and 'JNE_ri' in machine_blocks(texts[359],95)[0],'fallthrough JMP first removed by branch folding')
    before=texts[334];after=texts[335]
    need('Function Live Ins: $r1 in %23' in before and '%23:gpr = COPY $r1' in before and '%stack.19' not in before,'return pointer before Greedy')
    need('%151:gpr = COPY $r1' in after and 'STD_V1 %151:gpr, %stack.19, 0' in after,'Greedy return-pointer spill')
    reloads=re.findall(r'^(\d+B)\s+%149:gpr = LDD_V1 %stack\.19, 0$',after,re.M)
    need(reloads==['4040B','4248B','4664B','4952B'],'Greedy return-pointer reloads')
    net=[b for b in machine_blocks(after,111) if '%149:gpr = LDD_V1 %stack.19, 0' in b]
    need(len(net)==1 and 'JNE_ri' in net[0] and net[0].index('%149:gpr = LDD_V1 %stack.19, 0')<net[0].index('JNE_ri'),'early net-guard reload')
    need('$r6 = LDD_V1 %stack.19, 0' in ''.join(machine_blocks(texts[337],111)) and '$r6 = LDD_V1 $r10, -400' in ''.join(machine_blocks(texts[355],111)),'physical return-pointer spill location')
    pre=machine_blocks(texts[358],150);post=machine_blocks(texts[359],150)
    need(len(pre)==len(post)==1 and 'STD_V1' in pre[0] and 'STD_V1' not in post[0] and 'JMP %bb.20' in post[0] and 'LDD_V1 $r10, -400' not in post[0],'split pre-fee error tail')
    need(any('STD_V1 killed $r2, $r6, 16' in b and 'STD_V1 killed $r1, $r6, 8' in b for b in machine_blocks(texts[359],166)),'common return stores')
    return dict(second_add=dict(ir_block=95,true_successor=103,next_ir_block=103,false_successor=106,first_machine='JNE to error plus JMP to adjacent success',fallthrough_JMP_removal=dict(before=358,after=359,pass_name='Control Flow Optimizer')),
        return_pointer=dict(before_virtual_register=23,spill_frame_index=19,physical_stack_offset=-400,reload_slot_index_labels=reloads,note='The B-suffixed labels are LLVM SlotIndex printouts, not emitted byte addresses.',early_reload_ir_block=111))

def tail_observations(api,e,address,size):
    body=e.body(address,size);_,refs=e.normalize(body,address);calls=[r for r in refs if r['kind']=='direct-call']
    need(len(calls)==17,'tail call count');call=calls[7]['offset'];branch=call+24
    op,regs,off,imm=struct.unpack_from('<BBhi',body,branch);need(op==5,'pre-fee error branch')
    payload=branch+8+8*off;need(body[payload]==0x79 and body[payload+8]==5,'separate error payload and branch')
    tail=payload+16+8*struct.unpack_from('<h',body,payload+10)[0]
    loads=[]
    for i,op in api.instructions(body):
        if len(op)==8 and op[0]==0x79 and op[1]>>4==10 and struct.unpack_from('<h',op,2)[0]==-400:
            loads.append(dict(offset=i,destination_register=op[1]&15,raw=op.hex()))
    return dict(pre_fee_call_offset=call,error_branch_offset=branch,payload_load_offset=payload,common_store_tail_offset=tail,SP400_loads=loads)

def followup_recipe(parent,launch,extra):
    before=parent['cwd'].removesuffix('\\source');after=launch['cwd'].removesuffix('\\source')
    need(before!=parent['cwd'] and after!=launch['cwd'],'follow-up historical source roots')
    need(launch['command']==[x.replace(before,after) for x in parent['command']]+extra,'follow-up literal compiler flags')
    need(launch['environment']=={k:v.replace(before,after) for k,v in parent['environment'].items()},'follow-up literal environment')
    need(launch['parent']=='07-remapped-if-let' and launch['tools']==parent['tools'] and launch['dependency_files']==parent['dependency_files'],'follow-up tool/dependency origin')

def verify_passive(api,original,candidate):
    parent=zipped_json(P/'build/candidate/launch.json.gz');folder=P/'passive';launch=zipped_json(folder/'launch.json.gz');result=zipped_json(folder/'result.json.gz');saved=zipped_json(folder/'analysis.json.gz')
    flags=['-C','llvm-args=-print-before-all','-C','llvm-args=-print-after-all','-C','llvm-args=-filter-print-funcs=_ZN14pump_recovered5trade12v3_buy_costs17h280dba79c4dad174E','-Zdump-mir=v3_buy_costs','-Zdump-mir-dir='+result['mir_directory']]
    need(launch['extra_arguments']==flags,'only passive diagnostic flags');followup_recipe(parent,launch,flags)
    need(launch['source_inputs']==parent['source_inputs'] and len(launch['source_inputs'])==66,'passive source inventory')
    need(launch['controller_sha256']==sha(unpack(folder/'controller.py.gz')),'passive controller binding')
    need(launch['compiler_commands']==1 and launch['target_executions']==result['target_executions']==0,'passive execution scope')
    need(result['returncode']==0 and all(result[k] for k in ['source_unchanged','tools_unchanged','dependencies_unchanged','whole_output_equal']),'passive result')
    need(unpack(folder/'symbols.so.gz')==candidate and sha(candidate)==result['symbols_sha256']==saved['image_sha256'],'passive complete output identity')
    need(saved['launch_sha256']==sha(unpack(folder/'launch.json.gz')) and saved['result_sha256']==sha(unpack(folder/'result.json.gz')),'passive analysis receipt binding')
    need(set(result['logs'])=={'stdout.log','stderr.log'},'passive log inventory')
    for n,info in result['logs'].items():
        data=unpack(folder/(n+'.gz'));need(sha(data)==info['sha256'] and len(data)==info['bytes'],'passive log binding')
    with tarfile.open(fileobj=io.BytesIO((folder/'mir.tar.gz').read_bytes()),mode='r:gz') as t:
        members=t.getmembers();need(len(members)==548 and all(m.isfile() for m in members) and len({m.name for m in members})==548,'complete unique MIR file inventory')
        need({m.name:sha(t.extractfile(m).read()) for m in members}==result['mir_files'],'MIR bytes and hashes')
    raw=unpack(folder/'stderr.log.gz');index=zipped_json(folder/'snapshot-index.json.gz');observed=trace_observations(trace_texts(raw,index))
    need(all(saved[k]==v for k,v in observed.items()),'recomputed passive stage observations')
    need(saved['selected_snapshot_hashes']=={str(i):index[i]['sha256'] for i in [275,276,334,335,337,355,358,359,371,391]},'selected raw snapshot hashes')
    need(saved['raw_trace']==result['logs']['stderr.log'] and (saved['source_inputs'],saved['mir_files'],saved['snapshots'],saved['compiler_commands'],saved['target_executions'])==(66,548,392,1,0) and saved['whole_output_equal'] is True,'passive analysis counts')
    with tempfile.TemporaryDirectory(prefix='v3-passive-') as tmp:
        path=Path(tmp)/'candidate.so';path.write_bytes(candidate);e=api.Elf(path)
        fs=[f for f in e.functions if '5trade12v3_buy_costs17h' in f['name']];need(len(fs)==1,'passive target symbol');f=fs[0]
        tails=dict(original=tail_observations(api,original,0x80df8,2120),candidate=tail_observations(api,e,f['address'],f['size']))
    need(tails==saved['final_tails'],'recomputed final tail operands')
    need([(tails[k]['pre_fee_call_offset'],tails[k]['error_branch_offset'],tails[k]['payload_load_offset'],tails[k]['common_store_tail_offset']) for k in ['original','candidate']]==[(904,928,1008,1712),(912,936,1992,1728)],'original and candidate tail locations')
    need([[(r['offset'],r['destination_register']) for r in tails[k]['SP400_loads']] for k in ['original','candidate']]==[[(1712,3),(1984,3)],[(848,6),(1720,6)]],'all SP400 loads including register identity')
    # Preserve the two analysis failures as evidence; never execute their scripts.
    bad=zipped_json(folder/'failures/parser-failed01-index.json.gz')
    need(len(bad)==48 and next(r['index'] for r in bad if r['machine'])==47,'retained incomplete parser result')
    need(b'AssertionError' in unpack(folder/'failures/analyzer-failed01.err.gz'),'retained failed first analysis')
    return dict(snapshots=392,mir_files=548,whole_output_equal=True,observations=observed,final_tails=tails)

def verify_net_match(candidate):
    parent=zipped_json(P/'build/candidate/launch.json.gz');folder=P/'rejected/net-match';launch=zipped_json(folder/'launch.json.gz');result=zipped_json(folder/'result.json.gz');followup_recipe(parent,launch,[])
    old=b'    let net=first.checked_add(second).and_then(|sum|sum.checked_sub(total_buyback))'
    new=b'    let net=(match first.checked_add(second){Some(sum)=>sum.checked_sub(total_buyback),None=>None})'
    source=unpack(P/'source/candidate-trade_v3.rs.gz');need(source.splitlines()[373]==old and source.count(old)==1,'rejected net physical source line')
    expected=dict(parent['source_inputs']);expected['programs/pump/src/trade_v3.rs']=sha(source.replace(old,new))
    need(launch['source_inputs']==expected and launch['source_change']==dict(path='programs/pump/src/trade_v3.rs',line=374,old=old.decode(),new=new.decode()),'rejected net exact source inventory')
    need(launch['controller_sha256']==sha(unpack(folder/'controller.py.gz')),'rejected net controller binding')
    need(launch['compiler_commands']==1 and launch['target_executions']==result['target_executions']==0,'rejected net execution scope')
    need(result['returncode']==0 and all(result[k] for k in ['source_unchanged','tools_unchanged','dependencies_unchanged','whole_output_equal']),'rejected net result')
    need(set(result['logs'])=={'stdout.log','stderr.log'} and all(sha(unpack(folder/(n+'.gz')))==h for n,h in result['logs'].items()),'rejected net log hashes')
    need(unpack(folder/'symbols.so.gz')==candidate and sha(candidate)==result['symbols_sha256'],'rejected net complete output convergence')

def verify(repo):
    seal=read(P/'MANIFEST.json');actual={p.relative_to(P).as_posix():sha(p.read_bytes()) for p in P.rglob('*') if p.is_file() and p!=P/'MANIFEST.json'}
    need(actual==seal,'packet seal')
    original_path=repo/'evidence/original/pump/deployed.so';need(sha(original_path.read_bytes())==ORIGINAL,'original ELF')
    catalog=repo/'repro/reconstruction-status-2026-10-26/functions.tsv';need(sha(catalog.read_bytes())==CATALOG,'canonical window catalog')
    windows={int(r['original_start']):int(r['original_end'])-int(r['original_start']) for r in csv.DictReader(io.StringIO(catalog.read_text(encoding='utf-8')),delimiter='\t') if r['program']=='pump' and r['variant']=='selected'};need(len(windows)==1035,'window cardinality')
    files=source_files();candidate=unpack(P/'source/candidate-trade_v3.rs.gz');candidate_source(files['programs/pump/src/trade_v3.rs'],candidate)
    origin=zipped_json(P/'origin/stock-root-launch.json.gz');stock=zipped_json(P/'origin/stock-root-root-command.json.gz');provenance=read(P/'PROVENANCE.json')
    need(sha(unpack(P/'origin/stock-root-launch.json.gz'))=='14d29de3f9bc126f6a161eea0a3bf727d899755cbc99bc9dabb2b14ae5992776' and sha(unpack(P/'origin/stock-root-root-command.json.gz'))=='9cf7288a546b18c6a2f9443166ad21557eda9553df1dd08733d9c8cdc08bfd42','stock invocation origin pins')
    api=elf_reader();original=api.Elf(original_path);images={};members={};summaries={};groups={};dependencies=None
    with tempfile.TemporaryDirectory(prefix='v3-images-') as tmp:
        for kind in ['parent','candidate','repeat']:
            folder=P/'build'/kind;launch=zipped_json(folder/'launch.json.gz');result=zipped_json(folder/'result.json.gz')
            command_check(stock,origin,launch)
            expected={p:sha(b) for p,b in files.items()}
            if kind!='parent':expected['programs/pump/src/trade_v3.rs']=sha(candidate)
            need(launch['source_inputs']==expected,'all 66 actual source hashes')
            need(launch['changed_lines']==([] if kind=='parent' else [373]),'physical source changes')
            need(launch['source_change']==(None if kind=='parent' else dict(path='programs/pump/src/trade_v3.rs',old=OLD.decode(),new=NEW.decode())),'source-change receipt')
            need(launch['controller_sha256']==sha(unpack(P/'controllers'/(provenance['controllers'][kind]+'.gz'))),'executed controller binding')
            need(launch['compiler_commands']==1 and launch['target_executions']==result['target_executions']==0,'execution scope')
            need(result['returncode']==0 and all(result[k] for k in ['source_unchanged','tools_unchanged','dependencies_unchanged']),'reported build result')
            need(all(sha(unpack(folder/(n+'.gz')))==h for n,h in result['logs'].items()),'compiler log hashes')
            if dependencies is None:dependencies=launch['dependency_files']
            need(launch['dependency_files']==dependencies,'same reused dependency artifacts')
            images[kind]=unpack(folder/'symbols.so.gz');need(sha(images[kind])==result['symbols_sha256'],'whole output hash')
            local=Path(tmp)/(kind+'.so');local.write_bytes(images[kind]);e=api.Elf(local)
            raw,norm,refs,distance=metrics(e,original);size=2144 if kind=='parent' else 2136;slots=25 if kind=='parent' else 23
            need((len(raw),distance)==(size,slots),'measured target diagnostic')
            need(raw[776:800]==bytes.fromhex('79a1e8fe00000000150101000200000005001c0000000000') if kind=='parent' else raw[776:800]==bytes.fromhex('79a1e8fe0000000055011c000200000079a1f0fe00000000'),'second-add branch bytes')
            recorded=read(folder/'measurement.json');need(recorded['target_raw_sha256']==sha(raw) and recorded['target_normalized_sha256']==sha(norm) and recorded['aligned_differing_slots']==distance,'measurement receipt')
            members[kind]=membership(e,original,windows);saved=zipped_json(folder/'census.json.gz')
            need({w['start']:w['bytes'] for w in saved['windows']}==windows,'saved original extents')
            need(all({w['start'] for w in saved['windows'] if w[k]}==v for k,v in members[kind].items()),'actual memberships')
            groups[kind]=collections.defaultdict(collections.Counter)
            for f in e.functions:groups[kind][api.stable_name(f['name'])][(f['size'],sha(e.normalize(e.body(f['address'],f['size']),f['address'])[0]))]+=1
            summaries[kind]=dict(bytes=size,aligned_slots=slots,normalized=len(members[kind]['normalized_matches']),raw=len(members[kind]['raw_match']),image_sha256=sha(images[kind]),rodata_sha256=sha(e.section_bytes('.rodata')))
        need(images['candidate']==images['repeat'],'complete repeat equality')
        need(members['parent']==members['candidate']==members['repeat'],'actual match sets preserved')
        need((summaries['parent']['normalized'],summaries['parent']['raw'])==(1019,186),'cohort counts')
        need(groups['parent'].keys()==groups['candidate'].keys(),'all function name classes preserved')
        changed=[k for k in groups['parent'] if groups['parent'][k]!=groups['candidate'][k]]
        need(changed==['_ZN14pump_recovered5trade12v3_buy_costs17h<HASH>E'],'only costs normalized function class changes')
        need(summaries['parent']['rodata_sha256']==summaries['candidate']['rodata_sha256'],'complete rodata equality')
    audit=reference_audit(repo,images['parent'],images['candidate']);retained=zipped_json(P/'analysis/reference-audit.json.gz')
    need(audit['calls']==retained['calls'] and audit['data']==retained['data'],'recomputed full operand audit')
    rejected=unpack(P/'rejected/option-transpose/symbols.so.gz')
    rejected_result=zipped_json(P/'rejected/option-transpose/result.json.gz')
    need(sha(rejected)==rejected_result['symbols_sha256'],'rejected output binding')
    with tempfile.TemporaryDirectory(prefix='v3-rejected-') as tmp:
        path=Path(tmp)/'rejected.so';path.write_bytes(rejected);e=api.Elf(path)
        raw,norm,refs,distance=metrics(e,original)
        need((len(raw),distance)==(2136,61),'rejected control diagnostic')
        need(membership(e,original,windows)==members['parent'],'rejected membership sets')
    old_images={k:unpack(P/f'rejected/path-audit/{k}.so.gz') for k in ['parent','candidate']}
    old_report=zipped_json(P/'rejected/path-audit/audit-diagnostic.json.gz')
    need(all(sha(b)==old_report['images'][k]['sha256'] for k,b in old_images.items()),'failed audit input hashes')
    try:reference_audit(repo,old_images['parent'],old_images['candidate'])
    except ValueError as error:
        need('original_candidate_bounded_class_multiset_equal' in str(error),'expected unchanged path-audit failure')
    else:raise ValueError('Historical path mismatch was unexpectedly accepted')
    branch_evidence()
    passive=verify_passive(api,original,images['candidate']);verify_net_match(images['candidate'])
    need((provenance['selected_compiler_commands'],provenance['total_local_compiler_commands'])==(4,10),'total normal and diagnostic compiler counts')
    return dict(result='PASS',builds=summaries,call_sites=17,callee_classes=10,bounded_data_sites=16,changed_normalized_symbol_classes=changed,target_executions=0,
        passive=passive,rejected_net_match_whole_output_equal=True,
        scope='Partial source/compiler evidence. No complete-window gain, original whole-ELF equality, native integration or behavioral execution is claimed.')
if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--repo-root',type=Path,required=True);args=ap.parse_args()
    print(json.dumps(verify(args.repo_root.resolve()),indent=2))
