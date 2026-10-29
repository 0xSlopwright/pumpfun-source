"""Read linked object bodies and direct-call boundaries; no target execution."""
from pathlib import Path
import hashlib, json, sys

W = Path(__file__).resolve().parent
R = W / 'inputs'
sys.path.insert(0, str(R / 'repro/pump_amm/claim-self-transfer-v144/static-tool'))
from elf_reader import Elf

base = Elf(W / 'artifacts/base-symbols.so')
candidate = Elf(W / 'build/artifacts/unstripped.so')
original = Elf(R / 'evidence/original/pump_amm/deployed.so')


def function(e, token):
    matches = [f for f in e.funcs if token in f['name']]
    assert len(matches) == 1, (token, matches)
    return matches[0]


def describe(e):
    body = function(e, '10legacy_buy7execute17')
    targets = {label: function(e, token) for label, token in [
        ('available', '24available_quote_reserves17'),
        ('effective', '24effective_quote_reserves17'),
        ('can_boost', '9can_boost17'),
        ('fees', '16select_and_apply17'),
    ]}
    calls = e.callsites(body['start'], body['size'])
    selected = {label: [call for call in calls if call['target'] == f['start']]
                for label, f in targets.items()}
    return {'body': body, 'call_count': len(calls), 'selected_calls': selected,
            'callee_functions': targets,
            'wrappers': {label: function(e, token) for label, token in [
                ('buy', '__global3buy17'),
                ('exact', '__global18buy_exact_quote_in17'),
            ]}}


before, after = describe(base), describe(candidate)
assert not before['selected_calls']['available'] and not before['selected_calls']['effective']
assert len(after['selected_calls']['available']) == len(after['selected_calls']['effective']) == 1
assert after['selected_calls']['available'][0]['offset'] < after['selected_calls']['effective'][0]['offset'] < after['selected_calls']['fees'][0]['offset']
assert len(after['selected_calls']['can_boost']) == 1
for start, length, available, effective, boost in [
    (0x376b0, 9936, 0x190, 0x1e0, 0x1de0),
    (0x3a5a0, 12936, 0xa28, 0xa78, 0x2988),
]:
    calls = {row['offset']: row['target'] for row in original.callsites(start, length)}
    assert calls[available] == 0x6bcd0 and calls[effective] == 0x6c328
    assert calls[boost] == 0x6c248
report = {'scope': __doc__,
          'candidate_sha256': hashlib.sha256((W / 'build/artifacts/pump_amm_recovered.so').read_bytes()).hexdigest(),
          'base': before, 'candidate': after,
          'original_handlers': [
              {'start': '0x376b0', 'bytes': 9936, 'available_call_offset': '0x190',
               'effective_call_offset': '0x1e0', 'can_boost_call_offset': '0x1de0'},
              {'start': '0x3a5a0', 'bytes': 12936, 'available_call_offset': '0xa28',
               'effective_call_offset': '0xa78', 'can_boost_call_offset': '0x2988'},
          ],
          'body_size_reduction': before['body']['size'] - after['body']['size'],
          'limits': ['The shared runtime-bool handler is still distinct from both original specialized handlers.',
                     'The resize region was deliberately retained; its separate original call boundary remains open.',
                     'No padding, new inline attribute, or const-specialization retry was used.']}
assert report == json.loads((W / 'handler-comparison.json').read_text())
if __name__ == '__main__':
    print(json.dumps(report, indent=2))
