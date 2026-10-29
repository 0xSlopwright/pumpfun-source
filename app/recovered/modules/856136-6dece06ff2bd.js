// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t) => {
  var e,
    r,
    i = t.i(971370);
  let n = new i.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    s = new i.PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"),
    o = new i.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
  (new i.PublicKey("So11111111111111111111111111111111111111112"),
    new i.PublicKey("9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP"),
    t.s(["x", 0, o, "S", 0, s, "z", 0, n], 856136));
  class u extends Error {
    constructor(t) {
      super(t);
    }
  }
  (t.s(
    [
      "z",
      0,
      class extends u {
        constructor() {
          (super(...arguments), (this.name = "TokenAccountNotFoundError"));
        }
      },
      "n",
      0,
      class extends u {
        constructor() {
          (super(...arguments), (this.name = "TokenInvalidAccountOwnerError"));
        }
      },
      "o",
      0,
      class extends u {
        constructor() {
          (super(...arguments), (this.name = "TokenInvalidAccountSizeError"));
        }
      },
      "P",
      0,
      class extends u {
        constructor() {
          (super(...arguments), (this.name = "TokenInvalidMintError"));
        }
      },
      "p",
      0,
      class extends u {
        constructor() {
          (super(...arguments), (this.name = "TokenOwnerOffCurveError"));
        }
      },
    ],
    108983,
  ),
    ((e = r || (r = {}))[(e.Uninitialized = 0)] = "Uninitialized"),
    (e[(e.Mint = 1)] = "Mint"),
    (e[(e.Account = 2)] = "Account"),
    t.s(["h", 0, 1, "d", 0, r], 300699));
};
