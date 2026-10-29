from pathlib import Path
import hashlib,importlib.util

def verify(root):
 w=Path(root);p=w/'incentive700/verify.py';s=importlib.util.spec_from_file_location('current700',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
 return m.verify(w/'incentive700',w/'build/artifacts/pump_amm_recovered.so',repository_root=w/'runtime-inputs')
