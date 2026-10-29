"""Read captured UTF-8 dispatch evidence independently of the host locale."""
import argparse
import hashlib
import json
from pathlib import Path
import sys
import types

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'scripts/recover_dispatch.py'
SOURCE_SHA256 = {'54149f2a1eba81f0f576e71d232c6c9b91d237cd26fb6832484d81174b070192',
                 'c3e338c221f527a01cc5c59a6fcbf69ba753c19415699811c27a523178cdfe74'}


def corrected_module():
    raw = SOURCE.read_bytes()
    if hashlib.sha256(raw).hexdigest() not in SOURCE_SHA256:
        raise ValueError('The reviewed dispatch-recovery source has changed')
    source = raw.decode().replace('\r\n', '\n')
    for before, after in [('idl.read_text()', "idl.read_text(encoding='utf-8')"),
                          ("(ROOT/'evidence/binary-analysis.json').read_text()", "(ROOT/'evidence/binary-analysis.json').read_text(encoding='utf-8')")]:
        if source.count(before) != 1:
            raise ValueError('Reviewed dispatch encoding patch no longer applies')
        source = source.replace(before, after, 1)
    sys.path.insert(0, str(ROOT / 'scripts'))
    module = types.ModuleType('reviewed_utf8_dispatch')
    module.__file__ = str(SOURCE)
    exec(compile(source, str(SOURCE), 'exec'), module.__dict__)
    return module


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--program', choices=('pump', 'pump_amm', 'pump_fees', 'mayhem'))
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    module = corrected_module()
    programs = [args.program] if args.program else json.loads((ROOT / 'repro/programs.json').read_text(encoding='utf-8'))
    result = {program: module.recover(program) for program in programs}
    with args.output.open('x', encoding='utf-8', newline='\n') as output:
        json.dump(result, output, indent=2)
        output.write('\n')
