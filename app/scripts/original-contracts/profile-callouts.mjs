import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openCorpus, exactlyOne, findNodes, objectProperty, propertyName, literal, member, sha256 } from './source.mjs';
import { createSchemaExtractor } from './schema.mjs';

const pins = {
  manifestSha256: '9e0fc00719eb8c919dd4205d3c118eb48c4927e056c77e8343e26d6f7189bbb5',
  inventorySha256: '1d268ae7f2eb0f61eaaffd222269bf29d9ce06e9946372861721b2f159d868e2',
};
const operation = 'GET /callout/list/{userId}';
const implementation = 'packages/frontend/src/lib/original-profile-callouts.mjs';

export async function extractProfileCallouts(root) {
  const corpus = await openCorpus(root);
  for (const [name, expected] of Object.entries(pins)) if (corpus.anchors[name] !== expected) throw new Error(`unreviewed profile input: ${name}`);
  const fragments = new Map();
  const factories = new Map();
  const add = (factory, node, label) => {
    const witness = factory.witness(node, label);
    const key = `${witness.source}:${witness.utf16.join(':')}`;
    fragments.set(key, { ...witness, text: factory.text(node) });
    return key;
  };
  const factory = async (id, source) => {
    const value = await corpus.factory(id, source ? { source } : {});
    factories.set(`${id}:${value.provenance.source}`, value.provenance);
    return value;
  };
  const planner = await factory(399346);
  const plannerFragment = add(planner, planner.node, 'profile query hook and bounded callbacks');
  const policy = exactlyOne(findNodes(planner.node, (node) => node.type === 'ObjectExpression' &&
    node.properties.some((property) => propertyName(property.key) === 'getNextPageParam')), 'profile query options');
  const cachePolicy = Object.fromEntries(['staleTime', 'gcTime', 'refetchOnWindowFocus'].map((name) => [name, literal(objectProperty(policy, name))]));
  for (const name of ['getNextPageParam', 'select']) {
    const binding = objectProperty(policy, name);
    const fn = exactlyOne(findNodes(planner.node, (node) => node.type === 'FunctionDeclaration' && node.id.name === binding.name), `${name} callback`);
    add(planner, fn, `profile ${name}`);
  }
  const keyArray = exactlyOne(findNodes(planner.node, (node) => node.type === 'ArrayExpression' &&
    node.elements[0]?.value === 'callouts' && node.elements[1]?.value === 'by-user'), 'profile query key');
  add(planner, keyArray, 'profile query-key tuple');
  const clientImport = exactlyOne(findNodes(planner.node, (node) => node.type === 'VariableDeclarator' &&
    node.init?.type === 'CallExpression' && member(node.init.callee, planner.runtime, 'i') && node.init.arguments[0]?.value === 735821), 'profile client import');
  const invocation = exactlyOne(findNodes(planner.node, (node) => node.type === 'CallExpression' &&
    node.callee.type === 'SequenceExpression' && member(node.callee.expressions[1], clientImport.id.name, 'H')), 'profile H invocation');
  add(planner, clientImport.init, 'profile imports request client');
  add(planner, invocation, 'profile invokes client H');
  const consumers = [];
  for (const source of ['evidence/web/objects/3740fc4e7a24596d.js', 'evidence/web/objects/cf2bb278631744da.js']) {
    const consumer = await factory(735821, source);
    let parent;
    const call = exactlyOne(findNodes(consumer.node, (node, parents) => {
      if (node.type !== 'CallExpression' || node.arguments[0]?.value !== operation) return false;
      parent = [...parents].reverse().find((item) => item.type === 'FunctionDeclaration');
      return true;
    }), 'profile request operation');
    if (!parent?.async) throw new Error('missing async profile consumer');
    const mapped = exactlyOne(findNodes(parent, (node) => node.type === 'CallExpression' &&
      node.callee.type === 'MemberExpression' && propertyName(node.callee.property) === 'map' && node.arguments[0]?.type === 'Identifier'), 'profile wire mapper');
    const mapper = exactlyOne(findNodes(consumer.node, (node) => node.type === 'VariableDeclarator' && node.id.name === mapped.arguments[0].name), 'profile wire mapper declaration');
    consumers.push({ factory: consumer.provenance,
      request: add(consumer, call, 'profile wire request'),
      clientResponse: add(consumer, parent, 'profile response adaptation'),
      rowMapper: add(consumer, mapper.init, 'profile row renames and nullable viewer booleans') });
  }
  // Retain exact transport context, reusing the source unit established in686.
  for (const id of [759257, 30181, 898661, 503630, 402030, 183184, 785036]) await factory(id);
  const origins = await factory(503630);
  const origin = exactlyOne(findNodes(origins.node, (node) => node.type === 'ArrowFunctionExpression' &&
    node.body.type === 'StringLiteral' && node.body.value === 'https://frontend-api-v3.pump.fun'), 'website profile origin');
  add(origins, origin, 'website origin R');

  const extractor = createSchemaExtractor(corpus);
  const declared = await extractor.declaration(957263, 'calloutRoutes');
  const wrapped = objectProperty(declared.node.arguments[0], operation);
  if (literal(wrapped.arguments[0]) !== 'content.read') throw new Error('profile public-read scope changed');
  const route = wrapped.arguments[1];
  add(declared.factory, wrapped, 'profile route declaration');
  const query = objectProperty(route, 'query').arguments[0];
  const queryFields = {};
  for (const property of query.properties) {
    const name = propertyName(property.key);
    if (name !== 'window') queryFields[name] = await extractor.compile(property.value, declared.factory);
  }
  const window = objectProperty(query, 'window');
  const transform = exactlyOne(findNodes(window, (node) => node.type === 'CallExpression' && propertyName(node.callee.property) === 'transform'), 'window transform');
  const callback = transform.arguments[0];
  const body = callback.body;
  const upper = body.left;
  const trim = upper?.callee?.object;
  if (callback.type !== 'ArrowFunctionExpression' || callback.params.length !== 1 ||
      body.type !== 'LogicalExpression' || body.operator !== '||' || body.right.type !== 'UnaryExpression' || body.right.operator !== 'void' || body.right.argument.value !== 0 ||
      upper?.type !== 'CallExpression' || upper.arguments.length !== 0 || propertyName(upper.callee.property) !== 'toUpperCase' ||
      trim?.type !== 'CallExpression' || trim.arguments.length !== 0 || !member(trim.callee, callback.params[0].name, 'trim')) throw new Error('unsupported declared window transform');
  const pipe = exactlyOne(findNodes(window, (node) => node.type === 'CallExpression' && propertyName(node.callee.property) === 'pipe'), 'window output pipe');
  const inputDeclaration = await extractor.compile(transform.callee.object, declared.factory);
  const optional = window.callee.object;
  if (inputDeclaration.type !== 'string' || propertyName(window.callee.property) !== 'describe' ||
      optional.type !== 'CallExpression' || propertyName(optional.callee.property) !== 'optional' ||
      optional.arguments.length !== 0 || optional.callee.object !== pipe) throw new Error('unsupported window input/optional wrapper');
  const windowDeclaration = { input: { ...inputDeclaration, optional: true },
    steps: ['trim', 'toUpperCase', 'emptyToUndefined'],
    output: await extractor.compile(pipe.arguments[0], declared.factory),
    source: add(declared.factory, window, 'declared window transform and pipe'),
    appliedByWebsiteRequestBuilder: false };
  const params = await extractor.compile(objectProperty(route, 'params'), declared.factory);
  const response = await extractor.compile(objectProperty(route, 'response'), declared.factory);
  const declarations = extractor.document({ 'x-profile-params': params, 'x-profile-query-fields': queryFields,
    'x-profile-response': response, 'x-declared-window': windowDeclaration });
  for (const witness of extractor.witnesses()) {
    const key = `${witness.source}:${witness.utf16.join(':')}`;
    const capture = await corpus.capture(witness.source);
    fragments.set(key, { ...witness, ...(!witness.label.startsWith('factory ') ? { text: capture.text.slice(...witness.utf16) } : {}) });
  }
  const impl = await fs.readFile(path.join(root, implementation));
  return { formatVersion: 1, operation, authority: 'Original captured client/config/declaration AST; independent pure planner, no captured JavaScript evaluated',
    frozenInputs: corpus.anchors, implementation: { path: implementation, sha256: sha256(impl) },
    planner: { source: plannerFragment, cachePolicy, key: ['callouts', 'by-user', 'userId??null', 'limit(default30)', 'sortBy(defaultTIMESTAMP)', 'sortOrder(defaultDESC)', 'includeMembers(defaultfalse)', 'window??null'],
      enabled: '(enabled===undefined||enabled)&&!!userId',
      nextToken: 'clientResponse.nextPageToken && callouts.length >= limit ? token : undefined',
      repeatedCursor: 'next token must differ from previous pageParam',
      flatten: 'First occurrence of each calloutId, in served page/row order; no sorting' },
    consumers, declarations,
    transport: { serviceOrigin: origin.body.value, proofUnit: 'https://github.com/lalalune/pumpfun-source/pull/686',
      chain: [399346, 735821, 759257, 30181, 402030, 898661], originFactory: 503630,
      boundary: 'Request descriptors only. Shared contract client serializes query/encodes userId and returns JSON; no request/response validation is added to that client' },
    discrepancy: { client: '399346 requires a full-length returned page before continuing on a nonempty nextPageToken',
      declaration: '957263 describes short hydrated pages and explicitly advises following nextPageToken rather than array length',
      disposition: 'Preserve both source facts; no original execution or server response establishes a correction here' },
    factories: [...factories.values()], fragments: [...fragments.values()],
    exclusions: ['No profile service, network request, backend compatibility or server pagination claim',
      'The userId is a query subject, not an authenticated principal or ownership proof',
      'React compiler memoization, TanStack cache/retry/scheduling runtime and observer lifetimes are not reconstructed',
      '399346 optimistic own-user overlay via92245/116458 is outside the server-page planner; no wallet/account identity is invented',
      'The separate declared window parser does not run in the captured website request builder',
      'No UI, auth, synthetic data, persistence, mutations or qualification ledgers changed'] };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [mode] = process.argv.slice(2);
  if (process.argv.length !== 3 || !['--write', '--check'].includes(mode)) throw new Error('usage: profile-callouts.mjs --write|--check');
  const root = fileURLToPath(new URL('../..', import.meta.url));
  const destination = path.join(root, 'contracts/original-profile-callouts.json');
  const result = `${JSON.stringify(await extractProfileCallouts(root), null, 2)}\n`;
  if (mode === '--check') {
    if (await fs.readFile(destination, 'utf8') !== result) throw new Error('profile source/planner artifact changed');
  } else {
    const staging = await fs.mkdtemp(path.join(path.dirname(destination), '.profile-callouts-'));
    try { await fs.writeFile(path.join(staging, 'artifact.json'), result); await fs.rename(path.join(staging, 'artifact.json'), destination); }
    finally { await fs.rm(staging, { recursive: true, force: true }); }
  }
  console.log(`${mode === '--check' ? 'Verified' : 'Wrote'} original profile callout planner and declarations`);
}
