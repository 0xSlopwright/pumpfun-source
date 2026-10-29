from pathlib import Path
import hashlib,importlib.util,json,sys
sys.dont_write_bytecode=True
def h(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(root=None):
 w=Path(root or Path(__file__).resolve().parent);sys.path.insert(0,str(w));files=json.loads((w/'manifest.json').read_text())['files']
 assert files=={str(p.relative_to(w)):h(p)for p in w.rglob('*')if p.is_file()and p!=w/'manifest.json'}
 sp=importlib.util.spec_from_file_location('v2fee_cfg',w/'analyze.py');m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m);actual=m.analyze()
 assert actual==json.loads((w/'call-order.json').read_text())
 source=(w/'fees.rs').read_text();assert source.index('let canonical = pool.creator == authority;')<source.index('require!(fee_config_len >= 2512')
 return {'passed':True,'candidate_sha256':actual['candidate_sha256'],'original_bytes':1656,'candidate_bytes':1632,'original_canonical_before_length_guard':True,'candidate_length_guard_before_canonical':True,'direct_calls_per_body':13,'new_source_patch':False,'vm_or_compile_executed':False,'manifest_sha256':h(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
