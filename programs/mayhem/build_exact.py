#!/usr/bin/env python3
"""Build current Mayhem bytes with explicitly normalized Cargo linker locators."""
import argparse
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys

HERE = Path(__file__).resolve().parent


def require(ok, message):
    if not ok:
        raise ValueError(message)


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def stage(output, repository, source):
    support = repository / "research/mayhem-linker-locators-20261028"
    pins = json.loads((support / "inputs.json").read_text())
    parent_path = repository / pins["source_builder_parent"]
    require(sha(parent_path) == pins["source_builder_parent_sha256"], "sealed source stager changed")
    require(sha(repository / pins["parent_script"]) == pins["parent_script_sha256"], "sealed linker script changed")
    require(sha(support / "ordered-native.ld") == pins["derived_script_sha256"], "derived linker script changed")
    spec = importlib.util.spec_from_file_location("sealed_mayhem_source_stager", parent_path)
    parent = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(parent)
    # Explicit source locator adaptation: the unchanged stager reads live
    # canonical/proposal bytes through HERE, then validates all 67 raw inputs.
    parent.HERE = source
    recipe, record = parent.stage(output, repository)
    script = recipe / "controller/ordered-native.ld"
    require(sha(script) == pins["parent_script_sha256"], "staged parent script changed")
    script.write_bytes((support / "ordered-native.ld").read_bytes())
    record["stager_script_sha256"] = record.pop("wrapper_sha256")
    record["wrapper_sha256"] = sha(Path(__file__))
    record["source_entrypoint_sha256"] = sha(source / "build_exact.py")
    record["linker_locator_transform"] = {"parent_sha256": pins["parent_script_sha256"],
        "derived_sha256": pins["derived_script_sha256"], "changed_selectors": pins["changed_selectors"],
        "input_sections_or_order_changed": False, "cargo_artifact_filename_digests_only": True}
    record["copied_recipe_inputs"] = {p.relative_to(recipe).as_posix(): sha(p)
                                      for p in sorted(recipe.rglob("*")) if p.is_file()}
    (output / "source-mapping.json").write_text(json.dumps(record, indent=2) + "\n")
    return recipe, record


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, required=True)
    parser.add_argument("--source-root", type=Path)
    parser.add_argument("--stage-only", action="store_true")
    parser.add_argument("--output", type=Path, required=True)
    for name in ("sdk", "target-sysroot", "vendor", "msvc", "windows-sdk"):
        parser.add_argument("--" + name, type=Path)
    parser.add_argument("--kit-version", default="10.0.26100.0")
    args = parser.parse_args()
    repository, source, output = args.repo.resolve(), (args.source_root or HERE).resolve(), args.output.resolve()
    require(args.stage_only or os.name == "nt", "actual exact Mayhem build requires Windows")
    recipe, record = stage(output, repository, source)
    if args.stage_only:
        print("Validated 67 current source files and explicit linker locator transformation")
        return
    command = [sys.executable, "-I", "-B", str(recipe / "build.py")]
    for name in ("sdk", "target-sysroot", "vendor", "msvc", "windows-sdk"):
        value = getattr(args, name.replace("-", "_"))
        require(value is not None, "all pinned build inputs required")
        command += ["--" + name, str(value.resolve())]
    command += ["--kit-version", args.kit_version, "--output", str(output / "build")]
    (output / "launch.json").write_text(json.dumps({"command": command,
        "mapping_sha256": sha(output / "source-mapping.json"), "controller_sha256": sha(Path(__file__))}, indent=2) + "\n")
    with (output / "driver.log").open("wb") as log:
        result = subprocess.run(command, stdout=log, stderr=subprocess.STDOUT)
    require(result.returncode == 0, "fresh host/target exact recipe failed; retained receipts are not promoted")
    require(all(sha(source / name) == value for name, value in record["canonical_inputs"].items()), "current source changed during build")
    expected = {"symbols.so": "7b15bb1e5c7c9c53041322fa64d4a420906fffd96ff97a55d70d627bcb854960",
                "candidate-v154-strip.so": "9af9e3b1cbc9d89340af4d9d46e4c88d3dc2fc67e0090f9370047d97532ff09d"}
    for name, digest in expected.items():
        require(sha(output / "build/target" / name) == digest, "complete ELF differs: " + name)
    (output / "current-build-result.json").write_text(json.dumps({"status": "SUCCEEDED", "source_files": 67,
        "source_unchanged": True, "outputs": expected, "target_executions": 0,
        "meaningful_elf_bytes": 775416, "allocation_tail_emitted": False,
        "linker_locator_transform": record["linker_locator_transform"]}, indent=2) + "\n")
    print("Exact complete compiler and ordinary stripped Mayhem ELF reproduced")


if __name__ == "__main__":
    main()
