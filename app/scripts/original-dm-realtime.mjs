#!/usr/bin/env node
// Recover inert source AST only. No captured bundle, broker or auth code runs.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generate } from "@babel/generator";
import {
  openCorpus,
  findNodes,
  exactlyOne,
  propertyName,
  literal,
  sha256,
} from "./original-contracts/source.mjs";
const defaultRoot = fileURLToPath(new URL("..", import.meta.url));
export const outputPath = "reconstruction/dm-realtime/contract.json";
const compact = (node) =>
  generate(node, { compact: true, comments: false }).code;
const require = (ok, reason) => {
  if (!ok) throw Error(`DM realtime recovery: ${reason}`);
};
const one = (node, predicate, label) =>
  exactlyOne(findNodes(node, predicate), label);
const target = (node) =>
  node?.type === "SequenceExpression" ? node.expressions.at(-1) : node;
const call = (node, name) =>
  node?.type === "CallExpression" &&
  propertyName(target(node.callee)?.property) === name;
const declaration = (mod, name) =>
  one(
    mod.node,
    (n, parents) =>
      n.type === "VariableDeclarator" &&
      n.id.name === name &&
      parents.at(-2) === mod.node.body,
    `declaration ${mod.id}.${name}`,
  ).init;
function exported(mod, name) {
  const result = [];
  for (const node of findNodes(
    mod.node,
    (n) => call(n, "s") && n.arguments[0]?.type === "ArrayExpression",
  )) {
    if (node.arguments[1] && literal(node.arguments[1]) !== mod.id) continue;
    const values = node.arguments[0].elements;
    for (let i = 0; i < values.length; i += 3)
      if (literal(values[i]) === name) result.push(values[i + 2]);
  }
  return exactlyOne(result, `export ${mod.id}.${name}`);
}
export async function recover(root = defaultRoot) {
  const corpus = await openCorpus(root);
  const modules = await Promise.all(
    [754054, 573525, 283087, 126965, 543301, 12404, 400466, 292686].map((id) =>
      corpus.factory(id),
    ),
  );
  const [
    signals,
    subscription,
    readiness,
    keys,
    loader,
    reexport,
    shell,
    enums,
  ] = modules;
  const pins = {
    573525: "98117d9559662b43305d92aa903e296cc2e96ed616c8d53fc870ec90dc3942fd",
    283087: "bc6e3c9c8c88e4a88b33bd98010fd4f788d39fa9ecdcea50e6d73acc78c63204",
    126965: "5162e33c61851d4e4affa42356e9fd9aff77d96d869a37c397c3602f99863f26",
    543301: "985ce1ce98d0ed53fda20a8c1a8ecb12a17f323fa4d30fe0657f4e2daad9d70a",
    12404: "89f2c01d59f7b25c9b593c4e47844b18c36fb7e7852cb23425ecdfcf9203c2ac",
  };
  for (const m of modules)
    if (pins[m.id])
      require(sha256(compact(m.node)) ===
        pins[m.id], `review changed ${m.id} semantics`);
  const hook = declaration(signals, "M"),
    schema = declaration(signals, "C");
  require(sha256(compact(schema)) ===
    "9d405ad9797d4ae72e1aec8995a5f45af28c0f49528e059e15680080a6b7633a", "review changed event schema");
  const normalized = structuredClone(hook);
  const capacity = one(
    normalized,
    (n) =>
      n.type === "BinaryExpression" &&
      n.operator === ">=" &&
      propertyName(n.left?.property) === "size",
    "dedup capacity condition",
  );
  const capacityValue = literal(capacity.right);
  capacity.right = { type: "NumericLiteral", value: 0 };
  const timers = findNodes(
    normalized,
    (n) => n.type === "CallExpression" && n.callee.name === "setTimeout",
  );
  require(timers.length === 2, "used trailing and reconnect timers");
  const trailing = literal(timers[0].arguments[1]);
  timers[0].arguments[1] = { type: "NumericLiteral", value: 0 };
  const jitter = literal(timers[1].arguments[1].left);
  timers[1].arguments[1].left = { type: "NumericLiteral", value: 0 };
  require(sha256(compact(normalized)) ===
    "0a7f0f0ef8b27178e27f9b15dc544a88a54372fa2fc5daef18303237ebe385fd", "review changed hook guards/order/refs/effect lifetimes");
  require(literal(exported(signals, "TRAILING_REFETCH_MS")) === trailing &&
    literal(exported(signals, "RECONNECT_REFETCH_JITTER_MS")) ===
      jitter, "exported timer constants differ from actually used literals");
  require(compact(declaration(signals, "A")) === "e=>`dm.user.${e}`" &&
    exported(signals, "dmRealtimeSubject").name === "A" &&
    exported(signals, "useDmRealtimeSignals").name ===
      "M", "used subject/hook exports");
  const component = exported(signals, "DmRealtimeSignalSubscriber");
  require(sha256(compact(component)) ===
    "44e74f98df8736e77692fb92d862e6d89623e95289656a7560d34b594c49cfae", "review changed component feature/address gate");
  require(findNodes(
    component,
    (n) => n.type === "CallExpression" && n.callee.name === "M",
  ).length === 1, "actual subscriber invokes hook");
  const bindings = new Map(
    findNodes(
      signals.node,
      (n) => n.type === "VariableDeclarator" && call(n.init, "i"),
    ).map((n) => [n.id.name, literal(n.init.arguments[0])]),
  );
  for (const [name, id] of [
    ["t", 292686],
    ["R", 126965],
    ["N", 283087],
    ["s", 573525],
    ["l", 440326],
    ["o", 985526],
    ["c", 606933],
    ["O", 352386],
    ["u", 574472],
    ["_", 528600],
    ["a", 779106],
    ["E", 390065],
    ["T", 613677],
    ["I", 342463],
  ])
    require(bindings.get(name) === id, `actual used import ${name}`);
  const shellLoader = declaration(shell, "aD");
  require(sha256(compact(shellLoader)) ===
    "795ae875238c92eb86591532c830f919788961793cfbac276af488003d9b3bdf", "actual shell loader chain changed");
  const actualMount = one(
    shell.node,
    (n) => call(n, "jsx") && n.arguments[0]?.name === "aD",
    "actual subscriber shell mount",
  );
  const flag = one(
    shell.node,
    (n) =>
      n.type === "VariableDeclarator" &&
      n.id.name === "eP" &&
      call(n.init, "k") &&
      propertyName(n.init.arguments[0]?.property) === "WEB_DIRECT_MESSAGES",
    "shell DM feature flag",
  );
  const chunk = one(
    loader.node,
    (n) => n.type === "StringLiteral" && n.value.endsWith(".js"),
    "realtime chunk",
  );
  const chunkUrl = new URL(`/_next/${chunk.value}`, loader.provenance.url).href;
  require(reexport.provenance.url ===
    chunkUrl, "actual lazy chunk resolves reexport12404");
  const coreVariants = [];
  for (const variant of corpus.index.modules.filter((m) =>
    m.ids.includes(985526),
  ))
    for (const origin of variant.origins) {
      const mod = await corpus.factory(985526, { source: origin.source });
      const assignment = one(
        mod.node,
        (n) =>
          n.type === "AssignmentExpression" &&
          propertyName(n.left?.property) === "Core",
        "CORE enum",
      );
      require(literal(assignment.right) ===
        "CORE", "all available CORE enum variants agree");
      coreVariants.push({
        source: mod.provenance,
        value: literal(assignment.right),
        evidence: mod.witness(assignment, "Core enum value"),
      });
      modules.push(mod);
    }
  require(coreVariants.length === 2, "review both CORE enum variants");
  const channel = one(
    enums.node,
    (n) =>
      n.type === "ObjectProperty" && propertyName(n.key) === "REALTIME_NATS",
    "delivery channel enum",
  );
  require(literal(channel.value) === 1, "actual peer-message channel enum");
  const dependencies = modules.map((mod) => ({
    source: mod.provenance,
    imports: [
      ...new Set(
        findNodes(
          mod.node,
          (n) =>
            n.type === "CallExpression" &&
            ["i", "r", "A"].some((p) => call(n, p)) &&
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
  require(dependencies.every((m) =>
    m.imports.every((i) => i.variants.length > 0),
  ), "unresolved available direct import");
  return {
    schemaVersion: 1,
    classification:
      "Original captured DM realtime client-state recovery, not a broker/backend or authenticated-session implementation",
    compatibilityQualified: false,
    inputs: corpus.anchors,
    inventoryVariants: corpus.index.modules.length,
    captureTime: corpus.manifest.captured_at,
    incoming: {
      chain: [
        "400466 shell lazy mount",
        "543301 chunk loader",
        "12404 namespace reexport",
        "754054 DmRealtimeSignalSubscriber",
        "754054 useDmRealtimeSignals",
        "573525 useEventSubscription",
      ],
      chunkUrl,
      evidence: [
        shell.witness(shellLoader, "actual shell lazy component"),
        shell.witness(actualMount, "actual conditional component mount"),
        shell.witness(flag, "shell WEB_DIRECT_MESSAGES flag"),
        signals.witness(component, "used component"),
        reexport.provenance,
        loader.provenance,
      ],
    },
    inputsRequired: {
      enabled:
        "caller supplies original WEB_DIRECT_MESSAGES && !!address result",
      userId: "resolved auth userId ?? profile fallback userId ?? null",
      viewer:
        "separately resolved dm-inbox cache scope; not interchangeable with userId",
      authReady:
        "!NATS_PER_USER_AUTH flag || auth-ready external store snapshot",
      connected: "CORE connection state; does not itself gate subscription",
    },
    subscription: {
      type: "CORE",
      subject: "dm.user.${userId}",
      gate: "enabled && userId !== null && authReady",
      throttleMs: 0,
      coalesce: false,
      callback:
        "latest callback ref; callback/viewer change alone does not resubscribe unchanged subject",
      cleanup:
        "unsubscribe(type,id) only when both stored type and ID are truthy; reset after successful unsubscribe",
      error: "log subscribe exception; no fabricated connected state",
      coreVariants,
      transportOrigin: null,
      wireProtocolOrServerAuthQualified: false,
      evidence: [subscription.provenance, readiness.provenance],
    },
    event: {
      required: {
        type: "string",
        messageId: "string",
        conversationId: "string",
      },
      optional: { senderId: "string", createdAt: "string" },
      unknownKeys: "stripped",
      acceptedType: "dm_message",
      dedup: {
        capacity: capacityValue,
        order: "insertion FIFO, not LRU",
        duplicatesDoNotRefreshOrder: true,
        scope: "one mounted hook lifetime, not reset by viewer/userId changes",
      },
      peerCallback: {
        when: "senderId is defined and differs from resolved userId",
        fields: [
          "messageId",
          "conversationId",
          "peerId",
          "deliveryChannel",
          "createdAt",
        ],
        deliveryChannel: literal(channel.value),
        awaited: false,
      },
      evidence: [
        signals.witness(schema, "signal schema"),
        signals.witness(hook, "complete hook conditions/effects"),
        enums.witness(channel, "channel enum"),
      ],
    },
    refresh: {
      prefixesInOrder: [
        ["dms", "inbox", "viewer"],
        ["dms", "messages", "viewer"],
      ],
      leading: "immediate on first unique accepted event",
      trailingWindowMs: trailing,
      subsequentUniqueEvent: "sets pending during existing window",
      trailing:
        "one refresh at timer expiry iff pending; no new cooldown from trailing alone",
      snapshot:
        "pending timer retains the invalidator/viewer of its first event; later input changes do not cancel/reset it",
      errors:
        "query invalidation/peer callback exceptions remain exceptions; no synthetic success",
    },
    reconnect: {
      jitterMs: jitter,
      delay: "jitterMs * Math.random()",
      initialConnectionRefresh: false,
      sequence:
        "after seeing ready+connected, a ready+disconnected observation sets pending; later ready+connected schedules refresh",
      cleanupDependencies: [
        "subscription-ready gate",
        "connected",
        "viewer invalidator",
      ],
      flagsPersistAcrossInputChanges: true,
    },
    visibility: {
      event: "visibilitychange",
      gate: "enabled && userId !== null; does not require authReady",
      refreshWhen: "document.visibilityState exactly visible",
      attachDoesNotRefresh: true,
      cleanupDependencies: ["enabled/resolved-user gate", "viewer invalidator"],
    },
    dispose:
      "clear outstanding event-window and reconnect timers; remove visibility listener; unsubscribe through source truthy-ID cleanup; instance cannot remount",
    sources: dependencies,
    limits: [
      "No NATS transport, token minting, credentials, auth acceptance, broker/server implementation, wire capture, production requests or native compatibility.",
      "No user/profile lookup, React effect scheduling, user-ID/cache-scope inference, browser lifecycle attachment or telemetry service is supplied implicitly.",
      "Injected ports implement local integration. Defaults start disabled; callers must provide current original-derived gate/identity state.",
      "One adapter instance models one hook lifetime, including retained IDs/pending timers across configure calls. Remount creates a new instance.",
      "Captured callbacks/cleanup establish bounded client logic, not upstream delivery, replay, losslessness or exhaustive concurrency semantics.",
      "All available direct import variants are retained. Complete transitive graph and active page provider/build selection remain unknown.",
      "Existing764 foreground message presentation,690 inbox watermark and675 settings UI remain unchanged; no feature ledger credit.",
    ],
  };
}
export async function verify(root = defaultRoot) {
  const result = await recover(root),
    stored = JSON.parse(await readFile(path.join(root, outputPath), "utf8"));
  require(JSON.stringify(result) ===
    JSON.stringify(
      stored,
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
      sources: result.sources.length,
      inventory: result.inventoryVariants,
      capturedCodeExecuted: false,
      networkRequests: 0,
    }),
  );
}
