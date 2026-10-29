#!/usr/bin/env python3
"""Seed every authenticated registry archive before the sealed preparer runs."""
import argparse
import gzip
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tomllib

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]


def require(ok, message):
    if not ok:
        raise ValueError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def seed(output, pins):
    bundle = (HERE / pins["bundle_file"]).read_bytes()
    require(len(bundle) == pins["bundle_bytes"] and sha(bundle) == pins["bundle_sha256"], "registry archive bundle differs")
    expected = {r["directory"] + ".crate": r for r in pins["packages"]}
    require(len(expected) == 215, "registry package inventory incomplete")
    downloads = output / "downloads"
    downloads.mkdir(parents=True, exist_ok=False)
    seen = set()
    with tarfile.open(fileobj=io.BytesIO(bundle), mode="r:gz") as tar:
        for member in tar:
            name = member.name
            require(member.isfile() and name in expected and name not in seen, "unexpected registry bundle member")
            require(Path(name).name == name and ":" not in name and "\\" not in name, "unsafe registry cache path")
            data = tar.extractfile(member).read()
            row = expected[name]
            require(len(data) == row["archive_bytes"] and sha(data) == row["archive_sha256"], "registry archive differs: " + name)
            with tarfile.open(fileobj=io.BytesIO(data), mode="r:gz") as crate:
                metadata = tomllib.loads(crate.extractfile(row["directory"] + "/Cargo.toml").read().decode())["package"]
            require(metadata["name"] == row["name"] and metadata["version"] == row["version"] and
                    row["directory"] == row["name"] + "-" + row["version"], "authenticated package name/version differs")
            (downloads / name).write_bytes(data)
            seen.add(name)
    require(seen == set(expected), "registry archive bundle incomplete")
    # The sealed complete() may only run once every exact cache input exists.
    for name, row in expected.items():
        path = downloads / name
        require(path.is_file() and not path.is_symlink() and sha(path.read_bytes()) == row["archive_sha256"], "registry cache input missing before sealed complete")
    record = {"schema": "MAYHEM_OFFLINE_CACHE_SEED_V1", "bundle_sha256": pins["bundle_sha256"],
              "archives_seeded": 215, "archives": {n: row["archive_sha256"] for n, row in expected.items()},
              "package_names_versions_from_authenticated_Cargo_toml": True,
              "registry_network_fallback_allowed": False, "compiler_executed": False,
              "adapter_sha256": sha(Path(__file__).read_bytes())}
    (output / "offline-vendor.json").write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8", newline="\n")
    return expected


def cache_only_download(parent_download, expected):
    def download(url, path, digest):
        if url.startswith("https://static.crates.io/"):
            require(path.name in expected and digest == expected[path.name]["archive_sha256"] and
                    path.is_file() and not path.is_symlink() and sha(path.read_bytes()) == digest,
                    "registry network fallback forbidden; cache input changed")
            return path
        return parent_download(url, path, digest)
    return download


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--native-inputs-sha256", default="")
    parser.add_argument("--check-native-tools-only", action="store_true")
    args = parser.parse_args()
    pins = json.loads((HERE / "inputs.json").read_text())
    for name, digest in pins["sealed_dependencies"].items():
        require(sha((REPO / name).read_bytes()) == digest, "sealed preparation dependency changed: " + name)
    path = REPO / "research/all-contract-completion-20261028/prepare_mayhem_windows_inputs.py"
    spec = importlib.util.spec_from_file_location("sealed_windows_preparer", path)
    parent = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(parent)
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    parent.native_inputs(output, args.native_inputs_sha256.lower())
    if not args.check_native_tools_only:
        expected = seed(output, pins)
        records = parent.read(parent.RECIPE / "vendor-inputs.json")["packages"]
        require({r["directory"] + ".crate": r["package_sha256"] for r in records} ==
                {name: row["archive_sha256"] for name, row in expected.items()}, "cache set differs from sealed vendor selection")
        # Explicit transport adaptation: SDK downloads use the sealed function;
        # registry requests are cache-only, including the three malformed old
        # inferred URLs. No registry package name is inferred for transport.
        parent.download = cache_only_download(parent.download, expected)
        parent.complete(output)
    print("Verified native pin and exact offline registry cache; compiler recipe unchanged")


if __name__ == "__main__":
    main()
