from pathlib import Path
import subprocess, json, shutil, hashlib, importlib.util
R=Path(__file__).resolve().parent
P=R/'src/programs/pump-amm/src/instructions/swap/sell.rs'
baseline=P.read_text()
owner = baseline.replace('require!(*user_volume_accumulator.owner == crate::ID, PumpAmmError::InvalidCashbackAccumulator);', 'if user_volume_accumulator.owner != &crate::ID { return err!(PumpAmmError::InvalidCashbackAccumulator); }')
def ata_match(s): return s.replace('if ata.data_is_empty() {', 'match ata.data_len() { 0 => {').replace('    }\n    let ata = InterfaceAccount', '    }, _ => {}}\n    let ata = InterfaceAccount')
variants={
'owner_ata_lenmatch':ata_match(owner),
'owner_ata_lenequal':owner.replace('if ata.data_is_empty() {', 'if ata.data_len() == 0 {'),
'owner_ata_lenexists':owner.replace('if ata.data_is_empty() {', 'let exists = ata.data_len() > 0; if !exists {'),
'owner_ata_lenmatchreverse':owner.replace('if ata.data_is_empty() {', 'match ata.data_len() { 1.. => {}, 0 => {').replace('    }\n    let ata = InterfaceAccount', '    }}\n    let ata = InterfaceAccount'),
'baseline_ata_lenmatch':ata_match(baseline),
'owner_ata_boolletmatch':owner.replace('if ata.data_is_empty() {', 'let exists = !ata.data_is_empty(); match exists { true => {}, false => {').replace('    }\n    let ata = InterfaceAccount', '    }}\n    let ata = InterfaceAccount'),
'owner_ata_boolletfalse':owner.replace('if ata.data_is_empty() {', 'let exists = !ata.data_is_empty(); if exists == false {'),
'owner_ata_boolmatchfalse':owner.replace('if ata.data_is_empty() {', 'match !ata.data_is_empty() { true => {}, false => {').replace('    }\n    let ata = InterfaceAccount', '    }}\n    let ata = InterfaceAccount'),
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
 results.append(a);(R/'results-round7.json').write_text(json.dumps(results,indent=2));print(json.dumps(a),flush=True)
P.write_text(baseline)
