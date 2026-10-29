#!/usr/bin/env python3
"""Pin the upstream IDL evidence to a fixed trust root.

`scripts/verify_evidence.py` re-hashes the three upstream IDLs against
`evidence/upstream/provenance.json`. That provenance document is itself
unhashed, so the expected digests can be rewritten to match substituted IDL
bytes, and deleting an IDL together with its entry still exits 0. Two of the
six files in `evidence/upstream/` are never read by any checker.

This gate pins all six upstream files, the documented upstream repository and
commit, the published program addresses and instruction counts, and binds both
`evidence/interface-inventory.json` and `docs/SCOPE.md` to those bytes. A
substituted, deleted or added upstream file is a hard failure.
"""
import hashlib
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]
UPSTREAM = pathlib.Path('evidence/upstream')
INVENTORY = pathlib.Path('evidence/interface-inventory.json')
SCOPE = pathlib.Path('docs/SCOPE.md')

REPOSITORY = 'https://github.com/pump-fun/pump-public-docs'
COMMIT = '639b87fb45c3adeffa6f7c4a1bf0cb85e392bf22'
COMMIT_PATTERN = re.compile(r'[0-9a-f]{40}')
SCOPE_SOURCES = (
    'docs/PUMP_PROGRAM_README.md',
    'docs/PUMP_SWAP_README.md',
    'idl/pump_fees.json',
    'docs/instructions/COIN_CREATION.md',
)
FILE_SHA256 = {
    'official-repositories.json': '401fbb93890aa2273dd33fcebea246194779136df0265f35c735bcba104a0420',
    'provenance.json': 'a315baa42e9ab40e70f31f541199983c2a5a2883571dbd3dfee8b690518b68b2',
    'pump.json': '7616681ea557975f9f623ac211080f22a93060781eaf4765b0a488d980997207',
    'pump_amm.json': 'b7d8c57a4d9c4dd0109a9ab893052352333252d4eedced10ac091d4d66cab89b',
    'pump_fees.json': '6b9fa3eccc6e06273076a47b581f9fcb9e531bb7c3c88acbcd44db55a4002b29',
    'tree.txt': '661d12efd5cd8c1983e21e985510f0ae9042d2b66dd14c82e804145a966a8afe',
}
IDL_ADDRESS = {
    'pump.json': '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P',
    'pump_amm.json': 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA',
    'pump_fees.json': 'pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ',
}
IDL_INSTRUCTIONS = {'pump.json': 56, 'pump_amm.json': 38, 'pump_fees.json': 31}
IDL_STEM = {'pump.json': 'pump', 'pump_amm.json': 'pump_amm', 'pump_fees.json': 'pump_fees'}
UPSTREAM_REPOSITORY_COUNT = 5


class UpstreamEvidenceError(AssertionError):
    """Raised when published upstream evidence does not match its trust root."""


def require(condition, message):
    if not condition:
        raise UpstreamEvidenceError(message)


def sha256(contents):
    return hashlib.sha256(contents).hexdigest()


def read(path):
    require(path.is_file(), f'missing upstream evidence file: {path}')
    return path.read_bytes()


def parse_json(contents, label):
    try:
        return json.loads(contents.decode('utf-8'))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise UpstreamEvidenceError(f'{label} is not valid UTF-8 JSON: {error}') from error


def check_file_set(upstream, counts):
    present = sorted(entry.name for entry in upstream.iterdir())
    expected = sorted(FILE_SHA256)
    require(
        present == expected,
        f'upstream evidence set differs from the pinned set; '
        f'missing={sorted(set(expected) - set(present))} '
        f'unexpected={sorted(set(present) - set(expected))}',
    )
    counts['files'] = len(expected)


def check_file_digests(upstream, counts):
    for name, expected in FILE_SHA256.items():
        actual = sha256(read(upstream / name))
        require(actual == expected, f'{name} sha256 {actual} does not match pinned {expected}')
        counts['digests'] = counts.get('digests', 0) + 1


