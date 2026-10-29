// Mounted SearchDialog238128's used key matcher. The caller owns callbacks.
export function normalizeSearchShortcutKey(key) { return key.toLowerCase(); }

export function createSearchShortcutHandler(shortcuts) {
  return (event) => {
    let target = event.target, editing = 'INPUT' === target.tagName || 'TEXTAREA' === target.tagName || target.isContentEditable;
    shortcuts.forEach((binding) => {
      let { keys, callback } = binding, normalized = keys.map(normalizeSearchShortcutKey), pressed = new Set;
      event.ctrlKey && pressed.add('control'), event.shiftKey && pressed.add('shift'),
      event.altKey && pressed.add('alt'), event.metaKey && pressed.add('meta'), event.key && pressed.add(event.key.toLowerCase());
      let matches = pressed.size === normalized.length && normalized.every((key) => pressed.has(key)),
        modified = event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;
      (!editing || modified) && matches && (event.preventDefault(), callback());
    });
  };
}
