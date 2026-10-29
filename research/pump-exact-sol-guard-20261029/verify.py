#!/usr/bin/env python3
"""Verify retained partial-recovery evidence without building or executing a VM.

Requires Python 3 and solders. Writes only to an automatically removed temporary
directory. This checks evidence consistency and signatures, not execution
attestation or original-to-candidate whole-function identity.
"""
import argparse, base64, gzip, hashlib, importlib, json, re, struct, subprocess
import sys, tarfile, tempfile
from pathlib import Path, PurePosixPath
sys.dont_write_bytecode = True

def require(condition, message):
    if not condition:
        raise AssertionError(message)

def digest(data):
    return hashlib.sha256(data).hexdigest()

def js(path):
    p = Path(path)
    raw = p.read_bytes() if p.exists() else gzip.decompress(Path(str(p) + ".gz").read_bytes())
    return json.loads(raw)

def safe_relative(name):
    p = PurePosixPath(name)
    require(not p.is_absolute() and ".." not in p.parts and "\\" not in name and p.parts,
            "unsafe evidence path: " + name)
    return p.as_posix()

def archive(path):
    files = {}
    with tarfile.open(path, "r:gz") as tf:
        for member in tf:
            name = safe_relative(member.name)
            if member.isdir():
                continue
            require(member.isfile(), "archive contains non-regular member: " + name)
            require(name not in files, "duplicate archive member: " + name)
            stream = tf.extractfile(member)
            require(stream is not None, "unreadable archive member: " + name)
            files[name] = stream.read()
    return files

def hashes(files):
    return {n: digest(v) for n, v in sorted(files.items())}

def verify_manifest(packet):
    manifest = js(packet / "MANIFEST.json")
    require(isinstance(manifest, dict) and manifest, "empty/invalid manifest")
    require("MANIFEST.json" not in manifest, "manifest cannot hash itself")
    present = set()
    for path in packet.rglob("*"):
        require(not path.is_symlink(), "packet contains symlink")
        if path.is_file():
            present.add(path.relative_to(packet).as_posix())
    require(present - {"MANIFEST.json"} == set(manifest), "manifest file membership differs")
    for name, expected in manifest.items():
        name = safe_relative(name)
        require(re.fullmatch("[0-9a-f]{64}", expected) is not None, "invalid digest: " + name)
        require(digest((packet / name).read_bytes()) == expected, "manifest hash differs: " + name)
    return len(manifest)

def verify_sources(packet):
    source = js(packet / "SOURCE.json")
    parent = archive(packet / "source-parent.tar.gz")
    candidate = archive(packet / "source-candidate.tar.gz")
    require(len(parent) == len(candidate) == 66, "expected 66 workspace files")
    require(set(parent) == set(candidate), "source archive memberships differ")
    require(hashes(parent) == source["parent_inputs"], "SOURCE parent hashes differ")
    require(hashes(candidate) == source["candidate_inputs"], "SOURCE candidate hashes differ")
    path = "programs/pump/src/buy.rs"
    require([p for p in parent if parent[p] != candidate[p]] == [path], "unexpected source changes")
    a, b = parent[path].splitlines(keepends=True), candidate[path].splitlines(keepends=True)
    require(len(a) == len(b), "source line count changed")
    require([i + 1 for i, (x, y) in enumerate(zip(a, b)) if x != y] == [96, 110],
            "source edits must be exactly lines 96 and 110")
    expected = {
        96: (
            b"let quote=if total>spendable_sol_in{raw_quote.checked_sub(total.saturating_sub(spendable_sol_in)).ok_or(PumpError::Overflow)?}else{raw_quote};",
            b"let mut quote=raw_quote;if total>spendable_sol_in{quote=raw_quote.checked_sub(total.saturating_sub(spendable_sol_in)).ok_or(PumpError::Overflow)?;"
        ),
        110: (
            b"require_gt!(quote,0,PumpError::BuySlippageBelowMinTokensOut);",
            b"require_gt!(quote,0,PumpError::BuySlippageBelowMinTokensOut);}"
        )
    }
    for line, (old, new) in expected.items():
        require(a[line - 1].strip() == old and b[line - 1].strip() == new,
                "unexpected source edit at line " + str(line))
    require((packet / "source" / path).read_bytes() == candidate[path], "displayed source differs")
    return {"parent": hashes(parent), "candidate": hashes(candidate)}

