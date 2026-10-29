// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = Error(
      "Wallet provider is not ready; signal wallet intent before connecting.",
    ),
    n = {
      autoConnect: !1,
      wallets: [],
      wallet: null,
      publicKey: null,
      connecting: !1,
      connected: !1,
      disconnecting: !1,
      select: () => {},
      connect: () => Promise.reject(t),
      disconnect: () => Promise.resolve(),
      sendTransaction: () => Promise.reject(t),
      signTransaction: void 0,
      signAllTransactions: void 0,
      signMessage: void 0,
      signIn: void 0,
    },
    r = n,
    i = new Set(),
    a = [
      "autoConnect",
      "wallets",
      "wallet",
      "publicKey",
      "connecting",
      "connected",
      "disconnecting",
      "select",
      "connect",
      "disconnect",
      "sendTransaction",
      "signTransaction",
      "signAllTransactions",
      "signMessage",
      "signIn",
    ];
  function o(e) {
    var t;
    if (!((t = r) === e || a.every((n) => t[n] === e[n])))
      for (let t of ((r = e), i)) t();
  }
  e.s([
    "s",
    0,
    function () {
      return n;
    },
    "Z",
    0,
    function () {
      return r;
    },
    "M",
    0,
    function () {
      o(n);
    },
    "i",
    0,
    o,
    "z",
    0,
    function (e) {
      return (
        i.add(e),
        () => {
          i.delete(e);
        }
      );
    },
  ]);
};
