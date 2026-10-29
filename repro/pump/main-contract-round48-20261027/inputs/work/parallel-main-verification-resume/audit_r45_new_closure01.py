"""Read-only, bounded call/data audit for two new R45 body matches."""
from pathlib import Path
import collections
import hashlib
import json
import struct
import sys

R = Path(__file__).resolve().parents[2]
O = Path(__file__).resolve().parent
B = R / "work/parallel-main-integration/build-round45"
sys.path.insert(0, str(R / "scripts"))
from pump_quote_control_function_match import sections
from pump_compare_function_bytes import body, normalize

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
digest = lambda b: hashlib.sha256(b).hexdigest()
original = R / "evidence/original/pump/deployed.so"
candidate = B / "unstripped.so"
ob, cb = original.read_bytes(), candidate.read_bytes()
os, cs = sections(ob), sections(cb)
inventory = json.loads((B / "normalized-inventory.json").read_text())
assert inventory["original_sha256"] == sha(original)
assert inventory["candidate_sha256"] == sha(candidate)
by = {x["start"]: x for x in inventory["windows"]}

def read(image, image_sections, address, length):
    matched = [s for s in image_sections.values() if s["addr"] and s["addr"] <= address < address + length <= s["addr"] + s["size"]]
    assert matched
    s = matched[0]
    offset = s["offset"] + address - s["addr"]
    return image[offset:offset + length]

def relocations(image, image_sections):
    s = image_sections[".rel.dyn"]
    result = {}
    for offset in range(s["offset"], s["offset"] + s["size"], 16):
        address, kind = struct.unpack_from("<QQ", image, offset)
        if kind == 8:
            low, high = struct.unpack("<II", read(image, image_sections, address, 8))
            # Instruction relocations have a different carrier. This audit uses
            # only whole-word data pointers with the SBPF low-zero/high-address form.
            if low == 0:
                result[address] = high
    return result

def symbols(image, image_sections):
    table, names = image_sections[".symtab"], image_sections[".strtab"]
    strings = image[names["offset"]:names["offset"] + names["size"]]
    result = collections.defaultdict(list)
    for at in range(table["offset"], table["offset"] + table["size"], 24):
        name, info, other, index, value, size = struct.unpack_from("<IBBHQQ", image, at)
        if value and size:
            result[value].append({"name": strings[name:strings.find(b"\0", name)].decode(), "bytes": size, "type": info & 15})
    return result

syms = symbols(cb, cs)
orr, crr = relocations(ob, os), relocations(cb, cs)

def compare_callee(a, b):
    row = by[a]
    n = row["bytes"]
    left, right = body(ob, os, a, n), body(cb, cs, b, n)
    norm_equal = normalize(left, a, os)[0] == normalize(right, b, cs)[0]
    assert norm_equal
    names = [x["name"] for x in syms[b] if x["type"] == 2 and x["bytes"] == n]
    assert names
    return {"original": hex(a), "candidate": hex(b), "bytes": n, "candidate_symbols": names, "raw_equal": left == right, "normalized_equal": norm_equal, "original_body_sha256": digest(left), "candidate_body_sha256": digest(right)}

functions = []
for address in [0x7890, 0x68bd8]:
    row = by[address]
    assert len(row["normalized_matches"]) == 1
    match = row["normalized_matches"][0]
    left, right = body(ob, os, address, row["bytes"]), body(cb, cs, match["start"], row["bytes"])
    on, oo = normalize(left, address, os)
    cn, co = normalize(right, match["start"], cs)
    assert on == cn and oo == row["original_operands"] and co == match["operands"]
    others = {x["offset"]: x for x in co}
    calls = []
    for item in oo:
        if item["kind"] == "direct-call":
            pair = compare_callee(item["target"], others[item["offset"]]["target"])
            calls.append({"offset": item["offset"], **pair})
    functions.append({"original": hex(address), "candidate": hex(match["start"]), "bytes": row["bytes"], "candidate_symbol": match["symbol"], "normalized_equal": True, "raw_equal": left == right, "direct_calls": calls, "embedded_elf_pointer_count": sum(x["kind"] == "elf-pointer" for x in oo)})