def verify_builds(packet, source_hashes, images):
    previous = None
    for label in ("parent", "candidate", "repeat"):
        folder = packet / "build" / label
        launch, result = js(folder / "launch.json"), js(folder / "result.json")
        image_label = "parent" if label == "parent" else "candidate"
        require(launch["inputs"] == source_hashes[image_label], label + " source/build hash join differs")
        require(result["returncode"] == 0 and result["inputs_unchanged"] is True,
                label + " failed or changed inputs")
        require(result["actual_root_compilations"] == 1, label + " does not record one root compilation")
        log = gzip.decompress((folder / "build.log.gz").read_bytes()).decode("utf-8")
        actual = sum(line.strip().startswith("Running ") and "--crate-name pump_recovered " in line
                     for line in log.splitlines())
        require(actual == 1, label + " root compilation not present once in build log")
        require(result["symbols_sha256"] == digest(images[image_label]["symbols"]),
                label + " symbol image hash differs")
        require(result["candidate_sha256"] == digest(images[image_label]["candidate"]),
                label + " stripped image hash differs")
        command = launch["command"]
        require(isinstance(command, list), label + " command is not an argument list")
        for token in ("build", "--release", "--offline", "--locked", "-vv"):
            require(token in command, label + " missing ordinary Cargo flag " + token)
        require(command[command.index("--target") + 1] == "sbpf-solana-solana", "wrong build target")
        tool_record = (launch["tools"], launch["controller_sha256"])
        require(launch["tools"] and re.fullmatch("[0-9a-f]{64}", launch["controller_sha256"]),
                "missing build tool provenance")
        if previous is not None:
            require(tool_record == previous, "build tool/controller records differ")
        previous = tool_record

