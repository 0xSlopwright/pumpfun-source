// Isolated authored harness. Does not execute captured JS or open destinations.
import assert from "node:assert/strict";
import { readFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { once } from "node:events";
import { verify } from "../scripts/original-privacy-external-links.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
await verify(root);
const require = createRequire(
  new URL("../packages/frontend/package.json", import.meta.url),
);
const { chromium } = require("@playwright/test");
const clientPath = path.join(
    root,
    "reconstruction/privacy-external-links/client.mjs",
  ),
  client = await readFile(clientPath);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const profile = await mkdtemp(path.join(os.tmpdir(), "pump-privacy-browser-"));
const requests = [],
  errors = [],
  blocked = [],
  checks = [];
const html = `<!doctype html><meta charset="utf-8"><title>Synthetic local privacy verification</title>
<h1>Synthetic local verification harness</h1><p>No production navigation, native UI or visual-parity claim.</p>
<label>URL <input id="url" value="other.invalid/path"></label><button id="request">Request</button>
<button id="require">Require confirmation</button><p>Preference: <output id="preference"></output></p>
<section id="dialog" hidden><p>Pending: <output id="pending"></output></p>
<label id="remember-label"><input id="remember" type="checkbox">Don't ask again</label>
<button id="confirm">Confirm</button><button id="cancel">Cancel</button></section>
<pre id="opened"></pre>
<script type="module">
import {privacyPreferenceRuntime,outboundConfirmation,preferenceKey} from '/privacy-client.mjs';
const runtime=privacyPreferenceRuntime({getStorage:()=>localStorage,events:window,createStorageEvent:(type,init)=>new StorageEvent(type,init)});
const preference=runtime.preference(), opened=[];
const model=outboundConfirmation({preference,settingsHubEnabled:true,openWindow:(...args)=>{opened.push(args);render();return null;}});
function render(){const s=model.getSnapshot();document.querySelector('#preference').textContent=String(preference.read());
document.querySelector('#dialog').hidden=!s.open;document.querySelector('#pending').textContent=s.pendingUrl??'';
document.querySelector('#remember-label').hidden=!s.settingsHubEnabled;document.querySelector('#remember').checked=s.dontAskAgain;
document.querySelector('#opened').textContent=JSON.stringify(opened);}
model.subscribe(render);preference.subscribe(render);
document.querySelector('#request').onclick=event=>model.handleLinkClick(event,{href:document.querySelector('#url').value});
document.querySelector('#remember').onchange=event=>model.setDontAskAgain(event.target.checked);
document.querySelector('#confirm').onclick=()=>model.confirm();document.querySelector('#cancel').onclick=()=>model.cancel();
document.querySelector('#require').onclick=()=>preference.write(true);
window.privacyHarness={model,preference,opened,key:preferenceKey};render();
</script>`;
const server = createServer((request, response) => {
  const pathname = new URL(request.url, "http://127.0.0.1").pathname;
  requests.push(pathname);
  if (pathname === "/") {
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(html);
  } else if (pathname === "/privacy-client.mjs") {
    response.writeHead(200, {
      "content-type": "text/javascript; charset=utf-8",
    });
    response.end(client);
  } else {
    response.writeHead(404);
    response.end();
  }
});
server.listen(0, "127.0.0.1");
await once(server, "listening");
const origin = `http://127.0.0.1:${server.address().port}`;
let context;
async function launch(viewport) {
  context = await chromium.launchPersistentContext(profile, {
    headless: true,
    viewport,
  });
  await context.route("**/*", (route) => {
    if (new URL(route.request().url()).origin === origin)
      return route.continue();
    blocked.push(route.request().url());
    return route.abort();
  });
  context.on("page", (page) =>
    page.on("pageerror", (error) => errors.push(String(error))),
  );
  const page = context.pages()[0] ?? (await context.newPage());
  page.on("pageerror", (error) => errors.push(String(error)));
  await page.goto(origin);
  await page.waitForFunction(() => !!window.privacyHarness);
  return page;
}
try {
  let page = await launch({ width: 1280, height: 900 });
  assert.equal(await page.locator("#preference").textContent(), "true");
  await page.evaluate(() =>
    localStorage.setItem("synthetic-unrelated", "preserve"),
  );
  await page.locator("#request").click();
  assert.equal(await page.locator("#dialog").isVisible(), true);
  await page.locator("#remember").check();
  await page.locator("#confirm").click();
  assert.equal(
    await page.evaluate(() => localStorage.getItem(window.privacyHarness.key)),
    "false",
  );
  assert.equal(await page.locator("#dialog").isVisible(), false);
  assert.deepEqual(await page.evaluate(() => window.privacyHarness.opened), [
    ["https://other.invalid/path", "_blank", "noopener,noreferrer"],
  ]);
  checks.push(
    "desktop explicit confirmation writes real browser JSON false before injected open; popup return is ignored",
  );
  await context.close();
  context = null;
  page = await launch({ width: 1280, height: 900 });
  assert.equal(await page.locator("#preference").textContent(), "false");
  await page.locator("#request").click();
  assert.equal(await page.locator("#dialog").isVisible(), false);
  assert.equal(
    await page.evaluate(() => window.privacyHarness.opened.length),
    1,
  );
  assert.equal(
    await page.evaluate(() => localStorage.getItem("synthetic-unrelated")),
    "preserve",
  );
  checks.push(
    "complete browser-process restart with same isolated profile retains preference and unrelated data",
  );
  const second = await context.newPage();
  await second.goto(origin);
  await second.waitForFunction(() => !!window.privacyHarness);
  assert.equal(await second.locator("#preference").textContent(), "false");
  await page.locator("#require").click();
  await second.waitForFunction(
    () => document.querySelector("#preference").textContent === "true",
  );
  checks.push("second real page observes native cross-tab storage event");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#request").click();
  await page.locator("#remember").check();
  await page.locator("#cancel").click();
  assert.equal(
    await page.evaluate(() => localStorage.getItem(window.privacyHarness.key)),
    "true",
  );
  await page.locator("#request").click();
  assert.equal(await page.locator("#remember").isChecked(), false);
  await page.evaluate(() =>
    window.privacyHarness.model.setSettingsHubEnabled(false),
  );
  assert.equal(await page.locator("#remember-label").isVisible(), false);
  await page.locator("#confirm").click();
  assert.equal(
    await page.evaluate(() => localStorage.getItem(window.privacyHarness.key)),
    "true",
  );
  checks.push(
    "mobile-viewport cancel/reset and disabled-hub confirmation do not persist a bypass",
  );
  assert.deepEqual(blocked, []);
  assert.deepEqual(errors, []);
  const result = {
    result: "PASS",
    classification:
      "Synthetic isolated browser client workflow, no native UI/visual/upstream compatibility",
    clientSha256: hash(client),
    browserScriptSha256: hash(await readFile(fileURLToPath(import.meta.url))),
    contractSha256: hash(
      await readFile(
        path.join(root, "reconstruction/privacy-external-links/contract.json"),
      ),
    ),
    browserVersion: context.browser()?.version() ?? null,
    viewports: [
      [1280, 900],
      [390, 844],
    ],
    browserProcessRestarts: 1,
    checks,
    pageErrors: errors,
    externalRequests: blocked,
    localRequestPaths: [...new Set(requests)],
    actualDestinationOpened: false,
    capturedCodeExecuted: false,
  };
  const at = process.argv.indexOf("--output");
  if (at !== -1)
    await writeFile(
      path.resolve(process.argv[at + 1]),
      JSON.stringify(result, null, 2) + "\n",
    );
  console.log(JSON.stringify(result));
} finally {
  await context?.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  await rm(profile, { recursive: true, force: true });
}
