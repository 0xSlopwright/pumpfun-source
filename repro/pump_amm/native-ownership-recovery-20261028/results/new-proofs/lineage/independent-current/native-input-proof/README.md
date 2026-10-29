# Independent native input and cache binding

The ea14 candidate's native fee method is tied to its newly compiled local source. The actual codegen object extracted from the added rlib, the linked candidate method and the original 368-byte method are instruction-identical after normalizing the two actual call addresses. Both runtime callees are raw-identical.

The native-only priming command compiled one local package from its recorded relative source path. Its verbose Rust command, dep-info file and dependency-free Cargo fingerprint are retained. It added two identical rlib copies and one rmeta file. All 762 prior dependency artifact hashes remained identical. The subsequent whole-contract build and strict repeat both used exactly those 765 artifacts without changing or adding any, and produced byte-identical stripped and unstripped candidates.

The compilation records bind 232 inputs: 57 current workspace files and 175 unchanged registry files. The source tree includes the native crate explicitly. The earlier `prebuild-review.json` is a nine-component preparatory snapshot; the final source and build records supersede it and include the tenth value-copy component. The old and new lock files retain the same registry graph, with one local native package and its single pump dependency edge added.

The package name and physical crate layout are a reconstruction choice. These checks establish how the current artifact was built and its primitive's code identity, not the original project's historical package structure or whole-binary equality. This packet does not rerun the compiler or a VM.

Run `python -I -B verify.py`. The separate full-checkpoint independent packet audits the complete original-window census, typed dependency closure and fresh signed runtime observations.
