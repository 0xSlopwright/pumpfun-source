from pathlib import Path
import json,hashlib
def verify(root):
 w=Path(root);j=json.loads((w/'measurement.json').read_text());assert j['raw']==159 and j['raw_gains']==j['raw_losses']==[]
 return {'passed':True,'raw_gained_windows':0,'raw_lost_windows':0,'raw_windows':159,'candidate_sha256':hashlib.sha256((w/'build/artifacts/pump_amm_recovered.so').read_bytes()).hexdigest(),'scope':'Full independent original/current/baseline raw byte comparisons run in audit.measure; no raw changes from H14.'}
