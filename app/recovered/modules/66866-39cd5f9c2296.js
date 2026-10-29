// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t,
    r = e.i(445242),
    n = e.i(613677),
    i = e.i(297865),
    o = e.i(342463);
  let s = n.z.object({ success: i.z.boolean() }),
    a = n.z.object({
      success: i.z.boolean(),
      sessionId: o.z.string().optional(),
    });
  e.s(["s", 0, s, "H", 0, a], 721361);
  var c = e.i(54567),
    l =
      (((t = l || {}).JOIN_ROOM = "joinRoom"),
      (t.LEAVE_ROOM = "leaveRoom"),
      (t.SEND_MESSAGE = "sendMessage"),
      (t.GET_MESSAGE_HISTORY = "getMessageHistory"),
      (t.PIN_MESSAGE = "pinMessage"),
      (t.UNPIN_MESSAGE = "unpinMessage"),
      (t.VIEWER_HEARTBEAT = "viewerHeartbeat"),
      (t.ADD_REACTION = "addReaction"),
      (t.REMOVE_REACTION = "removeReaction"),
      t);
  e.s(
    [
      "f",
      0,
      (e) => {
        let t,
          n,
          i,
          o,
          s,
          l,
          u,
          d,
          m,
          f,
          g = (0, r.c)(28),
          { socket: p } = e;
        g[0] !== p
          ? ((t = (e, t, r) => {
              p &&
                (c.logger.debug(
                  "[useLivechatSocketEmitters] Emitting joinRoom",
                  { roomId: e, username: t },
                ),
                p.emit("joinRoom", { roomId: e, username: t }, (e) => {
                  r(e, p.id || "");
                }));
            }),
            (g[0] = p),
            (g[1] = t))
          : (t = g[1]);
        let h = t;
        g[2] !== p
          ? ((n = (e, t) => {
              p &&
                (c.logger.debug(
                  "[useLivechatSocketEmitters] Emitting leaveRoom",
                  { roomId: e, username: t },
                ),
                p.emit("leaveRoom", { roomId: e, username: t }));
            }),
            (g[2] = p),
            (g[3] = n))
          : (n = g[3]);
        let v = n;
        g[4] !== p
          ? ((i = (e) => {
              let {
                callback: t,
                messageText: r,
                replyPreview: n,
                replyToId: i,
                roomId: o,
                username: s,
              } = e;
              if (!p) return;
              c.logger.debug(
                "[useLivechatSocketEmitters] Emitting sendMessage",
                {
                  roomId: o,
                  username: s,
                  messageText: r,
                  replyToId: i,
                  replyPreview: n,
                },
              );
              let a = {
                roomId: o,
                message: r,
                ...(s ? { username: s } : {}),
                replyToId: i,
                replyPreview: n,
              };
              p.emit("sendMessage", a, t);
            }),
            (g[4] = p),
            (g[5] = i))
          : (i = g[5]);
        let y = i;
        g[6] !== p
          ? ((o = (e, t, r, n) => {
              p &&
                (c.logger.debug(
                  "[useLivechatSocketEmitters] Emitting getMessageHistory",
                  { roomId: e, beforeTimestamp: t, limit: r },
                ),
                p.emit(
                  "getMessageHistory",
                  { roomId: e, before: t, limit: r },
                  n,
                ));
            }),
            (g[6] = p),
            (g[7] = o))
          : (o = g[7]);
        let x = o;
        g[8] !== p
          ? ((s = (e, t) => {
              p &&
                (c.logger.debug(
                  "[useLivechatSocketEmitters] Emitting pinMessage",
                  { roomId: e, messageId: t },
                ),
                p.emit("pinMessage", { roomId: e, messageId: t }));
            }),
            (g[8] = p),
            (g[9] = s))
          : (s = g[9]);
        let b = s;
        g[10] !== p
          ? ((l = (e) => {
              p &&
                (c.logger.debug(
                  "[useLivechatSocketEmitters] Emitting unpinMessage",
                  { roomId: e },
                ),
                p.emit("unpinMessage", { roomId: e }));
            }),
            (g[10] = p),
            (g[11] = l))
          : (l = g[11]);
        let S = l;
        g[12] !== p
          ? ((u = (e) => {
              if (!p) throw Error("Socket is not connected");
              return (
                c.logger.debug(
                  "[useLivechatSocketEmitters] Emitting viewerHeartbeat",
                  { roomId: e },
                ),
                new Promise((t, r) => {
                  p.emit("viewerHeartbeat", { roomId: e }, (n) => {
                    let i = a.safeParse(n);
                    if (!i.success || !i.data.sessionId)
                      return (
                        c.logger.error(
                          "[useLivechatSocketEmitters] Failed to parse viewer heartbeat response",
                          { roomId: e, data: n, parsed: i },
                        ),
                        r(Error("Failed to parse viewer heartbeat response"))
                      );
                    t(i.data);
                  });
                })
              );
            }),
            (g[12] = p),
            (g[13] = u))
          : (u = g[13]);
        let w = u;
        g[14] !== p
          ? ((d = (e, t, r, n) => {
              p &&
                (c.logger.debug(
                  "[useLivechatSocketEmitters] Emitting addReaction",
                  { roomId: e, messageId: t, emojiKey: r },
                ),
                p.emit("addReaction", {
                  roomId: e,
                  messageId: t,
                  emojiKey: r,
                  avatarUrl: n,
                }));
            }),
            (g[14] = p),
            (g[15] = d))
          : (d = g[15]);
        let I = d;
        g[16] !== p
          ? ((m = (e, t, r) => {
              p &&
                (c.logger.debug(
                  "[useLivechatSocketEmitters] Emitting removeReaction",
                  { roomId: e, messageId: t, emojiKey: r },
                ),
                p.emit("removeReaction", {
                  roomId: e,
                  messageId: t,
                  emojiKey: r,
                }));
            }),
            (g[16] = p),
            (g[17] = m))
          : (m = g[17]);
        let _ = m;
        return (
          g[18] !== I ||
          g[19] !== x ||
          g[20] !== h ||
          g[21] !== v ||
          g[22] !== b ||
          g[23] !== _ ||
          g[24] !== y ||
          g[25] !== S ||
          g[26] !== w
            ? ((f = {
                emitJoinRoom: h,
                emitLeaveRoom: v,
                emitSendMessage: y,
                emitGetMessageHistory: x,
                emitPinMessage: b,
                emitUnpinMessage: S,
                emitViewerHeartbeat: w,
                emitAddReaction: I,
                emitRemoveReaction: _,
              }),
              (g[18] = I),
              (g[19] = x),
              (g[20] = h),
              (g[21] = v),
              (g[22] = b),
              (g[23] = _),
              (g[24] = y),
              (g[25] = S),
              (g[26] = w),
              (g[27] = f))
            : (f = g[27]),
          f
        );
      },
    ],
    66866,
  );
};
