"""Sealed whole-function census and selected claim-v2 instruction paths.

The path checks below are deliberately local. They bind actual call targets,
account/amount operands and error edges; they do not establish complete call,
pointed-to-data, indirect-call or whole-handler equivalence.
"""
import ast
from collections import Counter, deque
import gzip
import hashlib
import json
from pathlib import Path
import struct

PACKET = Path(__file__).resolve().parent
ROOT = PACKET.parents[1]
LEGACY = ROOT / 'research/pump-v3-buy-cost-overflow'
ORIGINAL = '7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
PINS = {
    'tools/pump_compare_function_bytes.py': '43fa359dce1e398f820df445d534e0912ac5f181f1ea15e13a5267b53105b075',
    'tools/pump_quote_control_function_match.py': '28ad656012f8fbcd41ed1726e9345ee76f6249992bf28c91c4b9202479d3e94e',
    'tools/sealed-parent-verify.py': 'ade67312a8fff6f1d6347de402c09c6e76a51349b4cc2d5b2bb9fa488098b5d0',
    'sources/parent-inventory.json.gz': '1c65a75b6c47d12af6aee1ef94a89752c834987ae4e1ce633759295f363581af',
}
sha = lambda value: hashlib.sha256(value).hexdigest()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def read(path):
    value = Path(path).read_bytes()
    return gzip.decompress(value) if value[:2] == b'\x1f\x8b' else value


def public(row):
    return {key: value for key, value in row.items() if key != 'operands'}


class Image:
    def __init__(self, blob, functions, api):
        self.blob, self.api = blob, api
        self.sections = api['sections'](blob)
        self.functions, self.names, self.at = {}, {}, {}
        for start, size, name in functions:
            self.names.setdefault((start, size), set()).add(name)
        # Aliases consume one physical (start,size) capacity.
        for (start, size), names in sorted(self.names.items()):
            raw = self.body(start, size)
            norm, operands = api['normalize'](raw, start, self.sections)
            row = dict(start=start, bytes=size, raw_sha256=sha(raw),
                       normalized_sha256=sha(norm), operands=operands)
            self.functions[start, size] = row
            self.at.setdefault(start, []).append(row)
        self.syscalls = {}
        relocation, symbols, strings = (self.sections[name] for name in ('.rel.dyn', '.dynsym', '.dynstr'))
        for address, info in struct.iter_unpack('<QQ', blob[relocation['offset']:relocation['offset']+relocation['size']]):
            if info & 0xffffffff != 10:  # R_BPF_64_32 imports
                continue
            symbol = info >> 32
            require((symbol+1)*24 <= symbols['size'], 'syscall symbol exceeds table')
            name = struct.unpack_from('<I', blob, symbols['offset']+symbol*24)[0]
            require(name < strings['size'], 'syscall name exceeds string table')
            start = strings['offset']+name
            end = blob.find(b'\0', start, strings['offset']+strings['size'])
            require(end >= start, 'unterminated syscall name')
            self.syscalls[address] = dict(name=blob[start:end].decode('ascii'), symbol=symbol)

    def body(self, start, size):
        return self.api['body'](self.blob, self.sections, start, size)

    def target(self, address):
        rows = self.at.get(address, [])
        require(len(rows) == 1, 'call must enter one complete physical function')
        return rows[0]

    def named(self, fragment):
        spans = {span for span, names in self.names.items()
                 if any(fragment in name for name in names)}
        require(len(spans) == 1, 'symbol must select one physical function: ' + fragment)
        return self.functions[next(iter(spans))]

    def signature(self, address):
        row = self.target(address)
        return row['bytes'], row['normalized_sha256']