def verify_binary(packet, repo, temp, images):
    paths = {}
    for label in ("parent", "candidate"):
        paths[label] = {}
        for kind in ("symbols", "candidate"):
            path = temp / (label + "-" + kind + ".so")
            path.write_bytes(images[label][kind])
            paths[label][kind] = path
    original = repo / "evidence/original/pump/deployed.so"
    subprocess.run([
        sys.executable, "-B", str(packet / "audit_target.py"),
        "--original", str(original), "--parent", str(paths["parent"]["symbols"]),
        "--guard", str(paths["candidate"]["symbols"]), "--official-tools", str(packet / "tools"),
        "--output-directory", str(temp / "audit")
    ], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    audit = js(temp / "audit/audit_current_diff.json")
    refs = js(temp / "audit/audit_current_refs.json")
    comparisons = audit["comparisons"]
    for key, expected in (
        ("original_vs_parent", (371, 94, 56)),
        ("original_vs_guard", (4, 2, 2)),
        ("parent_vs_guard", (367, 92, 54))
    ):
        row = comparisons[key]
        require(row["left_bytes"] == row["right_bytes"] == 13224, "target size changed")
        actual = (row["positional_different_bytes"], row["positional_different_slots"],
                  row["sequence_edit_instruction_count"])
        require(actual == expected, key + " exact narrow diff changed")
    residual = comparisons["original_vs_guard"]["different_slots"]
    require([r["slot"] for r in residual] == [1003, 1004], "residual slots changed")
    require([(r["left"], r["right"]) for r in residual] == [
        ("79a358f900000000", "79a160f900000000"),
        ("79a160f900000000", "79a358f900000000")], "residual instructions changed")
    calls = refs["direct_calls"]
    require(calls["parent_sites"] == calls["guard_sites"] == 101, "direct call count changed")
    require(calls["parent_distinct_targets"] == calls["guard_distinct_targets"] == 41,
            "direct callee count changed")
    require(not calls["unpaired_guard_targets"], "unpaired callees")
    for row in calls["rows"]:
        require(row.get("raw_callee_bodies_equal") is True and row.get("call_multiplicity_equal") is True
                and row["parent"]["address"] == row["guard"]["address"], "callee reference changed")
    data = refs["lddw_pointers"]
    require(data["parent_sites"] == data["guard_sites"] == 43, "data pointer count changed")
    require(data["parent_distinct_referents"] == data["guard_distinct_referents"] == 16,
            "data referent count changed")
    for row in data["rows"]:
        require(row["entire_section_bytes_equal"] and row["callsite_multiplicity_equal"]
                and row["parent_value"] == row["guard_value"], "data referent changed")
    sys.path.insert(0, str(packet / "tools"))
    census = importlib.import_module("census")
    census.ROOT = repo
    memberships = []
    for label in ("parent", "candidate"):
        actual = census.census(paths[label]["symbols"])
        retained = json.loads(gzip.decompress((packet / label / "census.json.gz").read_bytes()))
        require(actual == retained, label + " full retained census differs from recomputation")
        require(actual["counts"] == {"total":1035, "normalized":1019, "raw":183,
                                     "unmatched":16, "matched_text_bytes":1611088}, "census counts changed")
        memberships.append({r["start"]:(bool(r["normalized_matches"]),r["raw_match"]) for r in actual["windows"]})
        symbol_sections = census.sections(images[label]["symbols"])
        stripped_sections = census.sections(images[label]["candidate"])
        for name in (".text", ".rodata", ".data.rel.ro"):
            s, t = symbol_sections[name], stripped_sections[name]
            a = images[label]["symbols"][s["offset"]:s["offset"]+s["size"]]
            b = images[label]["candidate"][t["offset"]:t["offset"]+t["size"]]
            require(a == b and s["addr"] == t["addr"], label + " symbol/stripped section differs: " + name)
    require(memberships[0] == memberships[1], "full census membership changed")
    require(memberships[1][0x14f4e0] == (False,False), "target unexpectedly credited")
    return {"target_bytes":13224, "narrow_sequence_edits":[56,2],
            "narrow_positional_slots":[94,2], "census_normalized":1019, "census_raw":183,
            "whole_target_equal":False, "direct_calls":101, "distinct_callees":41,
            "data_pointers":43, "distinct_data_referents":16}

def verify_runtime(packet, repo, images):
    from solders.transaction import Transaction
    from solders.pubkey import Pubkey
    original_dir = repo / "evidence/original/pump"
    capture = js(original_dir / "capture.json")
    program = (original_dir / "program-account.bin").read_bytes()
    pd = (original_dir / "programdata-account.bin").read_bytes()
    original = (original_dir / "deployed.so").read_bytes()
    require(digest(pd) == capture["programdata_sha256"], "captured ProgramData hash differs")
    require(pd[45:] == original and digest(original) == capture["payload_sha256"],
            "original ELF/captured payload join differs")
    require(len(program) == 36 and program[4:] == bytes(Pubkey.from_string(capture["programdata"])),
            "captured Program account join differs")
    header = pd[:45]; slot = struct.unpack_from("<Q", header, 4)[0]
    require(len(original) == capture["payload_bytes"], "captured allocation length differs")
    raw_images = {"original":original, "parent":images["parent"]["candidate"],
                  "candidate":images["candidate"]["candidate"]}
    expected_loads = {}
    for label, raw in raw_images.items():
        require(len(raw) <= capture["payload_bytes"], "ELF exceeds captured allocation")
        assembled = header + raw + bytes(capture["payload_bytes"]-len(raw))
        expected_loads[label] = {
            "elf_sha256":digest(raw),"elf_bytes":len(raw),"program_owner":capture["owner"],
            "program_bytes":len(program),"program_sha256":digest(program),
            "programdata_bytes":len(assembled),"programdata_sha256":digest(assembled),
            "header_sha256":digest(header),"elf_prefix_unchanged":True,"zero_allocation_tail":True,
            "slot":slot+1}
    records = json.loads(gzip.decompress((packet / "runtime/records.json.gz").read_bytes()))
    summary = js(packet / "runtime/summary.json")
    require(len(records) == 286, "runtime must contain 286 case triples")
    fields = ["error","before","accounts","events","inner","return_data","transaction_base64"]
    result_fields = set(fields + ["logs","signatures_verified","verified_serialized_signatures"])
    meter = re.compile(r"^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$")
    def logs(r):
        require(isinstance(r["logs"],list) and all(isinstance(s,str) for s in r["logs"]), "invalid logs")
        return [s for s in r["logs"] if not meter.fullmatch(s)]
    signatures = successes = 0
    for index,row in enumerate(records):
        require(row["index"] == index, "runtime index changed")
        require(set(row["results"]) == set(row["loader"]) == {"original","parent","candidate"},
                "runtime image membership changed")
        results = row["results"]
        for label,r in results.items():
            require(set(r) == result_fields, "unexpected runtime fields")
            require(r["signatures_verified"] is True, "false signature assertion")
            txraw = base64.b64decode(r["transaction_base64"], validate=True)
            tx = Transaction.from_bytes(txraw)
            require(bytes(tx) == txraw, "transaction serialization not canonical")
            tx.verify()
            require(len(tx.signatures) == tx.message.header.num_required_signatures > 0,
                    "transaction signature count differs")
            require(r["verified_serialized_signatures"] == len(tx.signatures),
                    "recorded signature count differs")
            signatures += len(tx.signatures)
            receipt = dict(row["loader"][label])
            require(isinstance(receipt.pop("input_path"),str), "missing historical loader input path")
            require(receipt == expected_loads[label], "loader hash/content join differs")
        successes += results["original"]["error"] is None
        for left,right in (("parent","candidate"),("original","parent"),("original","candidate")):
            require({k:v for k,v in results[left].items() if k!="logs"}
                    == {k:v for k,v in results[right].items() if k!="logs"},
                    "structured runtime difference at case " + str(index))
            require(logs(results[left]) == logs(results[right]), "ordered diagnostic difference")
        recomputed = {"index":index}
        for left,right in (("parent","candidate"),("original","parent"),("original","candidate")):
            recomputed[left+"_"+right+"_fields"] = [f for f in fields if results[left][f]!=results[right][f]]
            recomputed[left+"_"+right+"_logs_equal"] = logs(results[left])==logs(results[right])
        require(row["comparison"] == recomputed, "saved comparison differs")
    boundaries = [
        {"name":"corrected_quote_zero_spend2","kind":"buy_exact_sol_in","amount":2,"minimum":1},
        {"name":"corrected_quote_positive_spend3","kind":"buy_exact_sol_in","amount":3,"minimum":1}]
    require([row["case"] for row in records[-2:]] == boundaries, "boundary cases differ")
    require(any("programs/pump/src/buy.rs:110." in s for s in records[-2]["results"]["original"]["logs"]),
            "spend2 did not retain Source110")
    require(any("programs/pump/src/buy.rs:143." in s for s in records[-1]["results"]["original"]["logs"]),
            "spend3 did not retain Source143")
    require(records[-2]["results"]["original"]["error"] is not None
            and records[-1]["results"]["original"]["error"] is not None,
            "boundary cases are expected failures, not transaction successes")
    require(summary["case_count"] == 286 and summary["executions"] == 858
            and summary["signatures"] == signatures == 858 and summary["original_successes"] == successes == 209,
            "runtime summary counts differ")
    require(summary["started_images"] == {k:digest(v) for k,v in raw_images.items()}
            and summary["images_unchanged"] is True and summary["mismatches"] == [],
            "runtime summary image or comparison join differs")
    require(summary["boundary_logs"] == [{"index":row["index"],"case":row["case"],
             "original_logs":row["results"]["original"]["logs"]} for row in records[-2:]],
            "boundary summary differs")
    for name, expected in summary["imported_scripts"].items():
        require(digest((packet / "runtime" / "producers" / safe_relative(name)).read_bytes()) == expected,
                "retained runtime dependency hash differs: " + name)
    return {"case_triples":286,"executions":858,"verified_serialized_signatures":signatures,
            "original_successes":successes,"structured_or_ordered_diagnostic_mismatches":0}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--packet", type=Path, default=Path(__file__).resolve().parent)
    parser.add_argument("--repo-root", type=Path, required=True)
    args = parser.parse_args()
    packet,repo = args.packet.resolve(),args.repo_root.resolve()
    manifest_files = verify_manifest(packet)
    sources = verify_sources(packet)
    images = {label:{kind:gzip.decompress((packet/label/(kind+".so.gz")).read_bytes())
                     for kind in ("symbols","candidate")} for label in ("parent","candidate")}
    verify_builds(packet,sources,images)
    with tempfile.TemporaryDirectory(prefix="pump-legacy-packet-verify-") as temp:
        binary = verify_binary(packet,repo,Path(temp),images)
    runtime = verify_runtime(packet,repo,images)
    print(json.dumps({"verified":True,
        "scope":"Retained evidence consistency and transaction signatures; no build, VM replay, or execution attestation.",
        "manifest_files":manifest_files,"source_files":66,"changed_source_lines":[96,110],
        "build_records":3,"candidate_repeat_hashes_equal":True,"binary":binary,"runtime":runtime},indent=2))

if __name__ == "__main__":
    main()
