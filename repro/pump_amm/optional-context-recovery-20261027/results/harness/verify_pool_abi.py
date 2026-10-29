#!/usr/bin/env python3
"""Check original Pool helper instructions and the dedicated deposit call ABI."""
from pathlib import Path
import argparse
import hashlib
import importlib.util
import json
import struct


def verify(candidate, symbols, repo_root):
    root, candidate_path, symbols_path = map(Path, (repo_root, candidate, symbols))
    sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
    reader_path = root/'repro/pump_amm/claim-self-transfer-v144/static-tool/elf_reader.py'
    spec = importlib.util.spec_from_file_location('pool_abi_elf', reader_path)
    reader = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(reader)
    original_path = root/'evidence/original/pump_amm/deployed.so'
    assert sha(original_path) == '6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
    original, candidate, symbols = map(reader.Elf, (original_path, candidate_path, symbols_path))
    assert candidate.b[candidate.lo:candidate.hi] == symbols.b[symbols.lo:symbols.hi]

    def named(fragment):
        rows = [f for f in symbols.funcs if fragment in f['name']]
        assert len(rows) == 1, (fragment, rows)
        return rows[0]

    def body(function):
        return candidate.normalized[function['start']:function['start']+function['size']]

    rows, functions = [], {}
    specs = [('total_accrued_fees',0x6ba68,616,0x200),
             ('available_quote_reserves',0x6bcd0,640,0x218),
             ('market_cap',0x6b780,744,0x270),
             ('total_virtual_quote_reserves',0x6bf50,760,0x280)]
    for name, address, size, line_offset in specs:
        function = named(str(len(name))+name+'17h')
        functions[name] = function
        assert function['size'] == size
        a, b = original.normalized[address:address+size], body(function)
        differences = [off for off in range(0,size,8) if a[off:off+8] != b[off:off+8]]
        assert differences == [line_offset], (name, differences)
        assert a[line_offset:line_offset+4] == b[line_offset:line_offset+4] == bytes.fromhex('620a08ff')
        assert original.pattern(address,size) == candidate.pattern(function['start'],size)
        rows.append({'name':name,'original_start':hex(address),'candidate_start':hex(function['start']),
                     'bytes':size,'all_non_origin_instructions_equal':True,'relocation_pattern_equal':True,
                     'source_line_difference':{'offset':hex(line_offset),
                         'original':struct.unpack_from('<i',a,line_offset+4)[0],
                         'candidate':struct.unpack_from('<i',b,line_offset+4)[0]}})

    available = functions['available_quote_reserves']
    total = functions['total_accrued_fees']
    virtual = functions['total_virtual_quote_reserves']
    assert candidate.b[available['start']:available['start']+8] == bytes.fromhex('bf37000000000000')
    assert candidate.calls[available['start']+32] == total['start']
    assert candidate.calls[virtual['start']+40] == total['start']
    predicate = named('9can_boost17h')
    assert predicate['size'] == 224 and body(predicate) == original.normalized[0x6c248:0x6c248+224]
    assert candidate.pattern(predicate['start'],224) == original.pattern(0x6c248,224)
    assert candidate.calls[predicate['start']+24] == virtual['start']

    # The dedicated deposit body remains the actual global dispatch target;
    # identify it by the authenticated direct call rather than a module name.
    wrapper = named('9__private8__global7deposit17h')
    assert wrapper['size'] == 1336
    target = candidate.calls[wrapper['start']+544]
    functions_by_start = {f['start']:f for f in symbols.funcs}
    deposit = functions_by_start[target]
    assert 'deposit' in deposit['name'] and deposit['size'] > 1336
    calls = [s for s in candidate.callsites(deposit['start'],deposit['size'])
             if s['target'] == available['start']]
    assert len(calls) == 1
    site = deposit['start']+calls[0]['offset']
    setup = candidate.b[site-64:site]
    insns = [struct.unpack_from('<BBhi', setup, off) for off in range(0,len(setup),8)]
    # Source Account<Pool> is dereferenced (+8) into ABI argument r2;
    # quote-token amount is loaded at TokenAccount.amount (+104) into r3.
    assert (0x07,0x02,0,8) in insns, 'Pool argument r2 adjustment missing'
    assert any(op == 0x79 and regs & 15 == 3 and off == 104 for op,regs,off,imm in insns), 'Quote amount argument r3 load missing'
    assert not any(op == 0x79 and off in (264,272) for op,regs,off,imm in insns), 'Promoted accrued-fee scalar loads returned'
    return {'candidate_sha256':sha(candidate_path),'symbols_sha256':sha(symbols_path),
            'original_sha256':sha(original_path),'reader_sha256':sha(reader_path),
            'helpers':rows,'predicate':{'original':'0x6c248','candidate':hex(predicate['start']),
                                      'bytes':224,'normalized_exact':True},
            'deposit':{'candidate':hex(deposit['start']),'symbol':deposit['name'],
                       'bytes':deposit['size'],'global_wrapper_bytes':wrapper['size'],
                       'global_call_offset':544,'available_quote_call_offset':calls[0]['offset'],
                       'pool_reference_in_r2':True,'quote_in_r3':True,
                       'promoted_fee_scalar_loads_absent':True},
            'scope':'Four complete Pool helper instruction/relocation comparisons with only real source-line immediates different; exact 224-byte can_boost; actual global-dispatch deposit target and Pool-reference/quote call ABI. No whole deposit identity claim.'}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--candidate', type=Path, required=True)
    p.add_argument('--symbols', type=Path, required=True)
    p.add_argument('--repo-root', type=Path, required=True)
    a = p.parse_args()
    print(json.dumps(verify(a.candidate,a.symbols,a.repo_root),indent=2))

if __name__ == '__main__':
    main()
