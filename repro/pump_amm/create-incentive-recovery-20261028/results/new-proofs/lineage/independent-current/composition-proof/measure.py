#!/usr/bin/env python3
from pathlib import Path
import collections,difflib,gzip,hashlib,importlib.util,json,struct,subprocess,sys,tempfile,types
W=Path(__file__).resolve().parent
sys.dont_write_bytecode = True
sys.path.insert(0,str(W))
from elf_reader import Elf
SHA=lambda b:hashlib.sha256(b).hexdigest()
def load(p):return json.loads(Path(p).read_bytes())
def module(name,path,**values):
 m=types.ModuleType(name);m.__file__=str(path);m.__dict__.update(values);exec(compile(Path(path).read_bytes(),str(path),'exec'),m.__dict__);return m
def index(e,s):
 x=collections.defaultdict(list)
 for f in s.funcs:x[(f['size'],e.normalized[f['start']:f['start']+f['size']],json.dumps(e.pattern(f['start'],f['size']),sort_keys=True))].append(f)
 return x
def measured(o,c,s,b,bs):
 ix,old=index(c,s),index(b,bs);rows=[];gains=[];losses=[];rg=[];rl=[]
 for a,z in zip(o.entries,o.entries[1:]+[o.hi]):
  key=(z-a,o.normalized[a:z],json.dumps(o.pattern(a,z-a),sort_keys=True));now,prior=ix[key],old[key];raw=any(o.b[a:z]==c.b[f['start']:f['start']+z-a]for f in now);before=any(o.b[a:z]==b.b[f['start']:f['start']+z-a]for f in prior);rows.append({'start':a,'end':z,'matches':now,'raw_match':raw})
  if now and not prior:gains.append(hex(a))
  if prior and not now:losses.append(hex(a))
  if raw and not before:rg.append(hex(a))
  if before and not raw:rl.append(hex(a))
 return {'candidate_sha256':SHA(c.b),'symbols_sha256':SHA(s.b),'windows':len(rows),'normalized':sum(bool(r['matches'])for r in rows),'raw':sum(r['raw_match']for r in rows),'normalized_text_bytes':sum(r['end']-r['start']for r in rows if r['matches']),'normalized_gains':gains,'normalized_losses':losses,'raw_gains':rg,'raw_losses':rl},rows
