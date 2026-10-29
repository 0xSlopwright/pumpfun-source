import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parse } from "@babel/parser";
const root = new URL("../", import.meta.url),
  sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const bindings = JSON.parse(
  readFileSync(new URL("packages/frontend/CLICKWRAP-BINDINGS.json", root)),
);
const bodies = new Map();
for (const f of bindings.factories) {
  const raw = readFileSync(new URL(f.source, root)),
    body = raw.toString("utf8").slice(f.start, f.end);
  bodies.set(f.ids[0], body);
}
test("all consent factories bind to exact physical source ranges, including previously omitted nested registrations", () => {
  for (const f of bindings.factories) {
    const raw = readFileSync(new URL(f.source, root)),
      body = raw.toString("utf8").slice(f.start, f.end);
    assert.equal(sha(raw), f.chunk_sha256);
    assert.equal(sha(body), f.factory_sha256);
    parse("(" + body + ")");
  }
  const raw = readFileSync(new URL(bindings.ssr.path, root));
  assert.equal(sha(raw), bindings.ssr.sha256);
  assert.equal(raw.length, bindings.ssr.bytes);
});
test("original Continue, Dismiss and Escape flow into the same persistence routine; legacy migration is separate", () => {
  const source = bodies.get(683826);
  assert.ok(
    source.includes(
      'ep(!0),x();try{localStorage.setItem(u.Y,"true"),localStorage.setItem(f.i,(0,f.N)())}catch{}for(let e of h)e();(0,u.o)()',
    ),
  );
  assert.ok(source.includes('interactionType:"dismiss"}),eb()'));
  assert.ok(source.includes('interactionType:"click"}),eb()'));
  assert.ok(source.includes('"Escape"===e.key&&(e.preventDefault(),eg())'));
  assert.ok(source.includes('onClick:eg,tabIndex:-1,type:"button"'));
  assert.ok(source.includes("onClick:ev,size:48"));
  assert.ok(source.includes("function E(){!b()&&g()&&x()}"));
  assert.ok(source.includes("return null!=localStorage.getItem(u.Y)"));
  assert.ok(
    bodies.get(875429).includes('n="2026-10-17",r="user-tos-accepted-date"'),
  );
});
test("captured pre-paint migration and conditional overlay markup are retained as inert source evidence", () => {
  const raw = readFileSync(new URL(bindings.ssr.path, root), "utf8");
  assert.ok(raw.includes("localStorage.getItem('show-how-it-works')!=null"));
  assert.ok(raw.includes("data-clickwrap-legacy-accepted"));
  assert.ok(raw.includes('data-clickwrap-overlay="" role="dialog"'));
  assert.ok(raw.includes("and certify that you are over 18 years old."));
});
test("captured browser state model passes its independent typed regression suite", () => {
  const result = spawnSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "--test",
      fileURLToPath(new URL("./clickwrap_state.test.ts", import.meta.url)),
    ],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
