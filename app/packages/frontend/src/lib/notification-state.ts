/** Local notification state, not a recovered server schema. No account defaults. */
export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonObject
  | readonly JsonValue[];
export type JsonObject = { readonly [key: string]: JsonValue };
export type PreferenceSnapshot = JsonObject & {
  readonly chat: JsonObject;
  readonly social: JsonObject;
  readonly coins: JsonObject;
};

export const PREFERENCE_FIELDS = {
  chat: ["allowGroupNotifications", "allowChatRequestNotifications"],
  social: [
    "allowDmMessageNotifications",
    "allowFollowerNotifications",
    "allowNewCoinNotifications",
    "allowCoinWatcherNotifications",
  ],
  coins: [
    "allowPriceSpikeNotifications",
    "allowLiveStreamNotifications",
    "allowCalloutNotifications",
  ],
} as const;
export type PreferenceGroup = keyof typeof PREFERENCE_FIELDS;
export type PreferencePatch = {
  readonly [G in PreferenceGroup]?: Partial<
    Record<(typeof PREFERENCE_FIELDS)[G][number], boolean>
  >;
};
export const NOTIFICATION_TOPICS = [
  "trending",
  "trending_searches",
  "quiet_trending_searches",
] as const;
export type NotificationTopic = (typeof NOTIFICATION_TOPICS)[number];
export type TopicAction = "subscribe" | "unsubscribe";
export type TopicSnapshot = JsonObject & {
  readonly topicSubscriptions: JsonObject;
};
export type KnownBoolean =
  | { readonly available: false }
  | { readonly available: true; readonly value: boolean };

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/** Defensive JSON boundary; validates only local safety, never a full API schema. */
export function copyJson(
  value: unknown,
  ancestors = new Set<object>(),
): JsonValue {
  if (value === null || typeof value === "boolean" || typeof value === "string")
    return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "object" || value === null || ancestors.has(value))
    throw new TypeError("Expected acyclic JSON data");
  if (!Array.isArray(value) && !isRecord(value))
    throw new TypeError("Expected plain JSON data");
  ancestors.add(value);
  try {
    const result: JsonValue = Array.isArray(value)
      ? Array.from(value, (item) => copyJson(item, ancestors))
      : Object.fromEntries(
          Object.entries(value).map(([key, item]) => [
            key,
            copyJson(item, ancestors),
          ]),
        );
    return Object.freeze(result);
  } finally {
    ancestors.delete(value);
  }
}

export function readPreferenceSnapshot(value: unknown): PreferenceSnapshot {
  if (
    !isRecord(value) ||
    !isRecord(value.chat) ||
    !isRecord(value.social) ||
    !isRecord(value.coins)
  )
    throw new TypeError("Expected the three preference groups");
  return copyJson(value) as PreferenceSnapshot;
}

export function readTopicSnapshot(value: unknown): TopicSnapshot {
  if (!isRecord(value) || !isRecord(value.topicSubscriptions))
    throw new TypeError("Expected a topicSubscriptions object");
  return copyJson(value) as TopicSnapshot;
}

/** Captured helper submits exactly these three groups, not unknown root fields. */
export function mergePreferencePatch(
  current: PreferenceSnapshot | null,
  patch: PreferencePatch,
): PreferenceSnapshot | null {
  if (current === null) return null;
  if (!isRecord(patch)) throw new TypeError("Expected a preference patch");
  for (const [group, changes] of Object.entries(patch)) {
    if (!Object.hasOwn(PREFERENCE_FIELDS, group) || !isRecord(changes))
      throw new TypeError("Unsupported preference group");
    const supported = PREFERENCE_FIELDS[
      group as PreferenceGroup
    ] as readonly string[];
    if (
      Object.entries(changes).some(
        ([field, value]) =>
          !supported.includes(field) || typeof value !== "boolean",
      )
    )
      throw new TypeError("Unsupported preference change");
  }
  return readPreferenceSnapshot({
    chat: { ...current.chat, ...patch.chat },
    social: { ...current.social, ...patch.social },
    coins: { ...current.coins, ...patch.coins },
  });
}

export function preferenceValue(
  current: PreferenceSnapshot | null,
  group: PreferenceGroup,
  field: string,
): KnownBoolean {
  const value = current?.[group][field];
  return typeof value === "boolean"
    ? { available: true, value }
    : { available: false };
}

/** Unlike the captured truthiness fallback, absent/malformed values stay unknown. */
export function topicValue(
  current: TopicSnapshot | null,
  topic: NotificationTopic,
): KnownBoolean {
  const entry = current?.topicSubscriptions[topic];
  const value = isRecord(entry) ? entry.active : undefined;
  return typeof value === "boolean"
    ? { available: true, value }
    : { available: false };
}
