import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { parse } from "@babel/parser";
import { recordedSegments, referenceHtml } from "../scripts/shell-parity.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const frontend = resolve(root, "packages/frontend/src");
const sha = (value) => createHash("sha256").update(value).digest("hex");
const bindings = JSON.parse(
  readFileSync(
    resolve(root, "packages/frontend/SHELL-INTEGRATION-BINDINGS.json"),
    "utf8",
  ),
);

test("shell inputs remain bound to physical captured bytes and exact UTF-16 factory ranges", () => {
  const inventory = JSON.parse(
    readFileSync(resolve(root, "recovered/modules.json"), "utf8"),
  ).modules;
  for (const record of Object.values(bindings.captures)) {
    const bytes = readFileSync(resolve(root, record.path));
    assert.equal(sha(bytes), record.sha256);
    assert.equal(bytes.length, record.bytes);
  }
  for (const factory of bindings.factories) {
    const bytes = readFileSync(resolve(root, factory.source));
    assert.equal(sha(bytes), factory.chunk_sha256);
    const body = bytes.toString("utf8").slice(factory.start, factory.end);
    assert.equal(sha(body), factory.factory_sha256);
    assert.ok(
      inventory.some(
        (row) =>
          row.sha256 === factory.factory_sha256 &&
          row.ids.includes(factory.module_id) &&
          row.origins.some(
            (origin) =>
              origin.source === factory.source &&
              origin.start === factory.start &&
              origin.end === factory.end,
          ),
      ),
    );
  }
  for (const [path, expected] of Object.entries(bindings.generated_assets))
    assert.equal(sha(readFileSync(resolve(root, path))), expected);
});

test("active layout reaches captured shell, generated assets and interactive prerequisites", () => {
  const modules = new Set(),
    assets = new Set();
  const visit = (file) => {
    if (modules.has(file)) return;
    modules.add(file);
    const ast = parse(readFileSync(file, "utf8"), {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });
    for (const node of ast.program.body) {
      if (node.type !== "ImportDeclaration") continue;
      const name = node.source.value;
      if (!name.startsWith(".") && !name.startsWith("@/")) continue;
      const base = name.startsWith("@/")
        ? resolve(frontend, name.slice(2))
        : resolve(dirname(file), name);
      if (name.endsWith(".css")) {
        assets.add(base);
        continue;
      }
      const target = [
        base,
        base + ".ts",
        base + ".tsx",
        resolve(base, "index.tsx"),
      ].find((path) => existsSync(path));
      if (target && /\.tsx?$/.test(target)) visit(target);
    }
  };
  visit(resolve(frontend, "app/layout.tsx"));
  for (const path of [
    "components/shell/AppShell.tsx",
    "components/shell/TopBar.tsx",
    "components/shell/search/SearchDialog.tsx",
    "components/shell/MobileNav.tsx",
    "components/ui/sidebar.tsx",
    "components/shell/captured-icons.tsx",
    "components/shell/AppSidebar.tsx",
    "components/settings/settings-control.tsx",
    "app/auth/sign-in-control.tsx",
    "app/auth/auth-control.tsx",
  ])
    assert.ok(modules.has(resolve(frontend, path)), path);
  assert.ok(assets.has(resolve(frontend, "app/captured-shell.css")));
  assert.equal(modules.has(resolve(frontend, "app/app-shell.tsx")), false);
});

test("inert reference renderer recovers stylesheet-gated boundaries without executing captured code", () => {
  const raw = readFileSync(
    resolve(root, bindings.captures["https://pump.fun/"].path),
    "utf8",
  );
  const parsed = recordedSegments(raw);
  assert.ok(parsed.ops.some((op) => op.join() === "C,B:1,S:1"));
  assert.deepEqual(parsed.styles, [
    "/_next/static/immutable/chunks/3v3p2-oh-retg.css",
    "/_next/static/immutable/chunks/2qa1j5elgy_4n.css",
  ]);
  const html = referenceHtml(raw, "overlay-closed-emulation");
  assert.equal((html.match(/<script\b/gi) ?? []).length, 1);
  assert.ok(html.includes("DOMContentLoaded"));
  assert.ok(!html.includes("<script src="));
  const decoy =
    '<script>const text=\'$RC("B:8","S:8")\';function unused(){$RC("B:7","S:7")} $RC("B:0","S:0");</script>';
  assert.deepEqual(recordedSegments(decoy).ops, [["C", "B:0", "S:0"]]);
  assert.throws(
    () =>
      recordedSegments(
        '<script>$RR("B:1","S:1",[["https://example.com/x.css"]])</script>',
      ),
    /Unsupported retained stylesheet/,
  );
});
