"""Prepare eight ordinary-account V3 buy sync inputs; no VM is constructed."""
from pathlib import Path
import copy, hashlib, json

R = Path(__file__).resolve().parents[2]
W = Path(__file__).resolve().parent
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
v2_path = R / 'work/parallel-main-v2-positive-sync-fixtures/PLAN01.json'
v2 = json.loads(v2_path.read_text())
source = R / 'work/parallel-main-integration/round47-source/programs/pump'
identity_path = R / 'work/parallel-main-r47-composition/IDENTITY-RESULT01.json'
identity = json.loads(identity_path.read_text())
assert identity['candidate_sha256'] == 'e7ee643acaa7039dc65fb7ee5dd93e121ec33b0ca4f34b0457a41fbb4a74b764'

cases = []
for old in v2['cases']:
    if old['operation'] == 'sell_v2':
        continue
    c = copy.deepcopy(old)
    c['name'] = c['name'].replace('_v2-', '_v3-')
    c['operation'] = c['operation'].replace('_v2', '_v3')
    c['instruction_trailing_bytes'] = [0]
    c['curve_quote_mint'] = '11111111111111111111111111111111' if c['quote_kind'] == 'native' else c['quote_mint']
    amount = c['instruction_input'] if c['operation'] == 'buy_v3' else c['virtual_token_reserves'] * (c['instruction_input'] - 1) // (c['virtual_quote_reserves'] + c['instruction_input'] - 1)
    quote = amount * c['virtual_quote_reserves'] // (c['virtual_token_reserves'] - amount) + 1 if c['operation'] == 'buy_v3' else c['instruction_input']
    vt = c['virtual_token_reserves'] - amount
    rq = c['real_quote_reserves'] + quote
    denominator = 2 * c['token_total_supply'] - (c['base_vault_amount'] - amount) - (c['base_user_amount'] + amount)
    plain = c['virtual_quote_reserves'] + quote
    synced = (denominator + vt) * rq // denominator
    assert amount == c['expected_token_amount']
    assert quote == c['expected_trade_quote']
    assert denominator == c['expected_sync_denominator'] == 10**15
    assert c['expected_post_base_vault_amount'] == c['base_vault_amount'] - amount
    assert c['expected_post_base_user_amount'] == c['base_user_amount'] + amount
    assert c['expected_post_virtual_quote'] == (synced if c['expected_sync_update'] else plain)
    assert c['whitelist_user'] and not c['partial_fill'] and not c['complete']
    assert 0 < amount < c['real_token_reserves']
    assert not c['expected_sync_update'] or synced != plain
    c['expected_event_virtual_quote_reserves'] = c['expected_post_virtual_quote']
    c['expected_event_virtual_sol_reserves'] = c['expected_post_virtual_quote'] if c['quote_kind'] == 'native' else 0
    c['expected_event_real_quote_reserves'] = rq
    c['expected_quote_transfer_fee'] = 0
    cases.append(c)
assert len(cases) == 8 and sum(c['expected_sync_update'] for c in cases) == 4

inputs = [
    'scripts/pump_trade_fixture.py',
    'work/parallel-main-positive-sync-fixtures/run_cases.py',
    'work/parallel-main-positive-sync-fixtures/PLAN01.json',
    'work/parallel-main-v2-positive-sync-fixtures/PLAN01.json',
    'work/parallel-main-verification-resume/V3-BUY-RELOAD-SYNC-REVIEW01.json',
    'work/parallel-main-verification-resume/R47-COMPOSITION-REVIEW01.json',
    'work/parallel-main-r47-composition/IDENTITY-RESULT01.json',
    'work/parallel-main-integration/round47-source/programs/pump/src/trade_v3.rs',
    'work/parallel-main-integration/round47-source/programs/pump/src/trade_types.rs',
    'work/parallel-main-integration/round47-source/programs/pump/src/lib.rs',
]
plan = {
    'status': 'proposed_fixture_inputs_not_executed',
    'scope': 'Eight normal-owner main-Pump V3 buy and exact-quote inputs; source plan only pending root review. No VM or transaction is constructed.',
    'candidate_sha256': identity['candidate_sha256'],
    'original_sha256': sha(R / 'evidence/original/pump/deployed.so'),
    'base_fixture': v2['base_fixture'],
    'base_fixture_sha256': v2['base_fixture_sha256'],
    'base_step': v2['base_step'],
    'retained_curve_inputs': v2['retained_curve_inputs'],
    'retained_account_identities': v2['retained_account_identities'],
    'case_definitions': len(cases),
    'new_distinct_case_count': None,
    'cases': cases,
    'source_inputs': {name: sha(R / name) for name in inputs},
    'execution_requirements': [
        'Run only after root approval, locally against the captured original and the exact R47 mapped identity. No RPC or live-chain submission.',
        'Reuse the reviewed V3 SellV3 account builder with operation-specific buy_v3 or buy_exact_quote_in_v3 discriminator, two u64 inputs and OptionBool(false) encoded as [0].',
        'Keep all captured owners, executable flags, authorities, base mint supply and both base token balances unchanged before the transaction.',
        'Use the same ordinary curve balances and explicit reserve fields as the reviewed V2 plan. Native curve quote_mint is Pubkey::default while its quote mint account is WSOL.',
        'Set only Global.whitelist_pda to the existing signed user, documented curve reserves/mode flag, and normal curve/user lamports. Preserve all other Global bytes.',
        'Reuse the normal initialized Tokenkeg quote mint and canonical quote token account creation from the reviewed SellV3 builder, with no hook or transfer-fee extension. Keep the existing validated buyback authority.',
        'The V3 account layout has no V2 fee-recipient account. Preserve its validated buyback recipient for both mode states.',
        'Record full signed transaction bytes, signatures, Clock and all non-target account prestates and poststates on both sides. Require exact paired transaction, prestate and Clock equality.',
        'Compare errors, all non-target poststates, CPI instructions, events, return data and ordered logs; require original success and no mismatch.',
        'Verify actual post-CPI base token balances and curve reserves from the original result. Four positive cases must differ from the no-sync reserve; four mode-disabled cases must retain the no-sync value.',
        'Derive expected arithmetic from actual original outcomes; do not force expected outputs or bypass a runtime validation failure.',
        'Deduplicate transaction/prestate/Clock against retained 18,111 cases, the eight SellV3 qualification executions, all completed V2 positive cases and previous new V3 cases. No new-case count until uniqueness is proved.',
    ],
    'limits': [
        'Expected arithmetic is a static hypothesis before execution, although the same normal amounts and sync formula have passed in the reviewed SellV3/V2 family evidence.',
        'This plan does not alter source, create a VM, construct a transaction, or execute a program.',
        'The mode flag is a field of the main Pump contract; no separate Mayhem or PumpSwap program is selected or run.',
    ],
}
(W / 'PLAN01.json').write_text(json.dumps(plan, indent=2) + '\n')
manifest = {'status': 'source_plan_only', 'files': {name: sha(W / name) for name in ['prepare_plan.py', 'PLAN01.json']}}
(W / 'MANIFEST01.json').write_text(json.dumps(manifest, indent=2) + '\n')
print({'case_definitions': len(cases), 'positive_cases': 4, 'mode_disabled_controls': 4, 'plan_sha256': sha(W / 'PLAN01.json'), 'manifest_sha256': sha(W / 'MANIFEST01.json')})
