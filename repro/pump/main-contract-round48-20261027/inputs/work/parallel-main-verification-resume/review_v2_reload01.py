"""Independently verify V2 reload source and raw SBPF control flow, without a build."""
from pathlib import Path
import hashlib
import json
import struct
import sys

R = Path(__file__).resolve().parents[2]
W = R / "work/parallel-main-v2-reload-sync"
O = Path(__file__).resolve().parent
sys.path.insert(0, str(R / "scripts"))
from build_source_manifest import source_manifest
from pump_quote_control_function_match import sections
from pump_compare_function_bytes import body, normalize

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
read = lambda p: json.loads(p.read_text())
inv = lambda p: {str((R / n).relative_to(p)): h for n, h in source_manifest(p, p, R).items()}
stage = read(W / "STAGED01.json")
assert sha(W / "STAGED01.json") == "f69a2e672e912eff020899c223b73f476a5076028725775e8a64d14057c7042b"
proof = read(W / "EVIDENCE01.json")
assert sha(W / "EVIDENCE01.json") == stage["evidence_sha256"]
assert sha(W / "v2-reload-sync01.patch") == stage["patch_sha256"]
for name, digest in proof["input_sha256"].items():
    assert sha(R / name) == digest, name
S, B = R / stage["source"], R / stage["base_source"]
before, after = inv(B), inv(S)
assert before == stage["source_before"] and after == stage["source_after"]
assert len(before) == len(after) == stage["input_count"] == 65
assert {n: h for n, h in after.items() if before[n] != h} == stage["changed"]
assert set(stage["changed"]) == {"src/buy_v2.rs", "src/sell_v2.rs"} and stage["new_cases"] == 0

guard = '''
 if a.user.key()==a.global.whitelist_pda {
  a.associated_base_bonding_curve.reload()?;
  a.associated_base_user.reload()?;
  let quote_mint=a.bonding_curve.quote_mint;
  a.bonding_curve.sync_virtual_quote_reserves(
   a.associated_base_bonding_curve.amount,
   a.associated_base_user.amount,
   &quote_mint,
  )?;
 }
 let c=&a.bonding_curve;
 let vb=c.virtual_token_reserves;let vq=c.virtual_quote_reserves;let rb=c.real_token_reserves;let rq=c.real_quote_reserves;'''
late = "let c=&mut a.bonding_curve;c.virtual_token_reserves=vb;c.virtual_quote_reserves=vq;c.real_token_reserves=rb;c.real_quote_reserves=rq;"
for filename, direction, count in [("buy_v2.rs", "buy", 2), ("sell_v2.rs", "sell", 1)]:
    new = (S / "src" / filename).read_text()
    assert new.count(guard) == new.count(f"a.bonding_curve.apply_{direction}(amount,quote)?;") == count
    original_calc = (" let vb=sub(c.virtual_token_reserves,amount)?;let vq=add(c.virtual_quote_reserves,quote)?;let rb=sub(c.real_token_reserves,amount)?;let rq=add(c.real_quote_reserves,quote)?;" if direction == "buy" else " let vb=add(c.virtual_token_reserves,amount)?;let vq=sub(c.virtual_quote_reserves,quote)?;let rb=add(c.real_token_reserves,amount)?;let rq=sub(c.real_quote_reserves,quote)?;")
    restored = new.replace(guard, "").replace(f" a.bonding_curve.apply_{direction}(amount,quote)?;", original_calc)
    if direction == "buy":
        assert restored.count("let c=&mut a.bonding_curve;") == 2
        restored = restored.replace("let c=&mut a.bonding_curve;", late)
    else:
        assert restored.count(" emit!(ev.clone());emit_cpi!(ev);Ok(())") == 1
        restored = restored.replace(" emit!(ev.clone());emit_cpi!(ev);Ok(())", " " + late + "emit!(ev.clone());emit_cpi!(ev);Ok(())")
    assert restored == (B / "src" / filename).read_text(), filename

raw = (R / "evidence/original/pump/deployed.so").read_bytes()
sec = sections(raw)
instruction = lambda pc: struct.unpack("<BBhi", body(raw, sec, pc, 8))

