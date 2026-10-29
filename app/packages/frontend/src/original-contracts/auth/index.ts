import { createReaderKernel as reader1 } from './kernels/reader-b7990dc05987.mjs';
import { createReaderKernel as reader2 } from './kernels/reader-9dbafa1f0ea5.mjs';
import { createReaderKernel as reader3 } from './kernels/reader-160a6dc5c856.mjs';
import { createDecoderKernel as decoder1 } from './kernels/decoder-d48cce6d6408.mjs';
import { createDecoderKernel as decoder2 } from './kernels/decoder-6acdbc74d187.mjs';
import { createDecoderKernel as decoder3 } from './kernels/decoder-b672846d9145.mjs';
import type { OriginalUiSessionReader, ReaderReact, SessionBrowserPorts } from './types.js';

export type { UnverifiedUiClaims, UiSnapshot, ReaderReact, SessionBrowserPorts, OriginalUiSessionReader } from './types.js';

// Each pair belongs to one retained capture. Numeric factory IDs alone are ambiguous.
export const originalAuthSourceContexts = [
  'evidence/web/objects/f4e16ef1b0b97d5e.js',
  'evidence/web/objects/87a44458ebf665fe.js',
  'evidence/web/objects/27a1ee00eb5909ec.js',
] as const;
export type OriginalAuthSourceContext = (typeof originalAuthSourceContexts)[number];

const kernels = {
  [originalAuthSourceContexts[0]]: { reader: reader1, decoder: decoder1 },
  [originalAuthSourceContexts[1]]: { reader: reader2, decoder: decoder2 },
  [originalAuthSourceContexts[2]]: { reader: reader3, decoder: decoder3 },
} as const;

/**
 * Standalone source adaptation of captured frontend logic. No provider, cookies,
 * credentials, React runtime, network or backend auth is selected implicitly.
 */
export function createOriginalUiSessionReader(
  source: OriginalAuthSourceContext,
  browser: SessionBrowserPorts,
  react: ReaderReact,
): OriginalUiSessionReader {
  if (!Object.hasOwn(kernels, source)) throw new Error('Explicit supported original auth source context required');
  const selected = kernels[source];
  const decoder = selected.decoder(browser.atob);
  const reader = selected.reader(react, decoder, browser);
  return {
    getUnverifiedSnapshot: reader.D,
    getServerSnapshot: reader.getServerSnapshot,
    subscribe: reader.subscribe,
    useUnverifiedSnapshot: reader.s,
    notify: reader.I,
    clearAuthCookie: reader.c,
    capturedExpiryPredicate: reader.i,
    normalizeUnverifiedClaims: decoder.S,
    decodeUnverifiedToken: decoder.e,
  };
}
