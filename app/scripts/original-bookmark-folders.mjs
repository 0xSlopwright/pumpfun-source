#!/usr/bin/env node
// Parse authenticated captured source as data. Never execute captured factories.
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

const defaultRoot = fileURLToPath(new URL("..", import.meta.url));
export const outputPath = "reconstruction/bookmark-folders/contract.json";
const compact = (node) =>
  generate(node, { compact: true, comments: false }).code;
const require = (ok, label) => {
  if (!ok) throw Error(`Bookmark folders: ${label}`);
};
const one = (node, predicate, label) =>
  exactlyOne(findNodes(node, predicate), label);
const target = (node) =>
  node?.type === "SequenceExpression" ? node.expressions.at(-1) : node;
const call = (node, name) =>
  node?.type === "CallExpression" &&
  propertyName(target(node.callee)?.property) === name;
const pins = {
  960107: ["a49459f75519e0dc643c67e4bcba6f4d678c99154b991211e5542ac44a52b95f"],
  759257: ["e1c207697339004b48f6baa9f81f34e7644686ee424616b553e55b23c659b855"],
  503630: ["df5a12d4b76158889dd38a02d0d9afc0d0405065772b589c9cadf9806422d0e7"],
  30181: ["fbae4e508e6c986c68209d975d3eea247718d478272089a60504b776074e2413"],
  898661: ["9015e4bad4b1f0bb4b245e446689d9b7e939b3ba922044c82dcd9e8d5f3d9ed5"],
  403206: ["fcecb963832643ee4591cf6e432792aea0c8a488c542b206a12ea7e1fea05ed4"],
  779106: ["e1e29868ec56b56bdbc68b58127f2c71583094d14645020b53c733a7be06423b"],
  92245: ["9b5bbc065d7b19bf7273c3fa6fcbddb2f61a6c183a2f512d6e2d2d81d5ea89e3"],
  228998: ["3417e48c11cff94d2efdafcfae6018010e97d1003122b734cd3e019f280a1134"],
  490258: ["14e54f65888febdcc142473204305fed6ebfdf5949f205d484339a899f440c24"],
  796538: ["7e5a0eaa8772973955421f9891c6c7cf02491de1d84db67d1020a0f1cd033285"],
  906032: ["e7a13e86717bfab990fca9f995565810d802f430f480aa7f7d244241abc22d9e"],
  510021: [
    "80dcb88d3666d380977e29fa5054622d974b343a0fca1ab58ac74149703d0c86",
    "9dbffb91716869cedf07f99666fc034b75efa2f47ed1d4a5e7398169f8c3309a",
    "29559f2cd1623537d8a4d55b5cdbe0b7ecf58bd9d24357afe1ea5995cce055fb",
    "74f294210887a9d3907b6668f747abecbffa2e6500ada1ba476df0e3eae4e764",
  ],
};

function imports(mod) {
  return new Map(
    findNodes(
      mod.node,
      (n) =>
        n.type === "VariableDeclarator" &&
        n.init?.type === "CallExpression" &&
        ["i", "r"].includes(propertyName(n.init.callee?.property)),
    ).map((n) => [n.id.name, literal(n.init.arguments[0])]),
  );
}
const declaration = (mod, name) =>
  one(
    mod.node,
    (n) => n.type === "FunctionDeclaration" && n.id.name === name,
    `function ${name}`,
  );
const assigned = (mod, name) =>
  one(
    mod.node,
    (n) =>
      n.type === "AssignmentExpression" &&
      n.left.type === "Identifier" &&
      n.left.name === name &&
      n.right.type === "ArrowFunctionExpression",
    `callback ${name}`,
  ).right;
const witnessed = (mod, node, label) => ({
  syntax: compact(node),
  evidence: mod.witness(node, label),
});

