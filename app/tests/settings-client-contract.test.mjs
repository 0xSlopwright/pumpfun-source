import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import {
  recover,
  verify,
  parseFlightRecords,
  outputPath,
} from "../scripts/settings-client-contract.mjs";
const root = fileURLToPath(new URL("..", import.meta.url));
const sha = (b) => createHash("sha256").update(b).digest("hex");
const contract = verify(root);
function temporary() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pump-settings-contract-"));
  const manifest = JSON.parse(
    fs.readFileSync(path.join(root, "evidence/web/manifest.json")),
  );
  const sources = new Set(
    contract.sources.flatMap((m) => m.origins.map((o) => o.source)),
  );
  for (const r of manifest.records)
    if (r.path && r.headers?.["content-type"]?.includes("text/html"))
      sources.add(r.path);
  for (const name of [
    ...sources,
    "recovered/modules.json",
    "evidence/web/manifest.json",
    "contracts/internal-operations.json",
    outputPath,
  ]) {
    const target = path.join(dir, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(root, name), target);
  }
  return { dir, close: () => fs.rmSync(dir, { recursive: true, force: true }) };
}
function resealFactory(dir, id, mutate) {
  const catalogPath = path.join(dir, "recovered/modules.json"),
    catalog = JSON.parse(fs.readFileSync(catalogPath));
  const record = catalog.modules.find((m) => m.ids.includes(id));
  assert.equal(record.origins.length, 1);
  const origin = record.origins[0],
    sourcePath = path.join(dir, origin.source),
    source = fs.readFileSync(sourcePath, "utf8"),
    before = source.slice(origin.start, origin.end),
    after = mutate(before);
  assert.notEqual(after, before);
  assert.equal(
    after.length,
    before.length,
    "semantic tamper preserves UTF-16 ranges",
  );
  fs.writeFileSync(
    sourcePath,
    source.slice(0, origin.start) + after + source.slice(origin.end),
  );
  record.sha256 = sha(after);
  fs.writeFileSync(catalogPath, JSON.stringify(catalog));
  const manifestPath = path.join(dir, "evidence/web/manifest.json"),
    manifest = JSON.parse(fs.readFileSync(manifestPath));
  for (const r of manifest.records)
    if (r.path === origin.source) r.sha256 = sha(fs.readFileSync(sourcePath));
  fs.writeFileSync(manifestPath, JSON.stringify(manifest));
}

test("two absent ledger operations bind both Hermes variants and the complete expanded inventory", () => {
  assert.equal(contract.inventory.factory_count, 5947);
  assert.equal(contract.transport.provider_variants.length, 2);
  assert.deepEqual(
    contract.operations.map((o) => [o.method, o.browser_request_path]),
    [
      ["GET", "/api/hermes/v1/user-preferences/settings"],
      ["PUT", "/api/hermes/v1/user-preferences/settings"],
    ],
  );
  assert.equal(contract.novelty.new_settings_operations, 2);
  assert.deepEqual(contract.unresolved_direct_import_ids, []);
  assert.ok(contract.sources.some((s) => s.ids.includes(96224)));
  assert.ok(contract.sources.some((s) => s.ids.includes(894228)));
  assert.equal(contract.transport.timeout_ms, 60000);
  assert.equal(contract.transport.authorization_header_hook, false);
  assert.equal(contract.operations[0].success.runtime_schema_validation, false);
  assert.equal(contract.operations[1].success.parse_response_body, false);
});

test("nine nullish UI defaults retain false/zero and are not asserted as server schema/defaults", () => {
  assert.equal(contract.settings.controls.length, 9);
  assert.equal(contract.settings.server_default_values_known, false);
  assert.equal(contract.settings.complete_server_schema_known, false);
  for (const control of contract.settings.controls) {
    assert.equal(control.operator, "??");
    assert.equal(control.fallback, true);
    assert.equal(control.optional_base_only, true);
    // Independent consumer of the declarative nullish/base-only rule. This is
    // handwritten test logic, never evaluation of the captured factory.
    const display = (data) =>
      (data == null ? undefined : data[control.group][control.field]) ??
      control.fallback;
    assert.equal(display(undefined), true);
    assert.equal(display(null), true);
    for (const value of [false, true, 0, ""])
      assert.equal(
        display({ [control.group]: { [control.field]: value } }),
        value,
      );
    assert.equal(display({ [control.group]: { [control.field]: null } }), true);
    assert.throws(() => display({}), TypeError);
  }
});

