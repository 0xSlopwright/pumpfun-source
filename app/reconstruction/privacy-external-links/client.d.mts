export const preferenceKey: "privacy.confirm-external-links";

export interface PrivacyPreference {
  read(): boolean;
  write(value: unknown): void;
  remove(): void;
  subscribe(callback: () => void): () => boolean;
}

export function privacyPreferenceRuntime(ports: {
  getStorage(): Pick<Storage, "getItem" | "setItem" | "removeItem">;
  events: Pick<EventTarget, "addEventListener" | "dispatchEvent">;
  createStorageEvent(type: string, init: StorageEventInit): Event;
}): { preference(): PrivacyPreference };

export function normalizeOutboundUrl(value?: string | null): string | null;
export function isTrustedOutboundUrl(value?: string | null): boolean;
export function outboundConfirmation(ports: {
  preference: PrivacyPreference;
  settingsHubEnabled: boolean;
  openWindow(url: string, target: string, features: string): unknown;
}): {
  requestNavigation(value?: string | null): void;
  getSnapshot(): {
    open: boolean;
    pendingUrl: string | null;
    dontAskAgain: boolean;
    settingsHubEnabled: boolean;
  };
  subscribe(listener: () => void): () => boolean;
  setSettingsHubEnabled(value: boolean): void;
  setDontAskAgain(value: unknown): void;
  setOpen(value: boolean): void;
  cancel(): void;
  confirm(): void;
  dispose(): void;
  handleLinkClick(
    event: Pick<Event, "preventDefault" | "stopPropagation">,
    props: { href?: string | null; onClick?: (event: Event) => void },
  ): void;
};
