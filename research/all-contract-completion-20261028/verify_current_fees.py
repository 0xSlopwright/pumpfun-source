#!/usr/bin/env python3
"""Verify promoted canonical Fees source and its exact saved build.

Standard library only. Does not run a compiler, target, network or Git mutation.
"""
import argparse
import gzip
import hashlib
import importlib.util
import json
from pathlib import Path
import struct
import tempfile

HERE = Path(__file__).resolve().parent


def require(ok, message):
    if not ok:
        raise ValueError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def load(path):
    data = path.read_bytes()
    return gzip.decompress(data) if path.suffix == ".gz" else data


def files(root):
    result = {}
    for path in root.rglob("*"):
        relative = path.relative_to(root)
        if {"target", ".git", "__pycache__"}.intersection(relative.parts):
            continue
        require(not path.is_symlink() and (path.is_file() or path.is_dir()), "special canonical path: " + str(relative))
        if path.is_file():
            result[relative.as_posix()] = sha(path.read_bytes())
    return result


def verify(root, source=None):
    root = Path(root).resolve()
    source = Path(source or root / "programs/pump-fees").resolve()
    selection = json.loads((HERE / "fees-selection.json").read_text())
    require(files(source) == selection["canonical_inputs"], "canonical Fees input set or hashes differ")
    build = HERE / selection["build_directory"]
    receipt_bytes = load(build / "result.json.gz")
    require(sha(receipt_bytes) == selection["result_json_sha256"], "build receipt binding")
    receipt = json.loads(receipt_bytes)
    require(receipt["returncode"] == receipt["clean_returncode"] == 0, "build or local clean failed")
    for field in ("source_unchanged", "macro_unchanged", "sdk_libraries_unchanged", "registry_unchanged", "exact_symbols_equal", "exact_candidate_equal"):
        require(receipt[field] is True, "build failed: " + field)
    require(receipt["fresh_local_crate_compilations"] == {"pump-fun-fees-candidate": 1, "pump-fees-math": 1}, "local crates were not freshly compiled")
    require(not receipt["stack_diagnostics"] and receipt["original_executable_is_build_input"] is False, "build recipe changed")
    for flag in ("--network", "none", "--offline", "--locked", "sbpf-solana-solana"):
        require(flag in receipt["command"], "compiler command missing " + flag)
    controller = source / "build_exact.py"
    require(sha(controller.read_bytes()) == receipt["controller_script_sha256"], "canonical controller differs from executed controller")
    spec = importlib.util.spec_from_file_location("current_exact_fees_builder", controller)
    builder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(builder)
    with tempfile.TemporaryDirectory(prefix="fees-current-source-") as td:
        workspace, mapping, expected = builder.stage(Path(td))
        require(mapping == receipt["input_mapping"] and expected == receipt["qualified_source_inputs"], "canonical to qualified input mapping")
        require(builder.inventory(workspace) == receipt["source_inputs"], "staged current source differs from compiled inputs")
    candidate, symbols = load(build / "candidate.so.gz"), load(build / "symbols.so.gz")
    literal_aliases = []
    for name, expected in (("candidate.so", candidate), ("symbols.so", symbols)):
        if (build / name).exists():
            require((build / name).read_bytes() == expected, "literal ELF alias differs: " + name)
            literal_aliases.append(name)
    require(sha(candidate) == receipt["candidate_sha256"] == selection["candidate_sha256"], "candidate binding")
    require(sha(symbols) == receipt["symbols_sha256"] == selection["symbols_sha256"], "symbols binding")
    original = (root / "evidence/original/pump_fees/deployed.so").read_bytes()
    require(sha(original) == selection["original_sha256"], "captured original changed")
    offset = struct.unpack_from("<Q", original, 40)[0]
    entry_size, count = struct.unpack_from("<HH", original, 58)
    extent = offset + entry_size * count
    require(extent == len(candidate) == 873256 and candidate == original[:extent] and not any(original[extent:]), "meaningful ELF identity or allocation boundary")
    log = load(build / "build.log.gz").decode()
    require(sha(log.encode()) == selection["build_log_sha256"], "build log binding")
    require("Stack offset" not in log and "exceeded max offset" not in log, "stack diagnostic")
    for name in ("pump-fun-fees-candidate", "pump-fees-math"):
        require(sum("Compiling " + name + " " in line for line in log.splitlines()) == 1, "fresh compile log: " + name)
    repeat_selection = selection["repeat_build"]
    require(repeat_selection["build_directory"] != selection["build_directory"], "repeat build must be independent")
    repeat_build = HERE / repeat_selection["build_directory"]
    repeat_bytes = load(repeat_build / "result.json.gz")
    require(sha(repeat_bytes) == repeat_selection["result_json_sha256"], "repeat build receipt binding")
    repeat = json.loads(repeat_bytes)
    require(repeat["returncode"] == repeat["clean_returncode"] == 0 and
            repeat["target_initially_empty"] is True and "dependency_reuse" not in repeat,
            "repeat build needs a clean empty target")
    for field in ("source_unchanged", "macro_unchanged", "sdk_libraries_unchanged", "registry_unchanged", "exact_symbols_equal", "exact_candidate_equal"):
        require(repeat[field] is True, "repeat build failed: " + field)
    for field in ("input_mapping", "source_inputs", "controller_script_sha256", "qualified_source_inputs", "sdk_tools", "target_libraries", "macro_inputs", "registry_inputs", "objcopy_sha256", "environment"):
        require(repeat[field] == receipt[field], "repeat source/tool/registry input differs: " + field)
    require(repeat["fresh_local_crate_compilations"] == receipt["fresh_local_crate_compilations"] and
            not repeat["stack_diagnostics"] and repeat["original_executable_is_build_input"] is False,
            "repeat fresh local compilation incomplete")
    image = "solanafoundation/solana-verifiable-build@sha256:6c73adc767ee7ff212f2532d4695472b12f3d4ac20aea3db22b89d8c614dac50"
    require(repeat["command"][repeat["command"].index(image):] == receipt["command"][receipt["command"].index(image):],
            "repeat compiler recipe differs")
    require(repeat["command"][repeat["command"].index("--network")+1] == "none", "repeat build network isolation")
    repeat_log = load(repeat_build / "build.log.gz")
    require(sha(repeat_log) == repeat_selection["build_log_sha256"], "repeat compiler log binding")
    text = repeat_log.decode()
    require("Stack offset" not in text and "exceeded max offset" not in text, "repeat stack diagnostic")
    for name in ("pump-fun-fees-candidate", "pump-fees-math"):
        require(sum("Compiling " + name + " " in line for line in text.splitlines()) == 1, "repeat fresh compile log: " + name)
    for name, expected in (("candidate.so", candidate), ("symbols.so", symbols)):
        require(load(repeat_build / (name + ".gz")) == expected and (repeat_build / name).read_bytes() == expected,
                "repeat complete ELF differs: " + name)
    require(repeat["candidate_sha256"] == selection["candidate_sha256"] and
            repeat["symbols_sha256"] == selection["symbols_sha256"], "repeat ELF receipt binding")
    return {"status": "PASS_CURRENT_CANONICAL_FEES585_EXACT", "canonical_inputs": len(selection["canonical_inputs"]),
            "qualified_workspace_inputs": len(mapping), "fresh_local_crates": 2,
            "maintained_source_builds": 2, "second_build_target_initially_empty": True,
            "repeat_complete_compiler_and_stripped_elf_equal": True,
            "candidate_sha256": sha(candidate), "symbols_sha256": sha(symbols),
            "meaningful_elf_bytes": extent, "meaningful_elf_equal": True,
            "allocation_tail_bytes_not_emitted": len(original)-extent,
            "literal_elf_aliases_checked": literal_aliases,
            "historical_source_or_recipe_provenance_claimed": False,
            "compiler_executed_by_verifier": False, "target_executed_by_verifier": False}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=HERE.parents[1])
    parser.add_argument("--source-root", type=Path)
    args = parser.parse_args()
    print(json.dumps(verify(args.repo, args.source_root), indent=2))
