// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  let t;
  var r,
    i,
    a,
    n,
    s,
    o,
    d,
    l,
    c,
    u,
    h,
    p,
    f,
    y,
    m,
    _,
    g,
    v,
    $,
    b,
    w,
    I,
    k,
    S,
    T = e.i(753887),
    C = e.i(251411),
    E = e.i(905533),
    A = e.i(117852),
    x = e.i(178061),
    N = e.i(785373),
    P = e.i(496194),
    O = e.i(156732),
    R = e.i(766409),
    U = e.i(499868),
    M = e.i(703114),
    D = e.i(817635),
    L = e.i(305456),
    F = e.i(697781);
  let j = new TextEncoder(),
    W = new TextDecoder(),
    G = new TextDecoder("utf-8", { fatal: !0 }),
    B = {
      utf8: {
        fromBytes: (e, t) => (t?.fatal ? G : W).decode(e),
        toBytes: (e) => Uint8Array.from(j.encode(e)),
      },
      base64: {
        fromBytes: (e) => F.t.encode(e),
        toBytes: (e) => {
          try {
            return Uint8Array.from(F.t.decode(e));
          } catch (t) {
            if (
              t instanceof Error &&
              t.message.includes("string should have whole number of bytes")
            )
              return Uint8Array.from(F.X.decode(e));
            throw t;
          }
        },
      },
      base64url: {
        fromBytes: (e) => F.c.encode(e),
        toBytes: (e) => Uint8Array.from(F.c.decode(e)),
      },
      base64urlnopad: {
        fromBytes: (e) => F.n.encode(e),
        toBytes: (e) => Uint8Array.from(F.n.decode(e)),
      },
      hex: {
        fromBytes: (e) => F.L.encode(e),
        toBytes: (e) =>
          Uint8Array.from(F.L.decode(e.startsWith("0x") ? e.slice(2) : e)),
      },
    };
  e.s(["f", 0, B], 201624);
  var V = e.i(315888),
    q = e.i(144876);
  (((r = w || (w = {})).assertEqual = (e) => {}),
    (r.assertIs = function (e) {}),
    (r.assertNever = function (e) {
      throw Error();
    }),
    (r.arrayToEnum = (e) => {
      let t = {};
      for (let r of e) t[r] = r;
      return t;
    }),
    (r.getValidEnumValues = (e) => {
      let t = r.objectKeys(e).filter((t) => "number" != typeof e[e[t]]),
        i = {};
      for (let r of t) i[r] = e[r];
      return r.objectValues(i);
    }),
    (r.objectValues = (e) =>
      r.objectKeys(e).map(function (t) {
        return e[t];
      })),
    (r.objectKeys =
      "function" == typeof Object.keys
        ? (e) => Object.keys(e)
        : (e) => {
            let t = [];
            for (let r in e)
              Object.prototype.hasOwnProperty.call(e, r) && t.push(r);
            return t;
          }),
    (r.find = (e, t) => {
      for (let r of e) if (t(r)) return r;
    }),
    (r.isInteger =
      "function" == typeof Number.isInteger
        ? (e) => Number.isInteger(e)
        : (e) =>
            "number" == typeof e && Number.isFinite(e) && Math.floor(e) === e),
    (r.joinValues = function (e, t = " | ") {
      return e.map((e) => ("string" == typeof e ? `'${e}'` : e)).join(t);
    }),
    (r.jsonStringifyReplacer = (e, t) =>
      "bigint" == typeof t ? t.toString() : t),
    ((I || (I = {})).mergeShapes = (e, t) => ({ ...e, ...t })));
  let Z = w.arrayToEnum([
      "string",
      "nan",
      "number",
      "integer",
      "float",
      "boolean",
      "date",
      "bigint",
      "symbol",
      "function",
      "undefined",
      "null",
      "array",
      "object",
      "unknown",
      "promise",
      "void",
      "never",
      "map",
      "set",
    ]),
    K = (e) => {
      switch (typeof e) {
        case "undefined":
          return Z.undefined;
        case "string":
          return Z.string;
        case "number":
          return Number.isNaN(e) ? Z.nan : Z.number;
        case "boolean":
          return Z.boolean;
        case "function":
          return Z.function;
        case "bigint":
          return Z.bigint;
        case "symbol":
          return Z.symbol;
        case "object":
          if (Array.isArray(e)) return Z.array;
          if (null === e) return Z.null;
          if (
            e.then &&
            "function" == typeof e.then &&
            e.catch &&
            "function" == typeof e.catch
          )
            return Z.promise;
          if ("u" > typeof Map && e instanceof Map) return Z.map;
          if ("u" > typeof Set && e instanceof Set) return Z.set;
          if ("u" > typeof Date && e instanceof Date) return Z.date;
          return Z.object;
        default:
          return Z.unknown;
      }
    };
  e.s(["ZodParsedType", 0, Z, "getParsedType", 0, K, "util", 0, w], 458728);
  let J = w.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite",
  ]);
  class H extends Error {
    get errors() {
      return this.issues;
    }
    constructor(e) {
      (super(),
        (this.issues = []),
        (this.addIssue = (e) => {
          this.issues = [...this.issues, e];
        }),
        (this.addIssues = (e = []) => {
          this.issues = [...this.issues, ...e];
        }));
      let t = new.target.prototype;
      (Object.setPrototypeOf
        ? Object.setPrototypeOf(this, t)
        : (this.__proto__ = t),
        (this.name = "ZodError"),
        (this.issues = e));
    }
    format(e) {
      let t =
          e ||
          function (e) {
            return e.message;
          },
        r = { _errors: [] },
        i = (e) => {
          for (let a of e.issues)
            if ("invalid_union" === a.code) a.unionErrors.map(i);
            else if ("invalid_return_type" === a.code) i(a.returnTypeError);
            else if ("invalid_arguments" === a.code) i(a.argumentsError);
            else if (0 === a.path.length) r._errors.push(t(a));
            else {
              let e = r,
                i = 0;
              for (; i < a.path.length; ) {
                let r = a.path[i];
                (i === a.path.length - 1
                  ? ((e[r] = e[r] || { _errors: [] }), e[r]._errors.push(t(a)))
                  : (e[r] = e[r] || { _errors: [] }),
                  (e = e[r]),
                  i++);
              }
            }
        };
      return (i(this), r);
    }
    static assert(e) {
      if (!(e instanceof H)) throw Error(`Not a ZodError: ${e}`);
    }
    toString() {
      return this.message;
    }
    get message() {
      return JSON.stringify(this.issues, w.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
      return 0 === this.issues.length;
    }
    flatten(e = (e) => e.message) {
      let t = {},
        r = [];
      for (let i of this.issues)
        if (i.path.length > 0) {
          let r = i.path[0];
          ((t[r] = t[r] || []), t[r].push(e(i)));
        } else r.push(e(i));
      return { formErrors: r, fieldErrors: t };
    }
    get formErrors() {
      return this.flatten();
    }
  }
  ((H.create = (e) => new H(e)),
    e.s(["ZodError", 0, H, "ZodIssueCode", 0, J], 559413));
  let z = (e, t) => {
    let r;
    switch (e.code) {
      case J.invalid_type:
        r =
          e.received === Z.undefined
            ? "Required"
            : `Expected ${e.expected}, received ${e.received}`;
        break;
      case J.invalid_literal:
        r = `Invalid literal value, expected ${JSON.stringify(e.expected, w.jsonStringifyReplacer)}`;
        break;
      case J.unrecognized_keys:
        r = `Unrecognized key(s) in object: ${w.joinValues(e.keys, ", ")}`;
        break;
      case J.invalid_union:
        r = "Invalid input";
        break;
      case J.invalid_union_discriminator:
        r = `Invalid discriminator value. Expected ${w.joinValues(e.options)}`;
        break;
      case J.invalid_enum_value:
        r = `Invalid enum value. Expected ${w.joinValues(e.options)}, received '${e.received}'`;
        break;
      case J.invalid_arguments:
        r = "Invalid function arguments";
        break;
      case J.invalid_return_type:
        r = "Invalid function return type";
        break;
      case J.invalid_date:
        r = "Invalid date";
        break;
      case J.invalid_string:
        "object" == typeof e.validation
          ? "includes" in e.validation
            ? ((r = `Invalid input: must include "${e.validation.includes}"`),
              "number" == typeof e.validation.position &&
                (r = `${r} at one or more positions greater than or equal to ${e.validation.position}`))
            : "startsWith" in e.validation
              ? (r = `Invalid input: must start with "${e.validation.startsWith}"`)
              : "endsWith" in e.validation
                ? (r = `Invalid input: must end with "${e.validation.endsWith}"`)
                : w.assertNever(e.validation)
          : (r =
              "regex" !== e.validation ? `Invalid ${e.validation}` : "Invalid");
        break;
      case J.too_small:
        r =
          "array" === e.type
            ? `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "more than"} ${e.minimum} element(s)`
            : "string" === e.type
              ? `String must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "over"} ${e.minimum} character(s)`
              : "number" === e.type || "bigint" === e.type
                ? `Number must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${e.minimum}`
                : "date" === e.type
                  ? `Date must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(e.minimum))}`
                  : "Invalid input";
        break;
      case J.too_big:
        r =
          "array" === e.type
            ? `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "less than"} ${e.maximum} element(s)`
            : "string" === e.type
              ? `String must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "under"} ${e.maximum} character(s)`
              : "number" === e.type
                ? `Number must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}`
                : "bigint" === e.type
                  ? `BigInt must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}`
                  : "date" === e.type
                    ? `Date must be ${e.exact ? "exactly" : e.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(e.maximum))}`
                    : "Invalid input";
        break;
      case J.custom:
        r = "Invalid input";
        break;
      case J.invalid_intersection_types:
        r = "Intersection results could not be merged";
        break;
      case J.not_multiple_of:
        r = `Number must be a multiple of ${e.multipleOf}`;
        break;
      case J.not_finite:
        r = "Number must be finite";
        break;
      default:
        ((r = t.defaultError), w.assertNever(e));
    }
    return { message: r };
  };
  (e.s([], 279407), e.i(279407));
  let Y = (e) => {
    let { data: t, path: r, errorMaps: i, issueData: a } = e,
      n = [...r, ...(a.path || [])],
      s = { ...a, path: n };
    if (void 0 !== a.message) return { ...a, path: n, message: a.message };
    let o = "";
    for (let e of i
      .filter((e) => !!e)
      .slice()
      .reverse())
      o = e(s, { data: t, defaultError: o }).message;
    return { ...a, path: n, message: o };
  };
  function X(e, t) {
    let r = Y({
      issueData: t,
      data: e.data,
      path: e.path,
      errorMaps: [
        e.common.contextualErrorMap,
        e.schemaErrorMap,
        z,
        void 0,
      ].filter((e) => !!e),
    });
    e.common.issues.push(r);
  }
  class Q {
    constructor() {
      this.value = "valid";
    }
    dirty() {
      "valid" === this.value && (this.value = "dirty");
    }
    abort() {
      "aborted" !== this.value && (this.value = "aborted");
    }
    static mergeArray(e, t) {
      let r = [];
      for (let i of t) {
        if ("aborted" === i.status) return ee;
        ("dirty" === i.status && e.dirty(), r.push(i.value));
      }
      return { status: e.value, value: r };
    }
    static async mergeObjectAsync(e, t) {
      let r = [];
      for (let e of t) {
        let t = await e.key,
          i = await e.value;
        r.push({ key: t, value: i });
      }
      return Q.mergeObjectSync(e, r);
    }
    static mergeObjectSync(e, t) {
      let r = {};
      for (let i of t) {
        let { key: t, value: a } = i;
        if ("aborted" === t.status || "aborted" === a.status) return ee;
        ("dirty" === t.status && e.dirty(),
          "dirty" === a.status && e.dirty(),
          "__proto__" !== t.value &&
            (void 0 !== a.value || i.alwaysSet) &&
            (r[t.value] = a.value));
      }
      return { status: e.value, value: r };
    }
  }
  let ee = Object.freeze({ status: "aborted" }),
    et = (e) => ({ status: "dirty", value: e }),
    er = (e) => ({ status: "valid", value: e }),
    ei = (e) => "aborted" === e.status,
    ea = (e) => "dirty" === e.status,
    en = (e) => "valid" === e.status,
    es = (e) => "u" > typeof Promise && e instanceof Promise;
  (e.s(
    [
      "DIRTY",
      0,
      et,
      "INVALID",
      0,
      ee,
      "OK",
      0,
      er,
      "ParseStatus",
      0,
      Q,
      "addIssueToContext",
      0,
      X,
      "isAborted",
      0,
      ei,
      "isAsync",
      0,
      es,
      "isDirty",
      0,
      ea,
      "isValid",
      0,
      en,
      "makeIssue",
      0,
      Y,
    ],
    696555,
  ),
    e.i(696555),
    e.s([], 924326),
    e.i(924326),
    e.i(458728),
    ((i = k || (k = {})).errToObj = (e) =>
      "string" == typeof e ? { message: e } : e || {}),
    (i.toString = (e) => ("string" == typeof e ? e : e?.message)));
  class eo {
    constructor(e, t, r, i) {
      ((this._cachedPath = []),
        (this.parent = e),
        (this.data = t),
        (this._path = r),
        (this._key = i));
    }
    get path() {
      return (
        this._cachedPath.length ||
          (Array.isArray(this._key)
            ? this._cachedPath.push(...this._path, ...this._key)
            : this._cachedPath.push(...this._path, this._key)),
        this._cachedPath
      );
    }
  }
  let ed = (e, t) => {
    if (en(t)) return { success: !0, data: t.value };
    if (!e.common.issues.length)
      throw Error("Validation failed but no issues detected.");
    return {
      success: !1,
      get error() {
        if (this._error) return this._error;
        let t = new H(e.common.issues);
        return ((this._error = t), this._error);
      },
    };
  };
  function el(e) {
    if (!e) return {};
    let {
      errorMap: t,
      invalid_type_error: r,
      required_error: i,
      description: a,
    } = e;
    if (t && (r || i))
      throw Error(
        'Can\'t use "invalid_type_error" or "required_error" in conjunction with custom error map.',
      );
    return t
      ? { errorMap: t, description: a }
      : {
          errorMap: (t, a) => {
            let { message: n } = e;
            return "invalid_enum_value" === t.code
              ? { message: n ?? a.defaultError }
              : void 0 === a.data
                ? { message: n ?? i ?? a.defaultError }
                : "invalid_type" !== t.code
                  ? { message: a.defaultError }
                  : { message: n ?? r ?? a.defaultError };
          },
          description: a,
        };
  }
  class ec {
    get description() {
      return this._def.description;
    }
    _getType(e) {
      return K(e.data);
    }
    _getOrReturnCtx(e, t) {
      return (
        t || {
          common: e.parent.common,
          data: e.data,
          parsedType: K(e.data),
          schemaErrorMap: this._def.errorMap,
          path: e.path,
          parent: e.parent,
        }
      );
    }
    _processInputParams(e) {
      return {
        status: new Q(),
        ctx: {
          common: e.parent.common,
          data: e.data,
          parsedType: K(e.data),
          schemaErrorMap: this._def.errorMap,
          path: e.path,
          parent: e.parent,
        },
      };
    }
    _parseSync(e) {
      let t = this._parse(e);
      if (es(t)) throw Error("Synchronous parse encountered promise.");
      return t;
    }
    _parseAsync(e) {
      return Promise.resolve(this._parse(e));
    }
    parse(e, t) {
      let r = this.safeParse(e, t);
      if (r.success) return r.data;
      throw r.error;
    }
    safeParse(e, t) {
      let r = {
          common: {
            issues: [],
            async: t?.async ?? !1,
            contextualErrorMap: t?.errorMap,
          },
          path: t?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data: e,
          parsedType: K(e),
        },
        i = this._parseSync({ data: e, path: r.path, parent: r });
      return ed(r, i);
    }
    "~validate"(e) {
      let t = {
        common: { issues: [], async: !!this["~standard"].async },
        path: [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: e,
        parsedType: K(e),
      };
      if (!this["~standard"].async)
        try {
          let r = this._parseSync({ data: e, path: [], parent: t });
          return en(r) ? { value: r.value } : { issues: t.common.issues };
        } catch (e) {
          (e?.message?.toLowerCase()?.includes("encountered") &&
            (this["~standard"].async = !0),
            (t.common = { issues: [], async: !0 }));
        }
      return this._parseAsync({ data: e, path: [], parent: t }).then((e) =>
        en(e) ? { value: e.value } : { issues: t.common.issues },
      );
    }
    async parseAsync(e, t) {
      let r = await this.safeParseAsync(e, t);
      if (r.success) return r.data;
      throw r.error;
    }
    async safeParseAsync(e, t) {
      let r = {
          common: { issues: [], contextualErrorMap: t?.errorMap, async: !0 },
          path: t?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data: e,
          parsedType: K(e),
        },
        i = this._parse({ data: e, path: r.path, parent: r });
      return ed(r, await (es(i) ? i : Promise.resolve(i)));
    }
    refine(e, t) {
      return this._refinement((r, i) => {
        let a = e(r),
          n = () =>
            i.addIssue({
              code: J.custom,
              ...("string" == typeof t || void 0 === t
                ? { message: t }
                : "function" == typeof t
                  ? t(r)
                  : t),
            });
        return "u" > typeof Promise && a instanceof Promise
          ? a.then((e) => !!e || (n(), !1))
          : !!a || (n(), !1);
      });
    }
    refinement(e, t) {
      return this._refinement(
        (r, i) =>
          !!e(r) || (i.addIssue("function" == typeof t ? t(r, i) : t), !1),
      );
    }
    _refinement(e) {
      return new e0({
        schema: this,
        typeName: S.ZodEffects,
        effect: { type: "refinement", refinement: e },
      });
    }
    superRefine(e) {
      return this._refinement(e);
    }
    constructor(e) {
      ((this.spa = this.safeParseAsync),
        (this._def = e),
        (this.parse = this.parse.bind(this)),
        (this.safeParse = this.safeParse.bind(this)),
        (this.parseAsync = this.parseAsync.bind(this)),
        (this.safeParseAsync = this.safeParseAsync.bind(this)),
        (this.spa = this.spa.bind(this)),
        (this.refine = this.refine.bind(this)),
        (this.refinement = this.refinement.bind(this)),
        (this.superRefine = this.superRefine.bind(this)),
        (this.optional = this.optional.bind(this)),
        (this.nullable = this.nullable.bind(this)),
        (this.nullish = this.nullish.bind(this)),
        (this.array = this.array.bind(this)),
        (this.promise = this.promise.bind(this)),
        (this.or = this.or.bind(this)),
        (this.and = this.and.bind(this)),
        (this.transform = this.transform.bind(this)),
        (this.brand = this.brand.bind(this)),
        (this.default = this.default.bind(this)),
        (this.catch = this.catch.bind(this)),
        (this.describe = this.describe.bind(this)),
        (this.pipe = this.pipe.bind(this)),
        (this.readonly = this.readonly.bind(this)),
        (this.isNullable = this.isNullable.bind(this)),
        (this.isOptional = this.isOptional.bind(this)),
        (this["~standard"] = {
          version: 1,
          vendor: "zod",
          validate: (e) => this["~validate"](e),
        }));
    }
    optional() {
      return e1.create(this, this._def);
    }
    nullable() {
      return e2.create(this, this._def);
    }
    nullish() {
      return this.nullable().optional();
    }
    array() {
      return ej.create(this);
    }
    promise() {
      return eQ.create(this, this._def);
    }
    or(e) {
      return eG.create([this, e], this._def);
    }
    and(e) {
      return eV.create(this, e, this._def);
    }
    transform(e) {
      return new e0({
        ...el(this._def),
        schema: this,
        typeName: S.ZodEffects,
        effect: { type: "transform", transform: e },
      });
    }
    default(e) {
      return new e3({
        ...el(this._def),
        innerType: this,
        defaultValue: "function" == typeof e ? e : () => e,
        typeName: S.ZodDefault,
      });
    }
    brand() {
      return new e5({ typeName: S.ZodBranded, type: this, ...el(this._def) });
    }
    catch(e) {
      return new e4({
        ...el(this._def),
        innerType: this,
        catchValue: "function" == typeof e ? e : () => e,
        typeName: S.ZodCatch,
      });
    }
    describe(e) {
      return new this.constructor({ ...this._def, description: e });
    }
    pipe(e) {
      return e8.create(this, e);
    }
    readonly() {
      return e6.create(this);
    }
    isOptional() {
      return this.safeParse(void 0).success;
    }
    isNullable() {
      return this.safeParse(null).success;
    }
  }
  let eu = /^c[^\s-]{8,}$/i,
    eh = /^[0-9a-z]+$/,
    ep = /^[0-9A-HJKMNP-TV-Z]{26}$/i,
    ef =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
    ey = /^[a-z0-9_-]{21}$/i,
    em = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
    e_ =
      /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,
    eg =
      /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,
    ev =
      /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    e$ =
      /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
    eb =
      /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
    ew =
      /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
    eI = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
    ek =
      /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
    eS =
      "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))",
    eT = RegExp(`^${eS}$`);
  function eC(e) {
    let t = "[0-5]\\d";
    e.precision
      ? (t = `${t}\\.\\d{${e.precision}}`)
      : null == e.precision && (t = `${t}(\\.\\d+)?`);
    let r = e.precision ? "+" : "?";
    return `([01]\\d|2[0-3]):[0-5]\\d(:${t})${r}`;
  }
  class eE extends ec {
    _parse(e) {
      var r, i, a, n;
      let s;
      if (
        (this._def.coerce && (e.data = String(e.data)),
        this._getType(e) !== Z.string)
      ) {
        let t = this._getOrReturnCtx(e);
        return (
          X(t, {
            code: J.invalid_type,
            expected: Z.string,
            received: t.parsedType,
          }),
          ee
        );
      }
      let o = new Q();
      for (let d of this._def.checks)
        if ("min" === d.kind)
          e.data.length < d.value &&
            (X((s = this._getOrReturnCtx(e, s)), {
              code: J.too_small,
              minimum: d.value,
              type: "string",
              inclusive: !0,
              exact: !1,
              message: d.message,
            }),
            o.dirty());
        else if ("max" === d.kind)
          e.data.length > d.value &&
            (X((s = this._getOrReturnCtx(e, s)), {
              code: J.too_big,
              maximum: d.value,
              type: "string",
              inclusive: !0,
              exact: !1,
              message: d.message,
            }),
            o.dirty());
        else if ("length" === d.kind) {
          let t = e.data.length > d.value,
            r = e.data.length < d.value;
          (t || r) &&
            ((s = this._getOrReturnCtx(e, s)),
            t
              ? X(s, {
                  code: J.too_big,
                  maximum: d.value,
                  type: "string",
                  inclusive: !0,
                  exact: !0,
                  message: d.message,
                })
              : r &&
                X(s, {
                  code: J.too_small,
                  minimum: d.value,
                  type: "string",
                  inclusive: !0,
                  exact: !0,
                  message: d.message,
                }),
            o.dirty());
        } else if ("email" === d.kind)
          eg.test(e.data) ||
            (X((s = this._getOrReturnCtx(e, s)), {
              validation: "email",
              code: J.invalid_string,
              message: d.message,
            }),
            o.dirty());
        else if ("emoji" === d.kind)
          (t ||
            (t = RegExp(
              "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
              "u",
            )),
            t.test(e.data) ||
              (X((s = this._getOrReturnCtx(e, s)), {
                validation: "emoji",
                code: J.invalid_string,
                message: d.message,
              }),
              o.dirty()));
        else if ("uuid" === d.kind)
          ef.test(e.data) ||
            (X((s = this._getOrReturnCtx(e, s)), {
              validation: "uuid",
              code: J.invalid_string,
              message: d.message,
            }),
            o.dirty());
        else if ("nanoid" === d.kind)
          ey.test(e.data) ||
            (X((s = this._getOrReturnCtx(e, s)), {
              validation: "nanoid",
              code: J.invalid_string,
              message: d.message,
            }),
            o.dirty());
        else if ("cuid" === d.kind)
          eu.test(e.data) ||
            (X((s = this._getOrReturnCtx(e, s)), {
              validation: "cuid",
              code: J.invalid_string,
              message: d.message,
            }),
            o.dirty());
        else if ("cuid2" === d.kind)
          eh.test(e.data) ||
            (X((s = this._getOrReturnCtx(e, s)), {
              validation: "cuid2",
              code: J.invalid_string,
              message: d.message,
            }),
            o.dirty());
        else if ("ulid" === d.kind)
          ep.test(e.data) ||
            (X((s = this._getOrReturnCtx(e, s)), {
              validation: "ulid",
              code: J.invalid_string,
              message: d.message,
            }),
            o.dirty());
        else if ("url" === d.kind)
          try {
            new URL(e.data);
          } catch {
            (X((s = this._getOrReturnCtx(e, s)), {
              validation: "url",
              code: J.invalid_string,
              message: d.message,
            }),
              o.dirty());
          }
        else
          "regex" === d.kind
            ? ((d.regex.lastIndex = 0),
              d.regex.test(e.data) ||
                (X((s = this._getOrReturnCtx(e, s)), {
                  validation: "regex",
                  code: J.invalid_string,
                  message: d.message,
                }),
                o.dirty()))
            : "trim" === d.kind
              ? (e.data = e.data.trim())
              : "includes" === d.kind
                ? e.data.includes(d.value, d.position) ||
                  (X((s = this._getOrReturnCtx(e, s)), {
                    code: J.invalid_string,
                    validation: { includes: d.value, position: d.position },
                    message: d.message,
                  }),
                  o.dirty())
                : "toLowerCase" === d.kind
                  ? (e.data = e.data.toLowerCase())
                  : "toUpperCase" === d.kind
                    ? (e.data = e.data.toUpperCase())
                    : "startsWith" === d.kind
                      ? e.data.startsWith(d.value) ||
                        (X((s = this._getOrReturnCtx(e, s)), {
                          code: J.invalid_string,
                          validation: { startsWith: d.value },
                          message: d.message,
                        }),
                        o.dirty())
                      : "endsWith" === d.kind
                        ? e.data.endsWith(d.value) ||
                          (X((s = this._getOrReturnCtx(e, s)), {
                            code: J.invalid_string,
                            validation: { endsWith: d.value },
                            message: d.message,
                          }),
                          o.dirty())
                        : "datetime" === d.kind
                          ? (function (e) {
                              let t = `${eS}T${eC(e)}`,
                                r = [];
                              return (
                                r.push(e.local ? "Z?" : "Z"),
                                e.offset && r.push("([+-]\\d{2}:?\\d{2})"),
                                (t = `${t}(${r.join("|")})`),
                                RegExp(`^${t}$`)
                              );
                            })(d).test(e.data) ||
                            (X((s = this._getOrReturnCtx(e, s)), {
                              code: J.invalid_string,
                              validation: "datetime",
                              message: d.message,
                            }),
                            o.dirty())
                          : "date" === d.kind
                            ? eT.test(e.data) ||
                              (X((s = this._getOrReturnCtx(e, s)), {
                                code: J.invalid_string,
                                validation: "date",
                                message: d.message,
                              }),
                              o.dirty())
                            : "time" === d.kind
                              ? RegExp(`^${eC(d)}$`).test(e.data) ||
                                (X((s = this._getOrReturnCtx(e, s)), {
                                  code: J.invalid_string,
                                  validation: "time",
                                  message: d.message,
                                }),
                                o.dirty())
                              : "duration" === d.kind
                                ? e_.test(e.data) ||
                                  (X((s = this._getOrReturnCtx(e, s)), {
                                    validation: "duration",
                                    code: J.invalid_string,
                                    message: d.message,
                                  }),
                                  o.dirty())
                                : "ip" === d.kind
                                  ? ((r = e.data),
                                    !(
                                      (("v4" === (i = d.version) || !i) &&
                                        ev.test(r)) ||
                                      (("v6" === i || !i) && eb.test(r))
                                    ) &&
                                      1 &&
                                      (X((s = this._getOrReturnCtx(e, s)), {
                                        validation: "ip",
                                        code: J.invalid_string,
                                        message: d.message,
                                      }),
                                      o.dirty()))
                                  : "jwt" === d.kind
                                    ? !(function (e, t) {
                                        if (!em.test(e)) return !1;
                                        try {
                                          let [r] = e.split(".");
                                          if (!r) return !1;
                                          let i = r
                                              .replace(/-/g, "+")
                                              .replace(/_/g, "/")
                                              .padEnd(
                                                r.length +
                                                  ((4 - (r.length % 4)) % 4),
                                                "=",
                                              ),
                                            a = JSON.parse(atob(i));
                                          if (
                                            "object" != typeof a ||
                                            null === a ||
                                            ("typ" in a && a?.typ !== "JWT") ||
                                            !a.alg ||
                                            (t && a.alg !== t)
                                          )
                                            return !1;
                                          return !0;
                                        } catch {
                                          return !1;
                                        }
                                      })(e.data, d.alg) &&
                                      (X((s = this._getOrReturnCtx(e, s)), {
                                        validation: "jwt",
                                        code: J.invalid_string,
                                        message: d.message,
                                      }),
                                      o.dirty())
                                    : "cidr" === d.kind
                                      ? ((a = e.data),
                                        !(
                                          (("v4" === (n = d.version) || !n) &&
                                            e$.test(a)) ||
                                          (("v6" === n || !n) && ew.test(a))
                                        ) &&
                                          1 &&
                                          (X((s = this._getOrReturnCtx(e, s)), {
                                            validation: "cidr",
                                            code: J.invalid_string,
                                            message: d.message,
                                          }),
                                          o.dirty()))
                                      : "base64" === d.kind
                                        ? eI.test(e.data) ||
                                          (X((s = this._getOrReturnCtx(e, s)), {
                                            validation: "base64",
                                            code: J.invalid_string,
                                            message: d.message,
                                          }),
                                          o.dirty())
                                        : "base64url" === d.kind
                                          ? ek.test(e.data) ||
                                            (X(
                                              (s = this._getOrReturnCtx(e, s)),
                                              {
                                                validation: "base64url",
                                                code: J.invalid_string,
                                                message: d.message,
                                              },
                                            ),
                                            o.dirty())
                                          : w.assertNever(d);
      return { status: o.value, value: e.data };
    }
    _regex(e, t, r) {
      return this.refinement((t) => e.test(t), {
        validation: t,
        code: J.invalid_string,
        ...k.errToObj(r),
      });
    }
    _addCheck(e) {
      return new eE({ ...this._def, checks: [...this._def.checks, e] });
    }
    email(e) {
      return this._addCheck({ kind: "email", ...k.errToObj(e) });
    }
    url(e) {
      return this._addCheck({ kind: "url", ...k.errToObj(e) });
    }
    emoji(e) {
      return this._addCheck({ kind: "emoji", ...k.errToObj(e) });
    }
    uuid(e) {
      return this._addCheck({ kind: "uuid", ...k.errToObj(e) });
    }
    nanoid(e) {
      return this._addCheck({ kind: "nanoid", ...k.errToObj(e) });
    }
    cuid(e) {
      return this._addCheck({ kind: "cuid", ...k.errToObj(e) });
    }
    cuid2(e) {
      return this._addCheck({ kind: "cuid2", ...k.errToObj(e) });
    }
    ulid(e) {
      return this._addCheck({ kind: "ulid", ...k.errToObj(e) });
    }
    base64(e) {
      return this._addCheck({ kind: "base64", ...k.errToObj(e) });
    }
    base64url(e) {
      return this._addCheck({ kind: "base64url", ...k.errToObj(e) });
    }
    jwt(e) {
      return this._addCheck({ kind: "jwt", ...k.errToObj(e) });
    }
    ip(e) {
      return this._addCheck({ kind: "ip", ...k.errToObj(e) });
    }
    cidr(e) {
      return this._addCheck({ kind: "cidr", ...k.errToObj(e) });
    }
    datetime(e) {
      return "string" == typeof e
        ? this._addCheck({
            kind: "datetime",
            precision: null,
            offset: !1,
            local: !1,
            message: e,
          })
        : this._addCheck({
            kind: "datetime",
            precision: void 0 === e?.precision ? null : e?.precision,
            offset: e?.offset ?? !1,
            local: e?.local ?? !1,
            ...k.errToObj(e?.message),
          });
    }
    date(e) {
      return this._addCheck({ kind: "date", message: e });
    }
    time(e) {
      return "string" == typeof e
        ? this._addCheck({ kind: "time", precision: null, message: e })
        : this._addCheck({
            kind: "time",
            precision: void 0 === e?.precision ? null : e?.precision,
            ...k.errToObj(e?.message),
          });
    }
    duration(e) {
      return this._addCheck({ kind: "duration", ...k.errToObj(e) });
    }
    regex(e, t) {
      return this._addCheck({ kind: "regex", regex: e, ...k.errToObj(t) });
    }
    includes(e, t) {
      return this._addCheck({
        kind: "includes",
        value: e,
        position: t?.position,
        ...k.errToObj(t?.message),
      });
    }
    startsWith(e, t) {
      return this._addCheck({ kind: "startsWith", value: e, ...k.errToObj(t) });
    }
    endsWith(e, t) {
      return this._addCheck({ kind: "endsWith", value: e, ...k.errToObj(t) });
    }
    min(e, t) {
      return this._addCheck({ kind: "min", value: e, ...k.errToObj(t) });
    }
    max(e, t) {
      return this._addCheck({ kind: "max", value: e, ...k.errToObj(t) });
    }
    length(e, t) {
      return this._addCheck({ kind: "length", value: e, ...k.errToObj(t) });
    }
    nonempty(e) {
      return this.min(1, k.errToObj(e));
    }
    trim() {
      return new eE({
        ...this._def,
        checks: [...this._def.checks, { kind: "trim" }],
      });
    }
    toLowerCase() {
      return new eE({
        ...this._def,
        checks: [...this._def.checks, { kind: "toLowerCase" }],
      });
    }
    toUpperCase() {
      return new eE({
        ...this._def,
        checks: [...this._def.checks, { kind: "toUpperCase" }],
      });
    }
    get isDatetime() {
      return !!this._def.checks.find((e) => "datetime" === e.kind);
    }
    get isDate() {
      return !!this._def.checks.find((e) => "date" === e.kind);
    }
    get isTime() {
      return !!this._def.checks.find((e) => "time" === e.kind);
    }
    get isDuration() {
      return !!this._def.checks.find((e) => "duration" === e.kind);
    }
    get isEmail() {
      return !!this._def.checks.find((e) => "email" === e.kind);
    }
    get isURL() {
      return !!this._def.checks.find((e) => "url" === e.kind);
    }
    get isEmoji() {
      return !!this._def.checks.find((e) => "emoji" === e.kind);
    }
    get isUUID() {
      return !!this._def.checks.find((e) => "uuid" === e.kind);
    }
    get isNANOID() {
      return !!this._def.checks.find((e) => "nanoid" === e.kind);
    }
    get isCUID() {
      return !!this._def.checks.find((e) => "cuid" === e.kind);
    }
    get isCUID2() {
      return !!this._def.checks.find((e) => "cuid2" === e.kind);
    }
    get isULID() {
      return !!this._def.checks.find((e) => "ulid" === e.kind);
    }
    get isIP() {
      return !!this._def.checks.find((e) => "ip" === e.kind);
    }
    get isCIDR() {
      return !!this._def.checks.find((e) => "cidr" === e.kind);
    }
    get isBase64() {
      return !!this._def.checks.find((e) => "base64" === e.kind);
    }
    get isBase64url() {
      return !!this._def.checks.find((e) => "base64url" === e.kind);
    }
    get minLength() {
      let e = null;
      for (let t of this._def.checks)
        "min" === t.kind && (null === e || t.value > e) && (e = t.value);
      return e;
    }
    get maxLength() {
      let e = null;
      for (let t of this._def.checks)
        "max" === t.kind && (null === e || t.value < e) && (e = t.value);
      return e;
    }
  }
  eE.create = (e) =>
    new eE({
      checks: [],
      typeName: S.ZodString,
      coerce: e?.coerce ?? !1,
      ...el(e),
    });
  class eA extends ec {
    constructor() {
      (super(...arguments),
        (this.min = this.gte),
        (this.max = this.lte),
        (this.step = this.multipleOf));
    }
    _parse(e) {
      let t;
      if (
        (this._def.coerce && (e.data = Number(e.data)),
        this._getType(e) !== Z.number)
      ) {
        let t = this._getOrReturnCtx(e);
        return (
          X(t, {
            code: J.invalid_type,
            expected: Z.number,
            received: t.parsedType,
          }),
          ee
        );
      }
      let r = new Q();
      for (let i of this._def.checks)
        "int" === i.kind
          ? w.isInteger(e.data) ||
            (X((t = this._getOrReturnCtx(e, t)), {
              code: J.invalid_type,
              expected: "integer",
              received: "float",
              message: i.message,
            }),
            r.dirty())
          : "min" === i.kind
            ? (i.inclusive ? e.data < i.value : e.data <= i.value) &&
              (X((t = this._getOrReturnCtx(e, t)), {
                code: J.too_small,
                minimum: i.value,
                type: "number",
                inclusive: i.inclusive,
                exact: !1,
                message: i.message,
              }),
              r.dirty())
            : "max" === i.kind
              ? (i.inclusive ? e.data > i.value : e.data >= i.value) &&
                (X((t = this._getOrReturnCtx(e, t)), {
                  code: J.too_big,
                  maximum: i.value,
                  type: "number",
                  inclusive: i.inclusive,
                  exact: !1,
                  message: i.message,
                }),
                r.dirty())
              : "multipleOf" === i.kind
                ? 0 !==
                    (function (e, t) {
                      let r = (e.toString().split(".")[1] || "").length,
                        i = (t.toString().split(".")[1] || "").length,
                        a = r > i ? r : i;
                      return (
                        (Number.parseInt(e.toFixed(a).replace(".", "")) %
                          Number.parseInt(t.toFixed(a).replace(".", ""))) /
                        10 ** a
                      );
                    })(e.data, i.value) &&
                  (X((t = this._getOrReturnCtx(e, t)), {
                    code: J.not_multiple_of,
                    multipleOf: i.value,
                    message: i.message,
                  }),
                  r.dirty())
                : "finite" === i.kind
                  ? Number.isFinite(e.data) ||
                    (X((t = this._getOrReturnCtx(e, t)), {
                      code: J.not_finite,
                      message: i.message,
                    }),
                    r.dirty())
                  : w.assertNever(i);
      return { status: r.value, value: e.data };
    }
    gte(e, t) {
      return this.setLimit("min", e, !0, k.toString(t));
    }
    gt(e, t) {
      return this.setLimit("min", e, !1, k.toString(t));
    }
    lte(e, t) {
      return this.setLimit("max", e, !0, k.toString(t));
    }
    lt(e, t) {
      return this.setLimit("max", e, !1, k.toString(t));
    }
    setLimit(e, t, r, i) {
      return new eA({
        ...this._def,
        checks: [
          ...this._def.checks,
          { kind: e, value: t, inclusive: r, message: k.toString(i) },
        ],
      });
    }
    _addCheck(e) {
      return new eA({ ...this._def, checks: [...this._def.checks, e] });
    }
    int(e) {
      return this._addCheck({ kind: "int", message: k.toString(e) });
    }
    positive(e) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !1,
        message: k.toString(e),
      });
    }
    negative(e) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !1,
        message: k.toString(e),
      });
    }
    nonpositive(e) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !0,
        message: k.toString(e),
      });
    }
    nonnegative(e) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !0,
        message: k.toString(e),
      });
    }
    multipleOf(e, t) {
      return this._addCheck({
        kind: "multipleOf",
        value: e,
        message: k.toString(t),
      });
    }
    finite(e) {
      return this._addCheck({ kind: "finite", message: k.toString(e) });
    }
    safe(e) {
      return this._addCheck({
        kind: "min",
        inclusive: !0,
        value: Number.MIN_SAFE_INTEGER,
        message: k.toString(e),
      })._addCheck({
        kind: "max",
        inclusive: !0,
        value: Number.MAX_SAFE_INTEGER,
        message: k.toString(e),
      });
    }
    get minValue() {
      let e = null;
      for (let t of this._def.checks)
        "min" === t.kind && (null === e || t.value > e) && (e = t.value);
      return e;
    }
    get maxValue() {
      let e = null;
      for (let t of this._def.checks)
        "max" === t.kind && (null === e || t.value < e) && (e = t.value);
      return e;
    }
    get isInt() {
      return !!this._def.checks.find(
        (e) =>
          "int" === e.kind || ("multipleOf" === e.kind && w.isInteger(e.value)),
      );
    }
    get isFinite() {
      let e = null,
        t = null;
      for (let r of this._def.checks)
        if ("finite" === r.kind || "int" === r.kind || "multipleOf" === r.kind)
          return !0;
        else
          "min" === r.kind
            ? (null === t || r.value > t) && (t = r.value)
            : "max" === r.kind && (null === e || r.value < e) && (e = r.value);
      return Number.isFinite(t) && Number.isFinite(e);
    }
  }
  eA.create = (e) =>
    new eA({
      checks: [],
      typeName: S.ZodNumber,
      coerce: e?.coerce || !1,
      ...el(e),
    });
  class ex extends ec {
    constructor() {
      (super(...arguments), (this.min = this.gte), (this.max = this.lte));
    }
    _parse(e) {
      let t;
      if (this._def.coerce)
        try {
          e.data = BigInt(e.data);
        } catch {
          return this._getInvalidInput(e);
        }
      if (this._getType(e) !== Z.bigint) return this._getInvalidInput(e);
      let r = new Q();
      for (let i of this._def.checks)
        "min" === i.kind
          ? (i.inclusive ? e.data < i.value : e.data <= i.value) &&
            (X((t = this._getOrReturnCtx(e, t)), {
              code: J.too_small,
              type: "bigint",
              minimum: i.value,
              inclusive: i.inclusive,
              message: i.message,
            }),
            r.dirty())
          : "max" === i.kind
            ? (i.inclusive ? e.data > i.value : e.data >= i.value) &&
              (X((t = this._getOrReturnCtx(e, t)), {
                code: J.too_big,
                type: "bigint",
                maximum: i.value,
                inclusive: i.inclusive,
                message: i.message,
              }),
              r.dirty())
            : "multipleOf" === i.kind
              ? e.data % i.value !== BigInt(0) &&
                (X((t = this._getOrReturnCtx(e, t)), {
                  code: J.not_multiple_of,
                  multipleOf: i.value,
                  message: i.message,
                }),
                r.dirty())
              : w.assertNever(i);
      return { status: r.value, value: e.data };
    }
    _getInvalidInput(e) {
      let t = this._getOrReturnCtx(e);
      return (
        X(t, {
          code: J.invalid_type,
          expected: Z.bigint,
          received: t.parsedType,
        }),
        ee
      );
    }
    gte(e, t) {
      return this.setLimit("min", e, !0, k.toString(t));
    }
    gt(e, t) {
      return this.setLimit("min", e, !1, k.toString(t));
    }
    lte(e, t) {
      return this.setLimit("max", e, !0, k.toString(t));
    }
    lt(e, t) {
      return this.setLimit("max", e, !1, k.toString(t));
    }
    setLimit(e, t, r, i) {
      return new ex({
        ...this._def,
        checks: [
          ...this._def.checks,
          { kind: e, value: t, inclusive: r, message: k.toString(i) },
        ],
      });
    }
    _addCheck(e) {
      return new ex({ ...this._def, checks: [...this._def.checks, e] });
    }
    positive(e) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: !1,
        message: k.toString(e),
      });
    }
    negative(e) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: !1,
        message: k.toString(e),
      });
    }
    nonpositive(e) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: !0,
        message: k.toString(e),
      });
    }
    nonnegative(e) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: !0,
        message: k.toString(e),
      });
    }
    multipleOf(e, t) {
      return this._addCheck({
        kind: "multipleOf",
        value: e,
        message: k.toString(t),
      });
    }
    get minValue() {
      let e = null;
      for (let t of this._def.checks)
        "min" === t.kind && (null === e || t.value > e) && (e = t.value);
      return e;
    }
    get maxValue() {
      let e = null;
      for (let t of this._def.checks)
        "max" === t.kind && (null === e || t.value < e) && (e = t.value);
      return e;
    }
  }
  ex.create = (e) =>
    new ex({
      checks: [],
      typeName: S.ZodBigInt,
      coerce: e?.coerce ?? !1,
      ...el(e),
    });
  class eN extends ec {
    _parse(e) {
      if (
        (this._def.coerce && (e.data = !!e.data),
        this._getType(e) !== Z.boolean)
      ) {
        let t = this._getOrReturnCtx(e);
        return (
          X(t, {
            code: J.invalid_type,
            expected: Z.boolean,
            received: t.parsedType,
          }),
          ee
        );
      }
      return er(e.data);
    }
  }
  eN.create = (e) =>
    new eN({ typeName: S.ZodBoolean, coerce: e?.coerce || !1, ...el(e) });
  class eP extends ec {
    _parse(e) {
      let t;
      if (
        (this._def.coerce && (e.data = new Date(e.data)),
        this._getType(e) !== Z.date)
      ) {
        let t = this._getOrReturnCtx(e);
        return (
          X(t, {
            code: J.invalid_type,
            expected: Z.date,
            received: t.parsedType,
          }),
          ee
        );
      }
      if (Number.isNaN(e.data.getTime()))
        return (X(this._getOrReturnCtx(e), { code: J.invalid_date }), ee);
      let r = new Q();
      for (let i of this._def.checks)
        "min" === i.kind
          ? e.data.getTime() < i.value &&
            (X((t = this._getOrReturnCtx(e, t)), {
              code: J.too_small,
              message: i.message,
              inclusive: !0,
              exact: !1,
              minimum: i.value,
              type: "date",
            }),
            r.dirty())
          : "max" === i.kind
            ? e.data.getTime() > i.value &&
              (X((t = this._getOrReturnCtx(e, t)), {
                code: J.too_big,
                message: i.message,
                inclusive: !0,
                exact: !1,
                maximum: i.value,
                type: "date",
              }),
              r.dirty())
            : w.assertNever(i);
      return { status: r.value, value: new Date(e.data.getTime()) };
    }
    _addCheck(e) {
      return new eP({ ...this._def, checks: [...this._def.checks, e] });
    }
    min(e, t) {
      return this._addCheck({
        kind: "min",
        value: e.getTime(),
        message: k.toString(t),
      });
    }
    max(e, t) {
      return this._addCheck({
        kind: "max",
        value: e.getTime(),
        message: k.toString(t),
      });
    }
    get minDate() {
      let e = null;
      for (let t of this._def.checks)
        "min" === t.kind && (null === e || t.value > e) && (e = t.value);
      return null != e ? new Date(e) : null;
    }
    get maxDate() {
      let e = null;
      for (let t of this._def.checks)
        "max" === t.kind && (null === e || t.value < e) && (e = t.value);
      return null != e ? new Date(e) : null;
    }
  }
  eP.create = (e) =>
    new eP({
      checks: [],
      coerce: e?.coerce || !1,
      typeName: S.ZodDate,
      ...el(e),
    });
  class eO extends ec {
    _parse(e) {
      if (this._getType(e) !== Z.symbol) {
        let t = this._getOrReturnCtx(e);
        return (
          X(t, {
            code: J.invalid_type,
            expected: Z.symbol,
            received: t.parsedType,
          }),
          ee
        );
      }
      return er(e.data);
    }
  }
  eO.create = (e) => new eO({ typeName: S.ZodSymbol, ...el(e) });
  class eR extends ec {
    _parse(e) {
      if (this._getType(e) !== Z.undefined) {
        let t = this._getOrReturnCtx(e);
        return (
          X(t, {
            code: J.invalid_type,
            expected: Z.undefined,
            received: t.parsedType,
          }),
          ee
        );
      }
      return er(e.data);
    }
  }
  eR.create = (e) => new eR({ typeName: S.ZodUndefined, ...el(e) });
  class eU extends ec {
    _parse(e) {
      if (this._getType(e) !== Z.null) {
        let t = this._getOrReturnCtx(e);
        return (
          X(t, {
            code: J.invalid_type,
            expected: Z.null,
            received: t.parsedType,
          }),
          ee
        );
      }
      return er(e.data);
    }
  }
  eU.create = (e) => new eU({ typeName: S.ZodNull, ...el(e) });
  class eM extends ec {
    constructor() {
      (super(...arguments), (this._any = !0));
    }
    _parse(e) {
      return er(e.data);
    }
  }
  eM.create = (e) => new eM({ typeName: S.ZodAny, ...el(e) });
  class eD extends ec {
    constructor() {
      (super(...arguments), (this._unknown = !0));
    }
    _parse(e) {
      return er(e.data);
    }
  }
  eD.create = (e) => new eD({ typeName: S.ZodUnknown, ...el(e) });
  class eL extends ec {
    _parse(e) {
      let t = this._getOrReturnCtx(e);
      return (
        X(t, {
          code: J.invalid_type,
          expected: Z.never,
          received: t.parsedType,
        }),
        ee
      );
    }
  }
  eL.create = (e) => new eL({ typeName: S.ZodNever, ...el(e) });
  class eF extends ec {
    _parse(e) {
      if (this._getType(e) !== Z.undefined) {
        let t = this._getOrReturnCtx(e);
        return (
          X(t, {
            code: J.invalid_type,
            expected: Z.void,
            received: t.parsedType,
          }),
          ee
        );
      }
      return er(e.data);
    }
  }
  eF.create = (e) => new eF({ typeName: S.ZodVoid, ...el(e) });
  class ej extends ec {
    _parse(e) {
      let { ctx: t, status: r } = this._processInputParams(e),
        i = this._def;
      if (t.parsedType !== Z.array)
        return (
          X(t, {
            code: J.invalid_type,
            expected: Z.array,
            received: t.parsedType,
          }),
          ee
        );
      if (null !== i.exactLength) {
        let e = t.data.length > i.exactLength.value,
          a = t.data.length < i.exactLength.value;
        (e || a) &&
          (X(t, {
            code: e ? J.too_big : J.too_small,
            minimum: a ? i.exactLength.value : void 0,
            maximum: e ? i.exactLength.value : void 0,
            type: "array",
            inclusive: !0,
            exact: !0,
            message: i.exactLength.message,
          }),
          r.dirty());
      }
      if (
        (null !== i.minLength &&
          t.data.length < i.minLength.value &&
          (X(t, {
            code: J.too_small,
            minimum: i.minLength.value,
            type: "array",
            inclusive: !0,
            exact: !1,
            message: i.minLength.message,
          }),
          r.dirty()),
        null !== i.maxLength &&
          t.data.length > i.maxLength.value &&
          (X(t, {
            code: J.too_big,
            maximum: i.maxLength.value,
            type: "array",
            inclusive: !0,
            exact: !1,
            message: i.maxLength.message,
          }),
          r.dirty()),
        t.common.async)
      )
        return Promise.all(
          [...t.data].map((e, r) =>
            i.type._parseAsync(new eo(t, e, t.path, r)),
          ),
        ).then((e) => Q.mergeArray(r, e));
      let a = [...t.data].map((e, r) =>
        i.type._parseSync(new eo(t, e, t.path, r)),
      );
      return Q.mergeArray(r, a);
    }
    get element() {
      return this._def.type;
    }
    min(e, t) {
      return new ej({
        ...this._def,
        minLength: { value: e, message: k.toString(t) },
      });
    }
    max(e, t) {
      return new ej({
        ...this._def,
        maxLength: { value: e, message: k.toString(t) },
      });
    }
    length(e, t) {
      return new ej({
        ...this._def,
        exactLength: { value: e, message: k.toString(t) },
      });
    }
    nonempty(e) {
      return this.min(1, e);
    }
  }
  ej.create = (e, t) =>
    new ej({
      type: e,
      minLength: null,
      maxLength: null,
      exactLength: null,
      typeName: S.ZodArray,
      ...el(t),
    });
  class eW extends ec {
    constructor() {
      (super(...arguments),
        (this._cached = null),
        (this.nonstrict = this.passthrough),
        (this.augment = this.extend));
    }
    _getCached() {
      if (null !== this._cached) return this._cached;
      let e = this._def.shape(),
        t = w.objectKeys(e);
      return ((this._cached = { shape: e, keys: t }), this._cached);
    }
    _parse(e) {
      if (this._getType(e) !== Z.object) {
        let t = this._getOrReturnCtx(e);
        return (
          X(t, {
            code: J.invalid_type,
            expected: Z.object,
            received: t.parsedType,
          }),
          ee
        );
      }
      let { status: t, ctx: r } = this._processInputParams(e),
        { shape: i, keys: a } = this._getCached(),
        n = [];
      if (
        !(this._def.catchall instanceof eL && "strip" === this._def.unknownKeys)
      )
        for (let e in r.data) a.includes(e) || n.push(e);
      let s = [];
      for (let e of a) {
        let t = i[e],
          a = r.data[e];
        s.push({
          key: { status: "valid", value: e },
          value: t._parse(new eo(r, a, r.path, e)),
          alwaysSet: e in r.data,
        });
      }
      if (this._def.catchall instanceof eL) {
        let e = this._def.unknownKeys;
        if ("passthrough" === e)
          for (let e of n)
            s.push({
              key: { status: "valid", value: e },
              value: { status: "valid", value: r.data[e] },
            });
        else if ("strict" === e)
          n.length > 0 &&
            (X(r, { code: J.unrecognized_keys, keys: n }), t.dirty());
        else if ("strip" === e);
        else
          throw Error("Internal ZodObject error: invalid unknownKeys value.");
      } else {
        let e = this._def.catchall;
        for (let t of n) {
          let i = r.data[t];
          s.push({
            key: { status: "valid", value: t },
            value: e._parse(new eo(r, i, r.path, t)),
            alwaysSet: t in r.data,
          });
        }
      }
      return r.common.async
        ? Promise.resolve()
            .then(async () => {
              let e = [];
              for (let t of s) {
                let r = await t.key,
                  i = await t.value;
                e.push({ key: r, value: i, alwaysSet: t.alwaysSet });
              }
              return e;
            })
            .then((e) => Q.mergeObjectSync(t, e))
        : Q.mergeObjectSync(t, s);
    }
    get shape() {
      return this._def.shape();
    }
    strict(e) {
      return (
        k.errToObj,
        new eW({
          ...this._def,
          unknownKeys: "strict",
          ...(void 0 !== e
            ? {
                errorMap: (t, r) => {
                  let i = this._def.errorMap?.(t, r).message ?? r.defaultError;
                  return "unrecognized_keys" === t.code
                    ? { message: k.errToObj(e).message ?? i }
                    : { message: i };
                },
              }
            : {}),
        })
      );
    }
    strip() {
      return new eW({ ...this._def, unknownKeys: "strip" });
    }
    passthrough() {
      return new eW({ ...this._def, unknownKeys: "passthrough" });
    }
    extend(e) {
      return new eW({
        ...this._def,
        shape: () => ({ ...this._def.shape(), ...e }),
      });
    }
    merge(e) {
      return new eW({
        unknownKeys: e._def.unknownKeys,
        catchall: e._def.catchall,
        shape: () => ({ ...this._def.shape(), ...e._def.shape() }),
        typeName: S.ZodObject,
      });
    }
    setKey(e, t) {
      return this.augment({ [e]: t });
    }
    catchall(e) {
      return new eW({ ...this._def, catchall: e });
    }
    pick(e) {
      let t = {};
      for (let r of w.objectKeys(e))
        e[r] && this.shape[r] && (t[r] = this.shape[r]);
      return new eW({ ...this._def, shape: () => t });
    }
    omit(e) {
      let t = {};
      for (let r of w.objectKeys(this.shape)) e[r] || (t[r] = this.shape[r]);
      return new eW({ ...this._def, shape: () => t });
    }
    deepPartial() {
      return (function e(t) {
        if (t instanceof eW) {
          let r = {};
          for (let i in t.shape) {
            let a = t.shape[i];
            r[i] = e1.create(e(a));
          }
          return new eW({ ...t._def, shape: () => r });
        }
        if (t instanceof ej) return new ej({ ...t._def, type: e(t.element) });
        if (t instanceof e1) return e1.create(e(t.unwrap()));
        if (t instanceof e2) return e2.create(e(t.unwrap()));
        if (t instanceof eq) return eq.create(t.items.map((t) => e(t)));
        else return t;
      })(this);
    }
    partial(e) {
      let t = {};
      for (let r of w.objectKeys(this.shape)) {
        let i = this.shape[r];
        e && !e[r] ? (t[r] = i) : (t[r] = i.optional());
      }
      return new eW({ ...this._def, shape: () => t });
    }
    required(e) {
      let t = {};
      for (let r of w.objectKeys(this.shape))
        if (e && !e[r]) t[r] = this.shape[r];
        else {
          let e = this.shape[r];
          for (; e instanceof e1; ) e = e._def.innerType;
          t[r] = e;
        }
      return new eW({ ...this._def, shape: () => t });
    }
    keyof() {
      return ez(w.objectKeys(this.shape));
    }
  }
  ((eW.create = (e, t) =>
    new eW({
      shape: () => e,
      unknownKeys: "strip",
      catchall: eL.create(),
      typeName: S.ZodObject,
      ...el(t),
    })),
    (eW.strictCreate = (e, t) =>
      new eW({
        shape: () => e,
        unknownKeys: "strict",
        catchall: eL.create(),
        typeName: S.ZodObject,
        ...el(t),
      })),
    (eW.lazycreate = (e, t) =>
      new eW({
        shape: e,
        unknownKeys: "strip",
        catchall: eL.create(),
        typeName: S.ZodObject,
        ...el(t),
      })));
  class eG extends ec {
    _parse(e) {
      let { ctx: t } = this._processInputParams(e),
        r = this._def.options;
      if (t.common.async)
        return Promise.all(
          r.map(async (e) => {
            let r = { ...t, common: { ...t.common, issues: [] }, parent: null };
            return {
              result: await e._parseAsync({
                data: t.data,
                path: t.path,
                parent: r,
              }),
              ctx: r,
            };
          }),
        ).then(function (e) {
          for (let t of e) if ("valid" === t.result.status) return t.result;
          for (let r of e)
            if ("dirty" === r.result.status)
              return (t.common.issues.push(...r.ctx.common.issues), r.result);
          let r = e.map((e) => new H(e.ctx.common.issues));
          return (X(t, { code: J.invalid_union, unionErrors: r }), ee);
        });
      {
        let e,
          i = [];
        for (let a of r) {
          let r = { ...t, common: { ...t.common, issues: [] }, parent: null },
            n = a._parseSync({ data: t.data, path: t.path, parent: r });
          if ("valid" === n.status) return n;
          ("dirty" !== n.status || e || (e = { result: n, ctx: r }),
            r.common.issues.length && i.push(r.common.issues));
        }
        if (e) return (t.common.issues.push(...e.ctx.common.issues), e.result);
        let a = i.map((e) => new H(e));
        return (X(t, { code: J.invalid_union, unionErrors: a }), ee);
      }
    }
    get options() {
      return this._def.options;
    }
  }
  eG.create = (e, t) => new eG({ options: e, typeName: S.ZodUnion, ...el(t) });
  let eB = (e) => {
    if (e instanceof eJ) return eB(e.schema);
    if (e instanceof e0) return eB(e.innerType());
    if (e instanceof eH) return [e.value];
    if (e instanceof eY) return e.options;
    if (e instanceof eX) return w.objectValues(e.enum);
    else if (e instanceof e3) return eB(e._def.innerType);
    else if (e instanceof eR) return [void 0];
    else if (e instanceof eU) return [null];
    else if (e instanceof e1) return [void 0, ...eB(e.unwrap())];
    else if (e instanceof e2) return [null, ...eB(e.unwrap())];
    else if (e instanceof e5) return eB(e.unwrap());
    else if (e instanceof e6) return eB(e.unwrap());
    else if (e instanceof e4) return eB(e._def.innerType);
    else return [];
  };
  class eV extends ec {
    _parse(e) {
      let { status: t, ctx: r } = this._processInputParams(e),
        i = (e, i) => {
          if (ei(e) || ei(i)) return ee;
          let a = (function e(t, r) {
            let i = K(t),
              a = K(r);
            if (t === r) return { valid: !0, data: t };
            if (i === Z.object && a === Z.object) {
              let i = w.objectKeys(r),
                a = w.objectKeys(t).filter((e) => -1 !== i.indexOf(e)),
                n = { ...t, ...r };
              for (let i of a) {
                let a = e(t[i], r[i]);
                if (!a.valid) return { valid: !1 };
                n[i] = a.data;
              }
              return { valid: !0, data: n };
            }
            if (i === Z.array && a === Z.array) {
              if (t.length !== r.length) return { valid: !1 };
              let i = [];
              for (let a = 0; a < t.length; a++) {
                let n = e(t[a], r[a]);
                if (!n.valid) return { valid: !1 };
                i.push(n.data);
              }
              return { valid: !0, data: i };
            }
            if (i === Z.date && a === Z.date && +t == +r)
              return { valid: !0, data: t };
            return { valid: !1 };
          })(e.value, i.value);
          return a.valid
            ? ((ea(e) || ea(i)) && t.dirty(),
              { status: t.value, value: a.data })
            : (X(r, { code: J.invalid_intersection_types }), ee);
        };
      return r.common.async
        ? Promise.all([
            this._def.left._parseAsync({
              data: r.data,
              path: r.path,
              parent: r,
            }),
            this._def.right._parseAsync({
              data: r.data,
              path: r.path,
              parent: r,
            }),
          ]).then(([e, t]) => i(e, t))
        : i(
            this._def.left._parseSync({
              data: r.data,
              path: r.path,
              parent: r,
            }),
            this._def.right._parseSync({
              data: r.data,
              path: r.path,
              parent: r,
            }),
          );
    }
  }
  eV.create = (e, t, r) =>
    new eV({ left: e, right: t, typeName: S.ZodIntersection, ...el(r) });
  class eq extends ec {
    _parse(e) {
      let { status: t, ctx: r } = this._processInputParams(e);
      if (r.parsedType !== Z.array)
        return (
          X(r, {
            code: J.invalid_type,
            expected: Z.array,
            received: r.parsedType,
          }),
          ee
        );
      if (r.data.length < this._def.items.length)
        return (
          X(r, {
            code: J.too_small,
            minimum: this._def.items.length,
            inclusive: !0,
            exact: !1,
            type: "array",
          }),
          ee
        );
      !this._def.rest &&
        r.data.length > this._def.items.length &&
        (X(r, {
          code: J.too_big,
          maximum: this._def.items.length,
          inclusive: !0,
          exact: !1,
          type: "array",
        }),
        t.dirty());
      let i = [...r.data]
        .map((e, t) => {
          let i = this._def.items[t] || this._def.rest;
          return i ? i._parse(new eo(r, e, r.path, t)) : null;
        })
        .filter((e) => !!e);
      return r.common.async
        ? Promise.all(i).then((e) => Q.mergeArray(t, e))
        : Q.mergeArray(t, i);
    }
    get items() {
      return this._def.items;
    }
    rest(e) {
      return new eq({ ...this._def, rest: e });
    }
  }
  eq.create = (e, t) => {
    if (!Array.isArray(e))
      throw Error("You must pass an array of schemas to z.tuple([ ... ])");
    return new eq({ items: e, typeName: S.ZodTuple, rest: null, ...el(t) });
  };
  class eZ extends ec {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(e) {
      let { status: t, ctx: r } = this._processInputParams(e);
      if (r.parsedType !== Z.map)
        return (
          X(r, {
            code: J.invalid_type,
            expected: Z.map,
            received: r.parsedType,
          }),
          ee
        );
      let i = this._def.keyType,
        a = this._def.valueType,
        n = [...r.data.entries()].map(([e, t], n) => ({
          key: i._parse(new eo(r, e, r.path, [n, "key"])),
          value: a._parse(new eo(r, t, r.path, [n, "value"])),
        }));
      if (r.common.async) {
        let e = new Map();
        return Promise.resolve().then(async () => {
          for (let r of n) {
            let i = await r.key,
              a = await r.value;
            if ("aborted" === i.status || "aborted" === a.status) return ee;
            (("dirty" === i.status || "dirty" === a.status) && t.dirty(),
              e.set(i.value, a.value));
          }
          return { status: t.value, value: e };
        });
      }
      {
        let e = new Map();
        for (let r of n) {
          let i = r.key,
            a = r.value;
          if ("aborted" === i.status || "aborted" === a.status) return ee;
          (("dirty" === i.status || "dirty" === a.status) && t.dirty(),
            e.set(i.value, a.value));
        }
        return { status: t.value, value: e };
      }
    }
  }
  eZ.create = (e, t, r) =>
    new eZ({ valueType: t, keyType: e, typeName: S.ZodMap, ...el(r) });
  class eK extends ec {
    _parse(e) {
      let { status: t, ctx: r } = this._processInputParams(e);
      if (r.parsedType !== Z.set)
        return (
          X(r, {
            code: J.invalid_type,
            expected: Z.set,
            received: r.parsedType,
          }),
          ee
        );
      let i = this._def;
      (null !== i.minSize &&
        r.data.size < i.minSize.value &&
        (X(r, {
          code: J.too_small,
          minimum: i.minSize.value,
          type: "set",
          inclusive: !0,
          exact: !1,
          message: i.minSize.message,
        }),
        t.dirty()),
        null !== i.maxSize &&
          r.data.size > i.maxSize.value &&
          (X(r, {
            code: J.too_big,
            maximum: i.maxSize.value,
            type: "set",
            inclusive: !0,
            exact: !1,
            message: i.maxSize.message,
          }),
          t.dirty()));
      let a = this._def.valueType;
      function n(e) {
        let r = new Set();
        for (let i of e) {
          if ("aborted" === i.status) return ee;
          ("dirty" === i.status && t.dirty(), r.add(i.value));
        }
        return { status: t.value, value: r };
      }
      let s = [...r.data.values()].map((e, t) =>
        a._parse(new eo(r, e, r.path, t)),
      );
      return r.common.async ? Promise.all(s).then((e) => n(e)) : n(s);
    }
    min(e, t) {
      return new eK({
        ...this._def,
        minSize: { value: e, message: k.toString(t) },
      });
    }
    max(e, t) {
      return new eK({
        ...this._def,
        maxSize: { value: e, message: k.toString(t) },
      });
    }
    size(e, t) {
      return this.min(e, t).max(e, t);
    }
    nonempty(e) {
      return this.min(1, e);
    }
  }
  eK.create = (e, t) =>
    new eK({
      valueType: e,
      minSize: null,
      maxSize: null,
      typeName: S.ZodSet,
      ...el(t),
    });
  class eJ extends ec {
    get schema() {
      return this._def.getter();
    }
    _parse(e) {
      let { ctx: t } = this._processInputParams(e);
      return this._def
        .getter()
        ._parse({ data: t.data, path: t.path, parent: t });
    }
  }
  eJ.create = (e, t) => new eJ({ getter: e, typeName: S.ZodLazy, ...el(t) });
  class eH extends ec {
    _parse(e) {
      if (e.data !== this._def.value) {
        let t = this._getOrReturnCtx(e);
        return (
          X(t, {
            received: t.data,
            code: J.invalid_literal,
            expected: this._def.value,
          }),
          ee
        );
      }
      return { status: "valid", value: e.data };
    }
    get value() {
      return this._def.value;
    }
  }
  function ez(e, t) {
    return new eY({ values: e, typeName: S.ZodEnum, ...el(t) });
  }
  eH.create = (e, t) => new eH({ value: e, typeName: S.ZodLiteral, ...el(t) });
  class eY extends ec {
    _parse(e) {
      if ("string" != typeof e.data) {
        let t = this._getOrReturnCtx(e),
          r = this._def.values;
        return (
          X(t, {
            expected: w.joinValues(r),
            received: t.parsedType,
            code: J.invalid_type,
          }),
          ee
        );
      }
      if (
        (this._cache || (this._cache = new Set(this._def.values)),
        !this._cache.has(e.data))
      ) {
        let t = this._getOrReturnCtx(e),
          r = this._def.values;
        return (
          X(t, { received: t.data, code: J.invalid_enum_value, options: r }),
          ee
        );
      }
      return er(e.data);
    }
    get options() {
      return this._def.values;
    }
    get enum() {
      let e = {};
      for (let t of this._def.values) e[t] = t;
      return e;
    }
    get Values() {
      let e = {};
      for (let t of this._def.values) e[t] = t;
      return e;
    }
    get Enum() {
      let e = {};
      for (let t of this._def.values) e[t] = t;
      return e;
    }
    extract(e, t = this._def) {
      return eY.create(e, { ...this._def, ...t });
    }
    exclude(e, t = this._def) {
      return eY.create(
        this.options.filter((t) => !e.includes(t)),
        { ...this._def, ...t },
      );
    }
  }
  eY.create = ez;
  class eX extends ec {
    _parse(e) {
      let t = w.getValidEnumValues(this._def.values),
        r = this._getOrReturnCtx(e);
      if (r.parsedType !== Z.string && r.parsedType !== Z.number) {
        let e = w.objectValues(t);
        return (
          X(r, {
            expected: w.joinValues(e),
            received: r.parsedType,
            code: J.invalid_type,
          }),
          ee
        );
      }
      if (
        (this._cache ||
          (this._cache = new Set(w.getValidEnumValues(this._def.values))),
        !this._cache.has(e.data))
      ) {
        let e = w.objectValues(t);
        return (
          X(r, { received: r.data, code: J.invalid_enum_value, options: e }),
          ee
        );
      }
      return er(e.data);
    }
    get enum() {
      return this._def.values;
    }
  }
  eX.create = (e, t) =>
    new eX({ values: e, typeName: S.ZodNativeEnum, ...el(t) });
  class eQ extends ec {
    unwrap() {
      return this._def.type;
    }
    _parse(e) {
      let { ctx: t } = this._processInputParams(e);
      return t.parsedType !== Z.promise && !1 === t.common.async
        ? (X(t, {
            code: J.invalid_type,
            expected: Z.promise,
            received: t.parsedType,
          }),
          ee)
        : er(
            (t.parsedType === Z.promise
              ? t.data
              : Promise.resolve(t.data)
            ).then((e) =>
              this._def.type.parseAsync(e, {
                path: t.path,
                errorMap: t.common.contextualErrorMap,
              }),
            ),
          );
    }
  }
  eQ.create = (e, t) => new eQ({ type: e, typeName: S.ZodPromise, ...el(t) });
  class e0 extends ec {
    innerType() {
      return this._def.schema;
    }
    sourceType() {
      return this._def.schema._def.typeName === S.ZodEffects
        ? this._def.schema.sourceType()
        : this._def.schema;
    }
    _parse(e) {
      let { status: t, ctx: r } = this._processInputParams(e),
        i = this._def.effect || null,
        a = {
          addIssue: (e) => {
            (X(r, e), e.fatal ? t.abort() : t.dirty());
          },
          get path() {
            return r.path;
          },
        };
      if (((a.addIssue = a.addIssue.bind(a)), "preprocess" === i.type)) {
        let e = i.transform(r.data, a);
        if (r.common.async)
          return Promise.resolve(e).then(async (e) => {
            if ("aborted" === t.value) return ee;
            let i = await this._def.schema._parseAsync({
              data: e,
              path: r.path,
              parent: r,
            });
            return "aborted" === i.status
              ? ee
              : "dirty" === i.status || "dirty" === t.value
                ? et(i.value)
                : i;
          });
        {
          if ("aborted" === t.value) return ee;
          let i = this._def.schema._parseSync({
            data: e,
            path: r.path,
            parent: r,
          });
          return "aborted" === i.status
            ? ee
            : "dirty" === i.status || "dirty" === t.value
              ? et(i.value)
              : i;
        }
      }
      if ("refinement" === i.type) {
        let e = (e) => {
          let t = i.refinement(e, a);
          if (r.common.async) return Promise.resolve(t);
          if (t instanceof Promise)
            throw Error(
              "Async refinement encountered during synchronous parse operation. Use .parseAsync instead.",
            );
          return e;
        };
        if (!1 !== r.common.async)
          return this._def.schema
            ._parseAsync({ data: r.data, path: r.path, parent: r })
            .then((r) =>
              "aborted" === r.status
                ? ee
                : ("dirty" === r.status && t.dirty(),
                  e(r.value).then(() => ({ status: t.value, value: r.value }))),
            );
        {
          let i = this._def.schema._parseSync({
            data: r.data,
            path: r.path,
            parent: r,
          });
          return "aborted" === i.status
            ? ee
            : ("dirty" === i.status && t.dirty(),
              e(i.value),
              { status: t.value, value: i.value });
        }
      }
      if ("transform" === i.type)
        if (!1 !== r.common.async)
          return this._def.schema
            ._parseAsync({ data: r.data, path: r.path, parent: r })
            .then((e) =>
              en(e)
                ? Promise.resolve(i.transform(e.value, a)).then((e) => ({
                    status: t.value,
                    value: e,
                  }))
                : ee,
            );
        else {
          let e = this._def.schema._parseSync({
            data: r.data,
            path: r.path,
            parent: r,
          });
          if (!en(e)) return ee;
          let n = i.transform(e.value, a);
          if (n instanceof Promise)
            throw Error(
              "Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.",
            );
          return { status: t.value, value: n };
        }
      w.assertNever(i);
    }
  }
  ((e0.create = (e, t, r) =>
    new e0({ schema: e, typeName: S.ZodEffects, effect: t, ...el(r) })),
    (e0.createWithPreprocess = (e, t, r) =>
      new e0({
        schema: t,
        effect: { type: "preprocess", transform: e },
        typeName: S.ZodEffects,
        ...el(r),
      })));
  class e1 extends ec {
    _parse(e) {
      return this._getType(e) === Z.undefined
        ? er(void 0)
        : this._def.innerType._parse(e);
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  e1.create = (e, t) =>
    new e1({ innerType: e, typeName: S.ZodOptional, ...el(t) });
  class e2 extends ec {
    _parse(e) {
      return this._getType(e) === Z.null
        ? er(null)
        : this._def.innerType._parse(e);
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  e2.create = (e, t) =>
    new e2({ innerType: e, typeName: S.ZodNullable, ...el(t) });
  class e3 extends ec {
    _parse(e) {
      let { ctx: t } = this._processInputParams(e),
        r = t.data;
      return (
        t.parsedType === Z.undefined && (r = this._def.defaultValue()),
        this._def.innerType._parse({ data: r, path: t.path, parent: t })
      );
    }
    removeDefault() {
      return this._def.innerType;
    }
  }
  e3.create = (e, t) =>
    new e3({
      innerType: e,
      typeName: S.ZodDefault,
      defaultValue:
        "function" == typeof t.default ? t.default : () => t.default,
      ...el(t),
    });
  class e4 extends ec {
    _parse(e) {
      let { ctx: t } = this._processInputParams(e),
        r = { ...t, common: { ...t.common, issues: [] } },
        i = this._def.innerType._parse({
          data: r.data,
          path: r.path,
          parent: { ...r },
        });
      return es(i)
        ? i.then((e) => ({
            status: "valid",
            value:
              "valid" === e.status
                ? e.value
                : this._def.catchValue({
                    get error() {
                      return new H(r.common.issues);
                    },
                    input: r.data,
                  }),
          }))
        : {
            status: "valid",
            value:
              "valid" === i.status
                ? i.value
                : this._def.catchValue({
                    get error() {
                      return new H(r.common.issues);
                    },
                    input: r.data,
                  }),
          };
    }
    removeCatch() {
      return this._def.innerType;
    }
  }
  e4.create = (e, t) =>
    new e4({
      innerType: e,
      typeName: S.ZodCatch,
      catchValue: "function" == typeof t.catch ? t.catch : () => t.catch,
      ...el(t),
    });
  class e9 extends ec {
    _parse(e) {
      if (this._getType(e) !== Z.nan) {
        let t = this._getOrReturnCtx(e);
        return (
          X(t, {
            code: J.invalid_type,
            expected: Z.nan,
            received: t.parsedType,
          }),
          ee
        );
      }
      return { status: "valid", value: e.data };
    }
  }
  ((e9.create = (e) => new e9({ typeName: S.ZodNaN, ...el(e) })),
    Symbol("zod_brand"));
  class e5 extends ec {
    _parse(e) {
      let { ctx: t } = this._processInputParams(e),
        r = t.data;
      return this._def.type._parse({ data: r, path: t.path, parent: t });
    }
    unwrap() {
      return this._def.type;
    }
  }
  class e8 extends ec {
    _parse(e) {
      let { status: t, ctx: r } = this._processInputParams(e);
      if (r.common.async)
        return (async () => {
          let e = await this._def.in._parseAsync({
            data: r.data,
            path: r.path,
            parent: r,
          });
          return "aborted" === e.status
            ? ee
            : "dirty" === e.status
              ? (t.dirty(), et(e.value))
              : this._def.out._parseAsync({
                  data: e.value,
                  path: r.path,
                  parent: r,
                });
        })();
      {
        let e = this._def.in._parseSync({
          data: r.data,
          path: r.path,
          parent: r,
        });
        return "aborted" === e.status
          ? ee
          : "dirty" === e.status
            ? (t.dirty(), { status: "dirty", value: e.value })
            : this._def.out._parseSync({
                data: e.value,
                path: r.path,
                parent: r,
              });
      }
    }
    static create(e, t) {
      return new e8({ in: e, out: t, typeName: S.ZodPipeline });
    }
  }
  class e6 extends ec {
    _parse(e) {
      let t = this._def.innerType._parse(e),
        r = (e) => (en(e) && (e.value = Object.freeze(e.value)), e);
      return es(t) ? t.then((e) => r(e)) : r(t);
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  ((e6.create = (e, t) =>
    new e6({ innerType: e, typeName: S.ZodReadonly, ...el(t) })),
    eW.lazycreate,
    ((a = S || (S = {})).ZodString = "ZodString"),
    (a.ZodNumber = "ZodNumber"),
    (a.ZodNaN = "ZodNaN"),
    (a.ZodBigInt = "ZodBigInt"),
    (a.ZodBoolean = "ZodBoolean"),
    (a.ZodDate = "ZodDate"),
    (a.ZodSymbol = "ZodSymbol"),
    (a.ZodUndefined = "ZodUndefined"),
    (a.ZodNull = "ZodNull"),
    (a.ZodAny = "ZodAny"),
    (a.ZodUnknown = "ZodUnknown"),
    (a.ZodNever = "ZodNever"),
    (a.ZodVoid = "ZodVoid"),
    (a.ZodArray = "ZodArray"),
    (a.ZodObject = "ZodObject"),
    (a.ZodUnion = "ZodUnion"),
    (a.ZodDiscriminatedUnion = "ZodDiscriminatedUnion"),
    (a.ZodIntersection = "ZodIntersection"),
    (a.ZodTuple = "ZodTuple"),
    (a.ZodRecord = "ZodRecord"),
    (a.ZodMap = "ZodMap"),
    (a.ZodSet = "ZodSet"),
    (a.ZodFunction = "ZodFunction"),
    (a.ZodLazy = "ZodLazy"),
    (a.ZodLiteral = "ZodLiteral"),
    (a.ZodEnum = "ZodEnum"),
    (a.ZodEffects = "ZodEffects"),
    (a.ZodNativeEnum = "ZodNativeEnum"),
    (a.ZodOptional = "ZodOptional"),
    (a.ZodNullable = "ZodNullable"),
    (a.ZodDefault = "ZodDefault"),
    (a.ZodCatch = "ZodCatch"),
    (a.ZodPromise = "ZodPromise"),
    (a.ZodBranded = "ZodBranded"),
    (a.ZodPipeline = "ZodPipeline"),
    (a.ZodReadonly = "ZodReadonly"));
  let e7 = eE.create,
    te = eA.create;
  (e9.create, ex.create);
  let tt = eN.create,
    tr = eP.create;
  (eO.create, eR.create, eU.create);
  let ti = eM.create;
  (eD.create, eL.create, eF.create);
  let ta = ej.create,
    tn = eW.create;
  eW.strictCreate;
  let ts = eG.create,
    to = class e extends ec {
      _parse(e) {
        let { ctx: t } = this._processInputParams(e);
        if (t.parsedType !== Z.object)
          return (
            X(t, {
              code: J.invalid_type,
              expected: Z.object,
              received: t.parsedType,
            }),
            ee
          );
        let r = this.discriminator,
          i = t.data[r],
          a = this.optionsMap.get(i);
        return a
          ? t.common.async
            ? a._parseAsync({ data: t.data, path: t.path, parent: t })
            : a._parseSync({ data: t.data, path: t.path, parent: t })
          : (X(t, {
              code: J.invalid_union_discriminator,
              options: Array.from(this.optionsMap.keys()),
              path: [r],
            }),
            ee);
      }
      get discriminator() {
        return this._def.discriminator;
      }
      get options() {
        return this._def.options;
      }
      get optionsMap() {
        return this._def.optionsMap;
      }
      static create(t, r, i) {
        let a = new Map();
        for (let e of r) {
          let r = eB(e.shape[t]);
          if (!r.length)
            throw Error(
              `A discriminator value for key \`${t}\` could not be extracted from all schema options`,
            );
          for (let i of r) {
            if (a.has(i))
              throw Error(
                `Discriminator property ${String(t)} has duplicate value ${String(i)}`,
              );
            a.set(i, e);
          }
        }
        return new e({
          typeName: S.ZodDiscriminatedUnion,
          discriminator: t,
          options: r,
          optionsMap: a,
          ...el(i),
        });
      }
    }.create;
  (eV.create, eq.create);
  let td = class e extends ec {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(e) {
      let { status: t, ctx: r } = this._processInputParams(e);
      if (r.parsedType !== Z.object)
        return (
          X(r, {
            code: J.invalid_type,
            expected: Z.object,
            received: r.parsedType,
          }),
          ee
        );
      let i = [],
        a = this._def.keyType,
        n = this._def.valueType;
      for (let e in r.data)
        i.push({
          key: a._parse(new eo(r, e, r.path, e)),
          value: n._parse(new eo(r, r.data[e], r.path, e)),
          alwaysSet: e in r.data,
        });
      return r.common.async
        ? Q.mergeObjectAsync(t, i)
        : Q.mergeObjectSync(t, i);
    }
    get element() {
      return this._def.valueType;
    }
    static create(t, r, i) {
      return new e(
        r instanceof ec
          ? { keyType: t, valueType: r, typeName: S.ZodRecord, ...el(i) }
          : {
              keyType: eE.create(),
              valueType: t,
              typeName: S.ZodRecord,
              ...el(r),
            },
      );
    }
  }.create;
  (eZ.create, eK.create, eJ.create);
  let tl = eH.create,
    tc = eY.create,
    tu = eX.create;
  (eQ.create,
    e0.create,
    e1.create,
    e2.create,
    e0.createWithPreprocess,
    e8.create);
  let th = {
    string: (e) => eE.create({ ...e, coerce: !0 }),
    number: (e) => eA.create({ ...e, coerce: !0 }),
    boolean: (e) => eN.create({ ...e, coerce: !0 }),
    bigint: (e) => ex.create({ ...e, coerce: !0 }),
    date: (e) => eP.create({ ...e, coerce: !0 }),
  };
  (e.s(
    [
      "any",
      0,
      ti,
      "array",
      0,
      ta,
      "boolean",
      0,
      tt,
      "coerce",
      0,
      th,
      "date",
      0,
      tr,
      "discriminatedUnion",
      0,
      to,
      "enum",
      0,
      tc,
      "literal",
      0,
      tl,
      "nativeEnum",
      0,
      tu,
      "number",
      0,
      te,
      "object",
      0,
      tn,
      "record",
      0,
      td,
      "string",
      0,
      e7,
      "union",
      0,
      ts,
    ],
    480,
  ),
    e.i(480),
    e.i(559413),
    e.s(
      [
        "any",
        0,
        ti,
        "array",
        0,
        ta,
        "boolean",
        0,
        tt,
        "coerce",
        0,
        th,
        "date",
        0,
        tr,
        "discriminatedUnion",
        0,
        to,
        "enum",
        0,
        tc,
        "literal",
        0,
        tl,
        "nativeEnum",
        0,
        tu,
        "number",
        0,
        te,
        "object",
        0,
        tn,
        "record",
        0,
        td,
        "string",
        0,
        e7,
        "union",
        0,
        ts,
      ],
      966951,
    ));
  var tp = e.i(966951);
  e.s(["z", 0, tp], 20403);
  var tp = tp,
    tf = tp;
  e.s(["z", 0, tf], 395458);
  var tf = tp,
    ty = tp;
  let tm =
    (((n = {}).OAUTH_ACCOUNT_SUSPENDED = "oauth_account_suspended"),
    (n.MISSING_OR_INVALID_PRIVY_APP_ID = "missing_or_invalid_privy_app_id"),
    (n.MISSING_OR_INVALID_PRIVY_CLIENT_ID =
      "missing_or_invalid_privy_client_id"),
    (n.MISSING_OR_INVALID_PRIVY_ACCOUNT_ID =
      "missing_or_invalid_privy_account_id"),
    (n.MISSING_OR_INVALID_TOKEN = "missing_or_invalid_token"),
    (n.MISSING_MFA_ENROLLMENT = "missing_mfa_enrollment"),
    (n.MISSING_OR_INVALID_MFA = "missing_or_invalid_mfa"),
    (n.EXPIRED_OR_INVALID_MFA_TOKEN = "expired_or_invalid_mfa_token"),
    (n.INVALID_DATA = "invalid_data"),
    (n.INVALID_CREDENTIALS = "invalid_credentials"),
    (n.PASSKEY_NOT_REGISTERED = "passkey_not_registered"),
    (n.INVALID_CAPTCHA = "invalid_captcha"),
    (n.LINKED_TO_ANOTHER_USER = "linked_to_another_user"),
    (n.ALLOWLIST_REJECTED = "allowlist_rejected"),
    (n.CANNOT_UNLINK_EMBEDDED_WALLET = "cannot_unlink_embedded_wallet"),
    (n.CANNOT_UNLINK_SOLE_ACCOUNT = "cannot_unlink_sole_account"),
    (n.CANNOT_LINK_MORE_OF_TYPE = "cannot_link_more_of_type"),
    (n.LINKED_ACCOUNT_NOT_FOUND = "linked_account_not_found"),
    (n.TOO_MANY_REQUESTS = "too_many_requests"),
    (n.RESOURCE_CONFLICT = "resource_conflict"),
    (n.INVALID_ORIGIN = "invalid_origin"),
    (n.MISSING_ORIGIN = "missing_origin"),
    (n.INVALID_NATIVE_APP_ID = "invalid_native_app_id"),
    (n.TOKEN_ALREADY_USED = "token_already_used"),
    (n.ALREADY_LOGGED_OUT = "already_logged_out"),
    (n.NOT_SUPPORTED = "not_supported"),
    (n.USER_UNSUBSCRIBED = "user_unsubscribed"),
    (n.MAX_APPS_REACHED = "max_apps_reached"),
    (n.USER_LIMIT_REACHED = "max_accounts_reached"),
    (n.DEVICE_REVOKED = "device_revoked"),
    (n.WALLET_PASSWORD_EXISTS = "wallet_password_exists"),
    (n.OAUTH_STATE_MISMATCH = "oauth_state_mismatch"),
    (n.MAX_DENYLIST_ENTRIES_REACHED = "max_denylist_entries_reached"),
    (n.MAX_TEST_ACCOUNTS_REACHED = "max_test_accounts_reached"),
    (n.DISALLOWED_LOGIN_METHOD = "disallowed_login_method"),
    (n.DISALLOWED_PLUS_EMAIL = "disallowed_plus_email"),
    (n.DISALLOWED_RECOVERY_METHOD = "disallowed_recovery_method"),
    (n.LEGACY_DASHBOARD_LOGIN_CONFIGURATION =
      "legacy_dashboard_login_configuration"),
    (n.CANNOT_SET_PASSWORD = "cannot_set_password"),
    (n.INVALID_PKCE_PARAMETERS = "invalid_pkce_parameters"),
    (n.INVALID_APP_URL_SCHEME_CONFIGURATION =
      "invalid_app_url_scheme_configuration"),
    (n.CROSS_APP_CONNECTION_NOT_ALLOWED = "cross_app_connection_not_allowed"),
    (n.USER_DOES_NOT_EXIST = "user_does_not_exist"),
    (n.ALREADY_EXISTS = "resource_already_exists"),
    (n.ACCOUNT_TRANSFER_REQUIRED = "account_transfer_required"),
    (n.USER_HAS_NOT_DELEGATED_WALLET = "user_has_not_delegated_wallet"),
    (n.FEATURE_NOT_ENABLED = "feature_not_enabled"),
    (n.ONRAMP_MINIMUM_IDENTITY_VERIFICATION_REQUIRED =
      "onramp_minimum_identity_verification_required"),
    (n.ONRAMP_IDENTITY_VERIFICATION_REQUIRED =
      "onramp_identity_verification_required"),
    (n.ONRAMP_DOCUMENT_VERIFICATION_REQUIRED =
      "onramp_document_verification_required"),
    (n.ONRAMP_UNSUPPORTED_INFORMATION = "onramp_unsupported_information"),
    (n.ONRAMP_TRANSACTION_LIMIT_REACHED = "transaction_limit_reached"),
    (n.ONRAMP_QUOTE_EXPIRED = "onramp_quote_expired"),
    (n.ONRAMP_WALLET_OWNERSHIP_REQUIRED = "onramp_wallet_ownership_required"),
    (n.INSUFFICIENT_FUNDS = "insufficient_funds"),
    (n.TRANSACTION_BROADCAST_FAILURE = "transaction_broadcast_failure"),
    (n.TRANSACTION_EXECUTION_FAILURE = "transaction_execution_failure"),
    (n.INVALID_SOLANA_TRANSACTION = "invalid_solana_transaction"),
    (n.INVALID_POLICY_FORMAT = "invalid_policy_format"),
    (n.INVALID_AGGREGATION_FORMAT = "invalid_aggregation_format"),
    (n.POLICY_VIOLATION = "policy_violation"),
    (n.AUTHORIZATION_KEY_HAS_ASSOCIATED_WALLETS =
      "authorization_key_has_associated_wallets"),
    (n.COMPLIANCE_BLOCKED = "compliance_blocked"),
    (n.INVALID_REQUEST = "invalid_request"),
    (n.SIGNUP_DISABLED = "signup_disabled"),
    (n.INVALID_STATE = "invalid_state"),
    (n.WALLET_ENTITY_ASSIGNMENT_FAILED = "wallet_entity_assignment_failed"),
    (n.WALLET_ENTITY_LIMIT_EXCEEDED = "wallet_entity_limit_exceeded"),
    (n.WALLET_ENTITY_ALREADY_SET = "wallet_entity_already_set"),
    n);
  var t_ = class extends Error {
    status;
    code;
    responseData;
    constructor(e, t, r, i) {
      (super(t),
        (this.status = e),
        (this.code = r),
        (this.name = "HttpError"),
        (this.responseData = i));
    }
    toString() {
      return `${this.name}: ${this.message}${this.cause ? ` [cause: ${this.cause}]` : ""}`;
    }
  };
  (tp.object({
    error: tf.string(),
    cause: tf.string().optional(),
    code: ty.nativeEnum(tm).optional(),
  }),
    e.s(
      [
        "M",
        0,
        class extends t_ {
          constructor(e, t) {
            (super(400, e, t || "invalid_data"),
              (this.name = "InvalidInputError"));
          }
        },
        "$",
        0,
        tm,
      ],
      256260,
    ));
  let tg = (e) =>
      new Promise((t) => {
        setTimeout(() => {
          t();
        }, e);
      }),
    tv = (e) => 3 ** e * 500,
    t$ = [408, 409, 425, 500, 502, 503, 504];
  function tb(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var i in r) e[i] = r[i];
    }
    return e;
  }
  var tw = (function e(t, r) {
      function i(e, i, a) {
        if ("u" > typeof document) {
          ("number" == typeof (a = tb({}, r, a)).expires &&
            (a.expires = new Date(Date.now() + 864e5 * a.expires)),
            a.expires && (a.expires = a.expires.toUTCString()),
            (e = encodeURIComponent(e)
              .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
              .replace(/[()]/g, escape)));
          var n = "";
          for (var s in a)
            a[s] &&
              ((n += "; " + s), !0 !== a[s] && (n += "=" + a[s].split(";")[0]));
          return (document.cookie = e + "=" + t.write(i, e) + n);
        }
      }
      return Object.create(
        {
          set: i,
          get: function (e) {
            if ("u" > typeof document && (!arguments.length || e)) {
              for (
                var r = document.cookie ? document.cookie.split("; ") : [],
                  i = {},
                  a = 0;
                a < r.length;
                a++
              ) {
                var n = r[a].split("="),
                  s = n.slice(1).join("=");
                try {
                  var o = decodeURIComponent(n[0]);
                  if (((i[o] = t.read(s, o)), e === o)) break;
                } catch (e) {}
              }
              return e ? i[e] : i;
            }
          },
          remove: function (e, t) {
            i(e, "", tb({}, t, { expires: -1 }));
          },
          withAttributes: function (t) {
            return e(this.converter, tb({}, this.attributes, t));
          },
          withConverter: function (t) {
            return e(tb({}, this.converter, t), this.attributes);
          },
        },
        {
          attributes: { value: Object.freeze(r) },
          converter: { value: Object.freeze(t) },
        },
      );
    })(
      {
        read: function (e) {
          return (
            '"' === e[0] && (e = e.slice(1, -1)),
            e.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
          );
        },
        write: function (e) {
          return encodeURIComponent(e).replace(
            /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
            decodeURIComponent,
          );
        },
      },
      { path: "/" },
    ),
    tI = e.i(507686);
  let tk = {
      AC: "40123",
      AD: "312345",
      AE: "501234567",
      AF: "701234567",
      AG: "2684641234",
      AI: "2642351234",
      AL: "672123456",
      AM: "77123456",
      AO: "923123456",
      AR: "91123456789",
      AS: "6847331234",
      AT: "664123456",
      AU: "412345678",
      AW: "5601234",
      AX: "412345678",
      AZ: "401234567",
      BA: "61123456",
      BB: "2462501234",
      BD: "1812345678",
      BE: "470123456",
      BF: "70123456",
      BG: "43012345",
      BH: "36001234",
      BI: "79561234",
      BJ: "0195123456",
      BL: "690001234",
      BM: "4413701234",
      BN: "7123456",
      BO: "71234567",
      BQ: "3181234",
      BR: "11961234567",
      BS: "2423591234",
      BT: "17123456",
      BW: "71123456",
      BY: "294911911",
      BZ: "6221234",
      CA: "5062345678",
      CC: "412345678",
      CD: "991234567",
      CF: "70012345",
      CG: "061234567",
      CH: "781234567",
      CI: "0123456789",
      CK: "71234",
      CL: "221234567",
      CM: "671234567",
      CN: "13123456789",
      CO: "3211234567",
      CR: "83123456",
      CU: "51234567",
      CV: "9911234",
      CW: "95181234",
      CX: "412345678",
      CY: "96123456",
      CZ: "601123456",
      DE: "15123456789",
      DJ: "77831001",
      DK: "34412345",
      DM: "7672251234",
      DO: "8092345678",
      DZ: "551234567",
      EC: "991234567",
      EE: "51234567",
      EG: "1001234567",
      EH: "650123456",
      ER: "7123456",
      ES: "612345678",
      ET: "911234567",
      FI: "412345678",
      FJ: "7012345",
      FK: "51234",
      FM: "3501234",
      FO: "211234",
      FR: "612345678",
      GA: "06031234",
      GB: "7400123456",
      GD: "4734031234",
      GE: "555123456",
      GF: "694201234",
      GG: "7781123456",
      GH: "231234567",
      GI: "57123456",
      GL: "221234",
      GM: "3012345",
      GN: "601123456",
      GP: "690001234",
      GQ: "222123456",
      GR: "6912345678",
      GT: "51234567",
      GU: "6713001234",
      GW: "955012345",
      GY: "6091234",
      HK: "51234567",
      HN: "91234567",
      HR: "921234567",
      HT: "34101234",
      HU: "201234567",
      ID: "812345678",
      IE: "850123456",
      IL: "502345678",
      IM: "7924123456",
      IN: "8123456789",
      IO: "3801234",
      IQ: "7912345678",
      IR: "9123456789",
      IS: "6111234",
      IT: "3123456789",
      JE: "7797712345",
      JM: "8762101234",
      JO: "790123456",
      JP: "9012345678",
      KE: "712123456",
      KG: "700123456",
      KH: "91234567",
      KI: "72001234",
      KM: "3212345",
      KN: "8697652917",
      KP: "1921234567",
      KR: "1020000000",
      KW: "50012345",
      KY: "3453231234",
      KZ: "7710009998",
      LA: "2023123456",
      LB: "71123456",
      LC: "7582845678",
      LI: "660234567",
      LK: "712345678",
      LR: "770123456",
      LS: "50123456",
      LT: "61234567",
      LU: "628123456",
      LV: "21234567",
      LY: "912345678",
      MA: "650123456",
      MC: "612345678",
      MD: "62112345",
      ME: "60123456",
      MF: "690001234",
      MG: "321234567",
      MH: "2351234",
      MK: "72345678",
      ML: "65012345",
      MM: "92123456",
      MN: "88123456",
      MO: "66123456",
      MP: "6702345678",
      MQ: "696201234",
      MR: "22123456",
      MS: "6644923456",
      MT: "96961234",
      MU: "52512345",
      MV: "7712345",
      MW: "991234567",
      MX: "2221234567",
      MY: "123456789",
      MZ: "821234567",
      NA: "811234567",
      NC: "751234",
      NE: "93123456",
      NF: "381234",
      NG: "8021234567",
      NI: "81234567",
      NL: "612345678",
      NO: "40612345",
      NP: "9841234567",
      NR: "5551234",
      NU: "8884012",
      NZ: "211234567",
      OM: "92123456",
      PA: "61234567",
      PE: "912345678",
      PF: "87123456",
      PG: "70123456",
      PH: "9051234567",
      PK: "3012345678",
      PL: "512345678",
      PM: "551234",
      PR: "7872345678",
      PS: "599123456",
      PT: "912345678",
      PW: "6201234",
      PY: "961456789",
      QA: "33123456",
      RE: "692123456",
      RO: "712034567",
      RS: "601234567",
      RU: "9123456789",
      RW: "720123456",
      SA: "512345678",
      SB: "7421234",
      SC: "2510123",
      SD: "911231234",
      SE: "701234567",
      SG: "81234567",
      SH: "51234",
      SI: "31234567",
      SJ: "41234567",
      SK: "912123456",
      SL: "25123456",
      SM: "66661212",
      SN: "701234567",
      SO: "71123456",
      SR: "7412345",
      SS: "977123456",
      ST: "9812345",
      SV: "70123456",
      SX: "7215205678",
      SY: "944567890",
      SZ: "76123456",
      TA: "8999",
      TC: "6492311234",
      TD: "63012345",
      TG: "90112345",
      TH: "812345678",
      TJ: "917123456",
      TK: "7290",
      TL: "77212345",
      TM: "66123456",
      TN: "20123456",
      TO: "7715123",
      TR: "5012345678",
      TT: "8682911234",
      TV: "901234",
      TW: "912345678",
      TZ: "621234567",
      UA: "501234567",
      UG: "712345678",
      US: "2015550123",
      UY: "94231234",
      UZ: "912345678",
      VA: "3123456789",
      VC: "7844301234",
      VE: "4121234567",
      VG: "2843001234",
      VI: "3406421234",
      VN: "912345678",
      VU: "5912345",
      WF: "821234",
      WS: "7212345",
      XK: "43201234",
      YE: "712345678",
      YT: "639012345",
      ZA: "711234567",
      ZM: "955123456",
      ZW: "712345678",
    },
    tS = {
      version: 4,
      country_calling_codes: {
        1: [
          "US",
          "AG",
          "AI",
          "AS",
          "BB",
          "BM",
          "BS",
          "CA",
          "DM",
          "DO",
          "GD",
          "GU",
          "JM",
          "KN",
          "KY",
          "LC",
          "MP",
          "MS",
          "PR",
          "SX",
          "TC",
          "TT",
          "VC",
          "VG",
          "VI",
        ],
        7: ["RU", "KZ"],
        20: ["EG"],
        27: ["ZA"],
        30: ["GR"],
        31: ["NL"],
        32: ["BE"],
        33: ["FR"],
        34: ["ES"],
        36: ["HU"],
        39: ["IT", "VA"],
        40: ["RO"],
        41: ["CH"],
        43: ["AT"],
        44: ["GB", "GG", "IM", "JE"],
        45: ["DK"],
        46: ["SE"],
        47: ["NO", "SJ"],
        48: ["PL"],
        49: ["DE"],
        51: ["PE"],
        52: ["MX"],
        53: ["CU"],
        54: ["AR"],
        55: ["BR"],
        56: ["CL"],
        57: ["CO"],
        58: ["VE"],
        60: ["MY"],
        61: ["AU", "CC", "CX"],
        62: ["ID"],
        63: ["PH"],
        64: ["NZ"],
        65: ["SG"],
        66: ["TH"],
        81: ["JP"],
        82: ["KR"],
        84: ["VN"],
        86: ["CN"],
        90: ["TR"],
        91: ["IN"],
        92: ["PK"],
        93: ["AF"],
        94: ["LK"],
        95: ["MM"],
        98: ["IR"],
        211: ["SS"],
        212: ["MA", "EH"],
        213: ["DZ"],
        216: ["TN"],
        218: ["LY"],
        220: ["GM"],
        221: ["SN"],
        222: ["MR"],
        223: ["ML"],
        224: ["GN"],
        225: ["CI"],
        226: ["BF"],
        227: ["NE"],
        228: ["TG"],
        229: ["BJ"],
        230: ["MU"],
        231: ["LR"],
        232: ["SL"],
        233: ["GH"],
        234: ["NG"],
        235: ["TD"],
        236: ["CF"],
        237: ["CM"],
        238: ["CV"],
        239: ["ST"],
        240: ["GQ"],
        241: ["GA"],
        242: ["CG"],
        243: ["CD"],
        244: ["AO"],
        245: ["GW"],
        246: ["IO"],
        247: ["AC"],
        248: ["SC"],
        249: ["SD"],
        250: ["RW"],
        251: ["ET"],
        252: ["SO"],
        253: ["DJ"],
        254: ["KE"],
        255: ["TZ"],
        256: ["UG"],
        257: ["BI"],
        258: ["MZ"],
        260: ["ZM"],
        261: ["MG"],
        262: ["RE", "YT"],
        263: ["ZW"],
        264: ["NA"],
        265: ["MW"],
        266: ["LS"],
        267: ["BW"],
        268: ["SZ"],
        269: ["KM"],
        290: ["SH", "TA"],
        291: ["ER"],
        297: ["AW"],
        298: ["FO"],
        299: ["GL"],
        350: ["GI"],
        351: ["PT"],
        352: ["LU"],
        353: ["IE"],
        354: ["IS"],
        355: ["AL"],
        356: ["MT"],
        357: ["CY"],
        358: ["FI", "AX"],
        359: ["BG"],
        370: ["LT"],
        371: ["LV"],
        372: ["EE"],
        373: ["MD"],
        374: ["AM"],
        375: ["BY"],
        376: ["AD"],
        377: ["MC"],
        378: ["SM"],
        380: ["UA"],
        381: ["RS"],
        382: ["ME"],
        383: ["XK"],
        385: ["HR"],
        386: ["SI"],
        387: ["BA"],
        389: ["MK"],
        420: ["CZ"],
        421: ["SK"],
        423: ["LI"],
        500: ["FK"],
        501: ["BZ"],
        502: ["GT"],
        503: ["SV"],
        504: ["HN"],
        505: ["NI"],
        506: ["CR"],
        507: ["PA"],
        508: ["PM"],
        509: ["HT"],
        590: ["GP", "BL", "MF"],
        591: ["BO"],
        592: ["GY"],
        593: ["EC"],
        594: ["GF"],
        595: ["PY"],
        596: ["MQ"],
        597: ["SR"],
        598: ["UY"],
        599: ["CW", "BQ"],
        670: ["TL"],
        672: ["NF"],
        673: ["BN"],
        674: ["NR"],
        675: ["PG"],
        676: ["TO"],
        677: ["SB"],
        678: ["VU"],
        679: ["FJ"],
        680: ["PW"],
        681: ["WF"],
        682: ["CK"],
        683: ["NU"],
        685: ["WS"],
        686: ["KI"],
        687: ["NC"],
        688: ["TV"],
        689: ["PF"],
        690: ["TK"],
        691: ["FM"],
        692: ["MH"],
        850: ["KP"],
        852: ["HK"],
        853: ["MO"],
        855: ["KH"],
        856: ["LA"],
        880: ["BD"],
        886: ["TW"],
        960: ["MV"],
        961: ["LB"],
        962: ["JO"],
        963: ["SY"],
        964: ["IQ"],
        965: ["KW"],
        966: ["SA"],
        967: ["YE"],
        968: ["OM"],
        970: ["PS"],
        971: ["AE"],
        972: ["IL"],
        973: ["BH"],
        974: ["QA"],
        975: ["BT"],
        976: ["MN"],
        977: ["NP"],
        992: ["TJ"],
        993: ["TM"],
        994: ["AZ"],
        995: ["GE"],
        996: ["KG"],
        998: ["UZ"],
      },
      countries: {
        AC: ["247", "00", "(?:[01589]\\d|[46])\\d{4}", [5, 6]],
        AD: [
          "376",
          "00",
          "(?:1|6\\d)\\d{7}|[135-9]\\d{5}",
          [6, 8, 9],
          [
            ["(\\d{3})(\\d{3})", "$1 $2", ["[135-9]"]],
            ["(\\d{4})(\\d{4})", "$1 $2", ["1"]],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]],
          ],
        ],
        AE: [
          "971",
          "00",
          "(?:[4-7]\\d|9[0-689])\\d{7}|800\\d{2,9}|[2-4679]\\d{7}",
          [5, 6, 7, 8, 9, 10, 11, 12],
          [
            ["(\\d{3})(\\d{2,9})", "$1 $2", ["60|8"]],
            ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[236]|[479][2-8]"], "0$1"],
            ["(\\d{3})(\\d)(\\d{5})", "$1 $2 $3", ["[479]"]],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["5"], "0$1"],
          ],
          "0",
        ],
        AF: [
          "93",
          "00",
          "[2-7]\\d{8}",
          [9],
          [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-7]"], "0$1"]],
          "0",
        ],
        AG: [
          "1",
          "011",
          "(?:268|[58]\\d\\d|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([457]\\d{6})$|1",
          "268$1",
          0,
          "268",
        ],
        AI: [
          "1",
          "011",
          "(?:264|[58]\\d\\d|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2457]\\d{6})$|1",
          "264$1",
          0,
          "264",
        ],
        AL: [
          "355",
          "00",
          "(?:700\\d\\d|900)\\d{3}|8\\d{5,7}|(?:[2-5]|6\\d)\\d{7}",
          [6, 7, 8, 9],
          [
            ["(\\d{3})(\\d{3,4})", "$1 $2", ["80|9"], "0$1"],
            ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["4[2-6]"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2358][2-5]|4"], "0$1"],
            ["(\\d{3})(\\d{5})", "$1 $2", ["[23578]"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["6"], "0$1"],
          ],
          "0",
        ],
        AM: [
          "374",
          "00",
          "(?:[1-489]\\d|55|60|77)\\d{6}",
          [8],
          [
            ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[89]0"], "0 $1"],
            ["(\\d{3})(\\d{5})", "$1 $2", ["2|3[12]"], "(0$1)"],
            ["(\\d{2})(\\d{6})", "$1 $2", ["1|47"], "(0$1)"],
            ["(\\d{2})(\\d{6})", "$1 $2", ["[3-9]"], "0$1"],
          ],
          "0",
        ],
        AO: [
          "244",
          "00",
          "[29]\\d{8}",
          [9],
          [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[29]"]]],
        ],
        AR: [
          "54",
          "00",
          "(?:11|[89]\\d\\d)\\d{8}|[2368]\\d{9}",
          [10, 11],
          [
            [
              "(\\d{4})(\\d{2})(\\d{4})",
              "$1 $2-$3",
              [
                "2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9])",
                "2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8]))|2(?:2[24-9]|3[1-59]|47)",
                "2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5[56][46]|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]",
                "2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|58|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|54(?:4|5[13-7]|6[89])|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:454|85[56])[46]|3(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]",
              ],
              "0$1",
              1,
            ],
            ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", ["1"], "0$1", 1],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["[68]"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2-$3", ["[23]"], "0$1", 1],
            [
              "(\\d)(\\d{4})(\\d{2})(\\d{4})",
              "$2 15-$3-$4",
              [
                "9(?:2[2-469]|3[3-578])",
                "9(?:2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9]))",
                "9(?:2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8])))|92(?:2[24-9]|3[1-59]|47)",
                "9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5(?:[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]",
                "9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|5(?:4(?:4|5[13-7]|6[89])|[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]",
              ],
              "0$1",
              0,
              "$1 $2 $3-$4",
            ],
            [
              "(\\d)(\\d{2})(\\d{4})(\\d{4})",
              "$2 15-$3-$4",
              ["91"],
              "0$1",
              0,
              "$1 $2 $3-$4",
            ],
            ["(\\d{3})(\\d{3})(\\d{5})", "$1-$2-$3", ["8"], "0$1"],
            [
              "(\\d)(\\d{3})(\\d{3})(\\d{4})",
              "$2 15-$3-$4",
              ["9"],
              "0$1",
              0,
              "$1 $2 $3-$4",
            ],
          ],
          "0",
          0,
          "0?(?:(11|2(?:2(?:02?|[13]|2[13-79]|4[1-6]|5[2457]|6[124-8]|7[1-4]|8[13-6]|9[1267])|3(?:02?|1[467]|2[03-6]|3[13-8]|[49][2-6]|5[2-8]|[67])|4(?:7[3-578]|9)|6(?:[0136]|2[24-6]|4[6-8]?|5[15-8])|80|9(?:0[1-3]|[19]|2\\d|3[1-6]|4[02568]?|5[2-4]|6[2-46]|72?|8[23]?))|3(?:3(?:2[79]|6|8[2578])|4(?:0[0-24-9]|[12]|3[5-8]?|4[24-7]|5[4-68]?|6[02-9]|7[126]|8[2379]?|9[1-36-8])|5(?:1|2[1245]|3[237]?|4[1-46-9]|6[2-4]|7[1-6]|8[2-5]?)|6[24]|7(?:[069]|1[1568]|2[15]|3[145]|4[13]|5[14-8]|7[2-57]|8[126])|8(?:[01]|2[15-7]|3[2578]?|4[13-6]|5[4-8]?|6[1-357-9]|7[36-8]?|8[5-8]?|9[124])))15)?",
          "9$1",
        ],
        AS: [
          "1",
          "011",
          "(?:[58]\\d\\d|684|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([267]\\d{6})$|1",
          "684$1",
          0,
          "684",
        ],
        AT: [
          "43",
          "00",
          "1\\d{3,12}|2\\d{6,12}|43(?:(?:0\\d|5[02-9])\\d{3,9}|2\\d{4,5}|[3467]\\d{4}|8\\d{4,6}|9\\d{4,7})|5\\d{4,12}|8\\d{7,12}|9\\d{8,12}|(?:[367]\\d|4[0-24-9])\\d{4,11}",
          [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          [
            ["(\\d)(\\d{3,12})", "$1 $2", ["1(?:11|[2-9])"], "0$1"],
            ["(\\d{3})(\\d{2})", "$1 $2", ["517"], "0$1"],
            ["(\\d{2})(\\d{3,5})", "$1 $2", ["5[079]"], "0$1"],
            [
              "(\\d{3})(\\d{3,10})",
              "$1 $2",
              [
                "(?:31|4)6|51|6(?:48|5[0-3579]|[6-9])|7(?:20|32|8)|[89]",
                "(?:31|4)6|51|6(?:485|5[0-3579]|[6-9])|7(?:20|32|8)|[89]",
              ],
              "0$1",
            ],
            ["(\\d{4})(\\d{3,9})", "$1 $2", ["[2-467]|5[2-6]"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["5"], "0$1"],
            ["(\\d{2})(\\d{4})(\\d{4,7})", "$1 $2 $3", ["5"], "0$1"],
          ],
          "0",
        ],
        AU: [
          "61",
          "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011",
          "1(?:[0-79]\\d{7}(?:\\d(?:\\d{2})?)?|8[0-24-9]\\d{7})|[2-478]\\d{8}|1\\d{4,7}",
          [5, 6, 7, 8, 9, 10, 12],
          [
            ["(\\d{2})(\\d{3,4})", "$1 $2", ["16"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{2,4})", "$1 $2 $3", ["16"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["14|4"], "0$1"],
            ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["[2378]"], "(0$1)"],
            ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:30|[89])"]],
          ],
          "0",
          0,
          "(183[12])|0",
          0,
          0,
          0,
          [
            [
              "(?:(?:241|349)0\\d\\d|8(?:51(?:0(?:0[03-9]|[12479]\\d|3[2-9]|5[0-8]|6[1-9]|8[0-7])|1(?:[0235689]\\d|1[0-69]|4[0-589]|7[0-47-9])|2(?:0[0-79]|[18][13579]|2[14-9]|3[0-46-9]|[4-6]\\d|7[89]|9[0-4])|[34]\\d\\d)|91(?:(?:[0-58]\\d|6[0135-9])\\d|7(?:0[0-24-9]|[1-9]\\d)|9(?:[0-46-9]\\d|5[0-79]))))\\d{3}|(?:2(?:[0-26-9]\\d|3[0-8]|4[02-9]|5[0135-9])|3(?:[0-3589]\\d|4[0-578]|6[1-9]|7[0-35-9])|7(?:[013-57-9]\\d|2[0-8])|8(?:55|6[0-8]|[78]\\d|9[02-9]))\\d{6}",
              [9],
            ],
            [
              "4(?:79[01]|83[0-36-9]|95[0-3])\\d{5}|4(?:[0-36]\\d|4[047-9]|[58][0-24-9]|7[02-8]|9[0-47-9])\\d{6}",
              [9],
            ],
            ["180(?:0\\d{3}|2)\\d{3}", [7, 10]],
            ["190[0-26]\\d{6}", [10]],
            0,
            0,
            0,
            ["163\\d{2,6}", [5, 6, 7, 8, 9]],
            ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]],
            [
              "13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}",
              [6, 8, 10, 12],
            ],
          ],
          "0011",
        ],
        AW: [
          "297",
          "00",
          "(?:[25-79]\\d\\d|800)\\d{4}",
          [7],
          [["(\\d{3})(\\d{4})", "$1 $2", ["[25-9]"]]],
        ],
        AX: [
          "358",
          "00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))",
          "2\\d{4,9}|35\\d{4,5}|(?:60\\d\\d|800)\\d{4,6}|7\\d{5,11}|(?:[14]\\d|3[0-46-9]|50)\\d{4,8}",
          [5, 6, 7, 8, 9, 10, 11, 12],
          0,
          "0",
          0,
          0,
          0,
          0,
          "18",
          0,
          "00",
        ],
        AZ: [
          "994",
          "00",
          "365\\d{6}|(?:[124579]\\d|60|88)\\d{7}",
          [9],
          [
            ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["90"], "0$1"],
            [
              "(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              [
                "1[28]|2|365|46",
                "1[28]|2|365[45]|46",
                "1[28]|2|365(?:4|5[02])|46",
              ],
              "(0$1)",
            ],
            [
              "(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[13-9]"],
              "0$1",
            ],
          ],
          "0",
        ],
        BA: [
          "387",
          "00",
          "6\\d{8}|(?:[35689]\\d|49|70)\\d{6}",
          [8, 9],
          [
            ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["6[1-3]|[7-9]"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2-$3", ["[3-5]|6[56]"], "0$1"],
            ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["6"], "0$1"],
          ],
          "0",
        ],
        BB: [
          "1",
          "011",
          "(?:246|[58]\\d\\d|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2-9]\\d{6})$|1",
          "246$1",
          0,
          "246",
        ],
        BD: [
          "880",
          "00",
          "[1-469]\\d{9}|8[0-79]\\d{7,8}|[2-79]\\d{8}|[2-9]\\d{7}|[3-9]\\d{6}|[57-9]\\d{5}",
          [6, 7, 8, 9, 10],
          [
            ["(\\d{2})(\\d{4,6})", "$1-$2", ["31[5-8]|[459]1"], "0$1"],
            [
              "(\\d{3})(\\d{3,7})",
              "$1-$2",
              [
                "3(?:[67]|8[013-9])|4(?:6[168]|7|[89][18])|5(?:6[128]|9)|6(?:[15]|28|4[14])|7[2-589]|8(?:0[014-9]|[12])|9[358]|(?:3[2-5]|4[235]|5[2-578]|6[0389]|76|8[3-7]|9[24])1|(?:44|66)[01346-9]",
              ],
              "0$1",
            ],
            ["(\\d{4})(\\d{3,6})", "$1-$2", ["[13-9]|2[23]"], "0$1"],
            ["(\\d)(\\d{7,8})", "$1-$2", ["2"], "0$1"],
          ],
          "0",
        ],
        BE: [
          "32",
          "00",
          "4\\d{8}|[1-9]\\d{7}",
          [8, 9],
          [
            ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:80|9)0"], "0$1"],
            [
              "(\\d)(\\d{3})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[239]|4[23]"],
              "0$1",
            ],
            [
              "(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[15-8]"],
              "0$1",
            ],
            ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["4"], "0$1"],
          ],
          "0",
        ],
        BF: [
          "226",
          "00",
          "(?:[025-7]\\d|44)\\d{6}",
          [8],
          [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[024-7]"]]],
        ],
        BG: [
          "359",
          "00",
          "00800\\d{7}|[2-7]\\d{6,7}|[89]\\d{6,8}|2\\d{5}",
          [6, 7, 8, 9, 12],
          [
            ["(\\d)(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["2"], "0$1"],
            ["(\\d{3})(\\d{4})", "$1 $2", ["43[1-6]|70[1-9]"], "0$1"],
            ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2"], "0$1"],
            [
              "(\\d{2})(\\d{3})(\\d{2,3})",
              "$1 $2 $3",
              ["[356]|4[124-7]|7[1-9]|8[1-6]|9[1-7]"],
              "0$1",
            ],
            ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:70|8)0"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3", ["43[1-7]|7"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[48]|9[08]"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "0$1"],
          ],
          "0",
        ],
        BH: [
          "973",
          "00",
          "[136-9]\\d{7}",
          [8],
          [["(\\d{4})(\\d{4})", "$1 $2", ["[13679]|8[02-4679]"]]],
        ],
        BI: [
          "257",
          "00",
          "(?:[267]\\d|31)\\d{6}",
          [8],
          [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2367]"]]],
        ],
        BJ: [
          "229",
          "00",
          "(?:01\\d|8)\\d{7}",
          [8, 10],
          [
            ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]],
            [
              "(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4 $5",
              ["0"],
            ],
          ],
        ],
        BL: [
          "590",
          "00",
          "(?:590\\d|7090)\\d{5}|(?:69|80|9\\d)\\d{7}",
          [9],
          0,
          "0",
          0,
          0,
          0,
          0,
          0,
          [
            ["590(?:2[7-9]|3[3-7]|5[12]|87)\\d{4}"],
            [
              "(?:69(?:0\\d\\d|1(?:2[2-9]|3[0-5])|4(?:0[89]|1[2-6]|9\\d)|6(?:1[016-9]|5[0-4]|[67]\\d))|7090[0-4])\\d{4}",
            ],
            ["80[0-5]\\d{6}"],
            0,
            0,
            0,
            0,
            0,
            ["9(?:(?:39[5-7]|76[018])\\d|475[0-6])\\d{4}"],
          ],
        ],
        BM: [
          "1",
          "011",
          "(?:441|[58]\\d\\d|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2-9]\\d{6})$|1",
          "441$1",
          0,
          "441",
        ],
        BN: [
          "673",
          "00",
          "[2-578]\\d{6}",
          [7],
          [["(\\d{3})(\\d{4})", "$1 $2", ["[2-578]"]]],
        ],
        BO: [
          "591",
          "00(?:1\\d)?",
          "8001\\d{5}|(?:[2-467]\\d|50)\\d{6}",
          [8, 9],
          [
            ["(\\d)(\\d{7})", "$1 $2", ["[235]|4[46]"]],
            ["(\\d{8})", "$1", ["[67]"]],
            ["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["8"]],
          ],
          "0",
          0,
          "0(1\\d)?",
        ],
        BQ: [
          "599",
          "00",
          "(?:[34]1|7\\d)\\d{5}",
          [7],
          0,
          0,
          0,
          0,
          0,
          0,
          "[347]",
        ],
        BR: [
          "55",
          "00(?:1[245]|2[1-35]|31|4[13]|[56]5|99)",
          "[1-467]\\d{9,10}|55[0-46-9]\\d{8}|[34]\\d{7}|55\\d{7,8}|(?:5[0-46-9]|[89]\\d)\\d{7,9}",
          [8, 9, 10, 11],
          [
            [
              "(\\d{4})(\\d{4})",
              "$1-$2",
              ["300|4(?:0[02]|37|86)", "300|4(?:0(?:0|20)|370|864)"],
            ],
            [
              "(\\d{3})(\\d{2,3})(\\d{4})",
              "$1 $2 $3",
              ["(?:[358]|90)0"],
              "0$1",
            ],
            [
              "(\\d{2})(\\d{4})(\\d{4})",
              "$1 $2-$3",
              ["(?:[14689][1-9]|2[12478]|3[1-578]|5[13-5]|7[13-579])[2-57]"],
              "($1)",
            ],
            [
              "(\\d{2})(\\d{5})(\\d{4})",
              "$1 $2-$3",
              ["[16][1-9]|[2-57-9]"],
              "($1)",
            ],
          ],
          "0",
          0,
          "(?:0|90)(?:(1[245]|2[1-35]|31|4[13]|[56]5|99)(\\d{10,11}))?",
          "$2",
        ],
        BS: [
          "1",
          "011",
          "(?:242|[58]\\d\\d|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([3-8]\\d{6})$|1",
          "242$1",
          0,
          "242",
        ],
        BT: [
          "975",
          "00",
          "[178]\\d{7}|[2-8]\\d{6}",
          [7, 8],
          [
            ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-6]|7[246]|8[2-4]"]],
            ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[67]|[78]"]],
          ],
        ],
        BW: [
          "267",
          "00",
          "(?:0800|(?:[37]|800)\\d)\\d{6}|(?:[2-6]\\d|90)\\d{5}",
          [7, 8, 10],
          [
            ["(\\d{2})(\\d{5})", "$1 $2", ["90"]],
            ["(\\d{3})(\\d{4})", "$1 $2", ["[24-6]|3[15-9]"]],
            ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[37]"]],
            ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["0"]],
            ["(\\d{3})(\\d{4})(\\d{3})", "$1 $2 $3", ["8"]],
          ],
        ],
        BY: [
          "375",
          "810",
          "(?:[12]\\d|33|44|902)\\d{7}|8(?:0[0-79]\\d{5,7}|[1-7]\\d{9})|8(?:1[0-489]|[5-79]\\d)\\d{7}|8[1-79]\\d{6,7}|8[0-79]\\d{5}|8\\d{5}",
          [6, 7, 8, 9, 10, 11],
          [
            ["(\\d{3})(\\d{3})", "$1 $2", ["800"], "8 $1"],
            ["(\\d{3})(\\d{2})(\\d{2,4})", "$1 $2 $3", ["800"], "8 $1"],
            [
              "(\\d{4})(\\d{2})(\\d{3})",
              "$1 $2-$3",
              [
                "1(?:5[169]|6[3-5]|7[179])|2(?:1[35]|2[34]|3[3-5])",
                "1(?:5[169]|6(?:3[1-3]|4|5[125])|7(?:1[3-9]|7[0-24-6]|9[2-7]))|2(?:1[35]|2[34]|3[3-5])",
              ],
              "8 0$1",
            ],
            [
              "(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2-$3-$4",
              ["1(?:[56]|7[467])|2[1-3]"],
              "8 0$1",
            ],
            [
              "(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
              "$1 $2-$3-$4",
              ["[1-4]"],
              "8 0$1",
            ],
            ["(\\d{3})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["[89]"], "8 $1"],
          ],
          "8",
          0,
          "0|80?",
          0,
          0,
          0,
          0,
          "8~10",
        ],
        BZ: [
          "501",
          "00",
          "(?:0800\\d|[2-8])\\d{6}",
          [7, 11],
          [
            ["(\\d{3})(\\d{4})", "$1-$2", ["[2-8]"]],
            ["(\\d)(\\d{3})(\\d{4})(\\d{3})", "$1-$2-$3-$4", ["0"]],
          ],
        ],
        CA: [
          "1",
          "011",
          "[2-9]\\d{9}|3\\d{6}",
          [7, 10],
          0,
          "1",
          0,
          0,
          0,
          0,
          0,
          [
            [
              "(?:2(?:04|[23]6|[48]9|5[07]|63)|3(?:06|43|54|6[578]|82)|4(?:03|1[68]|[26]8|3[178]|50|74)|5(?:06|1[49]|48|79|8[147])|6(?:04|[18]3|39|47|72)|7(?:0[59]|42|53|78|8[02])|8(?:[06]7|19|25|7[39])|9(?:0[25]|42))[2-9]\\d{6}",
              [10],
            ],
            ["", [10]],
            ["8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", [10]],
            ["900[2-9]\\d{6}", [10]],
            [
              "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|(?:5(?:2[125-9]|33|44|66|77|88)|6(?:22|33))[2-9]\\d{6}",
              [10],
            ],
            0,
            ["310\\d{4}", [7]],
            0,
            ["600[2-9]\\d{6}", [10]],
          ],
        ],
        CC: [
          "61",
          "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011",
          "1(?:[0-79]\\d{8}(?:\\d{2})?|8[0-24-9]\\d{7})|[148]\\d{8}|1\\d{5,7}",
          [6, 7, 8, 9, 10, 12],
          0,
          "0",
          0,
          "([59]\\d{7})$|0",
          "8$1",
          0,
          0,
          [
            [
              "8(?:51(?:0(?:02|31|60|89)|1(?:18|76)|223)|91(?:0(?:1[0-2]|29)|1(?:[28]2|50|79)|2(?:10|64)|3(?:[06]8|22)|4[29]8|62\\d|70[23]|959))\\d{3}",
              [9],
            ],
            [
              "4(?:79[01]|83[0-36-9]|95[0-3])\\d{5}|4(?:[0-36]\\d|4[047-9]|[58][0-24-9]|7[02-8]|9[0-47-9])\\d{6}",
              [9],
            ],
            ["180(?:0\\d{3}|2)\\d{3}", [7, 10]],
            ["190[0-26]\\d{6}", [10]],
            0,
            0,
            0,
            0,
            ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]],
            [
              "13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}",
              [6, 8, 10, 12],
            ],
          ],
          "0011",
        ],
        CD: [
          "243",
          "00",
          "(?:(?:[189]|5\\d)\\d|2)\\d{7}|[1-68]\\d{6}",
          [7, 8, 9, 10],
          [
            ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["88"], "0$1"],
            ["(\\d{2})(\\d{5})", "$1 $2", ["[1-6]"], "0$1"],
            ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["2"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[89]"], "0$1"],
            ["(\\d{2})(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["5"], "0$1"],
          ],
          "0",
        ],
        CF: [
          "236",
          "00",
          "(?:[27]\\d{3}|8776)\\d{4}",
          [8],
          [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[278]"]]],
        ],
        CG: [
          "242",
          "00",
          "222\\d{6}|(?:0\\d|80)\\d{7}",
          [9],
          [
            ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["8"]],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[02]"]],
          ],
        ],
        CH: [
          "41",
          "00",
          "8\\d{11}|[2-9]\\d{8}",
          [9, 12],
          [
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8[047]|90"], "0$1"],
            [
              "(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[2-79]|81"],
              "0$1",
            ],
            [
              "(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4 $5",
              ["8"],
              "0$1",
            ],
          ],
          "0",
        ],
        CI: [
          "225",
          "00",
          "[02]\\d{9}",
          [10],
          [
            ["(\\d{2})(\\d{2})(\\d)(\\d{5})", "$1 $2 $3 $4", ["2"]],
            ["(\\d{2})(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3 $4", ["0"]],
          ],
        ],
        CK: [
          "682",
          "00",
          "[2-578]\\d{4}",
          [5],
          [["(\\d{2})(\\d{3})", "$1 $2", ["[2-578]"]]],
        ],
        CL: [
          "56",
          "(?:0|1(?:1[0-69]|2[02-5]|5[13-58]|69|7[0167]|8[018]))0",
          "12300\\d{6}|6\\d{9,10}|[2-9]\\d{8}",
          [9, 10, 11],
          [
            ["(\\d{5})(\\d{4})", "$1 $2", ["219", "2196"], "($1)"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["60|809"]],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["44"]],
            ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2[1-36]"], "($1)"],
            ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["9(?:10|[2-9])"]],
            [
              "(\\d{2})(\\d{3})(\\d{4})",
              "$1 $2 $3",
              ["3[2-5]|[47]|5[1-3578]|6[13-57]|8(?:0[1-8]|[1-9])"],
              "($1)",
            ],
            ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["60|8"]],
            ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]],
            ["(\\d{3})(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["60"]],
          ],
        ],
        CM: [
          "237",
          "00",
          "[26]\\d{8}|88\\d{6,7}",
          [8, 9],
          [
            ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["88"]],
            [
              "(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4 $5",
              ["[26]|88"],
            ],
          ],
        ],
        CN: [
          "86",
          "00|1(?:[12]\\d|79)\\d\\d00",
          "(?:(?:1[03-689]|2\\d)\\d\\d|6)\\d{8}|1\\d{10}|[126]\\d{6}(?:\\d(?:\\d{2})?)?|86\\d{5,6}|(?:[3-579]\\d|8[0-57-9])\\d{5,9}",
          [7, 8, 9, 10, 11, 12],
          [
            [
              "(\\d{2})(\\d{5,6})",
              "$1 $2",
              [
                "(?:10|2[0-57-9])[19]|3(?:[157]|35|49|9[1-68])|4(?:1[124-9]|2[179]|6[47-9]|7|8[23])|5(?:[1357]|2[37]|4[36]|6[1-46]|80)|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:07|1[236-8]|2[5-7]|[37]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|3|4[13]|5[1-5]|7[0-79]|9[0-35-9])|(?:4[35]|59|85)[1-9]",
                "(?:10|2[0-57-9])(?:1[02]|9[56])|8078|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:1[124-9]|2[179]|[35][1-9]|6[47-9]|7\\d|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|3\\d|4[13]|5[1-5]|7[0-79]|9[0-35-9]))1",
                "10(?:1(?:0|23)|9[56])|2[0-57-9](?:1(?:00|23)|9[56])|80781|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:1[124-9]|2[179]|[35][1-9]|6[47-9]|7\\d|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|3\\d|4[13]|5[1-5]|7[0-79]|9[0-35-9]))12",
                "10(?:1(?:0|23)|9[56])|2[0-57-9](?:1(?:00|23)|9[56])|807812|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:1[124-9]|2[179]|[35][1-9]|6[47-9]|7\\d|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|3\\d|4[13]|5[1-5]|7[0-79]|9[0-35-9]))123",
                "10(?:1(?:0|23)|9[56])|2[0-57-9](?:1(?:00|23)|9[56])|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:1[124-9]|2[179]|[35][1-9]|6[47-9]|7\\d|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:078|1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|3\\d|4[13]|5[1-5]|7[0-79]|9[0-35-9]))123",
              ],
              "0$1",
            ],
            [
              "(\\d{3})(\\d{5,6})",
              "$1 $2",
              [
                "3(?:[157]|35|49|9[1-68])|4(?:[17]|2[179]|6[47-9]|8[23])|5(?:[1357]|2[37]|4[36]|6[1-46]|80)|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])|(?:4[35]|59|85)[1-9]",
                "(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))[19]",
                "85[23](?:10|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:10|9[56])",
                "85[23](?:100|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:100|9[56])",
              ],
              "0$1",
            ],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["(?:4|80)0"]],
            [
              "(\\d{2})(\\d{4})(\\d{4})",
              "$1 $2 $3",
              [
                "10|2(?:[02-57-9]|1[1-9])",
                "10|2(?:[02-57-9]|1[1-9])",
                "10[0-79]|2(?:[02-57-9]|1[1-79])|(?:10|21)8(?:0[1-9]|[1-9])",
              ],
              "0$1",
              1,
            ],
            [
              "(\\d{3})(\\d{3})(\\d{4})",
              "$1 $2 $3",
              [
                "3(?:[3-59]|7[02-68])|4(?:[26-8]|3[3-9]|5[2-9])|5(?:3[03-9]|[468]|7[028]|9[2-46-9])|6|7(?:[0-247]|3[04-9]|5[0-4689]|6[2368])|8(?:[1-358]|9[1-7])|9(?:[013479]|5[1-5])|(?:[34]1|55|79|87)[02-9]",
              ],
              "0$1",
              1,
            ],
            ["(\\d{3})(\\d{7,8})", "$1 $2", ["9"]],
            ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["80"], "0$1", 1],
            ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["[3-578]"], "0$1", 1],
            ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["1[3-9]"]],
            [
              "(\\d{2})(\\d{3})(\\d{3})(\\d{4})",
              "$1 $2 $3 $4",
              ["[12]"],
              "0$1",
              1,
            ],
          ],
          "0",
          0,
          "(1(?:[12]\\d|79)\\d\\d)|0",
          0,
          0,
          0,
          0,
          "00",
        ],
        CO: [
          "57",
          "00(?:4(?:[14]4|56)|[579])",
          "(?:46|60\\d\\d)\\d{6}|(?:1\\d|[39])\\d{9}",
          [8, 10, 11],
          [
            ["(\\d{4})(\\d{4})", "$1 $2", ["46"]],
            ["(\\d{3})(\\d{7})", "$1 $2", ["6|90"], "($1)"],
            ["(\\d{3})(\\d{7})", "$1 $2", ["3[0-357]|9[14]"]],
            ["(\\d)(\\d{3})(\\d{7})", "$1-$2-$3", ["1"], "0$1", 0, "$1 $2 $3"],
          ],
          "0",
          0,
          "0([3579]|4(?:[14]4|56))?",
        ],
        CR: [
          "506",
          "00",
          "(?:8\\d|90)\\d{8}|(?:[24-8]\\d{3}|3005)\\d{4}",
          [8, 10],
          [
            ["(\\d{4})(\\d{4})", "$1 $2", ["[2-7]|8[3-9]"]],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["[89]"]],
          ],
          0,
          0,
          "(19(?:0[0-2468]|1[09]|20|66|77|99))",
        ],
        CU: [
          "53",
          "119",
          "(?:[2-7]|8\\d\\d)\\d{7}|[2-47]\\d{6}|[34]\\d{5}",
          [6, 7, 8, 10],
          [
            ["(\\d{2})(\\d{4,6})", "$1 $2", ["2[1-4]|[34]"], "(0$1)"],
            ["(\\d)(\\d{6,7})", "$1 $2", ["7"], "(0$1)"],
            ["(\\d)(\\d{7})", "$1 $2", ["[56]"], "0$1"],
            ["(\\d{3})(\\d{7})", "$1 $2", ["8"], "0$1"],
          ],
          "0",
        ],
        CV: [
          "238",
          "0",
          "(?:[2-59]\\d\\d|800)\\d{4}",
          [7],
          [["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[2-589]"]]],
        ],
        CW: [
          "599",
          "00",
          "(?:[34]1|60|(?:7|9\\d)\\d)\\d{5}",
          [7, 8],
          [
            ["(\\d{3})(\\d{4})", "$1 $2", ["[3467]"]],
            ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["9[4-8]"]],
          ],
          0,
          0,
          0,
          0,
          0,
          "[69]",
        ],
        CX: [
          "61",
          "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011",
          "1(?:[0-79]\\d{8}(?:\\d{2})?|8[0-24-9]\\d{7})|[148]\\d{8}|1\\d{5,7}",
          [6, 7, 8, 9, 10, 12],
          0,
          "0",
          0,
          "([59]\\d{7})$|0",
          "8$1",
          0,
          0,
          [
            [
              "8(?:51(?:0(?:01|30|59|88)|1(?:17|46|75)|2(?:22|35))|91(?:00[6-9]|1(?:[28]1|49|78)|2(?:09|63)|3(?:12|26|75)|4(?:56|97)|64\\d|7(?:0[01]|1[0-2])|958))\\d{3}",
              [9],
            ],
            [
              "4(?:79[01]|83[0-36-9]|95[0-3])\\d{5}|4(?:[0-36]\\d|4[047-9]|[58][0-24-9]|7[02-8]|9[0-47-9])\\d{6}",
              [9],
            ],
            ["180(?:0\\d{3}|2)\\d{3}", [7, 10]],
            ["190[0-26]\\d{6}", [10]],
            0,
            0,
            0,
            0,
            ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]],
            [
              "13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}",
              [6, 8, 10, 12],
            ],
          ],
          "0011",
        ],
        CY: [
          "357",
          "00",
          "(?:[279]\\d|[58]0)\\d{6}",
          [8],
          [["(\\d{2})(\\d{6})", "$1 $2", ["[257-9]"]]],
        ],
        CZ: [
          "420",
          "00",
          "(?:[2-578]\\d|60)\\d{7}|9\\d{8,11}",
          [9, 10, 11, 12],
          [
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-8]|9[015-7]"]],
            ["(\\d{2})(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3 $4", ["96"]],
            ["(\\d{2})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]],
            ["(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]],
          ],
        ],
        DE: [
          "49",
          "00",
          "[2579]\\d{5,14}|49(?:[34]0|69|8\\d)\\d\\d?|49(?:37|49|60|7[089]|9\\d)\\d{1,3}|49(?:2[024-9]|3[2-689]|7[1-7])\\d{1,8}|(?:1|[368]\\d|4[0-8])\\d{3,13}|49(?:[015]\\d|2[13]|31|[46][1-8])\\d{1,9}",
          [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          [
            ["(\\d{2})(\\d{3,13})", "$1 $2", ["3[02]|40|[68]9"], "0$1"],
            [
              "(\\d{3})(\\d{3,12})",
              "$1 $2",
              [
                "2(?:0[1-389]|1[124]|2[18]|3[14])|3(?:[35-9][15]|4[015])|906|(?:2[4-9]|4[2-9]|[579][1-9]|[68][1-8])1",
                "2(?:0[1-389]|12[0-8])|3(?:[35-9][15]|4[015])|906|2(?:[13][14]|2[18])|(?:2[4-9]|4[2-9]|[579][1-9]|[68][1-8])1",
              ],
              "0$1",
            ],
            [
              "(\\d{4})(\\d{2,11})",
              "$1 $2",
              [
                "[24-6]|3(?:[3569][02-46-9]|4[2-4679]|7[2-467]|8[2-46-8])|70[2-8]|8(?:0[2-9]|[1-8])|90[7-9]|[79][1-9]",
                "[24-6]|3(?:3(?:0[1-467]|2[127-9]|3[124578]|7[1257-9]|8[1256]|9[145])|4(?:2[135]|4[13578]|9[1346])|5(?:0[14]|2[1-3589]|6[1-4]|7[13468]|8[13568])|6(?:2[1-489]|3[124-6]|6[13]|7[12579]|8[1-356]|9[135])|7(?:2[1-7]|4[145]|6[1-5]|7[1-4])|8(?:21|3[1468]|6|7[1467]|8[136])|9(?:0[12479]|2[1358]|4[134679]|6[1-9]|7[136]|8[147]|9[1468]))|70[2-8]|8(?:0[2-9]|[1-8])|90[7-9]|[79][1-9]|3[68]4[1347]|3(?:47|60)[1356]|3(?:3[46]|46|5[49])[1246]|3[4579]3[1357]",
              ],
              "0$1",
            ],
            ["(\\d{3})(\\d{4})", "$1 $2", ["138"], "0$1"],
            ["(\\d{5})(\\d{2,10})", "$1 $2", ["3"], "0$1"],
            ["(\\d{3})(\\d{5,11})", "$1 $2", ["181"], "0$1"],
            ["(\\d{3})(\\d)(\\d{4,10})", "$1 $2 $3", ["1(?:3|80)|9"], "0$1"],
            ["(\\d{3})(\\d{7,8})", "$1 $2", ["1[67]"], "0$1"],
            ["(\\d{3})(\\d{7,12})", "$1 $2", ["8"], "0$1"],
            ["(\\d{5})(\\d{6})", "$1 $2", ["185", "1850", "18500"], "0$1"],
            ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["7"], "0$1"],
            ["(\\d{4})(\\d{7})", "$1 $2", ["18[68]"], "0$1"],
            ["(\\d{4})(\\d{7})", "$1 $2", ["15[1279]"], "0$1"],
            [
              "(\\d{5})(\\d{6})",
              "$1 $2",
              ["15[03568]", "15(?:[0568]|3[13])"],
              "0$1",
            ],
            ["(\\d{3})(\\d{8})", "$1 $2", ["18"], "0$1"],
            [
              "(\\d{3})(\\d{2})(\\d{7,8})",
              "$1 $2 $3",
              ["1(?:6[023]|7)"],
              "0$1",
            ],
            ["(\\d{4})(\\d{2})(\\d{7})", "$1 $2 $3", ["15[279]"], "0$1"],
            ["(\\d{3})(\\d{2})(\\d{8})", "$1 $2 $3", ["15"], "0$1"],
          ],
          "0",
        ],
        DJ: [
          "253",
          "00",
          "(?:2\\d|77)\\d{6}",
          [8],
          [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[27]"]]],
        ],
        DK: [
          "45",
          "00",
          "[2-9]\\d{7}",
          [8],
          [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-9]"]]],
        ],
        DM: [
          "1",
          "011",
          "(?:[58]\\d\\d|767|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2-7]\\d{6})$|1",
          "767$1",
          0,
          "767",
        ],
        DO: [
          "1",
          "011",
          "(?:[58]\\d\\d|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          0,
          0,
          0,
          "8001|8[024]9",
        ],
        DZ: [
          "213",
          "00",
          "(?:[1-4]|[5-79]\\d|80)\\d{7}",
          [8, 9],
          [
            [
              "(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[1-4]"],
              "0$1",
            ],
            ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["9"], "0$1"],
            [
              "(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[5-8]"],
              "0$1",
            ],
          ],
          "0",
        ],
        EC: [
          "593",
          "00",
          "1\\d{9,10}|(?:[2-7]|9\\d)\\d{7}",
          [8, 9, 10, 11],
          [
            [
              "(\\d)(\\d{3})(\\d{4})",
              "$1 $2-$3",
              ["[2-7]"],
              "(0$1)",
              0,
              "$1-$2-$3",
            ],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["9"], "0$1"],
            ["(\\d{4})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1"]],
          ],
          "0",
        ],
        EE: [
          "372",
          "00",
          "8\\d{9}|[4578]\\d{7}|(?:[3-8]\\d|90)\\d{5}",
          [7, 8, 10],
          [
            [
              "(\\d{3})(\\d{4})",
              "$1 $2",
              [
                "[369]|4[3-8]|5(?:[0-2]|5[0-478]|6[45])|7[1-9]|88",
                "[369]|4[3-8]|5(?:[02]|1(?:[0-8]|95)|5[0-478]|6(?:4[0-4]|5[1-589]))|7[1-9]|88",
              ],
            ],
            [
              "(\\d{4})(\\d{3,4})",
              "$1 $2",
              ["[45]|8(?:00|[1-49])", "[45]|8(?:00[1-9]|[1-49])"],
            ],
            ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["7"]],
            ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]],
          ],
        ],
        EG: [
          "20",
          "00",
          "[189]\\d{8,9}|[24-6]\\d{8}|[135]\\d{7}",
          [8, 9, 10],
          [
            ["(\\d)(\\d{7,8})", "$1 $2", ["[23]"], "0$1"],
            [
              "(\\d{2})(\\d{6,7})",
              "$1 $2",
              ["1[35]|[4-6]|8[2468]|9[235-7]"],
              "0$1",
            ],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1"],
            ["(\\d{2})(\\d{8})", "$1 $2", ["1"], "0$1"],
          ],
          "0",
        ],
        EH: ["212", "00", "[5-8]\\d{8}", [9], 0, "0", 0, 0, 0, 0, "528[89]"],
        ER: [
          "291",
          "00",
          "[178]\\d{6}",
          [7],
          [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[178]"], "0$1"]],
          "0",
        ],
        ES: [
          "34",
          "00",
          "[5-9]\\d{8}",
          [9],
          [
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[89]00"]],
            ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-9]"]],
          ],
        ],
        ET: [
          "251",
          "00",
          "(?:11|[2-579]\\d)\\d{7}",
          [9],
          [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-579]"], "0$1"]],
          "0",
        ],
        FI: [
          "358",
          "00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))",
          "[1-35689]\\d{4}|7\\d{10,11}|(?:[124-7]\\d|3[0-46-9])\\d{8}|[1-9]\\d{5,8}",
          [5, 6, 7, 8, 9, 10, 11, 12],
          [
            ["(\\d{5})", "$1", ["20[2-59]"], "0$1"],
            [
              "(\\d{3})(\\d{3,7})",
              "$1 $2",
              ["(?:[1-3]0|[68])0|70[07-9]"],
              "0$1",
            ],
            ["(\\d{2})(\\d{4,8})", "$1 $2", ["[14]|2[09]|50|7[135]"], "0$1"],
            ["(\\d{2})(\\d{6,10})", "$1 $2", ["7"], "0$1"],
            [
              "(\\d)(\\d{4,9})",
              "$1 $2",
              ["(?:19|[2568])[1-8]|3(?:0[1-9]|[1-9])|9"],
              "0$1",
            ],
          ],
          "0",
          0,
          0,
          0,
          0,
          "1[03-79]|[2-9]",
          0,
          "00",
        ],
        FJ: [
          "679",
          "0(?:0|52)",
          "45\\d{5}|(?:0800\\d|[235-9])\\d{6}",
          [7, 11],
          [
            ["(\\d{3})(\\d{4})", "$1 $2", ["[235-9]|45"]],
            ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["0"]],
          ],
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          "00",
        ],
        FK: ["500", "00", "[2-7]\\d{4}", [5]],
        FM: [
          "691",
          "00",
          "(?:[39]\\d\\d|820)\\d{4}",
          [7],
          [["(\\d{3})(\\d{4})", "$1 $2", ["[389]"]]],
        ],
        FO: [
          "298",
          "00",
          "[2-9]\\d{5}",
          [6],
          [["(\\d{6})", "$1", ["[2-9]"]]],
          0,
          0,
          "(10(?:01|[12]0|88))",
        ],
        FR: [
          "33",
          "00",
          "[1-9]\\d{8}",
          [9],
          [
            ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0 $1"],
            [
              "(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4 $5",
              ["[1-79]"],
              "0$1",
            ],
          ],
          "0",
        ],
        GA: [
          "241",
          "00",
          "(?:[067]\\d|11)\\d{6}|[2-7]\\d{6}",
          [7, 8],
          [
            ["(\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-7]"], "0$1"],
            ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["0"]],
            [
              "(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["11|[67]"],
              "0$1",
            ],
          ],
          0,
          0,
          "0(11\\d{6}|60\\d{6}|61\\d{6}|6[256]\\d{6}|7[467]\\d{6})",
          "$1",
        ],
        GB: [
          "44",
          "00",
          "[1-357-9]\\d{9}|[18]\\d{8}|8\\d{6}",
          [7, 9, 10],
          [
            [
              "(\\d{3})(\\d{4})",
              "$1 $2",
              ["800", "8001", "80011", "800111", "8001111"],
              "0$1",
            ],
            [
              "(\\d{3})(\\d{2})(\\d{2})",
              "$1 $2 $3",
              ["845", "8454", "84546", "845464"],
              "0$1",
            ],
            ["(\\d{3})(\\d{6})", "$1 $2", ["800"], "0$1"],
            [
              "(\\d{5})(\\d{4,5})",
              "$1 $2",
              [
                "1(?:38|5[23]|69|76|94)",
                "1(?:(?:38|69)7|5(?:24|39)|768|946)",
                "1(?:3873|5(?:242|39[4-6])|(?:697|768)[347]|9467)",
              ],
              "0$1",
            ],
            ["(\\d{4})(\\d{5,6})", "$1 $2", ["1(?:[2-69][02-9]|[78])"], "0$1"],
            [
              "(\\d{2})(\\d{4})(\\d{4})",
              "$1 $2 $3",
              ["[25]|7(?:0|6[02-9])", "[25]|7(?:0|6(?:[03-9]|2[356]))"],
              "0$1",
            ],
            ["(\\d{4})(\\d{6})", "$1 $2", ["7"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1389]"], "0$1"],
          ],
          "0",
          0,
          "0|180020",
          0,
          0,
          0,
          [
            [
              "(?:1(?:1(?:3(?:[0-58]\\d\\d|73[0-5])|4(?:(?:[0-5]\\d|70)\\d|69[7-9])|(?:(?:5[0-26-9]|[78][0-49])\\d|6(?:[0-4]\\d|5[01]))\\d)|(?:2(?:(?:0[024-9]|2[3-9]|3[3-79]|4[1-689]|[58][02-9]|6[0-47-9]|7[013-9]|9\\d)\\d|1(?:[0-7]\\d|8[0-3]))|(?:3(?:0\\d|1[0-8]|[25][02-9]|3[02-579]|[468][0-46-9]|7[1-35-79]|9[2-578])|4(?:0[03-9]|[137]\\d|[28][02-57-9]|4[02-69]|5[0-8]|[69][0-79])|5(?:0[1-35-9]|[16]\\d|2[024-9]|3[015689]|4[02-9]|5[03-9]|7[0-35-9]|8[0-468]|9[0-57-9])|6(?:0[034689]|1\\d|2[0-35689]|[38][013-9]|4[1-467]|5[0-69]|6[13-9]|7[0-8]|9[0-24578])|7(?:0[0246-9]|2\\d|3[0236-8]|4[03-9]|5[0-46-9]|6[013-9]|7[0-35-9]|8[024-9]|9[02-9])|8(?:0[35-9]|2[1-57-9]|3[02-578]|4[0-578]|5[124-9]|6[2-69]|7\\d|8[02-9]|9[02569])|9(?:0[02-589]|[18]\\d|2[02-689]|3[1-57-9]|4[2-9]|5[0-579]|6[2-47-9]|7[0-24578]|9[2-57]))\\d)\\d)|2(?:0[013478]|3[0189]|4[017]|8[0-46-9]|9[0-2])\\d{3})\\d{4}|1(?:2(?:0(?:46[1-4]|87[2-9])|545[1-79]|76(?:2\\d|3[1-8]|6[1-6])|9(?:7(?:2[0-4]|3[2-5])|8(?:2[2-8]|7[0-47-9]|8[3-5])))|3(?:6(?:38[2-5]|47[23])|8(?:47[04-9]|64[0157-9]))|4(?:044[1-7]|20(?:2[23]|8\\d)|6(?:0(?:30|5[2-57]|6[1-8]|7[2-8])|140)|8(?:052|87[1-3]))|5(?:2(?:4(?:3[2-79]|6\\d)|76\\d)|6(?:26[06-9]|686))|6(?:06(?:4\\d|7[4-79])|295[5-7]|35[34]\\d|47(?:24|61)|59(?:5[08]|6[67]|74)|9(?:55[0-4]|77[23]))|7(?:26(?:6[13-9]|7[0-7])|(?:442|688)\\d|50(?:2[0-3]|[3-68]2|76))|8(?:27[56]\\d|37(?:5[2-5]|8[239])|843[2-58])|9(?:0(?:0(?:6[1-8]|85)|52\\d)|3583|4(?:66[1-8]|9(?:2[01]|81))|63(?:23|3[1-4])|9561))\\d{3}",
              [9, 10],
            ],
            [
              "7(?:457[0-57-9]|700[01]|911[028])\\d{5}|7(?:[1-3]\\d\\d|4(?:[0-46-9]\\d|5[0-689])|5(?:0[0-8]|[13-9]\\d|2[0-35-9])|7(?:0[1-9]|[1-7]\\d|8[02-9]|9[0-689])|8(?:[014-9]\\d|[23][0-8])|9(?:[024-9]\\d|1[02-9]|3[0-689]))\\d{6}",
              [10],
            ],
            ["80[08]\\d{7}|800\\d{6}|8001111"],
            [
              "(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[2-49]))\\d{7}|845464\\d",
              [7, 10],
            ],
            ["70\\d{8}", [10]],
            0,
            ["(?:3[0347]|55)\\d{8}", [10]],
            [
              "76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}",
              [10],
            ],
            ["56\\d{8}", [10]],
          ],
          0,
          " x",
        ],
        GD: [
          "1",
          "011",
          "(?:473|[58]\\d\\d|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2-9]\\d{6})$|1",
          "473$1",
          0,
          "473",
        ],
        GE: [
          "995",
          "00",
          "(?:[3-57]\\d\\d|800)\\d{6}",
          [9],
          [
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["70"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["32"], "0$1"],
            ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[57]"]],
            [
              "(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[348]"],
              "0$1",
            ],
          ],
          "0",
        ],
        GF: [
          "594",
          "00",
          "(?:[56]94\\d|7093)\\d{5}|(?:80|9\\d)\\d{7}",
          [9],
          [
            [
              "(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[5-7]|9[47]"],
              "0$1",
            ],
            [
              "(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[89]"],
              "0$1",
            ],
          ],
          "0",
        ],
        GG: [
          "44",
          "00",
          "(?:1481|[357-9]\\d{3})\\d{6}|8\\d{6}(?:\\d{2})?",
          [7, 9, 10],
          0,
          "0",
          0,
          "([25-9]\\d{5})$|0|180020",
          "1481$1",
          0,
          0,
          [
            ["1481[25-9]\\d{5}", [10]],
            ["7(?:(?:781|839)\\d|911[17])\\d{5}", [10]],
            ["80[08]\\d{7}|800\\d{6}|8001111"],
            [
              "(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[0-3]))\\d{7}|845464\\d",
              [7, 10],
            ],
            ["70\\d{8}", [10]],
            0,
            ["(?:3[0347]|55)\\d{8}", [10]],
            [
              "76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}",
              [10],
            ],
            ["56\\d{8}", [10]],
          ],
        ],
        GH: [
          "233",
          "00",
          "(?:[235]\\d{3}|800)\\d{5}",
          [8, 9],
          [
            ["(\\d{3})(\\d{5})", "$1 $2", ["8"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[235]"], "0$1"],
          ],
          "0",
        ],
        GI: [
          "350",
          "00",
          "(?:[25]\\d|60)\\d{6}",
          [8],
          [["(\\d{3})(\\d{5})", "$1 $2", ["2"]]],
        ],
        GL: [
          "299",
          "00",
          "(?:19|[2-689]\\d|70)\\d{4}",
          [6],
          [["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["19|[2-9]"]]],
        ],
        GM: [
          "220",
          "00",
          "[2-9]\\d{6}",
          [7],
          [["(\\d{3})(\\d{4})", "$1 $2", ["[2-9]"]]],
        ],
        GN: [
          "224",
          "00",
          "722\\d{6}|(?:3|6\\d)\\d{7}",
          [8, 9],
          [
            ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["3"]],
            ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[67]"]],
          ],
        ],
        GP: [
          "590",
          "00",
          "(?:590\\d|7090)\\d{5}|(?:69|80|9\\d)\\d{7}",
          [9],
          [
            [
              "(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[5-79]"],
              "0$1",
            ],
            ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"],
          ],
          "0",
          0,
          0,
          0,
          0,
          0,
          [
            [
              "590(?:0[1-68]|[14][0-24-9]|2[0-68]|3[1-9]|5[3-579]|[68][0-689]|7[08]|9\\d)\\d{4}",
            ],
            [
              "(?:69(?:0\\d\\d|1(?:2[2-9]|3[0-5])|4(?:0[89]|1[2-6]|9\\d)|6(?:1[016-9]|5[0-4]|[67]\\d))|7090[0-4])\\d{4}",
            ],
            ["80[0-5]\\d{6}"],
            0,
            0,
            0,
            0,
            0,
            ["9(?:(?:39[5-7]|76[018])\\d|475[0-6])\\d{4}"],
          ],
        ],
        GQ: [
          "240",
          "00",
          "222\\d{6}|(?:3\\d|55|[89]0)\\d{7}",
          [9],
          [
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[235]"]],
            ["(\\d{3})(\\d{6})", "$1 $2", ["[89]"]],
          ],
        ],
        GR: [
          "30",
          "00",
          "5005000\\d{3}|8\\d{9,11}|(?:[269]\\d|70)\\d{8}",
          [10, 11, 12],
          [
            ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["21|7"]],
            [
              "(\\d{4})(\\d{6})",
              "$1 $2",
              ["2(?:2|3[2-57-9]|4[2-469]|5[2-59]|6[2-9]|7[2-69]|8[2-49])|5"],
            ],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2689]"]],
            ["(\\d{3})(\\d{3,4})(\\d{5})", "$1 $2 $3", ["8"]],
          ],
        ],
        GT: [
          "502",
          "00",
          "80\\d{6}|(?:1\\d{3}|[2-7])\\d{7}",
          [8, 11],
          [
            ["(\\d{4})(\\d{4})", "$1 $2", ["[2-8]"]],
            ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]],
          ],
        ],
        GU: [
          "1",
          "011",
          "(?:[58]\\d\\d|671|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2-9]\\d{6})$|1",
          "671$1",
          0,
          "671",
        ],
        GW: [
          "245",
          "00",
          "[49]\\d{8}|4\\d{6}",
          [7, 9],
          [
            ["(\\d{3})(\\d{4})", "$1 $2", ["40"]],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[49]"]],
          ],
        ],
        GY: [
          "592",
          "001",
          "(?:[2-8]\\d{3}|9008)\\d{3}",
          [7],
          [["(\\d{3})(\\d{4})", "$1 $2", ["[2-9]"]]],
        ],
        HK: [
          "852",
          "00(?:30|5[09]|[126-9]?)",
          "8[0-46-9]\\d{6,7}|9\\d{4,7}|(?:[2-7]|9\\d{3})\\d{7}",
          [5, 6, 7, 8, 9, 11],
          [
            ["(\\d{3})(\\d{2,5})", "$1 $2", ["900", "9003"]],
            ["(\\d{4})(\\d{4})", "$1 $2", ["[2-7]|8[1-4]|9(?:0[1-9]|[1-8])"]],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]],
            ["(\\d{3})(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]],
          ],
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          "00",
        ],
        HN: [
          "504",
          "00",
          "8\\d{10}|[237-9]\\d{7}",
          [8, 11],
          [["(\\d{4})(\\d{4})", "$1-$2", ["[237-9]"]]],
        ],
        HR: [
          "385",
          "00",
          "[2-69]\\d{8}|80\\d{5,7}|[1-79]\\d{7}|6\\d{6}",
          [7, 8, 9],
          [
            ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["6[01]"], "0$1"],
            ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["8"], "0$1"],
            ["(\\d)(\\d{4})(\\d{3})", "$1 $2 $3", ["1"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["6|7[245]"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["9"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-57]"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"], "0$1"],
          ],
          "0",
        ],
        HT: [
          "509",
          "00",
          "[2-589]\\d{7}",
          [8],
          [["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["[2-589]"]]],
        ],
        HU: [
          "36",
          "00",
          "[235-7]\\d{8}|[1-9]\\d{7}",
          [8, 9],
          [
            ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "(06 $1)"],
            [
              "(\\d{2})(\\d{3})(\\d{3})",
              "$1 $2 $3",
              ["[27][2-9]|3[2-7]|4[24-9]|5[2-79]|6|8[2-57-9]|9[2-69]"],
              "(06 $1)",
            ],
            ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-9]"], "06 $1"],
          ],
          "06",
        ],
        ID: [
          "62",
          "00[89]",
          "00[1-9]\\d{9,14}|(?:[1-36]|8\\d{5})\\d{6}|00\\d{9}|[1-9]\\d{8,10}|[2-9]\\d{7}",
          [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
          [
            ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["15"]],
            ["(\\d{2})(\\d{5,9})", "$1 $2", ["2[124]|[36]1"], "(0$1)"],
            ["(\\d{3})(\\d{5,7})", "$1 $2", ["800"], "0$1"],
            ["(\\d{3})(\\d{5,8})", "$1 $2", ["[2-79]"], "(0$1)"],
            ["(\\d{3})(\\d{3,4})(\\d{3})", "$1-$2-$3", ["8[1-35-9]"], "0$1"],
            ["(\\d{3})(\\d{6,8})", "$1 $2", ["1"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["804"], "0$1"],
            ["(\\d{3})(\\d)(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["80"], "0$1"],
            ["(\\d{3})(\\d{4})(\\d{4,5})", "$1-$2-$3", ["8"], "0$1"],
          ],
          "0",
        ],
        IE: [
          "353",
          "00",
          "(?:1\\d|[2569])\\d{6,8}|4\\d{6,9}|7\\d{8}|8\\d{8,9}",
          [7, 8, 9, 10],
          [
            [
              "(\\d{2})(\\d{5})",
              "$1 $2",
              ["2[24-9]|47|58|6[237-9]|9[35-9]"],
              "(0$1)",
            ],
            ["(\\d{3})(\\d{5})", "$1 $2", ["[45]0"], "(0$1)"],
            ["(\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["1"], "(0$1)"],
            [
              "(\\d{2})(\\d{3})(\\d{3,4})",
              "$1 $2 $3",
              ["[2569]|4[1-69]|7[14]"],
              "(0$1)",
            ],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["70"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["81"], "(0$1)"],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[78]"], "0$1"],
            ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]],
            ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["4"], "(0$1)"],
            ["(\\d{2})(\\d)(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["8"], "0$1"],
          ],
          "0",
        ],
        IL: [
          "972",
          "0(?:0|1[2-9])",
          "1\\d{6}(?:\\d{3,5})?|[57]\\d{8}|[1-489]\\d{7}",
          [7, 8, 9, 10, 11, 12],
          [
            ["(\\d{4})(\\d{3})", "$1-$2", ["125"]],
            ["(\\d{4})(\\d{2})(\\d{2})", "$1-$2-$3", ["121"]],
            ["(\\d)(\\d{3})(\\d{4})", "$1-$2-$3", ["[2-489]"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["[57]"], "0$1"],
            ["(\\d{4})(\\d{3})(\\d{3})", "$1-$2-$3", ["12"]],
            ["(\\d{4})(\\d{6})", "$1-$2", ["159"]],
            ["(\\d)(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3-$4", ["1[7-9]"]],
            ["(\\d{3})(\\d{1,2})(\\d{3})(\\d{4})", "$1-$2 $3-$4", ["15"]],
          ],
          "0",
        ],
        IM: [
          "44",
          "00",
          "1624\\d{6}|(?:[3578]\\d|90)\\d{8}",
          [10],
          0,
          "0",
          0,
          "([25-8]\\d{5})$|0|180020",
          "1624$1",
          0,
          "74576|(?:16|7[56])24",
        ],
        IN: [
          "91",
          "00",
          "(?:000800|[2-9]\\d\\d)\\d{7}|1\\d{7,12}",
          [8, 9, 10, 11, 12, 13],
          [
            [
              "(\\d{8})",
              "$1",
              [
                "5(?:0|2[23]|3[03]|[67]1|88)",
                "5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|888)",
                "5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|8888)",
              ],
              0,
              1,
            ],
            ["(\\d{4})(\\d{4,5})", "$1 $2", ["180", "1800"], 0, 1],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["140"], 0, 1],
            [
              "(\\d{2})(\\d{4})(\\d{4})",
              "$1 $2 $3",
              [
                "11|2[02]|33|4[04]|79[1-7]|80[2-46]",
                "11|2[02]|33|4[04]|79(?:[1-6]|7[19])|80(?:[2-4]|6[0-589])",
                "11|2[02]|33|4[04]|79(?:[124-6]|3(?:[02-9]|1[0-24-9])|7(?:1|9[1-6]))|80(?:[2-4]|6[0-589])",
              ],
              "0$1",
              1,
            ],
            [
              "(\\d{3})(\\d{3})(\\d{4})",
              "$1 $2 $3",
              [
                "1(?:2[0-249]|3[0-25]|4[145]|[68]|7[1257])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|5[12]|[78]1)|6(?:12|[2-4]1|5[17]|6[13]|80)|7(?:12|3[134]|4[47]|61|88)|8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91)|(?:43|59|75)[15]|(?:1[59]|29|67|72)[14]",
                "1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|674|7(?:(?:2[14]|3[34]|5[15])[2-6]|61[346]|88[0-8])|8(?:70[2-6]|84[235-7]|91[3-7])|(?:1(?:29|60|8[06])|261|552|6(?:12|[2-47]1|5[17]|6[13]|80)|7(?:12|31|4[47])|8(?:16|2[014]|3[126]|6[136]|7[78]|83))[2-7]",
                "1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|6(?:12(?:[2-6]|7[0-8])|74[2-7])|7(?:(?:2[14]|5[15])[2-6]|3171|61[346]|88(?:[2-7]|82))|8(?:70[2-6]|84(?:[2356]|7[19])|91(?:[3-6]|7[19]))|73[134][2-6]|(?:74[47]|8(?:16|2[014]|3[126]|6[136]|7[78]|83))(?:[2-6]|7[19])|(?:1(?:29|60|8[06])|261|552|6(?:[2-4]1|5[17]|6[13]|7(?:1|4[0189])|80)|7(?:12|88[01]))[2-7]",
              ],
              "0$1",
              1,
            ],
            [
              "(\\d{4})(\\d{3})(\\d{3})",
              "$1 $2 $3",
              [
                "1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2[2457-9]|3[2-5]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1[013-9]|28|3[129]|4[1-35689]|5[29]|6[02-5]|70)|807",
                "1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2(?:[2457]|84|95)|3(?:[2-4]|55)|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1(?:[013-8]|9[6-9])|28[6-8]|3(?:17|2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4|5[0-367])|70[13-7])|807[19]",
                "1(?:[2-479]|5(?:[0236-9]|5[013-9]))|[2-5]|6(?:2(?:84|95)|355|8(?:28[235-7]|3))|73179|807(?:1|9[1-3])|(?:1552|6(?:(?:1[1358]|2[2457]|3[2-4]|4[235-7]|5[2-689]|6[24578]|7[235689])\\d|8(?:[14-6]\\d|2[0-79]))|7(?:1(?:[013-8]\\d|9[6-9])|28[6-8]|3(?:2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]\\d|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4\\d|5[0-367])|70[13-7]))[2-7]",
              ],
              "0$1",
              1,
            ],
            ["(\\d{5})(\\d{5})", "$1 $2", ["16|[6-9]"], "0$1", 1],
            [
              "(\\d{4})(\\d{2,4})(\\d{4})",
              "$1 $2 $3",
              ["18[06]", "18[06]0"],
              0,
              1,
            ],
            ["(\\d{4})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["18"], 0, 1],
          ],
          "0",
        ],
        IO: [
          "246",
          "00",
          "3\\d{6}",
          [7],
          [["(\\d{3})(\\d{4})", "$1 $2", ["3"]]],
        ],
        IQ: [
          "964",
          "00",
          "(?:1|7\\d\\d)\\d{7}|[2-6]\\d{7,8}",
          [8, 9, 10],
          [
            ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-6]"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"],
          ],
          "0",
        ],
        IR: [
          "98",
          "00",
          "[1-9]\\d{9}|(?:[1-8]\\d\\d|9)\\d{3,4}",
          [4, 5, 6, 7, 10],
          [
            ["(\\d{4,5})", "$1", ["96"], "0$1"],
            [
              "(\\d{2})(\\d{4,5})",
              "$1 $2",
              [
                "(?:1[137]|2[13-68]|3[1458]|4[145]|5[1468]|6[16]|7[1467]|8[13467])[12689]",
              ],
              "0$1",
            ],
            ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["9"], "0$1"],
            ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["[1-8]"], "0$1"],
          ],
          "0",
        ],
        IS: [
          "354",
          "00|1(?:0(?:01|[12]0)|100)",
          "(?:38\\d|[4-9])\\d{6}",
          [7, 9],
          [
            ["(\\d{3})(\\d{4})", "$1 $2", ["[4-9]"]],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["3"]],
          ],
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          "00",
        ],
        IT: [
          "39",
          "00",
          "0\\d{5,11}|1\\d{8,10}|3(?:[0-8]\\d{7,10}|9\\d{7,8})|(?:43|55|70)\\d{8}|8\\d{5}(?:\\d{2,4})?",
          [6, 7, 8, 9, 10, 11, 12],
          [
            ["(\\d{2})(\\d{4,6})", "$1 $2", ["0[26]"]],
            [
              "(\\d{3})(\\d{3,6})",
              "$1 $2",
              [
                "0[13-57-9][0159]|8(?:03|4[17]|9[2-5])",
                "0[13-57-9][0159]|8(?:03|4[17]|9(?:2|3[04]|[45][0-4]))",
              ],
            ],
            ["(\\d{4})(\\d{2,6})", "$1 $2", ["0(?:[13-579][2-46-8]|8[236-8])"]],
            ["(\\d{4})(\\d{4})", "$1 $2", ["894"]],
            ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[26]|5"]],
            [
              "(\\d{3})(\\d{3})(\\d{3,4})",
              "$1 $2 $3",
              ["1(?:44|[679])|[378]|43"],
            ],
            ["(\\d{3})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[13-57-9][0159]|14"]],
            ["(\\d{2})(\\d{4})(\\d{5})", "$1 $2 $3", ["0[26]"]],
            ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["0"]],
            ["(\\d{3})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["[03]"]],
          ],
          0,
          0,
          0,
          0,
          0,
          0,
          [
            [
              "0(?:669[0-79]\\d{1,6}|831\\d{2,8})|0(?:1(?:[0159]\\d|[27][1-5]|31|4[1-4]|6[1356]|8[2-57])|2\\d\\d|3(?:[0159]\\d|2[1-4]|3[12]|[48][1-6]|6[2-59]|7[1-7])|4(?:[0159]\\d|[23][1-9]|4[245]|6[1-5]|7[1-4]|81)|5(?:[0159]\\d|2[1-5]|3[2-6]|4[1-79]|6[4-6]|7[1-578]|8[3-8])|6(?:[0-57-9]\\d|6[0-8])|7(?:[0159]\\d|2[12]|3[1-7]|4[2-46]|6[13569]|7[13-6]|8[1-59])|8(?:[0159]\\d|2[3-578]|3[2356]|[6-8][1-5])|9(?:[0159]\\d|[238][1-5]|4[12]|6[1-8]|7[1-6]))\\d{2,7}",
            ],
            ["3[2-9]\\d{7,8}|(?:31|43)\\d{8}", [9, 10]],
            ["80(?:0\\d{3}|3)\\d{3}", [6, 9]],
            [
              "(?:0878\\d{3}|89(?:2\\d|3[04]|4(?:[0-4]|[5-9]\\d\\d)|5[0-4]))\\d\\d|(?:1(?:44|6[346])|89(?:38|5[5-9]|9))\\d{6}",
              [6, 8, 9, 10],
            ],
            ["1(?:78\\d|99)\\d{6}", [9, 10]],
            ["3[2-8]\\d{9,10}", [11, 12]],
            0,
            0,
            ["55\\d{8}", [10]],
            ["84(?:[08]\\d{3}|[17])\\d{3}", [6, 9]],
          ],
        ],
        JE: [
          "44",
          "00",
          "1534\\d{6}|(?:[3578]\\d|90)\\d{8}",
          [10],
          0,
          "0",
          0,
          "([0-24-8]\\d{5})$|0|180020",
          "1534$1",
          0,
          0,
          [
            ["1534[0-24-8]\\d{5}"],
            ["7(?:(?:(?:50|82)9|937)\\d|7(?:00[378]|97\\d))\\d{5}"],
            ["80(?:07(?:35|81)|8901)\\d{4}"],
            [
              "(?:8(?:4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|90(?:066[59]|1810|71(?:07|55)))\\d{4}",
            ],
            ["701511\\d{4}"],
            0,
            [
              "(?:3(?:0(?:07(?:35|81)|8901)|3\\d{4}|4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|55\\d{4})\\d{4}",
            ],
            [
              "76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}",
            ],
            ["56\\d{8}"],
          ],
        ],
        JM: [
          "1",
          "011",
          "(?:[58]\\d\\d|658|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          0,
          0,
          0,
          "658|876",
        ],
        JO: [
          "962",
          "00",
          "(?:(?:[2689]|7\\d)\\d|32|427|53)\\d{6}",
          [8, 9],
          [
            ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2356]|87"], "(0$1)"],
            ["(\\d{3})(\\d{5,6})", "$1 $2", ["[89]"], "0$1"],
            ["(\\d{2})(\\d{7})", "$1 $2", ["70"], "0$1"],
            ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["[47]"], "0$1"],
          ],
          "0",
        ],
        JP: [
          "81",
          "010",
          "00[1-9]\\d{6,14}|[25-9]\\d{9}|(?:00|[1-9]\\d\\d)\\d{6}",
          [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
          [
            ["(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3", ["(?:12|57|99)0"], "0$1"],
            [
              "(\\d{4})(\\d)(\\d{4})",
              "$1-$2-$3",
              [
                "1(?:26|3[79]|4[56]|5[4-68]|6[3-5])|499|5(?:76|97)|746|8(?:3[89]|47|51)|9(?:80|9[16])",
                "1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:76|97)9|7468|8(?:3(?:8[7-9]|96)|477|51[2-9])|9(?:802|9(?:1[23]|69))|1(?:45|58)[67]",
                "1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:769|979[2-69])|7468|8(?:3(?:8[7-9]|96[2457-9])|477|51[2-9])|9(?:802|9(?:1[23]|69))|1(?:45|58)[67]",
              ],
              "0$1",
            ],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["60"], "0$1"],
            [
              "(\\d)(\\d{4})(\\d{4})",
              "$1-$2-$3",
              [
                "3|4(?:2[09]|7[01])|6[1-9]",
                "3|4(?:2(?:0|9[02-69])|7(?:0[019]|1))|6[1-9]",
              ],
              "0$1",
            ],
            [
              "(\\d{2})(\\d{3})(\\d{4})",
              "$1-$2-$3",
              [
                "1(?:1|5[45]|77|88|9[69])|2(?:2[1-37]|3[0-269]|4[59]|5|6[24]|7[1-358]|8[1369]|9[0-38])|4(?:[28][1-9]|3[0-57]|[45]|6[248]|7[2-579]|9[29])|5(?:2|3[0459]|4[0-369]|5[29]|8[02389]|9[0-389])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9[2-6])|8(?:2[124589]|3[26-9]|49|51|6|7[0-468]|8[68]|9[019])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9[1-489])",
                "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2(?:[127]|3[014-9])|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9[19])|62|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|8[1-9]|9[29])|5(?:2|3(?:[045]|9[0-8])|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0-2469])|3(?:[29]|60)|49|51|6(?:[0-24]|36|5[0-3589]|7[23]|9[01459])|7[0-468]|8[68])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9(?:[1289]|3[34]|4[0178]))|(?:264|837)[016-9]|2(?:57|93)[015-9]|(?:25[0468]|422|838)[01]|(?:47[59]|59[89]|8(?:6[68]|9))[019]",
                "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2[127]|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9(?:17|99))|6(?:2|4[016-9])|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|9[29])|5(?:2|3(?:[045]|9(?:[0-58]|6[4-9]|7[0-35689]))|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0169])|3(?:[29]|60|7(?:[017-9]|6[6-8]))|49|51|6(?:[0-24]|36[2-57-9]|5(?:[0-389]|5[23])|6(?:[01]|9[178])|7(?:2[2-468]|3[78])|9[0145])|7[0-468]|8[68])|9(?:4[15]|5[138]|7[156]|8[189]|9(?:[1289]|3(?:31|4[357])|4[0178]))|(?:8294|96)[1-3]|2(?:57|93)[015-9]|(?:223|8699)[014-9]|(?:25[0468]|422|838)[01]|(?:48|8292|9[23])[1-9]|(?:47[59]|59[89]|8(?:68|9))[019]",
              ],
              "0$1",
            ],
            [
              "(\\d{3})(\\d{2})(\\d{4})",
              "$1-$2-$3",
              ["[14]|[289][2-9]|5[3-9]|7[2-4679]"],
              "0$1",
            ],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["800"], "0$1"],
            ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["[25-9]"], "0$1"],
          ],
          "0",
          0,
          "(000[2569]\\d{4,6})$|(?:(?:003768)0?)|0",
          "$1",
        ],
        KE: [
          "254",
          "000",
          "(?:[17]\\d\\d|900)\\d{6}|(?:2|80)0\\d{6,7}|[4-6]\\d{6,8}",
          [7, 8, 9, 10],
          [
            ["(\\d{2})(\\d{5,7})", "$1 $2", ["[24-6]"], "0$1"],
            ["(\\d{3})(\\d{6})", "$1 $2", ["[17]"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[89]"], "0$1"],
          ],
          "0",
        ],
        KG: [
          "996",
          "00",
          "8\\d{9}|[235-9]\\d{8}",
          [9, 10],
          [
            ["(\\d{4})(\\d{5})", "$1 $2", ["3(?:1[346]|[24-79])"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[235-79]|88"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d)(\\d{2,3})", "$1 $2 $3 $4", ["8"], "0$1"],
          ],
          "0",
        ],
        KH: [
          "855",
          "00[14-9]",
          "1\\d{9}|[1-9]\\d{7,8}",
          [8, 9, 10],
          [
            ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-9]"], "0$1"],
            ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]],
          ],
          "0",
        ],
        KI: [
          "686",
          "00",
          "(?:[37]\\d|6[0-79])\\d{6}|(?:[2-48]\\d|50)\\d{3}",
          [5, 8],
          0,
          "0",
        ],
        KM: [
          "269",
          "00",
          "[3478]\\d{6}",
          [7],
          [["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[3478]"]]],
        ],
        KN: [
          "1",
          "011",
          "(?:[58]\\d\\d|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2-7]\\d{6})$|1",
          "869$1",
          0,
          "869",
        ],
        KP: [
          "850",
          "00|99",
          "85\\d{6}|(?:19\\d|[2-7])\\d{7}",
          [8, 10],
          [
            ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"], "0$1"],
            ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-7]"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"],
          ],
          "0",
        ],
        KR: [
          "82",
          "00(?:[125689]|3(?:[46]5|91)|7(?:00|27|3|55|6[126]))",
          "00[1-9]\\d{8,11}|(?:[12]|5\\d{3})\\d{7}|[13-6]\\d{9}|(?:[1-6]\\d|80)\\d{7}|[3-6]\\d{4,5}|(?:00|7)0\\d{8}",
          [5, 6, 8, 9, 10, 11, 12, 13, 14],
          [
            [
              "(\\d{2})(\\d{3,4})",
              "$1-$2",
              ["(?:3[1-3]|[46][1-4]|5[1-5])1"],
              "0$1",
            ],
            ["(\\d{4})(\\d{4})", "$1-$2", ["1"]],
            ["(\\d)(\\d{3,4})(\\d{4})", "$1-$2-$3", ["2"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["[36]0|8"], "0$1"],
            [
              "(\\d{2})(\\d{3,4})(\\d{4})",
              "$1-$2-$3",
              ["[1346]|5[1-5]"],
              "0$1",
            ],
            ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["[57]"], "0$1"],
            ["(\\d{2})(\\d{5})(\\d{4})", "$1-$2-$3", ["5"], "0$1"],
          ],
          "0",
          0,
          "0(8(?:[1-46-8]|5\\d\\d))?",
        ],
        KW: [
          "965",
          "00",
          "18\\d{5}|(?:[2569]\\d|41)\\d{6}",
          [7, 8],
          [
            ["(\\d{4})(\\d{3,4})", "$1 $2", ["[169]|2(?:[235]|4[1-35-9])|52"]],
            ["(\\d{3})(\\d{5})", "$1 $2", ["[245]"]],
          ],
        ],
        KY: [
          "1",
          "011",
          "(?:345|[58]\\d\\d|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2-9]\\d{6})$|1",
          "345$1",
          0,
          "345",
        ],
        KZ: [
          "7",
          "810",
          "(?:33622|8\\d{8})\\d{5}|[78]\\d{9}",
          [10, 14],
          0,
          "8",
          0,
          0,
          0,
          0,
          "33622|7",
          0,
          "8~10",
        ],
        LA: [
          "856",
          "00",
          "[23]\\d{9}|3\\d{8}|(?:[235-8]\\d|41)\\d{6}",
          [8, 9, 10],
          [
            [
              "(\\d{2})(\\d{3})(\\d{3})",
              "$1 $2 $3",
              ["2[13]|3[14]|[4-8]"],
              "0$1",
            ],
            ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["3"], "0$1"],
            [
              "(\\d{2})(\\d{2})(\\d{3})(\\d{3})",
              "$1 $2 $3 $4",
              ["[23]"],
              "0$1",
            ],
          ],
          "0",
        ],
        LB: [
          "961",
          "00",
          "[27-9]\\d{7}|[13-9]\\d{6}",
          [7, 8],
          [
            [
              "(\\d)(\\d{3})(\\d{3})",
              "$1 $2 $3",
              ["[13-69]|7(?:[2-57]|62|8[0-6]|9[04-9])|8[02-9]"],
              "0$1",
            ],
            ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[27-9]"]],
          ],
          "0",
        ],
        LC: [
          "1",
          "011",
          "(?:[58]\\d\\d|758|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2-8]\\d{6})$|1",
          "758$1",
          0,
          "758",
        ],
        LI: [
          "423",
          "00",
          "[68]\\d{8}|(?:[2378]\\d|90)\\d{5}",
          [7, 9],
          [
            [
              "(\\d{3})(\\d{2})(\\d{2})",
              "$1 $2 $3",
              ["[2379]|8(?:0[09]|7)", "[2379]|8(?:0(?:02|9)|7)"],
            ],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["69"]],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]],
          ],
          "0",
          0,
          "(1001)|0",
        ],
        LK: [
          "94",
          "00",
          "[1-9]\\d{8}",
          [9],
          [
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[1-689]"], "0$1"],
          ],
          "0",
        ],
        LR: [
          "231",
          "00",
          "(?:[2457]\\d|33|88)\\d{7}|(?:2\\d|[4-6])\\d{6}",
          [7, 8, 9],
          [
            ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["4[67]|[56]"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-578]"], "0$1"],
          ],
          "0",
        ],
        LS: [
          "266",
          "00",
          "(?:[256]\\d\\d|800)\\d{5}",
          [8],
          [["(\\d{4})(\\d{4})", "$1 $2", ["[2568]"]]],
        ],
        LT: [
          "370",
          "00",
          "(?:[3469]\\d|52|[78]0)\\d{6}",
          [8],
          [
            ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["52[0-7]"], "(0-$1)", 1],
            ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[7-9]"], "0 $1", 1],
            ["(\\d{2})(\\d{6})", "$1 $2", ["37|4(?:[15]|6[1-8])"], "(0-$1)", 1],
            ["(\\d{3})(\\d{5})", "$1 $2", ["[3-6]"], "(0-$1)", 1],
          ],
          "0",
          0,
          "[08]",
        ],
        LU: [
          "352",
          "00",
          "35[013-9]\\d{4,8}|6\\d{8}|35\\d{2,4}|(?:[2457-9]\\d|3[0-46-9])\\d{2,9}",
          [4, 5, 6, 7, 8, 9, 10, 11],
          [
            [
              "(\\d{2})(\\d{3})",
              "$1 $2",
              [
                "2(?:0[2-689]|[2-9])|[3-57]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])",
              ],
            ],
            [
              "(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3",
              [
                "2(?:0[2-689]|[2-9])|[3-57]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])",
              ],
            ],
            ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["20[2-689]"]],
            [
              "(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})",
              "$1 $2 $3 $4",
              ["2(?:[0367]|4[3-8])"],
            ],
            ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["80[01]|90[015]"]],
            ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["20"]],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]],
            [
              "(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})",
              "$1 $2 $3 $4 $5",
              ["2(?:[0367]|4[3-8])"],
            ],
            [
              "(\\d{2})(\\d{2})(\\d{2})(\\d{1,5})",
              "$1 $2 $3 $4",
              ["[3-57]|8[13-9]|9(?:0[89]|[2-579])|(?:2|80)[2-9]"],
            ],
          ],
          0,
          0,
          "(15(?:0[06]|1[12]|[35]5|4[04]|6[26]|77|88|99)\\d)",
        ],
        LV: [
          "371",
          "00",
          "(?:[268]\\d|78|90)\\d{6}",
          [8],
          [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2679]|8[01]"]]],
        ],
        LY: [
          "218",
          "00",
          "[2-9]\\d{8}",
          [9],
          [["(\\d{2})(\\d{7})", "$1-$2", ["[2-9]"], "0$1"]],
          "0",
        ],
        MA: [
          "212",
          "00",
          "[5-8]\\d{8}",
          [9],
          [
            [
              "(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["5[45]"],
              "0$1",
            ],
            [
              "(\\d{4})(\\d{5})",
              "$1-$2",
              ["5(?:[19]|2[2-46-9]|3[3-9])|8(?:0[89]|92)"],
              "0$1",
            ],
            ["(\\d{2})(\\d{7})", "$1-$2", ["8"], "0$1"],
            ["(\\d{3})(\\d{6})", "$1-$2", ["[5-7]"], "0$1"],
          ],
          "0",
          0,
          0,
          0,
          0,
          0,
          [
            [
              "5(?:(?:18|4[0679]|5[03])\\d|2(?:[0-25-79]\\d|3[1-578]|4[02-46-8]|8[0235-7])|3(?:[0-47]\\d|5[02-9]|6[02-8]|8[014-9]|9[3-9]))\\d{5}",
            ],
            [
              "(?:6(?:[0-79]\\d|8[0-247-9])|7(?:[016-8]\\d|2[0-8]|5[0-5]))\\d{6}",
            ],
            ["80[0-7]\\d{6}"],
            ["89\\d{7}"],
            0,
            0,
            0,
            0,
            ["(?:592(?:4[0-2]|93)|80[89]\\d\\d)\\d{4}"],
          ],
        ],
        MC: [
          "377",
          "00",
          "(?:[3489]|[67]\\d)\\d{7}",
          [8, 9],
          [
            ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["4"], "0$1"],
            ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[389]"]],
            [
              "(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4 $5",
              ["[67]"],
              "0$1",
            ],
          ],
          "0",
        ],
        MD: [
          "373",
          "00",
          "(?:[235-7]\\d|[89]0)\\d{6}",
          [8],
          [
            ["(\\d{3})(\\d{5})", "$1 $2", ["[89]"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["22|3"], "0$1"],
            ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[25-7]"], "0$1"],
          ],
          "0",
        ],
        ME: [
          "382",
          "00",
          "(?:20|[3-79]\\d)\\d{6}|80\\d{6,7}",
          [8, 9],
          [["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-9]"], "0$1"]],
          "0",
        ],
        MF: [
          "590",
          "00",
          "(?:590\\d|7090)\\d{5}|(?:69|80|9\\d)\\d{7}",
          [9],
          0,
          "0",
          0,
          0,
          0,
          0,
          0,
          [
            ["590(?:0[079]|[14]3|[27][79]|3[03-7]|5[0-268]|87)\\d{4}"],
            [
              "(?:69(?:0\\d\\d|1(?:2[2-9]|3[0-5])|4(?:0[89]|1[2-6]|9\\d)|6(?:1[016-9]|5[0-4]|[67]\\d))|7090[0-4])\\d{4}",
            ],
            ["80[0-5]\\d{6}"],
            0,
            0,
            0,
            0,
            0,
            ["9(?:(?:39[5-7]|76[018])\\d|475[0-6])\\d{4}"],
          ],
        ],
        MG: [
          "261",
          "00",
          "[23]\\d{8}",
          [9],
          [
            [
              "(\\d{2})(\\d{2})(\\d{3})(\\d{2})",
              "$1 $2 $3 $4",
              ["[23]"],
              "0$1",
            ],
          ],
          "0",
          0,
          "([24-9]\\d{6})$|0",
          "20$1",
        ],
        MH: [
          "692",
          "011",
          "329\\d{4}|(?:[256]\\d|45)\\d{5}",
          [7],
          [["(\\d{3})(\\d{4})", "$1-$2", ["[2-6]"]]],
          "1",
        ],
        MK: [
          "389",
          "00",
          "[2-578]\\d{7}",
          [8],
          [
            [
              "(\\d)(\\d{3})(\\d{4})",
              "$1 $2 $3",
              ["2|34[47]|4(?:[37]7|5[47]|64)"],
              "0$1",
            ],
            ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[347]"], "0$1"],
            ["(\\d{3})(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[58]"], "0$1"],
          ],
          "0",
        ],
        ML: [
          "223",
          "00",
          "[24-9]\\d{7}",
          [8],
          [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[24-9]"]]],
        ],
        MM: [
          "95",
          "00",
          "1\\d{5,7}|95\\d{6}|(?:[4-7]|9[0-46-9])\\d{6,8}|(?:2|8\\d)\\d{5,8}",
          [6, 7, 8, 9, 10],
          [
            ["(\\d)(\\d{2})(\\d{3})", "$1 $2 $3", ["16|2"], "0$1"],
            [
              "(\\d{2})(\\d{2})(\\d{3})",
              "$1 $2 $3",
              [
                "4(?:[2-46]|5[3-5])|5|6(?:[1-689]|7[235-7])|7(?:[0-4]|5[2-7])|8[1-5]|(?:60|86)[23]",
              ],
              "0$1",
            ],
            [
              "(\\d)(\\d{3})(\\d{3,4})",
              "$1 $2 $3",
              ["[12]|452|678|86", "[12]|452|6788|86"],
              "0$1",
            ],
            [
              "(\\d{2})(\\d{3})(\\d{3,4})",
              "$1 $2 $3",
              ["[4-7]|8[1-35]"],
              "0$1",
            ],
            [
              "(\\d)(\\d{3})(\\d{4,6})",
              "$1 $2 $3",
              ["9(?:2[0-4]|[35-9]|4[137-9])"],
              "0$1",
            ],
            ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"],
            ["(\\d)(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["92"], "0$1"],
            ["(\\d)(\\d{5})(\\d{4})", "$1 $2 $3", ["9"], "0$1"],
          ],
          "0",
        ],
        MN: [
          "976",
          "001",
          "[12]\\d{7,9}|[5-9]\\d{7}",
          [8, 9, 10],
          [
            ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["[12]1"], "0$1"],
            ["(\\d{4})(\\d{4})", "$1 $2", ["[5-9]"]],
            ["(\\d{3})(\\d{5,6})", "$1 $2", ["[12]2[1-3]"], "0$1"],
            [
              "(\\d{4})(\\d{5,6})",
              "$1 $2",
              [
                "[12](?:27|3[2-8]|4[2-68]|5[1-4689])",
                "[12](?:27|3[2-8]|4[2-68]|5[1-4689])[0-3]",
              ],
              "0$1",
            ],
            ["(\\d{5})(\\d{4,5})", "$1 $2", ["[12]"], "0$1"],
          ],
          "0",
        ],
        MO: [
          "853",
          "00",
          "0800\\d{3}|(?:28|[68]\\d)\\d{6}",
          [7, 8],
          [
            ["(\\d{4})(\\d{3})", "$1 $2", ["0"]],
            ["(\\d{4})(\\d{4})", "$1 $2", ["[268]"]],
          ],
        ],
        MP: [
          "1",
          "011",
          "[58]\\d{9}|(?:67|90)0\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2-9]\\d{6})$|1",
          "670$1",
          0,
          "670",
        ],
        MQ: [
          "596",
          "00",
          "(?:596\\d|7091)\\d{5}|(?:69|[89]\\d)\\d{7}",
          [9],
          [
            [
              "(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[5-79]|8(?:0[6-9]|[36])"],
              "0$1",
            ],
            ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"],
          ],
          "0",
        ],
        MR: [
          "222",
          "00",
          "(?:[2-4]\\d\\d|800)\\d{5}",
          [8],
          [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-48]"]]],
        ],
        MS: [
          "1",
          "011",
          "(?:[58]\\d\\d|664|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([34]\\d{6})$|1",
          "664$1",
          0,
          "664",
        ],
        MT: [
          "356",
          "00",
          "3550\\d{4}|(?:[2579]\\d\\d|800)\\d{5}",
          [8],
          [["(\\d{4})(\\d{4})", "$1 $2", ["[2357-9]"]]],
        ],
        MU: [
          "230",
          "0(?:0|[24-7]0|3[03])",
          "(?:[57]|8\\d\\d)\\d{7}|[2-468]\\d{6}",
          [7, 8, 10],
          [
            ["(\\d{3})(\\d{4})", "$1 $2", ["[2-46]|8[013]"]],
            ["(\\d{4})(\\d{4})", "$1 $2", ["[57]"]],
            ["(\\d{5})(\\d{5})", "$1 $2", ["8"]],
          ],
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          "020",
        ],
        MV: [
          "960",
          "0(?:0|19)",
          "(?:800|9[0-57-9]\\d)\\d{7}|[34679]\\d{6}",
          [7, 10],
          [
            ["(\\d{3})(\\d{4})", "$1-$2", ["[34679]"]],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]"]],
          ],
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          "00",
        ],
        MW: [
          "265",
          "00",
          "(?:[1289]\\d|31|77)\\d{7}|1\\d{6}",
          [7, 9],
          [
            ["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["1[2-9]"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"], "0$1"],
            [
              "(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[137-9]"],
              "0$1",
            ],
          ],
          "0",
        ],
        MX: [
          "52",
          "0[09]",
          "[2-9]\\d{9}",
          [10],
          [
            ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["33|5[56]|81"]],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-9]"]],
          ],
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          "00",
        ],
        MY: [
          "60",
          "00",
          "1\\d{8,9}|(?:3\\d|[4-9])\\d{7}",
          [8, 9, 10],
          [
            ["(\\d)(\\d{3})(\\d{4})", "$1-$2 $3", ["[4-79]"], "0$1"],
            [
              "(\\d{2})(\\d{3})(\\d{3,4})",
              "$1-$2 $3",
              [
                "1(?:[02469]|[378][1-9]|53)|8",
                "1(?:[02469]|[37][1-9]|53|8(?:[1-46-9]|5[7-9]))|8",
              ],
              "0$1",
            ],
            ["(\\d)(\\d{4})(\\d{4})", "$1-$2 $3", ["3"], "0$1"],
            ["(\\d)(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3-$4", ["1(?:[367]|80)"]],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2 $3", ["15"], "0$1"],
            ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2 $3", ["1"], "0$1"],
          ],
          "0",
        ],
        MZ: [
          "258",
          "00",
          "(?:2|8\\d)\\d{7}",
          [8, 9],
          [
            ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2|8[2-79]"]],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]],
          ],
        ],
        NA: [
          "264",
          "00",
          "[68]\\d{7,8}",
          [8, 9],
          [
            ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["88"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["6"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["87"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"],
          ],
          "0",
        ],
        NC: [
          "687",
          "00",
          "(?:050|[2-57-9]\\d\\d)\\d{3}",
          [6],
          [["(\\d{2})(\\d{2})(\\d{2})", "$1.$2.$3", ["[02-57-9]"]]],
        ],
        NE: [
          "227",
          "00",
          "[027-9]\\d{7}",
          [8],
          [
            ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["08"]],
            [
              "(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[089]|2[013]|7[0467]"],
            ],
          ],
        ],
        NF: [
          "672",
          "00",
          "[13]\\d{5}",
          [6],
          [
            ["(\\d{2})(\\d{4})", "$1 $2", ["1[0-3]"]],
            ["(\\d)(\\d{5})", "$1 $2", ["[13]"]],
          ],
          0,
          0,
          "([0-258]\\d{4})$",
          "3$1",
        ],
        NG: [
          "234",
          "009",
          "(?:20|9\\d)\\d{8}|[78]\\d{9,13}",
          [10, 11, 12, 13, 14],
          [
            ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[7-9]"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["20[129]"], "0$1"],
            ["(\\d{4})(\\d{2})(\\d{4})", "$1 $2 $3", ["2"], "0$1"],
            ["(\\d{3})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["[78]"], "0$1"],
            ["(\\d{3})(\\d{5})(\\d{5,6})", "$1 $2 $3", ["[78]"], "0$1"],
          ],
          "0",
        ],
        NI: [
          "505",
          "00",
          "(?:1800|[25-8]\\d{3})\\d{4}",
          [8],
          [["(\\d{4})(\\d{4})", "$1 $2", ["[125-8]"]]],
        ],
        NL: [
          "31",
          "00",
          "(?:[124-7]\\d\\d|3(?:[02-9]\\d|1[0-8]))\\d{6}|8\\d{6,9}|9\\d{6,10}|1\\d{4,5}",
          [5, 6, 7, 8, 9, 10, 11],
          [
            ["(\\d{3})(\\d{4,7})", "$1 $2", ["[89]0"], "0$1"],
            ["(\\d{2})(\\d{7})", "$1 $2", ["66"], "0$1"],
            ["(\\d)(\\d{8})", "$1 $2", ["6"], "0$1"],
            [
              "(\\d{3})(\\d{3})(\\d{3})",
              "$1 $2 $3",
              ["1[16-8]|2[259]|3[124]|4[17-9]|5[124679]"],
              "0$1",
            ],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-578]|91"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{5})", "$1 $2 $3", ["9"], "0$1"],
          ],
          "0",
        ],
        NO: [
          "47",
          "00",
          "(?:0|[2-9]\\d{3})\\d{4}",
          [5, 8],
          [
            ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["8"]],
            ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-79]"]],
          ],
          0,
          0,
          0,
          0,
          0,
          "[02-689]|7[0-8]",
        ],
        NP: [
          "977",
          "00",
          "(?:1\\d|9)\\d{9}|[1-9]\\d{7}",
          [8, 10, 11],
          [
            ["(\\d)(\\d{7})", "$1-$2", ["1[2-6]"], "0$1"],
            [
              "(\\d{2})(\\d{6})",
              "$1-$2",
              ["1[01]|[2-8]|9(?:[1-59]|[67][2-6])"],
              "0$1",
            ],
            ["(\\d{3})(\\d{7})", "$1-$2", ["9"]],
          ],
          "0",
        ],
        NR: [
          "674",
          "00",
          "(?:222|444|(?:55|8\\d)\\d|666|777|999)\\d{4}",
          [7],
          [["(\\d{3})(\\d{4})", "$1 $2", ["[24-9]"]]],
        ],
        NU: [
          "683",
          "00",
          "(?:[4-7]|888\\d)\\d{3}",
          [4, 7],
          [["(\\d{3})(\\d{4})", "$1 $2", ["8"]]],
        ],
        NZ: [
          "64",
          "0(?:0|161)",
          "[1289]\\d{9}|50\\d{5}(?:\\d{2,3})?|[27-9]\\d{7,8}|(?:[34]\\d|6[0-35-9])\\d{6}|8\\d{4,6}",
          [5, 6, 7, 8, 9, 10],
          [
            ["(\\d{2})(\\d{3,8})", "$1 $2", ["8[1-79]"], "0$1"],
            [
              "(\\d{3})(\\d{2})(\\d{2,3})",
              "$1 $2 $3",
              ["50[036-8]|8|90", "50(?:[0367]|88)|8|90"],
              "0$1",
            ],
            [
              "(\\d)(\\d{3})(\\d{4})",
              "$1 $2 $3",
              ["24|[346]|7[2-57-9]|9[2-9]"],
              "0$1",
            ],
            [
              "(\\d{3})(\\d{3})(\\d{3,4})",
              "$1 $2 $3",
              ["2(?:10|74)|[589]"],
              "0$1",
            ],
            ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["1|2[028]"], "0$1"],
            [
              "(\\d{2})(\\d{3})(\\d{3,5})",
              "$1 $2 $3",
              ["2(?:[169]|7[0-35-9])|7"],
              "0$1",
            ],
          ],
          "0",
          0,
          0,
          0,
          0,
          0,
          0,
          "00",
        ],
        OM: [
          "968",
          "00",
          "(?:1505|[279]\\d{3}|500)\\d{4}|800\\d{5,6}",
          [7, 8, 9],
          [
            ["(\\d{3})(\\d{4,6})", "$1 $2", ["[58]"]],
            ["(\\d{2})(\\d{6})", "$1 $2", ["2"]],
            ["(\\d{4})(\\d{4})", "$1 $2", ["[179]"]],
          ],
        ],
        PA: [
          "507",
          "00",
          "(?:00800|8\\d{3})\\d{6}|[68]\\d{7}|[1-57-9]\\d{6}",
          [7, 8, 10, 11],
          [
            ["(\\d{3})(\\d{4})", "$1-$2", ["[1-57-9]"]],
            ["(\\d{4})(\\d{4})", "$1-$2", ["[68]"]],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]],
          ],
        ],
        PE: [
          "51",
          "00|19(?:1[124]|77|90)00",
          "(?:[14-8]|9\\d)\\d{7}",
          [8, 9],
          [
            ["(\\d{3})(\\d{5})", "$1 $2", ["80"], "(0$1)"],
            ["(\\d)(\\d{7})", "$1 $2", ["1"], "(0$1)"],
            ["(\\d{2})(\\d{6})", "$1 $2", ["[4-8]"], "(0$1)"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"]],
          ],
          "0",
          0,
          0,
          0,
          0,
          0,
          0,
          "00",
          " Anexo ",
        ],
        PF: [
          "689",
          "00",
          "4\\d{5}(?:\\d{2})?|8\\d{7,8}",
          [6, 8, 9],
          [
            ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["44"]],
            ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["4|8[7-9]"]],
            ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]],
          ],
        ],
        PG: [
          "675",
          "00|140[1-3]",
          "(?:180|[78]\\d{3})\\d{4}|(?:[2-589]\\d|64)\\d{5}",
          [7, 8],
          [
            ["(\\d{3})(\\d{4})", "$1 $2", ["18|[2-69]|85"]],
            ["(\\d{4})(\\d{4})", "$1 $2", ["[78]"]],
          ],
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          "00",
        ],
        PH: [
          "63",
          "00",
          "(?:[2-7]|9\\d)\\d{8}|2\\d{5}|(?:1800|8)\\d{7,9}",
          [6, 8, 9, 10, 11, 12, 13],
          [
            ["(\\d)(\\d{5})", "$1 $2", ["2"], "(0$1)"],
            [
              "(\\d{4})(\\d{4,6})",
              "$1 $2",
              [
                "3(?:23|39|46)|4(?:2[3-6]|[35]9|4[26]|76)|544|88[245]|(?:52|64|86)2",
                "3(?:230|397|461)|4(?:2(?:35|[46]4|51)|396|4(?:22|63)|59[347]|76[15])|5(?:221|446)|642[23]|8(?:622|8(?:[24]2|5[13]))",
              ],
              "(0$1)",
            ],
            [
              "(\\d{5})(\\d{4})",
              "$1 $2",
              ["346|4(?:27|9[35])|883", "3469|4(?:279|9(?:30|56))|8834"],
              "(0$1)",
            ],
            ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2"], "(0$1)"],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[3-7]|8[2-8]"], "(0$1)"],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1"],
            ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]],
            ["(\\d{4})(\\d{1,2})(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["1"]],
          ],
          "0",
        ],
        PK: [
          "92",
          "00",
          "122\\d{6}|[24-8]\\d{10,11}|9(?:[013-9]\\d{8,10}|2(?:[01]\\d\\d|2(?:[06-8]\\d|1[01]))\\d{7})|(?:[2-8]\\d{3}|92(?:[0-7]\\d|8[1-9]))\\d{6}|[24-9]\\d{8}|[89]\\d{7}",
          [8, 9, 10, 11, 12],
          [
            ["(\\d{3})(\\d{3})(\\d{2,7})", "$1 $2 $3", ["[89]0"], "0$1"],
            ["(\\d{4})(\\d{5})", "$1 $2", ["1"]],
            [
              "(\\d{3})(\\d{6,7})",
              "$1 $2",
              [
                "2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:2[2-8]|3[27-9]|4[2-6]|6[3569]|9[25-8])",
                "9(?:2[3-8]|98)|(?:2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:22|3[27-9]|4[2-6]|6[3569]|9[25-7]))[2-9]",
              ],
              "(0$1)",
            ],
            [
              "(\\d{2})(\\d{7,8})",
              "$1 $2",
              ["(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]"],
              "(0$1)",
            ],
            ["(\\d{5})(\\d{5})", "$1 $2", ["58"], "(0$1)"],
            ["(\\d{3})(\\d{7})", "$1 $2", ["3"], "0$1"],
            [
              "(\\d{2})(\\d{3})(\\d{3})(\\d{3})",
              "$1 $2 $3 $4",
              ["2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91"],
              "(0$1)",
            ],
            [
              "(\\d{3})(\\d{3})(\\d{3})(\\d{3})",
              "$1 $2 $3 $4",
              ["[24-9]"],
              "(0$1)",
            ],
          ],
          "0",
        ],
        PL: [
          "48",
          "00",
          "(?:6|8\\d\\d)\\d{7}|[1-9]\\d{6}(?:\\d{2})?|[26]\\d{5}",
          [6, 7, 8, 9, 10],
          [
            ["(\\d{5})", "$1", ["19"]],
            ["(\\d{3})(\\d{3})", "$1 $2", ["11|20|64"]],
            [
              "(\\d{2})(\\d{2})(\\d{3})",
              "$1 $2 $3",
              [
                "(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])1",
                "(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])19",
              ],
            ],
            ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["64"]],
            [
              "(\\d{3})(\\d{3})(\\d{3})",
              "$1 $2 $3",
              ["21|39|45|5[0137]|6[0469]|7[02389]|8(?:0[14]|8)"],
            ],
            [
              "(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["1[2-8]|[2-7]|8[1-79]|9[145]"],
            ],
            ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["8"]],
          ],
        ],
        PM: [
          "508",
          "00",
          "[45]\\d{5}|(?:708|8\\d\\d)\\d{6}",
          [6, 9],
          [
            ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["[45]"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["7"]],
            ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"],
          ],
          "0",
        ],
        PR: [
          "1",
          "011",
          "(?:[589]\\d\\d|787)\\d{7}",
          [10],
          0,
          "1",
          0,
          0,
          0,
          0,
          "787|939",
        ],
        PS: [
          "970",
          "00",
          "[2489]2\\d{6}|(?:1\\d|5)\\d{8}",
          [8, 9, 10],
          [
            ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2489]"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["5"], "0$1"],
            ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]],
          ],
          "0",
        ],
        PT: [
          "351",
          "00",
          "1693\\d{5}|(?:[26-9]\\d|30)\\d{7}",
          [9],
          [
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["2[12]"]],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["16|[236-9]"]],
          ],
        ],
        PW: [
          "680",
          "01[12]",
          "(?:[24-8]\\d\\d|345|900)\\d{4}",
          [7],
          [["(\\d{3})(\\d{4})", "$1 $2", ["[2-9]"]]],
        ],
        PY: [
          "595",
          "00",
          "59\\d{4,6}|9\\d{5,10}|(?:[2-46-8]\\d|5[0-8])\\d{4,7}",
          [6, 7, 8, 9, 10, 11],
          [
            ["(\\d{3})(\\d{3,6})", "$1 $2", ["[2-9]0"], "0$1"],
            [
              "(\\d{2})(\\d{5})",
              "$1 $2",
              ["[26]1|3[289]|4[1246-8]|7[1-3]|8[1-36]"],
              "(0$1)",
            ],
            [
              "(\\d{3})(\\d{4,5})",
              "$1 $2",
              ["2[279]|3[13-5]|4[359]|5|6(?:[34]|7[1-46-8])|7[46-8]|85"],
              "(0$1)",
            ],
            [
              "(\\d{2})(\\d{3})(\\d{3,4})",
              "$1 $2 $3",
              ["2[14-68]|3[26-9]|4[1246-8]|6(?:1|75)|7[1-35]|8[1-36]"],
              "(0$1)",
            ],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["87"]],
            ["(\\d{3})(\\d{6})", "$1 $2", ["9(?:[5-79]|8[1-7])"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-8]"], "0$1"],
            ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["9"]],
          ],
          "0",
        ],
        QA: [
          "974",
          "00",
          "800\\d{4}|(?:2|800)\\d{6}|(?:0080|[3-7])\\d{7}",
          [7, 8, 9, 11],
          [
            ["(\\d{3})(\\d{4})", "$1 $2", ["2[136]|8"]],
            ["(\\d{4})(\\d{4})", "$1 $2", ["[3-7]"]],
          ],
        ],
        RE: [
          "262",
          "00",
          "709\\d{6}|(?:26|[689]\\d)\\d{7}",
          [9],
          [
            [
              "(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[26-9]"],
              "0$1",
            ],
          ],
          "0",
          0,
          0,
          0,
          0,
          0,
          [
            ["26(?:2\\d\\d|3(?:0\\d|1[0-6]))\\d{4}"],
            [
              "(?:69(?:2\\d\\d|3(?:[06][0-6]|1[0-3]|2[0-2]|3[0-39]|4\\d|5[0-5]|7[0-37]|8[0-8]|9[0-479]))|7092[0-3])\\d{4}",
            ],
            ["80\\d{7}"],
            ["89[1-37-9]\\d{6}"],
            0,
            0,
            0,
            0,
            ["9(?:399[0-3]|479[0-6]|76(?:2[278]|3[0-37]))\\d{4}"],
            ["8(?:1[019]|2[0156]|84|90)\\d{6}"],
          ],
        ],
        RO: [
          "40",
          "00",
          "(?:[236-8]\\d|90)\\d{7}|[23]\\d{5}",
          [6, 9],
          [
            ["(\\d{3})(\\d{3})", "$1 $2", ["2[3-6]", "2[3-6]\\d9"], "0$1"],
            ["(\\d{2})(\\d{4})", "$1 $2", ["219|31"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[23]1"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[236-9]"], "0$1"],
          ],
          "0",
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          " int ",
        ],
        RS: [
          "381",
          "00",
          "38[02-9]\\d{6,9}|6\\d{7,9}|90\\d{4,8}|38\\d{5,6}|(?:7\\d\\d|800)\\d{3,9}|(?:[12]\\d|3[0-79])\\d{5,10}",
          [6, 7, 8, 9, 10, 11, 12],
          [
            ["(\\d{3})(\\d{3,9})", "$1 $2", ["(?:2[389]|39)0|[7-9]"], "0$1"],
            ["(\\d{2})(\\d{5,10})", "$1 $2", ["[1-36]"], "0$1"],
          ],
          "0",
        ],
        RU: [
          "7",
          "810",
          "8\\d{13}|[347-9]\\d{9}",
          [10, 14],
          [
            [
              "(\\d{4})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              [
                "7(?:1[0-8]|2[1-9])",
                "7(?:1(?:[0-356]2|4[29]|7|8[27])|2(?:1[23]|[2-9]2))",
                "7(?:1(?:[0-356]2|4[29]|7|8[27])|2(?:13[03-69]|62[013-9]))|72[1-57-9]2",
              ],
              "8 ($1)",
              1,
            ],
            [
              "(\\d{5})(\\d)(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              [
                "7(?:1[0-68]|2[1-9])",
                "7(?:1(?:[06][3-6]|[18]|2[35]|[3-5][3-5])|2(?:[13][3-5]|[24-689]|7[457]))",
                "7(?:1(?:0(?:[356]|4[023])|[18]|2(?:3[013-9]|5)|3[45]|43[013-79]|5(?:3[1-8]|4[1-7]|5)|6(?:3[0-35-9]|[4-6]))|2(?:1(?:3[178]|[45])|[24-689]|3[35]|7[457]))|7(?:14|23)4[0-8]|71(?:33|45)[1-79]",
              ],
              "8 ($1)",
              1,
            ],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "8 ($1)", 1],
            [
              "(\\d{3})(\\d{3})(\\d{2})(\\d{2})",
              "$1 $2-$3-$4",
              ["[349]|8(?:[02-7]|1[1-8])"],
              "8 ($1)",
              1,
            ],
            [
              "(\\d{4})(\\d{4})(\\d{3})(\\d{3})",
              "$1 $2 $3 $4",
              ["8"],
              "8 ($1)",
            ],
          ],
          "8",
          0,
          0,
          0,
          0,
          0,
          [
            [
              "336(?:[013-9]\\d|2[013-9])\\d{5}|(?:3(?:0[12]|4[1-35-79]|5[1-3]|65|8[1-58]|9[0145])|4(?:01|1[1356]|2[13467]|7[1-5]|8[1-7]|9[1-689])|8(?:1[1-8]|2[01]|3[13-6]|4[0-8]|5[15-7]|6[0-35-79]|7[1-37-9]))\\d{7}",
              [10],
            ],
            ["9\\d{9}", [10]],
            ["8(?:0[04]|108\\d{3})\\d{7}"],
            ["80[39]\\d{7}", [10]],
            ["808\\d{7}", [10]],
          ],
          "8~10",
        ],
        RW: [
          "250",
          "00",
          "(?:06|[27]\\d\\d|[89]00)\\d{6}",
          [8, 9],
          [
            ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["0"]],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"]],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[7-9]"], "0$1"],
          ],
          "0",
        ],
        SA: [
          "966",
          "00",
          "(?:[15]\\d|800|92)\\d{7}",
          [9, 10],
          [
            ["(\\d{4})(\\d{5})", "$1 $2", ["9"]],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["5"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]],
          ],
          "0",
        ],
        SB: [
          "677",
          "0[01]",
          "[6-9]\\d{6}|[1-6]\\d{4}",
          [5, 7],
          [["(\\d{2})(\\d{5})", "$1 $2", ["6[89]|7|8[4-9]|9(?:[1-8]|9[0-8])"]]],
        ],
        SC: [
          "248",
          "010|0[0-2]",
          "(?:[2489]\\d|64)\\d{5}",
          [7],
          [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[246]|9[57]"]]],
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          "00",
        ],
        SD: [
          "249",
          "00",
          "[19]\\d{8}",
          [9],
          [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[19]"], "0$1"]],
          "0",
        ],
        SE: [
          "46",
          "00",
          "(?:[26]\\d\\d|9)\\d{9}|[1-9]\\d{8}|[1-689]\\d{7}|[1-4689]\\d{6}|2\\d{5}",
          [6, 7, 8, 9, 10, 12],
          [
            [
              "(\\d{2})(\\d{2,3})(\\d{2})",
              "$1-$2 $3",
              ["20"],
              "0$1",
              0,
              "$1 $2 $3",
            ],
            [
              "(\\d{3})(\\d{4})",
              "$1-$2",
              ["9(?:00|39|44|9)"],
              "0$1",
              0,
              "$1 $2",
            ],
            [
              "(\\d{2})(\\d{3})(\\d{2})",
              "$1-$2 $3",
              ["[12][136]|3[356]|4[0246]|6[03]|90[1-9]"],
              "0$1",
              0,
              "$1 $2 $3",
            ],
            [
              "(\\d)(\\d{2,3})(\\d{2})(\\d{2})",
              "$1-$2 $3 $4",
              ["8"],
              "0$1",
              0,
              "$1 $2 $3 $4",
            ],
            [
              "(\\d{3})(\\d{2,3})(\\d{2})",
              "$1-$2 $3",
              [
                "1[2457]|2(?:[247-9]|5[0138])|3[0247-9]|4[1357-9]|5[0-35-9]|6(?:[125689]|4[02-57]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])",
              ],
              "0$1",
              0,
              "$1 $2 $3",
            ],
            [
              "(\\d{3})(\\d{2,3})(\\d{3})",
              "$1-$2 $3",
              ["9(?:00|39|44)"],
              "0$1",
              0,
              "$1 $2 $3",
            ],
            [
              "(\\d{2})(\\d{2,3})(\\d{2})(\\d{2})",
              "$1-$2 $3 $4",
              ["1[13689]|2[0136]|3[1356]|4[0246]|54|6[03]|90[1-9]"],
              "0$1",
              0,
              "$1 $2 $3 $4",
            ],
            [
              "(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
              "$1-$2 $3 $4",
              ["10|7"],
              "0$1",
              0,
              "$1 $2 $3 $4",
            ],
            [
              "(\\d)(\\d{3})(\\d{3})(\\d{2})",
              "$1-$2 $3 $4",
              ["8"],
              "0$1",
              0,
              "$1 $2 $3 $4",
            ],
            [
              "(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
              "$1-$2 $3 $4",
              [
                "[13-5]|2(?:[247-9]|5[0138])|6(?:[124-689]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])",
              ],
              "0$1",
              0,
              "$1 $2 $3 $4",
            ],
            [
              "(\\d{3})(\\d{2})(\\d{2})(\\d{3})",
              "$1-$2 $3 $4",
              ["9"],
              "0$1",
              0,
              "$1 $2 $3 $4",
            ],
            [
              "(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
              "$1-$2 $3 $4 $5",
              ["[26]"],
              "0$1",
              0,
              "$1 $2 $3 $4 $5",
            ],
          ],
          "0",
        ],
        SG: [
          "65",
          "0[0-3]\\d",
          "(?:(?:1\\d|8)\\d\\d|7000)\\d{7}|[3689]\\d{7}",
          [8, 10, 11],
          [
            ["(\\d{4})(\\d{4})", "$1 $2", ["[369]|8(?:0[1-9]|[1-9])"]],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]],
            ["(\\d{4})(\\d{4})(\\d{3})", "$1 $2 $3", ["7"]],
            ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]],
          ],
        ],
        SH: [
          "290",
          "00",
          "(?:[256]\\d|8)\\d{3}",
          [4, 5],
          0,
          0,
          0,
          0,
          0,
          0,
          "[256]",
        ],
        SI: [
          "386",
          "00|10(?:22|66|88|99)",
          "[1-7]\\d{7}|8\\d{4,7}|90\\d{4,6}",
          [5, 6, 7, 8],
          [
            ["(\\d{2})(\\d{3,6})", "$1 $2", ["8[09]|9"], "0$1"],
            ["(\\d{3})(\\d{5})", "$1 $2", ["59|8"], "0$1"],
            [
              "(\\d{2})(\\d{3})(\\d{3})",
              "$1 $2 $3",
              ["[37][01]|4[0139]|51|6"],
              "0$1",
            ],
            [
              "(\\d)(\\d{3})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[1-57]"],
              "(0$1)",
            ],
          ],
          "0",
          0,
          0,
          0,
          0,
          0,
          0,
          "00",
        ],
        SJ: [
          "47",
          "00",
          "0\\d{4}|(?:[489]\\d|79)\\d{6}",
          [5, 8],
          0,
          0,
          0,
          0,
          0,
          0,
          "79",
        ],
        SK: [
          "421",
          "00",
          "[2-689]\\d{8}|[2-59]\\d{6}|[2-5]\\d{5}",
          [6, 7, 9],
          [
            ["(\\d)(\\d{2})(\\d{3,4})", "$1 $2 $3", ["21"], "0$1"],
            [
              "(\\d{2})(\\d{2})(\\d{2,3})",
              "$1 $2 $3",
              ["[3-5][1-8]1", "[3-5][1-8]1[67]"],
              "0$1",
            ],
            ["(\\d)(\\d{3})(\\d{3})(\\d{2})", "$1/$2 $3 $4", ["2"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[689]"], "0$1"],
            [
              "(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
              "$1/$2 $3 $4",
              ["[3-5]"],
              "0$1",
            ],
          ],
          "0",
        ],
        SL: [
          "232",
          "00",
          "(?:[237-9]\\d|66)\\d{6}",
          [8],
          [["(\\d{2})(\\d{6})", "$1 $2", ["[236-9]"], "(0$1)"]],
          "0",
        ],
        SM: [
          "378",
          "00",
          "(?:0549|[5-7]\\d)\\d{6}",
          [8, 10],
          [
            ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-7]"]],
            ["(\\d{4})(\\d{6})", "$1 $2", ["0"]],
          ],
          0,
          0,
          "([89]\\d{5})$",
          "0549$1",
        ],
        SN: [
          "221",
          "00",
          "(?:[378]\\d|93)\\d{7}",
          [9],
          [
            ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]],
            ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[379]"]],
          ],
        ],
        SO: [
          "252",
          "00",
          "[346-9]\\d{8}|[12679]\\d{7}|[1-5]\\d{6}|[1348]\\d{5}",
          [6, 7, 8, 9],
          [
            ["(\\d{2})(\\d{4})", "$1 $2", ["8[125]"]],
            ["(\\d{6})", "$1", ["[134]"]],
            ["(\\d)(\\d{6})", "$1 $2", ["[15]|2[0-79]|3[0-46-8]|4[0-7]"]],
            ["(\\d)(\\d{7})", "$1 $2", ["(?:2|90)4|[67]"]],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[348]|64|79|90"]],
            ["(\\d{2})(\\d{5,7})", "$1 $2", ["1|28|6[0-35-9]|7[67]|9[2-9]"]],
          ],
          "0",
        ],
        SR: [
          "597",
          "00",
          "(?:[2-5]|[6-8]\\d|90)\\d{5}",
          [6, 7],
          [
            ["(\\d{2})(\\d{2})(\\d{2})", "$1-$2-$3", ["56"]],
            ["(\\d{3})(\\d{3})", "$1-$2", ["[2-5]"]],
            ["(\\d{3})(\\d{4})", "$1-$2", ["[6-9]"]],
          ],
        ],
        SS: [
          "211",
          "00",
          "[19]\\d{8}",
          [9],
          [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[19]"], "0$1"]],
          "0",
        ],
        ST: [
          "239",
          "00",
          "(?:22|9\\d)\\d{5}",
          [7],
          [["(\\d{3})(\\d{4})", "$1 $2", ["[29]"]]],
        ],
        SV: [
          "503",
          "00",
          "[25-7]\\d{7}|(?:80\\d|900)\\d{4}(?:\\d{4})?",
          [7, 8, 11],
          [
            ["(\\d{3})(\\d{4})", "$1 $2", ["[89]"]],
            ["(\\d{4})(\\d{4})", "$1 $2", ["[25-7]"]],
            ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["[89]"]],
          ],
        ],
        SX: [
          "1",
          "011",
          "7215\\d{6}|(?:[58]\\d\\d|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "(5\\d{6})$|1",
          "721$1",
          0,
          "721",
        ],
        SY: [
          "963",
          "00",
          "[1-359]\\d{8}|[1-5]\\d{7}",
          [8, 9],
          [
            [
              "(\\d{2})(\\d{3})(\\d{3,4})",
              "$1 $2 $3",
              ["[1-4]|5[1-3]"],
              "0$1",
              1,
            ],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[59]"], "0$1", 1],
          ],
          "0",
        ],
        SZ: [
          "268",
          "00",
          "0800\\d{4}|(?:[237]\\d|900)\\d{6}",
          [8, 9],
          [
            ["(\\d{4})(\\d{4})", "$1 $2", ["[0237]"]],
            ["(\\d{5})(\\d{4})", "$1 $2", ["9"]],
          ],
        ],
        TA: ["290", "00", "8\\d{3}", [4], 0, 0, 0, 0, 0, 0, "8"],
        TC: [
          "1",
          "011",
          "(?:[58]\\d\\d|649|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2-479]\\d{6})$|1",
          "649$1",
          0,
          "649",
        ],
        TD: [
          "235",
          "00|16",
          "(?:22|30|[689]\\d|77)\\d{6}",
          [8],
          [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[236-9]"]]],
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          "00",
        ],
        TG: [
          "228",
          "00",
          "[279]\\d{7}",
          [8],
          [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[279]"]]],
        ],
        TH: [
          "66",
          "00[1-9]",
          "(?:001800|[2-57]|[689]\\d)\\d{7}|1\\d{7,9}",
          [8, 9, 10, 13],
          [
            ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["2"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[13-9]"], "0$1"],
            ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]],
          ],
          "0",
        ],
        TJ: [
          "992",
          "810",
          "(?:[0-57-9]\\d|66)\\d{7}",
          [9],
          [
            ["(\\d{6})(\\d)(\\d{2})", "$1 $2 $3", ["331", "3317"]],
            ["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["44[02-479]|[34]7"]],
            ["(\\d{4})(\\d)(\\d{4})", "$1 $2 $3", ["3(?:[1245]|3[12])"]],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["\\d"]],
          ],
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          "8~10",
        ],
        TK: ["690", "00", "[2-47]\\d{3,6}", [4, 5, 6, 7]],
        TL: [
          "670",
          "00",
          "7\\d{7}|(?:[2-47]\\d|[89]0)\\d{5}",
          [7, 8],
          [
            ["(\\d{3})(\\d{4})", "$1 $2", ["[2-489]|70"]],
            ["(\\d{4})(\\d{4})", "$1 $2", ["7"]],
          ],
        ],
        TM: [
          "993",
          "810",
          "(?:[1-6]\\d|71)\\d{6}",
          [8],
          [
            [
              "(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
              "$1 $2-$3-$4",
              ["12"],
              "(8 $1)",
            ],
            [
              "(\\d{3})(\\d)(\\d{2})(\\d{2})",
              "$1 $2-$3-$4",
              ["[1-5]"],
              "(8 $1)",
            ],
            ["(\\d{2})(\\d{6})", "$1 $2", ["[67]"], "8 $1"],
          ],
          "8",
          0,
          0,
          0,
          0,
          0,
          0,
          "8~10",
        ],
        TN: [
          "216",
          "00",
          "[2-57-9]\\d{7}",
          [8],
          [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-57-9]"]]],
        ],
        TO: [
          "676",
          "00",
          "(?:0800|(?:[5-8]\\d\\d|999)\\d)\\d{3}|[2-8]\\d{4}",
          [5, 7],
          [
            ["(\\d{2})(\\d{3})", "$1-$2", ["[2-4]|50|6[09]|7[0-24-69]|8[05]"]],
            ["(\\d{4})(\\d{3})", "$1 $2", ["0"]],
            ["(\\d{3})(\\d{4})", "$1 $2", ["[5-9]"]],
          ],
        ],
        TR: [
          "90",
          "00",
          "4\\d{6}|8\\d{11,12}|(?:[2-58]\\d\\d|900)\\d{7}",
          [7, 10, 12, 13],
          [
            [
              "(\\d{3})(\\d{3})(\\d{4})",
              "$1 $2 $3",
              ["512|8[01589]|90"],
              "0$1",
              1,
            ],
            [
              "(\\d{3})(\\d{3})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["5(?:[0-59]|61)", "5(?:[0-59]|61[06])", "5(?:[0-59]|61[06]1)"],
              "0$1",
              1,
            ],
            [
              "(\\d{3})(\\d{3})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["[24][1-8]|3[1-9]"],
              "(0$1)",
              1,
            ],
            ["(\\d{3})(\\d{3})(\\d{6,7})", "$1 $2 $3", ["80"], "0$1", 1],
          ],
          "0",
        ],
        TT: [
          "1",
          "011",
          "(?:[58]\\d\\d|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2-46-8]\\d{6})$|1",
          "868$1",
          0,
          "868",
        ],
        TV: [
          "688",
          "00",
          "(?:2|7\\d\\d|90)\\d{4}",
          [5, 6, 7],
          [
            ["(\\d{2})(\\d{3})", "$1 $2", ["2"]],
            ["(\\d{2})(\\d{4})", "$1 $2", ["90"]],
            ["(\\d{2})(\\d{5})", "$1 $2", ["7"]],
          ],
        ],
        TW: [
          "886",
          "0(?:0[25-79]|19)",
          "[2-689]\\d{8}|7\\d{9,10}|[2-8]\\d{7}|2\\d{6}",
          [7, 8, 9, 10, 11],
          [
            ["(\\d{2})(\\d)(\\d{4})", "$1 $2 $3", ["202"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[258]0"], "0$1"],
            [
              "(\\d)(\\d{3,4})(\\d{4})",
              "$1 $2 $3",
              [
                "[23568]|4(?:0[02-48]|[1-47-9])|7[1-9]",
                "[23568]|4(?:0[2-48]|[1-47-9])|(?:400|7)[1-9]",
              ],
              "0$1",
            ],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[49]"], "0$1"],
            ["(\\d{2})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["7"], "0$1"],
          ],
          "0",
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          "#",
        ],
        TZ: [
          "255",
          "00[056]",
          "(?:[25-8]\\d|41|90)\\d{7}",
          [9],
          [
            ["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[24]"], "0$1"],
            ["(\\d{2})(\\d{7})", "$1 $2", ["5"]],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[67]"], "0$1"],
          ],
          "0",
        ],
        UA: [
          "380",
          "00",
          "[89]\\d{9}|[3-9]\\d{8}",
          [9, 10],
          [
            [
              "(\\d{3})(\\d{3})(\\d{3})",
              "$1 $2 $3",
              [
                "6[12][29]|(?:3[1-8]|4[136-8]|5[12457]|6[49])2|(?:56|65)[24]",
                "6[12][29]|(?:35|4[1378]|5[12457]|6[49])2|(?:56|65)[24]|(?:3[1-46-8]|46)2[013-9]",
              ],
              "0$1",
            ],
            [
              "(\\d{4})(\\d{5})",
              "$1 $2",
              [
                "3[1-8]|4(?:[1367]|[45][6-9]|8[4-6])|5(?:[1-5]|6[0135689]|7[4-6])|6(?:[12][3-7]|[459])",
                "3[1-8]|4(?:[1367]|[45][6-9]|8[4-6])|5(?:[1-5]|6(?:[015689]|3[02389])|7[4-6])|6(?:[12][3-7]|[459])",
              ],
              "0$1",
            ],
            [
              "(\\d{2})(\\d{3})(\\d{4})",
              "$1 $2 $3",
              ["[3-7]|89|9[1-9]"],
              "0$1",
            ],
            ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[89]"], "0$1"],
          ],
          "0",
          0,
          0,
          0,
          0,
          0,
          0,
          "0~0",
        ],
        UG: [
          "256",
          "00[057]",
          "800\\d{6}|(?:[29]0|[347]\\d)\\d{7}",
          [9],
          [
            ["(\\d{4})(\\d{5})", "$1 $2", ["202", "2024"], "0$1"],
            ["(\\d{3})(\\d{6})", "$1 $2", ["[27-9]|4(?:6[45]|[7-9])"], "0$1"],
            ["(\\d{2})(\\d{7})", "$1 $2", ["[34]"], "0$1"],
          ],
          "0",
        ],
        US: [
          "1",
          "011",
          "[2-9]\\d{9}|3\\d{6}",
          [10],
          [
            ["(\\d{3})(\\d{4})", "$1-$2", ["310"], 0, 1],
            [
              "(\\d{3})(\\d{3})(\\d{4})",
              "($1) $2-$3",
              ["[2-9]"],
              0,
              1,
              "$1-$2-$3",
            ],
          ],
          "1",
          0,
          0,
          0,
          0,
          0,
          [
            [
              "3052(?:0[0-8]|[1-9]\\d)\\d{4}|(?:2742|305[3-9])\\d{6}|(?:472|983)[2-47-9]\\d{6}|(?:2(?:0[1-35-9]|1[02-9]|2[03-57-9]|3[1459]|4[08]|5[1-46]|6[0279]|7[0269]|8[13])|3(?:0[1-47-9]|1[02-9]|2[013-79]|3[0-24679]|4[167]|5[0-3]|6[01349]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[023578]|58|6[349]|7[0589]|8[04])|5(?:0[1-57-9]|1[0235-8]|20|3[0149]|4[01]|5[179]|6[1-47]|7[0-5]|8[0256])|6(?:0[1-35-9]|1[024-9]|2[03689]|3[016]|4[0156]|5[01679]|6[0-279]|78|8[0-269])|7(?:0[1-46-8]|1[2-9]|2[04-8]|3[0-247]|4[0378]|5[47]|6[02359]|7[0-59]|8[156])|8(?:0[1-68]|1[02-8]|2[0168]|3[0-2589]|4[03578]|5[046-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[0146-8]|4[01357-9]|5[12469]|7[0-3589]|8[04-69]))[2-9]\\d{6}",
            ],
            [""],
            ["8(?:00|33|44|55|66|77|88)[2-9]\\d{6}"],
            ["900[2-9]\\d{6}"],
            [
              "52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[125-9]|33|44|66|77|88)[2-9]\\d{6}",
            ],
            0,
            0,
            0,
            ["305209\\d{4}"],
          ],
        ],
        UY: [
          "598",
          "0(?:0|1[3-9]\\d)",
          "0004\\d{2,9}|[1249]\\d{7}|2\\d{3,4}|(?:[49]\\d|80)\\d{5}",
          [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          [
            ["(\\d{4,5})", "$1", ["21"]],
            ["(\\d{3})(\\d{3,4})", "$1 $2", ["0"]],
            ["(\\d{3})(\\d{4})", "$1 $2", ["[49]0|8"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "0$1"],
            ["(\\d{4})(\\d{4})", "$1 $2", ["[124]"]],
            ["(\\d{3})(\\d{3})(\\d{2,4})", "$1 $2 $3", ["0"]],
            ["(\\d{3})(\\d{3})(\\d{3})(\\d{2,4})", "$1 $2 $3 $4", ["0"]],
          ],
          "0",
          0,
          0,
          0,
          0,
          0,
          0,
          "00",
          " int. ",
        ],
        UZ: [
          "998",
          "00",
          "(?:20|33|[5-9]\\d)\\d{7}",
          [9],
          [["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[235-9]"]]],
        ],
        VA: [
          "39",
          "00",
          "0\\d{5,10}|3[0-8]\\d{7,10}|55\\d{8}|8\\d{5}(?:\\d{2,4})?|(?:1\\d|39)\\d{7,8}",
          [6, 7, 8, 9, 10, 11, 12],
          0,
          0,
          0,
          0,
          0,
          0,
          "06698",
        ],
        VC: [
          "1",
          "011",
          "(?:[58]\\d\\d|784|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2-7]\\d{6})$|1",
          "784$1",
          0,
          "784",
        ],
        VE: [
          "58",
          "00",
          "[68]00\\d{7}|(?:[24]\\d|[59]0)\\d{8}",
          [10],
          [["(\\d{3})(\\d{7})", "$1-$2", ["[24-689]"], "0$1"]],
          "0",
        ],
        VG: [
          "1",
          "011",
          "(?:284|[58]\\d\\d|900)\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2-578]\\d{6})$|1",
          "284$1",
          0,
          "284",
        ],
        VI: [
          "1",
          "011",
          "[58]\\d{9}|(?:34|90)0\\d{7}",
          [10],
          0,
          "1",
          0,
          "([2-9]\\d{6})$|1",
          "340$1",
          0,
          "340",
        ],
        VN: [
          "84",
          "00",
          "[12]\\d{9}|[135-9]\\d{8}|[16]\\d{7}|[16-8]\\d{6}",
          [7, 8, 9, 10],
          [
            ["(\\d{2})(\\d{5})", "$1 $2", ["80"], "0$1", 1],
            ["(\\d{4})(\\d{4,6})", "$1 $2", ["1"], 0, 1],
            [
              "(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
              "$1 $2 $3 $4",
              ["6"],
              "0$1",
              1,
            ],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[357-9]"], "0$1", 1],
            ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["2[48]"], "0$1", 1],
            ["(\\d{3})(\\d{4})(\\d{3})", "$1 $2 $3", ["2"], "0$1", 1],
          ],
          "0",
        ],
        VU: [
          "678",
          "00",
          "[57-9]\\d{6}|(?:[238]\\d|48)\\d{3}",
          [5, 7],
          [["(\\d{3})(\\d{4})", "$1 $2", ["[57-9]"]]],
        ],
        WF: [
          "681",
          "00",
          "(?:40|72|8\\d{4})\\d{4}|[89]\\d{5}",
          [6, 9],
          [
            ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["[47-9]"]],
            ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]],
          ],
        ],
        WS: [
          "685",
          "0",
          "(?:[2-6]|8\\d{5})\\d{4}|[78]\\d{6}|[68]\\d{5}",
          [5, 6, 7, 10],
          [
            ["(\\d{5})", "$1", ["[2-5]|6[1-9]"]],
            ["(\\d{3})(\\d{3,7})", "$1 $2", ["[68]"]],
            ["(\\d{2})(\\d{5})", "$1 $2", ["7"]],
          ],
        ],
        XK: [
          "383",
          "00",
          "2\\d{7,8}|3\\d{7,11}|(?:4\\d\\d|[89]00)\\d{5}",
          [8, 9, 10, 11, 12],
          [
            ["(\\d{3})(\\d{5})", "$1 $2", ["[89]"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-4]"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["2|39"], "0$1"],
            ["(\\d{2})(\\d{7,10})", "$1 $2", ["3"], "0$1"],
          ],
          "0",
        ],
        YE: [
          "967",
          "00",
          "(?:1|7\\d)\\d{7}|[1-7]\\d{6}",
          [7, 8, 9],
          [
            [
              "(\\d)(\\d{3})(\\d{3,4})",
              "$1 $2 $3",
              ["[1-6]|7(?:[24-6]|8[0-7])"],
              "0$1",
            ],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["7"], "0$1"],
          ],
          "0",
        ],
        YT: [
          "262",
          "00",
          "7093\\d{5}|(?:80|9\\d)\\d{7}|(?:26|63)9\\d{6}",
          [9],
          0,
          "0",
          0,
          0,
          0,
          0,
          0,
          [
            ["269(?:0[0-467]|15|5[0-4]|6\\d|[78]0)\\d{4}"],
            [
              "(?:639(?:0[0-79]|1[019]|[267]\\d|3[09]|40|5[05-9]|9[04-79])|7093[5-7])\\d{4}",
            ],
            ["80\\d{7}"],
            0,
            0,
            0,
            0,
            0,
            ["9(?:(?:39|47)8[01]|769\\d)\\d{4}"],
          ],
        ],
        ZA: [
          "27",
          "00",
          "[1-79]\\d{8}|8\\d{4,9}",
          [5, 6, 7, 8, 9, 10],
          [
            ["(\\d{2})(\\d{3,4})", "$1 $2", ["8[1-4]"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["8[1-4]"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["860"], "0$1"],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-9]"], "0$1"],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"],
          ],
          "0",
        ],
        ZM: [
          "260",
          "00",
          "800\\d{6}|(?:21|[579]\\d|63)\\d{7}",
          [9],
          [
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[28]"], "0$1"],
            ["(\\d{2})(\\d{7})", "$1 $2", ["[579]"], "0$1"],
          ],
          "0",
        ],
        ZW: [
          "263",
          "00",
          "2(?:[0-57-9]\\d{6,8}|6[0-24-9]\\d{6,7})|[38]\\d{9}|[35-8]\\d{8}|[3-6]\\d{7}|[1-689]\\d{6}|[1-3569]\\d{5}|[1356]\\d{4}",
          [5, 6, 7, 8, 9, 10],
          [
            [
              "(\\d{3})(\\d{3,5})",
              "$1 $2",
              [
                "2(?:0[45]|2[278]|[49]8)|3(?:[09]8|17)|6(?:[29]8|37|75)|[23][78]|(?:33|5[15]|6[68])[78]",
              ],
              "0$1",
            ],
            ["(\\d)(\\d{3})(\\d{2,4})", "$1 $2 $3", ["[49]"], "0$1"],
            ["(\\d{3})(\\d{4})", "$1 $2", ["80"], "0$1"],
            [
              "(\\d{2})(\\d{7})",
              "$1 $2",
              [
                "24|8[13-59]|(?:2[05-79]|39|5[45]|6[15-8])2",
                "2(?:02[014]|4|[56]20|[79]2)|392|5(?:42|525)|6(?:[16-8]21|52[013])|8[13-59]",
              ],
              "(0$1)",
            ],
            ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"],
            [
              "(\\d{3})(\\d{3})(\\d{3,4})",
              "$1 $2 $3",
              [
                "2(?:1[39]|2[0157]|[378]|[56][14])|3(?:12|29)",
                "2(?:1[39]|2[0157]|[378]|[56][14])|3(?:123|29)",
              ],
              "0$1",
            ],
            ["(\\d{4})(\\d{6})", "$1 $2", ["8"], "0$1"],
            [
              "(\\d{2})(\\d{3,5})",
              "$1 $2",
              [
                "1|2(?:0[0-36-9]|12|29|[56])|3(?:1[0-689]|[24-6])|5(?:[0236-9]|1[2-4])|6(?:[013-59]|7[0-46-9])|(?:33|55|6[68])[0-69]|(?:29|3[09]|62)[0-79]",
              ],
              "0$1",
            ],
            [
              "(\\d{2})(\\d{3})(\\d{3,4})",
              "$1 $2 $3",
              ["29[013-9]|39|54"],
              "0$1",
            ],
            ["(\\d{4})(\\d{3,5})", "$1 $2", ["(?:25|54)8", "258|5483"], "0$1"],
          ],
          "0",
        ],
      },
      nonGeographic: {
        800: [
          "800",
          0,
          "(?:00|[1-9]\\d)\\d{6}",
          [8],
          [["(\\d{4})(\\d{4})", "$1 $2", ["\\d"]]],
          0,
          0,
          0,
          0,
          0,
          0,
          [0, 0, ["(?:00|[1-9]\\d)\\d{6}"]],
        ],
        808: [
          "808",
          0,
          "[1-9]\\d{7}",
          [8],
          [["(\\d{4})(\\d{4})", "$1 $2", ["[1-9]"]]],
          0,
          0,
          0,
          0,
          0,
          0,
          [0, 0, 0, 0, 0, 0, 0, 0, 0, ["[1-9]\\d{7}"]],
        ],
        870: [
          "870",
          0,
          "7\\d{11}|[235-7]\\d{8}",
          [9, 12],
          [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[235-7]"]]],
          0,
          0,
          0,
          0,
          0,
          0,
          [
            0,
            ["(?:[356]|774[45])\\d{8}|7[6-8]\\d{7}"],
            0,
            0,
            0,
            0,
            0,
            0,
            ["2\\d{8}", [9]],
          ],
        ],
        878: [
          "878",
          0,
          "10\\d{10}",
          [12],
          [["(\\d{2})(\\d{5})(\\d{5})", "$1 $2 $3", ["1"]]],
          0,
          0,
          0,
          0,
          0,
          0,
          [0, 0, 0, 0, 0, 0, 0, 0, ["10\\d{10}"]],
        ],
        881: [
          "881",
          0,
          "6\\d{9}|[0-36-9]\\d{8}",
          [9, 10],
          [
            ["(\\d)(\\d{3})(\\d{5})", "$1 $2 $3", ["[0-37-9]"]],
            ["(\\d)(\\d{3})(\\d{5,6})", "$1 $2 $3", ["6"]],
          ],
          0,
          0,
          0,
          0,
          0,
          0,
          [0, ["6\\d{9}|[0-36-9]\\d{8}"]],
        ],
        882: [
          "882",
          0,
          "[13]\\d{6}(?:\\d{2,5})?|[19]\\d{7}|(?:[25]\\d\\d|4)\\d{7}(?:\\d{2})?",
          [7, 8, 9, 10, 11, 12],
          [
            ["(\\d{2})(\\d{5})", "$1 $2", ["16|342"]],
            ["(\\d{2})(\\d{6})", "$1 $2", ["49"]],
            ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["1[36]|9"]],
            ["(\\d{2})(\\d{4})(\\d{3})", "$1 $2 $3", ["3[23]"]],
            ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["16"]],
            [
              "(\\d{2})(\\d{4})(\\d{4})",
              "$1 $2 $3",
              ["10|23|3(?:[15]|4[57])|4|51"],
            ],
            ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["34"]],
            ["(\\d{2})(\\d{4,5})(\\d{5})", "$1 $2 $3", ["[1-35]"]],
          ],
          0,
          0,
          0,
          0,
          0,
          0,
          [
            0,
            [
              "342\\d{4}|(?:337|49)\\d{6}|(?:3(?:2|47|7\\d{3})|50\\d{3})\\d{7}",
              [7, 8, 9, 10, 12],
            ],
            0,
            0,
            0,
            ["348[57]\\d{7}", [11]],
            0,
            0,
            [
              "1(?:3(?:0[0347]|[13][0139]|2[035]|4[013568]|6[0459]|7[06]|8[15-8]|9[0689])\\d{4}|6\\d{5,10})|(?:345\\d|9[89])\\d{6}|(?:10|2(?:3|85\\d)|3(?:[15]|[69]\\d\\d)|4[15-8]|51)\\d{8}",
            ],
          ],
        ],
        883: [
          "883",
          0,
          "(?:[1-4]\\d|51)\\d{6,10}",
          [8, 9, 10, 11, 12],
          [
            [
              "(\\d{3})(\\d{3})(\\d{2,8})",
              "$1 $2 $3",
              ["[14]|2[24-689]|3[02-689]|51[24-9]"],
            ],
            ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["510"]],
            ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["21"]],
            ["(\\d{4})(\\d{4})(\\d{4})", "$1 $2 $3", ["51[13]"]],
            ["(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["[235]"]],
          ],
          0,
          0,
          0,
          0,
          0,
          0,
          [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            [
              "(?:2(?:00\\d\\d|10)|(?:370[1-9]|51\\d0)\\d)\\d{7}|51(?:00\\d{5}|[24-9]0\\d{4,7})|(?:1[0-79]|2[24-689]|3[02-689]|4[0-4])0\\d{5,9}",
            ],
          ],
        ],
        888: [
          "888",
          0,
          "\\d{11}",
          [11],
          [["(\\d{3})(\\d{3})(\\d{5})", "$1 $2 $3"]],
          0,
          0,
          0,
          0,
          0,
          0,
          [0, 0, 0, 0, 0, 0, ["\\d{11}"]],
        ],
        979: [
          "979",
          0,
          "[1359]\\d{8}",
          [9],
          [["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["[1359]"]]],
          0,
          0,
          0,
          0,
          0,
          0,
          [0, 0, 0, ["[1359]\\d{8}"]],
        ],
      },
    };
  function tT(e, t) {
    ((e = e.split("-")), (t = t.split("-")));
    for (var r = e[0].split("."), i = t[0].split("."), a = 0; a < 3; a++) {
      var n = Number(r[a]),
        s = Number(i[a]);
      if (n > s) return 1;
      if (s > n) return -1;
      if (!isNaN(n) && isNaN(s)) return 1;
      if (isNaN(n) && !isNaN(s)) return -1;
    }
    return e[1] && t[1]
      ? e[1] > t[1]
        ? 1
        : e[1] < t[1]
          ? -1
          : 0
      : !e[1] && t[1]
        ? 1
        : e[1] && !t[1]
          ? -1
          : 0;
  }
  var tC = {}.constructor;
  function tE(e) {
    return null != e && e.constructor === tC;
  }
  function tA(e) {
    return (tA =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function tx(e, t) {
    if (!(e instanceof t)) throw TypeError("Cannot call a class as a function");
  }
  function tN(e, t) {
    for (var r = 0; r < t.length; r++) {
      var i = t[r];
      ((i.enumerable = i.enumerable || !1),
        (i.configurable = !0),
        "value" in i && (i.writable = !0),
        Object.defineProperty(
          e,
          (function (e) {
            var t = (function (e, t) {
              if ("object" != tA(e) || !e) return e;
              var r = e[Symbol.toPrimitive];
              if (void 0 !== r) {
                var i = r.call(e, t || "default");
                if ("object" != tA(i)) return i;
                throw TypeError("@@toPrimitive must return a primitive value.");
              }
              return ("string" === t ? String : Number)(e);
            })(e, "string");
            return "symbol" == tA(t) ? t : t + "";
          })(i.key),
          i,
        ));
    }
  }
  function tP(e, t, r) {
    return (
      t && tN(e.prototype, t),
      r && tN(e, r),
      Object.defineProperty(e, "prototype", { writable: !1 }),
      e
    );
  }
  var tO = " ext. ",
    tR = /^\d+$/,
    tU = tP(
      function e(t) {
        (tx(this, e), tW(t), (this.metadata = t), tV.call(this, t));
      },
      [
        {
          key: "getCountries",
          value: function () {
            return Object.keys(this.metadata.countries).filter(function (e) {
              return "001" !== e;
            });
          },
        },
        {
          key: "getCountryMetadata",
          value: function (e) {
            return this.metadata.countries[e];
          },
        },
        {
          key: "nonGeographic",
          value: function () {
            if (!this.v1 && !this.v2 && !this.v3)
              return (
                this.metadata.nonGeographic || this.metadata.nonGeographical
              );
          },
        },
        {
          key: "hasCountry",
          value: function (e) {
            return void 0 !== this.getCountryMetadata(e);
          },
        },
        {
          key: "hasCallingCode",
          value: function (e) {
            if (this.getCountryCodesForCallingCode(e)) return !0;
            if (this.nonGeographic()) {
              if (this.nonGeographic()[e]) return !0;
            } else {
              var t = this.countryCallingCodes()[e];
              if (t && 1 === t.length && "001" === t[0]) return !0;
            }
          },
        },
        {
          key: "isNonGeographicCallingCode",
          value: function (e) {
            return this.nonGeographic()
              ? !!this.nonGeographic()[e]
              : !this.getCountryCodesForCallingCode(e);
          },
        },
        {
          key: "country",
          value: function (e) {
            return this.selectNumberingPlan(e);
          },
        },
        {
          key: "selectNumberingPlan",
          value: function (e, t) {
            if ((e && tR.test(e) && ((t = e), (e = null)), e && "001" !== e)) {
              if (!this.hasCountry(e))
                throw Error("Unknown country: ".concat(e));
              this.numberingPlan = new tM(this.getCountryMetadata(e), this);
            } else if (t) {
              if (!this.hasCallingCode(t))
                throw Error("Unknown calling code: ".concat(t));
              this.numberingPlan = new tM(
                this.getNumberingPlanMetadata(t),
                this,
              );
            } else this.numberingPlan = void 0;
            return this;
          },
        },
        {
          key: "getCountryCodesForCallingCode",
          value: function (e) {
            var t = this.countryCallingCodes()[e];
            if (t) {
              if (1 === t.length && 3 === t[0].length) return;
              return t;
            }
          },
        },
        {
          key: "getCountryCodeForCallingCode",
          value: function (e) {
            var t = this.getCountryCodesForCallingCode(e);
            if (t) return t[0];
          },
        },
        {
          key: "getNumberingPlanMetadata",
          value: function (e) {
            var t = this.getCountryCodeForCallingCode(e);
            if (t) return this.getCountryMetadata(t);
            if (this.nonGeographic()) {
              var r = this.nonGeographic()[e];
              if (r) return r;
            } else {
              var i = this.countryCallingCodes()[e];
              if (i && 1 === i.length && "001" === i[0])
                return this.metadata.countries["001"];
            }
          },
        },
        {
          key: "countryCallingCode",
          value: function () {
            return this.numberingPlan.callingCode();
          },
        },
        {
          key: "IDDPrefix",
          value: function () {
            return this.numberingPlan.IDDPrefix();
          },
        },
        {
          key: "defaultIDDPrefix",
          value: function () {
            return this.numberingPlan.defaultIDDPrefix();
          },
        },
        {
          key: "nationalNumberPattern",
          value: function () {
            return this.numberingPlan.nationalNumberPattern();
          },
        },
        {
          key: "possibleLengths",
          value: function () {
            return this.numberingPlan.possibleLengths();
          },
        },
        {
          key: "formats",
          value: function () {
            return this.numberingPlan.formats();
          },
        },
        {
          key: "nationalPrefixForParsing",
          value: function () {
            return this.numberingPlan.nationalPrefixForParsing();
          },
        },
        {
          key: "nationalPrefixTransformRule",
          value: function () {
            return this.numberingPlan.nationalPrefixTransformRule();
          },
        },
        {
          key: "leadingDigits",
          value: function () {
            return this.numberingPlan.leadingDigits();
          },
        },
        {
          key: "hasTypes",
          value: function () {
            return this.numberingPlan.hasTypes();
          },
        },
        {
          key: "type",
          value: function (e) {
            return this.numberingPlan.type(e);
          },
        },
        {
          key: "ext",
          value: function () {
            return this.numberingPlan.ext();
          },
        },
        {
          key: "countryCallingCodes",
          value: function () {
            return this.v1
              ? this.metadata.country_phone_code_to_countries
              : this.metadata.country_calling_codes;
          },
        },
        {
          key: "chooseCountryByCountryCallingCode",
          value: function (e) {
            return this.selectNumberingPlan(e);
          },
        },
        {
          key: "hasSelectedNumberingPlan",
          value: function () {
            return void 0 !== this.numberingPlan;
          },
        },
      ],
    ),
    tM = tP(
      function e(t, r) {
        (tx(this, e),
          (this.globalMetadataObject = r),
          (this.metadata = t),
          tV.call(this, r.metadata));
      },
      [
        {
          key: "callingCode",
          value: function () {
            return this.metadata[0];
          },
        },
        {
          key: "getDefaultCountryMetadataForRegion",
          value: function () {
            return this.globalMetadataObject.getNumberingPlanMetadata(
              this.callingCode(),
            );
          },
        },
        {
          key: "IDDPrefix",
          value: function () {
            if (!this.v1 && !this.v2) return this.metadata[1];
          },
        },
        {
          key: "defaultIDDPrefix",
          value: function () {
            if (!this.v1 && !this.v2) return this.metadata[12];
          },
        },
        {
          key: "nationalNumberPattern",
          value: function () {
            return this.v1 || this.v2 ? this.metadata[1] : this.metadata[2];
          },
        },
        {
          key: "possibleLengths",
          value: function () {
            if (!this.v1) return this.metadata[this.v2 ? 2 : 3];
          },
        },
        {
          key: "_getFormats",
          value: function (e) {
            return e[this.v1 ? 2 : this.v2 ? 3 : 4];
          },
        },
        {
          key: "formats",
          value: function () {
            var e = this;
            return (
              this._getFormats(this.metadata) ||
              this._getFormats(this.getDefaultCountryMetadataForRegion()) ||
              []
            ).map(function (t) {
              return new tD(t, e);
            });
          },
        },
        {
          key: "nationalPrefix",
          value: function () {
            return this.metadata[this.v1 ? 3 : this.v2 ? 4 : 5];
          },
        },
        {
          key: "_getNationalPrefixFormattingRule",
          value: function (e) {
            return e[this.v1 ? 4 : this.v2 ? 5 : 6];
          },
        },
        {
          key: "nationalPrefixFormattingRule",
          value: function () {
            return (
              this._getNationalPrefixFormattingRule(this.metadata) ||
              this._getNationalPrefixFormattingRule(
                this.getDefaultCountryMetadataForRegion(),
              )
            );
          },
        },
        {
          key: "_nationalPrefixForParsing",
          value: function () {
            return this.metadata[this.v1 ? 5 : this.v2 ? 6 : 7];
          },
        },
        {
          key: "nationalPrefixForParsing",
          value: function () {
            return this._nationalPrefixForParsing() || this.nationalPrefix();
          },
        },
        {
          key: "nationalPrefixTransformRule",
          value: function () {
            return this.metadata[this.v1 ? 6 : this.v2 ? 7 : 8];
          },
        },
        {
          key: "_getNationalPrefixIsOptionalWhenFormatting",
          value: function () {
            return !!this.metadata[this.v1 ? 7 : this.v2 ? 8 : 9];
          },
        },
        {
          key: "nationalPrefixIsOptionalWhenFormattingInNationalFormat",
          value: function () {
            return (
              this._getNationalPrefixIsOptionalWhenFormatting(this.metadata) ||
              this._getNationalPrefixIsOptionalWhenFormatting(
                this.getDefaultCountryMetadataForRegion(),
              )
            );
          },
        },
        {
          key: "leadingDigits",
          value: function () {
            return this.metadata[this.v1 ? 8 : this.v2 ? 9 : 10];
          },
        },
        {
          key: "types",
          value: function () {
            return this.metadata[this.v1 ? 9 : this.v2 ? 10 : 11];
          },
        },
        {
          key: "hasTypes",
          value: function () {
            return (
              (!this.types() || 0 !== this.types().length) && !!this.types()
            );
          },
        },
        {
          key: "type",
          value: function (e) {
            if (this.hasTypes() && tj(this.types(), e))
              return new tF(tj(this.types(), e), this);
          },
        },
        {
          key: "ext",
          value: function () {
            return this.v1 || this.v2 ? tO : this.metadata[13] || tO;
          },
        },
      ],
    ),
    tD = tP(
      function e(t, r) {
        (tx(this, e), (this._format = t), (this.metadata = r));
      },
      [
        {
          key: "pattern",
          value: function () {
            return this._format[0];
          },
        },
        {
          key: "format",
          value: function () {
            return this._format[1];
          },
        },
        {
          key: "leadingDigitsPatterns",
          value: function () {
            return this._format[2] || [];
          },
        },
        {
          key: "nationalPrefixFormattingRule",
          value: function () {
            return (
              this._format[3] || this.metadata.nationalPrefixFormattingRule()
            );
          },
        },
        {
          key: "nationalPrefixIsOptionalWhenFormattingInNationalFormat",
          value: function () {
            return (
              !!this._format[4] ||
              this.metadata.nationalPrefixIsOptionalWhenFormattingInNationalFormat()
            );
          },
        },
        {
          key: "nationalPrefixIsMandatoryWhenFormattingInNationalFormat",
          value: function () {
            return (
              this.usesNationalPrefix() &&
              !this.nationalPrefixIsOptionalWhenFormattingInNationalFormat()
            );
          },
        },
        {
          key: "usesNationalPrefix",
          value: function () {
            return !(
              !this.nationalPrefixFormattingRule() ||
              tL.test(this.nationalPrefixFormattingRule())
            );
          },
        },
        {
          key: "internationalFormat",
          value: function () {
            return this._format[5] || this.format();
          },
        },
      ],
    ),
    tL = /^\(?\$1\)?$/,
    tF = tP(
      function e(t, r) {
        (tx(this, e), (this.type = t), (this.metadata = r));
      },
      [
        {
          key: "pattern",
          value: function () {
            return this.metadata.v1 ? this.type : this.type[0];
          },
        },
        {
          key: "possibleLengths",
          value: function () {
            if (!this.metadata.v1)
              return this.type[1] || this.metadata.possibleLengths();
          },
        },
      ],
    );
  function tj(e, t) {
    switch (t) {
      case "FIXED_LINE":
        return e[0];
      case "MOBILE":
        return e[1];
      case "TOLL_FREE":
        return e[2];
      case "PREMIUM_RATE":
        return e[3];
      case "PERSONAL_NUMBER":
        return e[4];
      case "VOICEMAIL":
        return e[5];
      case "UAN":
        return e[6];
      case "PAGER":
        return e[7];
      case "VOIP":
        return e[8];
      case "SHARED_COST":
        return e[9];
    }
  }
  function tW(e) {
    if (!e)
      throw Error(
        "[libphonenumber-js] `metadata` argument not passed. Check your arguments.",
      );
    if (!tE(e) || !tE(e.countries))
      throw Error(
        "[libphonenumber-js] `metadata` argument was passed but it's not a valid metadata. Must be an object having `.countries` child object property. Got ".concat(
          tE(e)
            ? "an object of shape: { " + Object.keys(e).join(", ") + " }"
            : "a " + tG(e) + ": " + e,
          ".",
        ),
      );
  }
  var tG = function (e) {
    return tA(e);
  };
  function tB(e, t) {
    if ((t = new tU(t)).hasCountry(e))
      return t.selectNumberingPlan(e).countryCallingCode();
    throw Error("Unknown country: ".concat(e));
  }
  function tV(e) {
    var t = e.version;
    "number" == typeof t
      ? ((this.v1 = 1 === t),
        (this.v2 = 2 === t),
        (this.v3 = 3 === t),
        (this.v4 = 4 === t))
      : t
        ? -1 === tT(t, "1.2.0")
          ? (this.v2 = !0)
          : -1 === tT(t, "1.7.35")
            ? (this.v3 = !0)
            : (this.v4 = !0)
        : (this.v1 = !0);
  }
  function tq(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, i = Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  function tZ(e, t, r) {
    return (function e(t, r, i, a) {
      r && (a = new tU(a.metadata)).selectNumberingPlan(r);
      var n = a.type(i),
        s = (n && n.possibleLengths()) || a.possibleLengths();
      if (!s) return "IS_POSSIBLE";
      if ("FIXED_LINE_OR_MOBILE" === i) {
        if (!a.type("FIXED_LINE")) return e(t, r, "MOBILE", a);
        var o = a.type("MOBILE");
        o &&
          (s = (function (e, t) {
            for (
              var r,
                i = e.slice(),
                a = (function (e) {
                  var t =
                    ("u" > typeof Symbol && e[Symbol.iterator]) ||
                    e["@@iterator"];
                  if (t) return (t = t.call(e)).next.bind(t);
                  if (
                    Array.isArray(e) ||
                    (t = (function (e) {
                      if (e) {
                        if ("string" == typeof e) return tq(e, void 0);
                        var t = {}.toString.call(e).slice(8, -1);
                        return (
                          "Object" === t &&
                            e.constructor &&
                            (t = e.constructor.name),
                          "Map" === t || "Set" === t
                            ? Array.from(e)
                            : "Arguments" === t ||
                                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(
                                  t,
                                )
                              ? tq(e, void 0)
                              : void 0
                        );
                      }
                    })(e))
                  ) {
                    t && (e = t);
                    var r = 0;
                    return function () {
                      return r >= e.length
                        ? { done: !0 }
                        : { done: !1, value: e[r++] };
                    };
                  }
                  throw TypeError(
                    "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                  );
                })(t);
              !(r = a()).done;

            ) {
              var n = r.value;
              0 > e.indexOf(n) && i.push(n);
            }
            return i.sort(function (e, t) {
              return e - t;
            });
          })(s, o.possibleLengths()));
      } else if (i && !n) return "INVALID_LENGTH";
      var d = t.length,
        l = s[0];
      return l === d
        ? "IS_POSSIBLE"
        : l > d
          ? "TOO_SHORT"
          : s[s.length - 1] < d
            ? "TOO_LONG"
            : s.indexOf(d, 1) >= 0
              ? "IS_POSSIBLE"
              : "INVALID_LENGTH";
    })(e, t, void 0, r);
  }
  function tK(e, t, r) {
    return "IS_POSSIBLE" === tZ(e, t, r);
  }
  function tJ(e, t) {
    return ((e = e || ""), RegExp("^(?:" + t + ")$").test(e));
  }
  function tH(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, i = Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  var tz = [
    "MOBILE",
    "PREMIUM_RATE",
    "TOLL_FREE",
    "SHARED_COST",
    "VOIP",
    "PERSONAL_NUMBER",
    "PAGER",
    "UAN",
    "VOICEMAIL",
  ];
  function tY(e, t, r) {
    if (((t = t || {}), e.country || e.countryCallingCode)) {
      (r = new tU(r)).selectNumberingPlan(e.country, e.countryCallingCode);
      var i = t.v2 ? e.nationalNumber : e.phone;
      if (tJ(i, r.nationalNumberPattern())) {
        if (tX(i, "FIXED_LINE", r))
          return (r.type("MOBILE") && "" === r.type("MOBILE").pattern()) ||
            !r.type("MOBILE") ||
            tX(i, "MOBILE", r)
            ? "FIXED_LINE_OR_MOBILE"
            : "FIXED_LINE";
        for (
          var a,
            n = (function (e) {
              var t =
                ("u" > typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
              if (t) return (t = t.call(e)).next.bind(t);
              if (
                Array.isArray(e) ||
                (t = (function (e) {
                  if (e) {
                    if ("string" == typeof e) return tH(e, void 0);
                    var t = {}.toString.call(e).slice(8, -1);
                    return (
                      "Object" === t &&
                        e.constructor &&
                        (t = e.constructor.name),
                      "Map" === t || "Set" === t
                        ? Array.from(e)
                        : "Arguments" === t ||
                            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
                          ? tH(e, void 0)
                          : void 0
                    );
                  }
                })(e))
              ) {
                t && (e = t);
                var r = 0;
                return function () {
                  return r >= e.length
                    ? { done: !0 }
                    : { done: !1, value: e[r++] };
                };
              }
              throw TypeError(
                "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
              );
            })(tz);
          !(a = n()).done;

        ) {
          var s = a.value;
          if (tX(i, s, r)) return s;
        }
      }
    }
  }
  function tX(e, t, r) {
    return (
      !(
        !(t = r.type(t)) ||
        !t.pattern() ||
        (t.possibleLengths() && 0 > t.possibleLengths().indexOf(e.length))
      ) && tJ(e, t.pattern())
    );
  }
  var tQ = "0-9０-９٠-٩۰-۹",
    t0 = ""
      .concat("-‐-―−ー－")
      .concat("／/")
      .concat("．.")
      .concat("  ­​⁠　")
      .concat("()（）［］\\[\\]")
      .concat("~⁓∼～"),
    t1 = "+＋",
    t2 = RegExp("([" + tQ + "])");
  function t3(e, t, r, i) {
    if (t) {
      var a = new tU(i);
      a.selectNumberingPlan(t, r);
      var n = new RegExp(a.IDDPrefix());
      if (0 === e.search(n)) {
        var s = (e = e.slice(e.match(n)[0].length)).match(t2);
        if (!s || null == s[1] || !(s[1].length > 0) || "0" !== s[1]) return e;
      }
    }
  }
  function t4(e, t) {
    if (e && t.numberingPlan.nationalPrefixForParsing()) {
      var r = RegExp("^(?:" + t.numberingPlan.nationalPrefixForParsing() + ")"),
        i = r.exec(e);
      if (i) {
        var a,
          n,
          s,
          o = i.length - 1,
          d = o > 0 && i[o];
        if (t.nationalPrefixTransformRule() && d)
          ((a = e.replace(r, t.nationalPrefixTransformRule())),
            o > 1 && (n = i[1]));
        else {
          var l = i[0];
          ((a = e.slice(l.length)), d && (n = i[1]));
        }
        if (d) {
          var c = e.indexOf(i[1]);
          e.slice(0, c) === t.numberingPlan.nationalPrefix() &&
            (s = t.numberingPlan.nationalPrefix());
        } else s = i[0];
        return { nationalNumber: a, nationalPrefix: s, carrierCode: n };
      }
    }
    return { nationalNumber: e };
  }
  function t9(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, i = Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  function t5(e, t) {
    var r = t.countries,
      i = t.metadata;
    i = new tU(i);
    for (
      var a,
        n = (function (e) {
          var t =
            ("u" > typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
          if (t) return (t = t.call(e)).next.bind(t);
          if (
            Array.isArray(e) ||
            (t = (function (e) {
              if (e) {
                if ("string" == typeof e) return t9(e, void 0);
                var t = {}.toString.call(e).slice(8, -1);
                return (
                  "Object" === t && e.constructor && (t = e.constructor.name),
                  "Map" === t || "Set" === t
                    ? Array.from(e)
                    : "Arguments" === t ||
                        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
                      ? t9(e, void 0)
                      : void 0
                );
              }
            })(e))
          ) {
            t && (e = t);
            var r = 0;
            return function () {
              return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
            };
          }
          throw TypeError(
            "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
          );
        })(r);
      !(a = n()).done;

    ) {
      var s = a.value;
      if ((i.selectNumberingPlan(s), i.leadingDigits())) {
        if (e && 0 === e.search(i.leadingDigits())) return s;
      } else if (tY({ phone: e, country: s }, void 0, i.metadata)) return s;
    }
  }
  function t8(e, t) {
    var r = t.nationalNumber,
      i = t.metadata,
      a = i.getCountryCodesForCallingCode(e);
    if (a)
      return 1 === a.length
        ? a[0]
        : t5(r, { countries: a, metadata: i.metadata });
  }
  function t6(e, t, r) {
    var i,
      a,
      n,
      s = t4(e, r),
      o = s.carrierCode,
      d = s.nationalNumber;
    if (d !== e) {
      if (
        ((i = e),
        (a = d),
        !(
          !tJ(i, (n = r).nationalNumberPattern()) ||
          tJ(a, n.nationalNumberPattern())
        ) ||
          (r.numberingPlan.possibleLengths() &&
            (t ||
              (t = t8(r.numberingPlan.callingCode(), {
                nationalNumber: d,
                metadata: r,
              })),
            !(function (e, t, r) {
              switch (tZ(e, t, r)) {
                case "TOO_SHORT":
                case "INVALID_LENGTH":
                  return !1;
                default:
                  return !0;
              }
            })(d, t, r))))
      )
        return { nationalNumber: e };
    }
    return { nationalNumber: d, carrierCode: o };
  }
  function t7(e, t, r, i, a) {
    var n = t || r ? tB(t || r, a) : i;
    if (0 === e.indexOf(n)) {
      (a = new tU(a)).selectNumberingPlan(t || r, n);
      var s = e.slice(n.length),
        o = t6(s, t, a).nationalNumber,
        d = t6(e, t, a).nationalNumber;
      if (
        (!tJ(d, a.nationalNumberPattern()) &&
          tJ(o, a.nationalNumberPattern())) ||
        "TOO_LONG" === tZ(d, t, a)
      )
        return { countryCallingCode: n, number: s };
    }
    return { number: e };
  }
  function re(e, t, r, i, a) {
    if (!e) return {};
    if ("+" !== e[0]) {
      var n,
        s = t3(e, t || r, i, a);
      if (s && s !== e) ((n = !0), (e = "+" + s));
      else {
        if (t || r || i) {
          var o = t7(e, t, r, i, a),
            d = o.countryCallingCode,
            l = o.number;
          if (d)
            return {
              countryCallingCodeSource: "FROM_NUMBER_WITHOUT_PLUS_SIGN",
              countryCallingCode: d,
              number: l,
            };
        }
        return { number: e };
      }
    }
    if ("0" === e[1]) return {};
    a = new tU(a);
    for (var c = 2; c - 1 <= 3 && c <= e.length; ) {
      var u = e.slice(1, c);
      if (a.hasCallingCode(u))
        return (
          a.selectNumberingPlan(u),
          {
            countryCallingCodeSource: n
              ? "FROM_NUMBER_WITH_IDD"
              : "FROM_NUMBER_WITH_PLUS_SIGN",
            countryCallingCode: u,
            number: e.slice(c),
          }
        );
      c++;
    }
    return {};
  }
  function rt(e) {
    return e.replace(RegExp("[".concat(t0, "]+"), "g"), " ").trim();
  }
  var rr = /(\$\d)/;
  function ri(e, t, r) {
    var i = r.useInternationalFormat,
      a = r.withNationalPrefix;
    (r.carrierCode, r.metadata);
    var n = e.replace(
      new RegExp(t.pattern()),
      i
        ? t.internationalFormat()
        : a && t.nationalPrefixFormattingRule()
          ? t.format().replace(rr, t.nationalPrefixFormattingRule())
          : t.format(),
    );
    return i ? rt(n) : n;
  }
  var ra = /^[\d]+(?:[~\u2053\u223C\uFF5E][\d]+)?$/,
    rn = {
      formatExtension: function (e, t, r) {
        return "".concat(e).concat(r.ext()).concat(t);
      },
    };
  function rs(e, t, r, i, a) {
    var n = (function (e, t) {
      for (var r = e, i = 0; i < r.length; ) {
        if (
          (function (e) {
            if (e.leadingDigitsPatterns().length > 0) {
              var r =
                e.leadingDigitsPatterns()[e.leadingDigitsPatterns().length - 1];
              if (0 !== t.search(r)) return !1;
            }
            return tJ(t, e.pattern());
          })(r[i])
        )
          return r[i];
        i++;
      }
    })(i.formats(), e);
    return n
      ? ri(e, n, {
          useInternationalFormat: "INTERNATIONAL" === r,
          withNationalPrefix:
            !n.nationalPrefixIsOptionalWhenFormattingInNationalFormat() ||
            !a ||
            !1 !== a.nationalPrefix,
          carrierCode: t,
          metadata: i,
        })
      : e;
  }
  function ro(e) {
    return (ro =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function rd(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      (t &&
        (i = i.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        r.push.apply(r, i));
    }
    return r;
  }
  function rl(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? rd(Object(r), !0).forEach(function (t) {
            var i, a, n;
            ((i = e),
              (a = t),
              (n = r[t]),
              (a = rc(a)) in i
                ? Object.defineProperty(i, a, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (i[a] = n));
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
          : rd(Object(r)).forEach(function (t) {
              Object.defineProperty(
                e,
                t,
                Object.getOwnPropertyDescriptor(r, t),
              );
            });
    }
    return e;
  }
  function rc(e) {
    var t = (function (e, t) {
      if ("object" != ro(e) || !e) return e;
      var r = e[Symbol.toPrimitive];
      if (void 0 !== r) {
        var i = r.call(e, t || "default");
        if ("object" != ro(i)) return i;
        throw TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === t ? String : Number)(e);
    })(e, "string");
    return "symbol" == ro(t) ? t : t + "";
  }
  var ru =
      ((s = function e(t, r, i) {
        if (!(this instanceof e))
          throw TypeError("Cannot call a class as a function");
        if (!t) throw TypeError("First argument is required");
        if ("string" != typeof t)
          throw TypeError("First argument must be a string");
        if ("+" === t[0] && !r)
          throw TypeError("`metadata` argument not passed");
        if (tE(r) && tE(r.countries)) {
          i = r;
          var a = t;
          if (!rh.test(a))
            throw Error(
              'Invalid `number` argument passed: must consist of a "+" followed by digits',
            );
          var n = re(a, void 0, void 0, void 0, i),
            s = n.countryCallingCode;
          if (((r = n.number), (t = s), !r))
            throw Error("Invalid `number` argument passed: too short");
        }
        if (!r) throw TypeError("`nationalNumber` argument is required");
        if ("string" != typeof r)
          throw TypeError("`nationalNumber` argument must be a string");
        tW(i);
        var o = (function (e, t) {
            var r,
              i,
              a = new tU(t);
            return (
              /^[A-Z]{2}$/.test(e)
                ? ((r = e),
                  a.selectNumberingPlan(r),
                  (i = a.countryCallingCode()))
                : (i = e),
              { country: r, countryCallingCode: i }
            );
          })(t, i),
          d = o.country,
          l = o.countryCallingCode;
        ((this.country = d),
          (this.countryCallingCode = l),
          (this.nationalNumber = r),
          (this.number = "+" + this.countryCallingCode + this.nationalNumber),
          (this.getMetadata = function () {
            return i;
          }));
      }),
      (o = [
        {
          key: "setExt",
          value: function (e) {
            this.ext = e;
          },
        },
        {
          key: "getPossibleCountries",
          value: function () {
            var e, t, r, i;
            return this.country
              ? [this.country]
              : ((e = this.countryCallingCode),
                (t = this.nationalNumber),
                (i = new tU(
                  (r = this.getMetadata()),
                ).getCountryCodesForCallingCode(e))
                  ? i.filter(function (e) {
                      var i, a, n;
                      return (
                        (i = t),
                        (a = e),
                        (n = new tU(r)).selectNumberingPlan(a),
                        n.numberingPlan.possibleLengths().indexOf(i.length) >= 0
                      );
                    })
                  : []);
          },
        },
        {
          key: "isPossible",
          value: function () {
            return (function (e, t, r) {
              if ((void 0 === t && (t = {}), (r = new tU(r)), t.v2)) {
                if (!e.countryCallingCode)
                  throw Error("Invalid phone number object passed");
                r.selectNumberingPlan(e.countryCallingCode);
              } else {
                if (!e.phone) return !1;
                if (e.country) {
                  if (!r.hasCountry(e.country))
                    throw Error("Unknown country: ".concat(e.country));
                  r.selectNumberingPlan(e.country);
                } else {
                  if (!e.countryCallingCode)
                    throw Error("Invalid phone number object passed");
                  r.selectNumberingPlan(e.countryCallingCode);
                }
              }
              if (r.possibleLengths())
                return tK(e.phone || e.nationalNumber, e.country, r);
              if (
                e.countryCallingCode &&
                r.isNonGeographicCallingCode(e.countryCallingCode)
              )
                return !0;
              throw Error(
                'Missing "possibleLengths" in metadata. Perhaps the metadata has been generated before v1.0.18.',
              );
            })(this, { v2: !0 }, this.getMetadata());
          },
        },
        {
          key: "isValid",
          value: function () {
            var e, t;
            return ((e = e = { v2: !0 }),
            (t = new tU((t = this.getMetadata()))).selectNumberingPlan(
              this.country,
              this.countryCallingCode,
            ),
            t.hasTypes())
              ? void 0 !== tY(this, e, t.metadata)
              : tJ(
                  e.v2 ? this.nationalNumber : this.phone,
                  t.nationalNumberPattern(),
                );
          },
        },
        {
          key: "isNonGeographic",
          value: function () {
            return new tU(this.getMetadata()).isNonGeographicCallingCode(
              this.countryCallingCode,
            );
          },
        },
        {
          key: "isEqual",
          value: function (e) {
            return this.number === e.number && this.ext === e.ext;
          },
        },
        {
          key: "getType",
          value: function () {
            return tY(this, { v2: !0 }, this.getMetadata());
          },
        },
        {
          key: "format",
          value: function (e, t) {
            return (function (e, t, r, i) {
              if (
                ((r = r
                  ? (function () {
                      for (
                        var e = 1, t = arguments.length, r = Array(t), i = 0;
                        i < t;
                        i++
                      )
                        r[i] = arguments[i];
                      for (; e < r.length; ) {
                        if (r[e]) for (var a in r[e]) r[0][a] = r[e][a];
                        e++;
                      }
                      return r[0];
                    })({}, rn, r)
                  : rn),
                (i = new tU(i)),
                e.country && "001" !== e.country)
              ) {
                if (!i.hasCountry(e.country))
                  throw Error("Unknown country: ".concat(e.country));
                i.selectNumberingPlan(e.country);
              } else {
                if (!e.countryCallingCode) return e.phone || "";
                i.selectNumberingPlan(e.countryCallingCode);
              }
              var a,
                n,
                s,
                o,
                d,
                l,
                c,
                u,
                h,
                p,
                f,
                y,
                m,
                _ = i.countryCallingCode(),
                g = r.v2 ? e.nationalNumber : e.phone;
              switch (t) {
                case "NATIONAL":
                  if (!g) return "";
                  return (
                    (a = m = rs(g, e.carrierCode, "NATIONAL", i, r)),
                    (n = e.ext),
                    (s = i),
                    (o = r.formatExtension),
                    n ? o(a, n, s) : a
                  );
                case "INTERNATIONAL":
                  if (!g) return "+".concat(_);
                  return (
                    (m = rs(g, null, "INTERNATIONAL", i, r)),
                    (d = m = "+".concat(_, " ").concat(m)),
                    (l = e.ext),
                    (c = i),
                    (u = r.formatExtension),
                    l ? u(d, l, c) : d
                  );
                case "E.164":
                  return "+".concat(_).concat(g);
                case "RFC3966":
                  var v = { number: "+".concat(_).concat(g), ext: e.ext },
                    $ = v.number,
                    b = v.ext;
                  if (!$) return "";
                  if ("+" !== $[0])
                    throw Error(
                      '"formatRFC3966()" expects "number" to be in E.164 format.',
                    );
                  return "tel:".concat($).concat(b ? ";ext=" + b : "");
                case "IDD":
                  if (!r.fromCountry) return;
                  return (
                    (h = (function (e, t, r, i, a) {
                      if (tB(i, a.metadata) === r) {
                        var n,
                          s,
                          o = rs(e, t, "NATIONAL", a);
                        return "1" === r ? r + " " + o : o;
                      }
                      var d =
                        ((n = void 0),
                        ((s = new tU(a.metadata)).selectNumberingPlan(i, n),
                        s.defaultIDDPrefix())
                          ? s.defaultIDDPrefix()
                          : ra.test(s.IDDPrefix())
                            ? s.IDDPrefix()
                            : void 0);
                      if (d)
                        return ""
                          .concat(d, " ")
                          .concat(r, " ")
                          .concat(rs(e, null, "INTERNATIONAL", a));
                    })(g, e.carrierCode, _, r.fromCountry, i)),
                    (p = e.ext),
                    (f = i),
                    (y = r.formatExtension),
                    p ? y(h, p, f) : h
                  );
                default:
                  throw Error(
                    'Unknown "format" argument passed to "formatNumber()": "'.concat(
                      t,
                      '"',
                    ),
                  );
              }
            })(
              this,
              e,
              t ? rl(rl({}, t), {}, { v2: !0 }) : { v2: !0 },
              this.getMetadata(),
            );
          },
        },
        {
          key: "formatNational",
          value: function (e) {
            return this.format("NATIONAL", e);
          },
        },
        {
          key: "formatInternational",
          value: function (e) {
            return this.format("INTERNATIONAL", e);
          },
        },
        {
          key: "getURI",
          value: function (e) {
            return this.format("RFC3966", e);
          },
        },
      ]),
      (function (e, t) {
        for (var r = 0; r < t.length; r++) {
          var i = t[r];
          ((i.enumerable = i.enumerable || !1),
            (i.configurable = !0),
            "value" in i && (i.writable = !0),
            Object.defineProperty(e, rc(i.key), i));
        }
      })(s.prototype, o),
      Object.defineProperty(s, "prototype", { writable: !1 }),
      s),
    rh = /^\+\d+$/;
  function rp(e) {
    return (rp =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  var rf =
    ((d = function e(t) {
      var r = t.onCountryChange,
        i = t.onCallingCodeChange;
      if (!(this instanceof e))
        throw TypeError("Cannot call a class as a function");
      ((this.onCountryChange = r), (this.onCallingCodeChange = i));
    }),
    (l = [
      {
        key: "reset",
        value: function (e) {
          var t = e.country,
            r = e.callingCode;
          ((this.international = !1),
            (this.missingPlus = !1),
            (this.IDDPrefix = void 0),
            (this.callingCode = void 0),
            (this.digits = ""),
            this.resetNationalSignificantNumber(),
            this.initCountryAndCallingCode(t, r));
        },
      },
      {
        key: "resetNationalSignificantNumber",
        value: function () {
          ((this.nationalSignificantNumber = this.getNationalDigits()),
            (this.nationalSignificantNumberIsModified = !1),
            (this.nationalPrefix = void 0),
            (this.carrierCode = void 0),
            (this.prefixBeforeNationalSignificantNumberThatIsNotNationalPrefix =
              void 0));
        },
      },
      {
        key: "update",
        value: function (e) {
          for (var t = 0, r = Object.keys(e); t < r.length; t++) {
            var i = r[t];
            this[i] = e[i];
          }
        },
      },
      {
        key: "initCountryAndCallingCode",
        value: function (e, t) {
          (this.setCountry(e), this.setCallingCode(t));
        },
      },
      {
        key: "setCountry",
        value: function (e) {
          ((this.country = e), this.onCountryChange(e));
        },
      },
      {
        key: "setCallingCode",
        value: function (e) {
          ((this.callingCode = e), this.onCallingCodeChange(e, this.country));
        },
      },
      {
        key: "startInternationalNumber",
        value: function (e, t) {
          ((this.international = !0), this.initCountryAndCallingCode(e, t));
        },
      },
      {
        key: "appendDigits",
        value: function (e) {
          this.digits += e;
        },
      },
      {
        key: "appendNationalSignificantNumberDigits",
        value: function (e) {
          this.nationalSignificantNumber += e;
        },
      },
      {
        key: "getNationalDigits",
        value: function () {
          return this.international
            ? this.digits.slice(
                (this.IDDPrefix ? this.IDDPrefix.length : 0) +
                  (this.callingCode ? this.callingCode.length : 0),
              )
            : this.digits;
        },
      },
      {
        key: "getDigitsWithoutInternationalPrefix",
        value: function () {
          return this.international && this.IDDPrefix
            ? this.digits.slice(this.IDDPrefix.length)
            : this.digits;
        },
      },
    ]),
    (function (e, t) {
      for (var r = 0; r < t.length; r++) {
        var i = t[r];
        ((i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(
            e,
            (function (e) {
              var t = (function (e, t) {
                if ("object" != rp(e) || !e) return e;
                var r = e[Symbol.toPrimitive];
                if (void 0 !== r) {
                  var i = r.call(e, t || "default");
                  if ("object" != rp(i)) return i;
                  throw TypeError(
                    "@@toPrimitive must return a primitive value.",
                  );
                }
                return ("string" === t ? String : Number)(e);
              })(e, "string");
              return "symbol" == rp(t) ? t : t + "";
            })(i.key),
            i,
          ));
      }
    })(d.prototype, l),
    Object.defineProperty(d, "prototype", { writable: !1 }),
    d);
  function ry(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, i = Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  var rm = /x/;
  function r_(e, t) {
    if (t < 1) return "";
    for (var r = ""; t > 1; ) (1 & t && (r += e), (t >>= 1), (e += e));
    return r + e;
  }
  function rg(e, t) {
    return (
      ")" === e[t] && t++,
      (function (e) {
        for (var t = [], r = 0; r < e.length; )
          ("(" === e[r] ? t.push(r) : ")" === e[r] && t.pop(), r++);
        var i = 0,
          a = "";
        t.push(e.length);
        for (var n = 0; n < t.length; n++) {
          var s = t[n];
          ((a += e.slice(i, s)), (i = s + 1));
        }
        return a;
      })(e.slice(0, t))
    );
  }
  function rv(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, i = Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  var r$ = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    "０": "0",
    "１": "1",
    "２": "2",
    "３": "3",
    "４": "4",
    "５": "5",
    "６": "6",
    "７": "7",
    "８": "8",
    "９": "9",
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };
  function rb(e) {
    for (
      var t,
        r = "",
        i = (function (e) {
          var t =
            ("u" > typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
          if (t) return (t = t.call(e)).next.bind(t);
          if (
            Array.isArray(e) ||
            (t = (function (e) {
              if (e) {
                if ("string" == typeof e) return rv(e, void 0);
                var t = {}.toString.call(e).slice(8, -1);
                return (
                  "Object" === t && e.constructor && (t = e.constructor.name),
                  "Map" === t || "Set" === t
                    ? Array.from(e)
                    : "Arguments" === t ||
                        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
                      ? rv(e, void 0)
                      : void 0
                );
              }
            })(e))
          ) {
            t && (e = t);
            var r = 0;
            return function () {
              return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
            };
          }
          throw TypeError(
            "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
          );
        })(e.split(""));
      !(t = i()).done;

    ) {
      var a = r$[t.value];
      a && (r += a);
    }
    return r;
  }
  function rw(e, t, r) {
    var i,
      a,
      n = r.metadata,
      s = r.useNationalPrefixFormattingRule,
      o = r.getSeparatorAfterNationalPrefix,
      d = ri(e.nationalSignificantNumber, t, {
        carrierCode: e.carrierCode,
        useInternationalFormat: e.international,
        withNationalPrefix: s,
        metadata: n,
      });
    if (
      (!s &&
        (e.nationalPrefix
          ? (d = e.nationalPrefix + o(t) + d)
          : e.prefixBeforeNationalSignificantNumberThatIsNotNationalPrefix &&
            (d =
              e.prefixBeforeNationalSignificantNumberThatIsNotNationalPrefix +
              " " +
              d)),
      (i = d),
      (a = e),
      rb(i) === a.getNationalDigits())
    )
      return d;
  }
  function rI(e) {
    return (rI =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  var rk =
      ((c = function e() {
        if (!(this instanceof e))
          throw TypeError("Cannot call a class as a function");
      }),
      (u = [
        {
          key: "parse",
          value: function (e) {
            if (
              ((this.context = [{ or: !0, instructions: [] }]),
              this.parsePattern(e),
              1 !== this.context.length)
            )
              throw Error(
                "Non-finalized contexts left when pattern parse ended",
              );
            var t = this.context[0],
              r = t.branches,
              i = t.instructions;
            if (r) return { op: "|", args: r.concat([rC(i)]) };
            if (0 === i.length) throw Error("Pattern is required");
            return 1 === i.length ? i[0] : i;
          },
        },
        {
          key: "startContext",
          value: function (e) {
            this.context.push(e);
          },
        },
        {
          key: "endContext",
          value: function () {
            this.context.pop();
          },
        },
        {
          key: "getContext",
          value: function () {
            return this.context[this.context.length - 1];
          },
        },
        {
          key: "parsePattern",
          value: function (e) {
            if (!e) throw Error("Pattern is required");
            var t = e.match(rT);
            if (!t) {
              if (rS.test(e))
                throw Error(
                  "Illegal characters found in a pattern: ".concat(e),
                );
              this.getContext().instructions =
                this.getContext().instructions.concat(e.split(""));
              return;
            }
            var r = t[1],
              i = e.slice(0, t.index),
              a = e.slice(t.index + r.length);
            switch (r) {
              case "(?:":
                (i && this.parsePattern(i),
                  this.startContext({
                    or: !0,
                    instructions: [],
                    branches: [],
                  }));
                break;
              case ")":
                if (!this.getContext().or)
                  throw Error(
                    '")" operator must be preceded by "(?:" operator',
                  );
                if (
                  (i && this.parsePattern(i),
                  0 === this.getContext().instructions.length)
                )
                  throw Error(
                    'No instructions found after "|" operator in an "or" group',
                  );
                var n = this.getContext().branches;
                (n.push(rC(this.getContext().instructions)),
                  this.endContext(),
                  this.getContext().instructions.push({ op: "|", args: n }));
                break;
              case "|":
                if (!this.getContext().or)
                  throw Error(
                    '"|" operator can only be used inside "or" groups',
                  );
                if ((i && this.parsePattern(i), !this.getContext().branches))
                  if (1 === this.context.length)
                    this.getContext().branches = [];
                  else
                    throw Error(
                      '"branches" not found in an "or" group context',
                    );
                (this.getContext().branches.push(
                  rC(this.getContext().instructions),
                ),
                  (this.getContext().instructions = []));
                break;
              case "[":
                (i && this.parsePattern(i),
                  this.startContext({ oneOfSet: !0 }));
                break;
              case "]":
                if (!this.getContext().oneOfSet)
                  throw Error('"]" operator must be preceded by "[" operator');
                (this.endContext(),
                  this.getContext().instructions.push({
                    op: "[]",
                    args: (function (e) {
                      for (var t = [], r = 0; r < e.length; ) {
                        if ("-" === e[r]) {
                          if (0 === r || r === e.length - 1)
                            throw Error(
                              "Couldn't parse a one-of set pattern: ".concat(e),
                            );
                          for (
                            var i = e[r - 1].charCodeAt(0) + 1,
                              a = e[r + 1].charCodeAt(0) - 1,
                              n = i;
                            n <= a;

                          )
                            (t.push(String.fromCharCode(n)), n++);
                        } else t.push(e[r]);
                        r++;
                      }
                      return t;
                    })(i),
                  }));
                break;
              default:
                throw Error("Unknown operator: ".concat(r));
            }
            a && this.parsePattern(a);
          },
        },
      ]),
      (function (e, t) {
        for (var r = 0; r < t.length; r++) {
          var i = t[r];
          ((i.enumerable = i.enumerable || !1),
            (i.configurable = !0),
            "value" in i && (i.writable = !0),
            Object.defineProperty(
              e,
              (function (e) {
                var t = (function (e, t) {
                  if ("object" != rI(e) || !e) return e;
                  var r = e[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var i = r.call(e, t || "default");
                    if ("object" != rI(i)) return i;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === t ? String : Number)(e);
                })(e, "string");
                return "symbol" == rI(t) ? t : t + "";
              })(i.key),
              i,
            ));
        }
      })(c.prototype, u),
      Object.defineProperty(c, "prototype", { writable: !1 }),
      c),
    rS = /[\(\)\[\]\?\:\|]/,
    rT = RegExp("(\\||\\(\\?\\:|\\)|\\[|\\])");
  function rC(e) {
    return 1 === e.length ? e[0] : e;
  }
  function rE(e, t) {
    var r = ("u" > typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
    if (r) return (r = r.call(e)).next.bind(r);
    if (
      Array.isArray(e) ||
      (r = (function (e) {
        if (e) {
          if ("string" == typeof e) return rA(e, void 0);
          var t = {}.toString.call(e).slice(8, -1);
          return (
            "Object" === t && e.constructor && (t = e.constructor.name),
            "Map" === t || "Set" === t
              ? Array.from(e)
              : "Arguments" === t ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
                ? rA(e, void 0)
                : void 0
          );
        }
      })(e)) ||
      (t && e && "number" == typeof e.length)
    ) {
      r && (e = r);
      var i = 0;
      return function () {
        return i >= e.length ? { done: !0 } : { done: !1, value: e[i++] };
      };
    }
    throw TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
    );
  }
  function rA(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, i = Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  function rx(e) {
    return (rx =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  var rN =
    ((h = function e(t) {
      if (!(this instanceof e))
        throw TypeError("Cannot call a class as a function");
      this.matchTree = new rk().parse(t);
    }),
    (p = [
      {
        key: "match",
        value: function (e) {
          var t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            r = t.allowOverflow;
          if (!e) throw Error("String is required");
          var i = (function e(t, r, i) {
            if ("string" == typeof r) {
              var a = t.join("");
              return 0 === r.indexOf(a)
                ? t.length === r.length
                  ? { match: !0, matchedChars: t }
                  : { partialMatch: !0 }
                : 0 === a.indexOf(r)
                  ? i && t.length > r.length
                    ? { overflow: !0 }
                    : { match: !0, matchedChars: t.slice(0, r.length) }
                  : void 0;
            }
            if (Array.isArray(r)) {
              for (var n = t.slice(), s = 0; s < r.length; ) {
                var o = e(n, r[s], i && s === r.length - 1);
                if (!o) return;
                if (o.overflow) return o;
                if (o.match) {
                  if (0 === (n = n.slice(o.matchedChars.length)).length)
                    if (s === r.length - 1)
                      return { match: !0, matchedChars: t };
                    else return { partialMatch: !0 };
                } else if (o.partialMatch) return { partialMatch: !0 };
                else
                  throw Error(
                    "Unsupported match result:\n".concat(
                      JSON.stringify(o, null, 2),
                    ),
                  );
                s++;
              }
              return i
                ? { overflow: !0 }
                : { match: !0, matchedChars: t.slice(0, t.length - n.length) };
            }
            switch (r.op) {
              case "|":
                for (var d, l, c = rE(r.args); !(l = c()).done; ) {
                  var u = e(t, l.value, i);
                  if (u)
                    if (u.overflow) return u;
                    else if (u.match)
                      return { match: !0, matchedChars: u.matchedChars };
                    else if (u.partialMatch) d = !0;
                    else
                      throw Error(
                        "Unsupported match result:\n".concat(
                          JSON.stringify(u, null, 2),
                        ),
                      );
                }
                if (d) return { partialMatch: !0 };
                return;
              case "[]":
                for (var h, p = rE(r.args); !(h = p()).done; ) {
                  var f = h.value;
                  if (t[0] === f) {
                    if (1 === t.length) return { match: !0, matchedChars: t };
                    if (i) return { overflow: !0 };
                    return { match: !0, matchedChars: [f] };
                  }
                }
                return;
              default:
                throw Error("Unsupported instruction tree: ".concat(r));
            }
          })(e.split(""), this.matchTree, !0);
          if ((i && i.match && delete i.matchedChars, !i || !i.overflow || r))
            return i;
        },
      },
    ]),
    (function (e, t) {
      for (var r = 0; r < t.length; r++) {
        var i = t[r];
        ((i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(
            e,
            (function (e) {
              var t = (function (e, t) {
                if ("object" != rx(e) || !e) return e;
                var r = e[Symbol.toPrimitive];
                if (void 0 !== r) {
                  var i = r.call(e, t || "default");
                  if ("object" != rx(i)) return i;
                  throw TypeError(
                    "@@toPrimitive must return a primitive value.",
                  );
                }
                return ("string" === t ? String : Number)(e);
              })(e, "string");
              return "symbol" == rx(t) ? t : t + "";
            })(i.key),
            i,
          ));
      }
    })(h.prototype, p),
    Object.defineProperty(h, "prototype", { writable: !1 }),
    h);
  function rP(e) {
    return (rP =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function rO(e, t) {
    var r = ("u" > typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
    if (r) return (r = r.call(e)).next.bind(r);
    if (
      Array.isArray(e) ||
      (r = (function (e) {
        if (e) {
          if ("string" == typeof e) return rR(e, void 0);
          var t = {}.toString.call(e).slice(8, -1);
          return (
            "Object" === t && e.constructor && (t = e.constructor.name),
            "Map" === t || "Set" === t
              ? Array.from(e)
              : "Arguments" === t ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
                ? rR(e, void 0)
                : void 0
          );
        }
      })(e)) ||
      (t && e && "number" == typeof e.length)
    ) {
      r && (e = r);
      var i = 0;
      return function () {
        return i >= e.length ? { done: !0 } : { done: !1, value: e[i++] };
      };
    }
    throw TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
    );
  }
  function rR(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, i = Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  var rU = r_("9", 15),
    rM = /[- ]/,
    rD = RegExp("[" + t0 + "]*\\$1[" + t0 + "]*(\\$\\d[" + t0 + "]*)*$"),
    rL =
      ((f = function e(t) {
        t.state;
        var r = t.metadata;
        if (!(this instanceof e))
          throw TypeError("Cannot call a class as a function");
        ((this.metadata = r), this.resetFormat());
      }),
      (y = [
        {
          key: "resetFormat",
          value: function () {
            ((this.chosenFormat = void 0),
              (this.template = void 0),
              (this.nationalNumberTemplate = void 0),
              (this.populatedNationalNumberTemplate = void 0),
              (this.populatedNationalNumberTemplatePosition = -1));
          },
        },
        {
          key: "reset",
          value: function (e, t) {
            (this.resetFormat(),
              e
                ? ((this.isNANP = "1" === e.callingCode()),
                  (this.matchingFormats = e.formats()),
                  t.nationalSignificantNumber &&
                    this.narrowDownMatchingFormats(t))
                : ((this.isNANP = void 0), (this.matchingFormats = [])));
          },
        },
        {
          key: "format",
          value: function (e, t) {
            var r = this;
            if (
              ((i = t.nationalSignificantNumber),
              "IS_POSSIBLE" === tZ(i, t.country, this.metadata))
            )
              for (var i, a, n = rO(this.matchingFormats); !(a = n()).done; ) {
                var s = a.value,
                  o = (function (e, t, r) {
                    var i = r.metadata,
                      a = r.shouldTryNationalPrefixFormattingRule,
                      n = r.getSeparatorAfterNationalPrefix;
                    if (
                      new RegExp("^(?:".concat(t.pattern(), ")$")).test(
                        e.nationalSignificantNumber,
                      )
                    )
                      return (function (e, t, r) {
                        var i = r.metadata,
                          a = r.shouldTryNationalPrefixFormattingRule,
                          n = r.getSeparatorAfterNationalPrefix;
                        if (
                          (e.nationalSignificantNumber,
                          e.international,
                          e.nationalPrefix,
                          e.carrierCode,
                          a(t))
                        ) {
                          var s = rw(e, t, {
                            useNationalPrefixFormattingRule: !0,
                            getSeparatorAfterNationalPrefix: n,
                            metadata: i,
                          });
                          if (s) return s;
                        }
                        return rw(e, t, {
                          useNationalPrefixFormattingRule: !1,
                          getSeparatorAfterNationalPrefix: n,
                          metadata: i,
                        });
                      })(e, t, {
                        metadata: i,
                        shouldTryNationalPrefixFormattingRule: a,
                        getSeparatorAfterNationalPrefix: n,
                      });
                  })(t, s, {
                    metadata: this.metadata,
                    shouldTryNationalPrefixFormattingRule: function (e) {
                      return r.shouldTryNationalPrefixFormattingRule(e, {
                        international: t.international,
                        nationalPrefix: t.nationalPrefix,
                      });
                    },
                    getSeparatorAfterNationalPrefix: function (e) {
                      return r.getSeparatorAfterNationalPrefix(e);
                    },
                  });
                if (o)
                  return (
                    this.resetFormat(),
                    (this.chosenFormat = s),
                    this.setNationalNumberTemplate(o.replace(/\d/g, "x"), t),
                    (this.populatedNationalNumberTemplate = o),
                    (this.populatedNationalNumberTemplatePosition =
                      this.template.lastIndexOf("x")),
                    o
                  );
              }
            return this.formatNationalNumberWithNextDigits(e, t);
          },
        },
        {
          key: "formatNationalNumberWithNextDigits",
          value: function (e, t) {
            var r = this.chosenFormat,
              i = this.chooseFormat(t);
            if (i)
              if (i === r) return this.formatNextNationalNumberDigits(e);
              else
                return this.formatNextNationalNumberDigits(
                  t.getNationalDigits(),
                );
          },
        },
        {
          key: "narrowDownMatchingFormats",
          value: function (e) {
            var t = this,
              r = e.nationalSignificantNumber,
              i = e.nationalPrefix,
              a = e.international,
              n = r.length - 3;
            (n < 0 && (n = 0),
              (this.matchingFormats = this.matchingFormats.filter(function (e) {
                return t.formatSuits(e, a, i) && t.formatMatches(e, r, n);
              })),
              this.chosenFormat &&
                -1 === this.matchingFormats.indexOf(this.chosenFormat) &&
                this.resetFormat());
          },
        },
        {
          key: "formatSuits",
          value: function (e, t, r) {
            return !(
              (r &&
                !e.usesNationalPrefix() &&
                !e.nationalPrefixIsOptionalWhenFormattingInNationalFormat()) ||
              (!t &&
                !r &&
                e.nationalPrefixIsMandatoryWhenFormattingInNationalFormat())
            );
          },
        },
        {
          key: "formatMatches",
          value: function (e, t, r) {
            var i = e.leadingDigitsPatterns().length;
            if (0 === i) return !0;
            r = Math.min(r, i - 1);
            var a = e.leadingDigitsPatterns()[r];
            if (t.length < 3)
              try {
                return void 0 !== new rN(a).match(t, { allowOverflow: !0 });
              } catch (e) {
                return (console.error(e), !0);
              }
            return new RegExp("^(".concat(a, ")")).test(t);
          },
        },
        {
          key: "getFormatFormat",
          value: function (e, t) {
            return t ? e.internationalFormat() : e.format();
          },
        },
        {
          key: "chooseFormat",
          value: function (e) {
            for (
              var t, r, i = this, a = rO(this.matchingFormats.slice());
              !(r = a()).done &&
              0 !==
                (t = (function () {
                  var t = r.value;
                  return i.chosenFormat === t
                    ? 0
                    : rD.test(i.getFormatFormat(t, e.international))
                      ? i.createTemplateForFormat(t, e)
                        ? ((i.chosenFormat = t), 0)
                        : ((i.matchingFormats = i.matchingFormats.filter(
                            function (e) {
                              return e !== t;
                            },
                          )),
                          1)
                      : 1;
                })());

            )
              if (1 === t) continue;
            return (this.chosenFormat || this.resetFormat(), this.chosenFormat);
          },
        },
        {
          key: "createTemplateForFormat",
          value: function (e, t) {
            if (!(e.pattern().indexOf("|") >= 0)) {
              var r = this.getTemplateForFormat(e, t);
              if (r) return (this.setNationalNumberTemplate(r, t), !0);
            }
          },
        },
        {
          key: "getSeparatorAfterNationalPrefix",
          value: function (e) {
            return this.isNANP ||
              (e &&
                e.nationalPrefixFormattingRule() &&
                rM.test(e.nationalPrefixFormattingRule()))
              ? " "
              : "";
          },
        },
        {
          key: "getInternationalPrefixBeforeCountryCallingCode",
          value: function (e, t) {
            var r = e.IDDPrefix,
              i = e.missingPlus;
            return r ? (t && !1 === t.spacing ? r : r + " ") : i ? "" : "+";
          },
        },
        {
          key: "getTemplate",
          value: function (e) {
            if (this.template) {
              for (
                var t = -1,
                  r = 0,
                  i = e.international
                    ? this.getInternationalPrefixBeforeCountryCallingCode(e, {
                        spacing: !1,
                      })
                    : "";
                r < i.length + e.getDigitsWithoutInternationalPrefix().length;

              )
                ((t = this.template.indexOf("x", t + 1)), r++);
              return rg(this.template, t + 1);
            }
          },
        },
        {
          key: "setNationalNumberTemplate",
          value: function (e, t) {
            ((this.nationalNumberTemplate = e),
              (this.populatedNationalNumberTemplate = e),
              (this.populatedNationalNumberTemplatePosition = -1),
              t.international
                ? (this.template =
                    this.getInternationalPrefixBeforeCountryCallingCode(
                      t,
                    ).replace(/[\d\+]/g, "x") +
                    r_("x", t.callingCode.length) +
                    " " +
                    e)
                : (this.template = e));
          },
        },
        {
          key: "getTemplateForFormat",
          value: function (e, t) {
            var r,
              i = t.nationalSignificantNumber,
              a = t.international,
              n = t.nationalPrefix,
              s =
                t.prefixBeforeNationalSignificantNumberThatIsNotNationalPrefix,
              o = e.pattern();
            o = o
              .replace(/\[([^\[\]])*\]/g, "\\d")
              .replace(/\d(?=[^,}][^,}])/g, "\\d");
            var d = rU.match(o)[0];
            if (!(i.length > d.length)) {
              var l = RegExp("^" + o + "$"),
                c = i.replace(/\d/g, "9");
              l.test(c) && (d = c);
              var u = this.getFormatFormat(e, a);
              if (
                this.shouldTryNationalPrefixFormattingRule(e, {
                  international: a,
                  nationalPrefix: n,
                })
              ) {
                var h = u.replace(rr, e.nationalPrefixFormattingRule());
                if (
                  rb(e.nationalPrefixFormattingRule()) ===
                    (n || "") + rb("$1") &&
                  ((u = h), (r = !0), n)
                )
                  for (var p = n.length; p > 0; )
                    ((u = u.replace(/\d/, "x")), p--);
              }
              var f = d.replace(new RegExp(o), u).replace(/9/g, "x");
              return (
                !r &&
                  (s
                    ? (f = r_("x", s.length) + " " + f)
                    : n &&
                      (f =
                        r_("x", n.length) +
                        this.getSeparatorAfterNationalPrefix(e) +
                        f)),
                a && (f = rt(f)),
                f
              );
            }
          },
        },
        {
          key: "formatNextNationalNumberDigits",
          value: function (e) {
            var t = (function (e, t, r) {
              for (
                var i,
                  a = (function (e) {
                    var t =
                      ("u" > typeof Symbol && e[Symbol.iterator]) ||
                      e["@@iterator"];
                    if (t) return (t = t.call(e)).next.bind(t);
                    if (
                      Array.isArray(e) ||
                      (t = (function (e) {
                        if (e) {
                          if ("string" == typeof e) return ry(e, void 0);
                          var t = {}.toString.call(e).slice(8, -1);
                          return (
                            "Object" === t &&
                              e.constructor &&
                              (t = e.constructor.name),
                            "Map" === t || "Set" === t
                              ? Array.from(e)
                              : "Arguments" === t ||
                                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(
                                    t,
                                  )
                                ? ry(e, void 0)
                                : void 0
                          );
                        }
                      })(e))
                    ) {
                      t && (e = t);
                      var r = 0;
                      return function () {
                        return r >= e.length
                          ? { done: !0 }
                          : { done: !1, value: e[r++] };
                      };
                    }
                    throw TypeError(
                      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                    );
                  })(r.split(""));
                !(i = a()).done;

              ) {
                var n = i.value;
                if (0 > e.slice(t + 1).search(rm)) return;
                ((t = e.search(rm)), (e = e.replace(rm, n)));
              }
              return [e, t];
            })(
              this.populatedNationalNumberTemplate,
              this.populatedNationalNumberTemplatePosition,
              e,
            );
            return t
              ? ((this.populatedNationalNumberTemplate = t[0]),
                (this.populatedNationalNumberTemplatePosition = t[1]),
                rg(
                  this.populatedNationalNumberTemplate,
                  this.populatedNationalNumberTemplatePosition + 1,
                ))
              : void this.resetFormat();
          },
        },
        {
          key: "shouldTryNationalPrefixFormattingRule",
          value: function (e, t) {
            var r = t.international,
              i = t.nationalPrefix;
            if (e.nationalPrefixFormattingRule()) {
              var a = e.usesNationalPrefix();
              if ((a && i) || (!a && !r)) return !0;
            }
          },
        },
      ]),
      (function (e, t) {
        for (var r = 0; r < t.length; r++) {
          var i = t[r];
          ((i.enumerable = i.enumerable || !1),
            (i.configurable = !0),
            "value" in i && (i.writable = !0),
            Object.defineProperty(
              e,
              (function (e) {
                var t = (function (e, t) {
                  if ("object" != rP(e) || !e) return e;
                  var r = e[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var i = r.call(e, t || "default");
                    if ("object" != rP(i)) return i;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === t ? String : Number)(e);
                })(e, "string");
                return "symbol" == rP(t) ? t : t + "";
              })(i.key),
              i,
            ));
        }
      })(f.prototype, y),
      Object.defineProperty(f, "prototype", { writable: !1 }),
      f);
  function rF(e) {
    return (rF =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function rj(e, t) {
    return (
      (function (e) {
        if (Array.isArray(e)) return e;
      })(e) ||
      (function (e, t) {
        var r =
          null == e
            ? null
            : ("u" > typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
        if (null != r) {
          var i,
            a,
            n,
            s,
            o = [],
            d = !0,
            l = !1;
          try {
            if (((n = (r = r.call(e)).next), 0 === t)) {
              if (Object(r) !== r) return;
              d = !1;
            } else
              for (
                ;
                !(d = (i = n.call(r)).done) &&
                (o.push(i.value), o.length !== t);
                d = !0
              );
          } catch (e) {
            ((l = !0), (a = e));
          } finally {
            try {
              if (!d && null != r.return && ((s = r.return()), Object(s) !== s))
                return;
            } finally {
              if (l) throw a;
            }
          }
          return o;
        }
      })(e, t) ||
      (function (e, t) {
        if (e) {
          if ("string" == typeof e) return rW(e, t);
          var r = {}.toString.call(e).slice(8, -1);
          return (
            "Object" === r && e.constructor && (r = e.constructor.name),
            "Map" === r || "Set" === r
              ? Array.from(e)
              : "Arguments" === r ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
                ? rW(e, t)
                : void 0
          );
        }
      })(e, t) ||
      (function () {
        throw TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
        );
      })()
    );
  }
  function rW(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, i = Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  var rG = RegExp("^[" + t0 + tQ + "]+$", "i"),
    rB = "(?:[" + t1 + "][" + t0 + tQ + "]*|[" + t0 + tQ + "]+)",
    rV = RegExp("[^" + t0 + tQ + "]+.*$"),
    rq = /[^\d\[\]]/,
    rZ =
      ((m = function e(t) {
        var r = t.defaultCountry,
          i = t.defaultCallingCode,
          a = t.metadata,
          n = t.onNationalSignificantNumberChange;
        if (!(this instanceof e))
          throw TypeError("Cannot call a class as a function");
        ((this.defaultCountry = r),
          (this.defaultCallingCode = i),
          (this.metadata = a),
          (this.onNationalSignificantNumberChange = n));
      }),
      (_ = [
        {
          key: "input",
          value: function (e, t) {
            var r,
              i,
              a,
              n,
              s,
              o = rj(
                ((a = (i = rj(
                  "+" ===
                    (r =
                      (function (e) {
                        var t,
                          r = e.search(rB);
                        if (!(r < 0))
                          return (
                            "+" === (e = e.slice(r))[0] &&
                              ((t = !0), (e = e.slice(1))),
                            (e = e.replace(rV, "")),
                            t && (e = "+" + e),
                            e
                          );
                      })(e) || "")[0]
                    ? [r.slice(1), !0]
                    : [r],
                  2,
                ))[0]),
                (n = i[1]),
                rG.test(a) || (a = ""),
                [a, n]),
                2,
              ),
              d = o[0],
              l = o[1],
              c = rb(d);
            return (
              l &&
                !t.digits &&
                (t.startInternationalNumber(void 0, void 0), c || (s = !0)),
              c && this.inputDigits(c, t),
              { digits: c, justLeadingPlus: s }
            );
          },
        },
        {
          key: "inputDigits",
          value: function (e, t) {
            var r = t.digits,
              i = r.length < 3 && r.length + e.length >= 3;
            if (
              (t.appendDigits(e),
              i && this.extractIddPrefix(t),
              this.isWaitingForCountryCallingCode(t))
            ) {
              if (!this.extractCountryCallingCode(t)) return;
            } else t.appendNationalSignificantNumberDigits(e);
            t.international ||
              this.hasExtractedNationalSignificantNumber ||
              this.extractNationalSignificantNumber(
                t.getNationalDigits(),
                function (e) {
                  return t.update(e);
                },
              );
          },
        },
        {
          key: "isWaitingForCountryCallingCode",
          value: function (e) {
            var t = e.international,
              r = e.callingCode;
            return t && !r;
          },
        },
        {
          key: "extractCountryCallingCode",
          value: function (e) {
            var t = re(
                "+" + e.getDigitsWithoutInternationalPrefix(),
                e.country,
                this.defaultCountry,
                this.defaultCallingCode,
                this.metadata.metadata,
              ),
              r = t.countryCallingCode,
              i = t.number;
            if (r)
              return (
                e.setCallingCode(r),
                e.update({ nationalSignificantNumber: i }),
                !0
              );
          },
        },
        {
          key: "reset",
          value: function (e) {
            if (e) {
              this.hasSelectedNumberingPlan = !0;
              var t = e._nationalPrefixForParsing();
              this.couldPossiblyExtractAnotherNationalSignificantNumber =
                t && rq.test(t);
            } else
              ((this.hasSelectedNumberingPlan = void 0),
                (this.couldPossiblyExtractAnotherNationalSignificantNumber =
                  void 0));
          },
        },
        {
          key: "extractNationalSignificantNumber",
          value: function (e, t) {
            if (this.hasSelectedNumberingPlan) {
              var r = t4(e, this.metadata),
                i = r.nationalPrefix,
                a = r.nationalNumber,
                n = r.carrierCode;
              if (a !== e)
                return (this.onExtractedNationalNumber(i, n, a, e, t), !0);
            }
          },
        },
        {
          key: "extractAnotherNationalSignificantNumber",
          value: function (e, t, r) {
            if (!this.hasExtractedNationalSignificantNumber)
              return this.extractNationalSignificantNumber(e, r);
            if (this.couldPossiblyExtractAnotherNationalSignificantNumber) {
              var i = t4(e, this.metadata),
                a = i.nationalPrefix,
                n = i.nationalNumber,
                s = i.carrierCode;
              if (n !== t)
                return (this.onExtractedNationalNumber(a, s, n, e, r), !0);
            }
          },
        },
        {
          key: "onExtractedNationalNumber",
          value: function (e, t, r, i, a) {
            var n,
              s = !1,
              o = i.lastIndexOf(r);
            if (o < 0 || o !== i.length - r.length) s = !0;
            else {
              var d = i.slice(0, o);
              d && d !== e && (n = d);
            }
            (a({
              nationalPrefix: e,
              carrierCode: t,
              nationalSignificantNumber: r,
              nationalSignificantNumberIsModified: s,
              prefixBeforeNationalSignificantNumberThatIsNotNationalPrefix: n,
            }),
              (this.hasExtractedNationalSignificantNumber = !0),
              this.onNationalSignificantNumberChange());
          },
        },
        {
          key: "reExtractNationalSignificantNumber",
          value: function (e) {
            return (
              !!this.extractAnotherNationalSignificantNumber(
                e.getNationalDigits(),
                e.nationalSignificantNumber,
                function (t) {
                  return e.update(t);
                },
              ) ||
              (this.extractIddPrefix(e) || this.fixMissingPlus(e)
                ? (this.extractCallingCodeAndNationalSignificantNumber(e), !0)
                : void 0)
            );
          },
        },
        {
          key: "extractIddPrefix",
          value: function (e) {
            var t = e.international,
              r = e.IDDPrefix,
              i = e.digits;
            if ((e.nationalSignificantNumber, !t && !r)) {
              var a = t3(
                i,
                this.defaultCountry,
                this.defaultCallingCode,
                this.metadata.metadata,
              );
              if (void 0 !== a && a !== i)
                return (
                  e.update({ IDDPrefix: i.slice(0, i.length - a.length) }),
                  this.startInternationalNumber(e, {
                    country: void 0,
                    callingCode: void 0,
                  }),
                  !0
                );
            }
          },
        },
        {
          key: "fixMissingPlus",
          value: function (e) {
            if (!e.international) {
              var t = t7(
                e.digits,
                e.country,
                this.defaultCountry,
                this.defaultCallingCode,
                this.metadata.metadata,
              ).countryCallingCode;
              if (t)
                return (
                  e.update({ missingPlus: !0 }),
                  this.startInternationalNumber(e, {
                    country: e.country,
                    callingCode: t,
                  }),
                  !0
                );
            }
          },
        },
        {
          key: "startInternationalNumber",
          value: function (e, t) {
            var r = t.country,
              i = t.callingCode;
            (e.startInternationalNumber(r, i),
              e.nationalSignificantNumber &&
                (e.resetNationalSignificantNumber(),
                this.onNationalSignificantNumberChange(),
                (this.hasExtractedNationalSignificantNumber = void 0)));
          },
        },
        {
          key: "extractCallingCodeAndNationalSignificantNumber",
          value: function (e) {
            this.extractCountryCallingCode(e) &&
              this.extractNationalSignificantNumber(
                e.getNationalDigits(),
                function (t) {
                  return e.update(t);
                },
              );
          },
        },
      ]),
      (function (e, t) {
        for (var r = 0; r < t.length; r++) {
          var i = t[r];
          ((i.enumerable = i.enumerable || !1),
            (i.configurable = !0),
            "value" in i && (i.writable = !0),
            Object.defineProperty(
              e,
              (function (e) {
                var t = (function (e, t) {
                  if ("object" != rF(e) || !e) return e;
                  var r = e[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var i = r.call(e, t || "default");
                    if ("object" != rF(i)) return i;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === t ? String : Number)(e);
                })(e, "string");
                return "symbol" == rF(t) ? t : t + "";
              })(i.key),
              i,
            ));
        }
      })(m.prototype, _),
      Object.defineProperty(m, "prototype", { writable: !1 }),
      m);
  function rK(e) {
    return (rK =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function rJ(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, i = Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  var rH =
    ((g = function e(t, r) {
      if (!(this instanceof e))
        throw TypeError("Cannot call a class as a function");
      this.metadata = new tU(r);
      var i,
        a =
          (function (e) {
            if (Array.isArray(e)) return e;
          })((i = this.getCountryAndCallingCode(t))) ||
          (function (e) {
            var t =
              null == e
                ? null
                : ("u" > typeof Symbol && e[Symbol.iterator]) ||
                  e["@@iterator"];
            if (null != t) {
              var r,
                i,
                a,
                n,
                s = [],
                o = !0,
                d = !1;
              try {
                ((a = (t = t.call(e)).next), !1);
                for (
                  ;
                  !(o = (r = a.call(t)).done) &&
                  (s.push(r.value), 2 !== s.length);
                  o = !0
                );
              } catch (e) {
                ((d = !0), (i = e));
              } finally {
                try {
                  if (
                    !o &&
                    null != t.return &&
                    ((n = t.return()), Object(n) !== n)
                  )
                    return;
                } finally {
                  if (d) throw i;
                }
              }
              return s;
            }
          })(i) ||
          (function (e) {
            if (e) {
              if ("string" == typeof e) return rJ(e, 2);
              var t = {}.toString.call(e).slice(8, -1);
              return (
                "Object" === t && e.constructor && (t = e.constructor.name),
                "Map" === t || "Set" === t
                  ? Array.from(e)
                  : "Arguments" === t ||
                      /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
                    ? rJ(e, 2)
                    : void 0
              );
            }
          })(i) ||
          (function () {
            throw TypeError(
              "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
            );
          })(),
        n = a[0],
        s = a[1];
      ((this.defaultCountry = n), (this.defaultCallingCode = s), this.reset());
    }),
    (v = [
      {
        key: "getCountryAndCallingCode",
        value: function (e) {
          var t, r;
          return (
            e &&
              (tE(e)
                ? ((t = e.defaultCountry), (r = e.defaultCallingCode))
                : (t = e)),
            t && !this.metadata.hasCountry(t) && (t = void 0),
            [t, r]
          );
        },
      },
      {
        key: "input",
        value: function (e) {
          var t = this.parser.input(e, this.state),
            r = t.digits;
          if (t.justLeadingPlus) this.formattedOutput = "+";
          else if (r) {
            if (
              (this.determineTheCountryIfNeeded(),
              this.state.nationalSignificantNumber &&
                this.formatter.narrowDownMatchingFormats(this.state),
              this.metadata.hasSelectedNumberingPlan() &&
                (i = this.formatter.format(r, this.state)),
              void 0 === i &&
                this.parser.reExtractNationalSignificantNumber(this.state))
            ) {
              this.determineTheCountryIfNeeded();
              var i,
                a = this.state.getNationalDigits();
              a && (i = this.formatter.format(a, this.state));
            }
            this.formattedOutput = i
              ? this.getFullNumber(i)
              : this.getNonFormattedNumber();
          }
          return this.formattedOutput;
        },
      },
      {
        key: "reset",
        value: function () {
          var e = this;
          return (
            (this.state = new rf({
              onCountryChange: function (t) {
                e.country = t;
              },
              onCallingCodeChange: function (t, r) {
                (e.metadata.selectNumberingPlan(r, t),
                  e.formatter.reset(e.metadata.numberingPlan, e.state),
                  e.parser.reset(e.metadata.numberingPlan));
              },
            })),
            (this.formatter = new rL({
              state: this.state,
              metadata: this.metadata,
            })),
            (this.parser = new rZ({
              defaultCountry: this.defaultCountry,
              defaultCallingCode: this.defaultCallingCode,
              metadata: this.metadata,
              state: this.state,
              onNationalSignificantNumberChange: function () {
                (e.determineTheCountryIfNeeded(),
                  e.formatter.reset(e.metadata.numberingPlan, e.state));
              },
            })),
            this.state.reset({
              country: this.defaultCountry,
              callingCode: this.defaultCallingCode,
            }),
            (this.formattedOutput = ""),
            this
          );
        },
      },
      {
        key: "isInternational",
        value: function () {
          return this.state.international;
        },
      },
      {
        key: "getCallingCode",
        value: function () {
          if (this.isInternational()) return this.state.callingCode;
        },
      },
      {
        key: "getCountryCallingCode",
        value: function () {
          return this.getCallingCode();
        },
      },
      {
        key: "getCountry",
        value: function () {
          if (this.state.digits) return this._getCountry();
        },
      },
      {
        key: "_getCountry",
        value: function () {
          return this.state.country;
        },
      },
      {
        key: "determineTheCountryIfNeeded",
        value: function () {
          (!this.state.country || this.isCountryCallingCodeAmbiguous()) &&
            this.determineTheCountry();
        },
      },
      {
        key: "getFullNumber",
        value: function (e) {
          var t = this;
          if (this.isInternational()) {
            var r = function (e) {
                return (
                  t.formatter.getInternationalPrefixBeforeCountryCallingCode(
                    t.state,
                    { spacing: !!e },
                  ) + e
                );
              },
              i = this.state.callingCode;
            return r(
              i
                ? e
                  ? "".concat(i, " ").concat(e)
                  : i
                : "".concat(this.state.getDigitsWithoutInternationalPrefix()),
            );
          }
          return e;
        },
      },
      {
        key: "getNonFormattedNationalNumberWithPrefix",
        value: function () {
          var e = this.state,
            t = e.nationalSignificantNumber,
            r = e.prefixBeforeNationalSignificantNumberThatIsNotNationalPrefix,
            i = e.nationalPrefix,
            a = t,
            n = r || i;
          return (n && (a = n + a), a);
        },
      },
      {
        key: "getNonFormattedNumber",
        value: function () {
          var e = this.state.nationalSignificantNumberIsModified;
          return this.getFullNumber(
            e
              ? this.state.getNationalDigits()
              : this.getNonFormattedNationalNumberWithPrefix(),
          );
        },
      },
      {
        key: "getNonFormattedTemplate",
        value: function () {
          var e = this.getNonFormattedNumber();
          if (e) return e.replace(/[\+\d]/g, "x");
        },
      },
      {
        key: "isCountryCallingCodeAmbiguous",
        value: function () {
          var e = this.state.callingCode,
            t = this.metadata.getCountryCodesForCallingCode(e);
          return t && t.length > 1;
        },
      },
      {
        key: "determineTheCountry",
        value: function () {
          this.state.setCountry(
            t8(
              this.isInternational()
                ? this.state.callingCode
                : this.defaultCallingCode,
              {
                nationalNumber: this.state.nationalSignificantNumber,
                metadata: this.metadata,
              },
            ),
          );
        },
      },
      {
        key: "getNumberValue",
        value: function () {
          var e = this.state,
            t = e.digits,
            r = e.callingCode,
            i = e.country,
            a = e.nationalSignificantNumber;
          if (t) {
            if (this.isInternational())
              if (r) return "+" + r + a;
              else return "+" + t;
            else if (i || r)
              return "+" + (i ? this.metadata.countryCallingCode() : r) + a;
          }
        },
      },
      {
        key: "getNumber",
        value: function () {
          var e = this.state,
            t = e.nationalSignificantNumber,
            r = e.carrierCode,
            i = e.callingCode,
            a = this._getCountry();
          if (t && (a || i)) {
            if (a && a === this.defaultCountry) {
              var n = new tU(this.metadata.metadata);
              n.selectNumberingPlan(a);
              var s = n.numberingPlan.callingCode(),
                o = this.metadata.getCountryCodesForCallingCode(s);
              if (o.length > 1) {
                var d = t5(t, {
                  countries: o,
                  metadata: this.metadata.metadata,
                });
                d && (a = d);
              }
            }
            var l = new ru(a || i, t, this.metadata.metadata);
            return (r && (l.carrierCode = r), l);
          }
        },
      },
      {
        key: "isPossible",
        value: function () {
          var e = this.getNumber();
          return !!e && e.isPossible();
        },
      },
      {
        key: "isValid",
        value: function () {
          var e = this.getNumber();
          return !!e && e.isValid();
        },
      },
      {
        key: "getNationalNumber",
        value: function () {
          return this.state.nationalSignificantNumber;
        },
      },
      {
        key: "getChars",
        value: function () {
          return (this.state.international ? "+" : "") + this.state.digits;
        },
      },
      {
        key: "getTemplate",
        value: function () {
          return (
            this.formatter.getTemplate(this.state) ||
            this.getNonFormattedTemplate() ||
            ""
          );
        },
      },
    ]),
    (function (e, t) {
      for (var r = 0; r < t.length; r++) {
        var i = t[r];
        ((i.enumerable = i.enumerable || !1),
          (i.configurable = !0),
          "value" in i && (i.writable = !0),
          Object.defineProperty(
            e,
            (function (e) {
              var t = (function (e, t) {
                if ("object" != rK(e) || !e) return e;
                var r = e[Symbol.toPrimitive];
                if (void 0 !== r) {
                  var i = r.call(e, t || "default");
                  if ("object" != rK(i)) return i;
                  throw TypeError(
                    "@@toPrimitive must return a primitive value.",
                  );
                }
                return ("string" === t ? String : Number)(e);
              })(e, "string");
              return "symbol" == rK(t) ? t : t + "";
            })(i.key),
            i,
          ));
      }
    })(g.prototype, v),
    Object.defineProperty(g, "prototype", { writable: !1 }),
    g);
  function rz(e) {
    return rH.call(this, e, tS);
  }
  function rY(e, t) {
    var r = Array.prototype.slice.call(t);
    return (r.push(tS), e.apply(this, r));
  }
  function rX(e) {
    return new tU(e).getCountries();
  }
  function rQ() {
    return rY(tB, arguments);
  }
  function r0(e, t, r) {
    if (t[e]) return new ru(e, t[e], r);
  }
  function r1(e) {
    return (r1 =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function r2(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      (t &&
        (i = i.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        r.push.apply(r, i));
    }
    return r;
  }
  function r3(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, i = Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  function r4(e) {
    var t,
      r,
      i,
      a,
      n =
        (function (e) {
          if (Array.isArray(e)) return e;
        })((t = Array.prototype.slice.call(e))) ||
        (function (e) {
          var t =
            null == e
              ? null
              : ("u" > typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
          if (null != t) {
            var r,
              i,
              a,
              n,
              s = [],
              o = !0,
              d = !1;
            try {
              ((a = (t = t.call(e)).next), !1);
              for (
                ;
                !(o = (r = a.call(t)).done) &&
                (s.push(r.value), 4 !== s.length);
                o = !0
              );
            } catch (e) {
              ((d = !0), (i = e));
            } finally {
              try {
                if (
                  !o &&
                  null != t.return &&
                  ((n = t.return()), Object(n) !== n)
                )
                  return;
              } finally {
                if (d) throw i;
              }
            }
            return s;
          }
        })(t) ||
        (function (e) {
          if (e) {
            if ("string" == typeof e) return r3(e, 4);
            var t = {}.toString.call(e).slice(8, -1);
            return (
              "Object" === t && e.constructor && (t = e.constructor.name),
              "Map" === t || "Set" === t
                ? Array.from(e)
                : "Arguments" === t ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
                  ? r3(e, 4)
                  : void 0
            );
          }
        })(t) ||
        (function () {
          throw TypeError(
            "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
          );
        })(),
      s = n[0],
      o = n[1],
      d = n[2],
      l = n[3];
    if ("string" == typeof s) r = s;
    else throw TypeError("A text for parsing must be a string.");
    if (o && "string" != typeof o)
      if (tE(o)) d ? ((i = o), (a = d)) : (a = o);
      else throw Error("Invalid second argument: ".concat(o));
    else
      (l ? ((i = d), (a = l)) : ((i = void 0), (a = d)),
        o &&
          (i = (function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var r = null != arguments[t] ? arguments[t] : {};
              t % 2
                ? r2(Object(r), !0).forEach(function (t) {
                    var i, a, n;
                    ((i = e),
                      (a = t),
                      (n = r[t]),
                      (a = (function (e) {
                        var t = (function (e, t) {
                          if ("object" != r1(e) || !e) return e;
                          var r = e[Symbol.toPrimitive];
                          if (void 0 !== r) {
                            var i = r.call(e, t || "default");
                            if ("object" != r1(i)) return i;
                            throw TypeError(
                              "@@toPrimitive must return a primitive value.",
                            );
                          }
                          return ("string" === t ? String : Number)(e);
                        })(e, "string");
                        return "symbol" == r1(t) ? t : t + "";
                      })(a)) in i
                        ? Object.defineProperty(i, a, {
                            value: n,
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                          })
                        : (i[a] = n));
                  })
                : Object.getOwnPropertyDescriptors
                  ? Object.defineProperties(
                      e,
                      Object.getOwnPropertyDescriptors(r),
                    )
                  : r2(Object(r)).forEach(function (t) {
                      Object.defineProperty(
                        e,
                        t,
                        Object.getOwnPropertyDescriptor(r, t),
                      );
                    });
            }
            return e;
          })({ defaultCountry: o }, i)));
    return { text: r, options: i, metadata: a };
  }
  function r9(e) {
    return (r9 =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  ((rz.prototype = Object.create(rH.prototype, {})),
    (rz.prototype.constructor = rz),
    e.s(["f", 0, rQ], 336651));
  function r5(e) {
    var t = "function" == typeof Map ? new Map() : void 0;
    return (r5 = function (e) {
      if (
        null === e ||
        !(function (e) {
          try {
            return -1 !== Function.toString.call(e).indexOf("[native code]");
          } catch (t) {
            return "function" == typeof e;
          }
        })(e)
      )
        return e;
      if ("function" != typeof e)
        throw TypeError("Super expression must either be null or a function");
      if (void 0 !== t) {
        if (t.has(e)) return t.get(e);
        t.set(e, r);
      }
      function r() {
        return (function (e, t, r) {
          if (r8()) return Reflect.construct.apply(null, arguments);
          var i = [null];
          i.push.apply(i, t);
          var a = new (e.bind.apply(e, i))();
          return (r && r6(a, r.prototype), a);
        })(e, arguments, r7(this).constructor);
      }
      return (
        (r.prototype = Object.create(e.prototype, {
          constructor: {
            value: r,
            enumerable: !1,
            writable: !0,
            configurable: !0,
          },
        })),
        r6(r, e)
      );
    })(e);
  }
  function r8() {
    try {
      var e = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {}),
      );
    } catch (e) {}
    return (r8 = function () {
      return !!e;
    })();
  }
  function r6(e, t) {
    return (r6 = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (e, t) {
          return ((e.__proto__ = t), e);
        })(e, t);
  }
  function r7(e) {
    return (r7 = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (e) {
          return e.__proto__ || Object.getPrototypeOf(e);
        })(e);
  }
  var ie = (function (e) {
      function t(e) {
        var r, i, a;
        if (!(this instanceof t))
          throw TypeError("Cannot call a class as a function");
        return (
          (i = t),
          (a = [e]),
          (i = r7(i)),
          Object.setPrototypeOf(
            (r = (function (e, t) {
              if (t && ("object" == r9(t) || "function" == typeof t)) return t;
              if (void 0 !== t)
                throw TypeError(
                  "Derived constructors may only return object or undefined",
                );
              var r = e;
              if (void 0 === r)
                throw ReferenceError(
                  "this hasn't been initialised - super() hasn't been called",
                );
              return r;
            })(
              this,
              r8()
                ? Reflect.construct(i, a || [], r7(this).constructor)
                : i.apply(this, a),
            )),
            t.prototype,
          ),
          (r.name = r.constructor.name),
          r
        );
      }
      if ("function" != typeof e && null !== e)
        throw TypeError("Super expression must either be null or a function");
      return (
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, writable: !0, configurable: !0 },
        })),
        Object.defineProperty(t, "prototype", { writable: !1 }),
        e && r6(t, e),
        Object.defineProperty(t, "prototype", { writable: !1 }),
        t
      );
    })(r5(Error)),
    it = function (e) {
      return "([".concat(tQ, "]{1,").concat(e, "})");
    };
  function ir(e) {
    var t = "[  \\t,]*",
      r = "[:\\.．]?[  \\t,-]*",
      i = "[  \\t]*";
    return (
      ";ext=" +
      it("20") +
      "|" +
      (t + "(?:e?xt(?:ensi(?:ó?|ó))?n?|ｅ?ｘｔｎ?|доб|anexo)" + r + it("20")) +
      "#?|" +
      (t + "(?:[xｘ#＃~～]|int|ｉｎｔ)" + r + it("9")) +
      "#?|" +
      ("[- ]+" + it("6")) +
      "#|" +
      (i + "(?:,{2}|;)" + r + it("15")) +
      "#?|" +
      (i + "(?:,)+" + r + it("9")) +
      "#?"
    );
  }
  var ii =
      "[" + t1 + "]{0,1}(?:[" + t0 + "]*[" + tQ + "]){3,}[" + t0 + tQ + "]*",
    ia = RegExp("^[" + t1 + "]{0,1}(?:[" + t0 + "]*[" + tQ + "]){1,2}$", "i"),
    is = RegExp("^[" + tQ + "]{2}$|^" + (ii + "(?:" + ir()) + ")?$", "i"),
    io = RegExp("(?:" + ir() + ")$", "i");
  function id(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, i = Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  function il(e) {
    for (
      var t,
        r = "",
        i = (function (e) {
          var t =
            ("u" > typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
          if (t) return (t = t.call(e)).next.bind(t);
          if (
            Array.isArray(e) ||
            (t = (function (e) {
              if (e) {
                if ("string" == typeof e) return id(e, void 0);
                var t = {}.toString.call(e).slice(8, -1);
                return (
                  "Object" === t && e.constructor && (t = e.constructor.name),
                  "Map" === t || "Set" === t
                    ? Array.from(e)
                    : "Arguments" === t ||
                        /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
                      ? id(e, void 0)
                      : void 0
                );
              }
            })(e))
          ) {
            t && (e = t);
            var r = 0;
            return function () {
              return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
            };
          }
          throw TypeError(
            "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
          );
        })(e.split(""));
      !(t = i()).done;

    ) {
      var a = t.value;
      r +=
        (function (e, t) {
          if ("+" === e) {
            if (t) return;
            return "+";
          }
          return r$[e];
        })(a, r) || "";
    }
    return r;
  }
  var ic = "([" + tQ + "]|[\\-\\.\\(\\)]?)",
    iu = RegExp("^\\+" + ic + "*[" + tQ + "]" + ic + "*$", "g"),
    ih = RegExp(
      "^(" +
        ("[" + tQ + "]+((\\-)*[") +
        tQ +
        "])*\\.)*[a-zA-Z]+((\\-)*[" +
        tQ +
        "])*\\.?$",
      "g",
    ),
    ip = "tel:",
    iy = ";phone-context=",
    im = RegExp("[" + t1 + tQ + "]"),
    i_ = RegExp("[^" + tQ + "#]+$");
  function ig(e) {
    return (ig =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function iv(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      (t &&
        (i = i.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        r.push.apply(r, i));
    }
    return r;
  }
  function i$(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? iv(Object(r), !0).forEach(function (t) {
            var i, a, n;
            ((i = e),
              (a = t),
              (n = r[t]),
              (a = (function (e) {
                var t = (function (e, t) {
                  if ("object" != ig(e) || !e) return e;
                  var r = e[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var i = r.call(e, t || "default");
                    if ("object" != ig(i)) return i;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === t ? String : Number)(e);
                })(e, "string");
                return "symbol" == ig(t) ? t : t + "";
              })(a)) in i
                ? Object.defineProperty(i, a, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (i[a] = n));
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
          : iv(Object(r)).forEach(function (t) {
              Object.defineProperty(
                e,
                t,
                Object.getOwnPropertyDescriptor(r, t),
              );
            });
    }
    return e;
  }
  function ib(e) {
    return (ib =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function iw(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      (t &&
        (i = i.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        r.push.apply(r, i));
    }
    return r;
  }
  function iI(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? iw(Object(r), !0).forEach(function (t) {
            var i, a, n;
            ((i = e),
              (a = t),
              (n = r[t]),
              (a = (function (e) {
                var t = (function (e, t) {
                  if ("object" != ib(e) || !e) return e;
                  var r = e[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var i = r.call(e, t || "default");
                    if ("object" != ib(i)) return i;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === t ? String : Number)(e);
                })(e, "string");
                return "symbol" == ib(t) ? t : t + "";
              })(a)) in i
                ? Object.defineProperty(i, a, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (i[a] = n));
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
          : iw(Object(r)).forEach(function (t) {
              Object.defineProperty(
                e,
                t,
                Object.getOwnPropertyDescriptor(r, t),
              );
            });
    }
    return e;
  }
  function ik(e, t, r) {
    var i, a;
    t &&
      t.defaultCountry &&
      ((i = t.defaultCountry), !r.countries.hasOwnProperty(i)) &&
      (t = iI(iI({}, t), {}, { defaultCountry: void 0 }));
    try {
      return (
        (a = t),
        (function (e, t, r) {
          if (
            ((t = t || {}),
            (r = new tU(r)),
            t.defaultCountry && !r.hasCountry(t.defaultCountry))
          ) {
            if (t.v2) throw new ie("INVALID_COUNTRY");
            throw Error("Unknown country: ".concat(t.defaultCountry));
          }
          var i,
            a,
            n,
            s,
            o = (function (e, t, r) {
              var i = (function (e, t) {
                var r = t.extractFormattedPhoneNumber,
                  i = (function (e) {
                    var t = e.indexOf(iy);
                    if (t < 0) return null;
                    var r = t + iy.length;
                    if (r >= e.length) return "";
                    var i = e.indexOf(";", r);
                    return i >= 0 ? e.substring(r, i) : e.substring(r);
                  })(e);
                if (
                  !(
                    null === i ||
                    (0 !== i.length && (iu.test(i) || ih.test(i)))
                  )
                )
                  throw new ie("NOT_A_NUMBER");
                if (null === i) a = r(e) || "";
                else {
                  ((a = ""), "+" === i.charAt(0) && (a += i));
                  var a,
                    n,
                    s = e.indexOf(ip);
                  n = s >= 0 ? s + ip.length : 0;
                  var o = e.indexOf(iy);
                  a += e.substring(n, o);
                }
                var d = a.indexOf(";isub=");
                if ((d > 0 && (a = a.substring(0, d)), "" !== a)) return a;
              })(e, {
                extractFormattedPhoneNumber: function (e) {
                  if (e) {
                    if (e.length > 250) {
                      if (t) throw new ie("TOO_LONG");
                      return;
                    }
                    if (!1 === r) return e;
                    var i = e.search(im);
                    return i < 0 ? void 0 : e.slice(i).replace(i_, "");
                  }
                },
              });
              if (!i) return {};
              if (!(i.length >= 2 && is.test(i)))
                return ia.test(i) ? { error: "TOO_SHORT" } : {};
              var a = (function (e) {
                var t = e.search(io);
                if (t < 0) return {};
                for (
                  var r = e.slice(0, t), i = e.match(io), a = 1;
                  a < i.length;

                ) {
                  if (i[a]) return { number: r, ext: i[a] };
                  a++;
                }
              })(i);
              return a.ext ? a : { number: i };
            })(e, t.v2, t.extract),
            d = o.number,
            l = o.ext,
            c = o.error;
          if (!d) {
            if (t.v2) {
              if ("TOO_SHORT" === c) throw new ie("TOO_SHORT");
              throw new ie("NOT_A_NUMBER");
            }
            return {};
          }
          var u = (function (e, t, r, i) {
              var a,
                n = re(il(e), void 0, t, r, i.metadata),
                s = n.countryCallingCodeSource,
                o = n.countryCallingCode,
                d = n.number;
              if (o) i.selectNumberingPlan(o);
              else {
                if (!d || (!t && !r)) return {};
                (i.selectNumberingPlan(t, r),
                  t && (a = t),
                  (o = r || tB(t, i.metadata)));
              }
              if (!d)
                return { countryCallingCodeSource: s, countryCallingCode: o };
              var l = t6(il(d), a, i),
                c = l.nationalNumber,
                u = l.carrierCode,
                h = t8(o, { nationalNumber: c, metadata: i });
              return (
                h && ((a = h), "001" === h || i.selectNumberingPlan(a)),
                {
                  country: a,
                  countryCallingCode: o,
                  countryCallingCodeSource: s,
                  nationalNumber: c,
                  carrierCode: u,
                }
              );
            })(d, t.defaultCountry, t.defaultCallingCode, r),
            h = u.country,
            p = u.nationalNumber,
            f = u.countryCallingCode,
            y = u.countryCallingCodeSource,
            m = u.carrierCode;
          if (!r.hasSelectedNumberingPlan()) {
            if (t.v2) throw new ie("INVALID_COUNTRY");
            return {};
          }
          if (!p || p.length < 2) {
            if (t.v2) throw new ie("TOO_SHORT");
            return {};
          }
          if (p.length > 17) {
            if (t.v2) throw new ie("TOO_LONG");
            return {};
          }
          if (t.v2) {
            var _ = new ru(f, p, r.metadata);
            return (
              h && (_.country = h),
              m && (_.carrierCode = m),
              l && (_.ext = l),
              (_.__countryCallingCodeSource = y),
              _
            );
          }
          var g =
            (t.extended ? !!r.hasSelectedNumberingPlan() : !!h) &&
            tJ(p, r.nationalNumberPattern());
          return t.extended
            ? {
                country: h,
                countryCallingCode: f,
                carrierCode: m,
                valid: g,
                possible:
                  !!g ||
                  !!(!0 === t.extended && r.possibleLengths() && tK(p, h, r)),
                phone: p,
                ext: l,
              }
            : g
              ? ((i = h),
                (a = p),
                (n = l),
                (s = { country: i, phone: a }),
                n && (s.ext = n),
                s)
              : {};
        })(e, i$(i$({}, a), {}, { v2: !0 }), r)
      );
    } catch (e) {
      if (e instanceof ie);
      else throw e;
    }
  }
  function iS(e) {
    return (iS =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function iT(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      (t &&
        (i = i.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        r.push.apply(r, i));
    }
    return r;
  }
  function iC(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? iT(Object(r), !0).forEach(function (t) {
            var i, a, n;
            ((i = e),
              (a = t),
              (n = r[t]),
              (a = (function (e) {
                var t = (function (e, t) {
                  if ("object" != iS(e) || !e) return e;
                  var r = e[Symbol.toPrimitive];
                  if (void 0 !== r) {
                    var i = r.call(e, t || "default");
                    if ("object" != iS(i)) return i;
                    throw TypeError(
                      "@@toPrimitive must return a primitive value.",
                    );
                  }
                  return ("string" === t ? String : Number)(e);
                })(e, "string");
                return "symbol" == iS(t) ? t : t + "";
              })(a)) in i
                ? Object.defineProperty(i, a, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (i[a] = n));
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
          : iT(Object(r)).forEach(function (t) {
              Object.defineProperty(
                e,
                t,
                Object.getOwnPropertyDescriptor(r, t),
              );
            });
    }
    return e;
  }
  function iE() {
    var e = r4(arguments),
      t = e.text,
      r = e.options,
      i = e.metadata,
      a = ik(t, (r = iC(iC({}, r), {}, { extract: !1 })), i);
    return (a && a.isPossible()) || !1;
  }
  function iA() {
    var e = r4(arguments);
    return ik(e.text, e.options, e.metadata);
  }
  var ix = Object.defineProperty,
    iN = (e, t) => {
      let r = {};
      for (var i in e) ix(r, i, { get: e[i], enumerable: !0 });
      return (t || ix(r, Symbol.toStringTag, { value: "Module" }), r);
    };
  let iP = (e) => T.Buffer.from(e, "utf8"),
    iO = (e) => `0x${e.toString("hex")}`,
    iR = Symbol("data-suffix-plugin");
  var iU = class {
      _privyInternal;
      _smartWalletConfig;
      constructor(e) {
        this._privyInternal = e;
      }
      getConfig() {
        return this._privyInternal.config;
      }
      async getSmartWalletConfig() {
        return (
          (this._smartWalletConfig ||= await this._privyInternal.fetch(C.$V, {
            params: { app_id: this.appId },
          })),
          this._smartWalletConfig
        );
      }
      get appId() {
        return this._privyInternal.appId;
      }
    },
    iM = class e {
      static parse(t) {
        try {
          return new e(t);
        } catch {
          return null;
        }
      }
      value;
      _decoded;
      constructor(e) {
        ((this.value = e), (this._decoded = E.f(e)));
      }
      get subject() {
        return this._decoded.sub;
      }
      get expiration() {
        return this._decoded.exp;
      }
      get issuer() {
        return this._decoded.iss;
      }
      get audience() {
        return this._decoded.aud;
      }
      isExpired(e = 0) {
        return Date.now() >= (this.expiration - e) * 1e3;
      }
    },
    iD = class e {
      _storage;
      _privyInternal;
      constructor(e, t) {
        ((this._privyInternal = e), (this._storage = t));
      }
      static providerAccessTokenStorageKey = (e) => `privy:cross-app:${e}`;
      async updateOnCrossAppAuthentication(t, r) {
        let i = r.access_token,
          a = e.providerAccessTokenStorageKey(t);
        await this._storage.put(a, i);
      }
      async getProviderAccessToken(t) {
        let r = e.providerAccessTokenStorageKey(t),
          i = await this._storage.get(r);
        if ("string" != typeof i) return null;
        try {
          if (new iM(i).isExpired()) throw Error("JWT is expired");
          return i;
        } catch {
          return (await this._storage.del(r), null);
        }
      }
      async getCrossAppConnections() {
        return await this._privyInternal.fetch(C.Se, {
          params: { app_id: this._privyInternal.appId },
        });
      }
    },
    iL = class {
      _privyInternal;
      constructor(e) {
        this._privyInternal = e;
      }
      async revoke() {
        await this._privyInternal.fetch(C.Wq, {});
      }
    },
    iF = class extends Error {
      name = "PrivyApiError";
      error;
      code;
      status;
      constructor({ error: e, code: t, status: r }) {
        (super(e), (this.error = e), (this.code = t), (this.status = r));
      }
    },
    ij = class extends Error {
      error;
      code;
      constructor({ error: e, code: t }) {
        (super(e), (this.code = t), (this.error = e));
      }
    },
    iW = class extends Error {
      error;
      code;
      response;
      constructor({ error: e, code: t, response: r }) {
        (super(e), (this.code = t), (this.error = e), (this.response = r));
      }
    };
  let iG = (e) => !!e.id && "privy-v2" === e.recovery_method,
    iB = [
      "error",
      "invalid_request_arguments",
      "wallet_not_on_device",
      "invalid_recovery_pin",
      "insufficient_funds",
      "mfa_timeout",
      "missing_or_invalid_mfa",
      "mfa_verification_max_attempts_reached",
    ];
  ((($ = {}).MISSING_OR_INVALID_PRIVY_APP_ID =
    "missing_or_invalid_privy_app_id"),
    ($.MISSING_OR_INVALID_PRIVY_ACCOUNT_ID =
      "missing_or_invalid_privy_account_id"),
    ($.INVALID_DATA = "invalid_data"),
    ($.LINKED_TO_ANOTHER_USER = "linked_to_another_user"),
    ($.ALLOWLIST_REJECTED = "allowlist_rejected"),
    ($.OAUTH_USER_DENIED = "oauth_user_denied"),
    ($.UNKNOWN_AUTH_ERROR = "unknown_auth_error"),
    ($.USER_EXITED_AUTH_FLOW = "exited_auth_flow"),
    ($.MUST_BE_AUTHENTICATED = "must_be_authenticated"),
    ($.UNKNOWN_CONNECT_WALLET_ERROR = "unknown_connect_wallet_error"),
    ($.GENERIC_CONNECT_WALLET_ERROR = "generic_connect_wallet_error"),
    ($.CLIENT_REQUEST_TIMEOUT = "client_request_timeout"),
    ($.INVALID_CREDENTIALS = "invalid_credentials"));
  var iV = class extends Error {
      cause;
      privyErrorCode;
      constructor(e, t, r) {
        (super(e),
          t instanceof Error && (this.cause = t),
          (this.privyErrorCode = r));
      }
      toString() {
        return `${this.type}${this.privyErrorCode ? `-${this.privyErrorCode}` : ""}: ${this.message}${this.cause ? ` [cause: ${this.cause}]` : ""}`;
      }
    },
    iq = class extends Error {
      type;
      constructor(e, t) {
        (super(t), (this.type = e));
      }
    },
    iZ = class extends iV {
      type = "connector_error";
      constructor(e, t, r) {
        super(e, t, r);
      }
    },
    iK = class extends Error {
      code;
      data;
      constructor(e, t, r) {
        (super(e), (this.code = t), (this.data = r));
      }
    };
  function iJ(e) {
    let t;
    return (
      "string" == typeof (t = e.type) &&
      iB.includes(t) &&
      "wallet_not_on_device" === e.type
    );
  }
  async function iH(e, t) {
    let r;
    if (t instanceof Uint8Array) r = B.base64.fromBytes(t);
    else {
      let e = (0, L.default)(t);
      if (void 0 === e)
        throw new ij({
          error: "Failed to prepare the payload for signing",
          code: "invalid_input",
        });
      r = B.base64.fromBytes(B.utf8.toBytes(e));
    }
    let { signature: i } = await e({ message: r });
    return { signature: i };
  }
  let iz = "privy-request-expiry";
  async function iY(e, t, { wallet_id: r, headers: i, ...a }) {
    let n = e.getCompiledPath(C.DR, { params: { wallet_id: r } }),
      s = String(Date.now() + 18e5),
      { signature: o } = await iH(t, {
        version: 1,
        url: n,
        method: C.DR.method,
        headers: { "privy-app-id": e.app.appId, [iz]: s },
        body: { ...a },
      });
    if (Date.now() > Number(s))
      throw new ij({
        error:
          "Wallet request expired before it could be sent. Please try again.",
        code: "embedded_wallet_request_expired",
      });
    return await e.fetchPrivyRoute(C.DR, {
      body: a,
      params: { wallet_id: r },
      headers: { "privy-authorization-signature": o, [iz]: s, ...(i ?? {}) },
    });
  }
  function iX(e) {
    var t, r;
    return (0, D.c)(e)
      ? ((t = e),
        {
          type: D.C,
          from: t.from,
          chain_id: i0(t.chainId),
          nonce: i0(t.nonce),
          nonce_key: i0(t.nonceKey),
          gas_limit: i0(t.gasLimit),
          max_fee_per_gas: i0(t.maxFeePerGas),
          max_priority_fee_per_gas: i0(t.maxPriorityFeePerGas),
          fee_token: t.feeToken,
          valid_after: i0(t.validAfter),
          valid_before: i0(t.validBefore),
          fee_payer_signature: (function (e) {
            var t;
            if (!e) return;
            let r =
              void 0 !== (t = e).yParity
                ? t.yParity
                : void 0 !== t.v
                  ? Number(t.v) - 27
                  : void 0;
            if (0 !== r && 1 !== r)
              throw Error(
                "Tempo fee payer signatures require a valid yParity value",
              );
            return { r: e.r, s: e.s, y_parity: r };
          })(t.feePayerSignature),
          access_list: (function (e) {
            if (e)
              return Array.isArray(e)
                ? e.map((e) =>
                    "address" in e
                      ? { address: e.address, storage_keys: [...e.storageKeys] }
                      : { address: e[0], storage_keys: [...e[1]] },
                  )
                : Object.entries(e).map(([e, t]) => ({
                    address: e,
                    storage_keys: [...t],
                  }));
          })(t.accessList),
          calls: t.calls.map((e) => ({
            to: e.to,
            data: e.data,
            value: i0(e.value),
          })),
        })
      : {
          from: (r = e).from,
          to: r.to ?? void 0,
          nonce: i0(r.nonce),
          chain_id: i0(r.chainId),
          data: (function (e) {
            if (void 0 !== e)
              return "string" == typeof e
                ? /^0x[0-9a-fA-F]*$/.test(e)
                  ? e
                  : iO(iP(e))
                : iO(T.Buffer.from(Uint8Array.from(e)));
          })(r.data),
          value: i0(r.value),
          type: (function (e) {
            if (null == e) return;
            let t = Number(e);
            if (!iQ.includes(t))
              throw Error(
                `Invalid transaction type: expected ${iQ.join(", ")} as a number or hex string, got "${e}".`,
              );
            return t;
          })(r.type),
          gas_limit: i0(r.gasLimit ?? r.gas),
          gas_price: i0(r.gasPrice),
          max_fee_per_gas: i0(r.maxFeePerGas),
          max_priority_fee_per_gas: i0(r.maxPriorityFeePerGas),
        };
  }
  let iQ = [0, 1, 2, 4];
  function i0(e) {
    if ("number" == typeof e || "bigint" == typeof e)
      return `0x${BigInt(e).toString(16)}`;
    if ("string" == typeof e) {
      if (/^0x[0-9a-fA-F]*$/.test(e)) return e;
      throw Error(
        `Invalid quantity string: expected a hex-prefixed value (0x…), got "${e}". Use a number, bigint, or hex string instead.`,
      );
    }
  }
  async function i1({ context: e, account: t, rpcRequest: r }) {
    switch (r.chainType) {
      case "ethereum":
        return i2({ context: e, account: t, rpcRequest: r.request });
      case "solana":
        return i3({ context: e, account: t, rpcRequest: r.request });
    }
  }
  async function i2({ context: e, account: t, rpcRequest: r }) {
    switch (r.method) {
      case "personal_sign": {
        let [i] = r.params,
          a = await iY(e, e.signRequest, {
            chain_type: "ethereum",
            method: "personal_sign",
            wallet_id: t.id,
            params: i.startsWith("0x")
              ? { message: i.slice(2), encoding: "hex" }
              : { message: i, encoding: "utf-8" },
          });
        if ("personal_sign" !== a.method) throw Error("Unable to sign message");
        return { data: a.data.signature };
      }
      case "eth_signTransaction": {
        let [i] = r.params,
          a = await iY(e, e.signRequest, {
            chain_type: "ethereum",
            method: "eth_signTransaction",
            wallet_id: t.id,
            params: { transaction: iX(i) },
          });
        if ("eth_signTransaction" !== a.method)
          throw Error("Unable to sign transaction");
        return { data: a.data.signed_transaction };
      }
      case "eth_signTypedData_v4": {
        var i;
        let [, a] = r.params,
          n = await iY(e, e.signRequest, {
            chain_type: "ethereum",
            method: r.method,
            wallet_id: t.id,
            params: {
              typed_data:
                ("string" == typeof (i = a) && (i = JSON.parse(i)),
                {
                  types: i.types,
                  primary_type: String(i.primaryType),
                  domain: i.domain,
                  message: i.message,
                }),
            },
          });
        if ("eth_signTypedData_v4" !== n.method)
          throw Error("Unable to sign typed data");
        return { data: n.data.signature };
      }
      case "eth_sign": {
        let [, i] = r.params,
          a = await iY(e, e.signRequest, {
            chain_type: "ethereum",
            method: "secp256k1_sign",
            wallet_id: t.id,
            params: { hash: /^0x[0-9a-fA-F]*$/.test(i) ? i : iO(iP(i)) },
          });
        if ("secp256k1_sign" !== a.method)
          throw Error("Unable to sign message");
        return { data: a.data.signature };
      }
      case "secp256k1_sign": {
        let [i] = r.params,
          a = await iY(e, e.signRequest, {
            chain_type: "ethereum",
            method: "secp256k1_sign",
            wallet_id: t.id,
            params: { hash: /^0x[0-9a-fA-F]*$/.test(i) ? i : iO(iP(i)) },
          });
        if ("secp256k1_sign" !== a.method)
          throw Error("Unable to sign message");
        return { data: a.data.signature };
      }
      case "csw_signUserOperation":
      case "eth_sendTransaction":
      case "eth_populateTransactionRequest":
        throw Error(`This wallet does not support the method: ${r.method}`);
    }
  }
  async function i3({ context: e, account: t, rpcRequest: r }) {
    if ("signMessage" === r.method) {
      let { message: i } = r.params,
        a = await iY(e, e.signRequest, {
          chain_type: "solana",
          method: "signMessage",
          wallet_id: t.id,
          params: { message: i, encoding: "base64" },
        });
      if ("signMessage" !== a.method) throw Error("Unable to sign message");
      return { data: a.data.signature };
    }
  }
  let i4 = (e, t, r, i) => {
      let a = Number(e),
        n = t.find((e) => e.id === a);
      if (!n) throw new iZ(`Unsupported chainId ${e}`, 4901);
      let s = i9(n, r, i.appId);
      if (a === V.f.id || a === q.f.id) {
        let e = a === V.f.id ? V.f : q.f;
        return (0, P.f)({ transport: (0, U.f)(s), chain: e });
      }
      return (0, P.f)({ transport: (0, U.f)(s), chain: n });
    },
    i9 = (e, t, r) => {
      let i = e.id,
        a = Number(e.id),
        n;
      if (
        e.rpcUrls.privyWalletOverride &&
        e.rpcUrls.privyWalletOverride.http[0]
      )
        n = e.rpcUrls.privyWalletOverride.http[0];
      else if (t.rpcUrls && t.rpcUrls[a]) n = t.rpcUrls[a];
      else if (e.rpcUrls.privy?.http[0]) {
        let t = new URL(e.rpcUrls.privy.http[0]);
        (t.searchParams.append("privyAppId", r), (n = t.toString()));
      } else
        n = e.rpcUrls.public?.http[0]
          ? e.rpcUrls.public.http[0]
          : e.rpcUrls.default?.http[0];
      if (!n) throw new iZ(`No RPC url found for ${i}`);
      return n;
    },
    i5 = new Set([
      "eth_sign",
      "personal_sign",
      "eth_signTypedData_v4",
      "csw_signUserOperation",
      "secp256k1_sign",
    ]);
  var i8 = class extends N.f {
    _walletProxy;
    _privyInternal;
    _account;
    _entropyId;
    _entropyIdVerifier;
    _chainId;
    _chains;
    _onNeedsRecovery;
    _client;
    _appApi;
    _dataSuffixPlugin;
    constructor({
      walletProxy: e,
      privyInternal: t,
      account: r,
      entropyId: i,
      entropyIdVerifier: a,
      chains: n,
      onNeedsRecovery: s,
      chainId: o = n[0].id,
      appApi: d,
      dataSuffixPlugin: l,
    }) {
      (super(),
        (this._walletProxy = e),
        (this._privyInternal = t),
        (this._account = r),
        (this._entropyId = i),
        (this._entropyIdVerifier = a),
        (this._chainId = o),
        (this._chains = n),
        (this._onNeedsRecovery = s),
        (this._client = i4(o, n, { rpcUrls: [] }, { appId: d.appId })),
        (this._appApi = d),
        (this._dataSuffixPlugin = l));
    }
    async request(e) {
      if (i5.has(e.method)) return this.handleIFrameRpc(e);
      switch (e.method) {
        case "eth_accounts":
        case "eth_requestAccounts":
          return this._account.address ? [this._account.address] : [];
        case "eth_chainId":
          return `0x${this._chainId.toString(16)}`;
        case "wallet_switchEthereumChain":
          return this.handleSwitchEthereumChain(e);
        case "eth_estimateGas":
          return this.handleEstimateGas(e);
        case "eth_signTransaction": {
          let t = this.applyDataSuffix(e.params?.[0]);
          return this.handleSignTransaction(t);
        }
        case "eth_sendTransaction": {
          let t = this.applyDataSuffix(e.params?.[0]);
          return this.handleSendTransaction(t);
        }
        case "eth_populateTransactionRequest": {
          let t = e.params?.[0];
          return this.handlePopulateTransaction(t);
        }
        default:
          return this.handleJsonRpc(e);
      }
    }
    applyDataSuffix(e) {
      if (!this._dataSuffixPlugin || (0, D.c)(e)) return e;
      let t = "string" == typeof e.data ? e.data : "0x";
      return {
        ...e,
        data: this._dataSuffixPlugin.appendDataSuffix({ data: t }),
      };
    }
    ensureChainId(e) {
      let t = { chainId: this._chainId, ...e };
      return (this.internalSwitchEthereumChain(t.chainId), t);
    }
    internalSwitchEthereumChain(e) {
      e &&
        Number(e) !== this._chainId &&
        ((this._chainId = Number(e)),
        (this._client = i4(
          this._chainId,
          this._chains,
          { rpcUrls: [] },
          { appId: this._privyInternal.appId },
        )),
        this.emit("chainChanged", e));
    }
    async handlePopulateTransaction(e) {
      let t = this.ensureChainId(e);
      if ((0, D.c)(t)) {
        let e = (0, D.y)(t),
          r = (0, D.E)(
            await this.requireTempoClient().prepareTransactionRequest({
              account: t.from ?? this._account.address,
              ...e,
            }),
            t.gasLimit,
          );
        return { ...t, ...r, type: D.C };
      }
      let r = (0, D.W)(t),
        { gas: i, ...a } = await this._client.prepareTransactionRequest({
          account: t.from ?? this._account.address,
          ...r,
        });
      return {
        ...a,
        gasLimit: i,
        type: D.s[a.type],
        authorizationList: t.authorizationList,
      };
    }
    async handleSignTransaction(e) {
      let t = { ...e };
      for (let e of Object.keys(t)) {
        let r = t[e];
        "bigint" == typeof r && (t[e] = (0, M.g)(r));
      }
      return (
        (0, D.c)(t) &&
          (t.calls = t.calls.map((e) => ({
            ...e,
            value: "bigint" == typeof e.value ? (0, M.g)(e.value) : e.value,
          }))),
        await this.handleIFrameRpc({
          method: "eth_signTransaction",
          params: [t],
        })
      );
    }
    async handleSendTransaction(e) {
      let t = await this.handlePopulateTransaction(e),
        r = await this.handleSignTransaction(t);
      return await this.handleJsonRpc({
        method: "eth_sendRawTransaction",
        params: [r],
      });
    }
    async handleEstimateGas(e) {
      if (!e.params || !Array.isArray(e.params))
        throw Error("Invalid params for eth_estimateGas");
      let t = e.params?.[0],
        r = this.ensureChainId(t);
      if ((0, D.c)(r)) {
        let e = (0, D.y)(r);
        return await this.requireTempoClient().estimateGas({
          account: r.from ?? this._account.address,
          ...e,
        });
      }
      let i = (0, D.W)(r);
      return await this._client.estimateGas({
        account: r.from ?? this._account.address,
        ...i,
      });
    }
    handleSwitchEthereumChain(e) {
      let t;
      if (!e.params || !Array.isArray(e.params))
        throw new iK(`Invalid params for ${e.method}`, 4200);
      if ("string" == typeof e.params[0]) t = e.params[0];
      else if (
        "chainId" in e.params[0] &&
        "string" == typeof e.params[0].chainId
      )
        t = e.params[0].chainId;
      else throw new iK(`Invalid params for ${e.method}`, 4200);
      this.internalSwitchEthereumChain(t);
    }
    async handleIFrameRpc(e) {
      try {
        let t = await this._privyInternal.getAccessTokenInternal();
        if (!t) throw Error("Missing privy token. User must be logged in");
        let r = this._account;
        if (iG(r)) {
          let { data: i } = await i1({
            context: {
              app: this._appApi,
              fetchPrivyRoute: (...e) => this._privyInternal.fetch(...e),
              getCompiledPath: (...e) => this._privyInternal.getPath(...e),
              signRequest: ({ message: e }) =>
                this._walletProxy.signWithUserSigner({
                  accessToken: t,
                  message: e,
                }),
            },
            account: r,
            rpcRequest: { chainType: "ethereum", request: e },
          });
          return i;
        }
        try {
          await this._walletProxy.connect({
            entropyId: this._entropyId,
            entropyIdVerifier: this._entropyIdVerifier,
            accessToken: t,
          });
        } catch (r) {
          let e = iJ(r);
          if (e && "privy" === this._account.recovery_method)
            await this._walletProxy.recover({
              entropyId: this._entropyId,
              entropyIdVerifier: this._entropyIdVerifier,
              accessToken: t,
            });
          else if (e && this._onNeedsRecovery) {
            let e;
            await new Promise(async (t, r) => {
              ((e = setTimeout(
                () =>
                  r(
                    new ij({
                      code: "embedded_wallet_recovery_error",
                      error: "User-owned recovery timed out",
                    }),
                  ),
                12e4,
              )),
                await this._onNeedsRecovery?.({
                  recoveryMethod: this._account.recovery_method,
                  onRecovered: () => t(!0),
                }));
            }).finally(() => clearTimeout(e));
          } else throw r;
        }
        return (
          await this._walletProxy.rpcWallet({
            accessToken: t,
            request: e,
            entropyId: this._entropyId,
            entropyIdVerifier: this._entropyIdVerifier,
            hdWalletIndex: this._account.wallet_index,
            chainType: "ethereum",
          })
        ).response.data;
      } catch (r) {
        console.error(r);
        let t =
          r instanceof Error ? r.message : "Unable to make wallet request";
        throw (
          this._privyInternal.createAnalyticsEvent(
            "embedded_wallet_sdk_rpc_failed",
            { method: e.method, address: this._account.address, error: t },
          ),
          new ij({ code: "embedded_wallet_request_error", error: t })
        );
      }
    }
    async handleJsonRpc(e) {
      return this._client.request(e);
    }
    requireTempoClient() {
      var e;
      if ((e = this._chainId) !== V.f.id && e !== q.f.id)
        throw new iK(
          `Cannot send a Tempo (type 118) transaction on chain ${this._chainId}`,
          4901,
        );
      return this._client;
    }
    toJSON() {
      return `PrivyEIP1193Provider { address: '${this._account.address}', chainId: ${this._chainId}, request: [Function] }`;
    }
  };
  function i6(e) {
    return "version" in e;
  }
  function i7(e, t) {
    let r = (i6(e) ? e.message : e.compileMessage()).staticAccountKeys.find(
      (e) => e.toBase58() === t,
    );
    if (!r) throw Error(`Transaction does not contain public key ${t}`);
    return r;
  }
  var ae = class {
      _proxy;
      _privyInternal;
      _app;
      _entropyId;
      _entropyIdVerifier;
      _account;
      _onNeedsRecovery;
      constructor({
        proxy: e,
        privyInternal: t,
        account: r,
        entropyId: i,
        entropyIdVerifier: a,
        onNeedsRecovery: n,
        app: s,
      }) {
        ((this._proxy = e),
          (this._privyInternal = t),
          (this._account = r),
          (this._entropyId = i),
          (this._entropyIdVerifier = a),
          (this._onNeedsRecovery = n),
          (this._app = s));
      }
      async request(e) {
        if (!(await this._privyInternal.getAccessTokenInternal()))
          throw new ij({
            error: "Missing access token",
            code: "attempted_rpc_call_before_logged_in",
          });
        switch (e.method) {
          case "signAndSendTransaction":
            return await this.handleSignAndSendTransaction(e);
          case "signTransaction":
            return await this.handleSignTransaction(e);
          default:
            return await this.handleIFrameRpc(e);
        }
      }
      get _publicKey() {
        return this._account.address;
      }
      async connectAndRecover(e) {
        if ("privy-v2" !== this._account.recovery_method)
          try {
            await this._proxy.connect({
              entropyId: this._entropyId,
              entropyIdVerifier: this._entropyIdVerifier,
              accessToken: e,
            });
          } catch (r) {
            let t = iJ(r);
            if (t && "privy" === this._account.recovery_method)
              await this._proxy.recover({
                entropyId: this._entropyId,
                entropyIdVerifier: this._entropyIdVerifier,
                accessToken: e,
              });
            else if (t && this._onNeedsRecovery) {
              let e;
              await new Promise(async (t, r) => {
                ((e = setTimeout(
                  () =>
                    r(
                      new ij({
                        code: "embedded_wallet_recovery_error",
                        error: "User-owned recovery timed out",
                      }),
                    ),
                  12e4,
                )),
                  await this._onNeedsRecovery?.({
                    recoveryMethod: this._account.recovery_method,
                    onRecovered: () => t(!0),
                  }));
              }).finally(() => clearTimeout(e));
            } else throw r;
          }
      }
      async signMessageRpc(e, t) {
        let r = this._account;
        if (!iG(r))
          return (
            await this._proxy.rpcWallet({
              accessToken: t,
              request: e,
              chainType: "solana",
              hdWalletIndex: this._account.wallet_index,
              entropyId: this._entropyId,
              entropyIdVerifier: this._entropyIdVerifier,
            })
          ).response.data;
        {
          let { data: i } = await i1({
            context: {
              app: this._app,
              fetchPrivyRoute: (...e) => this._privyInternal.fetch(...e),
              getCompiledPath: (...e) => this._privyInternal.getPath(...e),
              signRequest: ({ message: e }) =>
                this._proxy.signWithUserSigner({ accessToken: t, message: e }),
            },
            account: r,
            rpcRequest: { chainType: "solana", request: e },
          });
          return { signature: i };
        }
      }
      async handleIFrameRpc(e) {
        try {
          let t = await this._privyInternal.getAccessTokenInternal();
          if (!t) throw Error("Missing privy token. User must be logged in");
          return (
            await this.connectAndRecover(t),
            await this.signMessageRpc(e, t)
          );
        } catch (r) {
          console.error(r);
          let t =
            r instanceof Error ? r.message : "Unable to make wallet request";
          throw (
            this._privyInternal.createAnalyticsEvent(
              "embedded_wallet_sdk_rpc_failed",
              { method: e.method, address: this._account.address, error: t },
            ),
            new ij({ code: "embedded_wallet_request_error", error: t })
          );
        }
      }
      async handleSignAndSendTransaction(e) {
        try {
          let t = await this._privyInternal.getAccessTokenInternal();
          if (!t) throw Error("Missing privy token. User must be logged in");
          await this.connectAndRecover(t);
          let { transaction: r, connection: i, options: a } = e.params,
            n = i7(r, this._account.address),
            s = i6(r)
              ? T.Buffer.from(r.message.serialize())
              : r.serializeMessage(),
            { signature: o } = await this.signMessageRpc(
              {
                method: "signMessage",
                params: { message: s.toString("base64") },
              },
              t,
            );
          return (
            r.addSignature(n, T.Buffer.from(o, "base64")),
            { signature: await i.sendRawTransaction(r.serialize(), a) }
          );
        } catch (r) {
          console.error(r);
          let t =
            r instanceof Error ? r.message : "Unable to make wallet request";
          throw (
            this._privyInternal.createAnalyticsEvent(
              "embedded_wallet_sdk_rpc_failed",
              { method: e.method, address: this._account.address, error: t },
            ),
            new ij({ code: "embedded_wallet_request_error", error: t })
          );
        }
      }
      async handleSignTransaction(e) {
        try {
          let t = await this._privyInternal.getAccessTokenInternal();
          if (!t) throw Error("Missing privy token. User must be logged in");
          await this.connectAndRecover(t);
          let { transaction: r } = e.params,
            i = i7(r, this._account.address),
            a = i6(r)
              ? T.Buffer.from(r.message.serialize())
              : r.serializeMessage(),
            { signature: n } = await this.signMessageRpc(
              {
                method: "signMessage",
                params: { message: a.toString("base64") },
              },
              t,
            );
          return (
            r.addSignature(i, T.Buffer.from(n, "base64")),
            { signedTransaction: r }
          );
        } catch (r) {
          console.error(r);
          let t =
            r instanceof Error ? r.message : "Unable to make wallet request";
          throw (
            this._privyInternal.createAnalyticsEvent(
              "embedded_wallet_sdk_rpc_failed",
              {
                method: e.method,
                address: this._account.wallet_index,
                error: t,
              },
            ),
            new ij({ code: "embedded_wallet_request_error", error: t })
          );
        }
      }
      toJSON() {
        return `PrivyEmbeddedSolanaProvider { address: '${this._account.address}', request: [Function] }`;
      }
    },
    at = class {
      _proxy;
      _privyInternal;
      _account;
      _entropyId;
      _entropyIdVerifier;
      constructor({
        proxy: e,
        privyInternal: t,
        account: r,
        entropyId: i,
        entropyIdVerifier: a,
      }) {
        ((this._proxy = e),
          (this._privyInternal = t),
          (this._account = r),
          (this._entropyId = i),
          (this._entropyIdVerifier = a));
      }
      async sign({ message: e }) {
        return await this.request({
          method: "sign",
          params: { message: new TextDecoder("utf8").decode(e) },
        });
      }
      async signTransaction({ psbt: e }) {
        return await this.request({
          method: "signTransaction",
          params: { psbt: e },
        });
      }
      async request(e) {
        if (iG(this._account))
          throw new ij({
            code: "unsupported_wallet_type",
            error:
              "Bitcoin wallet providers are only supported for on-device execution and this app uses TEE execution. Use the useSignRawHash hook from @privy-io/expo/extended-chains to sign over a hash with this wallet. Learn more at https://docs.privy.io/recipes/tee-wallet-migration-guide",
          });
        if (!(await this._privyInternal.getAccessTokenInternal()))
          throw new ij({
            error: "Missing access token",
            code: "attempted_rpc_call_before_logged_in",
          });
        return this.handleIFrameRpc(e);
      }
      async handleIFrameRpc(e) {
        try {
          let t = await this._privyInternal.getAccessTokenInternal();
          if (!t)
            throw Error("Missing access token. User must be authenticated.");
          return (
            await this._proxy.rpcWallet({
              accessToken: t,
              request: e,
              entropyId: this._entropyId,
              entropyIdVerifier: this._entropyIdVerifier,
              hdWalletIndex: this._account.wallet_index,
              chainType: this._account.chain_type,
            })
          ).response.data;
        } catch (r) {
          console.error(r);
          let t =
            r instanceof Error ? r.message : "Unable to make wallet request";
          throw (
            this._privyInternal.createAnalyticsEvent(
              "embedded_wallet_sdk_rpc_failed",
              { method: e.method, address: this._account.address, error: t },
            ),
            new ij({ code: "embedded_wallet_request_error", error: t })
          );
        }
      }
      toJSON() {
        return `PrivyEmbeddedBitcoinProvider { address: '${this._account.address}', request: [Function] }`;
      }
    };
  async function ar(e, t, r, i, a = !1, n, s) {
    let o = a,
      d = async (n) =>
        o
          ? (n === +!a
              ? i()
              : r.current?.reject(
                  new iq(
                    "missing_or_invalid_mfa",
                    "MFA verification failed, retry.",
                  ),
                ),
            await e(
              await new Promise((e, i) => {
                ((t.current = { resolve: e, reject: i }),
                  setTimeout(() => {
                    let e = new iq(
                      "mfa_timeout",
                      "Timed out waiting for MFA code",
                    );
                    (r.current?.reject(e), i(e));
                  }, s));
              }),
            ))
          : await e(),
      l = null;
    for (let e = 0; e < n; e++)
      try {
        ((l = await d(e)), r.current?.resolve(void 0));
        break;
      } catch (e) {
        if ("missing_or_invalid_mfa" === e.type) o = !0;
        else throw (r.current?.resolve(void 0), e);
      }
    if (null === l) {
      let e = new iq(
        "mfa_verification_max_attempts_reached",
        "Max MFA verification attempts reached",
      );
      throw (r.current?.reject(e), e);
    }
    return l;
  }
  let ai = ((b = 0), () => `id-${b++}`),
    aa = (e, t) => ("bigint" == typeof t ? t.toString() : t),
    an = async (e, { ms: t, msg: r }) => {
      let i,
        a = new Promise((e, a) => {
          i = setTimeout(() => {
            a(Error(r));
          }, t ?? 15e3);
        });
      try {
        return await Promise.race([e, a]);
      } finally {
        void 0 !== i && clearTimeout(i);
      }
    },
    as = new (class {
      callbacks = {};
      enqueue(e, t) {
        this.callbacks[e] = t;
      }
      flush(e) {
        let t = Object.values(this.callbacks);
        for (let { reject: r } of ((this.callbacks = {}), t)) r(e);
      }
      dequeue(e, t) {
        let r = this.callbacks[t];
        if (!r)
          return (
            console.warn(`[Privy] No callback found for "${e}" (id: ${t})`),
            null
          );
        switch ((delete this.callbacks[t], e)) {
          case "privy:iframe:ready":
          case "privy:wallets:create":
          case "privy:user-signer:sign":
          case "privy:wallets:add":
          case "privy:wallets:set-recovery":
          case "privy:wallets:connect":
          case "privy:wallets:recover":
          case "privy:wallets:rpc":
          case "privy:wallets:import":
          case "privy:wallet:create":
          case "privy:wallet:connect":
          case "privy:wallet:recover":
          case "privy:wallet:rpc":
          case "privy:solana-wallet:create":
          case "privy:solana-wallet:create-additional":
          case "privy:solana-wallet:connect":
          case "privy:solana-wallet:recover":
          case "privy:solana-wallet:rpc":
          case "privy:delegated-actions:consent":
          case "privy:mfa:verify":
          case "privy:mfa:init-enrollment":
          case "privy:mfa:submit-enrollment":
          case "privy:mfa:unenroll":
          case "privy:mfa:clear":
          case "privy:auth:unlink-passkey":
            return r;
          default:
            throw Error(`invalid wallet event type ${e}`);
        }
      }
    })();
  var ao = class {
    ready;
    _waitForReadyPromise = null;
    cache;
    _embeddedWalletMessagePoster;
    mfa;
    constructor(e, t) {
      ((this.ready = !1),
        (this.cache = new Map()),
        (this._embeddedWalletMessagePoster = e),
        (this.mfa = t));
    }
    invokeWithMfa(e, t) {
      return an(
        ar(
          (r) =>
            an(
              this.waitForReady().then(() => e(r)),
              { msg: t.timeoutMsg, ms: t.timeoutMs },
            ),
          this.mfa.rootPromise,
          this.mfa.submitPromise,
          () => this.mfa.emit("mfaRequired"),
          t.mfaAlwaysRequired ?? !1,
          4,
          3e5,
        ),
        { msg: "Operation reached timeout: MFA verification", ms: 126e4 },
      );
    }
    reload() {
      return (
        (this.ready = !1),
        (this._waitForReadyPromise = null),
        as.flush(Error("Embedded wallet WebView was reloaded")),
        this.cache.clear(),
        this._embeddedWalletMessagePoster.reload()
      );
    }
    onBackground() {
      this.ready = !1;
    }
    ping(e = 15e3) {
      return an(this.invoke("privy:iframe:ready", {}), {
        msg: "Ping reached timeout",
        ms: e,
      });
    }
    create(e) {
      return an(
        this.waitForReady().then(() => this.invoke("privy:wallet:create", e)),
        { msg: "Operation reached timeout: create" },
      );
    }
    rpc(e) {
      return this.invokeWithMfa(
        (t) => this.invoke("privy:wallet:rpc", { ...t, ...e }),
        { timeoutMsg: "Operation reached timeout: rpc" },
      );
    }
    createSolana(e) {
      return this.invokeWithMfa(
        (t) => this.invoke("privy:solana-wallet:create", { ...t, ...e }),
        { timeoutMsg: "Operation reached timeout: create", timeoutMs: 6e4 },
      );
    }
    createAdditionalSolana(e) {
      return an(
        this.waitForReady().then(() =>
          this.invoke("privy:solana-wallet:create-additional", e),
        ),
        { msg: "Operation reached timeout: create" },
      );
    }
    solanaRpc(e) {
      return this.invokeWithMfa(
        (t) => this.invoke("privy:solana-wallet:rpc", { ...t, ...e }),
        { timeoutMsg: "Operation reached timeout: solana-rpc" },
      );
    }
    delegateWallets(e) {
      return this.invokeWithMfa(
        (t) => this.invoke("privy:delegated-actions:consent", { ...t, ...e }),
        { timeoutMsg: "Operation reached timeout: delegated-actions:consent" },
      );
    }
    verifyMfa(e) {
      return this.invokeWithMfa(
        (t) => this.invoke("privy:mfa:verify", { ...t, ...e }),
        {
          timeoutMsg: "Operation reached timeout: mfa:verify",
          mfaAlwaysRequired: !0,
        },
      );
    }
    initEnrollMfa(e) {
      return this.invokeWithMfa(
        (t) => this.invoke("privy:mfa:init-enrollment", { ...t, ...e }),
        { timeoutMsg: "Operation reached timeout: mfa:init-enrollment" },
      );
    }
    submitEnrollMfa(e) {
      return "passkey" === e.method
        ? this.invokeWithMfa(
            (t) => this.invoke("privy:mfa:submit-enrollment", { ...t, ...e }),
            { timeoutMsg: "Operation reached timeout: mfa:submit-enrollment" },
          )
        : an(
            this.waitForReady().then(() =>
              this.invoke("privy:mfa:submit-enrollment", e),
            ),
            { msg: "Operation reached timeout: mfa:submit-enrollment" },
          );
    }
    unenrollMfa(e) {
      return this.invokeWithMfa(
        (t) => this.invoke("privy:mfa:unenroll", { ...t, ...e }),
        {
          timeoutMsg: "Operation reached timeout: mfa:unenroll",
          mfaAlwaysRequired: !0,
        },
      );
    }
    unlinkPasskey(e) {
      return this.invokeWithMfa(
        (t) => this.invoke("privy:auth:unlink-passkey", { ...t, ...e }),
        {
          timeoutMsg: "Operation reached timeout: auth:unlink-passkey",
          mfaAlwaysRequired: !0,
        },
      );
    }
    clearMfa(e) {
      return an(
        this.waitForReady().then(() => this.invoke("privy:mfa:clear", e)),
        { msg: "Operation reached timeout: mfa:clear" },
      );
    }
    createWallet(e) {
      return this.invokeWithMfa(
        (t) => this.invoke("privy:wallets:create", { ...t, ...e }),
        { timeoutMsg: "Operation reached timeout: create", timeoutMs: 6e4 },
      );
    }
    signWithUserSigner(e) {
      return this.invokeWithMfa(
        (t) => this.invoke("privy:user-signer:sign", { ...t, ...e }),
        { timeoutMsg: "Operation reached timeout: user-signer:sign" },
      );
    }
    addWallet(e) {
      return an(
        this.waitForReady().then(() => this.invoke("privy:wallets:add", e)),
        { msg: "Operation reached timeout: wallets:add" },
      );
    }
    importWallet(e) {
      return this.invokeWithMfa(
        (t) => this.invoke("privy:wallets:import", { ...t, ...e }),
        {
          timeoutMsg: "Operation reached timeout: wallets:import",
          timeoutMs: 6e4,
        },
      );
    }
    setRecovery(e) {
      return this.invokeWithMfa(
        (t) => this.invoke("privy:wallets:set-recovery", { ...t, ...e }),
        {
          timeoutMsg: "Operation reached timeout: wallets:set-recovery",
          timeoutMs: 6e4,
        },
      );
    }
    connect(e) {
      return an(
        this.waitForReady().then(() => this.invoke("privy:wallets:connect", e)),
        { msg: "Operation reached timeout: wallets:connect" },
      );
    }
    recover(e) {
      return this.invokeWithMfa(
        (t) => this.invoke("privy:wallets:recover", { ...t, ...e }),
        {
          timeoutMsg: "Operation reached timeout: wallets:recover",
          timeoutMs: 6e4,
        },
      );
    }
    rpcWallet(e) {
      return this.invokeWithMfa(
        (t) => this.invoke("privy:wallets:rpc", { ...t, ...e }),
        { timeoutMsg: "Operation reached timeout: wallets:rpc" },
      );
    }
    handleEmbeddedWalletMessages(e) {
      if (!e.event.startsWith("privy:"))
        return void console.warn(`Unsupported event type: ${e.event}`);
      let t = as.dequeue(e.event, e.id);
      if (t)
        return void 0 !== e.error
          ? t.reject(new iq(e.error.type, e.error.message))
          : t.resolve(e.data);
    }
    waitForReady() {
      return this.ready
        ? Promise.resolve()
        : ((this._waitForReadyPromise ||= new Promise((e, t) => {
            (async () => {
              for (let t = 0; t < 100 && !this.ready; t++)
                (this.invoke("privy:iframe:ready", {})
                  .then(() => {
                    ((this.ready = !0),
                      (this._waitForReadyPromise = null),
                      e());
                  })
                  .catch(() => {}),
                  await new Promise((e) => setTimeout(e, 150)));
              this.ready ||
                ((this._waitForReadyPromise = null),
                t(Error("Embedded wallet WebView failed to become ready")));
            })();
          })),
          this._waitForReadyPromise);
    }
    invoke(e, t) {
      let r = `${e}${JSON.stringify(t, aa)}`;
      if ("privy:wallet:create" === e || "privy:solana-wallet:create" === e) {
        let e = this.cache.get(r);
        if (e) return e;
      }
      let i = new Promise((r, i) => {
        let a = ai();
        (as.enqueue(a, { resolve: r, reject: i }),
          this._embeddedWalletMessagePoster.postMessage(
            JSON.stringify({ id: a, event: e, data: t }),
            "*",
          ));
      }).finally(() => {
        this.cache.delete(r);
      });
      return (this.cache.set(r, i), i);
    }
  };
  async function ad(e, { request: t, headers: r }) {
    return await e.fetchPrivyRoute(C.$S, { body: t, headers: r });
  }
  async function al({ context: e, chainType: t, idempotencyKey: r }) {
    return {
      wallet: await ad(e, {
        request: { chain_type: t, owner_id: void 0 },
        headers: r ? { "privy-idempotency-key": r } : void 0,
      }),
    };
  }
  var ac = class {
      _privyInternal;
      _proxy;
      _chains = Array.from(x.L);
      _mfa;
      _mfaPromises;
      _appApi;
      _dataSuffixPlugin;
      constructor(e, t, r, i, a, n, s) {
        if (
          ((this._privyInternal = e),
          t && ((this._proxy = new ao(t, a)), i.setProxy(this._proxy)),
          r)
        ) {
          let e = (0, x.Q)(r);
          this._chains = e;
        }
        ((this._mfa = i),
          (this._mfaPromises = a),
          (this._appApi = n),
          (this._dataSuffixPlugin = s));
      }
      setMessagePoster(e) {
        ((this._proxy = new ao(e, this._mfaPromises)),
          this._mfa.setProxy(this._proxy));
      }
      async signWithUserSigner(e) {
        if (!this._proxy) throw Error("Embedded wallet proxy not initialized");
        let t = await this._privyInternal.getAccessTokenInternal();
        if (!t)
          throw new ij({
            error:
              "User must be logged in to sign a message with the user signer",
            code: "user_signer_sign_error",
          });
        let { signature: r } = await this._proxy.signWithUserSigner({
          accessToken: t,
          message: e.message,
        });
        return { signature: r };
      }
      async add(e) {
        if (!this._proxy) throw Error("Embedded wallet proxy not initialized");
        if (
          this._privyInternal.config?.embedded_wallet_config.mode ===
          "user-controlled-server-wallets-only"
        )
          await al({
            context: {
              app: this._appApi,
              fetchPrivyRoute: (...e) => this._privyInternal.fetch(...e),
              getCompiledPath: (...e) => this._privyInternal.getPath(...e),
            },
            chainType: e.chainType,
          });
        else {
          if (!e.entropyId)
            throw new ij({
              error: "Missing entropy details for wallet creation",
              code: "embedded_wallet_creation_error",
            });
          let t = await this._privyInternal.getAccessTokenInternal();
          if (!t)
            throw new ij({
              error: "User must be logged in to create an embedded wallet",
              code: "embedded_wallet_creation_error",
            });
          await this._proxy.addWallet({ accessToken: t, ...e });
        }
        let { user: t } = await this._privyInternal.refreshSession();
        return { user: t };
      }
      async getBitcoinProvider({
        wallet: e,
        entropyId: t,
        entropyIdVerifier: r,
        recoveryPassword: i,
        recoveryAccessToken: a,
        recoverySecretOverride: n,
      }) {
        if (!this._proxy) throw Error("Embedded wallet proxy not initialized");
        if (!(await this._privyInternal.getAccessTokenInternal()))
          throw Error("User must be logged in to create an embedded wallet");
        return (
          iG(e) ||
            (await this._load({
              entropyId: t,
              entropyIdVerifier: r,
              wallet: e,
              recoveryPassword: i,
              recoveryAccessToken: a,
              recoverySecretOverride: n,
            })),
          new at({
            account: e,
            privyInternal: this._privyInternal,
            proxy: this._proxy,
            entropyId: t,
            entropyIdVerifier: r,
          })
        );
      }
      async create({
        password: e,
        recoveryMethod: t,
        recoveryToken: r,
        recoveryKey: i,
        recoverySecretOverride: a,
        iCloudRecordNameOverride: n,
        solanaAccount: s,
        skipCallbacks: o,
        idempotencyKey: d,
      }) {
        if (!this._proxy) throw Error("Embedded wallet proxy not initialized");
        if (
          this._privyInternal.config?.embedded_wallet_config.mode ===
          "user-controlled-server-wallets-only"
        ) {
          if (t && !t.startsWith("privy"))
            throw new ij({
              error:
                "User-controlled server wallets do not support custom recovery methods",
              code: "embedded_wallet_creation_error",
            });
          await al({
            context: {
              app: this._appApi,
              fetchPrivyRoute: (...e) => this._privyInternal.fetch(...e),
              getCompiledPath: (...e) => this._privyInternal.getPath(...e),
            },
            chainType: "ethereum",
            idempotencyKey: d,
          });
        } else {
          let o;
          if (
            ((o = t || (e ? "user-passcode" : "privy")),
            e && "string" != typeof e)
          )
            throw Error("Invalid recovery password, must be a string");
          if (
            "privy" === o &&
            this._privyInternal.config?.embedded_wallet_config
              .require_user_password_on_create
          )
            throw Error(
              "Password not provided yet is required by App configuration",
            );
          let d = await this._privyInternal.getAccessTokenInternal();
          if (!d)
            throw Error("User must be logged in to create an embedded wallet");
          let { address: l } = await this._proxy.create({
            accessToken: d,
            recoveryMethod: o,
            recoveryKey: i,
            recoveryPassword: e,
            recoveryAccessToken: r,
            recoverySecretOverride: a,
            iCloudRecordNameOverride: n,
            solanaAddress: s?.address,
          });
          if (!l) throw Error("Failed to create wallet");
        }
        return await this._privyInternal.refreshSession(o);
      }
      async importWallet({
        privateKey: e,
        chainType: t,
        additionalSigners: r,
      }) {
        if (!this._proxy) throw Error("Embedded wallet proxy not initialized");
        let i =
          this._privyInternal.config?.embedded_wallet_config.mode ===
          "user-controlled-server-wallets-only"
            ? "tee"
            : "on-device";
        if (r && "on-device" === i)
          throw new ij({
            error:
              "Specifying additionalSigners is only supported for TEE execution and this app uses on-device execution. Learn more https://docs.privy.io/recipes/tee-wallet-migration-guide",
            code: "invalid_input",
          });
        let a = await this._privyInternal.getAccessTokenInternal();
        if (!a)
          throw new ij({
            error: "User must be logged in to import an embedded wallet",
            code: "embedded_wallet_before_logged_in",
          });
        let { address: n } = await this._proxy.importWallet({
          accessToken: a,
          privateKey: e,
          chainType: t,
          mode: i,
          additionalSigners: r,
        });
        if (!n)
          throw new ij({
            error: "Failed to import wallet",
            code: "embedded_wallet_creation_error",
          });
        let { session_update_action: s, ...o } =
          await this._privyInternal.refreshSession();
        return { address: n, user: o };
      }
      async createSolana(e) {
        if (!this._proxy)
          throw new ij({
            error: "Embedded wallet proxy not initialized",
            code: "embedded_wallet_creation_error",
          });
        if (
          this._privyInternal.config?.embedded_wallet_config.mode ===
          "user-controlled-server-wallets-only"
        )
          await al({
            context: {
              app: this._appApi,
              fetchPrivyRoute: (...e) => this._privyInternal.fetch(...e),
              getCompiledPath: (...e) => this._privyInternal.getPath(...e),
            },
            chainType: "solana",
            idempotencyKey: e?.idempotencyKey,
          });
        else {
          let t = await this._privyInternal.getAccessTokenInternal();
          if (!t)
            throw new ij({
              error: "User must be logged in to create an embedded wallet",
              code: "embedded_wallet_creation_error",
            });
          e?.ethereumAccount && (await this.getProvider(e.ethereumAccount));
          let { publicKey: r } = await this._proxy.createSolana({
            accessToken: t,
            ethereumAddress: e?.ethereumAccount?.address,
          });
          if (!r)
            throw new ij({
              error: "Failed to create wallet",
              code: "embedded_wallet_creation_error",
            });
        }
        return await this._privyInternal.refreshSession();
      }
      async delegateWallets({ delegatedWallets: e, rootWallet: t }) {
        if (!this._proxy)
          throw new ij({
            error: "Embedded wallet proxy not initialized",
            code: "embedded_wallet_creation_error",
          });
        let r = await this._privyInternal.getAccessTokenInternal();
        if (!r)
          throw new ij({
            error: "User must be logged in to create an embedded wallet",
            code: "embedded_wallet_creation_error",
          });
        await this._proxy.delegateWallets({
          accessToken: r,
          delegatedWallets: e,
          rootWallet: t,
        });
      }
      async getProvider(e, t, r, i, a) {
        if (!this._proxy) throw Error("Embedded wallet proxy not initialized");
        return (
          iG(e) ||
            (await this._load({
              wallet: e,
              entropyId: e.address,
              entropyIdVerifier: "ethereum-address-verifier",
              recoveryPassword: t,
              recoveryKey: a,
              recoveryAccessToken: r,
              recoverySecretOverride: i,
            })),
          new i8({
            account: e,
            entropyId: e.address,
            entropyIdVerifier: "ethereum-address-verifier",
            privyInternal: this._privyInternal,
            chains: this._chains,
            walletProxy: this._proxy,
            appApi: this._appApi,
            dataSuffixPlugin: this._dataSuffixPlugin,
          })
        );
      }
      async getEthereumProvider({
        wallet: e,
        entropyId: t,
        entropyIdVerifier: r,
        recoveryPassword: i,
        recoveryAccessToken: a,
        recoverySecretOverride: n,
        recoveryKey: s,
        onNeedsRecovery: o,
      }) {
        if (!this._proxy) throw Error("Embedded wallet proxy not initialized");
        if (!(await this._privyInternal.getAccessTokenInternal()))
          throw Error("User must be logged in to create an embedded wallet");
        return (
          iG(e) ||
            ((!o || i || a || n || s) &&
              (await this._load({
                entropyId: t,
                entropyIdVerifier: r,
                wallet: e,
                recoveryPassword: i,
                recoveryAccessToken: a,
                recoverySecretOverride: n,
                recoveryKey: s,
              }))),
          new i8({
            account: e,
            entropyId: t,
            entropyIdVerifier: "ethereum-address-verifier",
            privyInternal: this._privyInternal,
            chains: this._chains,
            walletProxy: this._proxy,
            onNeedsRecovery: o,
            appApi: this._appApi,
            dataSuffixPlugin: this._dataSuffixPlugin,
          })
        );
      }
      async getSolanaProvider(e, t, r, i, a, n, s) {
        if (!this._proxy)
          throw new ij({
            error: "Embedded wallet proxy not initialized",
            code: "embedded_wallet_webview_not_loaded",
          });
        return (
          iG(e) ||
            ((!s || i || a || n) &&
              (await this._load({
                wallet: e,
                entropyId: t,
                entropyIdVerifier: r,
                recoveryPassword: i,
                recoveryAccessToken: a,
                recoverySecretOverride: n,
              }))),
          new ae({
            account: e,
            privyInternal: this._privyInternal,
            proxy: this._proxy,
            entropyId: t,
            entropyIdVerifier: r,
            onNeedsRecovery: s,
            app: this._appApi,
          })
        );
      }
      async setRecovery(e) {
        let { wallet: t, ...r } = e;
        if (!this._proxy) throw Error("Embedded wallet proxy not initialized");
        if (iG(t))
          throw new ij({
            error: "This wallet does not support setting recovery methods",
            code: "unsupported_recovery_method",
          });
        ((function ({ currentRecoveryMethod: e, upgradeToRecoveryMethod: t }) {
          switch (e) {
            case "privy":
            case "user-passcode":
            case "recovery-encryption-key":
              return;
            case "icloud":
            case "google-drive":
              if (e === t)
                throw Error("Cannot upgrade to the existing cloud platform");
              return;
            default:
              throw Error("Unknown recovery method");
          }
        })({
          currentRecoveryMethod: t.recovery_method,
          upgradeToRecoveryMethod:
            "icloud-native" === r.recoveryMethod ? "icloud" : r.recoveryMethod,
        }),
          await this._load(
            "solana" === t.chain_type
              ? {
                  wallet: t,
                  entropyId: t.address,
                  entropyIdVerifier: "solana-address-verifier",
                }
              : {
                  wallet: t,
                  entropyId: t.address,
                  entropyIdVerifier: "ethereum-address-verifier",
                },
          ));
        let i = await this._privyInternal.getAccessTokenInternal();
        if (!i)
          throw Error(
            "User must be logged in to interact with embedded wallets",
          );
        let a = t.recovery_method;
        this._privyInternal.createAnalyticsEvent(
          "embedded_wallet_sdk_set_recovery_started",
          {
            address: t.address,
            target_recovery_method: r.recoveryMethod,
            existing_recovery_method: a,
          },
        );
        try {
          let e;
          if ("user-passcode" === r.recoveryMethod)
            e = {
              recoveryMethod: "user-passcode",
              recoveryPassword: r.password,
            };
          else if ("google-drive" === r.recoveryMethod)
            e = {
              recoveryMethod: "google-drive",
              recoveryAccessToken: r.recoveryAccessToken,
            };
          else if ("icloud" === r.recoveryMethod)
            e = {
              recoveryMethod: "icloud",
              recoveryAccessToken: r.recoveryAccessToken,
            };
          else if ("icloud-native" === r.recoveryMethod)
            e = {
              recoveryMethod: "icloud-native",
              iCloudRecordNameOverride: r.iCloudRecordNameOverride,
              recoverySecretOverride: r.recoverySecretOverride,
            };
          else if ("recovery-encryption-key" === r.recoveryMethod)
            e = {
              recoveryMethod: "recovery-encryption-key",
              recoveryKey: r.recoveryKey,
            };
          else if ("privy" === r.recoveryMethod)
            e = { recoveryMethod: "privy" };
          else throw Error(`Unknown recovery method: ${r.recoveryMethod}`);
          (await this._proxy.setRecovery({
            accessToken: i,
            entropyId: t.address,
            entropyIdVerifier:
              "solana" === t.chain_type
                ? "solana-address-verifier"
                : "ethereum-address-verifier",
            ...e,
          }),
            this._privyInternal.createAnalyticsEvent(
              "embedded_wallet_sdk_set_recovery_completed",
              {
                address: t.address,
                target_recovery_method: r.recoveryMethod,
                existing_recovery_method: a,
              },
            ));
          let { user: n } = await this._privyInternal.refreshSession();
          return {
            user: n,
            provider:
              "ethereum" === t.chain_type
                ? new i8({
                    account: t,
                    entropyId: t.address,
                    entropyIdVerifier: "ethereum-address-verifier",
                    privyInternal: this._privyInternal,
                    chains: this._chains,
                    walletProxy: this._proxy,
                    appApi: this._appApi,
                    dataSuffixPlugin: this._dataSuffixPlugin,
                  })
                : null,
          };
        } catch (e) {
          throw (
            this._privyInternal.createAnalyticsEvent(
              "embedded_wallet_sdk_set_recovery_failed",
              {
                address: t.address,
                recovery_method: t.recovery_method,
                error:
                  e instanceof Error ? e.message : "Unable to recover wallet",
              },
            ),
            e
          );
        }
      }
      getURL() {
        let e = new URL(
          `${this._privyInternal.baseUrl}/apps/${this._privyInternal.appId}/embedded-wallets`,
        );
        return (
          this._privyInternal.caid &&
            e.searchParams.append("caid", this._privyInternal.caid),
          this._privyInternal.appClientId &&
            e.searchParams.append("client_id", this._privyInternal.appClientId),
          e.href
        );
      }
      get chains() {
        return this._chains;
      }
      onMessage(e) {
        if (!this._proxy) throw Error("Embedded wallet proxy not initialized");
        return this._proxy.handleEmbeddedWalletMessages(e);
      }
      reload() {
        this._proxy
          ? this._proxy.reload()
          : this._privyInternal.logger.warn(
              "Attempted to reload proxy before initialized",
            );
      }
      onBackground() {
        this._proxy?.onBackground();
      }
      async ping(e) {
        try {
          if (!this._proxy)
            throw Error("Embedded wallet proxy not initialized");
          return (await this._proxy.ping(e), !0);
        } catch (e) {
          return (this._privyInternal.logger.debug(e), !1);
        }
      }
      async _load({
        entropyId: e,
        entropyIdVerifier: t,
        wallet: r,
        recoveryPassword: i,
        recoveryKey: a,
        recoveryAccessToken: n,
        recoverySecretOverride: s,
      }) {
        if (!this._proxy) throw Error("Embedded wallet proxy not initialized");
        let o = await this._privyInternal.getAccessTokenInternal();
        if (!o)
          throw Error(
            "User must be logged in to interact with embedded wallets",
          );
        try {
          return (
            await this._proxy.connect({
              accessToken: o,
              entropyId: e,
              entropyIdVerifier: t,
            }),
            e
          );
        } catch (d) {
          if (iJ(d))
            try {
              if ("privy" === r.recovery_method) {
                this._privyInternal.createAnalyticsEvent(
                  "embedded_wallet_sdk_recovery_started",
                  { address: r.address, recovery_method: r.recovery_method },
                );
                let i = await this._proxy.recover({
                  accessToken: o,
                  entropyId: e,
                  entropyIdVerifier: t,
                });
                return (
                  this._privyInternal.createAnalyticsEvent(
                    "embedded_wallet_sdk_recovery_completed",
                    { address: r.address, recovery_method: r.recovery_method },
                  ),
                  i.entropyId
                );
              }
              if ("user-passcode" === r.recovery_method && i) {
                this._privyInternal.createAnalyticsEvent(
                  "embedded_wallet_sdk_recovery_started",
                  { address: r.address, recovery_method: r.recovery_method },
                );
                let a = await this._proxy.recover({
                  accessToken: o,
                  recoveryPassword: i,
                  entropyId: e,
                  entropyIdVerifier: t,
                });
                return (
                  this._privyInternal.createAnalyticsEvent(
                    "embedded_wallet_sdk_recovery_completed",
                    { address: r.address, recovery_method: r.recovery_method },
                  ),
                  a.entropyId
                );
              }
              if (["google-drive", "icloud"].includes(r.recovery_method) && n) {
                this._privyInternal.createAnalyticsEvent(
                  "embedded_wallet_sdk_recovery_started",
                  { address: r.address, recovery_method: r.recovery_method },
                );
                let i = await this._proxy.recover({
                  accessToken: o,
                  recoveryAccessToken: n,
                  entropyId: e,
                  entropyIdVerifier: t,
                });
                return (
                  this._privyInternal.createAnalyticsEvent(
                    "embedded_wallet_sdk_recovery_completed",
                    { address: r.address, recovery_method: r.recovery_method },
                  ),
                  i.entropyId
                );
              }
              if ("icloud" === r.recovery_method && s) {
                this._privyInternal.createAnalyticsEvent(
                  "embedded_wallet_sdk_recovery_started",
                  { address: r.address, recovery_method: "icloud-native" },
                );
                let i = await this._proxy.recover({
                  accessToken: o,
                  recoverySecretOverride: s,
                  entropyId: e,
                  entropyIdVerifier: t,
                });
                return (
                  this._privyInternal.createAnalyticsEvent(
                    "embedded_wallet_sdk_recovery_completed",
                    { address: r.address, recovery_method: "icloud-native" },
                  ),
                  i.entropyId
                );
              }
              if ("recovery-encryption-key" === r.recovery_method && a) {
                this._privyInternal.createAnalyticsEvent(
                  "embedded_wallet_sdk_recovery_started",
                  { address: r.address, recovery_method: r.recovery_method },
                );
                let i = await this._proxy.recover({
                  accessToken: o,
                  recoveryKey: a,
                  entropyId: e,
                  entropyIdVerifier: t,
                });
                return (
                  this._privyInternal.createAnalyticsEvent(
                    "embedded_wallet_sdk_recovery_completed",
                    { address: r.address, recovery_method: r.recovery_method },
                  ),
                  i.entropyId
                );
              }
            } catch (t) {
              throw (
                this._privyInternal.createAnalyticsEvent(
                  "embedded_wallet_sdk_recovery_failed",
                  {
                    address: r.address,
                    recovery_method: r.recovery_method,
                    error:
                      t instanceof Error
                        ? t.message
                        : `Unable to recover wallet: ${e}`,
                  },
                ),
                t
              );
            }
          throw d;
        }
      }
    },
    au = class extends N.f {
      rootPromise;
      submitPromise;
      constructor() {
        (super(),
          (this.rootPromise = { current: null }),
          (this.submitPromise = { current: null }));
      }
    };
  let ah = ["chrome-extension:", "moz-extension:", "safari-web-extension:"],
    ap = !1,
    af = () => {
      if (ap) return !0;
      try {
        let e = globalThis,
          t = e.chrome?.runtime?.id ?? e.browser?.runtime?.id,
          r = e.location?.protocol;
        ap =
          ("string" == typeof t && t.length > 0) ||
          ("string" == typeof r && ah.includes(r));
      } catch {
        ap = !0;
      }
      return ap;
    },
    ay = {
      get: (e) => tw.get(e),
      set(e, t, r) {
        af() || tw.set(e, t, r);
      },
      remove(e) {
        tw.remove(e);
      },
    },
    am = ({ useServerCookies: e, cookieWriteBehavior: t }) =>
      !e && "never" !== t && !af(),
    a_ = "privy:active-user",
    ag = "privy:saved-users",
    av = (e) => (e ? `privy:${e}:token` : "privy:token"),
    a$ = (e) => (e ? `privy:${e}:pat` : "privy:pat"),
    ab = (e) => (e ? `privy:${e}:refresh_token` : "privy:refresh_token"),
    aw = (e) => (e ? `privy:${e}:id-token` : "privy:id-token"),
    aI = (e) => (e ? `privy-${e}-token` : "privy-token"),
    ak = (e) => (e ? `privy-${e}-refresh-token` : "privy-refresh-token"),
    aS = (e) => (e ? `privy-${e}-id-token` : "privy-id-token"),
    aT = (e) => (e ? `privy-${e}-session` : "privy-session"),
    aC =
      Promise.allSettled.bind(Promise) ??
      ((e) =>
        Promise.all(
          e.map((e) =>
            e
              .then((e) => ({ status: "fulfilled", value: e }))
              .catch((e) => ({ status: "rejected", reason: e })),
          ),
        )),
    aE = [
      "storage_cleared",
      "token_cleared",
      "refresh_token_cleared",
      "identity_token_cleared",
      "token_stored",
      "refresh_token_stored",
      "identity_token_stored",
      "oauth_tokens_granted",
      "error_storing_tokens",
    ];
  var aA = class extends N.f {
    static events = aE;
    _storage;
    _isUsingServerCookies = !1;
    _cookieWriteBehavior;
    GUEST_CREDENTIAL_STORAGE_KEY;
    _setStoredUsers;
    _hasEmittedStoredUsers = !1;
    constructor(e) {
      (super(),
        (this._storage = e.storage),
        (this._isUsingServerCookies = e.isUsingServerCookies),
        (this._cookieWriteBehavior = e.cookieWriteBehavior),
        (this.GUEST_CREDENTIAL_STORAGE_KEY = `privy:guest:${e.appId}`),
        (this._setStoredUsers = e.setStoredUsers));
    }
    set isUsingServerCookies(e) {
      this._isUsingServerCookies = e;
    }
    shouldWriteCookies() {
      return am({
        useServerCookies: this._isUsingServerCookies,
        cookieWriteBehavior: this._cookieWriteBehavior,
      });
    }
    writeCookie(e, t, r) {
      this.shouldWriteCookies() && ay.set(e, t, r);
    }
    setStoredUsersCallback(e) {
      ((this._setStoredUsers = e),
        this.getSavedUserIds().then((e) => {
          this._hasEmittedStoredUsers ||
            this._setStoredUsers?.({ users: e.map((e) => ({ id: e })) });
        }));
    }
    async getCustomerAccessToken() {
      let e = await this.getActiveUserId(),
        t = await this._storage.get(av(e));
      try {
        return "string" == typeof t ? new iM(t).value : null;
      } catch (e) {
        return (
          console.error(e),
          await this.destroyLocalState({ reason: "getToken_error" }),
          null
        );
      }
    }
    async getPrivyAccessToken() {
      let e = await this.getActiveUserId(),
        t = await this._storage.get(a$(e));
      try {
        return "string" == typeof t ? new iM(t).value : null;
      } catch (e) {
        return (
          console.error(e),
          await this.destroyLocalState({ reason: "getToken_error" }),
          null
        );
      }
    }
    async getRefreshToken() {
      let e = await this.getActiveUserId(),
        t = await this._storage.get(ab(e));
      return "string" == typeof t ? t : null;
    }
    async getIdentityToken() {
      let e = await this.getActiveUserId(),
        t = await this._storage.get(aw(e));
      return "string" == typeof t ? t : null;
    }
    async mightHaveServerCookies() {
      try {
        let e = await this.getActiveUserId(),
          t = ay.get(aT(e));
        if (void 0 !== t && t.length > 0) return !0;
        let r = ay.get(aT(null));
        return void 0 !== r && r.length > 0;
      } catch (e) {
        console.error(e);
      }
      return !1;
    }
    async hasRefreshCredentials(e, t) {
      return (
        (await this.mightHaveServerCookies()) ||
        ("string" == typeof e && "string" == typeof t)
      );
    }
    tokenIsActive(e) {
      if (!e) return !1;
      let t = iM.parse(e);
      return null !== t && !t.isExpired(30);
    }
    async destroyLocalState(e) {
      let t = await this.getActiveUserId(),
        r = [
          this._storage.del(av(null)),
          this._storage.del(a$(null)),
          this._storage.del(ab(null)),
          this._storage.del(aw(null)),
          this._storage.del(this.GUEST_CREDENTIAL_STORAGE_KEY),
          this._storage.del(a_),
        ];
      (t &&
        r.push(
          this._storage.del(av(t)),
          this._storage.del(a$(t)),
          this._storage.del(ab(t)),
          this._storage.del(aw(t)),
          this.removeSavedUserId(t),
        ),
        await aC(r),
        ay.remove(aI(null)),
        ay.remove(ak(null)),
        ay.remove(aS(null)),
        ay.remove(aT(null)),
        t &&
          (ay.remove(aI(t)),
          ay.remove(ak(t)),
          ay.remove(aS(t)),
          ay.remove(aT(t))),
        e?.reason && this.emit("storage_cleared", { reason: e.reason }));
    }
    async storeCustomerAccessToken(e) {
      let t = await this.getActiveUserId();
      await this.storeCustomerAccessTokenForUser(t, e);
    }
    async storeCustomerAccessTokenForUser(e, t) {
      let r = av(e),
        i = aI(e);
      if ("string" == typeof t) {
        let e = await this._storage.get(r);
        await this._storage.put(r, t);
        let a = iM.parse(t)?.expiration;
        (this.writeCookie(i, t, {
          sameSite: "Strict",
          secure: !0,
          expires: a ? new Date(1e3 * a) : void 0,
        }),
          e !== t &&
            this.emit("token_stored", {
              cookiesEnabled: this._isUsingServerCookies,
            }));
      } else {
        let e = await this._storage.get(r);
        (await this._storage.del(r),
          ay.remove(i),
          null !== e &&
            this.emit("token_cleared", {
              reason: "set_with_non_string_value",
            }));
      }
    }
    async storePrivyAccessToken(e) {
      let t = await this.getActiveUserId();
      await this.storePrivyAccessTokenForUser(t, e);
    }
    async storePrivyAccessTokenForUser(e, t) {
      let r = a$(e);
      "string" == typeof t
        ? await this._storage.put(r, t)
        : await this._storage.del(r);
    }
    async storeRefreshTokenForUser(e, t) {
      let r = ab(e),
        i = ak(e),
        a = aT(e);
      "string" == typeof t
        ? (await this._storage.put(r, t),
          this.writeCookie(a, "t", {
            sameSite: "Strict",
            secure: !0,
            expires: 30,
          }),
          this.writeCookie(i, t, {
            sameSite: "Strict",
            secure: !0,
            expires: 30,
          }),
          this.emit("refresh_token_stored", {
            cookiesEnabled: this._isUsingServerCookies,
          }))
        : (await this._storage.del(r),
          ay.remove(i),
          ay.remove(a),
          this.emit("refresh_token_cleared", {
            reason: "set_with_non_string_value",
          }));
    }
    async updateWithTokensResponse(e) {
      let t = e.user.id,
        r = (
          await aC([
            this.storeCustomerAccessTokenForUser(t, e.token),
            this.storePrivyAccessTokenForUser(t, e.privy_access_token),
            this.storeRefreshTokenForUser(t, e.refresh_token),
            this.storeIdentityTokenForUser(t, e.identity_token),
          ])
        ).filter((e) => "rejected" === e.status);
      if (r.length > 0)
        return void this.emit(
          "error_storing_tokens",
          r.map((e) => String(e.reason)).join(", "),
        );
      let i = (
        await aC([
          this.storeCustomerAccessTokenForUser(null, e.token),
          this.storePrivyAccessTokenForUser(null, e.privy_access_token),
          this.storeRefreshTokenForUser(null, e.refresh_token),
          this.storeIdentityTokenForUser(null, e.identity_token),
        ])
      ).filter((e) => "rejected" === e.status);
      if (i.length > 0)
        return void this.emit(
          "error_storing_tokens",
          i.map((e) => String(e.reason)).join(", "),
        );
      await this.storeActiveUserId(t);
      let a = (await aC([this.processOAuthTokens(e.oauth_tokens)])).filter(
        (e) => "rejected" === e.status,
      );
      a.length > 0 &&
        this.emit(
          "error_storing_tokens",
          a.map((e) => String(e.reason)).join(", "),
        );
    }
    async backfillLegacySession() {
      if (await this.getActiveUserId()) return;
      let [e, t, r, i] = await Promise.all([
        this._storage.get(av(null)),
        this._storage.get(a$(null)),
        this._storage.get(ab(null)),
        this._storage.get(aw(null)),
      ]);
      if ("string" != typeof e || "string" != typeof r) return;
      let a = iM.parse(e)?.subject;
      if ("string" != typeof a || 0 === a.length) return;
      let n = [
        this.storeCustomerAccessTokenForUser(a, e),
        this.storeRefreshTokenForUser(a, r),
      ];
      ("string" == typeof t && n.push(this.storePrivyAccessTokenForUser(a, t)),
        "string" == typeof i && n.push(this.storeIdentityTokenForUser(a, i)));
      let s = (await aC(n)).filter((e) => "rejected" === e.status);
      s.length > 0
        ? this.emit(
            "error_storing_tokens",
            s.map((e) => String(e.reason)).join(", "),
          )
        : await this.storeActiveUserId(a);
    }
    async processOAuthTokens(e) {
      e && this.emit("oauth_tokens_granted", e);
    }
    async storeIdentityToken(e) {
      let t = await this.getActiveUserId();
      await this.storeIdentityTokenForUser(t, e);
    }
    async storeIdentityTokenForUser(e, t) {
      let r = aw(e),
        i = aS(e);
      if ("string" == typeof t) {
        let e = await this._storage.get(r);
        await this._storage.put(r, t);
        let a = iM.parse(t)?.expiration;
        (this.writeCookie(i, t, {
          sameSite: "Strict",
          secure: !0,
          expires: a ? new Date(1e3 * a) : void 0,
        }),
          e !== t &&
            this.emit("identity_token_stored", {
              cookiesEnabled: this._isUsingServerCookies,
            }));
      } else {
        let e = await this._storage.get(r);
        (await this._storage.del(r),
          ay.remove(i),
          null !== e &&
            this.emit("identity_token_cleared", {
              reason: "set_with_non_string_value",
            }));
      }
    }
    async getOrCreateGuestCredential() {
      let e = await this._storage.get(this.GUEST_CREDENTIAL_STORAGE_KEY);
      if (e && "string" == typeof e) return e;
      let t = A.f.encode(crypto.getRandomValues(new Uint8Array(32)));
      return (await this._storage.put(this.GUEST_CREDENTIAL_STORAGE_KEY, t), t);
    }
    async getActiveUserId() {
      let e = await this._storage.get(a_);
      return "string" == typeof e ? e : null;
    }
    async storeActiveUserId(e) {
      let t = await this.getSavedUserIds();
      (await this.storeSavedUserIds([...t, e]), await this._storage.put(a_, e));
    }
    async getSavedUserIds() {
      let e = await this._storage.get(ag);
      if ("string" != typeof e) return [];
      try {
        let t = JSON.parse(e),
          r = Array.isArray(t) ? t.filter((e) => "string" == typeof e) : [];
        return [...new Set(r)];
      } catch {
        return [];
      }
    }
    async storeSavedUserIds(e) {
      let t = [...new Set(e)];
      (t.length > 0
        ? await this._storage.put(ag, JSON.stringify(t))
        : await this._storage.del(ag),
        this._setStoredUsers &&
          ((this._hasEmittedStoredUsers = !0),
          this._setStoredUsers({ users: t.map((e) => ({ id: e })) })));
    }
    async removeSavedUserId(e) {
      let t = await this.getSavedUserIds();
      await this.storeSavedUserIds(t.filter((t) => t !== e));
    }
    async switchActiveUserId(e) {
      if (!(await this.getSavedUserIds()).includes(e))
        throw new ij({
          code: "invalid_input",
          error:
            "Cannot switch active user because the user ID is not saved on this device",
        });
      await this._storage.put(a_, e);
    }
  };
  let ax = (e) => {
      let t = new AbortController();
      return (setTimeout(() => t.abort(), e), t.signal);
    },
    aN = () => void 0,
    aP = { NONE: -1 / 0, ERROR: 1, WARN: 2, INFO: 3, DEBUG: 1 / 0 },
    aO = "privy:caid";
  var aR = class {
      baseUrl;
      callbacks;
      appId;
      appClientId;
      logger;
      session;
      _config;
      _analyticsId;
      _storage;
      _sdkVersion = "js-sdk-core:0.77.0";
      _fetch;
      nativeAppIdentifier;
      _crypto;
      isMultiUserModeEnabled;
      _cache = new Map();
      constructor(e) {
        ((this.logger = (({ level: e, logger: t }) => ({
          get level() {
            return e;
          },
          error: aP[e] >= aP.ERROR ? t.error : aN,
          warn: aP[e] >= aP.WARN ? t.warn : aN,
          info: aP[e] >= aP.INFO ? t.info : aN,
          debug: aP[e] >= aP.DEBUG ? t.debug : aN,
        }))({
          level: e.logger?.level ?? e.logLevel ?? "ERROR",
          logger: e.logger ?? console,
        })),
          (this._storage = e.storage),
          (this._crypto = e.crypto),
          (this._analyticsId = null),
          this._getOrGenerateClientAnalyticsId(),
          (this.baseUrl = e.baseUrl ?? "https://auth.privy.io"),
          (this.appId = e.appId),
          (this.appClientId = e.appClientId),
          (this._sdkVersion = e.sdkVersion ?? this._sdkVersion),
          (this.callbacks = e.callbacks),
          (this.nativeAppIdentifier = e.nativeAppIdentifier),
          (this.isMultiUserModeEnabled = e.isMultiUserModeEnabled),
          (this.session = new aA({
            storage: this._storage,
            isUsingServerCookies: !1,
            cookieWriteBehavior: e.cookieWriteBehavior,
            appId: e.appId,
            setStoredUsers: e.callbacks?.setStoredUsers,
          })),
          (this._fetch = (
            (
              e,
              {
                retryableStatusCodes: t = t$,
                retryCount: r = 3,
                retryDelayMilliseconds: i = tv,
                includeRetryAttemptHeader: a = !0,
              } = {},
            ) =>
            async (n, s) => {
              let o = n instanceof Request ? n : new Request(n, s),
                d,
                l = !1,
                c;
              for (let n = 0; n <= r; n++) {
                let u = new Headers(s?.headers ?? o.headers);
                a && u.set("privy-retry-attempt", String(n));
                try {
                  let r = await e(o.clone(), { ...s, headers: u });
                  if (!t.includes(r.status)) return r;
                  ((c = r), (l = !1));
                } catch (e) {
                  (void 0 === d && (d = e), (l = !0));
                }
                n < r && (await tg(i(n)));
              }
              if (!l && void 0 !== c) return c;
              throw d;
            }
          )(globalThis.fetch)),
          this.session.on("error_storing_tokens", (e) => {
            this.createAnalyticsEvent("error_updating_tokens_in_storage", {
              reason: e,
            });
          }));
      }
      setCallbacks(e) {
        ((this.callbacks = { ...this.callbacks, ...e }),
          this.session.setStoredUsersCallback(this.callbacks?.setStoredUsers));
      }
      get isReady() {
        return !!this._config;
      }
      get config() {
        return this._config;
      }
      get caid() {
        return this._analyticsId;
      }
      async _initialize() {
        if (this.isReady) return void this.callbacks?.setIsReady?.(!0);
        if (!(await this.isStorageAccessible()))
          throw new ij({
            code: "storage_error",
            error: "Unable to access storage",
          });
        ((this._config = await this.getAppConfig()),
          this._config?.custom_api_url &&
            ((this.baseUrl = this._config.custom_api_url),
            (this.session.isUsingServerCookies = !0)),
          this.isMultiUserModeEnabled &&
            (await this.session.backfillLegacySession()),
          this.callbacks?.setIsReady?.(!0),
          this._sdkVersion.startsWith("js-sdk-core:") &&
            this.createAnalyticsEvent("sdk_initialize", {}));
      }
      getPath(e, { params: t, query: r }) {
        return `${this.baseUrl}${(0, C.CO)(e.path, t)}${(function (e) {
          let t = new URLSearchParams();
          for (let r in e) null != e[r] && t.append(r, String(e[r]));
          return Array.from(t).length ? "?" + t.toString() : "";
        })(r)}`;
      }
      async fetchWithoutAuthentication(e, t) {
        if (!this.isMultiUserModeEnabled)
          throw new ij({
            code: "invalid_input",
            error:
              'Unauthenticated requests require sessions.mode to be set to "multi-user"',
          });
        return this.fetch(e, {
          ...t,
          onRequest: this._beforeRequestWithoutAuth.bind(this),
        });
      }
      async fetchForLogin(e, t) {
        return this.isMultiUserModeEnabled
          ? this.fetchWithoutAuthentication(e, t)
          : this.fetch(e, t);
      }
      async fetch(
        e,
        {
          body: t,
          params: r,
          query: i,
          headers: a,
          onRequest: n = this._beforeRequest.bind(this),
        },
      ) {
        let s = new Request(this.getPath(e, { params: r, query: i }), {
            method: e.method,
            body: JSON.stringify(t),
            headers: a,
          }),
          o = await n(s),
          d = await this._fetch(s, o),
          l = await d.json();
        if (d.status > 299) throw new iF({ ...l, status: d.status });
        return l;
      }
      async fetchRaw(
        e,
        {
          body: t,
          params: r,
          query: i,
          headers: a,
          onRequest: n = this._beforeRequest.bind(this),
        },
      ) {
        let s = new Request(this.getPath(e, { params: r, query: i }), {
            method: e.method,
            body: JSON.stringify(t),
            headers: a,
          }),
          o = await n(s),
          d = await this._fetch(s, o);
        if (d.status > 299)
          throw new iF({
            ...(await d.json().catch(() => ({}))),
            status: d.status,
          });
        return d;
      }
      async _beforeRequestWithoutInitialize(e) {
        let t =
            (await this.session.getPrivyAccessToken()) ??
            (await this.session.getCustomerAccessToken()),
          r = new Headers(e.headers);
        (r.set("privy-app-id", this.appId),
          this.appClientId && r.set("privy-client-id", this.appClientId),
          r.set("privy-client", this._sdkVersion),
          t && r.set("Authorization", `Bearer ${t}`),
          r.set("Content-Type", "application/json"),
          r.set("Accept", "application/json"));
        let i = await this._getOrGenerateClientAnalyticsId();
        return (
          i && r.set("privy-ca-id", i),
          this.nativeAppIdentifier &&
            r.set("x-native-app-identifier", this.nativeAppIdentifier),
          { signal: ax(2e4), headers: r, credentials: "include" }
        );
      }
      async beforeRequestWithoutRefresh(e) {
        return (
          await this._initialize(),
          this._beforeRequestWithoutInitialize(e)
        );
      }
      async _beforeRequestWithoutAuth(e) {
        await this._initialize();
        let t = new Headers(e.headers);
        (t.set("privy-app-id", this.appId),
          this.appClientId && t.set("privy-client-id", this.appClientId),
          t.set("privy-client", this._sdkVersion),
          t.set("Content-Type", "application/json"),
          t.set("Accept", "application/json"));
        let r = await this._getOrGenerateClientAnalyticsId();
        return (
          r && t.set("privy-ca-id", r),
          this.nativeAppIdentifier &&
            t.set("x-native-app-identifier", this.nativeAppIdentifier),
          { signal: ax(2e4), headers: t }
        );
      }
      async _beforeRequest(e) {
        return (
          await this._initialize(),
          await this.getAccessTokenInternal(),
          this.beforeRequestWithoutRefresh(e)
        );
      }
      async getAppConfig() {
        return await this.fetch(C.r3, {
          params: { app_id: this.appId },
          onRequest: this._beforeRequestWithoutInitialize.bind(this),
        });
      }
      async _getOrGenerateClientAnalyticsId() {
        if (this._analyticsId) return this._analyticsId;
        try {
          let e = await this._storage.get(aO);
          if ("string" == typeof e && e.length > 0)
            return ((this._analyticsId = e), e);
        } catch (e) {
          this.logger.error("Unable to load clientId", e);
        }
        try {
          this._analyticsId = this._crypto.randomUUID();
        } catch (e) {
          this.logger.error("Unable to generate uuidv4", e);
        }
        if (this._analyticsId) {
          try {
            await this._storage.put(aO, this._analyticsId);
          } catch (e) {
            this.logger.error(
              `Unable to store clientId: ${this._analyticsId}`,
              e,
            );
          }
          return this._analyticsId;
        }
      }
      async destroyClientAnalyticsId() {
        try {
          return await this._storage.del(aO);
        } catch (e) {
          this.logger.error("Unable to delete clientId", e);
        }
      }
      async createAnalyticsEvent(e, t) {
        try {
          await this.fetch(C.vv, {
            body: {
              event_name: e,
              client_id: await this._getOrGenerateClientAnalyticsId(),
              payload: t,
            },
            onRequest: this.beforeRequestWithoutRefresh.bind(this),
          });
        } catch {}
      }
      async refreshSession(e = !1) {
        if (!(await this.isStorageAccessible()))
          throw new ij({
            code: "storage_error",
            error: "Unable to access storage",
          });
        let t = (await this.session.getRefreshToken()) ?? void 0,
          r = t ?? "key",
          i = this._cache.get(r);
        if (i)
          return (
            this.logger.debug(
              "[privy:refresh] found in-flight session refresh request, deduping",
            ),
            await i
          );
        let a = this._refreshSession(t, e);
        this._cache.set(r, a);
        try {
          return await a;
        } finally {
          this._cache.delete(r);
        }
      }
      async _refreshSession(e, t) {
        let r = await this.session.getCustomerAccessToken();
        if (!(await this.session.hasRefreshCredentials(r, e ?? null)))
          throw (
            this.logger.debug(
              "[privy:refresh] missing tokens, skipping request",
            ),
            await this._initialize(),
            new iF({
              code: tm.MISSING_OR_INVALID_TOKEN,
              error: "No tokens found in storage",
              status: 401,
            })
          );
        try {
          this.logger.debug(`[privy:refresh] fetching: ${C.Eu.path}`);
          let r = await this.fetch(C.Eu, {
              body: { refresh_token: e },
              onRequest: this.beforeRequestWithoutRefresh.bind(this),
            }),
            i = r.session_update_action;
          return (
            this.logger.debug(`[privy:refresh] response: ${i}`),
            "set" === i &&
              (await this.session.updateWithTokensResponse(r),
              this.logger.debug("[privy:refresh] tokens stored")),
            "clear" === i &&
              (await this.session.destroyLocalState(),
              this.logger.debug("[privy:refresh] tokens cleared"),
              t || this.callbacks?.setUser?.(null)),
            "ignore" === i &&
              (r.token &&
                (await this.session.storeCustomerAccessToken(r.token),
                this.logger.debug("[privy:refresh] token stored (CAT)")),
              r.privy_access_token &&
                (await this.session.storePrivyAccessToken(r.privy_access_token),
                this.logger.debug("[privy:refresh] token stored (PAT)")),
              r.identity_token &&
                (this.logger.debug("[privy:refresh] token stored (IDT)"),
                await this.session.storeIdentityToken(r.identity_token))),
            this.logger.debug("[privy:refresh] returning response"),
            t || this.callbacks?.setUser?.(r.user),
            r
          );
        } catch (e) {
          throw (
            this.logger.debug(
              `[privy:refresh] error: ${e.message ?? "unknown error"}`,
            ),
            e instanceof iF &&
              e.code === tm.MISSING_OR_INVALID_TOKEN &&
              (await this.session.destroyLocalState(),
              t || this.callbacks?.setUser?.(null)),
            e
          );
        }
      }
      async getAccessToken() {
        let [e, t] = await Promise.all([
          this.session.getCustomerAccessToken(),
          this.session.getRefreshToken(),
        ]);
        if (
          e &&
          !this.session.tokenIsActive(e) &&
          (await this.session.hasRefreshCredentials(e, t))
        ) {
          let t = await this.refreshSession(),
            r = await this.session.getCustomerAccessToken();
          return (
            t.token ||
              this.logger.debug(
                "[privy:getAccessToken] expected token received null",
              ),
            t.token === e &&
              this.logger.debug(
                "[privy:getAccessToken] expected new token in response received existing",
              ),
            r === e &&
              this.logger.debug(
                "[privy:getAccessToken] expected new token in storage received existing",
              ),
            t.token ?? r
          );
        }
        return e && !this.session.tokenIsActive(e)
          ? (this.logger.debug(
              "[privy:getAccessToken] unable to refresh inactive token",
            ),
            this.callbacks?.setUser?.(null),
            await this.session.destroyLocalState(),
            null)
          : e;
      }
      async getAccessTokenInternal() {
        let e = await this.getAccessToken();
        return (await this.session.getPrivyAccessToken()) ?? e;
      }
      async getIdentityToken() {
        return await this.session.getIdentityToken();
      }
      async isStorageAccessible() {
        try {
          let e = `privy:__storage__test-${this._crypto.randomUUID()}`,
            t = "blobby";
          await this._storage.put(e, t);
          let r = await this._storage.get(e);
          return (await this._storage.del(e), r === t);
        } catch (e) {
          return (this.logger.error(e), !1);
        }
      }
    },
    aU = class {
      _privyInternal;
      _embedded;
      _isMultiUserModeEnabled;
      constructor(e, t, r) {
        ((this._privyInternal = e),
          (this._embedded = t),
          (this._isMultiUserModeEnabled = r));
      }
      async get() {
        let { user: e } = await this._privyInternal.refreshSession();
        return { user: e };
      }
      async acceptTerms() {
        return { user: await this._privyInternal.fetch(C.Wz, {}) };
      }
      async refreshUser() {
        let { user: e, identity_token: t } = await this._privyInternal.fetch(
          C.PW,
          {},
        );
        return (
          await this._privyInternal.session.storeIdentityToken(t),
          this._privyInternal.callbacks?.setUser?.(e),
          { user: e }
        );
      }
      async switchActiveUser(e) {
        if (!this._isMultiUserModeEnabled)
          throw new ij({
            code: "invalid_input",
            error:
              'User switching requires sessions.mode to be set to "multi-user"',
          });
        await this._privyInternal.session.switchActiveUserId(e.userId);
        try {
          this._embedded.reload();
          let { user: t } = await this._privyInternal.refreshSession(!0);
          if (t.id !== e.userId)
            throw new ij({
              code: "invalid_input",
              error:
                "Cannot switch active user because the refreshed user did not match the requested user ID",
            });
          return (this._privyInternal.callbacks?.setUser?.(t), { user: t });
        } catch (e) {
          throw (
            await this._privyInternal.session.destroyLocalState(),
            this._privyInternal.callbacks?.setUser?.(null),
            e
          );
        }
      }
    };
  let aM = (e) =>
      "wallet" === e.type &&
      "privy" === e.wallet_client_type &&
      "embedded" === e.connector_type,
    aD = (e) =>
      e
        ? e.linked_accounts
            .filter(aM)
            .filter((e) => "ethereum" === e.chain_type)
            .sort((e, t) => e.wallet_index - t.wallet_index)
        : [],
    aL = (e) => aD(e).find((e) => 0 === e.wallet_index) ?? null,
    aF = (e) =>
      e
        ? e.linked_accounts
            .filter(aM)
            .filter((e) => "solana" === e.chain_type)
            .sort((e, t) => e.wallet_index - t.wallet_index)
        : [],
    aj = (e) => aF(e).find((e) => 0 === e.wallet_index) ?? null,
    aW = (e, t) => ({
      ...e,
      is_new_user: t.is_new_user,
      oauth_tokens: t.oauth_tokens,
    }),
    aG = async (e, t, r) => {
      let i,
        a,
        n,
        s,
        o =
          ((i = t.user),
          "off" !== (a = r?.ethereum?.createOnLogin ?? "off") &&
            !(aD(i).length > 0) &&
            (!(
              i.linked_accounts.filter(
                (e) => "wallet" === e.type && "ethereum" === e.chain_type,
              ).length > 0
            ) ||
              "all-users" === a)),
        d =
          ((n = t.user),
          "off" !== (s = r?.solana?.createOnLogin ?? "off") &&
            !(aF(n).length > 0) &&
            (!(
              n.linked_accounts.filter(
                (e) => "wallet" === e.type && "solana" === e.chain_type,
              ).length > 0
            ) ||
              "all-users" === s));
      if (o && d) {
        let r = await e.create({ recoveryMethod: "privy", skipCallbacks: !0 });
        return aW(
          await e.createSolana({ ethereumAccount: aL(r.user) ?? void 0 }),
          t,
        );
      }
      return o
        ? aW(
            await e.create({
              recoveryMethod: "privy",
              solanaAccount: aj(t.user) ?? void 0,
            }),
            t,
          )
        : d
          ? aW(
              await e.createSolana({ ethereumAccount: aL(t.user) ?? void 0 }),
              t,
            )
          : t;
    };
  var aB = class {
      _privyInternal;
      _embedded;
      constructor(e, t) {
        ((this._privyInternal = e), (this._embedded = t));
      }
      async syncWithToken(e, t, r) {
        let i = await this._privyInternal.fetchForLogin(C.hg, {
          body: { token: e, mode: r },
        });
        await this._privyInternal.session.updateWithTokensResponse(i);
        let a = await aG(this._embedded, i, t?.embedded);
        return (this._privyInternal.callbacks?.setUser?.(a.user), a);
      }
      async linkWithToken(e) {
        await this._privyInternal.fetch(C.QR, { body: { token: e } });
        let t = await this._privyInternal.refreshSession();
        return { user: t.user, identity_token: t.identity_token };
      }
    },
    aV = class {
      _privyInternal;
      _embedded;
      constructor(e, t) {
        ((this._privyInternal = e), (this._embedded = t));
      }
      async sendCode(e, t) {
        return this._privyInternal.fetch(C.vq, {
          body: { email: e, token: t },
        });
      }
      async loginWithCode(e, t, r, i) {
        let a = await this._privyInternal.fetchForLogin(C.Kk, {
          body: { email: e, code: t, mode: r },
        });
        await this._privyInternal.session.updateWithTokensResponse(a);
        let n = await aG(this._embedded, a, i?.embedded);
        return (this._privyInternal.callbacks?.setUser?.(n.user), n);
      }
      async linkWithCode(e, t) {
        await this._privyInternal.fetch(C.wP, { body: { email: e, code: t } });
        let r = await this._privyInternal.refreshSession();
        return { user: r.user, identity_token: r.identity_token };
      }
      async updateEmail({ oldEmailAddress: e, newEmailAddress: t, code: r }) {
        await this._privyInternal.fetch(C.qE, {
          body: { oldAddress: e, newAddress: t, code: r },
        });
        let i = await this._privyInternal.refreshSession();
        return { user: i.user, identity_token: i.identity_token };
      }
      async unlink(e) {
        await this._privyInternal.fetch(C.IJ, { body: { address: e } });
        let t = await this._privyInternal.refreshSession();
        return { user: t.user, identity_token: t.identity_token };
      }
    },
    aq = class {
      _privyInternal;
      _embedded;
      constructor(e, t) {
        ((this._privyInternal = e), (this._embedded = t));
      }
      async initializeAuth({ relyingParty: e, redirectUrl: t, token: r }) {
        return await this._privyInternal.fetch(C.fj, {
          body: { relying_party: e, redirect_url: t, token: r },
        });
      }
      async getFarcasterStatus({ channel_token: e }) {
        return await this._privyInternal.fetch(C.de, {
          headers: { "farcaster-channel-token": e },
        });
      }
      async authenticate(
        { channel_token: e, message: t, signature: r, fid: i, mode: a },
        n,
      ) {
        let s = await this._privyInternal.fetchForLogin(C.QD, {
          body: { channel_token: e, message: t, signature: r, fid: i, mode: a },
        });
        await this._privyInternal.session.updateWithTokensResponse(s);
        let o = await aG(this._embedded, s, n?.embedded);
        return (this._privyInternal.callbacks?.setUser?.(o.user), o);
      }
      async link({ channel_token: e, message: t, signature: r, fid: i }) {
        await this._privyInternal.fetch(C.XK, {
          body: { channel_token: e, message: t, signature: r, fid: i },
        });
        let a = await this._privyInternal.refreshSession();
        return { user: a.user, identity_token: a.identity_token };
      }
      async unlink({ fid: e }) {
        await this._privyInternal.fetch(C.Cb, { body: { fid: e } });
        let t = await this._privyInternal.refreshSession();
        return { user: t.user, identity_token: t.identity_token };
      }
    },
    aZ = class {
      _privyInternal;
      _embedded;
      constructor(e, t) {
        ((this._privyInternal = e), (this._embedded = t));
      }
      async initializeAuth() {
        return await this._privyInternal.fetch(C.wE, { body: {} });
      }
      async authenticate({ message: e, signature: t, fid: r }, i) {
        let a = await this._privyInternal.fetchForLogin(C._c, {
          body: { message: e, signature: t, fid: r },
        });
        await this._privyInternal.session.updateWithTokensResponse(a);
        let n = await aG(this._embedded, a, i?.embedded);
        return (this._privyInternal.callbacks?.setUser?.(n.user), n);
      }
    },
    aK = class {
      _privyInternal;
      _embedded;
      constructor(e, t) {
        ((this._privyInternal = e), (this._embedded = t));
      }
      async create(e) {
        let t = await this._privyInternal.session.getOrCreateGuestCredential(),
          r = await this._privyInternal.fetch(C.nX, {
            body: { guest_credential: t },
          });
        await this._privyInternal.session.updateWithTokensResponse(r);
        let i = await aG(this._embedded, r, e?.embedded);
        return (this._privyInternal.callbacks?.setUser?.(i.user), i);
      }
    };
  let aJ = "privy:state_code",
    aH = "privy:code_verifier";
  async function az(e, t) {
    return new Uint8Array(await t("SHA-256", new TextEncoder().encode(e)));
  }
  function aY() {
    return A.f.encode(crypto.getRandomValues(new Uint8Array(36)));
  }
  async function aX({ codeVerifier: e, method: t = "S256", digest: r }) {
    if ("S256" != t) return e;
    {
      let t = await az(e, r);
      return A.f.encode(t);
    }
  }
  var aQ = class {
      _privyInternal;
      _storage;
      _crypto;
      _embedded;
      constructor(e, t, r, i) {
        ((this._privyInternal = e),
          (this._embedded = t),
          (this._storage = r),
          (this._crypto = i));
      }
      async generateURL(e, t) {
        let r = aY(),
          i = aY(),
          a = await aX({ codeVerifier: r, digest: this._crypto.digest });
        return (
          await Promise.all([
            this._storage.put(aH, r),
            this._storage.put(aJ, i),
          ]),
          this._privyInternal.fetchForLogin(C.CL, {
            body: {
              redirect_to: t,
              provider: e,
              code_challenge: a,
              state_code: i,
            },
          })
        );
      }
      async loginWithCode(e, t, r, i, a, n) {
        let [s, o] = await Promise.all([
          this._storage.get(aH),
          this._storage.get(aJ),
        ]);
        if (o !== t)
          throw (
            this._privyInternal.createAnalyticsEvent(
              "possible_phishing_attempt",
              {
                flow: "oauth",
                provider: r,
                storedStateCode: o ?? "",
                returnedStateCode: t ?? "",
              },
            ),
            new ij({
              code: "pkce_state_code_mismatch",
              error: "Unexpected auth flow. This may be a phishing attempt.",
            })
          );
        let d = await this._privyInternal.fetchForLogin(C.$t, {
          body: {
            authorization_code: e,
            code_type: i,
            state_code: o,
            code_verifier: s,
            mode: a,
          },
        });
        await this._privyInternal.session.updateWithTokensResponse(d);
        let l = await aG(this._embedded, d, n?.embedded);
        return (
          await Promise.all([this._storage.del(aH), this._storage.del(aJ)]),
          this._privyInternal.callbacks?.setUser?.(l.user),
          l
        );
      }
      async linkWithCode(e, t, r, i) {
        let [a, n] = await Promise.all([
          this._storage.get(aH),
          this._storage.get(aJ),
        ]);
        if (n !== t)
          throw (
            this._privyInternal.createAnalyticsEvent(
              "possible_phishing_attempt",
              {
                flow: "oauth",
                provider: r,
                storedStateCode: n ?? "",
                returnedStateCode: t ?? "",
              },
            ),
            new ij({
              code: "pkce_state_code_mismatch",
              error: "Unexpected auth flow. This may be a phishing attempt.",
            })
          );
        let s = await this._privyInternal.fetch(C.sj, {
          body: {
            authorization_code: e,
            code_type: i,
            state_code: n,
            code_verifier: a,
          },
        });
        await this._privyInternal.session.processOAuthTokens(s.oauth_tokens);
        let o = await this._privyInternal.refreshSession();
        return (
          await Promise.all([this._storage.del(aH), this._storage.del(aJ)]),
          { user: o.user, identity_token: o.identity_token }
        );
      }
      async unlink(e, t) {
        await this._privyInternal.fetch(C.E$, {
          body: { provider: e, subject: t },
        });
        let r = await this._privyInternal.refreshSession();
        return { user: r.user, identity_token: r.identity_token };
      }
    },
    a0 = class {
      _privyInternal;
      _embedded;
      constructor(e, t) {
        ((this._privyInternal = e), (this._embedded = t));
      }
      async generateRegistrationOptions(e) {
        return await this._privyInternal.fetch(C.ID, {
          body: { relying_party: e },
        });
      }
      async generateAuthenticationOptions(e) {
        return await this._privyInternal.fetch(C.np, {
          body: { relying_party: e },
        });
      }
      async generateSignupOptions(e) {
        return await this._privyInternal.fetch(C.VA, {
          body: { relying_party: e },
        });
      }
      async loginWithPasskey(e, t, r, i) {
        let a = await this._privyInternal.fetchForLogin(C.hB, {
          body: {
            relying_party: r,
            challenge: t,
            authenticator_response:
              this._transformAuthenticationResponseToSnakeCase(e),
          },
        });
        await this._privyInternal.session.updateWithTokensResponse(a);
        let n = await aG(this._embedded, a, i?.embedded);
        return (this._privyInternal.callbacks?.setUser?.(n.user), n);
      }
      async signupWithPasskey(e, t, r) {
        let i = await this._privyInternal.fetchForLogin(C.EZ, {
          body: {
            relying_party: t,
            authenticator_response:
              this._transformRegistrationResponseToSnakeCase(e),
          },
        });
        await this._privyInternal.session.updateWithTokensResponse(i);
        let a = await aG(this._embedded, i, r?.embedded);
        return (this._privyInternal.callbacks?.setUser?.(a.user), a);
      }
      async linkWithPasskey(e, t) {
        await this._privyInternal.fetch(C.iv, {
          body: {
            relying_party: t,
            authenticator_response:
              this._transformRegistrationResponseToSnakeCase(e),
          },
        });
        let r = await this._privyInternal.refreshSession();
        return { user: r.user, identity_token: r.identity_token };
      }
      _transformRegistrationResponseToSnakeCase(e) {
        return {
          type: e.type,
          id: e.id,
          raw_id: e.rawId,
          response: {
            client_data_json: e.response.clientDataJSON,
            attestation_object: e.response.attestationObject,
            authenticator_data: e.response.authenticatorData || void 0,
            transports: e.response.transports || void 0,
            public_key: e.response.publicKey || void 0,
            public_key_algorithm: e.response.publicKeyAlgorithm || void 0,
          },
          authenticator_attachment: e.authenticatorAttachment || void 0,
          client_extension_results: {
            app_id: e.clientExtensionResults.appid || void 0,
            cred_props: e.clientExtensionResults.credProps || void 0,
            hmac_create_secret:
              e.clientExtensionResults.hmacCreateSecret || void 0,
          },
        };
      }
      _transformAuthenticationResponseToSnakeCase(e) {
        return {
          type: e.type,
          id: e.id,
          raw_id: e.rawId,
          response: {
            signature: e.response.signature,
            client_data_json: e.response.clientDataJSON,
            authenticator_data: e.response.authenticatorData,
            user_handle: e.response.userHandle || void 0,
          },
          authenticator_attachment: e.authenticatorAttachment || void 0,
          client_extension_results: {
            app_id: e.clientExtensionResults.appid || void 0,
            cred_props: e.clientExtensionResults.credProps || void 0,
            hmac_create_secret:
              e.clientExtensionResults.hmacCreateSecret || void 0,
          },
        };
      }
    },
    a1 = class {
      _privyInternal;
      _embedded;
      constructor(e, t) {
        ((this._privyInternal = e), (this._embedded = t));
      }
      async sendCode(e, t) {
        return this._privyInternal.fetch(C.Rt, {
          body: { phoneNumber: e, token: t },
        });
      }
      async loginWithCode(e, t, r, i) {
        let a = await this._privyInternal.fetchForLogin(C.qa, {
          body: { phoneNumber: e, code: t, mode: r },
        });
        await this._privyInternal.session.updateWithTokensResponse(a);
        let n = await aG(this._embedded, a, i?.embedded);
        return (this._privyInternal.callbacks?.setUser?.(n.user), n);
      }
      async linkWithCode(e, t) {
        await this._privyInternal.fetch(C.xc, {
          body: { phoneNumber: e, code: t },
        });
        let r = await this._privyInternal.refreshSession();
        return { user: r.user, identity_token: r.identity_token };
      }
      async updatePhone({ oldPhoneNumber: e, newPhoneNumber: t, code: r }) {
        await this._privyInternal.fetch(C.Ho, {
          body: { old_phone_number: e, new_phone_number: t, code: r },
        });
        let i = await this._privyInternal.refreshSession();
        return { user: i.user, identity_token: i.identity_token };
      }
      async unlink(e) {
        await this._privyInternal.fetch(C.J3, { body: { phoneNumber: e } });
        let t = await this._privyInternal.refreshSession();
        return { user: t.user, identity_token: t.identity_token };
      }
    },
    a2 = class {
      _privyInternal;
      _embedded;
      _wallet = void 0;
      _preparedMessage;
      constructor(e, t) {
        ((this._privyInternal = e), (this._embedded = t));
      }
      async unlinkWallet(e) {
        await this._privyInternal.fetch(C.xr, { body: { address: e } });
        let t = await this._privyInternal.refreshSession();
        return { user: t.user, identity_token: t.identity_token };
      }
      async linkWithSiwe(e, t, r) {
        let i = t || this._wallet,
          a = r || this._preparedMessage;
        if (!i)
          throw Error(
            "A wallet must be provided in the init step or as an argument to linkWithSiwe",
          );
        if (!a)
          throw Error(
            "A message must be generated and signed before being used to link a wallet to privy",
          );
        await this._privyInternal.fetch(C.wM, {
          body: {
            message: a,
            signature: e,
            chainId: i.chainId,
            walletClientType: i.walletClientType ?? null,
            connectorType: i.connectorType ?? null,
          },
        });
        let n = await this._privyInternal.refreshSession();
        return { user: n.user, identity_token: n.identity_token };
      }
      async loginWithSiwe(e, t, r, i, a) {
        let n = t || this._wallet,
          s = r || this._preparedMessage;
        if (!n)
          throw Error(
            "A wallet must be provided in the init step or as an argument to loginWithSiwe",
          );
        if (!s)
          throw Error(
            "A message must be generated and signed before being used to login to privy with a wallet",
          );
        let o = await this._privyInternal.fetchForLogin(C.HN, {
          body: {
            signature: e,
            message: s,
            chainId: n.chainId,
            walletClientType: n.walletClientType ?? null,
            connectorType: n.connectorType ?? null,
            mode: i,
          },
        });
        await this._privyInternal.session.updateWithTokensResponse(o);
        let d = await aG(this._embedded, o, a?.embedded);
        return (this._privyInternal.callbacks?.setUser?.(d.user), d);
      }
      async init(e, t, r) {
        var i;
        this._wallet = e;
        let { nonce: a } = await this._privyInternal.fetch(C._b, {
            body: { address: e.address },
          }),
          n =
            ((i = {
              chainId: e.chainId.toString().replace("eip155:", ""),
              address: e.address,
              issuedAt: new Date().toISOString(),
              statement:
                "By signing, you are proving you own this wallet and logging in. This does not initiate a transaction or cost any fees.",
              domain: t,
              nonce: a,
              uri: r,
            }),
            `${i.domain} wants you to sign in with your Ethereum account:
${i.address}

${i.statement}

URI: ${i.uri}
Version: 1
Chain ID: ${i.chainId}
Nonce: ${i.nonce}
Issued At: ${i.issuedAt}
Resources:
- https://privy.io`);
        return ((this._preparedMessage = n), { nonce: a, message: n });
      }
    },
    a3 = class {
      _privyInternal;
      _embedded;
      constructor(e, t) {
        ((this._privyInternal = e), (this._embedded = t));
      }
      async unlink({ address: e }) {
        await this._privyInternal.fetch(C.b0, { body: { address: e } });
        let t = await this._privyInternal.refreshSession();
        return { user: t.user, identity_token: t.identity_token };
      }
      async link({
        message: e,
        signature: t,
        walletClientType: r,
        connectorType: i,
      }) {
        await this._privyInternal.fetch(C.eh, {
          body: {
            message: e,
            signature: t,
            walletClientType: r ?? null,
            connectorType: i ?? null,
          },
        });
        let a = await this._privyInternal.refreshSession();
        return { user: a.user, identity_token: a.identity_token };
      }
      async login({
        mode: e,
        message: t,
        signature: r,
        walletClientType: i,
        connectorType: a,
        opts: n,
      }) {
        let s = await this._privyInternal.fetchForLogin(C.io, {
          body: {
            signature: r,
            message: t,
            walletClientType: i ?? null,
            connectorType: a ?? null,
            mode: e,
          },
        });
        await this._privyInternal.session.updateWithTokensResponse(s);
        let o = await aG(this._embedded, s, n?.embedded);
        return (this._privyInternal.callbacks?.setUser?.(o.user), o);
      }
      async fetchNonce({ address: e }) {
        let { nonce: t } = await this._privyInternal.fetch(C.G9, {
          body: { address: e },
        });
        return { nonce: t };
      }
    },
    a4 = class {
      _privyInternal;
      constructor(e) {
        this._privyInternal = e;
      }
      async link(e, t, r, i) {
        await this._privyInternal.fetch(C.Tz, {
          body: {
            message: e,
            signature: t,
            smart_wallet_type: r,
            smart_wallet_version: i,
          },
        });
        let a = await this._privyInternal.refreshSession();
        return { user: a.user, identity_token: a.identity_token };
      }
      async init(e) {
        var t;
        let { nonce: r } = await this._privyInternal.fetch(C._b, {
          body: { address: e.address },
        });
        return {
          nonce: r,
          message:
            ((t = {
              chainId: e.chainId.toString().replace("eip155:", ""),
              address: e.address,
              issuedAt: new Date().toISOString(),
              statement:
                "By signing, you are proving you own this wallet and logging in. This does not initiate a transaction or cost any fees.",
              domain: "privy.io",
              uri: "https://auth.privy.io",
              nonce: r,
            }),
            `${t.domain} wants you to sign in with your Ethereum account:
${t.address}

${t.statement}

URI: ${t.uri}
Version: 1
Chain ID: ${t.chainId}
Nonce: ${t.nonce}
Issued At: ${t.issuedAt}
Resources:
- https://privy.io`),
        };
      }
    },
    a9 = class {
      _privyInternal;
      _embedded;
      constructor(e, t) {
        ((this._privyInternal = e), (this._embedded = t));
      }
      async authenticate(
        {
          telegramWebAppData: e,
          telegramAuthResult: t,
          captchaToken: r,
          mode: i = "login-or-sign-up",
        },
        a,
      ) {
        let n = await this._privyInternal.fetchForLogin(C.YL, {
          body: {
            telegram_web_app_data: e,
            telegram_auth_result: t,
            captcha_token: r,
            mode: i,
          },
        });
        await this._privyInternal.session.updateWithTokensResponse(n);
        let s = await aG(this._embedded, n, a?.embedded);
        return (this._privyInternal.callbacks?.setUser?.(s.user), s);
      }
      async link({
        telegramWebAppData: e,
        telegramAuthResult: t,
        captchaToken: r,
      }) {
        await this._privyInternal.fetch(C.HJ, {
          body: {
            telegram_web_app_data: e,
            telegram_auth_result: t,
            captcha_token: r,
          },
        });
        let i = await this._privyInternal.refreshSession();
        return { user: i.user, identity_token: i.identity_token };
      }
      async unlink({ telegramUserId: e }) {
        await this._privyInternal.fetch(C.Dp, {
          body: { telegram_user_id: e },
        });
        let t = await this._privyInternal.refreshSession();
        return { user: t.user, identity_token: t.identity_token };
      }
    },
    a5 = class {
      _privyInternal;
      _mfa;
      customProvider;
      phone;
      email;
      oauth;
      siwe;
      siws;
      smartWallet;
      passkey;
      farcaster;
      farcasterV2;
      guest;
      telegram;
      constructor(e, t, r, i, a) {
        ((this._privyInternal = e),
          (this._mfa = a),
          (this.customProvider = new aB(this._privyInternal, t)),
          (this.phone = new a1(this._privyInternal, t)),
          (this.email = new aV(this._privyInternal, t)),
          (this.oauth = new aQ(this._privyInternal, t, r, i)),
          (this.guest = new aK(this._privyInternal, t)),
          (this.siwe = new a2(this._privyInternal, t)),
          (this.siws = new a3(this._privyInternal, t)),
          (this.smartWallet = new a4(this._privyInternal)),
          (this.passkey = new a0(this._privyInternal, t)),
          (this.farcaster = new aq(this._privyInternal, t)),
          (this.farcasterV2 = new aZ(this._privyInternal, t)),
          (this.telegram = new a9(this._privyInternal, t)));
      }
      async logout(e) {
        let t = await this._prepareSessionRevocation();
        (await Promise.all([
          this._privyInternal.session.destroyLocalState({ reason: "logout" }),
          this._privyInternal.destroyClientAnalyticsId(),
          e?.userId && this._mfa.clearMfa({ userId: e.userId }),
        ]),
          this._privyInternal.callbacks?.setUser?.(null),
          t &&
            this._privyInternal
              .fetch(C.Dw, {
                body: { refresh_token: t.refresh_token },
                onRequest: () => t.init,
              })
              .catch(() => {
                console.warn("Error destroying session");
              }));
      }
      async _prepareSessionRevocation() {
        try {
          let e = await this._privyInternal.beforeRequestWithoutRefresh(
            new Request(this._privyInternal.baseUrl),
          );
          return {
            refresh_token:
              (await this._privyInternal.session.getRefreshToken()) ?? void 0,
            init: e,
          };
        } catch {
          console.warn("Error preparing session revocation");
          return;
        }
      }
    },
    a8 = class {
      _privyInternal;
      constructor(e) {
        this._privyInternal = e;
      }
      async initOnRampSession(e) {
        return await this._privyInternal.fetch(C.S$, { body: e });
      }
      async getStatus(e) {
        return await this._privyInternal.fetch(C.Lk, {
          query: { partnerUserId: e },
        });
      }
    };
  let a6 = {
      prod: {
        url: "https://api.moonpay.com/v1",
        key: "pk_live_hirbpu0cVcLHrjktC9l7fbc9ctjv0SL",
      },
      sandbox: {
        url: "https://api.moonpay.com/v1",
        key: "pk_test_fqWjXZMSFwloh7orvJsRfjiUHXJqFzI",
      },
    },
    a7 = new Set([x.q.id, x.g.id, x.j.id, x.y.id, x.M.id, x.$.id, x.k.id]),
    ne = new Set([x.q.id, x.g.id, x.S.id, x.j.id, x.y.id, x.M.id]);
  var nt = class {
      _privyInternal;
      constructor(e) {
        this._privyInternal = e;
      }
      async sign(e) {
        return await this._privyInternal.fetch(C.eG, { body: e });
      }
      async getTransactionStatus({ transactionId: e, useSandbox: t }) {
        let { url: r, key: i } = a6[t ? "sandbox" : "prod"],
          a = await (0, tI.default)(fetch, { retries: 3, retryDelay: 500 })(
            `${r}/transactions/ext/${e}?apiKey=${i}`,
          );
        if (!a.ok)
          throw new iW({
            error: `Failed to fetch transaction status for Transaction ${e}`,
            code: "failed_to_fetch_moonpay_transaction_status",
            response: a,
          });
        let n = await a.json();
        return Array.isArray(n) ? n.at(0) : void 0;
      }
    },
    nr = class {
      moonpay;
      coinbase;
      constructor(e) {
        ((this.moonpay = new nt(e)), (this.coinbase = new a8(e)));
      }
    },
    ni = class {
      _privyInternal;
      constructor(e) {
        this._privyInternal = e;
      }
      async generateAuthenticationOptions(e) {
        return await this._privyInternal.fetch(C.k, { body: e });
      }
    },
    na = class {
      _privyInternal;
      constructor(e) {
        this._privyInternal = e;
      }
      async sendCode(e) {
        return await this._privyInternal.fetch(C.d8, { body: e });
      }
    },
    nn = class {
      privyInternal;
      proxy;
      sms;
      passkey;
      constructor(e, t) {
        ((this.proxy = t),
          (this.privyInternal = e),
          (this.sms = new na(e)),
          (this.passkey = new ni(e)));
      }
      setProxy(e) {
        this.proxy = e;
      }
      async getAccessTokenInternal() {
        let e = await this.privyInternal.getAccessTokenInternal();
        if (!e)
          throw new ij({
            error: "Missing access token",
            code: "attempted_rpc_call_before_logged_in",
          });
        return e;
      }
      async verifyMfa() {
        if (!this.proxy)
          throw new ij({
            error: "Embedded wallet proxy not initialized",
            code: "embedded_wallet_webview_not_loaded",
          });
        return await this.proxy.verifyMfa({
          accessToken: await this.getAccessTokenInternal(),
        });
      }
      async initEnrollMfa(e) {
        if (!this.proxy)
          throw new ij({
            error: "Embedded wallet proxy not initialized",
            code: "embedded_wallet_webview_not_loaded",
          });
        return await this.proxy.initEnrollMfa({
          ...e,
          accessToken: await this.getAccessTokenInternal(),
        });
      }
      async submitEnrollMfa(e) {
        if (!this.proxy)
          throw new ij({
            error: "Embedded wallet proxy not initialized",
            code: "embedded_wallet_webview_not_loaded",
          });
        let t = await this.proxy.submitEnrollMfa({
            ...e,
            accessToken: await this.getAccessTokenInternal(),
          }),
          r = await this.privyInternal.refreshSession();
        if (0 === r.user.mfa_methods.length)
          try {
            await this.proxy.clearMfa({ userId: r.user.id });
          } catch {}
        return t;
      }
      async unenrollMfa(e) {
        if (!this.proxy)
          throw new ij({
            error: "Embedded wallet proxy not initialized",
            code: "embedded_wallet_webview_not_loaded",
          });
        let t = await this.proxy.unenrollMfa({
            method: e,
            accessToken: await this.getAccessTokenInternal(),
          }),
          r = await this.privyInternal.refreshSession();
        if (0 === r.user.mfa_methods.length)
          try {
            await this.proxy.clearMfa({ userId: r.user.id });
          } catch {}
        return t;
      }
      async unlinkPasskey({ credentialId: e, removeAsMfa: t }) {
        if (!this.proxy)
          throw new ij({
            error: "Embedded wallet proxy not initialized",
            code: "embedded_wallet_webview_not_loaded",
          });
        await this.proxy.unlinkPasskey({
          credentialId: e,
          removeAsMfa: t,
          accessToken: await this.getAccessTokenInternal(),
        });
        let r = await this.privyInternal.refreshSession();
        if (0 === r.user.mfa_methods.length)
          try {
            await this.proxy.clearMfa({ userId: r.user.id });
          } catch {}
      }
      async clearMfa(e) {
        if (!this.proxy)
          throw new ij({
            error: "Embedded wallet proxy not initialized",
            code: "embedded_wallet_webview_not_loaded",
          });
        return await this.proxy.clearMfa(e);
      }
    },
    ns = class {
      _privyInternal;
      constructor(e) {
        this._privyInternal = e;
      }
      async init(e) {
        return this._privyInternal.fetch(C.l_, { body: { client_type: e } });
      }
      async getICloudConfiguration(e) {
        return this._privyInternal.fetch(C.Ms, { body: { client_type: e } });
      }
    },
    no = class {
      _privyInternal;
      _storage;
      _crypto;
      constructor(e, t, r) {
        ((this._privyInternal = e), (this._storage = t), (this._crypto = r));
      }
      async generateURL(e) {
        let t = aY(),
          r = aY(),
          i = await aX({ codeVerifier: t, digest: this._crypto.digest });
        return (
          await Promise.all([
            this._storage.put(aH, t),
            this._storage.put(aJ, r),
          ]),
          this._privyInternal.fetch(C.Ck, {
            body: { redirect_to: e, code_challenge: i, state_code: r },
          })
        );
      }
      async authorize(e, t) {
        let [r, i] = await Promise.all([
          this._storage.get(aH),
          this._storage.get(aJ),
        ]);
        if (i !== t)
          throw (
            this._privyInternal.createAnalyticsEvent(
              "possible_phishing_attempt",
              {
                flow: "recovery_oauth",
                storedStateCode: i ?? "",
                returnedStateCode: t ?? "",
              },
            ),
            new ij({
              code: "pkce_state_code_mismatch",
              error: "Unexpected auth flow. This may be a phishing attempt.",
            })
          );
        let a = await this._privyInternal.fetch(C.tk, {
          body: { authorization_code: e, state_code: i, code_verifier: r },
        });
        return (
          await Promise.all([this._storage.del(aH), this._storage.del(aJ)]),
          a
        );
      }
    },
    nd = class {
      _privyInternal;
      auth;
      icloudAuth;
      constructor(e, t, r) {
        ((this._privyInternal = e),
          (this.auth = new no(this._privyInternal, t, r)),
          (this.icloudAuth = new ns(this._privyInternal)));
      }
      async getRecoveryKeyMaterial(e, t) {
        return this._privyInternal.fetch(C.Wc, {
          body: { chain_type: t },
          params: { address: e },
        });
      }
    },
    nl = class {
      plugins;
      auth;
      user;
      embeddedWallet;
      recovery;
      mfa;
      app;
      mfaPromises;
      funding;
      delegated;
      crossApp;
      isMultiUserModeEnabled;
      _privyInternal;
      constructor({ clientId: e, sessions: t, plugins: r = [], ...i }) {
        var a;
        let n =
          ((a = i.crypto),
          {
            digest:
              a?.digest ?? ((e, t) => globalThis.crypto.subtle.digest(e, t)),
            randomUUID: a?.randomUUID ?? (() => globalThis.crypto.randomUUID()),
          });
        ((this.isMultiUserModeEnabled = t?.mode === "multi-user"),
          (this.plugins = [...r]),
          (this._privyInternal = new aR({
            ...i,
            appClientId: e,
            crypto: n,
            isMultiUserModeEnabled: this.isMultiUserModeEnabled,
            cookieWriteBehavior: t?.cookieWriteBehavior,
          })),
          (this.mfa = new nn(this._privyInternal)),
          (this.mfaPromises = new au()),
          (this.app = new iU(this._privyInternal)),
          (this.embeddedWallet = new ac(
            this._privyInternal,
            i.embeddedWalletMessagePoster,
            i.supportedChains,
            this.mfa,
            this.mfaPromises,
            this.app,
            (function (e = []) {
              return e.find((e) => e.id === iR);
            })(this.plugins),
          )),
          (this.user = new aU(
            this._privyInternal,
            this.embeddedWallet,
            t?.mode === "multi-user",
          )),
          (this.auth = new a5(
            this._privyInternal,
            this.embeddedWallet,
            i.storage,
            n,
            this.mfa,
          )),
          (this.recovery = new nd(this._privyInternal, i.storage, n)),
          (this.funding = new nr(this._privyInternal)),
          (this.delegated = new iL(this._privyInternal)),
          (this.crossApp = new iD(this._privyInternal, i.storage)));
      }
      async initialize() {
        await this._privyInternal._initialize();
      }
      setMessagePoster(e) {
        this.embeddedWallet.setMessagePoster(e);
      }
      addOAuthTokensListener(e) {
        return (
          this._privyInternal.session.on("oauth_tokens_granted", e),
          {
            unsubscribe: () => {
              this._privyInternal.session.removeListener(
                "oauth_tokens_granted",
                e,
              );
            },
          }
        );
      }
      setCallbacks(e) {
        this._privyInternal.setCallbacks(e);
      }
      getAccessToken() {
        return this._privyInternal.getAccessToken();
      }
      getIdentityToken() {
        return this._privyInternal.getIdentityToken();
      }
      track({ name: e, properties: t }) {
        this._privyInternal.createAnalyticsEvent(e, t);
      }
      getCompiledPath(e, t) {
        return this._privyInternal.getPath(e, t);
      }
      async fetchPrivyRoute(e, t) {
        return this._privyInternal.fetch(e, t);
      }
      async fetchPrivyRouteRaw(e, t) {
        return this._privyInternal.fetchRaw(e, t);
      }
      get logger() {
        return this._privyInternal.logger;
      }
    };
  let nc = (function () {
      return rY(rX, arguments);
    })().map((e) => ({ code: e, callCode: rQ(e) })),
    nu = {
      [x.q.id]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      [x.P.id]: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      [x.S.id]: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
      [x.O.id]: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
      [x.y.id]: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
      [x.z.id]: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
      [x.j.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      [x.N.id]: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      [x.M.id]: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      [x.w.id]: "0x5425890298aed601595a70ab815c96711a31bc65",
      [x.g.id]: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      [x.D.id]: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    };
  async function nh(e, t) {
    let r = `${e}-auto-${"ethereum" === t ? "eth" : "sol"}`,
      i = new TextEncoder().encode(r);
    return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", i)))
      .map((e) => e.toString(16).padStart(2, "0"))
      .join("");
  }
  let np = new Set([x.q.id, x.j.id, x.S.id, x.y.id, x.g.id, x.M.id, x.k.id]),
    nf = new Set([x.q.id, x.j.id, x.y.id, x.S.id, x.g.id, x.M.id, x.k.id]),
    ny = { buy: "CARD", send: "CRYPTO_ACCOUNT" },
    nm = {
      USDC: "2b92315d-eab7-5bef-84fa-089a131333f5",
      ETH: "d85dce9b-5b73-5c3c-8978-522ce1d1c1b4",
      BTC: "5b71fc48-3dd3-540c-809b-f8c94d0e68b5",
      SOL: "4f039497-3af8-5bb3-951c-6df9afa9be1c",
      POL: "026bcc1e-9163-591c-a709-34dd18b2e7a1",
      MON: "92aa538f-b005-45cc-a237-71d6466f54d9",
    };
  (x.q.id,
    x.j.id,
    x.S.id,
    x.y.id,
    x.g.id,
    x.M.id,
    x.k.id,
    [
      ..."metamask.trust.safe.rainbow.uniswap.zerion.argent.spot.omni.cryptocom.blockchain.safepal.bitget_wallet.zengo.1inch.binance.exodus.mew_wallet.alphawallet.keyring_pro.mathwallet.unstoppable.obvious.ambire.internet_money_wallet.coin98.abc_wallet.arculus_wallet.haha.cling_wallet.broearn.copiosa.burrito_wallet.enjin_wallet.plasma_wallet.avacus.bee.pitaka.pltwallet.minerva.kryptogo.prema.slingshot.kriptonio.timeless.secux.bitizen.blocto.safemoon".split(
        ".",
      ),
    ]);
  let n_ = (e) => [...aD(e), ...aF(e)],
    ng =
      (e) =>
      async ({ address: t, chainType: r }) => {
        let { user: i } = await e.user.get();
        if (!i)
          throw new ij({
            code: "delegated_actions_before_logged_in",
            error: "Must be logged in to delegate wallets",
          });
        if ("solana" !== r && "ethereum" !== r)
          throw new ij({
            code: "unsupported_chain_type",
            error:
              "Only Solana and Ethereum embedded wallets are supported for delegation and revocation.",
          });
        let a = n_(i).find((e) => e.chain_type === r && e.address === t);
        if (!a)
          throw new ij({
            code: "delegated_actions_wallet_not_found",
            error: "Address to delegate is not associated with current user.",
          });
        if (iG(a))
          throw new ij({
            code: "unsupported_wallet_type",
            error:
              "useDelegatedActions is only supported for on-device execution and this app uses TEE execution. Use the useSessionSigners hook to provision server side access on behalf of your users. Learn more https://docs.privy.io/recipes/tee-wallet-migration-guide",
          });
        if (a.delegated) return { user: i };
        let n = a.imported ? a : (aL(i) ?? aj(i));
        if (!n)
          throw new ij({
            code: "delegated_actions_wallet_not_found",
            error: "Address to delegate is not associated with current user.",
          });
        await e.embeddedWallet.delegateWallets({
          rootWallet: {
            address: n.address,
            chainType: n.chain_type,
            imported: n.imported,
          },
          delegatedWallets: [
            {
              address: a.address,
              chainType: a.chain_type,
              walletIndex: a.wallet_index,
            },
          ],
        });
        let { user: s } = await e.user.get();
        return { user: s };
      },
    nv = (e) => async () => {
      let { user: t } = await e.user.get();
      if (!t)
        throw new ij({
          code: "delegated_actions_before_logged_in",
          error: "Must be logged in to revoke delegated wallets",
        });
      let r = n_(t);
      if (r.some(iG))
        throw new ij({
          code: "unsupported_wallet_type",
          error:
            "revokeWallets is only supported for on-device execution and this app uses TEE execution. Use the useSessionSigners hook to manage server side access on behalf of your users. Learn more https://docs.privy.io/recipes/tee-wallet-migration-guide",
        });
      if (r.every((e) => !e.delegated))
        throw new ij({
          code: "delegated_actions_no_wallet_to_revoke",
          error: "User has no delegated wallets to revoke.",
        });
      await e.delegated.revoke();
      let { user: i } = await e.user.get();
      return { user: i };
    };
  iN({ delegateWallet: () => ng, revokeWallets: () => nv });
  let n$ =
      ({ client: e, openAuthSession: t }) =>
      async ({ providerAppId: r, redirectUrl: i }) => {
        let a = `privy:${r}`,
          { url: n } = await e.auth.oauth.generateURL(a, i),
          s = await t(n, i),
          o = s.privy_oauth_state,
          d = s.privy_oauth_code;
        if (!o || !d)
          throw new ij({
            code: "login_with_oauth_returned_with_invalid_credentials",
            error: "Auth session oauth returned invalid credentials",
          });
        let l = await e.auth.oauth.loginWithCode(d, o, a),
          c = l.oauth_tokens;
        return (
          c && (await e.crossApp.updateOnCrossAppAuthentication(r, c)),
          l
        );
      },
    nb =
      ({ client: e, openAuthSession: t }) =>
      async ({ providerAppId: r, redirectUrl: i }) => {
        let a = `privy:${r}`,
          { url: n } = await e.auth.oauth.generateURL(a, i),
          s = await t(n, i),
          o = s.privy_oauth_state,
          d = s.privy_oauth_code;
        if (!o || !d)
          throw new ij({
            code: "login_with_oauth_returned_with_invalid_credentials",
            error: "Auth session oauth returned invalid credentials",
          });
        let l = e.addOAuthTokensListener((t) => {
            e.crossApp.updateOnCrossAppAuthentication(r, t);
          }),
          { user: c } = await e.auth.oauth.linkWithCode(d, o, a);
        return (l.unsubscribe(), c);
      };
  function nw(e, t) {
    return e.linked_accounts
      .filter((e) => "cross_app" === e.type)
      .flatMap((e) => e.smart_wallets)
      .some((e) => e.address === t);
  }
  let nI = ({ client: e, openAuthSession: t }) => {
    let r = (({ client: e, openAuthSession: t }) => {
      let r = nb({ client: e, openAuthSession: t });
      return async ({ providerAppId: t, redirectUrl: i }) =>
        (await e.crossApp.getProviderAccessToken(t)) ||
        (await r({ providerAppId: t, redirectUrl: i }),
        await e.crossApp.getProviderAccessToken(t));
    })({ client: e, openAuthSession: t });
    return async ({ user: i, request: a, redirectUrl: n, address: s }) => {
      let o = i.linked_accounts
        .filter((e) => "cross_app" === e.type)
        .find(({ embedded_wallets: e, smart_wallets: t }) =>
          [...e, ...t].some((e) => e.address === s),
        );
      if (!o)
        throw new ij({
          code: "cross_app_invalid_wallet",
          error: "Cannot operate with this wallet address",
        });
      let d = o.provider_app_id,
        { connections: l } = await e.crossApp.getCrossAppConnections(),
        c = l.find((e) => e.provider_app_id === d);
      if (!c)
        throw new ij({
          code: "cross_app_invalid_app",
          error: "Invalid connected app",
        });
      if (c.read_only)
        throw new ij({
          code: "cross_app_read_only",
          error: "Cannot transact against a read-only provider app",
        });
      let u = await r({ providerAppId: d, redirectUrl: n });
      if (!u)
        throw new ij({
          code: "cross_app_request_error",
          error: "Wallet operations require a valid token",
        });
      let h = {
          content: { request: { request: a } },
          timestamp: Date.now(),
          callbackUrl: n,
        },
        p = new URL(`${c.provider_app_custom_api_url}/oauth/transact`);
      (p.searchParams.set("communicationMode", "redirect"),
        p.searchParams.set("token", u),
        p.searchParams.set("request", JSON.stringify(h)));
      let { privy_cross_app_type: f, privy_cross_app_payload: y } = await t(
        p.href,
        n,
      );
      if (!f || !y)
        throw new ij({
          code: "cross_app_request_error",
          error: "Cross app request returned an invalid result",
        });
      if ("PRIVY_CROSS_APP_ACTION_ERROR" === f)
        throw new ij({ code: "cross_app_request_error", error: y });
      if ("PRIVY_CROSS_APP_ACTION_RESPONSE" !== f)
        throw new ij({
          code: "cross_app_request_error",
          error: "Cross app request returned an invalid result",
        });
      return { result: y };
    };
  };
  function nk(e) {
    if (!e)
      throw new ij({
        code: "attempted_cross_app_request_before_logged_in",
        error: "Must be logged in to sign messages with a cross-app wallet",
      });
  }
  let nS = ({ client: e, openAuthSession: t }) => {
      let r = nI({ client: e, openAuthSession: t });
      return async ({ user: e, address: t, message: i, redirectUrl: a }) => {
        nk(e);
        let n = {
            method: nw(e, t) ? "privy_signSmartWalletMessage" : "personal_sign",
            params: [i, t],
          },
          { result: s } = await r({
            user: e,
            request: n,
            address: t,
            redirectUrl: a,
          });
        return { signature: s };
      };
    },
    nT = ({ client: e, openAuthSession: t }) => {
      let r = nI({ client: e, openAuthSession: t });
      return async ({ user: e, typedData: t, address: i, redirectUrl: a }) => {
        let n, s, o;
        nk(e);
        let d = {
            method: nw(e, i)
              ? "privy_signSmartWalletTypedData"
              : "eth_signTypedData_v4",
            params: [
              i,
              ((n = {
                name: "string",
                version: "string",
                chainId: "uint256",
                verifyingContract: "address",
                salt: "bytes32",
              }),
              (s =
                t.types.EIP712Domain ??
                Object.entries(t.domain ?? {})
                  .map(([e, t]) => {
                    if (null != t && "string" == typeof e && e in n)
                      return { name: e, type: n[e] };
                  })
                  .filter((e) => !!e)),
              ((o = { ...t.types }).EIP712Domain = s),
              { ...t, types: o }),
            ],
          },
          { result: l } = await r({
            user: e,
            request: d,
            address: i,
            redirectUrl: a,
          });
        return { signature: l };
      };
    },
    nC = ({ client: e, openAuthSession: t }) => {
      let r = nI({ client: e, openAuthSession: t });
      return async ({
        user: e,
        transaction: t,
        address: i,
        redirectUrl: a,
      }) => {
        nk(e);
        let n = {
            method: nw(e, i)
              ? "privy_sendSmartWalletTx"
              : "eth_sendTransaction",
            params: [t],
          },
          { result: s } = await r({
            user: e,
            request: n,
            address: i,
            redirectUrl: a,
          });
        return { transactionHash: s };
      };
    };
  var nE = iN({
    sendTransaction: () => nC,
    signMessage: () => nS,
    signTypedData: () => nT,
  });
  function nA(e) {
    return e.startsWith("eip155:")
      ? "ethereum"
      : e.startsWith("solana:")
        ? "solana"
        : e.startsWith("bip122:")
          ? "bitcoin-segwit"
          : e.startsWith("tron:")
            ? "tron"
            : void 0;
  }
  async function nx(e) {
    let { user: t } = await e.privy.user.get();
    if (!t) return { ok: !1, error: "NOT_AUTHENTICATED" };
    let r = (function (e, t) {
      let r = nA(e);
      if (!r) return;
      let i = t.linked_accounts.find(
        (e) =>
          "wallet" === e.type &&
          e.chain_type === r &&
          "address" in e &&
          e.address,
      );
      return i && "address" in i ? i.address : void 0;
    })(e.caip2, t);
    if (r) return { ok: !0, address: r };
    let i = nA(e.caip2);
    if (!i) return { ok: !1, error: "UNSUPPORTED_CHAIN" };
    try {
      let t = await e.privy.fetchPrivyRoute(C.$S, { body: { chain_type: i } });
      return (await e.onWalletCreated?.(), { ok: !0, address: t.address });
    } catch {
      return { ok: !1, error: "REFUND_WALLET_CREATION_FAILED" };
    }
  }
  async function nN(e) {
    let { user: t } = await e.privy.user.get();
    if (!t) throw Error("NOT_AUTHENTICATED");
    let r = e.refundAddress;
    if (!r) {
      let t = await nx({
        privy: e.privy,
        caip2: e.sourceChain,
        onWalletCreated: e.onWalletCreated,
      });
      if (!t.ok) throw Error(t.error);
      r = t.address;
    }
    let i = await e.privy.fetchPrivyRoute(C.sC, {
      body: {
        source_chain: e.sourceChain,
        source_currency: e.sourceCurrency,
        destination_chain: e.destinationChain,
        destination_currency: e.destinationCurrency,
        destination_address: e.destinationAddress,
        refund_address: r,
        ...(null == e.slippageBps ? {} : { slippage_bps: e.slippageBps }),
      },
    });
    return (
      e.privy.track({
        name: "sdk_deposit_address_headless_quote",
        properties: {
          sourceChain: e.sourceChain,
          sourceCurrency: e.sourceCurrency,
          destinationChain: e.destinationChain,
          destinationCurrency: e.destinationCurrency,
          depositAddressId: i.id,
        },
      }),
      i
    );
  }
  function nP(e) {
    return new Promise((t) => {
      setTimeout(() => {
        t();
      }, e);
    });
  }
  iN({
    linkWithCrossAppAuth: () => nb,
    loginWithCrossAppAuth: () => n$,
    wallet: () => nE,
  });
  let nO = async ({
    operation: e,
    until: t,
    delay: r,
    interval: i,
    attempts: a,
    signal: n,
  }) => {
    r && (await nP(r));
    let s = 0,
      o,
      d;
    for (; s < a; ) {
      if (n?.aborted)
        return { status: "aborted", result: o, attempts: s, error: d };
      s++;
      try {
        if (((d = void 0), (o = await e()), t(o)))
          return { status: "success", result: o, attempts: s };
        s < a && (await nP(i));
      } catch (e) {
        (e instanceof Error && (d = e), s < a && (await nP(i)));
      }
    }
    return { status: "max_attempts", result: o, attempts: s, error: d };
  };
  function nR(e, t) {
    return Math.ceil(t / e);
  }
  function nU(e) {
    return "success" === e.status
      ? e.result
        ? { status: "success", order: e.result }
        : { status: "timeout" }
      : "aborted" === e.status
        ? { status: "aborted", error: e.error }
        : { status: "timeout", error: e.error };
  }
  async function nM(e) {
    return await e.privy.fetchPrivyRoute(C.oE, {
      params: { order_id: e.orderId },
    });
  }
  async function nD(e) {
    let t = e.pollIntervalMs ?? 2e3,
      r = e.timeoutMs ?? 18e5,
      i = e.signal ?? new AbortController().signal;
    return nU(
      await nO({
        operation: async () => {
          let t = await e.privy.fetchPrivyRoute(C.OX, {
            params: { deposit_address_id: e.depositAddressId },
            query: { after: e.quoteCreatedAt },
          });
          if (t.order)
            return await e.privy.fetchPrivyRoute(C.oE, {
              params: { order_id: t.order.id },
            });
        },
        until: (e) => void 0 !== e,
        delay: t,
        interval: t,
        attempts: nR(t, r),
        signal: i,
      }),
    );
  }
  async function nL(e) {
    let t = e.pollIntervalMs ?? 2e3,
      r = e.timeoutMs ?? 18e5,
      i = e.signal ?? new AbortController().signal;
    return nU(
      await nO({
        operation: () =>
          e.privy.fetchPrivyRoute(C.oE, { params: { order_id: e.orderId } }),
        until: (e) => "executing" !== e.status,
        delay: t,
        interval: t,
        attempts: nR(t, r),
        signal: i,
      }),
    );
  }
  var nF = iN({
    generateDepositAddress: () => nN,
    getConfig: () => nj,
    getDeposit: () => nM,
    resolveRefundAddress: () => nx,
    waitForCompletion: () => nL,
    waitForDeposit: () => nD,
  });
  async function nj(e) {
    let t = await e.fetchPrivyRoute(C.Dl, {});
    return { currencies: t.currencies, chains: t.chains };
  }
  async function nW(e, t, r) {
    let i,
      { walletId: a } = r,
      n =
        ((i =
          void 0 === r.depositAddressStrategy
            ? {}
            : { deposit_address_strategy: r.depositAddressStrategy }),
        "deposit_config" === r.type
          ? {
              type: "deposit_config",
              deposit_config_id: r.depositConfigId,
              ...i,
            }
          : {
              type: "inline_route",
              source: r.source,
              destination: r.destination,
              ...i,
            }),
      s = e.getCompiledPath(C.FW, { params: { wallet_id: a } }),
      o = String(Date.now() + 18e5),
      { signature: d } = await iH(t, {
        version: 1,
        url: s,
        method: C.FW.method,
        headers: { "privy-app-id": e.app.appId, [iz]: o },
        body: n,
      });
    if (Date.now() > Number(o))
      throw new ij({
        error:
          "Wallet request expired before it could be sent. Please try again.",
        code: "embedded_wallet_request_expired",
      });
    let l = await e.fetchPrivyRoute(C.FW, {
      body: n,
      params: { wallet_id: a },
      headers: { "privy-authorization-signature": d, [iz]: o },
    });
    return (
      e.track({
        name: "sdk_deposit_address_headless_create",
        properties: {
          version: "v3",
          action: "create",
          walletId: a,
          type: r.type,
          ...("inline_route" === r.type
            ? {
                destinationChain: r.destination.chain,
                destinationCurrency: r.destination.asset,
              }
            : { depositConfigId: r.depositConfigId }),
        },
      }),
      l
    );
  }
  async function nG(e, t) {
    let r = await e.fetchPrivyRoute(C.hM, {
      body: {
        source: t.source,
        destination: t.destination,
        ...(null == t.inputAmount ? {} : { input_amount: t.inputAmount }),
        ...(null == t.slippageBps ? {} : { slippage_bps: t.slippageBps }),
      },
    });
    return (
      e.track({
        name: "sdk_deposit_address_headless_quote",
        properties: {
          version: "v3",
          action: "quote",
          sourceChain: t.source.chain,
          sourceCurrency: t.source.asset,
          destinationChain: t.destination.chain,
          destinationCurrency: t.destination.asset,
        },
      }),
      r
    );
  }
  function nB(e) {
    let t = Number(e.input_amount),
      r = Number(e.estimated_output_amount);
    if (!(!Number.isFinite(t) || !Number.isFinite(r) || 0 === t))
      return String(r / t);
  }
  async function nV(e, t) {
    return e.fetchPrivyRoute(C.Y3, {
      params: { wallet_id: t.walletId, order_id: t.orderId },
    });
  }
  async function nq(e, t) {
    return e.fetchPrivyRoute(C.AV, {
      params: { wallet_id: t.walletId },
      query: { after: t.after },
    });
  }
  let nZ = {
      ethereum: "eip155:1",
      arbitrum: "eip155:42161",
      avalanche: "eip155:43114",
      arc: "eip155:5042",
      base: "eip155:8453",
      tempo: "eip155:4217",
      linea: "eip155:59144",
      optimism: "eip155:10",
      polygon: "eip155:137",
      bsc: "eip155:56",
      zksync_era: "eip155:324",
      solana: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
      tron: "tron:mainnet",
      robinhood: "eip155:4663",
      unichain: "eip155:130",
      worldchain: "eip155:480",
      ink: "eip155:57073",
      soneium: "eip155:1868",
      megaeth: "eip155:4326",
      hyperevm: "eip155:999",
      hypercore: "eip155:1337",
      "tempo_zone:00001": "eip155:421700001",
      "tempo_zone:00002": "eip155:421700002",
      tempo_testnet: "eip155:42431",
      "tempo_testnet_zone:00003": "eip155:1424310003",
      hoodi: "eip155:560048",
      sepolia: "eip155:11155111",
      arbitrum_sepolia: "eip155:421614",
      avalanche_fuji: "eip155:43113",
      base_sepolia: "eip155:84532",
      linea_testnet: "eip155:59140",
      optimism_sepolia: "eip155:11155420",
      polygon_amoy: "eip155:80002",
      bsc_testnet: "eip155:97",
      solana_devnet: "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",
      solana_testnet: "solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z",
      tron_nile: "tron:nile",
      robinhood_testnet: "eip155:46630",
      ink_sepolia: "eip155:763373",
    },
    nK = [
      { id: "eth", symbol: "ETH" },
      { id: "sol", symbol: "SOL" },
      { id: "pol", symbol: "POL" },
      { id: "trx", symbol: "TRX" },
      { id: "usdc", symbol: "USDC" },
      { id: "usdc_e", symbol: "USDC.e" },
      { id: "usdt", symbol: "USDT" },
      { id: "usdt0", symbol: "USDT0" },
      { id: "usdb", symbol: "USDB" },
      { id: "eurc", symbol: "EURC" },
      { id: "ousd", symbol: "OUSD" },
      { id: "usdg", symbol: "USDG" },
      { id: "pathusd", symbol: "PathUSD" },
    ],
    nJ = new Set([
      "native",
      "native-token",
      "0x0000000000000000000000000000000000000000",
      "11111111111111111111111111111111",
    ]);
  function nH(e) {
    return nJ.has(e.toLowerCase());
  }
  function nz(e) {
    return e.includes(":")
      ? e
      : nZ[e.toLowerCase()] || (/^\d+$/.test(e) ? `eip155:${e}` : e);
  }
  function nY(e) {
    return nH(e);
  }
  function nX({ symbol: e, address: t }) {
    let r;
    return (
      ((r = e.toLowerCase()),
      nK.find((e) => e.id === r || e.symbol.toLowerCase() === r))?.id ?? t
    );
  }
  function nQ({ asset: e, symbol: t, addresses: r }) {
    let i = e.toLowerCase();
    return (
      t.toLowerCase() === i ||
      (nH(e) ? r.some(nH) : r.some((e) => e.toLowerCase() === i))
    );
  }
  function n0({ config: e, chain: t, asset: r }) {
    let i = t ? nz(t) : void 0;
    for (let t of e.currencies) {
      let e = i ? t.chains.filter((e) => nz(e.caip2) === i) : t.chains;
      if (
        0 !== e.length &&
        nQ({ asset: r, symbol: t.symbol, addresses: e.map((e) => e.address) })
      )
        return t.symbol;
    }
    return r.toUpperCase();
  }
  function n1(e, t) {
    let r = nz(e);
    if (r !== e || e.includes(":")) return r;
    let i = e.toLowerCase();
    for (let r of Object.values(t.chains))
      if (
        r.caip2 === e ||
        r.display_name.toLowerCase() === i ||
        String(r.chain_id) === e
      )
        return r.caip2;
    return r;
  }
  function n2(e, t) {
    return nQ({
      asset: t.asset,
      symbol: e.symbol,
      addresses: e.chains.map((e) => e.address),
    });
  }
  function n3({ caip2: e, asset: t, config: r }) {
    var i;
    return !t.chain || ((i = t.chain), n1(i, r) === n1(e, r));
  }
  function n4(e, t) {
    return {
      currencies: e.currencies
        .map((r) => ({
          ...r,
          chains: (function ({ currency: e, source: t, config: r }) {
            switch (t.mode) {
              case "all":
              default:
                return e.chains;
              case "include": {
                let i = t.values.filter((t) => n2(e, t));
                return 0 === i.length
                  ? []
                  : e.chains.filter((e) =>
                      i.some((t) =>
                        n3({ caip2: e.caip2, asset: t, config: r }),
                      ),
                    );
              }
              case "exclude": {
                let i = t.values.filter((t) => n2(e, t));
                return 0 === i.length
                  ? e.chains
                  : e.chains.filter(
                      (e) =>
                        !i.some((t) =>
                          n3({ caip2: e.caip2, asset: t, config: r }),
                        ),
                    );
              }
            }
          })({ currency: r, source: t, config: e }),
        }))
        .filter((e) => e.chains.length > 0),
      chains: e.chains,
    };
  }
  function n9({ accounts: e, selectedChain: t }) {
    if (0 === e.length) return;
    let r = e.filter((e) =>
        (function (e, t) {
          let r = nz(t);
          switch (e.source.mode) {
            case "all":
              return !0;
            case "include":
              return e.source.values.some((e) => !e.chain || nz(e.chain) === r);
            case "exclude":
              return !e.source.values.some(
                (e) => !e.chain || nz(e.chain) === r,
              );
            default:
              return (e.source, !1);
          }
        })(e, t.caip2),
      ),
      i = r.length > 0 ? r : e,
      a = i.find((e) =>
        (function (e, t) {
          let r = e.startsWith("0x");
          switch (t) {
            case "evm":
            case "hypevm":
            default:
              return r;
            case "svm":
            case "bvm":
            case "tron":
            case "tvm":
              return !r;
          }
        })(e.deposit_address, t.vmType),
      );
    return a ? a.deposit_address : i[0]?.deposit_address;
  }
  var n5 = iN({
    createCryptoDepositAccount: () => nW,
    filterDepositConfig: () => n4,
    findCatalogSymbol: () => n0,
    getCryptoDepositAccountNextOrder: () => nq,
    getCryptoDepositAccountOrder: () => nV,
    getCryptoDepositAccountQuote: () => nG,
    indicativeRateFromQuote: () => nB,
    isNativeAssetAlias: () => nY,
    pickDepositAddressForChain: () => n9,
    quoteSourceAsset: () => nX,
    resolveChainAlias: () => nz,
  });
  async function n8(e, { wallet_id: t }) {
    return await e.fetchPrivyRoute(C.HX, { params: { wallet_id: t } });
  }
  async function n6(e, { wallet_id: t }, r, i) {
    let { signature: a } = await iH(r, {
      version: 1,
      url: e.getCompiledPath(C.Xt, { params: { wallet_id: t } }),
      method: C.Xt.method,
      headers: { "privy-app-id": e.app.appId },
      body: i,
    });
    return await e.fetchPrivyRoute(C.Xt, {
      params: { wallet_id: t },
      body: i,
      headers: { "privy-authorization-signature": a },
    });
  }
  async function n7(e, t, { wallet_id: r, ...i }) {
    let a = e.getCompiledPath(C.ZQ, { params: { wallet_id: r } }),
      n = String(Date.now() + 18e5),
      { signature: s } = await iH(t, {
        version: 1,
        url: a,
        method: C.ZQ.method,
        headers: { "privy-app-id": e.app.appId, [iz]: n },
        body: { ...i },
      });
    if (Date.now() > Number(n))
      throw new ij({
        error:
          "Wallet request expired before it could be sent. Please try again.",
        code: "embedded_wallet_request_expired",
      });
    return await e.fetchPrivyRoute(C.ZQ, {
      body: i,
      params: { wallet_id: r },
      headers: { "privy-authorization-signature": s, [iz]: n },
    });
  }
  async function se(e, { wallet_id: t, action_id: r }) {
    return await e.fetchPrivyRoute(C.ha, {
      params: { wallet_id: t, action_id: r },
    });
  }
  async function st(e, { wallet_id: t, ...r }) {
    return await e.fetchPrivyRoute(C.r1, {
      params: { wallet_id: t },
      query: {
        ...(r.cursor ? { cursor: r.cursor } : {}),
        ...(void 0 === r.limit || null === r.limit ? {} : { limit: r.limit }),
        ...(r.type ? { type: r.type } : {}),
      },
    });
  }
  var sr = class {
    #e;
    #t;
    get standardWallet() {
      return this.#e;
    }
    get address() {
      return this.#t.address;
    }
    constructor({ wallet: e, account: t }) {
      ((this.#e = e), (this.#t = t));
    }
    async disconnect() {
      if (!this.#e.features["standard:disconnect"]?.disconnect)
        throw Error("Wallet does not support disconnect");
      await this.#e.features["standard:disconnect"].disconnect();
    }
    async signMessage(...e) {
      if (!this.#e.features["solana:signMessage"]?.signMessage)
        throw Error("Wallet does not support signMessage");
      let t = await this.#e.features["solana:signMessage"].signMessage(
        ...e.map((e) => ({ ...e, account: this.#t })),
      );
      return 1 === e.length ? t[0] : [...t];
    }
    async signTransaction(...e) {
      if (!this.#e.features["solana:signTransaction"]?.signTransaction)
        throw Error("Wallet does not support signTransaction");
      let t = await this.#e.features["solana:signTransaction"].signTransaction(
        ...e.map((e) => ({ ...e, account: this.#t })),
      );
      return 1 === e.length ? t[0] : [...t];
    }
    async signAndSendTransaction(...e) {
      if (
        !this.#e.features["solana:signAndSendTransaction"]
          ?.signAndSendTransaction
      )
        throw Error("Wallet does not support signAndSendTransaction");
      let t = await this.#e.features[
        "solana:signAndSendTransaction"
      ].signAndSendTransaction(...e.map((e) => ({ ...e, account: this.#t })));
      return 1 === e.length ? t[0] : [...t];
    }
    async signAndSendAllTransactions(e) {
      if (
        !this.#e.features["solana:signAndSendTransaction"]
          ?.signAndSendTransaction
      )
        throw Error("Wallet does not support signAndSendTransaction");
      return [
        ...(await this.#e.features[
          "solana:signAndSendTransaction"
        ].signAndSendTransaction(
          ...e.map((e) => ({ ...e, account: this.#t })),
        )),
      ];
    }
  };
  e.s(
    [
      "b",
      0,
      sr,
      "V",
      0,
      iR,
      "W",
      0,
      iF,
      "g",
      0,
      ij,
      "X",
      0,
      {
        UNKNOWN_ERROR: {
          eipCode: 0,
          message: "Unknown error",
          detail: "Unknown error",
          retryable: !0,
        },
        E4001_DEFAULT_USER_REJECTED_REQUEST: {
          eipCode: 4001,
          message: "User Rejected Request",
          detail: "The user rejected the request.",
          default: !0,
          retryable: !0,
        },
        E4100_DEFAULT_UNAUTHORIZED: {
          eipCode: 4100,
          message: "Unauthorized",
          detail:
            "The requested method and/or account has not been authorized by the user.",
          default: !0,
          retryable: !1,
        },
        E4200_DEFAULT_UNSUPPORTED_METHOD: {
          eipCode: 4200,
          message: "Unsupported Method",
          detail: "The Provider does not support the requested method.",
          default: !0,
          retryable: !1,
        },
        E4900_DEFAULT_DISCONNECTED: {
          eipCode: 4900,
          message: "Disconnected",
          detail: "The Provider is disconnected from all chains.",
          default: !0,
          retryable: !0,
        },
        E4901_DEFAULT_CHAIN_DISCONNECTED: {
          eipCode: 4901,
          message: "Chain Disconnected",
          detail: "The Provider is not connected to the requested chain.",
          default: !0,
          retryable: !0,
        },
        E32700_DEFAULT_PARSE_ERROR: {
          eipCode: -32700,
          message: "Parse error",
          detail: "Invalid JSON",
          default: !0,
          retryable: !1,
        },
        E32600_DEFAULT_INVALID_REQUEST: {
          eipCode: -32600,
          message: "Invalid request",
          detail: "JSON is not a valid request object",
          default: !0,
          retryable: !1,
        },
        E32601_DEFAULT_METHOD_NOT_FOUND: {
          eipCode: -32601,
          message: "Method not found",
          detail: "Method does not exist",
          default: !0,
          retryable: !1,
        },
        E32602_DEFAULT_INVALID_PARAMS: {
          eipCode: -32602,
          message: "Invalid params",
          detail: "Invalid method parameters",
          default: !0,
          retryable: !1,
        },
        E32603_DEFAULT_INTERNAL_ERROR: {
          eipCode: -32603,
          message: "Internal error",
          detail: "Internal JSON-RPC error",
          default: !0,
          retryable: !0,
        },
        E32000_DEFAULT_INVALID_INPUT: {
          eipCode: -32e3,
          message: "Invalid input",
          detail: "Missing or invalid parameters",
          default: !0,
          retryable: !1,
        },
        E32001_DEFAULT_RESOURCE_NOT_FOUND: {
          eipCode: -32001,
          message: "Resource not found",
          detail: "Requested resource not found",
          default: !0,
          retryable: !1,
        },
        E32002_DEFAULT_RESOURCE_UNAVAILABLE: {
          eipCode: -32002,
          message: "Resource unavailable",
          detail: "Requested resource not available",
          default: !0,
          retryable: !0,
        },
        E32003_DEFAULT_TRANSACTION_REJECTED: {
          eipCode: -32003,
          message: "Transaction rejected",
          detail: "Transaction creation failed",
          default: !0,
          retryable: !0,
        },
        E32004_DEFAULT_METHOD_NOT_SUPPORTED: {
          eipCode: -32004,
          message: "Method not supported",
          detail: "Method is not implemented",
          default: !0,
          retryable: !1,
        },
        E32005_DEFAULT_LIMIT_EXCEEDED: {
          eipCode: -32005,
          message: "Limit exceeded",
          detail: "Request exceeds defined limit",
          default: !0,
          retryable: !1,
        },
        E32006_DEFAULT_JSON_RPC_VERSION_NOT_SUPPORTED: {
          eipCode: -32006,
          message: "JSON-RPC version not supported",
          detail: "Version of JSON-RPC protocol is not supported",
          default: !0,
          retryable: !1,
        },
        E32002_CONNECTION_ALREADY_PENDING: {
          eipCode: -32002,
          message: "Connection request already pending",
          detail: "Don’t see your wallet? Check your other browser windows.",
          retryable: !1,
        },
        E32002_REQUEST_ALREADY_PENDING: {
          eipCode: -32002,
          message: "Resource request already pending",
          detail: "Don’t see your wallet? Check your other browser windows.",
          retryable: !1,
        },
        E32002_WALLET_LOCKED: {
          eipCode: -32002,
          message: "Wallet might be locked",
          detail: "Unlock your wallet and try again.",
          retryable: !0,
        },
        E4001_USER_REJECTED_REQUEST: {
          eipCode: 4001,
          message: "Signature rejected",
          detail: "Please try signing again.",
          retryable: !0,
        },
      },
      "c",
      0,
      nu,
      "H",
      0,
      function ({ message: e, signerPublicKey: t, domain: r }) {
        let i,
          a,
          n = B.utf8.toBytes(e);
        if (32 !== t.length) throw Error("Signer public key must be 32 bytes");
        let s = 85 + n.length;
        if (s > 1232)
          throw Error(`Combined message length (${s}) exceeds maximum (1232)`);
        let o =
            ((i = B.utf8.toBytes(r)),
            (a = new Uint8Array(32)).set(i.slice(0, 32)),
            a),
          d = new Uint8Array(s),
          l = 0;
        ((d[0] = 255), (l += 1));
        let c = B.utf8.toBytes("solana offchain");
        return (
          d.set(c, l),
          (d[(l += c.length)] = 0),
          (l += 1),
          d.set(o, l),
          (d[(l += 32)] = 1),
          (d[(l += 1)] = 1),
          (l += 1),
          d.set(t, l),
          (d[(l += 32)] = 255 & n.length),
          (d[l + 1] = (n.length >> 8) & 255),
          (l += 2),
          d.set(n, l),
          d
        );
      },
      "a",
      0,
      function (e, t) {
        switch (e) {
          case x.g.id:
            return "native-currency" === t ? "ETH_ARBITRUM" : "USDC_ARBITRUM";
          case x.M.id:
            return "native-currency" === t ? "AVAX_CCHAIN" : "USDC_CCHAIN";
          case x.j.id:
            return "native-currency" === t ? "ETH_BASE" : "USDC_BASE";
          case x.$.id:
            return "CELO_CELO";
          case x.y.id:
            return "native-currency" === t ? "MATIC_POLYGON" : "USDC_POLYGON";
          case x.k.id:
            return "MON_MON";
          case x.q.id:
            return "native-currency" === t ? "ETH_ETHEREUM" : "USDC_ETHEREUM";
          default:
            return (
              console.warn(
                `Chain ${e} not supported by Moonpay, defaulting to Ethereum mainnet`,
              ),
              "ETH_ETHEREUM"
            );
        }
      },
      "I",
      0,
      ay,
      "h",
      0,
      nc,
      "$",
      0,
      ad,
      "l",
      0,
      n5,
      "U",
      0,
      nl,
      "d",
      0,
      nF,
      "A",
      0,
      (e, t) => `+${rQ(t)} ${e}`,
      "e",
      0,
      function ({ amount: e, decimals: t }) {
        return (0, R.f)(BigInt(e), t);
      },
      "f",
      0,
      function (e) {
        return e ? `${e.slice(0, 5)}…${e.slice(-4)}` : "";
      },
      "w",
      0,
      function ({ wei: e, precision: t = 3 }) {
        return parseFloat((0, O.f)(e))
          .toFixed(t)
          .replace(/0+$/, "")
          .replace(/\.$/, "");
      },
      "Y",
      0,
      iH,
      "Q",
      0,
      nh,
      "m",
      0,
      function ({
        appId: e,
        input: t,
        amount: r,
        blockchain: i,
        asset: a,
        experience: n,
      }) {
        let s = new URL("https://pay.coinbase.com/buy/select-asset");
        return (
          s.searchParams.set("appId", t.app_id),
          s.searchParams.set("sessionToken", t.session_token),
          s.searchParams.set("endPartnerName", `privy:${e}`),
          s.searchParams.set("defaultExperience", n),
          s.searchParams.set(
            "presetCryptoAmount",
            r.startsWith(".") ? `0${r}` : r,
          ),
          s.searchParams.set("defaultNetwork", i),
          s.searchParams.set("defaultPaymentMethod", ny[n]),
          s.searchParams.set("defaultAsset", nm[a]),
          s.searchParams.set("partnerUserId", t.partner_user_id),
          { url: s }
        );
      },
      "L",
      0,
      i9,
      "N",
      0,
      (e) => {
        let t = new rz();
        t.input(e);
        let r = t.getCountry() || "US",
          i = t.getCallingCode() || "1";
        return { countryCode: r, phone: e.replace("+" + i, "") };
      },
      "i",
      0,
      (e) => {
        let t = (function () {
          return rY(r0, arguments);
        })(e, tk)?.formatInternational();
        return t?.substring(t.indexOf(" ") + 1);
      },
      "J",
      0,
      n8,
      "s",
      0,
      se,
      "z",
      0,
      (e, t) => {
        switch (t) {
          case "native-currency":
            return np.has(e);
          case "USDC":
            return nf.has(e);
          default:
            return (
              console.warn("Unknown asset passed to Coinbase Onramp"),
              !1
            );
        }
      },
      "O",
      0,
      function (e, t) {
        switch (t) {
          case "native-currency":
            return a7.has(e);
          case "USDC":
            return ne.has(e);
          default:
            return (console.warn("Unknown asset passed to MoonPay Onramp"), !1);
        }
      },
      "q",
      0,
      (e) => `*${e.replaceAll("-", "").slice(-4)}`,
      "P",
      0,
      st,
      "M",
      0,
      (e) => new rz(e),
      "Z",
      0,
      nO,
      "j",
      0,
      iY,
      "k",
      0,
      am,
      "n",
      0,
      function (e, t) {
        return "USDC" === t
          ? "USDC"
          : e === x.y.id
            ? "POL"
            : e === x.k.id
              ? "MON"
              : "ETH";
      },
      "v",
      0,
      (e) =>
        (function () {
          return rY(iA, arguments);
        })(e, "US")?.format("E.164") ?? e.replace(/[\s()-]/g, ""),
      "D",
      0,
      (e, t = !0) => e.reduce((e, r) => ({ ...e, [r]: t }), {}),
      "K",
      0,
      iX,
      "T",
      0,
      n7,
      "t",
      0,
      n6,
      "o",
      0,
      (e, t) =>
        (function () {
          return rY(iE, arguments);
        })(String(e), t),
    ],
    42799,
  );
};
