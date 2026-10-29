from pathlib import Path
import subprocess, json, shutil, hashlib, importlib.util
R=Path(__file__).resolve().parent
P=R/'src/programs/pump-amm/src/instructions/swap/sell.rs'
baseline=P.read_text()
variants={
'match_outer':baseline.replace('if user_volume_accumulator.data_is_empty() {','match user_volume_accumulator.data_is_empty() { true => {').replace('    } else {\n        require!(*user_volume_accumulator.owner', '    }, false => {\n        require!(*user_volume_accumulator.owner').replace('    }\n    let mut accumulator = Account', '    }}\n    let mut accumulator = Account'),
'borrow_errfirst':baseline.replace('let data = user_volume_accumulator.try_borrow_data()?;', 'let data = match user_volume_accumulator.try_borrow_data() { Err(e) => return Err(e.into()), Ok(data) => data };'),
'borrow_maperr':baseline.replace('let data = user_volume_accumulator.try_borrow_data()?;', 'let data = user_volume_accumulator.try_borrow_data().map_err(anchor_lang::error::Error::from)?;'),
'borrow_assign':baseline.replace('let data = user_volume_accumulator.try_borrow_data()?;', 'let data; match user_volume_accumulator.try_borrow_data() { Err(e) => return Err(e.into()), Ok(value) => data = value }'),
'match_outer_borrow_errfirst':baseline.replace('if user_volume_accumulator.data_is_empty() {','match user_volume_accumulator.data_is_empty() { true => {').replace('    } else {\n        require!(*user_volume_accumulator.owner', '    }, false => {\n        require!(*user_volume_accumulator.owner').replace('    }\n    let mut accumulator = Account', '    }}\n    let mut accumulator = Account').replace('let data = user_volume_accumulator.try_borrow_data()?;', 'let data = match user_volume_accumulator.try_borrow_data() { Err(e) => return Err(e.into()), Ok(data) => data };'),
'outer_match_unit':baseline.replace('if user_volume_accumulator.data_is_empty() {','match () { () if user_volume_accumulator.data_is_empty() => {').replace('    } else {\n        require!(*user_volume_accumulator.owner', '    }, () => {\n        require!(*user_volume_accumulator.owner').replace('    }\n    let mut accumulator = Account', '    }}\n    let mut accumulator = Account'),
'borrow_let_else':baseline.replace('let data = user_volume_accumulator.try_borrow_data()?;', 'let result = user_volume_accumulator.try_borrow_data(); let Ok(data) = result else { return Err(result.unwrap_err().into()); };'),
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
 results.append(a);(R/'results.json').write_text(json.dumps(results,indent=2));print(json.dumps(a),flush=True)
P.write_text(baseline)
