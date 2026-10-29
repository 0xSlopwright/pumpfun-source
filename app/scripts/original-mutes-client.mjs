#!/usr/bin/env node
// Captured source is authenticated and parsed as data, never executed.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generate } from "@babel/generator";
import {
  openCorpus,
  findNodes,
  exactlyOne,
  literal,
  propertyName,
  objectProperty,
  sha256,
} from "./original-contracts/source.mjs";
import {
  verify as verifySettingsClientContract,
  outputPath as settingsPath,
} from "./settings-client-contract.mjs";

const defaultRoot = fileURLToPath(new URL("..", import.meta.url));
export const outputPath = "reconstruction/mutes-client/contract.json";
const compact = (node) =>
  generate(node, { compact: true, comments: false }).code;
const require = (ok, message) => {
  if (!ok) throw Error(`Mutes client: ${message}`);
};
const one = (node, predicate, label) =>
  exactlyOne(findNodes(node, predicate), label);
const target = (node) =>
  node?.type === "SequenceExpression" ? node.expressions.at(-1) : node;
const call = (node, property) =>
  node?.type === "CallExpression" &&
  propertyName(target(node.callee)?.property) === property;
const pins = {
  609488: ["2b76f790369185efc3f3b2ab4637a2008653f7faa4e82230de54713112158b9b"],
  944410: [
    "eb97d758430643b5c14b01e535a4bc5490b13e7d5437d04b76fe7bb3525d1395",
    "6e0b85a81829493018b501cb1137b5cf667eec841ea56b6921e6ad0875271b96",
  ],
  96224: ["5a7aacd1e02cdcba6278e50454f2b919f6e5cfc1cc3006855c0be0d0f4344c4e"],
  894228: ["47361019774787b9a565ba739eaa8fe64291be49b63f3e4e757af18c9c53e508"],
  30181: ["fbae4e508e6c986c68209d975d3eea247718d478272089a60504b776074e2413"],
  820204: ["cd2a115e929357ddbc3e8bbb1e312b349b39aee78cd20e091c4c668cdc39b0ca"],
  779106: ["e1e29868ec56b56bdbc68b58127f2c71583094d14645020b53c733a7be06423b"],
  92245: ["9b5bbc065d7b19bf7273c3fa6fcbddb2f61a6c183a2f512d6e2d2d81d5ea89e3"],
  329657: ["474ea4e5766c8b3206db519ab8663a9f6938f13730a99ead2220e4fe1c6ee681"],
  204478: ["27cc0223b79ff95cac02f490600cc4de894dee66af739beca525502c424dae3f"],
};
const imports = (mod) =>
  new Map(
    findNodes(
      mod.node,
      (n) =>
        n.type === "VariableDeclarator" &&
        n.init?.type === "CallExpression" &&
        ["i", "r"].includes(propertyName(n.init.callee?.property)),
    ).map((n) => [n.id.name, literal(n.init.arguments[0])]),
  );
const variable = (mod, name) =>
  one(
    mod.node,
    (n) => n.type === "VariableDeclarator" && n.id.name === name && n.init,
    `initialized variable ${name}`,
  );
const assigned = (mod, name) =>
  one(
    mod.node,
    (n) =>
      n.type === "AssignmentExpression" &&
      n.left.name === name &&
      n.right.type === "ArrowFunctionExpression",
    `callback ${name}`,
  ).right;
