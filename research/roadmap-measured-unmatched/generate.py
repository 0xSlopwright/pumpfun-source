"""Build the roadmap from measured candidate misses rather than unnamed symbols."""
import argparse
import hashlib
import json
from pathlib import Path
import sys
import types

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts/reconstruction_roadmap.py'
SOURCE_SHA256 = {'19be3ae086be812914091039f3ec0ef1a0eb08da2d59e821faeeae102c50614b',
                 'e7f51159a9345abe7e7434ecda88346023446b47fc56aab01d0a2d1867b9603f'}
MEASURE_SHA256 = {'53444f621aee0f867ea69831ecd4ba1cc9c4a3eafe36db9c085bcc4c6cd9de1c',
                  '38ee923ca29b27322df9526b1a683c00d021f531dc519d12e2b1bdf01da25ab3'}
DEFAULT_CANDIDATES = Path(__file__).with_name('candidates.json')
PROGRAMS = ('pump', 'pump_amm', 'mayhem')


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def corrected_module(candidates_path=DEFAULT_CANDIDATES):
    if digest(SOURCE) not in SOURCE_SHA256:
        raise ValueError('The reviewed roadmap source has changed')
    measure_source = ROOT / 'scripts/window_measure.py'
    if digest(measure_source) not in MEASURE_SHA256:
        raise ValueError('The reviewed window measurement has changed')
    matcher = types.ModuleType('reviewed_roadmap_matcher')
    matcher.__file__ = str(measure_source)
    exec(compile(measure_source.read_bytes(), str(measure_source), 'exec'), matcher.__dict__)
    candidates = json.loads(Path(candidates_path).read_text(encoding='utf-8'))
    if not isinstance(candidates, dict) or set(candidates) != set(PROGRAMS):
        raise ValueError('Candidates must bind exactly the three roadmap programs')
    bindings, matched, program_info = {}, {}, {}
    for program in PROGRAMS:
        item = candidates[program]
        if not isinstance(item, dict) or set(item) != {'path', 'sha256'}:
            raise ValueError('Invalid candidate binding')
        candidate = (ROOT / item['path']).resolve()
        candidate.relative_to(ROOT.resolve())
        if digest(candidate) != item['sha256']:
            raise ValueError(f'Candidate hash mismatch: {program}')
        relative = f'evidence/original/{program}/deployed.so'
        rows = matcher.measure(ROOT / relative, candidate)
        matched[program] = {row['original'] for row in rows if row['match'] is not None}
        program_info[program] = {'deployed': relative, 'frontier_normalized': len(matched[program]),
                                 'frontier_raw': sum(row['raw'] for row in rows)}
        bindings[program] = {'candidate': candidate.relative_to(ROOT).as_posix(),
                             'candidate_sha256': item['sha256'], 'original_sha256': digest(ROOT / relative),
                             'windows': len(rows), 'normalized': len(matched[program]),
                             'raw': sum(row['raw'] for row in rows)}
    source = SOURCE.read_text(encoding='utf-8')
    before = '        unnamed_windows = [w for w in window_details if not w["name"]]'
    after = '        unnamed_windows = [w for w in window_details if w["address"] not in MEASURED_MATCHES[prog_name]]'
    if source.count(before) != 1:
        raise ValueError('Reviewed unmatched-window patch no longer applies')
    source = source.replace(before, after, 1)
    source = source.replace('unnamed_windows_by_size', 'unmatched_windows_by_size')
    source = source.replace('for w in unnamed_windows[:100]', 'for w in unnamed_windows')
    marker = '    # 6. Manifest\n'
    if source.count(marker) != 1:
        raise ValueError('Reviewed binding-receipt insertion no longer applies')
    source = source.replace(marker, '    (output_dir / "candidate-bindings.json").write_text(json.dumps(CANDIDATE_BINDINGS, indent=2) + "\\n")\n\n' + marker, 1)
    sys.path.insert(0, str(ROOT / 'scripts'))
    module = types.ModuleType('reviewed_measured_roadmap')
    module.__file__ = str(SOURCE)
    module.MEASURED_MATCHES = matched
    module.CANDIDATE_BINDINGS = bindings
    exec(compile(source, str(SOURCE), 'exec'), module.__dict__)
    module.PROGRAMS = program_info
    return module


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--candidates', type=Path, default=DEFAULT_CANDIDATES)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if args.output.exists():
        parser.error('output already exists; preserve prior evidence')
    corrected_module(args.candidates).generate_roadmap(args.output)
