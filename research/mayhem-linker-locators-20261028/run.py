#!/usr/bin/env python3
"""Run a new current-source Windows qualification and retain its actual evidence."""
import argparse
from datetime import datetime, timezone
import gzip
import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tarfile

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]


def require(ok, message):
    if not ok:
        raise ValueError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def save(path, value):
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8", newline="\n")


def source_archive(source, target):
    stream = io.BytesIO()
    with tarfile.open(fileobj=stream, mode="w") as tar:
        for path in sorted(source.rglob("*")):
            if path.is_file():
                member = tarfile.TarInfo(path.relative_to(source).as_posix())
                data = path.read_bytes()
                member.size = len(data)
                tar.addfile(member, io.BytesIO(data))
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(gzip.compress(stream.getvalue(), mtime=0))


def retain(output):
    """Keep receipts, compiler logs, fresh DLL and outputs, without build caches."""
    evidence = output / "evidence"
    evidence.mkdir(exist_ok=True)
    for parent in (output, output / "inputs", output / "native-postcheck", output / "build"):
        if not parent.exists():
            continue
        for path in parent.iterdir():
            if path.is_file() and path.suffix in (".json", ".log"):
                target = evidence / path.relative_to(output)
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(path, target)
    build = output / "build/build"
    for name in ("host", "target"):
        root = build / name
        if not root.exists():
            continue
        for path in root.iterdir():
            if path.is_file() and path.suffix in (".json", ".log", ".so"):
                target = evidence / path.relative_to(output)
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(path, target)
        for directory in ("wrapper-records", "link"):
            if (root / directory).exists():
                shutil.copytree(root / directory, evidence / root.relative_to(output) / directory)
        source = root / ("source" if name == "host" else "source/programs/mayhem")
        if source.is_dir():
            source_archive(source, evidence / root.relative_to(output) / "source.tar.gz")
    binding = build / "controller/historical-macro.json"
    if binding.is_file():
        target = evidence / "build/build/controller/historical-macro.json"
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(binding, target)
    macro = build / "host/target/release/anchor_attribute_program.dll"
    if macro.is_file():
        target = evidence / "build/build/host/anchor_attribute_program.dll.gz"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(gzip.compress(macro.read_bytes(), mtime=0))
    inventories = {}
    for path in sorted(evidence.rglob("*")):
        if path.is_file():
            inventories[path.relative_to(evidence).as_posix()] = {
                "bytes": path.stat().st_size, "sha256": sha(path.read_bytes())}
    save(evidence / "MANIFEST.json", inventories)


