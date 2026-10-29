if not __debug__:
    raise SystemExit('Run without -O')
from pathlib import Path
import argparse, json
import proof

parser = argparse.ArgumentParser()
parser.add_argument('--repo', type=Path)
args = parser.parse_args()
packet = Path(__file__).resolve().parent
root = args.repo.resolve() if args.repo else next(p for p in packet.parents if (p / 'evidence/original/mayhem/deployed.so').is_file())
print(json.dumps(proof.check(packet, root), indent=2))
