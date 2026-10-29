"""Resealed saved-proof controls; no native execution or owning packet writes."""
if not __debug__:
    raise SystemExit("Run without -O")
import argparse, base64, contextlib, copy, gzip, hashlib, importlib.util, io, json
from pathlib import Path
import shutil, tempfile
from solders.pubkey import Pubkey
P = Path(__file__).resolve().parent
ROOT = P.parents[1]
sha = lambda raw: hashlib.sha256(raw).hexdigest()


def run(packet):
    spec = importlib.util.spec_from_file_location("volume_controls", packet / "verify.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.HERE, mod.ROOT = packet, ROOT
    with contextlib.redirect_stdout(io.StringIO()): mod.main()


def repin(packet, report, rows):
    start = 0
    for part in report["transaction_receipts"]["parts"]:
        chunk = rows[start:start + part["receipts"]]
        start += len(chunk)
        raw = gzip.compress(b"\n".join(json.dumps(x).encode() for x in chunk) + b"\n", mtime=0)
        (packet / part["path"]).write_bytes(raw)
        part["sha256"] = sha(raw)
    (packet / "runtime/report.json.gz").write_bytes(gzip.compress(json.dumps(report).encode(), mtime=0))
    m = json.loads((packet / "MANIFEST.json").read_text())
    m["files"] = {str(q.relative_to(packet)): sha(q.read_bytes()) for q in sorted(packet.rglob("*")) if q.is_file() and q.name != "MANIFEST.json"}
    (packet / "MANIFEST.json").write_text(json.dumps(m, indent=2) + "\n")


def wrong_before(report, rows):
    for row in rows:
        if row["context"]["label"] == "buy-seeded-track1":
            v = row["before"][row["roles"]["volume"]]
            data = bytearray.fromhex(v["data_hex"])
            data[57] ^= 1
            v["data_hex"] = data.hex()


def missing_case(report, rows):
    report["cases"] = [copy.deepcopy(report["cases"][0]) for _ in range(26)]


def wrong_wire(report, rows):
    for image in ("original", "control", "candidate"):
        source = next(r for r in rows if r["context"]["label"] == "buy-fresh-track0" and r["context"]["image"] == image)
        target = next(r for r in rows if r["context"]["label"] == "buy-fresh-track1" and r["context"]["image"] == image)
        for key in ("transaction_base64", "transaction_sha256", "signatures"):
            target[key] = copy.deepcopy(source[key])
        target["metadata"]["signature"] = source["metadata"]["signature"]


def offwire_pool(report, rows):
    key = str(Pubkey.from_bytes(hashlib.sha256(b"PR812 off-wire pool").digest()))
    for row in rows:
        if row["context"]["label"] == "buy-fresh-track1":
            old = row["roles"]["pool"]
            row["roles"]["pool"] = key
            for side in ("before", "after"):
                row[side][key] = row[side].pop(old)


def wrong_disc(report, rows):
    for row in rows:
        if row["context"]["label"] == "buy-fresh-track1":
            logs = row["metadata"]["logs"]
            index = next(i for i,x in enumerate(logs) if x.startswith("Program data: "))
            raw = base64.b64decode(logs[index].split(": ", 1)[1])
            logs[index] = "Program data: " + base64.b64encode(bytes(8) + raw[8:]).decode()


def wrong_image(report, rows):
    report["image_sha256"]["candidate"] = "0" * 64


def invalid_signature(report, rows):
    for row in rows:
        if row["context"]["label"] == "buy-fresh-track0":
            raw = bytearray(base64.b64decode(row["transaction_base64"]))
            raw[1] ^= 1
            row["transaction_base64"] = base64.b64encode(raw).decode()
            row["transaction_sha256"] = sha(raw)


CONTROLS = [("changed full seeded before-volume", wrong_before), ("missing case with26 entries", missing_case),
            ("valid wrong track wire", wrong_wire), ("off-wire pool snapshots", offwire_pool),
            ("wrong event discriminator", wrong_disc), ("changed image declaration", wrong_image),
            ("invalid signature", invalid_signature)]


REASONS = {"changed full seeded before-volume": "entire declared before-volume",
           "missing case with26 entries": "exact case membership",
           "valid wrong track wire": "declared signed instruction data",
           "off-wire pool snapshots": "declared role binding",
           "wrong event discriminator": "event discriminator",
           "changed image declaration": "historical image declarations",
           "invalid signature": "0"}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    run(P)
    report = json.loads(gzip.decompress((P / "runtime/report.json.gz").read_bytes()))
    rows = [json.loads(line) for part in report["transaction_receipts"]["parts"] for line in gzip.decompress((P / part["path"]).read_bytes()).splitlines()]
    results = []
    with tempfile.TemporaryDirectory(prefix="volume-proof-controls-") as directory:
        for name, mutate in CONTROLS:
            packet = Path(directory) / str(len(results))
            shutil.copytree(P, packet)
            new_report, new_rows = copy.deepcopy(report), copy.deepcopy(rows)
            mutate(new_report, new_rows)
            repin(packet, new_report, new_rows)
            try: run(packet)
            except (Exception, SystemExit) as error:
                if REASONS[name] != str(error) and REASONS[name] not in str(error):
                    raise RuntimeError("Unexpected control rejection: " + name + ": " + str(error))
                results.append({"control": name, "rejected": True, "reason": str(error)})
            else: raise RuntimeError("Accepted altered proof: " + name)
    result = {"baseline": "PASS", "negative_controls": results, "scope": "Resealed proof-data checks only; no VM/compiler or execution attestation"}
    if args.report:
        if args.report.resolve().is_relative_to(P): raise RuntimeError("external report only")
        args.report.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, indent=2))

if __name__ == "__main__": main()
