#!/usr/bin/env python3
"""Check a source proposal and its exact original/selected static witnesses.

This never builds or executes either ELF. Passing is not candidate qualification.
"""
import argparse
import hashlib
import json
import pathlib
import re
import struct

ROOT = pathlib.Path(__file__).resolve().parent


def require(condition, message):
    if not condition:
        raise ValueError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


class Elf:
    def __init__(self, path):
        self.data = pathlib.Path(path).read_bytes()
        require(self.data[:6] == b"\x7fELF\x02\x01", "ELF64 little endian required")
        shoff = struct.unpack_from("<Q", self.data, 40)[0]
        size, count, names_index = struct.unpack_from("<HHH", self.data, 58)
        require(size == 64, "unexpected section entry size")
        sections = [struct.unpack_from("<IIQQQQIIQQ", self.data, shoff + i * size)
                    for i in range(count)]
        names_row = sections[names_index]
        names = self.data[names_row[4]:names_row[4] + names_row[5]]
        self.sections = {names[row[0]:].split(b"\0", 1)[0].decode(): row
                         for row in sections}
        self.externals = {}
        rel = self.sections[".rel.dyn"]
        dyn = self.sections[".dynsym"]
        strings = self.sections[".dynstr"]
        strings_data = self.data[strings[4]:strings[4] + strings[5]]
        for offset in range(rel[4], rel[4] + rel[5], rel[9] or 16):
            address, info = struct.unpack_from("<QQ", self.data, offset)
            if info & 0xffffffff == 10:
                name = struct.unpack_from("<I", self.data, dyn[4] + (info >> 32) * 24)[0]
                self.externals[address] = strings_data[name:].split(b"\0", 1)[0].decode()

    def body(self, start, length):
        row = self.sections[".text"]
        require(row[3] <= start and start + length <= row[3] + row[5], "text range")
        offset = row[4] + start - row[3]
        return self.data[offset:offset + length]

    def calls(self, start, length):
        body = self.body(start, length)
        defined, external = [], []
        offset = 0
        while offset < length:
            opcode, registers, _, immediate = struct.unpack_from("<BBhi", body, offset)
            if opcode == 0x85:
                address = start + offset
                require(registers == 0x10, "unexpected call encoding")
                if address in self.externals:
                    external.append((offset, self.externals[address]))
                else:
                    require(immediate != -1, "unresolved external call")
                    defined.append((offset, address + 8 + immediate * 8))
            offset += 16 if opcode == 0x18 else 8
        return defined, external


def source_sites(text):
    kinds = ["error!(", "require!(", "panic!(", ".unwrap(", ".expect("]
    sites = []
    for line_number, line in enumerate(text.splitlines(), 1):
        for kind in kinds:
            for match in re.finditer(re.escape(kind), line):
                sites.append({"kind": kind, "line": line_number, "column": match.start() + 1})
    return sorted(sites, key=lambda item: (item["line"], item["column"], item["kind"]))


def verify_source(packet=ROOT):
    proof = json.loads((packet / "evidence/borrow-proof.json").read_text())
    before = (packet / "source/admin_cto.before.rs").read_bytes()
    after = (packet / "source/admin_cto.rs").read_bytes()
    require(sha(before) == "6353b1f7b9e613bb8d819000c504d44410b04f7da7dfbdc7fb2e5132df100180", "before source")
    require(sha(after) == "f4a2bb7d33431e0fb4911e39d5e03c8bb9f45c6f7a184da21d1a6762f9127955", "proposal source")
    require(sha(before) == proof["before_sha256"] and sha(after) == proof["after_sha256"], "proof binding")
    transformed = before.decode()
    require(len(proof["changes"]) == 7, "seven scoped substitutions required")
    for change in proof["changes"]:
        require(transformed.count(change["before"]) == 1, "substitution must be unique")
        transformed = transformed.replace(change["before"], change["after"])
    require(transformed.encode() == after, "proposal differs outside declared substitutions")
    require(before.count(b"\n") == after.count(b"\n") == proof["line_count"], "line count changed")
    require(source_sites(before.decode()) == source_sites(after.decode()) == proof["source_and_panic_sites_unchanged"], "explicit Source/panic token locations changed")
    frozen = "fn token_frozen(a:&AccountInfo)->Result<bool>{if a.data_is_empty(){return Ok(false);}"
    require(frozen in before.decode() and frozen in after.decode(), "empty helper guard changed")
    return proof


def context_bytes(text):
    rows = []
    for line in text.splitlines():
        match = re.search(r":\s*((?:[0-9a-f]{2} ){7}[0-9a-f]{2})\s", line)
        require(match is not None, "malformed instruction witness")
        rows.append(bytes.fromhex(match[1]))
    return b"".join(rows)


def verify_elf(elf, label, proof, record):
    image_sha = proof["original_elf_sha256"] if label == "original" else proof["selected_elf_sha256"]
    require(sha(elf.data) == image_sha, label + " image binding")
    row = record[label]
    start, length = int(row["start"], 16), row["bytes"]
    require(sha(elf.body(start, length)) == row["window_sha256"], label + " window binding")
    defined, external = elf.calls(start, length)
    require(len(defined) == row["defined_calls"], label + " defined call count")
    require([hex(offset) for offset, _ in external] == row["relocated_external_calls"], label + " external call offsets")
    require([name for _, name in external] == (["sol_log_", "abort", "sol_log_"] if label == "original" else ["sol_log_"] * 3), label + " external identities")
    for site in proof["argument_sites"]:
        offset_key, context_key = (("original_offset", "original_argument_context") if label == "original"
                                   else ("candidate_offset", "current_argument_context"))
        offset = int(site[offset_key], 16)
        witness = context_bytes(site[context_key])
        require(elf.body(start + offset + 8 - len(witness), len(witness)) == witness, label + " argument witness " + site["operation"])
        require(any(position == offset for position, _ in defined), label + " helper call witness")
    return {"defined_calls": len(defined), "external_calls": external,
            "bytes": length, "window_sha256": row["window_sha256"]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--original", type=pathlib.Path)
    parser.add_argument("--selected-symbols", type=pathlib.Path)
    args = parser.parse_args()
    proof = verify_source()
    record = json.loads((ROOT / "evidence/input-and-call-proof.json").read_text())
    result = {"source_overlay": "PASS", "compiled_proposal": False,
              "proposal_census": "pending", "proposal_runtime": "pending"}
    for label, path in [("original", args.original), ("candidate", args.selected_symbols)]:
        if path is not None:
            result[label + "_static_witnesses"] = verify_elf(Elf(path), label, proof, record)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
