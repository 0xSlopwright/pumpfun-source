#!/usr/bin/env node
// Inert captured source attribution only; never evaluate/import website bundles.
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
  sha256,
} from "./original-contracts/source.mjs";
const defaultRoot = fileURLToPath(new URL("..", import.meta.url));
export const outputPath =
  "reconstruction/notification-navigation/contract.json";
const compact = (node) =>
  generate(node, { compact: true, comments: false }).code;
const require = (ok, reason) => {
  if (!ok) throw Error(`Notification navigation recovery: ${reason}`);
};
const target = (n) =>
  n?.type === "SequenceExpression" ? n.expressions.at(-1) : n;
const call = (n, name) =>
  n?.type === "CallExpression" &&
  propertyName(target(n.callee)?.property) === name;
const one = (node, pred, label) => exactlyOne(findNodes(node, pred), label);
function exported(mod, name) {
  const values = [];
  for (const node of findNodes(
    mod.node,
    (n) => call(n, "s") && n.arguments[0]?.type === "ArrayExpression",
  )) {
    if (node.arguments[1] && literal(node.arguments[1]) !== mod.id) continue;
    const entries = node.arguments[0].elements;
    for (let i = 0; i < entries.length; i += 3)
      if (literal(entries[i]) === name) values.push(entries[i + 2]);
  }
  return exactlyOne(values, `export ${mod.id}.${name}`);
}
const imports = (mod) =>
  new Map(
    findNodes(
      mod.node,
      (n) => n.type === "VariableDeclarator" && call(n.init, "i"),
    ).map((n) => [n.id.name, literal(n.init.arguments[0])]),
  );
