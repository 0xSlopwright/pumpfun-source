"""Conservative SBPF instruction CFG and callee-saved timestamp reaching definitions."""
import collections
import struct


def prove(raw, register, definition, uses, clock):
    nodes = {}
    offset = 0
    while offset < len(raw):
        op, regs, jump, immediate = struct.unpack_from('<BBhi', raw, offset)
        width = 16 if op == 0x18 else 8
        nodes[offset] = (op, regs & 15, regs >> 4, jump, immediate, width)
        offset += width
    successors, predecessors = {}, collections.defaultdict(set)
    for at, (op, dst, src, jump, immediate, width) in nodes.items():
        if op == 0x95:
            edges = []
        elif op == 0x05:
            edges = [at + 8 + jump * 8]
        elif op & 7 in [5, 6] and op not in [0x85, 0x8d]:
            edges = [at + 8, at + 8 + jump * 8]
        else:
            edges = [at + width]
        for edge in edges:
            assert edge in nodes
            predecessors[edge].add(at)
        successors[at] = edges

    def reachable_without(removed):
        seen, pending = set(), [0]
        while pending:
            at = pending.pop()
            if at == removed or at in seen:
                continue
            seen.add(at)
            pending.extend(successors[at])
        return seen

    reachable = reachable_without(None)
    incoming = {at: set() for at in reachable}
    outgoing = {at: set() for at in reachable}
    for iteration in range(200):
        changed = False
        for at in sorted(reachable):
            before = {-1} if at == 0 else set().union(*(outgoing[p] for p in predecessors[at] if p in reachable))
            op, dst, src, jump, immediate, width = nodes[at]
            writes = dst == register and (op & 7 in [1, 4, 7] or op == 0x18)
            after = {at} if writes else before
            if before != incoming[at] or after != outgoing[at]:
                incoming[at], outgoing[at], changed = before, after, True
        if not changed:
            break
    else:
        raise ValueError('Reaching definitions did not converge')
    for use in uses:
        assert nodes[use][0] == 0x7b and nodes[use][2] == register
        assert incoming[use] == {definition}
        assert use not in reachable_without(clock)
    return {'register': register, 'definition': definition, 'uses': uses,
            'Clock_dominates_all_uses': True, 'all_uses_have_one_definition': True,
            'reachable_instructions': len(reachable), 'iterations': iteration}
