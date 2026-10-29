#!/usr/bin/env python3
"""Fail-closed verification of the L41 behavioral composition packet."""
from pathlib import Path
import base64, csv, gzip, hashlib, io, json, shutil, struct, subprocess, sys, tarfile, tempfile

if not __debug__:
    raise SystemExit("optimized Python is unsupported")
HERE = Path(__file__).resolve().parent
ROOT = next(p for p in HERE.parents if (p / "evidence/original/pump/deployed.so").is_file())
sys.path.insert(0, str(ROOT / "scripts"))
from pump_compare_function_bytes import body, normalize
from pump_quote_control_function_match import sections

EXPECTED_ORIGINAL = "7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d"
EXPECTED_TOOLS = {
    "rustc": "1f26338cc2cabd0a6057dcbd0528bba262b23ca1296d357a55304ee31d1d9e5a",
    "cargo": "cd27e4113fc155b5e79fca97c1cc5447ef89d1c8ce3d0e1e5679d2dd7a9ab0ef",
    "objcopy": "8f79cc9a0eab0bd1b19a2ad789e5cb5e6f22d16c2f147d58ca30b9b51d2231e1",
}
EXPECTED_PROFILE = "7e2461b5ec54416d6b64508af1e2677f63afd83d35e9a3eeae6ca877ae879f1e"

def fail(message):
    raise SystemExit("verification failed: " + message)

def require(condition, message):
    if not condition:
        fail(message)

def sha_bytes(data):
    return hashlib.sha256(data).hexdigest()

def sha(path):
    return sha_bytes(Path(path).read_bytes())

def read_json(path):
    raw = Path(path).read_bytes()
    if raw[:2] == b"\x1f\x8b":
        raw = gzip.decompress(raw)
    return json.loads(raw)

