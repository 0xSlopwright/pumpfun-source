import importlib.util,pathlib,sys,unittest
spec=importlib.util.spec_from_file_location('reference_voids',pathlib.Path(__file__).resolve().parents[1]/'scripts/extract-reference-pages.py')
extractor=importlib.util.module_from_spec(spec);sys.modules[spec.name]=extractor;spec.loader.exec_module(extractor)
class VoidElements(unittest.TestCase):
    def test_void_nodes_do_not_capture_following_siblings(self):
        for tag in ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']:
            parser=extractor.TreeParser();parser.feed(f'<div><{tag}><span>following</span></div>')
            div=parser.root.children[0]
            self.assertEqual([node.tag for node in div.children],[tag,'span'],tag)
            self.assertEqual(div.children[0].children,[],tag)
            self.assertEqual(extractor.text_content(div.children[1]),'following')
