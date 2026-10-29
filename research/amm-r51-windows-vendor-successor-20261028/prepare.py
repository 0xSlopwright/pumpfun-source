"""Prepare byte-pinned Windows r51 inputs; retain acquisition failures."""
import argparse
import concurrent.futures
import gzip
import hashlib
import importlib.util
import json
from pathlib import Path
import traceback

HERE = Path(__file__).resolve().parent


def read(path):
    data = path.read_bytes()
    return json.loads(gzip.decompress(data) if path.suffix == '.gz' else data)


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def save(path, value):
    path.write_bytes((json.dumps(value, indent=2) + '\n').encode())


def prepare(args):
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=False)
    state = {'status': 'STARTED', 'phase': 'helper_authentication',
             'compiler_executed': False, 'target_executions': 0,
             'completed_packages': [], 'failed_packages': []}
    try:
        pins = read(HERE / 'proposal-pins.json')
        dependency = args.repo.resolve() / pins['preparer_helper']['path']
        if hashlib.sha256(dependency.read_bytes()).hexdigest() != pins['preparer_helper']['sha256']:
            raise ValueError('reviewed input-preparation helper changed')
        helper = load('pinned_input_helper', dependency)
        # The unchanged helper still owns native inventory, authenticated
        # downloads and SDK extraction. Only vendor JSON construction is local.
        helper.RECIPE = HERE
        vendor_path = HERE / 'vendor.py'
        if hashlib.sha256(vendor_path.read_bytes()).hexdigest() != pins['local_vendor_helper']['sha256']:
            raise ValueError('reviewed AMM vendor metadata helper changed')
        vendor = load('amm_vendor_metadata', vendor_path)
        state['phase'] = 'native_inventory'
        try:
            helper.native_inputs(output, args.native_inputs_sha256)
        except ValueError:
            native = output / 'native-inputs.json'
            if args.native_inputs_sha256 or not native.is_file():
                raise
            result = read(native)
            if result.get('cl_link_match_qualified_hashes') is not True:
                raise
            save(output / 'prepared-inputs.json', {
                'status': 'PREFLIGHT_ONLY', 'compiler_executed': False,
                'native_manifest_sha256': result['native_manifest_sha256'],
                'next_step': 'Review this actual native byte inventory before a build dispatch.',
            })
            state['status'] = 'PREFLIGHT_ONLY'
            return
        if args.check_native_only:
            save(output / 'prepared-inputs.json', {
                'status': 'NATIVE_VERIFIED', 'compiler_executed': False,
                'native_manifest_sha256': args.native_inputs_sha256,
            })
            state['status'] = 'NATIVE_VERIFIED'
            return
        sdk = read(HERE / 'sdk-components.json.gz')
        target = read(HERE / 'linux-sysroot-inputs.json')
        archives = output / 'archives'
        state['phase'] = 'sdk_acquisition'
        windows = helper.download(pins['windows_sdk_archive']['url'],
                                  archives / 'windows-v144.tar.bz2', sdk['archive_sha256'])
        linux = helper.download(target['url'], archives / 'linux-v144.tar.bz2',
                                target['archive_sha256'])
        state['phase'] = 'sdk_extraction'
        helper.extract_components(windows, output / 'sdk', sdk['files'])
        helper.extract_components(linux, output / 'linux-sysroot', target['files'])
        acquisition = read(HERE / 'vendor-acquisition.json')
        vendor_files = read(HERE / 'vendor-files.json.gz')
        state['phase'] = 'vendor_acquisition'

        def package(record):
            name = record['name']
            archive = helper.download(record['url'], archives / (name + '.crate'), record['sha256'])
            return vendor.vendor_package(archive.read_bytes(), output / 'vendor', {
                'directory': name, 'package_sha256': record['sha256'],
                'file_count': record['files'], 'checksum_file_newline': '\n',
                'checksum_file_sha256': vendor_files[name + '/.cargo-checksum.json'],
            })

        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            futures = {pool.submit(package, record): record for record in acquisition}
            for future in concurrent.futures.as_completed(futures):
                record = futures[future]
                if future.cancelled():
                    continue
                try:
                    state['completed_packages'].append(future.result())
                except Exception as error:
                    state['failed_packages'].append({
                        'directory': record['name'], 'archive_sha256': record['sha256'],
                        'checksum_file_sha256': vendor_files[record['name'] + '/.cargo-checksum.json'],
                        'error_type': type(error).__name__, 'error': str(error),
                        'traceback': ''.join(traceback.format_exception(error)),
                    })
                    for pending in futures:
                        pending.cancel()
        state['completed_packages'].sort(key=lambda record: record['directory'])
        state['failed_packages'].sort(key=lambda record: record['directory'])
        if state['failed_packages']:
            raise ValueError('vendor acquisition failed: ' + ', '.join(
                record['directory'] for record in state['failed_packages']))
        state['phase'] = 'complete_input_inventory'
        builder = load('amm_windows_builder', HERE / 'build.py')
        builder.vendor_pin(output / 'vendor')
        builder.pin(output / 'sdk', {r['path']: r['sha256'] for r in sdk['files']})
        builder.pin(output / 'linux-sysroot', {r['path']: r['sha256'] for r in target['files']})
        save(output / 'prepared-inputs.json', {
            'status': 'READY', 'compiler_executed': False, 'target_executions': 0,
            'sdk_archive_sha256': sdk['archive_sha256'],
            'linux_target_archive_sha256': target['archive_sha256'],
            'sdk_selected_files': len(sdk['files']), 'linux_selected_files': len(target['files']),
            'registry_packages': len(acquisition), 'vendor_files': len(vendor_files),
        })
        state.update(status='READY', phase='complete')
    except Exception as error:
        state.update(status='FAILED', error_type=type(error).__name__, error=str(error),
                     traceback=''.join(traceback.format_exception(error)))
        raise
    finally:
        save(output / 'acquisition.json', state)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--native-inputs-sha256', default='')
    parser.add_argument('--check-native-only', action='store_true')
    prepare(parser.parse_args())
