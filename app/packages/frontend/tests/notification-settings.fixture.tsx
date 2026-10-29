/** Test-only React entry point. Never imported by an application route. */
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  NotificationSettingsModeLabel,
  NotificationSettingsProvider,
  NotificationSettingsStatus,
  NotificationSettingControl,
} from "../src/components/settings/notification-settings";
import type { NotificationAdapter } from "../src/lib/notification-controller";
import { createSyntheticNotificationAdapter } from "../../../tests/helpers/notification-test-adapter";

function createHarnessAdapter(name: string) {
  const memory = createSyntheticNotificationAdapter({
    settings: {
      chat: { allowGroupNotifications: false, extra: { keep: "group" } },
      social: { allowFollowerNotifications: false },
      coins: { allowCalloutNotifications: false },
      extraRoot: "read only",
    },
    topics: {
      topicSubscriptions: { trending: { active: false, extra: "keep" } },
    },
  });
  const calls: Array<{ operation: string; payload?: unknown }> = [];
  let failSettings = false;
  let failTopic = false;
  let failTopicsRead = false;
  let holdSettings = false;
  let releaseSettings: (() => void) | undefined;
  const adapter: NotificationAdapter = {
    kind: "synthetic-test",
    async readSettings() {
      calls.push({ operation: "readSettings" });
      return memory.adapter.readSettings();
    },
    async writeSettings(payload) {
      calls.push({ operation: "writeSettings", payload });
      if (holdSettings) {
        holdSettings = false;
        await new Promise<void>((resolve) => {
          releaseSettings = resolve;
        });
      }
      if (failSettings) {
        failSettings = false;
        throw new Error("test settings failure");
      }
      const result = await memory.adapter.writeSettings(payload);
      calls.push({ operation: "writeSettings:completed" });
      return result;
    },
    async readTopics() {
      calls.push({ operation: "readTopics" });
      if (failTopicsRead) {
        failTopicsRead = false;
        throw new Error("test refresh failure");
      }
      return memory.adapter.readTopics();
    },
    async mutateTopic(action, payload) {
      calls.push({ operation: action, payload });
      if (failTopic) {
        failTopic = false;
        throw new Error("test topic failure");
      }
      return memory.adapter.mutateTopic(action, payload);
    },
  };
  return {
    name,
    adapter,
    calls: () => calls,
    holdSettings: () => {
      holdSettings = true;
    },
    releaseSettings: () => {
      releaseSettings?.();
      releaseSettings = undefined;
    },
    failSettings: () => {
      failSettings = true;
    },
    failTopic: () => {
      failTopic = true;
    },
    failTopicsRead: () => {
      failTopicsRead = true;
    },
  };
}
const first = createHarnessAdapter("first");
const second = createHarnessAdapter("second");
const fixture = { first, second };
declare global {
  interface Window {
    notificationFixture: typeof fixture;
  }
}
window.notificationFixture = fixture;

const definitions = [
  { id: "chat.allowGroupNotifications", label: "Group chats" },
  { id: "social.allowFollowerNotifications", label: "New followers" },
  { id: "coins.allowCalloutNotifications", label: "Callouts" },
  { id: "topics.trending", label: "Trending livestreams" },
  { id: "topics.quiet_trending_searches", label: "Missing topic" },
  { id: "notifications.browserPush", label: "Browser notifications" },
];
function Harness() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(true);
  const [session, setSession] = useState<"first" | "second">("first");
  const [search, setSearch] = useState("");
  const [mount, setMount] = useState(0);
  return (
    <main>
      <h1>Notification component test fixture</h1>
      <p>
        Explicit synthetic adapter. This entry point is not an application
        route.
      </p>
      <button
        onClick={() => {
          setEnabled(true);
          setMount((value) => value + 1);
        }}
      >
        Enable synthetic fixture
      </button>
      <button onClick={() => setEnabled(false)}>Use unavailable adapter</button>
      <button onClick={() => setOpen(false)}>Close fixture</button>
      <button onClick={() => setOpen(true)}>Open fixture</button>
      <button
        onClick={() =>
          setSession((value) => (value === "first" ? "second" : "first"))
        }
      >
        Change local session
      </button>
      <output aria-label="Local session">{session}</output>
      <NotificationSettingsProvider
        key={mount}
        adapter={enabled ? fixture[session].adapter : undefined}
        open={open}
        sessionKey={session}
      >
        <div hidden={!open} aria-label="Fixture panel">
          <p>
            <NotificationSettingsModeLabel fallback="Read-only reconstruction" />
          </p>
          <NotificationSettingsStatus
            descriptionId="fixture-description"
            fallback={
              <p id="fixture-description">Default values unavailable.</p>
            }
          />
          <label>
            Filter controls{" "}
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div
            role="region"
            aria-label="Notification rows"
            aria-describedby="fixture-description"
          >
            {definitions
              .filter((item) =>
                item.label.toLowerCase().includes(search.toLowerCase()),
              )
              .map((setting) => (
                <div
                  key={setting.id}
                  data-setting-id={setting.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: 12,
                  }}
                >
                  <span>{setting.label}</span>
                  <NotificationSettingControl
                    settingId={setting.id}
                    label={setting.label}
                    fallback={<span className="unavailable">Unavailable</span>}
                  />
                </div>
              ))}
          </div>
        </div>
      </NotificationSettingsProvider>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Harness />
  </StrictMode>,
);
