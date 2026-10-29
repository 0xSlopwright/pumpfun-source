// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(697781),
    a = e.i(42799);
  let i = Symbol("solana-funding-plugin"),
    n = Symbol("solana-ledger-plugin");
  e.s([
    "S",
    0,
    i,
    "a",
    0,
    n,
    "b",
    0,
    ({ message: e, address: i }) => {
      let n = e.match(/^URI: (.+)$/m)?.[1];
      if (!n) throw Error("SIWS message must include a URI");
      return (0, a.H)({
        message: e,
        signerPublicKey: t.e.decode(i),
        domain: n,
      });
    },
    "p",
    0,
    ({
      address: e,
      nonce: t,
    }) => `${window.location.host} wants you to sign in with your Solana account:
${e}

You are proving you own ${e}.

URI: ${window.location.origin}
Version: 1
Chain ID: mainnet
Nonce: ${t}
Issued At: ${new Date().toISOString()}
Resources:
- https://privy.io`,
  ]);
};
