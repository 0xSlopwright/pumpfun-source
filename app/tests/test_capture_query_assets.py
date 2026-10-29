"""Exercise URL discovery through the real capture pipeline without network access."""
import importlib.util
import json
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('capture',Path(__file__).resolve().parents[1]/'scripts/capture.py')
capture=importlib.util.module_from_spec(spec)
spec.loader.exec_module(capture)


class QueryAssetTests(unittest.TestCase):
    def test_deployment_queries_survive_html_css_and_chunk_discovery(self):
        bodies={
            'https://pump.fun/':b'<script src="/_next/static/chunks/app.js?dpl=rev&amp;mode=x"></script><link href="/style.css?v=7#ignored">',
            'https://pump.fun/_next/static/chunks/app.js?dpl=rev&mode=x':b'("static/chunks/child.js?dpl=rev")',
            'https://pump.fun/style.css?v=7':b'@font-face {src:url("fonts/a.woff2?v=2#font")}',
            'https://pump.fun/_next/static/chunks/child.js?dpl=rev':b'const child=1;',
            'https://pump.fun/fonts/a.woff2?v=2':b'font bytes',
        }
        requested=[]
        def urlopen(request,timeout):
            url=request.full_url;requested.append(url)
            return SimpleNamespace(read=lambda:bodies.get(url,b''),close=lambda:None,url=url,status=200 if url in bodies else 404,headers={})
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);out=root/'evidence/web'
            with patch.object(capture,'ROOT',root),patch.object(capture,'OUT',out),patch.object(capture,'PAGES',['/']),patch.object(capture,'REUSE',{}),patch.object(capture.urllib.request,'urlopen',side_effect=urlopen),patch('sys.argv',['capture.py']):
                capture.main()
            self.assertTrue(set(bodies).issubset(requested),set(bodies)-set(requested))
            self.assertNotIn('https://pump.fun/style.css',requested)
            self.assertNotIn('https://pump.fun/_next/static/chunks/app.js',requested)
            records=json.loads((out/'manifest.json').read_text())['records']
            self.assertTrue(set(bodies).issubset({record['url'] for record in records}))


if __name__=='__main__':unittest.main()
