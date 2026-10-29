"""Recompute original/selected/new complete-callee classes from actual linked images."""
from pathlib import Path
from collections import Counter
import ast, difflib, gzip, hashlib, importlib.util, json, struct, sys
sys.dont_write_bytecode = True
Q = Path(__file__).resolve().parent
R = Q.parents[1]
W = Q
sha = lambda b: hashlib.sha256(b).hexdigest()
path = Q / 'tools/claim-analysis.py'
spec = importlib.util.spec_from_file_location('review_image_parser', path)
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
api = {'struct': struct}
L = R / 'research/pump-v3-buy-cost-overflow'
for name, names in [('pump_compare_function_bytes.py', {'normalize', 'body'}),
                    ('pump_quote_control_function_match.py', {'sections'}),
                    ('sealed-parent-verify.py', {'elf_functions'})]:
    f = L / 'tools' / name
    nodes = [n for n in ast.parse(f.read_bytes()).body if isinstance(n, ast.FunctionDef) and n.name in names]
    if {n.name for n in nodes} != names: raise ValueError('Parser functions')
    exec(compile(ast.Module(body=nodes, type_ignores=[]), str(f), 'exec'), api)
inventory = json.loads(gzip.decompress((L / 'sources/parent-inventory.json.gz').read_bytes()))['windows']
blobs = {'original': (R / 'evidence/original/pump/deployed.so').read_bytes(),
         'parent': (R / 'research/pump-final-composition-673-20261028/artifacts/unstripped.so').read_bytes(),
         'proposal': (Q / 'builds/primary/unstripped.so').read_bytes()}
images = {k: m.Image(b, [(x['start'], x['bytes'], 'original-window') for x in inventory] if k == 'original' else api['elf_functions'](b), api) for k, b in blobs.items()}
targets = {'original': images['original'].functions[0x5b3b0, 18584]}
for k in ('parent', 'proposal'): targets[k] = images[k].named('multi_hop_curve8swap_hop17h')
ledger, counts, counters = {}, {}, {}
for label, image in images.items():
    row = targets[label]; calls = []
    for operand in row['operands']:
        if operand['kind'] != 'direct-call': continue
        target = image.target(operand['target'])
        calls.append(dict(offset=operand['offset'], target=operand['target'], callee_bytes=target['bytes'],
                          callee_normalized_sha256=target['normalized_sha256'],
                          callee_names=sorted(image.names[operand['target'], target['bytes']])))
    ledger[label] = calls
    counters[label] = Counter((c['callee_bytes'], c['callee_normalized_sha256']) for c in calls)
    code = m.Code(image, row)
    direct = sum(i['opcode'] == 0x85 and i['src'] == 1 and i['immediate'] != -1 for i in code.instructions.values())
    indirect = sum(i['opcode'] == 0x8d for i in code.instructions.values())
    syscalls = [dict(offset=o, opcode=i['opcode'], src=i['src'], immediate=i['immediate'],
                     name=image.syscalls.get(row['start']+o)) for o, i in code.instructions.items()
                if i['opcode'] == 0x85 and (i['src'] != 1 or i['immediate'] == -1)]
    leaders = {0}
    for o, i in code.instructions.items():
        if i['opcode'] & 7 == 5 and i['opcode'] not in (0x85, 0x8d):
            leaders.update(i['successors'])
    counts[label] = dict(start=row['start'], bytes=row['bytes'], normalized_sha256=row['normalized_sha256'],
                         direct_callee_occurrences=len(calls), instruction_direct_calls=direct,
                         indirect_calls=indirect, direct_import_sites=syscalls, syntactic_basic_blocks=len(leaders))
    if direct != len(calls): raise ValueError('Normalizer/call decoder disagreement')
classes = []
for key in sorted(set().union(*(set(x) for x in counters.values()))):
    row = dict(callee_bytes=key[0], callee_normalized_sha256=key[1], **{k: v[key] for k, v in counters.items()})
    row['candidate_names'] = sorted({name for label in ('parent', 'proposal') for c in ledger[label]
        if (c['callee_bytes'], c['callee_normalized_sha256']) == key for name in c['callee_names']})
    classes.append(row)
def signature(call): return call['callee_bytes'], call['callee_normalized_sha256']
orders = {}
for label in ('parent', 'proposal'):
    a, b = [[signature(c) for c in ledger[k]] for k in ('original', label)]
    diffs = []
    for tag, i, j, u, v in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if tag != 'equal': diffs.append(dict(kind=tag, original_indices=[i, j], candidate_indices=[u, v],
            original_calls=ledger['original'][i:j], candidate_calls=ledger[label][u:v]))
    orders[label] = diffs
capacity = {label: dict(matched=sum((counters['original'] & counters[label]).values()),
    missing=sum((counters['original']-counters[label]).values()), extra=sum((counters[label]-counters['original']).values()))
    for label in ('parent', 'proposal')}
result = dict(images_sha256={k: sha(b) for k, b in blobs.items()}, function_counts=counts, complete_callee_capacity=capacity,
              full_call_occurrences=ledger, complete_callee_classes=classes, physical_call_order_differences=orders,
              limits=['All107/109 in prebuild packet refer to original/parent, not new proposal.',
                      'Complete normalized callee classes preserve call target body identity only under the established normalizer.',
                      'Physical call-sequence differences are attribution diagnostics, not a CFG/dataflow equivalence proof.'])
if '--no-write' not in sys.argv:
    (Q / 'actual-callees.json').write_text(json.dumps(result, indent=2) + '\n')
else:
    if json.loads((Q / 'actual-callees.json').read_bytes()) != result:
        raise ValueError('Retained actual call ledger differs')
print(json.dumps(dict(function_counts=counts, capacity=capacity, first_physical_call_difference=orders['proposal'][:1]), indent=2))
