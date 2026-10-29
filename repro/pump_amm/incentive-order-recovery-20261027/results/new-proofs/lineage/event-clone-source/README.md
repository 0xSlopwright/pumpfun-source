# Seven original-backed event borrow corrections

This uncompiled source patch is based on frozen 653 candidate `3f6190cae0e52a583dacddef9f55bc8f1b512489744242e05e0ea3ed8b5d26e4`. It changes exactly seven `emit!(event.clone())` expressions to `emit!(event)` in six files. Event fields, CPI emission, checks, state operations, and every other source byte are preserved. Sweep is excluded because another worker owns that same correction.

Each selected original calls the exact matching Event::data body twice with the same known event self-pointer. Each corresponding baseline handler passes two different stack event addresses. The source retains a Clone expression at precisely that first emission. The patch removes the unnecessary materialization and retains both borrows. This is a source-structure recovery hypothesis, not a compiled code-match or runtime claim.

| Event / handler | Original handler | Original self offsets | Baseline self offsets |
| --- | ---: | --- | --- |
| CreatePoolEvent | `0x2ba60` | -664, -664 | -608, -944 |
| InitBoostEvent | `0x1ef90` | -480, -480 | -400, -528 |
| AdminCtoPoolEvent | `0x14920` | -512, -512 | -432, -592 |
| ExtendAccountEvent | `0x2e720` | -536, -536 | -544, -360 |
| SellEvent / legacy sell | `0x49b50` | -896, -896 | -648, -1192 |
| BuyEvent / boost buy-and-burn | `0x1fed8` | -1472, -1472 | -1336, -1848 |
| BoostBuyAndBurnEvent | `0x1fed8` | -816, -816 | -1336, -680 |

`scan.py` propagates known stack-address register values over the complete intrafunction control-flow graph. Conflicting paths merge to unknown. Unknown writes and LDDW invalidate facts; calls clobber r0-r5. Stack loads are not assumed to retain pointer values. This deliberately leaves the private MultiHop event helpers unknown instead of guessing. The report records exact original and baseline call offsets, complete matching Event::data targets, and every intervening direct call. AccountInfo cloning for CPI remains present and is not treated as event cloning.

The CreateConfig and UpdateFeeConfig bodies already match and are excluded. Deposit, Withdraw, legacy Buy and the three V2 handlers already serialize the same event address and are exclusion controls. Private/inlined serialization sites in other admin, incentive and creator handlers are outside this patch. No statement is made that every remaining Clone expression is wrong or that original code has no other cloning.

The verifier binds the 52-file baseline source inventory to its real build record, authenticates both baseline ELF files and the original ELF, checks the exact seven-expression patch, and recomputes every selected/control pointer result. Dependency authentication, compilation, resulting window counts and runtime tests belong to the future combined candidate.

```sh
python3 -B /absolute/packet/verify.py --root /absolute/repository
```

Python API: `verify(root)`. Only the original ELF is read from `root`; the baseline source, binary, symbols, scanner and proof are bundled. No private work path is opened from recorded metadata. All prior packets remain unchanged.
