#!/usr/bin/env node
/** Bounded static source recovery. Never evaluates captured JavaScript or sends HTTP. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { parseExpression, parse } from "@babel/parser";
import { generate } from "@babel/generator";

const defaultRoot = fileURLToPath(new URL("..", import.meta.url));
export const outputPath = "contracts/settings-client-recovery.json";
const utf8 = (data) => new TextDecoder("utf-8", { fatal: true }).decode(data);
const sha = (data) => createHash("sha256").update(data).digest("hex");
const fail = (condition, message) => {
  if (!condition) throw new Error("Settings recovery: " + message);
};
function walk(node, visit, parent = null) {
  if (!node || typeof node !== "object") return;
  if (typeof node.type === "string") visit(node, parent);
  for (const [key, value] of Object.entries(node)) {
    if (["loc", "start", "end", "extra", "comments", "tokens"].includes(key))
      continue;
    if (Array.isArray(value))
      value.forEach((child) => walk(child, visit, node));
    else if (value && typeof value === "object") walk(value, visit, node);
  }
}
const nodes = (node, predicate) => {
  const found = [];
  walk(node, (n) => {
    if (predicate(n)) found.push(n);
  });
  return found;
};
const one = (items, label) => {
  fail(items.length === 1, `${label}: expected one, found ${items.length}`);
  return items[0];
};
const key = (node) =>
  node?.type === "Identifier"
    ? node.name
    : node?.type === "StringLiteral"
      ? node.value
      : undefined;
const member = (node, name) =>
  ["MemberExpression", "OptionalMemberExpression"].includes(node?.type) &&
  key(node.property) === name;
const callee = (node) =>
  node?.type === "SequenceExpression" ? node.expressions.at(-1) : node;
const call = (node, name) =>
  node?.type === "CallExpression" && member(callee(node.callee), name);
const print = (node) => generate(node, { compact: true, comments: false }).code;
function literal(node) {
  if (
    ["StringLiteral", "NumericLiteral", "BooleanLiteral"].includes(node?.type)
  )
    return node.value;
  if (node?.type === "NullLiteral") return null;
  if (node?.type === "UnaryExpression" && node.operator === "!")
    return !literal(node.argument);
  if (node?.type === "ArrayExpression") return node.elements.map(literal);
  throw new Error("Settings recovery: expected captured literal");
}
function properties(node) {
  fail(node?.type === "ObjectExpression", "expected object expression");
  return Object.fromEntries(
    node.properties.map((p) => {
      fail(p.type === "ObjectProperty", "unexpected spread in literal object");
      return [key(p.key), p.value];
    }),
  );
}
function exported(mod, name, id) {
  for (const n of nodes(
    mod.ast,
    (n) => call(n, "s") && n.arguments[0]?.type === "ArrayExpression",
  )) {
    if (n.arguments[1] && literal(n.arguments[1]) !== id) continue;
    const entries = n.arguments[0].elements;
    for (let at = 0; at < entries.length; at += 3)
      if (entries[at]?.value === name) return entries[at + 2];
  }
  throw new Error(`Settings recovery: export ${id}.${name} missing`);
}
function functionContaining(mod, node) {
  let parent = mod.parents.get(node);
  while (
    parent &&
    !["ArrowFunctionExpression", "FunctionExpression"].includes(parent.type)
  )
    parent = mod.parents.get(parent);
  fail(parent, "enclosing function missing");
  return parent;
}

function imports(mod) {
  return new Map(
    nodes(
      mod.ast,
      (n) =>
        n.type === "VariableDeclarator" &&
        n.id.type === "Identifier" &&
        n.init?.type === "CallExpression" &&
        ["i", "r"].some((k) => call(n.init, k)) &&
        n.init.arguments[0]?.type === "NumericLiteral",
    ).map((n) => [n.id.name, n.init.arguments[0].value]),
  );
}
function importedCall(mod, node, id, name) {
  const target = callee(node?.callee);
  return (
    call(node, name) &&
    target.object?.type === "Identifier" &&
    imports(mod).get(target.object.name) === id
  );
}
function nearestBlock(mod, node) {
  let current = node;
  while (current && current.type !== "BlockStatement")
    current = mod.parents.get(current);
  return current;
}
function assignedValue(mod, name, context = mod.ast.body) {
  let block = nearestBlock(mod, context);
  while (block) {
    const declarations = nodes(
      block,
      (n) =>
        n.type === "VariableDeclarator" &&
        n.id.type === "Identifier" &&
        n.id.name === name &&
        nearestBlock(mod, n) === block,
    );
    if (declarations.length) {
      const values = nodes(
        block,
        (n) =>
          n.type === "AssignmentExpression" &&
          n.left.type === "Identifier" &&
          n.left.name === name &&
          nearestBlock(mod, n) === block,
      ).map((n) => n.right);
      values.push(...declarations.map((n) => n.init).filter(Boolean));
      const direct = values.filter(
        (value) =>
          !(
            value.type === "MemberExpression" &&
            value.computed &&
            value.property.type === "NumericLiteral"
          ),
      );
      if (direct.length === 1 && values.length > 1) {
        for (const cached of values.filter((v) => v !== direct[0]))
          fail(
            nodes(
              block,
              (n) =>
                n.type === "AssignmentExpression" &&
                print(n.left) === print(cached) &&
                n.right.type === "Identifier" &&
                n.right.name === name &&
                nearestBlock(mod, n) === block,
            ).length > 0,
            "unproven React compiler memo mirror",
          );
        return direct[0];
      }
      return one(values, "lexical binding " + name);
    }
    block = nearestBlock(mod, mod.parents.get(block));
  }
  throw new Error("Settings recovery: lexical binding missing: " + name);
}
function assignedName(mod, node) {
  const p = mod.parents.get(node);
  fail(
    p?.type === "AssignmentExpression" && p.left.type === "Identifier",
    "assigned function binding",
  );
  return p.left.name;
}
function exportedValue(mod, name, id) {
  const value = exported(mod, name, id);
  return value.type === "Identifier" ? assignedValue(mod, value.name) : value;
}

export function parseFlightRecords(stream) {
  const bytes = Buffer.from(stream, "utf8"),
    records = new Map();
  let cursor = 0;
  while (cursor < bytes.length) {
    if (bytes[cursor] === 10) {
      cursor++;
      continue;
    }
    const colon = bytes.indexOf(58, cursor);
    if (colon === cursor) {
      fail(
        [72, 78].includes(bytes[colon + 1]),
        "unsupported unnumbered Flight tag",
      );
      const newline = bytes.indexOf(10, colon + 1);
      cursor = newline < 0 ? bytes.length : newline + 1;
      continue;
    }
    fail(
      colon > cursor && colon - cursor <= 16,
      "invalid Flight record header",
    );
    const id = bytes.subarray(cursor, colon).toString();
    fail(/^[0-9a-f]+$/.test(id), "invalid Flight id");
    const start = colon + 1;
    if (bytes[start] === 84) {
      const comma = bytes.indexOf(44, start + 1),
        sizeText = bytes.subarray(start + 1, comma).toString();
      fail(
        comma > start + 1 && /^[0-9a-f]+$/.test(sizeText),
        "invalid Flight text size",
      );
      const size = Number.parseInt(sizeText, 16);
      fail(
        Number.isSafeInteger(size) && comma + 1 + size <= bytes.length,
        "truncated Flight text",
      );
      records.set(id, {
        kind: "text",
        value: bytes.subarray(comma + 1, comma + 1 + size).toString("utf8"),
      });
      cursor = comma + 1 + size;
      continue;
    }
    const newline = bytes.indexOf(10, start);
    let raw = bytes
        .subarray(start, newline < 0 ? bytes.length : newline)
        .toString("utf8"),
      kind = "value";
    if (raw.startsWith("I")) {
      kind = "import";
      raw = raw.slice(1);
    }
    try {
      records.set(id, { kind, value: JSON.parse(raw) });
    } catch {
      /* Other non-JSON Flight tags are not interpreted. */
    }
    cursor = newline < 0 ? bytes.length : newline + 1;
  }
  return records;
}
function capturedConfigurations(read, manifest) {
  const found = [];
  for (const record of manifest.records.filter(
    (r) =>
      r.path &&
      (r.content_type?.includes("text/html") ||
        r.headers?.["content-type"]?.includes("text/html")),
  )) {
    const bytes = read(record.path);
    fail(sha(bytes) === record.sha256, "HTML capture hash " + record.path);
    const html = utf8(bytes),
      fragments = [];
    for (const match of html.matchAll(
      /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
    )) {
      if (!match[1].includes("__next_f")) continue;
      const ast = parse(match[1], { sourceType: "script" });
      for (const push of nodes(
        ast,
        (n) =>
          call(n, "push") &&
          n.arguments[0]?.type === "ArrayExpression" &&
          n.arguments[0].elements[0]?.value === 1 &&
          n.arguments[0].elements[1]?.type === "StringLiteral",
      ))
        fragments.push(push.arguments[0].elements[1].value);
    }
    if (!fragments.length) continue;
    const records = parseFlightRecords(fragments.join(""));
    const exportedName = (value) =>
      typeof value === "string" && /^\$[0-9a-f]+$/.test(value)
        ? records.get(value.slice(1))?.value
        : value;
    const providers = [...records].filter(
      ([, r]) =>
        r.kind === "import" &&
        Array.isArray(r.value) &&
        r.value[0] === 96224 &&
        exportedName(r.value[2]) === "ApiClientsConfigProvider",
    );
    for (const [importId] of providers)
      for (const [flightId, row] of records) {
        function visit(value) {
          if (
            Array.isArray(value) &&
            value[0] === "$" &&
            value[1] === "$L" + importId &&
            value[3] &&
            typeof value[3].config === "object"
          ) {
            const c = value[3].config;
            fail(
              typeof c.clientServerUrl === "string" &&
                typeof c.hermesNotificationsAvailable === "boolean",
              "captured provider config shape",
            );
            found.push({
              source: record.path,
              url: record.url,
              captured_object_sha256: record.sha256,
              flight_import_record: importId,
              flight_value_record: flightId,
              provider_module: 96224,
              config: {
                clientServerUrl: c.clientServerUrl,
                hermesNotificationsAvailable: c.hermesNotificationsAvailable,
              },
              api_bearer_token_present: typeof c.apiBearerToken === "string",
            });
          }
          if (value && typeof value === "object")
            for (const child of Object.values(value)) visit(child);
        }
        visit(row.value);
      }
  }
  fail(found.length > 0, "no captured HTML provider configurations");
  return found;
}

