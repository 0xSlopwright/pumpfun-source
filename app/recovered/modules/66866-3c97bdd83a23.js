// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t,
    n = e.i(445242),
    r = e.i(613677),
    i = e.i(297865),
    o = e.i(342463);
  let s = r.z.object({ success: i.z.boolean() }),
    a = r.z.object({
      success: i.z.boolean(),
      sessionId: o.z.string().optional(),
    });
  e.s(["s", 0, s, "H", 0, a], 721361);
  var l = e.i(54567),
    c =
      (((t = c || {}).JOIN_ROOM = "joinRoom"),
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
          r,
          i,
          o,
          s,
          c,
          u,
          d,
          m,
          E,
          f = (0, n.c)(28),
          { socket: I } = e;
        f[0] !== I
          ? ((t = (e, t, n) => {
              I &&
                (l.logger.debug(
                  "[useLivechatSocketEmitters] Emitting joinRoom",
                  { roomId: e, username: t },
                ),
                I.emit("joinRoom", { roomId: e, username: t }, (e) => {
                  n(e, I.id || "");
                }));
            }),
            (f[0] = I),
            (f[1] = t))
          : (t = f[1]);
        let T = t;
        f[2] !== I
          ? ((r = (e, t) => {
              I &&
                (l.logger.debug(
                  "[useLivechatSocketEmitters] Emitting leaveRoom",
                  { roomId: e, username: t },
                ),
                I.emit("leaveRoom", { roomId: e, username: t }));
            }),
            (f[2] = I),
            (f[3] = r))
          : (r = f[3]);
        let p = r;
        f[4] !== I
          ? ((i = (e) => {
              let {
                callback: t,
                messageText: n,
                replyPreview: r,
                replyToId: i,
                roomId: o,
                username: s,
              } = e;
              if (!I) return;
              l.logger.debug(
                "[useLivechatSocketEmitters] Emitting sendMessage",
                {
                  roomId: o,
                  username: s,
                  messageText: n,
                  replyToId: i,
                  replyPreview: r,
                },
              );
              let a = {
                roomId: o,
                message: n,
                ...(s ? { username: s } : {}),
                replyToId: i,
                replyPreview: r,
              };
              I.emit("sendMessage", a, t);
            }),
            (f[4] = I),
            (f[5] = i))
          : (i = f[5]);
        let g = i;
        f[6] !== I
          ? ((o = (e, t, n, r) => {
              I &&
                (l.logger.debug(
                  "[useLivechatSocketEmitters] Emitting getMessageHistory",
                  { roomId: e, beforeTimestamp: t, limit: n },
                ),
                I.emit(
                  "getMessageHistory",
                  { roomId: e, before: t, limit: n },
                  r,
                ));
            }),
            (f[6] = I),
            (f[7] = o))
          : (o = f[7]);
        let _ = o;
        f[8] !== I
          ? ((s = (e, t) => {
              I &&
                (l.logger.debug(
                  "[useLivechatSocketEmitters] Emitting pinMessage",
                  { roomId: e, messageId: t },
                ),
                I.emit("pinMessage", { roomId: e, messageId: t }));
            }),
            (f[8] = I),
            (f[9] = s))
          : (s = f[9]);
        let S = s;
        f[10] !== I
          ? ((c = (e) => {
              I &&
                (l.logger.debug(
                  "[useLivechatSocketEmitters] Emitting unpinMessage",
                  { roomId: e },
                ),
                I.emit("unpinMessage", { roomId: e }));
            }),
            (f[10] = I),
            (f[11] = c))
          : (c = f[11]);
        let y = c;
        f[12] !== I
          ? ((u = (e) => {
              if (!I) throw Error("Socket is not connected");
              return (
                l.logger.debug(
                  "[useLivechatSocketEmitters] Emitting viewerHeartbeat",
                  { roomId: e },
                ),
                new Promise((t, n) => {
                  I.emit("viewerHeartbeat", { roomId: e }, (r) => {
                    let i = a.safeParse(r);
                    if (!i.success || !i.data.sessionId)
                      return (
                        l.logger.error(
                          "[useLivechatSocketEmitters] Failed to parse viewer heartbeat response",
                          { roomId: e, data: r, parsed: i },
                        ),
                        n(Error("Failed to parse viewer heartbeat response"))
                      );
                    t(i.data);
                  });
                })
              );
            }),
            (f[12] = I),
            (f[13] = u))
          : (u = f[13]);
        let h = u;
        f[14] !== I
          ? ((d = (e, t, n, r) => {
              I &&
                (l.logger.debug(
                  "[useLivechatSocketEmitters] Emitting addReaction",
                  { roomId: e, messageId: t, emojiKey: n },
                ),
                I.emit("addReaction", {
                  roomId: e,
                  messageId: t,
                  emojiKey: n,
                  avatarUrl: r,
                }));
            }),
            (f[14] = I),
            (f[15] = d))
          : (d = f[15]);
        let A = d;
        f[16] !== I
          ? ((m = (e, t, n) => {
              I &&
                (l.logger.debug(
                  "[useLivechatSocketEmitters] Emitting removeReaction",
                  { roomId: e, messageId: t, emojiKey: n },
                ),
                I.emit("removeReaction", {
                  roomId: e,
                  messageId: t,
                  emojiKey: n,
                }));
            }),
            (f[16] = I),
            (f[17] = m))
          : (m = f[17]);
        let O = m;
        return (
          f[18] !== A ||
          f[19] !== _ ||
          f[20] !== T ||
          f[21] !== p ||
          f[22] !== S ||
          f[23] !== O ||
          f[24] !== g ||
          f[25] !== y ||
          f[26] !== h
            ? ((E = {
                emitJoinRoom: T,
                emitLeaveRoom: p,
                emitSendMessage: g,
                emitGetMessageHistory: _,
                emitPinMessage: S,
                emitUnpinMessage: y,
                emitViewerHeartbeat: h,
                emitAddReaction: A,
                emitRemoveReaction: O,
              }),
              (f[18] = A),
              (f[19] = _),
              (f[20] = T),
              (f[21] = p),
              (f[22] = S),
              (f[23] = O),
              (f[24] = g),
              (f[25] = y),
              (f[26] = h),
              (f[27] = E))
            : (E = f[27]),
          E
        );
      },
    ],
    66866,
  );
};
