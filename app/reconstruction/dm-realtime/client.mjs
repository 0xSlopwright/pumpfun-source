// Original-client state reconstruction with explicit application ports.
// No transport/authentication, listener, timer or connection starts on import.
export function parseDmSignal(value) {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    typeof value.type !== "string" ||
    typeof value.messageId !== "string" ||
    typeof value.conversationId !== "string" ||
    (value.senderId !== undefined && typeof value.senderId !== "string") ||
    (value.createdAt !== undefined && typeof value.createdAt !== "string")
  )
    return;
  return {
    type: value.type,
    messageId: value.messageId,
    conversationId: value.conversationId,
    ...(value.senderId !== undefined ? { senderId: value.senderId } : {}),
    ...(value.createdAt !== undefined ? { createdAt: value.createdAt } : {}),
  };
}

export const dmRealtimeSubject = (userId) => `dm.user.${userId}`;
export const perUserAuthReady = ({ flag, ready }) => !flag || ready;

// One instance corresponds to one mounted useDmRealtimeSignals hook. Call
// configure for input changes and dispose for unmount. The original hook keeps
// its seen IDs and outstanding leading/trailing window across input changes.
export function dmRealtimeSession({
  queryClient,
  subscribe,
  unsubscribe,
  visibilityTarget,
  visibilityState,
  onPeerMessage,
  onSubscriptionError,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
  random = Math.random,
  initial = {},
}) {
  let state = {
    enabled: false,
    userId: null,
    viewer: null,
    authReady: false,
    connected: false,
  };
  let enabled = false,
    ready = false,
    closed = false;
  let seenConnection = false,
    needsReconnect = false;
  let leadingWindow = null,
    reconnectTimer = null,
    visibilityListener = null;
  let subscriptionId = null,
    subscriptionType = null,
    subscribedSubject = null;
  const seen = new Set();
  const invalidator = (viewer) => () => {
    queryClient.invalidateQueries({ queryKey: ["dms", "inbox", viewer] });
    queryClient.invalidateQueries({ queryKey: ["dms", "messages", viewer] });
  };
  let invalidate = invalidator(state.viewer);
  function refreshWindow() {
    if (leadingWindow) {
      leadingWindow.pending = true;
      return;
    }
    const refresh = invalidate;
    refresh();
    const timer = setTimer(() => {
      const previous = leadingWindow;
      leadingWindow = null;
      if (previous?.pending) refresh();
    }, 1000);
    leadingWindow = { timer, pending: false };
  }
  // Stable dispatcher corresponds to useEventSubscription's latest-callback
  // ref. Changes to callback/viewer alone do not resubscribe the same subject.
  function receive(value) {
    const event = parseDmSignal(value);
    if (!event || event.type !== "dm_message" || seen.has(event.messageId))
      return;
    if (seen.size >= 500) {
      const first = seen.values().next().value;
      if (first !== undefined) seen.delete(first);
    }
    seen.add(event.messageId);
    if (event.senderId !== undefined && event.senderId !== state.userId)
      onPeerMessage({
        messageId: event.messageId,
        conversationId: event.conversationId,
        peerId: event.senderId,
        deliveryChannel: 1,
        createdAt: event.createdAt,
      });
    refreshWindow();
  }
  function stopSubscription() {
    // The source cleanup tests the subscription ID's truthiness. Do not infer
    // an upstream numeric-ID API or silently turn a falsy ID into a real one.
    if (subscriptionId && subscriptionType) {
      unsubscribe(subscriptionType, subscriptionId);
      subscriptionId = null;
      subscriptionType = null;
    }
  }
  function clearReconnect() {
    if (reconnectTimer !== null) {
      clearTimer(reconnectTimer);
      reconnectTimer = null;
    }
  }
  function stopVisibility() {
    if (visibilityListener) {
      visibilityTarget.removeEventListener(
        "visibilitychange",
        visibilityListener,
      );
      visibilityListener = null;
    }
  }
  function configure(next) {
    if (closed) throw Error("Disposed DM realtime session");
    const previous = state,
      previousEnabled = enabled,
      previousReady = ready;
    state = { ...state, ...next };
    enabled = state.enabled && state.userId !== null;
    ready = enabled && state.authReady;
    const viewerChanged = previous.viewer !== state.viewer;
    if (viewerChanged) invalidate = invalidator(state.viewer);
    // Dependencies of the captured reconnect effect: [ready, connected, k].
    if (
      previousReady !== ready ||
      previous.connected !== state.connected ||
      viewerChanged
    ) {
      clearReconnect();
      if (ready) {
        if (!state.connected) {
          if (seenConnection) needsReconnect = true;
        } else {
          seenConnection = true;
          if (needsReconnect) {
            const refresh = invalidate;
            reconnectTimer = setTimer(() => {
              reconnectTimer = null;
              needsReconnect = false;
              refresh();
            }, 5000 * random());
          }
        }
      }
    }
    const subject =
      state.userId === null ? "" : dmRealtimeSubject(state.userId);
    // Actual subscription effect uses [enabled, type, subject, stable callback,
    // subscribe, cleanup, coalesce]; callback changes go through the ref above.
    if (previousReady !== ready || subject !== subscribedSubject) {
      stopSubscription();
      subscribedSubject = subject;
      if (ready && subject) {
        try {
          subscriptionId = subscribe("CORE", subject, receive, undefined, {
            coalesce: false,
          });
          subscriptionType = "CORE";
        } catch (error) {
          onSubscriptionError(
            `Failed to subscribe to NATS subject: ${subject}`,
            error,
          );
        }
      }
    }
    // Visibility uses enabled/user resolution, not the stronger auth-ready gate.
    if (previousEnabled !== enabled || viewerChanged) {
      stopVisibility();
      if (enabled) {
        const refresh = invalidate;
        visibilityListener = () => {
          if (visibilityState() === "visible") refresh();
        };
        visibilityTarget.addEventListener(
          "visibilitychange",
          visibilityListener,
        );
      }
    }
  }
  configure(initial);
  return {
    configure,
    dispose() {
      if (closed) return;
      if (leadingWindow) clearTimer(leadingWindow.timer);
      clearReconnect();
      stopVisibility();
      stopSubscription();
      closed = true;
    },
  };
}
