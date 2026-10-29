"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  createNotificationController,
  preferenceControl,
  topicControl,
  type NotificationAdapter,
  type NotificationController,
  type NotificationState,
} from "../../lib/notification-controller";
import {
  createNotificationActions,
  type TopicChange,
} from "../../lib/notification-actions";
import {
  NOTIFICATION_TOPICS,
  PREFERENCE_FIELDS,
  type NotificationTopic,
  type PreferenceGroup,
  type PreferencePatch,
} from "../../lib/notification-state";
import styles from "./notification-settings.module.css";

type NotificationContextValue = {
  active: boolean;
  controller: NotificationController;
  state: NotificationState;
  updateSettings: (patch: PreferencePatch) => void;
  setTopic: (change: TopicChange) => void;
  retrySettings: (() => void) | null;
  retryTopic: (() => void) | null;
};
const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

/**
 * Client-to-client injection only. Keep this above search/filter branches.
 * sessionKey is an explicit local ownership token, not authentication detection.
 */
export function NotificationSettingsProvider({
  adapter,
  open,
  sessionKey,
  children,
}: {
  adapter?: NotificationAdapter;
  open: boolean;
  sessionKey?: string;
  children: ReactNode;
}) {
  const controller = useMemo(
    () => createNotificationController(adapter),
    [adapter, sessionKey],
  );
  const serverSnapshot = useMemo(() => controller.getSnapshot(), [controller]);
  const state = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    () => serverSnapshot,
  );
  const actions = useMemo(
    () => createNotificationActions(controller),
    [controller],
  );
  const active = open && state.adapterKind === "synthetic-test";

  useEffect(() => {
    actions.clear();
    if (!active) {
      controller.reset();
      return;
    }
    void controller.loadSettings();
    void controller.loadTopics();
    // reset invalidates pending completions and remains reusable under StrictMode.
    // dispose would be terminal and break effect setup-cleanup-setup replay.
    return () => {
      actions.clear();
      controller.reset();
    };
  }, [controller, actions, active]);

  function updateSettings(patch: PreferencePatch) {
    if (active) void actions.updateSettings(patch);
  }
  function setTopic(change: TopicChange) {
    if (active) void actions.setTopic(change);
  }

  return (
    <NotificationContext.Provider
      value={{
        active,
        controller,
        state,
        updateSettings,
        setTopic,
        retrySettings: actions.hasSettingsRetry()
          ? () => {
              if (active) void actions.retrySettings();
            }
          : null,
        retryTopic: actions.hasTopicRetry()
          ? () => {
              if (active) void actions.retryTopic();
            }
          : null,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

/** Replaces only the mode label; the owner's surrounding badge is preserved. */
export function NotificationSettingsModeLabel({
  fallback,
}: {
  fallback: ReactNode;
}) {
  const context = useContext(NotificationContext);
  return <>{context?.active ? "Synthetic local data" : fallback}</>;
}

/** Preserve the exact existing unavailable notice unless explicitly injected. */
export function NotificationSettingsStatus({
  descriptionId,
  fallback,
}: {
  descriptionId: string;
  fallback: ReactNode;
}) {
  const context = useContext(NotificationContext);
  if (!context?.active) return <>{fallback}</>;
  const { controller, state } = context;
  const settingsBusy =
    state.settings.status === "loading" ||
    state.settingsMutation.status === "pending";
  const topicsBusy =
    state.topics.status === "loading" ||
    state.topicMutation.status === "pending";

  return (
    <section className={styles.notice} aria-label="Local notification adapter">
      <p id={descriptionId}>
        <strong>Synthetic local data — not account settings.</strong> Changes
        affect only the explicitly supplied local adapter. No account
        preference, real subscription, browser permission, or notification
        delivery is connected.
      </p>
      <p className={styles.status} role="status" aria-live="polite">
        {state.settingsMutation.status === "pending"
          ? "Saving local preferences… "
          : state.settings.status === "loading"
            ? "Loading local preferences… "
            : ""}
        {state.topicMutation.status === "pending"
          ? "Updating local topic…"
          : state.topics.status === "loading"
            ? "Loading local topics…"
            : ""}
      </p>
      {state.settings.error ? (
        <div className={styles.error}>
          <p role="alert">
            Local preferences could not be loaded. Values are unavailable.
          </p>
          <button
            type="button"
            disabled={settingsBusy}
            onClick={() => void controller.loadSettings()}
          >
            Retry local preferences
          </button>
        </div>
      ) : null}
      {state.settingsMutation.error ? (
        <div className={styles.error}>
          <p role="alert">
            Local preference change failed. The previous values were kept.
          </p>
          {context.retrySettings ? (
            <button
              type="button"
              disabled={settingsBusy || state.settings.stale}
              onClick={context.retrySettings}
            >
              Retry preference change
            </button>
          ) : null}
        </div>
      ) : null}
      {state.topics.error ? (
        <div className={styles.error}>
          <p role="alert">
            Local topics could not be refreshed. Their current state is
            unavailable.
          </p>
          <button
            type="button"
            disabled={topicsBusy}
            onClick={() => void controller.loadTopics()}
          >
            Retry local topics
          </button>
        </div>
      ) : null}
      {state.topicMutation.error ? (
        <div className={styles.error}>
          <p role="alert">
            Local topic change failed. The previous values were kept.
          </p>
          {context.retryTopic ? (
            <button
              type="button"
              disabled={topicsBusy || state.topics.stale}
              onClick={context.retryTopic}
            >
              Retry topic change
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

/** Known controls only; browser-push and all other settings retain the fallback. */
export function NotificationSettingControl({
  settingId,
  label,
  fallback,
}: {
  settingId: string;
  label: string;
  fallback: ReactNode;
}) {
  const context = useContext(NotificationContext);
  if (!context?.active) return <>{fallback}</>;
  const { state } = context;
  if (settingId.startsWith("topics.")) {
    const topic = settingId.slice("topics.".length) as NotificationTopic;
    if (!(NOTIFICATION_TOPICS as readonly string[]).includes(topic))
      return <>{fallback}</>;
    const control = topicControl(state, topic);
    if (!control.available) return <>{fallback}</>;
    return (
      <button
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={control.value}
        disabled={control.disabled}
        className={styles.switch}
        onClick={() =>
          context.setTopic({
            topic,
            action: control.value ? "unsubscribe" : "subscribe",
          })
        }
      >
        {control.value ? "On" : "Off"}
      </button>
    );
  }
  const [group, field, extra] = settingId.split(".");
  if (
    extra !== undefined ||
    !Object.hasOwn(PREFERENCE_FIELDS, group) ||
    !(
      PREFERENCE_FIELDS[group as PreferenceGroup] as readonly string[]
    ).includes(field)
  )
    return <>{fallback}</>;
  const control = preferenceControl(state, group as PreferenceGroup, field);
  if (!control.available) return <>{fallback}</>;
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={control.value}
      disabled={control.disabled}
      className={styles.switch}
      onClick={() =>
        context.updateSettings({
          [group]: { [field]: !control.value },
        } as PreferencePatch)
      }
    >
      {control.value ? "On" : "Off"}
    </button>
  );
}
