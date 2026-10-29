from pathlib import Path
import importlib.util,json,shutil,sys,tempfile
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W));import verify_source_binding as gate
R=W/'results';candidate=R/'build/artifacts/pump_amm_recovered.so';symbols=R/'build/artifacts/unstripped.so';record=R/'build/build-comparison.json'
def verify(canonical=R/'canonical-source',workspace=R/'source',proof=R/'dependency-proof',current=None):return gate.verify(canonical,workspace,record,candidate,symbols,proof,current)
def reject(label,fn):
 try:fn()
 except AssertionError as e:return{'name':label,'rejected':True,'reason':str(e)[:250]}
 raise AssertionError('negative accepted: '+label)
positive=verify();checks=[]
with tempfile.TemporaryDirectory(prefix='amm-sixth-source-negative-')as td:
 t=Path(td)
 canonical=t/'canonical';shutil.copytree(R/'canonical-source',canonical);p=canonical/'programs/pump-amm/src/utils/quote.rs';p.write_bytes(p.read_bytes()+b'\n// independent negative control\n');checks.append(reject('changed canonical Rust',lambda:verify(canonical=canonical)));checks.append(reject('current-source drift',lambda:verify(current=canonical)))
 workspace=t/'workspace';shutil.copytree(R/'source',workspace);p=workspace/'uncompiled-extra.txt';p.write_text('negative inventory control');checks.append(reject('extra workspace file',lambda:verify(workspace=workspace)));p.unlink();(workspace/'programs/pump-amm/src/utils/quote.rs').unlink();checks.append(reject('missing workspace input',lambda:verify(workspace=workspace)))
 proof=t/'proof';shutil.copytree(R/'dependency-proof',proof);p=proof/'active-sources/solana-program-entrypoint-2.2.1/src/lib.rs';p.write_bytes(p.read_bytes()+b'\n// independent external negative control\n');checks.append(reject('changed archived registry Rust',lambda:verify(proof=proof)))
 mapped=gate.archived_external_inputs(record,R/'dependency-proof');bad=dict(mapped);del bad[next(iter(bad))];checks.append(reject('missing external mapping',lambda:gate.recipe.verify_build(R/'canonical-source',R/'source',record,candidate,symbols,external_inputs=bad)));bad=dict(mapped);bad['extra-input']=next(iter(mapped.values()));checks.append(reject('extra external mapping',lambda:gate.recipe.verify_build(R/'canonical-source',R/'source',record,candidate,symbols,external_inputs=bad)))
print(json.dumps({'passed':True,'positive_counts':[positive['standalone_inputs'],positive['workspace_inputs'],positive['external_inputs_verified']],'negative_cases':checks},indent=2))
