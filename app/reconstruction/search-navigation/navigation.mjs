// Captured search admission/routing boundaries. No default network, RPC,
// analytics, wallet operation or real navigation is supplied by this module.
export const SEARCH_TYPE = Object.freeze({ COINS: 2, USERS: 3 });
export const SCREEN = Object.freeze({ SEARCH: 9 });
export const ELEMENT = Object.freeze({ SEARCH_INPUT: 71 });
const SOLANA_TEXT = /^[1-9A-HJ-NP-Za-km-z]+$/;

export const isSolanaText = (value) => {
  let text = value.trim();
  return !(text.length < 32) && !(text.length > 44) && SOLANA_TEXT.test(text);
};
export const normalizeSolanaInput = (value) => {
  let text = value.trim();
  return isSolanaText(text) ? text : null;
};

export function createSolanaGuards({ base58, PublicKey }) {
  const validAddress = (value) => { try { return 32 === base58.decode(value).length; } catch { return false; } };
  const walletProfile = (value) => { try { return PublicKey.isOnCurve(value); } catch { return false; } };
  return { validAddress, walletProfile };
}

export function profileRoute(value) {
  if (null == value) return null;
  let address = 'string' == typeof value ? value : value.address?.trim() || value.userId?.trim() || '';
  return address ? `/profile/${encodeURIComponent(address)}` : null;
}

export function createSolanaSearchNavigator({ controllerRef, pasteRef, validAddress, walletProfile,
  resolveIdentifier, getContractClient, probeKnownMint, probeSolanaMint, closeDialog, rememberTerm,
  trackMintPaste, trackWalletPaste, trackSearch, setLastClick, handleCoinClick, push,
  AbortController: Controller = globalThis.AbortController }) {
  return async (value) => {
    controllerRef.current?.abort(), controllerRef.current = null;
    let term = normalizeSolanaInput(value);
    if (!term || !validAddress(term)) return false;
    let controller = new Controller;
    controllerRef.current = controller;
    let cleanup = () => { controllerRef.current === controller && (controllerRef.current = null); },
      current = () => controllerRef.current === controller && !controller.signal.aborted,
      kind = null, mint = term,
      probe = async () => {
        let known = await probeKnownMint(term, controller.signal);
        if (!current()) return null;
        if (known) return 'coin';
        let onChain = await probeSolanaMint(term, controller.signal);
        return current() ? onChain ? 'coin' : walletProfile(term) ? 'profile' : null : null;
      }, verdict = await resolveIdentifier(term, controller.signal);
    if (!current()) return cleanup(), 'cancelled';
    let definitive = 'fallback' !== verdict.kind;
    if ('coin' === verdict.kind ? (mint = verdict.mint, kind = 'coin') :
      'user' === verdict.kind ? kind = 'profile' :
        'external_wallet' === verdict.kind && (kind = walletProfile(term) ? 'profile' : null), !definitive) try {
      let ok = false, status = 0, payload = await getContractClient()('GET /coins-v3/{address}', {
        params: { address: term }, query: {}, signal: controller.signal, throwHttpErrors: false,
        parseJson: (text) => { try { return JSON.parse(text); } catch { return null; } },
        hooks: { afterResponse: [(request, options, response) => { ok = response.ok, status = response.status; }] },
      });
      if (controller.signal.aborted) return cleanup(), 'cancelled';
      if (ok) {
        if (!current()) return cleanup(), 'cancelled';
        if (payload?.mint) mint = payload.mint, kind = 'coin';
        else if (kind = await probe(), !current()) return cleanup(), 'cancelled';
      } else {
        if (404 !== status) return cleanup(), false;
        if (!current() || (kind = await probe(), !current())) return cleanup(), 'cancelled';
      }
    } catch (error) {
      if (cleanup(), error instanceof DOMException && 'AbortError' === error.name) return 'cancelled';
      return false;
    }
    if (cleanup(), null === kind) return false;
    let pasted = pasteRef.current === term;
    if (pasteRef.current = null, closeDialog(), rememberTerm(term), 'coin' === kind) {
      pasted && trackMintPaste({ mint }), trackSearch({ searchTerm: term, searchType: SEARCH_TYPE.COINS });
      let metadata = { itemPosition: 0, marketCap: 0, sourceScreen: SCREEN.SEARCH, sourceElement: ELEMENT.SEARCH_INPUT };
      setLastClick(mint, metadata, term), handleCoinClick(mint, metadata, term), push(`/coin/${mint}`);
    } else pasted && trackWalletPaste({ wallet: term }), trackSearch({ searchTerm: term, searchType: SEARCH_TYPE.USERS }), push(profileRoute(term));
    return true;
  };
}

// Snapshot/handler wiring for the actual dialog form submission. The three
// other chain handlers are explicit capabilities, not invented implementations.
export function createSearchSubmit({ searchTerm, navigateSolana, navigateEvm, navigateHex, navigateNear,
  closeDialog, rememberTerm, push }) {
  return async (event) => {
    event.preventDefault();
    let term = searchTerm.trim();
    if (!term) return;
    let solana = await navigateSolana(term);
    if (true === solana || 'cancelled' === solana) return;
    let evm = await navigateEvm(term);
    if (true === evm || 'cancelled' === evm) return;
    let hex = await navigateHex(term);
    if (true === hex || 'cancelled' === hex) return;
    let near = await navigateNear(term);
    if (true === near || 'cancelled' === near) return;
    closeDialog(), rememberTerm(term);
    let encoded = encodeURIComponent(term);
    push(`/explore?q=${encoded}`);
  };
}
