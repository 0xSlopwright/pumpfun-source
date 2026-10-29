"""Read-only complete original-window census and conservative residual routing."""
from pathlib import Path
from collections import Counter, defaultdict
import hashlib
import json
from elf_reader import Elf
from source_fields import source_fields

W = Path(__file__).resolve().parent


def index(image, symbols):
    result = defaultdict(list)
    for f in symbols.funcs:
        a,n = f['start'],f['size']
        result[(n,image.normalized[a:a+n],json.dumps(image.pattern(a,n),sort_keys=True))].append(f)
    return result


def key(image, a, n):
    return (n,image.normalized[a:a+n],json.dumps(image.pattern(a,n),sort_keys=True))


def analyze():
    o,c,s,b,bs = [Elf(W/n) for n in
                  ['input-root/evidence/original/pump_amm/deployed.so','build/artifacts/pump_amm_recovered.so','build/artifacts/unstripped.so','baseline-artifacts/pump_amm_recovered.so','baseline-artifacts/unstripped.so']]
    ci,bi = index(c,s),index(b,bs)
    prior = json.loads((W/'previous-ledger.json').read_text())
    old = {int(r['original_start'],16):r for r in prior['rows']}
    hints = json.loads((W/'upstream-match-hints.json').read_text())
    rows,remaining,gains,losses = [],[],[],[]
    raw=matched_bytes=0
    shape_index=defaultdict(list)
    for f in s.funcs:
        shape_index[(f['size'],json.dumps(c.pattern(f['start'],f['size']),sort_keys=True))].append(f)
    for a,z in zip(o.entries,o.entries[1:]+[o.hi]):
        n=z-a;k=key(o,a,n);new=ci[k];before=bi[k]
        is_raw=any(o.b[a:z]==c.b[f['start']:f['start']+n]for f in new)
        raw+=is_raw
        if new:matched_bytes+=n
        row={'original':hex(a),'bytes':n,'matches':new,'raw_match':is_raw}
        rows.append(row)
        if new and not before:gains.append(row)
        if before and not new:losses.append(row)
        if new:continue
        original_fields=source_fields(o,a,n)
        scored=[]
        for f in shape_index[(n,json.dumps(o.pattern(a,n),sort_keys=True))]:
            ca=f['start'];diff=[i for i in range(0,n,8)
                               if o.normalized[a+i:a+i+8]!=c.normalized[ca+i:ca+i+8]]
            scored.append((len(diff),f,diff))
        scored.sort(key=lambda v:(v[0],v[1]['start']))
        best=[]
        if scored:
            for count,f,diff in scored:
                if count!=scored[0][0]:break
                cf=source_fields(c,f['start'],n)
                allowed={v[k]-f['start']for v in cf for k in ('line_store','length_store')}
                allowed|={v[k]-a for v in original_fields for k in ('line_store','length_store')}
                typed=bool(diff)and set(diff)<=allowed and all(
                    o.normalized[a+i:a+i+4]==c.normalized[f['start']+i:f['start']+i+4]
                    for i in diff)
                best.append({'candidate':f,'differing_instruction_offsets':diff,
                             'typed_source_only':typed,'candidate_source_fields':cf})
        source_only=any(v['typed_source_only']for v in best)
        domain=old.get(a,{}).get('domain','unclassified')
        actual_callee_hints=[]
        for call in o.callsites(a,n):
            ca=call['target']
            if ca not in o.entries:continue
            i=o.entries.index(ca);cn=(o.entries[i+1]if i+1<len(o.entries)else o.hi)-ca
            matches=ci[key(o,ca,cn)]
            if matches:actual_callee_hints.append({'call_offset':call['offset'],
                'original_target':hex(ca),'bytes':cn,'candidate_names':[v['name']for v in matches]})
        remaining.append({'original':hex(a),'bytes':n,'domain':domain,
            'classification':'typed_source_immediates_only'if source_only else
                'other_instructions'if best else 'no_same_size_and_relocations',
            'original_source_fields':original_fields,
            'upstream_normalized_match_names':hints.get(str(a),[]),
            'best_alternatives':best[:10],'tied_best_count':len(best),
            'actual_matched_callee_hints':actual_callee_hints})
    counts=Counter(r['classification']for r in remaining)
    domains={}
    for d in sorted({r['domain']for r in remaining}):
        rr=[r for r in remaining if r['domain']==d]
        domains[d]={'windows':len(rr),'bytes':sum(r['bytes']for r in rr),
                    'classifications':dict(Counter(r['classification']for r in rr))}
    return {'candidate_sha256':hashlib.sha256(c.b).hexdigest(),
        'baseline_sha256':hashlib.sha256(b.b).hexdigest(),
        'original_capture_sha256':hashlib.sha256(o.b).hexdigest(),
        'metrics':{'original_windows':len(rows),'normalized_windows':len(rows)-len(remaining),
            'raw_windows':raw,'remaining_windows':len(remaining),
            'normalized_percent':100*(len(rows)-len(remaining))/len(rows),
            'remaining_window_percent':100*len(remaining)/len(rows),
            'matched_text_bytes':matched_bytes,'original_text_bytes':o.hi-o.lo,
            'remaining_text_bytes':o.hi-o.lo-matched_bytes,
            'matched_text_percent':100*matched_bytes/(o.hi-o.lo),
            'remaining_text_percent':100*(o.hi-o.lo-matched_bytes)/(o.hi-o.lo),
            'whole_elf_identity':False},
        'gains':gains,'losses':losses,'classifications':dict(counts),
        'domains':domains,'remaining':remaining,'all_windows':rows,
        'limits':['Source-only classification identifies at least one same-sized candidate with the same relocation pattern; it does not prove that candidate is the original semantic owner.',
                  'Source record fields are recognized conservatively; unrecognized source metadata can remain in other-instructions.',
                  'Symbol and upstream match names are routing evidence, not authenticated historical source names.',
                  'Actual matched callees are reported but full call graph and data referent closure are not claimed.',
                  'The census says nothing about unexecuted semantic inputs or whole-ELF identity.']}


if __name__=='__main__':
    print(json.dumps(analyze(),indent=2))
