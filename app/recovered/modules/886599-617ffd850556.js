// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t = ["image/png", "image/jpeg", "image/webp", "image/gif"],
    r = ["video/mp4", "video/webm", "video/quicktime"],
    n = "PNG, JPG, WebP, GIF, MP4, WebM, or MOV";
  function i(e) {
    return t.includes(e) ? "image" : r.includes(e) ? "video" : null;
  }
  function s(e) {
    return e >= 0x40000000
      ? `${(e / 0x40000000).toFixed(1)} GB`
      : e >= 1048576
        ? `${(e / 1048576).toFixed(1)} MB`
        : e >= 1024
          ? `${(e / 1024).toFixed(1)} KB`
          : `${e} B`;
  }
  class a extends Error {
    status;
    constructor(e, t) {
      (super(e), (this.status = t), (this.name = "BountyAttachmentError"));
    }
  }
  e.s([
    "Y",
    0,
    {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/quicktime": [".mov"],
    },
    "$",
    0,
    10,
    "b",
    0,
    0xc800000,
    "S",
    0,
    n,
    "K",
    0,
    a,
    "e",
    0,
    s,
    "M",
    0,
    function (e, t) {
      return new Promise((r, n) => {
        if (t?.aborted)
          return void n(new DOMException("Aborted", "AbortError"));
        let i = new FileReader(),
          s = () => {
            t?.removeEventListener("abort", o);
          },
          o = () => {
            (i.abort(), n(new DOMException("Aborted", "AbortError")));
          };
        (t?.addEventListener("abort", o, { once: !0 }),
          (i.onload = () => {
            s();
            let e = i.result;
            if ("string" != typeof e)
              return void n(new a("Could not read file"));
            let t = e.indexOf(",");
            r(t >= 0 ? e.slice(t + 1) : e);
          }),
          (i.onerror = () => {
            (s(), n(new a("Could not read file")));
          }),
          (i.onabort = () => {
            s();
          }),
          i.readAsDataURL(e));
      });
    },
    "i",
    0,
    i,
    "p",
    0,
    function (e) {
      return new Promise((t, r) => {
        if (e.signal?.aborted)
          return void r(new DOMException("Aborted", "AbortError"));
        let n = new XMLHttpRequest();
        (n.open("PUT", e.uploadUrl, !0),
          n.setRequestHeader("Content-Type", e.contentType));
        let i = () => n.abort();
        (e.signal?.addEventListener("abort", i, { once: !0 }),
          (n.upload.onprogress = (t) => {
            if (!t.lengthComputable) return;
            let r = Math.min(99, Math.round((t.loaded / t.total) * 100));
            e.onProgress?.(r);
          }),
          (n.onload = () => {
            (e.signal?.removeEventListener("abort", i),
              n.status >= 200 && n.status < 300
                ? (e.onProgress?.(100), t())
                : r(
                    new a(
                      `Upload failed (${n.status} ${n.statusText})`,
                      n.status,
                    ),
                  ));
          }),
          (n.onerror = () => {
            (e.signal?.removeEventListener("abort", i),
              r(new a("Network error during upload")));
          }),
          (n.onabort = () => {
            (e.signal?.removeEventListener("abort", i),
              r(new DOMException("Aborted", "AbortError")));
          }),
          n.send(e.file));
      });
    },
    "m",
    0,
    function (e) {
      let t = i(e.type);
      if (null == t)
        return {
          ok: !1,
          code: "UNSUPPORTED_CONTENT_TYPE",
          message: `"${e.name || "File"}" isn't a supported file type. Please upload ${n}.`,
        };
      if (e.size <= 0)
        return { ok: !1, code: "FILE_EMPTY", message: "File is empty" };
      let r = (function (e) {
        switch (e) {
          case "image":
            return 5242880;
          case "video":
            return 0xc800000;
        }
      })(t);
      return e.size > r
        ? {
            ok: !1,
            code: "FILE_TOO_LARGE",
            message: `File is larger than ${s(r)} (got ${s(e.size)})`,
            maxSizeBytes: r,
          }
        : { ok: !0, kind: t, maxSizeBytes: r };
    },
  ]);
};