specifications = [
    ("allowed quote pubkey 1", 0x1b5cc8, 0x1b90d0, 32, "Immediate r3=32 before memcmp consumes this exact byte span."),
    ("allowed quote pubkey 2", 0x1b5a88, 0x1b8e50, 32, "Immediate r3=32 before memcmp consumes this exact byte span."),
    ("PumpError discriminant 69", 0x1b5e64, 0x1b926c, 4, "PumpError name/display entry reads a 32-bit discriminant from the passed pointer."),
    ("PumpError discriminant 67", 0x1b5e24, 0x1b922c, 4, "PumpError name/display entry reads a 32-bit discriminant from the passed pointer."),
    ("PumpError discriminant 66", 0x1b5e60, 0x1b9268, 4, "PumpError name/display entry reads a 32-bit discriminant from the passed pointer."),
    ("Anchor source filename", 0x1b6ef5, 0x1ba622, 40, "SourceLocation filename slice has explicit length 40; candidate symbol has size 40."),
    ("formatting panic message", 0x1b5fa4, 0x1b93c0, 55, "unwrap_failed r2=55; candidate literal symbol has size 55."),
]
data = []
for label, a, b, n, extent in specifications:
    left, right = read(ob, os, a, n), read(cb, cs, b, n)
    assert left == right
    data.append({"label": label, "original": hex(a), "candidate": hex(b), "compared_bytes": n, "extent_basis": extent, "raw_equal": True, "sha256": digest(left), "hex": left.hex()})

tables = []
for label, a, b, n, slots in [("String fmt::Write vtable", 0x1bd838, 0x1c0c00, 48, [0, 24, 32, 40]), ("fmt::Error Debug vtable", 0x1bd868, 0x1c0c30, 32, [0, 24])]:
    assert any(s["type"] == 1 and s["bytes"] == n for s in syms[b])
    left, right = read(ob, os, a, n), read(cb, cs, b, n)
    assert left == right
    callees = []
    for slot in slots:
        assert orr[a + slot] == crr[b + slot]
        callees.append({"slot": slot, **compare_callee(orr[a + slot], crr[b + slot])})
    tables.append({"label": label, "original": hex(a), "candidate": hex(b), "compared_bytes": n, "extent_basis": "Candidate symbol size plus typed Rust vtable words (drop, size, align, trait methods). No original linker-allocation extent inferred beyond those words.", "raw_equal": True, "sha256": digest(left), "code_slots": callees})

# A Rust panic Location has one &str (pointer/length) and line/column u32s.
a, b, n = 0x1bd888, 0x1c0c50, 24
assert any(s["type"] == 1 and s["bytes"] == n for s in syms[b])
left, right = read(ob, os, a, n), read(cb, cs, b, n)
olen, oline, ocol = struct.unpack_from("<QII", left, 8)
clen, cline, ccol = struct.unpack_from("<QII", right, 8)
assert (olen, oline, ocol) == (clen, cline, ccol) == (84, 2559, 14)
opath, cpath = read(ob, os, orr[a], olen), read(cb, cs, crr[b], clen)
assert opath == cpath
location = {"original": hex(a), "candidate": hex(b), "compared_bytes": n, "extent_basis": "Rust Location layout (&str,u32,u32) and candidate symbol size 24", "raw_equal": left == right, "semantic_equal": True, "line": oline, "column": ocol, "filename_length": olen, "filename": opath.decode(), "filename_sha256": digest(opath), "relocated_original_filename": hex(orr[a]), "relocated_candidate_filename": hex(crr[b])}

result = {"status": "bounded_call_and_data_audit_passed", "scope": "Actual final R45 new normalized windows 0x7890 and 0x68bd8 only", "input_sha256": {str(p.relative_to(R)): sha(p) for p in [original, candidate, B / "candidate.so", B / "normalized-inventory.json", B / "build-comparison.json"]}, "functions": functions, "data_values": data, "trait_vtables": tables, "panic_location": location, "conclusions": ["All 31 direct call occurrences across the two windows target named normalized-equal actual candidate callees.", "The reload body contains no embedded ELF-pointer operand; its direct callees are verified separately.", "Every direct embedded data reference in the quote validator resolves to the typed values, two vtables, or panic Location recorded here.", "Seven directly referenced bounded byte spans, two complete typed vtables, and the 84-byte indirect panic filename are byte-equal. The 24-byte Location differs only in its relocated filename pointer and is semantically equal.", "All six vtable code slots target named normalized-equal actual functions; scalar vtable fields and encoded pointer values are byte-equal."], "limits": ["This does not make either entire function raw-byte equal; direct-call and data addresses still differ.", "Callee normalization is not recursive transitive data closure or whole-binary identity. Runtime behavior is not exercised by this audit.", "String and error discriminant spans are usage-bounded values, not inferred original linker allocation extents. No arbitrary fixed prefix is called an object.", "Physical source filename bytes and Source coordinates are reported separately from business semantics."]}
assert sum(len(f["direct_calls"]) for f in functions) == 31
dest = O / "R45-NEW-BODY-CLOSURE01.json"
dest.write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps({"review_sha256": sha(dest), "direct_calls": sum(len(f["direct_calls"]) for f in functions), "data_values": len(data), "vtables": len(tables), "location_semantic_equal": location["semantic_equal"]}))
