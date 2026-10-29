import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openCorpus, findNodes, exactlyOne, objectProperty, propertyName, member, literal, sha256 } from './original-contracts/source.mjs';
import { createSchemaExtractor } from './original-contracts/schema.mjs';

const inputs = { manifestSha256: '9e0fc00719eb8c919dd4205d3c118eb48c4927e056c77e8343e26d6f7189bbb5',
  inventorySha256: '1d268ae7f2eb0f61eaaffd222269bf29d9ce06e9946372861721b2f159d868e2' };
const countSources = ['evidence/web/objects/eb0b23ee6feb7543.js', 'evidence/web/objects/95be9180237024f4.js'];
const gateSource = 'evidence/web/objects/229e1f0da48ca815.js';
const contractSource = 'evidence/web/objects/2b47dd0b38a1608f.js';
const operations = ['GET /following/v3/followers/count/{userId}', 'GET /following/v3/following/count/{userId}'];

function exportsOf(factory, id) {
  const registration = exactlyOne(findNodes(factory.node, (n) => n.type === 'CallExpression' &&
    member(n.callee, factory.runtime, 's') && (n.arguments[1]?.value === id ||
      (n.arguments.length === 1 && factory.ids.length === 1))), `registration ${id}`);
  const entries = registration.arguments[0].elements; const out = new Map();
  for (let i = 0; i < entries.length; i += 3) {
    if (entries[i]?.type !== 'StringLiteral' || entries[i + 1]?.value !== 0 || out.has(entries[i].value)) throw Error(`unsupported export ${id}`);
    out.set(entries[i].value, entries[i + 2]);
  }
  return out;
}
function local(factory, name) {
  return exactlyOne(findNodes(factory.node, (n, parents) => n.type === 'VariableDeclarator' && n.id.name === name &&
    !parents.some((p) => p !== factory.node && /Function|Method/.test(p.type))), `factory local ${name}`);
}
function imported(factory, id) {
  return exactlyOne(findNodes(factory.node, (n, parents) => n.type === 'VariableDeclarator' && n.init?.type === 'CallExpression' &&
    ['i', 'r'].some((m) => member(n.init.callee, factory.runtime, m)) && n.init.arguments[0]?.value === id &&
    !parents.some((p) => p !== factory.node && /Function|Method/.test(p.type))), `import ${id}`);
}
function callMember(node, namespace, name) {
  return findNodes(node, (n) => n.type === 'CallExpression' && member(n.callee.type === 'SequenceExpression' ?
    n.callee.expressions.at(-1) : n.callee, namespace, name));
}

