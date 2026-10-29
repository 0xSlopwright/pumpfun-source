#!/usr/bin/env python3
"""lay.py - AMM whole-ELF layout generator (copied from mega-run lane mg-A-raw; only the two input paths changed). Binding logic from shared/tools/relayout.py (layout-r1),
restructured + end-state raw-readiness prediction.

usage: python3 -I -B lay.py CAND_SYMBOLS.so CAND.map [--ld OUT.ld] [--mode order|pad] [--report R.json]
                             [--predict P.json] [--assign 0xWIN=symsubstr ...]

Binding (candidate function -> original window): normalized key (+ call-graph colours), call propagation,
duplicate-body swap repair (see relayout.py). Data atoms (map input sections of .rodata/.data.rel.ro, merged
synthetic sections as one atom) get an original address from lddw votes of bound pairs, content search and
pointer propagation.

--mode order: deliverable linker script (no padding): .text input sections in original window order (unbound
  candidate functions after the last window), .rodata/.data.rel.ro atoms in bound original-address order
  (unplaced atoms after), stock PHDRS/other sections.
--mode pad: diagnostic only (relayout pad mode).
--predict: end-state raw readiness of every normalized-matched window: each differing 8-byte slot must be a call
  whose translated target (binding) equals the original target, or an lddw whose translated value (function
  binding / data placement) equals the original value. Classes per slot: call_ok, call_wrong, call_unbound,
  text_ok/text_wrong (fn pointer), data_ok/data_wrong/data_unplaced, other.
"""
import argparse, bisect, collections, json, re, struct, sys, types
from pathlib import Path
T = Path(__file__).resolve().parent  # packet copy: elf_reader.py sits next to this file
ORIG = Path(__file__).resolve().parents[3] / 'evidence/original/pump_amm/deployed.so'
mod = types.ModuleType('elf'); p = T / 'elf_reader.py'; mod.__file__ = str(p)
exec(compile(p.read_bytes(), str(p), 'exec'), mod.__dict__); Elf = mod.Elf
MAPRE = re.compile(r'\s*([0-9a-f]+)\s+([0-9a-f]+)\s+([0-9a-f]+)\s+(\d+)\s{9}(\S.*):\((\.[^)]*)\)\s*$')
OUTRE = re.compile(r'\s*([0-9a-f]+)\s+([0-9a-f]+)\s+([0-9a-f]+)\s+(\d+)\s(\.\S+)$')
OUTS = ('.text', '.rodata', '.data.rel.ro')


def owner(path):
    if path == '<internal>': return '*'
    name = path.rsplit('/', 1)[-1]
    return '*' + (name[:-1].replace('(', ':') if name.endswith(')') and '(' in name else name)


def parse_map(text):
    rows = []; out = None
    for line in text.splitlines():
        mo = OUTRE.fullmatch(line)
        if mo and not line.startswith(' ' * 20): out = mo[5]; continue
        mm = MAPRE.fullmatch(line)
        if mm and out in OUTS:
            rows.append(dict(out=out, addr=int(mm[1], 16), size=int(mm[3], 16), align=int(mm[4]),
                             owner=owner(mm[5]), sec=mm[6], path=mm[5]))
    return rows


def lddw_targets(e, start, size):
    res = []
    for at in range(start, start + size, 8):
        r = e.relocations.get(at)
        if r and r['type'] == 8 and e.b[at] == 0x18:
            lo = struct.unpack_from('<I', e.b, at + 4)[0]; hi = struct.unpack_from('<I', e.b, at + 12)[0]
            res.append((at - start, lo | hi << 32))
    return res


def data_ptrs(e, start, size):
    res = []
    for at in range(start, start + size, 8):
        r = e.relocations.get(at)
        if r and r['type'] == 8 and at + 8 <= start + size:
            res.append((at - start, struct.unpack_from('<Q', e.b, at)[0] >> 32))
    return res


