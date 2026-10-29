let locks = 0;
let previousOverflow = "";

/** Keep the page locked until every overlapping modal/navigation owner closes. */
export function lockBodyScroll(): () => void {
  const body = document.body;
  if (locks === 0) previousOverflow = body.style.overflow;
  locks += 1;
  body.style.overflow = "hidden";
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks === 0) body.style.overflow = previousOverflow;
  };
}
