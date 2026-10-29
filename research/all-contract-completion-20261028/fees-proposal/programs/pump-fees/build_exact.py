#!/usr/bin/env python3
"""Build canonical Fees source with the qualified reconstructed Linux recipe.

The caller supplies an existing pinned SDK, registry and cached container image.
Only task-owned staging, Cargo-home, target and output directories are writable.
The original captured executable is not a compiler or linker input.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import time
import tomllib

HERE = Path(__file__).resolve().parent
IMAGE = "solanafoundation/solana-verifiable-build@sha256:6c73adc767ee7ff212f2532d4695472b12f3d4ac20aea3db22b89d8c614dac50"
CW = "/work/src/linux-e9751bde"
MACRO = "/work/next637/vendor/used-public"
TOOLS = {
    "rust/bin/cargo": "d28444578306fe5a4f40524331411340123004e9e6556322fcabdbe351fe265d",
    "rust/bin/rustc": "c8807b7ebede8578ac5a257ea333780f9d89bd356064fd8184af7e996cb71a97",
    "rust/lib/rustlib/x86_64-unknown-linux-gnu/bin/rust-lld": "f28db3647fcf67bd47f012a1c47fe679f5787a4e2bf9cd5b6fe4914b10622bda",
}
EXPECTED_SYMBOLS = "7ec99a6915bcb9245a2d5199996376a76651fa893c71e455b189cf59428f4e66"
EXPECTED_CANDIDATE = "5b6ceda57863f0dcc3e0e3623052f8342c2c81883379699e71d7ed5383cb3dcf"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def require(ok, message):
    if not ok:
        raise ValueError(message)


def inventory(root):
    return {p.relative_to(root).as_posix(): sha(p) for p in sorted(root.rglob("*")) if p.is_file()}


def stage(output):
    expected = json.loads((HERE / "exact/qualified-source-inputs.json").read_text())
    workspace = output / "source"
    workspace.mkdir()
    mapping = {}
    for name, digest in expected.items():
        if name == "Cargo.toml":
            source = HERE / "exact/workspace-Cargo.toml"
        elif name == "ordered.ld":
            source = HERE / "exact/ordered.ld"
        elif name == "programs/pump-fees/Cargo.toml":
            source = HERE / "exact/package-Cargo.toml"
            # This is the sole package-manifest path adaptation in canonical source.
            canonical = tomllib.loads((HERE / "Cargo.toml").read_text())
            qualified = tomllib.loads(source.read_text())
            canonical["dependencies"]["pump-fees-math"]["path"] = "../../pump-fees-math"
            require(canonical == qualified, "unexpected canonical package manifest")
        elif name == "programs/pump-fees/README.md":
            source = HERE / "exact/research-README.md"
        elif name.startswith("programs/pump-fees/"):
            source = HERE / name[len("programs/pump-fees/"):]
        else:
            source = HERE / name
        require(source.is_file() and not source.is_symlink() and sha(source) == digest, "canonical input changed: " + name)
        target = workspace / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
        mapping[name] = {"canonical": source.relative_to(HERE).as_posix(), "sha256": digest}
    # The qualified recipe uses this explicit out-of-workspace macro locator;
    # Cargo includes its relative path in package metadata and linker selectors.
    manifest = workspace / "Cargo.toml"
    text = manifest.read_text()
    old = 'anchor-attribute-program = { path = "vendor/used-public" }'
    require(text.count(old) == 1, "unexpected macro patch")
    manifest.write_text(text.replace(old, 'anchor-attribute-program = { path = "' + MACRO + '" }'))
    return workspace, mapping, expected


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sdk", type=Path, required=True)
    parser.add_argument("--registry", type=Path, required=True)
    parser.add_argument("--objcopy", type=Path, required=True, help="pinned installed v1.52 llvm-objcopy")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--dependency-target", type=Path,
                        help="reuse an owned target only with its matching recorded input provenance")
    parser.add_argument("--dependency-provenance", type=Path)
    args = parser.parse_args()
    sdk, registry, objcopy = args.sdk.resolve(), args.registry.resolve(), args.objcopy.resolve()
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=False)
    for name, digest in TOOLS.items():
        require(sha(sdk / name) == digest, "SDK tool mismatch: " + name)
    workspace, mapping, expected = stage(output)
    require(bool(args.dependency_target) == bool(args.dependency_provenance), "dependency reuse needs both target and input provenance")
    target, cargo = (args.dependency_target.resolve() if args.dependency_target else output / "target"), output / "cargo-home"
    if args.dependency_target:
        require(target.is_dir(), "missing owned dependency target")
    else:
        target.mkdir()
    cargo.mkdir()
    before = inventory(workspace)
    sdk_libraries = inventory(sdk / "rust/lib/rustlib/sbpf-solana-solana/lib")
    require(sdk_libraries, "missing target libraries")
    macro_before = inventory(HERE / "vendor/used-public")
    lock = tomllib.loads((workspace / "Cargo.lock").read_text())
    registry_inputs = {}
    for package in lock["package"]:
        if not package.get("source", "").startswith("registry+"):
            continue
        name = package["name"] + "-" + package["version"]
        path = registry / "src/index.crates.io-6f17d22bba15001f" / name
        require(path.is_dir(), "missing offline registry package: " + name)
        registry_inputs[name] = inventory(path)
    wrapper = workspace / "linker.sh"
    wrapper.write_text('''#!/bin/bash
set -e
args=("$@")
for ((i=0; i<${#args[@]}; i++)); do
  if [[ "${args[i]}" == "-T" || "${args[i]}" == "--script" ]]; then
    args[i+1]=/work/src/linux-e9751bde/ordered.ld
  elif [[ "${args[i]}" == --script=* ]]; then
    args[i]=--script=/work/src/linux-e9751bde/ordered.ld
  fi
done
printf '%s\\n' "${args[@]}" > /work/src/linux-e9751bde/effective-link-args.txt
exec /work/sdk/rust/lib/rustlib/x86_64-unknown-linux-gnu/bin/rust-lld "${args[@]}"
''')
    wrapper.chmod(0o755)
    env = {"PATH": "/work/sdk/rust/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
           "RUSTC": "/work/sdk/rust/bin/rustc", "CC": "/work/sdk/llvm/bin/clang", "AR": "/work/sdk/llvm/bin/llvm-ar",
           "CARGO_HOME": "/cargo", "CARGO_TARGET_DIR": "/work/targets/slot0", "CARGO_BUILD_JOBS": "2",
           "CARGO_NET_OFFLINE": "true", "RUSTFLAGS": "-Zremap-cwd-prefix="}
    command = ["podman", "run", "--rm", "--pull=never", "--platform", "linux/amd64", "--network", "none",
               "--entrypoint=/usr/bin/env", "-v", f"{workspace}:{CW}:rw", "-v", f"{sdk}:/work/sdk:ro",
               "-v", f"{HERE / 'vendor/used-public'}:{MACRO}:ro", "-v", f"{registry}:/cargo/registry:ro",
               "-v", f"{cargo}:/cargo:rw", "-v", f"{target}:/work/targets/slot0:rw", "-w", CW]
    for key, value in env.items():
        command += ["-e", key + "=" + value]
    command += [IMAGE, "/work/sdk/rust/bin/cargo", "rustc", "--verbose", "--manifest-path", CW + "/programs/pump-fees/Cargo.toml",
                "--release", "--target", "sbpf-solana-solana", "--locked", "--offline", "--jobs", "2", "--lib", "--",
                "--remap-path-prefix=" + CW + "/programs/pump-fees/src/../../../pump-fees-math/=pump-fees-math/",
                "--remap-path-prefix=" + CW + "/pump-fees-math/=pump-fees-math/",
                "--remap-path-prefix=programs/pump-fees/src/../../../pump-fees-math/=pump-fees-math/",
                "-C", "link-arg=-Map=" + CW + "/link.map", "-C", "linker=" + CW + "/linker.sh"]
    receipt = {"scope": "Fresh local-crate compilation through explicit qualified-workspace staging; reconstructed identity, not historical provenance",
               "command": command, "environment": env, "input_mapping": mapping, "source_inputs": before,
               "controller_script_sha256": sha(Path(__file__)),
               "qualified_source_inputs": expected, "sdk_tools": TOOLS, "target_libraries": sdk_libraries,
               "macro_inputs": macro_before, "registry_inputs": registry_inputs, "objcopy_sha256": sha(objcopy),
               "target_initially_empty": not any(target.iterdir()), "original_executable_is_build_input": False}
    if args.dependency_target:
        previous = json.loads(args.dependency_provenance.read_text())
        for key in ("source_inputs", "sdk_tools", "target_libraries", "macro_inputs", "registry_inputs", "objcopy_sha256"):
            require(previous[key] == receipt[key], "dependency input provenance changed: " + key)
        receipt["dependency_reuse"] = {"target": str(target), "input_provenance": str(args.dependency_provenance.resolve()),
                                      "input_provenance_sha256": sha(args.dependency_provenance),
                                      "prior_target_initially_empty": previous["target_initially_empty"],
                                      "artifacts_before": inventory(target),
                                      "all_recorded_source_tool_registry_inputs_equal": True}
    (output / "launch.json").write_text(json.dumps(receipt, indent=2) + "\n")
    clean = command[:command.index(IMAGE)+1] + ["/work/sdk/rust/bin/cargo", "clean", "--manifest-path", CW + "/programs/pump-fees/Cargo.toml",
                                               "--release", "--target", "sbpf-solana-solana", "--offline",
                                               "-p", "pump-fun-fees-candidate", "-p", "pump-fees-math"]
    with (output / "clean.log").open("wb") as log:
        cleaned = subprocess.run(clean, stdout=log, stderr=subprocess.STDOUT)
    receipt["clean_command"] = clean
    receipt["clean_returncode"] = cleaned.returncode
    require(cleaned.returncode == 0, "local crate clean failed")
    started = time.monotonic()
    with (output / "build.log").open("wb") as log:
        run = subprocess.run(command, stdout=log, stderr=subprocess.STDOUT)
    receipt.update(returncode=run.returncode, seconds=time.monotonic()-started)
    receipt["source_unchanged"] = all((workspace / name).is_file() and sha(workspace / name) == digest for name, digest in before.items())
    receipt["macro_unchanged"] = inventory(HERE / "vendor/used-public") == macro_before
    receipt["sdk_libraries_unchanged"] = inventory(sdk / "rust/lib/rustlib/sbpf-solana-solana/lib") == sdk_libraries
    receipt["registry_unchanged"] = all(inventory(registry / "src/index.crates.io-6f17d22bba15001f" / name) == files for name, files in registry_inputs.items())
    if run.returncode == 0:
        shutil.copy2(target / "sbpf-solana-solana/release/pump_fees_candidate.so", output / "symbols.so")
        subprocess.run([str(objcopy), "--strip-all", str(output / "symbols.so"), str(output / "candidate.so")], check=True)
        receipt.update(symbols_sha256=sha(output / "symbols.so"), candidate_sha256=sha(output / "candidate.so"))
        receipt["exact_symbols_equal"] = receipt["symbols_sha256"] == EXPECTED_SYMBOLS
        receipt["exact_candidate_equal"] = receipt["candidate_sha256"] == EXPECTED_CANDIDATE
        receipt["candidate_bytes"] = (output / "candidate.so").stat().st_size
        receipt["stack_diagnostics"] = [line for line in (output / "build.log").read_text().splitlines() if "exceeded max offset" in line or "Stack offset" in line]
        receipt["fresh_local_crate_compilations"] = {name:sum("Compiling " + name + " " in line for line in (output / "build.log").read_text().splitlines()) for name in ("pump-fun-fees-candidate", "pump-fees-math")}
    (output / "result.json").write_text(json.dumps(receipt, indent=2) + "\n")
    print(json.dumps({key:receipt[key] for key in ("returncode", "seconds", "source_unchanged", "target_initially_empty", "exact_symbols_equal", "exact_candidate_equal", "candidate_sha256") if key in receipt}, indent=2))
    require(run.returncode == 0 and receipt["source_unchanged"] and receipt["macro_unchanged"] and receipt["sdk_libraries_unchanged"] and receipt["registry_unchanged"], "build/input failure")
    require(receipt["exact_symbols_equal"] and receipt["exact_candidate_equal"] and not receipt["stack_diagnostics"], "exact reconstruction did not reproduce")
    require(all(count == 1 for count in receipt["fresh_local_crate_compilations"].values()), "both local crates must freshly compile once")


if __name__ == "__main__":
    main()
