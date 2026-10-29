#!/usr/bin/env python3
"""Hill climber over genes.py genomes.  Each build carries one eq move and one bh move (the two
handlers are separate #[inline(never)] functions), so one build evaluates both targets.

usage: climb.py <generations> [--perm N]
State: engine/state.json  (current genomes + best metrics), engine/archive.jsonl (every variant).
"""
import sys, json, hashlib, random, copy, subprocess, time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, str(Path(__file__).resolve().parent))
import genes, evalv, queue
FREE = queue.Queue()
for _w in range(3): FREE.put(_w)

E = Path(__file__).resolve().parent
OUT = E.parent
STATE = E / 'state.json'
ARCH = E / 'archive.jsonl'
L = '/Users/shawwalters/Documents/Codex/2026-10-24/pump-main-swarm/worktrees/restore/reconstruction/pump-main/log_attempt.py'
W = {'eq': '0x13f630', 'bh': '0x13b9b8'}
ORIG = {'eq': 20184, 'bh': 15480}

CHOICES = {
    'xfer': ['direct', 'wrap'], 'bindbase': ['no', 'yes'], 'sysp': ['none', 'bind'],
    'cforder': ['cash_first', 'creator_first'], 'pay_own': ['direct', 'wrap'], 'pay_user': ['direct', 'wrap'],
    'payamt': ['cond', 'gross'], 'pay_recip': ['direct', 'wrap'], 'uva': ['none', 'bind'], 'rebind_c': ['no', 'yes'],
    'ev_qm_field': ['local', 'c'], 'ev_fr': ['local', 'a'], 'ix': ['into', 'to_string'], 'cev': ['A', 'F'],
    'snap_order': [genes.SNAP_A, genes.SNAP_F], 'ev_order': [genes.EV_A, genes.EV_F],
    'adm_struct': ['one', 'two'], 'adm_scope': ['inner', 'outer', 'none'], 'adm_refs': ['asref', 'amp'],
    **{k: ['off', 'on'] for k in genes.SUBST},
    'own_pre': ['none', 'to', 'opts'], 'is_sol_src': ['local', 'c'],
    'adm_none': ['None', 'const'], 'adm_fr': ['local', 'a'], 'adm_chk': ['asref', 'amp'], 'val': ['local', 'a'],
}


def key(g):
    return hashlib.sha256(json.dumps(g, sort_keys=True).encode()).hexdigest()[:12]


def moves(g, nperm, rng, which):
    out = []
    for k, alts in CHOICES.items():
        if k[:3] in ('eq_', 'bh_') and not k.startswith(which + '_'):
            continue
        for v in alts:
            if g.get(k, genes.ADM_DEF[which].get(k, 'off' if k in genes.SUBST else {'own_pre': 'none', 'is_sol_src': 'local'}.get(k))) != v:
                h = copy.deepcopy(g); h[k] = v
                if k == 'bindbase' and h.get('xfer') != 'wrap':
                    continue
                out.append((f'{k}={v if isinstance(v, str) else ("A" if v in (genes.SNAP_A, genes.EV_A) else "F")}', h))
    for _ in range(nperm):
        k = rng.choice(['ev_order', 'ev_order', 'snap_order'])
        lst = list(g[k]); i = rng.randrange(len(lst)); j = rng.randrange(len(lst))
        if i == j: continue
        x = lst.pop(i); lst.insert(j, x)
        if k == 'snap_order':  # timestamp/shareholders are fallible: keep relative order ts<sh; is_sol must follow quote_mint
            if lst.index('is_sol') < lst.index('quote_mint') or lst.index('ts') > lst.index('sh'):
                continue
        h = copy.deepcopy(g); h[k] = lst
        out.append((f'{k}:mv {x} {i}->{j}', h))
    return out


def fitness(t):
    if not t: return -1
    return t['ratio'] - 0.0002 * abs(t['cand_bytes'] - t['window_bytes']) / 8


def load_cache():
    c = {}
    if ARCH.exists():
        for line in ARCH.read_text().splitlines():
            r = json.loads(line); c[r['src_sha']] = r
    return c