test("group-merge and mutation cache describe input ownership rather than PUT response JSON", () => {
  const update = contract.settings.update;
  assert.deepEqual(update.groups, ["chat", "social", "coins"]);
  assert.equal(update.requires_truthy_loaded_data, true);
  assert.equal(update.unknown_existing_group_fields_preserved, true);
  assert.equal(update.unknown_top_level_groups_not_copied, true);
  const existing = {
    chat: { hiddenServerField: 7, allowGroupNotifications: true },
    social: { allowFollowerNotifications: true },
    coins: {},
    extra: { notCopied: true },
  };
  const patch = { social: { allowFollowerNotifications: false } };
  const merged = Object.fromEntries(
    update.groups.map((group) => [
      group,
      { ...existing[group], ...patch[group] },
    ]),
  );
  assert.equal(merged.chat.hiddenServerField, 7);
  assert.equal(merged.social.allowFollowerNotifications, false);
  assert.equal(merged.extra, undefined);
  assert.equal(update.cache_on_success.value, "same submitted object");
  assert.equal(update.cache_on_success.response_body_not_read, true);
  const rule = contract.settings.query.scope_rule;
  const viewerKey = (viewer) =>
    rule.field_precedence.map((field) => viewer[field]?.trim()).find(Boolean) ??
    rule.empty_result;
  assert.equal(
    viewerKey({ userId: " user-42 ", address: "wallet-1" }),
    "user-42",
  );
  assert.equal(viewerKey({ userId: " ", address: " wallet-1 " }), "wallet-1");
  assert.equal(viewerKey({}), null);
  const a = [...update.cache_on_success.key_prefix, viewerKey({ userId: "A" })],
    b = [...update.cache_on_success.key_prefix, viewerKey({ userId: "B" })];
  assert.notDeepEqual(a, b);
});

test("dated provider config is parsed from inert Flight records, not inferred from hostname strings", () => {
  assert.equal(contract.configuration.schema_enforced_at_provider, true);
  assert.equal(contract.configuration.captured_configurations.length, 12);
  for (const observation of contract.configuration.captured_configurations) {
    assert.equal(observation.provider_module, 96224);
    assert.equal(
      observation.config.clientServerUrl,
      "https://frontend-api-v3.pump.fun",
    );
    assert.equal(observation.config.hermesNotificationsAvailable, false);
    assert.equal(observation.api_bearer_token_present, false);
  }
  assert.equal(
    contract.settings.query.captured_configuration_disables_query,
    true,
  );
  assert.deepEqual(contract.presence.service_binding.captured_service_origins, [
    "https://frontend-api-v3.pump.fun",
  ]);
  assert.equal(
    contract.presence.service_binding.actual_presence_hook_callsite_found,
    false,
  );
  assert.equal(contract.presence.patch.sharesLastActive.optional, true);
  assert.equal(contract.presence.response.sharesLastActive.required, true);
});

test("Flight byte-length text cannot smuggle fake records; Unicode and no separator are preserved", () => {
  const text = '🌱\n99:I[96224,[],"ApiClientsConfigProvider"]\n';
  const stream =
    ':HL["style"]\n:NaN\n1:T' +
    Buffer.byteLength(text).toString(16) +
    "," +
    text +
    '2:{"actual":true}\n';
  const rows = parseFlightRecords(stream);
  assert.equal(rows.get("1").kind, "text");
  assert.equal(rows.get("1").value, text);
  assert.equal(rows.has("99"), false);
  assert.deepEqual(rows.get("2").value, { actual: true });
  assert.throws(
    () => parseFlightRecords("1:Tff,short"),
    /truncated Flight text/,
  );
  assert.throws(
    () => parseFlightRecords(":Qunsupported\n"),
    /unsupported unnumbered/,
  );
});

test("every AST evidence expression binds exact original UTF-16 ranges", () => {
  let checked = 0;
  function walk(value) {
    if (!value || typeof value !== "object") return;
    if (typeof value.expression === "string" && Array.isArray(value.ranges))
      for (const range of value.ranges) {
        const source = fs.readFileSync(path.join(root, range.source), "utf8");
        assert.equal(source.slice(range.start, range.end), value.expression);
        checked++;
      }
    Object.values(value).forEach((child) => {
      if (Array.isArray(child)) child.forEach(walk);
      else if (child && typeof child === "object") walk(child);
    });
  }
  walk(contract);
  assert.ok(checked > 20);
});

test("raw capture corruption fails before semantic extraction", () => {
  const t = temporary();
  try {
    const source = contract.sources[0].origins[0].source;
    fs.appendFileSync(path.join(t.dir, source), " ");
    assert.throws(() => verify(t.dir), /capture binding/);
  } finally {
    t.close();
  }
});

