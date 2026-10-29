# Cargo sparse-index binding

The archived cache helper accepts a crate file only when its SHA-256 equals
the lockfile checksum, then copies a sparse index chosen independently. The
sort prefers any `1949cf8` index. A checksum match that lives only in the
other namespace is therefore published with the wrong index bytes.

For `cache-probe` 1.0.0, the verified archive is
`checksum-matched archive` under `index.crates.io-6f17d22bba15001f`. The
archived helper still writes `INDEX-FROM-OTHER-NAMESPACE` into both output
namespaces. This successor copies the index stored beside the matching
archive, and keeps the 1949 preference only when that namespace's own archive
matches.

```
python3 research/cargo-cache-index-binding/test_prepare.py
```

The root script is unchanged and remains the pinned helper. This directory is
the reviewed entry point. It does not download crates, rewrite checksums, or
claim a historical build.
