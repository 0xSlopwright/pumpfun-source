"""Passive Rust MIR and pre-inlining LLVM capture; no target execution."""
from pathlib import Path
import hashlib, json, shutil, subprocess, time

D = Path(__file__).resolve().parent

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p, x): p.write_bytes((json.dumps(x, indent=2) + '\n').encode())
def inv(p): return {f.relative_to(p).as_posix(): sha(f) for f in sorted(p.rglob('*')) if f.is_file()}

def main():
    base = D/'02-guard'; out = D/'08-return-origin'; mir = D.parent/'mp08'
    out.mkdir(); mir.mkdir()
    shutil.copytree(base/'source', out/'source'); shutil.copytree(base/'target', out/'target'); (out/'temp').mkdir()
    old = json.loads((base/'launch.json').read_bytes())
    before = inv(out/'source'); assert before == old['source_inputs']
    tools = old['tools']; assert all(sha(Path(p)) == h for p,h in tools.items())
    command = [x.replace(str(base), str(out)) for x in json.loads((base/'root-command.json').read_bytes())]
    env = {k:v.replace(str(base), str(out)) for k,v in old['environment'].items()}
    env.update(CARGO_MANIFEST_DIR=str(out/'source/programs/pump'), CARGO_PKG_NAME='pump-recovered', CARGO_PKG_VERSION='0.1.0', CARGO_CRATE_NAME='pump_recovered')
    wrapper = '_ZN14pump_recovered14pump_recovered16buy_exact_sol_in17h28eae2e2fdc8f8b2E'
    inner = '_ZN14pump_recovered10legacy_buy16buy_exact_sol_in17h56330eb58410ba36E'
    flags = ['-C', 'llvm-args=-print-before-all', '-C', 'llvm-args=-print-after-all',
             '-C', 'llvm-args=-filter-print-funcs='+wrapper+','+inner,
             '-Zdump-mir=buy_exact_sol_in', '-Zdump-mir-dir='+str(mir)]
    command += flags
    save(out/'launch.json', dict(command=command, cwd=str(out/'source'), environment=env,
        source_inputs=before, tools=tools, parent='02-guard', extra_arguments=flags,
        controller_sha256=sha(Path(__file__)), copied_dependencies=True, compiler_commands=1,
        target_executions=0, hypothesis='Record initial Rust/MIR and inner-function LLVM lowering before wrapper inlining, with all source and ordinary codegen flags unchanged. Full linked ELF equality is required to qualify passive tracing.'))
    start=time.time()
    with (out/'stdout.log').open('wb') as stdout, (out/'stderr.log').open('wb') as stderr:
        r=subprocess.run(command,cwd=out/'source',env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
    result=dict(returncode=r.returncode,seconds=time.time()-start,source_unchanged=before==inv(out/'source'),
        tools_unchanged=all(sha(Path(p))==h for p,h in tools.items()),
        logs={n:dict(sha256=sha(out/n),bytes=(out/n).stat().st_size) for n in ['stdout.log','stderr.log']},
        mir_directory=str(mir),mir_files=inv(mir),target_executions=0)
    if r.returncode==0:
        shutil.copyfile(out/'target/sbpf-solana-solana/release/deps/pump_recovered.so',out/'symbols.so')
        result.update(symbols_sha256=sha(out/'symbols.so'),whole_output_equal=(out/'symbols.so').read_bytes()==(base/'symbols.so').read_bytes())
    save(out/'result.json',result)
    print(json.dumps({k:(len(v) if k=='mir_files' else v) for k,v in result.items()},indent=2),flush=True)
    assert r.returncode==0 and result['source_unchanged'] and result['tools_unchanged'] and result['whole_output_equal']
    assert result['mir_files'], 'No MIR files captured'

if __name__=='__main__': main()
