from pathlib import Path
import struct,tempfile,json
from elf_reader import Elf
import audit

def run(w):
 w=Path(w);o=Elf(w/'input-root/evidence/original/pump_amm/deployed.so');c=Elf(w/'build/artifacts/pump_amm_recovered.so');s=Elf(w/'build/artifacts/unstripped.so');rows=audit.J(w/'measurement-full.json')['rows'];b=next(f['start']for f in s.funcs if '10sweep_fees7execute17h'in f['name']);out=[]
 with tempfile.TemporaryDirectory()as tmp:
  def reject(name,edit):
   raw=bytearray(c.b);edit(raw);p=Path(tmp)/(name+'.so');p.write_bytes(raw)
   try:audit.sweep(o,Elf(p),s,rows)
   except AssertionError:out.append({'name':name,'rejected':True});return
   raise AssertionError(name+' was accepted')
  reject('changed_recipient_instruction',lambda raw:raw.__setitem__(b+112+1,raw[b+112+1]^1))
  reject('changed_typed_source_line',lambda raw:raw.__setitem__(b+1208+4,raw[b+1208+4]^1))
  target=next(f['start']for f in s.funcs if 'Pubkey20find_program_address17h'in f['name'])
  reject('valid_wrong_actual_callee',lambda raw:struct.pack_into('<i',raw,b+264+4,(target-(b+264+8))//8))
 out.extend(audit.events.negative_controls(w/'input-root/evidence/original/pump_amm/deployed.so',w/'pump_amm.json'))
 return out
if __name__=='__main__':
 w=Path(__file__).resolve().parent;r=run(w);(w/'negative-controls.json').write_text(json.dumps(r,indent=2)+'\n');print(len(r))
