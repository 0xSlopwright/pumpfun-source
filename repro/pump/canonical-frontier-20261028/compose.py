#!/usr/bin/env python3
"""Materialize a precise additive Pump frontier; no compiler or Git mutation."""
from pathlib import Path
import argparse,difflib,hashlib,io,json,re,sys,tarfile
if not __debug__:raise SystemExit('Optimized Python is unsupported; run without -O.')
P=Path(__file__).resolve().parent;R=P.parents[2]
sha=lambda b:hashlib.sha256(b).hexdigest()
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--output',type=Path,required=True);parser.add_argument('--report',type=Path,required=True);parser.add_argument('--patch-output',type=Path,required=True);args=parser.parse_args()
base=R/'research/pump-semantic-union-20261028';result=json.loads((base/'RESULT.json').read_text())
files={name:(base/'source'/name).read_bytes()for name in result['source_sha256']}
assert len(files)==67 and {n:sha(b)for n,b in files.items()}==result['source_sha256']
initial=files.copy();operations=[]
def patch(packet,expected):
 raw=(packet/'source.patch').read_bytes();assert sha(raw)==expected
 lines=raw.decode().splitlines(keepends=True);i=0;applied=[]
 while i<len(lines):
  assert lines[i].startswith('--- a/');name=lines[i][6:].strip();i+=1;assert lines[i]=='+++ b/'+name+'\n';i+=1
  if name not in files:name='programs/pump/'+name
  source=files[name].decode().splitlines(keepends=True)
  while i<len(lines)and not lines[i].startswith('--- a/'):
   match=re.fullmatch(r'@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@[^\n]*\n',lines[i]);assert match,lines[i];i+=1;old=[];new=[]
   while i<len(lines)and not lines[i].startswith(('@@','--- a/')):
    line=lines[i];assert line[:1]in' +-';i+=1
    if line[0]in' -':old.append(line[1:])
    if line[0]in' +':new.append(line[1:])
   assert len(old)==int(match[2]or 1)and len(new)==int(match[4]or 1)
   locations=[q for q in range(len(source)-len(old)+1)if source[q:q+len(old)]==old]
   assert len(locations)==1,(name,locations)
   at=locations[0];source[at:at+len(old)]=new;applied.append({'path':name,'declared_old_line':int(match[1]),'actual_old_line':at+1,'old_lines':len(old),'new_lines':len(new)})
  files[name]=''.join(source).encode()
 operations.append({'packet':str(packet.relative_to(R)),'patch_sha256':expected,'hunks':applied})
# L36 select_fees was already replaced by two active get_fees sites in569.
# Port the same direct account type boundary to those actual uses, without restoring dead code.
direct=R/'research/pump-direct-route-fee-config-20261028/source.patch'
assert sha(direct.read_bytes())=='74a77f00e42957e8aee9f92da421af6044ab6ed76f31c2e76ae886af9084ca01'
replacements={
 'programs/pump/src/multi_hop_curve_swap.rs':[
  ('bump=fee_config.0.bump,seeds::program=FEES)]pub fee_config:Box<Account<\'info,RouteFeeConfig>>','bump=fee_config.bump,seeds::program=FEES)]pub fee_config:Box<Account<\'info,crate::pump_fees::accounts::FeeConfig>>',1),
  ('fee_config: &FeeConfig, fee_config_len: usize','fee_config: &crate::pump_fees::accounts::FeeConfig, fee_config_len: usize',1),
  ('&a.fee_config.0','&a.fee_config',3)],
 'programs/pump/src/trade_v3.rs':[
  ('bump=fee_config.0.bump','bump=fee_config.bump',1),
  ('crate::multi_hop_curve::RouteFeeConfig','crate::pump_fees::accounts::FeeConfig',1),
  ('&a.fee_config.0','&a.fee_config',1)],
 'programs/pump/src/util/fee.rs':[
  ('use crate::trade_types::{BondingCurve,FeeConfig,FeeTier};','use crate::{trade_types::{BondingCurve,FeeTier},pump_fees::accounts::FeeConfig};',1)]}
for name,items in replacements.items():
 text=files[name].decode()
 for old,new,count in items:assert text.count(old)==count,(name,old,text.count(old));text=text.replace(old,new)
 files[name]=text.encode()
