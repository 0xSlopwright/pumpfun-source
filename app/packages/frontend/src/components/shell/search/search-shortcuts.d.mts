export type SearchShortcut = Readonly<{ keys: readonly string[]; callback: () => void }>;
export function normalizeSearchShortcutKey(key: string): string;
export function createSearchShortcutHandler(shortcuts: readonly SearchShortcut[]): (event: KeyboardEvent) => void;
