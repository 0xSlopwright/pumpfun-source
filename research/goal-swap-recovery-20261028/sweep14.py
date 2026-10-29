from pathlib import Path
import subprocess, json, shutil, hashlib, importlib.util
R=Path(__file__).resolve().parent
P=R/'src/programs/pump-amm/src/instructions/swap/sell.rs'
baseline=P.read_text()
owner = baseline.replace('require!(*user_volume_accumulator.owner == crate::ID, PumpAmmError::InvalidCashbackAccumulator);', 'if user_volume_accumulator.owner != &crate::ID { return err!(PumpAmmError::InvalidCashbackAccumulator); }').replace('require!(ata.is_writable, PumpAmmError::InvalidCashbackAccumulatorAta);', 'if ata.is_writable == false { return err!(PumpAmmError::InvalidCashbackAccumulatorAta); }')
acc='let mut accumulator = Account::<UserVolumeAccumulator>::try_from(user_volume_accumulator)?;'
ata='let ata = InterfaceAccount::<TokenAccount>::try_from_unchecked(ata)?;'
variants={
'ownerwrite_acc_namedresult':owner.replace(acc,'let result = Account::<UserVolumeAccumulator>::try_from(user_volume_accumulator); let mut accumulator = result?;'),
'ownerwrite_acc_matcherrfirst':owner.replace(acc,'let mut accumulator = match Account::<UserVolumeAccumulator>::try_from(user_volume_accumulator) { Err(e) => return Err(e), Ok(accumulator) => accumulator };'),
'ownerwrite_acc_matchokfirst':owner.replace(acc,'let mut accumulator = match Account::<UserVolumeAccumulator>::try_from(user_volume_accumulator) { Ok(accumulator) => accumulator, Err(e) => return Err(e) };'),
'ownerwrite_ata_namedresult':owner.replace(ata,'let result = InterfaceAccount::<TokenAccount>::try_from_unchecked(ata); let ata = result?;'),
'ownerwrite_ata_matcherrfirst':owner.replace(ata,'let ata = match InterfaceAccount::<TokenAccount>::try_from_unchecked(ata) { Err(e) => return Err(e), Ok(ata) => ata };'),
'ownerwrite_ata_matchokfirst':owner.replace(ata,'let ata = match InterfaceAccount::<TokenAccount>::try_from_unchecked(ata) { Ok(ata) => ata, Err(e) => return Err(e) };'),
'ownerwrite_both_namedresult':owner.replace(acc,'let result = Account::<UserVolumeAccumulator>::try_from(user_volume_accumulator); let mut accumulator = result?;').replace(ata,'let result = InterfaceAccount::<TokenAccount>::try_from_unchecked(ata); let ata = result?;'),
'ownerwrite_both_matcherrfirst':owner.replace(acc,'let mut accumulator = match Account::<UserVolumeAccumulator>::try_from(user_volume_accumulator) { Err(e) => return Err(e), Ok(accumulator) => accumulator };').replace(ata,'let ata = match InterfaceAccount::<TokenAccount>::try_from_unchecked(ata) { Err(e) => return Err(e), Ok(ata) => ata };'),
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
 results.append(a);(R/'results-round14.json').write_text(json.dumps(results,indent=2));print(json.dumps(a),flush=True)
P.write_text(baseline)
