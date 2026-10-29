from pathlib import Path
import subprocess, json, shutil, hashlib, importlib.util
R=Path(__file__).resolve().parent
P=R/'src/programs/pump-amm/src/instructions/swap/sell.rs'
baseline=P.read_text()
variants={
'branch_breakfirst':baseline.replace('let data = user_volume_accumulator.try_borrow_data()?;', 'let data = match core::ops::Try::branch(user_volume_accumulator.try_borrow_data()) { core::ops::ControlFlow::Break(e) => return core::ops::FromResidual::from_residual(e), core::ops::ControlFlow::Continue(data) => data };'),
'branch_continuefirst':baseline.replace('let data = user_volume_accumulator.try_borrow_data()?;', 'let data = match core::ops::Try::branch(user_volume_accumulator.try_borrow_data()) { core::ops::ControlFlow::Continue(data) => data, core::ops::ControlFlow::Break(e) => return core::ops::FromResidual::from_residual(e) };'),
'branch_namedbreakfirst':baseline.replace('let data = user_volume_accumulator.try_borrow_data()?;', 'let result = core::ops::Try::branch(user_volume_accumulator.try_borrow_data()); let data = match result { core::ops::ControlFlow::Break(e) => return core::ops::FromResidual::from_residual(e), core::ops::ControlFlow::Continue(data) => data };'),
'branch_namedcontinuefirst':baseline.replace('let data = user_volume_accumulator.try_borrow_data()?;', 'let result = core::ops::Try::branch(user_volume_accumulator.try_borrow_data()); let data = match result { core::ops::ControlFlow::Continue(data) => data, core::ops::ControlFlow::Break(e) => return core::ops::FromResidual::from_residual(e) };'),
'branch_letelse':baseline.replace('let data = user_volume_accumulator.try_borrow_data()?;', 'let result = core::ops::Try::branch(user_volume_accumulator.try_borrow_data()); let core::ops::ControlFlow::Continue(data) = result else { return core::ops::FromResidual::from_residual(result.break_value().unwrap()); };'),
'branch_iflet':baseline.replace('let data = user_volume_accumulator.try_borrow_data()?;', 'let result = core::ops::Try::branch(user_volume_accumulator.try_borrow_data()); let data = if let core::ops::ControlFlow::Break(e) = result { return core::ops::FromResidual::from_residual(e); } else { result.continue_value().unwrap() };'),
}

lib=R/'src/programs/pump-amm/src/lib.rs'
lib_baseline=lib.read_text()
lib.write_text('#![feature(try_trait_v2)] //' + lib_baseline.splitlines()[0][3:] + '\n'+'\n'.join(lib_baseline.splitlines()[1:])+'\n')
results=[]
for name,source in variants.items():
 d=R/'trials'/name;d.mkdir(parents=True,exist_ok=True);(d/'sell.rs').write_text(source)
 P.write_text(source)
 run=subprocess.run(['/Users/shawwalters/amm100-run/shared/tools/nbuild.sh',str(R)],capture_output=True,text=True)
 (d/'build-measure.log').write_text(run.stdout+run.stderr)
 if run.returncode: print(name,'BUILDFAIL',flush=True); results.append({'name':name,'build_ok':False}); continue
 shutil.copyfile(R/'out/cand.so',d/'symbols.so');shutil.copyfile(R/'out/rows.json',d/'rows.json');shutil.copyfile(R/'out/build.log',d/'build.log')
 rows=json.loads((d/'rows.json').read_text()); old=json.loads((R/'baseline-rows.json').read_text())
 now={x['original'] for x in rows if x['match']}; prev={x['original'] for x in old if x['match']}
 a={'name':name,'build_ok':True,'normalized':len(now),'raw':sum(x['raw'] for x in rows),'gains':sorted(now-prev),'losses':sorted(prev-now),'sell_match':'0x4c750' in now,'sha256':hashlib.sha256((d/'symbols.so').read_bytes()).hexdigest()}
 results.append(a);(R/'results-round5.json').write_text(json.dumps(results,indent=2));print(json.dumps(a),flush=True)
P.write_text(baseline)
lib.write_text(lib_baseline)
