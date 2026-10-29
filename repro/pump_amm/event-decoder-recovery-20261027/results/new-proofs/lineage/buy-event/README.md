# BuyEvent declaration origin

Private candidate `30d7e1fb2a21f5ca84c0e0545925a440913379f6307c984b9a3f3693d4e831ea` is based on the sealed generated-getter candidate `6975715089a6dee2125e3157a4c579176aa893a386ffa748ed478f886d59f53b`. It retains **638/785 normalized windows and 128 raw windows**, with no gains or losses. It is not a selected or whole-ELF-identical artifact.

The only Rust change moves the complete unchanged `#[event] #[derive(Clone)] BuyEvent` declaration from trade.rs into the evidenced logical file `instructions/swap/buy.rs`. The `trade::BuyEvent` public re-export preserves callers, and swap/mod.rs adds the module declaration. No handler bodies, fields, ordering, constraints, arithmetic, derives or discriminators change. `provenance.json` binds the exact moved declaration block.

Original `BuyEvent::data` at `0xb1c98/6088` still matches the complete normalized body and relocation pattern. Its source descriptor now has the same filename as the original: `programs/pump-amm/src/instructions/swap/buy.rs`. **Coordinates remain different:** original 233:1, candidate 3:1. No padding or source-coordinate substitution was used. The current limited declaration move does not reconstruct the original full buy module.

The extended recognized-descriptor audit now has zero true unequal text/path observations, while retaining 20 false generic cross-pairings with valid alternatives. It keeps 583 bounded static/direct-call-closed windows, equal to this candidate's direct-call-closed count. This covers only recognized data and selected vtable slots; it does not establish complete data or indirect-call identity. Source-coordinate gaps remain.

Focused execution passes **98 cases / 196 signed transactions**: 16 successful buy event cases across both V2 instruction names, 18 buy executor/order boundaries, and 64 routes loading captured Pump. All recorded fields, raw-log hashes, identical message pairs and signatures are checked; comparison normalizes only compute lines and log source coordinates. The three admin call-frame diagnostics are inherited unchanged from the base. The root integration's full corpus/repeat build remains separate.

`recovery.patch` is incremental after the generated-getter patch. Its swap/mod.rs change is only `pub mod buy;`, so preserve any independently added validator or MultiHop module declarations when applying it.

Saved verification:

```sh
PYTHONDONTWRITEBYTECODE=1 work/test-env/bin/python -B work/amm-buy-event-origin-20261027/verify.py --root .
```

`run.py --candidate /absolute/candidate.so --output /absolute/new-output` replays the 98 cases in an intact evidence checkout. It now invokes the retained byte-identical producer snapshots and checks the recorded shared harness hashes; this routing adjustment was CLI checked after the actual replay, whose exact original commands remain in runtime/commands.json. `verify_runtime.py --root . --candidate ... --output ...` verifies a supplied replay. `verify_event.py --root . --candidate ... --symbols ...` reads the actual serializer and descriptor of an integrated build.
