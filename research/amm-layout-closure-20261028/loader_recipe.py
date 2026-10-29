"""Explicit path-only adapters for the prior allocation/upgradeable producers."""


def adapt(source, kind):
    replacements = []
    if kind == 'allocation':
        replacements = [("W=Path(__file__).parent;R=W.parents[2];I=R/'work/amm-v2-mint-clone-combined-20261028/runtime-inputs';",
                         "W=Path(__file__).parent;I=Path(os.environ['AMM_RUNTIME_ROOT']);")]
    elif kind == 'upgradeable':
        replacements = [
            ('import sys,json,base64,struct,hashlib,argparse,re', 'import sys,json,base64,struct,hashlib,argparse,re,os'),
            ("W=Path(__file__).parent;R=W.parents[1];I=R/'work/amm-v2-mint-clone-combined-20261028/runtime-inputs';",
             "W=Path(__file__).parent;I=Path(os.environ['AMM_RUNTIME_ROOT']);")]
    elif kind == 'cache':
        replacements = [
            ('import base64,hashlib,json', 'import base64,hashlib,json,os'),
            ("W=Path(__file__).parent;R=W.parents[1];J=R/'work/amm-v2-mint-clone-combined-20261028'",
             "W=Path(__file__).parent;I=Path(os.environ['AMM_RUNTIME_ROOT'])"),
            ("(J/'build/artifacts/pump_amm_recovered.so')", "Path(os.environ['AMM_CANDIDATE'])"),
            ("(J/'runtime-inputs/evidence/dependencies/spl_token/deployed.so')", "(I/'evidence/dependencies/spl_token/deployed.so')"),
            ("(W/'cache-controls.json')", "Path(os.environ['AMM_CACHE_OUTPUT'])")]
    else:
        raise ValueError(kind)
    if kind in ['upgradeable', 'cache']:
        for filename in ['capture.json', 'program-account.bin', 'programdata-account.bin']:
            replacements.append(("(W/'capture/" + filename + "')",
                                 "(Path(os.environ['AMM_CAPTURE_ROOT'])/'" + filename + "')"))
    for before, after in replacements:
        if before not in source:
            raise RuntimeError('Prior producer path changed: ' + before)
        source = source.replace(before, after)
    return source
