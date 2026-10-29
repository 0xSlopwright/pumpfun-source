// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  t.exports = function () {
    throw Error(
      "ws does not work in the browser. Browser clients must use the native WebSocket object",
    );
  };
};
