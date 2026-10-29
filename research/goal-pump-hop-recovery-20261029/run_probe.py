#!/usr/bin/env python3
from pathlib import Path
import contextlib,hashlib,importlib.util,io,json,sys
R=Path(__file__).resolve().parent;REPO=R.parents[1];H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
name=sys.argv[1];out=R/'probes'/name;manifest=json.loads((out/'SOURCE-MANIFEST.json').read_text());pins=json.loads((R/'source-inputs.json').read_text());before={n:(R/'src'/n).read_bytes()for n in manifest['files']}
for n,data in before.items():assert hashlib.sha256(data).hexdigest()==pins[n]
assert hashlib.sha256((R/'native-baseline/unstripped.so').read_bytes()).hexdigest()=='0f50faa8c325104dc77898ed84866dec2ad1eec475b6abba72c475cf7bf9bab6'
base=score.score(R/'native-baseline/unstripped.so');v={'name':name,'source_manifest':manifest,'new_runtime_executions':0}
try:
 for n,digest in manifest['files'].items():
  source=(out/n).read_bytes();assert hashlib.sha256(source).hexdigest()==digest;(R/'src'/n).write_bytes(source)
 v.update(fastbuild.build(R/'src',R/'build',out,quiet=True,recipe='identity'))
 if v['ok']:
  sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2)+'\n')
  v.update(windows=len(sc),normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not base[k]['normalized']],losses=[hex(k)for k,x in sc.items()if base[k]['normalized']and not x['normalized']],raw_gains=[hex(k)for k,x in sc.items()if x['raw']and not base[k]['raw']],raw_losses=[hex(k)for k,x in sc.items()if base[k]['raw']and not x['raw']],target_matched=bool(sc[0x5b3b0]['normalized']))
  spec=importlib.util.spec_from_file_location('structure',REPO/'research/goal-pump-swap-final-20261028/structure.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
  with contextlib.redirect_stdout(io.StringIO()):m.analyze(out/'unstripped.so',0x5b3b0,'pump_recovered::multi_hop_curve::swap_hop',out/'graph')
  g=json.loads((out/'graph.json').read_text());v.update(target_bytes=g['candidate_bytes'],machine_blocks=g['machine_blocks'],canonical_blocks=g['reduced_blocks'],graph_verified=g['topology']['verified'],callee_calls=g['callee_calls'],ordered_callees_depth2_equal=g['physical_order_callees_depth2_equal'])
 (out/'RESULT.json').write_text(json.dumps(v,indent=2)+'\n');print(json.dumps({k:x for k,x in v.items()if k not in['source_manifest','unstripped']},indent=2))
finally:
 for n,data in before.items():(R/'src'/n).write_bytes(data)
 fastbuild.stage(R/'src',R/'build/ws')