def check_provenance(upstream, counts):
    record = parse_json(read(upstream / 'provenance.json'), 'provenance.json')
    require(isinstance(record, dict), 'provenance.json must be a JSON object')
    require(record.get('repository') == REPOSITORY, f"provenance repository {record.get('repository')!r} is not the pinned {REPOSITORY!r}")
    commit = record.get('commit')
    require(isinstance(commit, str) and COMMIT_PATTERN.fullmatch(commit), 'provenance commit must be a 40-character hex revision')
    require(commit == COMMIT, f'provenance commit {commit} is not the pinned {COMMIT}')
    sources = record.get('scope_sources')
    require(sources == list(SCOPE_SOURCES), f'provenance scope_sources {sources!r} is not the pinned {list(SCOPE_SOURCES)!r}')
    digests = record.get('file_sha256')
    require(isinstance(digests, dict), 'provenance file_sha256 must be an object')
    require(
        sorted(digests) == sorted(IDL_ADDRESS),
        f'provenance file_sha256 names {sorted(digests)}, expected {sorted(IDL_ADDRESS)}',
    )
    for name, digest in digests.items():
        require(digest == FILE_SHA256[name], f'provenance digest for {name} does not match the pinned digest')
        require(re.fullmatch(r'[0-9a-f]{64}', str(digest)), f'provenance digest for {name} is not a sha256 hex string')
    require(isinstance(record.get('retrieved_at_utc'), str) and record['retrieved_at_utc'], 'provenance retrieved_at_utc must be a non-empty string')
    counts['provenance_fields'] = 5


def check_tree_listing(upstream, counts):
    text = read(upstream / 'tree.txt').decode('utf-8')
    lines = text.splitlines()
    require(lines, 'tree.txt is empty')
    require(all(line.strip() == line and line for line in lines), 'tree.txt has blank or padded lines')
    require(len(set(lines)) == len(lines), 'tree.txt repeats a path')
    require(lines == sorted(lines), 'tree.txt is not sorted')
    missing = [source for source in SCOPE_SOURCES if source not in lines]
    require(not missing, f'tree.txt omits documented scope sources: {missing}')
    missing_idl = [f'idl/{name}' for name in IDL_ADDRESS if f'idl/{name}' not in lines]
    require(not missing_idl, f'tree.txt omits pinned IDLs: {missing_idl}')
    counts['tree_entries'] = len(lines)


def check_official_repositories(upstream, counts):
    entries = parse_json(read(upstream / 'official-repositories.json'), 'official-repositories.json')
    require(isinstance(entries, list), 'official-repositories.json must be a JSON array')
    require(len(entries) == UPSTREAM_REPOSITORY_COUNT, f'official-repositories.json lists {len(entries)} repositories, expected {UPSTREAM_REPOSITORY_COUNT}')
    names = []
    for entry in entries:
        require(isinstance(entry, dict), 'official-repositories entry must be an object')
        name = entry.get('name')
        url = entry.get('html_url')
        branch = entry.get('default_branch')
        require(isinstance(name, str) and name, 'official-repositories entry needs a name')
        require(isinstance(url, str) and url.startswith('https://github.com/pump-fun/'), f'official-repositories entry {name} is not a pump-fun GitHub URL: {url!r}')
        require(isinstance(branch, str) and branch, f'official-repositories entry {name} needs a default_branch')
        names.append(name)
    require(len(set(names)) == len(names), 'official-repositories.json repeats a repository name')
    pinned = [entry for entry in entries if entry.get('html_url') == REPOSITORY]
    require(len(pinned) == 1, f'official-repositories.json must list {REPOSITORY} exactly once')
    require(pinned[0].get('default_branch') == 'main', 'the pump-public-docs entry must declare the main default branch')
    counts['repositories'] = len(entries)


