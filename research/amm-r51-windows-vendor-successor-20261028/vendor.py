"""Recover only standard Cargo checksum JSON whose existing byte pin matches.

The source archive and every extracted source file remain unchanged. The only
extra encoding choice over the pinned Mayhem helper is lexical file-key order.
"""
import hashlib
import io
import json
from pathlib import PurePosixPath
import tarfile


def require(ok, message):
    if not ok:
        raise ValueError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def vendor_package(blob, output, record):
    directory = record['directory']
    require(sha(blob) == record['package_sha256'], 'registry archive differs: ' + directory)
    require(directory and directory not in ('.', '..') and
            PurePosixPath(directory).name == directory and
            ':' not in directory and '\\' not in directory, 'unsafe registry directory')
    contents = {}
    with tarfile.open(fileobj=io.BytesIO(blob), mode='r:gz') as archive:
        for member in archive:
            full = PurePosixPath(member.name)
            require(not full.is_absolute() and '..' not in full.parts and
                    ':' not in member.name and '\\' not in member.name and
                    full.parts and full.parts[0] == directory, 'unsafe crate member')
            if member.isdir():
                continue
            require(member.isfile() and member.name.startswith(directory + '/'),
                    'nonregular crate member')
            name = member.name[len(directory) + 1:]
            path = PurePosixPath(name)
            require(name and path.as_posix() == name and
                    name != '.cargo-checksum.json' and name not in contents,
                    'unsafe or duplicate crate path')
            contents[name] = archive.extractfile(member).read()
    require(len(contents) == record['file_count'], 'registry file count differs: ' + directory)
    checksums = {name: sha(data) for name, data in contents.items()}
    orders = (('archive', checksums),
              ('lexical', {name: checksums[name] for name in sorted(checksums)}))
    matches = {}
    newline = record.get('checksum_file_newline', '\n')
    require(newline in ('\n', '\r\n'), 'unsupported checksum newline')
    for order, files in orders:
        for top_order in ('files-package', 'package-files'):
            value = ({'files': files, 'package': record['package_sha256']}
                     if top_order == 'files-package'
                     else {'package': record['package_sha256'], 'files': files})
            for indent in (None, 2, 4):
                for separators in ((',', ':'), (',', ': '), None):
                    encoded = json.dumps(value, ensure_ascii=False, sort_keys=False,
                                         indent=indent, separators=separators)
                    for trailing in (False, True):
                        data = (encoded + ('\n' if trailing else '')).replace('\n', newline).encode()
                        if sha(data) == record['checksum_file_sha256']:
                            matches.setdefault(data, []).append({
                                'file_key_order': order, 'top_key_order': top_order,
                                'indent': indent, 'separators': separators,
                                'trailing_newline': trailing, 'newline': newline,
                                'ensure_ascii': False,
                            })
    require(len(matches) == 1, 'cannot reconstruct pinned vendor checksum map: ' + directory)
    data, encodings = next(iter(matches.items()))
    target = output / directory
    target.mkdir(parents=True, exist_ok=False)
    for name, source in contents.items():
        path = target / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(source)
    (target / '.cargo-checksum.json').write_bytes(data)
    return {
        'directory': directory, 'archive_sha256': sha(blob),
        'source_files': len(contents), 'checksum_file_sha256': sha(data),
        'matching_standard_encodings': encodings,
        'archive_order_matches': any(e['file_key_order'] == 'archive' for e in encodings),
        'lexical_order_matches': any(e['file_key_order'] == 'lexical' for e in encodings),
        'source_bytes_unchanged': True,
    }
