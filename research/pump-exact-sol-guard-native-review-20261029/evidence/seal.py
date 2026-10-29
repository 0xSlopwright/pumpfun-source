from pathlib import Path
import hashlib,json
P=Path(__file__).resolve().parent;sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
files={str(q.relative_to(P)):sha(q)for q in sorted(P.rglob('*'))if q.is_file()and q.name!='EVIDENCE-MANIFEST.json'}
manifest=P/'EVIDENCE-MANIFEST.json';manifest.write_text(json.dumps(dict(files=files,scope='One native D037+buyguard source-only build; same two-load mismatch, no exact-window gain, no VM or promotion'),indent=2)+'\n')
assert all(sha(P/n)==h for n,h in files.items())
print(json.dumps(dict(status='SEALED_NEGATIVE',files=len(files),manifest_sha256=sha(manifest),handoff_sha256=sha(P/'HANDOFF.json'),receipt_sha256=sha(P/'warm/build-comparison.json'))))
