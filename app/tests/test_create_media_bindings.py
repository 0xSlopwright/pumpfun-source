"""Authenticate Create media source bindings without executing captured JavaScript."""
import copy
import hashlib
import json
from pathlib import Path
import re
import unittest
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]


def digest(data):
    return hashlib.sha256(data).hexdigest()


def verify_bindings(root=ROOT, packet=None):
    packet = packet or json.loads((root / 'contracts/create-media-bindings.json').read_text(encoding='utf-8'))
    manifest = json.loads((root / 'evidence/web/manifest.json').read_text(encoding='utf-8'))
    modules = json.loads((root / 'recovered/modules.json').read_text(encoding='utf-8'))['modules']
    assert packet['route'] == '/create'
    assert packet['capturedAt'] == manifest['captured_at']
    assert packet['userAgent'] == manifest['user_agent']
    assert packet['productionOperationsImplemented'] == packet['productionOperationsQualified'] == 0
    records = {row['path']: row for row in manifest['records']}
    objects = {}
    for item in packet['objects']:
        record = records[item['path']]
        for key in ['path', 'url', 'bytes', 'sha256', 'status']:
            assert item[key] == record[key], key
        path = root / item['path']
        assert not path.is_symlink()
        data = path.read_bytes()
        assert len(data) == item['bytes'] and digest(data) == item['sha256']
        objects[item['path']] = data
    html = objects[packet['routeObject']].decode('utf-8')
    assert records[packet['routeObject']]['url'] == 'https://pump.fun/create'
    scripts = set(re.findall(r'<script[^>]+src="([^"]+)"', html))
    factories = {}
    for item in packet['factories']:
        origin = item['origin']
        assert urlparse(origin['url']).path in scripts, 'Factory is not in this route capture.'
        assert origin['url'] == records[origin['source']]['url']
        entry = [m for m in modules if m['ids'] == item['ids'] and m['sha256'] == item['sha256']]
        assert len(entry) == 1 and origin in entry[0]['origins'] and item['id'] in item['ids']
        # Resolve only within this exact route's authenticated script context, not global IDs.
        candidates = {(m['sha256'], o['source'], o['start'], o['end']) for m in modules
                      if item['id'] in m['ids'] for o in m['origins']
                      if urlparse(o['url']).path in scripts}
        assert candidates == {(item['sha256'], origin['source'], origin['start'], origin['end'])}
        source = objects[origin['source']].decode('utf-8').encode('utf-16-le')
        factory = source[origin['start'] * 2:origin['end'] * 2].decode('utf-16-le')
        assert digest(factory.encode('utf-8')) == item['sha256']
        factories[item['id']] = factory
    assert set(factories) == {734638, 729047, 778435, 759257, 503630, 30181, 402030, 898661, 15086, 586090}
    for source, target in packet['importEdges']:
        assert source in factories and target in factories
        assert re.search(r'\.[ir]\(' + str(target) + r'\)', factories[source]), (source, target)
    # These anchors are checked only after complete object/factory authentication.
    anchors = {
        734638: ['eZ.w', 'imageIpfsHash:d'],
        729047: ['"GET /ipfs/pinata-presigned",{credentials:"include"}',
                 'tU.upload.public.file(t).url(e)', 'tU.upload.public.json(t).url(e)',
                 'new File([new Blob([JSON.stringify(e)])],"data.json",{type:"application/json"})',
                 'metadataUri:`https://ipfs.io/ipfs/${r.cid}`'],
        778435: ['No image hash provided', 'createdOn:"https://pump.fun"', '{metadataUri:m}=await (0,r.o)(g)'],
        759257: ['clientServerUrl:(0,r.R)()', '(0,t.K)'],
        503630: ['"R",0,()=>"https://frontend-api-v3.pump.fun"'],
        30181: ['prefixUrl:t.clientServerUrl', 'credentials:"include"', 'e.createContractClient'],
        898661: ['[o,s]=t.split(" ",2)', 'method:o.toLowerCase()', '.json()'],
        15086: ['"POST /ipfs/token-metadata"', 'multipartFiles:["file"]', '"POST /ipfs/image"',
                '"GET /ipfs/pinata-presigned"', 'presignedUri:o.z.string()', 'metadataUri:o.z.string()'],
        586090: ['IMAGE:45e5', 'NAME_MAX_LENGTH:32', 'TICKER_MAX_LENGTH:10', 'DESCRIPTION_MAX_LENGTH:2e3'],
    }
    for module, tokens in anchors.items():
        for token in tokens:
            assert token in factories[module], (module, token)
    sdk = packet['sdkBoundary']
    data = (root / sdk['path']).read_bytes()
    assert digest(data) == sdk['sha256']
    source = data.decode('utf-8')
    for name in sdk['entrypoints']:
        assert f'async {name}(' in source
    assert 'uri: string;' in source
    return len(objects), len(factories)


class CreateMediaBindingTests(unittest.TestCase):
    def test_actual_capture_and_static_import_chain(self):
        self.assertEqual(verify_bindings(), (7, 10))

    def test_origin_range_hash_and_route_context_mutations_fail(self):
        packet = json.loads((ROOT / 'contracts/create-media-bindings.json').read_text(encoding='utf-8'))
        def bad_range(x): x['factories'][0]['origin']['start'] += 1
        def bad_hash(x): x['objects'][0]['sha256'] = '0' * 64
        def bad_origin(x): x['factories'][0]['origin']['source'] = x['factories'][1]['origin']['source']
        def bad_route(x): x['route'] = '/explore'
        def bad_edge(x): x['importEdges'][0] = [503630, 734638]
        def sdk_changed(x): x['sdkBoundary']['sha256'] = '0' * 64
        def invented_qualification(x): x['productionOperationsQualified'] = 1
        for mutate in [bad_range, bad_hash, bad_origin, bad_route, bad_edge, sdk_changed, invented_qualification]:
            with self.subTest(mutation=mutate.__name__):
                changed = copy.deepcopy(packet); mutate(changed)
                with self.assertRaises(AssertionError): verify_bindings(packet=changed)


if __name__ == '__main__':
    unittest.main()
