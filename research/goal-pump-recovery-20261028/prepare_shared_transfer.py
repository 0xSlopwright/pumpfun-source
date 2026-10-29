from pathlib import Path
import subprocess
root=Path(__file__).resolve().parent
out=root/'shared-transfer-fees'
if out.exists():raise SystemExit('output already exists')
subprocess.run(['cp','-cR',str(root/'cost-shared-errors'),str(out)],check=True)
p=out/'src/lib.rs';text=p.read_text();old='#[path="util/transfer_fee.rs"] pub mod transfer_fee_recovered;';assert old in text;text=text.replace(old,'pub use pump_shared_errors::transfer_fee_recovered;',1);p.write_text(text)
p=out/'pump-shared-errors/src/lib.rs';text=p.read_text();text+='\nmod trade { pub mod native_transfer_fee { pub use pump_token_ext::*; } }\n#[path="../../src/util/transfer_fee.rs"] pub mod transfer_fee_recovered;\n';p.write_text(text)
p=out/'pump-shared-errors/Cargo.toml';text=p.read_text();text+='pump-token-ext = { path = "../pump-token-ext" }\nanchor-spl = {version = "=0.31.1", features = ["token_2022", "associated_token", "metadata"]}\n';p.write_text(text)
p=out/'Cargo.lock';text=p.read_text();start=text.index('name = "pump-shared-errors"');part=text[start:];part=part.replace(' "anchor-lang",',' "anchor-lang",\n "anchor-spl",\n "pump-token-ext",',1);text=text[:start]+part;p.write_text(text)
