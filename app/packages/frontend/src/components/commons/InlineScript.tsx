/**
 * A script the browser runs synchronously while parsing the HTML, before first paint.
 * React never re-runs it: on the client the element is inert `text/plain`, and
 * `suppressHydrationWarning` covers that type difference. This is the pattern from
 * Next's "Preventing flash before hydration" guide.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
