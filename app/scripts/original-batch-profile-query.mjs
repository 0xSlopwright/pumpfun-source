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
import { extractUserBatch } from "./original-user-batch.mjs";
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
        member(n.init.callee, f.runtime, "i") &&
        n.init.arguments[0]?.value === id,
    ),
    `actual import ${id}`,
  );
}
function exportsOf(f, id) {
  const registration = exactlyOne(
      findNodes(
        f.node,
        (n) =>
          n.type === "CallExpression" &&
          member(n.callee, f.runtime, "s") &&
          (n.arguments[1]?.value === id ||
            (n.arguments.length === 1 && f.ids.length === 1)),
      ),
      `registration ${id}`,
    ),
    values = registration.arguments[0].elements,
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
  const d = exactlyOne(
    findNodes(
      f.node,
      (d, parents) =>
        ((d.type === "VariableDeclarator" && d.id.name === n.name) ||
          (d.type === "FunctionDeclaration" && d.id.name === n.name)) &&
        !parents.some((p) => p !== f.node && /Function|Method/.test(p.type)),
    ),
    `local ${n.name}`,
  );
  return d.type === "VariableDeclarator" ? d.init : d;
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
export async function extractBatchProfileQuery(root) {
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
  const dependency = await extractUserBatch(root),
    dependencyPath = "reconstruction/user-batch/contract.json";
  assert(
    (await fs.readFile(path.join(root, dependencyPath), "utf8")) ===
      JSON.stringify(dependency, null, 2) + "\n",
    "901 strict batch source artifact drift",
  );
  const fragments = new Map(),
    factories = new Map();
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
  const entries = corpus.index.modules.filter((x) => x.ids.includes(576766));
  assert(
    entries.length === 6 &&
      entries.reduce((n, x) => n + x.origins.length, 0) === 7,
    "batch-query cohort changed",
  );
  const variants = [];
  for (const entry of entries)
    for (const origin of entry.origins) {
      const f = await get(576766, origin.source),
        hook = exportsOf(f, 576766).get("f");
      const request = exactlyOne(
        calls(hook, imported(f, 544930).id.name, "u"),
        "query uses actual strict reader",
      );
      assert(
        request.arguments[0].properties
          .map((p) => propertyName(p.key))
          .join(",") === "userAddresses",
        "query started forwarding extra strict-reader inputs",
      );
      const sort = exactlyOne(
        findNodes(
          hook,
          (n) =>
            n.type === "CallExpression" &&
            propertyName(n.callee.property) === "sort",
        ),
        "actual query address sort",
      );
      const comparator = local(f, sort.arguments[0]);
      exactlyOne(
        calls(comparator, comparator.params[0].name, "localeCompare"),
        "host localeCompare sorting",
      );
      const keyNamespace = imported(f, 38279).id.name;
      const key = exactlyOne(
        findNodes(
          hook,
          (n) =>
            n.type === "CallExpression" &&
            propertyName(n.callee.property) === "USERS" &&
            member(n.callee.object, keyNamespace, "Q"),
        ),
        "actual users key factory",
      );
      const policy = exactlyOne(
        findNodes(
          hook,
          (n) =>
            n.type === "ObjectExpression" &&
            n.properties.some((p) => propertyName(p.key) === "retryOnMount"),
        ),
        "batch-query policy",
      );
      assert(
        literal(objectProperty(policy, "retryOnMount")) === false &&
          policy.properties.at(-1).type === "SpreadElement",
        "query defaults/override precedence changed",
      );
      const retry = local(f, objectProperty(policy, "retry"));
      exactlyOne(
        calls(retry, imported(f, 528600).id.name, "r"),
        "retry uses shared typed4xx predicate",
      );
      const limit = exactlyOne(
        findNodes(
          retry,
          (n) => n.type === "BinaryExpression" && n.operator === "<",
        ),
        "retry count bound",
      );
      assert(literal(limit.right) === 1, "query retry count changed");
      const mount = local(f, objectProperty(policy, "refetchOnMount")),
        focus = local(f, objectProperty(policy, "refetchOnWindowFocus"));
      const shouldRefetchCall = exactlyOne(
        findNodes(
          mount,
          (n) => n.type === "CallExpression" && n.callee.type === "Identifier",
        ),
        "refetch predicate invocation",
      );
      const shouldRefetch = local(f, shouldRefetchCall.callee);
      assert(
        findNodes(
          shouldRefetch,
          (n) => n.type === "NumericLiteral" && n.value === 30000,
        ).length === 1,
        "refetch cooldown changed",
      );
      const reportCall = exactlyOne(
        calls(hook, imported(f, 466931).id.name, "l"),
        "actual captured error reporter port",
      );
      assert(
        literal(objectProperty(reportCall.arguments[0], "feature")) ===
          "profile" &&
          literal(objectProperty(reportCall.arguments[0], "operation")) ===
            "users-batch",
        "report metadata changed",
      );
      const effect = exactlyOne(
        calls(hook, imported(f, 352386).id.name, "useEffect"),
        "error effect dependency boundary",
      );
      const fallback = exactlyOne(
        findNodes(
          hook,
          (n) =>
            n.type === "ConditionalExpression" &&
            findNodes(
              n.consequent,
              (n) =>
                n.type === "CallExpression" &&
                propertyName(n.callee.property) === "getQueryData",
            ).length === 1,
        ),
        "error-only cache fallback",
      );
      const selected = exactlyOne(
        findNodes(
          hook,
          (n) =>
            n.type === "LogicalExpression" &&
            n.operator === "??" &&
            propertyName(n.left.property) === "data",
        ),
        "existing result data wins over fallback",
      );
      variants.push({
        factory: f.provenance,
        ranges: {
          hook: add(
            f,
            hook,
            "complete576766 query/result/error effect boundary",
          ),
          strictRead: add(
            f,
            request,
            "actual544930.u callback; query signal not forwarded",
          ),
          sort: add(f, sort, "fresh address copy sorted with host comparator"),
          comparator: add(f, comparator, "localeCompare comparator"),
          key: add(f, key, "38279.Q.USERS actual call"),
          policy: add(
            f,
            policy,
            "caller queryOptions last; retryOnMount false",
          ),
          retry: add(f, retry, "shared typed4xx stop andcount<1"),
          mount: add(f, mount, "mount refetch predicate"),
          focus: add(f, focus, "focus refetch predicate"),
          refetch: add(f, shouldRefetch, "error state and elapsed>=30s"),
          effect: add(
            f,
            effect,
            "React error effect dependency list; scheduling remains external",
          ),
          report: add(f, reportCall, "error report port and source context"),
          fallback: add(
            f,
            fallback,
            "error-only individual-cache reads and undefined-only filter",
          ),
          selected: add(f, selected, "nullish result data fallback"),
        },
      });
    }
  const keys = await get(38279, source("ad7136d0b3a7f323")),
    catalog = exportsOf(keys, 38279).get("Q"),
    usersKey = objectProperty(catalog, "USERS");
  assert(
    usersKey.body.elements[0].value === "users",
    "users key prefix changed",
  );
  add(keys, usersKey, "actual Q.USERS: raw comma-joined addresses");
  const consumer = await get(163807, source("decc1b8a23be2e25")),
    consumerCall = exactlyOne(
      calls(consumer.node, imported(consumer, 576766).id.name, "f"),
      "actual Home/Following batch-profile consumer",
    );
  add(
    consumer,
    consumerCall,
    "actual163807 uses query result; surrounding feed UI not reconstructed",
  );
  return {
    schemaVersion: 1,
    authority: "Authenticated AST only; original JS never evaluated",
    frozenInputs: corpus.anchors,
    implementation: {
      path: "reconstruction/batch-profile-query/client.mjs",
      sha256: sha256(
        await fs.readFile(
          path.join(root, "reconstruction/batch-profile-query/client.mjs"),
        ),
      ),
    },
    prerequisite: {
      pullRequest: 901,
      exactPublicHead: "b780d75d17fc1965ab21592d8e77d749e3cd4637",
      sourceRecoveryHead: "7e6f345a915b58eb3c75295599fce6c545bef99e",
      ancestor870: "e46c14ea3857da7ef6eecc9f7945622f5dbcfc39",
      novelCredit: false,
      sourceArtifact: {
        path: dependencyPath,
        sha256: sha256(await fs.readFile(path.join(root, dependencyPath))),
      },
      implementation: dependency.implementation,
      shared870: dependency.prerequisite,
    },
    variants,
    consumers: [consumer.provenance],
    factories: [...factories.values()],
    fragments: [...fragments.values()],
    policy: {
      key: "users/comma-joined localeCompare-sorted addresses; duplicates retained",
      options:
        "caller overrides last; callback invokes strict reader without query signal; typed4xx retry blocked,count<1 otherwise",
      refetch:
        "state.status===error and now-errorUpdatedAt>=30000; retryOnMount=false",
      fallback:
        "Only truthy result.error; read individual user keys from joined/split identifiers, filter onlyundefined; existing result.data??fallback; all other fields retained",
      report:
        "Host effect boundary only; shared module counter suppresses before30s, increments count, emits/resets count on eligible report; metadata contains count not identifiers",
    },
    limits: [
      "Exact901/870 prerequisites unchanged and credited separately; no duplicated strict reader, error class or key helper",
      "Clock/report/query/cache are explicit host capabilities; no telemetry sent or TanStack/React effect scheduling implemented",
      "LocaleCompare is host behavior; raw comma key collisions and fallback split quirks preserved, not corrected",
      "Seven origins/six variants plus actual163807 call are source evidence, not runtime winner/rendered UI proof",
      "No backend/auth/session/mutation/production request/UI mount/ledger/compatibility credit; no full Next/browser qualification",
    ],
  };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const mode = process.argv[2];
  if (process.argv.length !== 3 || !["--write", "--check"].includes(mode))
    throw Error("usage: original-batch-profile-query.mjs --write|--check");
  const root = fileURLToPath(new URL("..", import.meta.url)),
    target = path.join(
      root,
      "reconstruction/batch-profile-query/contract.json",
    ),
    value =
      JSON.stringify(await extractBatchProfileQuery(root), null, 2) + "\n";
  if (mode === "--check") {
    if ((await fs.readFile(target, "utf8")) !== value)
      throw Error("batch-profile-query artifact changed");
  } else await fs.writeFile(target, value);
  console.log(
    `${mode === "--check" ? "Verified" : "Wrote"} original batch-profile query`,
  );
}
