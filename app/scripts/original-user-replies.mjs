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
const operation = "GET /callout/replies/list/{userId}";
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
    `registration ${id}`,
  );
  const values = n.arguments[0].elements,
    result = new Map();
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
    `import ${id}`,
  );
}
function local(f, n) {
  if (n?.type !== "Identifier") return n;
  const found = exactlyOne(
    findNodes(
      f.node,
      (d, parents) =>
        ((d.type === "VariableDeclarator" && d.id.name === n.name) ||
          (d.type === "FunctionDeclaration" && d.id.name === n.name)) &&
        !parents.some((p) => p !== f.node && /Function|Method/.test(p.type)),
    ),
    `factory local ${n.name}`,
  );
  return found.type === "VariableDeclarator" ? found.init : found;
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
export async function extractUserReplies(root) {
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
  const f = await get(287129, source("84bc29ea82bc5a21"));
  assert(
    f.provenance.sha256 ===
      "75ce27324808ccd2b5cba5c591747c4c99cfdf42bc43ebdf06b5253c54a29ecb",
    "unreviewed user-reply variant",
  );
  const exports = exportsOf(f, 287129),
    queryExports = exportsOf(f, 546803);
  const read = local(f, exports.get("v")),
    mapRow = local(f, exports.get("j")),
    mapCallout = local(f, exports.get("m"));
  assert(
    literal(exports.get("y")) === 30 && read.async,
    "user-reply read/default changed",
  );
  const request = exactlyOne(
    findNodes(
      read,
      (n) => n.type === "CallExpression" && n.arguments[0]?.value === operation,
    ),
    "actual user-reply request",
  );
  assert(
    calls(request.callee, imported(f, 759257).id.name, "j").length === 1,
    "user-reply request no longer uses j",
  );
  const opts = request.arguments[1];
  assert(
    literal(objectProperty(opts, "credentials")) === "include",
    "user-reply credentials changed",
  );
  const query = objectProperty(opts, "query");
  assert(
    query.properties.map((p) => propertyName(p.key)).join(",") ===
      "limit,beforeId,includeMembers",
    "user-reply query shape changed",
  );
  for (const name of ["beforeId", "includeMembers"])
    assert(
      objectProperty(query, name).operator === "||",
      `user-reply ${name} truthiness changed`,
    );
  const hooks = objectProperty(objectProperty(opts, "hooks"), "afterResponse");
  assert(hooks.elements.length === 1, "user-reply hooks changed");
  const responseHook = hooks.elements[0];
  const replacement = exactlyOne(
    calls(responseHook, "Response", "json"),
    "404 replacement Response.json",
  );
  assert(
    objectProperty(replacement.arguments[0], "replies").elements.length === 0,
    "404 replacement no longer empty",
  );
  const predicate = exactlyOne(
    findNodes(
      read,
      (n) =>
        n.type === "ObjectExpression" &&
        n.properties.some((p) => propertyName(p.key) === "nextBeforeId"),
    ),
    "user-reply returned page",
  );
  assert(
    objectProperty(predicate, "hasMore").operator === ">=",
    "user-reply continuation boundary changed",
  );
  const queryHook = queryExports.get("r");
  const callback = exactlyOne(
    findNodes(
      queryHook,
      (n) => n.type === "ArrowFunctionExpression" && n.async,
    ),
    "user-reply query callback",
  );
  const usedRead = exactlyOne(
    findNodes(
      callback,
      (n) =>
        n.type === "CallExpression" && n.callee.name === exports.get("v").name,
    ),
    "query consumes actual read export",
  );
  assert(
    usedRead.arguments[0].properties
      .map((p) => propertyName(p.key))
      .join(",") === "userId,limit,beforeId,includeMembers,signal",
    "query read arguments changed",
  );
  const policy = exactlyOne(
    findNodes(
      queryHook,
      (n) =>
        n.type === "ObjectExpression" &&
        n.properties.some((p) => propertyName(p.key) === "initialPageParam"),
    ),
    "user-reply query policy",
  );
  assert(
    literal(objectProperty(policy, "staleTime")) === 60000 &&
      literal(objectProperty(policy, "gcTime")) === 300000 &&
      literal(objectProperty(policy, "refetchOnWindowFocus")) === false,
    "user-reply query defaults changed",
  );
  const mapReplyBinding = exactlyOne(
    findNodes(
      mapRow,
      (n) =>
        n.type === "ObjectProperty" &&
        propertyName(n.key) === "reply" &&
        n.value.type === "CallExpression",
    ),
    "row maps actual reply",
  ).value.callee;
  const mapReply = local(f, mapReplyBinding);
  const dateCall = exactlyOne(
    findNodes(
      mapReply,
      (n) => n.type === "ObjectProperty" && propertyName(n.key) === "createdAt",
    ),
    "reply date normalization",
  ).value;
  const select = local(f, objectProperty(policy, "select"));
  const flatten = exactlyOne(
    findNodes(
      select,
      (n) =>
        n.type === "CallExpression" &&
        propertyName(n.callee.property) === "flatMap",
    ),
    "page flatten call",
  );
  const key = exactlyOne(
    findNodes(
      queryHook,
      (n) =>
        n.type === "ArrayExpression" && n.elements[0]?.type === "SpreadElement",
    ),
    "user-reply query key tuple",
  );
  assert(
    key.elements.length === 4 &&
      key.elements[0].argument.name === queryExports.get("v").name,
    "user-reply query key shape changed",
  );
  const ranges = {
    read: add(f, read, "287129.v: original reply-list request and page result"),
    request: add(
      f,
      request,
      "actual include-credentials read and cursor query",
    ),
    responseHook: add(
      f,
      responseHook,
      "404 Response replacement before normal HTTP/JSON behavior",
    ),
    row: add(
      f,
      mapRow,
      "287129.j: reply/parent/tombstone/callout normalization",
    ),
    reply: add(
      f,
      mapReply,
      "inner reply author/identity/timestamp/default mapping",
    ),
    timestamp: add(
      f,
      local(f, dateCall.callee),
      "Date.parse then finite-or-zero; host date parser remains external",
    ),
    callout: add(f, mapCallout, "287129.m: nested callout context mapping"),
    preview: add(
      f,
      exports.get("g"),
      "287129.g: parent-first/deleted context preview",
    ),
    callback: add(
      f,
      callback,
      "546803.r: required userId and pageParam/signal forwarding",
    ),
    policy: add(f, policy, "actual infinite-query policy; runtime external"),
    nextPage: add(
      f,
      local(f, objectProperty(policy, "getNextPageParam")),
      "continuation requires hasMore plus truthy nextBeforeId",
    ),
    select: add(f, select, "pages flatten in order without deduplication"),
    flattenRows: add(
      f,
      local(f, flatten.arguments[0]),
      "actual per-page rows selector",
    ),
    queryKey: add(f, key, "actual user/limit/includeMembers cache tuple"),
    prefix: add(
      f,
      local(f, queryExports.get("v")),
      "callouts/user-replies cache prefix",
    ),
  };
  const consumers = [];
  for (const [id, names] of [
    [349919, ["g"]],
    [16503, ["j", "m"]],
  ]) {
    const entries = corpus.index.modules.filter((x) => x.ids.includes(id));
    assert(entries.length === 1, `ambiguous mapper consumer ${id}`);
    const consumer = await get(id, entries[0].origins[0].source);
    const importedAlias = imported(consumer, 287129).id.name;
    consumers.push({
      module: id,
      factory: consumer.provenance,
      invocations: names.map((name) =>
        add(
          consumer,
          exactlyOne(
            calls(consumer.node, importedAlias, name),
            `actual consumer${id}.${name}`,
          ),
          `actual${id} invokes287129.${name}`,
        ),
      ),
    });
  }
  const client = await get(759257, source("1e479323ffe53c14"));
  add(
    client,
    exportsOf(client, 759257).get("j"),
    "shared j constructor/defaults credited686",
  );
  const origin = await get(503630, source("1e479323ffe53c14"));
  const url = exportsOf(origin, 503630).get("R");
  assert(
    url.body.value === "https://frontend-api-v3.pump.fun",
    "user-reply service origin changed",
  );
  exactlyOne(
    calls(
      exportsOf(client, 759257).get("j"),
      imported(client, 503630).id.name,
      "R",
    ),
    "j actual website URL",
  );
  add(origin, url, "website service URL");
  const http = await get(30181, source("01ad4f413e529b60"));
  const ctor = exportsOf(http, 30181).get("K");
  exactlyOne(
    calls(ctor, imported(http, 402030).id.name, "createContractClient"),
    "K actual shared contract client",
  );
  add(http, ctor, "shared K contract constructor");
  const barrel = await get(402030, source("2b47dd0b38a1608f"));
  add(
    barrel,
    exactlyOne(
      findNodes(
        barrel.node,
        (n) =>
          n.type === "SpreadElement" &&
          member(n.argument, imported(barrel, 957263).id.name, "calloutRoutes"),
      ),
      "calloutRoutes actual catalog inclusion",
    ),
    "callout route catalog membership",
  );
  const transport = await get(898661, source("2b47dd0b38a1608f"));
  add(
    transport,
    transport.node,
    "existing shared JSON/error catch pipeline credited686/691",
  );
  const extractor = createSchemaExtractor(corpus, {
    sources: { 957263: source("2b47dd0b38a1608f") },
  });
  const declared = await extractor.declaration(957263, "calloutRoutes"),
    wrapped = objectProperty(declared.node.arguments[0], operation);
  assert(
    literal(wrapped.arguments[0]) === "content.read",
    "declared user-reply scope changed",
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
    "existing content.read declaration, not runtime client validation",
  );
  for (const x of extractor.witnesses()) {
    if (
      x.label.startsWith("factory ") ||
      x.label === "declaration 957263.calloutRoutes"
    )
      continue;
    const c = await corpus.capture(x.source),
      key = `${x.source}:${x.utf16.join(":")}`;
    fragments.set(key, { ...x, text: c.text.slice(...x.utf16) });
  }
  return {
    schemaVersion: 1,
    authority: "Authenticated captured AST; no original JS evaluated",
    frozenInputs: corpus.anchors,
    implementation: {
      path: "reconstruction/user-replies/client.mjs",
      sha256: sha256(
        await fs.readFile(
          path.join(root, "reconstruction/user-replies/client.mjs"),
        ),
      ),
    },
    operation,
    entry: {
      readModule: 287129,
      readExport: "v",
      queryModule: 546803,
      queryExport: "r",
      factory: f.provenance,
      ranges,
    },
    consumers,
    policy: {
      limitDefault: 30,
      beforeId: "falsy values omitted; otherwise raw cursor",
      includeMembers: "false omitted, truthy value repeated every page",
      filter:
        "not sent by this read client; declared ALL/REPLIES/QUOTES option remains separate",
      credentials: "include",
      response:
        "404 becomes a fresh200 Response with replies:[]; other non-OK status throws plain Error; otherwise raw replies??[] map",
      continuation:
        "last raw row.reply.id; hasMore uses raw row count>=limit; next page requires truthy cursor",
      query:
        "callouts/user-replies/userId??null/limit/includeMembers; no viewer partition; enabled default plus truthy userId; query callback forwards pageParam/signal; no deduplication",
    },
    declarations: extractor.document({
      "x-user-replies": {
        scope: "content.read",
        wrapper: "publicRead",
        ...fields,
      },
    }),
    factories: [...factories.values()],
    fragments: [...fragments.values()],
    limits: [
      "287129 mapper/preview has actual captured importers; no importing546803 infinite-query UI caller was found, so no rendered workflow/reachability claim",
      "The shared physical factory also registers236315 mutation behavior; it is excluded from this adapter and read fragments",
      "Required transport implements response-hook replacement/error ordering; query runtime, cookie sessions and Ky retries/timeout remain external",
      "Date.parse behavior is the host JS parser; no extra timestamp grammar/normalization is invented",
      "Declared DTOs are not invoked by the captured raw-JSON read; malformed non-array replies and invalid row shapes retain their source failures",
      "No server, mutation, production request, auth/provider, UI mount, ledger milestone or API compatibility qualification",
    ],
  };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const mode = process.argv[2];
  if (process.argv.length !== 3 || !["--write", "--check"].includes(mode))
    throw Error("usage: original-user-replies.mjs --write|--check");
  const root = fileURLToPath(new URL("..", import.meta.url)),
    target = path.join(root, "reconstruction/user-replies/contract.json"),
    value = JSON.stringify(await extractUserReplies(root), null, 2) + "\n";
  if (mode === "--check") {
    if ((await fs.readFile(target, "utf8")) !== value)
      throw Error("user-replies artifact changed");
  } else await fs.writeFile(target, value);
  console.log(
    `${mode === "--check" ? "Verified" : "Wrote"} original user-replies read workflow`,
  );
}
