# Independent optional-argument and V2 Context review

Frozen candidate: `97bd5553c199cd24fb2d07034c365527bee5b138bf5dd7a0aa3099186aad2643`; symbols: `0142baeed4ee183435f763fb0d6124fa746196722700f3511c3d2b8375813dca`.

Independent recount: **651/785 normalized windows, 148 raw windows, 816,800 matched text bytes**. Compared with bundled `0881a95d…`, the four gains are CreatePool's 3,064-byte wrapper at `0xe31a0` and the three 1,064-byte V2 wrappers at `0xe8ae8`, `0xe8f10`, `0xe9338`. There are no normalized or raw losses.

The four wrappers have 25 matching actual immediate target bodies and four unequal business-handler targets. The CreatePool handler remains 10,240 versus 11,104 bytes; the V2 buy, exact-quote and sell handlers remain 5,840/5,440, 7,112/6,368 and 5,904/6,792 respectively. Wrapper recovery is not recursive recovery of those business functions.

The new-operand check verifies all four instruction log strings, six complete text descriptors and two 40-byte formatter pointers. The V2 wrappers now pass the full 40-byte Context; tracked original/current handler reads are accounts at offset 8 and the event-authority bump at offset 33. The previously regressed preview is restored to its 296-byte original body, with the internal total-user-quote method restored to the 600-byte scalar-argument form. The latter is an ABI/shape check, not a claim that its remaining source-origin stores match.

The same source/dependency gate verifies 227 compiled inputs: 51 canonical inputs become 52 workspace inputs without Rust transformation, plus 175 archived registry files. Nine authenticated package archives contain 166 source files and nine Cargo metadata files. The actual `a5565b…` builder, SDK/compiler hashes, logical/physical target mapping and all 762 unchanged dependency artifacts are bound to this exact build record. Seven source/mapping negatives and two target-mount negatives are retained.

The recomputed bounded static relation still contains 587 windows. Sixteen old vtable/code-pointer cross-pairings retain actual matching alternatives. These are bounded schema and call checks, not complete indirect dispatch, complete original allocation extent or whole-ELF identity.

Run `python -B verify.py --root REPOSITORY`; Python API is `verify(root)`. Candidate, symbols, exact baseline, source, canonical source, dependencies and verifier code are bundled. The repository supplies the preserved original ELF and public reader hash. `test_portable.py --root REPOSITORY` runs the same gate from a temporary directory outside the checkout. This packet performs no build or runtime execution; the root checkpoint owns the strict repeat and behavioral acceptance.
