// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(t, r, e) => {
  var o = t.r(108354),
    n = Object.prototype.toString,
    i = Object.prototype.hasOwnProperty,
    a = function (t, r, e) {
      for (var o = 0, n = t.length; o < n; o++)
        i.call(t, o) && (null == e ? r(t[o], o, t) : r.call(e, t[o], o, t));
    },
    u = function (t, r, e) {
      for (var o = 0, n = t.length; o < n; o++)
        null == e ? r(t.charAt(o), o, t) : r.call(e, t.charAt(o), o, t);
    },
    p = function (t, r, e) {
      for (var o in t)
        i.call(t, o) && (null == e ? r(t[o], o, t) : r.call(e, t[o], o, t));
    };
  r.exports = function (t, r, e) {
    var i;
    if (!o(r)) throw TypeError("iterator must be a function");
    (arguments.length >= 3 && (i = e), "[object Array]" === n.call(t))
      ? a(t, r, i)
      : "string" == typeof t
        ? u(t, r, i)
        : p(t, r, i);
  };
};
