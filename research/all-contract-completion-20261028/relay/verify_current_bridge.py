#!/usr/bin/env python3
"""Explicit Relay scanner transition; preserve the original sealed selection.

The only admitted helper change replaces str(relative_path) with as_posix().
Current canonical source and all original artifact/build/loader checks stay bound.
No compiler, target execution, network or repository mutation is performed.
"""
import argparse
import ast
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

HERE = Path(__file__).resolve().parent
OLD = "bbcf5081f99cc911af108216dee430ac15721c16159406490beb7671e4b14a8b"
NEW = "05eb3446b95c0b7b80517fe05a98a9841fa53053fe39ca56fe2659daf6b58df0"


def require(ok, message):
    if not ok:
        raise ValueError(message)


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


def review_scanner(root, transition):
    """Admit one reviewed helper transition; reusable with sealed test fixtures."""
    root = Path(root).resolve()
    scanner_path = root / transition["scanner"]
    before_path = HERE / "scanner-before.py"
    require(sha(before_path) == OLD and sha(scanner_path) == NEW, "unreviewed scanner identity")
    before = before_path.read_text()
    old_expression = "str(p.relative_to(repository))"
    new_expression = "p.relative_to(repository).as_posix()"
    require(before.count(old_expression) == 1 and before.replace(old_expression, new_expression) == scanner_path.read_text(), "scanner change is broader than portable path serialization")
    old_scanner = module("relay_scanner_before_bridge", before_path)
    new_scanner = module("relay_scanner_after_bridge", scanner_path)
    source_counts = {}
    for name in ("old", "new"):
        record = transition[name]["source"]
        folder = root / record["root"]
        extra = [root / entry for entry in record["extra_inputs"]]
        a = old_scanner.source_manifest(folder, folder, root, extra_inputs=extra, cwd=root)
        b = new_scanner.source_manifest(folder, folder, root, extra_inputs=extra, cwd=root)
        expected = {record["root"] + "/" + path: digest for path, digest in record["files"].items()}
        require(a == b == expected, name + " exact source map changed")
        source_counts[name] = len(a)
    reviewed = copy.deepcopy(transition)
    require(reviewed["bindings"][transition["scanner"]] == OLD, "old scanner binding")
    reviewed["bindings"][transition["scanner"]] = NEW
    return reviewed, source_counts


def verify(root):
    require(__debug__, "the preserved Relay selection gate requires normal Python")
    root = Path(root).resolve()
    directory = root / "repro/donation-relay/canonical-exact-selection"
    sys.path.insert(0, str(directory))
    try:
        selection = module("relay_exact_selection_bridge", directory / "verify_selection.py")
        selection.authenticate()
        transition_path = directory / "transition.json"
        require(sha(transition_path) == selection.TRANSITION_SHA256, "sealed transition changed")
        transition = json.loads(transition_path.read_text())
        # A new in-memory transition admits exactly the reviewed scanner digest.
        # The original transition file, seal and all other bindings stay unchanged.
        reviewed, source_counts = review_scanner(root, transition)
        gate = module("relay_selection_gate_bridge", directory / "selection_gate.py")
        result = gate._verify_document(root, reviewed)
        new = transition["new"]
        launch = json.loads((root / new["canonical_build_receipt"]).read_text())
        selection.recorded_mounts(launch)
        command = launch["command"]
        require(command[command.index("-w") + 1] == "/source" and "/source/Cargo.toml" in command and "--offline" in command and "--locked" in command, "canonical compiler command")
        require(command[command.index("--target") + 1] == "sbpf-solana-solana", "canonical target")
        require(launch["rustc_sha256"] == "89fd4ccdd6e678a24c2cda074b498b46a352fcfce21018119c9526751afc678d", "canonical SDK identity")
        original = (root / new["loader_runner"]).read_text()
        original = original[original.index("def execute("):original.index("\ndef verify_static")]
        producer = (directory / "produce_payload.py").read_text()
        producer = producer[producer.index("def execute("):producer.index("\nif __name__")]
        producer = producer.replace("def execute(elf,CAPACITY,original,output):", "def execute(elf,CAPACITY,original):").replace("\n    Path(output).write_bytes(payload)", "")
        require(ast.dump(ast.parse(original)) == ast.dump(ast.parse(producer)), "reviewed real-loader producer")
        return {"status": "PASS_RELAY492_CURRENT_WITH_REVIEWED_SCANNER_TRANSITION",
                "old_scanner_sha256": OLD, "current_scanner_sha256": NEW,
                "scanner_change": "portable relative-path serialization only", "source_counts": source_counts,
                "original_transition_unchanged": sha(transition_path) == selection.TRANSITION_SHA256,
                "original_gate_without_bridge_passes": False,
                "current_selection": result, "new_builds": 0, "new_target_executions": 0}
    finally:
        sys.path.pop(0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(verify(args.repo), indent=2))
