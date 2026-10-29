#!/usr/bin/env python3
"""Five saved-data boundaries; no build, producer, VM, or external process."""
if not __debug__:
    raise SystemExit('Run without -O; saved integrity assertions are required.')
import sys
sys.dont_write_bytecode=True
from pathlib import Path
import gzip,hashlib,io,json,re,shutil,struct,tarfile,tempfile,unittest
import verify_saved as v
P=Path(__file__).resolve().parent
R=P.parents[1]
def save(p,x):p.write_text(json.dumps(x,indent=2)+'\n')
def rebuild_archive(base,mp,dst):
    out=io.BytesIO()
    with tarfile.open(fileobj=out,mode='w') as t:
        for n in sorted(mp):
            raw=(base/n).read_bytes();m=tarfile.TarInfo(n);m.size=len(raw);m.mtime=0;m.mode=0o644;t.addfile(m,io.BytesIO(raw))
    dst.write_bytes(gzip.compress(out.getvalue(),mtime=0))
class SavedBoundaries(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory(prefix='pump-v3-saved-control-');self.addCleanup(self.tmp.cleanup);self.p=Path(self.tmp.name)/'packet';shutil.copytree(P,self.p)
    def test_coherent_unchanged_source_substitution(self):
        for role in ['stock','passive']:
            b=self.p/'evidence'/role;n='programs/pump/src/buy.rs';f=b/'source'/n;f.write_bytes(f.read_bytes()+b'\n// finite negative source input\n');h=v.digest(f);c=v.doc(b/'compiled66.json');c[n]=h;save(b/'compiled66.json',c);rebuild_archive(b/'source',c,b/'compiled-workspace.tar.gz')
            x=v.doc(b/'build-comparison.json')
            for key in ['source_sha256','source_after_sha256']:x[key]['work/pump-v3-final-native-trace-20261028/'+role+'/source/'+n]=h
            for key in ['primary_source_sha256','primary_source_after_sha256']:x[key]['work/pump-v3-final-native-trace-plan-20261028/source65/src/buy.rs']=h
            x['compiled66_sha256']=v.digest(b/'compiled66.json');x['compiled_workspace_archive_sha256']=v.digest(b/'compiled-workspace.tar.gz')
            for name in ['build-attempt.json','build-comparison.json']:save(b/name,x)
        with self.assertRaisesRegex(ValueError,'source65_D037_join'):v.verify_sources(self.p,R)
    def test_passive_output_receipt_consistent_but_unequal(self):
        b=self.p/'evidence/passive';f=b/'candidate.so';raw=bytearray(f.read_bytes());raw[-1]^=1;f.write_bytes(raw);x=v.doc(b/'build-comparison.json');x['comparison']['candidate_sha256']=v.digest(f);save(b/'build-comparison.json',x)
        with self.assertRaisesRegex(ValueError,'whole_outputs_equal'):v.verify_outputs(self.p)
    def test_counts_preserved_memberships_swapped(self):
        f=self.p/'evidence/stock/inventory.json.gz';x=json.loads(gzip.decompress(f.read_bytes()));a=next(z for z in x['windows'] if z['normalized_matches'] and not z['raw_match']);b=next(z for z in x['windows'] if not z['normalized_matches']);a['normalized_matches'],b['normalized_matches']=b['normalized_matches'],a['normalized_matches'];f.write_bytes(gzip.compress(json.dumps(x).encode(),mtime=0))
        with self.assertRaisesRegex(ValueError,'census_rederived'):v.verify_census(self.p,R)
    def test_actual_call_operand_to_valid_wrong_callee(self):
        e=self.p/'evidence';m=v.doc(e/'stock/measurement.json')['native_target'];f=e/'stock/unstripped.so';raw=bytearray(f.read_bytes());shoff=struct.unpack_from('<Q',raw,40)[0];width,count,names=struct.unpack_from('<HHH',raw,58);heads=[struct.unpack_from('<IIQQQQIIQQ',raw,shoff+i*width) for i in range(count)];st=heads[names]
        def name(h):
            p=st[4]+h[0];return bytes(raw[p:raw.index(0,p)]).decode()
        text=next(h for h in heads if name(h)=='.text');site=m['calls'][0]['offset'];wrong=m['calls'][1]['target'];imm=(wrong-m['start']-site-8)//8;struct.pack_into('<i',raw,text[4]+m['start']-text[3]+site+4,imm);f.write_bytes(raw)
        with self.assertRaisesRegex(ValueError,'bounded operand audit rederivation'):v.verify_operands(self.p,R)
    def test_stage_log_and_snapshot_coherently_remove_greedy_spill(self):
        e=self.p/'evidence';f=e/'passive/build.log';text=f.read_text();marks=list(re.finditer(r'^(?:; |# )?\*\*\* IR Dump[^\n]*$',text,re.M));lo,hi=marks[335].start(),marks[336].start();part=text[lo:hi];self.assertIn('%stack.19',part);f.write_text(text[:lo]+part.replace('%stack.19','%stack.29')+text[hi:]);s=e/'analysis/snapshot-335.txt';s.write_text(s.read_text().replace('%stack.19','%stack.29'))
        with self.assertRaisesRegex(ValueError,'greedy_retptr_spill_boundary'):v.verify_stages(self.p)
if __name__=='__main__':unittest.main()
