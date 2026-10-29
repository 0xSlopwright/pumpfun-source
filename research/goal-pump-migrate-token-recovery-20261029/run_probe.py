#!/usr/bin/env python3
from pathlib import Path
import contextlib,hashlib,importlib.util,io,json,sys
R=Path(__file__).resolve().parent;REPO=R.parents[1];H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
name=sys.argv[1];out=R/'probes'/name;p=R/'src/src/migrate_v2.rs';before=p.read_bytes();source=(out/'migrate_v2.rs').read_bytes()
pins=json.loads((R/'source-inputs.json').read_text());assert hashlib.sha256(before).hexdigest()==pins['src/migrate_v2.rs']
assert hashlib.sha256((R/'native-baseline/unstripped.so').read_bytes()).hexdigest()=='0f50faa8c325104dc77898ed84866dec2ad1eec475b6abba72c475cf7bf9bab6'
base=score.score(R/'native-baseline/unstripped.so');v={'name':name,'source_sha256':hashlib.sha256(source).hexdigest(),'new_runtime_executions':0}
try:
 p.write_bytes(source);v.update(fastbuild.build(R/'src',R/'build',out,quiet=True,recipe='identity'))
 if v['ok']:
  sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2)+'\n')
  v.update(windows=len(sc),normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not base[k]['normalized']],losses=[hex(k)for k,x in sc.items()if base[k]['normalized']and not x['normalized']],target_matched=bool(sc[0x4c158]['normalized']))
  spec=importlib.util.spec_from_file_location('structure',REPO/'research/goal-pump-swap-final-20261028/structure.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
  with contextlib.redirect_stdout(io.StringIO()):m.analyze(out/'unstripped.so',0x4c158,'migrate_v2::create_token_account_v2',out/'graph')
  g=json.loads((out/'graph.json').read_text());v.update(target_bytes=g['candidate_bytes'],machine_blocks=g['machine_blocks'],canonical_blocks=g['reduced_blocks'],graph_verified=g['topology']['verified'],callee_calls=g['callee_calls'],ordered_callees_depth2_equal=g['physical_order_callees_depth2_equal'])
 (out/'RESULT.json').write_text(json.dumps(v,indent=2)+'\n');print(json.dumps(v,indent=2))
finally:p.write_bytes(before);fastbuild.stage(R/'src',R/'build/ws')
