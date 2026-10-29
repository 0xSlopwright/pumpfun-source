"""Small signed Pool-decoder boundary and validation differential."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json,sys
ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_liquidity_differential as pool
from solders.litesvm import LiteSVM
spec=importlib.util.spec_from_file_location('decoder_log_clean',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py')
cleaner=importlib.util.module_from_spec(spec);spec.loader.exec_module(cleaner)
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
send=LiteSVM.send_transaction;receipts=[]
def snapshot(vm,keys):
    out={}
    for key in sorted(set(keys),key=str):
        a=vm.get_account(key)
        if a and a.executable:continue
        out[str(key)]=None if a is None else {'owner':str(a.owner),'lamports':a.lamports,'data_hex':bytes(a.data).hex(),'rent_epoch':a.rent_epoch}
    return out
def signed_send(vm,tx):
    valid=tx.verify_with_results();assert valid and all(valid)
    before=snapshot(vm,tx.message.account_keys);raw=bytes(tx);result=send(vm,tx)
    assert bytes(tx)==raw
    receipts.append({'transaction_base64':base64.b64encode(raw).decode(),'signature_verification':valid,'before':before,'after':snapshot(vm,tx.message.account_keys)})
    return result
LiteSVM.send_transaction=signed_send

def main():
    p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists()
    roster=[('length-'+str(n),pool.mutate(pool.pool,0,b'',length=n)) for n in [0,7,8,210,211,242,243,244,245,260,261,269,270,271,286,287,288]]
    roster += [('bad-discriminator',pool.mutate(pool.pool,0,bytes(8))),('wrong-owner',pool.mutate(pool.pool,0,b'',owner=pool.Pubkey.default()))]
    roster += [('invalid-bool-'+str(n),pool.mutate(pool.pool,n,b'\x02')) for n in [243,244,269,270]]
    rows=[]
    for instruction in ['deposit','withdraw']:
        for label,mutate in roster:
            results=[];observed=[]
            for binary in [ROOT/'evidence/original/pump_amm/deployed.so',a.candidate]:
                count=len(receipts);result=pool.run(instruction,1000000,maxbase=0 if instruction=='withdraw'else 2**64-1,maxquote=0 if instruction=='withdraw'else 2**64-1,overrides=mutate,candidate=binary)
                assert len(receipts)==count+1;results.append(result);observed.append(receipts[-1])
            x,y=results;rx,ry=observed
            assert rx['transaction_base64']==ry['transaction_base64']and rx['before']==ry['before']
            diff=[k for k in x if cleaner.clean(x)[k]!=cleaner.clean(y)[k]]
            if rx['after']!=ry['after']:diff.append('full_after_snapshot')
            rows.append({'instruction':instruction,'case':label,'original':x,'candidate':y,'differences':diff})
    out={'scope':__doc__,'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'candidate_sha256':sha(a.candidate),'producer_sha256':sha(__file__),'cleaner_sha256':sha(ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'),'case_count':len(rows),'transaction_count':len(receipts),'signature_count':sum(len(x['signature_verification'])for x in receipts),'mismatches':[i for i,x in enumerate(rows)if x['differences']],'cases':rows}
    a.output.write_text(json.dumps(out,separators=(',',':'))+'\n')
    a.output.with_name(a.output.stem+'-transactions.json.gz').write_bytes(gzip.compress((json.dumps({'transactions':receipts},separators=(',',':'))+'\n').encode()))
    print(json.dumps({k:out[k]for k in ['case_count','transaction_count','signature_count','mismatches']},indent=2));assert not out['mismatches']
if __name__=='__main__':main()
