from pathlib import Path
import gzip,hashlib,importlib.util,json,re,struct,sys
sys.dont_write_bytecode=True
R=Path.cwd();P=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('v',R/'research/pump-call-closure-673-20261029/verify.py');v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
refs=json.loads((P/'stock/reference-audit.json').read_text());m=json.loads((P/'stock/measurement.json').read_text())
images={'original':(R/'evidence/original/pump/deployed.so',0x80df8,2120),'candidate':(P/'stock/unstripped.so',m['native_target']['start'],m['native_target']['bytes'])}
for role,(p,st,size) in images.items():
 e=v.ELF(p.read_bytes());b=e.body(st,size);rows=[];i=0
 names={int(x[role+'_callee']['address'],0):x[role+'_callee']['names']for x in refs['calls']['rows']}
 while i<len(b):
  op,reg,off,imm=struct.unpack_from('<BBhi',b,i);n=16 if op==0x18 else 8
  row={'offset':i,'slot':i//8,'bytes':b[i:i+n].hex(),'op':hex(op),'dst':reg&15,'src':reg>>4,'off':off,'imm':imm}
  if op==0x85 and reg>>4==1:
   target=st+i+8+imm*8;row.update(callee=hex(target),names=names.get(target,[]))
  if op&7 in [5,6]and op not in [0x85,0x95]:row['target_offset']=i+8+off*8
  rows.append(row);i+=n
 (P/f'analysis/literal-{role}.json').write_text(json.dumps(rows,indent=2)+'\n')
 print(role,'calls',[(x['offset'],x['names'])for x in rows if 'callee'in x])
 print(role,'JA',[(x['offset'],x.get('target_offset'))for x in rows if x['op']=='0x5'])
