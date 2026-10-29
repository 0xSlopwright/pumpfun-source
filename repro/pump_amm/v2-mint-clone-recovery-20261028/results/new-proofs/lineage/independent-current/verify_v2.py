from pathlib import Path
import hashlib,importlib.util
H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def load(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m

def verify(root):
 w=Path(root);p=w/'v2-ownership-proof';assert H(p/'manifest.json')=='2c681b46dae55a358a34713b207bc993ec3aec0624446635fd0e7f91d304be64'
 result=load('current_v2_ownership',p/'verify.py').verify(p);assert result['candidate_sha256']==H(w/'build/artifacts/pump_amm_recovered.so')
 a=w/'allocation-proof';assert H(a/'manifest.json')=='f3f6f90f7ef55898da9ab6f433988bed7dd1be29e29c06650f8f0243ccd01ebc';allocation=load('current_allocation',a/'verify.py').verify(a);assert allocation['candidate_sha256']==result['candidate_sha256']and allocation['equal_allocation_control_mismatches']==0
 return {'passed':True,'candidate_sha256':result['candidate_sha256'],'ownership':result,'allocation':allocation,'scope':'Current isolated proof uses the identical dbb5 artifact and saved870+174 cases; current allocation control contains fresh48pairs. No VM/build and no broad compute equivalence claim.'}
