// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  class t extends Error {
    static get code() {
      return "ERR_JOSE_GENERIC";
    }
    constructor(e) {
      var t;
      (super(e),
        (this.code = "ERR_JOSE_GENERIC"),
        (this.name = this.constructor.name),
        null == (t = Error.captureStackTrace) ||
          t.call(Error, this, this.constructor));
    }
  }
  e.s([
    "JOSEAlgNotAllowed",
    0,
    class extends t {
      constructor() {
        (super(...arguments), (this.code = "ERR_JOSE_ALG_NOT_ALLOWED"));
      }
      static get code() {
        return "ERR_JOSE_ALG_NOT_ALLOWED";
      }
    },
    "JOSEError",
    0,
    t,
    "JOSENotSupported",
    0,
    class extends t {
      constructor() {
        (super(...arguments), (this.code = "ERR_JOSE_NOT_SUPPORTED"));
      }
      static get code() {
        return "ERR_JOSE_NOT_SUPPORTED";
      }
    },
    "JWEDecompressionFailed",
    0,
    class extends t {
      constructor() {
        (super(...arguments),
          (this.code = "ERR_JWE_DECOMPRESSION_FAILED"),
          (this.message = "decompression operation failed"));
      }
      static get code() {
        return "ERR_JWE_DECOMPRESSION_FAILED";
      }
    },
    "JWEDecryptionFailed",
    0,
    class extends t {
      constructor() {
        (super(...arguments),
          (this.code = "ERR_JWE_DECRYPTION_FAILED"),
          (this.message = "decryption operation failed"));
      }
      static get code() {
        return "ERR_JWE_DECRYPTION_FAILED";
      }
    },
    "JWEInvalid",
    0,
    class extends t {
      constructor() {
        (super(...arguments), (this.code = "ERR_JWE_INVALID"));
      }
      static get code() {
        return "ERR_JWE_INVALID";
      }
    },
    "JWKInvalid",
    0,
    class extends t {
      constructor() {
        (super(...arguments), (this.code = "ERR_JWK_INVALID"));
      }
      static get code() {
        return "ERR_JWK_INVALID";
      }
    },
    "JWKSInvalid",
    0,
    class extends t {
      constructor() {
        (super(...arguments), (this.code = "ERR_JWKS_INVALID"));
      }
      static get code() {
        return "ERR_JWKS_INVALID";
      }
    },
    "JWKSMultipleMatchingKeys",
    0,
    class extends t {
      constructor() {
        (super(...arguments),
          (this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS"),
          (this.message =
            "multiple matching keys found in the JSON Web Key Set"));
      }
      static get code() {
        return "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
      }
    },
    "JWKSNoMatchingKey",
    0,
    class extends t {
      constructor() {
        (super(...arguments),
          (this.code = "ERR_JWKS_NO_MATCHING_KEY"),
          (this.message = "no applicable key found in the JSON Web Key Set"));
      }
      static get code() {
        return "ERR_JWKS_NO_MATCHING_KEY";
      }
    },
    "JWKSTimeout",
    0,
    class extends t {
      constructor() {
        (super(...arguments),
          (this.code = "ERR_JWKS_TIMEOUT"),
          (this.message = "request timed out"));
      }
      static get code() {
        return "ERR_JWKS_TIMEOUT";
      }
    },
    "JWSInvalid",
    0,
    class extends t {
      constructor() {
        (super(...arguments), (this.code = "ERR_JWS_INVALID"));
      }
      static get code() {
        return "ERR_JWS_INVALID";
      }
    },
    "JWSSignatureVerificationFailed",
    0,
    class extends t {
      constructor() {
        (super(...arguments),
          (this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED"),
          (this.message = "signature verification failed"));
      }
      static get code() {
        return "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
      }
    },
    "JWTClaimValidationFailed",
    0,
    class extends t {
      static get code() {
        return "ERR_JWT_CLAIM_VALIDATION_FAILED";
      }
      constructor(e, t = "unspecified", r = "unspecified") {
        (super(e),
          (this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED"),
          (this.claim = t),
          (this.reason = r));
      }
    },
    "JWTExpired",
    0,
    class extends t {
      static get code() {
        return "ERR_JWT_EXPIRED";
      }
      constructor(e, t = "unspecified", r = "unspecified") {
        (super(e),
          (this.code = "ERR_JWT_EXPIRED"),
          (this.claim = t),
          (this.reason = r));
      }
    },
    "JWTInvalid",
    0,
    class extends t {
      constructor() {
        (super(...arguments), (this.code = "ERR_JWT_INVALID"));
      }
      static get code() {
        return "ERR_JWT_INVALID";
      }
    },
  ]);
};
