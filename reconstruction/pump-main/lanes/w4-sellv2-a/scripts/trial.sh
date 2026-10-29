#!/bin/bash
# trial.sh NAME PYEDIT  : copy crate, apply python edit (reads/writes src/sell_v2.rs etc), build, metric
set -e
N=$1; ED=$(cd $(dirname $2) && pwd)/$(basename $2)
OUT=~/.cache/pumpfun-reconstruction/lanes/w4-sellv2-a
WT=/Users/shawwalters/Documents/Codex/2026-10-24/pump-main-swarm/worktrees/w4-sellv2-a
H=$WT/reconstruction/harness
S=$OUT/src/$N; rm -rf $S; mkdir -p $OUT/src; cp -R $WT/programs/pump $S
(cd $S && python3 $ED)
export PUMP_BUILD_SLOTS=10
python3 $H/fastbuild.py --src $S --work $OUT/work-$N --out $OUT/out/$N > $OUT/out/$N.build.json 2>&1 || { tail -30 $OUT/out/$N/build.log 2>/dev/null | grep -A5 "^error" | head -30; echo BUILD FAIL; exit 1; }
python3 $H/target_metric.py $OUT/out/$N/unstripped.so 0x144508 --sym 'pump_recovered::pump_recovered::sell_v2$'
python3 - "$OUT/out/$N/unstripped.so" <<'P'
import sys; sys.path.insert(0,'/Users/shawwalters/.cache/pumpfun-reconstruction/lanes/w4-sellv2-a/scripts'); import irx,subprocess,re
p=sys.argv[1]
r=subprocess.run([irx.SDK+'/llvm/bin/llvm-readelf','-sW',p],capture_output=True,text=True).stdout
for l in r.splitlines():
    q=l.split()
    if len(q)>=8 and 'pump_recovered14pump_recovered7sell_v2' in q[7]:
        c=irx.objfn(p,int(q[1],16),int(q[2])); open(p.replace('unstripped.so','fn.txt'),'w').write('\n'.join(c)+'\n')
P
python3 $OUT/scripts/dd.py $OUT/out/$N/fn.txt
