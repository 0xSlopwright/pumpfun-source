// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(532617);
  class i extends t.f {
    constructor({ blockNumber: e, chain: t, contract: i }) {
      super(`Chain "${t.name}" does not support contract "${i.name}".`, {
        metaMessages: [
          "This could be due to any of the following:",
          ...(e && i.blockCreated && i.blockCreated > e
            ? [
                `- The contract "${i.name}" was not deployed until block ${i.blockCreated} (current block ${e}).`,
              ]
            : [
                `- The chain does not have the contract "${i.name}" configured.`,
              ]),
        ],
        name: "ChainDoesNotSupportContract",
      });
    }
  }
  (t.f, t.f);
  class f extends t.f {
    constructor() {
      super("No chain was provided to the Client.", {
        name: "ClientChainNotConfiguredError",
      });
    }
  }
  class s extends t.f {
    constructor({ chainId: e }) {
      super(
        "number" == typeof e
          ? `Chain ID "${e}" is invalid.`
          : "Chain ID is invalid.",
        { name: "InvalidChainIdError" },
      );
    }
  }
  e.s(["m", 0, i, "L", 0, f, "O", 0, s]);
};
