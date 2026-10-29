from pathlib import Path
import importlib.util,json,re,hashlib
R=Path(__file__).resolve().parent;P=R.parent;repo=P.parents[1]
spec=importlib.util.spec_from_file_location('measure',P/'tools/measure.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 expected='16d67698a423e6e5cfeb5d9c2906a708b9ee983b997b0395b14ad84f7db77163'
 for name in ['ownerwrite-trace','ata-write-unlikely-early-ir','ata-write-unlikely-pre-lower-expect']:
  assert sha(R/name/'symbols.so')==expected,name
 before=(R/'ata-write-unlikely-pre-lower-expect/compiler.log').read_text()
 after=(R/'ata-write-unlikely-early-ir/compiler.log').read_text()
 assert 'IR Dump Before LowerExpectIntrinsicPass' in before
 assert '%562 = call i1 @llvm.expect.i1(i1 %561, i1 false)' in before
 for needle in ['%563 = zext i1 %562 to i8','store i8 %563, ptr %13','%564 = load i8, ptr %13','%565 = trunc i8 %564 to i1','br i1 %565, label %569, label %567']:
  assert needle in before,needle
 assert before.count('llvm.expect')==2 and after.count('llvm.expect')==0
 assert '!prof' not in after and 'branch_weights' not in after
 assert len(re.findall(r'^; \*\*\* IR Dump',after,re.M))==13
 rows=[]
 original=repo/'evidence/original/pump_amm/deployed.so'
 assert sha(original)=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
 for item in json.loads((R/'intrinsic-results.json').read_text()):
  path=R/item['name']/'symbols.so'; measured=m.measure(original,path)
  assert measured==json.loads(path.with_name('rows.json').read_text())
  assert sha(path)==item['sha256']
  assert sum(bool(x['match']) for x in measured)==779
  assert not next(x for x in measured if x['original']=='0x4c750')['match']
  rows.append({'name':item['name'],'normalized':779,'raw':sum(x['raw'] for x in measured),'sell_matched':False,'sha256':sha(path)})
 print(json.dumps({'passive_outputs_identical':True,'pre_lower_expect_calls':2,'post_lower_expect_calls':0,'post_lower_profile_metadata':0,'early_ir_snapshots':13,'controls':rows,'new_matched_windows':0},indent=2))
if __name__=='__main__':main()
