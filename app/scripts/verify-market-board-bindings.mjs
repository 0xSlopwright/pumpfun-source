import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { parse } from "@babel/parser";

const defaultRoot = fileURLToPath(new URL("..", import.meta.url));
const digest = (value) => createHash("sha256").update(value).digest("hex");
const selected = {
  exploreHook: {
    moduleId: 379705,
    ids: [379705, 998515],
    sha256: "642cafc9d2b3c27f2d2d35ea8699a509ded856839fb3d33a8a132333d85c82d6",
    source: "evidence/web/objects/dba17a249156c6ff.js",
    url: "https://pump.fun/_next/static/immutable/chunks/0uor00k-r5e-k.js",
    start: 4547,
    end: 12581,
  },
  board: {
    moduleId: 583448,
    ids: [583448, 491208, 239453],
    sha256: "756b5cd53ed400a7204b663165861bf61e41c2196bfe08e8ecffdad23c39a098",
    source: "evidence/web/objects/3740fc4e7a24596d.js",
    url: "https://pump.fun/_next/static/immutable/chunks/3amuhk48ot4yw.js",
    start: 62291,
    end: 64048,
  },
  originSelector: {
    moduleId: 50969,
    ids: [50969],
    sha256: "37aec90940a6a35af808c7c2d568e48027b78660a7f80ebba0b6ae165cfa4a74",
    source: "evidence/web/objects/3740fc4e7a24596d.js",
    url: "https://pump.fun/_next/static/immutable/chunks/3amuhk48ot4yw.js",
    start: 1092,
    end: 1179,
  },
  exposure: {
    moduleId: 541710,
    ids: [541710],
    sha256: "761895d67935984d2a1bb1a36fc3500ae70fb8f70ea8888591fd0b1ea7638533",
    source: "evidence/web/objects/3740fc4e7a24596d.js",
    url: "https://pump.fun/_next/static/immutable/chunks/3amuhk48ot4yw.js",
    start: 19349,
    end: 20812,
  },
  chains: {
    moduleId: 637172,
    ids: [637172, 362373],
    sha256: "be5d1879b2367fa656f2076f6099f95e09966bef2f47e7cd9231d8d65b8e1ed5",
    source: "evidence/web/objects/3740fc4e7a24596d.js",
    url: "https://pump.fun/_next/static/immutable/chunks/3amuhk48ot4yw.js",
    start: 8901,
    end: 11516,
  },
  followedHolders: {
    moduleId: 559015,
    ids: [559015],
    sha256: "725b498159f8de3640c8c0dee181399ac8cf23fac8ccb165f513e4e21fba49f5",
    source: "evidence/web/objects/3740fc4e7a24596d.js",
    url: "https://pump.fun/_next/static/immutable/chunks/3amuhk48ot4yw.js",
    start: 11524,
    end: 13334,
  },
  responseAdapter: {
    moduleId: 503774,
    ids: [503774],
    sha256: "609398a036a8f03009d8e18f6218b0db40076b5a728a62b1014447cd99fcc326",
    source: "evidence/web/objects/3740fc4e7a24596d.js",
    url: "https://pump.fun/_next/static/immutable/chunks/3amuhk48ot4yw.js",
    start: 64165,
    end: 67638,
  },
  websiteTransport: {
    moduleId: 759257,
    ids: [759257, 67734],
    sha256: "e1c207697339004b48f6baa9f81f34e7644686ee424616b553e55b23c659b855",
    source: "evidence/web/objects/1e479323ffe53c14.js",
    url: "https://pump.fun/_next/static/immutable/chunks/1iz1f978wp41x.js",
    start: 144,
    end: 646,
  },
  origins: {
    moduleId: 503630,
    ids: [503630],
    sha256: "df5a12d4b76158889dd38a02d0d9afc0d0405065772b589c9cadf9806422d0e7",
    source: "evidence/web/objects/1e479323ffe53c14.js",
    url: "https://pump.fun/_next/static/immutable/chunks/1iz1f978wp41x.js",
    start: 654,
    end: 1035,
  },
  chainIds: {
    moduleId: 646908,
    ids: [646908],
    sha256: "719f637fc436bde35bcaa1da5eac3057212d49b84331e27068450218041eb6c0",
    source: "evidence/web/objects/1e479323ffe53c14.js",
    url: "https://pump.fun/_next/static/immutable/chunks/1iz1f978wp41x.js",
    start: 1996,
    end: 3677,
  },
};
const sources = {
  "evidence/web/objects/501ddca30e455495": {
    url: "https://pump.fun/explore",
    bytes: 844336,
    sha256: "bf808720f0cb4c1049588a1ebbf1840098eff80a7aecbf499f3815209e0ce119",
  },
  "evidence/web/objects/dba17a249156c6ff.js": {
    url: "https://pump.fun/_next/static/immutable/chunks/0uor00k-r5e-k.js",
    bytes: 23832,
    sha256: "3a82336b32e9990b0796153b1466697a27d73df03f9a85cb0df3c8c5395e53b3",
  },
  "evidence/web/objects/1e479323ffe53c14.js": {
    url: "https://pump.fun/_next/static/immutable/chunks/1iz1f978wp41x.js",
    bytes: 29288,
    sha256: "a824dde2b35895b6e4a4c642e880e6cbaec976f58a6cde4efcf5887e44f09172",
  },
  "evidence/web/objects/3740fc4e7a24596d.js": {
    url: "https://pump.fun/_next/static/immutable/chunks/3amuhk48ot4yw.js",
    bytes: 67649,
    sha256: "7400496d0194dea1be93f3640e73b3131f7e18d3e3d14fffb1ed117578795295",
  },
};
const edges = [
  ["exploreHook", "board", 583448],
  ["board", "originSelector", 50969],
  ["board", "chains", 637172],
  ["board", "followedHolders", 559015],
  ["board", "responseAdapter", 503774],
  ["originSelector", "websiteTransport", 67734],
  ["originSelector", "origins", 503630],
  ["chains", "exposure", 541710],
  ["chains", "chainIds", 646908],
  ["exposure", "chainIds", 646908],
];
function fail(message) {
  throw new Error(`Market board binding: ${message}`);
}
function same(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected))
    fail(`${label} mismatch`);
}
function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  if (typeof node.type === "string") visit(node);
  for (const [key, value] of Object.entries(node)) {
    if (["loc", "start", "end", "extra", "comments", "tokens"].includes(key))
      continue;
    if (Array.isArray(value)) value.forEach((child) => walk(child, visit));
    else if (value && typeof value === "object") walk(value, visit);
  }
}
async function read(root, relative) {
  if (
    typeof relative !== "string" ||
    !relative ||
    relative.includes("\\") ||
    relative.split("/").some((s) => !s || s === "." || s === "..") ||
    path.isAbsolute(relative)
  )
    fail("unsafe path");
  let current = path.resolve(root);
  for (const segment of relative.split("/")) {
    current = path.join(current, segment);
    const info = await fs.lstat(current);
    if (info.isSymbolicLink()) fail(`symlink: ${relative}`);
  }
  if (!(await fs.lstat(current)).isFile()) fail(`not a file: ${relative}`);
  return fs.readFile(current);
}
function registrations(ast, source) {
  const found = new Map();
  function scan(array) {
    let ids = [];
    for (const item of array.elements) {
      if (["NumericLiteral", "StringLiteral"].includes(item?.type))
        ids.push(item.value);
      else if (
        ["ArrowFunctionExpression", "FunctionExpression"].includes(item?.type)
      ) {
        if (ids.length)
          found.set(`${item.start}:${item.end}`, { ids: [...ids], node: item });
        ids = [];
      } else {
        ids = [];
        if (item?.type === "ArrayExpression") scan(item);
      }
    }
  }
  walk(ast, (node) => {
    if (
      node.type === "CallExpression" &&
      node.callee?.type === "MemberExpression" &&
      node.callee.property?.name === "push" &&
      source.slice(node.callee.start, node.callee.end).includes("TURBOPACK")
    ) {
      for (const argument of node.arguments)
        if (argument.type === "ArrayExpression") scan(argument);
    }
  });
  return found;
}
function slice(source, start, end) {
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    end <= start ||
    end > source.length
  )
    fail("invalid UTF-16 range");
  for (const at of [start, end]) {
    const current = source.charCodeAt(at),
      previous = source.charCodeAt(at - 1);
    if (
      current >= 0xdc00 &&
      current <= 0xdfff &&
      previous >= 0xd800 &&
      previous <= 0xdbff
    )
      fail("split surrogate boundary");
  }
  return source.slice(start, end);
}
function witness(node, source) {
  return {
    start: node.start,
    end: node.end,
    sha256: digest(slice(source, node.start, node.end)),
  };
}
function exportNode(factory, moduleId, name) {
  const matches = [];
  walk(factory.node.body, (node) => {
    if (
      node.type !== "CallExpression" ||
      node.callee?.type !== "MemberExpression" ||
      node.callee.object?.name !== factory.node.params[0].name ||
      node.callee.property?.name !== "s" ||
      node.arguments[0]?.type !== "ArrayExpression"
    )
      return;
    if ((node.arguments[1]?.value ?? factory.moduleId) !== moduleId) return;
    const values = node.arguments[0].elements;
    for (let i = 0; i < values.length; i += 3)
      if (values[i]?.value === name) matches.push(values[i + 2]);
  });
  if (matches.length !== 1) fail(`export ${moduleId}.${name}`);
  let node = matches[0];
  if (node.type === "Identifier") {
    const declarations = factory.node.body.body
      .flatMap((statement) =>
        statement.type === "VariableDeclaration" ? statement.declarations : [],
      )
      .filter((d) => d.id.name === node.name);
    if (declarations.length !== 1) fail(`export alias ${moduleId}.${name}`);
    node = declarations[0].init;
  }
  return node;
}
export async function buildMarketBoardBindings(root = defaultRoot) {
  const manifest = JSON.parse(
    (await read(root, "evidence/web/manifest.json")).toString("utf8"),
  );
  if (manifest.captured_at !== "2026-10-28T10:48:45.546100+00:00")
    fail("capture timestamp");
  const inventory = JSON.parse(
    (await read(root, "recovered/modules.json")).toString("utf8"),
  );
  const input = new Map();
  for (const [relative, expected] of Object.entries(sources)) {
    const records = manifest.records.filter((r) => r.path === relative);
    if (records.length !== 1) fail(`manifest identity: ${relative}`);
    const record = records[0];
    same(
      { url: record.url, bytes: record.bytes, sha256: record.sha256 },
      expected,
      "manifest source",
    );
    if (record.status !== 200) fail("source status");
    const bytes = await read(root, relative);
    if (bytes.length !== expected.bytes || digest(bytes) !== expected.sha256)
      fail(`source bytes: ${relative}`);
    let text;
    try {
      text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      fail("invalid UTF-8");
    }
    input.set(relative, {
      text,
      registrations: relative.endsWith(".js")
        ? registrations(
            parse(text, { sourceType: "unambiguous", errorRecovery: false }),
            text,
          )
        : null,
    });
  }
  const htmlPath = "evidence/web/objects/501ddca30e455495";
  const html = input.get(htmlPath).text;
  const scriptSources = [
    ...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g),
  ].map((m) => new URL(m[1], "https://pump.fun/explore").href);
  const factories = {};
  for (const [name, expected] of Object.entries(selected)) {
    const { text, registrations: registered } = input.get(expected.source);
    if (!scriptSources.includes(expected.url))
      fail(`not an initial Explore script: ${name}`);
    const actual = registered.get(`${expected.start}:${expected.end}`);
    if (!actual) fail(`missing AST registration: ${name}`);
    same(actual.ids, expected.ids, `registration IDs ${name}`);
    if (digest(slice(text, expected.start, expected.end)) !== expected.sha256)
      fail(`factory bytes: ${name}`);
    const indexed = inventory.modules.filter(
      (entry) =>
        entry.sha256 === expected.sha256 &&
        entry.ids.includes(expected.moduleId),
    );
    if (
      indexed.length !== 1 ||
      !indexed[0].origins.some(
        (o) =>
          o.source === expected.source &&
          o.url === expected.url &&
          o.start === expected.start &&
          o.end === expected.end,
      )
    )
      fail(`inventory origin: ${name}`);
    same(indexed[0].ids, expected.ids, `inventory IDs ${name}`);
    factories[name] = { ...expected, node: actual.node, text };
  }
  const imports = edges.map(([from, to, moduleId]) => {
    const { node, text } = factories[from];
    const runtime = node.params[0].name;
    const matches = [];
    walk(node.body, (child) => {
      if (
        child.type === "CallExpression" &&
        child.callee?.type === "MemberExpression" &&
        child.callee.object?.name === runtime &&
        child.callee.property?.name === "i" &&
        child.arguments[0]?.value === moduleId
      )
        matches.push(child);
    });
    if (matches.length !== 1 || !factories[to].ids.includes(moduleId))
      fail(`import ${from} -> ${to}`);
    return { from, to, moduleId, ...witness(matches[0], text) };
  });
  const exportSpecs = [
    ["board", 583448, "f"],
    ["board", 583448, "y"],
    ["board", 491208, "U"],
    ["board", 239453, "h"],
    ["board", 239453, "f"],
    ["originSelector", 50969, "f"],
    ["websiteTransport", 67734, "f"],
    ["origins", 503630, "U"],
    ["followedHolders", 559015, "A"],
    ["chains", 637172, "r"],
    ["chains", 637172, "W"],
    ["exposure", 541710, "F"],
    ["chainIds", 646908, "H"],
    ["responseAdapter", 503774, "q"],
  ];
  const exports = exportSpecs.map(([factory, moduleId, name]) => ({
    factory,
    moduleId,
    name,
    ...witness(
      exportNode(factories[factory], moduleId, name),
      factories[factory].text,
    ),
  }));
  const originGetter = exportNode(factories.origins, 503630, "U");
  if (
    originGetter.type !== "ArrowFunctionExpression" ||
    originGetter.body.type !== "StringLiteral"
  )
    fail("origin getter shape");
  const proxyFlag = exportNode(factories.websiteTransport, 67734, "f");
  if (
    proxyFlag.type !== "ArrowFunctionExpression" ||
    proxyFlag.body.type !== "UnaryExpression" ||
    proxyFlag.body.operator !== "!" ||
    proxyFlag.body.argument.value !== 1
  )
    fail("proxy flag shape");
  const limitCap = exportNode(factories.board, 583448, "y");
  const followedCap = exportNode(factories.followedHolders, 559015, "A");
  if (
    limitCap.type !== "NumericLiteral" ||
    followedCap.type !== "NumericLiteral"
  )
    fail("cap declaration shape");
  return {
    version: 1,
    classification:
      "observed static client boundary; no runtime or backend compatibility qualification",
    capturedAt: manifest.captured_at,
    basis: "2fc654a20e9c7be2b9529f585942bb82c4c83ab2",
    route: "/explore",
    rangeEncoding:
      "UTF-16 code-unit half-open offsets in strict UTF-8 decoded source",
    sources,
    factories: selected,
    imports,
    exports,
    operations: ["GET /boards/movers", "GET /boards/trending"],
    origin: {
      value: originGetter.body.value,
      branch:
        "50969.f calls 67734.f; captured 67734.f returns false, selecting 503630.U",
      alternate: "/api/indexer",
      transport:
        "direct fetch, credentials include, Content-Type application/json, AbortSignal",
    },
    request: {
      limitUpperCap: limitCap.value,
      callerLimit: 300,
      boardDefault: "movers",
      tier: "web",
      platform: "WEB",
      surface: { movers: "WEB", trending: "TRENDING" },
      trending: { ranking: "social", windowDefault: "1h", hot: "label" },
      windowChoices: ["1h", "4h", "12h", "24h"],
      followedHoldersLimit: followedCap.value,
      optionalFields: [
        "userId",
        "pumpUserId",
        "session_id",
        "device_id",
        "session_start_timestamp_ms",
        "country",
        "offset",
        "includeFollowedHolders",
      ],
    },
    responseBoundary: {
      adapter: "503774.q",
      observedConsumption:
        "entries array; finite positive serverTs; board; entry mapping preserves served order",
      schema:
        "full response DTO and server validation unqualified; no response decoder implemented here",
    },
    limits: [
      "Selected initial-script provenance is not a runtime winner claim; other indexed variants and lazy scripts exist.",
      "No server ranking, filters, auth, cookies, pagination, DTO validation, retries, realtime or production response qualified.",
      "No backend endpoint, network default, original runtime execution or feature-progress credit.",
    ],
  };
}
export async function verifyMarketBoardBindings(root = defaultRoot) {
  const expected = await buildMarketBoardBindings(root);
  const actual = JSON.parse(
    (await read(root, "contracts/market-board-bindings.json")).toString("utf8"),
  );
  same(actual, expected, "generated contract");
  return {
    sources: Object.keys(expected.sources).length,
    factories: Object.keys(expected.factories).length,
    imports: expected.imports.length,
  };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  if (
    args.some((arg) => !["--write", "--check"].includes(arg)) ||
    (args.includes("--write") && args.includes("--check"))
  )
    fail("use --check or --write");
  if (args.includes("--write")) {
    const expected = await buildMarketBoardBindings();
    await fs.writeFile(
      path.join(defaultRoot, "contracts/market-board-bindings.json"),
      `${JSON.stringify(expected, null, 2)}\n`,
    );
  } else console.log(JSON.stringify(await verifyMarketBoardBindings()));
}
