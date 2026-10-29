from pathlib import Path
import argparse,hashlib,json,struct
W=Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('original',type=Path);a=p.parse_args();b=a.original.read_bytes();d=json.loads((W/'static-evidence.json').read_text())
assert hashlib.sha256(b).hexdigest()==d['original_sha256'];start=int(d['handler_start'],16);n=d['handler_bytes'];assert b[start:start+n].hex()==d['raw_handler_hex']
for c in d['calls']:
 at=start+c['offset'];assert b[at:at+2]==b'\x85\x10';assert at+8+struct.unpack_from('<i',b,at+4)[0]*8==c['target']
assert b[0x11c6b6:0x11c6b6+25].hex()==d['account_name_pieces']['bytes']
assert b[0x196a8:0x196b0]==bytes.fromhex('71612a0000000000')
print(json.dumps({'verified_original_bytes':True,'handler':'0x19138','bytes':n,'executes_runtime':False}))
