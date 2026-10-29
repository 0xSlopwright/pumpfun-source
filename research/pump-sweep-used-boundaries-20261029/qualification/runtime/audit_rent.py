"""Decode retained actual System CPI amounts and recipient balances; no new VM run."""
from pathlib import Path
import base64
import gzip
import hashlib
import json
import struct
import sys
from solders.transaction import Transaction

P = Path(__file__).resolve().parent
REPO = Path('/workspace/pump-binary-sweep-proposal')
sys.path.insert(0, str(REPO / 'scripts'))
import pump_fee_sweep_differential as suite


def vec(value):
    assert isinstance(value, list) and isinstance(value[0], list)
    length = 0
    for i, byte in enumerate(value[0]):
        length |= (byte & 127) << (7 * i)
    assert length == len(value) - 1
    return value[1:]


def main():
    raw = (P / 'baseline-rent-v2/outcomes.json.gz').read_bytes()
    report = json.loads(gzip.decompress(raw))
    results = []
    for row in report['suites']['fee_sweeps']:
        item = {'name': row['name'], 'case_sha256': row['case_sha256'], 'images': {}}
        for which in ['original', 'candidate']:
            outcome = row[which]
            tx = Transaction.from_bytes(base64.b64decode(outcome['transaction_base64']))
            definition = next(i for i in suite.PIDL['instructions'] if i['name'] == row['case']['op'])
            position = next(n for n, a in enumerate(definition['accounts']) if a['name'] == 'recipient')
            recipient = str(tx.message.account_keys[tx.message.instructions[1].accounts[position]])
            transfers = []
            for group in outcome['metadata']['inner_instructions']:
                for inner in group:
                    instruction = inner['instruction']
                    program = str(tx.message.account_keys[instruction['programIdIndex']])
                    data = bytes(vec(instruction['data']))
                    if program == '11111111111111111111111111111111' and len(data) == 12 and struct.unpack_from('<I', data)[0] == 2:
                        accounts = vec(instruction['accounts'])
                        transfers.append({
                            'from': str(tx.message.account_keys[accounts[0]]),
                            'to': str(tx.message.account_keys[accounts[1]]),
                            'lamports': struct.unpack_from('<Q', data, 4)[0],
                            'instruction_data_hex': data.hex(),
                        })
            before, after = outcome['before'][recipient], outcome['after'][recipient]
            item['images'][which] = {
                'error': outcome['error'], 'recipient': recipient,
                'recipient_lamports_before': before['lamports'] if before else 0,
                'recipient_lamports_after': after['lamports'] if after else 0,
                'system_transfer_cpis': transfers,
            }
        assert item['images']['original'] == item['images']['candidate']
        results.append(item)
    witness = next(x['images']['original'] for x in results if x['name'] == 'creator-rent-1')
    assert witness['system_transfer_cpis'][0]['lamports'] == 890880
    assert witness['recipient_lamports_before'] == 1 and witness['recipient_lamports_after'] == 903226
    output = {
        'scope': 'Fresh actual original/canonical rent observations, not a proposed-image result',
        'raw_report_sha256': hashlib.sha256(raw).hexdigest(),
        'original_sha256': report['original_sha256'], 'canonical_sha256': report['candidate_sha256'],
        'minimum_balance_0': 890880, 'cases': results,
        'conclusion': 'At recipient 1 lamport, original System Transfer is 890880 (full minimum), not 890879 (delta); original recipient ends 903226 after 12345 sweep. Canonical matches. No behavior correction claimed for the new overlay.',
    }
    (P / 'RENT-WITNESS.json').write_text(json.dumps(output, indent=2) + '\n')
    for item in results:
        print(item['name'], item['images']['original'])


if __name__ == '__main__':
    main()
