#!/usr/bin/env node
// AST-only recovery. Captured website code is never executed or imported.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generate } from "@babel/generator";
import {
  openCorpus,
  findNodes,
  exactlyOne,
  propertyName,
  objectProperty,
  literal,
  sha256,
} from "./original-contracts/source.mjs";
import { verify as verifyInbox } from "./original-notifications-inbox.mjs";

const defaultRoot = fileURLToPath(new URL("..", import.meta.url));
export const outputPath =
  "reconstruction/notifications-foreground/contract.json";
const compact = (node) =>
  generate(node, { compact: true, comments: false }).code;
const require = (ok, reason) => {
  if (!ok) throw Error(`Foreground recovery: ${reason}`);
};
const target = (node) =>
  node?.type === "SequenceExpression" ? node.expressions.at(-1) : node;
const call = (node, name) =>
  node?.type === "CallExpression" &&
  propertyName(target(node.callee)?.property) === name;
const one = (node, predicate, label) =>
  exactlyOne(findNodes(node, predicate), label);
const declaration = (mod, name) =>
  one(
    mod.node,
    (n, parents) =>
      n.type === "VariableDeclarator" &&
      n.id.name === name &&
      parents.at(-2) === mod.node.body,
    `top-level ${mod.id}.${name}`,
  ).init;

function exported(mod, name) {
  const values = [];
  for (const node of findNodes(
    mod.node,
    (n) => call(n, "s") && n.arguments[0]?.type === "ArrayExpression",
  )) {
    if (node.arguments[1] && literal(node.arguments[1]) !== mod.id) continue;
    if (!node.arguments[1] && !mod.ids.includes(mod.id)) continue;
    const entries = node.arguments[0].elements;
    for (let i = 0; i < entries.length; i += 3)
      if (literal(entries[i]) === name) values.push(entries[i + 2]);
  }
  return exactlyOne(values, `${mod.id}.${name} export`);
}

function importedIds(mod) {
  return [
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
  ];
}

