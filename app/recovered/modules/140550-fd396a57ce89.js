// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t;
  var r = e.i(149502);
  let n =
    ((t = 0),
    () => (
      (t += 1),
      `u${`0000${((1679616 * Math.random()) | 0).toString(36)}`.slice(-4)}${t}`
    ));
  function i(e) {
    let t = [];
    for (let r = 0, n = e.length; r < n; r++) t.push(e[r]);
    return t;
  }
  let a = null;
  function l(e = {}) {
    return (
      a ||
      (a = e.includeStyleProperties
        ? e.includeStyleProperties
        : i(window.getComputedStyle(document.documentElement)))
    );
  }
  function o(e, t) {
    let r = (e.ownerDocument.defaultView || window)
      .getComputedStyle(e)
      .getPropertyValue(t);
    return r ? parseFloat(r.replace("px", "")) : 0;
  }
  function s(e, t = {}) {
    let r, n, i, a;
    return {
      width:
        t.width ||
        ((r = o(e, "border-left-width")),
        (n = o(e, "border-right-width")),
        e.clientWidth + r + n),
      height:
        t.height ||
        ((i = o(e, "border-top-width")),
        (a = o(e, "border-bottom-width")),
        e.clientHeight + i + a),
    };
  }
  function c(e) {
    return new Promise((t, r) => {
      let n = new Image();
      ((n.onload = () => {
        n.decode().then(() => {
          requestAnimationFrame(() => t(n));
        });
      }),
        (n.onerror = r),
        (n.crossOrigin = "anonymous"),
        (n.decoding = "async"),
        (n.src = e));
    });
  }
  async function u(e) {
    return Promise.resolve()
      .then(() => new XMLSerializer().serializeToString(e))
      .then(encodeURIComponent)
      .then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
  }
  async function d(e, t, r) {
    let n = "http://www.w3.org/2000/svg",
      i = document.createElementNS(n, "svg"),
      a = document.createElementNS(n, "foreignObject");
    return (
      i.setAttribute("width", `${t}`),
      i.setAttribute("height", `${r}`),
      i.setAttribute("viewBox", `0 0 ${t} ${r}`),
      a.setAttribute("width", "100%"),
      a.setAttribute("height", "100%"),
      a.setAttribute("x", "0"),
      a.setAttribute("y", "0"),
      a.setAttribute("externalResourcesRequired", "true"),
      i.appendChild(a),
      a.appendChild(e),
      u(i)
    );
  }
  let f = (e, t) => {
    if (e instanceof t) return !0;
    let r = Object.getPrototypeOf(e);
    return null !== r && (r.constructor.name === t.name || f(r, t));
  };
  function h(e, t, r, i) {
    let a,
      o,
      s,
      c = window.getComputedStyle(e, r),
      u = c.getPropertyValue("content");
    if ("" === u || "none" === u) return;
    let d = n();
    try {
      t.className = `${t.className} ${d}`;
    } catch (e) {
      return;
    }
    let f = document.createElement("style");
    (f.appendChild(
      ((a = `.${d}:${r}`),
      (s = c.cssText
        ? ((o = c.getPropertyValue("content")),
          `${c.cssText} content: '${o.replace(/'|"/g, "")}';`)
        : l(i)
            .map((e) => {
              let t = c.getPropertyValue(e),
                r = c.getPropertyPriority(e);
              return `${e}: ${t}${r ? " !important" : ""};`;
            })
            .join(" ")),
      document.createTextNode(`${a}{${s}}`)),
    ),
      t.appendChild(f));
  }
  let m = "application/font-woff",
    p = "image/jpeg",
    g = {
      woff: m,
      woff2: m,
      ttf: "application/font-truetype",
      eot: "application/vnd.ms-fontobject",
      png: "image/png",
      jpg: p,
      jpeg: p,
      gif: "image/gif",
      tiff: "image/tiff",
      svg: "image/svg+xml",
      webp: "image/webp",
    };
  function y(e) {
    let t;
    return g[((t = /\.([^./]*?)$/g.exec(e)) ? t[1] : "").toLowerCase()] || "";
  }
  function w(e) {
    return -1 !== e.search(/^(data:)/);
  }
  function b(e, t) {
    return `data:${t};base64,${e}`;
  }
  async function v(e, t, r) {
    let n = await fetch(e, t);
    if (404 === n.status) throw Error(`Resource "${n.url}" not found`);
    let i = await n.blob();
    return new Promise((e, t) => {
      let a = new FileReader();
      ((a.onerror = t),
        (a.onloadend = () => {
          try {
            e(r({ res: n, result: a.result }));
          } catch (e) {
            t(e);
          }
        }),
        a.readAsDataURL(i));
    });
  }
  let A = {};
  async function E(e, t, r) {
    var n, i, a;
    let l,
      o,
      s =
        ((n = e),
        (i = t),
        (a = r.includeQueryParams),
        (o = n.replace(/\?.*/, "")),
        a && (o = n),
        /ttf|otf|eot|woff2?/i.test(o) && (o = o.replace(/.*\//, "")),
        i ? `[${i}]${o}` : o);
    if (null != A[s]) return A[s];
    r.cacheBust && (e += (/\?/.test(e) ? "&" : "?") + new Date().getTime());
    try {
      let n = await v(
        e,
        r.fetchRequestInit,
        ({ res: e, result: r }) => (
          t || (t = e.headers.get("Content-Type") || ""),
          r.split(/,/)[1]
        ),
      );
      l = b(n, t);
    } catch (n) {
      l = r.imagePlaceholder || "";
      let t = `Failed to fetch resource: ${e}`;
      (n && (t = "string" == typeof n ? n : n.message), t && console.warn(t));
    }
    return ((A[s] = l), l);
  }
  async function C(e) {
    let t = e.toDataURL();
    return "data:," === t ? e.cloneNode(!1) : c(t);
  }
  async function S(e, t) {
    if (e.currentSrc) {
      let t = document.createElement("canvas"),
        r = t.getContext("2d");
      return (
        (t.width = e.clientWidth),
        (t.height = e.clientHeight),
        null == r || r.drawImage(e, 0, 0, t.width, t.height),
        c(t.toDataURL())
      );
    }
    let r = e.poster,
      n = y(r);
    return c(await E(r, n, t));
  }
  async function x(e, t) {
    var r;
    try {
      if (
        null == (r = null == e ? void 0 : e.contentDocument) ? void 0 : r.body
      )
        return await P(e.contentDocument.body, t, !0);
    } catch (e) {}
    return e.cloneNode(!1);
  }
  async function F(e, t) {
    return f(e, HTMLCanvasElement)
      ? C(e)
      : f(e, HTMLVideoElement)
        ? S(e, t)
        : f(e, HTMLIFrameElement)
          ? x(e, t)
          : e.cloneNode($(e));
  }
  let $ = (e) => null != e.tagName && "SVG" === e.tagName.toUpperCase();
  async function R(e, t, r) {
    var n, a;
    if ($(t)) return t;
    let l = [];
    return (
      0 ===
        (l =
          null != e.tagName &&
          "SLOT" === e.tagName.toUpperCase() &&
          e.assignedNodes
            ? i(e.assignedNodes())
            : f(e, HTMLIFrameElement) &&
                (null == (n = e.contentDocument) ? void 0 : n.body)
              ? i(e.contentDocument.body.childNodes)
              : i((null != (a = e.shadowRoot) ? a : e).childNodes)).length ||
        f(e, HTMLVideoElement) ||
        (await l.reduce(
          (e, n) =>
            e
              .then(() => P(n, r))
              .then((e) => {
                e && t.appendChild(e);
              }),
          Promise.resolve(),
        )),
      t
    );
  }
  async function U(e, t) {
    let r = e.querySelectorAll ? e.querySelectorAll("use") : [];
    if (0 === r.length) return e;
    let n = {};
    for (let i = 0; i < r.length; i++) {
      let a = r[i].getAttribute("xlink:href");
      if (a) {
        let r = e.querySelector(a),
          i = document.querySelector(a);
        r || !i || n[a] || (n[a] = await P(i, t, !0));
      }
    }
    let i = Object.values(n);
    if (i.length) {
      let t = "http://www.w3.org/1999/xhtml",
        r = document.createElementNS(t, "svg");
      (r.setAttribute("xmlns", t),
        (r.style.position = "absolute"),
        (r.style.width = "0"),
        (r.style.height = "0"),
        (r.style.overflow = "hidden"),
        (r.style.display = "none"));
      let n = document.createElementNS(t, "defs");
      r.appendChild(n);
      for (let e = 0; e < i.length; e++) n.appendChild(i[e]);
      e.appendChild(r);
    }
    return e;
  }
  async function P(e, t, r) {
    return r || !t.filter || t.filter(e)
      ? Promise.resolve(e)
          .then((e) => F(e, t))
          .then((r) => R(e, r, t))
          .then((r) =>
            (function (e, t, r) {
              if (
                f(t, Element) &&
                (!(function (e, t, r) {
                  let n = t.style;
                  if (!n) return;
                  let i = window.getComputedStyle(e);
                  i.cssText
                    ? ((n.cssText = i.cssText),
                      (n.transformOrigin = i.transformOrigin))
                    : l(r).forEach((r) => {
                        let a = i.getPropertyValue(r);
                        if ("font-size" === r && a.endsWith("px")) {
                          let e =
                            Math.floor(
                              parseFloat(a.substring(0, a.length - 2)),
                            ) - 0.1;
                          a = `${e}px`;
                        }
                        (f(e, HTMLIFrameElement) &&
                          "display" === r &&
                          "inline" === a &&
                          (a = "block"),
                          "d" === r &&
                            t.getAttribute("d") &&
                            (a = `path(${t.getAttribute("d")})`),
                          n.setProperty(r, a, i.getPropertyPriority(r)));
                      });
                })(e, t, r),
                h(e, t, ":before", r),
                h(e, t, ":after", r),
                f(e, HTMLTextAreaElement) && (t.innerHTML = e.value),
                f(e, HTMLInputElement) && t.setAttribute("value", e.value),
                f(e, HTMLSelectElement))
              ) {
                let r = Array.from(t.children).find(
                  (t) => e.value === t.getAttribute("value"),
                );
                r && r.setAttribute("selected", "");
              }
              return t;
            })(e, r, t),
          )
          .then((e) => U(e, t))
      : null;
  }
  let k = /url\((['"]?)([^'"]+?)\1\)/g,
    B = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g,
    T = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
  async function L(e, t, r, n, i) {
    try {
      let a,
        l,
        o = r
          ? (function (e, t) {
              if (e.match(/^[a-z]+:\/\//i)) return e;
              if (e.match(/^\/\//)) return window.location.protocol + e;
              if (e.match(/^[a-z]+:/i)) return e;
              let r = document.implementation.createHTMLDocument(),
                n = r.createElement("base"),
                i = r.createElement("a");
              return (
                r.head.appendChild(n),
                r.body.appendChild(i),
                t && (n.href = t),
                (i.href = e),
                i.href
              );
            })(t, r)
          : t,
        s = y(t);
      if (i) {
        let e = await i(o);
        a = b(e, s);
      } else a = await E(o, s, n);
      return e.replace(
        ((l = t.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1")),
        RegExp(`(url\\(['"]?)(${l})(['"]?\\))`, "g")),
        `$1${a}$3`,
      );
    } catch (e) {}
    return e;
  }
  function N(e) {
    return -1 !== e.search(k);
  }
  async function D(e, t, r) {
    let n;
    if (!N(e)) return e;
    let i = (function (e, { preferredFontFormat: t }) {
      return t
        ? e.replace(T, (e) => {
            for (;;) {
              let [r, , n] = B.exec(e) || [];
              if (!n) return "";
              if (n === t) return `src: ${r};`;
            }
          })
        : e;
    })(e, r);
    return ((n = []),
    i.replace(k, (e, t, r) => (n.push(r), e)),
    n.filter((e) => !w(e))).reduce(
      (e, n) => e.then((e) => L(e, n, t, r)),
      Promise.resolve(i),
    );
  }
  async function I(e, t, r) {
    var n;
    let i = null == (n = t.style) ? void 0 : n.getPropertyValue(e);
    if (i) {
      let n = await D(i, null, r);
      return (t.style.setProperty(e, n, t.style.getPropertyPriority(e)), !0);
    }
    return !1;
  }
  async function _(e, t) {
    ((await I("background", e, t)) || (await I("background-image", e, t)),
      (await I("mask", e, t)) ||
        (await I("-webkit-mask", e, t)) ||
        (await I("mask-image", e, t)) ||
        (await I("-webkit-mask-image", e, t)));
  }
  async function j(e, t) {
    let r = f(e, HTMLImageElement);
    if (!(r && !w(e.src)) && !(f(e, SVGImageElement) && !w(e.href.baseVal)))
      return;
    let n = r ? e.src : e.href.baseVal,
      i = await E(n, y(n), t);
    await new Promise((n, a) => {
      ((e.onload = n),
        (e.onerror = t.onImageErrorHandler
          ? (...e) => {
              try {
                n(t.onImageErrorHandler(...e));
              } catch (e) {
                a(e);
              }
            }
          : a),
        e.decode && (e.decode = n),
        "lazy" === e.loading && (e.loading = "eager"),
        r ? ((e.srcset = ""), (e.src = i)) : (e.href.baseVal = i));
    });
  }
  async function M(e, t) {
    let r = i(e.childNodes).map((e) => W(e, t));
    await Promise.all(r).then(() => e);
  }
  async function W(e, t) {
    f(e, Element) && (await _(e, t), await j(e, t), await M(e, t));
  }
  let O = {};
  async function H(e) {
    let t = O[e];
    if (null != t) return t;
    let r = await fetch(e);
    return ((t = { url: e, cssText: await r.text() }), (O[e] = t), t);
  }
  async function V(e, t) {
    let r = e.cssText,
      n = /url\(["']?([^"')]+)["']?\)/g;
    return Promise.all(
      (r.match(/url\([^)]+\)/g) || []).map(async (i) => {
        let a = i.replace(n, "$1");
        return (
          a.startsWith("https://") || (a = new URL(a, e.url).href),
          v(
            a,
            t.fetchRequestInit,
            ({ result: e }) => ((r = r.replace(i, `url(${e})`)), [i, e]),
          )
        );
      }),
    ).then(() => r);
  }
  function q(e) {
    if (null == e) return [];
    let t = [],
      r = e.replace(/(\/\*[\s\S]*?\*\/)/gi, ""),
      n = RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
    for (;;) {
      let e = n.exec(r);
      if (null === e) break;
      t.push(e[0]);
    }
    r = r.replace(n, "");
    let i = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi,
      a = RegExp(
        "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",
        "gi",
      );
    for (;;) {
      let e = i.exec(r);
      if (null === e) {
        if (null === (e = a.exec(r))) break;
        i.lastIndex = a.lastIndex;
      } else a.lastIndex = i.lastIndex;
      t.push(e[0]);
    }
    return t;
  }
  async function z(e, t) {
    let r = [],
      n = [];
    return (
      e.forEach((r) => {
        if ("cssRules" in r)
          try {
            i(r.cssRules || []).forEach((e, i) => {
              if (e.type === CSSRule.IMPORT_RULE) {
                let a = i + 1,
                  l = H(e.href)
                    .then((e) => V(e, t))
                    .then((e) =>
                      q(e).forEach((e) => {
                        try {
                          r.insertRule(
                            e,
                            e.startsWith("@import")
                              ? (a += 1)
                              : r.cssRules.length,
                          );
                        } catch (t) {
                          console.error(
                            "Error inserting rule from remote css",
                            { rule: e, error: t },
                          );
                        }
                      }),
                    )
                    .catch((e) => {
                      console.error("Error loading remote css", e.toString());
                    });
                n.push(l);
              }
            });
          } catch (a) {
            let i = e.find((e) => null == e.href) || document.styleSheets[0];
            (null != r.href &&
              n.push(
                H(r.href)
                  .then((e) => V(e, t))
                  .then((e) =>
                    q(e).forEach((e) => {
                      i.insertRule(e, i.cssRules.length);
                    }),
                  )
                  .catch((e) => {
                    console.error("Error loading remote stylesheet", e);
                  }),
              ),
              console.error("Error inlining remote css file", a));
          }
      }),
      Promise.all(n).then(
        () => (
          e.forEach((e) => {
            if ("cssRules" in e)
              try {
                i(e.cssRules || []).forEach((e) => {
                  r.push(e);
                });
              } catch (t) {
                console.error(
                  `Error while reading CSS rules from ${e.href}`,
                  t,
                );
              }
          }),
          r
        ),
      )
    );
  }
  async function K(e, t) {
    if (null == e.ownerDocument)
      throw Error("Provided element is not within a Document");
    let r = i(e.ownerDocument.styleSheets);
    return (await z(r, t))
      .filter((e) => e.type === CSSRule.FONT_FACE_RULE)
      .filter((e) => N(e.style.getPropertyValue("src")));
  }
  function G(e) {
    return e.trim().replace(/["']/g, "");
  }
  async function J(e, t) {
    let r,
      n = await K(e, t),
      i =
        ((r = new Set()),
        !(function e(t) {
          ((t.style.fontFamily || getComputedStyle(t).fontFamily)
            .split(",")
            .forEach((e) => {
              r.add(G(e));
            }),
            Array.from(t.children).forEach((t) => {
              t instanceof HTMLElement && e(t);
            }));
        })(e),
        r);
    return (
      await Promise.all(
        n
          .filter((e) => i.has(G(e.style.fontFamily)))
          .map((e) => {
            let r = e.parentStyleSheet ? e.parentStyleSheet.href : null;
            return D(e.cssText, r, t);
          }),
      )
    ).join("\n");
  }
  async function Z(e, t) {
    let r =
      null != t.fontEmbedCSS
        ? t.fontEmbedCSS
        : t.skipFonts
          ? null
          : await J(e, t);
    if (r) {
      let t = document.createElement("style"),
        n = document.createTextNode(r);
      (t.appendChild(n),
        e.firstChild ? e.insertBefore(t, e.firstChild) : e.appendChild(t));
    }
  }
  async function Q(e, t = {}) {
    let { width: r, height: n } = s(e, t),
      i = await P(e, t, !0);
    return (
      await Z(i, t),
      await W(i, t),
      !(function (e, t) {
        let { style: r } = e;
        (t.backgroundColor && (r.backgroundColor = t.backgroundColor),
          t.width && (r.width = `${t.width}px`),
          t.height && (r.height = `${t.height}px`));
        let n = t.style;
        null != n &&
          Object.keys(n).forEach((e) => {
            r[e] = n[e];
          });
      })(i, t),
      await d(i, r, n)
    );
  }
  async function Y(e, t = {}) {
    let { width: n, height: i } = s(e, t),
      a = await Q(e, t),
      l = await c(a),
      o = document.createElement("canvas"),
      u = o.getContext("2d"),
      d =
        t.pixelRatio ||
        (function () {
          let e, t;
          try {
            t = r.default;
          } catch (e) {}
          let n = t && t.env ? t.env.devicePixelRatio : null;
          return (
            n && Number.isNaN((e = parseInt(n, 10))) && (e = 1),
            e || window.devicePixelRatio || 1
          );
        })(),
      f = t.canvasWidth || n,
      h = t.canvasHeight || i;
    return (
      (o.width = f * d),
      (o.height = h * d),
      !t.skipAutoScale &&
        (o.width > 16384 || o.height > 16384) &&
        (o.width > 16384 && o.height > 16384
          ? o.width > o.height
            ? ((o.height *= 16384 / o.width), (o.width = 16384))
            : ((o.width *= 16384 / o.height), (o.height = 16384))
          : o.width > 16384
            ? ((o.height *= 16384 / o.width), (o.width = 16384))
            : ((o.width *= 16384 / o.height), (o.height = 16384))),
      (o.style.width = `${f}`),
      (o.style.height = `${h}`),
      t.backgroundColor &&
        ((u.fillStyle = t.backgroundColor),
        u.fillRect(0, 0, o.width, o.height)),
      u.drawImage(l, 0, 0, o.width, o.height),
      o
    );
  }
  async function X(e, t = {}) {
    return (await Y(e, t)).toDataURL();
  }
  e.s(["f", 0, X], 448652);
  let ee =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    et = (e, t, r) =>
      Promise.race([
        e,
        new Promise((e) => {
          setTimeout(() => e(r), t);
        }),
      ]),
    er = (e, t, r) => String.fromCharCode(...e.subarray(t, r)),
    en = async (e) => {
      let t = new AbortController(),
        r = setTimeout(() => t.abort(), 5e3);
      try {
        let r = await fetch(e, {
          credentials: "same-origin",
          signal: t.signal,
        });
        if (!r.ok) return null;
        let n = new Uint8Array(await r.arrayBuffer());
        if (0 === n.length) return null;
        let i = (r.headers.get("content-type") ?? "")
            .split(";")[0]
            .trim()
            .toLowerCase(),
          a = i.startsWith("image/")
            ? i
            : ((e) => {
                if (e.length < 12) return null;
                let t = er(e, 0, 12);
                if (t.startsWith("PNG\r\n\x1a\n")) return "image/png";
                if (t.startsWith("ÿØÿ")) return "image/jpeg";
                if (t.startsWith("GIF87a") || t.startsWith("GIF89a"))
                  return "image/gif";
                if (t.startsWith("RIFF") && "WEBP" === t.slice(8, 12))
                  return "image/webp";
                if ("ftyp" === t.slice(4, 8) && "avi" === t.slice(8, 11))
                  return "image/avif";
                if (t.startsWith("BM")) return "image/bmp";
                let r = er(e, 0, Math.min(e.length, 512))
                  .replace(/^\u00ef\u00bb\u00bf/, "")
                  .trimStart();
                return r.startsWith("<svg") ||
                  (r.startsWith("<?xml") && r.includes("<svg"))
                  ? "image/svg+xml"
                  : null;
              })(n);
        return a
          ? `data:${a};base64,${((e) => {
              let t = "";
              for (let r = 0; r < e.length; r += 32768)
                t += String.fromCharCode(...e.subarray(r, r + 32768));
              return btoa(t);
            })(n)}`
          : null;
      } catch {
        return null;
      } finally {
        clearTimeout(r);
      }
    },
    ei = async (e) => {
      let t = [];
      return (
        await Promise.all(
          Array.from(e.querySelectorAll("img")).map(async (e) => {
            let r = e.getAttribute("src") ?? "";
            if (!r || r.startsWith("data:")) return;
            let n = new URL(r, document.baseURI).href,
              i = await en(n);
            (null === i && t.push(n),
              e.removeAttribute("srcset"),
              e.removeAttribute("loading"),
              e.setAttribute("src", i ?? ee));
          }),
        ),
        t
      );
    };
  async function ea({ root: e, width: t, height: r, pixelRatio: n = 2 }) {
    (await et(
      Promise.all(
        Array.from(e.querySelectorAll("img")).map((e) =>
          e.complete
            ? Promise.resolve()
            : new Promise((t) => {
                (e.addEventListener("load", () => t(), { once: !0 }),
                  e.addEventListener("error", () => t(), { once: !0 }));
              }),
        ),
      ).then(() => void 0),
      1e3,
      void 0,
    ),
      await ("u" > typeof document && document.fonts
        ? et(
            document.fonts.ready.then(() => void 0),
            1500,
            void 0,
          )
        : Promise.resolve()));
    let i = e.cloneNode(!0);
    for (let e of Array.from(i.querySelectorAll("video"))) e.remove();
    ((i.style.borderRadius = "0"), (i.style.border = "0"));
    let a = document.createElement("div");
    (a.setAttribute("aria-hidden", "true"),
      (a.style.cssText =
        "position:fixed;left:-10000px;top:0;pointer-events:none;"),
      a.appendChild(i),
      (e.parentElement ?? document.body).appendChild(a));
    try {
      let e = await ei(i),
        a = () =>
          X(i, {
            pixelRatio: n,
            width: t,
            height: r,
            cacheBust: !1,
            includeQueryParams: !0,
            imagePlaceholder: ee,
            filter: (e) => !(e instanceof HTMLVideoElement),
          }),
        l = await a();
      return (
        (() => {
          if ("u" < typeof navigator) return !1;
          let e = navigator.userAgent;
          return (
            /AppleWebKit\//.test(e) &&
            /Safari\//.test(e) &&
            !/Chrome\/|Chromium\/|Edg\/|OPR\//.test(e)
          );
        })() && (l = await a()),
        {
          blob: ((e) => {
            let t = e.indexOf(","),
              r = /^data:([^;,]+)/.exec(e)?.[1] ?? "image/png",
              n = atob(e.slice(t + 1)),
              i = new Uint8Array(n.length);
            for (let e = 0; e < n.length; e += 1) i[e] = n.charCodeAt(e);
            return new Blob([i], { type: r });
          })(l),
          failedImages: e,
        }
      );
    } finally {
      a.remove();
    }
  }
  e.s(["f", 0, ea], 140550);
};
