from pathlib import Path
import sys,re,json,struct
H=Path("/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness");sys.path.insert(0,str(H));import win,score
R=Path(__file__).resolve().parent;BASE=R.parent/"goal-pump-recovery-20261028"
source=(BASE/"programs/pump/src/lib.rs").read_text();enum=source[source.index("pub enum PumpError"):];enum=enum[:enum.index("}")];names=re.findall(r"^\s*([A-Z]\w*)\s*(?:=\s*\d+)?\s*,",enum,re.M)
base=win.Cand(BASE/"current-parent/unstripped.so");census=score.score(base.path);orig_names={k:win.demangle(v['symbols'][0])if v['symbols']else hex(k)for k,v in census.items()}
rows={}
for label,path,original in [("original",H.parent/"base/original.so",True),("canonical",base.path,False)]+[(x.name.removesuffix("-out"),x/"unstripped.so",False)for x in sorted(R.glob("*-out"))if(x/"unstripped.so").exists()]:
 c=win.Cand(path);fmap={a:win.demangle(nm)for a,n,nm in c.funcs}
 if original:a,n=0x22a10,27400;fmap=orig_names
 else:a,n,nm=next(f for f in c.funcs if re.search(r"admin_cto::execute$",win.demangle(f[2])))
 ds=win.objdump_text(path,a,a+n);events=[];reg2=None;raw=c.fn(a,n)
 for at,text in ds.items():
  m=re.match(r"lddw r2, (0x[0-9a-f]+)$",text)
  if m:reg2=int(m[1],16)
  if not text.startswith("call "):continue
  i=at-a;op,rs,off,imm=struct.unpack_from("<BBhi",raw,i);target=at+8+imm*8;name=fmap.get(target,"external"if imm==-1 else hex(target))
  info={"offset":hex(i),"target":hex(target),"callee":name}
  if "PumpError::name"in name:
   num=struct.unpack_from("<I",c.blob,reg2)[0]if reg2 is not None and reg2+4<=len(c.blob)else None
   info.update({"enum_constant_pointer":hex(reg2)if reg2 else None,"enum_discriminant":num,"variant":names[num]if num is not None and num<len(names)else None})
  events.append(info);reg2=None
 selected=[]
 for i,e in enumerate(events):
  if "PumpError::name"not in e['callee']:continue
  following=events[i+1:];fmt=next((x for x in following if "fmt::Display"in x['callee']or"ToString"in x['callee']or"outline_error_message"in x['callee']),None);selected.append(e|{"formatting":fmt})
 rows[label]=selected
(R/"error-formatting-sites.json").write_text(json.dumps(rows,indent=2)+"\n")
for key,es in rows.items():print(key,[(e['variant'],e['formatting']['callee'].split('::')[-1]if e['formatting']else None)for e in es])
