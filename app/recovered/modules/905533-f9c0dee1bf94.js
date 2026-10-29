// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t = e.i(39793),
    r = e.i(521446),
    i = e.i(491894),
    a = e.i(147494);
  (e.s(
    [
      "f",
      0,
      function (e) {
        let n, s;
        if ("string" != typeof e)
          throw new a.JWTInvalid(
            "JWTs must use Compact JWS serialization, JWT must be a string",
          );
        let { 1: o, length: d } = e.split(".");
        if (5 === d)
          throw new a.JWTInvalid(
            "Only JWTs using Compact JWS serialization can be decoded",
          );
        if (3 !== d) throw new a.JWTInvalid("Invalid JWT");
        if (!o) throw new a.JWTInvalid("JWTs must contain a payload");
        try {
          n = (0, t.decode)(o);
        } catch (e) {
          throw new a.JWTInvalid("Failed to base64url decode the payload");
        }
        try {
          s = JSON.parse(r.P.decode(n));
        } catch (e) {
          throw new a.JWTInvalid("Failed to parse the decoded payload as JSON");
        }
        if (!(0, i.f)(s)) throw new a.JWTInvalid("Invalid JWT Claims Set");
        return s;
      },
    ],
    905533,
  ),
    e.s(["f", 0, t], 117852));
};
