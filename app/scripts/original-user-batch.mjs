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
const operation = "POST /users/batch";
function assert(ok, label) {
  if (!ok) throw Error(label);
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
    `actual export ${id}`,
  );
  const values = n.arguments[0].elements,
    out = new Map();
  for (let i = 0; i < values.length; i += 3) {
    assert(
      values[i]?.type === "StringLiteral" &&
        values[i + 1]?.value === 0 &&
        !out.has(values[i].value),
      `unsupported exports ${id}`,
    );
    out.set(values[i].value, values[i + 2]);
  }
  return out;
}
function local(f, n) {
  if (n?.type !== "Identifier") return n;
  const found = exactlyOne(
    findNodes(
      f.node,
      (d, parents) =>
        ((d.type === "FunctionDeclaration" && d.id.name === n.name) ||
          (d.type === "VariableDeclarator" && d.id.name === n.name)) &&
        !parents.some((p) => p !== f.node && /Function|Method/.test(p.type)),
    ),
    `local ${n.name}`,
  );
  return found.type === "FunctionDeclaration" ? found : found.init;
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
export async function extractUserBatch(root) {
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
  const get = async (id, selected) => {
    const f = await corpus.factory(id, selected ? { source: selected } : {});
    factories.set(
      `${id}:${f.provenance.source}:${f.provenance.sha256}`,
      f.provenance,
    );
    return f;
  };
  const add = (f, n, label) => {
    assert(n, `missing ${label}`);
    const x = f.witness(n, label),
      key = `${x.source}:${x.utf16.join(":")}`;
    fragments.set(key, { ...x, text: f.text(n) });
    return key;
  };
  const f = await get(544930, source("020facfab961bf67"));
  assert(
    f.provenance.sha256 ===
      "aa22afc498c4a8e70e5e26788ba7bb5875b179ec5441203f42a12cbb675cf0d9",
    "unreviewed strict batch variant",
  );
  const ex = exportsOf(f, 544930),
    batch = local(f, ex.get("u"));
  assert(literal(ex.get("p")) === 100, "batch limit changed");
  const request = exactlyOne(
    findNodes(
      f.node,
      (n) => n.type === "CallExpression" && n.arguments[0]?.value === operation,
    ),
    "strict batch request",
  );
  assert(
    calls(request.callee, imported(f, 759257).id.name, "j").length === 1,
    "strict batch no longer calls j",
  );
  const options = request.arguments[1];
  assert(
    options.properties
      .map((p) => (p.type === "SpreadElement" ? "..." : propertyName(p.key)))
      .join(",") === "body,headers,...,throwHttpErrors,parseJson,hooks",
    "strict batch override precedence changed",
  );
  assert(
    literal(objectProperty(options, "throwHttpErrors")) === false,
    "strict batch HTTP behavior changed",
  );
  const parser = local(f, objectProperty(options, "parseJson")),
    hook = objectProperty(objectProperty(options, "hooks"), "afterResponse")
      .elements[0];
  const errorImport = imported(f, 528600);
  assert(
    findNodes(
      parser,
      (n) =>
        n.type === "NewExpression" &&
        member(n.callee, errorImport.id.name, "M"),
    ).length === 3,
    "strict parser no longer uses shared error class",
  );
  assert(
    findNodes(
      hook,
      (n) =>
        n.type === "NewExpression" &&
        member(n.callee, errorImport.id.name, "M"),
    ).length === 2,
    "strict hook no longer uses shared error class",
  );
  exactlyOne(
    calls(batch, "Promise", "all"),
    "batch chunks start under Promise.all",
  );
  const ranges = {
    helper: add(
      f,
      batch,
      "544930.u: <=100 direct request, otherwise concurrent chunks and ordered flatten",
    ),
    request: add(
      f,
      request,
      "strict batch request with caller options spread before forced parser/error/hook",
    ),
    parser: add(f, parser, "strict empty/JSON/shape parser"),
    hook: add(f, hook, "typed HTTP and cloned empty body guard"),
    errorImport: add(
      f,
      errorImport.init,
      "actual528600 shared error dependency, credited870",
    ),
  };
  const client = await get(759257, source("1e479323ffe53c14"));
  add(
    client,
    exportsOf(client, 759257).get("j"),
    "existing website client/defaults credited686",
  );
  const origin = await get(503630, source("1e479323ffe53c14"));
  const url = exportsOf(origin, 503630).get("R");
  assert(
    url.body.value === "https://frontend-api-v3.pump.fun",
    "strict batch origin changed",
  );
  exactlyOne(
    calls(
      exportsOf(client, 759257).get("j"),
      imported(client, 503630).id.name,
      "R",
    ),
    "j actual origin",
  );
  add(origin, url, "website service URL");
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
          member(n.argument, imported(barrel, 941660).id.name, "usersRoutes"),
      ),
      "usersRoutes catalog inclusion",
    ),
    "existing route catalog membership",
  );
  const transport = await get(898661, source("2b47dd0b38a1608f"));
  add(
    transport,
    transport.node,
    "existing JSON/error pipeline credited686/691",
  );
  const prerequisitePath = "reconstruction/profile-lookup/client.mjs";
  assert(
    sha256(await fs.readFile(path.join(root, prerequisitePath))) ===
      "e8039acc986f36dc614f976c348032644a7ed4d7115f75091142a091a8c98b52",
    "unreviewed870 prerequisite implementation",
  );
  const consumers = [];
  for (const id of [576766, 795663])
    for (const entry of corpus.index.modules.filter((x) => x.ids.includes(id)))
      for (const origin of entry.origins) {
        const consumer = await get(id, origin.source),
          call = exactlyOne(
            calls(consumer.node, imported(consumer, 544930).id.name, "u"),
            `actual batch consumer${id}`,
          );
        consumers.push({
          module: id,
          factory: consumer.provenance,
          invocation: add(
            consumer,
            call,
            `actual${id} batch read consumer; surrounding query/wallet behavior not reconstructed`,
          ),
        });
      }
  const extractor = createSchemaExtractor(corpus, {
    sources: { 941660: source("2b47dd0b38a1608f") },
  });
  const declared = await extractor.declaration(941660, "usersRoutes"),
    wrapped = objectProperty(declared.node.arguments[0], operation);
  assert(
    literal(wrapped.arguments[0]) === "profiles.read",
    "strict batch declared scope changed",
  );
  const route = wrapped.arguments[1],
    fields = {};
  for (const name of ["body", "response"])
    fields[name] = await extractor.compile(
      objectProperty(route, name),
      declared.factory,
    );
  add(
    declared.factory,
    wrapped,
    "existing publicRead batch declaration, not a mutation or client validation",
  );
  for (const x of extractor.witnesses()) {
    if (
      x.label.startsWith("factory ") ||
      x.label === "declaration 941660.usersRoutes"
    )
      continue;
    const c = await corpus.capture(x.source),
      key = `${x.source}:${x.utf16.join(":")}`;
    fragments.set(key, { ...x, text: c.text.slice(...x.utf16) });
  }
  return {
    schemaVersion: 1,
    authority: "Authenticated source AST; captured JS never evaluated",
    frozenInputs: corpus.anchors,
    implementation: {
      path: "reconstruction/user-batch/client.mjs",
      sha256: sha256(
        await fs.readFile(
          path.join(root, "reconstruction/user-batch/client.mjs"),
        ),
      ),
    },
    prerequisite: {
      pullRequest: 870,
      publicHead: "e46c14ea3857da7ef6eecc9f7945622f5dbcfc39",
      path: prerequisitePath,
      sha256: sha256(await fs.readFile(path.join(root, prerequisitePath))),
      novelCredit: false,
    },
    operation,
    entry: { module: 544930, export: "u", factory: f.provenance, ranges },
    consumers,
    policy: {
      chunkSize: 100,
      empty: "Still issues one request with addresses:[]",
      deduplication: false,
      concurrency:
        "Chunks issued together; Promise.all preserves chunk order; failure rejects whole result without cancelling siblings",
      fetchOptions:
        "Caller can replace body/headers and other base options; parser/throwHttpErrors/hooks forced afterward",
      parser:
        "Bare array or object.users array accepted without row validation; blank/invalidJSON/other shape typed distinctly",
      http: "All non-OK statuses including404 are http_error; successful cloned blank body is empty_body",
      credentials:
        "No explicit override in strict helper; inherits website j unless caller supplies fetchOptions.credentials",
    },
    declarations: extractor.document({
      "x-user-batch": {
        scope: "profiles.read",
        wrapper: "publicRead",
        ...fields,
      },
    }),
    factories: [...factories.values()],
    fragments: [...fragments.values()],
    limits: [
      "Requires exact870 shared UserFetchError dependency; zero new recovery credit for inherited870 files",
      "Actual576766/795663 consumers are source-bound, but surrounding query-cache/alias/wallet-mapping logic is not implemented",
      "Separate782067 lax50ms microbatch resolver is excluded; strict544930 semantics must not be applied to it",
      "Required transport must execute response hooks and parseJson override; Ky/query runtime/browser cookies remain external",
      "POST is an existing declared read operation; no production POST or mutation is performed",
      "No server/auth/UI mount/ledger/compatibility credit; declarations are not runtime DTO validation",
    ],
  };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const mode = process.argv[2];
  if (process.argv.length !== 3 || !["--write", "--check"].includes(mode))
    throw Error("usage: original-user-batch.mjs --write|--check");
  const root = fileURLToPath(new URL("..", import.meta.url)),
    target = path.join(root, "reconstruction/user-batch/contract.json"),
    value = JSON.stringify(await extractUserBatch(root), null, 2) + "\n";
  if (mode === "--check") {
    if ((await fs.readFile(target, "utf8")) !== value)
      throw Error("strict user-batch artifact changed");
  } else await fs.writeFile(target, value);
  console.log(
    `${mode === "--check" ? "Verified" : "Wrote"} original strict user-batch read`,
  );
}
