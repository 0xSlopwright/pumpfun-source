from pathlib import Path
import ast,collections,hashlib,json,re,shutil,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;sys.path.insert(0,str(R/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf

def extract(text,pattern):
 m=re.search(pattern,text,re.S);assert m,pattern
 return ast.literal_eval('['+re.sub(r'//[^\n]*','',m.group(1))+']')
def tables(files):
 out=[];u=files['unicode_data.rs'].read_text();section=u[u.index('pub mod grapheme_extend {'):];section=section[:section.index('\n#[rustfmt::skip]')]if'\n#[rustfmt::skip]'in section else section
 for name,kind in [('SHORT_OFFSET_RUNS','u32'),('OFFSETS','u8')]:
  v=extract(section,r'static '+name+r':\s*\['+kind+r';\s*\d+\]\s*=\s*\[(.*?)\];');b=b''.join(struct.pack('<I',x)for x in v)if kind=='u32'else bytes(v);out.append({'name':'grapheme_extend::'+name,'source':'unicode_data.rs','kind':kind,'elements':len(v),'payload':b,'consumer':'grapheme_extend'})
 p=files['printable.rs'].read_text()
 for name in ['SINGLETONS0U','SINGLETONS0L','SINGLETONS1U','SINGLETONS1L','NORMAL0','NORMAL1']:
  v=extract(p,r'const '+name+r':.*?=\s*&\[(.*?)\];');b=bytes(x for pair in v for x in pair)if name.endswith('U')else bytes(v);out.append({'name':'printable::'+name,'source':'printable.rs','kind':'(u8,u8)'if name.endswith('U')else'u8','elements':len(v),'payload':b,'consumer':'unicode9printable'})
 v=extract(files['validations.rs'].read_text(),r'const UTF8_CHAR_WIDTH:.*?=\s*&\[(.*?)\];');out.append({'name':'str::UTF8_CHAR_WIDTH','source':'validations.rs','kind':'u8','elements':len(v),'payload':bytes(v),'consumer':'from_utf8'});return out

def run():
 sdk=R/'work/amm-linux-v144-20261027/sdk/rust/lib/rustlib/src/rust/library/core/src';dest=W/'inputs';dest.mkdir(exist_ok=True)
 for name,folder in [('unicode_data.rs','unicode'),('printable.rs','unicode'),('validations.rs','str')]:
  if not(dest/name).exists():shutil.copy2(sdk/folder/name,dest/name)
 files={n:dest/n for n in ['unicode_data.rs','printable.rs','validations.rs']};o=Elf(R/'evidence/original/pump_amm/deployed.so');c=Elf(R/'work/amm-fifth-wave-build-worker-20261027/build/artifacts/pump_amm_recovered.so');inv=json.loads((W/'inventory.json').read_bytes());result=[]
 for table in tables(files):
  b=table.pop('payload');matches=[]
  for row in inv['rows']:
   if not any(table['consumer']in n for n in row['candidate_names']):continue
   a,q=row['original_pointer'],row['candidate_pointer']
   if o.b[a:a+len(b)]==b and c.b[q:q+len(b)]==b:matches.append({k:row[k]for k in ['original','candidate','offset','original_pointer','candidate_pointer','candidate_names']})
  assert matches,(table['name'],len(b));result.append(table|{'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'references':matches,'original_unique_pointers':sorted({x['original_pointer']for x in matches}),'candidate_unique_pointers':sorted({x['candidate_pointer']for x in matches})})
 out={'source_sha256':{n:hashlib.sha256(p.read_bytes()).hexdigest()for n,p in files.items()},'tables':result,'table_count':len(result),'bytes':sum(r['bytes']for r in result),'reference_observations':sum(len(r['references'])for r in result),'scope':'Matching full serialized arrays from hashed local SDK source and actual original/candidate relocated consumers; not whole-data-segment identity.'};(W/'tables.json').write_text(json.dumps(out,indent=2)+'\n');print({k:v for k,v in out.items()if k not in ['tables','source_sha256']});print([(r['name'],r['bytes'])for r in result])
if __name__=='__main__':run()
