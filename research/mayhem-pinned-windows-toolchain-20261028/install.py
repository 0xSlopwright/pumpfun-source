#!/usr/bin/env python3
"""Install the fixed Mayhem MSVC cohort; do not execute a source compiler."""
import argparse
from datetime import datetime, timezone
import gzip
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import time
import urllib.request
import zipfile

HERE = Path(__file__).resolve().parent


def require(ok, message):
    if not ok:
        raise ValueError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def save(path, data):
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8", newline="\n")


def download(url, path, allowed):
    require(url.startswith("https://"), "HTTPS input required")
    with urllib.request.urlopen(url, timeout=180) as response:
        data = response.read()
    require(sha(data) in allowed, "download differs from admitted bytes: " + path.name)
    path.write_bytes(data)
    return data


def validate_catalog(channel, catalog, pins):
    c, d = json.loads(channel), json.loads(catalog)
    require(c["info"]["productDisplayVersion"] == d["info"]["productDisplayVersion"] == "17.14.40", "fixed catalog cohort changed")
    item = next(x for x in c["channelItems"] if x["id"] == "Microsoft.VisualStudio.Manifests.VisualStudio")
    require(item["payloads"][0]["url"] == pins["catalog"]["url"] and
            item["payloads"][0]["sha256"] == pins["catalog"]["sha256"], "fixed channel catalog locator changed")
    package = next(x for x in d["packages"] if x["id"] == "Microsoft.VC.14.44.17.14.Tools.HostX64.TargetX64.base")
    require(package["version"] == pins["tools_package_version"] == "14.44.35228" and
            package["payloads"][0] == pins["tools_payload"], "qualified compiler payload changed")


def payload_files(archive, pins):
    prefix = "Contents/VC/Tools/MSVC/14.44.35207/"
    files = {}
    with zipfile.ZipFile(archive) as zipped:
        for name in zipped.namelist():
            if name.startswith(prefix) and not name.endswith("/"):
                relative = name[len(prefix):]
                require(relative and ":" not in relative and "\\" not in relative and
                        not relative.startswith("/") and ".." not in relative.split("/") and relative not in files,
                        "unsafe compiler payload member")
                data = zipped.read(name)
                files[relative] = {"bytes": len(data), "sha256": sha(data)}
    require(files == pins["tools_payload_files"], "compiler payload byte inventory differs")
    require(files["bin/Hostx64/x64/cl.exe"]["sha256"] == pins["exact_cl_sha256"] and
            files["bin/Hostx64/x64/link.exe"]["sha256"] == pins["exact_link_sha256"], "qualified cl/link members differ")
    return files


def command(bootstrap, path, pins):
    # Installation and update channel locators are both fixed; the catalog
    # locator is explicit too. There is no evergreen/latest channel fallback.
    return [str(bootstrap), "--quiet", "--wait", "--norestart", "--nocache", "--noUpdateInstaller",
            "--installPath", str(path), "--installChannelUri", pins["channel"]["url"],
            "--channelUri", pins["channel"]["url"], "--installCatalogUri", pins["catalog"]["url"],
            "--add", "Microsoft.VisualStudio.Component.VC.Tools.x86.x64"]


def check_installed(root, expected):
    actual = {}
    for name, record in expected.items():
        path = root / name
        require(path.is_file() and not path.is_symlink(), "installed compiler member absent: " + name)
        actual[name] = {"bytes": path.stat().st_size, "sha256": sha(path.read_bytes())}
        require(actual[name] == record,
                "installed compiler member differs: " + name)
    return actual


