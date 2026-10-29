// Recovered Turbopack factory. Requires original runtime/import IDs; not a standalone source module.
(e) => {
  var t,
    n,
    r = e.i(753887),
    s = e.i(679877);
  let o = {},
    a = {},
    i = (e, t) => {
      a[e] = t;
    },
    c = (e) => {
      class t extends Error {
        cause;
        constructor(n, r, s) {
          if (
            (super(n || e, s),
            Object.setPrototypeOf(this, t.prototype),
            (this.name = e),
            r)
          )
            for (let e in r) this[e] = r[e];
          if (s && "object" == typeof s && "cause" in s && !this.cause) {
            let e = s.cause;
            ((this.cause = e),
              "stack" in e &&
                (this.stack = this.stack + "\nCAUSE: " + e.stack));
          }
        }
      }
      return ((o[e] = t), t);
    };
  (c("AccountNameRequired"),
    c("AccountNotSupported"),
    c("AccountAwaitingSendPendingOperations"),
    c("AmountRequired"),
    c("BluetoothRequired"),
    c("BtcUnmatchedApp"),
    c("CantOpenDevice"),
    c("CashAddrNotSupported"),
    c("ClaimRewardsFeesWarning"),
    c("CurrencyNotSupported"),
    c("DeviceAppVerifyNotSupported"),
    c("DeviceGenuineSocketEarlyClose"),
    c("DeviceNotGenuine"),
    c("DeviceOnDashboardExpected"),
    c("DeviceOnDashboardUnexpected"),
    c("DeviceInOSUExpected"),
    c("DeviceHalted"),
    c("DeviceNameInvalid"),
    c("DeviceSocketFail"),
    c("DeviceSocketNoBulkStatus"),
    c("DeviceSocketNoBulkStatus"),
    c("UnresponsiveDeviceError"));
  let l = c("DisconnectedDevice"),
    d = c("DisconnectedDeviceDuringOperation");
  (c("DeviceExtractOnboardingStateError"),
    c("DeviceOnboardingStatePollingError"),
    c("EnpointConfig"),
    c("EthAppPleaseEnableContractData"),
    c("SolAppPleaseEnableContractData"),
    c("CeloAppPleaseEnableContractData"),
    c("FeeEstimationFailed"),
    c("FirmwareNotRecognized"),
    c("HardResetFail"),
    c("InvalidXRPTag"),
    c("InvalidAddress"),
    c("InvalidNonce"),
    c("InvalidAddressBecauseDestinationIsAlsoSource"),
    c("LatestMCUInstalledError"),
    c("LatestFirmwareVersionRequired"),
    c("UnsupportedFeatureError"),
    c("NanoSNotSupported"),
    c("UnknownMCU"),
    c("LedgerAPIError"),
    c("LedgerAPIErrorWithMessage"),
    c("LedgerAPINotAvailable"),
    c("ManagerAppAlreadyInstalled"),
    c("ManagerAppRelyOnBTC"),
    c("ManagerAppDepInstallRequired"),
    c("ManagerAppDepUninstallRequired"),
    c("ManagerDeviceLocked"),
    c("ManagerFirmwareNotEnoughSpace"),
    c("ManagerNotEnoughSpace"),
    c("ManagerUninstallBTCDep"),
    c("NetworkDown"),
    c("NetworkError"),
    c("NoAddressesFound"),
    c("NotEnoughBalance"),
    c("NotEnoughBalanceFees"),
    c("NotEnoughBalanceSwap"),
    c("NotEnoughBalanceToDelegate"),
    c("UnstakeNotEnoughStakedBalanceLeft"),
    c("RestakeNotEnoughStakedBalanceLeft"),
    c("NotEnoughToRestake"),
    c("NotEnoughToUnstake"),
    c("NotEnoughBalanceInParentAccount"),
    c("NotEnoughSpendableBalance"),
    c("NotEnoughBalanceBecauseDestinationNotCreated"),
    c("NotEnoughToStake"),
    c("NoAccessToCamera"),
    c("NotEnoughGas"),
    c("NotEnoughGasSwap"),
    c("TronEmptyAccount"),
    c("MaybeKeepTronAccountAlive"),
    c("NotSupportedLegacyAddress"),
    c("GasLessThanEstimate"),
    c("PriorityFeeTooLow"),
    c("PriorityFeeTooHigh"),
    c("PriorityFeeHigherThanMaxFee"),
    c("MaxFeeTooLow"),
    c("PasswordsDontMatch"),
    c("PasswordIncorrect"),
    c("RecommendSubAccountsToEmpty"),
    c("RecommendUndelegation"),
    c("TimeoutTagged"),
    c("UnexpectedBootloader"),
    c("MCUNotGenuineToDashboard"),
    c("RecipientRequired"),
    c("UnavailableTezosOriginatedAccountReceive"),
    c("UnavailableTezosOriginatedAccountSend"),
    c("UpdateFetchFileFail"),
    c("UpdateIncorrectHash"),
    c("UpdateIncorrectSig"),
    c("UpdateYourApp"),
    c("UserRefusedDeviceNameChange"),
    c("UserRefusedAddress"),
    c("UserRefusedFirmwareUpdate"),
    c("UserRefusedAllowManager"),
    c("UserRefusedOnDevice"),
    c("PinNotSet"),
    c("ExpertModeRequired"));
  let u = c("TransportOpenUserCancelled");
  c("TransportInterfaceNotAvailable");
  let h = c("TransportRaceCondition");
  (c("TransportWebUSBGestureRequired"),
    c("TransactionHasBeenValidatedError"),
    c("TransportExchangeTimeoutError"),
    c("DeviceShouldStayInApp"),
    c("WebsocketConnectionError"),
    c("WebsocketConnectionFailed"),
    c("WrongDeviceForAccount"),
    c("WrongDeviceForAccountPayout"),
    c("MissingSwapPayloadParamaters"),
    c("WrongDeviceForAccountRefund"),
    c("WrongAppForCurrency"),
    c("ETHAddressNonEIP"),
    c("CantScanQRCode"),
    c("FeeNotLoaded"),
    c("FeeNotLoadedSwap"),
    c("FeeRequired"),
    c("FeeTooHigh"),
    c("PendingOperation"),
    c("SyncError"),
    c("PairingFailed"),
    c("PeerRemovedPairing"),
    c("GenuineCheckFailed"),
    c("LedgerAPI4xx"),
    c("LedgerAPI5xx"),
    c("FirmwareOrAppUpdateRequired"),
    c("ReplacementTransactionUnderpriced"),
    c("OpReturnSizeLimit"),
    c("DustLimit"),
    c("LanguageNotFound"),
    c("NoDBPathGiven"),
    c("DBWrongPassword"),
    c("DBNotReset"),
    c("SequenceNumberError"),
    c("DisabledTransactionBroadcastError"),
    ((t = n || (n = {})).Unknown = "Unknown"),
    (t.LocationServicesDisabled = "LocationServicesDisabled"),
    (t.LocationServicesUnauthorized = "LocationServicesUnauthorized"),
    (t.BluetoothScanStartFailed = "BluetoothScanStartFailed"));
  class p extends Error {
    id;
    constructor(e, t) {
      let n = "TransportError";
      (super(e || n),
        (this.name = n),
        (this.message = e),
        (this.stack = Error(e).stack),
        (this.id = t));
    }
  }
  i("TransportError", (e) => new p(e.message, e.id));
  let E = {
    ACCESS_CONDITION_NOT_FULFILLED: 38916,
    ALGORITHM_NOT_SUPPORTED: 38020,
    CLA_NOT_SUPPORTED: 28160,
    CODE_BLOCKED: 38976,
    CODE_NOT_INITIALIZED: 38914,
    COMMAND_INCOMPATIBLE_FILE_STRUCTURE: 27009,
    CONDITIONS_OF_USE_NOT_SATISFIED: 27013,
    CONTRADICTION_INVALIDATION: 38928,
    CONTRADICTION_SECRET_CODE_STATUS: 38920,
    DEVICE_IN_RECOVERY_MODE: 26159,
    CUSTOM_IMAGE_EMPTY: 26158,
    FILE_ALREADY_EXISTS: 27273,
    FILE_NOT_FOUND: 37892,
    GP_AUTH_FAILED: 25344,
    HALTED: 28586,
    INCONSISTENT_FILE: 37896,
    INCORRECT_DATA: 27264,
    INCORRECT_LENGTH: 26368,
    INCORRECT_P1_P2: 27392,
    INS_NOT_SUPPORTED: 27904,
    DEVICE_NOT_ONBOARDED: 27911,
    DEVICE_NOT_ONBOARDED_2: 26129,
    INVALID_KCV: 38021,
    INVALID_OFFSET: 37890,
    LICENSING: 28482,
    LOCKED_DEVICE: 21781,
    MAX_VALUE_REACHED: 38992,
    MEMORY_PROBLEM: 37440,
    MISSING_CRITICAL_PARAMETER: 26624,
    NO_EF_SELECTED: 37888,
    NOT_ENOUGH_MEMORY_SPACE: 27268,
    OK: 36864,
    PIN_REMAINING_ATTEMPTS: 25536,
    REFERENCED_DATA_NOT_FOUND: 27272,
    SECURITY_STATUS_NOT_SATISFIED: 27010,
    TECHNICAL_PROBLEM: 28416,
    UNKNOWN_APDU: 27906,
    USER_REFUSED_ON_DEVICE: 21761,
    NOT_ENOUGH_SPACE: 20738,
    APP_NOT_FOUND_OR_INVALID_CONTEXT: 20771,
    INVALID_APP_NAME_LENGTH: 26378,
    GEN_AES_KEY_FAILED: 21529,
    INTERNAL_CRYPTO_OPERATION_FAILED: 21530,
    INTERNAL_COMPUTE_AES_CMAC_FAILED: 21531,
    ENCRYPT_APP_STORAGE_FAILED: 21532,
    INVALID_BACKUP_STATE: 26178,
    PIN_NOT_SET: 21762,
    INVALID_BACKUP_LENGTH: 26419,
    INVALID_RESTORE_STATE: 26179,
    INVALID_CHUNK_LENGTH: 26420,
    INVALID_BACKUP_HEADER: 26698,
    TRUSTCHAIN_WRONG_SEED: 45063,
  };
  function T(e) {
    switch (e) {
      case 26368:
        return "Incorrect length";
      case 26624:
        return "Missing critical parameter";
      case 27010:
        return "Security not satisfied (dongle locked or have invalid access rights)";
      case 27013:
        return "Condition of use not satisfied (denied by the user?)";
      case 27264:
        return "Invalid data received";
      case 27392:
        return "Invalid parameter received";
      case 21781:
        return "Locked device";
    }
    if (28416 <= e && e <= 28671) return "Internal error, please report";
  }
  class g extends Error {
    statusCode;
    statusText;
    constructor(e, { canBeMappedToChildError: t = !0 } = {}) {
      let n = Object.keys(E).find((t) => E[t] === e) || "UNKNOWN_ERROR",
        r = T(e) || n,
        s = e.toString(16),
        o = `Ledger device: ${r} (0x${s})`;
      if (
        (super(o),
        (this.name = "TransportStatusError"),
        (this.statusCode = e),
        (this.statusText = n),
        Object.setPrototypeOf(this, g.prototype),
        t && e === E.LOCKED_DEVICE)
      )
        return new m(o);
    }
  }
  class m extends g {
    constructor(e) {
      (super(E.LOCKED_DEVICE, { canBeMappedToChildError: !1 }),
        e && (this.message = e),
        (this.name = "LockedDeviceError"),
        Object.setPrototypeOf(this, m.prototype));
    }
  }
  (i("TransportStatusError", (e) => new g(e.statusCode)),
    e.s(
      [
        "w",
        0,
        l,
        "X",
        0,
        d,
        "R",
        0,
        E,
        "k",
        0,
        p,
        "N",
        0,
        u,
        "j",
        0,
        h,
        "e",
        0,
        g,
        "E",
        0,
        T,
      ],
      97209,
    ));
  let N = 0,
    A = [];
  class _ {
    type;
    context;
    constructor(e, t) {
      ((this.type = e), (this.context = t));
    }
    trace(e, t) {
      (({ type: e, message: t, data: n, context: r }) => {
        let s = { type: e, id: String(++N), date: new Date() };
        (t && (s.message = t), n && (s.data = n), r && (s.context = r), D(s));
      })({ type: this.type, message: e, data: t, context: this.context });
    }
    getContext() {
      return this.context;
    }
    setContext(e) {
      this.context = e;
    }
    updateContext(e) {
      this.context = { ...this.context, ...e };
    }
    getType() {
      return this.type;
    }
    setType(e) {
      this.type = e;
    }
    withType(e) {
      return new _(e, this.context);
    }
    withContext(e) {
      return new _(this.type, e);
    }
    withUpdatedContext(e) {
      return new _(this.type, { ...this.context, ...e });
    }
  }
  function D(e) {
    for (let t = 0; t < A.length; t++)
      try {
        A[t](e);
      } catch (e) {
        console.error(e);
      }
  }
  ("u" > typeof window &&
    (window.__ledgerLogsListen = (e) => (
      A.push(e),
      () => {
        let t = A.indexOf(e);
        -1 !== t && ((A[t] = A[A.length - 1]), A.pop());
      }
    )),
    e.s(
      [
        "V",
        0,
        _,
        "d",
        0,
        (e, t, n) => {
          let r = { type: e, id: String(++N), date: new Date() };
          (t && (r.message = t), n && (r.data = n), D(r));
        },
      ],
      547975,
    ),
    e.s(
      [
        "f",
        0,
        class {
          exchangeTimeout = 3e4;
          unresponsiveTimeout = 15e3;
          deviceModel = null;
          tracer;
          constructor({ context: e, logType: t } = {}) {
            this.tracer = new _(t ?? "transport", e);
          }
          static isSupported;
          static list;
          static listen;
          static open;
          exchange(e, { abortTimeoutMs: t } = {}) {
            throw Error("exchange not implemented");
          }
          exchangeBulk(e, t) {
            let n = !1;
            return (
              (async () => {
                if (!n)
                  for (let r of e) {
                    let e = await this.exchange(r);
                    if (n) return;
                    let s = e.readUInt16BE(e.length - 2);
                    if (s !== E.OK) throw new g(s);
                    t.next(e);
                  }
              })().then(
                () => !n && t.complete(),
                (e) => !n && t.error(e),
              ),
              {
                unsubscribe: () => {
                  n = !0;
                },
              }
            );
          }
          setScrambleKey(e) {}
          close() {
            return Promise.resolve();
          }
          _events = new s.default();
          on(e, t) {
            this._events.on(e, t);
          }
          off(e, t) {
            this._events.removeListener(e, t);
          }
          emit(e, ...t) {
            this._events.emit(e, ...t);
          }
          setDebugMode() {
            console.warn(
              "setDebugMode is deprecated. use @ledgerhq/logs instead. No logs are emitted in this anymore.",
            );
          }
          setExchangeTimeout(e) {
            this.exchangeTimeout = e;
          }
          setExchangeUnresponsiveTimeout(e) {
            this.unresponsiveTimeout = e;
          }
          send = async (
            e,
            t,
            n,
            s,
            o = r.Buffer.alloc(0),
            a = [E.OK],
            { abortTimeoutMs: i } = {},
          ) => {
            let c = this.tracer.withUpdatedContext({ function: "send" });
            if (o.length >= 256)
              throw (
                c.trace("data.length exceeded 256 bytes limit", {
                  dataLength: o.length,
                }),
                new p(
                  "data.length exceed 256 bytes limit. Got: " + o.length,
                  "DataLengthTooBig",
                )
              );
            let l = await this.exchange(
                r.Buffer.concat([
                  r.Buffer.from([e, t, n, s]),
                  r.Buffer.from([o.length]),
                  o,
                ]),
                { abortTimeoutMs: i },
              ),
              d = l.readUInt16BE(l.length - 2);
            if (!a.some((e) => e === d)) throw new g(d);
            return l;
          };
          static create(e = 3e3, t) {
            return new Promise((n, r) => {
              let s = !1,
                o = this.listen({
                  next: (t) => {
                    ((s = !0),
                      o && o.unsubscribe(),
                      a && clearTimeout(a),
                      this.open(t.descriptor, e).then(n, r));
                  },
                  error: (e) => {
                    (a && clearTimeout(a), r(e));
                  },
                  complete: () => {
                    (a && clearTimeout(a),
                      s ||
                        r(
                          new p(
                            this.ErrorMessage_NoDeviceFound,
                            "NoDeviceFound",
                          ),
                        ));
                  },
                }),
                a = t
                  ? setTimeout(() => {
                      (o.unsubscribe(),
                        r(
                          new p(
                            this.ErrorMessage_ListenTimeout,
                            "ListenTimeout",
                          ),
                        ));
                    }, t)
                  : null;
            });
          }
          exchangeBusyPromise;
          async exchangeAtomicImpl(e) {
            let t,
              n = this.tracer.withUpdatedContext({
                function: "exchangeAtomicImpl",
                unresponsiveTimeout: this.unresponsiveTimeout,
              });
            if (this.exchangeBusyPromise)
              throw (
                n.trace("Atomic exchange is already busy"),
                new h(
                  "An action was already pending on the Ledger device. Please deny or reconnect.",
                )
              );
            let r = new Promise((e) => {
              t = e;
            });
            this.exchangeBusyPromise = r;
            let s = !1,
              o = setTimeout(() => {
                (n.trace(
                  'Timeout reached, emitting Transport event "unresponsive"',
                  { unresponsiveTimeout: this.unresponsiveTimeout },
                ),
                  (s = !0),
                  this.emit("unresponsive"));
              }, this.unresponsiveTimeout);
            try {
              let t = await e();
              return (
                s &&
                  (n.trace("Device was unresponsive, emitting responsive"),
                  this.emit("responsive")),
                t
              );
            } finally {
              (n.trace("Finalize, clearing busy guard"),
                clearTimeout(o),
                t && t(),
                (this.exchangeBusyPromise = null));
            }
          }
          decorateAppAPIMethods(e, t, n) {
            for (let r of t) e[r] = this.decorateAppAPIMethod(r, e[r], e, n);
          }
          _appAPIlock = null;
          decorateAppAPIMethod(e, t, n, r) {
            return async (...s) => {
              let { _appAPIlock: o } = this;
              if (o)
                return Promise.reject(
                  new p(
                    "Ledger Device is busy (lock " + o + ")",
                    "TransportLocked",
                  ),
                );
              try {
                return (
                  (this._appAPIlock = e),
                  this.setScrambleKey(r),
                  await t.apply(n, s)
                );
              } finally {
                this._appAPIlock = null;
              }
            };
          }
          setTraceContext(e) {
            this.tracer = this.tracer.withContext(e);
          }
          updateTraceContext(e) {
            this.tracer.updateContext(e);
          }
          getTraceContext() {
            return this.tracer.getContext();
          }
          static ErrorMessage_ListenTimeout =
            "No Ledger device found (timeout)";
          static ErrorMessage_NoDeviceFound = "No Ledger device found";
        },
      ],
      946269,
    ));
};
