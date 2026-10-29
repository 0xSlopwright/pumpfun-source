"""Read-only source/arithmetic review for R48 error-origin ownership."""
from pathlib import Path
import hashlib
import json
import struct
import sys

R = Path(__file__).resolve().parents[2]
W = R / "work/parallel-main-sub-origin-recovery"
O = Path(__file__).resolve().parent
sys.path.insert(0, str(R / "scripts"))
from build_source_manifest import source_manifest
from pump_compare_function_bytes import body, normalize
from pump_quote_control_function_match import sections

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
rd = lambda p: json.loads(p.read_text())
inv = lambda p: {str((R / n).relative_to(p)): h for n, h in source_manifest(p, p, R).items()}
s = rd(W / "STAGED01.json")
assert sha(W / "STAGED01.json") == "8126f3d777d7cb1b0b5ea6f2abef36261a19cd30d535a577a14353ff91716d89"
e = rd(W / "EVIDENCE01.json")
assert sha(W / "EVIDENCE01.json") == s["evidence_sha256"]
assert sha(W / "bounded-arithmetic01.patch") == s["patch_sha256"]
B = R / "work/parallel-main-integration/round47-source/programs/pump"
S = R / s["source"]
assert inv(B) == s["source_before"] and inv(S) == s["source_after"]
assert len(s["source_after"]) == 65 and set(s["changed"]) == {"src/trade_v3.rs", "src/multi_hop_curve_swap.rs"}
old, new = (B / "src/trade_v3.rs").read_text(), (S / "src/trade_v3.rs").read_text()
new_inline = """    let pool_base = base_vault_amount.checked_sub(base_amount).ok_or_else(||error!(PumpError::Overflow))?;
    let pool_quote = real_quote_reserves.checked_add(quote_amount).ok_or_else(||error!(PumpError::Overflow))?;
    let pool_quote = if native {
        pool_quote.checked_sub(migration_fee).ok_or_else(||error!(PumpError::Overflow))?
    } else {pool_quote};
"""
old_inline = """    let pool_base = sub(base_vault_amount,base_amount)?;
    let pool_quote = sub(add(real_quote_reserves,quote_amount)?,if native{migration_fee}else{0})?;
"""
assert new.count(new_inline) == 1
restored = new.replace(new_inline, old_inline).replace("pub(crate) fn sub3(", "fn sub3(").replace("use crate::multi_hop_curve::{n,sub};", "use crate::multi_hop_curve::{add,n,sub};")
assert restored == old
old_route = (B / "src/multi_hop_curve_swap.rs").read_text()
new_route = (S / "src/multi_hop_curve_swap.rs").read_text()
assert new_route.replace("let q = crate::trade::sub3(trade_amount,pf,cf)?;", "let q = sub(sub(trade_amount,pf)?,cf)?;").replace("let net = crate::trade::sub3(gross_sell,pf,cf)?;", "let net = sub(sub(gross_sell,pf)?,cf)?;") == old_route
helper = "a.checked_sub(b).and_then(|x|x.checked_sub(c)).ok_or_else(||error!(PumpError::Overflow))"
assert helper in old and helper in new
raw_path = R / "evidence/original/pump/deployed.so"
raw = raw_path.read_bytes(); sec = sections(raw)
assert sha(raw_path) == e["original_sha256"]
for pc, expected in e["instruction_checks"].items():
    assert list(struct.unpack("<BBhi", body(raw, sec, int(pc, 16), 8))) == expected
for pc, value in e["original_boundaries"].items():
    assert hashlib.sha256(body(raw, sec, int(pc, 16), value["bytes"])).hexdigest() == value["body_sha256"]
comparison = rd(W / "SUB3-COMPARISON01.json")
candidate_path = R / "work/parallel-main-integration/build-round47-identity/unstripped.so"
assert sha(candidate_path) == comparison["candidate_sha256"]
candidate = candidate_path.read_bytes(); cs = sections(candidate)
match = comparison["candidates"][0]
left = normalize(body(raw, sec, 0x80488, 576), 0x80488, sec)[0]
right = normalize(body(candidate, cs, match["start"], 576), match["start"], cs)[0]
offsets = [i for i in range(0, 576, 8) if left[i:i+8] != right[i:i+8]]
assert offsets == [440]
assert struct.unpack("<BBhi", left[440:448]) == (0x62, 10, -248, 294)
assert struct.unpack("<BBhi", right[440:448]) == (0x62, 10, -248, 67)
assert len(e["target_rows"]) == 13
report = {"status": "approved_source_for_bounded_build", "scope": "Pure checked arithmetic and physical error-origin ownership only", "source": s["source"], "source_sha256": s["source_after"], "staged_sha256": sha(W / "STAGED01.json"), "evidence_sha256": sha(W / "EVIDENCE01.json"), "changed": s["changed"], "intended_origin_rows": 13, "checks": ["All 65 inputs and exact two-file delta verified. Reversing only visibility, import, pool arithmetic and two route call changes restores R47 byte-for-byte.", "Existing sub3 computes a-b then result-c with a shared Overflow error, matching the two nested checked subtractions on all u64 inputs, including either underflow; no extra operation is introduced.", "Pool arithmetic preserves base subtraction, quote addition, native migration-fee subtraction, and final guards in the same order. Non-native subtract-zero is total and has no observable error or side effect, so omitting it preserves results.", "Both original helper body hashes and all supplied raw instruction checks independently verified. Original 0x80488 and the actual named R47 sub3 differ after standard normalization only at one explicit Source.line store (294 vs 67).", "Generic multi_hop add/sub definitions and every unrelated source byte remain unchanged; no source padding or artificial coordinates added."], "limits": ["Intended 13 filename-origin repairs require measurement on the future compiled candidate.", "Source names/spelling remain inferred; no new normalized/raw body identity claimed.", "No compiler, VM, transaction, or frozen R47 input mutation by reviewer.", "All prior actual body sets and full corpus remain required before selection."]}
out = O / "SUB-ORIGINS-REVIEW01.json"
out.write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"review_sha256": sha(out), "source_inputs": 65, "intended_origins": 13}))
