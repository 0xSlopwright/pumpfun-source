#!/usr/bin/env python3
"""Portable saved-evidence replay; no compiler, VM or target execution."""
if not __debug__:
 raise SystemExit('Run without -O; inherited readers require assertions.')
from pathlib import Path, PureWindowsPath
import argparse,gzip,hashlib,importlib.util,json,re,shlex,tempfile
P=Path(__file__).resolve().parent
SYMBOL='_ZN14pump_recovered14pump_recovered16buy_exact_sol_in17h28eae2e2fdc8f8b2E'
HELPER='''
// Diagnostic derivative only: log actual queue pops, excluding dump() simulations.
static bool SchedulerProbeActive = false;
static bool schedulerProbeDecision(const char *Reason, SUnit *Left,
                                   SUnit *Right, bool Result) {
  LLVM_DEBUG(if (SchedulerProbeActive)
    dbgs() << "SCHED_PROBE decision " << Reason << " left=" << Left->NodeNum
           << " right=" << Right->NodeNum << " left_queue=" << Left->NodeQueueId
           << " right_queue=" << Right->NodeQueueId << " result=" << Result << "\\n");
  return Result;
}
'''
OLD_POP='''    SUnit *V = popFromQueue(Queue, Picker, scheduleDAG);
    V->NodeQueueId = 0;'''
NEW_POP='''    const bool PreviousProbe = SchedulerProbeActive;
    SchedulerProbeActive = MF.getName() == "'''+SYMBOL+'''";
    LLVM_DEBUG(if (SchedulerProbeActive) {
      dbgs() << "SCHED_PROBE pop";
      for (const SUnit *Item : Queue)
        dbgs() << " " << Item->NodeNum << ":" << Item->NodeQueueId;
      dbgs() << "\\n";
    });
    SUnit *V = popFromQueue(Queue, Picker, scheduleDAG);
    LLVM_DEBUG(if (SchedulerProbeActive)
      dbgs() << "SCHED_PROBE selected " << V->NodeNum << "\\n");
    SchedulerProbeActive = PreviousProbe;
    V->NodeQueueId = 0;'''

def need(ok,message):
 if not ok:raise AssertionError(message)
def sha(b):return hashlib.sha256(b).hexdigest()
def read(p):
 b=p.read_bytes();return gzip.decompress(b) if p.suffix=='.gz' else b
