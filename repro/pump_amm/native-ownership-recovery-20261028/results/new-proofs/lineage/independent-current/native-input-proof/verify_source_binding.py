#!/usr/bin/env python3
"""Offline canonical AMM -> exact compiled workspace and archived-input binding.

The dependency-proof verifier separately authenticates the nine crate archives,
lock selection and compiler provenance. This gate never opens private work paths.
"""
from pathlib import Path, PurePosixPath
import argparse
import json
import workspace_recipe_v3 as recipe


def archived_external_inputs(build_record, dependency_proof):
    record = json.loads(Path(build_record).read_bytes())
    proof = Path(dependency_proof).resolve()
    packages = json.loads(recipe.checked_file(proof, 'packages.json').read_bytes())
    assert len(packages) == 9
    expected = {}
    for package in packages:
        nv = package['name'] + '-' + package['version']
        assert package['active_root'] == 'active-sources/' + nv
        for relative, digest in (package['archived_files'] | package['cargo_generated_cache_files']).items():
            tail = nv + '/' + relative
            assert tail not in expected
            expected[tail] = (digest, recipe.checked_file(proof, 'active-sources/' + tail))
    assert len(expected) == 175
    suffix = recipe.CRATE + '/Cargo.toml'
    candidates = [name for name in record['source_sha256'] if name.endswith(suffix)]
    assert len(candidates) == 1
    prefix = candidates[0][:-len(suffix)]
    assert prefix
    mapped, seen = {}, set()
    for name, digest in record['source_sha256'].items():
        if name.startswith(prefix):
            continue
        assert name.count('/registry/src/') == 1, ('Unexpected external input', name)
        tail = name.split('/registry/src/', 1)[1]
        registry, separator, tail = tail.partition('/')
        assert registry and separator and tail
        pure = PurePosixPath(tail)
        assert not pure.is_absolute() and '..' not in pure.parts and str(pure) == tail
        assert tail in expected and tail not in seen, ('Unarchived or duplicate input', name)
        assert expected[tail][0] == digest, ('Archive record differs from build input', name)
        mapped[name] = expected[tail][1]
        seen.add(tail)
    assert seen == set(expected), ('External inventory differs', sorted(set(expected) - seen))
    return mapped


def verify(canonical_source, workspace, build_record, candidate, symbols,
           dependency_proof, current_source=None):
    """Bind saved artifacts; optionally require maintained source to equal canonical."""
    canonical = Path(canonical_source)
    if current_source is not None:
        current_inputs = recipe.source_inputs(Path(current_source))
        canonical_inputs = recipe.source_inputs(canonical)
        assert current_inputs == canonical_inputs, 'Current AMM source differs from canonical source'
    mapped = archived_external_inputs(build_record, dependency_proof)
    result = recipe.verify_build(canonical, Path(workspace), Path(build_record),
                                 Path(candidate), Path(symbols),
                                 external_inputs=mapped)
    assert (result['standalone_inputs'], result['workspace_inputs'],
            result['external_inputs_verified']) == (56, 57, 175)
    result.update(total_compiled_inputs_verified=232,
                  current_source_verified=current_source is not None,
                  private_cache_reads=0,
                  dependency_authentication='Separate dependency-proof/verify.py gate')
    return result


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--results', type=Path, default=Path(__file__).resolve().parent/'results')
    p.add_argument('--canonical-source', type=Path)
    p.add_argument('--workspace', type=Path)
    p.add_argument('--build-record', type=Path)
    p.add_argument('--candidate', type=Path)
    p.add_argument('--symbols', type=Path)
    p.add_argument('--dependency-proof', type=Path)
    p.add_argument('--current-source', type=Path)
    a = p.parse_args()
    r = a.results
    print(json.dumps(verify(a.canonical_source or r/'canonical-source',
        a.workspace or r/'source', a.build_record or r/'build/build-comparison.json',
        a.candidate or r/'build/artifacts/pump_amm_recovered.so',
        a.symbols or r/'build/artifacts/unstripped.so',
        a.dependency_proof or r/'dependency-proof', a.current_source), indent=2))

if __name__ == '__main__':
    main()
