def check_body(o, c, s, rows):
    bytarget = {x['start']: {q['start'] for q in x['matches']} for x in rows}
    out = []
    for name, a, n, want_size in [('deposit', 195384, 7128, 7128), ('withdraw', 206672, 7200, 7176)]:
        fs = [f for f in s.funcs if '9liquidity' + str(len(name)) + name + str(len(name)) + name + '17h' in f['name']]
        assert len(fs) == 1
        f = fs[0]
        b = f['start']
        assert f['size'] == want_size
        oc = o.callsites(a, n)
        cc = c.callsites(b, f['size'])
        assert len(oc) == len(cc) == (55 if name == 'deposit' else 56)
        bound = []
        unbound = []
        cm = {v['offset']: v['target'] for v in cc}
        for x, y in zip(oc, cc):
            if x['offset'] != y['offset']:
                continue
            targets = bytarget.get(x['target'], set())
            if targets:
                assert cm[x['offset']] in targets, (name, 'wrong actual callee', x)
                bound.append(x['offset'])
            else:
                unbound.append(x['offset'])
        info = {'name': name, 'original': a, 'original_bytes': n, 'candidate': f, 'original_calls': len(oc), 'candidate_calls': len(cc), 'identical_call_offsets': sum((x['offset'] in cm for x in oc)), 'fully_paired_actual_callee_offsets': bound, 'unmatched_helper_offsets_not_claimed': unbound}
        if name == 'deposit':
            assert o.pattern(a, n) == c.pattern(b, n)
            ds = [i for i in range(0, n, 8) if o.normalized[a + i:a + i + 8] != c.normalized[b + i:b + i + 8]]
            assert ds == [800, 1536, 1920, 3968, 4648, 4656], ds
            for i in ds[:4]:
                assert o.normalized[a + i:a + i + 4] == c.normalized[b + i:b + i + 4] and o.b[a + i] == 98
            assert o.normalized[a + 4648:a + 4656] == c.normalized[b + 4656:b + 4664] and o.normalized[a + 4656:a + 4664] == c.normalized[b + 4648:b + 4656]
            assert len(bound) + len(unbound) == 55
            info['remaining_instruction_differences'] = ds
            info['full_body_equal'] = False
            for i in (2808, 3224):
                assert o.normalized[a + i:a + i + 24] == c.normalized[b + i:b + i + 24]
            info['provided_token_program_comparison_offsets'] = [2808, 3224]
        out.append(info)
    return out