class Code:
    def __init__(self, image, row):
        self.image, self.row = image, row
        self.raw = image.body(row['start'], row['bytes'])
        self.instructions = {}
        offset = 0
        while offset < len(self.raw):
            opcode, registers, displacement, immediate = struct.unpack_from('<BBhi', self.raw, offset)
            item = dict(offset=offset, opcode=opcode, dst=registers & 15,
                        src=registers >> 4, displacement=displacement, immediate=immediate)
            step = 16 if opcode == 0x18 else 8
            require(offset + step <= len(self.raw), 'truncated instruction')
            if step == 16:
                item['wide'] = struct.unpack_from('<I', self.raw, offset+4)[0] | struct.unpack_from('<I', self.raw, offset+12)[0] << 32
            item['next'] = offset + step
            self.instructions[offset] = item
            offset += step
        for item in self.instructions.values():
            opcode, following = item['opcode'], item['next']
            if opcode == 0x95:
                successors = []
            elif opcode == 0x05:
                successors = [item['offset'] + 8 + item['displacement'] * 8]
            elif opcode & 7 == 5 and opcode not in (0x85, 0x8d):
                successors = [item['offset'] + 8 + item['displacement'] * 8, following]
            else:
                successors = [following] if following < len(self.raw) else []
            require(all(n in self.instructions for n in successors), 'branch target is not an instruction boundary')
            item['successors'] = successors

    def accounts_origins(self):
        """Must-analysis for the Context.accounts pointer at selected uses.

        This narrow domain follows the selected account pointer tags through register
        copies and direct compiler-frame spills. Calls clobber r0..r5 and
        preserve r6..r9 under the sBPF calling convention. It does not infer
        heap aliases or complete callee memory effects. Only an actual
        imported `abort` is treated as non-returning.
        """
        context_register = self.check(0, opcode=0xbf, src=2)['dst']
        prologue = [self.check(0, opcode=0xbf, dst=context_register, src=2),
                    self.check(16, opcode=0x79, src=context_register, displacement=8)]
        states, pending, aborts = {0: {('r', 2): 'context'}}, deque([0]), []
        while pending:
            offset = pending.popleft()
            item = self.instructions[offset]
            facts = dict(states[offset])
            op, dst, src, displacement = (item[k] for k in ('opcode', 'dst', 'src', 'displacement'))
            if op == 0xbf:
                value = facts.get(('r', src))
            elif op == 0x79:
                base = facts.get(('r', src))
                value = facts.get(('s', displacement)) if src == 10 else (
                    'accounts' if base == 'context' and displacement == 8 else
                    {0x18: 'associated-vault-info', 0x38: 'uva-info'}.get(displacement) if base == 'accounts' else None)
            elif op == 0x07 and facts.get(('r', dst)) == 'accounts':
                value = {0xa8: 'user-info', 0x40: 'uva-data'}.get(item['immediate'])
            else:
                value = None
            if op == 0x18 or op & 7 in (1, 4, 7):
                facts.pop(('r', dst), None)
                if value is not None:
                    facts['r', dst] = value
            if op & 7 in (2, 3) and dst == 10:
                width = {0: 4, 8: 2, 16: 1, 24: 8}[op & 24]
                for key in list(facts):
                    if key[0] == 's' and displacement < key[1]+8 and key[1] < displacement+width:
                        del facts[key]
                if op == 0x7b and ('r', src) in facts:
                    facts['s', displacement] = facts['r', src]
            if op in (0x85, 0x8d):
                for register in range(6):
                    facts.pop(('r', register), None)
            successors = item['successors']
            imported = self.image.syscalls.get(self.row['start']+offset)
            if imported and imported['name'] == 'abort':
                self.check(offset, opcode=0x85, src=1, immediate=-1)
                successors = []
                witness = dict(offset=offset, **imported)
                if witness not in aborts:
                    aborts.append(witness)
            for following in successors:
                merged = facts if following not in states else {
                    key: value for key, value in states[following].items() if facts.get(key) == value}
                if following not in states or merged != states[following]:
                    states[following] = dict(merged)
                    pending.append(following)
        return states, dict(context_argument=2, prologue=prologue,
                            nonreturning_imports=sorted(aborts, key=lambda row: row['offset']))

    def check(self, offset, **fields):
        item = self.instructions.get(offset)
        require(item is not None and all(item.get(k) == value for k, value in fields.items()),
                'instruction operands differ at ' + hex(offset))
        return dict(item)

    def call(self, offset):
        item = self.check(offset, opcode=0x85, src=1)
        require(item['immediate'] != -1, 'unresolved syscall is not a direct callee')
        target = self.row['start'] + offset + 8 + item['immediate'] * 8
        return dict(offset=offset, target=target, body=public(self.image.target(target)))

    def path(self, start, end):
        # Find an intraprocedural path with no intervening calls. Calls are
        # represented by their fallthrough; abort/recursive semantics are not inferred.
        queue, previous = deque([start]), {start: None}
        while queue:
            node = queue.popleft()
            if node == end:
                result = []
                while node is not None:
                    result.append(node)
                    node = previous[node]
                return list(reversed(result))
            if self.instructions[node]['opcode'] in (0x85, 0x8d):
                continue
            for following in self.instructions[node]['successors']:
                if following not in previous:
                    previous[following] = node
                    queue.append(following)
        raise ValueError('selected call-free path does not exist')

    def first_calls(self, start):
        queue, seen, result = deque([start]), set(), set()
        while queue:
            node = queue.popleft()
            if node in seen:
                continue
            seen.add(node)
            item = self.instructions[node]
            if item['opcode'] in (0x85, 0x8d):
                result.add(node)
            else:
                queue.extend(item['successors'])
        return result


