from pathlib import Path
import importlib.util,json,time,statistics
R=Path(__file__).resolve().parents[2]
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
old=module('old_captured_loader',R/'scripts/pump_captured_loader.py');new=module('new_captured_loader',Path(__file__).with_name('pump_captured_loader.py'))
files=[R/'evidence/original/pump/deployed.so',R/'repro/pump/main-contract-round13-20261027/candidate.so'];rows=[]
for repeat in range(3):
 for label,m in [('old',old),('new',new)]:
  start=time.perf_counter();m.LOADS.clear()
  for i in range(8):
   vm=m.CapturedLiteSVM().with_sigverify(True)
   vm.add_program_from_file(m.PROGRAM,files[i%2])
   data=vm.get_account(m.PROGRAMDATA)
   assert len(data.data)==10485760
  rows.append({'repeat':repeat,'loader':label,'seconds':time.perf_counter()-start,'loads':list(m.LOADS)})
for i in range(0,len(rows),2):assert rows[i]['loads']==rows[i+1]['loads']
# Both implementations must reject corruption in any region after loading.
from solders.account import Account
from solders.clock import Clock
from solders.pubkey import Pubkey
controls=[]
for mutation in ['header','prefix','tail','owner','program']:
 for label,m in [('old',old),('new',new)]:
  class Fake(m.CapturedLiteSVM):
   def __init__(self):self.accounts={};self.clock=Clock(0,0,0,0,0)
   def get_clock(self):return self.clock
   def warp_to_slot(self,slot):pass
   def set_clock(self,clock):self.clock=clock
   def set_account(self,key,value):self.accounts[key]=value
   def get_account(self,key):
    v=self.accounts.get(key)
    if v is None:return None
    b=bytearray(v.data);owner=v.owner
    if key==m.PROGRAMDATA:
     if mutation in ['header','prefix','tail']:b[{'header':0,'prefix':50,'tail':len(b)-1}[mutation]]^=1
     if mutation=='owner':owner=Pubkey.default()
    if key==m.PROGRAM and mutation=='program':b[0]^=1
    return Account(v.lamports,bytes(b),owner,v.executable)
  rejected=False
  try:Fake()._add_captured_pump(files[1].read_bytes(),str(files[1]))
  except AssertionError:rejected=True
  assert rejected,(label,mutation);controls.append({'loader':label,'mutation':mutation,'rejected':True})
summary={name:statistics.median([x['seconds']for x in rows if x['loader']==name])for name in ['old','new']};out={'median_seconds_for_eight_loads':summary,'speed_ratio':summary['old']/summary['new'],'byte_receipts_identical':True,'full_actual_image_equality_checked_every_load':True,'negative_controls':controls,'runs':rows};Path(__file__).with_name('benchmark.json').write_text(json.dumps(out,indent=2)+'\n');print({k:v for k,v in out.items()if k not in ['negative_controls','runs']})
