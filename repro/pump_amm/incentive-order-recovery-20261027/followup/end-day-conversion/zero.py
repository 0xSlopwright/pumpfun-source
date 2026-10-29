from pathlib import Path
import json,subprocess
D=Path(__file__).resolve().parent;R=D.parents[1];s=(D/'explicit.rs').read_text();s=s[:s.index('pub fn end_day')]+'''pub fn end_day(g:&GlobalVolumeAccumulator)->usize {
 let index=|value|usize::try_from(value).expect("SVM is 64-bit");
 index(g.end_time).checked_sub(index(g.start_time)).and_then(|delta| {
   if g.seconds_in_a_day == 0 {None} else {Some(delta/index(g.seconds_in_a_day))}
 }).expect("end_time should be bigger than start_time")
}
''';(D/'zero.rs').write_text(s);cmd=json.loads((D/'explicit-build.json').read_text())['command'];cmd[cmd.index('explicit.rs')]='zero.rs';cmd[cmd.index('explicit.o')]='zero.o'
with(D/'zero.log').open('w')as log:p=subprocess.run(cmd,cwd=R,stdout=log,stderr=subprocess.STDOUT)
(D/'zero-build.json').write_text(json.dumps({'command':cmd,'returncode':p.returncode},indent=2)+'\n');print(p.returncode)
