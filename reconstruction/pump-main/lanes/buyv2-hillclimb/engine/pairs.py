import json, sys, itertools, copy, random
sys.path.insert(0, '.')
import climb
from concurrent.futures import ThreadPoolExecutor
st = json.load(open('state.json'))
cache = climb.load_cache()
thr = {'eq': 0.955, 'bh': 0.925}
singles = {'eq': {}, 'bh': {}}
for r in cache.values():
    if r['status'] != 'built' or not climb.ok(r): continue
    for w in ('eq', 'bh'):
        d = {k: r[w].get(k) for k in set(r[w]) | set(st[w]) if r[w].get(k) != st[w].get(k)}
        t = r['t'][w]
        if d and t and t['ratio'] >= thr[w] and t['ratio'] != st['best'][w]['ratio']:
            singles[w][json.dumps(d, sort_keys=True)] = (d, t['ratio'])
pairs = {}
for w in ('eq', 'bh'):
    L = list(singles[w].values()); print(w, len(L), [(list(d), r) for d, r in L])
    P = []
    for (d1, _), (d2, _) in itertools.combinations(L, 2):
        if set(d1) & set(d2): continue
        g = copy.deepcopy(st[w]); g.update(d1); g.update(d2); P.append((list(d1) + list(d2), g))
    random.Random(5).shuffle(P); pairs[w] = P
n = max(len(pairs['eq']), len(pairs['bh'])); print('builds', n)
jobs = []
for i in range(n):
    de, ge = pairs['eq'][i] if i < len(pairs['eq']) else ('keep', st['eq'])
    db, gb = pairs['bh'][i] if i < len(pairs['bh']) else ('keep', st['bh'])
    jobs.append((f'p1-{i}', de, ge, db, gb))
with ThreadPoolExecutor(3) as ex:
    res = list(ex.map(lambda j: climb.evaluate(0, j[0], j[2], j[4], cache), jobs))
best = {'eq': None, 'bh': None}
for j, r in zip(jobs, res):
    for w, di, gi in (('eq', 1, 2), ('bh', 3, 4)):
        t = r['t'][w] if r['status'] == 'built' else None
        if t and climb.ok(r) and climb.fitness(t) > climb.fitness(st['best'][w]) and (best[w] is None or climb.fitness(t) > climb.fitness(best[w][1])):
            best[w] = (j, t)
        print(j[0], w, j[di], r['status'], t and (t['ratio'], t['cand_bytes']))
for w, gi in (('eq', 2), ('bh', 4)):
    if best[w]:
        st[w] = best[w][0][gi]; st['best'][w] = best[w][1]; print('IMPROVED', w, best[w][0][0], best[w][1]['ratio'], best[w][1]['cand_bytes'])
json.dump(st, open('state.json', 'w'), indent=1)
