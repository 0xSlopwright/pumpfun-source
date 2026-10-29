#!/usr/bin/env python3
"""Five isolated deep rejection controls; preserve all original compiler/runtime receipts."""
from pathlib import Path
import gzip, hashlib, importlib.util, io, json, shutil, tarfile, tempfile
P=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('successor_deep_checks',P/'verify.py')
v=importlib.util.module_from_spec(spec); spec.loader.exec_module(v)
sha=lambda b:hashlib.sha256(b).hexdigest()
def ignored(directory,names):
    directory=Path(directory)
    if directory==P/'builds/cold-01': return [n for n in names if n in ('source','profile-sdk')]
    return [n for n in names if n=='__pycache__']
def rejects(name,mutation,check):
    with tempfile.TemporaryDirectory(prefix='pump-accrual-control-') as temp:
        target=Path(temp)/'packet'; shutil.copytree(P,target,ignore=ignored); v.P=target
        mutation(target)
        try: check()
        except (ValueError,KeyError): return {'name':name,'rejected':True}
        finally: v.P=P
        raise ValueError('Accepted mutation: '+name)
def source(path):
    p=path/'source/src/multi_hop_curve_swap.rs'; p.write_bytes(p.read_bytes()+b'\n')
def compiled(path):
    p=path/'builds/primary/compiled-workspace.tar.gz'; values=v.archive(p)
    values['programs/pump/src/multi_hop_curve_swap.rs']+=b'\n'; out=io.BytesIO()
    with tarfile.open(fileobj=out,mode='w') as t:
        for n,b in values.items():
            m=tarfile.TarInfo(n); m.size=len(b); t.addfile(m,io.BytesIO(b))
    p.write_bytes(gzip.compress(out.getvalue(),mtime=0))
def image(path):
    p=path/'builds/cold-01/candidate.so'; raw=bytearray(p.read_bytes()); raw[-1]^=1; p.write_bytes(raw)
def source_log(path):
    p=path/'runtime/full44.json.gz'; report=v.doc(p)
    def change(value):
        if isinstance(value,dict):
            if isinstance(value.get('original'),dict) and isinstance(value.get('candidate'),dict):
                for k,rows in value['candidate'].items():
                    if 'log' in k.lower() and isinstance(rows,list):
                        for i,line in enumerate(rows):
                            if isinstance(line,str) and '.rs:' in line:
                                rows[i]=line.replace('.rs:','.rs:1',1); return True
            return any(change(x) for x in value.values())
        return isinstance(value,list) and any(change(x) for x in value)
    if not change(report['suites']): raise ValueError('No actual Source log to mutate')
    p.write_bytes(gzip.compress(json.dumps(report).encode(),mtime=0))
def allocation(path):
    d=path/'runtime/captured-create-supplement'; p=d/'loader.json'; record=v.doc(p)
    record['loads'][0]['programdata_sha256']='0'*64
    p.write_text(json.dumps(record,indent=2)+'\n')
    execution=v.doc(d/'execution.json'); execution['loader_sha256']=sha(p.read_bytes())
    (d/'execution.json').write_text(json.dumps(execution,indent=2)+'\n')
def main():
    candidate=v.doc(P/'build-inputs.json')['comparison']['candidate_sha256']
    v.source_and_builds(); v.verify_full44(candidate); v.captured_create(candidate)
    results=[rejects('maintained source drift',source,lambda:v.source_and_builds()),
             rejects('compiled archive/source graft',compiled,lambda:v.source_and_builds()),
             rejects('cold literal ELF drift',image,lambda:v.source_and_builds()),
             rejects('original Source-coordinate change',source_log,lambda:v.verify_full44(candidate)),
             rejects('captured allocation digest with resealed execution',allocation,lambda:v.captured_create(candidate))]
    print(json.dumps(dict(positive_checks=True,deep_controls=results),indent=2))
if __name__=='__main__': main()