def graph(start, size):
    nodes = {}
    pc = start
    while pc < start + size:
        nodes[pc] = instruction(pc)
        pc += 16 if nodes[pc][0] == 0x18 else 8
    assert pc == start + size
    edges = {}
    for pc, (op, reg, offset, imm) in nodes.items():
        next_pc = pc + (16 if op == 0x18 else 8)
        if op == 0x95:
            edges[pc] = []
        elif op in (0x05, 0x06):
            edges[pc] = [pc + 8 + offset * 8]
        elif op & 7 in (5, 6) and op != 0x85:
            edges[pc] = [next_pc, pc + 8 + offset * 8]
        else:
            edges[pc] = [next_pc]
        assert all(n in nodes for n in edges[pc])
    return nodes, edges

def walk(edges, start, blocked=None):
    if start == blocked:
        return set()
    seen, pending = {start}, [start]
    for pc in pending:
        for nxt in edges[pc]:
            if nxt != blocked and nxt not in seen:
                seen.add(nxt)
                pending.append(nxt)
    return seen

def call(pc, target):
    op, reg, off, imm = instruction(pc)
    assert (op, reg, off) == (0x85, 0x10, 0) and pc + 8 + imm * 8 == target, hex(pc)

def load(pc, dst, src, offset):
    assert instruction(pc) == (0x79, src * 16 + dst, offset, 0), hex(pc)

handlers = [
    dict(name="buy", start=0x13b9b8, apply=0x13d430, transfer=0x13d5c8, cmp=0x13d660, guard=0x13d678, entry=0x13de60, reloads=[0x13de80, 0x13dec0], sync=0x13df70, join=0x13d680, event=0x13db30, roles=[0x13d468, 0x13d460], context=9, user=0x13d5e8, glob=0x13d638),
    dict(name="exact", start=0x13f630, apply=0x141fe0, transfer=0x142178, cmp=0x142210, guard=0x142228, entry=0x142ce0, reloads=[0x142d00, 0x142d40], sync=0x142df0, join=0x142230, event=0x1426d8, roles=[0x142018, 0x142010], context=8, user=0x142198, glob=0x1421e8),
    dict(name="sell", start=0x144508, apply=0x146038, transfer=0x1460e0, cmp=0x146180, guard=0x146198, entry=0x146a80, reloads=[0x146aa8, 0x146af0], sync=0x146ba8, join=0x1461a0, event=0x146688, roles=[0x146070, 0x146068], context=5, user=0x146108, glob=0x146158),
]
checks = []
for h, p in zip(handlers, proof["handlers"]):
    assert h["name"] == p["handler"] and h["start"] == int(p["original_start"], 16)
    size = p["original_bytes"]
    assert hashlib.sha256(body(raw, sec, h["start"], size)).hexdigest() == p["raw_sha256"]
    for pc, hex_bytes in p["selected_instruction_bytes"].items():
        assert body(raw, sec, int(pc, 16), 8).hex() == hex_bytes
    nodes, edges = graph(h["start"], size)
    reachable = walk(edges, h["start"])
    assert len(nodes) == p["cfg_node_count"] and h["entry"] in reachable
    pred = [pc for pc in reachable if h["entry"] in edges[pc]]
    assert pred == [h["guard"]]
    for mandatory in [h["apply"], h["transfer"], h["cmp"], h["guard"]]:
        assert h["entry"] not in walk(edges, h["start"], mandatory)
    assert h["transfer"] not in walk(edges, h["start"], h["apply"])
    assert instruction(h["guard"])[0:2] == (0x15, 0) and instruction(h["guard"])[3] == 0
    assert edges[h["guard"]] == [h["join"], h["entry"]]
    call(h["apply"], 0xa13e0 if h["name"] == "sell" else 0xa0bf0)
    call(h["transfer"], 0x8fe18 if h["name"] == "sell" else 0x8f5c8)
    call(h["cmp"], 0x1b3678)
    assert instruction(h["cmp"] - 8) == (0xb7, 3, 0, 32)
    context = 3 if h["name"] == "sell" else h["context"]
    load(h["user"], 1, context, 0x158)
    load(h["glob"], 2, context, 0xf0)
    assert instruction(h["glob"] + 8) == (7, 2, 0, 0x288)
    for pc, dst, offset in zip(h["roles"], [3, 4], [0x160, 0x148] if h["name"] == "sell" else [0x148, 0x160]):
        load(pc, dst, h["context"], offset)
    error_paths = []
    for pc in h["reloads"]:
        call(pc, 0x7890)
        branch = pc + 16
        assert instruction(branch)[0] == 0x15 and instruction(branch)[3] == 2
        error_start = branch + 8
        error_reachable = walk(edges, error_start)
        assert h["join"] not in error_reachable and h["event"] not in error_reachable
        error_paths.append(hex(error_start))
    call(h["sync"], 0xa23f0)
    success_branch = h["sync"] + 16
    assert instruction(success_branch)[0] == 0x15 and instruction(success_branch)[3] == 2
    assert edges[success_branch][1] == h["join"]
    assert h["join"] not in walk(edges, success_branch + 8)
    assert int(p["first_following_quote_payment"], 16) not in walk(edges, h["entry"], h["join"])
    assert h["event"] not in walk(edges, h["entry"], h["join"])
    assert h["event"] not in walk(edges, h["start"], h["join"])
    assert instruction(h["event"]) == (0x79, 0x12, 0x50, 0)
    checks.append({"handler": h["name"], "nodes": len(nodes), "reachable_nodes": len(reachable), "reload_predecessor": hex(h["guard"]), "error_paths_without_join": error_paths, "event_virtual_quote_read": hex(h["event"])})

