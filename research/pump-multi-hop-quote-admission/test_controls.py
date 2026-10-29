"""Resealed observation mutations and the actual rejected native-admission image."""
from pathlib import Path
import base64,copy,importlib.util,sys
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('route_verify',P/'verify.py');v=importlib.util.module_from_spec(s);s.loader.exec_module(v)

def reject(name,change):
    report=copy.deepcopy(v.doc(P/'runtime/focused.json.gz'))
    change(report)
    try:v.check_focused(report)
    except ValueError:return
    raise AssertionError('accepted changed '+name)

def error(report):
    report['cases'][2]['runs']['proposal']['error']=report['cases'][2]['runs']['parent']['error']

def source(report):
    row=report['cases'][2]
    row['runs']['proposal']['logs']=[s.replace('transfer_fee.rs:31.','transfer_fee.rs:32.')for s in row['runs']['proposal']['logs']]
    row['observations']['proposal']['metadata']['logs']=row['runs']['proposal']['logs']

def signature(report):
    row=report['cases'][0]
    for key,run in row['runs'].items():
        raw=bytearray(base64.b64decode(run['transaction_base64']));raw[1]^=1
        run['transaction_base64']=base64.b64encode(raw).decode()
        row['observations'][key]['transaction_base64']=run['transaction_base64']

def loader(report):
    report['cases'][0]['observations']['proposal']['loads'][0]['elf_sha256']='0'*64

def dependency(report):
    report['cases'][0]['runs']['proposal']['program_sha256']['pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA']='0'*64

def actual_load(report):
    report['cases'][0]['observations']['proposal']['program_loads'][0]['sha256']='0'*64

def account(report):
    after=report['cases'][0]['runs']['proposal']['after']
    key=next(k for k,a in after.items()if a is not None)
    after[key]['lamports']+=1

if __name__=='__main__':
    for name,change in [('error',error),('source',source),('signature',signature),('loader',loader),('account',account),('dependency',dependency),('actual_load',actual_load)]:reject(name,change)
    try:v.check_focused(v.doc(P/'controls/native-omission.json.gz'))
    except ValueError:pass
    else:raise AssertionError('accepted actual rejected native-omission image')
    base=v.load(v.L/'verify.py');record=v.doc(P/'builds/proposal-result.json.gz');record['tool_sha256']['rustc']='0'*64
    try:base.check_toolchain(record,v.L)
    except ValueError:pass
    else:raise AssertionError('accepted changed compiler pin')
    print('9 evidence controls rejected.')