def run(args):
    require(os.name == "nt", "actual fresh Mayhem qualification requires Windows")
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=False)
    record = {"status": "STARTED", "compiler_executed": False,
              "target_executions": 0, "started_at": datetime.now(timezone.utc).isoformat(),
              "native_inputs_sha256_requested": args.native_inputs_sha256,
              "github_run_id": os.environ.get("GITHUB_RUN_ID"),
              "github_run_attempt": os.environ.get("GITHUB_RUN_ATTEMPT"),
              "github_sha": os.environ.get("GITHUB_SHA"),
              "runner_image_version": os.environ.get("ImageVersion"),
              "controller_sha256": sha(Path(__file__).read_bytes()),
              "transport_successor": "offline authenticated crate cache; source bytes unchanged",
              "linker_locator_recipe": "Cargo artifact filename digests normalized; CGU/section identities and ordering retained",
              "linker_driver_parent_sha256": "635fe89e8cd4c9fad0d23de6e89aac19a9acafcd9b0f491d0b7ff603503b3eb9",
              "parent_driver_sha256": "a29c931e36495c84fb4a44a859b3efa7e23246f7920e2af9ce31b5a155dd8d35"}
    try:
        source = REPO / "programs/mayhem"
        if not (source / "build_exact.py").is_file():
            source = REPO / "research/all-contract-completion-20261028/mayhem-proposal/source"
        record["source"] = source.relative_to(REPO).as_posix()
        preparer = REPO / "research/mayhem-offline-vendor-20261028/prepare.py"
        inputs = output / "inputs"
        command = [sys.executable, "-I", "-B", str(preparer), "--output", str(inputs),
                   "--native-inputs-sha256", args.native_inputs_sha256]
        record["prepare_command"] = command
        with (output / "prepare.log").open("wb") as log:
            prepared = subprocess.run(command, stdout=log, stderr=subprocess.STDOUT)
        require(prepared.returncode == 0, "input preparation failed; see prepare.log/native-inputs.json/msvc-candidates.json")
        native = json.loads((inputs / "native-inputs.json").read_text())
        build_script = source / "build_exact.py" if source == REPO / "programs/mayhem" else HERE / "build_exact.py"
        build_command = [sys.executable, "-I", "-B", str(build_script),
                         "--source-root", str(source),
                         "--repo", str(REPO), "--output", str(output / "build"),
                         "--sdk", str(inputs / "sdk"),
                         "--target-sysroot", str(inputs / "target-sysroot/rust"),
                         "--vendor", str(inputs / "vendor"),
                         "--msvc", native["msvc"], "--windows-sdk", native["windows_sdk"],
                         "--kit-version", native["kit_version"]]
        record.update(build_command=build_command, compiler_launch_attempted=True, compiler_executed=None)
        with (output / "build.log").open("wb") as log:
            built = subprocess.run(build_command, stdout=log, stderr=subprocess.STDOUT)
        require(built.returncode == 0, "fresh host+target build failed; see build.log and retained build receipts")
        host = json.loads((output / "build/build/host/result.json").read_text())
        target = json.loads((output / "build/build/target/result.json").read_text())
        require(host["status"] == "SUCCEEDED" and host["returncode"] == 0 and
                host["compilations"] == 42 and host["host_dependency_files"] == 61 and
                host["source_unchanged"] and host["supplements_unchanged"] and
                host["vendor_rechecked"], "fresh host receipt incomplete")
        require(target["status"] == "SUCCEEDED" and target["returncode"] == 0 and
                target["source_unchanged"] and target["root_invocations"] == 1 and
                target["historical_macro_dependencies_unchanged"], "fresh target receipt incomplete")
        target_commands = [line for line in (output / "build/build/target/stderr.log").read_text(errors="replace").splitlines()
                           if "Running `" in line and "--crate-name " in line]
        require(len(target_commands) == 163, "fresh target Cargo command inventory differs")
        candidate = (output / "build/build/target/candidate-v154-strip.so").read_bytes()
        original = gzip.decompress((REPO / "research/mayhem-fresh-host-20261028/reference/original-allocation.so.gz").read_bytes())
        require(len(candidate) == 775416 and len(original) == 777408 and
                candidate == original[:775416] and not any(original[775416:]),
                "meaningful ELF differs or allocation tail is nonzero")
        post_command = [sys.executable, "-I", "-B", str(preparer),
                        "--output", str(output / "native-postcheck"),
                        "--native-inputs-sha256", args.native_inputs_sha256,
                        "--check-native-tools-only"]
        with (output / "native-postcheck.log").open("wb") as log:
            post = subprocess.run(post_command, stdout=log, stderr=subprocess.STDOUT)
        require(post.returncode == 0, "native MSVC/Windows Kit byte trees changed during build")
        result = json.loads((output / "build/current-build-result.json").read_text())
        record.update(status="SUCCEEDED", compiler_executed=True, meaningful_elf_equal=True, meaningful_elf_bytes=775416,
                      allocation_tail_bytes_not_emitted=1992, native_byte_trees_unchanged=True,
                      host_compilations=42, target_cargo_compilations=163,
                      outputs=result["outputs"], historical_source_provenance_claimed=False,
                      canonical_promotion_performed=False)
    except Exception as error:
        record.update(status="FAILED", error=repr(error))
        raise
    finally:
        record["finished_at"] = datetime.now(timezone.utc).isoformat()
        save(output / "qualification.json", record)
        retain(output)
        print(json.dumps({key: value for key, value in record.items() if key not in ("prepare_command", "build_command")}, indent=2), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--native-inputs-sha256", default="")
    run(parser.parse_args())
