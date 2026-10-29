"""Resealed saved-proof negatives only; no VM, compiler or owning packet writes."""
if not __debug__:
    raise SystemExit("Run without -O")
import argparse, base64, contextlib, copy, gzip, hashlib, importlib.util, io, json
from pathlib import Path
import shutil, tempfile
from solders.pubkey import Pubkey
HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
sha = lambda raw: hashlib.sha256(raw).hexdigest()

def run(packet):
    spec = importlib.util.spec_from_file_location("reserved_control_verifier", packet / "verify.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.ROOT, mod.REPO = packet, REPO
    mod.IMAGE_PATHS = {name: REPO / path for name, path in {"original": "evidence/original/pump_amm/deployed.so", "control": "research/amm-multi-hop-group-slice-recovery/artifacts/candidate.so.gz", "candidate": "research/amm-transfer-fee-diagnostic-recovery/artifacts/candidate.so.gz"}.items()}
    with contextlib.redirect_stdout(io.StringIO()): mod.main()

def repin(packet, report, rows):
    start = 0
    for part in report["parts"]:
        chunk = rows[start:start + part["count"]]
        start += len(chunk)
        raw = gzip.compress(b"\n".join(json.dumps(x).encode() for x in chunk) + b"\n", mtime=0)
        (packet / part["file"]).write_bytes(raw)
        part["sha256"], part["bytes"] = sha(raw), len(raw)
    (packet / "runtime/report.json.gz").write_bytes(gzip.compress(json.dumps(report).encode(), mtime=0))
    manifest = json.loads((packet / "MANIFEST.json").read_text())
    manifest["files"] = {str(q.relative_to(packet)): sha(q.read_bytes()) for q in sorted(packet.rglob("*")) if q.is_file() and q.name != "MANIFEST.json"}
    (packet / "MANIFEST.json").write_text(json.dumps(manifest, indent=2) + "\n")


def wrong_wire(report, rows):
    for image in ("original", "control", "candidate"):
        source = next(r for r in rows if r["case"] == "w-buy-std" and r["image"] == image and r["step"] == "buy")
        target = next(r for r in rows if r["case"] == "w-buy-trim" and r["image"] == image and r["step"] == "buy")
        target["transaction_base64"] = source["transaction_base64"]


def broken_chain(report, rows):
    for row in rows:
        if row["case"] == "w-buy-trim" and row["step"] == "buy":
            for side in ("before", "after"):
                key = next(k for k, value in row[side].items() if value and len(bytes.fromhex(value["data_hex"])) == 949)
                data = bytearray.fromhex(row[side][key]["data_hex"])
                data[700] ^= 1
                row[side][key]["data_hex"] = data.hex()


def detached_pool(report, rows):
    key = str(Pubkey.from_bytes(hashlib.sha256(b"PR847 detached watched pool").digest()))
    for row in rows:
        if row["case"] == "w-buy-trim":
            for side in ("before", "after"):
                old = next(k for k,v in row[side].items() if v and len(bytes.fromhex(v["data_hex"])) == 300)
                row[side][key] = row[side].pop(old)


def wrong_delta(report, rows):
    for row in rows:
        if row["case"] == "w-buy-trim" and row["step"] == "buy":
            # A valid token-account amount changes in all image roles together.
            key = "5jKh25biPsnrmLWXXuqKNH2Q67j69T4Q7Zew5c8wJKaV"
            data = bytearray.fromhex(row["after"][key]["data_hex"])
            data[64] ^= 1
            row["after"][key]["data_hex"] = data.hex()


def wrong_event(report, rows):
    for row in rows:
        if row["case"] == "w-buy-trim" and row["step"] == "buy":
            at = next(i for i,x in enumerate(row["logs"]) if x.startswith("Program data: "))
            raw = base64.b64decode(row["logs"][at].split(": ",1)[1])
            value = "Program data: " + base64.b64encode(bytes(8)+raw[8:]).decode()
            row["logs"][at] = value
            row["events"] = [value]


def invalid_signature(report, rows):
    for row in rows:
        if row["case"] == "s-set-8":
            raw = bytearray(base64.b64decode(row["transaction_base64"]))
            raw[1] ^= 1
            row["transaction_base64"] = base64.b64encode(raw).decode()


CONTROLS = [("valid wrong remaining-layout wire", wrong_wire), ("coherent disconnected setter/trade chain", broken_chain),
            ("off-wire watched pool", detached_pool), ("coherent incorrect expected token delta", wrong_delta),
            ("wrong trade event discriminator", wrong_event), ("invalid signature", invalid_signature)]



def missing_membership(report, rows):
    report["cases"][1] = copy.deepcopy(report["cases"][0])

def wrong_declared_image(report, rows):
    report["images"]["candidate"] = "0" * 64

CONTROLS += [("duplicate/missing case membership", missing_membership), ("changed image declaration", wrong_declared_image)]
REASONS = {"valid wrong remaining-layout wire": "signed account count",
           "coherent disconnected setter/trade chain": "complete setter/trade state continuity",
           "off-wire watched pool": "reviewed initial watched state",
           "coherent incorrect expected token delta": "expected token delta: userbase",
           "wrong trade event discriminator": "event discriminator/length",
           "invalid signature": "canonical single-signature wire",
           "duplicate/missing case membership": "exact case membership",
           "changed image declaration": "historical image declarations"}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    run(HERE)
    report = json.loads(gzip.decompress((HERE / "runtime/report.json.gz").read_bytes()))
    rows = [json.loads(line) for part in report["parts"] for line in gzip.decompress((HERE / part["file"]).read_bytes()).splitlines()]
    results = []
    with tempfile.TemporaryDirectory(prefix="reserved-proof-controls-") as directory:
        for name, mutate in CONTROLS:
            packet = Path(directory) / str(len(results))
            shutil.copytree(HERE, packet)
            new_report, new_rows = copy.deepcopy(report), copy.deepcopy(rows)
            mutate(new_report, new_rows)
            repin(packet, new_report, new_rows)
            try:
                run(packet)
            except (Exception, SystemExit) as error:
                if REASONS[name] not in str(error):
                    raise RuntimeError("Unexpected control failure: " + name + ": " + str(error))
                results.append({"control": name, "rejected": True, "reason": str(error)})
            else:
                raise RuntimeError("Accepted altered proof: " + name)
    result = {"baseline": "PASS", "negative_controls": results, "scope": "Resealed proof-data correspondence only; no VM/build or execution attestation"}
    if args.report:
        if args.report.resolve().is_relative_to(HERE): raise RuntimeError("external report only")
        args.report.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, indent=2))

if __name__ == "__main__": main()
