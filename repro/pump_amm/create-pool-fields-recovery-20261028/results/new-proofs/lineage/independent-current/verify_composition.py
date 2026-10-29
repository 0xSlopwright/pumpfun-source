from pathlib import Path
import hashlib,importlib.util

def H(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def verify(root):
 w=Path(root);d=w/'create-init-proof';p=d/'verify.py';s=importlib.util.spec_from_file_location('independent_final_init',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);r=m.verify(d)
 assert r['candidate_sha256']==H(w/'build/artifacts/pump_amm_recovered.so')
 assert H(d/'candidate.so')==H(w/'build/artifacts/pump_amm_recovered.so') and H(d/'symbols.so')==H(w/'build/artifacts/unstripped.so')
 assert (d/'create_pool.rs').read_bytes()==(w/'source/programs/pump-amm/src/instructions/create_pool.rs').read_bytes()
 assert (d/'state.rs').read_bytes()==(w/'source/programs/pump-amm/src/state.rs').read_bytes()
 for n in ['order60.json','order60-transactions.json.gz','create246.json','probe_order.py']:assert H(d/n)==H(w/n),n
 assert r['canonical_store_skip_restored']and r['init_parser_bodies_matched']and r['full_order_cases']==60
 return r
