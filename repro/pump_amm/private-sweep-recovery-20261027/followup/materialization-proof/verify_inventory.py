from pathlib import Path
import concurrent.futures,hashlib,json,time
W=Path(__file__).resolve().parent;I=json.loads((W/'inventory.json').read_bytes());H=Path(I['source']);D=W/'checkpoint/results';old=json.loads((H/'results/manifest.json').read_bytes());omit=I['omittable_directories'];prefixes=['new-proofs/lineage/'+n+'/'for n in omit]
expected={k:v for k,v in old.items()if not any(k.startswith(p)for p in prefixes)}
actual={str(p.relative_to(D))for p in D.rglob('*')if p.is_file()and p.name!='manifest.json'}
# Nested manifests are retained; exclude only the outer result manifest.
actual={str(p.relative_to(D))for p in D.rglob('*')if p.is_file()and p!=D/'manifest.json'}
assert actual==set(expected),(actual-set(expected),set(expected)-actual)
t0=time.monotonic()
def check(k):
 p=D/k;return k,hashlib.sha256(p.read_bytes()).hexdigest(),p.stat().st_size
with concurrent.futures.ThreadPoolExecutor(max_workers=4)as ex:rows=list(ex.map(check,sorted(expected)))
assert {k:h for k,h,n in rows}==expected
(W/'trimmed-manifest.json').write_text(json.dumps(expected,indent=2)+'\n')
report={'passed':True,'preserved_files':len(rows),'preserved_payload_bytes':sum(n for k,h,n in rows),'manifest_sha256':hashlib.sha256((W/'trimmed-manifest.json').read_bytes()).hexdigest(),'seconds':time.monotonic()-t0,'checks':'Every retained result file is byte-identical to its immutable source-manifest hash; only outer manifest awaits future resealing.'}
(W/'inventory-verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