def proposal_sites(c, original, roles):
    """Locate selected sites by actual callees and local instruction shapes.

    This is not an alternate function matcher: the complete-function census
    still uses every register and branch operand under the sealed normalizer.
    """
    occurrences = {}
    for role, reference in roles.items():
        signature = original.signature(reference)
        occurrences[role] = [op['offset'] for op in c.row['operands']
                             if op['kind'] == 'direct-call' and c.image.signature(op['target']) == signature]
    unique = lambda xs, why: only(xs, why)
    result = dict(token_empty=unique(occurrences['data_is_empty'], 'empty-check call'))
    empty = result['token_empty']
    branches = [c.instructions[offset] for offset in (empty+8, empty+16, empty+24)
                if offset in c.instructions and c.instructions[offset]['opcode'] == 0x55]
    branch = unique([item for item in branches if item['dst'] == 0 and item['src'] == 0 and item['immediate'] == 0], 'empty-check branch')
    result['empty_branch'] = branch['offset']
    result['token_borrow'] = unique(c.first_calls(branch['next']) & set(occurrences['borrow_data']), 'nonempty vault borrow')
    result['token_decode'] = unique(c.first_calls(result['token_borrow']+8) & set(occurrences['token_decode']), 'successful vault decoder')
    for name, role in [('native_rent', 'rent_get'), ('native_data_len', 'data_len'), ('native_minimum', 'rent_minimum')]:
        result[name] = unique(occurrences[role], name)
    balances, credits = [], []
    for offset in occurrences['lamports']:
        a, b = c.instructions.get(offset+8), c.instructions.get(offset+16)
        if a and b and a['opcode'] == 0xbf and a['src'] == 0 and b['opcode'] == 0x1f and b['dst'] == a['dst']:
            balances.append(offset)
        d = c.instructions.get(offset+24)
        if a and b and d and a['opcode'] == 0xbf and a['src'] == 0 and b['opcode'] == 0x79 and b['src'] == 10 and d['opcode'] == 0x0f and d['dst'] == a['dst'] and d['src'] == b['dst']:
            credits.append(offset)
    result['native_balance'] = unique(balances, 'native saturating-sub balance getter')
    result['credit_balance'] = unique(credits, 'native checked-add credit getter')
    gate = c.check(result['credit_balance']+64, opcode=0x55, src=0, immediate=0)
    result['overflow_block'] = gate['successors'][0]
    result['credit_borrow'] = unique(c.first_calls(gate['next']) & set(occurrences['borrow_mut_lamports']), 'credit mutable borrow')
    failure = c.check(result['credit_borrow']+56, opcode=0x05)
    result['borrow_error_block'] = failure['successors'][0]
    result['credit_overflow'] = unique(c.first_calls(result['overflow_block']) & set(occurrences['program_error']), 'checked-add error conversion')
    result['credit_borrow_error'] = unique(c.first_calls(result['borrow_error_block']) & set(occurrences['program_error']), 'mutable-borrow error conversion')
    result['record'] = unique(occurrences['record'], 'cashback recording boundary')
    return result


