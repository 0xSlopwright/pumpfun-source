import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  openCorpus,
  findNodes,
  exactlyOne,
  propertyName,
  objectProperty,
} from "./original-contracts/source.mjs";
export const APP_ROOT = fileURLToPath(new URL("..", import.meta.url));
export const OUTPUT = "reconstruction/portfolio-summary/contract.json";
const EXPECTED = [
  [
    520669,
    "evidence/web/objects/910b5c033a62f9b1.js",
    "335a22cbcc7e0c80edfe17c4d9df68b7a9f86bc1ebcce0761f732a055d04d805",
  ],
  [
    520669,
    "evidence/web/objects/7128bd47b219d222.js",
    "cc2ff6fe19be69dfc4a61a72a4b2b3554685f34eaf092bc8389611de12dc236f",
  ],
  [
    599565,
    "evidence/web/objects/06e532443c8db686.js",
    "375bf1a7298ca40a088210d7036d5422547ed59153f205de430426824b85caaf",
  ],
  [
    759257,
    "evidence/web/objects/1e479323ffe53c14.js",
    "e1c207697339004b48f6baa9f81f34e7644686ee424616b553e55b23c659b855",
  ],
  [
    503630,
    "evidence/web/objects/1e479323ffe53c14.js",
    "df5a12d4b76158889dd38a02d0d9afc0d0405065772b589c9cadf9806422d0e7",
  ],
  [
    30181,
    "evidence/web/objects/01ad4f413e529b60.js",
    "fbae4e508e6c986c68209d975d3eea247718d478272089a60504b776074e2413",
  ],
  [
    898661,
    "evidence/web/objects/2b47dd0b38a1608f.js",
    "9015e4bad4b1f0bb4b245e446689d9b7e939b3ba922044c82dcd9e8d5f3d9ed5",
  ],
  [
    408162,
    "evidence/web/objects/d50c5c8832449b79.js",
    "d27320343f07efeb58d5c33b728f3fdb687f68cfdaf361cbb07d80bb4800d1f2",
  ],
  [
    593902,
    "evidence/web/objects/2b47dd0b38a1608f.js",
    "6a7a4b49fb31f0fa88c3201071ba62759646dfe5674f966e2c47b104b0529ccb",
  ],
  [
    402030,
    "evidence/web/objects/2b47dd0b38a1608f.js",
    "26d7d7ced2e06fee3c9354e5ffd9626bcf4f953c8927d3a5ea43d5a45e7064c2",
  ],
  [
    785036,
    "evidence/web/objects/2b47dd0b38a1608f.js",
    "7608705120b4cecaeb64242df384fa1d8de743375557ff6251a868d03f0d9b5a",
  ],
  [
    183184,
    "evidence/web/objects/2b47dd0b38a1608f.js",
    "6a7355492303729b121c0e5311fe0fcef22b6d960942fa94eb67baf0a4b6fd26",
  ],
];
function declaration(f, name) {
  return exactlyOne(
    findNodes(
      f.node,
      (n) =>
        ["VariableDeclarator", "FunctionDeclaration"].includes(n.type) &&
        n.id?.name === name,
    ),
    `declaration ${name}`,
  );
}
export async function recover(root = APP_ROOT) {
  const corpus = await openCorpus(root),
    fs = [];
  for (const [id, source, hash] of EXPECTED) {
    const f = await corpus.factory(id, { source });
    assert.equal(
      f.provenance.sha256,
      hash,
      `review required for changed factory ${id}`,
    );
    fs.push(f);
  }
  const f = fs[0],
    library = fs[2],
    schemaNames = ["s", "o", "u", "c", "d", "m", "f", "g"],
    libraryNames = [
      "u4",
      "ny",
      "u0",
      "tQ",
      "iW",
      "iK",
      "iL",
      "iT",
      "sw",
      "sI",
      "id",
    ];
  const librarySpine = libraryNames.map((name) => ({
    name,
    ...library.witness(
      declaration(library, name),
      `used schema library ${name}`,
    ),
  }));
  assert.equal(
    librarySpine.find((n) => n.name === "tQ").sha256,
    "911922e2e3881bbed49bf7cd7b84409ee0b23c60a588956bf20c0c63ede864b1",
  );
  const getter = declaration(f, "h").init,
    refresh = declaration(f, "y").init;
  const getCalls = findNodes(
    getter,
    (n) =>
      n.type === "CallExpression" &&
      n.arguments[0]?.value === "GET /portfolio-summary",
  );
  assert.equal(getCalls.length, 2);
  const refreshCalls = findNodes(
    refresh,
    (n) =>
      n.type === "CallExpression" &&
      n.callee?.type === "MemberExpression" &&
      ["cancelQueries", "setQueryData"].includes(n.callee.property?.name),
  );
  assert.deepEqual(
    refreshCalls.map((n) => n.callee.property.name),
    ["cancelQueries", "setQueryData"],
  );
  const schemaExpressions = schemaNames.map((name) => {
    const n = declaration(f, name).init;
    return { name, text: f.text(n), ...f.witness(n, `used schema ${name}`) };
  });
  const utils = fs[7],
    base = fs[8],
    catalog = fs[9],
    baseNodes = ["l", "b", "w"].map((name) => ({
      name,
      ...base.witness(declaration(base, name).init, `base schema ${name}`),
    }));
  const operation = exactlyOne(
    findNodes(
      base.node,
      (n) =>
        n.type === "ObjectProperty" &&
        propertyName(n.key) === "GET /portfolio-summary",
    ),
    "base operation",
  );
  const response = objectProperty(operation.value.arguments[1], "response");
  assert.equal(declaration(catalog, "Y").init.arguments[0].value, 593902);
  const capture = await corpus.javascript(
      "evidence/web/objects/910b5c033a62f9b1.js",
    ),
    aliases = [];
  for (const id of [514287, 820984, 758045, 713643]) {
    const reg = exactlyOne(
        capture.factories.filter((r) => r.ids.includes(id)),
        `actual alias ${id}`,
      ),
      w = capture.witness(reg.node, `actual alias ${id}`);
    assert.equal(
      w.sha256,
      "ba8acac696188ebf2b0f8a345344d353b8a347f40edce3afee2ddc45d860914c",
    );
    aliases.push({ id, ...w, target: 599565 });
  }
  return {
    schemaVersion: 1,
    authority:
      "static source/dataflow recovery for JSON client responses; no Zod runtime execution",
    anchors: corpus.anchors,
    operation: {
      key: "GET /portfolio-summary",
      websiteOrigin: "https://frontend-api-v3.pump.fun",
      developerHostInterchangeable: false,
      source: getCalls.map((n) => f.witness(n, "actual GET call")),
      inputDefault: { holdings: false, fresh: false },
      userPeriodDefaultOrGuard: false,
      baseConstructorArguments: 0,
      holdingsOnlyConstructorArgument: "one explicit undefined",
      freshConstructorArgument: { credentials: "include" },
      queryFlags: { holdings: 1, fresh: 1 },
      signalReadOrForwarded: false,
      getter: f.witness(getter, "complete branching getter"),
    },
    schemas: {
      selectedVariant: fs[0].provenance,
      otherVariant: fs[1].provenance,
      otherVariantBehaviorQualified: false,
      expressions: schemaExpressions,
      aliases,
      library: library.provenance,
      usedLibrarySpine: librarySpine,
      utils: {
        factory: utils.provenance,
        used: ["B", "K", "S"].map((name) => ({
          name,
          ...utils.witness(
            declaration(utils, name),
            `used schema util ${name}`,
          ),
        })),
      },
      base: {
        factory: base.provenance,
        schemas: baseNodes,
        union: base.witness(response, "response union; first option w"),
        catalog: catalog.witness(
          declaration(catalog, "Y"),
          "actual route import",
        ),
      },
      domain: "decoded JSON response values",
      number: "noncoercing finite number; no positivity/integer check",
      summaryFields: [
        "pnl",
        "realizedPnl",
        "unrealizedPnl",
        "percentage",
        "totalBuySpend",
        "tokenCount",
        "totalValueUsd",
      ],
      numericFallback: null,
      pairFallback: { sol: null, usd: null },
      holdingsInvalidRows: "omit",
      holdingsMissingOrNonarray: null,
      holdingsValueFallback: 0,
      repriceInvalidRows: "omit",
      repriceMissing: null,
      cacheFresh: "strict true only",
      unknownFields: "project away",
      topLevelError:
        "local SummaryResponseError; original Zod issues/error identity not reproduced",
      exoticNonJSONInputsAndGlobalLibraryConfigQualified: false,
    },
    refresh: {
      source: f.witness(refresh, "complete used refresh helper"),
      order: [
        "await read holdings+fresh",
        "construct wallet/period key",
        "await cancelQueries exact:true",
        "setQueryData",
      ],
      calls: refreshCalls.map((n) => f.witness(n, "actual cache call")),
      setReturnAwaited: false,
      returnValue: "undefined",
      failure:
        "read or cancellation failure prevents cache write; no swallowing",
    },
    keys: {
      wallet: ["portfolioSummary", "user", "period"],
      walletPrefix: ["portfolioSummary", "user"],
    },
    factories: fs.map((f) => f.provenance),
    qualifications: {
      nativeBackend: false,
      productionTraffic: false,
      uiIntegrated: false,
      featureCredit: false,
    },
    limits: [
      "Fixed JSON projection only; not a reimplementation of Zod runtime, issue arrays, object descriptors, global memoizer configuration or exotic JS values.",
      "No provider/session/owner proof from fresh/include; client requests flags only. No backend price/PnL/history/link aggregation or financial computation.",
      "HTTP/query engine, full React/cache lifecycle and original library error identity remain outside qualification.",
    ],
  };
}
export async function verify(root = APP_ROOT) {
  const value = await recover(root);
  assert.deepEqual(
    JSON.parse(await readFile(path.join(root, OUTPUT))),
    value,
    "portfolio summary contract is stale",
  );
  return value;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv[2] === "--write") {
    const value = await recover();
    await mkdir(path.dirname(path.join(APP_ROOT, OUTPUT)), { recursive: true });
    await writeFile(
      path.join(APP_ROOT, OUTPUT),
      JSON.stringify(value, null, 2) + "\n",
    );
    console.log(`Wrote ${OUTPUT}`);
  } else if (process.argv[2] === "--check") {
    await verify();
    console.log("Original portfolio summary source contract PASS");
  } else throw new Error("Use --write or --check");
}
