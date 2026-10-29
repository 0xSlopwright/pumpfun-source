"""Read the observed Rust cleanup and its named LLVM lowering; never execute ELF."""
import hashlib
import re


def require(value, message):
    if not value:
        raise ValueError(message)


def blocks(text, pattern):
    labels = list(re.finditer(pattern, text, re.M))
    return [(m[1], text[m.start():labels[i + 1].start() if i + 1 < len(labels) else len(text)])
            for i, m in enumerate(labels)]


def analyze(mir, trace):
    require(mir.startswith('// MIR for `cashback` after runtime-optimized'), 'final Rust MIR identity')
    mb = dict(blocks(mir, r'^    (bb\d+): \{'))
    require('let mut _52: bool;' in mir, 'condition temporary type')
    require("_52 = anchor_lang::prelude::AccountInfo::<'_>::data_is_empty(_20) -> [return: bb13, unwind unreachable];" in mir,
            'condition producer')
    require('_125 = anchor_lang::prelude::AccountInfo::' in mb['bb37'] and
            '::try_borrow_data(_20) -> [return: bb42, unwind unreachable];' in mb['bb37'], 'borrow call')
    require('_288 = discriminant(_125);' in mb['bb42'] and
            'switchInt(move _288) -> [0: bb121, 1: bb120, otherwise: bb1];' in mb['bb42'], 'borrow switch')
    require('((_125 as Ok).0:' in mb['bb121'] and '((_125 as Err).0:' in mb['bb120'], 'real Ok/Err payloads')
    cleanup = [line.strip() for line in mb['bb85'].splitlines()[1:] if line.strip()]
    require(cleanup == ['StorageDead(_52);', 'goto -> bb86;', '}'], 'condition cleanup forwarding block')
    headers = list(re.finditer(rb'^(?:; |# )?\*\*\* IR Dump [^\r\n]+', trace, re.M))
    require(len(headers) == 392, 'named trace snapshot census')
    boundary = {}
    for index, key, phase in [(16, 'before', 'Before'), (17, 'after', 'After')]:
        begin, end = headers[index].start(), headers[index + 1].start()
        data = trace[begin:end]
        text = data.decode()
        require(phase + ' SimplifyCFGPass' in text.splitlines()[0], 'boundary pass')
        lb = blocks(text, r'^([\w.$-]+):[^\r\n]*')
        lookup = dict(lb)
        j = next(i for i, (name, _) in enumerate(lb) if name == 'bb37')
        borrow = lookup['bb37']
        require(len(re.findall(r'call void @_ZN19solana_account_info11AccountInfo15try_borrow_data', text)) == 1,
                'LLVM borrow call census')
        require('try_borrow_data' in borrow and 'icmp eq i64' in borrow and '-9223372036854775782' in borrow,
                'LLVM borrow sentinel')
        if key == 'before':
            require(lb[j + 1][0] == 'bb85' and lb[j + 2][0] == 'bb121', 'intervening named cleanup')
            require([line.strip() for line in lookup['bb85'].splitlines()[1:] if line.strip()] == ['br label %bb86'],
                    'empty lowered cleanup')
            require('i64 0, label %bb121' in borrow and 'i64 1, label %bb120' in borrow, 'named switch successors')
        else:
            require('bb85' not in lookup and lb[j + 1][0] == 'bb121', 'cleanup removed and success adjacent')
            require(re.search(r'br i1 %\S+, label %bb121, label %bb120', borrow), 'simplified branch successors')
        boundary[key] = dict(index=index, header=text.splitlines()[0], offset=begin, end=end,
                             sha256=hashlib.sha256(data).hexdigest(), borrow_block=borrow,
                             following_block=lb[j + 1][1])
    return dict(mir_sha256=hashlib.sha256(mir.encode()).hexdigest(), named_trace_sha256=hashlib.sha256(trace).hexdigest(),
                condition_local='_52', condition_type='bool', condition_operation='AccountInfo::data_is_empty(_20)',
                rust_cleanup=mb['bb85'], rust_borrow=mb['bb37'], rust_switch=mb['bb42'],
                boundary=boundary, limits='These observations describe the current reconstruction. They do not identify original source or explain a historical compiler configuration.')


def compare_sections(reader, before, after):
    class MemoryFile:
        def __init__(self, data): self.data = data
        def read_bytes(self): return self.data
    a, b = reader.Elf(MemoryFile(before)), reader.Elf(MemoryFile(after))
    require(set(a.secs) == set(b.secs), 'section census')
    rows = []
    for name in sorted(a.secs):
        x, y = a.secs[name], b.secs[name]
        old, new = before[x[4]:x[4] + x[5]], after[y[4]:y[4] + y[5]]
        rows.append(dict(section=name, before_bytes=len(old), after_bytes=len(new), equal=old == new,
                         before_sha256=hashlib.sha256(old).hexdigest(), after_sha256=hashlib.sha256(new).hexdigest()))
    require({r['section'] for r in rows if not r['equal']} == {'.symtab', '.strtab'}, 'only symbol sections differ')
    f, g = [next(f for f in elf.funcs if 'sell8cashback' in f['name']) for elf in (a, b)]
    require(f['size'] == g['size'] == 9024 and f['start'] == g['start'], 'sell layout')
    require(before[f['start']:f['start'] + f['size']] == after[g['start']:g['start'] + g['size']], 'raw sell equality')
    require(before != after, 'named output is not whole-file identical')
    return dict(sections=rows, sell_start=f['start'], sell_bytes=9024, raw_sell_equal=True,
                whole_ELF_equal=False, file_bytes=[len(before), len(after)])
