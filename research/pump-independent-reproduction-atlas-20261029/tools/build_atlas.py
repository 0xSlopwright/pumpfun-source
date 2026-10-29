#!/usr/bin/env python3
"""Independent residual atlas for the 16 unmatched Pump main windows.

For each unmatched selected window this records its most-likely candidate
counterpart (by matched-caller call-site vote), the size delta, and a
normalized-instruction multiset/order comparison that separates a pure
reordering from a structural difference. It uses the published acceptance
normalizer, changes no source, image or count, and claims no window match;
it only characterizes the published residual.
"""
import hashlib
import importlib.util
import json
import struct
import sys
from collections import Counter, defaultdict
from pathlib import Path

PKG = Path(__file__).resolve().parents[1]
ROOT = PKG.parents[1]
SIBLING = ROOT / 'research/pump-multihop-accrual-qualification-20261028'
sys.path.insert(0, str(ROOT / 'scripts'))
from pump_compare_function_bytes import body, normalize  # noqa: E402
from pump_quote_control_function_match import sections  # noqa: E402

_spec = importlib.util.spec_from_file_location('census', SIBLING / 'tools/census.py')
census = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(census)
census.ROOT = ROOT

ORIGINAL = ROOT / 'evidence/original/pump/deployed.so'
SELECTED = SIBLING / 'artifacts/unstripped.so'
EXPECTED_COUNTS = {'total': 1035, 'normalized': 1019, 'raw': 188,
                   'unmatched': 16, 'matched_text_bytes': 1611088}


def slots(norm, reorder_invariant=False):
    """Split a normalized body into hex instruction slots (16 bytes for lddw, else 8).

    With reorder_invariant, also zero the branch-displacement field of jump
    instructions, so a pure block/instruction reordering yields an identical
    slot multiset. call/callx/exit and ldx/stx offsets are left intact because
    their offset fields are not reorder artifacts.
    """
    out, i = [], 0
    while i < len(norm):
        n = 16 if norm[i] == 0x18 else 8
        chunk = bytearray(norm[i:i + n])
        if reorder_invariant and n == 8 and (chunk[0] & 0x07) == 0x05 and chunk[0] not in (0x85, 0x8d, 0x95):
            chunk[2:4] = b'\x00\x00'
        out.append(bytes(chunk).hex())
        i += n
    return out


def direct_calls(blob, secs, start, size):
    raw = body(blob, secs, start, size)
    out, i = [], 0
    while i < len(raw):
        op, regs, _off, imm = struct.unpack_from('<BBhi', raw, i)
        if op == 0x85 and regs >> 4 == 1 and imm != -1:
            out.append(start + i + 8 + imm * 8)
        i += 16 if op == 0x18 else 8
    return out


def build():
    orig = ORIGINAL.read_bytes()
    cand = SELECTED.read_bytes()
    os_, cs = sections(orig), sections(cand)
    rep = census.census(SELECTED)
    assert rep['counts'] == EXPECTED_COUNTS, rep['counts']

    syms = {}
    for addr, size, name in census.functions(cand):
        syms.setdefault(addr, (size, name))
    cand_windows = {w['start']: w for w in rep['windows']}

    # Vote each unmatched window's candidate counterpart from matched callers.
    votes = defaultdict(Counter)
    for w in rep['windows']:
        if not w['normalized_matches']:
            continue
        oc = direct_calls(orig, os_, w['start'], w['bytes'])
        cc = direct_calls(cand, cs, w['normalized_matches'][0]['start'], w['bytes'])
        for to, tc in zip(oc, cc):
            if to in cand_windows and not cand_windows[to]['normalized_matches']:
                votes[to][tc] += 1

    entries = []
    for w in sorted((w for w in rep['windows'] if not w['normalized_matches']),
                    key=lambda w: w['start']):
        onorm = normalize(body(orig, os_, w['start'], w['bytes']), w['start'], os_)[0]
        oslots = slots(onorm)
        counterpart, residual = None, 'unmapped'
        v = votes.get(w['start'])
        if v:
            tc, nv = v.most_common(1)[0]
            csz, cname = syms.get(tc, (0, '?'))
            cnorm = normalize(body(cand, cs, tc, csz), tc, cs)[0] if csz else b''
            cslots = slots(cnorm)
            om, cm = Counter(oslots), Counter(cslots)
            union = sum((om | cm).values())
            ri_identical = Counter(slots(onorm, reorder_invariant=True)) == Counter(slots(cnorm, reorder_invariant=True))
            order_only = ri_identical and oslots != cslots
            counterpart = {
                'candidate_start': tc,
                'candidate_start_hex': hex(tc),
                'candidate_symbol': cname,
                'candidate_bytes': csz,
                'caller_vote': f'{nv}/{sum(v.values())}',
                'size_delta': csz - w['bytes'],
                'normalized_slots_original': len(oslots),
                'normalized_slots_candidate': len(cslots),
                'normalized_multiset_identical': om == cm,
                'normalized_slot_jaccard': round(sum((om & cm).values()) / union, 4) if union else None,
                'reorder_invariant_multiset_identical': ri_identical,
                'order_only_difference': order_only,
            }
            residual = 'near-identical' if counterpart['size_delta'] == 0 else 'structural'
        entries.append({
            'start': w['start'],
            'start_hex': hex(w['start']),
            'bytes': w['bytes'],
            'original_body_sha256': hashlib.sha256(body(orig, os_, w['start'], w['bytes'])).hexdigest(),
            'residual_class': residual,
            'counterpart': counterpart,
        })

    atlas = {
        'scope': __doc__,
        'original_sha256': hashlib.sha256(orig).hexdigest(),
        'selected_symbols_sha256': hashlib.sha256(cand).hexdigest(),
        'official_counts': rep['counts'],
        'classification_summary': dict(Counter(e['residual_class'] for e in entries)),
        'unmatched_windows': entries,
    }
    return atlas


def main():
    atlas = build()
    (PKG / 'atlas.json').write_text(json.dumps(atlas, indent=2, sort_keys=True) + '\n')
    for e in atlas['unmatched_windows']:
        c = e['counterpart'] or {}
        print(f"{e['start_hex']:>9} {e['bytes']:6d}  {e['residual_class']:14} "
              f"Δ{str(c.get('size_delta', '?')):>6}  J={c.get('normalized_slot_jaccard')}  "
              f"-> {str(c.get('candidate_symbol', '?'))[:46]}")
    print('summary:', atlas['classification_summary'])


if __name__ == '__main__':
    main()
