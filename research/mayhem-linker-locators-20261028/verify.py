#!/usr/bin/env python3
"""Verify selector-only derivation and unique old/current input section matches."""
import argparse
import fnmatch
import gzip
import hashlib
import json
from pathlib import Path
import re

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
WORKFLOW = ".github/workflows/rebuild-canonical-mayhem-linker-locators.yml"


def selectors(text):
    result = []
    for line in text.splitlines():
        match = re.match(r'^\s*([0-9a-f]+)\s+([0-9a-f]+)\s+([0-9a-f]+)\s+(\d+)\s+(.+):\(([^)]*)\)$', line)
        if match:
            obj, section = match.groups()[4:]
            name = obj.replace("\\", "/").rsplit("/", 1)[-1]
            if "(" in name:
                name = name.replace("(", ":").removesuffix(")")
            result.append((name, section))
    return result


def verify_recipe():
    pins = json.loads((HERE / "inputs.json").read_text())
    original = (REPO / pins["parent_script"]).read_bytes()
    if hashlib.sha256(original).hexdigest() != pins["parent_script_sha256"]:
        raise ValueError("sealed parent linker recipe changed")
    text = original.decode()
    checked = 0
    changed_lines = []
    for row in pins["locator_changes"]:
        expected_glob = re.sub(r'-[0-9a-f]{16}(?=\.|$)', '-*', row["old"])
        if expected_glob != row["portable_glob"]:
            raise ValueError("selector modification exceeds Cargo artifact digest")
        old_prefix = "*" + row["old"] + "("
        if text.count(old_prefix) != row["selectors"]:
            raise ValueError("selector count changed")
        changed_lines += [line.replace(old_prefix, "*" + expected_glob + "(") for line in text.splitlines() if old_prefix in line]
        text = text.replace(old_prefix, "*" + expected_glob + "(")
    actual = (HERE / "ordered-native.ld").read_bytes()
    if actual != text.encode() or hashlib.sha256(actual).hexdigest() != pins["derived_script_sha256"]:
        raise ValueError("derived linker recipe changes data, section names or ordering")
    old_map = gzip.decompress((REPO / "research/mayhem-fresh-host-20261028/builds/03/link/link.map.gz").read_bytes()).decode()
    current_map = gzip.decompress((HERE / "observed-link.map.gz").read_bytes()).decode()
    datasets = [selectors(old_map), selectors(current_map)]
    for line in changed_lines:
        match = re.fullmatch(r'\s*\*([^\s(]+)\("([^"]+)"\)\s*', line)
        if not match:
            raise ValueError("unexpected changed selector syntax")
        obj, section = match.groups()
        for dataset in datasets:
            matches = [(name, sec) for name, sec in dataset
                       if fnmatch.fnmatchcase(name, obj) and fnmatch.fnmatchcase(sec, section)]
            if len(matches) != 1:
                raise ValueError("derived selector is missing or ambiguous")
        checked += 1
    if checked != pins["changed_selectors"] or checked != 539:
        raise ValueError("incomplete selector proof")
    return checked


def inventory():
    verify_recipe()
    paths = [p for p in HERE.iterdir() if p.is_file() and p.name != "manifest.json"] + [REPO / WORKFLOW]
    return {p.relative_to(REPO).as_posix(): {"bytes": p.stat().st_size, "sha256": hashlib.sha256(p.read_bytes()).hexdigest()}
            for p in sorted(paths)}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    actual = {"schema": "MAYHEM_CARGO_LINKER_LOCATORS_PROPOSAL_V1", "files": inventory(),
              "new_recipe_compilation_or_promotion_claimed": False}
    path = HERE / "manifest.json"
    if args.write:
        path.write_text(json.dumps(actual, indent=2) + "\n")
    elif json.loads(path.read_text()) != actual:
        raise ValueError("linker locator proposal changed")
    print("Verified 539 unique selector-only normalizations and proposal inventory")
