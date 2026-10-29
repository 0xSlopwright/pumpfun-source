import json,sys,copy
sys.path.insert(0,'.')
import genes, climb
from concurrent.futures import ThreadPoolExecutor
cache=climb.load_cache()
eqF=copy.deepcopy(genes.BH_FROZEN)
bhA=copy.deepcopy(genes.EQ_MAIN)
jobs=[('seed-id',genes.EQ_MAIN,genes.BH_FROZEN),('seed-eqF',eqF,genes.BH_FROZEN),('seed-bhA',genes.EQ_MAIN,bhA)]
with ThreadPoolExecutor(3) as ex:
    res=list(ex.map(lambda a: climb.evaluate(a[0], a[1], a[2], a[3], cache), [(i,)+j for i,j in enumerate(jobs)]))
for r in res:
    print(r['name'],r['status'],r['sha'],r['score'] and (r['score']['normalized'],r['score']['raw'],r['score']['losses']),{k:(v and (v['ratio'],v['cand_bytes'])) for k,v in r['t'].items()}, r['err'][-800:])
