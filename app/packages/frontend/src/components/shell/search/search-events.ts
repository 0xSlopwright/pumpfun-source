const OPEN_SEARCH_EVENT = 'pump:open-search';

/** Ask the shell's search dialog to open. Triggers stay decoupled from the dialog. */
export function openSearch(): void {
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}

export function onOpenSearch(listener: () => void): () => void {
  window.addEventListener(OPEN_SEARCH_EVENT, listener);
  return () => window.removeEventListener(OPEN_SEARCH_EVENT, listener);
}
