from pathlib import Path
import subprocess, json, shutil, hashlib, importlib.util
R=Path(__file__).resolve().parent
P=R/'src/programs/pump-amm/src/instructions/swap/sell.rs'
baseline=P.read_text()
owner = baseline.replace('require!(*user_volume_accumulator.owner == crate::ID, PumpAmmError::InvalidCashbackAccumulator);', 'if user_volume_accumulator.owner != &crate::ID { return err!(PumpAmmError::InvalidCashbackAccumulator); }')
ownerwrite = owner.replace('require!(ata.is_writable, PumpAmmError::InvalidCashbackAccumulatorAta);', 'if ata.is_writable == false { return err!(PumpAmmError::InvalidCashbackAccumulatorAta); }')
helpers='\n#[inline] #[cold] fn branch_cold() {}\n#[inline] fn unlikely(b:bool)->bool { if b {branch_cold();} b }\n#[inline] fn likely(b:bool)->bool { if !b {branch_cold();} b }\n'
variants={
'ownerwrite_hint_ataempty_likely':ownerwrite.replace('if ata.data_is_empty() {', 'if likely(ata.data_is_empty()) {')+helpers,
'ownerwrite_hint_ataempty_unlikely':ownerwrite.replace('if ata.data_is_empty() {', 'if unlikely(ata.data_is_empty()) {')+helpers,
'ownerwrite_hint_atawrite_unlikely':ownerwrite.replace('if ata.is_writable == false {', 'if unlikely(ata.is_writable == false) {')+helpers,
'ownerwrite_hint_atawrite_likely':ownerwrite.replace('if ata.is_writable == false {', 'if likely(ata.is_writable == false) {')+helpers,
'owner_hint_atawrite_likely':owner.replace('require!(ata.is_writable,', 'require!(likely(ata.is_writable),')+helpers,
'owner_hint_atawrite_unlikely':owner.replace('require!(ata.is_writable,', 'require!(unlikely(ata.is_writable),')+helpers,
'ownerwrite_hint_owner_unlikely':ownerwrite.replace('if user_volume_accumulator.owner != &crate::ID {', 'if unlikely(user_volume_accumulator.owner != &crate::ID) {')+helpers,
'ownerwrite_hint_owner_likely':ownerwrite.replace('if user_volume_accumulator.owner != &crate::ID {', 'if likely(user_volume_accumulator.owner != &crate::ID) {')+helpers,
'ownerwrite_hint_atakey_likely':ownerwrite.replace('require!(ata.key() == expected_ata,', 'require!(likely(ata.key() == expected_ata),')+helpers,
'ownerwrite_hint_atakey_unlikely':ownerwrite.replace('require!(ata.key() == expected_ata,', 'require!(unlikely(ata.key() == expected_ata),')+helpers,
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
 results.append(a);(R/'results-round10.json').write_text(json.dumps(results,indent=2));print(json.dumps(a),flush=True)
P.write_text(baseline)
