from pathlib import Path
import hashlib,json,sys,types
W=Path(__file__).resolve().parent
def module(name,root):
 p=W/'static-tools'/name;m=types.ModuleType('static_'+p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);m.R=root;return m

def verify(root,candidate,symbols):
 root=Path(root);candidate=Path(candidate);symbols=Path(symbols);sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 o=Elf(root/'evidence/original/pump_amm/deployed.so');c=Elf(candidate);s=Elf(symbols);cl=json.loads((W/'data-audit/call-closure.json').read_bytes());ds=json.loads((W/'data-audit/data-closure.json').read_bytes());assert cl['candidate_sha256']==hashlib.sha256(c.b).hexdigest()and cl['symbols_sha256']==hashlib.sha256(s.b).hexdigest()
 assert cl['counts']['internal_direct_closure_windows']==ds['counts']['bounded_static_closed_windows']==586 and ds['counts']['unequal_text_without_equal_alternative']==0 and ds['counts']['resolved_in_bounded_closure']==16
 inv=module('inventory.py',root).run(root/'evidence/original/pump_amm/deployed.so',candidate,W/'data-audit');ranges=module('ranges.py',root).analyze(root/'evidence/original/pump_amm/deployed.so',candidate,symbols,inv);assert not ranges['without_equal_alternative']and ranges['equal']==ranges['observations']
 tables=module('tables.py',root).tables({n:W/'data-inputs'/n for n in ['unicode_data.rs','printable.rs','validations.rs']});found=[]
 for t in tables:
  data=t.pop('payload');refs=[r for r in inv['rows']if any(t['consumer']in n for n in r['candidate_names'])and o.b[r['original_pointer']:r['original_pointer']+len(data)]==c.b[r['candidate_pointer']:r['candidate_pointer']+len(data)]==data];assert refs;found.append({'name':t['name'],'bytes':len(data),'references':len(refs),'sha256':hashlib.sha256(data).hexdigest()})
 assert len(found)==9 and sum(x['bytes']for x in found)==2518
 objs=module('objects.py',root).objects(symbols);enum=[]
 for ptr,tag in [(0x11ece0,26),(0x11ed60,9)]:
  refs=[r for r in inv['rows']if r['original_pointer']==ptr];assert len(refs)==1;r=refs[0];b=r['candidate_pointer'];defs=objs[b];assert len(defs)==1 and defs[0]['bytes']==80;data=tag.to_bytes(4,'little')+bytes(76);assert o.b[ptr:ptr+80]==c.b[b:b+80]==data;enum.append({'original':ptr,'candidate':b,'bytes':80,'tag':tag})
 return{'passed':True,'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'bounded_static_closed_windows':586,'unbound_pointer_observations_resolved':16,'genuine_recognized_text_mismatches':0,'source_coordinate_observations':12,'complete_tables':found,'table_bytes':2518,'fixed_ranges_equal':ranges['equal'],'fixed_ranges_unequal_without_alternative':ranges['without_equal_alternative'],'enum_constants':enum,'scope':'Retained fifth data proof boundaries rechecked at sixth addresses; no complete ELF/static-data identity claim.'}
if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.symbols),indent=2))
