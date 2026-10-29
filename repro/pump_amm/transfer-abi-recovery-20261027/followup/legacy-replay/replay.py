"""Replay the exact sealed fourth candidate against original; creates a fresh output directory."""
from pathlib import Path
import argparse,json,shutil,subprocess,sys
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--output',type=Path,required=True);a=p.parse_args();O=a.output.resolve();O.mkdir(parents=True,exist_ok=False)
subprocess.run([sys.executable,'-B',str(P/'verify.py')],check=True)
shutil.copytree(P/'replay/input-root',O/'input-root');(O/'standard').mkdir()
binding=json.loads((P/'replay/inputs.json').read_text());binding['packet']=str(P/'base-packet');binding['candidate']=str(P/'candidate.so');(O/'inputs.json').write_text(json.dumps(binding,indent=2)+'\n');shutil.copy2(P/'replay/verify_replay.py',O/'verify_replay.py')
I=O/'input-root'
for label,script in [('legacy-buy',I/'scripts/pump_amm_legacy_buy_differential.py'),('reserves',I/'work/probes/probe_reserves.py')]:
 cmd=[sys.executable,'-B',str(I/'repro/pump_amm/owner6048-v144/runtime/observe_suite.py'),str(O/'standard'/(label+'-transactions.json.gz')),str(script),'--candidate',str(P/'candidate.so'),'--output',str(O/'standard'/(label+'.json'))]
 with (O/(label+'.log')).open('w')as log:subprocess.run(cmd,cwd=I,stdout=log,stderr=subprocess.STDOUT,check=True)
subprocess.run([sys.executable,'-B',str(P/'base-packet/runtime/exact-kit/run.py'),'--candidate',str(P/'candidate.so'),'--output',str(O/'exact')],check=True)
subprocess.run([sys.executable,'-B',str(O/'verify_replay.py')],check=True)
