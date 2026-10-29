from pathlib import Path
import concurrent.futures,json,subprocess
D=Path(__file__).resolve().parent;R=D.parents[1];base=json.loads((D/'explicit-build.json').read_bytes())['command'];text=(D/'explicit.rs').read_text();preamble=text[:text.index('pub fn end_day')]
body='''pub fn end_day(g:&GlobalVolumeAccumulator)->usize { index(g.end_time).checked_sub(index(g.start_time)).and_then(|value| value.checked_div(index(g.seconds_in_a_day))).expect("end_time should be bigger than start_time") }\n'''
variants={'named':'fn index(value:i64)->usize {usize::try_from(value).expect("SVM is 64-bit")}\n'+body,'named_into':'fn index(value:i64)->usize {value.try_into().expect("SVM is 64-bit")}\n'+body,'closure_locals':'''pub fn end_day(g:&GlobalVolumeAccumulator)->usize {let index=|value|usize::try_from(value).expect("SVM is 64-bit"); let end=index(g.end_time);let start=index(g.start_time);let delta=end.checked_sub(start);let result=delta.and_then(|value|value.checked_div(index(g.seconds_in_a_day)));result.expect("end_time should be bigger than start_time")}\n'''}
def run(row):
 name,code=row;(D/(name+'.rs')).write_text(preamble+code);cmd=list(base);cmd[cmd.index('explicit.rs')]=name+'.rs';cmd[cmd.index('explicit.o')]=name+'.o'
 with(D/(name+'.log')).open('w')as log:p=subprocess.run(cmd,cwd=R,stdout=log,stderr=subprocess.STDOUT)
 (D/(name+'-build.json')).write_text(json.dumps({'command':cmd,'returncode':p.returncode},indent=2)+'\n');return name,p.returncode
with concurrent.futures.ThreadPoolExecutor(max_workers=2)as ex:rows=dict(ex.map(run,variants.items()))
print(rows);assert not any(rows.values())
