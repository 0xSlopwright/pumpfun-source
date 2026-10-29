#!/usr/bin/env python3
"""Rebind a source-only Sweep overlay to original instructions and selected helpers.

This does not compile the overlay, execute an ELF, or award function matches.
"""
import argparse
import difflib
import gzip
import hashlib
import json
from pathlib import Path
import struct
import sys

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from pump_compare_function_bytes import body, normalize, sections

ORIGINAL_SHA = '7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
SELECTED_SHA = '49df399b8a36a0a60de03e8d55f1417261dc451e44845ca9d17a94040968c680'
INVENTORY_SHA = 'c66bb5ece1676933838403fa99c120b636eba9c3db4e543bb32d614bcac6451d'
BEFORE_SHA = '8735adba8b670c3b4ee63a6fd716d1d639be6efa56269a15365c15ff2f44ba0c'
AFTER_SHA = '15dbbd46bdbe7af62c6b7bb436f657c45e290c080c185fc075b7a3c08e3df7e8'
PATCH_SHA = 'e22825c01976997dca79331bd0ef3faad209bf874b66f6b5dfcdbc7e88e8d3e8'


def sha(data):
    return hashlib.sha256(data).hexdigest()


def require(value, message):
    if not value:
        raise ValueError(message)


def symbols(image):
    """ELF64 function starts/sizes; reject inconsistent same-address aliases."""
    require(image[:6] == b'\x7fELF\x02\x01', 'expected little-endian ELF64')
    shoff = struct.unpack_from('<Q', image, 40)[0]
    entsize, count = struct.unpack_from('<HH', image, 58)
    headers = [struct.unpack_from('<IIQQQQIIQQ', image, shoff + n * entsize)
               for n in range(count)]
    result = {}
    for h in headers:
        if h[1] != 2:  # SHT_SYMTAB
            continue
        for off in range(h[4], h[4] + h[5], h[9]):
            _, info, _, _, address, size = struct.unpack_from('<IBBHQQ', image, off)
            if info & 15 == 2 and address and size:
                require(address not in result or result[address] == size,
                        f'inconsistent function aliases at {address:#x}')
                result[address] = size
    require(result, 'no function symbol table')
    return result


def instruction(image, image_sections, pc):
    raw = body(image, image_sections, pc, 8)
    op, regs, displacement, immediate = struct.unpack('<BBhi', raw)
    row = {'pc': hex(pc), 'raw': raw.hex(), 'opcode': hex(op),
           'dst': regs & 15, 'src': regs >> 4,
           'displacement': displacement, 'immediate': immediate}
    if op == 0x85 and regs >> 4 == 1 and immediate != -1:
        row['actual_callee'] = hex(pc + 8 + immediate * 8)
    return row


def check_instruction(record, image, image_sections):
    actual = instruction(image, image_sections, int(record['pc'], 0))
    for key in ('pc', 'raw', 'opcode', 'dst', 'src', 'immediate', 'actual_callee'):
        if key in record:
            require(record[key] == actual.get(key), f'instruction {record["pc"]} {key}')
    # Older argument rows call this displacement; state rows call it offset.
    field = 'displacement' if 'displacement' in record else 'offset'
    require(record[field] == actual['displacement'], f'instruction {record["pc"]} offset')


def check_source(before, after, proposal):
    require(sha(before) == BEFORE_SHA, 'before source hash')
    require(sha(after) == AFTER_SHA, 'overlay source hash')
    for row in proposal['guard_error_sites_preserved']:
        n = row['line'] - 1
        require(before.decode().splitlines()[n] == after.decode().splitlines()[n] == row['source'],
                f'guard Source line {row["line"]}')
    admits = lambda source: [x for x in source.decode().splitlines()
                             if 'admit_associated_token_account(' in x]
    require(len(admits(before)) == 2 and admits(before) == admits(after), 'ATA admissions')
    require(before.split(b'pub fn execute', 1)[0] == after.split(b'pub fn execute', 1)[0],
            'account declarations changed')
    require(before.split(b' let event=', 1)[1] == after.split(b' let event=', 1)[1],
            'event construction changed')
    text = after.decode()
    for field in ('creator_fee', 'protocol_fees'):
        load = text.index(f'let amount=a.bonding_curve.{field};')
        clear = text.index(f'a.bonding_curve.{field}=0;')
        require(load < clear < text.index('if amount==0'), f'{field} load-clear-zero order')
        require(text.count(f'a.bonding_curve.{field}=0;') == 1, f'{field} repeated clear')
    require('ensure_rent_exempt(' not in text and 'sub_lamports(' not in text and
            'transfer_quote_tokens(' not in text, 'superseded direct transfer boundary')


def check_state(proposal, original, original_sections):
    for bucket in proposal['state_order']:
        rows = bucket['original_instructions']
        require(len(rows) == 4, 'state operation extent')
        for row in rows:
            check_instruction(row, original, original_sections)
        load, clear, branch = rows[1:]
        require(load['opcode'] == '0x79' and clear['opcode'] == '0x7a' and
                load['offset'] == clear['offset'] == int(bucket['curve_offset'], 0) and
                clear['immediate'] == 0 and branch['opcode'] in ('0x15', '0x55') and
                branch['dst'] == load['dst'] and branch['immediate'] == 0,
                'selected field load-clear-zero semantics')