export async function recover(root = defaultRoot) {
  const corpus = await openCorpus(root);
  const modules = await Promise.all(
    [
      763956, 808142, 692159, 146695, 399861, 646908, 208912, 292686, 402659,
    ].map((id) => corpus.factory(id)),
  );
  const [
    rows,
    mapper,
    routing,
    profile,
    achievement,
    chains,
    marker,
    enums,
    topbar,
  ] = modules;
  const pins = {
    808142: "2478b2e4c808dddd82c4bdd490e2a189de6ca23720cde3364873be2ecd082bcb",
    692159: "bf9105961dceb84f05a3830618cb86e6cf225d50a822324d4ccfabaa87103de4",
    146695: "dffb4e8ebefe04f863fa44b3436884d83695e2f1894aa5ffe2d249b425f490e0",
    399861: "550869fb855e401a7dfba6fa68e9c87e2eaff01bf1ecae5f26e33e28e1d9b157",
    646908: "9a8104333d5d8338160d18b89bedc0cdae3d401718c30d37df83321de22319fa",
    208912: "af08d41427aee3e6bc03750ea746e9c3720e8506cfa61d7516cc4d8f3266628e",
  };
  for (const mod of modules)
    if (pins[mod.id])
      require(sha256(compact(mod.node)) ===
        pins[mod.id], `review changed ${mod.id} semantics`);
  const row = exported(rows, "f");
  const activation = one(
    row,
    (n) =>
      n.type === "ArrowFunctionExpression" &&
      n.body.type === "BlockStatement" &&
      compact(n).length < 500 &&
      findNodes(
        n.body,
        (n) => call(n, "push") && target(n.callee).object?.name === "O",
      ).length === 1,
    "actual row activation callback",
  );
  require(sha256(compact(activation)) ===
    "661540ea04c97129a36d39233f0ba74d17c3122f67bac37da95a3914c3ba761b", "review changed click ordering/operands");
  const rowImports = imports(rows);
  for (const [name, id] of [
    ["v", 808142],
    ["b", 208912],
    ["a", 292686],
    ["l", 599077],
    ["h", 595673],
  ])
    require(rowImports.get(name) === id, `actual row import ${name}`);
  one(
    row,
    (n) =>
      n.type === "VariableDeclarator" &&
      n.id.name === "O" &&
      compact(n.init) === "(0,l.useRouter)()",
    "actual router hook",
  );
  const clickSink = one(
    row,
    (n) =>
      n.type === "ObjectProperty" &&
      propertyName(n.key) === "trackClick" &&
      n.value.type === "ArrowFunctionExpression",
    "trackClick callback",
  );
  require(compact(clickSink.value) ===
    "()=>(0,h.j_)({item:o,surface:s})", "actual click sink inputs");
  const mount = one(
    topbar.node,
    (n) =>
      call(n, "jsx") &&
      target(n.arguments[0])?.object?.name === "l" &&
      propertyName(target(n.arguments[0])?.property) === "f",
    "actual topbar row mount",
  );
  require(imports(topbar).get("l") === 763956 &&
    compact(mount.arguments[1]) ===
      '{item:e,surface:"topbar",unread:(0,h.i)(e,R)}', "topbar supplies actual row/item/surface");
  const destination = exported(mapper, "m");
  require(compact(destination) ===
    "e=>(0,t.H)({deeplink:e.deeplink,listNavigation:e.navigation??e.genericV1?.listNavigation})" &&
    imports(mapper).get("t") === 692159, "actual item-to-route boundary");
  const routeImports = imports(routing);
  require(routeImports.get("t") === 146695 &&
    routeImports.get("n") === 399861 &&
    routeImports.get("i") === 646908, "actual routing helper edges");
  const markerExport = exported(marker, "n");
  const entryPoint = one(
    enums.node,
    (n) =>
      n.type === "ObjectProperty" &&
      propertyName(n.key) === "NOTIFICATION_CENTER",
    "notification entry-point value",
  );
  require(literal(entryPoint.value) === 8, "actual notification entry value");
  const rules = [
    [
      "item selection",
      "navigation ?? genericV1.listNavigation; empty truthy object is still selected",
      mapper,
      destination,
    ],
    [
      "resolver priority",
      "truthy structured navigation, then pump link, then slash-relative string, then lowercase http prefix, then root",
      routing,
      exported(routing, "H"),
    ],
    [
      "structured intent",
      "captured special route mappings; otherwise route with pathname and params",
      routing,
      exported(routing, "G"),
    ],
    [
      "intent formatting",
      "captured URL encoding and route remapping; generic params replace first matching placeholder only",
      routing,
      exported(routing, "_"),
    ],
    [
      "pump intent",
      "legacy coin slash rewrite; exact pump protocol; captured hostname cases; otherwise generic route",
      routing,
      exported(routing, "Y"),
    ],
    [
      "DM marker writer",
      "one trailing slash removed; record only another /messages path, resolving href against injected origin",
      marker,
      markerExport,
    ],
    [
      "activation",
      "track click, resolve, mark with NOTIFICATION_CENTER, router.push; exceptions stop later effects; no return value",
      rows,
      activation,
    ],
  ].map(([label, rule, mod, node]) => ({ rule, ...mod.witness(node, label) }));
  const sources = modules.map((mod) => ({
    source: mod.provenance,
    imports: [
      ...new Set(
        findNodes(
          mod.node,
          (n) =>
            n.type === "CallExpression" &&
            ["i", "r", "A"].some((name) => call(n, name)) &&
            target(n.callee).object?.name === mod.runtime &&
            n.arguments[0]?.type === "NumericLiteral",
        ).map((n) => literal(n.arguments[0])),
      ),
    ].map((id) => ({
      id,
      variants: corpus.index.modules
        .filter((m) => m.ids.includes(id))
        .map((m) => ({ ids: m.ids, sha256: m.sha256, origins: m.origins })),
    })),
  }));
  require(sources.every((m) =>
    m.imports.every((i) => i.variants.length > 0),
  ), "unresolved available direct import");
  return {
    schemaVersion: 1,
    classification:
      "Original notification row activation and destination client recovery; no destination UI/backend compatibility",
    compatibilityQualified: false,
    inputs: corpus.anchors,
    inventoryVariants: corpus.index.modules.length,
    captureTime: corpus.manifest.captured_at,
    incoming: {
      surface: "topbar",
      rowExport: "763956.f",
      actualCaller: topbar.witness(mount, "topbar calls actual row component"),
      clickSink: rows.witness(clickSink, "click sink"),
      actualRouter: "599077.useRouter().push",
    },
    activation: {
      order: [
        "trackClick({item,surface})",
        "808142.m(item)",
        "208912.n({href,entryPoint:8})",
        "router.push(href)",
      ],
      entryPoint: literal(entryPoint.value),
      returns: "undefined; router return is not forwarded",
      errors: "propagate; no retries/default destination added",
      evidence: [
        rows.witness(activation, "complete click handler"),
        enums.witness(entryPoint, "entry-point enum"),
      ],
    },
    destinations: {
      priority: [
        "truthy structured navigation",
        "pump:// link",
        "slash-relative link",
        "lowercase http prefix parsed by URL",
        "root fallback",
      ],
      selectedItemNavigation:
        "item.navigation ?? item.genericV1?.listNavigation",
      structuredRoutes: [
        "/coins/[mint]",
        "/profile/[id]",
        "/achievements/[id]",
        "/trending/[mint]",
        "/bounties/[taskId]",
        "/go/[id]/submissions/[submissionId]",
        "/go/[id]",
        "/communities",
        "/coins/community/[mint]",
        "/dms",
        "/dms/[userId]",
      ],
      httpLink: "return pathname + search; drop origin and fragment",
      relativeLink: "return original string unchanged, not URL-normalized",
      genericRoute:
        "Object.entries params in insertion order; replace first [key] occurrence; no query append",
      genericPumpQuery:
        "params feed generic placeholder replacement, not a new query string",
      malformedShapesMayThrow: true,
      responseOrUrlSecurityValidatorAdded: false,
    },
    helpers: {
      profile:
        "raw string ID is encoded without trim; object address/userId fallback trims",
      achievement: "encoded /achievements/id?reveal=1",
      nearCoin:
        "strip near:mainnet: only when remaining captured near-account regex matches; otherwise preserve full mint",
      legacyCoin: "pump://coin/ rewrites to pump://coins/",
      dm: "pump dms and structured dms routes map to /messages",
    },
    marker: {
      recordedFields: ["pathname", "entryPoint", "at"],
      path: "resolved URL pathname with exactly one trailing slash removed when length>1",
      when: "target exactly /messages or starts /messages/, and differs from normalized current pathname",
      clock: "Date.now, read only on eligible write",
      originCheckAdded: false,
      persistenceOrReaderImplemented: false,
      consumptionAndExpiry:
        "retained source exports exist but no downstream consumer is established in this unit",
    },
    rules,
    sources,
    limits: [
      "No original backend response, authenticated owner state, production request, destination-page or notification UI implementation.",
      "Coin/detail, achievements, GO, community and DM destinations are navigation boundaries; no scope expansion or page compatibility is inferred.",
      "Click telemetry and router implementations are explicit ports; no telemetry provider, browser-history/Next runtime equivalence or security assurance.",
      "Pending DM-entry marker writer only; downstream reads, TTL consumption, performance-navigation inference and lifecycle remain outside this unit.",
      "Existing690 inbox request/projection and764 foreground presentation remain unchanged and independently qualified; local composition tests use synthetic response data.",
      "All selected direct imports retain all available inventory variants; complete transitive graph and active page/provider selection remain unresolved.",
      "No captures, SDK, dependency lock, global shell, feature ledger or paused native prototype is changed.",
    ],
  };
}
export async function verify(root = defaultRoot) {
  const result = await recover(root),
    saved = JSON.parse(await readFile(path.join(root, outputPath), "utf8"));
  require(JSON.stringify(result) ===
    JSON.stringify(
      saved,
    ), "generated contract differs from authenticated source");
  return result;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2),
    at = args.indexOf("--root");
  require(args.every(
    (arg, i) => ["--write", "--check", "--root"].includes(arg) || i === at + 1,
  ), "unknown argument");
  const root = at < 0 ? defaultRoot : path.resolve(args[at + 1]);
  if (args.includes("--write")) {
    await mkdir(path.dirname(path.join(root, outputPath)), { recursive: true });
    await writeFile(
      path.join(root, outputPath),
      JSON.stringify(await recover(root), null, 2) + "\n",
    );
  }
  const result = await verify(root);
  console.log(
    JSON.stringify({
      result: "PASS",
      selectedFactories: result.sources.length,
      inventory: result.inventoryVariants,
      capturedCodeExecuted: false,
      networkRequests: 0,
    }),
  );
}
