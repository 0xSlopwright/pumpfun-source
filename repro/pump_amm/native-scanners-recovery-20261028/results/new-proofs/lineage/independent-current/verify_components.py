from pathlib import Path
import hashlib,json,shutil,subprocess,tempfile
def H(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def inventory(p):return {str(x.relative_to(p)):H(x)for x in p.rglob('*')if x.is_file()}
def verify(root):
 w=Path(root);comp=json.loads((w/'composition.json').read_text());assert comp['base_sources']==inventory(w/'baseline-source')and comp['selected_sources']==inventory(w/'source')
 old,new=comp['base_sources'],comp['selected_sources'];changed=sorted(n for n in old if old[n]!=new[n]);assert changed==sorted(comp['changed_files'])and set(old)==set(new)
 native='crates/native-transfer-fee/src/lib.rs';token='programs/pump-amm/src/utils/token.rs';fee='programs/pump-amm/src/utils/transfer_fee.rs'
 with tempfile.TemporaryDirectory()as tmp:
  variants=[]
  for i in range(2):
   tree=Path(tmp)/str(i);shutil.copytree(w/'baseline-source',tree);patch=w/f'component-{i}.patch';assert H(patch)==comp['component_patches'][i]['sha256']
   r=subprocess.run(['patch','--batch','-p1','-i',str(patch)],cwd=tree,capture_output=True,text=True);assert r.returncode==0,r.stderr;variants.append(tree)
  d,p=variants;before=(w/'baseline-source'/native).read_bytes();decoder=(d/native).read_bytes();scanner=(p/native).read_bytes();assert decoder.startswith(before)and scanner.startswith(before)
  # Joining the two appended items removes exactly one redundant blank separator.
  suffix=scanner[len(before):];assert suffix.startswith(b'\npub fn supported_mint_data')
  assert(w/'source'/native).read_bytes()==before+decoder[len(before):]+suffix[1:]
  assert(w/'source'/fee).read_bytes()==(d/fee).read_bytes()and(w/'source'/token).read_bytes()==(p/token).read_bytes()
  whole=Path(tmp)/'aggregate';shutil.copytree(w/'baseline-source',whole);r=subprocess.run(['patch','--batch','-p1','-i',str(w/'recovery.patch')],cwd=whole,capture_output=True,text=True);assert r.returncode==0 and inventory(whole)==new
 assert b'pub fn supported_mint_data(data: &[u8], allow_extensions: bool) -> bool' in(w/'source'/native).read_bytes()
 return {'passed':True,'changed_files':changed,'independent_component_patches':2,'native_prior_prefix_bytes':len(before),'one_redundant_separator_newline_removed':True,'bool_api_preserved':True,'original_historical_crate_identity_proven':False}