candidate = (R / "work/parallel-main-integration/build-round43/unstripped.so").read_bytes()
candidate_sections = sections(candidate)
for b in proof["typed_abi_bindings"]:
    start, target, size = int(b["original_start"], 16), int(b["candidate_start"], 16), b["bytes"]
    assert normalize(body(raw, sec, start, size), start, sec)[0] == normalize(body(candidate, candidate_sections, target, size), target, candidate_sections)[0]

result = {
    "status": "approved_source_for_bounded_build",
    "scope": "Independent whole-handler CFG and reversible source review of V2 buy/exact/sell whitelist reload/sync",
    "source": stage["source"], "staged_sha256": sha(W / "STAGED01.json"),
    "evidence_sha256": sha(W / "EVIDENCE01.json"), "patch_sha256": sha(W / "v2-reload-sync01.patch"),
    "source_sha256": after, "changed": stage["changed"], "source_input_count": 65, "new_cases": 0,
    "cfg_checks": checks,
    "checks": [
        "All 65 input hashes and exactly two changed files verified. Reversing only the specified apply, guarded reload/sync, reserve snapshot and late-assignment edits recovers both R45 source files byte-for-byte.",
        "Complete raw instruction graphs independently decoded; removing each apply, base-transfer, comparison or guard node disconnects reload from function entry.",
        "Each reload block has exactly one predecessor: the 32-byte user-key/Global+0x288 equality branch; source uses Global.whitelist_pda as previously independently mapped.",
        "Typed normalized transfer helpers bind source and destination roles; buys use vault then user, sell reverses transfer roles. Reload/sync arguments remain vault then user.",
        "Both reload error paths and sync error paths cannot reach success join; neither quote payment nor event reserve read is reachable from the reload block without that join.",
        "All three event snapshot instructions read Account+0x50 after the join, matching post-sync virtual quote. The source no longer overwrites that value with a pre-sync calculation.",
        "Existing apply helpers change only four reserve fields; complete is still set at the original later source point. No other validation or payment statement moved."
    ],
    "limits": [
        "No compiler, transaction, freeze, installation or publication run by this reviewer.",
        "Normalized helper/context comparisons prove only their normalization domains, not data, full handler, or whole ELF identity.",
        "Other V2 fee/payment/accrual structures remain unclosed. Selection requires fresh identity and the full prior runtime corpus without losses.",
        "Composition onto R46 or later must verify the exact before hashes of both V2 files and preserve every other source input."
    ]
}
dest = O / "V2-RELOAD-SYNC-REVIEW01.json"
dest.write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps({"review_sha256": sha(dest), "checks": checks, "changed": stage["changed"]}))
