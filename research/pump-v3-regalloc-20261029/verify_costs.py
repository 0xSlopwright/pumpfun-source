"""Read-only replay of exact allocator costs and one synthetic profile input."""
if not __debug__:raise SystemExit('Run without -O.')
import difflib,json

PROBE='e81aac1781f06b9654df244cc04206dccaf9ce6396e0be2dbaa90331fc5a3702'
BRANCH=b'  br i1 %_15.i16, label %bb5.i26, label %bb6.i17'
META=b'!14 = !{!"branch_weights", i32 1, i32 16777215}\n'

def input_delta(before,after,original):
    assert before==original and before.count(BRANCH)==1 and b'!14' not in before
    assert after==before.replace(BRANCH,BRANCH+b', !prof !14')+META

def before_greedy(before,after):
    old='successors: %bb.3(0x00000800), %bb.2(0x7ffff800); %bb.3(0.00%), %bb.2(100.00%)'
    new='successors: %bb.3(0x00000080), %bb.2(0x7fffff80); %bb.3(0.00%), %bb.2(100.00%)'
    assert before.count(old)==after.count(new)==1
    assert before.count('!range !3')==after.count('!range !4')==3
    assert after==before.replace(old,new).replace('!range !3','!range !4')

def verify(v):
    data=lambda key:v.data('costs/'+key)
    record=lambda key:json.loads(data(key))
    parent=v.record('extracted/compile-launch.json');cmd=parent['command'];environment=parent['environment']
    stock_flags=['-print-machine-bfi','-print-bfi-func-name='+v.SYMBOL,'-debug-only=regalloc']
    ir_flags=['-debug-only=regalloc','-print-machine-bfi','-print-bfi-func-name='+v.SYMBOL,'-print-before=greedy','-filter-print-funcs='+v.SYMBOL]
    outputs={};commands={}
    for name,tool,flags,controller,inp in [
        ('stock01',v.LLC,stock_flags,'capture_bfi.py',v.data('extracted/target.bc')),
        ('probe01',PROBE,stock_flags,'run_probe.py',v.data('extracted/target.bc')),
        ('ir01/baseline',v.LLC,ir_flags,'ir_frequency_control.py',data('ir01/baseline/input.ll')),
        ('ir01/frequency',v.LLC,ir_flags,'ir_frequency_control.py',data('ir01/frequency/input.ll')),
        ('frequency-probe01',PROBE,ir_flags,'frequency_probe.py',data('ir01/frequency/input.ll'))]:
        launch=record(name+'/launch.json');result=record(name+'/result.json');expected=cmd.copy()
        expected[0]=launch['command'][0];expected[10]=launch['command'][10]
        if name.startswith('ir01/') or name=='frequency-probe01':expected[8]=launch['command'][8]
        expected+=flags
        v.need(launch['command']==expected and launch['environment']==environment,'cost probe literal command/environment')
        v.need(launch['tool_sha256']==tool and launch['input_sha256']==v.sha(inp) and launch['controller_sha256']==v.sha(data('controllers/'+controller)),'cost probe input/tool/controller')
        v.need(result['returncode']==0 and result['tool_unchanged'] and result['input_unchanged'] and result['target_executions']==0,'cost probe execution receipt')
        outputs[name]=data(name+'/target.o');commands[name]=launch['command']
        v.need(result['object_sha256']==v.sha(outputs[name]) and all(h==v.sha(data(name+'/'+n)) for n,h in result['logs'].items()),'cost probe output/log binding')
    v.need(commands['frequency-probe01'][8]==commands['ir01/frequency'][8],'frequency probe exact input path')
    for name in ['stock01','probe01','ir01/baseline']:v.need(outputs[name]==v.data('extracted/target.o'),'stock/passive/text-input complete object identity')
    for name in ['ir01/frequency','frequency-probe01']:v.need(outputs[name]==v.data('counterfactual/on/target.o'),'stock frequency object equals previous counterfactual')
    baseline=data('ir01/baseline/input.ll');frequency=data('ir01/frequency/input.ll');input_delta(baseline,frequency,v.data('extracted/target.ll'))
    v.need(b'!3 = !{i64 0, i64 3}' in baseline and b'!3 = !{i64 0, i64 3}' in frequency,'input range metadata unchanged')
    text=lambda key:data(key).decode().replace('\r\n','\n')
    machine=v.retained_module('controllers/analyze.py');before_greedy(machine.machine(text('ir01/baseline/stderr.log'),'Before'),machine.machine(text('ir01/frequency/stderr.log'),'Before'))
    model=v.retained_module('costs/controllers/analyze_costs.py')
    stock=model.model(text('probe01/stderr.log'),text('stock01/stderr.log'),'r9')
    changed=model.model(text('frequency-probe01/stderr.log'),text('ir01/frequency/stderr.log'),'r3')
    v.need(json.loads(json.dumps(stock))==record('costs.json') and json.loads(json.dumps(changed))==record('frequency-analysis.json')['model'],'independently recomputed all integer costs')
    v.need(stock['r3_minus_r9']==4831840080 and changed['r3_minus_r9']==-1207958222,'exact cost margin reversal')
    v.need(stock['collapsed_delta']['integer_flow_residual']==0 and changed['collapsed_delta']['integer_flow_residual']==-2,'retain integer flow residual')
    v.need({r:m['coefficients'] for r,m in stock['regions'].items()}=={r:m['coefficients'] for r,m in changed['regions'].items()},'unchanged cost coefficients for all ten regions')
    build=record('derivative/build-result.json');launch=record('derivative/build-launch.json')
    v.need(build['stock_build_unchanged'] and build['stock_source_unchanged'] and build['outputs']['llc.exe']==PROBE,'isolated logging build receipt')
    v.need(launch['controller_sha256']==v.sha(data('controllers/build_cost_probe.py')) and launch['cost_patch_sha256']==v.sha(data('controllers/cost_patch.py')),'logging build controllers')
    v.need(launch['helper_sha256']==v.sha(v.data('controllers/build_scheduler_probe.py')),'unchanged build routing helper')
    stock_cpp=v.data('compiler/llvm/lib/CodeGen/RegAllocGreedy.cpp').decode().replace('\r\n','\n');new_cpp=data('derivative/RegAllocGreedy.cpp').decode().replace('\r\n','\n')
    patch=v.retained_module('costs/controllers/cost_patch.py');v.need(patch.patch(stock_cpp)==new_cpp,'exact logging-only source delta')
    rel='llvm/lib/CodeGen/RegAllocGreedy.cpp';delta=''.join(difflib.unified_diff(stock_cpp.splitlines(True),new_cpp.splitlines(True),fromfile=rel,tofile=rel))
    v.need(delta==text('derivative/counterfactual.patch'),'logging patch text')
    v.need(launch['stock_source_sha256']==v.sha(v.data('compiler/'+rel)) and launch['derivative_source_sha256']==v.sha(data('derivative/RegAllocGreedy.cpp')) and launch['patch_sha256']==v.sha(data('derivative/counterfactual.patch')),'logging source receipt binding')
    v.need([s['stage'] for s in build['stages']]==['compile','archive','link'],'logging build stages')
    for stage in build['stages']:v.need(stage['returncode']==0 and all(h==v.sha(data('derivative/'+stage['stage']+'.'+n)) for n,h in stage['logs'].items()),'logging build log binding')
    inventory=v.record('compiler/source-inventory.json')
    for rel in ['llvm/lib/Analysis/BranchProbabilityInfo.cpp','llvm/lib/CodeGen/SpillPlacement.cpp','llvm/include/llvm/Analysis/BlockFrequencyInfoImpl.h']:v.need(v.sha(data('compiler/'+rel))==inventory[rel],'frequency compiler source pin')
    bpi=text('compiler/llvm/lib/Analysis/BranchProbabilityInfo.cpp')
    v.need('NORETURN = LOWEST_NON_ZERO' in bpi and 'DEFAULT = 0xfffff' in bpi and 'hasNoReturn(BB)' in bpi and 'extractBranchWeights(WeightsNode, Weights)' in bpi,'noreturn weights and explicit metadata path')
    v.need('Attribute::Cold' in bpi and 'return true;' in bpi,'retained BPI implementation')
    return dict(result='PASS',stock_winner='r9',profile_winner='r3',stock_exact_cost_delta=stock['r3_minus_r9'],profile_exact_cost_delta=changed['r3_minus_r9'],stock_panic_frequencies=stock['collapsed_delta'],profile_panic_frequencies=changed['collapsed_delta'],all_ten_region_costs_recomputed=True,all_region_coefficients_unchanged=True,stock_profile_object_equals_forced_object=True,source_change=False,root_rustc_commands=0,llc_commands=5,host_build_commands=3,target_executions=0,
        scope='One synthetic profile annotation, not recovered Rust or original compiler/profile provenance. Same prior diagnostic object; original raw-byte identity remains unachieved.')