class Layout:
    def __init__(self, cand, mapfile, assign=()):
        o = self.o = Elf(ORIG); c = self.c = Elf(Path(cand)); rows = self.rows = parse_map(Path(mapfile).read_text())
        self.wins = wins = list(zip(o.entries, o.entries[1:] + [o.hi]))
        self.wsize = wsize = {w: z - w for w, z in wins}
        cf = self.cf = {}
        for f in c.funcs: cf.setdefault(f['start'], f)
        self.crow = {r['addr']: r for r in rows if r['out'] == '.text' and r['size']}
        def key(e, s, n): return (n, e.normalized[s:s + n], json.dumps(e.pattern(s, n), sort_keys=True))
        ocalls = self.ocalls = collections.defaultdict(list); ccalls = self.ccalls = collections.defaultdict(list)
        for at, t in o.calls.items():
            w = o.entries[bisect.bisect_right(o.entries, at) - 1]; ocalls[w].append((at - w, t))
        cst = self.cst = sorted(cf)
        for at, t in c.calls.items():
            i = bisect.bisect_right(cst, at) - 1
            if i >= 0 and at < cst[i] + cf[cst[i]]['size']: ccalls[cst[i]].append((at - cst[i], t))
        for d in (ocalls, ccalls):
            for k in d: d[k].sort()
        okey = self.okey = {w: key(o, w, wsize[w]) for w, _ in wins}
        ckey = self.ckey = {s: key(c, s, cf[s]['size']) for s in cf}
        def colours(keys, calls):
            col = {k: hash(v) for k, v in keys.items()}
            for _ in range(3):
                col = {k: hash((col[k], tuple((off, col.get(t)) for off, t in calls.get(k, [])))) for k in keys}
            return col
        ocol = colours(okey, ocalls); ccol = colours(ckey, ccalls)
        bind = self.bind = {}; rbind = self.rbind = {}; why = self.why = {}
        def B(w, s, r):
            if w in bind or s in rbind: return False
            bind[w] = s; rbind[s] = w; why[w] = r; return True
        for spec in assign:   # 0xWIN=substr : explicit binding of an unmatched window
            w, sub = spec.split('=', 1); w = int(w, 16)
            hits = [s for s in cst if sub in cf[s]['name']]
            assert len(hits) == 1, (spec, [cf[s]['name'] for s in hits][:5]); B(w, hits[0], 'assign')
        for level, (ok, ck) in enumerate([(lambda w: (okey[w], ocol[w]), lambda s: (ckey[s], ccol[s])),
                                          (lambda w: okey[w], lambda s: ckey[s])]):
            g1 = collections.defaultdict(list); g2 = collections.defaultdict(list)
            for w, _ in wins:
                if w not in bind: g1[ok(w)].append(w)
            for s in cst:
                if s not in rbind: g2[ck(s)].append(s)
            for k, ws in g1.items():
                for w, s in zip(ws, g2.get(k, [])): B(w, s, 'key+colour' if level == 0 else 'key-order')
        self.nkey = len(bind)
        changed = True
        while changed:
            changed = False
            for w, s in list(bind.items()):
                oc = ocalls.get(w, []); cc = ccalls.get(s, [])
                if okey[w] == ckey[s]: pairs = zip(oc, cc)
                else:
                    cd = dict(cc); pairs = [((off, t), (off, cd[off])) for off, t in oc if off in cd]
                for (_, t), (_, u) in pairs:
                    if t in wsize and u in cf and t not in bind and u not in rbind:
                        changed |= B(t, u, 'call-propagation')
        self.nprop = len(bind) - self.nkey
        nswap = 0
        for _ in range(5):
            want = collections.defaultdict(collections.Counter)
            for w, s_ in bind.items():
                cc = dict(ccalls.get(s_, []))
                for off, t in ocalls.get(w, []):
                    u = cc.get(off)
                    if u is not None and t in bind and u in rbind and bind[t] != u and okey[t] == ckey[u] == okey[rbind[u]]:
                        want[t][u] += 1
            moved = 0
            for t, cnt in want.items():
                u = cnt.most_common(1)[0][0]
                if t not in bind or u not in rbind or bind[t] == u: continue
                t2 = rbind[u]; s1 = bind[t]
                bind[t], bind[t2] = u, s1; rbind[u], rbind[s1] = t, t2; why[t] = why[t2] = 'dup-swap'; moved += 1
            nswap += moved
            if not moved: break
        self.nswap = nswap
        self.bind_data()

    def datom(self, addr):
        j = bisect.bisect_right(self.dkeys, addr) - 1
        if j < 0: return None, None
        r = self.drows[self.dstarts[j][1]]
        return (self.dstarts[j][1], addr - r['addr']) if addr < r['addr'] + r['size'] else (None, None)

    def bind_data(self):
        o, c, bind, okey, ckey, wsize, cf = self.o, self.c, self.bind, self.okey, self.ckey, self.wsize, self.cf
        drows = self.drows = [r for r in self.rows if r['out'] != '.text' and r['size']]
        self.dstarts = sorted((r['addr'], i) for i, r in enumerate(drows)); self.dkeys = [x for x, _ in self.dstarts]
        votes = self.votes = collections.defaultdict(collections.Counter)
        for w, s in bind.items():
            if okey[w] != ckey[s] and wsize[w] != cf[s]['size']:
                ol = lddw_targets(o, w, wsize[w]); cl = dict(lddw_targets(c, s, cf[s]['size']))
                pairs = [(x, cl[off]) for off, x in ol if off in cl]
            else:
                pairs = [(x, y) for (_, x), (_, y) in zip(lddw_targets(o, w, wsize[w]), lddw_targets(c, s, cf[s]['size']))]
            for x, y in pairs:
                i, d = self.datom(y)
                if i is not None: votes[i][x - d] += 1
        n = 0
        for i, r in enumerate(drows):
            if i in votes or r['size'] < 2: continue
            sec = o.secs[r['out']]; lo, hi = sec[3], sec[3] + sec[5]
            body = bytearray(c.b[r['addr']:r['addr'] + r['size']]); ptr = [q for q, _ in data_ptrs(c, r['addr'], r['size'])]
            for q in ptr: body[q:q + 8] = bytes(8)
            cuts = sorted(set([0, len(body)] + ptr + [q + 8 for q in ptr]))
            ch = max(((cuts[k], cuts[k + 1]) for k in range(len(cuts) - 1) if cuts[k] not in ptr), key=lambda x: x[1] - x[0], default=None)
            if (ch is None or ch[1] - ch[0] < (2 if not ptr else 1)) and not ptr: continue
            hits = []
            if ch and ch[1] > ch[0]:
                needle = bytes(body[ch[0]:ch[1]]); st = lo
                while True:
                    k = o.b.find(needle, st, hi)
                    if k < 0 or len(hits) > 8: break
                    base = k - ch[0]; st = k + 1
                    if base < lo or base + r['size'] > hi or base % max(1, r['align']): continue
                    ob = bytearray(o.b[base:base + r['size']])
                    for q in ptr: ob[q:q + 8] = bytes(8)
                    if ob == body and all((o.relocations.get(base + q) or {}).get('type') == 8 for q in ptr): hits.append(base)
            if len(set(hits)) == 1: votes[i][hits[0]] += 1; n += 1
        self.ncontent = n
        for _ in range(4):
            for i, cnt in list(votes.items()):
                r = drows[i]; tgt = cnt.most_common(1)[0][0]
                op = dict(data_ptrs(o, tgt, r['size']))
                for off, y in data_ptrs(c, r['addr'], r['size']):
                    if off in op:
                        j, d = self.datom(y)
                        if j is not None and j not in votes: votes[j][op[off] - d] += 1
        self.dplace = {i: cnt.most_common(1)[0][0] for i, cnt in votes.items()}

    # ---- translation of candidate addresses to original addresses (end state)
    def tr(self, v):
        c = self.c
        if c.lo <= v < c.hi:
            i = bisect.bisect_right(self.cst, v) - 1
            if i < 0: return None, 'text_unbound'
            s = self.cst[i]
            if s in self.rbind and v < s + self.cf[s]['size']: return self.rbind[s] + (v - s), 'text'
            return None, 'text_unbound'
        i, d = self.datom(v)
        if i is None: return None, 'data_unknown'
        if i not in self.dplace: return None, 'data_unplaced'
        return self.dplace[i] + d, 'data'

    def predict(self, rows):
        """rows: measure.py rows of this candidate. -> {window: {'ready': bool, 'classes': Counter, 'bad': [...]}}"""
        o, c = self.o, self.c; res = {}
        for r in rows:
            if not r['match']: continue
            w = int(r['original'], 16); s = self.bind.get(w)
            if s is None or self.okey[w] != self.ckey.get(s): res[r['original']] = dict(ready=False, classes={'unbound_or_rebound': 1}, bad=[]); continue
            n = self.wsize[w]; cls = collections.Counter(); bad = []
            for off in range(0, n, 8):
                oa, ca = w + off, s + off
                if o.b[oa:oa + 8] == c.b[ca:ca + 8] and not (o.b[oa] == 0x18 and o.b[oa + 8:oa + 16] != c.b[ca + 8:ca + 16]):
                    continue
                if off >= 8 and o.b[oa - 8] == 0x18 and oa - 8 in o.relocations: continue  # 2nd half of an lddw: handled with the 1st
                if o.b[oa] == 0x85 and oa in o.calls:
                    ct = c.calls.get(ca)
                    t = self.rbind.get(ct) if ct is not None else None
                    k = 'call_ok' if t == o.calls[oa] else ('call_unbound' if t is None else 'call_wrong')
                elif o.b[oa] == 0x18 and oa in o.relocations:
                    ov = struct.unpack_from('<I', o.b, oa + 4)[0] | struct.unpack_from('<I', o.b, oa + 12)[0] << 32
                    cv = struct.unpack_from('<I', c.b, ca + 4)[0] | struct.unpack_from('<I', c.b, ca + 12)[0] << 32
                    tv, kind = self.tr(cv)
                    k = (kind + ('_ok' if tv == ov else '_wrong')) if tv is not None else kind
                    if k.endswith('_wrong') or tv is None: bad.append(dict(off=off, kind=k, orig=hex(ov), cand=hex(cv), cand_tr=hex(tv) if tv is not None else None))
                else:
                    k = 'other'; bad.append(dict(off=off, kind=k))
                cls[k] += 1
                if k in ('call_wrong', 'call_unbound'): bad.append(dict(off=off, kind=k, orig=hex(o.calls[oa]), cand=hex(c.calls.get(ca, 0))))
            ready = all(k.endswith('_ok') for k in cls)
            res[r['original']] = dict(ready=ready, classes=dict(cls), bad=bad[:6])
        return res

    def emit(self, mode='order'):
        o, wins, bind, crow, wsize = self.o, self.wins, self.bind, self.crow, self.wsize
        def sel(r): return f'    {r["owner"]}({json.dumps(r["sec"])})\n'
        text_lines = []; overflow = []; cur = o.lo; placed = set()
        for w, z in wins:
            s = bind.get(w)
            if s is None or s not in crow: continue
            r = crow[s]
            if mode == 'pad':
                if r['size'] > wsize[w] or w < cur: overflow.append(r); placed.add(s); continue
                text_lines.append(f'    . = 0x{w:x};\n'); cur = w + r['size']
            text_lines.append(sel(r)); placed.add(s)
        rest = [crow[s] for s in sorted(crow) if s not in placed]
        if mode == 'pad': overflow += rest; text_lines.append(f'    . = 0x{o.hi:x};\n')
        else: text_lines += [sel(r) for r in rest]
        obase = {n: o.secs[n][3] for n in OUTS}
        dlines = {'.rodata': [], '.data.rel.ro': []}; dover = {'.rodata': [], '.data.rel.ro': []}
        for out in dlines:
            mine = [(self.dplace.get(i), i) for i, r in enumerate(self.drows) if r['out'] == out]
            pl = sorted((t, i) for t, i in mine if t is not None); un = [i for t, i in mine if t is None]
            end = obase[out] + o.secs[out][5]
            if mode == 'pad':
                occ = []; keep = []
                for t, i in sorted(pl, key=lambda x: -self.votes[x[1]][x[0]]):
                    r = self.drows[i]; z = t + r['size']
                    if t < obase[out] or z > end or t % r['align'] or any(t < b and a0 < z for a0, b in occ):
                        dover[out].append(r); continue
                    occ.append((t, z)); keep.append((t, i))
                pl = sorted(keep)
            for t, i in pl:
                if mode == 'pad': dlines[out].append(f'    . = 0x{t:x};\n')
                dlines[out].append(sel(self.drows[i]))
            tail = [self.drows[i] for i in un]
            if mode == 'pad': dover[out] += tail
            else: dlines[out] += [sel(r) for r in tail]
        out = ['PHDRS\n{\n  text PT_LOAD ;\n  rodata PT_LOAD ;\n  data PT_LOAD ;\n  dynamic PT_DYNAMIC ;\n}\n\nSECTIONS\n{\n  . = SIZEOF_HEADERS;\n']
        out.append('  .text : {\n' + ''.join(text_lines) + ('' if mode == 'pad' else '    *(.text*)\n') + '  } :text\n')
        if mode == 'pad':
            out.append(f'  .rodata 0x{obase[".rodata"]:x} : {{\n' + ''.join(dlines['.rodata']) + '  } :rodata\n')
            out.append(f'  .data.rel.ro 0x{obase[".data.rel.ro"]:x} : {{\n' + ''.join(dlines['.data.rel.ro']) + '  } :rodata\n')
            out.append('  .text.overflow : {\n' + ''.join(sel(r) for r in overflow) + '    *(.text*)\n  } :rodata\n')
            out.append('  .rodata.overflow : {\n' + ''.join(sel(r) for r in dover['.rodata']) + '    *(.rodata*)\n  } :rodata\n')
            out.append('  .data.rel.ro.overflow : {\n' + ''.join(sel(r) for r in dover['.data.rel.ro']) + '    *(.data.rel.ro*)\n  } :rodata\n')
        else:
            out.append('  .rodata : {\n' + ''.join(dlines['.rodata']) + '    *(.rodata*)\n  } :rodata\n')
            out.append('  .data.rel.ro : {\n' + ''.join(dlines['.data.rel.ro']) + '    *(.data.rel.ro*)\n  } :rodata\n')
        out.append('  .dynamic : { *(.dynamic) } :dynamic\n  .dynsym : { *(.dynsym) } :data\n  .dynstr : { *(.dynstr) } :data\n'
                   '  .rel.dyn : { *(.rel.dyn) } :data\n  /DISCARD/ : {\n      *(.eh_frame*)\n      *(.gnu.hash*)\n      *(.hash*)\n    }\n}\n')
        return ''.join(out)

    def report(self):
        return dict(windows=len(self.wins), bound_by_key=self.nkey, bound_by_call_propagation=self.nprop, dup_swaps=self.nswap,
                    unbound_windows=[hex(w) for w, _ in self.wins if w not in self.bind],
                    bound_body_differs=[hex(w) for w, _ in self.wins if w in self.bind and self.okey[w] != self.ckey[self.bind[w]]],
                    cand_text_sections=len(self.crow), cand_only=[self.cf[s]['name'][:90] for s in self.cst if s not in self.rbind],
                    data_atoms=len(self.drows), data_placed=len(self.dplace), data_by_content=self.ncontent,
                    data_vote_conflicts={self.drows[i]['owner'][-30:] + ':' + self.drows[i]['sec']: {hex(k): v for k, v in cnt.items()}
                                         for i, cnt in self.votes.items() if len(cnt) > 1})


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('cand'); ap.add_argument('map')
    ap.add_argument('--ld'); ap.add_argument('--mode', default='order', choices=['pad', 'order'])
    ap.add_argument('--report'); ap.add_argument('--predict'); ap.add_argument('--assign', nargs='*', default=[])
    a = ap.parse_args()
    lay = Layout(a.cand, a.map, a.assign)
    rep = lay.report()
    if a.ld: Path(a.ld).write_text(lay.emit(a.mode))
    if a.predict:
        mm = types.ModuleType('measure'); pm = T / 'measure.py'; mm.__file__ = str(pm)
        exec(compile(pm.read_text().split("if __name__ == '__main__':")[0], str(pm), 'exec'), mm.__dict__)
        rows = mm.measure(ORIG, Path(a.cand))
        pr = lay.predict(rows)
        tot = collections.Counter()
        for v in pr.values():
            for k, n in v['classes'].items(): tot[k] += n
        rep['predict'] = dict(matched=len(pr), ready=sum(v['ready'] for v in pr.values()), slot_classes=dict(tot))
        Path(a.predict).write_text(json.dumps(pr, indent=0))
    if a.report: Path(a.report).write_text(json.dumps(rep, indent=1))
    short = {k: (v if not isinstance(v, (list, dict)) or k == 'predict' else len(v)) for k, v in rep.items()}
    print(json.dumps(short))


if __name__ == '__main__':
    main()
