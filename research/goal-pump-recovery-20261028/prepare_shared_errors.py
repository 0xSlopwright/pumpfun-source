from pathlib import Path
import subprocess
root=Path(__file__).resolve().parent
out=root/'cost-shared-errors'
if out.exists():raise SystemExit('output already exists')
subprocess.run(['cp','-cR',str(root/'cost-second-if'),str(out)],check=True)
p=out/'src/lib.rs';text=p.read_text();start=text.index('#[error_code]\npub enum PumpError {');end=text.index('\n}\n',start)+2;enum=text[start:end]
replacement='pub use pump_shared_errors::PumpError;'+('\n'*(enum.count('\n')))
p.write_text(text[:start]+replacement+text[end:])
shared=out/'pump-shared-errors';(shared/'src').mkdir(parents=True)
(shared/'Cargo.toml').write_text('[package]\nname = "pump-shared-errors"\nversion = "0.1.0"\nedition = "2021"\npublish = false\n\n[dependencies]\nanchor-lang = {version = "=0.31.1", features = ["event-cpi", "init-if-needed", "allow-missing-optionals"]}\n')
(shared/'src/lib.rs').write_text('use anchor_lang::prelude::*;\n\n'+enum+'\n')
p=out/'Cargo.toml';text=p.read_text();text=text.replace('[dependencies]\n','[dependencies]\npump-shared-errors = { path = "pump-shared-errors" }\n',1);p.write_text(text)
p=out/'Cargo.lock';text=p.read_text();start=text.index('name = "pump-recovered"');end=text.index('\n[[package]]',start);body=text[start:end];body=body.replace(' "pump-token-ext",',' "pump-shared-errors",\n "pump-token-ext",');text=text[:start]+body+text[end:];text+='\n[[package]]\nname = "pump-shared-errors"\nversion = "0.1.0"\ndependencies = [\n "anchor-lang",\n]\n';p.write_text(text)