def js(p):return json.loads(read(p))
def mod(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def seal(p):
 need(not any(f.is_symlink() for f in p.rglob('*')),'packet symlink')
 actual={f.relative_to(p).as_posix():sha(f.read_bytes()) for f in p.rglob('*') if f.is_file() and f.name!='MANIFEST.json'}
 need(actual==js(p/'MANIFEST.json'),'packet membership/hash mismatch');return len(actual)
def diagnostic_source(stock,changed):
 need(changed.count(HELPER)==1 and changed.count(NEW_POP)==1,'diagnostic helper/pop changed')
 recovered=changed.replace('\n'+HELPER,'',1).replace(NEW_POP,OLD_POP,1);reasons=[]
 def undo(m):
  reason,expr=m.groups();need(reason in ['BURRSort:'+expr,'ilp_ls_rr_sort:'+expr],'diagnostic return expression label')
  reasons.append(reason);return 'return '+expr+';'
 recovered,n=re.subn(r'return schedulerProbeDecision\("([^"\n]+)", left, right, \(([^;\n]+)\)\);',undo,recovered)
 need(n==20 and recovered==stock,'diagnostic-only source transformation');return reasons
def split_command(s):return [a[1:-1] if a.startswith('"') and a.endswith('"') else a for a in shlex.split(s,posix=False)]
def inner(s):
 a='C:\\WINDOWS\\system32\\cmd.exe /C "cd . && ';b=' && cd ."'
 need(s.startswith(a) and s.endswith(b),'stock command wrapper');return s[len(a):-len(b)]
def build_commands(stock,launch):
 out=str(PureWindowsPath(launch['commands']['compile'][-1]).parent)
 commands={k:split_command(v if k=='compile' else inner(v)) for k,v in stock.items()}
 commands['compile'][-1]=str(PureWindowsPath(out)/'ScheduleDAGRRList.cpp')
 for i,a in enumerate(commands['compile']):
  if a.startswith('/Fo'):commands['compile'][i]='/Fo'+str(PureWindowsPath(out)/'ScheduleDAGRRList.cpp.obj')
  if a.startswith('/Fd'):commands['compile'][i]='/Fd'+str(PureWindowsPath(out)/'ScheduleDAGRRList.pdb')
 obj=r'lib\CodeGen\SelectionDAG\CMakeFiles\LLVMSelectionDAG.dir\ScheduleDAGRRList.cpp.obj'
 need(commands['archive'].count(obj)==1,'stock compiler object member')
 commands['archive']=[str(PureWindowsPath(out)/'ScheduleDAGRRList.cpp.obj') if a==obj else '/out:'+str(PureWindowsPath(out)/'LLVMSelectionDAG.lib') if a.startswith('/out:') else a for a in commands['archive']]
 for i,a in enumerate(commands['link']):
  for prefix,name in [('--intdir=','int'),('/out:','llc.exe'),('/implib:','llc.lib'),('/pdb:','llc.pdb')]:
   if a.startswith(prefix):commands['link'][i]=prefix+str(PureWindowsPath(out)/name)
  if a==r'lib\LLVMSelectionDAG.lib':commands['link'][i]=str(PureWindowsPath(out)/'LLVMSelectionDAG.lib')
 need(commands==launch['commands'],'derivative build command transformation')
 return out

def trace_observation(blob,swapped=False):
 t=blob.decode().replace('\r\n','\n');a=t.index("********** List Scheduling %bb.53 'bb63.i' **********");b=t.index('********** List Scheduling',a+20);block=t[a:b]
 need('TargetConstant:i64<133>' in block,'Source133 anchor')
 rows=[];current=None
 decision=re.compile(r'^SCHED_PROBE decision (.+) left=(\d+) right=(\d+) left_queue=(\d+) right_queue=(\d+) result=([01])$')
 for line in block.splitlines():
  if line.startswith('SCHED_PROBE pop'):
   need(current is None,'nested probe pop');queue=[list(map(int,x.split(':'))) for x in line.split()[2:]]
   current=dict(queue=queue,decisions=[])
  elif line.startswith('SCHED_PROBE decision'):
   m=decision.fullmatch(line);need(m and current is not None,'decision outside actual pop');g=m.groups()
   current['decisions'].append(dict(reason=g[0],left=int(g[1]),right=int(g[2]),left_queue=int(g[3]),right_queue=int(g[4]),result=int(g[5])))
  elif line.startswith('SCHED_PROBE selected'):
   need(current is not None,'selected outside actual pop');current['selected']=int(line.split()[-1]);q=current['queue'];best=0
   comparisons=[d for d in current['decisions'] if d['reason'].startswith('ilp_ls_rr_sort:')]
   need(len(comparisons)==len(q)-1,'actual queue comparison count')
   for index,d in enumerate(comparisons,1):
    need([d['left'],d['left_queue']]==q[best] and [d['right'],d['right_queue']]==q[index],'queue comparison operands')
    if d['result']:best=index
   need(current['selected']==q[best][0],'queue replay selection');rows.append(current);current=None
 need(current is None and sorted(x['selected'] for x in rows)==list(range(35)),'complete actual-pop census')
 need(rows[0]['queue']==[[0,1]] and rows[1]['queue']==[[1,2]],'initial root/token queues')
 choice=rows[2];need(choice['queue']==[[34,3],[33,4]] and choice['selected']==34,'initial export insertion order')
 expected=[dict(reason='BURRSort:(left->NodeQueueId > right->NodeQueueId)',left=34,right=33,left_queue=3,right_queue=4,result=0),
  dict(reason='ilp_ls_rr_sort:BURRSort(left, right, SPQ)',left=34,right=33,left_queue=3,right_queue=4,result=0)]
 need(choice['decisions']==expected,'initial export queue-ID decision')
 first,second=(2,32) if swapped else (32,2)
 need([x['selected'] for x in rows[:6]]==[0,1,34,first,33,second],'bottom-up initial selection order')
 need(rows[3]['decisions']==[dict(reason='ilp_ls_rr_sort:LPDiff > RPDiff',left=33,right=first,left_queue=4,right_queue=5,result=1)],'observed pressure selection')
 need(f'RegPressureDiff SU(33): 1 != SU({first}): -1' in block,'pressure values')
 nodes={n:re.search(r'^SU\('+str(n)+r'\):[^\n]+',block,re.M)[0] for n in [2,32,33,34]}
 need('from %stack.107 + 8)' in nodes[2] and 'from %stack.107)' in nodes[32],'tag/payload load nodes')
 need(nodes[34].endswith('CopyToReg t0, Register:i64 %80, '+('t82' if swapped else 't80')),'first export value')
 need(nodes[33].endswith('CopyToReg t0, Register:i64 %81, '+('t80' if swapped else 't82')),'second export value')
 return dict(actual_pops=len(rows),initial_pops=rows[:6],selected_nodes=[x['selected'] for x in rows],nodes=nodes,
  first_export='payload' if swapped else 'tag',bottom_up_offsets=[8,0] if swapped else [0,8],emitted_offsets=[0,8] if swapped else [8,0])

def verify(repo,packet=P):
 count=seal(packet);pin=js(packet/'PROVENANCE.json');parent=repo/pin['parent_packet']
 need(sha((parent/'MANIFEST.json').read_bytes())==pin['parent_manifest_sha256'],'reviewed parent seal')
 need(sha((parent/'verify.py').read_bytes())==pin['parent_verify_sha256'],'reviewed parent verifier')
 pv=mod('queue_parent_verifier',parent/'verify.py');parent_report=pv.verify(repo,parent)
 sources=pv.js(parent/'compiler/sources.json.gz');source=next(s for s in sources if s['path']==pin['compiler_source_path'])
 need(source['git_blob']==pin['compiler_source_git_blob']=='dcecb2e0e7fafc31e6732751f7ebb8a783155cb6','scheduler source Git blob')
 need(pin['compiler_revision']==source['revision']=='08aedd64bf3abe4f163407b7bcf680403b84b32d','scheduler revision')
 changed=read(packet/'compiler/ScheduleDAGRRList.cpp.gz');reasons=diagnostic_source(source['content'],changed.decode())
 build=js(packet/'build/build-launch.json.gz');result=js(packet/'build/build-result.json.gz');oldbuild=pv.js(parent/'build/diagnostic/build-launch.json.gz')
 need(build['source_revision']==pin['compiler_revision'] and build['source_path']==pin['compiler_source_path'],'build source binding')
 need(build['stock_source_sha256']==source['sha256'] and build['derivative_source_sha256']==sha(changed),'built source bytes')
 need(build['patch_sha256']==sha(read(packet/'compiler/diagnostic.patch.gz')) and build['wrapped_return_expressions']==reasons,'instrumentation receipt')
 need(build['controller_sha256']==sha(read(packet/'controllers/build_scheduler_probe.py.gz')),'build controller')
 need(build['stock_source_inventory_sha256']==sha(pv.read(parent/'build/diagnostic/source-inventory.json.gz')),'stock source inventory')
 inventory=js(packet/'build/stock-build-before.json.gz');need(build['stock_build_inventory_sha256']==sha(read(packet/'build/stock-build-before.json.gz')),'stock build inventory')
 oldresult=pv.js(parent/'build/diagnostic/build-result.json.gz')
 need(inventory['build.ninja']==oldbuild['build_ninja_sha256'] and inventory['CMakeCache.txt']==oldbuild['cmake_cache_sha256'],'qualified build metadata')
 need(all(inventory['bin/'+name]==digest for name,digest in oldresult['outputs'].items()),'qualified stock tools')
 out=build_commands(js(packet/'build/stock-commands.json.gz'),build)
 env=oldbuild['environment'].copy();env.update(TEMP=str(PureWindowsPath(out)/'temp'),TMP=str(PureWindowsPath(out)/'temp'))
 need(build['environment']==env and build['cwd']==oldbuild['command'][2],'derivative build environment/cwd')
 need(result['stock_build_unchanged'] and result['stock_source_unchanged'],'stock input preservation receipt')
 need(result['outputs']['llc.exe']==pin['derivative_tool_sha256'],'derivative tool identity')
 need([s['stage'] for s in result['stages']]==['compile','archive','link'],'native build stage census')
 need(result['stages']==js(packet/'build/build-progress.json.gz'),'native progress/result equality')
 for stage in result['stages']:
  need(stage['returncode']==0,'native build failure')
  for name,digest in stage['logs'].items():need(digest==sha(read(packet/f"build/{stage['stage']}.{name}.log.gz")),'native build log binding')
 audit=pv.module('queue_parent_audit',repo/'research/pump-exact-sol-guard-20261029/audit_target.py');observations={};targets={}
 with tempfile.TemporaryDirectory(prefix='queue-origin-') as tmp:
  for name,old_launch,input_name,object_name in [('baseline','observations/scheduler01/launch.json.gz','extracted.bc','traced-extracted.o'),('swapped','observations/extract-order02/swapped-launch.json.gz','swapped.ll','swapped.o')]:
   p=packet/'captures'/name;launch=js(p/'launch.json.gz');r=js(p/'result.json.gz');prior=pv.js(parent/old_launch)
   need(launch['parent_launch_sha256']==sha(pv.read(parent/old_launch)),'parent launch receipt')
   need(launch['input_sha256']==sha(pv.read(parent/('inputs/'+input_name+'.gz'))),'probe input bytes')
   need(launch['tool_sha256']==result['outputs']['llc.exe'] and launch['controller_sha256']==sha(read(packet/'controllers/run_scheduler_probe.py.gz')),'probe tool/controller')
   command=prior['command'].copy();command[0]=str(PureWindowsPath(out)/'llc.exe');command[command.index('-o')+1]=str(PureWindowsPath(out)/name/'target.o')
   need(launch['command']==command,'probe command binding')
   env=prior['environment'].copy();env.update(TEMP=str(PureWindowsPath(out)/name/'temp'),TMP=str(PureWindowsPath(out)/name/'temp'))
   need(launch['environment']==env and launch['cwd']==prior['cwd'],'probe environment/cwd binding')
   need(launch['target_executions']==r['target_executions']==0 and r['returncode']==0 and r['tool_unchanged'] and r['input_unchanged'],'probe result')
   for log,receipt in r['logs'].items():
    b=read(p/(log+'.gz'));need(receipt==dict(bytes=len(b),sha256=sha(b)),'probe log binding')
   obj=read(p/'target.o.gz');original=pv.read(parent/('outputs/'+object_name+'.gz'))
   need(obj==original and launch['parent_object_sha256']==r['object_sha256']==sha(obj),'complete probe object equality')
   local=Path(tmp)/(name+'.o');local.write_bytes(obj);raw,relocs=pv.object_target(audit,local);targets[name]=(raw,relocs)
   need(len(raw)==r['target_bytes']==13224 and len(relocs)==r['relocation_count']==144,'qualified target dimensions')
   need(r['complete_object_equal'] and r['target_raw_equal'] and r['relocations_equal'],'object qualification receipt')
   observations[name]=trace_observation(read(p/'stderr.log.gz'),name=='swapped')
   pv.schedule(read(p/'stderr.log.gz'),[8,0] if name=='swapped' else [0,8])
  a,ar=targets['baseline'];b,br=targets['swapped']
  slots=pv.counterfactual(pv.read(parent/'inputs/control.ll.gz'),pv.read(parent/'inputs/swapped.ll.gz'),a,b,ar,br)
 need(pin['target_execution'] is False and pin['canonical_changes'] is False,'scope claims')
 return dict(sealed_files=count,parent_sealed_files=parent_report['sealed_files'],wrapped_return_expressions=20,qualified_compiler_runs=2,
  complete_object_equality=True,target_bytes=13224,relocations=144,observations=observations,changed_slots=slots,changed_bytes=4,
  derivative_tool_sha256=result['outputs']['llc.exe'],target_executions=0,canonical_changes=False,
  scope='Saved evidence consistency. Logging-only incremental compiler derivative; queue decisions observed for two fixed inputs. Swapped input is an IR diagnostic, not recovered Rust or a production binary. No historical deployment compiler or execution attestation claimed.')

if __name__=='__main__':
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--repo-root',type=Path,default=P.parents[1]);a=ap.parse_args();print(json.dumps(verify(a.repo_root.resolve()),indent=2))
