import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  openCorpus,
  findNodes,
  exactlyOne,
  member,
  propertyName,
  objectProperty,
  literal,
  sha256,
} from "./original-contracts/source.mjs";
import { createSchemaExtractor } from "./original-contracts/schema.mjs";
const pins = {
  manifestSha256:
    "9e0fc00719eb8c919dd4205d3c118eb48c4927e056c77e8343e26d6f7189bbb5",
  inventorySha256:
    "1d268ae7f2eb0f61eaaffd222269bf29d9ce06e9946372861721b2f159d868e2",
};
const operation = "GET /users/{id}/mutual-followers";
const clientSource = "evidence/web/objects/eb0b23ee6feb7543.js";
const contractSource = "evidence/web/objects/2b47dd0b38a1608f.js";
function registration(f, id) {
  const n = exactlyOne(
    findNodes(
      f.node,
      (n) =>
        n.type === "CallExpression" &&
        member(n.callee, f.runtime, "s") &&
        (n.arguments[1]?.value === id ||
          (n.arguments.length === 1 && f.ids.length === 1)),
    ),
    `registration ${id}`,
  );
  const values = new Map();
  const a = n.arguments[0].elements;
  for (let i = 0; i < a.length; i += 3) {
    if (
      a[i]?.type !== "StringLiteral" ||
      a[i + 1]?.value !== 0 ||
      values.has(a[i].value)
    )
      throw Error(`unsupported exports ${id}`);
    values.set(a[i].value, a[i + 2]);
  }
  return values;
}
function imported(f, id) {
  return exactlyOne(
    findNodes(
      f.node,
      (n, parents) =>
        n.type === "VariableDeclarator" &&
        n.init?.type === "CallExpression" &&
        ["i", "r"].some((m) => member(n.init.callee, f.runtime, m)) &&
        n.init.arguments[0]?.value === id &&
        !parents.some((p) => p !== f.node && /Function|Method/.test(p.type)),
    ),
    `actual import ${id}`,
  );
}
function callMember(node, namespace, name) {
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
function resolvedLocal(f, n) {
  if (n?.type !== "Identifier") return n;
  return exactlyOne(
    findNodes(
      f.node,
      (d, parents) =>
        d.type === "VariableDeclarator" &&
        d.id.name === n.name &&
        !parents.some((p) => p !== f.node && /Function|Method/.test(p.type)),
    ),
    `factory local ${n.name}`,
  ).init;
}

export async function extractMutualFollowers(root) {
  const corpus = await openCorpus(root);
  for (const [k, v] of Object.entries(pins))
    if (corpus.anchors[k] !== v)
      throw Error(`unreviewed mutual-follower input ${k}`);
  const factories = [];
  const fragments = new Map();
  const get = async (id, source) => {
    const f = await corpus.factory(id, source ? { source } : {});
    factories.push(f.provenance);
    return f;
  };
  const add = (f, n, label) => {
    if (!n) throw Error(`missing ${label}`);
    const x = f.witness(n, label);
    const key = `${x.source}:${x.utf16.join(":")}`;
    fragments.set(key, { ...x, text: f.text(n) });
    return key;
  };
  const f = await get(366510, clientSource);
  const exports = registration(f, 366510);
  const hook = exports.get("z");
  const callback = exactlyOne(
    findNodes(hook, (n) => n.type === "ArrowFunctionExpression" && n.async),
    "actual mutual query callback",
  );
  const request = exactlyOne(
    findNodes(
      callback,
      (n) => n.type === "CallExpression" && n.arguments[0]?.value === operation,
    ),
    "actual mutual request",
  );
  const returns = findNodes(callback, (n) => n.type === "ReturnStatement");
  if (returns.length !== 1 || returns[0].argument !== request)
    throw Error("mutual callback no longer returns raw client JSON");
  const clientImport = imported(f, 759257);
  const ctor = request.callee;
  if (
    ctor.type !== "CallExpression" ||
    ctor.arguments.length !== 0 ||
    callMember(ctor, clientImport.id.name, "j").length !== 1
  )
    throw Error("mutual selector does not invoke actual website j");
  const options = request.arguments[1];
  if (
    literal(objectProperty(options, "credentials")) !== "include" ||
    literal(objectProperty(options, "throwHttpErrors")) !== false
  )
    throw Error("mutual response/error override changed");
  const query = objectProperty(options, "query");
  if (
    literal(objectProperty(query, "offset")) !== 0 ||
    query.properties.length !== 2
  )
    throw Error("mutual first-page query changed");
  const hookList = objectProperty(
    objectProperty(options, "hooks"),
    "afterResponse",
  );
  if (
    hookList.type !== "ArrayExpression" ||
    hookList.elements.length !== 1 ||
    hookList.elements[0].type !== "Identifier"
  )
    throw Error("unsupported mutual response hooks");
  const guardName = hookList.elements[0].name;
  const responseGuard = exactlyOne(
    findNodes(
      f.node,
      (n, parents) =>
        n.type === "FunctionDeclaration" &&
        n.id.name === guardName &&
        !parents.some((p) => p !== f.node && /Function|Method/.test(p.type)),
    ),
    "actual non-OK response guard",
  );
  const throws = findNodes(responseGuard, (n) => n.type === "ThrowStatement");
  if (
    throws.length !== 1 ||
    throws[0].argument.type !== "CallExpression" ||
    throws[0].argument.callee.name !== "Error"
  )
    throw Error("mutual failure is not the captured plain Error");
  const policy = exactlyOne(
    findNodes(
      hook,
      (n) =>
        n.type === "ObjectExpression" &&
        n.properties.some((p) => propertyName(p.key) === "queryKey"),
    ),
    "mutual query policy",
  );
  if (
    literal(objectProperty(policy, "staleTime")) !== 60000 ||
    literal(objectProperty(policy, "retry")) !== 1
  )
    throw Error("mutual query policy changed");
  if (literal(exports.get("_")) !== 5)
    throw Error("mutual default limit changed");
  const viewerImport = imported(f, 779106);
  const viewerCall = exactlyOne(
    callMember(hook, viewerImport.id.name, "f"),
    "actual viewer cache-key boundary",
  );
  if (literal(viewerCall.arguments[0]) !== "mutual-followers")
    throw Error("viewer feature context changed");
  const client = await get(759257, "evidence/web/objects/1e479323ffe53c14.js");
  const origin = await get(503630, "evidence/web/objects/1e479323ffe53c14.js");
  const http = await get(30181, "evidence/web/objects/01ad4f413e529b60.js");
  const barrel = await get(402030, contractSource);
  const transport = await get(898661, contractSource);
  const j = registration(client, 759257).get("j");
  const kImport = imported(client, 30181);
  exactlyOne(callMember(j, kImport.id.name, "K"), "j calls shared K");
  const originImport = imported(client, 503630);
  exactlyOne(callMember(j, originImport.id.name, "R"), "j uses website origin");
  const k = registration(http, 30181).get("K");
  exactlyOne(
    callMember(k, imported(http, 402030).id.name, "createContractClient"),
    "K calls actual contract-client reexport",
  );
  const routeImport = imported(barrel, 941660);
  const catalog = exactlyOne(
    findNodes(
      barrel.node,
      (n) =>
        n.type === "SpreadElement" &&
        member(n.argument, routeImport.id.name, "usersRoutes"),
    ),
    "usersRoutes in actual catalog",
  );
  const originFn = registration(origin, 503630).get("R");
  if (originFn.body?.value !== "https://frontend-api-v3.pump.fun")
    throw Error("mutual service origin changed");
  const source = {
    hook: add(f, hook, "actual366510.z exported read query"),
    callback: add(f, callback, "raw JSON callback, no response normalization"),
    request: add(f, request, "actual credentialed first-page request"),
    key: add(
      f,
      resolvedLocal(f, exports.get("I")),
      "profile/limit/viewer cache key",
    ),
    prefix: add(f, resolvedLocal(f, exports.get("J")), "mutual cache prefix"),
    policy: add(f, policy, "actual query policy"),
    responseGuard: add(
      f,
      responseGuard,
      "non-OK plain Error hook, no response property",
    ),
    viewerBoundary: add(f, viewerCall, "viewer resolver remains external"),
    clientImport: add(f, clientImport.init, "actual website client import"),
    websiteDefaults: add(
      client,
      client.node,
      "shared j defaults and merge boundary, credited686",
    ),
    origin: add(origin, originFn, "actual website service origin"),
    httpConstructor: add(http, k, "shared K constructor"),
    catalog: add(barrel, catalog, "mutual route catalog inclusion"),
    client: add(
      transport,
      transport.node,
      "shared JSON/error pipeline, credited686/691",
    ),
  };
  const extractor = createSchemaExtractor(corpus, {
    sources: { 941660: contractSource },
  });
  const declaration = await extractor.declaration(941660, "usersRoutes");
  const route = objectProperty(declaration.node.arguments[0], operation);
  if (route.type !== "ObjectExpression")
    throw Error("mutual declaration wrapper changed");
  const fields = {};
  for (const name of ["params", "query", "response"])
    fields[name] = await extractor.compile(
      objectProperty(route, name),
      declaration.factory,
    );
  const declarationSource = add(
    declaration.factory,
    route,
    "mutual route declaration, no publicRead scope inferred",
  );
  for (const x of extractor.witnesses()) {
    if (x.label === "declaration 941660.usersRoutes") continue;
    const key = `${x.source}:${x.utf16.join(":")}`;
    const c = await corpus.capture(x.source);
    fragments.set(key, {
      ...x,
      ...(!x.label.startsWith("factory ")
        ? { text: c.text.slice(...x.utf16) }
        : {}),
    });
  }
  return {
    schemaVersion: 1,
    authority:
      "Authenticated captured AST and bounded independent client behavior; captured JS never evaluated",
    frozenInputs: corpus.anchors,
    implementation: {
      path: "reconstruction/mutual-followers/client.mjs",
      sha256: sha256(
        await fs.readFile(
          path.join(root, "reconstruction/mutual-followers/client.mjs"),
        ),
      ),
    },
    operation,
    entry: {
      module: 366510,
      export: "z",
      source: clientSource,
      factorySha256: f.provenance.sha256,
      sourceRanges: source,
    },
    requestPolicy: {
      origin: originFn.body.value,
      credentials: "include",
      throwHttpErrors: false,
      limitDefault: 5,
      offset: 0,
      staleTime: 60000,
      retry: 1,
      response:
        "Raw JSON passes through; no array mapping, total synthesis, hasMore continuation or DTO validation",
      viewer:
        "Used in enablement and cache identity only; not forwarded as a header/query/ownership assertion",
      errors:
        "Non-OK afterResponse throws a plain Error without response, so shared691 normalization preserves it",
    },
    declarations: extractor.document({
      "x-mutual-followers": {
        summary: literal(objectProperty(route, "summary")),
        ...fields,
        source: declarationSource,
      },
    }),
    factories,
    fragments: [...fragments.values()],
    limits: [
      "Actual registered366510.z is the entry boundary; no importing UI caller or rendered workflow established",
      "No publicRead wrapper/scope appears on this route declaration; graph.read or backend authorization is not inferred",
      "Required transport/viewer capabilities remain external; credentials include does not establish a real cookie session or viewer ownership",
      "retry1 is a query-runtime option; scheduling, Ky retries/timeout/cookie behavior and actual query hashing remain external",
      "Single fixed offset0 read, no infinite pager or complete graph; server ranking/count/auth/persistence/production responses unknown",
      "No server/API, mutation, UI mount, source-only completion credit or compatibility qualification",
    ],
  };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const mode = process.argv[2];
  if (process.argv.length !== 3 || !["--write", "--check"].includes(mode))
    throw Error("usage: original-mutual-followers.mjs --write|--check");
  const root = fileURLToPath(new URL("..", import.meta.url));
  const target = path.join(
    root,
    "reconstruction/mutual-followers/contract.json",
  );
  const value =
    JSON.stringify(await extractMutualFollowers(root), null, 2) + "\n";
  if (mode === "--check") {
    if ((await fs.readFile(target, "utf8")) !== value)
      throw Error("mutual-followers artifact changed");
  } else {
    const tmp = await fs.mkdtemp(path.join(path.dirname(target), ".mutual-"));
    try {
      await fs.writeFile(path.join(tmp, "contract.json"), value);
      await fs.rename(path.join(tmp, "contract.json"), target);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  }
  console.log(
    `${mode === "--check" ? "Verified" : "Wrote"} original mutual-followers workflow`,
  );
}
