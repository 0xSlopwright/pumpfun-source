"""Independent read-only R46 source union checks; writes only review evidence."""
from pathlib import Path
import difflib
import hashlib
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "scripts"))
from build_source_manifest import source_manifest

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def read(path):
    return json.loads(path.read_text())

def inventory(path):
    return {str((ROOT / n).relative_to(path)): h
            for n, h in source_manifest(path, path, ROOT).items()}

def sections(text):
    matches = list(re.finditer(r"^pub fn (buy|buy_exact_quote|sell)\(", text, re.M))
    assert [m.group(1) for m in matches] == ["buy", "buy_exact_quote", "sell"]
    a, b, c = [m.start() for m in matches]
    return text[:a], text[a:b], text[b:c], text[c:]

stage_path = ROOT / "work/parallel-main-r46-composition/STAGED01.json"
assert sha(stage_path) == "94feb4fd908a462a15552e7b84ce197965ce44c009abd61b07eb6a3cf84f1c14"
stage = read(stage_path)
source = ROOT / stage["source"]
base = ROOT / stage["base_source"]
buy = ROOT / "work/parallel-main-v3-buy-reload-sync/source01"
migration = ROOT / "work/parallel-main-migration-pool-helpers/source01"
before, after = inventory(base), inventory(source)
assert before == stage["source_before"] and after == stage["source_after"]
assert len(before) == len(after) == stage["primary_input_count"] == 65
changed = {n: h for n, h in after.items() if before[n] != h}
assert changed == stage["changed"]
assert set(changed) == {"src/trade_v3.rs", "src/migrate.rs", "src/migrate_v2.rs"}
assert stage["new_cases"] == 0

for name, digest in stage["proof_sha256"].items():
    assert sha(ROOT / name) == digest, name
buy_stage = read(ROOT / "work/parallel-main-v3-buy-reload-sync/STAGED01.json")
migration_stage = read(ROOT / "work/parallel-main-migration-pool-helpers/STAGED01.json")
assert inventory(buy) == buy_stage["source_after"]
assert inventory(migration) == migration_stage["source_after"]
buy_review = read(ROOT / "work/parallel-main-verification-resume/V3-BUY-RELOAD-SYNC-REVIEW01.json")
migration_review = read(ROOT / "work/parallel-main-migration-pool-helpers/INDEPENDENT-REVIEW01.json")
assert migration_review["reviewed_stage_sha256"] == sha(ROOT / "work/parallel-main-migration-pool-helpers/STAGED01.json")
assert migration_review["source_hashes"]["all_match_staged"] is True
assert migration_review["no_build_or_transactions"] is True

old_parts = sections((base / "src/trade_v3.rs").read_text())
new_parts = sections((source / "src/trade_v3.rs").read_text())
buy_parts = sections((buy / "src/trade_v3.rs").read_text())
assert new_parts[0] == old_parts[0]
assert new_parts[3] == old_parts[3]
assert new_parts[1:3] == buy_parts[1:3]
for block in new_parts[1:3]:
    assert block.count("apply_buy(amount,quote)?") == 1
    assert block.count(".reload()?") == 2
    gate = "if a.user.key()==a.global.whitelist_pda {"
    gate_start = block.index(gate)
    gate_end = block.index("\n    }", gate_start)
    guarded = block[gate_start:gate_end]
    assert guarded.count(".reload()?") == 2
    assert guarded.index("a.associated_base_bonding_curve.reload()?") < guarded.index("a.associated_base_user.reload()?") < guarded.index(".sync_virtual_quote_reserves(")
    assert block.index("apply_buy(amount,quote)?") < block.index("token_interface::transfer_checked(") < gate_start < gate_end < block.index("user_quote_payments::transfer_from_user(")
    assert "virtual_sol_reserves:if is_sol{curve.virtual_quote_reserves}else{0}" in block
    assert "virtual_quote_reserves:curve.virtual_quote_reserves" in block
for name in ["src/migrate.rs", "src/migrate_v2.rs"]:
    assert before[name] == migration_stage["source_before"][name]
    assert (source / name).read_bytes() == (migration / name).read_bytes()
for name in ["src/mayhem_virtual_params.rs", "src/multi_hop_curve_swap.rs", "src/quote_control/state.rs"]:
    assert before[name] == after[name]

patch = "".join("".join(difflib.unified_diff(
    (base / n).read_text().splitlines(True), (source / n).read_text().splitlines(True),
    "a/programs/pump/" + n, "b/programs/pump/" + n)) for n in sorted(changed))
patch_path = ROOT / "work/parallel-main-r46-composition/r46-combined01.patch"
assert patch.encode() == patch_path.read_bytes()
assert sha(patch_path) == stage["patch_sha256"]
report = {
    "status": "approved_source_composition_for_one_mapped_identity",
    "scope": "Independent R46 union of qualified V3 buy/exact whitelist reload and natural migration CPI helpers; main Pump source only",
    "source": stage["source"],
    "base_source": stage["base_source"],
    "source_sha256": after,
    "changed": changed,
    "source_input_count": len(after),
    "new_cases": 0,
    "staged_sha256": sha(stage_path),
    "patch_sha256": sha(patch_path),
    "reviewed_parent_evidence": stage["proof_sha256"],
    "checks": [
        "All 65 base and staged input hashes verified; exactly three source files changed.",
        "Both complete buy function bodies exactly equal the independently reviewed V3 buy/exact packet, retaining its full-CFG predicate, apply/base-CPI/reload/sync/quote-CPI sequence and event reserve reads.",
        "The trade source prefix and entire sell-and-later suffix exactly equal frozen R45, retaining corrected sell reload and the pool-balance helper.",
        "Both migration files exactly equal the independently reviewed ABI packet; their R45 old files equal that packet's old base.",
        "R45 quote-mint inline, sync helper visibility/body and route source are unchanged.",
        "Patch was recomputed and matched exactly; every referenced parent proof hash verified."
    ],
    "selection_gates": [
        "One fresh mapped identity with exact frozen source hash binding.",
        "No stack-offset/exceeded warning, including migrate_v2.",
        "All prior actual normalized and raw window matches retained; current floor 820 normalized and 203 raw.",
        "Full retained 18111-case / 206-suite ordinary-log and state verification, including both migration suites and prior origin repairs."
    ],
    "limits": [
        "This review performed no compiler invocation, transaction run, freeze, installation or publication.",
        "Historical helper identity claims are not fresh candidate measurements; V3 fee/accrual/completion gaps remain unresolved."
    ]
}
dest = OUT / "R46-COMPOSITION-REVIEW01.json"
dest.write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"review_sha256": sha(dest), "source_inputs": len(after), "changed": changed, "status": report["status"]}))
