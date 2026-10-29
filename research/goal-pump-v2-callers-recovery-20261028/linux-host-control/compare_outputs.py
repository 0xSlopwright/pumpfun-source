from pathlib import Path
import hashlib,json,struct,sys,difflib
D=Path(__file__).resolve().parent;R=D.parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import score,win
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def sections(path):
 b=path.read_bytes();assert b[:6]==b'\x7fELF\x02\x01';off=struct.unpack_from('<Q',b,40)[0];ents,n,num=struct.unpack_from('<HHH',b,58);hdr=[struct.unpack_from('<IIQQQQIIQQ',b,off+i*ents)for i in range(n)];names=hdr[num];strings=b[names[4]:names[4]+names[5]];out={}
 for h in hdr:
  name=strings[h[0]:].split(b'\0',1)[0].decode();data=b[h[4]:h[4]+h[5]]if h[1]!=8 else None;out[name]={'type':h[1],'flags':h[2],'addr':h[3],'offset':h[4],'size':h[5],'link':h[6],'info':h[7],'alignment':h[8],'entry_size':h[9],'sha256':hashlib.sha256(data).hexdigest()if data is not None else None}
 return out
native=R/'best-exact-quote';linux=D/'out';rep={'scope':'Literal output/section comparison and unchanged official normalized-window scorer. No IR/object/ELF edits or added normalization. True LinuxSDK x86_64 host control versus macOS-host Linux-target-library identity recipe on frozen source.'}
rep['whole_files']={}
for name in ['unstripped.so','candidate.so']:
 a=native/name;b=linux/name;rep['whole_files'][name]={'native_sha256':sha(a),'linux_sha256':sha(b),'native_bytes':a.stat().st_size,'linux_bytes':b.stat().st_size,'literal_equal':a.read_bytes()==b.read_bytes()}
sa=sections(native/'unstripped.so');sb=sections(linux/'unstripped.so');rep['sections']=[{'name':n,'native':sa.get(n),'linux':sb.get(n),'literal_header_and_bytes_equal':sa.get(n)==sb.get(n)}for n in sorted(set(sa)|set(sb))]
a=win.Cand(native/'unstripped.so');b=win.Cand(linux/'unstripped.so');rep['selected_functions']=[]
for name,pattern,orig in [('buy_v2','6buy_v211buy_handler17h',0x13b9b8),('exact_quote','buy_exact_quote_in_handler17h',0x13f630),('sell_v2','7sell_v27execute17h',0x144508)]:
 fa=next(f for f in a.funcs if pattern in f[2]);fb=next(f for f in b.funcs if pattern in f[2]);ra=a.fn(fa[0],fa[1]);rb=b.fn(fb[0],fb[1]);na=score.normalize(ra,fa[0],a.secs);nb=score.normalize(rb,fb[0],b.secs);w=next(w for w in score.original_windows()if w['start']==orig);ot=[x[2]for x in win.insns(w['raw'],orig,win.ORIG_SECS)];bt=[x[2]for x in win.insns(rb,fb[0],b.secs)];rep['selected_functions'].append({'name':name,'original':hex(orig),'native':[hex(fa[0]),fa[1],fa[2]],'linux':[hex(fb[0]),fb[1],fb[2]],'literal_function_equal':ra==rb,'official_normalized_function_equal':na==nb,'linux_instruction_similarity_to_original':difflib.SequenceMatcher(None,ot,bt,autojunk=False).ratio()})
ns=score.score(native/'unstripped.so');ls=score.score(linux/'unstripped.so');rep['census']={'native_normalized':sum(x['normalized']for x in ns.values()),'native_raw':sum(x['raw']for x in ns.values()),'linux_normalized':sum(x['normalized']for x in ls.values()),'linux_raw':sum(x['raw']for x in ls.values()),'normalized_gains':[hex(k)for k,x in ls.items()if x['normalized']and not ns[k]['normalized']],'normalized_losses':[hex(k)for k,x in ls.items()if not x['normalized']and ns[k]['normalized']],'raw_gains':[hex(k)for k,x in ls.items()if x['raw']and not ns[k]['raw']],'raw_losses':[hex(k)for k,x in ls.items()if not x['raw']and ns[k]['raw']]};(D/'comparison.json').write_text(json.dumps(rep,indent=2)+'\n');print(json.dumps({'whole_files':rep['whole_files'],'changed_sections':[x['name']for x in rep['sections']if not x['literal_header_and_bytes_equal']],'selected_functions':rep['selected_functions'],'census':rep['census']},indent=2))