const witnessed = (mod, node, label) => ({
  syntax: compact(node),
  evidence: mod.witness(node, label),
});
function exported(mod, name, id) {
  const found = [];
  for (const node of findNodes(
    mod.node,
    (n) => call(n, "s") && n.arguments[0]?.type === "ArrayExpression",
  )) {
    if (id !== undefined && node.arguments[1]?.value !== id) continue;
    const values = node.arguments[0].elements;
    for (let i = 0; i < values.length; i += 3)
      if (values[i]?.value === name) found.push(values[i + 2]);
  }
  return exactlyOne(found, `${id ?? mod.id}.${name} export`);
}
export async function recover(root = defaultRoot) {
  // Reuse the already maintained provider/Flight recovery, rather than copying
  // its extraction logic or crediting its recovered settings operations again.
  const corpus = await openCorpus(root),
    selected = new Map();
  for (const id of [
    609488, 96224, 894228, 30181, 820204, 779106, 92245, 329657, 204478,
  ]) {
    const variants = corpus.index.modules.filter((m) => m.ids.includes(id));
    require(variants.length === 1 &&
      pins[id]?.includes(
        variants[0].sha256,
      ), `review changed ${id} factory/variants`);
    selected.set(
      id,
      await corpus.factory(id, { source: variants[0].origins[0].source }),
    );
  }
  const settings = verifySettingsClientContract(root);
  const mod = selected.get(609488),
    schema = selected.get(820204),
    sources = [...selected.values()].map((m) => m.provenance);
  require(imports(mod).get("u") === 944410 &&
    imports(mod).get("y") === 779106, "actual client/scope imports");
  require(imports(selected.get(779106)).get("r") ===
    92245, "actual viewer identity import");
  require(compact(variable(mod, "p").init) ===
    'e.i(402030).contract["GET /mutes"].response', "actual response validator binding");
  const operations = {};
  for (const [name, symbol, expected] of [
    ["list", "x", "GET /mutes"],
    ["mute", "f", "POST /mutes/{userId}"],
    ["unmute", "h", "DELETE /mutes/{userId}"],
  ]) {
    const fn = variable(mod, symbol).init;
    const invocation = one(
      fn,
      (n) =>
        n.type === "CallExpression" &&
        n.arguments[0]?.type === "StringLiteral" &&
        n.arguments[0].value.includes("/mutes"),
      `${name} API invocation`,
    );
    require(literal(invocation.arguments[0]) === expected &&
      compact(invocation.callee) === "e.api", `${name} concrete API port`);
    const route = one(
      schema.node,
      (n) => n.type === "ObjectProperty" && propertyName(n.key) === expected,
      `${name} declared route`,
    );
    operations[name] = {
      operation: expected,
      function: witnessed(mod, fn, `${name} request and return`),
      declaredRoute: witnessed(
        schema,
        route,
        `${name} schema; not observed server behavior`,
      ),
    };
  }
  require(operations.list.function.syntax.includes(
    "p.parse(t)",
  ), "actual list validator executes after response");
  const listRoute = one(
    schema.node,
    (n) => n.type === "ObjectProperty" && propertyName(n.key) === "GET /mutes",
    "list route",
  );
  require(compact(objectProperty(listRoute.value, "response")) ===
    "o.z.object({userIds:o.z.array(o.z.string())})", "selected list response shape");
  const callbacks = {};
  for (const [name, symbol] of Object.entries({
    muteOptimistic: "Q",
    muteError: "V",
    muteSettled: "K",
    unmuteOptimistic: "ee",
    unmuteError: "et",
    unmuteSettled: "el",
    walletGate: "x",
    toggle: "g",
  }))
    callbacks[name] = witnessed(mod, assigned(mod, symbol), name);
  require(callbacks.muteOptimistic.syntax.includes(
    "await X.cancelQueries({queryKey:J})",
  ) &&
    callbacks.unmuteOptimistic.syntax.includes(
      "await ei.cancelQueries({queryKey:eo})",
    ), "cancel before optimistic snapshots");
  require(callbacks.walletGate.syntax ===
    "()=>!!ef||(eh(!0),!1)", "actual wallet prompt gate");
  require(callbacks.toggle.syntax.includes(
    ".mutate(",
  ), "actual fire-and-callback menu mutation");
  const query = variable(mod, "w").init,
    key = variable(mod, "b").init;
  require(compact(key) ===
    'e=>["mutes","list",e]', "viewer-partitioned mute key");
  const filter = exported(mod, "D", 561903);
  const providers = [];
  for (const variant of corpus.index.modules.filter((m) =>
    m.ids.includes(944410),
  )) {
    require(pins[944410].includes(
      variant.sha256,
    ), "review changed provider variant");
    for (const origin of variant.origins) {
      const provider = await corpus.factory(944410, { source: origin.source });
      const hook = exported(provider, "useClientServerContract");
      const deps = imports(provider);
      require([...deps.values()].includes(96224) &&
        deps.get("r") === 30181, "actual config/transport dependencies");
      one(
        hook,
        (n) => call(n, "K") && target(n.callee).object.name === "r",
        "actual transport.K provider call",
      );
      providers.push({
        source: provider.provenance,
        hook: witnessed(
          provider,
          hook,
          "original config-bound contract-client hook",
        ),
      });
    }
  }
  require(providers.length ===
    pins[944410].length, "complete client provider variants");
  const callers = [];
  for (const [id, alias, kind] of [
    [329657, "f", "callout"],
    [204478, "w", "reply"],
  ]) {
    const parent = selected.get(id);
    require(imports(parent).get(alias) ===
      609488, `${kind} actual menu import`);
    const jsx = one(
      parent.node,
      (n) =>
        n.type === "CallExpression" &&
        compact(n.arguments[0] ?? { type: "NullLiteral" }) === `${alias}.f` &&
        n.arguments[1]?.type === "ObjectExpression",
      `${kind} actual menu renderer`,
    );
    const props = jsx.arguments[1];
    require(literal(objectProperty(props, "density")) === "comfortable" &&
      literal(objectProperty(objectProperty(props, "target"), "kind")) ===
        kind, `${kind} in-scope comfortable menu`);
    callers.push({
      kind,
      ...witnessed(parent, jsx, `${kind} author/target props`),
    });
  }
  return {
    schemaVersion: 1,
    classification:
      "Original selected mute/unmute client/menu workflow with explicit ports; no server, authentication or global feed-filter integration claim",
    anchors: corpus.anchors,
    inventoryVariants: corpus.index.modules.length,
    dependency: {
      path: settingsPath,
      sha256: sha256(await readFile(path.join(root, settingsPath))),
      verifier:
        "settings-client-contract.mjs verify(root), unchanged maintained prerequisite",
      capturedConfigurations: settings.configuration.captured_configurations,
      boundary:
        "Dated provider clientServerUrl bindings only; cookie issuance/server authorization/current service availability unresolved",
    },
    operations,
    providers,
    callers,
    sources,
    callbacks,
    query: {
      key: witnessed(mod, key, "actual viewer mute key"),
      hook: witnessed(mod, query, "list query/select/admission/stale time"),
    },
    utility: {
      filter: witnessed(
        mod,
        filter,
        "identity-preserving exported filter helper",
      ),
      consumerEstablished: false,
      boundary:
        "Exported 561903.D only; no incoming captured caller established here, so global feed use remains unqualified",
    },
    behavior: {
      read: "GET forwards AbortSignal; then parse required string userIds array; unknown object fields stripped, string order/duplicates preserved",
      writes:
        "POST/DELETE userId parameter; await API and discard response; no per-operation credential/header override",
      query:
        "key mutes/list/viewer; enabled defaults true and requires non-null viewer; select userIds; staleTime60000",
      optimistic:
        "cancel before snapshot; absent cache left absent; mute prepends absent ID, duplicate returns same object; unmute filters all exact matches and preserves identity if unchanged",
      completion:
        "truthy snapshot rollback then source error report; invalidate exact viewer list prefix onSettled on success or failure",
      menu: "target is author.userId||null; query requested only while menu open with target; no target means no action; absent wallet opens wallet UI and does not mutate; otherwise choose mute/unmute from current list and use per-call success/error messages",
      pending:
        "both handles' isPending flags disable the rendered item; original toggle callback itself does not add a pending guard",
      filter:
        "standalone utility keeps unknown/falsey author IDs; exact Set membership only; return original rows when no rows removed",
    },
    limits: [
      "No backend handlers, production requests, cookies/wallet signing, auth/session implementation, durable state or server-compatibility claim.",
      "Selected comfortable-density callout/reply mute action only; terminal, report actions, block actions and detail surfaces are not implemented.",
      "The reconstructed finite JSON shape check does not reproduce Zod error classes/details; networking/query framework scheduling/retries and React rendering remain explicit host ports.",
      "A supplied wallet address is an original client gate, not proof of authenticated identity or server authorization.",
      "The filter helper has no established incoming captured consumer in this unit; authored use in tests is not original global feed integration.",
    ],
  };
}
export async function verify(root = defaultRoot) {
  const generated = await recover(root),
    saved = JSON.parse(await readFile(path.join(root, outputPath), "utf8"));
  require(JSON.stringify(generated) ===
    JSON.stringify(saved), "saved contract differs from authenticated source");
  return generated;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  require(args.every((a) =>
    ["--write", "--check"].includes(a),
  ), "unknown argument");
  if (args.includes("--write")) {
    await mkdir(path.dirname(path.join(defaultRoot, outputPath)), {
      recursive: true,
    });
    await writeFile(
      path.join(defaultRoot, outputPath),
      JSON.stringify(await recover(), null, 2) + "\n",
    );
  }
  const result = await verify();
  console.log(
    JSON.stringify({
      result: "PASS",
      operations: Object.keys(result.operations).length,
      providers: result.providers.length,
      callers: result.callers.length,
      capturedCodeExecuted: false,
      productionRequests: 0,
    }),
  );
}
