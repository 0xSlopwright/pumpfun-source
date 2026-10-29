import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openCorpus, findNodes, exactlyOne, propertyName, objectProperty, member, literal, sha256 } from './source.mjs';
import { createSchemaExtractor } from './schema.mjs';

export const FROZEN_INPUTS = Object.freeze({
  manifestSha256: '9e0fc00719eb8c919dd4205d3c118eb48c4927e056c77e8343e26d6f7189bbb5',
  inventorySha256: '1d268ae7f2eb0f61eaaffd222269bf29d9ce06e9946372861721b2f159d868e2',
});
const operations = ['GET /home-feed', 'GET /home-feed/new', 'GET /home-feed/new/count'];
const contractChunk = 'evidence/web/objects/2b47dd0b38a1608f.js';
const consumerChunks = ['evidence/web/objects/3740fc4e7a24596d.js', 'evidence/web/objects/cf2bb278631744da.js'];

function exported(factory, id, name) {
  const registrations = findNodes(factory.node, (node) => node.type === 'CallExpression' &&
    member(node.callee, factory.runtime, 's') && node.arguments[0]?.type === 'ArrayExpression' &&
    (node.arguments[1]?.value === id || (node.arguments.length === 1 && factory.ids.length === 1)));
  const values = [];
  for (const registration of registrations) {
    const entries = registration.arguments[0].elements;
    for (let i = 0; i < entries.length; i += 3) {
      if (entries[i]?.value === name && entries[i + 1]?.value === 0) values.push(entries[i + 2]);
    }
  }
  return exactlyOne(values, `${id} export ${name}`);
}

function imports(factory) {
  return findNodes(factory.node, (node) => node.type === 'VariableDeclarator' && node.id.type === 'Identifier' &&
    node.init?.type === 'CallExpression' && ['i', 'r'].some((method) => member(node.init.callee, factory.runtime, method)) &&
    node.init.arguments.length === 1 && node.init.arguments[0].type === 'NumericLiteral')
    .map((node) => ({ alias: node.id.name, id: node.init.arguments[0].value, method: propertyName(node.init.callee.property), node: node.init }));
}

