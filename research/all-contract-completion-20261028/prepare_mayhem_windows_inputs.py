#!/usr/bin/env python3
"""Prepare checksum-pinned inputs for the existing exact Windows Mayhem recipe.

No compiler is executed. The first native preflight records the installed
MSVC/Windows-Kit byte manifest; a build run must supply that exact manifest hash.
The source packet pins SDKs, cl/link and all registry archive/checksum contents.
"""
import argparse
import concurrent.futures
import gzip
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import tarfile
import urllib.request

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
RECIPE = REPO / "research/mayhem-fresh-host-20261028/controller"


def require(ok, message):
    if not ok:
        raise ValueError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def file_sha(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def read(path):
    data = path.read_bytes()
    return json.loads(gzip.decompress(data) if path.suffix == ".gz" else data)


def save(path, value):
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8", newline="\n")


def inventory(root, directories=None):
    result = {}
    for directory in directories or [root]:
        require(directory.is_dir(), "native input directory missing: " + str(directory))
        for path in sorted(directory.rglob("*")):
            if path.is_file():
                require(not path.is_symlink(), "symlinked native input")
                result[path.relative_to(root).as_posix()] = file_sha(path)
    return result


def native_inputs(output, expected):
    require(os.name == "nt", "native MSVC/Windows SDK preflight requires Windows")
    tools = {Path(name.replace("\\", "/")).name:digest for name,digest in read(RECIPE / "host-tools.json").items()}
    candidates = []
    for base in (Path("C:/Program Files/Microsoft Visual Studio"), Path("C:/Program Files (x86)/Microsoft Visual Studio")):
        if base.exists():
            candidates += list(base.glob("*/*/VC/Tools/MSVC/*"))
    observations, matches = [], []
    for path in sorted(set(candidates)):
        files = {name:path / "bin/Hostx64/x64" / name for name in ("cl.exe", "link.exe")}
        if not all(p.is_file() for p in files.values()):
            continue
        hashes = {name:file_sha(p) for name,p in files.items()}
        observations.append({"path":str(path), "tools":hashes})
        if all(hashes[name] == tools[name] for name in hashes):
            matches.append(path)
    save(output / "msvc-candidates.json", observations)
    require(matches, "the exact qualified MSVC cl.exe/link.exe hashes are unavailable; no substitute is accepted")
    msvc = matches[0]
    kit = Path(os.environ.get("ProgramFiles(x86)", "C:/Program Files (x86)")) / "Windows Kits/10"
    version = "10.0.26100.0"
    native = {"msvc_files":inventory(msvc),
              "windows_kit_files":inventory(kit, [kit / name / version for name in ("bin", "Include", "Lib")])}
    raw = json.dumps(native, sort_keys=True, separators=(",", ":")).encode()
    digest = sha(raw)
    record = {"msvc":str(msvc), "windows_sdk":str(kit), "kit_version":version,
              "native_manifest_sha256":digest, "inputs":native,
              "cl_link_match_qualified_hashes":True,
              "scope":"MSVC and Windows Kit full byte inventory; the old recipe pins cl/link and kit version, this new cohort additionally pins these complete native input trees"}
    save(output / "native-inputs.json", record)
    require(re.fullmatch("[0-9a-f]{64}", expected or ""), "native byte manifest recorded; dispatch again with native_inputs_sha256=" + digest)
    require(digest == expected, "MSVC/Windows Kit byte manifest differs from requested pin")
    return record


def download(url, path, digest):
    if path.exists() and file_sha(path) == digest:
        return path
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".partial")
    request = urllib.request.Request(url, headers={"User-Agent":"pumpfun-source-exact-reconstruction"})
    with urllib.request.urlopen(request, timeout=120) as response, temporary.open("wb") as stream:
        while chunk := response.read(1024 * 1024):
            stream.write(chunk)
    require(file_sha(temporary) == digest, "download checksum differs: " + path.name)
    temporary.replace(path)
    return path


def extract_components(archive, output, rows):
    expected = {row["path"]:row for row in rows}
    seen = set()
    with tarfile.open(archive, mode="r|bz2") as tar:
        for member in tar:
            path = PurePosixPath(member.name)
            require(not path.is_absolute() and ".." not in path.parts and ":" not in member.name and "\\" not in member.name, "unsafe SDK member")
            choices = [path.as_posix()]
            if len(path.parts) > 1:
                choices.append(PurePosixPath(*path.parts[1:]).as_posix())
            names = [name for name in choices if name in expected]
            if not names:
                continue
            require(len(names) == 1 and member.isfile(), "nonregular/ambiguous SDK component")
            name = names[0]
            require(name not in seen, "duplicate SDK component")
            data = tar.extractfile(member).read()
            row = expected[name]
            require(len(data) == row["bytes"] and sha(data) == row["sha256"], "SDK component differs: " + name)
            target = output / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
            seen.add(name)
    require(seen == set(expected), "SDK component selection incomplete")


