/** Test-only local memory. Never imported by the application or initialized implicitly. */
import type { NotificationAdapter } from "../../packages/frontend/src/lib/notification-controller";
import {
  readPreferenceSnapshot,
  readTopicSnapshot,
  type PreferenceSnapshot,
  type TopicAction,
  type NotificationTopic,
} from "../../packages/frontend/src/lib/notification-state";

export function createSyntheticNotificationAdapter(seed: {
  settings: unknown;
  topics: unknown;
}) {
  let settings = readPreferenceSnapshot(seed.settings);
  let topics = readTopicSnapshot(seed.topics);
  const calls: Array<{ operation: string; payload?: unknown }> = [];
  const adapter: NotificationAdapter = {
    kind: "synthetic-test",
    async readSettings() {
      calls.push({ operation: "readSettings" });
      return settings;
    },
    async writeSettings(submitted: PreferenceSnapshot) {
      calls.push({ operation: "writeSettings", payload: submitted });
      settings = readPreferenceSnapshot(submitted);
      return { syntheticResponseIgnored: true };
    },
    async readTopics() {
      calls.push({ operation: "readTopics" });
      return topics;
    },
    async mutateTopic(
      action: TopicAction,
      body: Readonly<{ topic: NotificationTopic }>,
    ) {
      calls.push({ operation: action, payload: body });
      const previous = topics.topicSubscriptions[body.topic];
      const retained =
        previous !== null &&
        typeof previous === "object" &&
        !Array.isArray(previous)
          ? previous
          : {};
      topics = readTopicSnapshot({
        ...topics,
        topicSubscriptions: {
          ...topics.topicSubscriptions,
          [body.topic]: { ...retained, active: action === "subscribe" },
        },
      });
      return { syntheticResponseIgnored: true };
    },
  };
  return { adapter, calls };
}
