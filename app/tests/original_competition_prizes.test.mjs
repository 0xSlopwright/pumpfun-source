import assert from "node:assert/strict";
import { test } from "node:test";
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  copyFile,
  rm,
} from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "../packages/frontend/node_modules/react/index.js";
import {
  jsx,
  jsxs,
} from "../packages/frontend/node_modules/react/jsx-runtime.js";
import { renderToStaticMarkup } from "../packages/frontend/node_modules/react-dom/server.node.js";
import { validateAgainstSchema } from "../packages/backend/src/schema-validator.ts";
import {
  createPrizeFormats,
  prizeNumberVariants,
  useMemoCache,
} from "../packages/frontend/src/components/leaderboard/original-prize-formats.mjs";
import { verifyCompetitionPrizes } from "../scripts/original-competition-prizes.mjs";
const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  sdk = createRequire(path.join(APP, "packages/sdk/package.json"));
const { transform } = createRequire(sdk.resolve("tsup"))("esbuild");
const props = [
  { rankFrom: 1, rankTo: 1, amount: "1000" },
  { rankFrom: 3, rankTo: 5, amount: "2 SOL" },
];
function syntheticTranslate(key, values = {}) {
  switch (key) {
    case "web.leaderboard.cup.tier_single":
      return `fixture-single:${values.rank}`;
    case "web.leaderboard.cup.tier_range":
      return `fixture-range:${values.from}/${values.to}`;
    case "web.leaderboard.cup.tier_each":
      return `fixture-each:${values.amount}`;
    default:
      throw Error("Unobserved fixture translation key");
  }
}
test("complete original D/T/badge/formatters and all selected source contexts are authenticated", async () => {
  const c = await verifyCompetitionPrizes();
  assert.ok(
    c.witnesses.some(
      (row) => row.label === "complete original prize-tier DISPLAY component",
    ),
  );
  assert.ok(
    c.witnesses.some(
      (row) => row.label === "complete original section heading",
    ),
  );
  assert.equal(
    c.witnesses.filter((row) => row.label.includes("rank palette;")).length,
    2,
  );
  assert.equal(c.relatedWork.pr, 864);
  assert.ok(c.witnesses.every((row) => row.sha256 && row.utf16 && row.utf8));
});
test("source gate rejects display behavior drift and independent contract drift", async (t) => {
  const temporary = await mkdtemp(
    path.join(os.tmpdir(), "prize-display-source-"),
  );
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const c = JSON.parse(
    await readFile(
      path.join(APP, "reconstruction/competition-prizes/contract.json"),
    ),
  );
  const names = new Set([
    "scripts/original-contracts/source.mjs",
    "evidence/web/manifest.json",
    "recovered/modules.json",
    ...c.source.selectedIndexEntries.flatMap((row) =>
      row.origins.map((origin) => origin.source),
    ),
    ...Object.keys(c.outputs),
    "reconstruction/competition-prizes/contract.json",
  ]);
  for (const name of names) {
    const out = path.join(temporary, name);
    await mkdir(path.dirname(out), { recursive: true });
    await copyFile(path.join(APP, name), out);
  }
  const file = path.join(
      temporary,
      "packages/frontend/src/components/leaderboard/original-prizes.tsx",
    ),
    original = await readFile(file, "utf8");
  assert.ok(original.includes("p.rankTo > p.rankFrom"));
  await writeFile(
    file,
    original.replace("p.rankTo > p.rankFrom", "p.rankTo >= p.rankFrom"),
  );
  await assert.rejects(
    verifyCompetitionPrizes(temporary),
    /maintained AST differs/,
  );
  await writeFile(file, original);
  const doc = path.join(
    temporary,
    "reconstruction/competition-prizes/contract.json",
  );
  await writeFile(doc, JSON.stringify({ ...c, behavior: {} }, null, 2) + "\n");
  await assert.rejects(
    verifyCompetitionPrizes(temporary),
    /source contract differs/,
  );
});
test("fixture props are admitted by the retained public DTO schema; no new production parser is supplied", async () => {
  const spec = JSON.parse(
    await readFile(path.join(APP, "contracts/developer.openapi.json")),
  );
  const schema =
    spec.paths["/competitions/{idOrSlug}"].get.responses["200"].content[
      "application/json"
    ].schema.properties.competition.properties.prizes;
  assert.deepEqual(validateAgainstSchema(props, schema, "$", spec), []);
  for (const invalid of [
    [{ rankFrom: 1, rankTo: 2, amount: 42 }],
    [{ rankFrom: "1", rankTo: 2, amount: "x" }],
    [{ rankFrom: 1, amount: "x" }],
  ])
    assert.ok(validateAgainstSchema(invalid, schema, "$", spec).length > 0);
});
test("NumberFormat source selection is mandatory, with no guessed global winner", () => {
  assert.equal(prizeNumberVariants.length, 2);
  assert.throws(() => createPrizeFormats({ Intl }), /Explicit reviewed/);
  assert.throws(
    () => createPrizeFormats({ Intl, numberVariant: "unknown" }),
    /Explicit reviewed/,
  );
});
for (const variant of prizeNumberVariants) {
  test(`${variant.sha256.slice(0, 12)}: amount/rank/locale behavior preserves original text and first-match selection`, () => {
    const format = createPrizeFormats({ Intl, numberVariant: variant.sha256 });
    assert.equal(format.formatAmount({ text: "1000", locale: "en" }), "$1,000");
    assert.equal(
      format.formatAmount({ text: " 1000.25 ", locale: "en" }),
      "$1,000.25",
    );
    for (const text of ["2 SOL", "$5,000", "-3", "1e3", " 2 SOL "])
      assert.equal(format.formatAmount({ text, locale: "en" }), text);
    assert.equal(format.canonicalLocale("EN-us"), "en");
    assert.equal(format.canonicalLocale("pt-BR"), "pt");
    assert.equal(format.canonicalLocale("no"), "nb");
    assert.equal(format.canonicalLocale("unknown"), null);
    assert.equal(format.formatRank(1234, "en"), "1,234");
    assert.equal(format.findPrize(props, 0), null);
    assert.equal(format.findPrize(props, 2), null);
    assert.equal(format.findPrize(props, 4), props[1]);
    const overlaps = [
      { rankFrom: 1, rankTo: 4, amount: "first" },
      { rankFrom: 2, rankTo: 3, amount: "second" },
    ];
    assert.equal(format.findPrize(overlaps, 2), overlaps[0]);
  });
  test(`${variant.sha256.slice(0, 12)}: source cache reuses requests and bounds entries`, () => {
    let count = 0;
    function NumberFormat(...args) {
      count++;
      return new Intl.NumberFormat(...args);
    }
    const format = createPrizeFormats({
      Intl: { NumberFormat },
      numberVariant: variant.sha256,
    });
    for (let i = 0; i < 5; i++) {
      format.formatRank(1, "en");
      format.formatAmount({ text: "1", locale: "en" });
    }
    assert.equal(count, 2);
    for (const locale of [
      "en",
      "fr",
      "de",
      "es",
      "pt",
      "it",
      "nl",
      "ru",
      "zh",
      "ja",
      "ko",
      "tr",
      "ar",
      "he",
      "vi",
      "pl",
      "uk",
      "th",
      "id",
      "hi",
      "cs",
      "ro",
      "hu",
      "bg",
      "sk",
      "sv",
      "hr",
      "fi",
      "nb",
      "da",
      "sl",
      "sr",
      "lt",
      "lv",
      "et",
      "el",
      "fa",
      "ms",
      "bn",
      "ta",
      "te",
      "mr",
      "gu",
      "kn",
      "ml",
      "ur",
      "sw",
      "af",
      "am",
      "az",
      "eu",
      "gl",
      "is",
      "ka",
      "kk",
    ])
      format.formatRank(1234, locale);
    const prior = count;
    format.formatRank(1, "en");
    assert.equal(count, prior + 1);
  });
}
test("actual React SSR renders complete tier/heading/badge, escapes text and leaves provided props untouched", async (t) => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "prize-display-ssr-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const input = await readFile(
    path.join(
      APP,
      "packages/frontend/src/components/leaderboard/original-prizes.tsx",
    ),
    "utf8",
  );
  const compiled = await transform(input, { loader: "tsx", format: "cjs" });
  const file = path.join(temporary, "display.cjs");
  await writeFile(file, compiled.code);
  const { createPrizeDisplay } = createRequire(import.meta.url)(file);
  const format = createPrizeFormats({
    Intl,
    numberVariant: prizeNumberVariants[0].sha256,
  });
  const { Tier, Heading, PrizeBadge } = createPrizeDisplay({
    jsx,
    jsxs,
    useMemoCache,
    useTranslation: () => ({ t: syntheticTranslate, i18n: { language: "en" } }),
    classNames: (...parts) => parts.filter(Boolean).join(" "),
    ...format,
  });
  const frozen = Object.freeze({ rankFrom: 1, rankTo: 1, amount: "1000" });
  const html = renderToStaticMarkup(
    React.createElement(Tier, { prize: frozen }),
  );
  assert.ok(html.includes("fixture-single:1"));
  assert.ok(html.includes("$1,000"));
  assert.equal(frozen.amount, "1000");
  const heading = renderToStaticMarkup(
    React.createElement(Heading, { title: "provided-title", isCardTop: true }),
  );
  assert.ok(heading.includes("<h2"));
  assert.ok(heading.includes("provided-title"));
  assert.equal(
    renderToStaticMarkup(React.createElement(PrizeBadge, { prize: null })),
    "",
  );
  assert.ok(
    renderToStaticMarkup(
      React.createElement(PrizeBadge, { prize: frozen }),
    ).includes(">1000</span>"),
  );
  const escaped = renderToStaticMarkup(
    React.createElement(Tier, {
      prize: { rankFrom: 3, rankTo: 5, amount: "<b>text</b>" },
    }),
  );
  assert.ok(escaped.includes("&lt;b&gt;text&lt;/b&gt;"));
  assert.ok(!escaped.includes("<b>text</b>"));
});
