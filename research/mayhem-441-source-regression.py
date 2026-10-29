#!/usr/bin/env python3
"""Small source-level regression guard for the merged Mayhem 441 recovery.

This intentionally does not claim binary equivalence.  It protects the source
routing that was used to close O0083/O0084: the v2 handlers live in the shared
pump_interface_v2 module and the obsolete standalone BuyV2 handler is absent.

The 441 source is the shipped tree of the #432 packet
(research/claude-mayhem-441-20261028/sources/shipped); programs/mayhem still
holds the earlier reconstruction and does not have this routing.

Run from the repository root:
    python -B research/mayhem-441-source-regression.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "research/claude-mayhem-441-20261028/sources/shipped/src/instructions"
V2 = SRC / "pump_interface_v2.rs"
BUY = SRC / "buy_v2.rs"


def require(path: Path, needle: str) -> None:
    text = path.read_text(encoding="utf-8")
    if needle not in text:
        raise SystemExit(f"missing {needle!r} in {path}")


def forbid(path: Path, needle: str) -> None:
    text = path.read_text(encoding="utf-8")
    if needle in text:
        raise SystemExit(f"unexpected {needle!r} in {path}")


require(V2, "pub fn buy_v2_handler(")
require(V2, "pub fn sell_v2_handler(")
require(V2, "if native{")
require(V2, "emit_cpi!(event)")
forbid(BUY, "pub fn handler(ctx:Context<BuyV2>")

print("Mayhem 441 source regression checks: PASS")
