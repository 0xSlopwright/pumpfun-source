import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildApp, type Fixture } from '../src/app.js';

const fixture = (path: string, query?: Record<string, string>): Fixture => ({
  method: 'GET', path, query, status: 200, body: { recorded: true }, source: 'synthetic:fixture-url',
});

test('unreachable raw paths and malformed percent encoding fail registration', () => {
  for (const path of ['/with space', '/caf\u00e9', '/bad\0path', '/bad\npath', '/bad%', '/bad%2', '/bad%ZZ', '/bad%FF', '/bad%E0%A4']) {
    assert.throws(() => buildApp([fixture(path)]), /valid percent-encoded ASCII request-target/);
  }
});

test('query keys and values cannot silently replace unpaired UTF-16 surrogates', () => {
  for (const query of [{ q: '\ud800' }, { q: '\udfff' }, { '\ud800': 'valid' }, { q: 'a\ud800b' }]) {
    assert.throws(() => buildApp([fixture('/query', query)]), /well-formed Unicode/);
  }
});

test('percent-encoded paths and real Unicode query values remain replayable', async () => {
  const paths = ['/fixtures/caf%C3%A9', '/fixtures/with%20space', '/fixtures/%F0%9F%8E%89'];
  const query = { q: '\u{1f389} \ufffd caf\u00e9' };
  const app = buildApp([...paths.map(path => fixture(path)), fixture('/query', query)]);
  try {
    for (const path of [...paths, '/query?' + new URLSearchParams(query).toString()]) {
      const response = await app.inject(path);
      assert.equal(response.statusCode, 200, path);
      assert.deepEqual(response.json(), { recorded: true });
    }
  } finally { await app.close(); }
});
