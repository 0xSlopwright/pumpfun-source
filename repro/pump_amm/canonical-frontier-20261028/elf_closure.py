#!/usr/bin/env python3
"""Read-only raw ELF residual inventory; no relocation or data bytes are masked."""
from pathlib import Path
import hashlib
import importlib.util
import struct


def inspect(original, candidate):
    spec = importlib.util.spec_from_file_location('closure_elf', Path(__file__).with_name('tools')/'elf_reader.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    left, right = module.Elf(Path(original)), module.Elf(Path(candidate))
    rows = []
    for name in sorted(set(left.secs) | set(right.secs)):
        def section(elf):
            if name not in elf.secs:
                return None
            value = elf.secs[name]
            raw = b'' if value[1] == 8 else elf.b[value[4]:value[4]+value[5]]
            return {'type': value[1], 'address': value[3], 'offset': value[4], 'bytes': value[5],
                    'sha256': hashlib.sha256(raw).hexdigest()}
        a, b = section(left), section(right)
        rows.append({'name': name, 'original': a, 'candidate': b,
                     'raw_section_bytes_equal': a is not None and b is not None and a['sha256'] == b['sha256'] and a['bytes'] == b['bytes']})

    def extent(elf):
        data = elf.b
        shoff = struct.unpack_from('<Q', data, 40)[0]
        shsize, shcount = struct.unpack_from('<HH', data, 58)
        phoff = struct.unpack_from('<Q', data, 32)[0]
        phsize, phcount = struct.unpack_from('<HH', data, 54)
        return max(64, shoff + shsize * shcount, phoff + phsize * phcount,
                   *(section[4]+section[5] for section in elf.raw if section[1] != 8))

    a, b = extent(left), extent(right)
    return {'whole_file_equal': left.b == right.b, 'meaningful_elf_equal': left.b[:a] == right.b[:b],
            'original_file_bytes': len(left.b), 'candidate_file_bytes': len(right.b),
            'original_elf_extent': a, 'candidate_elf_extent': b,
            'original_bytes_after_elf': len(left.b)-a, 'candidate_bytes_after_elf': len(right.b)-b,
            'original_text_bytes': left.text[5], 'candidate_text_bytes': right.text[5],
            'original_function_entries': len(left.entries), 'candidate_function_entries': len(right.entries),
            'sections': rows,
            'scope': 'Raw section bytes and layout. Account allocation tail is reported separately, without changing either equality test.'}
