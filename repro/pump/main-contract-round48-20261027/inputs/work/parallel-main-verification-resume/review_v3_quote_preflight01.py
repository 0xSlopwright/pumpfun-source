"""Independently review quote preflight/balance ordering, without a build or VM."""
from pathlib import Path
import ast
import hashlib
import json
import struct
import sys

R = Path(__file__).resolve().parents[2]
W = R / "work/parallel-main-v3-quote-preflight"
O = Path(__file__).resolve().parent
sys.path.insert(0, str(R / "scripts"))
from build_source_manifest import source_manifest
from pump_compare_function_bytes import body, normalize
from pump_quote_control_function_match import sections

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
rd = lambda p: json.loads(p.read_text())
inv = lambda p: {str((R / n).relative_to(p)): h for n, h in source_manifest(p, p, R).items()}
s = rd(W / "STAGED01.json")
assert sha(W / "STAGED01.json") == "e23b55c7447917144c314afd9bf14db87f6ab77a255edfd69ee9d47aad029b08"
e = rd(W / "EVIDENCE01.json")
assert sha(W / "EVIDENCE01.json") == s["evidence_sha256"]
assert sha(W / "quote-preflight01.patch") == s["patch_sha256"]
for n, h in e["input_sha256"].items():
    assert sha(R / n) == h
B, S = R / s["base_source"], R / s["source"]
assert inv(B) == s["source_before"] and inv(S) == s["source_after"]
assert len(s["source_after"]) == 65 and set(s["changed"]) == {"src/trade_v3.rs"}
old, new = (B / "src/trade_v3.rs").read_text(), (S / "src/trade_v3.rs").read_text()
native_new = " if a.bonding_curve.quote_mint==Pubkey::default(){\n  a.global.validate_buyback_fee_recipient(a.buyback_fee_recipient.key())?;\n  return Ok((None,None))\n }"
native_old = " if a.bonding_curve.quote_mint==Pubkey::default(){return Ok((None,None))}"
assert new.count(native_new) == 1
restored = new.replace(native_new, native_old)
outside = "    if is_sol{a.global.validate_buyback_fee_recipient(a.buyback_fee_recipient.key())?;}\n"
is_sol = "    let is_sol=quote_decimals.is_none();\n"
assert restored.count(is_sol) == 3
restored = restored.replace(is_sol, is_sol + outside)
balance = "    require_gte!(a.associated_base_user.amount,amount,PumpError::NotEnoughTokensToSell);\n"
check = "    let (quote_decimals,quote_fee)=check_quote(a)?;\n" + is_sol
assert restored.count(balance + check) == 1
restored = restored.replace(balance + check + outside, check + balance + outside)
assert restored == old

raw = (R / "evidence/original/pump/deployed.so").read_bytes()
sec = sections(raw)
instruction = lambda pc: struct.unpack("<BBhi", body(raw, sec, pc, 8))
helper = ast.parse((O / "review_v2_reload01.py").read_text())
ns = {"instruction": instruction}
exec(compile(ast.Module(body=[n for n in helper.body if isinstance(n, ast.FunctionDef) and n.name in ["graph", "walk", "call"]], type_ignores=[]), "cfg_helpers", "exec"), ns)
graph, walk, call = ns["graph"], ns["walk"], ns["call"]
inventory = rd(R / "work/parallel-main-integration/build-round47-identity/normalized-inventory.json")
by = {r["start"]: r for r in inventory["windows"]}
for a in [0x14a8a8, 0x7f010, 0x7e490, 0x98438]:
    assert hashlib.sha256(body(raw, sec, a, by[a]["bytes"])).hexdigest() == by[a]["raw_sha256"]
nodes, edges = graph(0x14a8a8, by[0x14a8a8]["bytes"])
assert instruction(0x14a988) == (0x79, 0x81, 0x48, 0)
assert instruction(0x14a990) == (0x79, 0x11, 0x68, 0)
assert instruction(0x14a998) == (0xad, 0x91, 1, 0)
assert 0x14acc8 not in walk(edges, 0x14a8a8, 0x14a998)
assert 0x14acc8 not in walk(edges, 0x14a9a8)
assert edges[0x14a998] == [0x14a9a0, 0x14a9a8]
assert edges[0x14a9a0] == [0x14acb0]
call(0x14acc8, 0x7f010)

