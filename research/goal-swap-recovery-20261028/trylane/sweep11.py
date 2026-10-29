from pathlib import Path
import subprocess, json, shutil, hashlib, importlib.util
R=Path(__file__).resolve().parent
P=R/'src/programs/pump-amm/src/instructions/swap/sell.rs'
baseline=P.read_text()
owner = baseline.replace('require!(*user_volume_accumulator.owner == crate::ID, PumpAmmError::InvalidCashbackAccumulator);', 'if user_volume_accumulator.owner != &crate::ID { return err!(PumpAmmError::InvalidCashbackAccumulator); }')
ownerwrite = owner.replace('require!(ata.is_writable, PumpAmmError::InvalidCashbackAccumulatorAta);', 'if ata.is_writable == false { return err!(PumpAmmError::InvalidCashbackAccumulatorAta); }')
def conditional(s):
 start=s.index('    if ata.data_is_empty() {',s.index('fn cashback'))
 end=s.index('    let ata = InterfaceAccount',start)
 section=s[start:end].replace('        ))?;','        ))').replace('    }\n','    } else { Ok(()) }?;\n')
 return s[:start]+section+s[end:]
variants={
'baseline_ata_conditional_result':conditional(baseline),
'owner_ata_conditional_result':conditional(owner),
'ownerwrite_ata_conditional_result':conditional(ownerwrite),
'ownerwrite_ata_conditional_result_exists':conditional(ownerwrite).replace('if ata.data_is_empty() {','let exists = !ata.data_is_empty(); if !exists {'),
'ownerwrite_ata_conditional_named_result':conditional(ownerwrite).replace('if ata.data_is_empty() {','let result = if ata.data_is_empty() {').replace('} else { Ok(()) }?;','} else { Ok(()) }; result?;'),
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
 results.append(a);(R/'results-round11.json').write_text(json.dumps(results,indent=2));print(json.dumps(a),flush=True)
P.write_text(baseline)