test("omitting one provider variant is rejected even at the same total inventory size", () => {
  const t = temporary();
  try {
    const p = path.join(t.dir, "recovered/modules.json"),
      c = JSON.parse(fs.readFileSync(p));
    c.modules.find((m) => m.ids.includes(944410)).ids = [999999999];
    fs.writeFileSync(p, JSON.stringify(c));
    assert.throws(() => recover(t.dir), /both captured 944410 variants/);
  } finally {
    t.close();
  }
});

test("resealed default tamper is derived and a stale contract cannot pass", () => {
  const t = temporary();
  try {
    resealFactory(t.dir, 917781, (s) =>
      s.replace(
        ".allowDmMessageNotifications??!0",
        ".allowDmMessageNotifications??!1",
      ),
    );
    const changed = recover(t.dir);
    assert.equal(
      changed.settings.controls.find(
        (c) => c.field === "allowDmMessageNotifications",
      ).fallback,
      false,
    );
    assert.throws(() => verify(t.dir), /generated contract differs/);
  } finally {
    t.close();
  }
});

test("resealed PUT body-mode and cache-value changes fail actual source relationships", () => {
  for (const [mutate, error] of [
    [(s) => s.replace("json:e", "body:e"), /PUT must serialize/],
    [
      (s) =>
        s.replace(
          "setQueryData(u.F.settings(Q),e)",
          "setQueryData(u.F.settings(Q),0)",
        ),
      /cache must receive/,
    ],
  ]) {
    const t = temporary();
    try {
      resealFactory(t.dir, 917781, mutate);
      assert.throws(() => recover(t.dir), error);
    } finally {
      t.close();
    }
  }
});

test("resealed timeout change is visible and metadata claiming response validation is rejected", () => {
  const t = temporary();
  try {
    resealFactory(t.dir, 30181, (s) => s.replace("timeout:6e4", "timeout:1e4"));
    assert.equal(recover(t.dir).transport.timeout_ms, 10000);
    assert.throws(() => verify(t.dir), /generated contract differs/);
  } finally {
    t.close();
  }
  const u = temporary();
  try {
    const p = path.join(u.dir, outputPath),
      c = JSON.parse(fs.readFileSync(p));
    c.operations[0].success.runtime_schema_validation = true;
    fs.writeFileSync(p, JSON.stringify(c));
    assert.throws(() => verify(u.dir), /generated contract differs/);
  } finally {
    u.close();
  }
});

test("resealed query gating and GET decoder changes cannot retain the recovered behavior", () => {
  for (const [mutate, error] of [
    [
      (source) => source.replace("O&&$&&null!==z", () => "O||$&&null!==z"),
      /three AND terms/,
    ],
    [
      (source) =>
        source.replace(
          'get("v1/user-preferences/settings").json()',
          'get("v1/user-preferences/settings").text()',
        ),
      /bare JSON decoding/,
    ],
  ]) {
    const fixture = temporary();
    try {
      resealFactory(fixture.dir, 917781, mutate);
      assert.throws(() => recover(fixture.dir), error);
    } finally {
      fixture.close();
    }
  }
});

test("a resealed SSR availability change is recovered rather than forced to the old snapshot", () => {
  const fixture = temporary();
  try {
    const observation = contract.configuration.captured_configurations[0];
    const file = path.join(fixture.dir, observation.source),
      before = fs.readFileSync(file, "utf8");
    const field = before.indexOf("hermesNotificationsAvailable"),
      at = before.indexOf("false", field);
    assert.ok(field >= 0 && at - field < 50);
    fs.writeFileSync(
      file,
      before.slice(0, at) + "true " + before.slice(at + 5),
    );
    const manifestFile = path.join(fixture.dir, "evidence/web/manifest.json"),
      manifest = JSON.parse(fs.readFileSync(manifestFile));
    for (const row of manifest.records)
      if (row.path === observation.source)
        row.sha256 = sha(fs.readFileSync(file));
    fs.writeFileSync(manifestFile, JSON.stringify(manifest));
    const changed = recover(fixture.dir);
    assert.ok(
      changed.configuration.captured_configurations.some(
        (row) => row.config.hermesNotificationsAvailable,
      ),
    );
    assert.equal(
      changed.settings.query.captured_configuration_disables_query,
      false,
    );
    assert.throws(() => verify(fixture.dir), /generated contract differs/);
  } finally {
    fixture.close();
  }
});