def only(values, description):
    values = list(values)
    require(len(values) == 1, 'expected one ' + description)
    return values[0]


def analyze(packet=PACKET):
    require(__debug__, 'Run without Python -O')
    for name, digest in PINS.items():
        require(sha((LEGACY/name).read_bytes()) == digest, 'sealed comparison input differs: '+name)
    api = {'struct': struct}
    for name, names in [
        ('pump_compare_function_bytes.py', {'normalize', 'body'}),
        ('pump_quote_control_function_match.py', {'sections'}),
        ('sealed-parent-verify.py', {'elf_functions'}),
    ]:
        path = LEGACY / 'tools' / name
        tree = ast.parse(path.read_bytes())
        nodes = [node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name in names]
        require({node.name for node in nodes} == names, 'sealed parser functions missing')
        exec(compile(ast.Module(body=nodes, type_ignores=[]), str(path), 'exec'), api)
    blobs = dict(original=(ROOT/'evidence/original/pump/deployed.so').read_bytes(),
                 parent=read(packet/'artifacts/parent-unstripped.so.gz'),
                 proposal=read(packet/'artifacts/proposal-unstripped.so.gz'))
    require(sha(blobs['original']) == ORIGINAL, 'original image differs')
    section_bindings = {}
    for key in ('parent', 'proposal'):
        stripped = read(packet/f'artifacts/{key}-candidate.so.gz')
        sections = [api['sections'](value) for value in (blobs[key], stripped)]
        records = {}
        for name in ('.text', '.rodata', '.data.rel.ro', '.rel.dyn', '.dynsym', '.dynstr'):
            left, right = (section[name] for section in sections)
            require((left['addr'], left['size']) == (right['addr'], right['size']), key+': symbol/stripped section layout differs')
            payloads = [value[section['offset']:section['offset']+section['size']]
                        for value, section in zip((blobs[key], stripped), (left, right))]
            require(payloads[0] == payloads[1], key+': measured/tested section bytes differ')
            records[name] = dict(address=left['addr'], bytes=left['size'], sha256=sha(payloads[0]))
        section_bindings[key] = dict(stripped_sha256=sha(stripped), symbols_sha256=sha(blobs[key]), sections=records)
    inventory = json.loads(read(LEGACY/'sources/parent-inventory.json.gz'))['windows']
    require(len(inventory) == len({row['start'] for row in inventory}) == 1035, 'sealed original window inventory differs')
    images = {key: Image(blob, [(r['start'], r['bytes'], 'original-window') for r in inventory]
                        if key == 'original' else api['elf_functions'](blob), api)
              for key, blob in blobs.items()}
    for row in inventory:
        actual = images['original'].functions[row['start'], row['bytes']]
        require(actual['raw_sha256'] == row['raw_sha256'], 'sealed original body differs')
    capacities = {}
    for kind in ('raw', 'normalized'):
        counters = {key: Counter((size, row[kind+'_sha256']) for (start, size), row in image.functions.items())
                    for key, image in images.items()}
        parent, proposal = (counters['original'] & counters[key] for key in ('parent', 'proposal'))
        capacities[kind] = dict(parent=sum(parent.values()), proposal=sum(proposal.values()),
                                lost=sum((parent-proposal).values()), gained=sum((proposal-parent).values()))
        require(capacities[kind]['lost'] == 0, 'whole-function capacity regression')
    targets = dict(original=images['original'].functions[0x77940, 8832])
    targets.update({key: image.named('cashback8claim_v2') for key, image in images.items() if key != 'original'})
    code = {key: Code(images[key], row) for key, row in targets.items()}

    # A real entry-point edge, not a disconnected named-symbol lookalike.
    wrapper_original = images['original'].functions[0x12f150, 1168]
    wrapper_signature = wrapper_original['bytes'], wrapper_original['normalized_sha256']
    wrappers = {}
    for key, image in images.items():
        matches = [row for row in image.functions.values()
                   if (row['bytes'], row['normalized_sha256']) == wrapper_signature]
        matches = [row for row in matches if Code(image, row).call(0x1b8)['target'] == targets[key]['start']]
        require(len(matches) == 1, 'actual entry wrapper does not uniquely reach selected helper')
        wrappers[key] = dict(wrapper=public(matches[0]), call=Code(image, matches[0]).call(0x1b8))

    # The maintained account representation is independently anchored to the
    # original parser and all its immediate callees. This is one level only.
    parser_original = images['original'].functions[0xf9ba8, 5992]
    parser_signature = parser_original['bytes'], parser_original['normalized_sha256']
    parser_bindings = {}
    parser_code = Code(images['original'], parser_original)
    parser_calls = {op['offset']: parser_code.call(op['offset']) for op in parser_original['operands']
                    if op['kind'] == 'direct-call'}
    require(len(parser_calls) == 45, 'original parser immediate-call count differs')
    for key, image in images.items():
        if key == 'original':
            parser = parser_original
        else:
            parser = image.named('ClaimCashbackV2$u20$as$u20$anchor_lang..Accounts')
        require((parser['bytes'], parser['normalized_sha256']) == parser_signature, 'account parser body differs')
        parser_bindings[key] = dict(parser=public(parser), calls=[])
        for offset, reference in parser_calls.items():
            actual = Code(image, parser).call(offset)
            require((actual['body']['bytes'], actual['body']['normalized_sha256']) ==
                    (reference['body']['bytes'], reference['body']['normalized_sha256']), 'actual parser callee differs')
            parser_bindings[key]['calls'].append(actual)

    roles = dict(data_is_empty=0x1a2b38, borrow_data=0x1a2ca8, token_decode=0x185ed0,
                 rent_get=0x1a0a20, data_len=0x1a2a68, rent_minimum=0x1a0ae8,
                 lamports=0x1a29f0, borrow_mut_lamports=0x1a2c30, program_error=0x19bbb8,
                 record=0x7bec0)
    sites = dict(token_empty=('data_is_empty', 0x568),
                 token_borrow=('borrow_data', 0x598),
                 token_decode=('token_decode', 0x618),
                 native_rent=('rent_get', 0x678),
                 native_data_len=('data_len', 0xcc0),
                 native_minimum=('rent_minimum', 0xce0),
                 native_balance=('lamports', 0xd80),
                 credit_balance=('lamports', 0x14c0),
                 credit_borrow=('borrow_mut_lamports', 0x1520),
                 credit_overflow=('program_error', 0x15c8),
                 credit_borrow_error=('program_error', 0x1628),
                 record=('record', 0x16b8))
    derived = proposal_sites(code['proposal'], images['original'], roles)
    selected = {}
    for name, (role, original_offset) in sites.items():
        proposal_offset = derived[name]
        original_call, proposal_call = code['original'].call(original_offset), code['proposal'].call(proposal_offset)
        reference = images['original'].signature(roles[role])
        require(images['original'].signature(original_call['target']) == reference ==
                images['proposal'].signature(proposal_call['target']), name + ': actual callee body differs')
        selected[name] = dict(role=role, original=original_call, proposal=proposal_call)

    paths = {}
    operands = {}
    for key, empty_branch, balance, credit, borrow, overflow, borrow_error in [
        ('original', 0x578, 0xd80, 0x14c0, 0x1520, 0x1590, 0x15f0),
        ('proposal', derived['empty_branch'], derived['native_balance'], derived['credit_balance'],
         derived['credit_borrow'], derived['overflow_block'], derived['borrow_error_block']),
    ]:
        c = code[key]
        offsets = {name: row[key]['offset'] for name, row in selected.items()}
        origins, origin_proof = c.accounts_origins()
        def origin(offset, register, expected):
            require(origins.get(offset, {}).get(('r', register)) == expected,
                    'selected account pointer origin differs at '+hex(offset)+' r'+str(register))
            return dict(offset=offset, register=register, origin=expected)
        empty = c.check(empty_branch, opcode=0x55, dst=0, src=0, immediate=0)
        nonempty, zero = empty['next'], empty['successors'][0]
        # Both calls use the actual associated-vault field (+0x18).
        input_empty = c.check(offsets['token_empty']-8, opcode=0x79, dst=1, displacement=0x18)
        account_register = input_empty['src']
        base_empty = origin(offsets['token_empty']-8, account_register, 'accounts')
        c.check(nonempty, opcode=0x79, dst=2, src=account_register, displacement=0x18)
        base_borrow = origin(nonempty, account_register, 'accounts')
        actual_inputs = [origin(offsets['token_empty'], 1, 'associated-vault-info'),
                         origin(offsets['token_borrow'], 2, 'associated-vault-info')]
        paths[key] = dict(nonempty_to_borrow=c.path(nonempty, offsets['token_borrow']),
                          borrow_success_to_decode=c.path(offsets['token_borrow']+8, offsets['token_decode']))
        # The empty edge skips decoding and enters the real no-claim log block.
        literal = c.check(zero, opcode=0x18, dst=1, src=0, displacement=0)
        section = c.image.sections['.rodata']
        index = literal['wide'] - section['addr'] + section['offset']
        require(section['addr'] <= literal['wide'] < section['addr'] + section['size'] and
                c.image.blob[index:index+20] == b'No cashback to claim', 'empty branch no-claim literal differs')
        c.check(zero+16, opcode=0xb7, dst=2, immediate=20)
        c.check(zero+24, opcode=0x85, src=1, immediate=-1)
        for first, second in [('native_rent', 'native_data_len'), ('native_data_len', 'native_minimum'),
                              ('native_minimum', 'native_balance')]:
            paths[key][first+'_to_'+second] = c.path(offsets[first]+8, offsets[second])
        # The native balance getter receives the UVA's original AccountInfo
        # pointer directly. It is not passed an owned cloned temporary.
        direct_balance = c.check(balance-8, opcode=0x79, dst=1, displacement=0x38)
        base_balance = origin(balance-8, direct_balance['src'], 'accounts')
        actual_inputs.append(origin(balance, 1, 'uva-info'))
        # Bind the amount arithmetic, overflow edge and mutable-borrow result.
        amount_slot = c.check(credit+16, opcode=0x79, dst=1, src=10)['displacement']
        if key == 'original':
            # The original caches the embedded user AccountInfo at entry;
            # this is +0xa8, not the UVA at +0x38/+0x40.
            user_input = [c.check(0x40, opcode=0xbf, dst=1, src=7),
                          c.check(0x48, opcode=0x07, dst=1, immediate=0xa8),
                          c.check(0x50, opcode=0x7b, dst=10, src=1, displacement=-0x4c0),
                          c.check(credit-16, opcode=0x79, dst=1, src=10, displacement=-0x4c0),
                          c.check(borrow-8, opcode=0x79, dst=2, src=10, displacement=-0x4c0)]
        else:
            user_input = [c.check(credit-24, opcode=0xbf, dst=9, src=7),
                          c.check(credit-16, opcode=0x07, dst=9, immediate=0xa8),
                          c.check(credit-8, opcode=0xbf, dst=1, src=9),
                          c.check(borrow-8, opcode=0xbf, dst=2, src=9)]
        actual_inputs.extend([origin(credit, 1, 'user-info'), origin(borrow, 2, 'user-info'),
                              origin(offsets['record'], 2, 'uva-data')])
        # The callee writes its three-word Result through r1. All three
        # post-call loads must read the same buffer, including the RefCell
        # lease pointer later used for release.
        result_buffer = c.check(borrow-16, opcode=0x07, dst=1, src=0)['immediate']
        borrow_result = [c.check(borrow-24, opcode=0xbf, dst=1, src=10),
                         c.check(borrow-16, opcode=0x07, dst=1, src=0, immediate=result_buffer),
                         c.check(borrow+8, opcode=0x79, dst=1, src=10, displacement=result_buffer+16),
                         c.check(borrow+16, opcode=0x79, dst=2, src=10, displacement=result_buffer+8),
                         c.check(borrow+24, opcode=0x79, dst=3, src=10, displacement=result_buffer)]
        arithmetic = [c.check(credit+8, opcode=0xbf, dst=6, src=0),
                      c.check(credit+16, opcode=0x79, dst=1, src=10, displacement=amount_slot),
                      c.check(credit+24, opcode=0x0f, dst=6, src=1),
                      c.check(credit+32, opcode=0xb7, dst=1, immediate=1),
                      c.check(credit+40, opcode=0xad, dst=6, src=0, displacement=1),
                      c.check(credit+48, opcode=0xb7, dst=1, immediate=0),
                      c.check(credit+56, opcode=0x57, dst=1, immediate=1)]
        gate = c.check(credit+64, opcode=0x55, dst=1, src=0, immediate=0)
        require(gate['successors'][0] == overflow, 'checked-add overflow edge differs')
        c.check(overflow, opcode=0x18, dst=1, src=0, displacement=0, wide=0x8000000000000017)
        paths[key]['credit_success_to_borrow'] = c.path(gate['next'], borrow)
        paths[key]['credit_overflow_conversion'] = c.path(overflow, offsets['credit_overflow'])
        niche = c.check(borrow+32, opcode=0x18, dst=4, src=0, displacement=0, wide=0x800000000000001a)
        result_gate = c.check(borrow+48, opcode=0x1d, dst=3, src=4, displacement=1)
        failure = c.check(borrow+56, opcode=0x05)
        require(failure['successors'] == [borrow_error], 'mutable-borrow error edge differs')
        paths[key]['credit_borrow_error_conversion'] = c.path(borrow_error, offsets['credit_borrow_error'])
        store = [c.check(borrow+64, opcode=0x79, dst=2, src=2, displacement=0),
                 c.check(borrow+72, opcode=0x7b, dst=2, src=6, displacement=0),
                 c.check(borrow+80, opcode=0x79, dst=2, src=1, displacement=0),
                 c.check(borrow+88, opcode=0x07, dst=2, immediate=1),
                 c.check(borrow+96, opcode=0x7b, dst=1, src=2, displacement=0)]
        paths[key]['credit_store_to_record'] = c.path(borrow+104, offsets['record'])
        # The credited amount and the recorded amount are the same stack value.
        amount_register = 8 if key == 'original' else 6
        amount_load = offsets['record']-16 if key == 'original' else offsets['record']-64
        amount_record = [c.check(amount_load, opcode=0x79, dst=amount_register, src=10, displacement=amount_slot),
                         c.check(offsets['record']-8, opcode=0xbf, dst=3, src=amount_register)]
        conversion_buffer = -0x2d0 if key == 'original' else -0x280
        require(result_buffer == conversion_buffer, 'borrow Result/error buffer differs')
        borrow_error_values = [c.check(borrow_error, opcode=0x7b, dst=10, src=1, displacement=conversion_buffer+16),
                               c.check(borrow_error+8, opcode=0x7b, dst=10, src=2, displacement=conversion_buffer+8),
                               c.check(borrow_error+16, opcode=0x7b, dst=10, src=3, displacement=conversion_buffer),
                               c.check(offsets['credit_borrow_error']-8, opcode=0x07, dst=2, immediate=conversion_buffer)]
        overflow_value = [c.check(overflow+16, opcode=0x7b, dst=10, src=1, displacement=conversion_buffer),
                          c.check(offsets['credit_overflow']-8, opcode=0x07, dst=2, immediate=conversion_buffer)]
        conversion_outputs = {}
        for name in ('credit_overflow', 'credit_borrow_error'):
            call = offsets[name]
            output = c.check(call-24, opcode=0x07, dst=1, src=0)['immediate']
            conversion_outputs[name] = [
                c.check(call-32, opcode=0xbf, dst=1, src=10),
                c.check(call-24, opcode=0x07, dst=1, src=0, immediate=output),
                c.check(call-16, opcode=0xbf, dst=2, src=10),
                c.check(call-8, opcode=0x07, dst=2, src=0, immediate=conversion_buffer),
                c.check(call+8, opcode=0x79, dst=0 if key == 'original' else 9, src=10, displacement=output+8),
                c.check(call+16, opcode=0x79, dst=2 if key == 'original' else 6, src=10, displacement=output)]
        operands[key] = dict(associated_vault_input=input_empty, empty_branch=empty, empty_log_literal=literal,
                             direct_native_balance=direct_balance, amount_slot=amount_slot,
                             account_origin_proof=dict(**origin_proof, selected_bases=[base_empty, base_borrow, base_balance],
                                                       actual_call_inputs=actual_inputs),
                             user_account_input=user_input, recorded_amount=amount_record,
                             checked_add=arithmetic, overflow_branch=gate, borrow_niche=niche,
                             borrow_result_branch=result_gate, borrow_error_jump=failure,
                             store_and_release=store, borrow_result_buffer=borrow_result,
                             borrow_error_values=borrow_error_values,
                             arithmetic_error_value=overflow_value, conversion_result_buffers=conversion_outputs)

    # This capacity table is diagnostic only; the specific new edges above
    # are separately bound to actual calls, operands and local CFG paths.
    call_counters = {}
    for key, row in targets.items():
        call_counters[key] = Counter(images[key].signature(op['target'])
                                     for op in row['operands'] if op['kind'] == 'direct-call')
    call_capacity = {}
    for key in ('parent', 'proposal'):
        original, candidate = call_counters['original'], call_counters[key]
        call_capacity[key] = dict(original=sum(original.values()), candidate=sum(candidate.values()),
                                  matched=sum((original & candidate).values()),
                                  missing=sum((original-candidate).values()), extra=sum((candidate-original).values()))
    require(call_capacity['parent'] == dict(original=68, candidate=62, matched=60, missing=8, extra=2), 'parent call capacities differ')
    require(call_capacity['proposal'] == dict(original=68, candidate=66, matched=65, missing=3, extra=1), 'proposal call capacities differ')
    require(call_counters['original']-call_counters['proposal'] == Counter({
        images['original'].signature(0x10c78): 2, images['original'].signature(0xa938): 1}),
        'recipient-owner Clone/ToString residual differs')
    require(call_counters['proposal']-call_counters['original'] == Counter({
        images['original'].signature(0x15de88): 1}), 'extra Display residual differs')
    restored = {}
    for role in ('data_is_empty', 'lamports', 'borrow_mut_lamports', 'program_error'):
        signature = images['original'].signature(roles[role])
        restored[role] = {key: calls[signature] for key, calls in call_counters.items()}
    require(sum(row['proposal']-row['parent'] for row in restored.values()) == 5, 'five restored actual boundaries required')
    unresolved = []
    for signature, count in (call_counters['original']-call_counters['proposal']).items():
        starts = sorted(start for (start, size), row in images['original'].functions.items()
                        if (size, row['normalized_sha256']) == signature)
        unresolved.append(dict(bytes=signature[0], normalized_sha256=signature[1], count=count, original_targets=starts))
    return dict(scope=__doc__, original_windows=1035, input_sha256={key: sha(value) for key, value in blobs.items()},
                measured_to_tested_section_bindings=section_bindings,
                injective_capacities=capacities, bodies={key: public(value) for key, value in targets.items()},
                actual_entry_wrappers=wrappers, account_parser_immediate_calls=parser_bindings,
                selected_calls=selected, local_paths=paths, operand_checks=operands,
                direct_call_capacity_diagnostic=call_capacity, restored_call_roles=restored,
                unresolved_original_call_capacity=unresolved, whole_helper_equal=False, whole_elf_equal=False,
                limitations='Selected exact normalized callee bodies and local instruction paths only. Recipient-owner validation retains two inlined Clone and one ToString/Display boundary differences. No complete pointed-to-data, recursive/indirect-call, handler or whole-file equivalence is established.')


if __name__ == '__main__':
    print(json.dumps(analyze(), indent=2))
