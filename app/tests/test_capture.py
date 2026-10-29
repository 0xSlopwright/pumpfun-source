"""Resume reuses only integrity-checked regular files inside the capture object tree."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import threading
import time
import unittest
from unittest.mock import patch


spec = importlib.util.spec_from_file_location(
    'capture', Path(__file__).resolve().parents[1] / 'scripts/capture.py'
)
capture = importlib.util.module_from_spec(spec)
spec.loader.exec_module(capture)


class CaptureResumeTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory(prefix='capture-resume-test-')
        self.addCleanup(temporary.cleanup)
        self.base = Path(temporary.name)
        self.root = self.base / 'root'
        self.objects = self.root / 'evidence/web/objects'
        self.external = self.base / 'external'
        self.objects.mkdir(parents=True)
        self.external.mkdir()
        self.reuse = {}

        for patcher in (
            patch.object(capture, 'ROOT', self.root),
            patch.object(capture, 'OUT', self.root / 'evidence/web'),
            patch.object(capture, 'REUSE', self.reuse),
        ):
            patcher.start()
            self.addCleanup(patcher.stop)
        network_patcher = patch.object(capture, 'capture')
        self.network = network_patcher.start()
        self.network.side_effect = AssertionError('unexpected network capture')
        self.addCleanup(network_patcher.stop)

    @staticmethod
    def sha256(body):
        return hashlib.sha256(body).hexdigest()

    def record(self, url, path, body, **updates):
        record = {
            'url': url,
            'final_url': url,
            'status': 200,
            'path': path,
            'bytes': len(body),
            'sha256': self.sha256(body),
            'headers': {'content-type': 'application/javascript'},
        }
        record.update(updates)
        self.reuse[url] = record
        return record

    def write_object(self, relative, body):
        target = self.objects / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(body)
        return target

    def snapshot(self):
        entries = {}
        for item in sorted(self.base.rglob('*')):
            relative = item.relative_to(self.base).as_posix()
            if item.is_symlink():
                entries[relative] = ('symlink', os.readlink(item))
            elif item.is_file():
                body = item.read_bytes()
                entries[relative] = ('file', len(body), self.sha256(body))
            elif item.is_dir():
                entries[relative] = ('directory',)
        return entries

    def test_valid_retained_object_preserves_record_and_bytes(self):
        url = 'https://pump.fun/valid.js'
        body = b'const valid = true;'
        self.write_object('valid.js', body)
        record = self.record(url, 'evidence/web/objects/valid.js', body)
        before = json.loads(json.dumps(record))

        result = capture.pool([url])

        self.assertEqual(result, [(record, body)])
        self.assertIs(result[0][0], record)
        self.assertEqual(record, before)

    def test_valid_retained_object_never_refetches(self):
        url = 'https://pump.fun/cached.js'
        body = b'cached bytes'
        self.write_object('cached.js', body)
        record = self.record(url, 'evidence/web/objects/cached.js', body)

        self.assertEqual(capture.pool([url]), [(record, body)])
        self.assertEqual(capture.pool([url]), [(record, body)])
        self.network.assert_not_called()

    def test_matching_file_outside_object_directory_is_rejected(self):
        url = 'https://pump.fun/repository-file.js'
        body = b'matching but unauthorized'
        target = self.root / 'evidence/web/not-an-object.js'
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(body)
        self.record(url, 'evidence/web/not-an-object.js', body)

        with self.assertRaisesRegex(capture.RetainedCaptureError, 'outside evidence objects'):
            capture.pool([url])
        self.network.assert_not_called()

    def test_parent_directory_traversal_is_rejected_before_open(self):
        url = 'https://pump.fun/traversal.js'
        body = b'traversed bytes'
        (self.root / 'outside.js').write_bytes(body)
        self.record(url, 'evidence/web/objects/../../../outside.js', body)

        with patch.object(capture.os, 'open', wraps=os.open) as opened:
            with self.assertRaisesRegex(capture.RetainedCaptureError, 'invalid path'):
                capture.pool([url])
            opened.assert_not_called()
        self.network.assert_not_called()

    def test_absolute_posix_path_is_rejected_before_open(self):
        url = 'https://pump.fun/absolute.js'
        body = b'absolute bytes'
        target = self.external / 'absolute.js'
        target.write_bytes(body)
        self.record(url, target.as_posix(), body)

        with patch.object(capture.os, 'open', wraps=os.open) as opened:
            with self.assertRaisesRegex(capture.RetainedCaptureError, 'invalid path'):
                capture.pool([url])
            opened.assert_not_called()
        self.network.assert_not_called()

    def test_windows_absolute_and_drive_paths_are_rejected(self):
        body = b'windows path bytes'
        for index, value in enumerate((
            'C:/outside/drive.js',
            r'C:\outside\drive.js',
            r'\\server\share\object.js',
        )):
            with self.subTest(value=value):
                self.reuse.clear()
                url = f'https://pump.fun/windows-{index}.js'
                self.record(url, value, body)
                with self.assertRaisesRegex(capture.RetainedCaptureError, 'invalid path'):
                    capture.pool([url])
        self.network.assert_not_called()

    def test_external_file_symlink_is_rejected(self):
        url = 'https://pump.fun/symlink.js'
        body = b'external symlink bytes'
        target = self.external / 'target.js'
        target.write_bytes(body)
        link = self.objects / 'linked.js'
        try:
            link.symlink_to(target)
        except (NotImplementedError, OSError) as error:
            self.skipTest(f'symlink creation unavailable: {error}')
        self.record(url, 'evidence/web/objects/linked.js', body)

        with patch.object(capture.os, 'open', wraps=os.open) as opened:
            with self.assertRaisesRegex(capture.RetainedCaptureError, 'symlink path rejected'):
                capture.pool([url])
            opened.assert_not_called()
        self.network.assert_not_called()

    def test_symlinked_ancestor_escape_is_rejected(self):
        url = 'https://pump.fun/ancestor.js'
        body = b'external ancestor bytes'
        directory = self.external / 'redirected'
        directory.mkdir()
        (directory / 'ancestor.js').write_bytes(body)
        link = self.objects / 'redirect'
        try:
            link.symlink_to(directory, target_is_directory=True)
        except (NotImplementedError, OSError) as error:
            self.skipTest(f'directory symlink creation unavailable: {error}')
        self.record(url, 'evidence/web/objects/redirect/ancestor.js', body)

        with self.assertRaisesRegex(capture.RetainedCaptureError, 'symlink path rejected'):
            capture.pool([url])
        self.network.assert_not_called()

    def test_symlinked_object_directory_is_rejected(self):
        url = 'https://pump.fun/object-root-symlink.js'
        body = b'external object root bytes'
        self.objects.rmdir()
        redirected = self.external / 'objects'
        redirected.mkdir()
        (redirected / 'object.js').write_bytes(body)
        try:
            self.objects.symlink_to(redirected, target_is_directory=True)
        except (NotImplementedError, OSError) as error:
            self.skipTest(f'directory symlink creation unavailable: {error}')
        self.record(url, 'evidence/web/objects/object.js', body)

        with self.assertRaisesRegex(capture.RetainedCaptureError, 'symlink path rejected'):
            capture.pool([url])
        self.network.assert_not_called()

    def test_missing_retained_target_fails_closed(self):
        url = 'https://pump.fun/missing.js'
        body = b'missing bytes'
        self.record(url, 'evidence/web/objects/missing.js', body)

        with self.assertRaisesRegex(capture.RetainedCaptureError, 'object missing'):
            capture.pool([url])
        self.network.assert_not_called()

    def test_corrupted_retained_object_still_fails_integrity(self):
        url = 'https://pump.fun/corrupt.js'
        body = b'original capture'
        target = self.write_object('corrupt.js', body)
        record = self.record(url, 'evidence/web/objects/corrupt.js', body)
        self.assertEqual(capture.pool([url]), [(record, body)])

        corrupt = b'corrupt capture'
        target.write_bytes(corrupt)
        with self.assertRaisesRegex(capture.RetainedCaptureError, 'integrity mismatch'):
            capture.pool([url])
        self.network.assert_not_called()
        self.assertEqual(target.read_bytes(), corrupt)

    def test_unmatched_url_retains_fresh_capture_behavior(self):
        url = 'https://pump.fun/new.js'
        body = b'new capture'
        record = {'url': url, 'status': 200, 'bytes': len(body), 'sha256': self.sha256(body)}
        self.network.side_effect = None
        self.network.return_value = (record, body)

        self.assertEqual(capture.pool([url]), [(record, body)])
        self.network.assert_called_once_with(url)

    def test_malformed_path_values_are_rejected(self):
        body = b'malformed path'
        values = (None, 7, [], {}, '', 'evidence/web/objects/bad\x00.js')
        for index, value in enumerate(values):
            with self.subTest(value=repr(value)):
                self.reuse.clear()
                url = f'https://pump.fun/malformed-{index}.js'
                self.record(url, value, body)
                with self.assertRaisesRegex(capture.RetainedCaptureError, 'invalid path'):
                    capture.pool([url])
        self.network.assert_not_called()

    def test_directory_target_is_rejected(self):
        url = 'https://pump.fun/directory.js'
        body = b''
        (self.objects / 'directory.js').mkdir()
        self.record(url, 'evidence/web/objects/directory.js', body)

        with self.assertRaisesRegex(capture.RetainedCaptureError, 'regular file|object unavailable'):
            capture.pool([url])
        self.network.assert_not_called()

    @unittest.skipUnless(hasattr(os, 'mkfifo'), 'named pipes unavailable')
    def test_fifo_target_is_rejected_without_waiting_for_a_writer(self):
        url = 'https://pump.fun/fifo.js'
        fifo = self.objects / 'fifo.js'
        os.mkfifo(fifo)
        self.record(url, 'evidence/web/objects/fifo.js', b'')
        done = threading.Event()
        released = threading.Event()

        def release_blocked_reader():
            # A blocking open of a FIFO waits for a writer and no test timeout
            # can interrupt it, so open the write end if resume still waits.
            if done.wait(2):
                return
            while not done.is_set():
                try:
                    os.close(os.open(fifo, os.O_WRONLY | os.O_NONBLOCK))
                except OSError:
                    time.sleep(0.01)
                    continue
                released.set()
                return

        watchdog = threading.Thread(target=release_blocked_reader, daemon=True)
        watchdog.start()
        try:
            with self.assertRaisesRegex(capture.RetainedCaptureError, 'not a regular file'):
                capture.pool([url])
        finally:
            done.set()
            watchdog.join()
        self.assertFalse(released.is_set(), 'resume waited for a writer to open the FIFO')
        self.network.assert_not_called()

    def test_valid_nested_object_path_is_accepted(self):
        url = 'https://pump.fun/nested.js'
        body = b'nested object bytes'
        self.write_object('nested/deeper/valid.js', body)
        record = self.record(
            url, 'evidence/web/objects/nested/deeper/valid.js', body
        )

        self.assertEqual(capture.pool([url]), [(record, body)])
        self.network.assert_not_called()

    def test_dot_and_noncanonical_segments_are_rejected(self):
        body = b'noncanonical object'
        self.write_object('valid.js', body)
        values = (
            'evidence/web/objects/./valid.js',
            'evidence/web/objects//valid.js',
            'evidence/web/objects/valid.js/',
        )
        for index, value in enumerate(values):
            with self.subTest(value=value):
                self.reuse.clear()
                url = f'https://pump.fun/noncanonical-{index}.js'
                self.record(url, value, body)
                with self.assertRaisesRegex(capture.RetainedCaptureError, 'invalid path'):
                    capture.pool([url])
        self.network.assert_not_called()

    def test_invalid_record_does_not_mutate_retained_files(self):
        url = 'https://pump.fun/no-mutation.js'
        body = b'do not mutate'
        target = self.root / 'outside.js'
        target.write_bytes(body)
        self.record(url, 'evidence/web/objects/../../../outside.js', body)
        before = self.snapshot()

        with self.assertRaises(capture.RetainedCaptureError):
            capture.pool([url])

        self.assertEqual(self.snapshot(), before)
        self.network.assert_not_called()

    def test_diagnostics_do_not_leak_untrusted_paths_urls_or_bytes(self):
        url = 'https://user:credential@example.invalid/secret.js'
        body = b'PRIVATE-EXTERNAL-BYTES'
        target = self.external / 'credential-path-secret.js'
        target.write_bytes(body)
        self.record(url, target.as_posix(), body)

        with self.assertRaises(capture.RetainedCaptureError) as raised:
            capture.pool([url])
        message = str(raised.exception)
        self.assertRegex(message, r'Retained capture [0-9a-f]{12} invalid path')
        for secret in ('credential', 'secret', target.as_posix(), body.decode()):
            self.assertNotIn(secret, message)
        self.network.assert_not_called()

    def test_multiple_valid_records_are_reused_consistently(self):
        expected = []
        urls = []
        for index in range(12):
            url = f'https://pump.fun/concurrent-{11-index}.js'
            body = f'body-{index}'.encode()
            self.write_object(f'concurrent/{index}.js', body)
            record = self.record(
                url, f'evidence/web/objects/concurrent/{index}.js', body
            )
            urls.append(url)
            expected.append((url, record, body))

        result = capture.pool(urls)

        expected_by_url = {url: (record, body) for url, record, body in expected}
        self.assertEqual(result, [expected_by_url[url] for url in sorted(urls)])
        self.network.assert_not_called()

    def test_invalid_retained_record_prevents_all_network_workers(self):
        valid_url = 'https://pump.fun/valid-before-invalid.js'
        invalid_url = 'https://pump.fun/invalid-retained.js'
        new_url = 'https://pump.fun/unmatched-new.js'
        body = b'valid body'
        self.write_object('valid-before-invalid.js', body)
        self.record(
            valid_url, 'evidence/web/objects/valid-before-invalid.js', body
        )
        self.record(
            invalid_url, 'evidence/web/objects/../../../outside.js', body
        )
        self.network.side_effect = None
        self.network.return_value = ({'url': new_url, 'status': 200}, b'new')

        with self.assertRaises(capture.RetainedCaptureError):
            capture.pool([new_url, valid_url, invalid_url])
        self.network.assert_not_called()

    def test_resume_manifest_is_validated_before_pool_or_rewrite(self):
        manifest_path = self.root / 'evidence/web/manifest.json'
        body = b'escaped manifest bytes'
        (self.root / 'outside.js').write_bytes(body)
        record = {
            'url': 'https://pump.fun/escaped-manifest.js',
            'path': 'evidence/web/objects/../../../outside.js',
            'status': 200,
            'bytes': len(body),
            'sha256': self.sha256(body),
        }
        original = json.dumps({'records': [record]}, indent=2) + '\n'
        manifest_path.write_text(original)

        with patch.object(capture.sys, 'argv', ['capture.py', '--resume']), patch.object(
            capture, 'pool'
        ) as worker_pool:
            with self.assertRaises(capture.RetainedCaptureError):
                capture.main()

        worker_pool.assert_not_called()
        self.network.assert_not_called()
        self.assertEqual(manifest_path.read_text(), original)

    def test_duplicate_manifest_records_are_validated_before_url_collapsing(self):
        manifest_path = self.root / 'evidence/web/manifest.json'
        url = 'https://pump.fun/duplicate.js'
        body = b'valid duplicate bytes'
        self.write_object('duplicate.js', body)
        invalid = {
            'url': url,
            'path': 'evidence/web/objects/../../../outside.js',
            'status': 200,
            'bytes': len(body),
            'sha256': self.sha256(body),
        }
        valid = self.record(url, 'evidence/web/objects/duplicate.js', body)
        original = json.dumps({'records': [invalid, valid]}, indent=2) + '\n'
        manifest_path.write_text(original)
        self.reuse.clear()

        with patch.object(capture.sys, 'argv', ['capture.py', '--resume']), patch.object(
            capture, 'pool'
        ) as worker_pool:
            with self.assertRaises(capture.RetainedCaptureError):
                capture.main()

        worker_pool.assert_not_called()
        self.network.assert_not_called()
        self.assertEqual(manifest_path.read_text(), original)

    def test_duplicate_url_rejects_the_entire_resume_update(self):
        url = 'https://pump.fun/synthetic.js'
        self.write_object('one', b'one')
        self.write_object('two', b'two')
        first = self.record(url, 'evidence/web/objects/one', b'one')
        second = self.record(url, 'evidence/web/objects/two', b'two')
        sentinel = {'untouched': 'synthetic'}
        self.reuse.clear()
        self.reuse.update(sentinel)
        with self.assertRaises(capture.RetainedCaptureError):
            capture.load_reuse([first, second])
        self.assertEqual(self.reuse, sentinel)


if __name__ == '__main__':
    unittest.main()
