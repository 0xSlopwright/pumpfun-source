import type { NotificationController } from "./notification-controller";
import {
  NOTIFICATION_TOPICS,
  copyJson,
  mergePreferencePatch,
  type NotificationTopic,
  type PreferencePatch,
  type TopicAction,
} from "./notification-state";

export type TopicChange = Readonly<{
  topic: NotificationTopic;
  action: TopicAction;
}>;

/** Local UI retry intent: ignored pending attempts never replace a submitted action. */
export function createNotificationActions(controller: NotificationController) {
  let lastSettings: PreferencePatch | null = null;
  let lastTopic: TopicChange | null = null;

  function updateSettings(patch: PreferencePatch) {
    const state = controller.getSnapshot();
    const canSubmit =
      state.adapterKind === "synthetic-test" &&
      state.settingsMutation.status !== "pending" &&
      state.settings.status !== "loading" &&
      state.settings.data !== null &&
      !state.settings.stale;
    if (canSubmit) {
      try {
        mergePreferencePatch(state.settings.data, patch);
        lastSettings = copyJson(patch) as PreferencePatch;
      } catch {
        lastSettings = null;
      }
    }
    return controller.updateSettings(patch);
  }

  function setTopic(change: TopicChange) {
    const state = controller.getSnapshot();
    const canSubmit =
      state.adapterKind === "synthetic-test" &&
      state.topicMutation.status !== "pending" &&
      state.topics.status !== "loading" &&
      state.topics.data !== null &&
      !state.topics.stale;
    if (canSubmit) {
      lastTopic =
        (NOTIFICATION_TOPICS as readonly string[]).includes(change.topic) &&
        ["subscribe", "unsubscribe"].includes(change.action)
          ? Object.freeze({ ...change })
          : null;
    }
    return controller.setTopic(change.topic, change.action);
  }

  return Object.freeze({
    updateSettings,
    setTopic,
    hasSettingsRetry: () => lastSettings !== null,
    hasTopicRetry: () => lastTopic !== null,
    retrySettings: () =>
      lastSettings === null ? undefined : updateSettings(lastSettings),
    retryTopic: () => (lastTopic === null ? undefined : setTopic(lastTopic)),
    clear() {
      lastSettings = null;
      lastTopic = null;
    },
  });
}
