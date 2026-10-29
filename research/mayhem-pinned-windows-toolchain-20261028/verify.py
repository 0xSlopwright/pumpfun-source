#!/usr/bin/env python3
"""Verify the isolated fixed-toolchain proposal inventory."""
import argparse
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
WORKFLOW = ".github/workflows/rebuild-canonical-mayhem-pinned-msvc.yml"


def inventory():
    paths = [p for p in HERE.iterdir() if p.is_file() and p.name != "manifest.json"]
    paths.append(REPO / WORKFLOW)
    return {p.relative_to(REPO).as_posix(): {"bytes": p.stat().st_size, "sha256": hashlib.sha256(p.read_bytes()).hexdigest()}
            for p in sorted(paths)}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    actual = {"schema": "MAYHEM_PINNED_WINDOWS_PROPOSAL_V1", "files": inventory(),
              "native_installation_or_source_compilation_claimed": False}
    path = HERE / "manifest.json"
    if args.write:
        path.write_text(json.dumps(actual, indent=2) + "\n")
    elif json.loads(path.read_text()) != actual:
        raise ValueError("isolated pinned toolchain proposal changed")
    print("Verified pinned Windows toolchain proposal: " + str(len(actual["files"])) + " bound files")
