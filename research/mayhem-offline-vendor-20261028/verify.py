#!/usr/bin/env python3
"""Verify offline transport inputs and the bounded driver successor changes."""
import argparse
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
WORKFLOW = ".github/workflows/rebuild-canonical-mayhem-offline-vendor.yml"


def verify_driver(pins):
    parent = "research/all-contract-completion-20261028/run_mayhem_windows.py"
    text = (REPO / parent).read_text()
    text = text.replace('source = HERE / "mayhem-proposal/source"',
                        'source = REPO / "research/all-contract-completion-20261028/mayhem-proposal/source"')
    text = text.replace('preparer = HERE / "prepare_mayhem_windows_inputs.py"', 'preparer = HERE / "prepare.py"')
    text = text.replace('"controller_sha256": sha(Path(__file__).read_bytes())}',
                        '"controller_sha256": sha(Path(__file__).read_bytes()),\n'
                        '              "transport_successor": "offline authenticated crate cache; compiled source/controller recipe unchanged",\n'
                        '              "parent_driver_sha256": "' + pins["sealed_dependencies"][parent] + '"}')
    if (HERE / "run.py").read_text() != text:
        raise ValueError("driver changes exceed the declared transport-only successor")


def inventory():
    pins = json.loads((HERE / "inputs.json").read_text())
    for name, digest in pins["sealed_dependencies"].items():
        if hashlib.sha256((REPO / name).read_bytes()).hexdigest() != digest:
            raise ValueError("sealed dependency differs: " + name)
    verify_driver(pins)
    paths = [p for p in HERE.iterdir() if p.is_file() and p.name != "manifest.json"] + [REPO / WORKFLOW]
    return {p.relative_to(REPO).as_posix(): {"bytes": p.stat().st_size, "sha256": hashlib.sha256(p.read_bytes()).hexdigest()}
            for p in sorted(paths)}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    actual = {"schema": "MAYHEM_OFFLINE_REGISTRY_TRANSPORT_PROPOSAL_V1", "files": inventory(),
              "source_compilation_or_promotion_claimed": False}
    path = HERE / "manifest.json"
    if args.write:
        path.write_text(json.dumps(actual, indent=2) + "\n")
    elif json.loads(path.read_text()) != actual:
        raise ValueError("offline registry transport proposal changed")
    print("Verified offline registry transport proposal: " + str(len(actual["files"])) + " bound files")
