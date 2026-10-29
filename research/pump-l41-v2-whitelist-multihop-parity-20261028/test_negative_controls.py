#!/usr/bin/env python3
"""Prove the packet verifier rejects independently mutated evidence."""
from pathlib import Path
import gzip, hashlib, io, json, os, shutil, subprocess, sys, tarfile, tempfile

SOURCE = Path(__file__).resolve().parent

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def refresh(root, relative):
    manifest = json.loads((root / "MANIFEST.json").read_text())
    manifest["files"][relative] = digest(root / relative)
    (root / "MANIFEST.json").write_text(json.dumps(manifest, indent=2) + "\n")

def mutate_json_gz(root, relative, change):
    path = root / relative
    data = json.loads(gzip.decompress(path.read_bytes()))
    change(data)
    path.write_bytes(gzip.compress(json.dumps(data, separators=(",", ":")).encode(), mtime=0))
    refresh(root, relative)

def flip_gzip(root, relative):
    path = root / relative
    data = bytearray(gzip.decompress(path.read_bytes()))
    data[len(data) // 2] ^= 1
    path.write_bytes(gzip.compress(bytes(data), mtime=0))
    refresh(root, relative)

def mutate_loader(root):
    path = root / "runtime/loader-receipts.tar.gz"
    with tarfile.open(path, "r:gz") as tar:
        content = {m.name: tar.extractfile(m).read() for m in tar.getmembers()}
    name = sorted(content)[0]
    record = json.loads(content[name])
    record["loads"][0]["elf_sha256"] = "0" * 64
    content[name] = json.dumps(record, indent=2).encode()
    with tarfile.open(path, "w:gz", compresslevel=9) as tar:
        for member_name in sorted(content):
            raw = content[member_name]
            info = tarfile.TarInfo(member_name)
            info.size = len(raw); info.mtime = 0; info.uid = info.gid = 0
            tar.addfile(info, io.BytesIO(raw))
    refresh(root, "runtime/loader-receipts.tar.gz")

def run(root, optimized=False):
    command = [sys.executable]
    if optimized:
        command.append("-O")
    command += ["-I", "-B", str(root / "verify.py")]
    return subprocess.run(command, cwd=root.parents[1], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)

def main():
    controls = []
    def case(name, mutate, optimized=False):
        work = SOURCE.parents[1] / "work"
        work.mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(prefix="pump-l41-negative-", dir=work) as temporary:
            root = Path(temporary) / SOURCE.name
            shutil.copytree(SOURCE, root, symlinks=True, ignore=shutil.ignore_patterns("__pycache__"))
            mutate(root)
            result = run(root, optimized)
            if result.returncode == 0:
                raise SystemExit("negative control unexpectedly passed: " + name)
            controls.append({"name": name, "rejected": True, "returncode": result.returncode,
                             "last_output": result.stdout.strip().splitlines()[-1] if result.stdout.strip() else ""})

    case("altered manifest digest", lambda r: (lambda m: (m["files"].__setitem__(next(iter(m["files"])), "0" * 64), (r / "MANIFEST.json").write_text(json.dumps(m))))(json.loads((r / "MANIFEST.json").read_text())))
    case("unexpected file", lambda r: (r / "unexpected.bin").write_bytes(b"unexpected"))
    def symlink(root):
        path = root / "RESULT.json"; path.unlink(); path.symlink_to("README.md")
    case("symlink substitution", symlink)
    def source_patch(root):
        path = root / "source.patch.gz"
        data = gzip.decompress(path.read_bytes()).decode().replace("require!(!c.is_mayhem_mode", "require_eq!(!c.is_mayhem_mode", 1)
        path.write_bytes(gzip.compress(data.encode(), mtime=0))
        refresh(root, "source.patch.gz")
    case("missing source hunk", source_patch)
    case("altered candidate ELF", lambda r: flip_gzip(r, "builds/C-combined-1/candidate.so.gz"))
    case("altered unstripped ELF", lambda r: flip_gzip(r, "builds/C-combined-1/unstripped.so.gz"))
    case("inconsistent repeat ELF", lambda r: flip_gzip(r, "builds/C-combined-2/candidate.so.gz"))
    case("false window gain", lambda r: mutate_json_gz(r, "measurement/C-combined-inventory.json.gz", lambda d: d["windows"][0].__setitem__("raw_match", not d["windows"][0]["raw_match"])))
    case("modified signed transaction", lambda r: mutate_json_gz(r, "runtime/v2-focused.json.gz", lambda d: d["cases"][0]["results"]["candidate"].__setitem__("transaction_base64", base64_change(d["cases"][0]["results"]["candidate"]["transaction_base64"]))))
    case("changed account state", lambda r: mutate_json_gz(r, "runtime/v2-focused.json.gz", lambda d: d["cases"][0]["results"]["candidate"]["accounts"].__setitem__("tampered", {})))
    case("reordered CPI result", lambda r: mutate_json_gz(r, "runtime/v2-focused.json.gz", lambda d: d["cases"][0]["results"]["candidate"]["inner"].reverse()))
    case("changed event bytes", lambda r: mutate_json_gz(r, "runtime/v2-focused.json.gz", lambda d: d["cases"][0]["results"]["candidate"]["events"].append("tampered")))
    case("changed reserve value", lambda r: mutate_json_gz(r, "runtime/v2-focused.json.gz", lambda d: d["cases"][0]["decoded_curve"]["candidate"].__setitem__("virtual_quote_reserves", d["cases"][0]["decoded_curve"]["candidate"]["virtual_quote_reserves"] + 1)))
    case("changed crossing error", lambda r: mutate_json_gz(r, "runtime/multihop-focused.json.gz", lambda d: d["cases"][0]["results"]["candidate"].__setitem__("error", "tampered")))
    case("changed rollback state", lambda r: mutate_json_gz(r, "runtime/multihop-focused.json.gz", lambda d: d["cases"][0]["results"]["candidate"]["after"].__setitem__("tampered", {})))
    case("altered ordered-log audit", lambda r: mutate_json_gz(r, "runtime/full.json.gz", lambda d: d["diagnostics"]["mismatches"].append({"tampered": True})))
    case("altered loader receipt", mutate_loader)
    def compiler_hash(root):
        path = root / "builds/C-combined-1/build-comparison.json"; data = json.loads(path.read_text()); data["tool_sha256"]["rustc"] = "0" * 64; path.write_text(json.dumps(data)); refresh(root, "builds/C-combined-1/build-comparison.json")
    case("incorrect compiler input hash", compiler_hash)
    case("optimized verifier", lambda r: None, optimized=True)
    print(json.dumps({"controls": len(controls), "passed": len(controls), "results": controls}, indent=2))

def base64_change(value):
    replacement = "A" if value[-1] != "A" else "B"
    return value[:-1] + replacement

if __name__ == "__main__":
    main()
