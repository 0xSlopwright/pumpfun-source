from pathlib import Path
import collections,hashlib,json,struct,sys,types
W=Path(__file__).resolve().parent

def verify(root,candidate,symbols,template):
 root=Path(root);sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 o=Elf(root/'evidence/original/pump_amm/deployed.so');c=Elf(Path(candidate));s=Elf(Path(symbols));by={f['start']:f for f in s.funcs};idx=collections.defaultdict(list)
 for f in s.funcs:idx[(f['size'],c.normalized[f['start']:f['start']+f['size']],json.dumps(c.pattern(f['start'],f['size']),sort_keys=True))].append(f)
 t=json.loads(Path(template).read_bytes());rows=[];raw=0
 for r in t['rows']:
  a,z=r['start'],r['end'];fs=idx[(z-a,o.normalized[a:z],json.dumps(o.pattern(a,z-a),sort_keys=True))];rows.append({'start':a,'end':z,'matches':fs});raw+=any(o.b[a:z]==c.b[f['start']:f['start']+z-a]for f in fs)
 gain=[hex(a['start'])for a,b in zip(rows,t['rows'])if a['matches']and not b['matches']];loss=[hex(a['start'])for a,b in zip(rows,t['rows'])if b['matches']and not a['matches']];assert len(rows)==785 and sum(bool(r['matches'])for r in rows)==642 and raw==129 and not gain and not loss
 helper=next(f for f in s.funcs if 'calculate_virtual_quote_reserves'in f['name']);assert helper['size']==696 and o.pattern(0x1ecd8,696)==c.pattern(helper['start'],696)
 diff=[k for k in range(0,696,8)if o.normalized[0x1ecd8+k:0x1ecd8+k+8]!=c.normalized[helper['start']+k:helper['start']+k+8]];assert diff==[592]
 assert struct.unpack_from('<I',o.b,0x1ecd8+596)[0]==22 and struct.unpack_from('<I',c.b,helper['start']+596)[0]==30
 def ptr(e,p):return struct.unpack_from('<I',e.b,p+4)[0]|struct.unpack_from('<I',e.b,p+12)[0]<<32
 path=b'programs/pump-amm/src/instructions/boost.rs'
 for e,p in [(o,0x1ecd8+552),(c,helper['start']+552)]:assert e.b[ptr(e,p):ptr(e,p)+len(path)]==path
 hc=[]
 for a,b in zip(o.callsites(0x1ecd8,696),c.callsites(helper['start'],696)):
  p=by[b['target']];size=o.entries[o.entries.index(a['target'])+1]-a['target'];assert a['offset']==b['offset']and p['size']==size and o.normalized[a['target']:a['target']+size]==c.normalized[p['start']:p['start']+size]and o.pattern(a['target'],size)==c.pattern(p['start'],size);hc.append({'offset':a['offset'],'original_target':a['target'],'candidate':p})
 assert len(hc)==6
 handler=next(f for f in s.funcs if '5boost7execute17'in f['name']);assert handler['size']==3448;oc=o.callsites(0x1ef90,3912);cc=c.callsites(handler['start'],handler['size']);assert len(oc)==len(cc)==19
 assert len([x for x in cc if x['target']==helper['start']])==1
 for old,size,needle in [(0x89430,10352,'12try_accounts17'),(0x8d228,944,'4exit17')]:
  fs=[f for f in s.funcs if 'instructions..boost..InitBoost'in f['name']and needle in f['name']and f['size']==size];assert len(fs)==1;p=fs[0];assert o.normalized[old:old+size]==c.normalized[p['start']:p['start']+size]and o.pattern(old,size)==c.pattern(p['start'],size)
 return {'passed':True,'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'normalized_matches':642,'raw_matches':129,'gains':gain,'losses':loss,'arithmetic_helper':helper,'helper_difference_offsets':diff,'original_source_line':22,'candidate_source_line':30,'source_filename_equal':True,'helper_actual_callees':hc,'handler':handler,'original_handler_bytes':3912,'original_handler_calls':19,'candidate_handler_calls':19,'parser_normalized_bytes':10352,'exit_normalized_bytes':944,'scope':'Original filename and six direct helper callees equal; helper has one unequal line store; handler remains unequal.'}
if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);p.add_argument('--template',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.symbols,a.template),indent=2))
