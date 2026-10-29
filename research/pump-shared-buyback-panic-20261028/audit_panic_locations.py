"""Audit actual costs panic call operands and their existing SBF Location data."""
from pathlib import Path
import csv,hashlib,json,runpy,struct,sys
from elftools.elf.elffile import ELFFile
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
from pump_compare_function_bytes import body,normalize
from pump_quote_control_function_match import sections
verify=runpy.run_path(str(ROOT/'research/claude-pump-integration-20261027/r37-layout-33/verify.py'))
windows={int(r['original_start']):int(r['bytes']) for r in csv.DictReader(open(ROOT/'repro/reconstruction-status-2026-10-26/functions.tsv'),delimiter='\t') if r['program']=='pump' and r['variant']=='selected'}
sha=lambda b:hashlib.sha256(b).hexdigest()
class Elf:
 def __init__(self,path,original=False):
  self.path=path;self.b=path.read_bytes();self.ss=sections(self.b);self.original=original;self.fs=verify['elf_functions'](self.b);self.by={}
  for a,l,n in self.fs:
   if a not in self.by or l>self.by[a][0]:self.by[a]=(l,n)
  with path.open('rb') as f:
   e=ELFFile(f);self.reloc={r['r_offset']:r['r_info_type'] for s in e.iter_sections() if s['sh_type'] in ('SHT_REL','SHT_RELA') for r in s.iter_relocations()}
 def at(self,a,n):
  for s in self.ss.values():
   if s['addr']>0 and s['addr']<=a and a+n<=s['addr']+s['size']:
    i=s['offset']+a-s['addr'];return self.b[i:i+n]
  raise ValueError((hex(a),n))
 def raw(self,a):return body(self.b,self.ss,a,windows[a] if self.original else self.by[a][0])
 def tag(self,a):return sha(normalize(self.raw(a),a,self.ss)[0])
 def location(self,a):
  raw=self.at(a,24);encoded,length,line,column=struct.unpack('<QQII',raw)
  assert self.reloc[a]==8 and encoded&0xffffffff==0
  return {'address':hex(a),'raw_record_hex':raw.hex(),'relative_relocation_type':8,'file':self.at(encoded>>32,length).decode(),'line':line,'column':column}
 def audit(self,a,panic_tags):
  raw=self.raw(a);_,ops=normalize(raw,a,self.ss);ld={};rows=[]
  i=0
  while i<len(raw):
   op,regs,d,imm=struct.unpack_from('<BBhi',raw,i)
   if op==0x18:
    ld[regs&15]=(i,struct.unpack_from('<I',raw,i+4)[0]|struct.unpack_from('<I',raw,i+12)[0]<<32);i+=16;continue
   if op==0x85 and regs>>4==1:
    target=a+i+8+imm*8;kind=panic_tags.get(self.tag(target))
    if kind:
     register=3 if kind=='checked_sub_expect' else 5
     location_offset,location=ld[register];message_offset,message=ld[1]
     assert i-location_offset<=15*8 and i-message_offset<=15*8
     expected=b'buyback_fee never exceeds protocol_fee' if kind=='checked_sub_expect' else b'buyback fee is at most protocol_fee'
     if self.at(message,len(expected))==expected:
      rows.append({'role':kind,'call_offset':hex(i),'actual_target':hex(target),'message':expected.decode(),'location_operand_offset':hex(location_offset),'location':self.location(location)})
   i+=8
  assert {r['role'] for r in rows}=={'checked_sub_expect','u64_conversion_expect'}
  return {'path':str(self.path),'sha256':sha(self.b),'costs_start':hex(a),'rows':rows}
o=Elf(ROOT/'evidence/original/pump/deployed.so',True)
tags={o.tag(0x1ac528):'checked_sub_expect',o.tag(0x1ace18):'u64_conversion_expect'}
result={'scope':__doc__,'original':o.audit(0x80df8,tags),'candidates':[]}
for p in sys.argv[1:-1]:
 e=Elf(Path(p));a,_,_=next(t for t in e.fs if '12v3_buy_costs17' in t[2]);row=e.audit(a,tags)
 want={r['role']:r['location'] for r in result['original']['rows']}
 row['all_buyback_panic_file_line_column_equal_original']=all(all(r['location'][k]==want[r['role']][k] for k in ('file','line','column')) for r in row['rows'])
 result['candidates'].append(row)
Path(sys.argv[-1]).write_text(json.dumps(result,indent=2)+'\n')
for row in result['candidates']:print(row['path'],row['all_buyback_panic_file_line_column_equal_original'],[(r['role'],r['location']['file'],r['location']['line'],r['location']['column']) for r in row['rows']])
