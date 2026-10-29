from pathlib import Path
import argparse, json
import proof
parser = argparse.ArgumentParser()
parser.add_argument('--repo', type=Path, default=Path('.'))
args = parser.parse_args()
print(json.dumps(proof.check(Path(__file__).resolve().parent, args.repo.resolve()), indent=2))