export function recover(root = defaultRoot) {
  const read = (name) => fs.readFileSync(path.join(root, name));
  const catalogBytes = read("recovered/modules.json"),
    catalog = JSON.parse(catalogBytes);
  fail(
    catalog.rangeEncoding ===
      "UTF-16 code-unit half-open offsets in UTF-8 decoded source",
    "unknown catalog range encoding",
  );
  fail(
    catalog.modules.length === 5947,
    "expected the full pinned 5,947-factory inventory, not a capped graph",
  );
  const manifestBytes = read("evidence/web/manifest.json"),
    manifest = JSON.parse(manifestBytes);
  const capture = new Map(
    manifest.records.filter((r) => r.path).map((r) => [r.path, r]),
  );
  const variants = (id) => catalog.modules.filter((r) => r.ids.includes(id));
  const modules = new Map();
  function load(id) {
    const records = variants(id);
    fail(records.length > 0, `factory ${id} unresolved`);
    return records.map((record) => {
      if (modules.has(record.sha256)) return modules.get(record.sha256);
      const origins = record.origins.map((origin) => {
        fail(
          typeof origin.source === "string" &&
            origin.source.startsWith("evidence/web/objects/") &&
            !origin.source.split("/").includes(".."),
          "invalid capture path",
        );
        const bytes = read(origin.source),
          receipt = capture.get(origin.source);
        fail(
          receipt &&
            sha(bytes) === receipt.sha256 &&
            receipt.url === origin.url,
          `capture binding ${origin.source}`,
        );
        const text = utf8(bytes);
        fail(
          Number.isSafeInteger(origin.start) &&
            Number.isSafeInteger(origin.end) &&
            origin.start >= 0 &&
            origin.end > origin.start &&
            origin.end <= text.length,
          "invalid UTF-16 range",
        );
        const source = text.slice(origin.start, origin.end);
        fail(sha(source) === record.sha256, `factory hash ${id}`);
        return {
          ...origin,
          captured_object_sha256: receipt.sha256,
          text: source,
        };
      });
      fail(
        origins.length > 0 && origins.every((o) => o.text === origins[0].text),
        `factory variants differ inside one record ${id}`,
      );
      const source = origins[0].text;
      const ast = parseExpression(source),
        parents = new Map();
      walk(ast, (n, p) => parents.set(n, p));
      const mod = { record, source, ast, parents, origins };
      modules.set(record.sha256, mod);
      return mod;
    });
  }
  const sole = (id) => one(load(id), "factory " + id);
  const cite = (mod, node) => ({
    factory_sha256: mod.record.sha256,
    ranges: mod.origins.map((o) => ({
      source: o.source,
      start: o.start + node.start,
      end: o.start + node.end,
    })),
    expression: mod.source.slice(node.start, node.end),
  });
  const settings = sole(917781),
    clients = load(944410),
    transport = sole(30181),
    cache = sole(484018),
    scope = sole(92245),
    scopeHook = sole(779106),
    flag = sole(322315);
  fail(clients.length === 2, "both captured 944410 variants must be reviewed");
  const providers = clients.map((mod) => {
    const hook = exported(mod, "useHermesApiClient", 944410);
    const gate = one(
      nodes(
        hook,
        (n) =>
          n.type === "ConditionalExpression" &&
          member(n.test, "hermesNotificationsAvailable"),
      ),
      "Hermes provider gate",
    );
    fail(
      gate.alternate.type === "NullLiteral" &&
        importedCall(mod, gate.consequent, 30181, "p"),
      "unexpected Hermes provider fallback/client import",
    );
    return {
      factory_sha256: mod.record.sha256,
      runtime_configuration_gate: "hermesNotificationsAvailable",
      disabled_result: null,
      client_factory: 30181,
      client_export: "p",
      evidence: cite(mod, gate),
    };
  });
  const client = exported(transport, "p", 30181),
    created = one(
      nodes(client, (n) => call(n, "create")),
      "Hermes client creation",
    ),
    options = properties(created.arguments[0]);
  fail(
    Object.keys(options).sort().join() === "prefixUrl,timeout",
    "Hermes options changed; inspect auth/hooks before refreshing",
  );
  const prefix = literal(options.prefixUrl),
    timeout = literal(options.timeout);
  fail(prefix === "/api/hermes", "unexpected Hermes prefix");
  const operationCalls = ["get", "put"].map((method) =>
    one(
      nodes(
        settings.ast,
        (n) =>
          call(n, method) &&
          n.arguments[0]?.value === "v1/user-preferences/settings",
      ),
      method + " settings",
    ),
  );
  const [get, put] = operationCalls;
  for (const request of operationCalls)
    fail(
      importedCall(
        settings,
        assignedValue(settings, request.callee.object.name, request),
        944410,
        "useHermesApiClient",
      ),
      "settings must use imported Hermes client",
    );
  const jsonGet = settings.parents.get(settings.parents.get(get));
  fail(
    call(jsonGet, "json") && jsonGet.arguments.length === 0,
    "GET does not use bare JSON decoding",
  );
  fail(
    one(
      nodes(
        functionContaining(settings, get),
        (n) => n.type === "ReturnStatement",
      ),
      "GET return",
    ).argument === jsonGet,
    "GET must return decoded JSON directly without a schema wrapper",
  );
  const putFn = functionContaining(settings, put),
    payload = one(putFn.params, "PUT input");
  fail(payload.type === "Identifier", "PUT input changed");
  const putOptions = properties(put.arguments[1]);
  fail(
    Object.keys(putOptions).join() === "json" &&
      putOptions.json.name === payload.name,
    "PUT must serialize its supplied input as JSON",
  );
  const returns = nodes(putFn, (n) => n.type === "ReturnStatement");
  const returned = one(returns, "PUT return").argument;
  fail(
    returned?.type === "SequenceExpression" &&
      returned.expressions.at(-1).name === payload.name &&
      returned.expressions.some(
        (n) => n.type === "AwaitExpression" && n.argument === put,
      ),
    "PUT must await HTTP then return its input without decoding response",
  );
  const cacheCall = one(
    nodes(settings.ast, (n) => call(n, "setQueryData")),
    "settings cache write",
  );
  const cacheFn = functionContaining(settings, cacheCall);
  const mutationOptions = one(
    nodes(
      settings.ast,
      (n) =>
        n.type === "ObjectExpression" &&
        n.properties.some(
          (p) =>
            key(p.key) === "mutationFn" &&
            p.value.name === assignedName(settings, putFn),
        ),
    ),
    "PUT mutation options",
  );
  const mutationProperties = properties(mutationOptions);
  fail(
    Object.keys(mutationProperties).sort().join() === "mutationFn,onSuccess" &&
      mutationProperties.onSuccess.name === assignedName(settings, cacheFn),
    "success cache handler / local error policy changed",
  );
  fail(
    cacheFn.params.length === 1 &&
      cacheCall.arguments[1].name === cacheFn.params[0].name &&
      call(cacheCall.arguments[0], "settings"),
    "cache must receive submitted mutation result",
  );
  const cacheKeys = properties(
    one(
      nodes(
        cache.ast,
        (n) =>
          n.type === "ObjectExpression" &&
          n.properties.some((p) => key(p.key) === "settings"),
      ),
      "Hermes cache keys",
    ),
  );
  const cacheKeyBody = cacheKeys.settings.body;
  fail(
    cacheKeyBody.type === "ArrayExpression" &&
      cacheKeyBody.elements.length === 3,
    "settings query key shape",
  );
  const cachePrefix = cacheKeyBody.elements.slice(0, 2).map(literal);
  const merge = one(
    nodes(
      settings.ast,
      (n) =>
        n.type === "ObjectExpression" &&
        n.properties.length === 3 &&
        n.properties.map((p) => key(p.key)).join() === "chat,social,coins" &&
        n.properties.every(
          (p) =>
            p.value?.type === "ObjectExpression" &&
            p.value.properties.every((v) => v.type === "SpreadElement"),
        ),
    ),
    "settings merge",
  );
  const mergeGate = settings.parents.get(merge);
  fail(
    mergeGate.type === "ConditionalExpression" &&
      mergeGate.alternate.type === "NullLiteral" &&
      mergeGate.test.type === "Identifier",
    "truthy loaded-data gate",
  );
  const dataName = mergeGate.test.name;
  for (const p of merge.properties) {
    fail(
      p.value.properties.length === 2 &&
        member(p.value.properties[0].argument, key(p.key)) &&
        p.value.properties[0].argument.object.name === dataName &&
        member(p.value.properties[1].argument, key(p.key)),
      "merge must spread existing group before patch",
    );
  }
  const controls = nodes(
    settings.ast,
    (n) =>
      n.type === "LogicalExpression" &&
      n.operator === "??" &&
      member(n.left, key(n.left?.property)) &&
      n.left.object?.type === "OptionalMemberExpression" &&
      n.left.object.object?.name === dataName,
  )
    .map((n) => {
      const group = key(n.left.object.property),
        field = key(n.left.property);
      fail(
        n.left.type === "OptionalMemberExpression" &&
          n.left.optional === false &&
          n.left.object.optional === true,
        "only the response base may be optional in the observed control",
      );
      return {
        group,
        field,
        fallback: literal(n.right),
        operator: "??",
        optional_base_only: true,
        nested_group_must_exist_for_nonnull_response: true,
        evidence: cite(settings, n),
      };
    })
    .sort((a, b) =>
      a.group + "." + a.field < b.group + "." + b.field
        ? -1
        : a.group + "." + a.field > b.group + "." + b.field
          ? 1
          : 0,
    );
  fail(
    controls.length === 9,
    "expected nine observed controls; do not infer a complete server schema",
  );
  const scopeFn = exported(scope, "$", 92245),
    scopePrint = print(scopeFn);
  fail(
    scopePrint.includes("userId?.trim()") &&
      scopePrint.includes("address?.trim()||null"),
    "viewer key preference changed",
  );
  const scopeReturn = one(
    nodes(scopeFn, (n) => n.type === "ReturnStatement"),
    "viewer key return",
  ).argument;
  fail(
    scopeReturn.type === "ConditionalExpression" &&
      scopeReturn.test.type === "Identifier" &&
      scopeReturn.consequent.name === scopeReturn.test.name &&
      scopeReturn.alternate.type === "LogicalExpression" &&
      scopeReturn.alternate.operator === "||" &&
      scopeReturn.alternate.right.type === "NullLiteral",
    "viewer userId must precede the address fallback",
  );
  const scopeInitial = one(
    nodes(
      scopeFn,
      (n) =>
        n.type === "VariableDeclarator" && n.id.name === scopeReturn.test.name,
    ),
    "viewer preferred field",
  ).init;
  fail(
    member(scopeInitial.callee, "trim") &&
      member(scopeInitial.callee.object, "userId") &&
      member(scopeReturn.alternate.left.callee, "trim") &&
      member(scopeReturn.alternate.left.callee.object, "address"),
    "viewer field ordering or trimming changed",
  );
  const queryScopeCalls = nodes(
    settings.ast,
    (n) =>
      n.type === "CallExpression" &&
      n.arguments[0]?.value === "hermes-settings",
  );
  fail(queryScopeCalls.length === 2, "GET and PUT account scope calls");
  const getFn = functionContaining(settings, get),
    beforeRequest = exportedValue(transport, "d", 30181);
  const serverOptions = properties(
    one(
      nodes(beforeRequest, (n) => call(n, "create")),
      "client-server creation",
    ).arguments[0],
  );
  fail(
    member(serverOptions.prefixUrl, "clientServerUrl"),
    "client-server base selector",
  );
  const beforeHooks = properties(serverOptions.hooks).beforeRequest.elements;
  const headerHook = one(
    beforeHooks
      .map((n) => assignedValue(transport, n.name))
      .filter(
        (fn) =>
          nodes(
            fn,
            (n) =>
              n.type === "LogicalExpression" &&
              n.operator === "||" &&
              call(n.left, "has") &&
              call(n.right, "set"),
          ).length === 1,
      ),
    "default header hook",
  );
  const headerMap = assignedValue(
    transport,
    one(
      nodes(headerHook, (n) => call(n, "entries")),
      "header entries",
    ).arguments[0].name,
  );
  const serverHeaders = Object.fromEntries(
    Object.entries(properties(headerMap)).map(([name, value]) => [
      name,
      literal(value),
    ]),
  );
  const presence = sole(85509),
    aggregate = sole(402030),
    contractClient = sole(898661),
    contractError = sole(858694);
  sole(183184);
  const presenceRoute = one(
    nodes(
      presence.ast,
      (n) =>
        n.type === "ObjectExpression" &&
        n.properties.some((p) => key(p.key) === "GET /presence/settings"),
    ),
    "presence contract declaration",
  );
  const presenceEntries = properties(presenceRoute),
    readPresence = properties(presenceEntries["GET /presence/settings"]),
    updatePresence = properties(presenceEntries["PATCH /presence/settings"]);
  fail(
    readPresence.response.type === "Identifier" &&
      updatePresence.response.name === readPresence.response.name,
    "shared presence response schema",
  );
  const declaration = one(
    nodes(
      presence.ast,
      (n) =>
        n.type === "VariableDeclarator" &&
        n.id.name === readPresence.response.name,
    ),
    "presence response schema",
  );
  const propertySchema = properties(
    declaration.init.arguments[0],
  ).sharesLastActive;
  const bodySchema = properties(
    updatePresence.body.arguments[0],
  ).sharesLastActive;
  fail(
    nodes(propertySchema, (n) => call(n, "boolean")).length === 1 &&
      nodes(bodySchema, (n) => call(n, "boolean")).length === 1 &&
      nodes(bodySchema, (n) => call(n, "optional")).length === 1,
    "presence boolean/optional shape",
  );
  const describe = (schema) =>
    literal(
      one(
        nodes(schema, (n) => call(n, "describe")),
        "presence description",
      ).arguments[0],
    );
  const configProvider = sole(96224),
    configSchema = sole(894228);
  const providerFn = exported(
    configProvider,
    "ApiClientsConfigProvider",
    96224,
  );
  const configParse = one(
    nodes(providerFn, (n) => call(n, "parse")),
    "runtime API config validator",
  );
  fail(
    configParse.callee.object?.type === "MemberExpression" &&
      configParse.callee.object.property.name === "f" &&
      imports(configProvider).get(configParse.callee.object.object.name) ===
        894228,
    "API configuration schema import",
  );
  const schemaDefinition = exportedValue(configSchema, "f", 894228);
  const schemaFields = properties(schemaDefinition.arguments[0]);
  fail(
    nodes(schemaFields.clientServerUrl, (n) => call(n, "url")).length === 1 &&
      nodes(schemaFields.hermesNotificationsAvailable, (n) =>
        call(n, "boolean"),
      ).length === 1 &&
      nodes(schemaFields.hermesNotificationsAvailable, (n) =>
        call(n, "optional"),
      ).length === 1,
    "URL/optional availability schema",
  );
  const configurations = capturedConfigurations(read, manifest);
  const concreteOrigins = [
    ...new Set(configurations.map((c) => c.config.clientServerUrl)),
  ].sort();
  const availability = [
    ...new Set(
      configurations.map((c) => c.config.hermesNotificationsAvailable),
    ),
  ];
  const ledgerBytes = read("contracts/internal-operations.json"),
    ledger = JSON.parse(ledgerBytes);
  const ledgerOperations = new Set(ledger.operations.map((o) => o.operation));
  fail(ledger.operations.length === 330, "unexpected baseline ledger");
  fail(
    ![...ledgerOperations].some((o) => o.includes("user-preferences/settings")),
    "Hermes operations already in baseline; reassess novelty",
  );
  const retry = one(
    nodes(
      transport.ast,
      (n) =>
        n.type === "ObjectExpression" &&
        n.properties.some((p) => key(p.key) === "afterStatusCodes") &&
        n.properties.some((p) => key(p.key) === "methods"),
    ),
    "Ky retry defaults",
  );
  const retryProps = properties(retry);
  const inputModules = [...modules.values()].map((mod) => ({
    ids: mod.record.ids,
    factory_sha256: mod.record.sha256,
    recovered_path: mod.record.path,
    origins: mod.origins.map(({ text, ...origin }) => origin),
    imports: nodes(
      mod.ast,
      (n) =>
        n.type === "CallExpression" &&
        ["i", "r", "A"].some((k) => call(n, k)) &&
        n.arguments[0]?.type === "NumericLiteral",
    ).map((n) => ({
      id: n.arguments[0].value,
      kind: key(n.callee.property),
      status: variants(n.arguments[0].value).length
        ? "captured-variants"
        : "unresolved-in-full-inventory",
      variants: variants(n.arguments[0].value).map((v) => ({
        path: v.path,
        sha256: v.sha256,
      })),
    })),
  }));
  const enabled = one(
    nodes(
      settings.ast,
      (n) =>
        n.type === "AssignmentExpression" &&
        n.right?.type === "UnaryExpression" &&
        print(n.right).includes("!==") &&
        print(n.right).includes("&&") &&
        nodes(
          n.right,
          (v) => v.type === "Identifier" && v.name === get.callee.object.name,
        ).length > 0,
    ),
    "settings query enabled gate",
  );
  let boolean = enabled.right;
  fail(
    boolean.operator === "!" &&
      boolean.argument.type === "UnaryExpression" &&
      boolean.argument.operator === "!",
    "query boolean coercion",
  );
  const conjuncts = [];
  function and(n) {
    if (n.type === "LogicalExpression" && n.operator === "&&") {
      and(n.left);
      and(n.right);
    } else conjuncts.push(n);
  }
  and(boolean.argument.argument);
  fail(conjuncts.length === 3, "query gate must have three AND terms");
  const clientTerm = one(
    conjuncts.filter(
      (n) => n.type === "Identifier" && n.name === get.callee.object.name,
    ),
    "query client gate",
  );
  const scopeTerm = one(
    conjuncts.filter(
      (n) =>
        n.type === "BinaryExpression" &&
        n.operator === "!==" &&
        n.left.type === "NullLiteral" &&
        n.right.type === "Identifier",
    ),
    "nonnull viewer gate",
  );
  fail(
    importedCall(
      settings,
      assignedValue(settings, scopeTerm.right.name, enabled),
      779106,
      "f",
    ),
    "viewer scope hook import",
  );
  const flagTerm = one(
    conjuncts.filter((n) => n !== clientTerm && n !== scopeTerm),
    "feature flag gate",
  );
  fail(
    flagTerm.type === "Identifier" &&
      importedCall(
        settings,
        assignedValue(settings, flagTerm.name, enabled),
        528798,
        "f",
      ),
    "feature flag hook import",
  );
  const flagValue = literal(
    one(
      nodes(
        flag.ast,
        (n) =>
          n.type === "AssignmentExpression" &&
          member(n.left, "WEB_HERMES_NOTIFICATIONS"),
      ),
      "flag value",
    ).right,
  );
  const getName = assignedName(settings, getFn);
  const queryOptions = properties(
    one(
      nodes(
        settings.ast,
        (n) =>
          n.type === "ObjectExpression" &&
          n.properties.some(
            (p) => key(p.key) === "queryFn" && p.value.name === getName,
          ),
      ),
      "GET query options",
    ),
  );
  fail(
    queryOptions.enabled.name === enabled.left.name,
    "GET uses recovered enabled gate",
  );
  const keyCall = assignedValue(settings, queryOptions.queryKey.name, get);
  fail(
    call(keyCall, "settings") &&
      keyCall.arguments[0].name === scopeTerm.right.name,
    "GET uses viewer-scoped settings key",
  );
  for (const settingsKey of [keyCall, cacheCall.arguments[0]]) {
    const owner = settingsKey.callee.object;
    fail(
      member(owner, "F") && imports(settings).get(owner.object.name) === 484018,
      "GET/mutation cache must use the captured Hermes key builder",
    );
  }
  const mutationScope = cacheCall.arguments[0].arguments[0];
  fail(
    mutationScope.type === "Identifier" &&
      importedCall(
        settings,
        assignedValue(settings, mutationScope.name, cacheCall),
        779106,
        "f",
      ),
    "mutation cache must use the current viewer selector",
  );
  const successClient = one(
    nodes(
      contractClient.ast,
      (n) =>
        n.type === "ReturnStatement" &&
        n.argument?.type === "AwaitExpression" &&
        call(n.argument.argument, "json"),
    ),
    "generic success JSON decode",
  );
  const errorDecoder = one(
    nodes(
      contractClient.ast,
      (n) =>
        n.type === "VariableDeclarator" &&
        n.init?.type === "ArrowFunctionExpression" &&
        n.init.async &&
        nodes(n.init, (x) => call(x, "safeParse")).length === 2,
    ),
    "shared contract error decoder",
  ).init;
  fail(
    nodes(
      errorDecoder,
      (n) => n.type === "NewExpression" && member(n.callee, "ContractError"),
    ).length === 1,
    "shared ContractError wrapper",
  );
  const httpErrorDefault = one(
    nodes(
      transport.ast,
      (n) =>
        n.type === "ObjectProperty" &&
        key(n.key) === "throwHttpErrors" &&
        n.value.type === "LogicalExpression" &&
        n.value.operator === "??",
    ),
    "HTTP error default",
  );
  fail(
    literal(httpErrorDefault.value.right) === true,
    "HTTP errors must be enabled by default",
  );
  const emptyJson = one(
    nodes(
      transport.ast,
      (n) =>
        n.type === "ConditionalExpression" &&
        n.test.type === "BinaryExpression" &&
        n.test.operator === "===" &&
        n.test.left.type === "StringLiteral" &&
        n.test.left.value === "" &&
        n.consequent.type === "StringLiteral" &&
        n.consequent.value === "",
    ),
    "Ky empty JSON result",
  );
  const noContentJson = one(
    nodes(
      transport.ast,
      (n) =>
        n.type === "IfStatement" &&
        n.test.type === "BinaryExpression" &&
        n.test.operator === "===" &&
        n.test.left.value === 204 &&
        member(n.test.right, "status") &&
        n.consequent.type === "ReturnStatement" &&
        n.consequent.argument?.type === "StringLiteral" &&
        n.consequent.argument.value === "",
    ),
    "Ky 204 JSON result",
  );
  return {
    schemaVersion: 1,
    authority:
      "Original captured website client source; static contract recovery only",
    compatibilityQualified: false,
    inventory: {
      factory_count: catalog.modules.length,
      catalog_sha256: sha(catalogBytes),
      capture_manifest_sha256: sha(manifestBytes),
      capture_time: manifest.captured_at,
      range_encoding: catalog.rangeEncoding,
      resolution:
        "All literal direct imports in this bounded slice resolved against every variant in the full inventory; not a whole-application graph or runtime reachability proof",
    },
    operations: [get, put].map((n, i) => ({
      method: i ? "PUT" : "GET",
      input: "v1/user-preferences/settings",
      browser_request_path: prefix + "/v1/user-preferences/settings",
      origin_classification: "browser-same-origin-relative-proxy",
      ultimate_proxy_upstream: null,
      body: i
        ? { encoding: "json", source: "submitted merged preference object" }
        : null,
      success: i
        ? {
            await_http: true,
            parse_response_body: false,
            return_value: "submitted object",
            cache_value: "submitted object",
          }
        : {
            decoder: "Ky .json()",
            runtime_schema_validation: false,
            empty_or_204_json_result: "",
            empty_json_evidence: [
              cite(transport, emptyJson),
              cite(transport, noContentJson),
            ],
          },
      evidence: cite(settings, i ? putFn : getFn),
    })),
    transport: {
      prefixUrl: prefix,
      timeout_ms: timeout,
      credentials_option: "not supplied; browser Request default same-origin",
      authorization_header_hook: false,
      pump_source_header_hooks: false,
      library_http_errors: true,
      retry_defaults: {
        limit: literal(retryProps.limit),
        methods: literal(retryProps.methods),
        status_codes: literal(retryProps.statusCodes),
        retry_on_timeout: literal(retryProps.retryOnTimeout),
      },
      provider_variants: providers,
      evidence: cite(transport, client),
      http_error_default_evidence: cite(transport, httpErrorDefault),
      auth_boundary:
        "No backend cookie/session enforcement or proxy handler was captured here; client options are not an authentication proof",
    },
    settings: {
      controls,
      server_default_values_known: false,
      complete_server_schema_known: false,
      query: {
        key_prefix: cachePrefix,
        scope: "trimmed userId if truthy, otherwise trimmed address or null",
        scope_rule: {
          field_precedence: ["userId", "address"],
          trim: true,
          empty_result: null,
        },
        scope_evidence: cite(scope, scopeFn),
        enabled: "feature flag AND non-null client AND scope !== null",
        enabled_rule: {
          operator: "AND",
          feature_flag_required: true,
          client_required: true,
          scope_must_be_nonnull: true,
        },
        enabled_evidence: cite(settings, enabled),
        feature_flag: flagValue,
        configuration_gate: "hermesNotificationsAvailable",
        captured_configuration_values: availability,
        captured_configuration_disables_query:
          availability.length === 1 && availability[0] === false,
      },
      update: {
        requires_truthy_loaded_data: true,
        groups: ["chat", "social", "coins"],
        order: "existing group spread, then partial group patch",
        unknown_existing_group_fields_preserved: true,
        unknown_top_level_groups_not_copied: true,
        merge_evidence: cite(settings, mergeGate),
        cache_on_success: {
          key_prefix: cachePrefix,
          scope: "current mutation viewer key",
          value: "same submitted object",
          response_body_not_read: true,
          evidence: cite(settings, cacheCall),
        },
        per_mutation_on_error:
          "none supplied here; global query client configuration unresolved",
      },
    },
    presence: {
      classification:
        "already present in baseline 330; schema companion, no new operation credit",
      error_response: {
        path: "shared createContractClient only; Hermes uses its separate bare Ky client",
        decoder: "JSON.parse response text, otherwise raw text",
        typed_data:
          "route error schema, then generic contractErrorBody, then statusCode-only fallback",
        wrapper: "ContractError",
        operation_error_codes_known: false,
        evidence: cite(contractClient, errorDecoder),
      },
      operations: ["GET /presence/settings", "PATCH /presence/settings"],
      owner_only_description: literal(readPresence.summary),
      response: {
        sharesLastActive: {
          type: "boolean",
          required: true,
          description: describe(propertySchema),
        },
      },
      patch: {
        sharesLastActive: {
          type: "boolean",
          optional: true,
          description: describe(bodySchema),
        },
      },
      declared_response_schema_runtime_enforcement:
        "Generic contract client returns .json() on success without parsing this schema",
      service_binding: {
        base: "runtime clientServerUrl",
        credentials: literal(serverOptions.credentials),
        headers: serverHeaders,
        header_policy: "set only when the request header is absent",
        header_evidence: [
          cite(transport, headerMap),
          cite(transport, headerHook),
        ],
        captured_request_urls: concreteOrigins.map(
          (origin) =>
            new URL(
              "presence/settings",
              origin.endsWith("/") ? origin : origin + "/",
            ).href,
        ),
        captured_service_origins: concreteOrigins,
        actual_presence_hook_callsite_found: false,
      },
      evidence: [
        cite(presence, presenceRoute),
        cite(contractClient, successClient),
        cite(
          aggregate,
          one(
            nodes(
              aggregate.ast,
              (n) =>
                n.type === "SpreadElement" &&
                member(n.argument, "presenceRoutes"),
            ),
            "presence aggregation",
          ),
        ),
        cite(transport, beforeRequest),
        cite(
          contractClient,
          one(
            nodes(
              contractClient.ast,
              (n) =>
                n.type === "AssignmentExpression" &&
                member(n.left, "createContractClient") &&
                n.right.type === "ArrowFunctionExpression",
            ),
            "contract client",
          ),
        ),
      ],
    },
    configuration: {
      schema_enforced_at_provider: true,
      provider_factory: 96224,
      schema_factory: 894228,
      schema_evidence: cite(configSchema, schemaDefinition),
      parse_evidence: cite(configProvider, configParse),
      captured_configurations: configurations,
      interpretation:
        "These are dated SSR configurations, not current service availability or a Hermes upstream proxy binding",
    },
    novelty: {
      baseline_operations: 330,
      baseline_ledger_sha256: sha(ledgerBytes),
      new_settings_operations: 2,
      baseline_ledger_rewritten: false,
    },
    unresolved_direct_import_ids: [
      ...new Set(
        inputModules.flatMap((m) =>
          m.imports
            .filter((i) => i.status === "unresolved-in-full-inventory")
            .map((i) => i.id),
        ),
      ),
    ].sort((a, b) => a - b),
    unresolved: [
      {
        boundary: "Hermes server proxy",
        reason:
          "Only /api/hermes client prefix is observed; no ultimate upstream/auth enforcement implementation",
      },
      {
        boundary: "presence invocation",
        reason:
          "Declaration and generic client available; no concrete presence settings hook invocation established; URL is a dated provider configuration binding",
      },
    ],
    sources: inputModules,
  };
}

export function verify(root = defaultRoot) {
  const generated = recover(root),
    actual = JSON.parse(fs.readFileSync(path.join(root, outputPath), "utf8"));
  fail(
    JSON.stringify(actual) === JSON.stringify(generated),
    "generated contract differs from checked-in source bindings",
  );
  return generated;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const argv = process.argv.slice(2);
  const rootAt = argv.indexOf("--root"),
    root = rootAt < 0 ? defaultRoot : path.resolve(argv[rootAt + 1]);
  fail(
    argv.every(
      (v, i) =>
        ["--write", "--check", "--root"].includes(v) || i === rootAt + 1,
    ),
    "unknown argument",
  );
  if (argv.includes("--write"))
    fs.writeFileSync(
      path.join(root, outputPath),
      JSON.stringify(recover(root), null, 2) + "\n",
    );
  const result = verify(root);
  console.log(
    JSON.stringify({
      result: "PASS",
      factories: result.inventory.factory_count,
      new_operations: result.novelty.new_settings_operations,
      provider_variants: result.transport.provider_variants.length,
      controls: result.settings.controls.length,
      captured_js_executed: false,
      network_requests: 0,
    }),
  );
}
