// Independent read-only reconstruction of the initial/read portions of350989.f.
// The viewer key is a request value, not an ownership or session assertion.
export function initialFollowReadState(options) {
  return {
    isFollowing: options?.initialIsFollowing ?? false,
    isFollowedBack: options?.initialIsFollowedBack ?? false,
    isReady: !!(
      options?.skipInitialFetch && options?.initialIsFollowing !== undefined
    ),
  };
}

export function followReadCallbacks(transport, input, setters) {
  const { target, viewerKey } = input;
  const { setFollowing, setFollowedBack, setReady } = setters;
  return {
    fetchIsFollowing: async () => {
      if (target && viewerKey)
        try {
          const { follow } = await transport("GET /following/single/{id}", {
            params: { id: target },
            query: { userId: viewerKey },
            headers: { "Content-Type": "application/json" },
            throwHttpErrors: false,
          });
          setFollowing(!!follow);
        } finally {
          setReady(true);
        }
    },
    fetchIsFollowedBack: async () => {
      if (!target || !viewerKey) return;
      const { follow } = await transport("GET /following/single/{id}", {
        params: { id: viewerKey },
        query: { userId: target },
        headers: { "Content-Type": "application/json" },
        throwHttpErrors: false,
      });
      setFollowedBack(!!follow);
    },
  };
}

// Effect ports are synchronous start functions. As in the source effect, this
// does not await/aggregate either read; the host owns rejection observation.
export function applyFollowReadEffect(input, reads, setters) {
  const { target, viewerKey, options, lastActionTarget = null } = input;
  const { fetchIsFollowing, fetchIsFollowedBack } = reads;
  const { setFollowing, setFollowedBack, setReady } = setters;
  if (options?.skipInitialFetch) {
    if (lastActionTarget === target) return;
    if (options?.initialIsFollowing !== undefined) {
      setFollowing(options.initialIsFollowing);
      setReady(true);
    }
    if (options?.initialIsFollowedBack !== undefined)
      setFollowedBack(options.initialIsFollowedBack);
    return;
  }
  if (viewerKey) {
    fetchIsFollowing();
    fetchIsFollowedBack();
  } else setReady(true);
}
