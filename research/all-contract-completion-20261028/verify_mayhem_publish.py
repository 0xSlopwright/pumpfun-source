#!/usr/bin/env python3
"""Verify the standalone Windows workflow publication subset, without Fees/Relay."""
import argparse
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]


def manifest():
    names = (HERE / "MAYHEM-PUBLISH.txt").read_text().splitlines()
    if not names or names != sorted(set(names)):
        raise ValueError("publication list must be sorted and unique")
    result = {}
    for name in names:
        path = REPO / name
        if path == HERE / "MAYHEM-MANIFEST.json":
            continue
        if path.is_symlink() or not path.is_file() or not path.resolve().is_relative_to(REPO):
            raise ValueError("invalid publication file: " + name)
        data = path.read_bytes()
        result[name] = {"bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}
    dependency = REPO / "research/mayhem-fresh-host-20261028/manifest.json"
    return {"schema": "MAYHEM_WINDOWS_PUBLISH_V1", "files": result,
            "sealed_recipe_dependency": {"path": dependency.relative_to(REPO).as_posix(),
                                         "sha256": hashlib.sha256(dependency.read_bytes()).hexdigest()},
            "fresh_windows_execution_claimed": False, "canonical_promotion_claimed": False}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    expected = manifest()
    path = HERE / "MAYHEM-MANIFEST.json"
    if args.write:
        path.write_text(json.dumps(expected, indent=2) + "\n")
    elif json.loads(path.read_text()) != expected:
        raise ValueError("Mayhem publication subset or sealed dependency changed")
    print("Verified standalone Mayhem publication subset: " + str(len(expected["files"]) + 1) + " files")
