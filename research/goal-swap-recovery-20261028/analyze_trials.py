import sys, pathlib, importlib.util,json
R=pathlib.Path(__file__).resolve().parent; repo=R.parents[1]; latest=repo/'work/latest-main'; T=latest/'research/amm-sell-returned-key-20261028/tools';sys.path.insert(0,str(T));import cfg_attribution as cfg
spec=importlib.util.spec_from_file_location('audit',latest/'research/amm-sell-control-flow-boundary/audit.py'); audit=importlib.util.module_from_spec(spec);spec.loader.exec_module(audit)
o=cfg.Inventory(repo/'evidence/original/pump_amm/deployed.so',True)
rows=[]
for path in [R/'baseline.so',*sorted((R/'trials').glob('*/symbols.so'))]:
 try:
  c=cfg.Inventory(path); a=audit.analyze(o,c,cfg);v=a['comparison'];s={'name':path.parent.name if path.name!='baseline.so' else 'baseline','original_bytes':a['original_bytes'],'candidate_bytes':a['candidate_bytes'],'paired_blocks':v['topology']['mapped_blocks'],'register_differences':v['register_different_slots'],'nonregister_equal':v['nonregister_instruction_and_relocation_equal'],'branch_polarity_changes':len(v['branch_polarity_changes']),'equal_calls':sum(x['depth2_identity_equal'] for x in v['calls']),'total_calls':len(v['calls'])};rows.append(s)
 except Exception as e: rows.append({'name':str(path),'error':str(e)})
print(json.dumps(rows,indent=2));(R/'diagnostics.json').write_text(json.dumps(rows,indent=2))
