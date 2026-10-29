# Mayhem exact reconstruction

The 67 maintained compiler inputs reproduce all 775,416 meaningful bytes of the
captured Mayhem ELF. The ordinary stripped candidate has SHA-256
`9af9e3b1cbc9d89340af4d9d46e4c88d3dc2fc67e0090f9370047d97532ff09d`.
The separate 907,776-byte compiler output has SHA-256
`7b15bb1e5c7c9c53041322fa64d4a420906fffd96ff97a55d70d627bcb854960`.
The captured allocation has a further 1,992 zero bytes; the compiler never emits
or appends this allocation suffix.

`build_exact.py` stages live Rust, manifests, lockfiles, IDLs and vendored Anchor
files into the pinned Windows v1.54 recipe. It freshly compiles the host macro
and its dependencies, then freshly compiles the target with that exact macro.
The explicit linker script preserves target-derived section ordering and CGU
identities while allowing Cargo's archive filename digest to vary. No original
ELF is a compiler input and no output bytes are patched.

Two separate hosted Windows jobs qualify the same 67 raw inputs and actual
builder code. Their source directories contained an older, unused entrypoint;
the executed builder is the file installed here. Source mapping verifies the
compiled inputs independently of this entrypoint locator and README. The full
receipts, exact images, native inventories and source projection are retained in
`research/mayhem-canonical-promotion-20261028`.

The Windows workflow installs fixed Visual Studio Build Tools 17.14.40 and checks
all 53 selected compiler payload files. It then requires the reviewed SHA-256 of
all 8,491 MSVC and Windows Kit files before and after compilation. MSVC tools
package 14.44.35228 is installed in directory `14.44.35207`; Windows Kit version
is `10.0.26100.0`. The SDK, Linux target sysroot and all 215 registry packages
are pinned separately. The retained installer catalog has an explicit declared
digest mismatch caveat; actual compiler payload and native bytes are checked.

```powershell
python -I -B programs/mayhem/build_exact.py --repo . `
  --sdk C:\pinned\sdk --target-sysroot C:\pinned\target-sysroot\rust `
  --vendor C:\pinned\vendor `
  --msvc 'C:\Program Files (x86)\Microsoft Visual Studio\2022\MayhemPinned\VC\Tools\MSVC\14.44.35207' `
  --windows-sdk 'C:\Program Files (x86)\Windows Kits\10' `
  --output work\mayhem-canonical-new
```

The result proves a reproducible reconstruction. Historical private source
spelling, dependency composition and original host attribution remain unknown.
The compiler workflow executes no target transactions. Separate retained local
runtime tests use signed synthetic fixtures and captured dependencies; they do
not establish a security audit or live deployment.
