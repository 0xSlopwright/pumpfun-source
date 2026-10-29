"""Read-only full-function capacities and selected swap_hop call boundaries."""
import ast,gzip,hashlib,json,struct
from pathlib import Path
from collections import Counter
PACKET=Path(__file__).resolve().parent
ROOT=PACKET.parents[1]
LEGACY=ROOT/'research/pump-v3-buy-cost-overflow'
sha=lambda b:hashlib.sha256(b).hexdigest()
def read(p):
 b=Path(p).read_bytes();return gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b

def analyze(packet=PACKET):
 api={'struct':struct}
 for n,names in [('pump_compare_function_bytes.py',{'normalize','body'}),('pump_quote_control_function_match.py',{'sections'}),('sealed-parent-verify.py',{'elf_functions'})]:
  p=LEGACY/'tools'/n;t=ast.parse(p.read_bytes());nodes=[x for x in t.body if isinstance(x,ast.FunctionDef)and x.name in names];assert {x.name for x in nodes}==names;exec(compile(ast.Module(body=nodes,type_ignores=[]),str(p),'exec'),api)
 images={'original':(ROOT/'evidence/original/pump/deployed.so').read_bytes(),'parent':read(packet/'artifacts/parent-unstripped.so.gz'),'proposal':read(packet/'artifacts/proposal-unstripped.so.gz')}
 assert sha(images['original'])=='7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
 windows=json.loads(read(LEGACY/'sources/parent-inventory.json.gz'))['windows'];assert len(windows)==1035
 functions={'original':[(r['start'],r['bytes'],'original-window')for r in windows]}
 functions.update({k:api['elf_functions'](b)for k,b in images.items()if k!='original'})
 sections={k:api['sections'](b)for k,b in images.items()}
 def function(k,start,n):
  raw=api['body'](images[k],sections[k],start,n);norm,ops=api['normalize'](raw,start,sections[k]);return dict(start=start,bytes=n,raw_sha256=sha(raw),normalized_sha256=sha(norm),operands=ops)
 rows={k:{(a,n):function(k,a,n)for a,n,_ in fs}for k,fs in functions.items()}
 counts={}
 capacities={}
 for kind in ['raw','normalized']:
  capacity={k:Counter((n,r[kind+'_sha256'])for(a,n),r in fs.items())for k,fs in rows.items()};original=capacity['original'];parent=original&capacity['parent'];proposal=original&capacity['proposal'];assert not parent-proposal
  capacities[kind]=dict(parent=sum(parent.values()),proposal=sum(proposal.values()),lost=sum((parent-proposal).values()),gained=sum((proposal-parent).values()))
 assert capacities['normalized']['parent']==capacities['normalized']['proposal']==1019
 assert capacities['raw']['parent']==capacities['raw']['proposal']==188
 targets={k:next((a,n)for a,n,s in fs if '8swap_hop17'in s)if k!='original'else(0x5b3b0,18584)for k,fs in functions.items()}
 targetrows={k:rows[k][span]for k,span in targets.items()}
 assert targetrows['parent']['bytes']==24872 and targetrows['proposal']['bytes']==19536
 assert targetrows['original']['normalized_sha256']!=targetrows['proposal']['normalized_sha256']
 roles={'get_transfer_fee':0x94908,'token_program_for':0x58668,'require_ata':0x58bf0,'quote_admission':0x14910,'post_fee_amount':0x950e0}
 expected={'get_transfer_fee':1,'token_program_for':2,'require_ata':2,'quote_admission':1,'post_fee_amount':4}
 audits={}
 for role,at in roles.items():
  reference=next(r for(a,n),r in rows['original'].items()if a==at);n=reference['bytes'];signature=reference['normalized_sha256'];by={k:{a for(a,size),r in fs.items()if size==n and r['normalized_sha256']==signature}for k,fs in rows.items()}
  occurrences={k:[dict(offset=o['offset'],target=o['target'])for o in targetrows[k]['operands']if o['kind']=='direct-call'and o['target']in by[k]]for k in rows}
  assert len(occurrences['original'])==len(occurrences['proposal'])==expected[role],role
  audits[role]=dict(original_target=at,bytes=n,normalized_sha256=signature,occurrences=occurrences)
 for k in ['original','proposal']:
  assert audits['get_transfer_fee']['occurrences'][k][0]['offset']<min(x['offset']for x in audits['token_program_for']['occurrences'][k])
  assert max(x['offset']for x in audits['token_program_for']['occurrences'][k])<min(x['offset']for x in audits['require_ata']['occurrences'][k])
  assert audits['quote_admission']['occurrences'][k][0]['offset']<min(x['offset']for x in audits['post_fee_amount']['occurrences'][k])
 for r in targetrows.values():r.pop('operands')
 return dict(scope=__doc__,whole_helper_equal=False,whole_elf_equal=False,original_windows=1035,input_sha256={k:sha(v)for k,v in images.items()},injective_capacities=capacities,bodies=targetrows,selected_callees=audits,selected_callee_occurrences=10,limitations='Selected normalized callee bodies and ordering only; no complete call/data or indirect-call closure. Full function and whole-file identity remain false.')
if __name__=='__main__':print(json.dumps(analyze(),indent=2))
