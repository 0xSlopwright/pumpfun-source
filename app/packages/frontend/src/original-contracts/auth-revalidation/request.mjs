// Original174764 23bc387a95434710efbfc32c36fada4e1d869debdd5b62b86e693ded868b0dbd; request client remains injected.
export async function t(e) {
  let t, n, i;
  try {
    n = await e("GET /auth/my-profile", {
      credentials: "include",
      headers: {
        "Cache-Control": "no-cache"
      },
      throwHttpErrors: !1,
      hooks: {
        afterResponse: [(e, n, i) => {
          t = i;
        }]
      }
    });
  } catch (e) {
    i = e;
  }
  let r = t?.status ?? null;
  return {
    verdict: null === r ? "inconclusive" : r >= 200 && r < 300 || 304 === r ? "ok" : 401 === r ? "rejected" : "inconclusive",
    status: r,
    payload: n,
    error: i
  };
}
