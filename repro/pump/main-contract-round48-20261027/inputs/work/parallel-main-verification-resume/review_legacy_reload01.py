"""Read-only independent legacy reload CFG and source review."""
from pathlib import Path
import hashlib
import json
import struct
import sys

R = Path(__file__).resolve().parents[2]
W = R / "work/parallel-main-legacy-reload-sync"
O = Path(__file__).resolve().parent
sys.path.insert(0, str(R / "scripts"))
from build_source_manifest import source_manifest
from pump_quote_control_function_match import sections
from pump_compare_function_bytes import body, normalize

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
read = lambda p: json.loads(p.read_text())
inventory = lambda p: {str((R / n).relative_to(p)): h for n, h in source_manifest(p, p, R).items()}
stage = read(W / "STAGED01.json")
assert sha(W / "STAGED01.json") == "840911a51c1a095989e100037c99038bf150da304bac3b233d9581537794ee26"
evidence = read(W / "EVIDENCE01.json")
assert sha(W / "EVIDENCE01.json") == stage["evidence_sha256"]
assert sha(W / "legacy-reload-sync01.patch") == stage["patch_sha256"]
for name, digest in evidence["input_sha256"].items():
    assert sha(R / name) == digest
S, B = R / stage["source"], R / stage["base_source"]
before, after = inventory(B), inventory(S)
assert before == stage["source_before"] and after == stage["source_after"]
assert len(before) == len(after) == stage["input_count"] == 65
assert {n: h for n, h in after.items() if before[n] != h} == stage["changed"]
assert set(stage["changed"]) == {"src/buy.rs", "src/lib.rs"} and stage["new_cases"] == 0

guard = '''
{i}if a.user.key()==a.global.whitelist_pda {{
{i} a.associated_bonding_curve.reload()?;
{i} a.associated_user.reload()?;
{i} let quote_mint=a.bonding_curve.quote_mint;
{i} a.bonding_curve.sync_virtual_quote_reserves(
{i}  a.associated_bonding_curve.amount,
{i}  a.associated_user.amount,
{i}  &quote_mint,
{i} )?;
{i}}}
{i}let c=&a.bonding_curve;
{i}let vb=c.virtual_token_reserves;let vq=c.virtual_quote_reserves;let rb=c.real_token_reserves;let rq=c.real_quote_reserves;'''
late = "let c=&mut a.bonding_curve;c.virtual_token_reserves=vb;c.virtual_quote_reserves=vq;c.real_token_reserves=rb;c.real_quote_reserves=rq;"

def split_lib(text):
    a = text.index("    pub fn buy<")
    b = text.index("    pub fn buy_exact_sol_in", a)
    c = text.index("    pub fn sell(ctx", b)
    d = text.index("    pub fn migrate<", c)
    return text[:a], text[a:b], text[b:c], text[c:d], text[d:]

def reverse_inline(text, direction):
    op = "checked_sub" if direction == "buy" else "checked_add"
    qop = "checked_add" if direction == "buy" else "checked_sub"
    rows = [("vb", "virtual_token_reserves", op, "amount"), ("rb", "real_token_reserves", op, "amount"), ("vq", "virtual_quote_reserves", qop, "quote"), ("rq", "real_quote_reserves", qop, "quote")]
    for v, field, operation, arg in rows:
        new = f"     a.bonding_curve.{field}=a.bonding_curve.{field}.{operation}({arg}).ok_or_else(||error!(PumpError::Overflow))?;"
        old = f"     let {v}=c.{field}.{operation}({arg}).ok_or_else(||error!(PumpError::Overflow))?;"
        assert text.count(new) == 1
        text = text.replace(new, old)
    assert text.count(guard.format(i="     ")) == 1
    text = text.replace(guard.format(i="     "), "")
    if direction == "buy":
        assert text.count("let c=&mut a.bonding_curve;") == 1
        text = text.replace("let c=&mut a.bonding_curve;", late)
    else:
        assert text.count("     emit!(ev.clone());emit_cpi!(ev);Ok(())") == 1
        text = text.replace("     emit!(ev.clone());emit_cpi!(ev);Ok(())", "     " + late + "emit!(ev.clone());emit_cpi!(ev);Ok(())")
    return text