export async function extractHomeFeed(root) {
  const corpus = await openCorpus(root);
  for (const [name, expected] of Object.entries(FROZEN_INPUTS)) {
    if (corpus.anchors[name] !== expected) throw new Error(`unreviewed frozen input: ${name}`);
  }
  const extractor = createSchemaExtractor(corpus);
  const fragments = new Map();
  const factories = new Map();
  function witness(factory, node, label, verbatim = true) {
    const value = factory.witness(node, label);
    const id = `${value.source}:${value.utf16.join(':')}`;
    if (!fragments.has(id)) fragments.set(id, { ...value, ...(verbatim ? { text: factory.text(node) } : {}) });
    return id;
  }
  async function factory(id, source) {
    const value = await corpus.factory(id, source ? { source } : {});
    factories.set(`${id}:${value.provenance.source}`, value.provenance);
    return value;
  }
  const result = {};
  for (const source of consumerChunks) {
    const consumer = await factory(735821, source);
    const imported = imports(consumer);
    const client = exactlyOne(imported.filter((entry) => entry.id === 759257), 'consumer client import');
    const clientEdge = witness(consumer, client.node, 'website client import');
    for (const operation of operations) {
      const sites = [];
      // A named function boundary is needed, not a string-only attribution.
      const parents = new Map();
      findNodes(consumer.node, (node, ancestors) => {
        if (node.type === 'CallExpression' && node.arguments[0]?.value === operation) sites.push(node);
        parents.set(node, ancestors);
        return false;
      });
      const call = exactlyOne(sites, `${operation} call in ${source}`);
      const fn = [...parents.get(call)].reverse().find((node) => node.type === 'FunctionDeclaration');
      if (!fn || !fn.async) throw new Error(`missing async consumer boundary ${operation}`);
      // The call must be precisely the result of the imported j() factory.
      const callee = call.callee;
      if (callee.type !== 'CallExpression' || callee.arguments.length !== 0) throw new Error('unexpected consumer client invocation');
      let inner = callee.callee;
      if (inner.type === 'SequenceExpression' && inner.expressions[0]?.value === 0) inner = inner.expressions[1];
      if (!member(inner, client.alias, 'j')) throw new Error('consumer does not use imported client.j');
      const options = call.arguments[1];
      if (literal(objectProperty(options, 'credentials')) !== 'include') throw new Error('consumer credential behavior changed');
      if (literal(objectProperty(objectProperty(options, 'headers'), 'Content-Type')) !== 'application/json') throw new Error('consumer content type changed');
      const query = objectProperty(options, 'query');
      const queryNode = query.type === 'Identifier' ? exactlyOne(findNodes(fn.body, (node) =>
        node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && node.id.name === query.name), 'consumer query declaration').init : query;
      if (queryNode.type !== 'ObjectExpression') throw new Error('unexpected consumer query shape');
      const parameter = exactlyOne(findNodes(fn.body, (node) => node.type === 'VariableDeclarator' && node.id.type === 'ObjectPattern' &&
        node.init.type === 'Identifier' && node.init.name === fn.params[0].name), 'consumer input destructuring').id;
      const inputs = parameter.properties.map((property) => {
        if (property.type !== 'ObjectProperty' || property.computed) throw new Error('unsupported consumer input');
        const value = property.value;
        return { name: propertyName(property.key), local: value.type === 'AssignmentPattern' ? value.left.name : value.name,
          ...(value.type === 'AssignmentPattern' ? { default: literal(value.right) } : {}) };
      });
      const exports = ['Z', 'f', 'x'].filter((name) => exported(consumer, 735821, name).name === fn.id.name);
      if (exports.length !== 1) throw new Error(`unresolved consumer export ${operation}`);
      result[operation] ??= { method: 'GET', path: operation.slice(4), consumers: [] };
      result[operation].consumers.push({ source, factory: consumer.provenance.sha256,
        export: exports[0], function: fn.id.name, inputs, clientImport: clientEdge,
        functionFragment: witness(consumer, fn, `${operation} consumer`),
        queryFragment: witness(consumer, queryNode, `${operation} query`),
        requestFragment: witness(consumer, call, `${operation} request`) });
    }
    for (const id of [637172, 559015, 231824]) {
      const dependency = await factory(id, source);
      const name = { 637172: 's', 559015: 'A', 231824: 'f' }[id];
      witness(dependency, exported(dependency, id, name), `${id}.${name} query dependency`);
    }
  }

  const client = await factory(759257);
  const origins = await factory(503630);
  const transport = await factory(30181);
  const registry = await factory(402030);
  const contractClient = await factory(898661);
  const originNode = exported(origins, 503630, 'R');
  if (originNode.type !== 'ArrowFunctionExpression' || originNode.body.type !== 'StringLiteral') throw new Error('nonliteral website origin');
  const serviceOrigin = originNode.body.value;
  const chain = [
    { id: 759257, export: 'j', fragment: witness(client, exported(client, 759257, 'j'), 'website client j') },
    { id: 503630, export: 'R', fragment: witness(origins, originNode, 'website service origin') },
    { id: 30181, export: 'K', fragment: witness(transport, exported(transport, 30181, 'K'), 'HTTP contract client factory K') },
  ];
  // These whole bounded factories preserve the HTTP hook/error order and the
  // serializer exactly. They are source text, never imported or evaluated.
  witness(client, client.node, 'website client defaults and inactive internal-key hook');
  witness(transport, transport.node, 'captured HTTP transport and hook order');
  witness(contractClient, contractClient.node, 'contract serialization and error conversion');
  for (const id of [192, 886813, 858694, 233815, 4171, 183184, 785036]) {
    const dependency = await factory(id);
    witness(dependency, dependency.node, `bounded dependency ${id}`);
  }
  const registryImports = imports(registry);
  for (const [id, name] of [[387665, 'homeFeedRoutes'], [898661, 'createContractClient']]) {
    const edge = exactlyOne(registryImports.filter((entry) => entry.id === id), `registry import ${id}`);
    witness(registry, edge.node, `contract registry imports ${name}`);
    const uses = findNodes(registry.node, (node) => member(node, edge.alias, name));
    witness(registry, exactlyOne(uses, `registry ${name} use`), `contract registry exposes ${name}`);
  }

  const { node: declaration, factory: schemaFactory } = await extractor.declaration(387665, 'homeFeedRoutes');
  const declaredRoutes = declaration.arguments[0];
  if (declaredRoutes.type !== 'ObjectExpression' || declaredRoutes.properties.length !== 3) throw new Error('Home-feed route set changed');
  const publicRead = await extractor.declaration(785036, 'KEYED_ROUTE_CODES');
  const codes = await extractor.constant(publicRead.node, publicRead.factory);
  const registryDeclaration = await extractor.declaration(525364, 'ERROR_CODES');
  const schemas = {};
  for (const operation of operations) {
    const routeDeclaration = objectProperty(declaredRoutes, operation);
    const keyed = routeDeclaration.type === 'CallExpression';
    const route = keyed ? routeDeclaration.arguments[1] : routeDeclaration;
    if (keyed && literal(routeDeclaration.arguments[0]) !== 'content.read') throw new Error('Home-feed public scope changed');
    schemas[operation] = {};
    for (const name of ['query', 'response']) schemas[operation][name] = await extractor.compile(objectProperty(route, name), schemaFactory);
    result[operation] = { ...result[operation], serviceOrigin,
      declared: { summary: literal(objectProperty(route, 'summary')), query: schemas[operation].query,
        response: schemas[operation].response, ...(keyed ? { visibility: 'public', scope: 'content.read', emittedCodes: codes } : { emittedCodes: [] }) },
      declarationFragment: witness(schemaFactory, routeDeclaration, `${operation} declaration`) };
  }
  // Reconstruct only the wrapper's reachable keyed-error arms, not the entire
  // unrelated error registry. The consumer's non-OK hook throws a plain Error
  // before HTTPError creation; these declarations are not an observed envelope.
  const keyedErrors = {};
  for (const code of codes) {
    const definition = objectProperty(registryDeclaration.node, code);
    const fields = {};
    for (const property of definition.properties) {
      const name = propertyName(property.key);
      if (name !== 'data') fields[name] = literal(property.value);
    }
    const dataProperty = definition.properties.find((property) => propertyName(property.key) === 'data');
    keyedErrors[code] = { ...fields,
      ...(dataProperty ? { data: await extractor.compile(dataProperty.value, registryDeclaration.factory) } : {}),
      fragment: witness(registryDeclaration.factory, definition, `emitted ${code} declaration`) };
  }
  const fallbackError = await extractor.schema(4171, 'contractErrorBody');
  const declarations = extractor.document({ 'x-operation-schemas': schemas, 'x-keyed-error-data': keyedErrors, 'x-fallback-error': fallbackError });
  for (const operation of operations) {
    for (const kind of ['query', 'response']) {
      const name = `${operation.slice(5).replaceAll('/', '.')}.${kind}`;
      declarations.$defs[name] = declarations['x-operation-schemas'][operation][kind];
      const reference = { $ref: `#/$defs/${name}` };
      declarations['x-operation-schemas'][operation][kind] = reference;
      result[operation].declared[kind] = reference;
    }
  }
  const groupedErrors = new Map();
  for (const [code, metadata] of Object.entries(keyedErrors)) {
    const group = `${metadata.status}:${metadata.data?.$ref ?? 'no-data'}`;
    if (!groupedErrors.has(group)) groupedErrors.set(group, { status: metadata.status, codes: [], data: metadata.data });
    groupedErrors.get(group).codes.push(code);
  }
  const errorSchemas = {};
  for (const group of groupedErrors.values()) {
    const data = group.data ? declarations.$defs[group.data.$ref.slice('#/$defs/'.length)] : undefined;
    if (data && data.type !== 'object') throw new Error('emitted error data is not an object shape');
    const arm = { type: 'object', properties: { error: { enum: group.codes }, message: { type: 'string' }, ...data?.properties },
      required: ['error', 'message', ...(data?.required ?? [])] };
    (errorSchemas[group.status] ??= []).push(arm);
  }
  declarations['x-public-read-error-schemas'] = Object.fromEntries(Object.entries(errorSchemas)
    .map(([status, arms]) => [status, arms.length === 1 ? arms[0] : { anyOf: arms }]));
  for (const record of extractor.witnesses()) {
    const capture = await corpus.capture(record.source);
    const id = `${record.source}:${record.utf16.join(':')}`;
    // Factory witnesses authenticate context; named declarations/constants
    // retain the exact, smaller fragment as independently usable source text.
    fragments.set(id, { ...record, ...(!record.label.startsWith('factory ') ? {
      text: capture.text.slice(record.utf16[0], record.utf16[1]),
    } : {}) });
  }
  const compatibilityPath = 'contracts/original-home-feed-index-compatibility.json';
  const compatibilityBytes = await fs.readFile(path.join(root, compatibilityPath));
  const compatibility = JSON.parse(compatibilityBytes);
  // Main adopted the #679 expansion; the witness proves the selected complete
  // entries and numeric-ID variant sets are equal across both indexes.
  if (compatibility.expandedInventorySha256 !== corpus.anchors.inventorySha256 ||
      compatibility.equalCompleteIndexEntries !== true) throw new Error('invalid index compatibility witness');
  const contextRanges = new Set([...fragments.values()].map((record) => `${record.source}:${record.utf16.join(':')}`));
  const selected = [...new Set([...factories.values()].map((entry) => entry.sha256).concat(
    corpus.index.modules.filter((entry) => entry.origins.some((origin) => contextRanges.has(`${origin.source}:${origin.start}:${origin.end}`))).map((entry) => entry.sha256)))].sort();
  if (JSON.stringify(selected) !== JSON.stringify(compatibility.entries.map((entry) => entry.factorySha256))) throw new Error('selected factory compatibility set changed');
  for (const entry of compatibility.entries) {
    const current = exactlyOne(corpus.index.modules.filter((module) => module.sha256 === entry.factorySha256), 'selected complete index entry');
    if (sha256(JSON.stringify(current)) !== entry.completeEntrySha256) throw new Error('selected complete index entry changed');
  }
  for (const row of compatibility.numericIdVariants) {
    const hashes = corpus.index.modules.filter((entry) => entry.ids.includes(row.id)).map((entry) => entry.sha256).sort();
    if (JSON.stringify(hashes) !== JSON.stringify(row.factorySha256)) throw new Error(`selected numeric-ID variants changed: ${row.id}`);
  }
  return {
    formatVersion: 1,
    authority: 'Static original captured client source and declared schemas; no original JavaScript executed',
    frozenInputs: { ...corpus.anchors, uniqueFactoryVariants: corpus.index.modules.length,
      factoryOrigins: corpus.index.modules.reduce((total, entry) => total + entry.origins.length, 0),
      inventoryCompatibility: { document: compatibilityPath, sha256: sha256(compatibilityBytes),
        selectedVariants: compatibility.selectedVariants, expandedInventoryCommit: compatibility.expandedInventoryCommit,
        expandedInventorySha256: compatibility.expandedInventorySha256,
        note: 'Main now ships the expanded inventory (#679); the earlier maintained index is the comparison baseline' } },
    scope: operations,
    operations: result,
    transport: {
      chain, serviceOrigin, credentials: 'include', method: 'get', body: 'absent',
      headers: { 'Content-Type': 'application/json', 'x-pump-source': 'WEB', 'x-pump-platform': 'web' },
      defaultHeaderRule: 'source/platform headers are set only when absent; consumer Content-Type is explicit',
      authorization: 'No Authorization or x-api-key is installed by this j→K chain; the x-internal-api-key hook has an uninitialized local and is inactive in the captured factory',
      authUnknown: 'Browser cookie contents and server authentication/authorization policy are not established by credentials:include. pump_session_id and pump_device_id are telemetry, not proof of wallet authentication',
      querySerialization: { undefined: 'omit', scalars: 'String(value)', arrays: 'map(String), reject comma-bearing item, comma-join; empty optional array omitted, otherwise TypeError',
        validation: 'No whole-query/body/response schema parse: contract query.shape is consulted only for whether an empty array accepts undefined',
        encoding: 'Ky URLSearchParams encodes the serialized strings' },
      response: 'transport(...).json() returned directly; declared response schema is not run',
      nonOk: 'Each of these three consumers throws a plain Error with its status-specific message inside afterResponse, before HTTPError construction; generic ContractError conversion requires error.response and therefore does not convert that plain Error',
      retry: 'timeout 30000ms; configured limit1 and statuses500/502/503/504; shouldRetry returns false for a plain Error from these hooks, so those non-OK hooks do not receive the ordinary HTTPError retry path',
    },
    consumerQueryNotes: {
      'GET /home-feed': 'pageSize150, chain all, includeFollowedHolders false, viewerAddress null are consumer defaults. platform WEB; session/device telemetry; falsey userId/sessionId/deviceId omitted. Opted-in followedHoldersLimit is exported constant5. This consumer does not forward page/pageToken/bounds even though the wider declaration includes them',
      'GET /home-feed/new': 'pageSize has no consumer default; chain all. Bounds spread after chain can override it. Falsey pageToken is omitted. No response cursor normalization occurs here',
      'GET /home-feed/new/count': 'since is passed as supplied, including empty string; chain all. Bounds spread after since/chain can override either. No since-token format check occurs here',
    },
    declarations,
    factories: [...factories.values()],
    fragments: [...fragments.values()],
    limits: [
      'This is an offline declaration/transport extraction, not original backend source or a restored endpoint implementation',
      'No authenticated or production response was captured for these three paths; no API compatibility or native-operation credit is claimed',
      'The schemas are acceptance predicates for a bounded source language; they perform no defaults, coercion, object stripping, transformations or server checks. x-zod-optional is an explicit undefined-acceptance extension. Captured primitive checks use code-point string lengths and safe-integer bounds',
      'Descriptions are retained verbatim, not promoted to refinements/defaults: no invented cursor regex, nonnegative count, chain exclusivity or cross-field min/max checks',
      'Both captured consumer variants are retained by exact chunk context. They share request behavior with renamed locals; no arbitrary module-ID variant is selected',
      'Only the named declaration dependency closure is recovered; the complete Zod/Ky libraries, telemetry environment and server/database/cache/realtime internals are not reconstructed',
      'The first two operations already have developer-bindings rows; those describe the separate developer host. This unit binds the captured website origin and full declarations, not additional documented-operation coverage',
    ],
  };
}

const invoked = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  const args = process.argv.slice(2);
  if (args.length !== 1 || !['--write', '--check'].includes(args[0])) throw new Error('usage: node scripts/original-contracts/home-feed.mjs --write|--check');
  const root = fileURLToPath(new URL('../..', import.meta.url));
  const output = path.join(root, 'contracts/original-home-feed.json');
  const content = `${JSON.stringify(await extractHomeFeed(root), null, 2)}\n`;
  if (args[0] === '--write') {
    const staging = await fs.mkdtemp(path.join(path.dirname(output), '.home-feed-'));
    try {
      const temporary = path.join(staging, 'artifact.json');
      await fs.writeFile(temporary, content, { flag: 'wx' });
      await fs.rename(temporary, output);
    } finally {
      await fs.rm(staging, { recursive: true, force: true });
    }
  }
  else if (await fs.readFile(output, 'utf8') !== content) throw new Error('original Home-feed artifact differs; review frozen inputs and regenerate');
  console.log(`${args[0] === '--check' ? 'Verified' : 'Wrote'} original Home-feed closure (3 GET operations)`);
}
