from pathlib import Path
import concurrent.futures,json,subprocess
D=Path(__file__).resolve().parent;R=D.parents[1];s=(D/'explicit.rs').read_text();preamble=s[:s.index('pub fn end_day')];base=json.loads((D/'explicit-build.json').read_text())['command']
common='''let index=|value|usize::try_from(value).expect("SVM is 64-bit"); let end=index(g.end_time);let start=index(g.start_time);'''
variants={'guard':common+'''if end<start || g.seconds_in_a_day==0 {None::<usize>.expect("end_time should be bigger than start_time")} else {(end-start)/index(g.seconds_in_a_day)}''','guard_option':common+'''(if end>=start && g.seconds_in_a_day!=0 {Some((end-start)/index(g.seconds_in_a_day))}else{None}).expect("end_time should be bigger than start_time")'''}
def run(row):
 name,body=row;(D/(name+'.rs')).write_text(preamble+'pub fn end_day(g:&GlobalVolumeAccumulator)->usize {'+body+'}\n');cmd=list(base);cmd[cmd.index('explicit.rs')]=name+'.rs';cmd[cmd.index('explicit.o')]=name+'.o'
 with(D/(name+'.log')).open('w')as f:p=subprocess.run(cmd,cwd=R,stdout=f,stderr=subprocess.STDOUT)
 (D/(name+'-build.json')).write_text(json.dumps({'command':cmd,'returncode':p.returncode},indent=2)+'\n');return name,p.returncode
with concurrent.futures.ThreadPoolExecutor(max_workers=2)as ex:r=dict(ex.map(run,variants.items()))
print(r);assert not any(r.values())