def check_idls(upstream, counts):
    documents = {}
    for name, address in IDL_ADDRESS.items():
        document = parse_json(read(upstream / name), name)
        require(isinstance(document, dict), f'{name} must be a JSON object')
        require(document.get('address') == address, f"{name} address {document.get('address')!r} does not match the published {address!r}")
        instructions = document.get('instructions')
        require(isinstance(instructions, list), f'{name} instructions must be an array')
        require(len(instructions) == IDL_INSTRUCTIONS[name], f'{name} declares {len(instructions)} instructions, pinned {IDL_INSTRUCTIONS[name]}')
        names = [instruction.get('name') for instruction in instructions if isinstance(instruction, dict)]
        require(len(names) == len(instructions), f'{name} has a malformed instruction entry')
        require(all(isinstance(entry, str) and entry for entry in names), f'{name} has an unnamed instruction')
        require(len(set(names)) == len(names), f'{name} repeats an instruction name')
        metadata = document.get('metadata')
        require(isinstance(metadata, dict), f'{name} metadata must be an object')
        require(metadata.get('name') == IDL_STEM[name], f"{name} metadata name {metadata.get('name')!r} does not match {IDL_STEM[name]!r}")
        documents[name] = document
        counts['idls'] = counts.get('idls', 0) + 1
    return documents


def check_inventory(root, documents, counts):
    inventory = parse_json(read(root / INVENTORY), str(INVENTORY))
    require(isinstance(inventory, dict), 'interface-inventory.json must be a JSON object')
    require(sorted(inventory) == sorted(IDL_STEM.values()), f'interface-inventory.json covers {sorted(inventory)}, expected {sorted(IDL_STEM.values())}')
    for name, document in documents.items():
        entry = inventory[IDL_STEM[name]]
        require(isinstance(entry, dict), f'interface-inventory {IDL_STEM[name]} entry must be an object')
        require(entry.get('address') == IDL_ADDRESS[name], f'interface-inventory {IDL_STEM[name]} address was not derived from the pinned {name}')
        require(entry.get('instructions') == len(document['instructions']), f'interface-inventory {IDL_STEM[name]} instruction count was not derived from the pinned {name}')
        require(entry.get('metadata') == document.get('metadata'), f'interface-inventory {IDL_STEM[name]} metadata was not derived from the pinned {name}')
        counts['inventory_entries'] = counts.get('inventory_entries', 0) + 1


def check_scope(root, counts):
    text = (root / SCOPE).read_text(encoding='utf-8')
    require(COMMIT in text, f'docs/SCOPE.md no longer cites the pinned upstream commit {COMMIT}')
    for name, address in IDL_ADDRESS.items():
        require(f'`{address}`' in text, f'docs/SCOPE.md no longer publishes the {IDL_STEM[name]} address {address}')
    scope_source_links = [source for source in SCOPE_SOURCES if source in text]
    require(len(scope_source_links) >= 1, 'docs/SCOPE.md no longer links any documented scope source')
    counts['scope_addresses'] = len(IDL_ADDRESS)


def check(root=ROOT):
    root = pathlib.Path(root).resolve()
    upstream = root / UPSTREAM
    require(upstream.is_dir(), f'missing upstream evidence directory: {upstream}')
    counts = {}
    check_file_set(upstream, counts)
    check_file_digests(upstream, counts)
    check_provenance(upstream, counts)
    check_tree_listing(upstream, counts)
    check_official_repositories(upstream, counts)
    documents = check_idls(upstream, counts)
    check_inventory(root, documents, counts)
    check_scope(root, counts)
    return counts


def main(argv):
    root = pathlib.Path(argv[1]) if len(argv) > 1 else ROOT
    counts = check(root)
    for name in ('files', 'digests', 'provenance_fields', 'tree_entries', 'repositories', 'idls', 'inventory_entries', 'scope_addresses'):
        print(f'{name}: {counts[name]}')
    print(f'upstream evidence pinned to {REPOSITORY}@{COMMIT}; no re-fetch and no source rebuild claimed.')
    return 0


if __name__ == '__main__':
    import sys

    try:
        sys.exit(main(sys.argv))
    except UpstreamEvidenceError as error:
        sys.stderr.write(f'UpstreamEvidenceError: {error}\n')
        sys.exit(1)
