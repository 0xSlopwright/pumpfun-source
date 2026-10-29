"""Verify the portable fifth-candidate replay without VM execution."""
from pathlib import Path
import hashlib,json,runpy
P=Path(__file__).resolve().parent
files=lambda:{str(p.relative_to(P)):hashlib.sha256(p.read_bytes()).hexdigest()for p in P.rglob('*')if p.is_file()and p!=P/'manifest.json'}
m=json.loads((P/'manifest.json').read_text());assert files()==m['files']
runpy.run_path(str(P/'replay/verify_replay.py'),run_name='__main__')
assert files()==m['files']
