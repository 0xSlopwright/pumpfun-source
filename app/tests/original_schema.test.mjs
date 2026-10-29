import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { openCorpus, objectProperty, findNodes } from '../scripts/original-contracts/source.mjs';
import { createSchemaExtractor } from '../scripts/original-contracts/schema.mjs';
import { validateDeclared } from '../scripts/original-contracts/validate.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const corpus = await openCorpus(root);
const extractor = createSchemaExtractor(corpus);
const { node, factory } = await extractor.declaration(387665, 'homeFeedRoutes');
const roots = {};
const queries = {};
for (const property of node.arguments[0].properties) {
  const route = property.value.type === 'CallExpression' ? property.value.arguments[1] : property.value;
  roots[property.key.value] = {};
  for (const kind of ['query', 'response']) {
    const declaration = objectProperty(route, kind);
    if (kind === 'query') queries[property.key.value] = declaration;
    roots[property.key.value][kind] = await extractor.compile(declaration, factory);
  }
}
const document = extractor.document({ 'x-operation-schemas': roots });
const check = (operation, kind, value) => validateDeclared(document, roots[operation][kind], value).success;

test('actual frozen Home-feed query constraints, not description-only refinements', () => {
  assert.equal(check('GET /home-feed', 'query', {}), true);
  assert.equal(check('GET /home-feed', 'query', { page: -1 }), false);
  assert.equal(check('GET /home-feed', 'query', { pageSize: 200 }), true);
  assert.equal(check('GET /home-feed', 'query', { pageSize: 201 }), false);
  assert.equal(check('GET /home-feed/new', 'query', { pageSize: 50 }), true);
  assert.equal(check('GET /home-feed/new', 'query', { pageSize: 51 }), false);
  assert.equal(check('GET /home-feed/new', 'query', { pageSize: '25' }), false);
  // The captured AST has neither mutual exclusion nor min/max refinement.
  assert.equal(check('GET /home-feed/new', 'query', {
    chain: 'solana', chains: ['base'], minMarketCapUsd: 10, maxMarketCapUsd: 1,
  }), true);
  assert.equal(check('GET /home-feed/new', 'query', { chains: ['unknown'] }), false);
  assert.equal(check('GET /home-feed/new', 'query', { chains: Array(17).fill('solana') }), false);
});

test('count declaration admits negative integer and arbitrary string cursor, with required keys', () => {
  assert.equal(check('GET /home-feed/new/count', 'query', { since: '' }), true);
  assert.equal(check('GET /home-feed/new/count', 'query', {}), false);
  assert.equal(check('GET /home-feed/new/count', 'response', { newCount: -1, capped: false, headToken: '' }), true);
  assert.equal(check('GET /home-feed/new/count', 'response', { newCount: 1.5, capped: false, headToken: '' }), false);
  assert.equal(check('GET /home-feed/new/count', 'response', { newCount: Number.MAX_SAFE_INTEGER, capped: false, headToken: '' }), true);
  assert.equal(check('GET /home-feed/new/count', 'response', { newCount: Number.MAX_SAFE_INTEGER + 1, capped: false, headToken: '' }), false);
  assert.equal(check('GET /home-feed/new/count', 'response', { newCount: 0, capped: false, headToken: null }), false);
});

test('optional, nullable and code-point length remain distinct in real declarations', () => {
  assert.equal(check('GET /home-feed', 'response', { coins: [] }), true);
  assert.equal(check('GET /home-feed', 'response', { coins: [], nextPageToken: null }), false);
  assert.equal(check('GET /home-feed/new', 'response', { coins: [], headToken: null, liveSubject: '' }), true);
  assert.equal(check('GET /home-feed/new', 'response', { coins: [], liveSubject: '' }), false);
  assert.equal(check('GET /home-feed', 'query', { device_id: '😀'.repeat(128) }), true);
  assert.equal(check('GET /home-feed', 'query', { device_id: '😀'.repeat(129) }), false);
});

