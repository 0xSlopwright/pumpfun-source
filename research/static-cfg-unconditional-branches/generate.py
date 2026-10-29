"""Correct unconditional CFG edges on the accepted relative-call successor."""
import argparse
import importlib.util
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]


def corrected_module():
    source = ROOT/'research/deep-disassembly-relative-calls/generate.py'
    spec = importlib.util.spec_from_file_location('accepted_relative_calls', source)
    accepted = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(accepted)
    module = accepted.corrected_module()

    def build_cfg_edges(instructions, window_start, window_end):
        edges = []
        for instruction in instructions:
            address = instruction['offset']
            if 'branch_target' in instruction:
                conditional = instruction['opcode'] != '0x05'
                edges.append({'from':hex(address),'to':hex(instruction['branch_target']),
                              'type':'branch','conditional':conditional})
                if conditional:
                    edges.append({'from':hex(address),'to':hex(address+8),
                                  'type':'fallthrough','conditional':False})
            elif instruction['mnemonic'] == 'exit':
                edges.append({'from':hex(address),'to':'return','type':'exit','conditional':False})
        return edges

    module.build_cfg_edges = build_cfg_edges
    return module


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--program',choices=['pump','pump_amm','mayhem'],required=True)
    parser.add_argument('--output',type=Path,required=True)
    args = parser.parse_args()
    if args.output.exists():parser.error('output already exists; preserve prior evidence')
    sys.exit(corrected_module().main())
