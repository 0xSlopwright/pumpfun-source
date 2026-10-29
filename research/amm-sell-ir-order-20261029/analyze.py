"""Read IR successor order from the already published passive compiler capture."""
from pathlib import Path
import importlib.util
import re

PARENT = Path(__file__).resolve().parent.parent / 'amm-sell-compiler-boundary-20261029'
SENTINEL = '-9223372036854775782'


def require(value, message):
    if not value:
        raise ValueError(message)


def ir_borrow_order(text):
    calls = list(re.finditer(r'^  (?:tail )?call void @_ZN19solana_account_info11AccountInfo15try_borrow_data', text, re.M))
    require(len(calls) == 1, 'IR borrow call census')
    labels = list(re.finditer(r'^([\w.$-]+):[^\r\n]*', text, re.M))
    j = max(j for j, label in enumerate(labels) if label.start() < calls[0].start())
    label, following = labels[j], labels[j + 1]
    body = text[label.start():following.start()]
    cmp = re.search(r'(%\d+) = icmp (eq|ne) i64 [^\r\n]*, ' + SENTINEL, body)
    require(cmp is not None, 'IR borrow sentinel comparison')
    branch = re.search(r'br i1 ' + re.escape(cmp[1]) + r', label %(\d+), label %(\d+)', body)
    if branch:
        success = branch[1 if cmp[2] == 'eq' else 2]
        form = 'direct-' + cmp[2]
    else:
        select = re.search(r'(%\d+) = select i1 ' + re.escape(cmp[1]) + r', i64 (\d+), i64 (\d+)', body)
        require(select is not None, 'IR select/switch predicate')
        require('switch i64 ' + select[1] + ',' in body, 'IR switch consumes selected discriminant')
        value = select[2 if cmp[2] == 'eq' else 3]
        target = re.search(r'i64 ' + value + r', label %(\d+)', body)
        require(target is not None, 'IR select/switch successor')
        success = target[1]
        form = 'select-switch-' + cmp[2]
    return dict(borrow_block=label[1], next_block=following[1], success_block=success,
                form=form, success_is_next=(success == following[1])), body, text[following.start():labels[j + 2].start()]


def analyze(raw):
    # Parent parser is reused unchanged; verify.py authenticates its complete seal.
    spec = importlib.util.spec_from_file_location('parent_analysis', PARENT / 'analyze.py')
    parent = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(parent)
    recorded = parent.analyze(raw)
    rows = []
    boundary = {}
    for snapshot in recorded['snapshots']:
        if 'block_count' in snapshot:
            continue
        data = raw[snapshot['offset']:snapshot['end']]
        order, body, following = ir_borrow_order(data.decode())
        row = dict(**snapshot, **order)
        rows.append(row)
        if row['index'] in (16, 17):
            boundary['before' if row['index'] == 16 else 'after'] = dict(**row, borrow_body=body, following_block=following)
    require(len(rows) == 276 and [r['success_is_next'] for r in rows] == [False] * 17 + [True] * 259,
            'IR success-adjacency boundary')
    require('Before SimplifyCFGPass' in boundary['before']['header'] and 'After SimplifyCFGPass' in boundary['after']['header'],
            'IR adjacency change pass')
    require([line.strip() for line in boundary['before']['following_block'].splitlines()[1:] if line.strip()] == ['br label %313'],
            'pre-SimplifyCFG intervening forwarding block')
    return dict(raw_bytes=recorded['raw_bytes'], raw_sha256=recorded['raw_sha256'], ir_snapshots=276,
                machine_snapshots=recorded['machine_snapshot_count'], before_count=17, after_count=259,
                boundary=boundary, rows=rows)