test('recursive quote/reply declarations close as references without invoking captured getters', () => {
  const callout = document.$defs['421504.calloutDto'];
  assert.equal(callout.properties.quotedCallout.anyOf[0].$ref, '#/$defs/421504.calloutWithAuthorDto');
  const author = document.$defs['421504.calloutWithAuthorDto'];
  assert.equal(author.properties.callout.$ref, '#/$defs/421504.calloutDto');
  const reply = document.$defs['421504.calloutReplyDto'];
  assert.equal(reply.properties.previewReplies.items.$ref, '#/$defs/421504.calloutReplyDto');
  assert.equal(reply.properties.authorReply.anyOf[0].$ref, '#/$defs/421504.calloutReplyDto');
  assert.ok(callout.required.includes('quotedCallout'));
  assert.ok(!callout.required.includes('viewCount'));
});

test('captured openEnum permits new strings, not arbitrary values', () => {
  const collectible = document.$defs['983689.collectibleDto'];
  const provider = collectible.properties.provider;
  assert.equal(validateDeclared(document, provider, 'future-provider').success, true);
  assert.equal(validateDeclared(document, provider, null).success, true);
  assert.equal(validateDeclared(document, provider, 7).success, false);
});

test('nonempty nested feed card validates real callout, quote and followed-holder fields', () => {
  // Synthetic values exercise the recovered declarations; they are not an
  // observed HTTP fixture and do not qualify server response behavior.
  function sample(rule) {
    if (rule.$ref) return sample(document.$defs[rule.$ref.slice('#/$defs/'.length)]);
    if (rule.anyOf) return sample(rule.anyOf.find((entry) => entry.type === 'null') ?? rule.anyOf[0]);
    if (rule.enum) return rule.enum[0];
    if ('const' in rule) return rule.const;
    if (rule.type === 'object') return Object.fromEntries(rule.required.map((name) => [name, sample(rule.properties[name])]));
    if (rule.type === 'array') return [];
    if (rule.type === 'string') return '';
    if (rule.type === 'boolean') return false;
    if (rule.type === 'null') return null;
    if (['number', 'integer'].includes(rule.type)) return Math.max(0, rule.minimum ?? 0);
    throw new Error('unknown fixture shape');
  }
  const card = sample(document.$defs['387665.local:u']);
  card.position = sample(document.$defs['387665.local:c']);
  card.position.callout = sample(document.$defs['421504.calloutDto']);
  card.position.quote = sample(document.$defs['421504.userReplyRowDto']);
  card.followedHolders = { holders: [sample(document.$defs['540480.followedHolderSummaryDto'])], totalCount: 1 };
  assert.equal(check('GET /home-feed', 'response', { coins: [card] }), true);
  card.position.quote.reply.hasLiked = 'false';
  assert.equal(check('GET /home-feed', 'response', { coins: [card] }), false);
  card.position.quote.reply.hasLiked = null;
  delete card.followedHolders.holders[0].walletAddress;
  assert.equal(check('GET /home-feed', 'response', { coins: [card] }), false);
});

test('unsupported reachable syntax fails instead of emitting a permissive schema', async () => {
  const modified = structuredClone(queries['GET /home-feed']);
  const calls = findNodes(modified, (node) => node.type === 'CallExpression' && node.callee.type === 'MemberExpression' && node.callee.property.name === 'optional');
  assert.ok(calls.length);
  calls[0].callee.property.name = 'inventedCheck';
  await assert.rejects(createSchemaExtractor(corpus).compile(modified, factory), /unsupported schema method inventedCheck/);
});

test('all emitted declaration witnesses bind to original bytes, not formatted recovery files', async () => {
  assert.ok(extractor.witnesses().length > 30);
  for (const witness of extractor.witnesses()) {
    assert.ok(witness.source.startsWith('evidence/web/objects/'));
    const capture = await corpus.capture(witness.source);
    assert.deepEqual(capture.witness({ start: witness.utf16[0], end: witness.utf16[1] }, witness.label), witness);
  }
});