def vendor_package(blob, output, record):
    require(sha(blob) == record["package_sha256"], "registry archive differs")
    directory = record["directory"]
    require(directory and PurePosixPath(directory).name == directory and ":" not in directory and "\\" not in directory, "unsafe registry directory")
    contents = {}
    with tarfile.open(fileobj=io.BytesIO(blob), mode="r:gz") as tar:
        for member in tar:
            if member.isdir():
                continue
            require(member.isfile() and member.name.startswith(directory + "/"), "unsafe crate member")
            name = member.name[len(directory)+1:]
            path = PurePosixPath(name)
            require(name and not path.is_absolute() and ".." not in path.parts and ":" not in name and "\\" not in name and name not in contents, "unsafe crate path")
            contents[name] = tar.extractfile(member).read()
    require(len(contents) == record["file_count"], "registry file count differs: " + directory)
    checksums = {name:sha(data) for name,data in contents.items()}
    # Reconstruct a standard JSON encoding only when its bytes match the
    # qualified checksum-map hash. No source byte or file hash is substituted.
    matches = set()
    newline = record.get("checksum_file_newline", "\n")
    for value in ({"files":checksums, "package":record["package_sha256"]},
                  {"package":record["package_sha256"], "files":checksums}):
        for indent in (None, 2, 4):
            for separators in ((",", ":"), (",", ": "), None):
                encoded = json.dumps(value, ensure_ascii=False, sort_keys=False, indent=indent, separators=separators)
                for trailing in (False, True):
                    data = (encoded + ("\n" if trailing else "")).replace("\n", newline).encode()
                    if sha(data) == record["checksum_file_sha256"]:
                        matches.add(data)
    require(len(matches) == 1, "cannot reconstruct pinned vendor checksum map: " + directory)
    target = output / directory
    target.mkdir(parents=True, exist_ok=False)
    for name,data in contents.items():
        path = target / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
    (target / ".cargo-checksum.json").write_bytes(matches.pop())


def complete(output):
    sdk, target = read(RECIPE / "sdk-components.json.gz"), read(RECIPE / "target-components.json")
    downloads = output / "downloads"
    windows = download("https://github.com/anza-xyz/platform-tools/releases/download/v1.54/platform-tools-windows-x86_64.tar.bz2",
                       downloads / "windows-v154.tar.bz2", sdk["archive_sha256"])
    linux = download(target["asset"]["browser_download_url"], downloads / "linux-v154.tar.bz2", target["archive_sha256"])
    extract_components(windows, output / "sdk", sdk["files"])
    extract_components(linux, output / "target-sysroot", target["files"])
    records = read(RECIPE / "vendor-inputs.json")["packages"]
    def package(record):
        match = re.fullmatch(r"(.+)-(\d[^/]*)", record["directory"])
        require(match is not None, "invalid package directory")
        name, version = match.groups()
        archive = download("https://static.crates.io/crates/" + name + "/" + name + "-" + version + ".crate",
                           downloads / (record["directory"] + ".crate"), record["package_sha256"])
        vendor_package(archive.read_bytes(), output / "vendor", record)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(package, records))
    spec_path = RECIPE / "build.py"
    import importlib.util
    spec = importlib.util.spec_from_file_location("mayhem_prepared_controller", spec_path)
    controller = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(controller)
    require(controller.vendor_check(output / "vendor") == 215, "qualified vendor inventory")
    controller.pin(output / "sdk", sdk["files"])
    controller.pin(output / "target-sysroot", target["files"])
    save(output / "prepared-inputs.json", {"status":"READY", "sdk_archive_sha256":sdk["archive_sha256"],
        "linux_target_archive_sha256":target["archive_sha256"], "sdk_files":len(sdk["files"]),
        "target_files":len(target["files"]), "vendor_packages":215, "compiler_executed":False})


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--native-inputs-sha256", default="")
    parser.add_argument("--check-native-tools-only", action="store_true")
    args = parser.parse_args()
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    native_inputs(output, args.native_inputs_sha256.lower())
    if not args.check_native_tools_only:
        complete(output)
    print("Pinned Windows native inputs verified" + ("; SDK and vendor ready" if not args.check_native_tools_only else ""))
