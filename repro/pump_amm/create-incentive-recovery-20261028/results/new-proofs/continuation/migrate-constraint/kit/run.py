#!/usr/bin/env python3
"""Run 24 signed creator cases against an explicit AMM candidate."""
from pathlib import Path
import argparse,hashlib,json,os,shutil,subprocess,sys

K=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--root',type=Path,required=True);a=p.parse_args()
    root=a.root.resolve();candidate=a.candidate.resolve();out=a.output.resolve()
    assert candidate.is_file() and not out.exists() and K not in out.parents
    inventory=json.loads((K/'input-inventory.json').read_bytes())
    assert all(sha(root/name)==digest for name,digest in inventory.items())
    out.mkdir(parents=True);shutil.copytree(K,out/'kit');kit=out/'kit';candidate_sha=sha(candidate)
    with(out/'creator.log').open('w')as log:
        result=subprocess.run([sys.executable,'-B',str(kit/'execute.py'),str(root),str(candidate),str(out)],cwd=root,env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1'},stdout=log,stderr=subprocess.STDOUT)
    assert all(sha(root/name)==digest for name,digest in inventory.items()),'Input changed during replay'
    assert candidate_sha==sha(candidate),'Candidate changed during replay'
    record={'candidate_sha256':candidate_sha,'original_sha256':inventory['evidence/original/pump_amm/deployed.so'],'inputs':inventory,'returncode':result.returncode,'files':{str(v.relative_to(out)):sha(v)for v in sorted(out.rglob('*'))if v.is_file()}}
    (out/'run.json').write_text(json.dumps(record,indent=2)+'\n')
    assert result.returncode==0,(out/'creator.log').read_text()
    raw=(kit/'verify.py').read_bytes();assert hashlib.sha256(raw).hexdigest()==record['files']['kit/verify.py']
    namespace={'__name__':'creator_replay_verifier','__file__':str(kit/'verify.py')};exec(compile(raw,str(kit/'verify.py'),'exec'),namespace)
    report=namespace['verify'](out,candidate,root);(out/'verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
if __name__=='__main__':main()
