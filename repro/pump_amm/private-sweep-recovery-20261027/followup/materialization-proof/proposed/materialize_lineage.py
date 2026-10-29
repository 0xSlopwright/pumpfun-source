"""Keep whole verifier dependencies; archive references replace unused historical copies."""
from pathlib import Path
import hashlib,json

# Directly required by verify_new_proofs.py and verify_recovery.py. Each retained
# packet keeps its entire sealed inventory, including its own nested lineages.
RETAINED_LINEAGE = frozenset({
    'buy-event', 'cpi-branches', 'fourth', 'incentive-order',
    'independent-range', 'protocol-recipient', 'protocol-sweep',
    'range-joint', 'route-guard-component',
})

def lineage_ignore(source_lineage, replaced=(), retained_names=RETAINED_LINEAGE):
    source_lineage = Path(source_lineage).resolve()
    retained = frozenset(retained_names) - set(replaced)
    def ignore(directory, names):
        directory = Path(directory)
        if directory.resolve() != source_lineage:
            return []
        return [n for n in names if (directory/n).is_dir() and n not in retained]
    return ignore

def omission_record(checkpoint, replaced=(), repository_root=None, retained_names=RETAINED_LINEAGE):
    """Bind archive-only trees to their unchanged checkpoint manifest, without rehashing GBs."""
    checkpoint = Path(checkpoint)
    repository_root = Path(repository_root) if repository_root is not None else None
    portable = lambda p: str(p.relative_to(repository_root)) if repository_root is not None else str(p)
    results = checkpoint/'results'
    manifest = results/'manifest.json'
    entries = json.loads(manifest.read_bytes())
    lineage = results/'new-proofs/lineage'
    omitted = []
    for child in sorted(lineage.iterdir()):
        if not child.is_dir() or child.name in frozenset(retained_names)-set(replaced):
            continue
        assert not child.is_symlink()
        prefix = 'new-proofs/lineage/'+child.name+'/'
        members = {k[len(prefix):]:v for k,v in entries.items() if k.startswith(prefix)}
        actual = {str(p.relative_to(child)):p.stat().st_size for p in child.rglob('*') if p.is_file()}
        assert members.keys() == actual.keys(), ('Archive inventory differs', child)
        omitted.append({'name':child.name,
                        'reason':'replaced_current_packet' if child.name in replaced else 'unreferenced_historical_packet',
                        'archive_path':portable(child), 'files':len(members), 'bytes':sum(actual.values()),
                        'subtree_hashes_sha256':hashlib.sha256(json.dumps(members,sort_keys=True,separators=(',',':')).encode()).hexdigest()})
    prior_record = results/'new-proofs/lineage-omissions.json'
    prior = {'path':portable(prior_record),'sha256':hashlib.sha256(prior_record.read_bytes()).hexdigest()} if prior_record.exists() else None
    return {'schema':1,'prior_omission_record':prior,'scope':'Only entire unreferenced/replaced top-level lineage directories are omitted. Retained sealed packets and current receipts stay complete.',
            'archive_checkpoint':portable(checkpoint),
            'archive_results_manifest_sha256':hashlib.sha256(manifest.read_bytes()).hexdigest(),
            'retained_lineage':sorted(retained_names), 'omitted':omitted}
