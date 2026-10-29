#!/usr/bin/env python3
"""Fresh literal meaningful-ELF and maintained-source qualification audit."""
import argparse
import gzip
import hashlib
import json
from pathlib import Path
import struct
import subprocess

HERE = Path(__file__).resolve().parent


def sha(data):
    return hashlib.sha256(data).hexdigest()


def read(path):
    data = path.read_bytes()
    return gzip.decompress(data) if path.suffix == ".gz" else data


def tree(path):
    return {p.relative_to(path).as_posix(): sha(p.read_bytes()) for p in sorted(path.rglob("*")) if p.is_file()}


def comparison(before, after):
    return {"before_files": len(before), "proposed_files": len(after),
            "changed": sorted(name for name in set(before) & set(after) if before[name] != after[name]),
            "added": sorted(set(after) - set(before)), "removed": sorted(set(before) - set(after)),
            "unchanged": sorted(name for name in set(before) & set(after) if before[name] == after[name])}


def audit(root):
    status = json.loads((root / "repro/status.json").read_text())
    packages = {
        "pump_fees": {"original": "evidence/original/pump_fees/deployed.so",
                      "packet": "research/claude-fees100-crank-donation-20261027",
                      "builds": [("builds/" + role + "/candidate.so.gz", "builds/" + role + "/symbols.so.gz") for role in ("linux", "repeat")]},
        "mayhem": {"original": "evidence/original/mayhem/deployed.so",
                   "packet": "research/mayhem-fresh-host-20261028",
                   "builds": [("builds/" + role + "/candidate-v154-strip.so.gz", "builds/" + role + "/symbols.so.gz") for role in ("01", "02", "03")]},
        "donation_relay": {"original": "evidence/dependencies/donation_relay/deployed.so",
                           "packet": "repro/donation-relay/canonical-exact-selection",
                           "builds": [("artifacts/candidate.so", "artifacts/symbols.so.gz")]},
    }
    reports = {}
    for name, inputs in packages.items():
        original = read(root / inputs["original"])
        offset = struct.unpack_from("<Q", original, 40)[0]
        entry_size, count = struct.unpack_from("<HH", original, 58)
        extent = offset + entry_size * count
        if not (original[:7] == b"\x7fELF\x02\x01\x01" and entry_size == 64 and 0 < extent <= len(original)):
            raise ValueError("invalid original ELF extent: " + name)
        if any(original[extent:]):
            raise ValueError("nonzero original allocation suffix: " + name)
        builds = []
        for candidate_path, symbols_path in inputs["builds"]:
            candidate = read(root / inputs["packet"] / candidate_path)
            symbols = read(root / inputs["packet"] / symbols_path)
            if candidate != original[:extent]:
                raise ValueError("meaningful ELF differs: " + name + "/" + candidate_path)
            builds.append({"candidate": inputs["packet"] + "/" + candidate_path,
                           "candidate_bytes": len(candidate), "candidate_sha256": sha(candidate),
                           "symbols": inputs["packet"] + "/" + symbols_path,
                           "symbols_bytes": len(symbols), "symbols_sha256": sha(symbols)})
        if len({row["candidate_sha256"] for row in builds}) != 1 or len({row["symbols_sha256"] for row in builds}) != 1:
            raise ValueError("saved repeated builds differ: " + name)
        selected = status[name] if name in status else json.loads((root / "repro/donation-relay/current.json").read_text())
        selected_image = read(root / selected["candidate_artifact"])
        reports[name] = {"original": inputs["original"], "original_bytes": len(original), "original_sha256": sha(original),
                         "meaningful_elf_bytes": extent, "allocation_zero_tail_bytes": len(original)-extent,
                         "all_saved_candidates_literal_meaningful_equal": True,
                         "saved_compiler_outputs_repeat": len(builds) > 1,
                         "saved_builds": builds, "selected_candidate": selected["candidate_artifact"],
                         "selected_candidate_sha256": sha(selected_image),
                         "selected_candidate_is_exact_research_image": selected_image == original[:extent],
                         "historical_source_spelling_or_unique_build_provenance_claimed": False}
    proposal = HERE / "fees-proposal/programs/pump-fees"
    fees_before = tree(root / "programs/pump-fees")
    fees_after = tree(proposal)
    mayhem_before = tree(root / "programs/mayhem")
    mayhem_after = tree(HERE / "mayhem-proposal/source")
    reports["pump_fees"]["source_promotion_delta"] = comparison(fees_before, fees_after)
    reports["mayhem"]["source_promotion_delta"] = comparison(mayhem_before, mayhem_after)
    reports["pump_fees"]["canonical_source_matches_proposal"] = fees_before == fees_after
    reports["mayhem"]["canonical_source_matches_proposal"] = mayhem_before == mayhem_after
    reports["donation_relay"]["reviewed_scanner_bridge"] = json.loads((HERE / "relay/current-verification.json").read_text())
    return {"scope": "Fresh literal byte comparisons and source/promotion audit; no new compiler or target execution by this audit",
            "repository_head_observed": subprocess.check_output(["git", "-C", str(root), "rev-parse", "HEAD"], text=True).strip(),
            "programs": reports,
            "required_current_selection_updates": ["Fees canonical source/build promotion and current artifact/source/verifier selection",
                                                   "Mayhem canonical67-source recipe promotion and current selection",
                                                   "Relay current verifier must admit only reviewed portable scanner transition"],
            "selected_byte_identical_contracts": sum(row["selected_candidate_is_exact_research_image"] for row in reports.values())}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=HERE.parents[1])
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    result = audit(args.repo.resolve())
    args.output.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({"selected_exact": result["selected_byte_identical_contracts"],
                      "literal_exact_research": {k:v["meaningful_elf_bytes"] for k,v in result["programs"].items()}}, indent=2))