def run(args):
    require(os.name == "nt", "native Windows installation required")
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=False)
    evidence = output / "evidence"
    evidence.mkdir()
    pins = json.loads((HERE / "inputs.json").read_text())
    start = time.time()
    result = {"status": "STARTED", "compiler_executed": False, "target_executions": 0,
              "github_run_id": os.environ.get("GITHUB_RUN_ID"), "github_sha": os.environ.get("GITHUB_SHA"),
              "controller_sha256": sha(Path(__file__).read_bytes()), "input_pins_sha256": sha((HERE / "inputs.json").read_bytes())}
    try:
        bootstrap = output / "vs_BuildTools.exe"
        download(pins["bootstrap"]["url"], bootstrap, {pins["bootstrap"]["sha256"]})
        channel = download(pins["channel"]["url"], output / "channel.json", {pins["channel"]["observed_sha256"]})
        catalog = download(pins["catalog"]["url"], output / "VisualStudio.vsman",
                           {pins["catalog"]["observed_sha256"], pins["catalog"]["sha256"]})
        validate_catalog(channel, catalog, pins)
        archive = output / "compiler.vsix"
        download(pins["tools_payload"]["url"], archive, {pins["tools_payload"]["sha256"]})
        expected = payload_files(archive, pins)
        save(evidence / "payload-members.json", expected)
        result["downloads"] = {"bootstrap_sha256": sha(bootstrap.read_bytes()), "channel_sha256": sha(channel),
                               "catalog_sha256": sha(catalog), "catalog_declared_sha256_matched": sha(catalog) == pins["catalog"]["sha256"],
                               "compiler_payload_sha256": sha(archive.read_bytes())}
        installation = Path(os.environ.get("ProgramFiles(x86)", "C:/Program Files (x86)")) / "Microsoft Visual Studio/2022/MayhemPinned"
        require(not installation.exists(), "isolated install directory already exists; use a clean runner")
        kit = Path(os.environ.get("ProgramFiles(x86)", "C:/Program Files (x86)")) / "Windows Kits/10"
        existing_kit = all((kit / name / pins["kit_version"]).is_dir() for name in ("bin", "Include", "Lib"))
        launch = command(bootstrap, installation, pins)
        if not existing_kit:
            launch += ["--add", "Microsoft.VisualStudio.Component.Windows11SDK.26100"]
        save(evidence / "launch.json", {"command": launch, "isolated_install_path": str(installation),
             "existing_kit_reused": existing_kit, "fixed_product_version": "17.14.40",
             "installer_self_update_disabled": True, "all_downloads": result["downloads"]})
        with (evidence / "installer.stdout.log").open("wb") as stdout, (evidence / "installer.stderr.log").open("wb") as stderr:
            installed = subprocess.run(launch, stdout=stdout, stderr=stderr, timeout=2400)
        result["installer_returncode"] = installed.returncode
        require(installed.returncode in (0, 3010), "fixed native-tool installation failed")
        msvc = installation / "VC/Tools/MSVC/14.44.35207"
        save(evidence / "installed-members.json", check_installed(msvc, expected))
        result.update(status="SUCCEEDED", msvc=str(msvc), compiler_payload_files_verified=len(expected),
                      exact_cl_link_verified=True, complete_native_tree_pin_still_required=True,
                      historical_catalog_chain_authenticated=False)
    except Exception as error:
        result.update(status="FAILED", error=repr(error))
        raise
    finally:
        for name in ("channel.json", "VisualStudio.vsman"):
            path = output / name
            if path.exists():
                (evidence / (name + ".gz")).write_bytes(gzip.compress(path.read_bytes(), mtime=0))
        for path in Path(tempfile.gettempdir()).glob("dd_*"):
            if path.is_file() and path.stat().st_mtime >= start:
                (evidence / (path.name + ".gz")).write_bytes(gzip.compress(path.read_bytes(), mtime=0))
        result.update(finished_at=datetime.now(timezone.utc).isoformat(), elapsed_seconds=time.time()-start)
        save(evidence / "result.json", result)
        save(evidence / "MANIFEST.json", {p.name: {"bytes": p.stat().st_size, "sha256": sha(p.read_bytes())}
                                        for p in sorted(evidence.iterdir()) if p.is_file()})
        print(json.dumps(result, indent=2), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    run(parser.parse_args())