export async function extractFollowCounts(root) {
  const corpus = await openCorpus(root);
  for (const [key, value] of Object.entries(inputs)) if (corpus.anchors[key] !== value) throw Error(`unreviewed follow-count input ${key}`);
  const factories = []; const fragments = new Map();
  const get = async (id, source) => {
    const f = await corpus.factory(id, source ? { source } : {}); factories.push(f.provenance); return f;
  };
  const add = (f, node, label) => {
    if (!node) throw Error(`missing ${label}`);
    const x = f.witness(node, label); const key = `${x.source}:${x.utf16.join(':')}`;
    fragments.set(key, { ...x, text: f.text(node) }); return key;
  };
  const contexts = [];
  for (const source of countSources) {
    const f = await get(633113, source); const exports = exportsOf(f, 633113);
    const request = local(f, exports.get('H').name).init;
    const website = imported(f, 759257); exactlyOne(callMember(request, website.id.name, 'j'), 'actual count website client');
    const seen = findNodes(request, (n) => n.type === 'StringLiteral' && n.value.startsWith('GET ')).map((x) => x.value).sort();
    if (JSON.stringify(seen) !== JSON.stringify([...operations].sort())) throw Error('count operation set changed');
    const query = exactlyOne(findNodes(f.node, (n) => n.type === 'ObjectExpression' &&
      n.properties.some((p) => propertyName(p.key) === 'refetchOnWindowFocus')), 'count query policy');
    const policy = { staleTime: literal(objectProperty(query, 'staleTime')), refetchOnWindowFocus: literal(objectProperty(query, 'refetchOnWindowFocus')) };
    if (policy.staleTime !== 60000 || policy.refetchOnWindowFocus !== false) throw Error('count query policy changed');
    const callback = exactlyOne(findNodes(f.node, (n) => n.type === 'ArrowFunctionExpression' && n.async), 'count callback');
    const queryCallback = add(f, callback, 'count callback signal/finite-number boundary');
    const updater = exports.get('U'); exactlyOne(callMember(updater, 'Math', 'max'), 'actual optimistic count clamp');
    const key = local(f, exports.get('h').name).init;
    contexts.push({ source, factorySha256: f.provenance.sha256, exports: ['H', 'D', 'q', 'h', 'U'], policy,
      request: add(f, request, 'two-way count request'), queryCallback, queryPolicy: add(f, query, 'count query policy'),
      key: add(f, key, 'count cache key'), updater: add(f, updater, 'local numeric count cache update'),
      clientImport: add(f, website.init, 'actual website client import') });
  }
  const gate = await get(18107, gateSource); const gateExports = exportsOf(gate, 18107);
  const ruleExports = exportsOf(gate, 635666);
  const countImport = imported(gate, 633113); const errorsImport = imported(gate, 402030);
  const reader = exactlyOne(findNodes(gate.node, (n) => n.type === 'ArrowFunctionExpression' && n.async), 'used bounty count reader');
  const readCall = exactlyOne(callMember(reader, countImport.id.name, 'H'), 'bounty uses actual633113.H');
  if (readCall.arguments.length !== 2 || literal(readCall.arguments[0]) !== 'followers') throw Error('bounty signal/operation boundary changed');
  exactlyOne(callMember(reader, errorsImport.id.name, 'isContractError'), 'bounty catches only actual contract error');
  const query = local(gate, gateExports.get('s').name).init;
  const policy = exactlyOne(findNodes(query, (n) => n.type === 'ObjectExpression' && n.properties.some((p) => propertyName(p.key) === 'queryKey')), 'bounty query policy');
  if (literal(objectProperty(policy, 'staleTime')) !== 60000 || policy.properties.some((p) => propertyName(p.key) === 'refetchOnWindowFocus')) throw Error('bounty focus override changed');
  const keyFactory = await get(38279, 'evidence/web/objects/ad7136d0b3a7f323.js');
  const key = exactlyOne(findNodes(keyFactory.node, (n) => n.type === 'ObjectProperty' && propertyName(n.key) === 'PUMP_FOLLOWERS_COUNT'), 'actual bounty cache key');
  const threshold = local(gate, ruleExports.get('W').name).init;
  if (literal(threshold) !== 10) throw Error('follower threshold changed');
  const classify = local(gate, ruleExports.get('f').name).init;
  const block = local(gate, ruleExports.get('s').name).init;
  const consumer = await get(544191, gateSource); const notice = exportsOf(consumer, 544191).get('f');
  const gateImport = imported(consumer, 18107);
  const gateCall = exactlyOne(callMember(notice, gateImport.id.name, 'z'), 'actual gate notice invokes18107.z');
  const flags = await get(322315, 'evidence/web/objects/256f83f9b5d323e6.js');
  const flag = exactlyOne(findNodes(flags.node, (n) => n.type === 'AssignmentExpression' &&
    propertyName(n.left?.property) === 'BOUNTY_PUMP_FOLLOWER_GATE'), 'actual follower gate flag name');
  const flagProvider = imported(gate, 254010); const viewerProvider = imported(gate, 779106);
  const projection = gateExports.get('z');
  const flagCall = exactlyOne(callMember(projection, flagProvider.id.name, 'k'), 'actual gate flag call');
  if (literal(flagCall.arguments[1]) !== true) throw Error('flag fallback changed');
  const viewerCall = exactlyOne(callMember(projection, viewerProvider.id.name, 'f'), 'actual viewer-key call');
  if (literal(viewerCall.arguments[0]) !== 'bounty-follower-gate') throw Error('viewer feature name changed');
  // The surrounding bundle also registers532688 (attachment lazyloader) and
  //885802 (content policy). Neither is the actual544191 gate consumer.
  const bounty = {
    reader: add(gate, reader, 'actual used bounty count reader, ContractError-only catch'),
    request: add(gate, readCall, 'used count call has no signal argument'),
    countImport: add(gate, countImport.init, 'bounty imports633113'),
    query: add(gate, query, 'bounty count query without signal/focus override'),
    key: add(keyFactory, key.value, 'actual PUMP_FOLLOWERS_COUNT key'),
    threshold: add(gate, threshold, 'default follower minimum'),
    classification: add(gate, classify, 'finite nonnegative follower eligibility'),
    isBlocked: add(gate, block, 'block only ineligible'),
    state: add(gate, gateExports.get('z'), 'actual flag/viewer/query state projection'),
    requirementMessage: add(gate, ruleExports.get('p'), 'original requirement message'),
    shortMessage: add(gate, ruleExports.get('R'), 'original short requirement message'),
    actualImportingConsumer: { module: 544191, export: 'f', source: add(consumer, notice, 'actual gate notice consumer544191.f'),
      gateCall: add(consumer, gateCall, 'actual544191.f calls18107.z') },
    flag: { name: literal(flag.right), fallback: true, source: add(flags, flag, 'captured follower gate flag name'),
      call: add(gate, flagCall, 'flag provider remains an explicit boundary') },
    viewerKeyCall: add(gate, viewerCall, 'viewer-key provider remains an explicit boundary'),
    limits: 'Flag and viewer-key providers remain explicit inputs; no auth resolver, active runtime winner, route reachability, mounted UI or backend policy inferred.' };
  const client = await get(759257, 'evidence/web/objects/1e479323ffe53c14.js');
  const origin = await get(503630, 'evidence/web/objects/1e479323ffe53c14.js');
  const http = await get(30181, 'evidence/web/objects/01ad4f413e529b60.js');
  const barrel = await get(402030, contractSource);
  const transport = await get(898661, contractSource);
  add(client, client.node, 'shared website constructor/defaults, credited684/686');
  add(origin, exportsOf(origin, 503630).get('R'), 'count service origin');
  add(http, exportsOf(http, 30181).get('K'), 'shared contract transport constructor');
  const routeImport = imported(barrel, 972407);
  const routeSpread = exactlyOne(findNodes(barrel.node, (n) => n.type === 'SpreadElement' && member(n.argument, routeImport.id.name, 'followingRoutes')), 'count declarations in actual catalog');
  add(barrel, routeSpread, 'actual followingRoutes catalog inclusion');
  add(transport, transport.node, 'shared request/json/error client, credited686/691');
  const extractor = createSchemaExtractor(corpus, { sources: { 972407: contractSource } });
  const declaration = await extractor.declaration(972407, 'followingRoutes'); const routes = {};
  for (const operation of operations) {
    const wrapped = objectProperty(declaration.node.arguments[0], operation); const spec = wrapped.arguments[1];
    if (literal(wrapped.arguments[0]) !== 'graph.read') throw Error('count scope changed');
    routes[operation] = { scope: 'graph.read', summary: literal(objectProperty(spec, 'summary')),
      params: await extractor.compile(objectProperty(spec, 'params'), declaration.factory),
      response: await extractor.compile(objectProperty(spec, 'response'), declaration.factory),
      source: add(declaration.factory, wrapped, operation+' declaration') };
  }
  for (const x of extractor.witnesses()) {
    if (x.label === 'declaration972407.followingRoutes' || x.label === 'declaration 972407.followingRoutes') continue;
    const key = `${x.source}:${x.utf16.join(':')}`;const capture = await corpus.capture(x.source);
    fragments.set(key, { ...x, ...(!x.label.startsWith('factory ') ? { text: capture.text.slice(...x.utf16) } : {}) });
  }
  return { schemaVersion: 1, authority: 'Captured AST/ranges and bounded independent client reconstruction; no captured code evaluated', frozenInputs: corpus.anchors,
    implementation: { path: 'reconstruction/follow-counts/client.mjs', sha256: sha256(await fs.readFile(path.join(root, 'reconstruction/follow-counts/client.mjs'))) },
    runtimeDependencies: [{ path: 'reconstruction/contract-http-errors/decode.mjs',
      sha256: sha256(await fs.readFile(path.join(root, 'reconstruction/contract-http-errors/decode.mjs'))), attribution: 'Maintained PR691; reused actual ContractError predicate, no new decoder credit' }],
    contexts, bounty, operations, service: { origin: 'https://frontend-api-v3.pump.fun', credentials: 'same-origin',
      boundary: 'Required caller-owned contract-client transport. No cookie/viewer/server authorization behavior or default destination installed.' },
    declarations: extractor.document({ 'x-follow-count-routes': routes }), factories, fragments: [...fragments.values()],
    limits: ['Both633113 capture variants are retained separately; no arbitrary active runtime winner selected',
      'Ordinary count query forwards signal; actual bounty reader drops it and swallows only ContractError',
      'The count declaration is a bare number, not a nonnegative integer; finite client normalization and UI nonnegative eligibility remain separate',
      'Local optimistic cache update is not a server mutation; no follow/unfollow or bounty creation request implemented',
      'No React/TanStack scheduling, auth/flag provider, visual parity, native API, production response or compatibility qualification'] };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const mode = process.argv[2];if (process.argv.length !== 3 || !['--write', '--check'].includes(mode)) throw Error('usage: original-follow-counts.mjs --write|--check');
  const root = fileURLToPath(new URL('..', import.meta.url)); const target = path.join(root, 'reconstruction/follow-counts/contract.json');
  const result = JSON.stringify(await extractFollowCounts(root), null, 2)+'\n';
  if (mode === '--check') { if (await fs.readFile(target, 'utf8') !== result) throw Error('follow-count source artifact changed'); }
  else {const temp=await fs.mkdtemp(path.join(path.dirname(target),'.counts-'));try{await fs.writeFile(path.join(temp,'contract.json'),result);await fs.rename(path.join(temp,'contract.json'),target);}finally{await fs.rm(temp,{recursive:true,force:true});}}
  console.log(`${mode === '--check' ? 'Verified' : 'Wrote'} original follow-count client/gate source`);
}