old_parts = split_lib((B / "src/lib.rs").read_text())
new_parts = split_lib((S / "src/lib.rs").read_text())
assert all(old_parts[n] == new_parts[n] for n in [0, 2, 4])
assert reverse_inline(new_parts[1], "buy") == old_parts[1]
assert reverse_inline(new_parts[3], "sell") == old_parts[3]
text = (S / "src/buy.rs").read_text()
assert text.count(guard.format(i=" ")) == 1
text = text.replace(guard.format(i=" "), "")
new = "\n".join(f" a.bonding_curve.{f}={op}(a.bonding_curve.{f},{arg})?;" for f, op, arg in [("virtual_token_reserves", "sub", "amount"), ("virtual_quote_reserves", "add", "quote"), ("real_token_reserves", "sub", "amount"), ("real_quote_reserves", "add", "quote")])
old = " let vb=sub(c.virtual_token_reserves,amount)?;let vq=add(c.virtual_quote_reserves,quote)?;let rb=sub(c.real_token_reserves,amount)?;let rq=add(c.real_quote_reserves,quote)?;"
assert text.count(new) == text.count("let c=&mut a.bonding_curve;") == 1
text = text.replace(new, old).replace("let c=&mut a.bonding_curve;", late)
assert text == (B / "src/buy.rs").read_text()

raw = (R / "evidence/original/pump/deployed.so").read_bytes()
sec = sections(raw)
ins = lambda pc: struct.unpack("<BBhi", body(raw, sec, pc, 8))

def graph(start, size):
    nodes, pc = {}, start
    while pc < start + size:
        nodes[pc] = ins(pc)
        pc += 16 if nodes[pc][0] == 0x18 else 8
    assert pc == start + size
    edges = {}
    for pc, (op, reg, off, imm) in nodes.items():
        nxt = pc + (16 if op == 0x18 else 8)
        edges[pc] = [] if op == 0x95 else [pc + 8 + off * 8] if op in (5, 6) else [nxt, pc + 8 + off * 8] if op & 7 in (5, 6) and op != 0x85 else [nxt]
        assert all(n in nodes for n in edges[pc])
    return nodes, edges

def walk(edges, start, blocked=None):
    if start == blocked:
        return set()
    seen, pending = {start}, [start]
    for pc in pending:
        for n in edges[pc]:
            if n not in seen and n != blocked:
                seen.add(n)
                pending.append(n)
    return seen

def call(pc, target):
    op, reg, off, imm = ins(pc)
    assert (op, reg, off) == (0x85, 0x10, 0) and pc + 8 + imm * 8 == target

