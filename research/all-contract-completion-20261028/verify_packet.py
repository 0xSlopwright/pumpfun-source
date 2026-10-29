#!/usr/bin/env python3
"""Check this handoff's exact file inventory; performs no compilation or replay."""
import argparse
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
WORKFLOW = ".github/workflows/rebuild-canonical-mayhem.yml"


def inventory():
    result = {}
    for path in sorted(HERE.rglob("*")):
        relative = path.relative_to(HERE)
        if "__pycache__" in relative.parts or relative.as_posix() == "MANIFEST.json":
            continue
        if path.is_symlink():
            raise ValueError("symlink in packet: " + relative.as_posix())
        if path.is_file():
            data = path.read_bytes()
            result[relative.as_posix()] = {"bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}
    return result


def manifest():
    return {"schema": "ALL_CONTRACT_COMPLETION_HANDOFF_V1", "files": inventory(),
            "workflow": {"path": WORKFLOW, "sha256": hashlib.sha256((REPO / WORKFLOW).read_bytes()).hexdigest()},
            "source_promotion": {"fees": "installed; exact current-source build qualified",
                                 "mayhem": "proposal only; fresh Windows build required",
                                 "donation_relay": "existing canonical source retained; scanner bridge verified"},
            "historical_source_provenance_claimed": False}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    actual = manifest()
    path = HERE / "MANIFEST.json"
    if args.write:
        path.write_text(json.dumps(actual, indent=2) + "\n")
    elif json.loads(path.read_text()) != actual:
        raise ValueError("packet or Windows workflow differs from manifest")
    print("Verified completion handoff inventory: " + str(len(actual["files"])) + " files")
