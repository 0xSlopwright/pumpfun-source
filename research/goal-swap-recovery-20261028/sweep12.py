from pathlib import Path
import subprocess, json, shutil, hashlib, importlib.util
R=Path(__file__).resolve().parent
P=R/'src/programs/pump-amm/src/instructions/swap/sell.rs'
baseline=P.read_text()
owner = baseline.replace('require!(*user_volume_accumulator.owner == crate::ID, PumpAmmError::InvalidCashbackAccumulator);', 'if user_volume_accumulator.owner != &crate::ID { return err!(PumpAmmError::InvalidCashbackAccumulator); }').replace('require!(ata.is_writable, PumpAmmError::InvalidCashbackAccumulatorAta);', 'if ata.is_writable == false { return err!(PumpAmmError::InvalidCashbackAccumulatorAta); }')
exit='accumulator.exit(&crate::ID)?;'
variants={
'ownerwrite_exit_directclosure':owner.replace(exit,'let finish = || accumulator.exit(&crate::ID); finish()?;'),
'ownerwrite_exit_iferrclosure':owner.replace(exit,'let finish = || -> Result<()> { if let Err(e) = accumulator.exit(&crate::ID) { return Err(e); } Ok(()) }; finish()?;'),
'ownerwrite_exit_matchclosure':owner.replace(exit,'let finish = || -> Result<()> { match accumulator.exit(&crate::ID) { Err(e) => Err(e), Ok(()) => Ok(()) } }; finish()?;'),
'ownerwrite_exit_namedclosure_result':owner.replace(exit,'let finish = || -> Result<()> { accumulator.exit(&crate::ID)?; Ok(()) }; let result = finish(); result?;'),
'ownerwrite_exit_scopedclosure_result':owner.replace(exit,'let result = { let finish = || -> Result<()> { accumulator.exit(&crate::ID)?; Ok(()) }; finish() }; result?;'),
'ownerwrite_exit_helper':owner.replace(exit,'exit_uva(&accumulator)?;')+'\n#[inline(always)] fn exit_uva(acc:&Account<UserVolumeAccumulator>)->Result<()> { acc.exit(&crate::ID)?; Ok(()) }\n',
'ownerwrite_exit_pubhelper':owner.replace(exit,'exit_uva(&accumulator)?;')+'\npub fn exit_uva(acc:&Account<UserVolumeAccumulator>)->Result<()> { acc.exit(&crate::ID)?; Ok(()) }\n',
'ownerwrite_exit_directhelper':owner.replace(exit,'exit_uva(&accumulator)?;')+'\n#[inline(always)] fn exit_uva(acc:&Account<UserVolumeAccumulator>)->Result<()> { acc.exit(&crate::ID) }\n',
'ownerwrite_exit_directpubhelper':owner.replace(exit,'exit_uva(&accumulator)?;')+'\npub fn exit_uva(acc:&Account<UserVolumeAccumulator>)->Result<()> { acc.exit(&crate::ID) }\n',
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
 results.append(a);(R/'results-round12.json').write_text(json.dumps(results,indent=2));print(json.dumps(a),flush=True)
P.write_text(baseline)
