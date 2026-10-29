from pathlib import Path
import hashlib,importlib.util

def H(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def verify(root):
 w=Path(root);p=w/'composition-proof/verify.py';s=importlib.util.spec_from_file_location('independent_compact_composition',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);r=m.verify(w/'composition-proof')
 assert r['candidate_sha256']==H(w/'build/artifacts/pump_amm_recovered.so')
 for name in ['pump_amm_recovered.so','unstripped.so']:assert H(w/'build/artifacts'/name)==H(w/'composition-proof/build/artifacts'/name)
 return r
