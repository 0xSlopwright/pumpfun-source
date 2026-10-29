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
    `import ${id}`,
  );
}
function exportsOf(f, id) {
  const call = exactlyOne(
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
  const values = call.arguments[0].elements,
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
function local(f, n) {
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
export async function extractProfileCoalescer(root) {
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
  const variants = [],
    entries = corpus.index.modules.filter((x) => x.ids.includes(782067));
  assert(
    entries.length === 11 && entries.every((x) => x.origins.length === 1),
    "profile coalescer variant cohort changed",
  );
  for (const entry of entries) {
    const f = await get(782067, entry.origins[0].source),
      ex = exportsOf(f, 782067);
    const direct = local(f, ex.get("H")),
      query = ex.get("T");
    const request = exactlyOne(
      findNodes(
        direct,
        (n) =>
          n.type === "CallExpression" &&
          n.arguments[0]?.value === "POST /users/batch",
      ),
      "actual lax batch request",
    );
    assert(
      calls(request.callee, imported(f, 30181).id.name, "K").length === 1,
      "lax batch not actual K",
    );
    const opts = request.arguments[1];
    assert(
      literal(objectProperty(opts, "credentials")) === "same-origin",
      "lax batch credentials changed",
    );
    const parser = objectProperty(opts, "parseJson");
    assert(
      findNodes(parser, (n) => n.type === "TryStatement").length === 0,
      "lax parser no longer propagates native JSON failure",
    );
    const callback = exactlyOne(
      findNodes(query, (n) => n.type === "ArrowFunctionExpression" && n.async),
      "coalesced query callback",
    );
    assert(
      callback.params.length === 0,
      "coalesced callback started consuming runtime signal",
    );
    const resolver = exactlyOne(
      findNodes(
        callback,
        (n) =>
          n.type === "CallExpression" &&
          n.callee.type === "ArrowFunctionExpression" &&
          n.callee.body.type === "BlockStatement" &&
          findNodes(
            n.callee,
            (child) =>
              child.type === "CallExpression" &&
              child.callee.name === "setTimeout",
          ).length === 1,
      ),
      "actual per-origin resolver factory",
    );
    const timer = exactlyOne(
      findNodes(
        resolver.callee,
        (n) => n.type === "CallExpression" && n.callee.name === "setTimeout",
      ),
      "50ms source timer",
    );
    assert(literal(timer.arguments[1]) === 50, "coalescing interval changed");
    const boundaries = findNodes(
      resolver.callee,
      (n) => n.type === "NumericLiteral" && n.value === 100,
    );
    assert(boundaries.length === 2, "coalescing chunk boundary changed");
    assert(
      findNodes(
        resolver.callee,
        (n) =>
          n.type === "CallExpression" && n.callee.name === ex.get("H").name,
      ).length === 1,
      "flush does not consume actual lax helper",
    );
    const policy = exactlyOne(
      findNodes(
        query,
        (n) =>
          n.type === "ObjectExpression" &&
          n.properties.some(
            (p) => propertyName(p.key) === "initialDataUpdatedAt",
          ),
      ),
      "coalesced query policy",
    );
    assert(
      literal(objectProperty(policy, "staleTime")) === 300000,
      "profile stale time changed",
    );
    const retry = local(f, objectProperty(policy, "retry"));
    const retryBound = exactlyOne(
      findNodes(
        retry,
        (n) =>
          n.type === "BinaryExpression" &&
          n.operator === "<" &&
          n.right?.value === 1,
      ),
      "profile query retry count",
    );
    assert(literal(retryBound.right) === 1, "profile retry count changed");
    const aliasImport = imported(f, 448341);
    exactlyOne(
      calls(callback, aliasImport.id.name, "i"),
      "coalesced query uses actual aliases",
    );
    exactlyOne(
      calls(callback, aliasImport.id.name, "B"),
      "coalesced query uses actual user cache key",
    );
    const origin = exactlyOne(
      findNodes(
        f.node,
        (n, parents) =>
          n.type === "VariableDeclarator" &&
          findNodes(
            n.init,
            (x) =>
              x.type === "StringLiteral" &&
              x.value === "https://frontend-api-v3.pump.fun",
          ).length === 2 &&
          !parents.some((p) => p !== f.node && /Function|Method/.test(p.type)),
      ),
      "actual fixed query URL",
    );
    assert(
      resolver.arguments[0].name === origin.id.name,
      "query resolver URL no longer actual origin",
    );
    const index = local(f, ex.get("V"));
    variants.push({
      factory: f.provenance,
      ranges: {
        direct: add(
          f,
          direct,
          "782067.H: dedupe/filter, empty skip and lax batch read",
        ),
        parser: add(f, parser, "native JSON parse; invalid shape empty array"),
        responseHook: add(
          f,
          objectProperty(objectProperty(opts, "hooks"), "afterResponse")
            .elements[0],
          "404 not_found / other HTTP typed error",
        ),
        resolver: add(
          f,
          resolver.callee,
          "per-origin50ms pending waiters and independent100-key flushes",
        ),
        callback: add(
          f,
          callback,
          "coalesced profile read and user-cache alias hydration",
        ),
        policy: add(
          f,
          policy,
          "initial user-cache data/timestamps, enablement, stale/retry",
        ),
        index: add(f, index, "V: address and userId last-row-wins indexing"),
        key: add(f, local(f, ex.get("J")), "J: user-profile-batch key"),
        retry: add(f, retry, "typed4xx stop; count<1 otherwise"),
        origin: add(
          f,
          origin,
          "query's fixed website origin, never a local fallback",
        ),
      },
    });
  }
  const consumers = [];
  for (const id of [779897, 300983, 238128])
    for (const entry of corpus.index.modules.filter((x) => x.ids.includes(id)))
      for (const origin of entry.origins) {
        const f = await get(id, origin.source),
          names = id === 300983 ? ["H", "V"] : ["T"],
          used = names.flatMap((name) =>
            calls(f.node, imported(f, 782067).id.name, name),
          );
        assert(
          used.length >= names.length,
          `missing actual profile caller${id}`,
        );
        consumers.push({
          module: id,
          factory: f.provenance,
          invocations: used.map((n) =>
            add(
              f,
              n,
              `actual${id} calls782067 export; surrounding UI not reconstructed`,
            ),
          ),
        });
      }
  const http = await get(30181, source("01ad4f413e529b60")),
    ctor = exportsOf(http, 30181).get("K");
  exactlyOne(
    calls(ctor, imported(http, 402030).id.name, "createContractClient"),
    "K actual contract client",
  );
  add(http, ctor, "existing K constructor credited686");
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
      "actual users catalog",
    ),
    "existing users route inclusion",
  );
  const transport = await get(898661, source("2b47dd0b38a1608f"));
  add(
    transport,
    transport.node,
    "existing JSON/error transport credited686/691",
  );
  const prerequisitePath = "reconstruction/profile-lookup/client.mjs",
    prerequisiteHash = sha256(
      await fs.readFile(path.join(root, prerequisitePath)),
    );
  assert(
    prerequisiteHash ===
      "e8039acc986f36dc614f976c348032644a7ed4d7115f75091142a091a8c98b52",
    "unreviewed870 error/key/alias dependency",
  );
  const extractor = createSchemaExtractor(corpus, {
    sources: { 941660: source("2b47dd0b38a1608f") },
  });
  const declaration = await extractor.declaration(941660, "usersRoutes"),
    wrapped = objectProperty(
      declaration.node.arguments[0],
      "POST /users/batch",
    ),
    route = wrapped.arguments[1];
  assert(
    literal(wrapped.arguments[0]) === "profiles.read",
    "declared batch read scope changed",
  );
  const fields = {};
  for (const name of ["body", "response"])
    fields[name] = await extractor.compile(
      objectProperty(route, name),
      declaration.factory,
    );
  add(
    declaration.factory,
    wrapped,
    "existing batch-read declaration, not raw profile parsing",
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
    authority: "Authenticated AST; original JS never evaluated",
    frozenInputs: corpus.anchors,
    implementation: {
      path: "reconstruction/profile-coalescer/client.mjs",
      sha256: sha256(
        await fs.readFile(
          path.join(root, "reconstruction/profile-coalescer/client.mjs"),
        ),
      ),
    },
    prerequisite: {
      pullRequest: 870,
      publicHead: "e46c14ea3857da7ef6eecc9f7945622f5dbcfc39",
      path: prerequisitePath,
      sha256: prerequisiteHash,
      novelCredit: false,
    },
    variants,
    consumers,
    declarations: extractor.document({
      "x-coalesced-profile-read": { scope: "profiles.read", ...fields },
    }),
    factories: [...factories.values()],
    fragments: [...fragments.values()],
    policy: {
      delayMs: 50,
      chunkSize: 100,
      origin: "https://frontend-api-v3.pump.fun",
      result:
        "Null for missing identifier; address/userId last-row-wins index, never username",
      pending:
        "Duplicate identifier shares request but retains every waiter; flush snapshots/reset queue before requests; chunks fail independently",
      direct:
        "Dedupe/filter truthy; skip empty; same-origin credential; native JSON failure; invalid JSON shape returns[]",
      hydration:
        "Truthy address plus existing448341 aliases; current??profile; UUID address still hydrates its own key",
      query:
        "user-profile-batch/address??empty; user-cache initialData/dataUpdatedAt;300s stale; typed4xx blocked andcount<1 otherwise; no runtime signal",
    },
    limits: [
      "Exact870 error/key/alias helpers are prerequisite, zero new credit; strict544930/#901 is not used or copied",
      "One reader instance represents one original module context; host must reuse it and supply actual timer/HTTP/cache capabilities",
      "TanStack scheduling/hashing/React Compiler slots, cancellation and browser cookies remain external",
      "All11 physical variants/source ranges are retained; no arbitrary runtime winner or rendered UI parity claimed",
      "No server/auth/provider/mutation/production POST/UI mount/ledger/compatibility credit",
    ],
  };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const mode = process.argv[2];
  if (process.argv.length !== 3 || !["--write", "--check"].includes(mode))
    throw Error("usage: original-profile-coalescer.mjs --write|--check");
  const root = fileURLToPath(new URL("..", import.meta.url)),
    target = path.join(root, "reconstruction/profile-coalescer/contract.json"),
    value = JSON.stringify(await extractProfileCoalescer(root), null, 2) + "\n";
  if (mode === "--check") {
    if ((await fs.readFile(target, "utf8")) !== value)
      throw Error("profile-coalescer artifact changed");
  } else await fs.writeFile(target, value);
  console.log(
    `${mode === "--check" ? "Verified" : "Wrote"} original profile coalescer`,
  );
}
