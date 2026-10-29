from pathlib import Path
import subprocess, json, shutil, hashlib, importlib.util
R=Path(__file__).resolve().parent
P=R/'src/programs/pump-amm/src/instructions/swap/sell.rs'
baseline=P.read_text()
owner = baseline.replace('require!(*user_volume_accumulator.owner == crate::ID, PumpAmmError::InvalidCashbackAccumulator);', 'if user_volume_accumulator.owner != &crate::ID { return err!(PumpAmmError::InvalidCashbackAccumulator); }').replace('require!(ata.is_writable, PumpAmmError::InvalidCashbackAccumulatorAta);', 'if ata.is_writable == false { return err!(PumpAmmError::InvalidCashbackAccumulatorAta); }')
exit='accumulator.exit(&crate::ID)?;'
closure='let finish = || -> Result<()> { accumulator.exit(&crate::ID)?; Ok(()) }; finish()?;'
best=owner.replace(exit,closure)
tail='validate_pool_v2(remaining_accounts, &base_mint.key(), 2)?;\n    Ok(())'
variants={
'best_exit_dropcapture':best.replace(closure,closure+' drop(finish);'),
'best_tail_dropcapture':best.replace(tail,'validate_pool_v2(remaining_accounts, &base_mint.key(), 2)?;\n    drop(finish); Ok(())'),
'best_tail_inlineclosure':best.replace(tail,'(|| -> Result<()> { validate_pool_v2(remaining_accounts, &base_mint.key(), 2)?;\n    Ok(()) })()'),
'best_tail_namedresult':best.replace(tail,'let result = validate_pool_v2(remaining_accounts, &base_mint.key(), 2); result?;\n    Ok(())'),
'best_tail_iferrforget':best.replace(tail,'let result = validate_pool_v2(remaining_accounts, &base_mint.key(), 2); if let Err(e) = result {return Err(e);} core::mem::forget(result);\n    Ok(())'),
'best_tail_fullmatch':best.replace(tail,'let result = validate_pool_v2(remaining_accounts, &base_mint.key(), 2); match result {Err(e) => return Err(e), Ok(()) => {}}\n    Ok(())'),
'ownerwrite_exit_namedref':owner.replace(exit,'let account = &accumulator; account.exit(&crate::ID)?;'),
'ownerwrite_exit_scopedref':owner.replace(exit,'let result = { let account = &accumulator; account.exit(&crate::ID) }; result?;'),
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
 results.append(a);(R/'results-round13.json').write_text(json.dumps(results,indent=2));print(json.dumps(a),flush=True)
P.write_text(baseline)
