"""Parse saved compiler dumps without compiling or executing the target."""
import hashlib
import re

HEADER = re.compile(rb'^(?:; |# )?\*\*\* IR Dump [^\r\n]+', re.M)
BLOCK = re.compile(r'^(?:\d+B)?[ \t]*bb\.(\d+)[^\r\n]*:', re.M)
SENTINEL = '-9223372036854775782'


def require(value, message):
    if not value:
        raise ValueError(message)


def machine_blocks(text):
    headers = list(BLOCK.finditer(text))
    end = text.index('# End machine code')
    return {int(m[1]): text[m.start():headers[i + 1].start() if i + 1 < len(headers) else end]
            for i, m in enumerate(headers)}


def analyze(raw):
    headers = list(HEADER.finditer(raw))
    snapshots = []
    machine = []
    for i, m in enumerate(headers):
        end = headers[i + 1].start() if i + 1 < len(headers) else len(raw)
        body = raw[m.start():end]
        row = dict(index=i, header=m[0].decode(), offset=m.start(), end=end,
                   bytes=len(body), sha256=hashlib.sha256(body).hexdigest())
        text = body.decode()
        if '# Machine code for function' in text:
            blocks = machine_blocks(text)
            borrow = [b for b in blocks.values() if 'try_borrow_data' in b]
            require(len(borrow) == 1, f'borrow block census at snapshot {i}')
            branch = [line.strip() for line in borrow[0].splitlines() if 'JNE_rr' in line or 'JEQ_rr' in line]
            require(len(branch) == 1 and 'JNE_rr' in branch[0] and SENTINEL in borrow[0],
                    f'borrow predicate at snapshot {i}')
            row.update(block_count=len(blocks), borrow_branch=branch[0])
            machine.append((row, blocks, borrow[0]))
        snapshots.append(row)
    require(len(snapshots) == 392 and len(machine) == 116, 'complete snapshot census')
    first, blocks, borrow = machine[0]
    require(first['index'] == 276 and '(finalize-isel)' in first['header'] and 'Before' in first['header'],
            'first captured machine stage')
    require('%bb.26' in borrow and 'JMP %bb.25' in borrow, 'first branch successors')
    require('%ir-block.232' in blocks[25] and '%ir-block.236' in blocks[26], 'successor IR identities')
    require('From$LT$solana_program_error..ProgramError' in blocks[26], 'error successor conversion')
    preceding = snapshots[first['index'] - 1]
    ir = raw[preceding['offset']:preceding['end']].decode()
    start = ir.rindex('\n225:', 0, ir.index('try_borrow_data'))
    finish = ir.index('\n232:', start)
    ir_borrow = ir[start:finish]
    require('(verify)' in preceding['header'] and 'After' in preceding['header'], 'last captured IR stage')
    require('%227 = icmp eq i64 %226, ' + SENTINEL in ir_borrow and
            'br i1 %227, label %232, label %236' in ir_borrow, 'IR equality and successors')
    selected = []
    for row, bs, bb in machine:
        if '(branch-folder)' in row['header'] or '(block-placement)' in row['header']:
            tail = [v for v in bs.values() if '%ir-block.541' in v.splitlines()[0]]
            require(len(tail) == 1, 'tail block census')
            selected.append(dict(**row, borrow_block=bb, tail_block=tail[0],
                                 block62=bs.get(62), block_order=list(bs)))
    require([r['block_count'] for r in selected] == [87, 85, 84, 82], 'late phase block counts')
    require('$r6 = LDD_V1 $r10, -1304' in selected[0]['tail_block'], 'pre-folder inline reload')
    require(all('$r6 = LDD_V1 $r10, -1304' not in r['tail_block'] for r in selected[1:]),
            'folder removes reload from final block')
    require('JMP %bb.62' in selected[-1]['tail_block'] and
            '$r6 = LDD_V1 $r10, -1304' in selected[-1]['block62'], 'placed shared reload')
    return dict(raw_bytes=len(raw), raw_sha256=hashlib.sha256(raw).hexdigest(),
                snapshot_count=len(snapshots), machine_snapshot_count=len(machine),
                last_ir=dict(**preceding, borrow_block=ir_borrow),
                first_machine=dict(**first, borrow_block=borrow,
                                   equality_successor=blocks[25], inequality_successor=blocks[26]),
                late_stages=selected, snapshots=snapshots)
