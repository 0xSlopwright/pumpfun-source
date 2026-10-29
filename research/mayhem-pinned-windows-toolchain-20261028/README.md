# Fixed native compiler route for Mayhem

Hosted preflight run 40760795183 failed before compilation: the Windows image had
the newer 14.44.35229 compiler inside directory `14.44.35207`. Its downloaded
artifact SHA-256 is `f5d885b58bc68ec49a1a323d31ce2ebc16b37fd62eec1a49c7da80cf6b8588d7`.
This successor route preserves the original 197-file completion packet and
76-file Windows proposal without modifying either seal.

The separate `rebuild-canonical-mayhem-pinned-msvc.yml` workflow uses the official
fixed Visual Studio Build Tools **17.14.40** bootstrapper. It installs the
**14.44.35228** compiler cohort into the isolated locator
`C:\Program Files (x86)\Microsoft Visual Studio\2022\MayhemPinned`. The installation,
update-channel and product-catalog arguments are all fixed explicitly; the
installer self-update flag is disabled. There is no fallback to the latest
compiler. Required installed tools are checked before the existing source builder
can run.

`inputs.json` pins the bootstrapper, fixed channel observation, catalog locators,
compiler VSIX and all **53** compiler payload member byte hashes. The actual VSIX
archive and all 53 members were verified locally; the two executable hashes equal
the independent pre-existing research pins:

| Executable | SHA-256 |
| --- | --- |
| `cl.exe` | `88c8344236a27a6e727e0a8edc49aaa2690bdc7a9464b9d18cc7abe70a9f1c0d` |
| `link.exe` | `ca11e6c45debd34bf652dfe984c5360a531a005ed78bf72852330c9c2590cf0d` |

The downloaded catalog's whole-file hash differed from its channel declaration.
Both the declared and observed values are recorded; either admitted full-file
encoding is accepted, and its cohort and exact payload identity are checked.
This does not assert an authenticated historical catalog chain. Matching
pre-existing cl/link hashes and the full native inventory remain mandatory.

The current SDK 10.0.26100.0 is reused when its required directories exist. If it
is absent, the fixed SDK component is selected during installation. The existing
preparer then inventories the entire selected MSVC and Windows Kit byte trees.
The first dispatch omits `native_inputs_sha256`, records the inventory and stops
before source compilation. A second dispatch supplies the reviewed full native
manifest hash. It reinstalls the pinned cohort on a new runner, checks that
inventory, builds a fresh host macro and target, and demands exact meaningful ELF
identity. Installed compiler files must match the independently pinned VSIX bytes.

Two artifacts retain installer/channel/catalog/payload observations and actual
Mayhem build/preflight receipts. No native installation or Windows source build
is claimed by this proposal. The original source builder and all source bytes
remain unchanged.

Microsoft documents the fixed bootstrappers in its
[release history](https://learn.microsoft.com/en-us/visualstudio/releases/2022/release-history)
and the explicit install channel/catalog arguments in its
[command-line documentation](https://learn.microsoft.com/en-us/visualstudio/install/use-command-line-parameters-to-install-visual-studio?view=vs-2022).

```sh
python3 -O -B research/mayhem-pinned-windows-toolchain-20261028/test_install.py
python3 -O -B research/mayhem-pinned-windows-toolchain-20261028/verify.py
```
