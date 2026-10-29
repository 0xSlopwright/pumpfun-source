type BodyLock = { count: number; overflow: string; priority: string };
const locks = new WeakMap<HTMLElement, BodyLock>();

/** Keep each body locked until all of its owners release, preserving inline CSS. */
export function lockBodyScroll(): () => void {
  const body = document.body;
  let lock = locks.get(body);
  if (!lock) {
    lock = {
      count: 0,
      overflow: body.style.overflow,
      priority: body.style.getPropertyPriority("overflow"),
    };
    locks.set(body, lock);
  }
  lock.count += 1;
  body.style.setProperty("overflow", "hidden", lock.priority);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    lock.count -= 1;
    if (lock.count === 0) {
      body.style.setProperty("overflow", lock.overflow, lock.priority);
      locks.delete(body);
    }
  };
}