def evaluate(worker, name, eqg, bhg, cache):
    try:
        text = genes.render(eqg, bhg)
    except ValueError as e:
        return {'name': name, 'src_sha': '', 'eq': eqg, 'bh': bhg, 'status': 'invalid', 'score': None, 'sha': None, 't': {'eq': None, 'bh': None}, 'err': str(e)}
    ssha = hashlib.sha256(text.encode()).hexdigest()
    if ssha in cache:
        return cache[ssha]
    p = OUT / 'variants' / f'{name}.rs'; p.parent.mkdir(exist_ok=True); p.write_text(text)
    worker = FREE.get()
    try:
        m = evalv.run(worker, name, p)
    finally:
        FREE.put(worker)
    r = {'name': name, 'src_sha': ssha, 'eq': eqg, 'bh': bhg, 'status': m['status'], 'score': m.get('score'), 'sha': m.get('sha'),
         't': {k: (m.get('t', {}).get(W[k])) for k in W}, 'err': m.get('err', '')[-1500:] if m['status'] != 'built' else ''}
    with open(ARCH, 'a') as f: f.write(json.dumps(r) + '\n')
    cache[ssha] = r
    return r


def ok(r):
    s = r.get('score') or {}
    return r['status'] == 'built' and not s.get('losses') and not s.get('raw_losses')


def record(gen, rows, tgt, best):
    data = {'output': str(OUT / 'out'), 'normalized': 1019, 'raw': 188, 'gains': [], 'losses': [],
            'target': {'ratio': best['ratio'], 'cand_bytes': best['cand_bytes']},
            'notes': '; '.join(rows)[:3500]}
    dk = f'{W[tgt]}-main-d2cb88d-hillclimb-gen{gen}-{int(time.time())}-v1'
    subprocess.run(['python3', L, 'record', '--lane', 'buyv2-hillclimb', '--approach', 'hillclimb-genes', '--target', W[tgt],
                    '--dedupe-key', dk, '--hypothesis', f'Gene hill-climb generation {gen}: single-gene flips/field-order moves of tail idioms (wrappers, payment branch order, snapshot/event field order) on {tgt}',
                    '--status', 'rejected' if not rows or 'IMPROVED' not in rows[0] else 'partial', '--data', json.dumps(data)], capture_output=True)


def main():
    gens = int(sys.argv[1]); nperm = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[2] == '--perm' else 4
    st = json.loads(STATE.read_text())
    rng = random.Random(st.get('seed', 0) + st.get('gen', 0))
    cache = load_cache()
    for _ in range(gens):
        gen = st['gen'] = st.get('gen', 0) + 1
        me = moves(st['eq'], nperm, rng, 'eq'); mb = moves(st['bh'], nperm, rng, 'bh')
        rng.shuffle(me); rng.shuffle(mb)
        n = max(len(me), len(mb))
        jobs = []
        for i in range(n):
            de, ge = me[i] if i < len(me) else ('keep', st['eq'])
            db, gb = mb[i] if i < len(mb) else ('keep', st['bh'])
            jobs.append((f'g{gen}-{i}', de, ge, db, gb))
        with ThreadPoolExecutor(3) as ex:
            futs = [ex.submit(evaluate, i % 3, j[0], j[2], j[4], cache) for i, j in enumerate(jobs)]
            res = [f.result() for f in futs]
        improved = False
        for tgt, di in (('eq', 1), ('bh', 3)):
            cur = st['best'][tgt]
            rows = []; cand = None
            for j, r in zip(jobs, res):
                t = r['t'][tgt] if r['status'] == 'built' else None
                rows.append(f"{j[di]}:{r['status']}" + (f" r={t['ratio']} b={t['cand_bytes']}" if t else '') + ('' if ok(r) else ' LOSS'))
                if ok(r) and t and fitness(t) > fitness(cur) + 1e-9 and (cand is None or fitness(t) > fitness(cand[1])):
                    cand = (j, t)
            if cand:
                st[tgt] = cand[0][2] if tgt == 'eq' else cand[0][4]
                st['best'][tgt] = cand[1]; improved = True
                rows.insert(0, f'IMPROVED {cand[0][di]} -> r={cand[1]["ratio"]} b={cand[1]["cand_bytes"]}')
            record(gen, rows, tgt, st['best'][tgt])
            print(f'gen {gen} {tgt}: best r={st["best"][tgt]["ratio"]} b={st["best"][tgt]["cand_bytes"]} ' + (rows[0] if cand else 'no improvement'), flush=True)
        st.setdefault('history', []).append({'gen': gen, 'eq': st['best']['eq'], 'bh': st['best']['bh']})
        STATE.write_text(json.dumps(st, indent=1))
        if not improved and nperm == 0:
            print('converged'); break


if __name__ == '__main__':
    main()