details = []
for p in evidence["handlers"]:
    start, size = int(p["original_start"], 16), p["original_bytes"]
    assert hashlib.sha256(body(raw, sec, start, size)).hexdigest() == p["raw_sha256"]
    for pc, value in p["selected_instruction_bytes"].items():
        assert body(raw, sec, int(pc, 16), 8).hex() == value
    nodes, edges = graph(start, size)
    assert len(nodes) == p["cfg_node_count"]
    reachable = walk(edges, start)
    entry, branch, transfer, join = [int(p[k], 16) for k in ["reload_entry", "sole_reload_predecessor", "transfer", "success_join"]]
    assert [pc for pc in reachable if entry in edges[pc]] == [branch]
    assert edges[branch] == [join, entry] and ins(branch)[0:2] == (0x15, 0) and ins(branch)[3] == 0
    writes = [int(x["pc"], 16) for x in p["reserve_write_order"]]
    for n, row in enumerate(p["reserve_write_order"]):
        pc = int(row["pc"], 16)
        assert ins(pc)[0] == 0x7b and ins(pc)[2:] == (int(row["context_offset"], 16), 0)
        assert transfer not in walk(edges, start, pc) and entry not in walk(edges, start, pc)
        if n:
            assert pc not in walk(edges, start, writes[n - 1])
    assert branch not in walk(edges, start, transfer)
    call(transfer, 0x90e60 if p["handler"] == "sell" else 0x91690)
    call(branch - 24, 0x1b3678)
    assert ins(branch - 32) == (0xb7, 3, 0, 32)
    calls = [pc for pc in nodes if nodes[pc][0:3] == (0x85, 0x10, 0)]
    reloads = [pc for pc in calls if pc + 8 + nodes[pc][3] * 8 == 0x7890]
    syncs = [pc for pc in calls if pc + 8 + nodes[pc][3] * 8 == 0xa23f0]
    assert len(reloads) == 2 and len(syncs) == 1
    failures = []
    for pc in reloads:
        b = pc + 24
        assert ins(b)[0] == 0x15 and ins(b)[3] == 2
        assert join not in walk(edges, b + 8)
        failures.append(hex(b + 8))
    sync = syncs[0]
    success = sync + 24
    assert edges[success][1] == join and ins(success)[3] == 2
    assert join not in walk(edges, success + 8)
    payment, event = int(p["following_quote_payment"], 16), int(p["post_join_virtual_quote_snapshot"], 16)
    assert payment not in walk(edges, entry, join) and event not in walk(edges, entry, join)
    assert event not in walk(edges, start, join)
    assert ins(event)[0] == 0x79 and ins(event)[2:] == (0x370, 0)
    details.append({"handler": p["handler"], "nodes": len(nodes), "reload_predecessor": hex(branch), "reserve_write_order": p["reserve_write_order"], "reload_failure_edges_without_join": failures, "sync_failure_without_join": hex(success + 8), "post_join_virtual_quote_snapshot": hex(event)})

candidate = (R / "work/parallel-main-integration/build-round43/unstripped.so").read_bytes()
cs = sections(candidate)
for b in evidence["typed_abi_bindings"]:
    a, c, n = int(b["original_start"], 16), int(b["candidate_start"], 16), b["bytes"]
    assert normalize(body(raw, sec, a, n), a, sec)[0] == normalize(body(candidate, cs, c, n), c, cs)[0]

result = {"status": "approved_source_for_bounded_build", "scope": "Legacy buy/exact/sell whole-handler CFG and exact source delta review", "source": stage["source"], "staged_sha256": sha(W / "STAGED01.json"), "evidence_sha256": sha(W / "EVIDENCE01.json"), "patch_sha256": sha(W / "legacy-reload-sync01.patch"), "source_sha256": after, "changed": stage["changed"], "source_input_count": 65, "new_cases": 0, "cfg_checks": details, "checks": ["All 65 source hashes verified. Outside the legacy buy/sell lib.rs slices, every lib.rs byte is unchanged. Reversing the exact stated edits restores both R46 files byte-for-byte.", "All inline reserve writes dominate the base transfer and reload, in original store order. No shared apply helper was introduced.", "Full raw CFGs independently decoded. Reload has the single whitelist-equality predecessor; all reload and sync error edges are disconnected from the success join.", "Quote payment and event reads cannot be reached from reload without the success join. The post-sync event field is context+0x370.", "Typed transfer and account-constructor normalized matches rechecked. Raw address arithmetic shows base vault+0x110, user+0x1e8, reload inner Account+0x20 and amounts+0x68.", "Original quote-mint copy uses the four words at context+0x348..0x360 before sync, matching the inline curve payload's quote field."], "limits": ["No build, VM, new transaction or production mutation performed.", "Existing fee, validation and resource behavior outside this narrow recovery remains unproven; requires fresh identity and the retained full runtime corpus.", "Source composition must preserve every other R46/R47 input. This is bounded source approval, not whole-handler or whole-binary identity."]}
dest = O / "LEGACY-RELOAD-SYNC-REVIEW01.json"
dest.write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps({"review_sha256": sha(dest), "cfg": details, "changed": stage["changed"]}))
