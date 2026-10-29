"""Repinned proof-integrity negatives; no VM, compiler or original proof writes."""
if not __debug__:
    raise SystemExit("Run without -O")
import argparse
import base64
import contextlib
import copy
import gzip
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import shutil
import tempfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sha = lambda raw: hashlib.sha256(raw).hexdigest()


def repin(packet, report, receipts):
    start = 0
    for part in report["transaction_receipts"]["parts"]:
        chunk = receipts[start:start + part["receipts"]]
        start += len(chunk)
        raw = gzip.compress(b"\n".join(json.dumps(row).encode() for row in chunk) + b"\n", mtime=0)
        (packet / part["path"]).write_bytes(raw)
        part["sha256"] = sha(raw)
    (packet / "runtime/report.json.gz").write_bytes(gzip.compress(json.dumps(report).encode(), mtime=0))
    manifest = json.loads((packet / "MANIFEST.json").read_text())
    manifest["files"] = {str(p.relative_to(packet)): sha(p.read_bytes()) for p in sorted(packet.rglob("*"))
                         if p.is_file() and p.name != "MANIFEST.json"}
    (packet / "MANIFEST.json").write_text(json.dumps(manifest, indent=2) + "\n")


def run(packet):
    spec = importlib.util.spec_from_file_location("disable_control_verifier", packet / "verify.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    module.HERE, module.ROOT = packet, ROOT
    with contextlib.redirect_stdout(io.StringIO()):
        module.main()


def image(report, receipts):
    report["image_sha256"]["candidate"] = "0" * 64


def valid_wrong_wire(report, receipts):
    for image in ("original", "control", "candidate"):
        source = next(r for r in receipts if r["context"]["label"] == "dis-all-false" and r["context"]["image"] == image)
        target = next(r for r in receipts if r["context"]["label"] == "dis-create-only" and r["context"]["image"] == image)
        for name in ("transaction_base64", "transaction_sha256", "signatures"):
            target[name] = copy.deepcopy(source[name])
        target["metadata"]["signature"] = source["metadata"]["signature"]


def broken_chain(report, receipts):
    for row in receipts:
        if row["context"]["label"] == "chain-buy-gate" and row["context"]["step"] > 0:
            cfg = row["roles"]["global_config"]
            for side in ("before", "after"):
                data = bytearray.fromhex(row[side][cfg]["data_hex"])
                data[200] ^= 1
                row[side][cfg]["data_hex"] = data.hex()


def invalid_signature(report, receipts):
    row = receipts[0]
    raw = bytearray(base64.b64decode(row["transaction_base64"]))
    raw[1] ^= 1
    row["transaction_base64"] = base64.b64encode(raw).decode()
    row["transaction_sha256"] = sha(raw)


def detached_pool(report, receipts):
    from solders.pubkey import Pubkey
    from solders.transaction import Transaction
    key = str(Pubkey.from_bytes(hashlib.sha256(b"PR768 peer detached watched pool").digest()))
    for row in receipts:
        if row["context"]["label"] == "chain-buy-gate":
            tx = Transaction.from_bytes(base64.b64decode(row["transaction_base64"]))
            assert key not in [str(value) for value in tx.message.account_keys]
            old = row["roles"]["pool"]
            row["roles"]["pool"] = key
            for side in ("before", "after"):
                row[side][key] = row[side].pop(old)


def missing_buy_chain(report, receipts):
    source = next(c for c in report["cases"] if c["case"]["label"] == "dis-all-false")
    index = next(i for i, c in enumerate(report["cases"]) if c["case"]["label"] == "chain-buy-gate")
    report["cases"][index] = copy.deepcopy(source)
    report["cases"][index]["case"]["label"] = "chain-buy-gate"
    sources = {r["context"]["image"]: copy.deepcopy(r) for r in receipts
               if r["context"]["label"] == "dis-all-false"}
    for position, row in enumerate(receipts):
        if row["context"]["label"] != "chain-buy-gate":
            continue
        ctx = row["context"]
        if ctx["step"] == 0:
            replacement = copy.deepcopy(sources[ctx["image"]])
            replacement["sequence"], replacement["vm"] = row["sequence"], row["vm"]
            replacement["context"]["index"] = index
            replacement["context"]["label"] = "chain-buy-gate"
            receipts[position] = replacement
        else:
            ctx["image"] = "unprocessed-" + ctx["image"]
            ctx["step"] += 100
    assert len(receipts) == 111 and len(report["cases"]) == 26


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    run(HERE)
    report = json.loads(gzip.decompress((HERE / "runtime/report.json.gz").read_bytes()))
    receipts = []
    for part in report["transaction_receipts"]["parts"]:
        receipts += [json.loads(line) for line in gzip.decompress((HERE / part["path"]).read_bytes()).splitlines() if line]
    results = []
    controls = [("repinned image declaration", image, "declared historical image binding"),
                ("substituted valid signed instruction", valid_wrong_wire, "signed instruction payload"),
                ("coherent disconnected chain", broken_chain, "chained account continuity"),
                ("repinned invalid signature", invalid_signature, None),
                ("coherent off-wire watched pool", detached_pool, "signed watched role: pool"),
                ("missing buy chain with retained 26/111 counts", missing_buy_chain, "exact case membership")]
    with tempfile.TemporaryDirectory(prefix="amm-disable-proof-controls-") as directory:
        for index, (name, mutate, expected) in enumerate(controls):
            packet = Path(directory) / str(index)
            shutil.copytree(HERE, packet)
            altered_report, altered_receipts = copy.deepcopy(report), copy.deepcopy(receipts)
            mutate(altered_report, altered_receipts)
            repin(packet, altered_report, altered_receipts)
            try:
                run(packet)
            except AssertionError as error:
                assert expected is None or expected in str(error), (name, str(error))
                results.append({"case": name, "rejected": True, "reason": str(error)})
            else:
                raise RuntimeError("Accepted altered proof: " + name)
    result = {"status": "PASS", "clean_baseline": "PASS", "negative_controls": results,
              "scope": "Repinned proof-data checks only; no VM/compiler execution or loader attestation"}
    if args.report:
        assert not args.report.resolve().is_relative_to(HERE.resolve()), "external report only"
        args.report.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
