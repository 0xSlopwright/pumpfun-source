from pathlib import Path
import argparse,hashlib,json,struct,sys
W=Path(__file__).resolve().parent

def verify(root,candidate=None,symbols=None):
 root=Path(root).resolve();sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 c=Elf(Path(candidate)if candidate else W/'build/artifacts/pump_amm_recovered.so');s=Elf(Path(symbols)if symbols else W/'build/artifacts/unstripped.so');o=Elf(root/'evidence/original/pump_amm/deployed.so');matches=[f for f in s.funcs if f['size']==6088 and c.normalized[f['start']:f['start']+6088]==o.normalized[0xb1c98:0xb1c98+6088]and c.pattern(f['start'],6088)==o.pattern(0xb1c98,6088)];assert len(matches)==1;f=matches[0];origins={}
 for name,e,start in [('original',o,0xb1c98),('candidate',c,f['start'])]:
  at=start+6064;p=struct.unpack_from('<I',e.b,at+4)[0]|struct.unpack_from('<I',e.b,at+12)[0]<<32;fp=struct.unpack_from('<Q',e.b,p)[0]>>32;n=struct.unpack_from('<Q',e.b,p+8)[0];line,col=struct.unpack_from('<II',e.b,p+16);origins[name]={'file':e.b[fp:fp+n].decode(),'line':line,'column':col}
 assert origins['candidate']['file']==origins['original']['file']=='programs/pump-amm/src/instructions/swap/buy.rs'
 return {'passed':True,'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'function':f,'original_body':'0xb1c98','normalized_body_equal':True,'relocation_pattern_equal':True,'origins':origins,'coordinates_equal':origins['candidate']==origins['original']}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--symbols',type=Path);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.symbols),indent=2))
