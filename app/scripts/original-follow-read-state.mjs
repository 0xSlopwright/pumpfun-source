import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  openCorpus,
  findNodes,
  exactlyOne,
  member,
  objectProperty,
  propertyName,
  literal,
  sha256,
} from "./original-contracts/source.mjs";
import { createSchemaExtractor } from "./original-contracts/schema.mjs";
const source = (name) => `evidence/web/objects/${name}.js`;
const operation = "GET /following/single/{id}";
function assert(ok, label) {
  if (!ok) throw Error(label);
}
function exportsOf(f, id) {
  const n = exactlyOne(
    findNodes(
      f.node,
      (n) =>
        n.type === "CallExpression" &&
        member(n.callee, f.runtime, "s") &&
        (n.arguments[1]?.value === id ||
          (n.arguments.length === 1 && f.ids.length === 1)),
    ),
    `actual registration ${id}`,
  );
  const result = new Map(),
    values = n.arguments[0].elements;
  for (let i = 0; i < values.length; i += 3) {
    assert(
      values[i]?.type === "StringLiteral" &&
        values[i + 1]?.value === 0 &&
        !result.has(values[i].value),
      `unsupported exports ${id}`,
    );
    result.set(values[i].value, values[i + 2]);
  }
  return result;
}
function imported(f, id) {
  return exactlyOne(
    findNodes(
      f.node,
      (n) =>
        n.type === "VariableDeclarator" &&
        n.init?.type === "CallExpression" &&
        ["i", "r"].some((m) => member(n.init.callee, f.runtime, m)) &&
        n.init.arguments[0]?.value === id,
    ),
    `actual import ${id}`,
  );
}
function calls(node, namespace, name) {
  return findNodes(
    node,
    (n) =>
      n.type === "CallExpression" &&
      member(
        n.callee.type === "SequenceExpression"
          ? n.callee.expressions.at(-1)
          : n.callee,
        namespace,
        name,
      ),
  );
}
export async function extractFollowReadState(root) {
  const corpus = await openCorpus(root);
  assert(
    corpus.anchors.manifestSha256 ===
      "9e0fc00719eb8c919dd4205d3c118eb48c4927e056c77e8343e26d6f7189bbb5",
    "unreviewed manifest",
  );
  assert(
    corpus.anchors.inventorySha256 ===
      "1d268ae7f2eb0f61eaaffd222269bf29d9ce06e9946372861721b2f159d868e2",
    "unreviewed inventory",
  );
  const fragments = new Map(),
    factories = new Map();
  const get = async (id, selected) => {
    const f = await corpus.factory(id, selected ? { source: selected } : {});
    factories.set(`${id}:${f.provenance.sha256}`, f.provenance);
    return f;
  };
  const add = (f, n, label) => {
    assert(n, `missing ${label}`);
    const x = f.witness(n, label),
      key = `${x.source}:${x.utf16.join(":")}`;
    fragments.set(key, { ...x, text: f.text(n) });
    return key;
  };
  const f = await get(350989, source("eb0b23ee6feb7543"));
  assert(
    f.provenance.sha256 ===
      "32ecd36e6cb92106cf0cdde6c7382658933cbdb728d3a88d6a07a8ac0bd3d4fc",
    "unreviewed follow-hook variant",
  );
  const hook = exportsOf(f, 350989).get("f");
  const returned = exactlyOne(
    findNodes(
      hook,
      (n) =>
        n.type === "ObjectExpression" &&
        n.properties.some((p) => propertyName(p.key) === "fetchIsFollowing"),
    ),
    "actual returned follow state",
  );
  const forwardName = objectProperty(returned, "fetchIsFollowing").name;
  const forward = exactlyOne(
    findNodes(
      hook,
      (n) => n.type === "VariableDeclarator" && n.id.name === forwardName,
    ),
    "actual forward callback",
  ).init;
  const requestNodes = findNodes(
    hook,
    (n) => n.type === "CallExpression" && n.arguments[0]?.value === operation,
  );
  assert(
    requestNodes.length === 2,
    "expected exactly the two actual relationship reads",
  );
  const forwardRequest = exactlyOne(
    findNodes(forward, (n) => requestNodes.includes(n)),
    "forward read request",
  );
  const reverseRequest = requestNodes.find((n) => n !== forwardRequest);
  const reverse = exactlyOne(
    findNodes(
      hook,
      (n) =>
        n.type === "ArrowFunctionExpression" &&
        n.async &&
        n !== forward &&
        findNodes(n, (child) => child === reverseRequest).length === 1,
    ),
    "reverse read callback",
  );
  const clientImport = imported(f, 759257);
  for (const request of requestNodes) {
    assert(
      request.callee.type === "CallExpression" &&
        calls(request.callee, clientImport.id.name, "j").length === 1,
      "follow read does not call actual j",
    );
    const options = request.arguments[1];
    assert(
      options.properties.map((p) => propertyName(p.key)).join(",") ===
        "params,query,headers,throwHttpErrors",
      "follow read options changed",
    );
    assert(
      literal(objectProperty(options, "throwHttpErrors")) === false,
      "follow read HTTP error behavior changed",
    );
    assert(
      literal(
        objectProperty(objectProperty(options, "headers"), "Content-Type"),
      ) === "application/json",
      "follow read header changed",
    );
  }
  const forwardOptions = forwardRequest.arguments[1],
    reverseOptions = reverseRequest.arguments[1];
  const target = objectProperty(
    objectProperty(forwardOptions, "params"),
    "id",
  ).name;
  const viewer = objectProperty(
    objectProperty(forwardOptions, "query"),
    "userId",
  ).name;
  assert(
    objectProperty(objectProperty(reverseOptions, "params"), "id").name ===
      viewer &&
      objectProperty(objectProperty(reverseOptions, "query"), "userId").name ===
        target,
    "reciprocal request operands changed",
  );
  const finalizer = exactlyOne(
    findNodes(forward, (n) => n.type === "TryStatement"),
    "forward try/finally",
  ).finalizer;
  assert(
    finalizer && !findNodes(reverse, (n) => n.type === "TryStatement").length,
    "forward/reverse readiness boundary changed",
  );
  const readinessCall = exactlyOne(
    findNodes(finalizer, (n) => n.type === "CallExpression"),
    "ready setter in finally",
  );
  assert(
    literal(readinessCall.arguments[0]) === true,
    "forward readiness assignment changed",
  );
  const effect = exactlyOne(
    calls(hook, imported(f, 352386).id.name, "useEffect"),
    "actual initial read effect",
  );
  const effectCallback = effect.arguments[0];
  assert(
    !effectCallback.async &&
      !findNodes(effectCallback, (n) => n.type === "AwaitExpression").length,
    "effect no longer starts reads without awaiting",
  );
  assert(
    findNodes(
      effectCallback,
      (n) => n.type === "CallExpression" && n.callee.name === forwardName,
    ).length === 1,
    "initial effect does not use actual forward callback",
  );
  const reverseName = exactlyOne(
    findNodes(
      hook,
      (n) => n.type === "VariableDeclarator" && n.init === reverse,
    ),
    "reverse callback binding",
  ).id.name;
  assert(
    findNodes(
      effectCallback,
      (n) => n.type === "CallExpression" && n.callee.name === reverseName,
    ).length === 1,
    "initial effect does not use actual reverse callback",
  );
  const stateInitializers = calls(
    hook,
    imported(f, 352386).id.name,
    "useState",
  ).slice(0, 3);
  assert(stateInitializers.length === 3, "follow state initialization changed");
  const viewerCall = exactlyOne(
    calls(hook, imported(f, 779106).id.name, "f"),
    "follow viewer-key resolver",
  );
  assert(
    literal(viewerCall.arguments[0]) === "follow",
    "viewer feature context changed",
  );
  const ranges = {
    forward: add(f, forward, "actual forward read; readiness in finally"),
    reverse: add(f, reverse, "actual reciprocal read; no readiness setter"),
    initialState: stateInitializers.map((n, i) =>
      add(f, n, `actual read state initializer${i}`),
    ),
    initialEffect: add(
      f,
      effect,
      "actual initial/skip read effect and dependency values",
    ),
    viewer: add(f, viewerCall, "follow viewer-key boundary; not authorization"),
    publicReadResult: add(
      f,
      returned.properties.find(
        (p) => propertyName(p.key) === "fetchIsFollowing",
      ),
      "returned forward read export boundary",
    ),
  };
  const viewerResolver = await get(779106, source("fd402d4185b44ce9"));
  const selector = await get(92245, source("fd402d4185b44ce9"));
  add(
    viewerResolver,
    viewerResolver.node,
    "actual viewer selector import/use; identity store remains external",
  );
  add(
    selector,
    exportsOf(selector, 92245).get("$"),
    "viewer key: trimmed userId then trimmed address then null",
  );
  const client = await get(759257, source("1e479323ffe53c14"));
  add(
    client,
    exportsOf(client, 759257).get("j"),
    "existing shared website client defaults/merge boundary credited686",
  );
  const origin = await get(503630, source("1e479323ffe53c14"));
  const originFn = exportsOf(origin, 503630).get("R");
  assert(
    originFn.body.value === "https://frontend-api-v3.pump.fun",
    "follow service origin changed",
  );
  exactlyOne(
    calls(
      exportsOf(client, 759257).get("j"),
      imported(client, 503630).id.name,
      "R",
    ),
    "j actual website URL",
  );
  add(origin, originFn, "website service origin");
  const http = await get(30181, source("01ad4f413e529b60"));
  const ctor = exportsOf(http, 30181).get("K");
  exactlyOne(
    calls(ctor, imported(http, 402030).id.name, "createContractClient"),
    "K actual contract client",
  );
  add(http, ctor, "existing K constructor");
  const barrel = await get(402030, source("2b47dd0b38a1608f"));
  add(
    barrel,
    exactlyOne(
      findNodes(
        barrel.node,
        (n) =>
          n.type === "SpreadElement" &&
          member(
            n.argument,
            imported(barrel, 972407).id.name,
            "followingRoutes",
          ),
      ),
      "followingRoutes catalog inclusion",
    ),
    "actual following catalog inclusion",
  );
  const transport = await get(898661, source("2b47dd0b38a1608f"));
  add(
    transport,
    transport.node,
    "existing JSON and error-normalization pipeline credited686/691",
  );
  const consumers = [];
  for (const id of [31802, 950766, 392089, 229937]) {
    for (const entry of corpus.index.modules.filter((x) =>
      x.ids.includes(id),
    )) {
      const consumer = await get(id, entry.origins[0].source);
      const invocation = exactlyOne(
        calls(consumer.node, imported(consumer, 350989).id.name, "f"),
        `actual consumer${id}`,
      );
      const callResult = exactlyOne(
        findNodes(
          consumer.node,
          (n) => n.type === "VariableDeclarator" && n.init === invocation,
        ),
        `consumer${id} result destructure`,
      );
      assert(
        callResult.id.type === "ObjectPattern",
        "consumer no longer destructures hook result",
      );
      consumers.push({
        module: id,
        factory: consumer.provenance,
        result: add(
          consumer,
          callResult,
          `actual${id} follow-state consumer; mutation callbacks excluded`,
        ),
      });
    }
  }
  const extractor = createSchemaExtractor(corpus, {
    sources: { 972407: source("2b47dd0b38a1608f") },
  });
  const declared = await extractor.declaration(972407, "followingRoutes");
  const wrapped = objectProperty(declared.node.arguments[0], operation);
  assert(
    literal(wrapped.arguments[0]) === "graph.read",
    "relationship scope changed",
  );
  const route = wrapped.arguments[1],
    fields = {};
  for (const name of ["params", "query", "response"])
    fields[name] = await extractor.compile(
      objectProperty(route, name),
      declared.factory,
    );
  add(
    declared.factory,
    wrapped,
    "existing graph.read declaration; raw client does not enforce it",
  );
  for (const x of extractor.witnesses()) {
    if (
      x.label.startsWith("factory ") ||
      x.label === "declaration 972407.followingRoutes"
    )
      continue;
    const c = await corpus.capture(x.source),
      key = `${x.source}:${x.utf16.join(":")}`;
    fragments.set(key, { ...x, text: c.text.slice(...x.utf16) });
  }
  return {
    schemaVersion: 1,
    authority: "Authenticated source AST; no captured JS evaluated",
    frozenInputs: corpus.anchors,
    implementation: {
      path: "reconstruction/follow-read-state/client.mjs",
      sha256: sha256(
        await fs.readFile(
          path.join(root, "reconstruction/follow-read-state/client.mjs"),
        ),
      ),
    },
    operation,
    entry: { module: 350989, export: "f", factory: f.provenance, ranges },
    consumers,
    readPolicy: {
      credentials:
        "Not overridden by callbacks; inherited website j GET defaults",
      errors:
        "throwHttpErrors=false; valid JSON follow truthiness is consumed even on non-OK HTTP status; JSON/network failures propagate",
      signal: "No query signal or explicit cancellation in either callback",
      ready:
        "Forward attempted read sets true in finally; reverse read does not change readiness; missing operands skip the callback body",
      state:
        "Raw initial flags use ??false; isReady initially truthy only for skipInitialFetch plus defined initialIsFollowing",
      effect:
        "Skip branch reuses defined initial values unless lastActionTarget===target; normal branch starts forward then reverse without await; missing viewer sets ready",
    },
    declarations: extractor.document({
      "x-follow-read": {
        scope: "graph.read",
        wrapper: "publicRead",
        ...fields,
      },
    }),
    factories: [...factories.values()],
    fragments: [...fragments.values()],
    limits: [
      "Only initial/read state is reconstructed, not POST/DELETE follow actions, auth/CAPTCHA, analytics, mutation cache updates or post-mutation reconciliation",
      "Viewer key is externally supplied; captured resolver selects userId/address from an external identity store and is not authentication proof",
      "Effect start ports do not await reads; host must observe asynchronous rejections; React effect scheduling/cleanup is not reconstructed",
      "No cancellation, target-generation guard or stale-response suppression is invented; callbacks retain their captured target/viewer values",
      "Actual registered button/author-menu consumers are static evidence; no rendered UI, complete route reachability or runtime variant winner is asserted",
      "Shared j/K/contract transport and declared graph.read schema are prior recovery, not new native/API/coverage credit",
      "No server, production read/mutation, cookie session, feature-ledger change or compatibility qualification",
    ],
  };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const mode = process.argv[2];
  if (process.argv.length !== 3 || !["--write", "--check"].includes(mode))
    throw Error("usage: original-follow-read-state.mjs --write|--check");
  const root = fileURLToPath(new URL("..", import.meta.url)),
    target = path.join(root, "reconstruction/follow-read-state/contract.json");
  const value =
    JSON.stringify(await extractFollowReadState(root), null, 2) + "\n";
  if (mode === "--check") {
    if ((await fs.readFile(target, "utf8")) !== value)
      throw Error("follow-read-state artifact changed");
  } else await fs.writeFile(target, value);
  console.log(
    `${mode === "--check" ? "Verified" : "Wrote"} original reciprocal follow reads`,
  );
}
