import struct
def source_fields(e, start, size):
    out = []
    for at in range(start, start + size - 16, 8):
        if e.b[at] != 24 or e.relocations.get(at, {}).get('type') != 8:
            continue
        reg = e.b[at + 1] & 15
        ptr = struct.unpack_from('<I', e.b, at + 4)[0] | struct.unpack_from('<I', e.b, at + 12)[0] << 32
        for st in range(at + 16, min(at + 96, start + size), 8):
            op, rs, off, imm = struct.unpack_from('<BBhi', e.b, st)
            if op in (133, 141, 149) or op & 7 == 5:
                break
            if st != at + 16 or op != 123 or rs >> 4 != reg or (rs & 15 != 10):
                continue
            base = rs & 15
            fields = {}
            for p in range(st + 8, min(st + 192, start + size), 8):
                op2, rs2, off2, imm2 = struct.unpack_from('<BBhi', e.b, p)
                if op2 in (133, 141, 149) or op2 & 7 == 5:
                    break
                if rs2 & 15 == base and (op2 == 122 and off2 == off + 8 or (op2 == 98 and off2 == off + 16)):
                    fields[off2 - off] = (p, imm2)
            if 8 not in fields or 16 not in fields:
                continue
            n = fields[8][1]
            line = fields[16][1]
            if not (0 < n < 512 and 0 < line < 100000):
                continue
            text = e.b[ptr:ptr + n]
            if not text.endswith(b'.rs') or any((v < 32 or v > 126 for v in text)):
                continue
            out.append({'reference': at, 'pointer': ptr, 'pointer_store': st, 'base_register': base, 'field_offset': off, 'length_store': fields[8][0], 'line_store': fields[16][0], 'filename': text.decode(), 'length': n, 'line': line})
            break
    unique = {(x['length_store'], x['line_store']): x for x in out}
    return list(unique.values())
