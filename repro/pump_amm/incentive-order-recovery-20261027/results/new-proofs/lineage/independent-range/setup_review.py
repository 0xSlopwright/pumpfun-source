from pathlib import Path
import shutil,hashlib,json,ast
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;J=R/'work/amm-incentive-liquidity-buy-combined-20261027'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
for n in ['measurement-full.json','measurement.json']:
 if(J/n).exists():shutil.copy2(J/n,W/'worker-records'/n)
for n in ['dependency-metadata.json','dependency-roots.json']:shutil.copy2(W/'worker-records/build'/n,W/'dependency-proof'/n)
shutil.copy2(J/'build_entrypoint.py',W/'dependency-proof/builder-executed.py');shutil.copy2(J/'archive-source-proof.json',W/'dependency-proof/entrypoint-archive-proof.json')
p=W/'dependency-proof/manifest.json';m=json.loads(p.read_bytes());m['files']={str(f.relative_to(p.parent)):sha(f)for f in sorted(p.parent.rglob('*'))if f.is_file()and f!=p};p.write_text(json.dumps(m,indent=2)+'\n')
identity=R/'work/amm-math-identity-map-20261027/packet';(W/'identity-map').mkdir();shutil.copy2(identity/'identity-map.json',W/'identity-map/identity-map.json');shutil.copy2(identity/'README.md',W/'identity-map/README.md');shutil.copy2(identity/'manifest.json',W/'identity-map/upstream-manifest.json')
(W/'identity-map/link.json').write_text(json.dumps({'path':'work/amm-math-identity-map-20261027/packet','manifest_sha256':sha(identity/'manifest.json'),'base_candidate_sha256':'58478a978292ea6bc4e6a9776a536f91a9384da7f1f82a2e1f9743659a34b58b','scope':'Identity labels and prior boundaries; newartifact isrecounted independently.'},indent=2)+'\n')
p=R/'work/amm-pool-source-organization-20261027/origin-census-current.py';node=next(n for n in ast.parse(p.read_text()).body if isinstance(n,ast.FunctionDef)and n.name=='source_fields');(W/'source_fields.py').write_text('import struct\n'+ast.unparse(node)+'\n')
p=R/'work/amm-liquidity-error-lifetimes-next-20261027/packet/verify.py';node=next(n for n in ast.parse(p.read_text()).body if isinstance(n,ast.FunctionDef)and n.name=='check_body');(W/'liquidity_body.py').write_text(ast.unparse(node)+'\n')
config={'candidate_sha256':sha(W/'artifacts/candidate.so'),'symbols_sha256':sha(W/'artifacts/unstripped.so'),'baseline_sha256':sha(W/'artifacts/baseline.so'),'metrics':{'normalized':656,'raw':148,'text':826112,'total_windows':785,'original_text':1162040,'remaining':129},'expected_changes':json.loads((W/'source-composition.json').read_bytes())['changed_files']};(W/'config.json').write_text(json.dumps(config,indent=2)+'\n');print(config)