operations.append({'packet':'research/pump-direct-route-fee-config-20261028','qualified_patch_sha256':sha(direct.read_bytes()),'adaptation':'Nine current active use-site lines: old select_fees no longer exists; both real get_fees calls use the generated account directly. Keep local manual FeeConfig type and read_config unchanged.','replacements':replacements})
patch(R/'research/pump-v3-buy-cost-overflow','52bc3a015859bf4a34d90747984f327917336b90e91c56710462c7cb80922d2e')
patch(R/'research/pump-cashback-validation-order-20261028','aa33c47dca0a16a0f964de2bf6d038d65dd8f0ad3a470ebc0201a54a81c7bb85')
arc=R/'research/pump-admin-shared-holder-guard-20261028/source.tar.gz';assert sha(arc.read_bytes())=='43fe18b168dc51b62fd306918062d87918b4e16b5dba44961e926b5fda0ccaa5'
with tarfile.open(fileobj=io.BytesIO(arc.read_bytes()),mode='r:gz')as t:
 n='programs/pump/src/creator/admin_cto.rs';data=t.extractfile(n).read();assert len(data.splitlines())==775;files[n]=data
operations.append({'packet':'research/pump-admin-shared-holder-guard-20261028','source_archive_sha256':sha(arc.read_bytes()),'path':n,'output_sha256':sha(data),'includes':'PR595 Source records plus PR619 destination/frozen-vault validation order'})
shared=R/'research/pump-shared-buyback-panic-20261028/source.patch'
assert sha(shared.read_bytes())=='e316dc8c3e1e7135964fbe874a5e9fcdeadaff3d121d8308ea26f4a09e07c9ff'
items={
 'programs/pump/src/lib.rs':[
  ('fn protocol_fee_split(global: &Global, protocol_fee: u64, is_mayhem_mode: bool)','fn protocol_fee_split(buyback_basis_points: u64, protocol_fee: u64, is_mayhem_mode: bool)',1),
  ('let scaled = global.buyback_basis_points as u128 * protocol_fee as u128 / 10000;','let scaled = buyback_basis_points as u128 * protocol_fee as u128 / 10000;',1),
  ('protocol_fee_split(global,protocol_fee,self.is_mayhem_mode)','protocol_fee_split(global.buyback_basis_points,protocol_fee,self.is_mayhem_mode)',1),
  ('protocol_fee_split(global, protocol_fee, is_mayhem_mode)','protocol_fee_split(global.buyback_basis_points, protocol_fee, is_mayhem_mode)',1)],
 'programs/pump/src/trade_v3.rs':[
  ('v3_buyback_split(protocol_fee,buyback_bps).0','crate::protocol_fee_split(buyback_bps,protocol_fee,is_mayhem!=0).0',1),
  ('v3_buyback_split(p.fees.protocol_fee,buyback_bps).0','crate::protocol_fee_split(buyback_bps,p.fees.protocol_fee,is_mayhem!=0).0',1)]}
for name,changeset in items.items():
 text=files[name].decode()
 for old,new,count in changeset:assert text.count(old)==count,(name,old,text.count(old));text=text.replace(old,new)
 files[name]=text.encode()
operations.append({'packet':'research/pump-shared-buyback-panic-20261028','pr_head':'b79152657b12576eafe690b7b38bd99d70d17e6a','qualified_patch_sha256':sha(shared.read_bytes()),'adaptation':'Preserve qualified588 byte-valued mayhem ABI and Source371/375/382; call the real shared scalar helper with is_mayhem!=0 inside existing is_mayhem==0 branch. Boolean semantics and evaluation order preserved. Requalify focused20 panic and6 overflow cases on final image.','replacements':items})
patch(R/'research/pump-create-rejected-quote-keys-20261028','22998a6e832f635cd45b2884a2df42adbb16d5547126e5b66202291306f9e219')
out=args.output.resolve() 
assert not out.exists()
for n,b in files.items():q=out/n;q.parent.mkdir(parents=True,exist_ok=True);q.write_bytes(b)
changes={n:{'base_sha256':sha(initial[n]),'proposal_sha256':sha(b)}for n,b in files.items()if b!=initial[n]}
report={'scope':'PR569 semantic union plus direct generated FeeConfig typing, PR588, PR570, PR595+619, PR627 and PR616; no speculative helper-trial source','base_packet':'research/pump-semantic-union-20261028','base_source_sha256':result['source_sha256'],'source_sha256':{n:sha(b)for n,b in files.items()},'operations':operations,'changed_from_569':changes,'source_conflicts':[],'not_copied_wholesale':['L41 source: regresses previously qualified PR538/563/567 semantics; retain additive corrections instead','PR626 repeats PR560/566 already present in569; no duplicate patch'],'whole_elf_equal':False,'goal_complete':False}
args.report.write_text(json.dumps(report,indent=2)+'\n')
patchtext=''
for n in sorted(changes):patchtext+=''.join(difflib.unified_diff(initial[n].decode().splitlines(True),files[n].decode().splitlines(True),fromfile='a/'+n,tofile='b/'+n))
args.patch_output.write_text(patchtext)
print(json.dumps({'source_files':len(files),'changed_paths':list(changes),'operations':len(operations),'conflicts':[]},indent=2))
