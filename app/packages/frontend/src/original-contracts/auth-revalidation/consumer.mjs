// Original589428 callbacks/projections 4d12898c1c6cd0bc4e8518537175ecf57e5edf14a6723c4c15f8aad0bf97a400.
// External cookie/storage/state/request operations remain explicit ports.
export function createConsumerKernel(d, localStorage, w, eD, tj) {
  function tN(e) {
    try {
      localStorage.removeItem(e);
    } catch {}
  }
  const P = () => {
    (0, d.c)(), tN("decoded-jwt"), tN("moderator-storage"), w(!0);
  };
  const L = async () => {
    let {
      verdict: e
    } = await (0, tj.f)((0, eD.j)());
    return "rejected" !== e ? "ok" : (P(), "invalid");
  };
  return {
    clearUiState: P,
    revalidateUiSession: L
  };
}
export function visibleUnverifiedClaims(_, b) {
  return _ ? null : b ?? null;
}
export function capturedAuthReadyFlag(x, b, _) {
  return x || !!b || _;
}
