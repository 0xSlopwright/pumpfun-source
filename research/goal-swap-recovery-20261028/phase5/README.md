# Whole-function immediate closure, 2026-10-28

One previously untested borrowed closure encloses the entire cashback body as
the function's tail expression. All ordinary returns and final `Ok(())` stay
inside the closure. Source rows 375 and 506 alone change; no feature attribute,
state, helper function or numeric padding is added.

The compiled ELF is
`9b96797104f8c47816744f89fde1e465b7e8101f4ebe0cf37f3e16406de404da`.
It has 778 normalized / 226 raw windows, no gain, and loses original caller
`0x49b50`. That caller grows from 9184 to 9224 bytes and no longer satisfies
rooted incoming binding. Cashback is 8960 bytes, has 76 canonical nodes and
fails the original 77-node bijection at the shared return-store node `0x960`.
The unordered multiset of all 80 actual depth-two callee identities is retained;
this weaker diagnostic does not repair the failed graph or caller.

The machine snapshot already has 82 blocks and no pure output-pointer reload
stubs before placement; it still has 82 blocks afterward. The exit remains
machine block80/IR556. This changes the function shape before placement instead
of selecting the original late reload within the original graph. The probe is
rejected. The optional move-capture spelling was not attempted after membership
and graph failure. No Linux qualification or runtime replay follows.

```sh
python3 -I -B research/goal-swap-recovery-20261028/phase5/analyze_saved.py
python3 -I -B research/goal-swap-recovery-20261028/phase5/verify_saved.py
```

The existing frozen matcher checks all785 original windows. Complete failed
maps, actual call identities, the caller failure and machine snapshots remain
under `whole-tail-closure/`. Both temporary69-file workspaces are restored.
No maintained Rust, emitted IR, object or ELF was edited.
