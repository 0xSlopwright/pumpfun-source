"""Compare typed Source records and module functions; no runtime execution."""
from pathlib import Path
import ast, collections, hashlib, json, struct, sys

W = Path(__file__).resolve().parent
R = W / 'inputs'
sys.path.insert(0, str(R / 'repro/pump_amm/claim-self-transfer-v144/static-tool'))
from elf_reader import Elf

tree = ast.parse((R / 'work/amm-pool-source-organization-20261027/origin-census-current.py').read_text())
function = next(x for x in tree.body if isinstance(x, ast.FunctionDef) and x.name == 'source_fields')
namespace = {'struct': struct}
exec(compile(ast.Module(body=[function], type_ignores=[]), '<checked-source-fields>', 'exec'), namespace)
source_fields = namespace['source_fields']
sha = lambda data: hashlib.sha256(data).hexdigest()

base = Elf(W / 'artifacts/base-symbols.so')
candidate = Elf(W / 'build/artifacts/unstripped.so')
original = Elf(R / 'evidence/original/pump_amm/deployed.so')


def masked(e, f):
    a, n = f['start'], f['size']
    data = bytearray(e.normalized[a:a + n])
    fields = source_fields(e, a, n)
    for field in fields:
        for key in ['length_store', 'line_store']:
            p = field[key] - a
            data[p + 4:p + 8] = bytes(4)
    return (n, sha(data), json.dumps(e.pattern(a, n), sort_keys=True)), fields


index = collections.defaultdict(list)
for f in candidate.funcs:
    key, fields = masked(candidate, f)
    index[key].append((f, fields))

comparisons = []
seen = set()
for f in base.funcs:
    if '9multi_hop' not in f['name'] or (f['start'], f['size']) in seen:
        continue
    seen.add((f['start'], f['size']))
    key, before_fields = masked(base, f)
    found = [(g, fs) for g, fs in index[key] if 'multi_hop_swap' in g['name']]
    comparisons.append({
        'base': f,
        'base_source_fields': before_fields,
        'counterparts_after_masking_only_typed_source_length_and_line': [
            {'function': g, 'source_fields': fs} for g, fs in found
        ],
    })


def static_locations(e, filename):
    result = []
    for a, relocation in e.relocations.items():
        if e.lo <= a < e.hi or relocation['type'] != 8 or a + 24 > len(e.b):
            continue
        pointer, length, line, following_word = struct.unpack_from('<QQII', e.b, a)
        pointer >>= 32
        if length != len(filename) or e.b[pointer:pointer + length] != filename.encode():
            continue
        result.append({'offset': a, 'filename': filename, 'length': length,
                       'line': line, 'following_u32': following_word})
    return sorted(result, key=lambda r: r['offset'])


old_name = 'programs/pump-amm/src/multi_hop.rs'
new_name = 'programs/pump-amm/src/instructions/swap/multi_hop_swap.rs'
report = {
    'scope': __doc__,
    'base_symbols_sha256': sha(base.b),
    'candidate_symbols_sha256': sha(candidate.b),
    'original_sha256': sha(original.b),
    'module_function_count': len(comparisons),
    'same_module_functions_after_typed_source_mask': sum(bool(r['counterparts_after_masking_only_typed_source_length_and_line']) for r in comparisons),
    'module_functions': comparisons,
    'static_locations': {'base': static_locations(base, old_name),
                         'candidate': static_locations(candidate, new_name),
                         'original': static_locations(original, new_name)},
    'limits': [
        'The mask covers only immediate length and line stores in validated typed Source records.',
        'A corresponding normalized function does not establish identity of its transitive calls or referenced data.',
        'Static location-like records expose the filename, length, line and following word; this report does not infer all record types.',
        'Matching the module filename does not establish historical source text or line positions.',
    ],
}
assert report == json.loads((W / 'source-origin-comparison.json').read_text())
if __name__ == '__main__':
    print(json.dumps({k: v for k, v in report.items() if k not in ['module_functions']}, indent=2))
