#!/usr/bin/env python3
"""Verify the research-only PumpSwap fee-helper source-coordinate packet."""
import argparse
import collections
import hashlib
import importlib.util
import json
import re
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
SHA = lambda data: hashlib.sha256(data).hexdigest()


def load_elf():
    path = ROOT / "repro/pump_amm/claim-self-transfer-v144/static-tool/elf_reader.py"
    spec = importlib.util.spec_from_file_location("amm_fee_coordinate_elf_reader", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.Elf


def key(elf, start, size):
    pattern = json.dumps(elf.pattern(start, size), sort_keys=True, separators=(",", ":"))
    return size, SHA(elf.normalized[start:start + size]), pattern


def inventory(original, candidate, symbols):
    assert candidate.b[candidate.lo:candidate.hi] == symbols.b[symbols.lo:symbols.hi]
    entries = sorted(set(original.entries) | {original.lo})
    windows = list(zip(entries, entries[1:] + [original.hi]))
    assert len(windows) == 785
    normalized = collections.defaultdict(list)
    raw = collections.defaultdict(list)
    for start, size in {(f["start"], f["size"]) for f in symbols.funcs}:
        normalized[key(candidate, start, size)].append(start)
        raw[(size, SHA(candidate.b[start:start + size]))].append(start)
    pairs = set()
    raw_hits = set()
    matches = {}
    for start, end in windows:
        size = end - start
        hits = normalized[key(original, start, size)]
        matches[start] = hits
        pairs.update((start, hit) for hit in hits)
        if raw[(size, SHA(original.b[start:end]))]:
            raw_hits.add(start)
    return windows, pairs, raw_hits, matches


def differences(original, candidate, original_start, candidate_start, size):
    rows = []
    for offset in range(0, size, 8):
        left = original.normalized[original_start + offset:original_start + offset + 8]
        right = candidate.normalized[candidate_start + offset:candidate_start + offset + 8]
        if left != right:
            rows.append({"offset": hex(offset), "original_hex": left.hex(), "candidate_hex": right.hex()})
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    checkpoint = ROOT / "repro/pump_amm/private-sweep-recovery-20261027/results/build"
    parser.add_argument("--selected-candidate", type=Path, default=checkpoint / "candidate.so")
    parser.add_argument("--selected-symbols", type=Path, default=checkpoint / "unstripped.so")
    parser.add_argument("--local-baseline", type=Path)
    parser.add_argument("--local-candidate", type=Path)
    args = parser.parse_args()

    saved = json.loads((HERE / "result.json").read_text())
    source = ROOT / saved["source"]["path"]
    source_bytes = source.read_bytes()
    parent_bytes = subprocess.check_output(
        ["git", "show", f'{saved["base_commit"]}:{saved["source"]["path"]}'], cwd=ROOT
    )
    assert SHA(parent_bytes) == saved["source"]["parent_sha256"]
    assert SHA(source_bytes) == saved["source"]["proposal_sha256"]
    assert SHA(re.sub(rb"\s+", b"", source_bytes)) == saved["source"]["whitespace_stripped_sha256"]
    assert SHA(re.sub(rb"\s+", b"", parent_bytes)) == saved["source"]["whitespace_stripped_sha256"]
    lines = source.read_text().splitlines()
    assert lines[18].strip() == ".ok_or_else(|| error!(PumpAmmError::Overflow))?"
    assert lines[20].strip() == ".ok_or_else(|| error!(PumpAmmError::DivisionByZero))"
    assert lines[31].strip() == "u64::try_from(value).map_err(|_| error!(PumpAmmError::Truncation))"

    maintained = saved["maintained_checkpoint"]
    assert maintained["inventory"] == {
        "windows": 785, "normalized_matches": 656, "raw_matches": 148, "unmatched": 129
    }
    local = saved["same_host_demonstration"]
    assert local["inventory"]["new_normalized_windows"] == ["0x12b08", "0x13190"]
    assert not local["inventory"]["lost_normalized_windows"]
    assert local["inventory"]["candidate_normalized_matches"] - local["inventory"]["baseline_normalized_matches"] == 2
    assert local["inventory"]["candidate_raw_matches"] == local["inventory"]["baseline_raw_matches"] == 139
    assert sum(row["bytes"] for row in local["recovered_windows"]) == local["inventory"]["new_matched_text_bytes"]
    assert not saved["qualification_attempt"]["maintained_checkpoint_promoted"]

    Elf = load_elf()
    original = Elf(ROOT / "evidence/original/pump_amm/deployed.so")
    candidate = Elf(args.selected_candidate)
    symbols = Elf(args.selected_symbols)
    assert SHA(original.b) == maintained["original_sha256"]
    assert SHA(candidate.b) == maintained["candidate_sha256"]
    assert SHA(symbols.b) == maintained["symbols_sha256"]
    windows, pairs, raw_hits, matches = inventory(original, candidate, symbols)
    assert len({start for start, _ in pairs}) == maintained["inventory"]["normalized_matches"]
    assert len(raw_hits) == maintained["inventory"]["raw_matches"]

    for witness in maintained["before_diagnostics"]:
        original_start = int(witness["original_start"], 16)
        candidate_start = int(witness["candidate_start"], 16)
        expected = [
            {k: row[k] for k in ("offset", "original_hex", "candidate_hex")}
            for row in witness["differences"]
        ]
        assert differences(original, candidate, original_start, candidate_start, witness["bytes"]) == expected
        original_calls = {
            offset: original.calls[original_start + offset]
            for offset in range(0, witness["bytes"], 8)
            if original_start + offset in original.calls
        }
        candidate_calls = {
            offset: candidate.calls[candidate_start + offset]
            for offset in range(0, witness["bytes"], 8)
            if candidate_start + offset in candidate.calls
        }
        assert original_calls.keys() == candidate_calls.keys()
        for offset, target in original_calls.items():
            pair = (target, candidate_calls[offset])
            if pair not in pairs:
                assert original_start == 0x13190 and offset == 0x70
                assert pair == (0x12b08, 0x226a0)

    edge = maintained["direct_calls"]["fee_to_ceil_div"]
    assert original.calls[0x13190 + int(edge["offset"], 16)] == int(edge["original_target"], 16)
    assert candidate.calls[0x22d28 + int(edge["offset"], 16)] == int(edge["candidate_target"], 16)

    local_checked = False
    if args.local_baseline or args.local_candidate:
        assert args.local_baseline and args.local_candidate
        baseline = Elf(args.local_baseline)
        proposal = Elf(args.local_candidate)
        assert SHA(baseline.b) == local["baseline_unstripped_sha256"]
        assert SHA(proposal.b) == local["candidate_unstripped_sha256"]
        _, baseline_pairs, baseline_raw, _ = inventory(original, baseline, baseline)
        _, proposal_pairs, proposal_raw, _ = inventory(original, proposal, proposal)
        baseline_hits = {start for start, _ in baseline_pairs}
        proposal_hits = {start for start, _ in proposal_pairs}
        assert len(baseline_hits) == local["inventory"]["baseline_normalized_matches"]
        assert len(proposal_hits) == local["inventory"]["candidate_normalized_matches"]
        assert [hex(x) for x in sorted(proposal_hits - baseline_hits)] == local["inventory"]["new_normalized_windows"]
        assert proposal_hits >= baseline_hits
        assert len(baseline_raw) == len(proposal_raw) == 139
        local_checked = True

    print(json.dumps({
        "source_identity": "ok",
        "selected_checkpoint_inventory": "656 normalized / 148 raw / 785",
        "selected_diagnostic_witnesses": "3 retained differences verified",
        "selected_direct_call_targets": "17/17 resolved; 16 normalized target pairs plus fee -> proposed ceil_div",
        "same_host_artifacts_checked": local_checked,
        "maintained_checkpoint_promoted": False
    }, indent=2))


if __name__ == "__main__":
    main()
