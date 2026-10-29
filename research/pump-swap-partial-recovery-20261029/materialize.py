#!/usr/bin/env python3
"""Materialize one recorded standalone source snapshot in a new directory."""
import argparse,gzip,hashlib,io,json,tarfile
from pathlib import Path
P=Path(__file__).resolve().parent
p=argparse.ArgumentParser(description=__doc__);p.add_argument('snapshot');p.add_argument('output',type=Path);a=p.parse_args()
assert a.snapshot in json.loads((P/'CATALOG.json').read_text())['snapshots']
root=P/'snapshots'/a.snapshot;expected=json.loads((root/'snapshot.json').read_text())['source_sha256'];files={}
with tarfile.open(fileobj=io.BytesIO(gzip.decompress((root/'source.tar.gz').read_bytes())))as t:
 for m in t.getmembers():
  assert m.isfile()and not Path(m.name).is_absolute()and'..'not in Path(m.name).parts
  files[m.name]=t.extractfile(m).read()
assert {k:hashlib.sha256(v).hexdigest()for k,v in files.items()}==expected
a.output.mkdir(parents=True,exist_ok=False)
for name,raw in files.items():
 f=a.output/name;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(raw)
print(f'Materialized {len(files)} recorded source files in {a.output.resolve()}')