def elf_functions(blob):
    shoff, = struct.unpack_from("<Q", blob, 0x28)
    shentsize, shnum, shstrndx = struct.unpack_from("<HHH", blob, 0x3a)
    headers = [struct.unpack_from("<IIQQQQIIQQ", blob, shoff + i * shentsize) for i in range(shnum)]
    names = headers[shstrndx]
    def string(table, offset):
        start = table[4] + offset
        return blob[start:blob.index(b"\0", start)].decode()
    text = next(i for i, h in enumerate(headers) if string(names, h[0]) == ".text")
    for header in headers:
        if header[1] != 2:
            continue
        strings = headers[header[6]]
        for index in range(header[5] // 24):
            name, info, _, section, address, size = struct.unpack_from("<IBBHQQ", blob, header[4] + index * 24)
            if info & 15 == 2 and section == text and size:
                yield address, size, string(strings, name)

def census(candidate):
    original = (ROOT / "evidence/original/pump/deployed.so").read_bytes()
    require(sha_bytes(original) == EXPECTED_ORIGINAL, "original Pump hash")
    os_, cs = sections(original), sections(candidate)
    index = {}
    for start, size, name in elf_functions(candidate):
        raw = body(candidate, cs, start, size)
        normalized, _ = normalize(raw, start, cs)
        index.setdefault((size, sha_bytes(normalized)), []).append((start, name, sha_bytes(raw)))
    rows = []
    with (ROOT / "repro/reconstruction-status-2026-10-26/functions.tsv").open() as stream:
        for row in csv.DictReader(stream, delimiter="\t"):
            if row["program"] != "pump" or row["variant"] != "selected":
                continue
            start, end = int(row["original_start"]), int(row["original_end"])
            raw = body(original, os_, start, end - start)
            normalized, _ = normalize(raw, start, os_)
            matches = index.get((end - start, sha_bytes(normalized)), [])
            rows.append((start, end, bool(matches), any(m[2] == sha_bytes(raw) for m in matches), {m[0] for m in matches}))
    require(len(rows) == 1035, "window count")
    return rows

def counts(rows):
    return {"total": len(rows), "raw": sum(r[3] for r in rows), "normalized": sum(r[2] for r in rows),
            "unmatched": sum(not r[2] for r in rows), "matched_text_bytes": sum(r[1] - r[0] for r in rows if r[2])}

def verify_inventory(label, unstripped, expected):
    saved = read_json(HERE / "measurement" / (label + "-inventory.json.gz"))
    require(saved["candidate_sha256"] == sha_bytes(unstripped), label + " inventory ELF hash")
    rows = census(unstripped)
    require(counts(rows) == expected, label + " recomputed counts")
    recorded = {w["start"]: w for w in saved["windows"]}
    require(len(recorded) == 1035, label + " saved window count")
    for start, end, normalized, raw, matches in rows:
        row = recorded.get(start)
        require(row is not None and row["end"] == end and bool(row["normalized_matches"]) == normalized and row["raw_match"] == raw,
                label + " saved membership " + hex(start))
        require({m["start"] for m in row["normalized_matches"]} == matches, label + " counterparts " + hex(start))
    return rows

def normalized_source_map(record):
    result = {}
    marker = "programs/pump/"
    for path, digest in record["primary_source_sha256"].items():
        require(marker in path, "build source path shape")
        result[path.split(marker, 1)[1]] = digest
    return result

def materialize_sources(stage, destination):
    source = ROOT / "research/claude-pump-integration-20261027/r37-layout-41/source/programs/pump"
    shutil.copytree(source, destination)
    names = [] if stage == "A-control" else ["buy_v2.rs", "sell_v2.rs"]
    if stage.startswith("C-combined"):
        names.append("multi_hop_curve_swap.rs")
    for name in names:
        shutil.copy2(HERE / "proposed/programs/pump/src" / name, destination / "src" / name)

def verify_build(stage, expected):
    directory = HERE / "builds" / stage
    record = json.loads((directory / "build-comparison.json").read_text())
    attempt = json.loads((directory / "build-attempt.json").read_text())
    candidate = gzip.decompress((directory / "candidate.so.gz").read_bytes())
    unstripped = gzip.decompress((directory / "unstripped.so.gz").read_bytes())
    require(record["returncode"] == attempt["returncode"] == 0, stage + " build return code")
    require(record["source_unchanged"] and attempt["source_unchanged"], stage + " source unchanged")
    require(record["workspace_layout"] and attempt["workspace_layout"], stage + " workspace layout")
    require(record["tool_sha256"] == attempt["tool_sha256"] == EXPECTED_TOOLS, stage + " tool hashes")
    profile = record["target_library_profile"]
    require(profile["name"] == "linux-v1.44-sbpf" and profile["status"] == "verified", stage + " target profile")
    require(profile["profile_spec_sha256"] == EXPECTED_PROFILE, stage + " profile spec")
    require(record["comparison"]["candidate_sha256"] == sha_bytes(candidate) == expected["candidate_sha256"], stage + " candidate hash")
    require(record["unstripped_sha256"] == sha_bytes(unstripped) == expected["unstripped_sha256"], stage + " unstripped hash")
    require(record["source_sha256"] == record["source_after_sha256"], stage + " staged source mutation")
    log = gzip.decompress((directory / "build.log.gz").read_bytes()).decode()
    require("Compiling pump-token-ext " in log and "Compiling pump-recovered " in log, stage + " root compile evidence")
    require("Stack offset" not in log and "stack offset" not in log, stage + " new stack warning")
    with tempfile.TemporaryDirectory(prefix="pump-l41-source-") as temporary:
        materialized = Path(temporary) / "pump"
        materialize_sources(stage, materialized)
        actual = {str(path.relative_to(materialized)): sha(path) for path in materialized.rglob("*") if path.is_file()}
        require(actual == normalized_source_map(record), stage + " primary source manifest")
    return candidate, unstripped

def verify_patch():
    patch = HERE / "source.patch.gz"
    raw = gzip.decompress(patch.read_bytes())
    text = raw.decode()
    expected_headers = {"buy_v2.rs", "sell_v2.rs", "multi_hop_curve_swap.rs"}
    headers = {line.rsplit("/", 1)[-1] for line in text.splitlines() if line.startswith("--- a/")}
    require(headers == expected_headers, "source patch file set")
    with tempfile.TemporaryDirectory(prefix="pump-l41-patch-") as temporary:
        target = Path(temporary)
        source = ROOT / "research/claude-pump-integration-20261027/r37-layout-41/source/programs/pump/src"
        destination = target / "programs/pump/src"
        destination.mkdir(parents=True)
        for name in expected_headers:
            shutil.copy2(source / name, destination / name)
        patch_file = target / "source.patch"
        patch_file.write_bytes(raw)
        result = subprocess.run(["patch", "-s", "-p1", "-d", str(target), "-i", str(patch_file)], capture_output=True, text=True)
        require(result.returncode == 0, "source patch application: " + result.stderr)
        for name in expected_headers:
            require((destination / name).read_bytes() == (HERE / "proposed/programs/pump/src" / name).read_bytes(), "patched source " + name)

def verify_v2_runtime(candidate_sha):
    report = read_json(HERE / "runtime/v2-focused.json.gz")
    require(report["case_count"] == 18 and report["verified_outer_signatures"] == 54, "focused V2 counts")
    require(len(report["baseline_mismatches"]) == 6 and not report["candidate_mismatches"], "focused V2 mismatch totals")
    require(report["inputs_sha256"][next(k for k in report["inputs_sha256"] if k.endswith("C-combined-build-1/candidate.so"))] == candidate_sha, "focused V2 candidate hash")
    fields = ["error", "accounts", "events", "inner", "return_data"]
    for row in report["cases"]:
        results = row["results"]
        require(len({results[name]["transaction_base64"] for name in results}) == 1, "focused V2 transaction identity")
        actual = {name: [field for field in fields if results[name][field] != results["original"][field]] for name in ("baseline", "candidate")}
        require(actual == row["differences"], "focused V2 recomputed differences")
        require(not actual["candidate"], "focused V2 candidate mismatch")
        require(row["decoded_curve"]["candidate"] == row["decoded_curve"]["original"], "focused V2 reserve mismatch")

def verify_multihop_runtime(candidate_sha):
    report = read_json(HERE / "runtime/multihop-focused.json.gz")
    require(report["case_count"] == 8 and report["verified_transactions"] == 24, "focused multi-hop counts")
    require(report["baseline_mismatches"] == 2 and report["candidate_mismatches"] == 0, "focused multi-hop totals")
    require(report["program_sha256"]["candidate"] == candidate_sha, "focused multi-hop candidate hash")
    fields = ["error", "events", "inner", "return_data", "before", "after"]
    negatives = 0
    for row in report["cases"]:
        results = row["results"]
        require(len({results[name]["transaction_base64"] for name in results}) == 1, "focused multi-hop transaction identity")
        actual = {name: [field for field in fields if results[name][field] != results["original"][field]] for name in ("baseline", "candidate")}
        require(actual == row["differences"], "focused multi-hop recomputed differences")
        require(not actual["candidate"], "focused multi-hop candidate mismatch")
        if actual["baseline"]:
            negatives += 1
            require(row["whitelisted"] and row["real_tokens"] == 10**6, "focused multi-hop negative identity")
            require("6021" in results["original"]["error"] and results["baseline"]["error"] is None, "focused multi-hop error precedence")
    require(negatives == 2, "focused multi-hop negative count")

def verify_corpus(name, expected_cases, candidate_sha):
    report = read_json(HERE / "runtime" / (name + "-corpus.json.gz"))
    require(report["candidate_sha256"] == candidate_sha, name + " corpus candidate hash")
    require(report["case_count"] == len(report["cases"]) == expected_cases, name + " corpus cases")
    require(not report["mismatches"], name + " corpus mismatches")
    for row in report["cases"]:
        require(row["match"] and not row["different_fields"], name + " corpus row")

def verify_full_runtime(candidate_sha):
    report = read_json(HERE / "runtime/full.json.gz")
    require(report["candidate_sha256"] == candidate_sha and report["original_sha256"] == EXPECTED_ORIGINAL, "full runtime program hashes")
    require(report["case_count"] == 10468 and len(report["suites"]) == 44, "full runtime totals")
    require(report["loader_profile"] == "captured-upgradeable" and len(report["loader_receipts"]) == 44, "full runtime loader coverage")
    require(not report["mismatches"] and not report["diagnostics"]["mismatches"], "full runtime mismatches")
    require(report["diagnostics"]["log_bearing_cases"] == 10464, "ordered-log coverage")
    require(sum(suite["case_count"] for suite in report["suites"].values()) == 10468, "full runtime suite counts")
    archive = HERE / "runtime/loader-receipts.tar.gz"
    with tarfile.open(archive, "r:gz") as tar:
        members = tar.getmembers()
        require(len(members) == 44 and all(m.isfile() and not m.issym() and not m.islnk() and "/" not in m.name for m in members), "loader archive members")
        contents = {m.name: tar.extractfile(m).read() for m in members}
    for suite, binding in report["loader_receipts"].items():
        name = suite + ".loader.json"
        require(name in contents and sha_bytes(contents[name]) == binding["sha256"], "loader receipt hash " + suite)
        receipt = json.loads(contents[name])
        require({row["elf_sha256"] for row in receipt["loads"]} == {EXPECTED_ORIGINAL, candidate_sha}, "loader program identities " + suite)
        require(binding["load_count"] == len(receipt["loads"]), "loader load count " + suite)
        require(all(row["program_bytes"] == 36 and row["programdata_bytes"] == 10485760 and row["elf_prefix_unchanged"] and row["zero_allocation_tail"] for row in receipt["loads"]), "loader structure " + suite)

def verify_manifest():
    manifest = json.loads((HERE / "MANIFEST.json").read_text())
    files = {str(path.relative_to(HERE)): path for path in HERE.rglob("*") if path.is_file()}
    expected = set(manifest["files"]) | {"MANIFEST.json"}
    require(set(files) == expected, "unexpected or missing packet files")
    for name, path in files.items():
        require(not path.is_symlink(), "symlink " + name)
    for name, digest in manifest["files"].items():
        require(sha(files[name]) == digest, "manifest digest " + name)

def main():
    verify_manifest()
    result = json.loads((HERE / "RESULT.json").read_text())
    require(result["original_pump_sha256"] == EXPECTED_ORIGINAL and not result["whole_elf_equal"], "result scope")
    verify_patch()
    artifacts = {}
    for stage in ("A-control", "B-v2-only", "C-combined-1", "C-combined-2"):
        key = "C-combined" if stage.startswith("C-combined") else stage
        artifacts[stage] = verify_build(stage, result["stages"][key])
    require(artifacts["C-combined-1"] == artifacts["C-combined-2"], "repeat build equality")
    a = verify_inventory("A-control", artifacts["A-control"][1], {"total": 1035, "raw": 168, "normalized": 1019, "unmatched": 16, "matched_text_bytes": 1611088})
    b = verify_inventory("B-v2-only", artifacts["B-v2-only"][1], {"total": 1035, "raw": 188, "normalized": 1019, "unmatched": 16, "matched_text_bytes": 1611088})
    c = verify_inventory("C-combined", artifacts["C-combined-1"][1], {"total": 1035, "raw": 188, "normalized": 1019, "unmatched": 16, "matched_text_bytes": 1611088})
    sets = lambda rows, index: {row[0] for row in rows if row[index]}
    require(sets(a, 2) == sets(b, 2) == sets(c, 2), "normalized membership losses")
    require(not (sets(a, 3) - sets(b, 3)) and not (sets(a, 3) - sets(c, 3)), "raw membership losses")
    require([hex(x) for x in sorted(sets(c, 3) - sets(a, 3))] == result["raw_gains"], "raw gain identity")
    candidate_sha = result["stages"]["C-combined"]["candidate_sha256"]
    verify_v2_runtime(candidate_sha)
    verify_multihop_runtime(candidate_sha)
    verify_corpus("buy", 216, candidate_sha)
    verify_corpus("sell", 206, candidate_sha)
    verify_full_runtime(candidate_sha)
    print(json.dumps({"verified": True, "normalized": 1019, "raw": 188, "normalized_losses": [], "raw_losses": [],
                      "focused_v2_cases": 18, "focused_multihop_cases": 8, "full_suites": 44,
                      "full_cases": 10468, "ordered_log_mismatches": 0, "whole_elf_equal": False}, indent=2))

if __name__ == "__main__":
    main()
