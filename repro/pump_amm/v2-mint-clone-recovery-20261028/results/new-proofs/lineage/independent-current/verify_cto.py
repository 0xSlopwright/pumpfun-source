from pathlib import Path
import importlib.util,json,sys
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def verify(root):
 w=Path(root);a=module('current_cto22',w/'cto-current22/verify.py').verify(w/'cto-current22',expected_bad=0);b=module('current_cto19',w/'cto-proof/verify.py').verify(w/'cto-proof')
 digest=__import__('hashlib').sha256((w/'build/artifacts/pump_amm_recovered.so').read_bytes()).hexdigest()
 assert b['candidate_sha256']==digest and a['captured_cases']+a['synthetic_cases']==22 and b['cases']==19 and a['synthetic_mismatches']==b['mismatches']==0
 return {'candidate_sha256':digest,'direct_and_captured':a,'retained':b,'cases':41,'signatures':a['signature_fields']+b['signatures'],'mismatches':0}