def forced_graph(start, forced):
    nodes, edges = graph(start, by[start]["bytes"])
    for pc, chosen in forced.items():
        assert chosen in edges[pc]
        edges[pc] = [chosen]
    return nodes, edges

# Native is the zero result of memcmp(curve.quote_mint, zero_pubkey, 32).
for pc in [0x7f028, 0x7f030, 0x7f038, 0x7f040]:
    assert instruction(pc)[0] == 0x7a and instruction(pc)[3] == 0
assert instruction(0x7f050) == (7, 1, 0, 0x28)
assert instruction(0x7f068) == (0xb7, 3, 0, 32)
call(0x7f070, 0x1b3678)
assert instruction(0x7f078) == (0xbf, 7, 0, 0)
assert instruction(0x7f138) == (0xbf, 0x79, 0, 0)
assert instruction(0x7f888) == (0xb7, 4, 0, 1)
qn, qe = forced_graph(0x7f010, {0x7f150: 0x7f888, 0x7f890: 0x7f8a0, 0x7f950: 0x7fce8})
qr = walk(qe, 0x7f010)
call(0x7f908, 0x7e490)
assert 0x7fc40 not in qr
assert all(pc not in walk(qe, 0x7f010, 0x7f908) for pc in qr if qn[pc][0] == 0x95)
bn, be = forced_graph(0x7e490, {0x7e4a0: 0x7e618})
assert instruction(0x7e4a0) == (0x55, 4, 46, 0)
call(0x7e680, 0x98438)
br = walk(be, 0x7e490)
assert all(pc not in walk(be, 0x7e490, 0x7e680) for pc in br if bn[pc][0] == 0x95)

# Associate the target with the typed Global validator without hiding its two source-line differences.
candidate_path = R / "work/parallel-main-integration/build-round47/unstripped.so"
candidate = candidate_path.read_bytes()
cs = sections(candidate)
left = normalize(body(raw, sec, 0x98438, 1720), 0x98438, sec)[0]
right = normalize(body(candidate, cs, 0x720b8, 1720), 0x720b8, cs)[0]
different = [i for i in range(0, len(left), 8) if left[i:i+8] != right[i:i+8]]
assert different == [1240, 1632]
assert [struct.unpack("<BBhi", left[i:i+8]) for i in different] == [(0x62, 10, -256, 1879), (0x62, 10, -256, 1884)]
assert [struct.unpack("<BBhi", right[i:i+8]) for i in different] == [(0x62, 10, -256, 553), (0x62, 10, -256, 554)]
report = {"status": "approved_source_for_bounded_build", "source": s["source"], "source_sha256": s["source_after"], "staged_sha256": sha(W / "STAGED01.json"), "evidence_sha256": sha(W / "EVIDENCE01.json"), "changed": s["changed"], "checks": ["All 65 input hashes verified; exactly one changed file. Reversing only the stated native-helper move and sell balance reorder restores frozen R47 byte-for-byte.", "Complete SellV3 CFG confirms insufficient base-user balance cannot reach quote preflight; balance comparison dominates that call.", "Native quote branch is established by the zero-pubkey memcmp result. It passes native=true to the buyback helper before success return and cannot reach quote-fee snapshot.", "Native buyback helper calls the Global validator on every returning path. Its typed candidate differs only in two explicit Source.line stores, which remain distinct from body identity.", "Buy/exact source validation order is retained; token quote helper body and prior R47 reload/sync sequences are unchanged."], "counts": {"sell_cfg_nodes": len(nodes), "native_quote_reachable_nodes": len(qr), "native_buyback_reachable_nodes": len(br)}, "limits": ["No source selection, build or VM execution by reviewer.", "Not a full reconstruction of quote/buyback helpers or a new normalized-body match.", "Fresh build, prior matched-set retention and full old/new corpus required before selection."]}
report["typed_validator_reference"] = {"candidate_path": str(candidate_path.relative_to(R)), "candidate_sha256": sha(candidate_path), "candidate_start": "0x720b8", "original_start": "0x98438", "bytes": 1720, "source_line_only_difference_offsets": different}
out = O / "V3-QUOTE-PREFLIGHT-REVIEW01.json"
out.write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"review_sha256": sha(out), "counts": report["counts"]}))
