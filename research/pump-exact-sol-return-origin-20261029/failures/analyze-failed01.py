"""Recheck pinned front-end sources and one rejected control. No compilation or execution."""
from pathlib import Path
import hashlib, importlib.util, json, re, struct

D = Path(__file__).resolve().parent
W = D.parent
C = W / 'pump-exact-sol-controls'

def sha(b):
    return hashlib.sha256(b).hexdigest()

def read(p):
    return json.loads(p.read_bytes())

def inventory(p):
    return {f.relative_to(p).as_posix(): sha(f.read_bytes()) for f in sorted(p.rglob('*')) if f.is_file()}

def main():
    sources = read(D / 'compiler-sources.json')
    pins = {x['path']: x for x in read(D / 'compiler-blob-pins.json')}
    assert len(sources) == len(pins) == 3
    authenticated = []
    for x in sources:
        p = pins[x['path']]
        b = x['content'].encode()
        git_blob = hashlib.sha1(b'blob ' + str(len(b)).encode() + b'\0' + b).hexdigest()
        assert len(b) == p['size'] and git_blob == p['sha'], x['path']
        assert x['revision'] == p['revision'] == '08b7341888ab480dfaaa0698300cbbbbb2d75b53'
        assert x['repository'] == p['repository'] == 'anza-xyz/rust'
        authenticated.append({'path': x['path'], 'git_blob': git_blob, 'bytes': len(b), 'sha256': sha(b)})
    source = {x['path'].rsplit('/', 1)[-1]: x['content'].splitlines() for x in sources}
    assert source['operand.rs'][259].strip() == 'let a_llval = bx.extract_value(llval, 0);'
    assert source['operand.rs'][260].strip() == 'let b_llval = bx.extract_value(llval, 1);'
    assert source['block.rs'][1839].strip() == 'Store(dst) => bx.store_arg(ret_abi, llval, dst),'
    assert source['block.rs'][1856].strip() == 'OperandRef::from_immediate_or_packed_pair(bx, llval, ret_abi.layout)'
    assert source['abi.rs'][246].strip() == 'OperandRef::from_immediate_or_packed_pair(bx, val, self.layout).val.store(bx, dst);'

    trace_dir = C / '05-passive-stages'
    trace_bytes = (trace_dir / 'stderr.log').read_bytes()
    assert sha(trace_bytes) == read(trace_dir / 'result.json')['logs']['stderr.log']
    # The saved index uses Python universal-newline text positions, not byte offsets.
    trace = trace_bytes.decode().replace('\r\n', '\n').replace('\r', '\n')
    snapshots = read(trace_dir / 'snapshot-index.json')
    observed = []
    for x in snapshots:
        if x['kind'] != 'ir':
            continue
        s = trace[x['start']:x['end']]
        anchors = list(re.finditer(r'\bstore i32 133,', s))
        if not anchors:
            continue
        assert len(anchors) == 1
        tail = s[anchors[0].start():]
        call = re.search(r'(?m)^  (%[\w.]+) = (?:tail )?call .*with_values[^\n]+', tail)
        assert call is not None and call.start() < 1800
        result = call.group(1)
        extracts = list(re.finditer(r'(?m)^  (%[\w.]+) = extractvalue \{ i64, ptr \} ' + re.escape(result) + r', ([01])$', tail))
        assert len(extracts) == 2 and [int(m.group(2)) for m in extracts] == [0, 1]
        assert extracts[0].start() > call.end()
        observed.append({'index': x['index'], 'header': x['header'], 'result': result,
                         'extracts': [m.group(0).strip() for m in extracts],
                         'source133_through_extracts_sha256': sha(tail[:extracts[-1].end()].encode())})
    assert [x['index'] for x in observed] == list(range(51, 276))
    assert 'After InlinerPass' in observed[0]['header']

    base, control = C / '02-guard', C / '07-addressable-return'
    launch, result = read(control / 'launch.json'), read(control / 'result.json')
    assert result['returncode'] == 0 and result['source_unchanged'] and result['tools_unchanged']
    assert launch['compiler_commands'] == 1 and launch['target_executions'] == result['target_executions'] == 0
    assert inventory(control / 'source') == launch['source_inputs']
    baseline_inputs = read(base / 'launch.json')['source_inputs']
    assert inventory(base / 'source') == baseline_inputs
    assert len(baseline_inputs) == len(launch['source_inputs']) == 66
    assert [p for p in baseline_inputs if baseline_inputs[p] != launch['source_inputs'][p]] == ['programs/pump/src/buy.rs']
    change = launch['source_change']
    old = (base / 'source' / change['path']).read_bytes()
    new = (control / 'source' / change['path']).read_bytes()
    assert old.splitlines()[132] == change['old'].encode() and new.splitlines()[132] == change['new'].encode()
    assert new == old.replace(change['old'].encode(), change['new'].encode())
    for name, h in result['logs'].items():
        assert sha((control / name).read_bytes()) == h
    assert sha((control / 'symbols.so').read_bytes()) == result['symbols_sha256'] == '96279cbe6ab125ce5d4d208d04741e1a0a97c33bbd7f190cfed12a3b2690368a'
    assert not result['whole_output_equal']
    bc, cc = read(base / 'census.json'), read(control / 'census.json')
    assert bc['counts'] == cc['counts']
    assert bc['candidate_sha256'] == sha((base / 'symbols.so').read_bytes())
    assert cc['candidate_sha256'] == result['symbols_sha256']
    sets = {}
    for kind, predicate in [('normalized', lambda x: bool(x['normalized_matches'])), ('raw', lambda x: x['raw_match'])]:
        left = {x['start'] for x in bc['windows'] if predicate(x)}
        right = {x['start'] for x in cc['windows'] if predicate(x)}
        assert left == right
        sets[kind] = {'unchanged_members': len(left), 'gained': [], 'lost': []}

    spec = importlib.util.spec_from_file_location('audit', W / 'pumpfun-source/research/pump-exact-sol-guard-20261029/audit_target.py')
    audit = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(audit)
    images = []
    calls = []
    for label, path in [('baseline', base), ('control', control)]:
        e = audit.Elf(path / 'symbols.so')
        t = e.target()
        cs = [{**r, 'names': e.callee(r['target'])['stable_names']} for r in t['refs'] if r['kind'] == 'direct-call']
        calls.append(cs)
        wv = [r for r in cs if any('with_values' in n for n in r['names'])]
        assert len(wv) == 7
        # The baseline Source133 association is qualified by PR848. Preserve the
        # seventh same-callee sequence position as a correspondence, not a new
        # proof of the modified source's complete callee/data closure.
        r = wv[-1]
        after = t['raw'][r['offset'] + 8:r['offset'] + 48]
        decoded = [dict(zip(['opcode', 'registers', 'offset', 'immediate'], struct.unpack('<BBhi', after[i:i + 8]))) for i in range(0, len(after), 8)]
        images.append({'label': label, 'elf_sha256': sha(e.data), 'target_bytes': len(t['raw']),
                       'target_raw_sha256': sha(t['raw']), 'target_normalized_sha256': sha(t['norm']),
                       'direct_calls': len(cs), 'last_with_values_offset': r['offset'],
                       'after_last_with_values_hex': after.hex(), 'decoded_after': decoded})
    assert len(calls[0]) == 101 and len(calls[1]) == 102
    assert [r['names'] for r in calls[0]] == [r['names'] for r in calls[1][:-1]]
    assert any('4core6option13unwrap_failed' in n for n in calls[1][-1]['names'])
    assert calls[1][-1]['offset'] == 13264
    assert images[0]['target_bytes'] == 13224 and images[1]['target_bytes'] == 13272
    seq = images[1]['decoded_after']
    assert seq[0] == {'opcode': 0x79, 'registers': 0xa1, 'offset': -1704, 'immediate': 0}
    assert seq[2] == {'opcode': 0x15, 'registers': 1, 'offset': 649, 'immediate': 2}
    assert seq[3] == {'opcode': 0x79, 'registers': 0xa1, 'offset': -1696, 'immediate': 0}
    # The emitted enum-tag branch lands on the retained unwrap_failed tail.
    branch = images[1]['last_with_values_offset'] + 8 + 2 * 8
    assert branch + 8 + seq[2]['offset'] * 8 == 13248
    measurement = read(control / 'measurement.json')
    selected_metrics = {k: measurement['original_vs_local'][k] for k in ['left_bytes', 'right_bytes', 'normalized_equal', 'positional_different_bytes', 'positional_different_slots', 'sequence_edit_instruction_count']}
    report = {
        'authenticated_frontend_sources': authenticated,
        'compiler_fact': 'The pinned ScalarPair unpacker extracts fields 0 then 1. DirectOperand uses it; the ordinary Store route also uses it. Other ABI modes and historical deployment source/compiler are not established.',
        'stock_pass_trace': {'snapshots_with_source133': len(observed), 'observations': observed,
                            'finding': 'Tag then payload from first observed wrapper inlining (51) through final LLVM IR (275); this filtered trace does not show pre-inlining callee lowering.'},
        'source_control': {'change': change, 'actual_compiler_commands': 1, 'cumulative_pump_rustc_commands': 425,
                           'images': images, 'original_comparison': selected_metrics, 'membership': sets,
                           'extra_call': calls[1][-1],
                           'finding': 'The addressable Option control does load the tag first, but retains a tag==2 branch to unwrap_failed and grows the target by 48 bytes. It is rejected as an identity candidate. First 101 direct-call stable-name sequences agree; linked referent identity is not claimed.'},
        'limits': ['No target or VM execution, behavioral qualification, canonical artifact/count update, or reconstructed source gain.',
                   'The known Some source input does not establish that the emitted panic branch was optimized away; it is present.',
                   'Failed control bytes, source and complete logs are retained; PR848 is unchanged.'],
        'input_sha256': {str(p.relative_to(W)).replace('\\', '/'): sha(p.read_bytes()) for p in [
            Path(__file__), D/'compiler-sources.json', D/'compiler-blob-pins.json',
            trace_dir/'stderr.log', trace_dir/'snapshot-index.json', control/'launch.json', control/'result.json',
            control/'census.json', base/'census.json', control/'measurement.json', C/'addressable_return.py']},
    }
    output = (json.dumps(report, indent=2) + '\n').encode()
    (D / 'analysis.json').write_bytes(output)
    print(json.dumps({'analysis_sha256': sha(output), 'authenticated_blobs': len(authenticated),
                      'tag_first_extract_snapshots': len(observed), 'membership': sets,
                      'control_target_bytes': 13272, 'extra_call': calls[1][-1], 'target_executions': 0}, indent=2))

if __name__ == '__main__':
    main()
