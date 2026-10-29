from pathlib import Path
import subprocess, json, shutil, hashlib, importlib.util
R=Path(__file__).resolve().parent/'lane'
P=R/'src/programs/pump-amm/src/instructions/swap/sell.rs'
baseline=P.read_text()
owner = baseline.replace('require!(*user_volume_accumulator.owner == crate::ID, PumpAmmError::InvalidCashbackAccumulator);', 'if user_volume_accumulator.owner != &crate::ID { return err!(PumpAmmError::InvalidCashbackAccumulator); }')
oldtail='validate_pool_v2(remaining_accounts, &base_mint.key(), 2)?;'
newtail='let result = validate_pool_v2(remaining_accounts, &base_mint.key(), 2); if let Err(e) = result { return Err(e); } core::mem::forget(result);'
oldexit='accumulator.exit(&crate::ID)?;'
newexit='let result = accumulator.exit(&crate::ID); if let Err(e) = result { return Err(e); } core::mem::forget(result);'
variants={
'baseline_tail_forget':baseline.replace(oldtail,newtail),
'owner_tail_forget':owner.replace(oldtail,newtail),
'baseline_exit_forget':baseline.replace(oldexit,newexit),
'owner_exit_forget':owner.replace(oldexit,newexit),
'baseline_both_forget':baseline.replace(oldexit,newexit).replace(oldtail,newtail),
'owner_both_forget':owner.replace(oldexit,newexit).replace(oldtail,newtail),
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
 results.append(a);(R/'results-round5.json').write_text(json.dumps(results,indent=2));print(json.dumps(a),flush=True)
P.write_text(baseline)
