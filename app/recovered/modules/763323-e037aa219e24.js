// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e, t, r) => {
  t.exports = {
    AggregateError: class extends Error {
      constructor(e) {
        if (!Array.isArray(e))
          throw TypeError(`Expected input to be an Array, got ${typeof e}`);
        let t = "";
        for (let r = 0; r < e.length; r++)
          t += `    ${e[r].stack}
`;
        (super(t), (this.name = "AggregateError"), (this.errors = e));
      }
    },
    ArrayIsArray: (e) => Array.isArray(e),
    ArrayPrototypeIncludes: (e, t) => e.includes(t),
    ArrayPrototypeIndexOf: (e, t) => e.indexOf(t),
    ArrayPrototypeJoin: (e, t) => e.join(t),
    ArrayPrototypeMap: (e, t) => e.map(t),
    ArrayPrototypePop: (e, t) => e.pop(t),
    ArrayPrototypePush: (e, t) => e.push(t),
    ArrayPrototypeSlice: (e, t, r) => e.slice(t, r),
    Error,
    FunctionPrototypeCall: (e, t, ...r) => e.call(t, ...r),
    FunctionPrototypeSymbolHasInstance: (e, t) =>
      Function.prototype[Symbol.hasInstance].call(e, t),
    MathFloor: Math.floor,
    Number,
    NumberIsInteger: Number.isInteger,
    NumberIsNaN: Number.isNaN,
    NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
    NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
    NumberParseInt: Number.parseInt,
    ObjectDefineProperties: (e, t) => Object.defineProperties(e, t),
    ObjectDefineProperty: (e, t, r) => Object.defineProperty(e, t, r),
    ObjectGetOwnPropertyDescriptor: (e, t) =>
      Object.getOwnPropertyDescriptor(e, t),
    ObjectKeys: (e) => Object.keys(e),
    ObjectSetPrototypeOf: (e, t) => Object.setPrototypeOf(e, t),
    Promise,
    PromisePrototypeCatch: (e, t) => e.catch(t),
    PromisePrototypeThen: (e, t, r) => e.then(t, r),
    PromiseReject: (e) => Promise.reject(e),
    PromiseResolve: (e) => Promise.resolve(e),
    ReflectApply: Reflect.apply,
    RegExpPrototypeTest: (e, t) => e.test(t),
    SafeSet: Set,
    String,
    StringPrototypeSlice: (e, t, r) => e.slice(t, r),
    StringPrototypeToLowerCase: (e) => e.toLowerCase(),
    StringPrototypeToUpperCase: (e) => e.toUpperCase(),
    StringPrototypeTrim: (e) => e.trim(),
    Symbol,
    SymbolFor: Symbol.for,
    SymbolAsyncIterator: Symbol.asyncIterator,
    SymbolHasInstance: Symbol.hasInstance,
    SymbolIterator: Symbol.iterator,
    SymbolDispose: Symbol.dispose || Symbol("Symbol.dispose"),
    SymbolAsyncDispose: Symbol.asyncDispose || Symbol("Symbol.asyncDispose"),
    TypedArrayPrototypeSet: (e, t, r) => e.set(t, r),
    Boolean,
    Uint8Array,
  };
};
