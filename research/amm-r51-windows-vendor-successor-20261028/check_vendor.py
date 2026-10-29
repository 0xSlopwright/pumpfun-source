"""Locally reconstruct all pinned AMM vendor files from authenticated caches."""
import argparse
import concurrent.futures
import gzip
import hashlib
import importlib.util
import json
from pathlib import Path
import tarfile
import tomllib

HERE = Path(__file__).resolve().parent


def sha(data):
    return hashlib.sha256(data).hexdigest()


def read(path):
    data = path.read_bytes()
    return json.loads(gzip.decompress(data) if path.suffix == '.gz' else data)


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def check(args):
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=False)
    records = read(HERE / 'vendor-acquisition.json')
    expected = read(HERE / 'vendor-files.json.gz')
    source = read(HERE / 'source-binding.json')
    archive = (HERE / 'source.tar.gz').read_bytes()
    assert sha(archive) == source['sha256']
    with tarfile.open(HERE / 'source.tar.gz') as tar:
        actual = {m.name: sha(tar.extractfile(m).read()) for m in tar if m.isfile()}
        assert actual == source['files']
        lock = tomllib.loads(tar.extractfile('Cargo.lock').read().decode())
    locked = {r['name'] + '-' + r['version']: r['checksum']
              for r in lock['package'] if 'checksum' in r}
    assert len(locked) == 257
    assert {r['name']: r['sha256'] for r in records} == locked
    pins = read(HERE / 'proposal-pins.json')
    helper_path = args.repo.resolve() / pins['preparer_helper']['path']
    assert sha(helper_path.read_bytes()) == pins['preparer_helper']['sha256']
    old = load('old_pinned_preparer', helper_path)
    vendor = load('amm_vendor_successor', HERE / 'vendor.py')
    builder = load('unchanged_windows_builder', HERE / 'build.py')
    cached = {}
    for cache in args.cache:
        for path in sorted(cache.glob('*/*.crate')):
            cached.setdefault(path.name[:-6], []).append(path)
    archives = {}
    for record in records:
        choices = cached.get(record['name'], [])
        assert choices, 'no cached package: ' + record['name']
        valid = [path for path in choices if sha(path.read_bytes()) == record['sha256']]
        assert valid, 'no authenticated archive: ' + record['name']
        archives[record['name']] = valid[0]

    def metadata(record):
        return {'directory': record['name'], 'package_sha256': record['sha256'],
                'file_count': record['files'], 'checksum_file_newline': '\n',
                'checksum_file_sha256': expected[record['name'] + '/.cargo-checksum.json']}

    aes = next(record for record in records if record['name'] == 'aes-0.8.4')
    blob = archives[aes['name']].read_bytes()
    try:
        old.vendor_package(blob, output / 'old-helper-aes', metadata(aes))
    except ValueError as error:
        old_failure = {'status': 'REPRODUCED_EXPECTED_FAILURE', 'error': str(error)}
        assert str(error) == 'cannot reconstruct pinned vendor checksum map: aes-0.8.4'
    else:
        raise AssertionError('old helper unexpectedly accepted AES')

    def one(record):
        receipt = vendor.vendor_package(archives[record['name']].read_bytes(),
                                        output / 'vendor', metadata(record))
        receipt['cache_archive'] = str(archives[record['name']])
        return receipt

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        receipts = list(pool.map(one, records))
    # This is the exact builder gate used before/after the hosted compilation.
    builder.vendor_pin(output / 'vendor')
    actual_vendor = {p.relative_to(output / 'vendor').as_posix(): sha(p.read_bytes())
                     for p in (output / 'vendor').rglob('*') if p.is_file()}
    assert len(actual_vendor) == 8437 and actual_vendor == expected
    bad = metadata(aes)
    bad['checksum_file_sha256'] = '0' * 64
    try:
        vendor.vendor_package(blob, output / 'wrong-pin', bad)
    except ValueError as error:
        negative = {'status': 'REJECTED_EXPECTED', 'error': str(error),
                    'no_extracted_files': not (output / 'wrong-pin').exists()}
        assert negative['no_extracted_files']
    else:
        raise AssertionError('wrong metadata pin accepted')
    result = {
        'status': 'ALL_PINNED_VENDOR_FILES_RECONSTRUCTED',
        'scope': 'Local acquisition check; no Windows build or compiler execution',
        'compiler_executed': False, 'target_executions': 0, 'downloads': 0,
        'source_archive_sha256': sha(archive), 'source_inputs': len(actual),
        'locked_packages': len(locked), 'authenticated_package_archives': len(archives),
        'exact_vendor_membership': True, 'vendor_files': len(actual_vendor),
        'all_vendor_sha256_equal_existing_pins': True,
        'checksum_metadata_files': len(receipts),
        'archive_order_sufficient': sum(r['archive_order_matches'] for r in receipts),
        'lexical_order_required': sum(not r['archive_order_matches'] for r in receipts),
        'unchanged_preparer_helper_sha256': sha(helper_path.read_bytes()),
        'local_vendor_helper_sha256': sha((HERE / 'vendor.py').read_bytes()),
        'old_helper_aes_control': old_failure, 'wrong_metadata_pin_control': negative,
        'input_maps_sha256': {name: sha((HERE / name).read_bytes()) for name in
                             ('vendor-acquisition.json', 'vendor-files.json.gz',
                              'source-binding.json', 'source.tar.gz')},
        'packages': receipts,
    }
    (output / 'vendor-control.json').write_bytes((json.dumps(result, indent=2) + '\n').encode())
    print(json.dumps({key: value for key, value in result.items() if key != 'packages'}, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--cache', type=Path, action='append', required=True)
    parser.add_argument('--output', type=Path, required=True)
    check(parser.parse_args())
