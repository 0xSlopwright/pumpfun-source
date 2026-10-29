from pathlib import Path
import re,json,hashlib
R=Path(__file__).resolve().parent
MARK=re.compile(r'^# \*\*\* IR Dump (Before|After) Branch Probability Basic Block Placement \(block-placement\) \*\*\*:',re.M)
BLOCK=re.compile(r'^bb\.(\d+) \(%ir-block\.(\d+)\):',re.M)
def analyze(path):
 t=path.read_text(errors='replace');marks=list(MARK.finditer(t));records=[]
 for i,mark in enumerate(marks):
  raw=t[mark.end():marks[i+1].start() if i+1<len(marks) else len(t)]
  blocks=list(BLOCK.finditer(raw)); data=[]
  for j,b in enumerate(blocks):
   text=raw[b.end():blocks[j+1].start() if j+1<len(blocks) else len(raw)]
   pred=re.search(r'^; predecessors: (.+)',text,re.M)
   succ=re.search(r'^  successors: (.+)',text,re.M)
   ins=[x.strip() for x in text.splitlines() if x.startswith('  ') and not x.startswith('    ') and re.match(r'  (\$|JMP|JNE|JEQ|EXIT|JAL|ST|LD|MOV|ADD|SUB|AND|OR|XOR|J[A-Z])',x)]
   data.append({'machine_id':int(b.group(1)),'ir_id':int(b.group(2)),'predecessors':pred.group(1) if pred else None,'successors':succ.group(1) if succ else None,'instructions':ins})
  reloads=[x for x in data if len(x['instructions'])==2 and x['instructions'][0]=='$r6 = LDD_V1 $r10, -1304' and x['instructions'][1].startswith('JMP')]
  records.append({'stage':mark.group(1),'blocks':len(data),'order':[x['ir_id'] for x in data],'pure_reload_stubs':reloads,'selected_nodes':[x for x in data if x['ir_id'] in (432,444,451,453,464,471,541)]})
 return {'path':str(path.relative_to(R)),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'snapshots':records}
records=[analyze(p) for p in sorted(R.glob('*/compiler.log'))]
(R/'trace-summary.json').write_text(json.dumps(records,indent=2)+'\n')
for row in records:
 print(row['path'],[(x['stage'],x['blocks'],[(n['machine_id'],n['ir_id'],n['predecessors']) for n in x['pure_reload_stubs']]) for x in row['snapshots']])
