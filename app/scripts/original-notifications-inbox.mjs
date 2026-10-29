#!/usr/bin/env node
// Parse authenticated captured factories; never execute them or contact a service.
import { readFile, writeFile } from "node:fs/promises";
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
} from "./original-contracts/source.mjs";

const defaultRoot = fileURLToPath(new URL("..", import.meta.url));
export const outputPath = "reconstruction/notifications-inbox/contract.json";
const compact = (node) =>
  generate(node, { compact: true, comments: false }).code;
const assert = (ok, message) => {
  if (!ok) throw Error(`Inbox recovery: ${message}`);
};
const prop = (node, name) =>
  ["MemberExpression", "OptionalMemberExpression"].includes(node?.type) &&
  propertyName(node.property) === name;
const target = (node) =>
  node?.type === "SequenceExpression" ? node.expressions.at(-1) : node;
const calls = (node, name) =>
  node?.type === "CallExpression" && prop(target(node.callee), name);
const single = (mod, predicate, label) =>
  exactlyOne(findNodes(mod.node, predicate), label);
const decl = (mod, name) =>
  single(
    mod,
    (node, parents) =>
      node.type === "VariableDeclarator" &&
      node.id.name === name &&
      parents.at(-2) === mod.node.body,
    `top-level ${name}`,
  ).init;
const fn = (mod, name) =>
  single(
    mod,
    (node, parents) =>
      node.type === "FunctionDeclaration" &&
      node.id.name === name &&
      parents.at(-1) === mod.node.body,
    `function ${name}`,
  );