def helper_pair(original, selected, os_, cs, original_sizes, selected_sizes, oa, ca, depth):
    require(oa in original_sizes and ca in selected_sizes, f'unbound helper {oa:#x}/{ca:#x}')
    ob = body(original, os_, oa, original_sizes[oa])
    cb = body(selected, cs, ca, selected_sizes[ca])
    on, oo = normalize(ob, oa, os_)
    cn, co = normalize(cb, ca, cs)
    require(on == cn, f'helper normalized body differs {oa:#x}/{ca:#x}')
    oc = [r for r in oo if r['kind'] == 'direct-call']
    cc = [r for r in co if r['kind'] == 'direct-call']
    require([r['offset'] for r in oc] == [r['offset'] for r in cc], 'helper call positions')
    edges = []
    if depth:
        for left, right in zip(oc, cc):
            edges.append(helper_pair(original, selected, os_, cs, original_sizes,
                                     selected_sizes, left['target'], right['target'], depth - 1))
    return {'original': hex(oa), 'selected': hex(ca), 'bytes': len(ob),
            'normalized_sha256': sha(on), 'direct_call_count': len(oc), 'callees': edges}


def verify(original_path, selected_path, inventory_path):
    original, selected = original_path.read_bytes(), selected_path.read_bytes()
    require(sha(original) == ORIGINAL_SHA, 'original ELF hash')
    require(sha(selected) == SELECTED_SHA, 'selected ELF hash')
    inventory_bytes = inventory_path.read_bytes()
    require(sha(inventory_bytes) == INVENTORY_SHA, 'selected inventory hash')
    inventory = json.loads(gzip.decompress(inventory_bytes))
    require(inventory['candidate_sha256'] == SELECTED_SHA, 'inventory ELF binding')
    require(len(inventory['windows']) == 1035, 'full selected inventory extent')
    window = next(x for x in inventory['windows'] if x['start'] == 0x72810)
    require(window['bytes'] == 7832 and not window['normalized_matches'], 'Sweep remains unmatched')
    original_sizes = {row['start']: row['bytes'] for row in inventory['windows']}
    selected_sizes = symbols(selected)
    require(selected_sizes[0x8db10] == 8784, 'selected Sweep extent')
    os_, cs = sections(original), sections(selected)
    proposal = json.loads((HERE / 'PROPOSAL.json').read_text())
    ledger = json.loads((HERE / 'ARGUMENT-LEDGER.json').read_text())
    before = (HERE / 'source-before.rs').read_bytes()
    after = (HERE / 'source/programs/pump/src/sweep_fees.rs').read_bytes()
    check_source(before, after, proposal)
    patch = ''.join(difflib.unified_diff(before.decode().splitlines(True), after.decode().splitlines(True),
                    fromfile='a/programs/pump/src/sweep_fees.rs', tofile='b/programs/pump/src/sweep_fees.rs')).encode()
    require(patch == (HERE / 'source.patch').read_bytes() and sha(patch) == PATCH_SHA, 'exact source patch')
    require(proposal['source_before_sha256'] == BEFORE_SHA and proposal['source_after_sha256'] == AFTER_SHA
            and proposal['patch_sha256'] == PATCH_SHA, 'proposal source binding')
    check_state(proposal, original, os_)
    checked = 8
    for name in ('native_topup', 'common_transfer'):
        call = ledger[name]
        for row in call['instruction_slice']:
            check_instruction(row, original, os_)
            require(int(row['pc'], 0) - 0x72810 == int(row['offset'], 0), 'caller-relative PC')
            checked += 1
        require(instruction(original, os_, int(call['actual_call'], 0)).get('actual_callee') == call['callee'],
                'actual used helper edge')
    helpers = []
    for row in ledger['existing_callee_audit']:
        oa, ca = int(row['original'], 0), int(row['candidate'], 0)
        require(original_sizes[oa] == selected_sizes[ca] == row['bytes'], 'helper extent')
        helpers.append({'label': row['label'], **helper_pair(original, selected, os_, cs,
                        original_sizes, selected_sizes, oa, ca, 2)})
    return {'scope': 'static source-overlay binding only; no overlay ELF or runtime qualification',
            'original_elf_sha256': ORIGINAL_SHA, 'selected_symbols_sha256': SELECTED_SHA,
            'inventory_sha256': INVENTORY_SHA, 'source_before_sha256': BEFORE_SHA,
            'source_after_sha256': AFTER_SHA, 'verified_raw_instruction_rows': checked,
            'sweep_original_bytes': 7832, 'sweep_selected_bytes': 8784,
            'overlay_compiled': False, 'window_gain_claimed': False, 'existing_helpers': helpers}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--original', type=Path, default=ROOT / 'evidence/original/pump/deployed.so')
    p.add_argument('--selected', type=Path, default=ROOT / 'research/pump-final-composition-673-20261028/artifacts/unstripped.so')
    p.add_argument('--inventory', type=Path, default=ROOT / 'research/pump-final-composition-673-20261028/analysis/inventory.json.gz')
    p.add_argument('--output', type=Path)
    args = p.parse_args()
    report = verify(args.original, args.selected, args.inventory)
    if args.output:
        args.output.write_text(json.dumps(report, indent=2) + '\n')
    else:
        require(report == json.loads((HERE / 'STATIC-VERIFIED.json').read_text()),
                'saved static report differs from recomputation')
    print('PASS: source overlay, raw original argument/state rows, four existing helper bodies/depth2 edges; unbuilt overlay')


if __name__ == '__main__':
    main()
