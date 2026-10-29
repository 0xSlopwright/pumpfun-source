"""Separate whole-byte and ELF-section parsing for the AMM v1.44 compiler control."""
from pathlib import Path
import hashlib,json,struct
root=Path('work/pump-amm-multi-hop');sha=lambda b:hashlib.sha256(b).hexdigest()
def elf(path):
 b=path.read_bytes();shoff=struct.unpack_from('<Q',b,40)[0];entsize,count,index=struct.unpack_from('<HHH',b,58);heads=[struct.unpack_from('<IIQQQQIIQQ',b,shoff+i*entsize) for i in range(count)];st=heads[index];names=b[st[4]:st[4]+st[5]];extent=max(shoff+count*entsize,max((h[4]+h[5] for h in heads if h[1]!=8),default=0))
 return b,{'path':str(path),'bytes':len(b),'sha256':sha(b),'elf_extent':extent,'elf_extent_sha256':sha(b[:extent]),'e_machine':struct.unpack_from('<H',b,18)[0],'e_flags':struct.unpack_from('<I',b,48)[0],'sections':{names[h[0]:].split(b'\0',1)[0].decode():{'offset':h[4],'bytes':h[5],'type':h[1],'flags':h[2],'sha256':sha(b[h[4]:h[4]+h[5]])} for h in heads}}
a,original=elf(Path('evidence/original/pump_amm/deployed.so'));rows={}
for label,path in [('multi_hop',root/'build-05/artifacts/pump_amm_recovered.so'),('published_amm36',Path('repro/pump_amm/boost-burn-thirty-six/pump_amm_recovered.so'))]:
 b,info=elf(path);differences=[i for i,(x,y) in enumerate(zip(a,b)) if x!=y];comparison={'full_byte_equality':a==b,'elf_extent_byte_equality':a[:original['elf_extent']]==b[:info['elf_extent']],'first_difference':differences[0] if differences else None,'different_positions_in_shared_length':len(differences),'length_difference':len(b)-len(a)};rows[label]={'candidate':info,'comparison':comparison}
generated=json.loads((root/'build-05/build-comparison.json').read_text())['comparison'];checks=rows['multi_hop']['comparison'];assert all(checks[k]==generated[k] for k in checks if k in generated)
(root/'independent-comparisons.json').write_text(json.dumps({'scope':'Read-only whole ELF and section comparisons; no edited binaries. AMM37 uses the validated v1.44 graph and adds multi_hop_swap.','original':original,'builds':rows,'agrees_with_build_helper':True},indent=2)+'\n')
print(json.dumps({label:{'bytes':r['candidate']['bytes'],'sha256':r['candidate']['sha256'],'e_machine':r['candidate']['e_machine'],'e_flags':r['candidate']['e_flags'],**r['comparison']} for label,r in rows.items()},indent=2))
