// Captured device preference/outbound decisions with explicit browser ports.
// Importing this file attaches no listener, reads no storage and opens no URL.
export const preferenceKey = "privacy.confirm-external-links";
const localEvent = "local-storage";
const trustedHosts = new Set([
  "pump.fun",
  "terminal.pump.fun",
  "trade.padre.gg",
]);

export function normalizeOutboundUrl(value) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  let input = trimmed;
  if (trimmed.startsWith("//")) input = `https:${trimmed}`;
  else if (!/^https?:\/\//i.test(trimmed)) input = `https://${trimmed}`;
  try {
    const url = new URL(input);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
export function isTrustedOutboundUrl(value) {
  try {
    const normalized = normalizeOutboundUrl(value);
    return normalized
      ? trustedHosts.has(new URL(normalized).hostname.replace(/^www\./, ""))
      : false;
  } catch {
    return false;
  }
}

// One runtime models the selected setting within one original module lifetime.
// Multiple preference() consumers share its caches, fallback and subscribers.
export function privacyPreferenceRuntime({
  getStorage,
  events,
  createStorageEvent,
}) {
  let decoded = null,
    fallback = null,
    listening = false;
  const subscribers = new Set();
  const listen = () => {
    if (listening) return;
    listening = true;
    const notify = (event) => {
      const key = event.key ?? null;
      if (key === null || key === preferenceKey)
        subscribers.forEach((callback) => callback());
    };
    events.addEventListener("storage", notify);
    events.addEventListener(localEvent, notify);
  };
  function readRaw() {
    if (fallback) return fallback.value;
    let raw;
    try {
      raw = getStorage().getItem(preferenceKey);
    } catch {
      raw = null;
    }
    if (raw === null) return undefined;
    if (decoded && decoded.raw === raw) return decoded.value;
    let value;
    try {
      value = JSON.parse(raw);
    } catch {
      value = undefined;
    }
    decoded = { raw, value };
    return value;
  }
  return {
    preference() {
      return {
        read: () => readRaw() !== false,
        write(value) {
          listen();
          const next = value !== false,
            raw = JSON.stringify(next);
          try {
            getStorage().setItem(preferenceKey, raw);
            fallback = null;
          } catch {
            fallback = { raw, value: next };
          }
          events.dispatchEvent(
            createStorageEvent(localEvent, { key: preferenceKey }),
          );
        },
        remove() {
          listen();
          try {
            getStorage().removeItem(preferenceKey);
          } catch {
            /* Captured remove swallows storage errors. */
          }
          fallback = null;
          decoded = null;
          events.dispatchEvent(
            createStorageEvent(localEvent, { key: preferenceKey }),
          );
        },
        subscribe(callback) {
          listen();
          subscribers.add(callback);
          return () => subscribers.delete(callback);
        },
      };
    },
  };
}

export function outboundConfirmation({
  preference,
  settingsHubEnabled,
  openWindow,
}) {
  let open = false,
    pendingUrl = null,
    dontAskAgain = false,
    hub = settingsHubEnabled;
  const listeners = new Set();
  const notify = () => listeners.forEach((listener) => listener());
  let confirmationPreference = preference.read();
  const unsubscribePreference = preference.subscribe(() => {
    confirmationPreference = preference.read();
    notify();
  });
  function requestNavigation(value) {
    const url = normalizeOutboundUrl(value);
    if (!url) return;
    const mustConfirm = !hub || confirmationPreference;
    if (isTrustedOutboundUrl(url) || !mustConfirm) {
      openWindow(url, "_blank", "noopener,noreferrer");
      return;
    }
    dontAskAgain = false;
    pendingUrl = url;
    open = true;
    notify();
  }
  function setOpen(value) {
    if (!value) pendingUrl = null;
    open = value;
    notify();
  }
  return {
    requestNavigation,
    getSnapshot: () => ({
      open,
      pendingUrl,
      dontAskAgain,
      settingsHubEnabled: hub,
    }),
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setSettingsHubEnabled(value) {
      hub = value;
      notify();
    },
    setDontAskAgain(value) {
      dontAskAgain = value === true;
      notify();
    },
    setOpen,
    cancel: () => setOpen(false),
    confirm() {
      const url = pendingUrl;
      if (!url) return;
      if (hub && dontAskAgain) preference.write(false);
      openWindow(url, "_blank", "noopener,noreferrer");
      open = false;
      pendingUrl = null;
      notify();
    },
    dispose() {
      unsubscribePreference();
      listeners.clear();
    },
    handleLinkClick(event, { href, onClick }) {
      event.preventDefault();
      event.stopPropagation();
      onClick?.(event);
      requestNavigation(href);
    },
  };
}
