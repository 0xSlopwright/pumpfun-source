#!/usr/bin/env python3
"""Diagnostic call/branch projection. Drops all data operations; never acceptance."""
from pathlib import Path
import collections,gzip,importlib.util,json
R=Path(__file__).resolve().parent;REPO=R.parents[1];spec=importlib.util.spec_from_file_location('structure',REPO/'research/goal-pump-swap-final-20261028/structure.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
def project(g):
 ns={n['offset']:n for n in g['nodes']};parts={};virtual=[];serial=8
 for n in g['nodes']:
  ps=[]
  for row in n['code']:
   callee=row['actual_direct_callee'];extern=row['relocation']if row['official_normalized_value'].startswith('85')and row['relocation']and row['relocation']['type']==10 else None
   if not callee and not extern:continue
   key=hex(serial);serial+=8;ps.append(key);virtual.append({'offset':key,'code':[],'term':{'kind':'actual_call','identity_depth2':callee['identity_sha256']if callee else None,'external_relocation':extern},'edges':[],'source_node':n['offset'],'source_instruction':row['offset'],'callee':{k:callee[k]for k in ['actual_target','symbol','identity_sha256']}if callee else None})
  if n['term']['kind']!='next':
   key=hex(serial);serial+=8;ps.append(key);term={k:v for k,v in n['term'].items()if k!='registers'};virtual.append({'offset':key,'code':[],'term':term,'edges':[],'source_node':n['offset'],'source_instruction':n['machine_terminators'][-1]['offset']})
  parts[n['offset']]=ps
 def target(node):
  seen=set()
  while not parts[node]:
   assert node not in seen,('data-only loop',node);seen.add(node);assert ns[node]['term']['kind']=='next'and len(ns[node]['edges'])==1;node=ns[node]['edges'][0][1]
  return parts[node][0]
 vn={n['offset']:n for n in virtual}
 for n in g['nodes']:
  ps=parts[n['offset']]
  for a,b in zip(ps,ps[1:]):vn[a]['edges']=[['next',b]]
  if not ps:continue
  last=vn[ps[-1]]
  last['edges']=[[role,target(to)]for role,to in n['edges']]
  if last['term']['kind']=='actual_call':assert n['term']['kind']=='next'
 entry={'offset':'0x0','code':[],'term':{'kind':'entry'},'edges':[['next',target('0x0')]]};return {'nodes':[entry,*virtual]}
def run():
 out=[]
 for name in ['matched-business-snapshots','matched-business-direct-events','matched-business-seed-gates','matched-business-closed-arms','matched-business-completion-order','matched-business-late-mutable','matched-business-output-record','matched-business-nested-post-gate','matched-business-native-payment-arm','matched-business-branch-capped-output','matched-business-native-payout-guard','matched-business-post-value','matched-business-none-first-fill']:
  d=R/'probes'/name;raw=json.loads(gzip.decompress((d/'graph.json.gz').read_bytes()));a=project(raw['original']);b=project(raw['candidate']);cmp=m.cfg.bijection(a,b,True);summary={'name':name,'scope':__doc__,'original_nodes':len(a['nodes']),'candidate_nodes':len(b['nodes']),'original_node_kinds':dict(collections.Counter(n['term']['kind']for n in a['nodes'])),'candidate_node_kinds':dict(collections.Counter(n['term']['kind']for n in b['nodes'])),'comparison':cmp}
  if not cmp['verified']:
   summary['first_difference']={'original':next((n for n in a['nodes']if n['offset']==cmp['at_original']),None),'candidate':next((n for n in b['nodes']if n['offset']==cmp['at_candidate']),None)}
  (d/'call-gate-projection.json.gz').write_bytes(gzip.compress(json.dumps({'scope':__doc__,'original':a,'candidate':b,'comparison':summary},indent=2).encode(),mtime=0));out.append(summary)
 (R/'CALL-GATE-SUMMARY.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps([{k:v for k,v in x.items()if k not in['comparison','first_difference']}|{'comparison':{k:v for k,v in x['comparison'].items()if k not in['mapping','partial_mapping']},'first_difference':x.get('first_difference')}for x in out],indent=2))
if __name__=='__main__':run()
