# Complete bytecode pattern windows

The archived pattern analyzer stops error scanning three instruction slots early
and account scanning two slots early. It also omits a trailing store run from
its serialization flag even while reporting that run's length. These boundaries
silently discard complete instructions at the end of a valid window.

This source-hash-bound successor scans all complete slots, keeps branch target
reads inside the selected window, and includes the final store run. Four missed
conditional-error heuristic records are directly witnessed in the retained
originals: Pump `0xef40 + 120` and `0x197650 + 520`, AMM `0xd038 + 120`, and Mayhem
`0x9028 + 640`. The heuristic labels remain clues, not proven account or error
semantics.

```
python research/bytecode-pattern-window-tails/test_generate.py
python research/bytecode-pattern-window-tails/generate.py --output work/pattern-tails
python work/pattern-tails/verify.py
```

LF and CRLF forms of the exact reviewed helper are accepted; other drift fails.
Existing outputs, root scripts and historical packets are preserved. This is
static verification tooling only; it adds no accepted source, execution
coverage, binary identity or security conclusion.
