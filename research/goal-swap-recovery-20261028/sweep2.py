from pathlib import Path
import subprocess, json, shutil, hashlib, importlib.util
R=Path(__file__).resolve().parent
P=R/'src/programs/pump-amm/src/instructions/swap/sell.rs'
baseline=P.read_text()
variants={
'init_closure_elsefirst':baseline.replace('if user_volume_accumulator.data_is_empty() {','let init = || -> Result<()> {').replace('    } else {\n        require!(*user_volume_accumulator.owner','    Ok(()) }; if !user_volume_accumulator.data_is_empty() {\n        require!(*user_volume_accumulator.owner').replace('    }\n    let mut accumulator = Account','    } else { init()?; }\n    let mut accumulator = Account'),
'init_closure_ifempty':baseline.replace('if user_volume_accumulator.data_is_empty() {','let init = || -> Result<()> {').replace('    } else {\n        require!(*user_volume_accumulator.owner','    Ok(()) }; if user_volume_accumulator.data_is_empty() { init()?; } else {\n        require!(*user_volume_accumulator.owner'),
'existing_closure':baseline.replace('    } else {\n        require!(*user_volume_accumulator.owner','    } else { (|| -> Result<()> {\n        require!(*user_volume_accumulator.owner').replace('    }\n    let mut accumulator = Account','    Ok(()) })()?; }\n    let mut accumulator = Account'),
'outer_result':baseline.replace('if user_volume_accumulator.data_is_empty() {','let result: Result<()> = if user_volume_accumulator.data_is_empty() {').replace('    } else {\n        require!(*user_volume_accumulator.owner','    Ok(()) } else {\n        require!(*user_volume_accumulator.owner').replace('    }\n    let mut accumulator = Account','    Ok(()) }; result?;\n    let mut accumulator = Account'),
'outer_option':baseline.replace('if user_volume_accumulator.data_is_empty() {','let result = if user_volume_accumulator.data_is_empty() {').replace('    } else {\n        require!(*user_volume_accumulator.owner','    Some(()) } else {\n        require!(*user_volume_accumulator.owner').replace('    }\n    let mut accumulator = Account','    None }; let _ = result;\n    let mut accumulator = Account'),
'borrow_blockscope':baseline.replace('let data = user_volume_accumulator.try_borrow_data()?;', 'let data = { user_volume_accumulator.try_borrow_data() }?;'),
}

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
 results.append(a);(R/'results-round2.json').write_text(json.dumps(results,indent=2));print(json.dumps(a),flush=True)
P.write_text(baseline)
