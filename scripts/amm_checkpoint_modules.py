"""Read sealed AMM checkpoints with portable manifest keys.

The archived builders and their source hashes must remain byte-for-byte intact.
Adapt only the reviewed path serialization expressions in memory, after checking
the original module hash. All evidence, source, output and signature checks still
run. This loader is for saved verification, not compiler execution.
"""
import hashlib
import importlib.util
from pathlib import Path


CANONICAL = 'repro/pump_amm/canonical-frontier-20261028'
LAYOUT = 'research/amm-layout-closure-20261028'
RECIPE_SHA = '66108c658683bc82437323d0fbefb4ba4921dd66ec79c00ec64c3cfd19498656'
RECIPE_EDITS = (
    (b'str(path.relative_to(root))', b'path.relative_to(root).as_posix()', 2),
    (b'paths.append(str(relative))', b'paths.append(relative.as_posix())', 1),
)
# path: (original SHA-256, exact replacements, route nested module loads here)
REVIEWED = {
    CANONICAL + '/verify.py': (
        '8a581271c719b3bc270d417f21c52c167a13dd98ab280f16ac440b6d260eee63',
        ((b'str(path.relative_to(P))', b'path.relative_to(P).as_posix()', 1),),
        True,
    ),
    LAYOUT + '/verify.py': (
        '28bf6592e06cbc5370a985f36b1052cd6942ceb2cb8448c0d6e41d12ad9b0e79',
        (), True,
    ),
    CANONICAL + '/workspace_recipe.py': (RECIPE_SHA, RECIPE_EDITS, False),
    LAYOUT + '/workspace_recipe.py': (RECIPE_SHA, RECIPE_EDITS, False),
}


def load(name, path, root):
    """Load a checkpoint module without changing archived files or global imports."""
    path = Path(path).resolve()
    relative = path.relative_to(Path(root).resolve()).as_posix()
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    if relative not in REVIEWED:
        spec.loader.exec_module(result)
        return result
    expected, edits, recursive = REVIEWED[relative]
    source = path.read_bytes()
    if hashlib.sha256(source).hexdigest() != expected:
        raise ValueError('Unreviewed AMM checkpoint module: ' + relative)
    for before, after, count in edits:
        if source.count(before) != count:
            raise ValueError('AMM path adaptation occurrence count: ' + relative)
        source = source.replace(before, after)
    exec(compile(source, str(path), 'exec'), result.__dict__)
    if recursive:
        result.module = lambda child_name, child_path: load(child_name, child_path, root)
    return result