function exported(mod, id, name) {
  const found = [];
  for (const node of findNodes(
    mod.node,
    (n) => calls(n, "s") && n.arguments[0]?.type === "ArrayExpression",
  )) {
    if (node.arguments[1] && literal(node.arguments[1]) !== id) continue;
    if (!node.arguments[1] && mod.id !== id) continue;
    const values = node.arguments[0].elements;
    for (let i = 0; i < values.length; i += 3)
      if (literal(values[i]) === name) found.push(values[i + 2]);
  }
  return exactlyOne(found, `export ${id}.${name}`);
}
function exact(mod, node, expected, label) {
  assert(compact(node) === expected, label);
  return mod.witness(node, label);
}
function importMap(mod) {
  return new Map(
    findNodes(
      mod.node,
      (n) =>
        n.type === "VariableDeclarator" &&
        n.id.type === "Identifier" &&
        (calls(n.init, "i") || calls(n.init, "r")) &&
        n.init.arguments[0]?.type === "NumericLiteral",
    ).map((n) => [n.id.name, literal(n.init.arguments[0])]),
  );
}
function imported(mod, node, id, name) {
  return (
    calls(node, name) &&
    importMap(mod).get(target(node.callee).object?.name) === id
  );
}
function sourceRule(mod, node, rule, label) {
  return { rule, ...mod.witness(node, label) };
}
export async function recover(root = defaultRoot) {
  const corpus = await openCorpus(root);
  const [inbox, mapper, dm, topbar, keys, viewer, scope, clock, transport] =
    await Promise.all(
      [763956, 808142, 26498, 402659, 484018, 779106, 92245, 668487, 30181].map(
        (id) => corpus.factory(id),
      ),
    );
  const providers = [];
  for (const variant of corpus.index.modules.filter((m) =>
    m.ids.includes(944410),
  ))
    for (const origin of variant.origins) {
      const mod = await corpus.factory(944410, { source: origin.source });
      const hook = exported(mod, 944410, "useHermesApiClient");
      const gate = exactlyOne(
        findNodes(
          hook,
          (n) =>
            n.type === "ConditionalExpression" &&
            prop(n.test, "hermesNotificationsAvailable"),
        ),
        "Hermes provider gate",
      );
      assert(
        imported(mod, gate.consequent, 30181, "p") &&
          gate.alternate.type === "NullLiteral",
        "provider binds actual Hermes factory",
      );
      providers.push({
        source: mod.provenance,
        gate: mod.witness(gate, "Hermes availability gate"),
      });
    }
  assert(
    providers.length === 2,
    "review both captured Hermes provider variants",
  );
  const clientOptions = single(
    transport,
    (n) =>
      n.type === "ObjectExpression" &&
      n.properties.some(
        (p) =>
          propertyName(p.key) === "prefixUrl" &&
          p.value.value === "/api/hermes",
      ),
    "Hermes client options",
  );
  assert(
    clientOptions.properties.map((p) => propertyName(p.key)).join(",") ===
      "prefixUrl,timeout",
    "independent client has only captured prefix/timeout options",
  );
  const prefix = literal(objectProperty(clientOptions, "prefixUrl"));
  const timeout = literal(objectProperty(clientOptions, "timeout"));
  const acceptHeader = literal(objectProperty(decl(transport, "h"), "json"));
  const acceptWrite = single(
    transport,
    (n) => calls(n, "set") && n.arguments[0]?.value === "accept",
    "Ky JSON Accept header setter",
  );
  exact(
    transport,
    acceptWrite,
    'r.request.headers.set("accept",r.request.headers.get("accept")||o)',
    "Ky body shortcut sets missing Accept",
  );
  const empty204 = single(
    transport,
    (n) =>
      n.type === "IfStatement" && compact(n) === 'if(204===n.status)return"";',
    "Ky204 JSON result",
  );
  const emptyBody = single(
    transport,
    (n) =>
      n.type === "ConditionalExpression" &&
      compact(n) === '""===t?"":e.parseJson?e.parseJson(t):JSON.parse(t)',
    "Ky empty JSON text result",
  );
  const clientFactory = exported(transport, 30181, "p");
  assert(
    findNodes(clientFactory, (n) => n === clientOptions).length === 1,
    "Hermes exported factory owns options",
  );
  const get = single(
    inbox,
    (n) =>
      calls(n, "get") &&
      n.arguments[0]?.type === "TemplateLiteral" &&
      n.arguments[0].quasis[0].value.cooked === "notifications/user?",
    "actual inbox GET",
  );
  assert(
    target(get.callee).object.name === "m",
    "GET uses captured client local",
  );
  single(
    inbox,
    (n) =>
      n.type === "VariableDeclarator" &&
      n.id.name === "m" &&
      imported(inbox, n.init, 944410, "useHermesApiClient"),
    "GET local comes from Hermes hook",
  );
  const template = get.arguments[0];
  assert(
    template.expressions.length === 1 &&
      calls(template.expressions[0], "toString") &&
      target(template.expressions[0].callee).object.name === "a",
    "URLSearchParams string used directly",
  );
  exact(
    inbox,
    get.arguments[1],
    "{signal:n}",
    "original query cancellation signal forwarded",
  );
  single(
    inbox,
    (n) =>
      n.type === "ObjectPattern" &&
      compact(n) ===
        "{notificationType:s,priority:l,channel:u,mintAddress:d,enabled:c}",
    "original filter argument bindings",
  );
  single(
    inbox,
    (n) =>
      n.type === "ObjectPattern" && compact(n) === "{pageParam:t,signal:n}",
    "original pagination/cancellation bindings",
  );
  const queryFunction = single(
    inbox,
    (n) =>
      n.type === "ArrowFunctionExpression" &&
      n.async &&
      n.start < get.start &&
      n.end > get.end,
    "actual async query callback",
  );
  single(
    inbox,
    (n) =>
      n.type === "AssignmentExpression" &&
      n.left.name === "i" &&
      n.right === queryFunction,
    "query callback assignment",
  );
  const filters = findNodes(
    inbox.node,
    (n) =>
      calls(n, "set") &&
      target(n.callee).object.name === "a" &&
      n.arguments[0]?.type === "StringLiteral",
  ).filter((n) => n.start > get.start - 1000 && n.start < get.start);
  assert(
    filters.map((n) => literal(n.arguments[0])).join(",") ===
      "lastEvaluatedKey,notificationType,priority,channel,mintAddress",
    "query order and fields",
  );
  const locals = {
    lastEvaluatedKey: "t",
    notificationType: "s",
    priority: "l",
    channel: "u",
    mintAddress: "d",
  };
  const filterRules = filters.map((set) => {
    const name = literal(set.arguments[0]);
    assert(set.arguments[1]?.name === locals[name], `query value ${name}`);
    const guard = single(
      inbox,
      (n) => n.type === "LogicalExpression" && n.right === set,
      `query guard ${name}`,
    );
    assert(
      guard.operator === "&&" && guard.left.name === locals[name],
      `truthy-only ${name}`,
    );
    return {
      name,
      include: "truthy",
      ...inbox.witness(guard, `query ${name}`),
    };
  });
  const queryOptions = single(
    inbox,
    (n) =>
      n.type === "ObjectExpression" &&
      n.properties.some((p) => propertyName(p.key) === "initialPageParam"),
    "infinite query options",
  );
  exact(
    inbox,
    objectProperty(queryOptions, "initialPageParam"),
    "void 0",
    "undefined initial cursor",
  );
  exact(
    inbox,
    objectProperty(queryOptions, "queryFn"),
    "i",
    "captured query function",
  );
  exact(
    inbox,
    fn(inbox, "Y"),
    "function Y(e){return e.hasMore?e.lastEvaluatedKey:void 0;}",
    "next cursor follows hasMore, not count",
  );
  exact(
    inbox,
    fn(inbox, "q"),
    "function q(e){return e.notifications;}",
    "page flatten selection",
  );
  exact(
    inbox,
    fn(inbox, "U"),
    "function U(e){return!(0,P.Y)(e);}",
    "DM entries excluded after loading",
  );
  assert(
    importMap(inbox).get("P") === 26498 && importMap(inbox).get("v") === 808142,
    "actual filter/normalizer imports",
  );
  const queryKey = single(
    inbox,
    (n) =>
      n.type === "ArrayExpression" &&
      n.elements[0]?.type === "SpreadElement" &&
      calls(n.elements[0].argument, "inbox"),
    "inbox key expression",
  );
  exact(
    inbox,
    queryKey,
    "[...S.F.inbox(h),s,l,u,d]",
    "viewer and all filters partition cache",
  );
  assert(
    importMap(inbox).get("S") === 484018,
    "inbox key imported from actual builder",
  );
  const keyObject = decl(keys, "i");
  const inboxKey = objectProperty(keyObject, "inbox");
  exact(
    keys,
    inboxKey,
    'e=>["hermes-notifications","inbox",e]',
    "inbox cache prefix",
  );
  const enabled = single(
    inbox,
    (n) =>
      n.type === "UnaryExpression" &&
      n.operator === "!" &&
      n.argument?.type === "UnaryExpression" &&
      compact(n).includes("void 0===c||c"),
    "inbox enabled expression",
  );
  exact(
    inbox,
    enabled,
    "!!(g&&m&&null!==h&&(void 0===c||c))",
    "feature/client/viewer/optional-enabled conjunction",
  );
  single(
    inbox,
    (n) =>
      imported(inbox, n, 779106, "f") &&
      n.arguments[0]?.value === "hermes-inbox",
    "viewer hook invocation",
  );
  const scopeExport = exported(scope, 92245, "$");
  exact(
    scope,
    scopeExport,
    "e=>{let t=e?.userId?.trim();return t?t:e?.address?.trim()||null;}",
    "query viewer prefers userId then wallet",
  );
  assert(
    importMap(viewer).get("r") === 92245 &&
      findNodes(viewer.node, (n) => imported(viewer, n, 92245, "$")).length ===
        1,
    "actual viewer hook uses selector",
  );
  const normalizer = exported(mapper, 808142, "P");
  exact(
    mapper,
    normalizer,
    "e=>({id:e.notificationId||e.messageId,title:e.title,body:e.body,deeplink:e.deeplink,imageUrl:e.imageURL||void 0,timestamp:e.timestamp||e.createdAt,type:e.type,navigation:e.genericV1?.listNavigation,genericV1:e.genericV1,mintAddress:e.mintAddress||e.genericV1?.coinMetadata?.mintAddress})",
    "wire normalization with original fallbacks",
  );
  const mapCall = single(
    inbox,
    (n) => calls(n, "map") && compact(n) === "i.notifications.map(v.P)",
    "response notifications map",
  );
  const successObject = single(
    inbox,
    (n) =>
      n.type === "ObjectExpression" &&
      n.properties.some((p) => p.value === mapCall),
    "returned inbox page",
  );
  exact(
    inbox,
    successObject,
    "{notifications:i.notifications.map(v.P),lastEvaluatedKey:i.lastEvaluatedKey,hasMore:i.hasMore,count:i.count}",
    "page metadata returned unvalidated",
  );
  const refresh = single(
    inbox,
    (n) => n.type === "LogicalExpression" && compact(n) === "t||f()",
    "first-page refresh",
  );
  single(
    inbox,
    (n) =>
      n.type === "VariableDeclarator" &&
      n.id.type === "ObjectPattern" &&
      compact(n.id) === "{fetchUser:f}" &&
      imported(inbox, n.init, 574472, "F"),
    "refreshUser comes from captured auth store",
  );
  const json = single(
    inbox,
    (n) =>
      calls(n, "json") &&
      target(n.callee).object === get &&
      n.arguments.length === 0,
    "bare JSON decoder",
  );
  single(
    inbox,
    (n) =>
      n.type === "VariableDeclarator" &&
      n.id.name === "i" &&
      n.init?.type === "AwaitExpression" &&
      n.init.argument === json,
    "await JSON before first-page refresh and mapping",
  );
  single(
    inbox,
    (n) =>
      imported(inbox, n, 761459, "useInfiniteQuery") &&
      n.arguments[0]?.name === "r",
    "actual infinite query uses recovered options",
  );
  single(
    inbox,
    (n) =>
      n.type === "AssignmentExpression" &&
      n.left.name === "r" &&
      n.right === queryOptions,
    "actual options binding",
  );
  single(
    inbox,
    (n) =>
      n.type === "VariableDeclarator" &&
      n.id.name === "g" &&
      imported(inbox, n.init, 528798, "f"),
    "actual Hermes feature flag hook",
  );
  const dmPredicate = exported(dm, 26498, "Y");
  exact(
    dm,
    dmPredicate,
    'e=>{let t=e.genericV1?.notificationSubtype;return!!(void 0!==t&&c.has(t)||e.navigation?.pathname.startsWith("/dms"))||e.deeplink.startsWith("pump://dms");}',
    "direct-message filter predicate",
  );
  const dmTypes = decl(dm, "c");
  assert(
    dmTypes.type === "NewExpression" && dmTypes.callee.name === "Set",
    "DM set",
  );
  const subtypeValues = dmTypes.arguments[0].elements.map(literal);
  const watermarkPrefix = literal(decl(inbox, "D"));
  const unread = exported(inbox, 986382, "i");
  exact(
    inbox,
    decl(inbox, unread.name),
    "(e,t)=>{if(null===t)return!0;let n=Date.parse(e.timestamp),a=Date.parse(t);return!(Number.isNaN(n)||Number.isNaN(a))&&n>a;}",
    "unread is strict time comparison; null marks all",
  );
  exact(
    inbox,
    decl(inbox, exported(inbox, 986382, "u").name),
    "(e,t)=>e.reduce((e,n)=>e+ +!!I(n,t),0)",
    "unread count over loaded items",
  );
  const watermarkRead = decl(inbox, "F");
  exact(
    inbox,
    watermarkRead,
    "e=>{try{return localStorage.getItem(T(e));}catch{return null;}}",
    "read errors yield null",
  );
  exact(
    inbox,
    decl(inbox, "T"),
    "e=>`${D}${e}`",
    "watermark key concatenates exact input",
  );
  const markOpen = exported(inbox, 986382, "W");
  exact(
    inbox,
    markOpen,
    "(e,t=new Date((0,k.t)()).toISOString())=>{C.set(e,{before:F(e),at:t});try{localStorage.setItem(T(e),t);}catch{}for(let e of W)e();}",
    "open snapshots prior watermark, attempts local write, notifies",
  );
  assert(
    importMap(inbox).get("y") === 668487 && compact(decl(inbox, "k")) === "y",
    "adjusted clock alias",
  );
  const clockNow = exported(clock, 668487, "t");
  exact(
    clock,
    clockNow,
    "()=>Date.now()+t",
    "default watermark uses adjusted client clock",
  );
  const priorHook = exported(inbox, 986382, "t");
  const priorSnapshot = exactlyOne(
    findNodes(
      priorHook,
      (n) =>
        n.type === "ArrowFunctionExpression" &&
        n.params.length === 0 &&
        compact(n).includes("C.get(e)"),
    ),
    "prior watermark snapshot",
  );
  exact(
    inbox,
    priorSnapshot,
    "()=>{if(null===e)return null;let t=C.get(e);return t?t.before:F(e);}",
    "open rows retain pre-open snapshot",
  );
  const storageSubscription = decl(inbox, "E");
  exact(
    inbox,
    storageSubscription,
    'e=>{W.add(e);let t=t=>{(null===t.key||t.key.startsWith(D))&&e();};return window.addEventListener("storage",t),()=>{W.delete(e),window.removeEventListener("storage",t);};}',
    "cross-tab matching prefix or storage clear, cleanup",
  );
  const topbarOpen = single(
    topbar,
    (n) =>
      n.type === "ArrowFunctionExpression" &&
      compact(n) === "e=>{e&&(0,h.W)(I),z?.(e);}",
    "topbar open handler",
  );
  assert(
    importMap(topbar).get("h") === 986382,
    "topbar invokes actual watermark writer",
  );
  const topbarScope = single(
    topbar,
    (n) => n.type === "LogicalExpression" && compact(n) === "I?.trim()||null",
    "topbar read scope",
  );
  const loaded = single(
    inbox,
    (n) =>
      n.type === "CallExpression" &&
      calls(n, "filter") &&
      compact(n) === "(l.data?.pages.flatMap(q)??[]).filter(U)",
    "loaded pages filtering",
  );
  const ledger = JSON.parse(
    await readFile(
      path.join(root, "contracts/internal-operations.json"),
      "utf8",
    ),
  );
  assert(
    Array.isArray(ledger.operations) &&
      !ledger.operations.some((o) =>
        String(o.path).includes("notifications/user"),
      ),
    "GET not already in literal ledger",
  );
  const selected = [
    inbox,
    mapper,
    dm,
    topbar,
    keys,
    viewer,
    scope,
    clock,
    transport,
  ];
  const dependencies = selected.map((mod) => ({
    source: mod.provenance,
    imports: [
      ...new Set(
        findNodes(
          mod.node,
          (n) =>
            n.type === "CallExpression" &&
            ["i", "r", "A"].some((name) => calls(n, name)) &&
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
  assert(
    dependencies.every((m) => m.imports.every((i) => i.variants.length > 0)),
    "selected factories have unresolved direct imports",
  );
  return {
    schemaVersion: 1,
    classification:
      "Original captured client recovery; no server or UI compatibility qualification",
    compatibilityQualified: false,
    inputs: corpus.anchors,
    inventoryVariants: corpus.index.modules.length,
    captureTime: corpus.manifest.captured_at,
    operation: {
      method: "GET",
      clientInput: "notifications/user?" + "${URLSearchParams}",
      browserPath: prefix + "/notifications/user",
      newRelativeToHistoricalLedger: true,
      historicalLedgerOperations: ledger.operations.length,
      query: filterRules,
      signalForwarded: true,
      successfulDecoder:
        "bare Ky .json(), then mapper; no response-schema parse",
      evidence: [
        inbox.witness(get, "inbox request"),
        inbox.witness(json, "bare response decode"),
        mapper.witness(normalizer, "normalizer"),
        inbox.witness(successObject, "page response"),
      ],
    },
    transport: {
      prefixUrl: prefix,
      timeoutMs: timeout,
      acceptHeader,
      acceptHeaderEvidence: [
        transport.witness(acceptWrite, "Ky Accept behavior"),
        transport.witness(decl(transport, "h"), "JSON media type"),
      ],
      emptyJsonResult: "",
      emptyJsonEvidence: [
        transport.witness(empty204, "204 response"),
        transport.witness(emptyBody, "empty JSON text"),
      ],
      credentials: "not supplied; browser same-origin default",
      authorizationHook: false,
      ultimateProxyUpstream: null,
      evidence: transport.witness(clientOptions, "separate Hermes client"),
      providers,
    },
    query: {
      cachePrefix: ["hermes-notifications", "inbox"],
      scope: "trimmed userId, otherwise trimmed address or null",
      filterOrder: ["notificationType", "priority", "channel", "mintAddress"],
      enabled:
        "flag AND client AND viewer !== null AND (enabled is undefined OR enabled)",
      initialPageParam: "undefined",
      nextPage: "hasMore ? lastEvaluatedKey : undefined",
      staleTimeMs: literal(objectProperty(queryOptions, "staleTime")),
      refetchIntervalMs: literal(
        objectProperty(queryOptions, "refetchInterval"),
      ),
      refetchIntervalInBackground: literal(
        objectProperty(queryOptions, "refetchIntervalInBackground"),
      ),
      refetchOnWindowFocus: literal(
        objectProperty(queryOptions, "refetchOnWindowFocus"),
      ),
      firstPageSideEffect:
        "When pageParam is falsy, call fetchUser after JSON decode and before mapping; do not await it",
      evidence: [
        inbox.witness(queryOptions, "query options"),
        inbox.witness(queryKey, "query cache key"),
        inbox.witness(enabled, "query gate"),
        scope.witness(scopeExport, "viewer selector"),
        inbox.witness(refresh, "first-page side effect"),
      ],
    },
    presentation: {
      flattenLoadedPages: true,
      deduplicate: false,
      unreadCountCoversOnlyLoadedVisibleItems: true,
      directMessageSubtypes: subtypeValues,
      excludeIfNavigationStartsWith: "/dms",
      excludeIfDeeplinkStartsWith: "pump://dms",
      malformedShapeMayThrow: true,
      evidence: [
        dm.witness(dmPredicate, "DM filter"),
        dm.witness(dmTypes, "DM subtypes"),
        inbox.witness(loaded, "loaded item flatten/filter"),
      ],
    },
    watermark: {
      storage: "browser localStorage",
      keyPrefix: watermarkPrefix,
      writerKeyInput: "exact argument, no trim",
      readerScope:
        "trimmed wallet address or null; distinct from query userId-first scope",
      defaultTimestamp: "new Date(adjustedClientClock()).toISOString()",
      nullMeansAllUnread: true,
      comparison: "valid item timestamp > valid watermark timestamp",
      equalIsUnread: false,
      invalidDateWithNonNullWatermarkIsUnread: false,
      readFailureResult: null,
      writeFailure: "swallowed; no memory fallback for current watermark",
      preOpenSnapshot:
        "in-memory before value retained per writer scope for row highlighting",
      crossTab:
        "storage events with null key or matching prefix notify subscribers",
      markReadServerMutation: false,
      evidence: [
        inbox.witness(watermarkRead, "storage reader"),
        inbox.witness(markOpen, "watermark writer"),
        inbox.witness(priorSnapshot, "previous snapshot"),
        inbox.witness(storageSubscription, "subscriptions"),
        clock.witness(clockNow, "adjusted clock"),
        topbar.witness(topbarOpen, "actual open call"),
        topbar.witness(topbarScope, "trimmed reader"),
      ],
    },
    sources: dependencies,
    limits: [
      "No observed inbox response, authenticated owner state, server persistence or read-receipt mutation.",
      "Ultimate Hermes upstream/auth enforcement and active page variant selection remain unknown.",
      "Existing settings recovery683 binds 12 dated configurations with Hermes unavailable; no current availability claim.",
      "Adapter omits Ky retries, timeout scheduling, ContractError wrapping, React/TanStack lifecycle, navigation, telemetry, delivery confirmation and clock synchronization.",
      "No captured JavaScript execution, production requests, native backend, push delivery or feature credit.",
    ],
  };
}
export async function verify(root = defaultRoot) {
  const recovered = await recover(root);
  const stored = JSON.parse(
    await readFile(path.join(root, outputPath), "utf8"),
  );
  assert(
    JSON.stringify(recovered) === JSON.stringify(stored),
    "generated contract differs from authenticated source",
  );
  return recovered;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2),
    at = args.indexOf("--root");
  assert(
    args.every(
      (arg, i) =>
        ["--write", "--check", "--root"].includes(arg) || i === at + 1,
    ),
    "unknown argument",
  );
  const root = at < 0 ? defaultRoot : path.resolve(args[at + 1]);
  if (args.includes("--write"))
    await writeFile(
      path.join(root, outputPath),
      JSON.stringify(await recover(root), null, 2) + "\n",
    );
  const result = await verify(root);
  console.log(
    JSON.stringify({
      result: "PASS",
      factories: result.inventoryVariants,
      operations: 1,
      providers: result.transport.providers.length,
      capturedCodeExecuted: false,
      requests: 0,
    }),
  );
}
