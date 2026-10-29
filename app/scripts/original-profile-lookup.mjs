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

const contexts = [
  [
    "d048caae282716b0",
    "3b89fd7cd809c05ef7403fea617b9d69af3ed23106b34a095144e463ebb74df5",
  ],
  [
    "7128bd47b219d222",
    "e39bef17254305a3d6a56ab31a0b4ab3917c4c45bb2f02e7f6f97bcef9fe9b42",
  ],
  [
    "27a1ee00eb5909ec",
    "4a32db97ba300fa1f7aec4b46ad310a27e3851230dfcdb98f6e08b7c4915907d",
  ],
];
const source = (name) => `evidence/web/objects/${name}.js`;
const contractSource = source("2b47dd0b38a1608f");
const operation = "GET /users/{id}";

function exportsOf(factory, id) {
  const registration = exactlyOne(
    findNodes(
      factory.node,
      (n) =>
        n.type === "CallExpression" &&
        member(n.callee, factory.runtime, "s") &&
        (n.arguments[1]?.value === id ||
          (n.arguments.length === 1 && factory.ids.length === 1)),
    ),
    `actual registration ${id}`,
  );
  const entries = registration.arguments[0].elements;
  const values = new Map();
  for (let i = 0; i < entries.length; i += 3) {
    if (
      entries[i]?.type !== "StringLiteral" ||
      entries[i + 1]?.value !== 0 ||
      values.has(entries[i].value)
    )
      throw Error(`unsupported registration ${id}`);
    values.set(entries[i].value, entries[i + 2]);
  }
  return values;
}
function local(factory, n) {
  if (n?.type !== "Identifier") return n;
  return exactlyOne(
    findNodes(
      factory.node,
      (d, parents) =>
        d.type === "VariableDeclarator" &&
        d.id.name === n.name &&
        !parents.some(
          (p) => p !== factory.node && /Function|Method/.test(p.type),
        ),
    ),
    `factory local ${n.name}`,
  ).init;
}
function imported(factory, id) {
  return exactlyOne(
    findNodes(
      factory.node,
      (n) =>
        n.type === "VariableDeclarator" &&
        n.init?.type === "CallExpression" &&
        ["i", "r"].some((m) => member(n.init.callee, factory.runtime, m)) &&
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
function assert(ok, label) {
  if (!ok) throw Error(label);
}

export async function extractProfileLookup(root) {
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
  const factories = new Map(),
    fragments = new Map();
  const get = async (id, selectedSource) => {
    const f = await corpus.factory(
      id,
      selectedSource ? { source: selectedSource } : {},
    );
    factories.set(`${id}:${f.provenance.sha256}`, f.provenance);
    return f;
  };
  const add = (f, node, label) => {
    assert(node, `missing ${label}`);
    const x = f.witness(node, label),
      key = `${x.source}:${x.utf16.join(":")}`;
    fragments.set(key, { ...x, text: f.text(node) });
    return key;
  };
  const variants = [];
  for (const [name, hash] of contexts) {
    const f = await get(528600, source(name));
    assert(f.provenance.sha256 === hash, "unreviewed user-client variant");
    const ex = exportsOf(f, 528600),
      aliasEx = exportsOf(f, 448341);
    const fetch = local(f, ex.get("e")),
      query = local(f, ex.get("C"));
    assert(
      fetch.async && query.type === "ArrowFunctionExpression",
      "user entry boundary changed",
    );
    const request = exactlyOne(
      findNodes(
        fetch,
        (n) =>
          n.type === "CallExpression" && n.arguments[0]?.value === operation,
      ),
      "actual user read request",
    );
    const ctor = request.callee;
    const httpImport = imported(f, 30181);
    assert(
      ctor.type === "CallExpression" &&
        calls(ctor, httpImport.id.name, "K").length === 1,
      "user read is not actual K",
    );
    const options = request.arguments[1];
    assert(
      options.properties[0].type === "SpreadElement" &&
        literal(objectProperty(options, "retry")) === 0,
      "fetch override/retry boundary changed",
    );
    assert(
      options.properties
        .map((p) => (p.type === "SpreadElement" ? "..." : propertyName(p.key)))
        .join(",") === "...,params,credentials,retry,hooks",
      "fetch option precedence changed",
    );
    const credentials = objectProperty(options, "credentials");
    assert(
      credentials.type === "LogicalExpression" &&
        credentials.operator === "??" &&
        literal(credentials.right) === "same-origin",
      "user credential fallback changed",
    );
    const hook = objectProperty(
      objectProperty(options, "hooks"),
      "afterResponse",
    );
    assert(
      hook.type === "ArrayExpression" &&
        hook.elements.length === 1 &&
        hook.elements[0].async,
      "user response guard changed",
    );
    const errorClass = exactlyOne(
      findNodes(
        f.node,
        (n) => n.type === "ClassDeclaration" && n.id.name === ex.get("M").name,
      ),
      "UserFetchError class",
    );
    assert(
      errorClass.superClass.name === "Error",
      "user error superclass changed",
    );
    const callback = exactlyOne(
      findNodes(query, (n) => n.type === "ArrowFunctionExpression" && n.async),
      "actual user query callback",
    );
    assert(
      callback.params.length === 0,
      "user query started accepting a query signal",
    );
    const usedFetch = exactlyOne(
      findNodes(
        callback,
        (n) =>
          n.type === "CallExpression" && n.callee.name === ex.get("e").name,
      ),
      "query invokes actual user fetch",
    );
    assert(
      usedFetch.arguments[0].properties
        .map((p) => propertyName(p.key))
        .join(",") === "clientServerUrl,userIdentifier",
      "query fetch inputs changed",
    );
    const policy = exactlyOne(
      findNodes(
        query,
        (n) =>
          n.type === "ObjectExpression" &&
          n.properties.some((p) => propertyName(p.key) === "queryKey"),
      ),
      "user query policy",
    );
    assert(
      policy.properties.at(-1).type === "SpreadElement" &&
        literal(objectProperty(policy, "refetchOnMount")) === false &&
        literal(objectProperty(policy, "refetchOnWindowFocus")) === false,
      "query override precedence/focus changed",
    );
    assert(
      objectProperty(policy, "retry").name === ex.get("B").name,
      "retry callback identity changed",
    );
    const cacheWrite = exactlyOne(
      findNodes(
        callback,
        (n) =>
          n.type === "CallExpression" &&
          propertyName(n.callee.property) === "setQueryData",
      ),
      "alias cache write",
    );
    assert(
      cacheWrite.arguments[1].body.operator === "??",
      "alias hydration no longer nullish-only",
    );
    const context = await get(136354, source(name));
    exactlyOne(
      calls(
        local(f, ex.get("U")),
        imported(f, 136354).id.name,
        "useUserConfig",
      ),
      "configured wrapper origin",
    );
    const retry = local(f, ex.get("B"));
    const retryBound = exactlyOne(
      findNodes(
        retry,
        (n) => n.type === "BinaryExpression" && n.operator === "<",
      ),
      "user query retry bound",
    );
    assert(literal(retryBound.right) === 3, "user query retry bound changed");
    const alias = local(f, aliasEx.get("i"));
    exactlyOne(
      calls(alias, imported(f, 786480).id.name, "f"),
      "actual alias UUID predicate",
    );
    variants.push({
      factory: f.provenance,
      fragments: {
        fullClient: add(
          f,
          f.node,
          "complete independently reviewed client variant",
        ),
        fetch: add(f, fetch, "e: request options and SyntaxError conversion"),
        responseGuard: add(
          f,
          hook.elements[0],
          "non-OK and cloned empty-body guard",
        ),
        error: add(f, errorClass, "M: typed user read failure"),
        missing: add(f, local(f, ex.get("g")), "g: typed not-found predicate"),
        clientError: add(
          f,
          local(f, ex.get("r")),
          "r: typed 400..499 predicate",
        ),
        retry: add(f, retry, "B: 4xx-aware failureCount<3 retry"),
        existence: add(
          f,
          local(f, ex.get("d")),
          "d: exists/missing/unknown projection",
        ),
        callback: add(
          f,
          callback,
          "C: fetch then warm missing aliases, no query signal",
        ),
        policy: add(f, policy, "C: caller queryOptions spread last"),
        key: add(
          f,
          local(f, aliasEx.get("B")),
          "448341.B: unpartitioned user key",
        ),
        aliases: add(
          f,
          alias,
          "448341.i: UUID suppression and ordered aliases",
        ),
        config: add(
          context,
          context.node,
          "136354: explicit configured origin, no URL default",
        ),
      },
    });
  }
  const uuid = await get(786480, source("1e479323ffe53c14"));
  const regex = exactlyOne(
    findNodes(uuid.node, (n) => n.type === "RegExpLiteral"),
    "UUID-address predicate",
  );
  assert(
    regex.pattern ===
      "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$" &&
      regex.flags === "i",
    "UUID-address predicate changed",
  );
  add(uuid, uuid.node, "actual UUID predicate; not a wallet validator");
  const http = await get(30181, source("01ad4f413e529b60"));
  const constructor = local(http, exportsOf(http, 30181).get("K"));
  exactlyOne(
    calls(constructor, imported(http, 402030).id.name, "createContractClient"),
    "K actual contract client",
  );
  add(
    http,
    constructor,
    "shared K constructor, prior source recovery credited",
  );
  add(
    http,
    local(http, exportsOf(http, 30181).get("d")),
    "shared prefixUrl and base HTTP defaults",
  );
  const barrel = await get(402030, contractSource);
  const catalog = exactlyOne(
    findNodes(
      barrel.node,
      (n) =>
        n.type === "SpreadElement" &&
        member(n.argument, imported(barrel, 941660).id.name, "usersRoutes"),
    ),
    "actual users catalog membership",
  );
  add(barrel, catalog, "actual usersRoutes catalog inclusion");
  const transport = await get(898661, contractSource);
  add(
    transport,
    transport.node,
    "shared JSON/error transport credited686/691, not reimplemented",
  );
  // One actual application provider context fixes the URL; other wrappers still
  // accept an explicit caller URL. This does not reconstruct authentication.
  const provider = await get(589428, source("9bafadffbe6dc98b"));
  const providerImport = imported(provider, 136354);
  const mount = exactlyOne(
    findNodes(
      provider.node,
      (n) =>
        n.type === "CallExpression" &&
        n.arguments[0]?.type === "MemberExpression" &&
        member(n.arguments[0], providerImport.id.name, "UserConfigProvider"),
    ),
    "actual user-config provider mount",
  );
  const urlName = objectProperty(mount.arguments[1], "clientServerUrl").name;
  const originImport = imported(provider, 503630);
  const originAssignment = exactlyOne(
    findNodes(
      provider.node,
      (n) =>
        n.type === "AssignmentExpression" &&
        n.left.name === urlName &&
        calls(n.right, originImport.id.name, "R").length === 1,
    ),
    "actual provider URL assignment",
  );
  add(
    provider,
    mount.arguments[1].properties.find(
      (p) => propertyName(p.key) === "clientServerUrl",
    ),
    "provider forwards configured URL",
  );
  add(provider, originAssignment, "actual provider URL comes from503630.R");
  const origin = await get(503630, source("1e479323ffe53c14"));
  const originFn = exportsOf(origin, 503630).get("R");
  assert(
    originFn.body.value === "https://frontend-api-v3.pump.fun",
    "configured website origin changed",
  );
  add(
    origin,
    originFn,
    "captured provider website URL, not a runtime fallback",
  );
  const consumers = [];
  for (const entry of corpus.index.modules.filter((x) =>
    x.ids.includes(154121),
  )) {
    const f = await get(154121, entry.origins[0].source);
    const used = exactlyOne(
      calls(f.node, imported(f, 528600).id.name, "U"),
      "actual profile-presentation U consumer",
    );
    consumers.push({
      factory: f.provenance,
      call: add(f, used, "154121.f invokes actual configured U"),
      source: add(
        f,
        f.node,
        "complete profile-presentation caller; rendering/verification helpers remain external",
      ),
    });
  }
  const extractor = createSchemaExtractor(corpus, {
    sources: { 941660: contractSource },
  });
  const declaration = await extractor.declaration(941660, "usersRoutes");
  const wrapped = objectProperty(declaration.node.arguments[0], operation);
  assert(
    literal(wrapped.arguments[0]) === "profiles.read",
    "declared user scope changed",
  );
  const route = wrapped.arguments[1];
  const params = await extractor.compile(
    objectProperty(route, "params"),
    declaration.factory,
  );
  const response = await extractor.compile(
    objectProperty(route, "response"),
    declaration.factory,
  );
  add(
    declaration.factory,
    wrapped,
    "existing publicRead/profiles.read declaration, not client enforcement",
  );
  for (const x of extractor.witnesses()) {
    if (
      x.label === "declaration 941660.usersRoutes" ||
      x.label.startsWith("factory ")
    )
      continue;
    const capture = await corpus.capture(x.source),
      key = `${x.source}:${x.utf16.join(":")}`;
    fragments.set(key, { ...x, text: capture.text.slice(...x.utf16) });
  }
  return {
    schemaVersion: 1,
    authority: "Authenticated captured AST; no original factory is evaluated",
    frozenInputs: corpus.anchors,
    implementation: {
      path: "reconstruction/profile-lookup/client.mjs",
      sha256: sha256(
        await fs.readFile(
          path.join(root, "reconstruction/profile-lookup/client.mjs"),
        ),
      ),
    },
    operation,
    variants,
    consumers,
    request: {
      origin:
        "Explicit clientServerUrl, with one captured application provider resolving503630.R=https://frontend-api-v3.pump.fun",
      credentials:
        "fetchOptions.credentials??same-origin overrides K's include base default",
      retry: 0,
      hooks: "Replaces caller hooks with the single typed afterResponse guard",
      response: "Raw JSON: no DTO parsing/normalization",
      signal:
        "Direct fetchOptions.signal forwarded; C query callback does not consume query-runtime signal",
    },
    cache: {
      key: ["user", "raw identifier"],
      viewerPartitioned: false,
      aliasOrder: ["userId", "address", "username"],
      aliases:
        "UUID-shaped address suppresses all; otherwise truthy aliases unequal to requested identifier, no deduplication",
      update:
        "current??fetchedUser; existing false/0/empty string objects preserved",
      queryOverrides:
        "Caller queryOptions spread last, including enabled/key/function/retry overrides",
    },
    declarations: extractor.document({
      "x-profile-lookup": {
        params,
        response,
        scope: "profiles.read",
        wrapper: "publicRead",
      },
    }),
    factories: [...factories.values()],
    fragments: [...fragments.values()],
    limits: [
      "Reconstructs read/query/cache boundaries only, not the React Compiler memo-slot layout, React provider tree, query scheduling or a rendered UI",
      "154121 callers are actual registered consumers; no runtime variant winner or full route reachability is inferred",
      "Constructor/cache are required injected capabilities; no session, authorization, cookie jar or production network default is created",
      "Existing profiles.read declaration is not enforced by this captured raw-JSON client; shared K/contract transport is prior recovery, not new scope",
      "Unpartitioned user keys and caller override precedence are preserved without a privacy or backend authorization claim",
      "No server, mutation, production request, native API implementation, compatibility or feature-ledger credit",
    ],
  };
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const mode = process.argv[2];
  if (process.argv.length !== 3 || !["--write", "--check"].includes(mode))
    throw Error("usage: original-profile-lookup.mjs --write|--check");
  const root = fileURLToPath(new URL("..", import.meta.url));
  const target = path.join(root, "reconstruction/profile-lookup/contract.json");
  const value =
    JSON.stringify(await extractProfileLookup(root), null, 2) + "\n";
  if (mode === "--check") {
    if ((await fs.readFile(target, "utf8")) !== value)
      throw Error("profile-lookup artifact changed");
  } else await fs.writeFile(target, value);
  console.log(
    `${mode === "--check" ? "Verified" : "Wrote"} original profile-lookup workflow`,
  );
}
