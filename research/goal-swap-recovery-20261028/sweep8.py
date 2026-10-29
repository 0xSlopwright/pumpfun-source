from pathlib import Path
import subprocess, json, shutil, hashlib, importlib.util
R=Path(__file__).resolve().parent
P=R/'src/programs/pump-amm/src/instructions/swap/sell.rs'
baseline=P.read_text()
owner = baseline.replace('require!(*user_volume_accumulator.owner == crate::ID, PumpAmmError::InvalidCashbackAccumulator);', 'if user_volume_accumulator.owner != &crate::ID { return err!(PumpAmmError::InvalidCashbackAccumulator); }').replace('require!(ata.is_writable, PumpAmmError::InvalidCashbackAccumulatorAta);', 'if ata.is_writable == false { return err!(PumpAmmError::InvalidCashbackAccumulatorAta); }')
tail='validate_pool_v2(remaining_accounts, &base_mint.key(), 2)?;\n    Ok(())'
variants={
'ownerwrite_tail_closure':owner.replace(tail,'(|| -> Result<()> { validate_pool_v2(remaining_accounts, &base_mint.key(), 2)?;\n    Ok(()) })()'),
'ownerwrite_tail_namedclosure':owner.replace(tail,'let finish = || -> Result<()> { validate_pool_v2(remaining_accounts, &base_mint.key(), 2)?; Ok(()) };\n    finish()'),
'ownerwrite_tail_tryclosure':owner.replace(tail,'(|| -> Result<()> { validate_pool_v2(remaining_accounts, &base_mint.key(), 2) })()?;\n    Ok(())'),
'ownerwrite_tail_forget':owner.replace(tail,'let result = validate_pool_v2(remaining_accounts, &base_mint.key(), 2); if let Err(e) = result { return Err(e); } core::mem::forget(result);\n    Ok(())'),
'ownerwrite_exit_forget':owner.replace('accumulator.exit(&crate::ID)?;', 'let result = accumulator.exit(&crate::ID); if let Err(e) = result { return Err(e); } core::mem::forget(result);'),
'ownerwrite_tail_ifok':owner.replace(tail,'let result = validate_pool_v2(remaining_accounts, &base_mint.key(), 2); if let Ok(()) = result { } else { return result; }\n    Ok(())'),
'ownerwrite_exit_namedclosure':owner.replace('accumulator.exit(&crate::ID)?;', 'let finish = || -> Result<()> { accumulator.exit(&crate::ID)?; Ok(()) }; finish()?;'),
'ownerwrite_tail_tryblock':owner.replace(tail,'let result: Result<()> = try { validate_pool_v2(remaining_accounts, &base_mint.key(), 2)?; };\n    result'),
}

lib=R/'src/programs/pump-amm/src/lib.rs'
lib_baseline=lib.read_text()
lib.write_text('#![feature(try_blocks)] //' + lib_baseline.splitlines()[0][3:] + '\n'+'\n'.join(lib_baseline.splitlines()[1:])+'\n')
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
 results.append(a);(R/'results-round8.json').write_text(json.dumps(results,indent=2));print(json.dumps(a),flush=True)
P.write_text(baseline)
lib.write_text(lib_baseline)
