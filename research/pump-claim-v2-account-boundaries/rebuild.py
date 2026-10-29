"""Replay this source archive using the authenticated shared source-only builder."""
from pathlib import Path
import hashlib
import importlib.util

P = Path(__file__).resolve().parent
R = P.parents[1]
shared = R / "research/pump-multi-hop-quote-admission/rebuild.py"
if hashlib.sha256(shared.read_bytes()).hexdigest() != "8322875158a21ad97591db3eea8eba2622554674da0aad2d96173d402c40261d":
    raise ValueError("shared rebuild tool changed")
spec = importlib.util.spec_from_file_location("claim_shared_rebuild", shared)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.PACKET, module.ROOT = P, R
if __name__ == "__main__":
    module.main()
