"""Deterministic byte-level envelope/TLV corpus, independent of the candidate parser."""
from pathlib import Path
import base64,hashlib,json,random,struct
W=Path(__file__).resolve().parent;R=W.parents[1];fixture=R/'research/imported-lab/analysis/pump_fun/amm-v2-trade-fixture.json';f=json.loads(fixture.read_text());mint=base64.b64decode(f['accounts']['quote_mint']['data_base64'])[:82];prefix=mint+bytes(83)+b'\1';MAX=(1<<64)-1
cfg=lambda old=(0,1000,100),new=(1,2000,200):bytes(72)+struct.pack('<QQH',*old)+struct.pack('<QQH',*new)
def tlv(k,p,declared=None):return struct.pack('<HH',k,len(p)if declared is None else declared)+p
F=tlv(1,cfg());rows=[]
def add(group,label,data,epoch=0,limits=(1,MAX),route='buy_exact_quote_in_v2',amount=None):
 for limit in limits:
  rows.append({'case':label+('-limit-max'if limit==MAX else'-limit-one'),'group':group,'mint_data_hex':data.hex(),'epoch':epoch,'instruction':route,'amount':amount if amount is not None else(10**7 if route=='buy_exact_quote_in_v2'else 10**10),'limit':limit})
# Absolute size frontiers include the classic-mint and multisig-size collisions.
for n in [0,1,80,81,82,84,163,171,172,173,273,274,275,276,277,278,279,354,355,356,357]:
 add('absolute-size',f'total-{n}',(prefix+F)[:n].ljust(n,b'\0'))
for n in [354,355,356,357,511,512,513,1024]:
 tail=tlv(7,bytes(max(0,n-len(prefix)-len(F)-4)))+F;assert len(prefix+tail)==n
 add('absolute-size-valid-tlv',f'valid-total-{n}',prefix+tail)
# Independent declared/actual sizes, including values larger than an account.
for declared in [0,1,2,71,72,89,90,107,108,109,255,256,65535]:
 for actual in [0,1,2,107,108,109,255]:
  payload=cfg()[:actual].ljust(actual,b'\xa5')
  add('fee-span',f'fee-declared-{declared}-actual-{actual}',prefix+tlv(1,payload,declared))
# Skip arbitrary extension IDs/contents on either side of the fee extension.
for kind in [2,3,4,17,25,26,27,256,65535]:
 for length in [0,1,2,7,32]:
  value=bytes((i*17+165)&255 for i in range(length));U=tlv(kind,value)
  for where,tail in [('before',U+F),('after',F+U),('without-fee',U)]:add('unknown-kind',f'unknown-{kind}-len-{length}-{where}',prefix+tail)
# Terminators and partial headers are tested before and after a valid fee.
for tail in [b'',b'\0',b'\1',b'\xff',b'\0\0',b'\0\0\xff',b'\0\0\xff\xff',b'\0\0'+F,b'\0\0'+b'\xff'*17,b'\x02\0',b'\x02\0\0',b'\x02\0\1',b'\1\0',b'\1\0\0',b'\1\0\xff']:
 for where,data in [('before',prefix+tail+F),('after',prefix+F+tail),('without-fee',prefix+tail)]:add('terminator-partial',f'{where}-tail-{tail.hex()}',data)
# Duplicate fee payloads, unknown duplicates, and hidden fee-looking payload bytes.
for a in [F,tlv(1,cfg(old=(0,999,321))),tlv(1,cfg()[:107]),tlv(1,b''),tlv(1,cfg()+b'\0')]:
 for between in [b'',tlv(9,b'ignored'),b'\0\0']:
  add('duplicates',f'dup-{len(a)}-{hashlib.sha256(a+between).hexdigest()[:8]}',prefix+F+between+a)
for kind in [2,25,65535]:
 add('unknown-duplicate',f'dup-unknown-{kind}',prefix+tlv(kind,b'1')+F+tlv(kind,b'2'))
 add('embedded-headers',f'nested-fee-{kind}',prefix+tlv(kind,F+b'\0\0')+F)
# Every declared span is honored, and padding does not become a nested TLV.
for n in [127,255,256,1024,4096,65535]:
 for where,tail in [('before',tlv(65534,b'\xa5'*n)+F),('after',F+tlv(65534,b'\xa5'*n))]:add('large-unknown',f'large-{n}-{where}',prefix+tail,limits=(MAX,))
for offset in [82,83,100,128,163,164,165]:
 for value in [1,2,255]:
  raw=bytearray(prefix+F);raw[offset]=value;add('envelope-byte',f'envelope-{offset}-{value}',bytes(raw))
# Fee epoch selection crosses equality and u64 boundaries on all three routes.
for newer_epoch in [0,1,2,5,2**32,MAX]:
 for epoch in sorted({max(0,newer_epoch-1),newer_epoch,min(MAX,newer_epoch+1)}):
  for route in ['buy_exact_quote_in_v2','buy_v2','sell_v2']:
   data=prefix+tlv(1,cfg(old=(MAX,111,37),new=(newer_epoch,2222,777)))
   add('epoch-selection',f'epoch-{epoch}-new-{newer_epoch}-{route}',data,epoch,limits=((MAX,)if route=='buy_v2'else(1,)),route=route,amount=10**7 if route=='buy_exact_quote_in_v2'else 10**10)
for bps in [0,1,9999,10000,10001,65535]:
 for cap in [0,1,MAX]:
  add('fee-limits',f'bps-{bps}-cap-{cap}',prefix+tlv(1,cfg(old=(0,cap,bps),new=(MAX,222,99))))
# Deterministic localized mutations of a well-formed two-extension stream.
rng=random.Random(2026102701);base=prefix+tlv(7,b'abcd')+F+tlv(65534,b'z')
for i in range(48):
 raw=bytearray(base);off=rng.choice([166,167,168,169,174,175,176,177,246,254,262,264,len(raw)-5,len(raw)-4,len(raw)-3,len(raw)-2]);raw[off]^=1<<rng.randrange(8);add('seeded-header-payload-mutation',f'mutation-{i}-offset-{off}',bytes(raw))
assert len({r['case']for r in rows})==len(rows)
out={'scope':__doc__,'seed':2026102701,'fixture_path':str(fixture.relative_to(R)),'fixture_sha256':hashlib.sha256(fixture.read_bytes()).hexdigest(),'mint_base_sha256':hashlib.sha256(mint).hexdigest(),'case_count':len(rows),'cases':rows};(W/'roster.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps({'case_count':len(rows),'groups':{g:sum(x['group']==g for x in rows)for g in sorted({x['group']for x in rows})}},indent=2))