export async function recover(root = defaultRoot) {
  const inbox = await verifyInbox(root);
  const corpus = await openCorpus(root);
  const ids = [32596, 808142, 26498, 404224, 126965, 986274, 976701, 30181];
  const modules = await Promise.all(ids.map((id) => corpus.factory(id)));
  const [foreground, delivery, dm, rooms, keys, contexts, loader, transport] =
    modules;
  // Whole selected syntax is bound in addition to input hashes. Re-sealing a
  // changed guard/order/schema cannot silently leave these analyst rules true.
  // Only the three toast duration literals are derivable version parameters.
  const syntaxPins = {
    808142: "2478b2e4c808dddd82c4bdd490e2a189de6ca23720cde3364873be2ecd082bcb",
    26498: "93ed27ed35a81f662aab9f428fa083d4685d65294258f0130a9277098ef8402b",
    404224: "7e72e850276ab6bea3cab7c32d7deed4b6fbfef6dc3dcf82aaa3eedbb8635ebe",
    126965: "5162e33c61851d4e4affa42356e9fd9aff77d96d869a37c397c3602f99863f26",
    986274: "6a0b026b67390c9cecf8a63141b7bc0c8a7938e87e3fe264951353c35453e0ba",
    976701: "11592a304373ed8867ef2371b6f821f5c99ea5f7f1abed5591b7ed15a16508d8",
  };
  for (const mod of modules)
    if (syntaxPins[mod.id])
      require(sha256(compact(mod.node)) ===
        syntaxPins[mod.id], `review changed ${mod.id} semantics`);
  const handler = declaration(foreground, "et");
  const normalized = structuredClone(handler);
  const durations = findNodes(
    normalized,
    (n) => n.type === "ObjectProperty" && propertyName(n.key) === "duration",
  );
  require(durations.length === 3, "three used toast branches");
  const durationValues = durations.map((n) => literal(n.value));
  for (const node of durations)
    node.value = { type: "NumericLiteral", value: 0 };
  require(sha256(compact(normalized)) ===
    "63bc74e799a39721bbaffb5500452df9007a6c48ac456c6e0c54849dfe020ae6", "review changed received-message conditions/order/operands");
  const schema = declaration(foreground, "ee");
  require(sha256(compact(schema)) ===
    "1480326e350750256d4bda6c73162d7853c463de3a7bdf6d78436d757eed4c0c", "review changed genericV1 schema");
  const post = one(
    delivery.node,
    (n) =>
      call(n, "post") &&
      n.arguments[0]?.value === "notifications/confirm-delivery",
    "actual confirmation POST",
  );
  const confirm = declaration(delivery, "n");
  require(exported(delivery, "F").name === "n" &&
    target(post.callee).object.name === "e", "used confirmation export/client");
  const helperCall = one(
    handler,
    (n) => call(n, "F") && target(n.callee).object?.name === "W",
    "used confirmation helper",
  );
  require(target(helperCall.callee).object.name ===
    "W", "actual delivery import alias");
  const body = objectProperty(post.arguments[1], "json");
  require(body.type === "ObjectExpression", "confirmation JSON body");
  const onMessage = one(
    foreground.node,
    (n) => call(n, "onMessage"),
    "actual onMessage registration",
  );
  const subscriber = onMessage.arguments[1];
  const actualCall = one(
    subscriber,
    (n) => n.type === "CallExpression" && n.callee.name === "et",
    "actual handler incoming call",
  );
  require(compact(actualCall) ===
    "et({payload:e,pathname:L.current,hermesApi:I,queryClient:j,isDirectMessagesEnabled:A.current})", "actual current-ref handler inputs");
  one(
    foreground.node,
    (n) =>
      n.type === "VariableDeclarator" &&
      n.id.name === "I" &&
      compact(n.init) === "(0,s.useHermesApiClient)()",
    "actual Hermes provider hook",
  );
  const imports = new Map(
    findNodes(
      foreground.node,
      (n) => n.type === "VariableDeclarator" && call(n.init, "i"),
    ).map((n) => [n.id.name, literal(n.init.arguments[0])]),
  );
  for (const [name, id] of [
    ["s", 944410],
    ["W", 808142],
    ["H", 26498],
    ["M", 126965],
    ["X", 986274],
  ])
    require(imports.get(name) === id, `used import ${name}`);
  const dynamic = one(
    handler,
    (n) => call(n, "A"),
    "admitted DM lazy detector import",
  );
  require(literal(dynamic.arguments[0]) ===
    976701, "actual lazy detector stub");
  const chunk = one(
    loader.node,
    (n) => n.type === "StringLiteral" && n.value.endsWith(".js"),
    "detector chunk literal",
  );
  const chunkUrl = new URL(`/_next/${chunk.value}`, loader.provenance.url).href;
  const variantOrigins = corpus.index.modules
    .filter((m) => m.ids.includes(822173))
    .flatMap((variant) =>
      variant.origins.map((origin) => ({ variant, origin })),
    );
  const selected = exactlyOne(
    variantOrigins.filter(({ origin }) => origin.url === chunkUrl),
    "chunk-resolved detector variant",
  );
  const detector = await corpus.factory(822173, {
    source: selected.origin.source,
  });
  const detectorExport = exported(detector, "containsDmSensitiveContent");
  modules.push(detector);
  const jsonHeader = one(
    transport.node,
    (n) =>
      call(n, "set") &&
      n.arguments[0]?.value === "content-type" &&
      compact(n.arguments[1]) ===
        'this.#t.headers.get("content-type")??"application/json"',
    "Ky JSON request Content-Type fallback",
  );
  const toastCalls = findNodes(handler, (n) => call(n, "custom"));
  require(toastCalls.length === 3 &&
    handler.async === true, "three used async-handler toast branches");
  const witnesses = [
    foreground.witness(handler, "complete used foreground handler"),
    foreground.witness(schema, "genericV1 input schema"),
    foreground.witness(onMessage, "actual incoming onMessage callback"),
    delivery.witness(
      confirm,
      "unawaited delivery helper with swallowed rejection",
    ),
    dm.witness(
      exported(dm, "O"),
      "ordered DM admission and cached mute lookup",
    ),
    dm.witness(exported(dm, "k"), "DM deeplink/metadata target"),
    rooms.witness(exported(rooms, "J"), "idempotent active-room refcount"),
    contexts.witness(
      exported(contexts, "I"),
      "idempotent toast context refcount",
    ),
  ];
  const sources = modules.map((mod) => ({
    source: mod.provenance,
    imports: importedIds(mod).map((id) => ({
      id,
      variants: corpus.index.modules
        .filter((m) => m.ids.includes(id))
        .map((m) => ({ ids: m.ids, sha256: m.sha256, origins: m.origins })),
    })),
  }));
  require(sources.every((s) =>
    s.imports.every((i) => i.variants.length > 0),
  ), "unresolved direct import");
  return {
    schemaVersion: 1,
    classification:
      "Original captured foreground client workflow; no backend/push/UI compatibility qualification",
    compatibilityQualified: false,
    inputs: corpus.anchors,
    inventoryVariants: corpus.index.modules.length,
    captureTime: corpus.manifest.captured_at,
    transport: {
      reusedVerifiedContract:
        "reconstruction/notifications-inbox/contract.json",
      contractSha256: sha256(
        await readFile(
          path.join(root, "reconstruction/notifications-inbox/contract.json"),
        ),
      ),
      prefixUrl: inbox.transport.prefixUrl,
      timeoutMs: inbox.transport.timeoutMs,
      providers: inbox.transport.providers,
      credentials: "browser same-origin default",
      authorizationHook: false,
      ultimateProxyUpstream: null,
    },
    delivery: {
      method: "POST",
      clientInput: literal(post.arguments[0]),
      browserPath: `${inbox.transport.prefixUrl}/${literal(post.arguments[0])}`,
      when: "client AND messageId AND userId AND timestamp are truthy",
      awaitedByHandler: false,
      failure:
        "Promise rejection swallowed by confirmation helper; no response body decoded",
      body: {
        notificationId: "data.messageId",
        userId: "data.userId",
        timestamp: "data.timestamp",
        platform: literal(objectProperty(body, "platform")),
        deliveryLocation: literal(objectProperty(body, "deliveryLocation")),
        deviceId: "included only when injected device ID is truthy",
      },
      contentType: "application/json",
      acceptHeaderAdded: false,
      evidence: [
        delivery.witness(post, "relative confirmation request"),
        foreground.witness(helperCall, "actual unawaited confirmation use"),
        transport.witness(jsonHeader, "JSON request Content-Type"),
      ],
      serverAcknowledgementOrPersistenceEstablished: false,
    },
    orderedStages: [
      "presentation nullish fallbacks",
      "start eligible delivery confirmation without awaiting",
      "parse DM target",
      "DM: invalidate inbox then message cache",
      "DM: feature gate, active room, exact inbox route, first matching cached mute",
      "DM: await explicit sensitive-content module then render",
      "non-DM: suppress current coin prefix using raw mint lookup",
      "non-DM: parse genericV1 schema",
      "non-DM: suppress limit_order_filled while toast context is open",
      "generic showAsToast path or simple fallback",
    ],
    directMessages: {
      enabledDefault: true,
      recognition:
        "pump: URL with dms hostname; metadata senderUserId overrides only route destination",
      cachePrefixes: [
        ["dms", "inbox"],
        ["dms", "messages"],
      ],
      suppressionOrder: ["disabled", "active_room", "inbox_open", "muted"],
      inboxPathExact: "/messages",
      muteSelection:
        "first matching entry across getQueriesData/paged entries; senderUserId OR conversationId matches peerId OR conversationId",
      permanentMuteValue: null,
      muteUntilComparison:
        "Date.parse(mutedUntil) > Date.now(); equality and invalid dates are not muted",
      roomPath:
        "/messages/encodeURIComponent(senderUserId ?? conversationId), otherwise /messages",
      activeRoomCleanup:
        "refcount each truthy argument including duplicates; cleanup idempotent",
      durationMs: durationValues[0],
      toastId: "hermes-dm-${messageId ?? conversationId ?? title}",
      detector: {
        stub: loader.provenance,
        chunkUrl,
        moduleId: 822173,
        allIdVariantsRetained: variantOrigins.map(({ variant, origin }) => ({
          sha256: variant.sha256,
          origin,
        })),
        selected: detector.provenance,
        export: detector.witness(
          detectorExport,
          "chunk-resolved detector export",
        ),
        implementation:
          "Explicit async injected port; detector not copied or executed",
      },
    },
    nonDirectMessages: {
      currentCoinGuard:
        "truthy raw mint AND pathname.startsWith('/coin/' + mint); no path-segment boundary",
      mintOrder: [
        "data.mintAddress",
        "JSON.parse(data.genericV1).coinMetadata.mintAddress without generic schema",
        "deeplink coins path or coin query; this raw lookup has no protocol check",
      ],
      schema: {
        required: { notificationSubtype: "string", showAsToast: "boolean" },
        optional: [
          "toastButtons",
          "listNavigation",
          "coinMetadata",
          "metadata",
        ],
        unknownObjectKeys: "stripped",
        invalidOrFalsyInput:
          "undefined, then simple fallback rather than dropped message",
        evidence: foreground.witness(schema, "complete generic input schema"),
      },
      contextSuppressedSubtypes: ["limit_order_filled"],
      toastContextCleanup: "reference-counted, idempotent",
      generic: {
        condition:
          "type exactly hermesNotificationGenericV1 AND valid genericV1.showAsToast truthy",
        durationMs: durationValues[1],
        id: "hermes-${messageId ?? title}",
      },
      simple: {
        durationMs: durationValues[2],
        id: "hermes-simple-${messageId ?? title}",
      },
      toastEvidence: toastCalls.map((n) =>
        foreground.witness(n, "actual used toast call"),
      ),
    },
    witnesses,
    sources,
    limits: [
      "Static client source, not captured notification responses or observed delivery acknowledgement.",
      "No browser permission, device ID storage/registration, Firebase/ServiceWorker lifecycle, telemetry, navigation, notification UI or outer callback cache/user-refresh implementation.",
      "Sensitive-content detector is an explicit injected async boundary; chunk attribution does not qualify its implementation.",
      "No default network, production request, server authentication/ownership/persistence, native backend or feature-completion credit.",
      "Ky retry/timeouts/HTTPError and React/TanStack/renderer scheduling are not emulated; actual destination and transport must be supplied.",
      "Existing683 binds dated disabled-Hermes configuration. No current availability or active provider winner is inferred.",
      "Only direct imports of selected factories plus explicitly chunk-resolved detector are attributed; no complete transitive graph claim.",
    ],
  };
}

export async function verify(root = defaultRoot) {
  const result = await recover(root);
  const stored = JSON.parse(
    await readFile(path.join(root, outputPath), "utf8"),
  );
  require(JSON.stringify(stored) ===
    JSON.stringify(
      result,
    ), "derived contract differs from authenticated source");
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
      sources: result.sources.length,
      providers: result.transport.providers.length,
      capturedCodeExecuted: false,
      networkRequests: 0,
    }),
  );
}
