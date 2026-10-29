/** The captured logomark (/pump-logomark.svg). Eager: it sits above the fold on every page. */
export function Logomark() {
  return (
    <div className="flex items-center shrink-0 gap-x-2 ">
      <img alt="pump.fun logomark" width={24} height={24} decoding="async" style={{ color: 'transparent' }} src="/pump-logomark.svg" />
    </div>
  );
}