export async function recover(root = defaultRoot) {
  const corpus = await openCorpus(root),
    selected = new Map();
  for (const id of [
    960107, 759257, 503630, 30181, 898661, 403206, 779106, 92245, 228998,
    490258, 796538, 906032,
  ]) {
    const variants = corpus.index.modules.filter((m) => m.ids.includes(id));
    require(variants.length === 1, `review new ${id} variant`);
    const variant = variants[0];
    require(pins[id]?.includes(variant.sha256), `review changed ${id} factory`);
    // Same factory bytes may have several origins. This is a representative
    // witness; every occurrence is retained, not an inferred active-page winner.
    selected.set(
      id,
      await corpus.factory(id, { source: variant.origins[0].source }),
    );
  }
  const hook = selected.get(960107),
    client = selected.get(759257),
    endpoints = selected.get(503630),
    transport = selected.get(30181),
    contractClient = selected.get(898661),
    schema = selected.get(403206),
    page = selected.get(228998),
    loader = selected.get(490258),
    reexport = selected.get(796538);
  require(imports(hook).get("F") === 759257 &&
    imports(hook).get("j") === 779106 &&
    imports(hook).get("C") ===
      906032, "actual request/scope/default dependencies");
  require(imports(client).get("t") === 30181 &&
    imports(client).get("r") === 503630, "original client/endpoint imports");
  require(imports(transport).get("e") === 402030 &&
    imports(contractClient).get("n") === 402030, "contract-client bridge");
  require(imports(selected.get(779106)).get("r") ===
    92245, "viewer scope predicate");
  require(imports(page).get("eX") === 960107, "actual page hook import");
  one(
    page.node,
    (n) => call(n, "A") && n.arguments[0]?.value === 490258,
    "actual lazy dialog caller",
  );
  one(
    loader.node,
    (n) =>
      n.type === "CallExpression" &&
      n.callee.name === "t" &&
      n.arguments[0]?.value === 796538,
    "actual loaded dialog module",
  );
  one(
    reexport.node,
    (n) => call(n, "i") && n.arguments[0]?.value === 510021,
    "actual dialog re-export",
  );
  const origin = one(
    endpoints.node,
    (n) =>
      n.type === "StringLiteral" &&
      n.value === "https://frontend-api-v3.pump.fun",
    "frontend API origin",
  );
  const sourceHeaders = one(
    transport.node,
    (n) =>
      n.type === "VariableDeclarator" &&
      n.id.name === "$" &&
      n.init?.type === "ObjectExpression",
    "common website source headers",
  );
  const headers = Object.fromEntries(
    sourceHeaders.init.properties.map((p) => [
      propertyName(p.key),
      literal(p.value),
    ]),
  );
  require(JSON.stringify(headers) ===
    JSON.stringify({
      "x-pump-source": "WEB",
      "x-pump-platform": "web",
    }), "common source header values");
  const beforeRequest = one(
    transport.node,
    (n) =>
      n.type === "VariableDeclarator" &&
      n.id.name === "I" &&
      n.init?.type === "ArrowFunctionExpression",
    "selected client pre-request hook",
  );
  require(compact(beforeRequest.init) ===
    "t=>{}", "captured client pre-request hook is empty");
  const requestFunctions = {
    list: "et",
    create: "ec",
    rename: "ek",
    remove: "e_",
  };
  const operations = {};
  for (const [name, functionName] of Object.entries(requestFunctions)) {
    const fn = declaration(hook, functionName);
    const invocation = one(
      fn,
      (n) =>
        n.type === "CallExpression" &&
        n.arguments[0]?.type === "StringLiteral" &&
        n.arguments[0].value.includes("/bookmarks"),
      `${name} operation`,
    );
    require(compact(invocation.callee) ===
      "(0,F.j)()", `${name} actual client callee`);
    const operation = literal(invocation.arguments[0]);
    const route = one(
      schema.node,
      (n) => n.type === "ObjectProperty" && propertyName(n.key) === operation,
      `${operation} schema`,
    );
    operations[name] = {
      operation,
      function: witnessed(hook, fn, `${name} client function`),
      options: witnessed(
        hook,
        invocation.arguments[1],
        `${name} request options`,
      ),
      declaredRoute: witnessed(
        schema,
        route,
        `${operation} declared route; not a server observation`,
      ),
    };
  }
  require(operations.list.operation === "GET /bookmarks" &&
    operations.create.operation === "POST /bookmarks" &&
    operations.rename.operation === "PUT /bookmarks/{bookmarkId}" &&
    operations.remove.operation ===
      "DELETE /bookmarks/{bookmarkId}", "selected folder operation set");
  for (const name of ["ed", "eu", "eh"])
    one(
      declaration(hook, name),
      (n) => n.type === "ThrowStatement",
      `${name} non-ok rejection`,
    );
  const normalization = one(
    hook.node,
    (n) =>
      n.type === "VariableDeclarator" &&
      n.id.name === "A" &&
      n.init?.type === "ArrowFunctionExpression",
    "folder normalization",
  );
  require(compact(normalization.init) ===
    "e=>({...e,bookmark_items_with_created_at:e.bookmark_items_with_created_at??[]})", "list normalization");
  const callbacks = {};
  for (const [name, variable] of Object.entries({
    createOptimistic: "eW",
    createError: "eG",
    createSuccess: "eX",
    renameOptimistic: "ez",
    renameError: "eV",
    renameSuccess: "eZ",
    deleteOptimistic: "e2",
    deleteError: "e0",
    deleteSuccess: "e3",
    createAction: "e6",
    renameAction: "e8",
    deleteAction: "e9",
  }))
    callbacks[name] = witnessed(hook, assigned(hook, variable), name);
  for (const name of ["createAction", "renameAction", "deleteAction"])
    require(callbacks[name].syntax.includes("catch{}") &&
      callbacks[name].syntax.includes(
        "if(!tf)",
      ), `${name} signed-out/failed mutation resolution`);
  const nameRule = one(
    schema.node,
    (n) => n.type === "RegExpLiteral",
    "declared folder name regex",
  );
  require(nameRule.pattern === "^[a-zA-Z0-9 _-]+$" &&
    nameRule.flags === "", "declared folder-name rule");
  const dialogs = [];
  for (const variant of corpus.index.modules.filter((m) =>
    m.ids.includes(510021),
  )) {
    require(pins[510021].includes(
      variant.sha256,
    ), "review changed dialog variant");
    for (const origin of variant.origins) {
      const mod = await corpus.factory(510021, { source: origin.source });
      const props = one(
        mod.node,
        (n) =>
          n.type === "ObjectPattern" &&
          n.properties.some((p) => propertyName(p.key) === "createBookmark"),
        "actual dialog mutation props",
      );
      const names = Object.fromEntries(
        props.properties
          .filter((p) =>
            ["createBookmark", "deleteBookmark", "updateBookmarkName"].includes(
              propertyName(p.key),
            ),
          )
          .map((p) => [propertyName(p.key), p.value.name]),
      );
      const actions = {};
      for (const [name, variable] of Object.entries(names)) {
        const awaitCall = one(
          mod.node,
          (n) =>
            n.type === "AwaitExpression" &&
            n.argument.type === "CallExpression" &&
            n.argument.callee.name === variable,
          `${name} actual awaited prop`,
        );
        actions[name] = witnessed(
          mod,
          awaitCall,
          `${name} awaited dialog prop`,
        );
      }
      const defaultRule = one(
        mod.node,
        (n) =>
          n.type === "BinaryExpression" &&
          n.operator === "!==" &&
          n.left.value === "default" &&
          propertyName(n.right?.property) === "name",
        "default row management hidden",
      );
      dialogs.push({
        source: mod.provenance,
        actions,
        defaultRule: witnessed(
          mod,
          defaultRule,
          "UI rule, not server authorization",
        ),
      });
    }
  }
  require(dialogs.length === pins[510021].length, "complete dialog variants");
  const sources = [...selected.values()].map((mod) => ({
    ...mod.provenance,
    occurrences: corpus.index.modules.find((m) => m.ids.includes(mod.id))
      .origins,
  }));
  return {
    schemaVersion: 1,
    classification:
      "Original selected bookmark-folder client workflow, explicit integration ports; not a native server or compatibility result",
    anchors: corpus.anchors,
    inventoryVariants: corpus.index.modules.length,
    origin: {
      value: origin.value,
      evidence: endpoints.witness(
        origin,
        "declared client-server origin; no request made",
      ),
    },
    operations,
    transportBoundary: {
      credentials: "include on all four folder operations",
      commonHeaders: headers,
      evidence: [
        transport.witness(sourceHeaders, "common WEB source headers"),
        transport.witness(beforeRequest, "selected client beforeRequest no-op"),
      ],
      auth: "The captured j/client-server chain does not add a bearer token through this empty hook. Included credentials are explicit; cookie issuance, server authorization and externally supplied headers remain unknown. No anonymous-access conclusion.",
    },
    callbacks,
    dialogs,
    sources,
    nameRule: {
      pattern: nameRule.pattern,
      flags: nameRule.flags,
      evidence: schema.witness(nameRule, "declared request-name schema"),
    },
    behavior: {
      key: ["bookmarks", "viewerKey"],
      query:
        "requested && viewerKey!==null && finite decodedJwt.exp && exp*1000>now; staleTime300000; one query retry except BookmarksHttpError401/403",
      viewer:
        "779106 delegates to92245: trimmed userId first, then trimmed address, else null; this cache identity is not authentication",
      transport:
        "759257.j uses503630.R frontend-api-v3 with original30181/898661 contract client; folder functions include credentials and custom afterResponse checks; rename/delete discard JSON and return submitted identifiers",
      schemaBoundary:
        "Route declarations are captured metadata; successful JSON is not schema-validated by898661. No server behavior inferred from declarations.",
      optimistic:
        "create appends temp-Date.now row with separately sampled ISO timestamp; rename replaces matching row name; delete snapshots and clears supplied selected coin-list caches; truthy snapshots restored on error",
      success:
        "invalidate bookmarks/bookmarkedCoins/sidebarBookmarkedCoins viewer prefixes then source notification; create does not immediately replace temporary row with response",
      exportedActions:
        "decodedJwt-presence check then mutateAsync; signed-out path toasts and resolves; underlying mutation errors caught and resolved with undefined",
      dialog:
        "trim create/rename, shared pending, clear successful await input/edit, catch/log rejecting props; default-name row has no management controls; close clears editing only",
      importantComposition:
        "Actual exported actions resolve even on signed-out/rejected mutation, so their dialog clears create/rename state after those paths; rejecting alternate props retain it. Do not invent reliable failure acknowledgement.",
    },
    limits: [
      "Selected folder operations only; item memberships, coin cards, cross-chain handling, sorting and excluded detail/terminal surfaces are outside the implementation.",
      "No default transport/auth/session, production request, backend handler, durable persistence, original response oracle or compatibility claim.",
      "Original HTTP/Ky retries and framework scheduling are delegated ports, not reimplemented; the exported option callbacks model their selected operations.",
      "Notify descriptors and observer APIs are authored integration. Local tests are finite synthetic interaction proof, not upstream server/visual/React interleaving proof.",
      "All four dialog variants and representative witnesses retain origins; no active page/provider or complete transitive closure is inferred.",
    ],
  };
}
export async function verify(root = defaultRoot) {
  const value = await recover(root);
  require(JSON.stringify(value) ===
    JSON.stringify(
      JSON.parse(await readFile(path.join(root, outputPath), "utf8")),
    ), "saved contract differs from authenticated source");
  return value;
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
  const value = await verify();
  console.log(
    JSON.stringify({
      result: "PASS",
      sources: value.sources.length,
      dialogs: value.dialogs.length,
      operations: Object.keys(value.operations).length,
      capturedCodeExecuted: false,
      productionRequests: 0,
    }),
  );
}
